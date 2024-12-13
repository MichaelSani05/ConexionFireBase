import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/datos-firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-ofertas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-ofertas-solicitudes.component.html',
  styleUrl: './lista-ofertas-solicitudes.component.css'
})
export class ListaOfertasComponent implements OnInit{
  @Input() tabla: any = ''
  items: any[] = [];
  oferta: boolean = false
  solicitud: boolean = false

  constructor(private dataService: DataService) {
    
  }

  ngOnInit() {
    this.dataService.getItems(this.tabla).subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error al recuperar datos', error);
      }
    });

    if (this.tabla == 'ofertas') {
      this.oferta = true
      this.solicitud = false
    } else if (this.tabla == 'solicitudes') {
      this.oferta = false
      this.solicitud = true
    }

  }
}
