import { createFeature, createReducer, on } from '@ngrx/store';
import { User } from '../../models/user.model';
import { AuthActions } from './auth.actions';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.login, AuthActions.register, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(AuthActions.loginSuccess, (state, { accessToken }) => ({
      ...state,
      accessToken,
      isLoading: false,
    })),

    on(AuthActions.loadProfileSuccess, (state, { user }) => ({
      ...state,
      user,
      isAuthenticated: true,
      isLoading: false,
    })),

    on(AuthActions.loginFailure, AuthActions.registerFailure, AuthActions.loadProfileFailure, (state, { error }) => ({
      ...state,
      error,
      isLoading: false,
    })),
    on(AuthActions.updateUserProfile, (state, { user }) => ({
      ...state,
      user: state.user ? { ...state.user, ...user } : null
    })),
    on(AuthActions.logout, () => initialState)
  ),
});

export const {
  name,
  reducer,
  selectAuthState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAccessToken
} = authFeature;