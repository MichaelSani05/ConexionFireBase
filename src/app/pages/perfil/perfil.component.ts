import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PerfilOfertasComponent } from '../../components/perfil-ofertas-solicitudes/perfil-ofertas-solicitudes.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, PerfilOfertasComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  nombreUsuario: any = ''
  correoUsuario: any = ''
  tabla: string = 'solicitudes'
  type: string = 'savedRequests'

  solicitudes: boolean = false
  ofertas: boolean = false

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

  mostrarSolicitudes(){
    this.solicitudes = true;
    this.ofertas = false;
  }

  mostrarOfertas(){
    this.solicitudes = false;
    this.ofertas = true;
  }

}
