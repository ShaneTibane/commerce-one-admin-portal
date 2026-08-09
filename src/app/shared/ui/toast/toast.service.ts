import { Injectable, signal } from '@angular/core';
import type { UiToastMessage, UiToastVariant } from '../types';

export interface ToastOptions {
  title?: string;
  variant?: UiToastVariant;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts = signal<UiToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(message: string, options: ToastOptions = {}): string {
    const toast: UiToastMessage = {
      id: crypto.randomUUID(),
      message,
      title: options.title,
      variant: options.variant ?? 'default',
      duration: options.duration ?? 4000,
    };

    this._toasts.update((current) => [...current, toast]);

    if (toast.duration > 0) {
      window.setTimeout(() => this.dismiss(toast.id), toast.duration);
    }

    return toast.id;
  }

  success(message: string, options: Omit<ToastOptions, 'variant'> = {}): string {
    return this.show(message, { ...options, variant: 'success' });
  }

  warning(message: string, options: Omit<ToastOptions, 'variant'> = {}): string {
    return this.show(message, { ...options, variant: 'warning' });
  }

  danger(message: string, options: Omit<ToastOptions, 'variant'> = {}): string {
    return this.show(message, { ...options, variant: 'danger' });
  }

  info(message: string, options: Omit<ToastOptions, 'variant'> = {}): string {
    return this.show(message, { ...options, variant: 'info' });
  }

  dismiss(id: string): void {
    this._toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  clear(): void {
    this._toasts.set([]);
  }
}
