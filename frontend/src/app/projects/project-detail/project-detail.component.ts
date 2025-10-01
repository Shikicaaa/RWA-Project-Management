import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Project } from '../../models/project.model';
import { User } from '../../models/user.model';
import { ProjectsActions } from '../state/projects.actions';
import { projectsFeature } from '../state/projects.reducer';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskDifficulty, TaskStatus } from '../../models/task.model';
import { selectAll as selectAllTasks } from '../../tasks/state/tasks.reducer';
import { TasksActions } from '../../tasks/state/tasks.actions';
import { CreateTaskDto, UpdateTaskDto } from '../../core/services/projects-api.service';
import { selectUser } from '../../auth/state/auth.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TitleCasePipe, DragDropModule],
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private actions$ = inject(Actions);

  project$!: Observable<Project | undefined>;
  currentUser$!: Observable<User | null>;
  todoTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  doneTasks$!: Observable<Task[]>;
  showCreateTaskForm = false;
  taskDifficulties = Object.values(TaskDifficulty);
  currentProjectId!: string;
  addMemberSuccessMessage: string | null = null;
  addMemberErrorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor() {}

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    difficulty: [TaskDifficulty.EASY, Validators.required],
  });

  addMemberForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  commentForm = this.fb.group({
    content: ['', Validators.required],
  });

  ngOnInit(): void {
    this.currentUser$ = this.store.select(selectUser);
    this.listenForAddMemberStatus();
    const projectId$ = this.route.params.pipe(
      map((params) => params['id']),
      filter((id) => !!id)
    );

    this.actions$.pipe(
      ofType(TasksActions.updateTaskSuccess),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      console.log('Reloading project after task update');
      this.store.dispatch(ProjectsActions.loadProject({ id: this.currentProjectId }));
    });

    projectId$.subscribe((id) => (this.currentProjectId = id));
    this.project$ = projectId$.pipe(
      map((id) => {
        this.store.dispatch(ProjectsActions.loadProject({ id }));
        return id;
      }),
      switchMap((id) =>
        this.store.select(projectsFeature.selectEntities).pipe(map((entities) => entities[id]))
      )
    );
    const allTasksInProject$ = combineLatest([projectId$, this.store.select(selectAllTasks)]).pipe(
      map(([projectId, tasks]) => tasks.filter((task) => task.project?.id === projectId))
    );
    this.todoTasks$ = allTasksInProject$.pipe(
      map((tasks) => tasks.filter((t) => t.status === TaskStatus.TO_DO))
    );
    this.inProgressTasks$ = allTasksInProject$.pipe(
      map((tasks) => tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS))
    );
    this.doneTasks$ = allTasksInProject$.pipe(
      map((tasks) => tasks.filter((t) => t.status === TaskStatus.DONE))
    );
  }

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    const task = event.item.data as Task;
    const newStatus = event.container.id as TaskStatus;

    const changes: UpdateTaskDto = { status: newStatus };
    
    this.store.dispatch(TasksActions.updateTask({ taskId: task.id, changes }));
  }
  private listenForAddMemberStatus(): void {
    this.actions$
      .pipe(ofType(ProjectsActions.addMemberSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        this.addMemberSuccessMessage = 'Member added successfuly';
        this.addMemberErrorMessage = null;
        setTimeout(() => (this.addMemberSuccessMessage = null), 5000);
      });
    this.actions$
      .pipe(ofType(ProjectsActions.addMemberFailure), takeUntil(this.destroy$))
      .subscribe(({ error }) => {
        this.addMemberErrorMessage = error.error?.message || 'Došlo je do greške.';
        this.addMemberSuccessMessage = null;
        setTimeout(() => (this.addMemberErrorMessage = null), 5000);
      });
  }
  onTaskCreateSubmit(): void {
    if (this.taskForm.invalid) return;
    const taskData = this.taskForm.getRawValue() as CreateTaskDto;
    this.store.dispatch(TasksActions.createTask({ projectId: this.currentProjectId, taskData }));
    this.showCreateTaskForm = false;
    this.taskForm.reset({ difficulty: TaskDifficulty.EASY });
  }
  onAddMemberSubmit(): void {
    if (this.addMemberForm.invalid) return;
    const email = this.addMemberForm.value.email!;
    this.store.dispatch(ProjectsActions.addMember({ projectId: this.currentProjectId, email }));
    this.addMemberForm.reset();
  }
  onCompleteTask(taskId: string): void {
    this.store.dispatch(TasksActions.completeTask({ taskId }));
  }
  onDeleteTask(taskId: string, taskTitle: string): void {
    if (confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) {
      this.store.dispatch(TasksActions.deleteTask({ taskId }));
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onCommentSubmit(taskId: string): void {
    if (this.commentForm.invalid) return;

    const content = this.commentForm.value.content!;
    this.store.dispatch(TasksActions.createComment({ taskId, content }));

    this.commentForm.reset();
  }
}