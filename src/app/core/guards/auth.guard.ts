import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (_route, _state) => {
  const authService = inject(AuthService);

  return authService.getTokenFromPlatform().pipe(
    map(() => true),
    catchError(() => of(false))
  );
};
