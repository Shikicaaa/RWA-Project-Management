import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, inject, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout/header/header.component';
import { Store } from '@ngrx/store';
import { TokenService } from './core/services/token.service';
import { AuthActions } from './auth/state/auth.actions';
import { selectIsAuthenticated } from './auth/state/auth.reducer';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <main class="container p-4 mx-auto">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  private tokenService = inject(TokenService);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  
  isAuthenticated$ = this.store.select(selectIsAuthenticated);

  ngOnInit(): void {
    if (this.isBrowser) {
      const token = this.tokenService.getToken();
      if (token) {
        this.store.dispatch(AuthActions.loadProfile());
      }
    }
  }
}