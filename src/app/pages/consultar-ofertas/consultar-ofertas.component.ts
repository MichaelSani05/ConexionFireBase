import { Component, OnInit } from '@angular/core';
import { ListaOfertasComponent } from '../../components/lista-ofertas-solicitudes/lista-ofertas-solicitudes.component';

@Component({
  selector: 'app-consultar-ofertas',
  standalone: true,
  imports: [ListaOfertasComponent],
  templateUrl: './consultar-ofertas.component.html',
  styleUrl: './consultar-ofertas.component.css'
})
export class ConsultarOfertasComponent implements OnInit{
  tabla: string = ''

  ngOnInit(): void {
      this.tabla = "ofertas"
  }

}
