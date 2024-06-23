import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/User/user.service';
import { Roles, User } from '../../Interfaces/user';
import { AuthService } from '../../services/Auth/auth.service';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import {
  Firestore,
  collectionData,
  doc,
  getDoc,
} from '@angular/fire/firestore';
import { Timestamp, collection } from 'firebase/firestore';
import {
  generateHours,
  getWeekdayDatesNext15Days,
  convertTimestampToDate,
} from '../../utils/date';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { ModalComfirmAppointmentComponent } from '../modal-comfirm-appointment/modal-comfirm-appointment.component';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component';
import { FilterPipe } from '../../pipes/filter.pipe';

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
  specialties: { id: string; name: string }[] = [];
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

  availableTimes: { day: string; hours: [] }[] = [];
  constructor(private router: Router, private firestore: Firestore) {
    this.loadSpecialties();
    this.loadAppointments();
    this.usersService.getUsersByRol('patients');
    this.usersService.getUsersByRol('doctors');
  }

  ngOnInit(): void {
    this.usersService.getUsersByRol('patients');
    this.usersService.getUsersByRol('doctors');
    this.currentUser = this.authService.getUser();
    if (this.currentUser?.rol === Roles.PATIENT) {
      this.patientSelected = this.currentUser;
    } else {
      this.patients = this.usersService.users.patients;
    }
    this.doctors = this.usersService.users.doctors;
    this.loadSpecialties();
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
          if (a.date < b.date) {
            return -1;
          } else if (a.date > b.date) {
            return 1;
          } else {
            return 0;
          }
        });
    });
  }

  loadSpecialties(): void {
    let col = collection(this.firestore, 'especialidades');

    const observable = collectionData(col);

    observable.subscribe((data) => {
      this.specialties = data as { id: string; name: string }[];
    });
  }

  onPatientSelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.patientSelected = this.patients?.find(
      (patient) => patient.dni.toString() === selectedValue
    );
    this.loadAppointments();
  }

  onSpecialtySelected(event: Event): void {
    this.usersService.getUsersByRol('doctors');
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSpecialty =
      this.specialties.find(
        (specialty) => specialty.id.toString() === selectedValue
      )?.name || '';

    this.doctors = this.usersService.doctors?.filter(
      (doctors) => doctors.especialidad === this.selectedSpecialty
    );
  }

  onSpecialistSelected(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSpecialist = this.doctors?.find(
      (specialty) => specialty.dni.toString() === selectedValue
    );
    this.loadAppointmentsAvaiblesBySpecialist();
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

    const hoursAvailable = this.availableTimes.find(
      (time) => time.day === `${date.day}/${date.month}/2024`
    )?.hours;

    this.appointmetOptions = generateHours(
      8,
      date.weekDay === 'sábado' ? 14 : 19
    )
      .filter(
        (hour) =>
          !selectedSpecialistAppointments.some(
            (appointment) => hour === appointment
          )
      )
      .filter((hour) =>
        hoursAvailable?.some((appointment) => hour === appointment)
      );
    this.selectedDate = date;
  }
  get halfLength(): number {
    return Math.ceil(this.appointmetOptions.length / 3);
  }

  handleHourClick(hour: any) {
    const formattedDate = `${2024}-${this.selectedDate?.month}-${
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
      this.loadSpecialties();
      this.usersService.getUsersByRol('patients');
      this.usersService.getUsersByRol('doctors');
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
