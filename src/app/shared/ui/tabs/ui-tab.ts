import { ChangeDetectionStrategy, Component, input, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'ui-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-template #panel><ng-content /></ng-template>`,
})
export class UiTabComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly badge = input<string | number>();
  readonly disabled = input(false);
  readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
}
