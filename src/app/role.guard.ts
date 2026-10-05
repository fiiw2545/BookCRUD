import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = () => {
  const router = inject(Router);

  const userJson = localStorage.getItem('user');

  if (!userJson) {
    return router.createUrlTree(['/login']);
  }

  const user = JSON.parse(userJson);

  if (user.level === 'ADMIN') {
    return true;
  }

  return router.createUrlTree(['/book']);
};
