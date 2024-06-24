import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { HideComponentDirective } from '../../directives/hide-component.directive';
import { AuthService } from '../../services/Auth/auth.service';
import { User } from '../../Interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    HideComponentDirective,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  user!: User;

  constructor(private router: Router, public auth: Auth) {}

  ngOnInit(): void {
    this.user = this.authService.getUser() as User;
  }

  handleClickGoToHome() {
    this.router.navigate(['welcome']);
  }

  handleClickGoToChat() {
    this.router.navigate(['users']);
  }

  handleClickGoToCreateNewAppointment() {
    this.router.navigate(['createNewAppointment']);
  }

  handleLogout() {
    signOut(this.auth);
    localStorage.setItem('current-user', '');
    this.router.navigate(['login']);
  }
}
