import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Roles, User } from '../../Interfaces/user';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { HistoricalRecord } from '../../pipes/filter.pipe';
import { Appointment } from '../../Interfaces/Appointment ';
import { convertTimestampToDate } from '../../utils/date';
import { Timestamp } from 'firebase/firestore';
import { ModalInformationComponent } from '../modal-information/modal-information.component';
import { MatDialog } from '@angular/material/dialog';
import { ExcelService } from '../../services/excel.service';
import { AuthService } from '../../services/Auth/auth.service';
@Component({
  selector: 'app-box-user',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './box-user.component.html',
  styleUrl: './box-user.component.css',
})
export class BoxUserComponent implements OnInit {
  @Input() users: User[] = [];
  firestore = inject(Firestore);
  readonly dialog = inject(MatDialog);
  historicalRecords!: HistoricalRecord[];
  appointments!: Appointment[];
  currentUser!: User;

  constructor(
    private excelService: ExcelService,
    private authService: AuthService
  ) {
    console.log(this.users);
  }

  ngOnInit() {
    this.currentUser = this.authService.getUser() as User;
    let collectionRef = collection(this.firestore, 'historyRecord');
    collectionData(collectionRef).subscribe((data) => {
      this.historicalRecords = data as HistoricalRecord[];
    });
    collectionRef = collection(this.firestore, 'appointments');
    collectionData(collectionRef).subscribe((data) => {
      this.appointments = data as Appointment[];
      this.appointments = this.appointments.map((appointment) => {
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
    });
  }

  openDetails(user: User) {
    const historicalRecordsFilter = this.historicalRecords.filter(
      (record) => record.patientId === user.dni
    );
    const appointmentsFilter = this.appointments.filter((appointment) =>
      historicalRecordsFilter.some((h) => h.appointmentId === appointment.id)
    );

    const data = appointmentsFilter.map((appointment) => {
      const historical = historicalRecordsFilter.find(
        (h) => h.appointmentId === appointment.id
      );
      return {
        appointmentId: appointment.id,
        doctorId: appointment.specialistId,
        patientId: appointment.patientId,
        record: historical?.record,
        specialistName: appointment.specialistName,
        specialty: appointment.specialty,
        date: appointment.date,
        status: appointment.status,
        cancellationReason: appointment.cancellationReason,
        review: appointment.review,
        survey: appointment.survey,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      };
    });

    if (this.currentUser.rol === Roles.ADMIN) {
      this.exportDataToExcel(data);
    } else if (this.currentUser.rol === Roles.DOCTOR) {
      const dialogRef = this.dialog.open(ModalInformationComponent, {
        data: { data: data.slice(0, 3), user: user },
      });
    }
  }

  keyValue = (record: Record<string, string | number>) => {
    return Object.keys(record).map((key) => ({
      key,
      value: record[key],
    }));
  };

  exportDataToExcel(
    appointments: {
      appointmentId?: string;
      patientId?: string;
      doctorId: string;
      specialty: string;
      date: string;
      review?: {
        rating?: number | null;
        comment?: string | null;
      };
      record?: Record<string, string | number>;
    }[]
  ): void {
    if (appointments.length === 0) {
      return;
    }

    const record = appointments[0]?.record || {};
    const data = appointments.map((appointment) => {
      const record = appointment.record || {};
      const value = this.keyValue(record);
      return {
        ID: appointment.appointmentId,
        Paciente: appointment.patientId,
        Doctor: appointment.doctorId,
        Especialidad: appointment.specialty,
        Fecha: appointment.date,
        'Comentarios de revisión': appointment?.review?.comment,
        Peso: value.find((review) => review.key === 'peso')?.value,
        Presion: value.find((review) => review.key === 'presion')?.value,
        Altura: value.find((review) => review.key === 'altura')?.value,
        Temperatura: value.find((review) => review.key === 'temperatura')
          ?.value,
      };
    });
    this.excelService.exportToExcel(
      data,
      `patient-${appointments[0].patientId}`,
      'patientsData'
    );
  }
}

/*


*/
