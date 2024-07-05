import { Component, OnChanges, inject } from '@angular/core';
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
export class NavbarComponent implements OnChanges {
  authService = inject(AuthService);
  user!: any;
  show = false;

  constructor(private router: Router, public auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
  }
  ngOnChanges(): void {
    console.log('Usuario en NavbarComponent:', this.user);
  }

  ngOnInit(): void {
    this.user = this.authService.getUser() as User;
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.show = true;
      } else {
        this.show = false;
      }
    });
    console.log('Usuario en NavbarComponent:', this.user);
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
