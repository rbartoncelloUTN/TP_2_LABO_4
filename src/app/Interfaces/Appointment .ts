import { Timestamp } from 'firebase/firestore';

export interface Appointment {
  id?: string;
  patientId?: string;
  specialistId: string;
  specialistName: string;
  specialty: string;
  date: Date | any;
  status: Status;
  cancellationReason?: string;
  review?: {
    rating?: number | null;
    comment?: string | null;
  };
  survey?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum Status {
  PENDING = 'Pendiente',
  ACCEPTED = 'Aceptado',
  REJECTED = 'Rechazado',
  COMPLETED = 'Realizado',
  CANCELED = 'Cancelado',
}
