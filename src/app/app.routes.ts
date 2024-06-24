import { Routes } from '@angular/router';
import { LoginComponent } from './Component/login/login.component';
import { MyProfileComponent } from './Component/welcome/welcome.component';
import { authGuard } from './guards/auth-guard.guard';
import { authRolGuard } from './guards/auth-rol.guard';
import { RegisterComponent } from './Component/register/register.component';
import { UsersComponent } from './Component/users/users.component';
import { CreateAppointmentComponent } from './Component/create-appointment/create-appointment.component';
import { SelectAvailableDaysComponent } from './Component/select-available-days/select-available-days.component';

export type RoutesParams = 'login' | 'register' | 'home';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: MyProfileComponent },
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
  { path: 'availableDays', component: SelectAvailableDaysComponent },
  { path: '**', component: LoginComponent },
];
