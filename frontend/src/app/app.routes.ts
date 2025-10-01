import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { nonAuthGuard } from './core/guards/non-auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { adminOrManagerGuard } from './core/guards/admin-or-manager.guard';

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
    {
      path: 'admin',
      canActivate: [authGuard, adminGuard],
      loadComponent: () => import('./admin/admin-panel/admin-panel.component').then(c => c.AdminPanelComponent)
    },
    {
      path: 'all-projects',
      canActivate: [authGuard, adminOrManagerGuard],
      loadComponent: () => import('./features/all-projects-list.component/all-projects-list.component').then(c => c.AllProjectsListComponent)
    },
    { path: '', redirectTo: '/projects', pathMatch: 'full' },
    { path: '**', redirectTo: '/projects' }
];