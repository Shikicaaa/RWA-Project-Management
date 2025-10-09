import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectUser } from '../../../auth/state/auth.reducer';
import { AuthActions } from '../../../auth/state/auth.actions';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private store = inject(Store);
  isMobileMenuOpen = false;

  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  user$ = this.store.select(selectUser);

  levelProgress$ = this.user$.pipe(
    map(user => {
      if (!user) {
        return null;
      }
      const requiredXp = this.calculateRequiredXp(user.level);
      const percentage = Math.min(100, (user.xp / requiredXp) * 100);
      return {
        level: user.level,
        xp: user.xp,
        requiredXp,
        percentage
      };
    })
  );

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  private calculateRequiredXp(level: number): number {
    const baseXp = 20;
    const growthFactor = 1.5;
    if (level === 1) return baseXp;
    return Math.floor(baseXp * Math.pow(growthFactor, level - 1));
  }
}