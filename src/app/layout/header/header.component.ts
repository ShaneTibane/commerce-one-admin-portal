import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { InputComponent } from '../../shared/components/input/input.component';
import type { InputIcon } from '../../shared/components/input/input.component';

// ─── Configuration interfaces (mirrors @nexa-ui/angular header types) ─────────

export interface HeaderBrand {
  logoSrc?: string;
  logoAlt?: string;
  name?: string;
  subtitle?: string;
  href?: string;
}

export interface HeaderTenant {
  id: string;
  name: string;
  icon?: string;
}

export interface HeaderUser {
  name: string;
  role?: string;
  avatarSrc?: string;
  initials?: string;
}

export interface HeaderNotification {
  id: string;
  title: string;
  message?: string;
  read?: boolean;
  timestamp?: string;
}

export interface HeaderSearchConfig {
  placeholder?: string;
  shortcutHint?: string;
  enabled?: boolean;
}

/**
 * App header — uses nexa-ui nui-header CSS classes and template structure.
 * All configuration is exposed via inputs; all actions via outputs.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  // ─── Inputs ─────────────────────────────────────────────────────────────────

  readonly brand = input<HeaderBrand>({});
  readonly search = input<HeaderSearchConfig>({ placeholder: 'Search anything...', shortcutHint: '⌘ K', enabled: true });
  readonly tenants = input<HeaderTenant[]>([]);
  readonly selectedTenant = input<HeaderTenant | null>(null);
  readonly tenantLabel = input('Tenant');
  readonly user = input<HeaderUser | null>(null);
  readonly notifications = input<HeaderNotification[]>([]);
  readonly showMenuToggle = input(true);
  readonly showTenantSelector = input(true);
  readonly showNotifications = input(true);
  readonly showHelp = input(true);
  readonly showUserProfile = input(true);
  readonly sticky = input(true);
  readonly cssClass = input('');

  // ─── Outputs ────────────────────────────────────────────────────────────────

  readonly menuToggle = output<void>();
  readonly tenantChange = output<HeaderTenant>();
  readonly searchSubmit = output<string>();
  readonly searchFocus = output<void>();
  readonly notificationClick = output<void>();
  readonly helpClick = output<void>();
  readonly userMenuClick = output<void>();
  readonly brandClick = output<void>();

  // ─── Internal state ─────────────────────────────────────────────────────────

  readonly tenantDropdownOpen = signal(false);
  readonly searchValue = signal('');

  readonly searchIcon: InputIcon = {
    path: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z',
    position: 'left',
  };

  readonly unreadCount = computed(() =>
    this.notifications().filter(n => !n.read).length
  );

  readonly headerClasses = computed(() => {
    const classes = ['nui-header'];
    if (this.sticky()) classes.push('nui-header--sticky');
    if (this.cssClass()) classes.push(this.cssClass());
    return classes.join(' ');
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onBrandClick(): void {
    this.brandClick.emit();
  }

  onSearchInput(value: string): void {
    this.searchValue.set(value);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchSubmit.emit(this.searchValue());
    }
  }

  onSearchFocus(): void {
    this.searchFocus.emit();
  }

  toggleTenantDropdown(): void {
    this.tenantDropdownOpen.update(v => !v);
  }

  selectTenant(tenant: HeaderTenant): void {
    this.tenantDropdownOpen.set(false);
    this.tenantChange.emit(tenant);
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onHelpClick(): void {
    this.helpClick.emit();
  }

  onUserMenuClick(): void {
    this.userMenuClick.emit();
  }
}
