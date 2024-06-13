import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountryService } from '../../services/country/country.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css'],
})
export class DriverComponent implements OnInit {
  driverForm!: FormGroup;
  public countries!: { name: string; flag: { image: string; alt?: string } }[];
  public country = '';

  constructor(
    private countryService: CountryService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.driverForm = new FormGroup({
      dni: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      edad: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(65),
      ]),
      capacidad: new FormControl('', [Validators.required, Validators.min(1)]),
      pais: new FormControl({ value: '', disabled: true }, [
        Validators.required,
      ]),
      unidadPropia: new FormControl(false, [Validators.required]),
    });
    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  handlePressCountry(country: string) {
    this.driverForm.patchValue({ pais: country });
    this.driverForm.get('pais')?.setValue(country);
    this.country = country;
  }

  onSubmit(): void {
    console.log(this.driverForm.valid);
    if (this.driverForm.valid) {
      let col = collection(this.firestore, 'drivers');
      addDoc(col, {
        dni: this.driverForm.value.dni,
        nombre: this.driverForm.value.nombre,
        edad: this.driverForm.value.edad,
        capacidad: this.driverForm.value.capacidad,
        pais: this.driverForm.value.pais || this.country,
        unidadPropia: this.driverForm.value.unidadPropia,
      });
      this.driverForm.reset();
    } else {
      console.log('Formulario no válido');
    }
  }
}
