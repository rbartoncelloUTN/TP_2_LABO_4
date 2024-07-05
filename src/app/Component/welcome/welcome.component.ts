import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../Interfaces/user';
import { AuthService } from '../../services/Auth/auth.service';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { SelectAvailableDaysComponent } from '../select-available-days/select-available-days.component';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { HistoricalRecord } from '../../pipes/filter.pipe';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { CommonModule } from '@angular/common';
import { convertTimestampToDate } from '../../utils/date';
import { Timestamp, updateDoc } from 'firebase/firestore';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HideComponentDirective, SelectAvailableDaysComponent, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class MyProfileComponent implements OnInit {
  auth = inject(AuthService);
  route = inject(Router);
  firestore = inject(Firestore);
  appointmentService = inject(AppointmentService);
  historicalRecords!: HistoricalRecord[];
  appointments!: Appointment[];
  info!: any;

  userData!: User;

  constructor() {
    this.getHistorial();
  }

  ngOnInit(): void {
    this.userData = this.auth.getUser() as User;
    this.getHistorial();
  }

  getHistorial() {
    this.appointmentService.getAppointments().subscribe((data) => {
      this.appointments = data.map((appointment) => {
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
      });
      this.appointments = this.appointments.filter(
        (appointment) =>
          appointment.patientId?.toString() ===
            this.userData.dni.toString() &&
          appointment.status === Status.COMPLETED
      );
      this.appointments.sort((a, b) => b.date.getTime() - a.date.getTime());
    });
    const collectionRef = collection(this.firestore, 'historyRecord');
    collectionData(collectionRef).subscribe((data) => {
      this.historicalRecords = data as HistoricalRecord[];
      this.historicalRecords = this.historicalRecords.filter(
        (record) => record.patientId === this.userData.dni
      );
      
      this.info = this.appointments.map((appointment) => {
        const historical = this.historicalRecords.find(
          (h) => h.appointmentId === appointment.id
        );
        return {
          ...appointment,
          historical: historical?.record,
        };
      });
      console.log(this.info);
    });
  }

  handleSelectAvaiblesDays(): void {
    this.route.navigate(['availableDays']);
  }
}
