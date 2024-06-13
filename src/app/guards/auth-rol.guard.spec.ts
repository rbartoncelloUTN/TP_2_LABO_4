import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authRolGuard } from './auth-rol.guard';

describe('authRolGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authRolGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
