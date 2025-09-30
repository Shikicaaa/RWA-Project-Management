import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '../../core/services/auth-api.service';
import { TokenService } from '../../core/services/token.service';
import { AuthActions } from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApiService = inject(AuthApiService);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authApiService.login(credentials).pipe(
          map(response => {
            this.tokenService.saveToken(response.access_token);
            return AuthActions.loginSuccess({ accessToken: response.access_token });
          }),
          catchError(error => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );
  
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      map(() => AuthActions.loadProfile())
    )
  );

  loadProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfileSuccess),
      tap(() => this.router.navigateByUrl('/projects'))
    ), { dispatch: false }
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadProfile),
      switchMap(() => 
        this.authApiService.getProfile().pipe(
          map(user => AuthActions.loadProfileSuccess({ user })),
          catchError(error => of(AuthActions.loadProfileFailure({ error })))
        )
      )
    )
  );
  
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ userData }) =>
        this.authApiService.register(userData).pipe(
          map(() => AuthActions.registerSuccess()),
          catchError(error => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );
  
  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => this.router.navigate(['/login']))
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.tokenService.removeToken();
        this.router.navigate(['/login']);
      })
    ), { dispatch: false }
  );
}