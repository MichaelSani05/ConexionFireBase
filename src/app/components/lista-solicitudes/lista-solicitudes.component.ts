import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/datos-firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-solicitudes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-solicitudes.component.html',
  styleUrl: './lista-solicitudes.component.css'
})
export class ListaSolicitudesComponent implements OnInit{
  items: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getItems('solicitudes').subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error al recuperar datos', error);
      }
    });
  }
}
