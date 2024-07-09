import { Pipe, PipeTransform, inject } from '@angular/core';
import { UserService } from '../services/User/user.service';
import { Roles } from '../Interfaces/user';

@Pipe({
  name: 'findPatient',
  standalone: true,
})
export class FindPatientPipe implements PipeTransform {
  usersService = inject(UserService);
  constructor() {
    this.usersService.getUsersByRol('patients');
  }

  transform(value?: string, ...args: unknown[]): unknown {
    if (!value) {
      return;
    }
    const patients = this.usersService.partients;
    const patient = patients.find(
      (patient) => patient.dni.toString() === value
    );
    return `${patient?.apellido}, ${patient?.nombre}`;
  }
}
