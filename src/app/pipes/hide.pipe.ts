import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/Auth/auth.service';
import { Roles, User } from '../Interfaces/user';

@Pipe({
  name: 'hide',
  standalone: true,
})
export class HidePipe implements PipeTransform {
  authService = inject(AuthService);

  transform(value: string, ...args: unknown[]): unknown {
    const user = this.authService.getUser() as User;
    return user.rol !== Roles.PATIENT ? value : 'sss';
  }
}
