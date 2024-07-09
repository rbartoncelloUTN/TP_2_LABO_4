import { inject, Injectable } from '@angular/core';
import { User } from '../../Interfaces/user';
export const STORAGE_KEY_SESSION = 'current-user';
import {
  DocumentReference,
  Firestore,
  collection,
  setDoc,
  doc,
} from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firestore = inject(Firestore);

  constructor() {}

  login(userData?: User) {
    if (!userData) return;
    const userDataString = JSON.stringify(userData);
    localStorage.setItem(STORAGE_KEY_SESSION, userDataString);
    const logRef = collection(this.firestore, 'log');
    const date = new Date();
    const logDoc: DocumentReference = doc(logRef, date.getTime().toString());

    return setDoc(logDoc, {
      userId: userData.dni,
      date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
      hour: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    });
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
