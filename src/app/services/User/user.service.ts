import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { Roles, User } from '../../Interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public partients: User[] = [];
  public doctors: User[] = [];
  public admis: User[] = [];
  public users!: { patients: User[]; doctors: User[]; administrators: User[] };
  constructor(private firestore: Firestore) {}

  public getUsersByRol(key: 'patients' | 'doctors' | 'administrators'): void {
    let col = collection(this.firestore, key);

    const observable = collectionData(col);

    observable.subscribe((data) => {
      const dataUsers = data as User[];
      switch (key) {
        case 'patients':
          this.partients = dataUsers;
          break;
        case 'doctors':
          this.doctors = dataUsers;
          break;
        case 'administrators':
          this.admis = dataUsers;
          break;
      }
      this.users = {
        patients: this.partients,
        doctors: this.doctors,
        administrators: this.admis,
      };
    });
  }
}
