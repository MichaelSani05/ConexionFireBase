import { Injectable } from '@angular/core';
import { Database, ref, get, set } from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class SaveItemsService {
  constructor(private database: Database) {}

  async saveToUserProfile(userId: string, type: 'savedRequests' | 'savedOffers', itemId: string): Promise<void> {
    const userRef = ref(this.database, `users/${userId}/${type}`);
    const snapshot = await get(userRef);

    let items: string[] = snapshot.exists() ? snapshot.val() : [];
    if (!items.includes(itemId)) {
      items.push(itemId);
      await set(userRef, items);
    }
  }

  async getSavedItems(userId: string, type: 'savedRequests' | 'savedOffers'): Promise<string[]> {
    const userRef = ref(this.database, `users/${userId}/${type}`);
    const snapshot = await get(userRef);
  
    if (snapshot.exists()) {
      const data = snapshot.val();
      return Array.isArray(data) ? data : Object.keys(data);
    }
  
    return [];
  }
  

  async getSavedItemDetails(userId: string, type: 'savedRequests' | 'savedOffers'): Promise<any[]> {
    const savedItemIds = await this.getSavedItems(userId, type);
    const table = type === 'savedRequests' ? 'solicitudes' : 'ofertas';
    const itemDetails: any[] = [];
  
    for (const id of savedItemIds) {
      const itemRef = ref(this.database, `${table}/${id}`);
      const snapshot = await get(itemRef);
      if (snapshot.exists()) {
        itemDetails.push({ id, ...snapshot.val() });
      }
    }
  
    return itemDetails;
  }

  async removeFromUserProfile(
    userId: string,
    type: 'savedRequests' | 'savedOffers',
    itemId: string
  ): Promise<void> {
    const userRef = ref(this.database, `users/${userId}/${type}`);
    const snapshot = await get(userRef);

    let items: string[] = snapshot.exists() ? snapshot.val() : [];
    items = items.filter((id) => id !== itemId);
    await set(userRef, items);
  }
}

