import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Appointment } from '../../Interfaces/Appointment ';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-comfirm-appointment',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './modal-comfirm-appointment.component.html',
  styleUrl: './modal-comfirm-appointment.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComfirmAppointmentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { appointment: Appointment }
  ) {
    console.log(this.data);
  }
}
