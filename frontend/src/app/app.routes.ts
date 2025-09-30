import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { nonAuthGuard } from './core/guards/non-auth.guard';

export const routes: Routes = [
    { 
      path: 'login',
      canActivate: [nonAuthGuard],
      loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) 
    },
    { 
      path: 'register',
      canActivate: [nonAuthGuard],
      loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent) 
    },
    
    { 
      path: 'projects', 
      canActivate: [authGuard],
      loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES)
    },

    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: '**', redirectTo: '/projects' }
];