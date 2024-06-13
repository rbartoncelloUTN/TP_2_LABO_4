import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { LoaderComponent } from '../loader/loader.component';
import { addDoc, collection } from 'firebase/firestore';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { Roles } from '../../Interfaces/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    HideComponentDirective,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  isPatient: boolean = false;
  isAdmin: boolean = false;
  flagError: boolean = false;
  msjError: string = '';
  isValid: boolean = true;
  isLoading: boolean = false;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    public auth: Auth
  ) {}

  ngOnInit(): void {
    const { isPatient, isAdmin } = this.route.snapshot.queryParams;
    this.isPatient = isPatient === 'true';
    this.isAdmin = isAdmin === 'true';
    console.log(this.isPatient);
    this.userForm = new FormGroup({
      dni: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.min(9999999),
        Validators.max(100000000),
      ]),
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      apellido: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      edad: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      obraSocial: new FormControl('', [Validators.required]),
      especialidad: new FormControl('', []),
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      perfilImagen1: new FormControl('', [Validators.required]),
      perfilImagen2: new FormControl('', [Validators.required]),
    });
  }

  isError(field: string): boolean {
    return !!(this.userForm.get(field)?.invalid && !this.isValid);
  }

  onSubmit(): void {
    if (this.isPatient) {
      this.userForm.get('especialidad')?.setValidators(null);
      this.userForm.get('especialidad')?.updateValueAndValidity();
    } else {
      this.userForm.get('obraSocial')?.setValidators(null);
      this.userForm.get('obraSocial')?.updateValueAndValidity();
      this.userForm.get('perfilImagen2')?.setValidators(null);
      this.userForm.get('perfilImagen2')?.updateValueAndValidity();
      if (this.isAdmin) {
        this.userForm.get('especialidad')?.setValidators(null);
        this.userForm.get('especialidad')?.updateValueAndValidity();
      }
    }
    if (this.userForm.valid) {
      this.isLoading = true;
      this.isValid = true;
      createUserWithEmailAndPassword(
        this.auth,
        this.userForm.get('mail')?.value,
        this.userForm.get('password')?.value
      )
        .then((res) => {
          if (res.user.email !== null) sendEmailVerification(res.user);
          this.flagError = false;

          let col = collection(
            this.firestore,
            this.isPatient ? 'patients' : this.isAdmin ? 'administrators' : 'doctors'
          );

          const personalInfomation = {
            dni: this.userForm.value.dni,
            nombre: this.userForm.value.nombre,
            apellido: this.userForm.value.apellido,
            edad: this.userForm.value.edad,
            mail: this.userForm.value.mail,
            password: this.userForm.value.password,
            perfilImagen1: this.userForm.value.perfilImagen1,
            perfilImagen2: this.userForm.value.perfilImagen2 || null,
          };

          addDoc(col, {
            ...personalInfomation,
            ...(this.isPatient
              ? {
                  obraSocial: this.userForm.value.obraSocial || null,
                  verificated: false,
                  rol: Roles.PATIENT,
                }
              : {
                  especialidad: this.userForm.value.especialidad || null,
                  enabled: true,
                  rol: this.isAdmin ? Roles.ADMIN : Roles.DOCTOR,
                }),
          });
          this.userForm.reset();

          this.router.navigate(['login']);
        })
        .catch((e) => {
          this.flagError = true;
          switch (e.code) {
            case 'auth/invalid-email':
              this.msjError = 'Email invalido';
              break;
            case 'auth/email-already-in-use':
              this.msjError = 'Email ya en uso';
              break;
            case 'auth/missing-password':
              this.msjError = 'Email/Contraseña invalido';
              break;
            default:
              this.msjError = e.code;
              break;
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      console.log('Formulario no válido');
      this.isValid = false;
    }
  }
}
