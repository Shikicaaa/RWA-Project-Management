import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectUser } from '../../auth/state/auth.reducer';
import { UserRole } from '../../models/user.model';

export const adminGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUser).pipe(
    take(1),
    map(user => {
      if (user && user.role === UserRole.ADMIN) {
        return true;
      }
      return router.createUrlTree(['/projects']);
    })
  );
};