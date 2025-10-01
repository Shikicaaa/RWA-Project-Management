import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AdminActions } from '../../admin/state/admin.actions';
import { selectAll, selectIsLoading } from '../../projects/state/projects.reducer';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-projects-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-projects-list.component.html',
})
export class AllProjectsListComponent implements OnInit {
  private store = inject(Store);

  projects$ = this.store.select(selectAll);
  isLoading$ = this.store.select(selectIsLoading);

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadAllProjects());
  }
}