import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { Country } from './interface';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  http = inject(HttpClient);

  constructor() {}

  getCountries() {
    const response = this.http.get<Country[]>(
      'https://restcountries.com/v3.1/all'
    );

    return response.pipe(
      map((countries) =>
        countries.map((country) => {
          return {
            name: country.name.common,
            flag: {
              image: country.flags.png,
              alt: country.flags.alt,
            },
          };
        })
      )
    );
  }
}
