import { Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[uiClickOutside]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ClickOutsideDirective {
  readonly uiClickOutside = output<void>();

  private readonly element = inject(ElementRef<HTMLElement>);

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node | null;
    if (target && !this.element.nativeElement.contains(target)) {
      this.uiClickOutside.emit();
    }
  }
}
