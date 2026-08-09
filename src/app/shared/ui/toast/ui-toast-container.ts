import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UiToastComponent } from './ui-toast';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toast-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiToastComponent],
  template: `
    <div class="ui-toast-container" aria-live="polite" aria-relevant="additions">
      @for (toast of toastService.toasts(); track toast.id) {
        <ui-toast [toast]="toast" />
      }
    </div>
  `,
  styleUrl: './ui-toast-container.scss',
})
export class UiToastContainerComponent {
  protected readonly toastService = inject(ToastService);
}
