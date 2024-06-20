import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import {
  AuthService,
} from '../../services/Auth/auth.service';

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
    private authService: AuthService
  ) {}

  goTo(path: RoutesParams) {
    this.router.navigate([path]);
  }

  predefinedData = {
    email: 'test2@test.com',
    password: '123456',
  };

  onSubmit(): void {
    this.isLoading = true;
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then((res) => {
        this.loggedUser = this.users.find((user) => user.mail === this.email);

        if (!res.user.emailVerified)
          throw { code: 'El correo electronico no ha sido verificado aún' };
        if (this.loggedUser?.rol !== Roles.ADMIN) {
          if (
            this.loggedUser?.rol === Roles.PATIENT &&
            !this.loggedUser?.verificated
          )
            throw {
              code: 'El paciente no ha sido verificado por un administrador aún',
            };
          if (
            this.loggedUser?.rol === Roles.DOCTOR &&
            !this.loggedUser?.enabled
          )
            throw {
              code: 'Este especialista fue dado de baja, por favor comuniquese con un administrador.',
            };
        }
        this.router.navigate(['welcome']);
        this.authService.login(this.loggedUser);
      })
      .catch((e) => {
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
  autoCompleteAdmin(event: Event): void {
    event.preventDefault();
    this.email = 'admin@tidissajiiu.com';
    this.password = '123456';
  }
  autoCompleteEmployer(event: Event): void {
    event.preventDefault();
    this.email = 'd93y9x9c81@dygovil.com';
    this.password = '123456';
  }
  register(event: Event, isPatient: boolean = false): void {
    event.preventDefault();
    this.router.navigate(['register'], { queryParams: { isPatient } });
  }
}
