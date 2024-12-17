import { Component, Input, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { DataService } from '../../services/datos-firebase.service';
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
  capacidadesExperiencia: any[] = [];
  uniquePoblaciones: string[] = [];
  oferta: boolean = false
  solicitud: boolean = false
  poblacion: string = ''
  @ViewChildren('poblacionOption') poblacionOption!: QueryList<ElementRef>;
  userId: any = ''
  currentUser: any

  constructor(private dataService: DataService, private saveItems: SaveItemsService, private authService: AuthService) {}

  async ngOnInit() {

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
      this.uniquePoblaciones = [...new Set(this.capacidadesExperiencia.map((item: any) => item.poblacion2))];
    } else if (this.tabla === 'solicitudes') {
      this.uniquePoblaciones = [...new Set(this.capacidadesExperiencia.map((item: any) => item.poblacion))];
    }

    if (this.tabla === 'ofertas') {
      this.oferta = true;
      this.solicitud = false;
      this.poblacion = "poblacion2"
    } else if (this.tabla === 'solicitudes') {
      this.oferta = false;
      this.solicitud = true;
      this.poblacion = "poblacion"
    }


  }

  async itemsGet(){
    if (this.userId) {
      this.items = await this.saveItems.getSavedItemDetails(this.userId, this.type);
      console.log(this.items);
      this.capacidadesExperiencia = await this.saveItems.getSavedItemDetails(this.userId, this.type);
    }
  }

  onSelect(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (!selectedValue) {
      this.dataService.getItems(this.tabla).subscribe({
        next: (data) => {
          this.capacidadesExperiencia = data;
        },
        error: (error) => {
          console.error('Error al recuperar datos', error);
        }
      });
    } else {
      this.dataService.getFilteredItems(this.tabla, this.poblacion, selectedValue).subscribe({
        next: (data) => {
          this.capacidadesExperiencia = data;
        },
        error: (error) => {
          console.error('Error al recuperar datos', error);
        }
      });
    }
    console.log(selectedValue);
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
      this.capacidadesExperiencia = [this.items];
    }
  }

  async saveItem(itemId: string, type: 'savedRequests' | 'savedOffers') {
    try {
      await this.saveItems.saveToUserProfile(this.userId, type, itemId);
      alert('Guardado con éxito.');
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }

}
