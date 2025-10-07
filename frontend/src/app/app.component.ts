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
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private store = inject(Store);
  private tokenService = inject(TokenService);
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);

  showLevelUpNotification = false;
  levelUpMessage = '';
  
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
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}