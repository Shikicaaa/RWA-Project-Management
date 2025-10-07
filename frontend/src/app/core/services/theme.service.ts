import { Inject, Injectable, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: Theme = 'system';
  private isBrowser: boolean;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.currentTheme = (localStorage.getItem('theme') as Theme) || 'system';
    }
  }

  initTheme(): void {
    if (this.isBrowser) {
      this.setTheme(this.currentTheme);
    }
  }
  
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  setTheme(theme: Theme): void {
    this.currentTheme = theme;

    if (this.isBrowser) {
      localStorage.setItem('theme', theme);

      let applyDark = false;
      if (theme === 'system') {
        applyDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else if (theme === 'dark') {
        applyDark = true;
      }

      if (applyDark) {
        this.renderer.addClass(document.documentElement, 'dark');
      } else {
        this.renderer.removeClass(document.documentElement, 'dark');
      }
    }
  }
}