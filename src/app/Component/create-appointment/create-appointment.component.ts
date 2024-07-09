import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/User/user.service';
import { Roles, User } from '../../Interfaces/user';
import { AuthService } from '../../services/Auth/auth.service';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Timestamp, updateDoc } from 'firebase/firestore';
import {
  getWeekdayDatesNext15Days,
  convertTimestampToDate,
} from '../../utils/date';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { ModalComfirmAppointmentComponent } from '../modal-comfirm-appointment/modal-comfirm-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { FilterPipe } from '../../pipes/filter.pipe';
import { DateHourPipe } from '../../pipes/date-hour.pipe';

@Component({
  selector: 'app-create-appointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HideComponentDirective,
    AppointmentListComponent,
    FilterPipe,
    DateHourPipe,
  ],
  templateUrl: './create-appointment.component.html',
  styleUrl: './create-appointment.component.css',
})
export class CreateAppointmentComponent implements OnInit {
  appointmentsService = inject(AppointmentService);
  usersService = inject(UserService);
  authService = inject(AuthService);
  readonly dialog = inject(MatDialog);

  currentUser?: User;
  patientSelected?: User;
  patients?: User[];
  doctors: User[] | [] = [];
  createNewAppointment = false;
  specialties: string[] = [];
  selectedSpecialty: string | null = null;
  selectedSpecialist: User | undefined = undefined;
  searchText: string = '';

  dates = getWeekdayDatesNext15Days();
  appointmetOptions: string[] | [] = [];
  selectedDate:
    | {
        weekDay: string;
        date: string;
        day: string;
        month: string;
      }
    | undefined;
  selectedTime: string = '';

  appointment: Appointment | undefined = undefined;
  appointments: Appointment[] | [] = [];

  availableTimes: { day: string; hours: string[] }[] = [];
  constructor(private router: Router, private firestore: Firestore) {
    this.loadAppointments();
  }

  ngOnInit(): void {
    const users = this.authService.getUsers();
    this.currentUser = this.authService.getUser();
    if (this.currentUser?.rol === Roles.PATIENT) {
      this.patientSelected = this.currentUser;
    } else {
      this.patients = users.filter((user) => user.rol === Roles.PATIENT);
    }
    this.doctors = users.filter((user) => user.rol === Roles.DOCTOR);
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentsService.getAppointments().subscribe((appointments) => {
      this.appointments = appointments
        .map((appointment) => {
          const createdAtDate: Date = convertTimestampToDate(
            appointment.createdAt as unknown as Timestamp
          );
          const updatedAtDate: Date = convertTimestampToDate(
            appointment.updatedAt as unknown as Timestamp
          );
          const dateDate: Date = convertTimestampToDate(
            appointment.date as unknown as Timestamp
          );
          return {
            ...appointment,
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
            date: dateDate,
          };
        })
        .filter(
          (appointment) =>
            (this.patientSelected &&
              appointment.patientId === this.patientSelected?.dni.toString()) ||
            (this.currentUser?.rol === Roles.DOCTOR &&
              appointment.specialistId === this.currentUser.dni.toString()) ||
            this.currentUser?.rol === Roles.ADMIN
        )
        .sort((a, b) => {
          if (a.date > b.date) {
            return -1;
          } else if (a.date > b.date) {
            return 1;
          } else {
            return 0;
          }
        });
    });
  }

  onPatientSelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.patientSelected = this.patients?.find(
      (patient) => patient.dni.toString() === selectedValue
    );
    this.loadAppointments();
  }

  onSpecialtySelected(speciality: string): void {
    this.selectedSpecialty = speciality;
    this.loadAppointmentsAvaiblesBySpecialist();
  }

  onSpecialistSelected(dni: number): void {
    this.selectedSpecialist = this.doctors?.find(
      (specialty) =>
        specialty.dni === dni && this.selectedSpecialist?.dni !== dni
    );

    this.specialties = this.selectedSpecialist?.especialidades || [];
  }
  requestAppointment(): void {
    this.createNewAppointment = true;
  }

  handleDateClick(date: {
    weekDay: string;
    date: string;
    day: string;
    month: string;
  }) {
    const selectedSpecialistAppointments = this.appointments
      .filter(
        (appointment) =>
          appointment.specialistId ===
            this.selectedSpecialist?.dni.toString() &&
          (appointment.date.getMonth() + 1).toString() === date.month &&
          appointment.date.getDate().toString() === date.day
      )
      .map(
        (appointment) =>
          `${appointment.date
            .getHours()
            .toString()
            .padStart(2, '0')}:${appointment.date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`
      );

    const hoursAvailable =
      this.availableTimes.find(
        (time) => time.day === `${date.day}/${Number(date.month) + 1}/2024`
      )?.hours || [];

    this.appointmetOptions = hoursAvailable;
    this.selectedDate = date;
  }
  get halfLength(): number {
    return Math.ceil(this.appointmetOptions.length / 3);
  }

  handleHourClick(hour: any) {
    const formattedDate = `${2024}-${Number(this.selectedDate?.month) + 1}-${
      this.selectedDate?.day
    } ${hour}`;
    this.appointment = {
      id: new Date().getTime().toString(),
      date: new Date(formattedDate),
      specialistId: this.selectedSpecialist?.dni.toString() || '',
      specialistName: `${this.selectedSpecialist?.apellido} ${this.selectedSpecialist?.nombre}`,
      specialty: this.selectedSpecialty || '',
      status: Status.PENDING,
      patientId: this.patientSelected?.dni.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const appointmentDoc = doc(
      this.firestore,
      `availablesAppointments/${this.selectedSpecialist?.dni}`
    );

    this.availableTimes = this.availableTimes.map((date) => {
      if (
        date.day ===
        `${this.selectedDate?.day}/${Number(this.selectedDate?.month) + 1}/2024`
      ) {
        const hourFilter = date.hours.filter((h) => h !== hour);
        return {
          ...date,
          hours: hourFilter,
        };
      }
      return date;
    });
    `${this.selectedDate?.day}/${Number(this.selectedDate?.month) + 1}/2024`;

    updateDoc(appointmentDoc, { dates: this.availableTimes });
    this.openDialog();
  }
  openDialog() {
    const dialogRef = this.dialog.open(ModalComfirmAppointmentComponent, {
      data: { appointment: this.appointment },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result && this.appointment) {
        this.appointmentsService.addAppointment(this.appointment);
      }
      this.createNewAppointment = false;
      this.selectedDate = undefined;
      this.selectedSpecialty = null;
      this.selectedSpecialist = undefined;
      this.selectedTime = '';
      this.appointmetOptions = [];
    });
  }

  async loadAppointmentsAvaiblesBySpecialist() {
    if (!this.selectedSpecialist) {
      console.error('User not found');
      return;
    }

    const docRef = doc(
      this.firestore,
      'availablesAppointments',
      `${this.selectedSpecialist.dni}`
    );

    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as { dates: [{ day: string; hours: [] }] };
        this.availableTimes = data?.dates || [];
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    }
  }
}
