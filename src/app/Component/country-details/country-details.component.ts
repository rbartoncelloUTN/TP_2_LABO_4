import { Component, Input, OnInit } from '@angular/core';
import { CountryService } from '../../services/country/country.service';

@Component({
  selector: 'app-country-details',
  standalone: true,
  imports: [],
  templateUrl: './country-details.component.html',
  styleUrl: './country-details.component.css',
})
export class CountryDetailsComponent implements OnInit {
  @Input() name?: string = '';
  public countries?: { name: string; flag: { image: string; alt?: string } }[];
  constructor(public countryServices: CountryService) {}
  ngOnInit(): void {
    this.countryServices.getCountries().subscribe((countres) => {
      this.countries = countres;
      console.log(this.countries);
    });
  }
  getCountry():
    | { name: string; flag: { image: string; alt?: string } }
    | undefined {
    return this.countries?.find((country) => country.name === this.name);
  }
}
