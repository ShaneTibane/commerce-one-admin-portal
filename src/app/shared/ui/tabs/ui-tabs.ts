import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  model,
  signal,
} from '@angular/core';
import { UiTabComponent } from './ui-tab';

@Component({
  selector: 'ui-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <div class="ui-tabs">
      <div class="ui-tabs__list" role="tablist" [attr.aria-label]="ariaLabel()">
        @for (tab of tabs(); track tab.id()) {
          <button
            type="button"
            class="ui-tabs__tab"
            role="tab"
            [id]="'tab-' + tab.id()"
            [attr.aria-selected]="activeId() === tab.id()"
            [attr.aria-controls]="'panel-' + tab.id()"
            [class.ui-tabs__tab--active]="activeId() === tab.id()"
            [disabled]="tab.disabled()"
            (click)="selectTab(tab.id())"
          >
            {{ tab.label() }}
            @if (tab.badge()) {
              <span class="ui-tabs__badge">{{ tab.badge() }}</span>
            }
          </button>
        }
      </div>

      @for (tab of tabs(); track tab.id()) {
        @if (activeId() === tab.id()) {
          <div
            class="ui-tabs__panel"
            role="tabpanel"
            [id]="'panel-' + tab.id()"
            [attr.aria-labelledby]="'tab-' + tab.id()"
          >
            <ng-container [ngTemplateOutlet]="tab.panel()" />
          </div>
        }
      }
    </div>
  `,
  styleUrl: './ui-tabs.scss',
})
export class UiTabsComponent {
  readonly ariaLabel = input('Tabs');
  readonly activeId = model<string>('');

  private readonly tabChildren = contentChildren(UiTabComponent);
  protected readonly tabs = signal<readonly UiTabComponent[]>([]);

  constructor() {
    effect(() => {
      const children = this.tabChildren();
      this.tabs.set(children);

      if (!this.activeId() && children.length > 0) {
        const firstEnabled = children.find((tab) => !tab.disabled()) ?? children[0];
        this.activeId.set(firstEnabled.id());
      }
    });
  }

  selectTab(id: string): void {
    this.activeId.set(id);
  }
}
