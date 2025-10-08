import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { Store } from '@ngrx/store';
import { TokenService } from './core/services/token.service';
import { AuthActions } from './auth/state/auth.actions';
import { selectIsAuthenticated, selectUser } from './auth/state/auth.reducer';
import { Subject } from 'rxjs';
import { pairwise, filter, takeUntil } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { Actions, ofType } from '@ngrx/effects';
import { TasksActions } from './tasks/state/tasks.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <div class="min-h-screen bg-background-light dark:bg-gray-900">
      <app-header></app-header>
      <main [class]="(isAuthenticated$ | async) ? 'container p-4 mx-auto' : ''">
        <router-outlet></router-outlet>
      </main>
    </div>
    
    <div *ngIf="showLevelUpNotification" class="fixed top-5 right-5 bg-primary text-white py-3 px-6 rounded-lg shadow-lg animate-bounce">
      <p class="font-bold">{{ levelUpMessage }}</p>
    </div>

    <div *ngIf="showErrorNotification" class="fixed top-20 right-5 bg-red-600 text-white py-3 px-6 rounded-lg shadow-lg">
      <p class="font-bold">Error</p>
      <p class="text-sm">{{ errorMessage }}</p>
    </div>
  `,

})
export class AppComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private store = inject(Store);
  private tokenService = inject(TokenService);
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private actions$ = inject(Actions);

  showLevelUpNotification = false;
  levelUpMessage = '';

  showErrorNotification = false;
  errorMessage = '';
  
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.themeService.initTheme();
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const token = this.tokenService.getToken();
      if (token) {
        this.store.dispatch(AuthActions.loadProfile());
      }
    }

    this.store.select(selectUser).pipe(
      pairwise(),
      filter(([prevUser, currUser]) => 
        !!prevUser && !!currUser && currUser.level > prevUser.level
      ),
      takeUntil(this.destroy$)
    ).subscribe(([prevUser, currUser]) => {
      this.levelUpMessage = `Congratulations! You've reached Level ${currUser!.level}!`;
      this.showLevelUpNotification = true;
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.showLevelUpNotification = false;
        this.cdr.detectChanges();
      }, 4000);
    });

    this.actions$.pipe(
      ofType(TasksActions.updateTaskFailure),
      takeUntil(this.destroy$)
    ).subscribe(({ error }) => {
      this.errorMessage = error.error?.message || 'An unknown error occurred.';
      this.showErrorNotification = true;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.showErrorNotification = false;
        this.cdr.detectChanges();
      }, 4000);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}