import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  CollectionReference,
} from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { User } from '../../Interfaces/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public partients: User[] = [];
  public doctors: User[] = [];
  public admis: User[] = [];
  public users!: { patients: User[]; doctors: User[]; administrators: User[] };
  constructor(private firestore: Firestore) {}

  public async getUsersByRol(key: 'patients' | 'doctors' | 'administrators') {
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
  public getUsers(
    key: 'patients' | 'doctors' | 'administrators'
  ): Promise<void> {
    let col: CollectionReference = collection(this.firestore, key);
    const observable: Observable<User[]> = collectionData(col) as Observable<
      User[]
    >;

    return new Promise((resolve, reject) => {
      observable.subscribe({
        next: (data: User[]) => {
          switch (key) {
            case 'patients':
              this.partients = data;
              break;
            case 'doctors':
              this.doctors = data;
              break;
            case 'administrators':
              this.admis = data;
              break;
          }
          this.users = {
            patients: this.partients,
            doctors: this.doctors,
            administrators: this.admis,
          };
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
