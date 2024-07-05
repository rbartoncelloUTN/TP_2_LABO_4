import { Component, OnInit } from '@angular/core';
import { Roles, User } from '../../Interfaces/user';
import { CommonModule } from '@angular/common';
import { BooleanToButtonPipe } from '../../pipes/boolean-to-button.pipe';
import { Router } from '@angular/router';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from '@angular/fire/firestore';
import { UserService } from '../../services/User/user.service';
import { LoaderComponent } from '../loader/loader.component';
import { AuthService } from '../../services/Auth/auth.service';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    BooleanToButtonPipe,
    HideComponentDirective,
    LoaderComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  public users: {
    patients: User[];
    doctors: User[];
    administrators: User[];
  } = { doctors: [], administrators: [], patients: [] };
  isLoading = false;
  user!: User;
  appointments?: Appointment[] | [];

  constructor(
    private router: Router,
    private firestore: Firestore,
    private userService: UserService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser() as User;
    this.appointmentService.getAppointments().subscribe((appointments) => {
      this.appointments = appointments.filter(
        (appointments) =>
          (this.user.rol === Roles.DOCTOR &&
            appointments.specialistId.toString() === this.user.dni.toString() &&
            appointments.status === Status.COMPLETED) ||
          (appointments.status === Status.COMPLETED &&
            this.user.rol === Roles.ADMIN)
      );
    });
    Promise.all([
      this.userService.getUsers('administrators'),
      this.userService.getUsers('doctors'),
      this.userService.getUsers('patients'),
    ])
      .then(() => {
        this.users = this.userService.users;
        this.users.patients = this.users.patients.filter((p) =>
          this.appointments?.some((a) => a.patientId === p.dni.toString())
        );
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      });
  }
  addAdmin(): void {
    this.router.navigate(['register'], { queryParams: { isAdmin: true } });
  }
  async updateUserEnabledStatus(
    dni: number,
    enabled: boolean,
    verificated: boolean
  ) {
    this.isLoading = true;

    try {
      const usersCollection = collection(this.firestore, 'doctors');
      const q = query(usersCollection, where('dni', '==', dni));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error('No such user found with DNI:', dni);
        this.isLoading = false;
        return;
      }

      querySnapshot.forEach(async (document) => {
        const docRef = doc(this.firestore, 'doctors', document.id);
        await updateDoc(docRef, {
          enabled: enabled,
          verificated: verificated,
        });
      });

      console.log('User enabled status updated successfully');
      Promise.all([this.userService.getUsers('doctors')])
        .then(() => {
          this.users = this.userService.users;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Error loading users:', error);
          this.isLoading = false;
        });
    } catch (error) {
      console.error('Error updating user enabled status:', error);
    } finally {
      this.isLoading = false;
    }
  }
  exportDataToExcel(): void {
    const data = this.users.patients;
    this.excelService.exportToExcel(data, 'pacientes', 'patientsData');
  }
}
