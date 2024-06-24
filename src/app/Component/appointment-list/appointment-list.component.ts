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
import { Roles } from '../../Interfaces/user';
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    HideComponentDirective,
    FindPatientPipe,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  @Input() appointments: Appointment[] = [];
  readonly dialog = inject(MatDialog);
  authService = inject(AuthService);
  appointmentService = inject(AppointmentService);
  currentUser = this.authService.getUser();
  appointmentFocused: Appointment | undefined = undefined;

  constructor() {}

  hideOptionsWithSpecialityRol(appointment: Appointment): boolean {
    return (
      this.currentUser?.rol === Roles.DOCTOR &&
      (appointment.status === 'Aceptado' ||
        appointment.status === 'Realizado' ||
        appointment.status === 'Rechazado')
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
    this.openCommentsDialog();
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
    console.log(this.appointmentFocused);
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
      if (this.appointmentFocused) {
        this.appointmentFocused.review = { comment: result, rating: null };
        this.appointmentService.updateAppointment(
          `${this.appointmentFocused?.id}`,
          this.appointmentFocused
        );
      }
    });
  }
}
