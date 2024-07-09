import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  CollectionReference,
} from '@angular/fire/firestore';
import { collection } from 'firebase/firestore';
import { User } from '../../Interfaces/user';
import { Observable } from 'rxjs';
import { Storage, getDownloadURL, listAll, ref } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public partients: User[] = [];
  public doctors: User[] = [];
  public admis: User[] = [];
  public users!: { patients: User[]; doctors: User[]; administrators: User[] };
  constructor(private firestore: Firestore, private storege: Storage) {}

  async getImages(user?: User): Promise<User> {
    const imagesRef = ref(this.storege, `users/${user?.mail}`);
    try {
      const response = await listAll(imagesRef);
      const urls = await Promise.all(
        response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return url;
        })
      );
      return {
        ...user,
        perfilImagen1: urls[0] || '',
        perfilImagen2: urls[1] || '',
      } as User;
    } catch (err) {
      console.error(err);
      return {
        ...user,
        perfilImagen1: '',
        perfilImagen2: '',
      } as User;
    }
  }

  public async getUsersByRol(key: 'patients' | 'doctors' | 'administrators') {
    let col = collection(this.firestore, key);

    const observable = collectionData(col);

    observable.subscribe(async (data) => {
      const dataUsers = data as User[];
      const users = await Promise.all(
        dataUsers.map((user) => this.getImages(user))
      );
      switch (key) {
        case 'patients':
          this.partients = users;
          break;
        case 'doctors':
          this.doctors = users;
          break;
        case 'administrators':
          this.admis = users;
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
    const col: CollectionReference = collection(this.firestore, key);
    const observable: Observable<User[]> = collectionData(col) as Observable<
      User[]
    >;

    return new Promise((resolve, reject) => {
      observable.subscribe({
        next: async (data: User[]) => {
          try {
            const users = await Promise.all(
              data.map((user) => this.getImages(user))
            );
            switch (key) {
              case 'patients':
                this.partients = users;
                break;
              case 'doctors':
                this.doctors = users;
                break;
              case 'administrators':
                this.admis = users;
                break;
            }
            this.users = {
              patients: this.partients,
              doctors: this.doctors,
              administrators: this.admis,
            };
            resolve();
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
