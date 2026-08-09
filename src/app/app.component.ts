import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiToastContainerComponent } from './shared/ui';
import { ButtonComponent } from './shared/components/button/button.component';
import { HeaderComponent } from './layout/header/header.component';
import type { HeaderBrand, HeaderTenant, HeaderUser, HeaderNotification } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastContainerComponent, ButtonComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  readonly isDark = signal(this.getInitialTheme() === 'dark');

  readonly brand: HeaderBrand = {
    name: 'Commerce One',
    subtitle: 'Admin Portal',
  };

  readonly tenants: HeaderTenant[] = [
    { id: '1', name: 'Acme Corp' },
    { id: '2', name: 'Globex Inc' },
    { id: '3', name: 'Initech' },
  ];

  readonly selectedTenant = signal<HeaderTenant>(this.tenants[0]);

  readonly user: HeaderUser = {
    name: 'Shane Tibane',
    role: 'Admin',
    initials: 'ST',
  };

  readonly notifications = signal<HeaderNotification[]>([
    { id: '1', title: 'New order received', read: false },
    { id: '2', title: 'Payment processed', read: true },
  ]);

  constructor() {
    this.applyTheme(this.isDark() ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.isDark.set(next === 'dark');
    this.applyTheme(next);
  }

  toggleSidebar(): void {
    // TODO: implement sidebar toggle
  }

  onTenantChange(tenant: HeaderTenant): void {
    this.selectedTenant.set(tenant);
  }

  onSearch(query: string): void {
    console.log('Search:', query);
  }

  openNotifications(): void {
    console.log('Open notifications');
  }

  openHelp(): void {
    console.log('Open help');
  }

  toggleUserMenu(): void {
    console.log('Toggle user menu');
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
