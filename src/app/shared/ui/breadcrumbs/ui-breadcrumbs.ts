import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { UiBreadcrumbItem } from '../types';

@Component({
  selector: 'ui-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav class="ui-breadcrumbs" aria-label="Breadcrumb">
      <ol class="ui-breadcrumbs__list">
        @for (item of items(); track $index; let last = $last) {
          <li class="ui-breadcrumbs__item">
            @if (!last && (item.route || item.href)) {
              @if (item.route) {
                <a class="ui-breadcrumbs__link" [routerLink]="item.route">{{ item.label }}</a>
              } @else {
                <a class="ui-breadcrumbs__link" [href]="item.href">{{ item.label }}</a>
              }
            } @else {
              <span class="ui-breadcrumbs__current" [attr.aria-current]="last ? 'page' : null">
                {{ item.label }}
              </span>
            }

            @if (!last) {
              <span class="ui-breadcrumbs__separator" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styleUrl: './ui-breadcrumbs.scss',
})
export class UiBreadcrumbsComponent {
  readonly items = input<UiBreadcrumbItem[]>([]);
}
