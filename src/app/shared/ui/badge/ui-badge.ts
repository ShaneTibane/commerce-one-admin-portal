import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { UiBadgeSize, UiBadgeVariant } from '../types';

@Component({
  selector: 'ui-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-badge" [class]="hostClasses()">
      @if (dot()) {
        <span class="ui-badge__dot" aria-hidden="true"></span>
      }
      <ng-content />
    </span>
  `,
  styleUrl: './ui-badge.scss',
})
export class UiBadgeComponent {
  readonly variant = input<UiBadgeVariant>('default');
  readonly size = input<UiBadgeSize>('md');
  readonly dot = input(false);
  readonly pill = input(true);

  hostClasses(): string {
    return [
      `ui-badge--${this.variant()}`,
      `ui-badge--${this.size()}`,
      this.pill() ? 'ui-badge--pill' : '',
      this.dot() ? 'ui-badge--with-dot' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
