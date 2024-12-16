import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Database, ref, set, get, update } from '@angular/fire/database';
import { Observable, from, of } from 'rxjs';
import { signal } from '@angular/core';

export interface UserProfile {
  uid?: string;
  email: string | null;
  fullName?: string;
  phoneNumber?: string;
  createdAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private database = inject(Database);

  public user = signal<UserProfile | null>(null);

  register(email: string, password: string, profile: UserProfile): Observable<any> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
        .then(async (credentials) => {
          const userProfile: UserProfile = {
            uid: credentials.user.uid,
            email: credentials.user.email,
            fullName: profile.fullName || '',
            createdAt: Date.now()
          };
  
          const userRef = ref(this.database, `users/${credentials.user.uid}`);
          await set(userRef, userProfile);
  
          this.user.set(userProfile);
          return credentials.user;
        })
    );
  }

  login(email: string, password: string): Observable<any> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
        .then(async (credentials) => {
          const userRef = ref(this.database, `users/${credentials.user.uid}`);
          const snapshot = await get(userRef);
          
          if (snapshot.exists()) {
            const userProfile = snapshot.val() as UserProfile;
            this.user.set(userProfile);
          } else {
            const newProfile: UserProfile = {
              uid: credentials.user.uid,
              email: credentials.user.email || '',
              fullName: '',
              createdAt: Date.now()
            };
            await set(userRef, newProfile);
            this.user.set(newProfile);
          }

          return credentials.user;
        })
    );
  }

  updateProfile(updates: Partial<UserProfile>): Observable<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return of(undefined);
    }

    const userRef = ref(this.database, `users/${currentUser.uid}`);
    return from(update(userRef, updates));
  }

  logout(): Observable<void> {
    this.user.set(null);
    return from(signOut(this.auth));
  }

  getCurrentUser(): Observable<UserProfile | null> {
    return new Observable(subscriber => {
      const unsubscribe = this.auth.onAuthStateChanged(
        async user => {
          if (user) {
            const userRef = ref(this.database, `users/${user.uid}`);
            const snapshot = await get(userRef);
            
            if (snapshot.exists()) {
              const currentUser = snapshot.val() as UserProfile;
              this.user.set(currentUser);
              subscriber.next(currentUser);
            } else {
              this.user.set(null);
              subscriber.next(null);
            }
          } else {
            this.user.set(null);
            subscriber.next(null);
          }
          subscriber.complete();
        },
        error => subscriber.error(error)
      );
      return { unsubscribe };
    });
  }
}