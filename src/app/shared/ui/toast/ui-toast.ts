import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import type { UiToastMessage } from '../types';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ui-toast"
      [class]="'ui-toast--' + toast().variant"
      role="status"
      [attr.aria-live]="toast().variant === 'danger' ? 'assertive' : 'polite'"
    >
      <div class="ui-toast__content">
        @if (toast().title) {
          <p class="ui-toast__title">{{ toast().title }}</p>
        }
        <p class="ui-toast__message">{{ toast().message }}</p>
      </div>
      <button
        type="button"
        class="ui-toast__close"
        aria-label="Dismiss notification"
        (click)="dismiss()"
      >
        ×
      </button>
    </div>
  `,
  styleUrl: './ui-toast.scss',
})
export class UiToastComponent {
  readonly toast = input.required<UiToastMessage>();

  private readonly toastService = inject(ToastService);

  dismiss(): void {
    this.toastService.dismiss(this.toast().id);
  }
}
