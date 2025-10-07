import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="toggleTheme()" class="p-2 rounded-full hover:bg-primary/20">
      <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
      <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-3.536a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 18a1 1 0 011-1v-1a1 1 0 11-2 0v1a1 1 0 011 1zM5.05 14.464l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414zM5 10a1 1 0 01-1-1H3a1 1 0 110-2h1a1 1 0 011 1zm-1.536-2.121a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
    </button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
  isDarkMode = this.themeService.getCurrentTheme() === 'dark';

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setTheme(this.isDarkMode ? 'dark' : 'light');
  }
}