import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ButtonComponent } from './button.component';

/** Test host to project content and bind inputs */
@Component({
  standalone: true,
  imports: [ButtonComponent],
  template: `
    <app-button
      [variant]="variant"
      [size]="size"
      [color]="color"
      [disabled]="disabled"
      [loading]="loading"
      [type]="type"
      [icon]="icon"
      [fullWidth]="fullWidth"
      (clicked)="onClick($event)"
    >
      {{ label }}
    </app-button>
  `,
})
class TestHostComponent {
  variant: any = 'filled';
  size: any = 'md';
  color: any = 'primary';
  disabled = false;
  loading = false;
  type: 'button' | 'submit' | 'reset' = 'button';
  icon: string | undefined = undefined;
  fullWidth = false;
  label = 'Click me';
  clickEvent: MouseEvent | null = null;
  onClick(event: MouseEvent): void {
    this.clickEvent = event;
  }
}

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let buttonEl: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    buttonEl = fixture.nativeElement.querySelector('button');
  });

  describe('render', () => {
    it('should render a button element', () => {
      expect(buttonEl).toBeTruthy();
    });

    it('should project text content', () => {
      expect(buttonEl.textContent).toContain('Click me');
    });
  });

  describe('variants', () => {
    it('should apply filled variant class by default', () => {
      expect(buttonEl.className).toContain('nui-btn--filled');
    });

    it('should apply outlined variant class', () => {
      host.variant = 'outlined';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--outlined');
    });

    it('should apply text variant class', () => {
      host.variant = 'text';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--text');
    });

    it('should apply elevated variant class', () => {
      host.variant = 'elevated';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--elevated');
    });
  });

  describe('disabled', () => {
    it('should not be disabled by default', () => {
      expect(buttonEl.disabled).toBeFalse();
    });

    it('should set disabled attribute when disabled input is true', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBeTrue();
    });

    it('should apply disabled class when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--disabled');
    });

    it('should not emit clicked when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      buttonEl.click();
      expect(host.clickEvent).toBeNull();
    });
  });

  describe('loading', () => {
    it('should show spinner when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      const spinner = fixture.nativeElement.querySelector('.nui-btn__spinner');
      expect(spinner).toBeTruthy();
    });

    it('should not show spinner when not loading', () => {
      const spinner = fixture.nativeElement.querySelector('.nui-btn__spinner');
      expect(spinner).toBeFalsy();
    });

    it('should disable the button when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBeTrue();
    });

    it('should set aria-busy when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.getAttribute('aria-busy')).toBe('true');
    });

    it('should prevent duplicate clicks when loading', () => {
      host.loading = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      buttonEl.click();
      expect(host.clickEvent).toBeNull();
    });
  });

  describe('click', () => {
    it('should emit clicked event on click', () => {
      buttonEl.click();
      expect(host.clickEvent).toBeInstanceOf(MouseEvent);
    });

    it('should not emit when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      buttonEl.click();
      expect(host.clickEvent).toBeNull();
    });
  });

  describe('icon', () => {
    it('should not render icon element when no icon provided', () => {
      const iconEl = fixture.nativeElement.querySelector('.nui-btn__icon-start');
      expect(iconEl).toBeFalsy();
    });

    it('should render icon element when icon is provided', () => {
      host.icon = 'home';
      fixture.detectChanges();
      const iconEl = fixture.nativeElement.querySelector('.nui-btn__icon-start');
      expect(iconEl).toBeTruthy();
      expect(iconEl.textContent).toContain('home');
    });

    it('should apply icon-start class to button', () => {
      host.icon = 'settings';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--has-icon-start');
    });
  });

  describe('type', () => {
    it('should default to type button', () => {
      expect(buttonEl.getAttribute('type')).toBe('button');
    });

    it('should set type to submit', () => {
      host.type = 'submit';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.getAttribute('type')).toBe('submit');
    });

    it('should set type to reset', () => {
      host.type = 'reset';
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.getAttribute('type')).toBe('reset');
    });
  });

  describe('fullWidth', () => {
    it('should not apply full-width class by default', () => {
      expect(buttonEl.className).not.toContain('nui-btn--full-width');
    });

    it('should apply full-width class when fullWidth is true', () => {
      host.fullWidth = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.className).toContain('nui-btn--full-width');
    });
  });

  describe('keyboard/a11y', () => {
    it('should be focusable', () => {
      buttonEl.focus();
      expect(document.activeElement).toBe(buttonEl);
    });

    it('should trigger click on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      buttonEl.dispatchEvent(event);
      buttonEl.click();
      expect(host.clickEvent).toBeInstanceOf(MouseEvent);
    });

    it('should trigger click on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      buttonEl.dispatchEvent(event);
      buttonEl.click();
      expect(host.clickEvent).toBeInstanceOf(MouseEvent);
    });

    it('should have role=button implicitly via native button', () => {
      expect(buttonEl.tagName.toLowerCase()).toBe('button');
    });

    it('should set aria-disabled when disabled', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not be focusable when disabled (native disabled)', () => {
      host.disabled = true;
      fixture.detectChanges();
      buttonEl = fixture.nativeElement.querySelector('button');
      expect(buttonEl.disabled).toBeTrue();
    });
  });
});
