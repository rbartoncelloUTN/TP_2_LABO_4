import { Pipe, PipeTransform, inject } from '@angular/core';
import { Roles, User } from '../Interfaces/user';
import { Appointment } from '../Interfaces/Appointment ';
import { UserService } from '../services/User/user.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';

export interface HistoricalRecord {
  appointmentId: string;
  doctorId: string;
  patientId: number;
  record: Record<string, string | number>;
}

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  usersService = inject(UserService);
  firestore = inject(Firestore);

  historicalRecords?: HistoricalRecord[] = [];

  constructor() {
    this.usersService.getUsersByRol('patients');
    const collectionRef = collection(this.firestore, 'historyRecord');
    collectionData(collectionRef).subscribe((data) => {
      this.historicalRecords = data as HistoricalRecord[];
    });
  }
  transform(value: Appointment[], search: string, user?: User) {
    const partients = this.usersService.partients;

    if (search !== '') {
      return value.filter((v) => {
        const currentHistoricalRecord = this.historicalRecords?.find(
          (h) => h.appointmentId === v.id
        );

        const keys = currentHistoricalRecord?.record
          ? Object.keys(currentHistoricalRecord.record)
          : [];

        const values = currentHistoricalRecord?.record
          ? Object.values(currentHistoricalRecord.record)
          : [];

        search = search.toLowerCase();

        const patient = partients.find((p) => p.dni.toString() === v.patientId);
        const patientName = `${patient?.apellido}${patient?.nombre}`;
        return (
          v.specialty.toLowerCase().includes(search) ||
          v.specialistName.toLowerCase().includes(search) ||
          patientName.toLowerCase().includes(search) ||
          v.review?.comment?.toLowerCase().includes(search) ||
          v.status.toLowerCase().includes(search) ||
          keys.some((k) => k.toLowerCase().includes(search)) ||
          values.some((v) => v.toString().toLowerCase().includes(search))
        );
      });
    }
    return value;
  }
}
