import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap } from "rxjs";
import { AdminApiService } from "../../core/services/admin-api.service";
import { AdminActions } from "./admin.actions";

@Injectable()
export class AdminEffects {
    private actions$ = inject(Actions);
    private adminApiService = inject(AdminApiService);

    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.loadUsers),
            switchMap(() => 
                this.adminApiService.getUsers().pipe(
                    map(users => AdminActions.loadUsersSuccess({ users })),
                    catchError(error => of(AdminActions.loadUsersFailure({ error })))
                )
            )
        )
    );

    updateUserRole$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.updateUserRole),
            switchMap(({ userId, role }) =>
                this.adminApiService.updateUserRole(userId, role).pipe(
                    map(user => AdminActions.updateUserRoleSuccess({ user })),
                    catchError(error => of(AdminActions.updateUserRoleFailure({ error })))
                )
            )
        )
    );

    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.deleteUser),
            switchMap(({ userId }) =>
                this.adminApiService.deleteUser(userId).pipe(
                    map(() => AdminActions.deleteUserSuccess({ userId })),
                    catchError(error => of(AdminActions.deleteUserFailure({ error })))
                )
            )
        )
    );

    loadAllProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAllProjects),
      switchMap(() => 
        this.adminApiService.getAllProjects().pipe(
          map(projects => AdminActions.loadAllProjectsSuccess({ projects })),
          catchError(error => of(AdminActions.loadAllProjectsFailure({ error })))
        )
      )
    )
  );
}