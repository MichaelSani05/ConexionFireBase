import { Component, OnInit, effect, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  private userService = inject(AuthService);

  user = this.userService.user;

  userExist: boolean = false;

  
  constructor(private route: ActivatedRoute, private authService: AuthService){
    effect(() => {
      this.userExist = !!this.user();
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (userProfile) => {
        if (userProfile) {
          this.userExist = true;
        } else if (!userProfile) {
          this.userExist = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
    });
  }

  logout(){
    this.authService.logout();
  }

}
