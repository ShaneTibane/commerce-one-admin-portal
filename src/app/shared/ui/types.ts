export type UiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type UiButtonSize = 'sm' | 'md' | 'lg';
export type UiBadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type UiBadgeSize = 'sm' | 'md';
export type UiInputSize = 'sm' | 'md' | 'lg';
export type UiModalSize = 'sm' | 'md' | 'lg';
export type UiToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface UiBreadcrumbItem {
  label: string;
  route?: string | string[];
  href?: string;
}

export interface UiDropdownItem {
  label: string;
  value?: string;
  icon?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface UiTableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  cell?: (row: T) => string | number | null | undefined;
}

export interface UiToastMessage {
  id: string;
  title?: string;
  message: string;
  variant: UiToastVariant;
  duration: number;
}
