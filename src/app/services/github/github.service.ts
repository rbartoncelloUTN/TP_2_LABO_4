import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IGitHub } from '../../Interfaces/github';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  http = inject(HttpClient);

  constructor() {}

  getData() {
    return this.http.get<IGitHub>(
      'https://api.github.com/users/rbartoncelloUTN'
    );
  }
}
