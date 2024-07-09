import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-options-buttons',
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
  templateUrl: './modal-options-buttons.component.html',
  styleUrls: ['./modal-options-buttons.component.css'],
})
export class ModalOptionsButtonsComponent {
  constructor(private router: Router) {}
  onImage1Click() {
  }

  onImage2Click() {
  }

  register(isPatient: boolean = false): void {
    this.router.navigate(['register'], { queryParams: { isPatient } });
  }
}
