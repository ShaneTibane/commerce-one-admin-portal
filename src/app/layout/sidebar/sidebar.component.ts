import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

// ─── Configuration interfaces (mirrors @nexa-ui sidebar types) ────────────────

export interface SidebarBrand {
  logoSrc?: string;
  logoAlt?: string;
  name?: string;
  subtitle?: string;
  href?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  iconSvg?: string;
  route?: string;
  href?: string;
  badge?: string | number;
  badgeColor?: 'primary' | 'error' | 'warning' | 'success';
  disabled?: boolean;
  active?: boolean;
  children?: SidebarItem[];
}

export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

/**
 * App sidebar — uses nexa-ui nui-sidebar CSS classes and structure.
 * Fully configurable via inputs.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // ─── Inputs ─────────────────────────────────────────────────────────────────

  readonly brand = input<SidebarBrand>({});
  readonly groups = input<SidebarGroup[]>([]);
  readonly activeItem = input<string | null>(null);
  readonly collapsed = input(false);
  readonly showCollapseToggle = input(true);
  readonly collapseLabel = input('Collapse');
  readonly expandLabel = input('Expand');
  readonly width = input('260px');
  readonly collapsedWidth = input('64px');
  readonly theme = input<'dark' | 'light'>('dark');
  readonly cssClass = input('');

  // ─── Outputs ────────────────────────────────────────────────────────────────

  readonly itemClick = output<SidebarItem>();
  readonly collapseChange = output<boolean>();
  readonly brandClick = output<void>();

  // ─── Internal state ─────────────────────────────────────────────────────────

  readonly isCollapsed = signal(false);

  constructor() {
    // Sync initial collapsed input
    const initial = this.collapsed();
    if (initial) this.isCollapsed.set(initial);
  }

  readonly sidebarClasses = computed(() => {
    const classes = ['nui-sidebar'];
    if (this.isCollapsed()) classes.push('nui-sidebar--collapsed');
    classes.push(`nui-sidebar--${this.theme()}`);
    if (this.cssClass()) classes.push(this.cssClass());
    return classes.join(' ');
  });

  readonly sidebarStyles = computed(() => ({
    width: this.isCollapsed() ? this.collapsedWidth() : this.width(),
  }));

  // ─── Handlers ───────────────────────────────────────────────────────────────

  onBrandClick(): void {
    this.brandClick.emit();
  }

  onItemClick(item: SidebarItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
  }

  toggleCollapse(): void {
    this.isCollapsed.update(v => !v);
    this.collapseChange.emit(this.isCollapsed());
  }

  isActive(item: SidebarItem): boolean {
    return item.active || item.id === this.activeItem();
  }
}
