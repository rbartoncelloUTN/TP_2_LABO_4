import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  console.log(auth.getUser());

  if (auth.getUser()) {
    return true;
  }

  return false;
};
