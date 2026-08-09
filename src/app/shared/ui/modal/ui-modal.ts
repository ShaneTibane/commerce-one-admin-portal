import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import type { UiModalSize } from '../types';

@Component({
  selector: 'ui-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
  template: `
    @if (open()) {
      <div class="ui-modal" role="presentation">
        <button
          type="button"
          class="ui-modal__backdrop"
          aria-label="Close dialog"
          (click)="onBackdropClick()"
        ></button>

        <div
          class="ui-modal__dialog"
          [class]="'ui-modal__dialog--' + size()"
          role="dialog"
          [attr.aria-modal]="true"
          [attr.aria-labelledby]="title() ? titleId : null"
        >
          <header class="ui-modal__header">
            @if (title()) {
              <h2 class="ui-modal__title" [id]="titleId">{{ title() }}</h2>
            } @else {
              <ng-content select="[modalHeader]" />
            }

            @if (closable()) {
              <button
                type="button"
                class="ui-modal__close"
                aria-label="Close"
                (click)="close()"
              >
                ×
              </button>
            }
          </header>

          <div class="ui-modal__body">
            <ng-content />
          </div>

          <footer class="ui-modal__footer">
            <ng-content select="[modalFooter]" />
          </footer>
        </div>
      </div>
    }
  `,
  styleUrl: './ui-modal.scss',
})
export class UiModalComponent {
  readonly open = model(false);
  readonly title = input<string>();
  readonly size = input<UiModalSize>('md');
  readonly closable = input(true);
  readonly closeOnBackdrop = input(true);

  readonly closed = output<void>();

  protected readonly titleId = `ui-modal-title-${Math.random().toString(36).slice(2, 9)}`;
  private previousOverflow = signal('');

  constructor() {
    effect(() => {
      if (this.open()) {
        this.previousOverflow.set(document.body.style.overflow);
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.previousOverflow();
      }
    });
  }

  close(): void {
    this.open.set(false);
    this.closed.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
    }
  }

  onEscape(): void {
    if (this.open() && this.closable()) {
      this.close();
    }
  }
}
