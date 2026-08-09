import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { createButton } from '@nexa-ui/button';
import type { ButtonVariant, ButtonSize, ButtonColor } from '@nexa-ui/button';

/**
 * Shared admin button — thin wrapper around @nexa-ui/button headless.
 *
 * All visual tokens/styles/states are owned by Nexa UI.
 * This component exposes a minimal API for admin-portal consumers.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './button.component.html',
  host: { class: 'contents' },
})
export class ButtonComponent {
  /** Nexa UI visual variant */
  readonly variant = input<ButtonVariant>('filled');

  /** Button size */
  readonly size = input<ButtonSize>('md');

  /** Color scheme */
  readonly color = input<ButtonColor>('primary');

  /** Disabled state */
  readonly disabled = input(false);

  /** Show loading spinner and prevent duplicate clicks */
  readonly loading = input(false);

  /** HTML button type */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /** Leading icon name (from @nexa-ui/icons) */
  readonly icon = input<string | undefined>(undefined);

  /** Expand to full container width */
  readonly fullWidth = input(false);

  /** Emits on valid click (suppressed when disabled or loading) */
  readonly clicked = output<MouseEvent>();

  /** Headless button instance — recomputed when any input changes */
  readonly instance = computed(() =>
    createButton({
      variant: this.variant(),
      size: this.size(),
      color: this.color(),
      loading: this.loading(),
      disabled: this.disabled(),
      fullWidth: this.fullWidth(),
      iconStart: this.icon(),
      type: this.type(),
    }),
  );

  handleClick(event: MouseEvent): void {
    if (this.instance().handleClick(event)) {
      this.clicked.emit(event);
    }
  }
}
