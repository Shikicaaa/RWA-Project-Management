import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ProjectsActions } from '../state/projects.actions';
import { selectAll, selectIsLoading } from '../state/projects.reducer';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateProjectDto } from '../../core/services/projects-api.service';
import { tap } from 'rxjs/internal/operators/tap';

@Component({
  selector: 'app-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './projects-list.component.html',
})
export class ProjectsListComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  projects$ = this.store.select(selectAll);
  isLoading$ = this.store.select(selectIsLoading);
  
  showCreateForm = false; 
  
  projectForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    this.store.dispatch(ProjectsActions.loadProjects());

    this.projects$.pipe(
      tap(projectsFromState => console.log('PROJEKTI IZ STATE-A U KOMPONENTI:', projectsFromState)));
    // ).subscribe();
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

    // TODO: Sakriti formu nakon uspešnog kreiranja.
    this.showCreateForm = false;
    this.projectForm.reset();
  }
}