import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { ClickOutsideDirective } from '../directives/click-outside.directive';
import type { UiDropdownItem } from '../types';

@Component({
  selector: 'ui-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClickOutsideDirective],
  template: `
    <div class="ui-dropdown" uiClickOutside (uiClickOutside)="close()">
      <div class="ui-dropdown__trigger" (click)="toggle()">
        <ng-content select="[dropdownTrigger]" />
      </div>

      @if (open()) {
        <div
          class="ui-dropdown__menu"
          [class]="'ui-dropdown__menu--' + align()"
          role="menu"
          [attr.aria-label]="ariaLabel()"
        >
          @for (item of items(); track $index) {
            @if (item.divider) {
              <div class="ui-dropdown__divider" role="separator"></div>
            } @else {
              <button
                type="button"
                class="ui-dropdown__item"
                role="menuitem"
                [disabled]="item.disabled"
                [class.ui-dropdown__item--danger]="item.danger"
                (click)="selectItem(item)"
              >
                @if (item.icon) {
                  <span class="ui-dropdown__icon" aria-hidden="true">{{ item.icon }}</span>
                }
                {{ item.label }}
              </button>
            }
          }

          <ng-content select="[dropdownMenu]" />
        </div>
      }
    </div>
  `,
  styleUrl: './ui-dropdown.scss',
})
export class UiDropdownComponent {
  readonly items = input<UiDropdownItem[]>([]);
  readonly align = input<'start' | 'end'>('start');
  readonly ariaLabel = input('Menu');

  readonly itemSelect = output<UiDropdownItem>();
  readonly openChange = output<boolean>();

  protected readonly open = signal(false);

  toggle(): void {
    this.setOpen(!this.open());
  }

  close(): void {
    this.setOpen(false);
  }

  selectItem(item: UiDropdownItem): void {
    if (item.disabled || item.divider) {
      return;
    }
    this.itemSelect.emit(item);
    this.close();
  }

  private setOpen(value: boolean): void {
    this.open.set(value);
    this.openChange.emit(value);
  }
}
