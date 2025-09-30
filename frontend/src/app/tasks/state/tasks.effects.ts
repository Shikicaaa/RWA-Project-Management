import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';
import { ProjectsApiService } from '../../core/services/projects-api.service';
import { TasksApiService } from '../../core/services/tasks-api.service';
import { TasksActions } from './tasks.actions';
import { Task, TaskStatus } from '../../models/task.model';
import { AuthActions } from '../../auth/state/auth.actions';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private projectsApiService = inject(ProjectsApiService);
  private tasksApiService = inject(TasksApiService);

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      switchMap(({ projectId, taskData }) =>
        this.projectsApiService.createTaskInProject(projectId, taskData).pipe(
          map((task) => TasksActions.createTaskSuccess({ task })),
          catchError((error) => of(TasksActions.createTaskFailure({ error })))
        )
      )
    )
  );

  completeTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.completeTask),
      switchMap(({ taskId }) =>
        this.tasksApiService.completeTask(taskId).pipe(
          concatMap((updatedUser) => [
            TasksActions.completeTaskSuccess({ taskId, updatedUser }),
            AuthActions.updateUserProfile({ user: updatedUser }),
          ]),
          catchError((error) => of(TasksActions.completeTaskFailure({ error })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      switchMap(({ taskId }) =>
        this.tasksApiService.deleteTask(taskId).pipe(
          map(() => TasksActions.deleteTaskSuccess({ taskId })),
          catchError((error) => of(TasksActions.deleteTaskFailure({ error })))
        )
      )
    )
  );
}