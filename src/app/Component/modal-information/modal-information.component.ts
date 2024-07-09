import { Component, Inject, inject } from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-information',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  templateUrl: './modal-information.component.html',
  styleUrl: './modal-information.component.css',
})
export class ModalInformationComponent {
  readonly dialogRef = inject(MatDialogRef<ModalInformationComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { data: any[]; user: User }
  ) {}
}
