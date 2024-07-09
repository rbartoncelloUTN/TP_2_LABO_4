import { Component, Input, inject } from '@angular/core';
import { Appointment, Status } from '../../Interfaces/Appointment ';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/Auth/auth.service';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { AppointmentService } from '../../services/Appointment/appointment.service';
import { ModalCommentComponent } from '../modal-comment/modal-comment.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalReviewComponent } from '../modal-review/modal-review.component';
import { FindPatientPipe } from '../../pipes/find-patient.pipe';
import { Roles, User } from '../../Interfaces/user';
import { ModalFormComponent } from '../modal-form/modal-form.component';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    HideComponentDirective,
    FindPatientPipe,
    LoaderComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] = [];
  readonly dialog = inject(MatDialog);
  authService = inject(AuthService);
  appointmentService = inject(AppointmentService);
  firestore = inject(Firestore);
  isLoading = false;

  currentUser = this.authService.getUser();
  appointmentFocused: Appointment | undefined = undefined;
  patients: User[] = [];

  constructor() {
    this.patients = this.authService
      .getUsers()
      .filter((user) => (user.rol = Roles.PATIENT));
  }

  hideOptionsWithSpecialityRol(appointment: Appointment): boolean {
    return (
      this.currentUser?.rol === Roles.DOCTOR &&
      (appointment.status === Status.ACCEPTED ||
        appointment.status === Status.COMPLETED ||
        appointment.status === Status.REJECTED ||
        appointment.status === Status.CANCELED)
    );
  }

  hideOptionsWithAdminRol(appointment: Appointment): boolean {
    return (
      this.currentUser?.rol === Roles.ADMIN &&
      (appointment.status === 'Aceptado' ||
        appointment.status === 'Realizado' ||
        appointment.status === 'Rechazado')
    );
  }

  handleAcceptAppointment(appointment: Appointment) {
    this.appointmentFocused = appointment;
    this.appointmentFocused.status = Status.ACCEPTED;
    this.appointmentService.updateAppointment(
      `${this.appointmentFocused?.id}`,
      this.appointmentFocused
    );
  }

  handleRejectedAppointment(appointment: Appointment) {
    this.appointmentFocused = appointment;
    this.appointmentFocused.status = Status.REJECTED;
    this.openCommentsDialog();
  }

  handleFinishedAppointment(appointment: Appointment) {
    this.appointmentFocused = appointment;
    this.appointmentFocused.status = Status.COMPLETED;
    this.openFormDialog('500ms', '500ms');
  }

  handleReviewAppointment(appointment: Appointment) {
    this.appointmentFocused = appointment;
    this.openReviewDialog();
  }

  handleCommentAppointment(appointment: Appointment) {
    this.appointmentFocused = appointment;
    this.openCommentsDialog();
  }
  handleCancelAppointment(appointment: Appointment) {
    appointment.status = Status.CANCELED;
    this.appointmentFocused = appointment;
    this.openCommentsDialog();
  }

  openReviewDialog() {
    const dialogRef = this.dialog.open(ModalReviewComponent, {
      data: this.appointmentFocused?.review,
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCommentsDialog() {
    const dialogRef = this.dialog.open(ModalCommentComponent);

    dialogRef.afterClosed().subscribe((result: string) => {
      this.isLoading = true;
      if (this.appointmentFocused) {
        this.appointmentFocused.review = { comment: result, rating: null };
        this.appointmentService
          .updateAppointment(
            `${this.appointmentFocused?.id}`,
            this.appointmentFocused
          )
          .finally(() => {
            this.isLoading = false;
          });
      }
    });
  }

  openFormDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const patient = this.patients.find(
      (patient) => patient.dni.toString() === this.appointmentFocused?.patientId
    );
    const dialogRef = this.dialog.open(ModalFormComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: patient,
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      this.isLoading = true;
      if (result) {
        try {
          const collectionRef = collection(this.firestore, 'historyRecord');
          const docRef = doc(collectionRef, `${new Date().getTime()}`);
          setDoc(docRef, {
            patientId: patient?.dni,
            doctorId: this.appointmentFocused?.specialistId,
            appointmentId: this.appointmentFocused?.id,
            record: result,
          }).finally(() => {
            this.isLoading = false;
            this.openCommentsDialog();
          });
        } catch (e) {
          this.isLoading = false;
        }
      }
    });
  }
}
