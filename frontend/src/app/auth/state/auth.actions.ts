import { createAction, props } from '@ngrx/store';
import { LoginDto, RegisterDto } from '../../core/services/auth-api.service';
import { User } from '../../models/user.model';


export const AuthActions = {
  login: createAction(
    '[Auth] Login',
    props<{ credentials: LoginDto }>()
  ),

  loginSuccess: createAction(
    '[Auth API] Login Success',
    props<{ accessToken: string }>()
  ),

  loginFailure: createAction(
    '[Auth API] Login Failure',
    props<{ error: any }>()
  ),

  register: createAction(
    '[Auth] Register',
    props<{ userData: RegisterDto }>()
  ),
  registerSuccess: createAction(
    '[Auth API] Register Success'
  ),
  registerFailure: createAction(
    '[Auth API] Register Failure',
    props<{ error: any }>()
  ),

  loadProfile: createAction(
    '[Auth] Load Profile'
  ),
  loadProfileSuccess: createAction(
    '[Auth API] Load Profile Success',
    props<{ user: User }>()
  ),
  loadProfileFailure: createAction(
    '[Auth API] Load Profile Failure',
    props<{ error: any }>()
  ),
   updateUserProfile: createAction(
    '[Auth] Update User Profile',
    props<{ user: Partial<User> }>()
  ),
  logout: createAction(
    '[Auth] Logout'
  ),
};