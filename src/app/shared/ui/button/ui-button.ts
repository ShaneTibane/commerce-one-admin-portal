import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { UiButtonSize, UiButtonVariant } from '../types';

@Component({
  selector: 'ui-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.type]="type()"
      class="ui-button"
      [class]="hostClasses()"
      [disabled]="disabled() || loading()"
      [attr.aria-busy]="loading()"
    >
      @if (loading()) {
        <span class="ui-button__spinner" aria-hidden="true"></span>
      }
      <span class="ui-button__content" [class.ui-button__content--hidden]="loading()">
        <ng-content />
      </span>
    </button>
  `,
  styleUrl: './ui-button.scss',
})
export class UiButtonComponent {
  readonly variant = input<UiButtonVariant>('primary');
  readonly size = input<UiButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly fullWidth = input(false);

  hostClasses(): string {
    return [
      `ui-button--${this.variant()}`,
      `ui-button--${this.size()}`,
      this.fullWidth() ? 'ui-button--full' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
