import { ApplicationConfig, isDevMode, provideZonelessChangeDetection } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { authFeature } from './auth/state/auth.reducer';
import { AuthEffects } from './auth/state/auth.effects';
import { projectsFeature } from './projects/state/projects.reducer';
import { ProjectsEffects } from './projects/state/projects.effects';
import { tasksFeature } from './tasks/state/tasks.reducer';
import { TasksEffects } from './tasks/state/tasks.effects';
import { adminFeature } from './admin/state/admin.reducer';
import { AdminEffects } from './admin/state/admin.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    provideStore(),
    provideState(authFeature),
    provideState(projectsFeature),
    provideState(tasksFeature),
    provideState(adminFeature),
    provideEffects([
        AuthEffects,
        ProjectsEffects,
        TasksEffects,
        AdminEffects
    ]), 
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};