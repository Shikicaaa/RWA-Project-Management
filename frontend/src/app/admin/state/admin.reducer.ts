import { createFeature, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { User } from '../../models/user.model';
import { AdminActions } from './admin.actions';

export interface AdminState extends EntityState<User> {
  isLoading: boolean;
  error: any | null;
}

export const adminAdapter = createEntityAdapter<User>();

export const initialState: AdminState = adminAdapter.getInitialState({
  isLoading: false,
  error: null,
});

export const adminFeature = createFeature({
  name: 'admin',
  reducer: createReducer(
    initialState,
    on(AdminActions.loadUsers, (state) => ({ ...state, isLoading: true })),
    on(AdminActions.loadUsersSuccess, (state, { users }) => 
      adminAdapter.setAll(users, { ...state, isLoading: false })
    ),
    on(AdminActions.loadUsersFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
    
    on(AdminActions.updateUserRoleSuccess, (state, { user }) => 
      adminAdapter.updateOne({ id: user.id, changes: user }, state)
    ),

    on(AdminActions.deleteUserSuccess, (state, { userId }) =>
      adminAdapter.removeOne(userId, state)
    )
  ),
});

export const { selectAll } = adminAdapter.getSelectors(adminFeature.selectAdminState);