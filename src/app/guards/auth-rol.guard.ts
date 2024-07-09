import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/Auth/auth.service';
import { Firestore, collection } from 'firebase/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Roles } from '../Interfaces/user';

export const authRolGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  return auth.getUser()?.rol !== Roles.PATIENT;
};
