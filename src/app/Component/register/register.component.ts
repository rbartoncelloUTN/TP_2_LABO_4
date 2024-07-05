import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { Firestore, collectionData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Roles } from '../../Interfaces/user';
import { DialogTextComponent } from '../dialog-text/dialog-text.component';
import { DialogInfoComponent } from '../dialog-info/dialog-info.component';
import { Storage, ref } from '@angular/fire/storage';
import { uploadBytes } from 'firebase/storage';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    HideComponentDirective,
    RecaptchaModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  userForm!: FormGroup;
  isPatient: boolean = false;
  isAdmin: boolean = false;
  flagError: boolean = false;
  msjError: string = '';
  isValid: boolean = true;
  isLoading: boolean = false;
  especialidades!: { name: string }[] | any[];
  fileImages: any[] = [];

  constructor(
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    public auth: Auth,
    private storege: Storage,
    private fb: FormBuilder
  ) {}

  getEspecialidades(): void {
    let col = collection(this.firestore, 'especialidades');

    const observable = collectionData(col);

    observable.subscribe((data) => {
      this.especialidades = data;
    });
  }

  executeRecaptcha(token: any) {
    console.log(token);
  }

  ngOnInit(): void {
    this.getEspecialidades();
    const { isPatient, isAdmin } = this.route.snapshot.queryParams;
    this.isPatient = isPatient === 'true';
    this.isAdmin = isAdmin === 'true';
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
      especialidades: this.fb.array([]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      perfilImagen1: new FormControl('', [Validators.required]),
      perfilImagen2: new FormControl('', [Validators.required]),
    });
  }

  onCheckboxChange(event: any) {
    const especialidades: FormArray = this.userForm.get(
      'especialidades'
    ) as FormArray;
    if (event.target.checked) {
      especialidades.push(this.fb.control(event.target.value));
    } else {
      const index = especialidades.controls.findIndex(
        (x) => x.value === event.target.value
      );
      especialidades.removeAt(index);
    }
    console.log(this.userForm.value.especialidades);
  }

  isError(field: string): boolean {
    return !!(this.userForm.get(field)?.invalid && !this.isValid);
  }

  onAddEspecialidad(): void {
    this.openDialog();
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogTextComponent);
    let newSpecialty = '';

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        newSpecialty = result;
        const index = this.especialidades.findIndex(
          (especialidad) =>
            especialidad.name.toLowerCase() === newSpecialty.toLowerCase()
        );
        if (index >= 0) {
          this.flagError = true;
          this.msjError = 'La especialidad ya existe';
          this.dialog.open(DialogInfoComponent, {
            data: {
              title: 'Error',
              message: 'La especialidad ya existe',
              isError: true,
            },
          });
        } else {
          this.especialidades.push({ name: newSpecialty });
          this.dialog.open(DialogInfoComponent, {
            data: {
              title: 'La especialidad fue agregada',
            },
          });
          let col = collection(this.firestore, 'especialidades');
          addDoc(col, { name: newSpecialty, id: this.especialidades.length });
        }
      }
    });
  }

  saveImage($event: any, number: number): void {
    this.fileImages.push($event.target.files[0]);
  }

  uploadImage(): void {
    const id = this.userForm.get('mail')?.value;

    this.fileImages.map((image, index) => {
      const imageRef = ref(this.storege, `users/${id}/${index}`);
      uploadBytes(imageRef, image)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.error(e);
        });
    });
  }

  onSubmit(): void {
    if (this.isPatient) {
      this.userForm.get('especialidades')?.setValidators(null);
      this.userForm.get('especialidades')?.updateValueAndValidity();
    } else {
      this.userForm.get('obraSocial')?.setValidators(null);
      this.userForm.get('obraSocial')?.updateValueAndValidity();
      this.userForm.get('perfilImagen2')?.setValidators(null);
      this.userForm.get('perfilImagen2')?.updateValueAndValidity();
      if (this.isAdmin) {
        this.userForm.get('especialidades')?.setValidators(null);
        this.userForm.get('especialidades')?.updateValueAndValidity();
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
            this.isPatient
              ? 'patients'
              : this.isAdmin
              ? 'administrators'
              : 'doctors'
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
                  especialidades: this.userForm.value.especialidades || null,
                  enabled: true,
                  verificated: false,
                  rol: this.isAdmin ? Roles.ADMIN : Roles.DOCTOR,
                }),
          });

          this.uploadImage();

          if (!this.isAdmin) {
            this.router.navigate(['login']);
          }
          this.userForm.reset();

          //signOut(this.auth);
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
      this.isValid = false;
    }
  }
}
