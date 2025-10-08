import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, of, switchMap } from 'rxjs';
import { ProjectsApiService } from '../../core/services/projects-api.service';
import { TasksApiService } from '../../core/services/tasks-api.service';
import { TasksActions } from './tasks.actions';
import { Task, TaskStatus } from '../../models/task.model';
import { AuthActions } from '../../auth/state/auth.actions';
import { ProjectsActions } from '../../projects/state/projects.actions';

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
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      switchMap(({ taskId, changes }) =>
        this.tasksApiService.updateTask(taskId, changes).pipe(
          map((updatedTask) => TasksActions.updateTaskSuccess({ 
            task: { id: updatedTask.id, changes: updatedTask } 
          })),
          catchError((error) => of(TasksActions.updateTaskFailure({ error })))
        )
      )
    )
  );
  createComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createComment),
      switchMap(({ taskId, content }) =>
        this.tasksApiService.createComment(taskId, content).pipe(
          map(comment => TasksActions.createCommentSuccess({ comment })),
          catchError(error => of(TasksActions.createCommentFailure({ error })))
        )
      )
    )
  );
  setDependencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.setDependencies),
      switchMap(({ taskId, dependencyIds }) =>
        this.tasksApiService.setDependencies(taskId, dependencyIds).pipe(
          map(updatedTask => TasksActions.setDependenciesSuccess({
            task: { id: updatedTask.id, changes: updatedTask }
          })),
          catchError(error => of(TasksActions.setDependenciesFailure({ error })))
        )
      )
    )
  );
}