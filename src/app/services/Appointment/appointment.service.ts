import { Injectable, Inject, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../../Interfaces/Appointment ';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointmentsCollection: CollectionReference<
    DocumentData,
    DocumentData
  >;
  appointments: Observable<any>;
  firestore = inject(Firestore);

  constructor() {
    this.appointmentsCollection = collection(this.firestore, 'appointments');
    this.appointments = collectionData(this.appointmentsCollection);
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointments;
  }

  getAppointmentById(
    appointmentId: string
  ): Observable<Appointment | undefined> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return docData(appointmentDoc, {
      idField: 'id',
    }) as Observable<Appointment>;
  }

  addAppointment(appointment: Appointment): Promise<any> {
    const createdAt = new Date();
    const updatedAt = new Date();
    appointment.createdAt = createdAt;
    appointment.updatedAt = updatedAt;
    appointment.review = { comment: null, rating: null };
    appointment.survey = '';
    const appointmentDoc: DocumentReference = doc(
      this.appointmentsCollection,
      appointment.id
    );

    return setDoc(appointmentDoc, appointment);
  }
  updateAppointment(
    appointmentId: string,
    appointment: Appointment
  ): Promise<void> {
    const updatedAt = new Date();
    appointment.updatedAt = updatedAt;
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return updateDoc(appointmentDoc, { ...appointment });
  }

  deleteAppointment(appointmentId: string): Promise<void> {
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return deleteDoc(appointmentDoc);
  }

  getAppointmentsBySpecialty(specialty: string): Observable<Appointment[]> {
    const q = query(
      this.appointmentsCollection,
      where('specialty', '==', specialty)
    );
    return collectionData(q, { idField: 'id' }) as Observable<Appointment[]>;
  }

  getAppointmentsByStatus(
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'canceled'
  ): Observable<Appointment[]> {
    const q = query(this.appointmentsCollection, where('status', '==', status));
    return collectionData(q, { idField: 'id' }) as Observable<Appointment[]>;
  }

  cancelAppointment(
    appointmentId: string,
    cancellationReason: string
  ): Promise<void> {
    const updatedAt = new Date();
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return updateDoc(appointmentDoc, {
      status: 'canceled',
      cancellationReason: cancellationReason,
      updatedAt: updatedAt,
    });
  }

  completeAppointment(
    appointmentId: string,
    review: { rating: number; comment: string }
  ): Promise<void> {
    const updatedAt = new Date();
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return updateDoc(appointmentDoc, {
      status: 'completed',
      review: review,
      updatedAt: updatedAt,
    });
  }

  acceptAppointment(appointmentId: string): Promise<void> {
    const updatedAt = new Date();
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return updateDoc(appointmentDoc, {
      status: 'accepted',
      updatedAt: updatedAt,
    });
  }

  rejectAppointment(
    appointmentId: string,
    rejectionReason: string
  ): Promise<void> {
    const updatedAt = new Date();
    const appointmentDoc = doc(this.firestore, `appointments/${appointmentId}`);
    return updateDoc(appointmentDoc, {
      status: 'rejected',
      cancellationReason: rejectionReason,
      updatedAt: updatedAt,
    });
  }

  createAppointment(appointment: Appointment): Promise<any> {
    const createdAt = new Date();
    const updatedAt = new Date();
    appointment.createdAt = createdAt;
    appointment.updatedAt = updatedAt;
    return addDoc(this.appointmentsCollection, appointment);
  }
}
