import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ProjectsActions } from '../state/projects.actions';
import { selectAll, selectIsLoading } from '../state/projects.reducer';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectDto } from '../../core/services/projects-api.service';
import { combineLatest, map, Observable } from 'rxjs';
import { Project } from '../../models/project.model';
import { selectUser } from '../../auth/state/auth.reducer';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  private allProjects$ = this.store.select(selectAll);
  
  currentUser$: Observable<User | null> = this.store.select(selectUser);
  ownedProjects$!: Observable<Project[]>;
  participatingProjects$!: Observable<Project[]>;

  isLoading$ = this.store.select(selectIsLoading);
  
  showCreateForm = false; 
  
  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.store.dispatch(ProjectsActions.loadProjects());

    const projectsAndUser$ = combineLatest([
      this.allProjects$,
      this.currentUser$
    ]);

    this.ownedProjects$ = projectsAndUser$.pipe(
      map(([projects, user]) => projects.filter(p => p.owner.id === user?.id))
    );

    this.participatingProjects$ = projectsAndUser$.pipe(
      map(([projects, user]) => projects.filter(p => p.owner.id !== user?.id))
    );
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    this.projectForm.reset();
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    const projectData: CreateProjectDto = {
      name: this.projectForm.value.name!,
      description: this.projectForm.value.description!,
    };
    
    this.store.dispatch(ProjectsActions.createProject({ projectData }));

    this.showCreateForm = false;
    this.projectForm.reset();
  }
}