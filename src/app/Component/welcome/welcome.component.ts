import { Component, OnInit, inject } from '@angular/core';
import { User } from '../../Interfaces/user';
import { AuthService } from '../../services/Auth/auth.service';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { SelectAvailableDaysComponent } from '../select-available-days/select-available-days.component';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [HideComponentDirective, SelectAvailableDaysComponent],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class MyProfileComponent implements OnInit {
  auth = inject(AuthService);
  route = inject(Router);

  userData!: User;
  ngOnInit(): void {
    this.userData = this.auth.getUser() as User;
  }

  handleSelectAvaiblesDays(): void {
    this.route.navigate(['availableDays']);
  }
}
