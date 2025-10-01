import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthActions } from '../state/auth.actions';
import { selectError, selectIsLoading } from '../state/auth.reducer';
import { RouterModule } from '@angular/router';
import { RegisterDto } from '../../core/services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    
    const userData: RegisterDto = {
        email: this.registerForm.value.email!,
        username: this.registerForm.value.username!,
        password: this.registerForm.value.password!
    };

    this.store.dispatch(AuthActions.register({ userData }));
  }
}