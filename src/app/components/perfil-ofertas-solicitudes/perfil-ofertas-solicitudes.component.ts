import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveItemsService } from '../../services/solis-ofers.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-ofertas-solicitudes.component.html',
  styleUrl: './perfil-ofertas-solicitudes.component.css'
})
export class PerfilOfertasComponent implements OnInit{
  @Input() tabla: any = ''
  @Input() type: any = ''
  items?: any[] = [];
  capacidadesExperiencia?: any[] = [];
  oferta: boolean = false
  solicitud: boolean = false
  userId: any = ''
  currentUser: any

  constructor(private saveItems: SaveItemsService, private authService: AuthService) {}

  ngOnInit() {

    this.authService.getCurrentUser().subscribe({
      next: (userProfile) => {
        if (userProfile) {
          this.currentUser = userProfile;
          console.log(this.currentUser);
          this.userId = userProfile.uid;
          console.log(this.userId);
          this.itemsGet();
        }
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
      }
    });

    if (this.tabla === 'ofertas') {
      this.oferta = true;
      this.solicitud = false;
    } else if (this.tabla === 'solicitudes') {
      this.oferta = false;
      this.solicitud = true;
    }
  }

  async itemsGet(){
    if (this.userId) {
      this.items = await this.saveItems.getSavedItemDetails(this.userId, this.type);
      console.log(this.items);
      this.capacidadesExperiencia = await this.saveItems.getSavedItemDetails(this.userId, this.type);
    }
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();

    if (searchTerm != '' && this.solicitud == true && this.items) {
      this.capacidadesExperiencia = this.items.filter((solicitud) =>
        solicitud.capacidades.toLowerCase().includes(searchTerm)
      );
    } else if (searchTerm != '' && this.oferta == true && this.items) {
      this.capacidadesExperiencia = this.items.filter((solicitud) =>
        solicitud.requerimientos.toLowerCase().includes(searchTerm)
      );
    } 
    else {
      this.capacidadesExperiencia = this.items;
    }
  }

  async removeItem(itemId: string, type: 'savedRequests' | 'savedOffers') {
    try {
      await this.saveItems.removeFromUserProfile(this.userId, type, itemId);
      this.itemsGet();
      alert('Eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  }

}
