import { Component, OnInit } from '@angular/core';
import { ListaOfertasComponent } from '../../components/lista-ofertas-solicitudes/lista-ofertas-solicitudes.component';

@Component({
  selector: 'app-consultar-solicitudes',
  standalone: true,
  imports: [ListaOfertasComponent],
  templateUrl: './consultar-solicitudes.component.html',
  styleUrl: './consultar-solicitudes.component.css'
})
export class ConsultarSolicitudesComponent implements OnInit{
  tabla: string = ''

  ngOnInit(): void {
      this.tabla = "solicitudes"
  }

}
