import { Component, Input } from '@angular/core';

interface Driver {
  dni: string;
  nombre: string;
  edad: number | string;
  capacidad: number | string;
  pais: string;
  unidadPropia: boolean | string;
}

@Component({
  selector: 'app-driver-details',
  standalone: true,
  imports: [],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.css',
})
export class DriverDetailsComponent {
  @Input() driver: Driver = {
    dni: '',
    nombre: '',
    edad: '',
    capacidad: 'undefined',
    pais: '',
    unidadPropia: '',
  };
}
