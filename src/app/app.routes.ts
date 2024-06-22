import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { WelcomeComponent } from './Component/welcome/welcome.component';
import { authGuard } from './guards/auth-guard.guard';
import { authRolGuard } from './guards/auth-rol.guard';
import { RegisterComponent } from './Component/register/register.component';
import { UsersComponent } from './Component/users/users.component';
import { CreateAppointmentComponent } from './Component/create-appointment/create-appointment.component';

export type RoutesParams = 'login' | 'register' | 'home';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authRolGuard],
  },
  {
    path: 'createNewAppointment',
    component: CreateAppointmentComponent,
  },

  { path: '**', component: LoginComponent },
];
