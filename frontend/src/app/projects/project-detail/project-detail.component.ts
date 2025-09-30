import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { Project } from '../../models/project.model';
import { ProjectsActions } from '../state/projects.actions';
import { projectsFeature } from '../state/projects.reducer';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskDifficulty, TaskStatus } from '../../models/task.model';
import { selectAll as selectAllTasks } from '../../tasks/state/tasks.reducer';
import { TasksActions } from '../../tasks/state/tasks.actions';
import { CreateTaskDto } from '../../core/services/projects-api.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  project$!: Observable<Project | undefined>;
  todoTasks$!: Observable<Task[]>;
  inProgressTasks$!: Observable<Task[]>;
  doneTasks$!: Observable<Task[]>;

  showCreateTaskForm = false;
  taskDifficulties = Object.values(TaskDifficulty);
  currentProjectId!: string;

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    difficulty: [TaskDifficulty.EASY, Validators.required],
  });

  ngOnInit(): void {
    const projectId$ = this.route.params.pipe(
      map(params => params['id']),
      filter(id => !!id)
    );

    projectId$.subscribe(id => this.currentProjectId = id);

    this.project$ = projectId$.pipe(
      map(id => {
        this.store.dispatch(ProjectsActions.loadProject({ id }));
        return id;
      }),
      switchMap(id => this.store.select(projectsFeature.selectEntities).pipe(
        map(entities => entities[id])
      ))
    );

    const allTasksInProject$ = combineLatest([
      projectId$,
      this.store.select(selectAllTasks)
    ]).pipe(
      map(([projectId, tasks]) => tasks.filter(task => task.project?.id === projectId))
    );

    this.todoTasks$ = allTasksInProject$.pipe(
      map(tasks => tasks.filter(t => t.status === TaskStatus.TO_DO))
    );
    this.inProgressTasks$ = allTasksInProject$.pipe(
      map(tasks => tasks.filter(t => t.status === TaskStatus.IN_PROGRESS))
    );
    this.doneTasks$ = allTasksInProject$.pipe(
      map(tasks => tasks.filter(t => t.status === TaskStatus.DONE))
    );
  }

  onTaskCreateSubmit(): void {
    if (this.taskForm.invalid) return;
    const taskData = this.taskForm.getRawValue() as CreateTaskDto;
    this.store.dispatch(TasksActions.createTask({ projectId: this.currentProjectId, taskData }));
    this.showCreateTaskForm = false;
    this.taskForm.reset({ difficulty: TaskDifficulty.EASY });
  }

  onCompleteTask(taskId: string): void {
    console.log('Dispatched completeTask action for taskId:', taskId);
    this.store.dispatch(TasksActions.completeTask({ taskId }));
  }

  onDeleteTask(taskId: string, taskTitle: string): void {
    if (confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) {
      this.store.dispatch(TasksActions.deleteTask({ taskId }));
    }
  }
}