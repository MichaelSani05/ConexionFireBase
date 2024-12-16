import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  nombreUsuario: any = ''
  correoUsuario: any = ''

  constructor(private authService: AuthService) {}

  ngOnInit() {

    this.authService.getCurrentUser().subscribe({
      next: (userProfile) => {
        if (userProfile) {
          this.nombreUsuario = userProfile.fullName || 'Sin nombre';
          this.correoUsuario = userProfile.email || 'Sin correo';
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
    });

  }
}
