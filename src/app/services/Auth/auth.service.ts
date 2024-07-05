import { Injectable } from '@angular/core';
import { User } from '../../Interfaces/user';
export const STORAGE_KEY_SESSION = 'current-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  login(userData?: User) {
    if (!userData) return;
    const userDataString = JSON.stringify(userData);
    localStorage.setItem(STORAGE_KEY_SESSION, userDataString);
  }

  getUser(): User | undefined {
    const userData = localStorage.getItem(STORAGE_KEY_SESSION) || '';
    return JSON.parse(userData) as User | undefined;
  }

  getUsers(): User[] | [] {
    const userData = localStorage.getItem('users') || '';
    return JSON.parse(userData) as User[] | [];
  }
}
