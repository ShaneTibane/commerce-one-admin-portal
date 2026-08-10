import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiToastContainerComponent } from './shared/ui';
import { ButtonComponent } from './shared/components/button/button.component';
import { HeaderComponent } from './layout/header/header.component';
import type { HeaderBrand, HeaderTenant, HeaderUser, HeaderNotification } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import type { SidebarBrand, SidebarGroup, SidebarItem } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastContainerComponent, ButtonComponent, HeaderComponent, SidebarComponent],
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

  readonly sidebarBrand: SidebarBrand = {
    name: 'Commerce One',
    subtitle: 'Admin Portal',
  };

  readonly navGroups: SidebarGroup[] = [
    {
      label: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
        { id: 'orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', badge: '12', badgeColor: 'primary' },
        { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
        { id: 'customers', label: 'Customers', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0' },
      ],
    },
    {
      label: 'Management',
      items: [
        { id: 'inventory', label: 'Inventory', icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z' },
        { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
      ],
    },
  ];

  readonly activeNavItem = signal('dashboard');
  readonly sidebarCollapsed = signal(false);

  constructor() {
    this.applyTheme(this.isDark() ? 'dark' : 'light');
  }

  toggleTheme(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.isDark.set(next === 'dark');
    this.applyTheme(next);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  onSidebarCollapse(collapsed: boolean): void {
    this.sidebarCollapsed.set(collapsed);
  }

  navigate(item: SidebarItem): void {
    this.activeNavItem.set(item.id);
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
