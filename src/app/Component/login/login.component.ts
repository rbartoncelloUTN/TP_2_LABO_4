import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { RoutesParams } from '../../app.routes';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { collection } from 'firebase/firestore';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Roles, User } from '../../Interfaces/user';
import { LoaderComponent } from '../loader/loader.component';
import { AuthService } from '../../services/Auth/auth.service';
import { signOut } from 'firebase/auth';
import { ModalOptionsButtonsComponent } from '../modal-options-buttons/modal-options-buttons.component';
import { MatDialog } from '@angular/material/dialog';
import { Storage, getDownloadURL, listAll, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FormsModule,
    LoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  public users: User[] = [];
  public user: string = '';
  public countLogins: number = 0;

  email: string = '';
  password: string = '';

  loggedUser?: User;
  flagError: boolean = false;
  msjError: string = '';
  isLoading: boolean = false;

  private getUsers(key: 'doctors' | 'patients' | 'administrators'): void {
    let col = collection(this.firestore, key);

    const observable = collectionData(col);

    observable.subscribe((data) => {
      const dataUsers = data as User[];
      this.users = [...this.users, ...dataUsers];
      this.users = this.users.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.mail === item.mail)
      );
      localStorage.setItem('users', JSON.stringify(this.users));
    });
  }

  ngOnInit(): void {
    this.getUsers('doctors');
    this.getUsers('patients');
    this.getUsers('administrators');
  }

  constructor(
    private router: Router,
    public auth: Auth,
    private firestore: Firestore,
    private authService: AuthService,
    private storege: Storage
  ) {}

  goTo(path: RoutesParams) {
    this.router.navigate([path]);
  }

  predefinedData = {
    email: 'test2@test.com',
    password: '123456',
  };

  async getImages(id?: string) {
    const imagesRef = ref(this.storege, `users/${id}`);
    try {
      const response = await listAll(imagesRef);
      const urls = await Promise.all(
        response.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return url;
        })
      );
      if (this.loggedUser) {
        this.loggedUser = {
          ...this.loggedUser,
          perfilImagen1: urls[0],
          perfilImagen2: urls[1] || null,
        };
      }
      return urls; // Aquí puedes hacer algo con las URLs, como almacenarlas en una variable de estado
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  onSubmit(): void {
    this.isLoading = true;
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async (res) => {
        const currentUser = this.users.find((user) => user.mail === this.email);
        const images = await this.getImages(currentUser?.mail);

        if (currentUser)
          this.loggedUser = {
            ...currentUser,
            perfilImagen1: images[0],
            perfilImagen2: images[1] || null,
          };

        if (!res.user.emailVerified)
          throw { code: 'El correo electronico no ha sido verificado aún' };
        if (this.loggedUser?.rol !== Roles.ADMIN) {
          if (
            this.loggedUser?.rol === Roles.DOCTOR &&
            !this.loggedUser?.enabled
          )
            throw {
              code: 'Este especialista fue dado de baja, por favor comuniquese con un administrador.',
            };
          if (
            this.loggedUser?.rol === Roles.DOCTOR &&
            !this.loggedUser?.verificated
          )
            throw {
              code: 'El especialista no ha sido verificado por un administrador aún',
            };
        }
        this.router.navigate(['welcome']);
        this.authService.login(this.loggedUser);
      })
      .catch((e) => {
        signOut(this.auth);
        this.flagError = true;
        switch (e.code) {
          case 'auth/invalid-email':
            this.msjError = 'Email invalido';
            break;
          case 'auth/invalid-credential':
            this.msjError = 'Email o contraseña incorrecto';
            break;
          default:
            this.msjError = e.code;
            break;
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  autoCompleteLogin(event: Event, emial: string): void {
    event.preventDefault();
    this.email = emial;
    this.password = '123456';
    this.msjError = '';
  }
  autoCompleteDoctor(event: Event): void {
    event.preventDefault();
    this.email = 'doctor@yopmail.com';
    this.password = '123456';
  }
  autoCompleteEnfermero(event: Event): void {
    event.preventDefault();
    this.email = 'enfermero@yopmail.com';
    this.password = '123456';
  }
  autoCompleteCirujano(event: Event): void {
    event.preventDefault();
    this.email = 'cirujano@yopmail.com';
    this.password = '123456';
  }
  register(event: Event, isPatient: boolean = false): void {
    event.preventDefault();
    //this.router.navigate(['register'], { queryParams: { isPatient } });
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalOptionsButtonsComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
