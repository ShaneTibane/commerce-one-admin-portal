import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiToastContainerComponent, UiButtonComponent } from './shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastContainerComponent, UiButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  readonly isDark = signal(this.getInitialTheme() === 'dark');

  constructor() {
    this.applyTheme(this.isDark() ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.isDark.set(next === 'dark');
    this.applyTheme(next);
  }

  private applyTheme(theme: 'light' | 'dark'): void {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('nui-theme', theme);
    } catch {
      // Storage may be unavailable
    }
  }

  private getInitialTheme(): 'light' | 'dark' {
    try {
      const stored = localStorage.getItem('nui-theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch {
      // ignore
    }

    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }
}
