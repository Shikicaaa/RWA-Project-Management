import { createAction, props } from '@ngrx/store';
import { User, UserRole } from '../../models/user.model';
import { Project } from '../../models/project.model';

export const AdminActions = {
  loadUsers: createAction('[Admin] Load Users'),
  loadUsersSuccess: createAction('[Admin API] Load Users Success', props<{ users: User[] }>()),
  loadUsersFailure: createAction('[Admin API] Load Users Failure', props<{ error: any }>()),

  updateUserRole: createAction('[Admin] Update User Role', props<{ userId: string; role: UserRole }>()),
  updateUserRoleSuccess: createAction('[Admin API] Update User Role Success', props<{ user: User }>()),
  updateUserRoleFailure: createAction('[Admin API] Update User Role Failure', props<{ error: any }>()),

  deleteUser: createAction('[Admin] Delete User', props<{ userId: string }>()),
  deleteUserSuccess: createAction('[Admin API] Delete User Success', props<{ userId: string }>()),
  deleteUserFailure: createAction('[Admin API] Delete User Failure', props<{ error: any }>()),

  loadAllProjects: createAction('[Admin] Load All Projects'),
  loadAllProjectsSuccess: createAction('[Admin API] Load All Projects Success', props<{ projects: Project[] }>()),
  loadAllProjectsFailure: createAction('[Admin API] Load All Projects Failure', props<{ error: any }>()),
};