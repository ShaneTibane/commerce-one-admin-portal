import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="ui-card" [class.ui-card--padding-none]="padding() === 'none'">
      @if (title() || subtitle()) {
        <header class="ui-card__header">
          <div class="ui-card__heading">
            @if (title()) {
              <h3 class="ui-card__title">{{ title() }}</h3>
            }
            @if (subtitle()) {
              <p class="ui-card__subtitle">{{ subtitle() }}</p>
            }
          </div>
          <div class="ui-card__actions">
            <ng-content select="[cardActions]" />
          </div>
        </header>
      } @else {
        <header class="ui-card__header ui-card__header--custom">
          <ng-content select="[cardHeader]" />
        </header>
      }

      <div class="ui-card__body">
        <ng-content />
      </div>

      <footer class="ui-card__footer">
        <ng-content select="[cardFooter]" />
      </footer>
    </article>
  `,
  styleUrl: './ui-card.scss',
})
export class UiCardComponent {
  readonly title = input<string>();
  readonly subtitle = input<string>();
  readonly padding = input<'default' | 'none'>('default');
}
