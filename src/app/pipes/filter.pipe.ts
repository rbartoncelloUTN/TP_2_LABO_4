import { Pipe, PipeTransform, inject } from '@angular/core';
import { Roles, User } from '../Interfaces/user';
import { Appointment } from '../Interfaces/Appointment ';
import { UserService } from '../services/User/user.service';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  usersService = inject(UserService);
  constructor() {
    this.usersService.getUsersByRol('patients');
  }
  transform(value: Appointment[], search: string, user?: User) {
    const partients = this.usersService.partients;

    if (search !== '') {
      return value.filter((v) => {
        if (user?.rol === Roles.PATIENT || user?.rol === Roles.ADMIN) {
          return (
            v.specialty.toLowerCase().includes(search.toLowerCase()) ||
            v.specialistName.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (user?.rol === Roles.DOCTOR) {
          const patient = partients.find(
            (p) => p.dni.toString() === v.patientId
          );
          const patientName = `${patient?.apellido}${patient?.nombre}`;
          return (
            v.specialty.toLowerCase().includes(search.toLowerCase()) ||
            patientName.toLowerCase().includes(search.toLowerCase())
          );
        }
        return false;
      });
    }
    return value;
  }
}
