import { Component, Inject, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../Interfaces/user';
import { KeyValuePipe } from '../../pipes/key-value.pipe';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-modal-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    KeyValuePipe,
  ],
  templateUrl: './modal-form.component.html',
  styleUrl: './modal-form.component.css',
})
export class ModalFormComponent {
  readonly dialogRef = inject(MatDialogRef<ModalFormComponent>);
  altura?: number;
  peso?: number;
  temperatura?: number;
  presion?: number;
  dynamic = '';
  dynamic_key = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public patient: User
  ) {}

  closeDialog() {
    const result = {
      altura: this.altura,
      peso: this.peso,
      temperatura: this.temperatura,
      presion: this.presion,
      [this.dynamic_key]: this.dynamic,
    };
    this.dialogRef.close(result);
  }
}
