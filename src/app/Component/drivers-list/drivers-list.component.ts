import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { collection } from 'firebase/firestore';
import { DriverDetailsComponent } from '../driver-details/driver-details.component';
import { CountryDetailsComponent } from '../country-details/country-details.component';

interface Driver {
  dni: string;
  nombre: string;
  edad: number;
  capacidad: number;
  pais: string;
  unidadPropia: boolean;
}

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DriverDetailsComponent,
    CountryDetailsComponent
  ],
  templateUrl: './drivers-list.component.html',
  styleUrl: './drivers-list.component.css',
})
export class DriversListComponent implements OnInit {
  public drivers!: Driver[];
  public driver!: Driver;

  constructor(private firestore: Firestore) {}

  ngOnInit(): void {
    let col = collection(this.firestore, 'drivers');

    const observable = collectionData(col);

    observable.subscribe((data) => {
      this.drivers = data as Driver[];
    });
  }

  handleOnClick(driver: Driver): void {
    console.log(driver);
    this.driver = driver;
  }
}
