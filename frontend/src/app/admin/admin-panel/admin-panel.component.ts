import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AdminActions } from '../state/admin.actions';
import { selectAll } from '../state/admin.reducer';
import { User, UserRole } from '../../models/user.model';
import { selectUser } from '../../auth/state/auth.reducer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent implements OnInit {
  private store = inject(Store);

  users$ = this.store.select(selectAll).pipe(
    tap(users => console.log('KORISNICI U FRONTEND KOMPONENTI:', users))
  );
  currentUser$: Observable<User | null> = this.store.select(selectUser);

  userRoles = [UserRole.ADMIN, UserRole.PROJECT_MANAGER, UserRole.MEMBER];

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadUsers());
  }

  onRoleChange(event: Event, user: User): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value as UserRole;
    this.store.dispatch(AdminActions.updateUserRole({ userId: user.id, role: newRole }));
  }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.store.dispatch(AdminActions.deleteUser({ userId }));
    }
  }
}