import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'tuempleo_theme';
  
  readonly isDarkMode = signal(false);
  
  constructor() {
    this.loadTheme();
    
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }
  
  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      this.isDarkMode.set(false);
    }
  }
  
  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
    localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
  }
  
  private applyTheme(isDark: boolean): void {
    const html = document.documentElement;
    
    if (isDark) {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }
  }
}
