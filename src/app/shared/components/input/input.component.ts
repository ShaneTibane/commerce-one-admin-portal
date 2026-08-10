import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { createInput } from '@nexa-ui/inputs';
import type { InputSize, InputType } from '@nexa-ui/inputs';

export type { InputSize, InputType };

export type InputIconPosition = 'left' | 'right';

export interface InputIcon {
  path?: string;
  svg?: string;
  position?: InputIconPosition;
}

/**
 * Shared input — thin wrapper around @nexa-ui/inputs headless.
 *
 * All visual tokens/styles/states are owned by Nexa UI.
 * This component exposes a minimal API for admin-portal consumers.
 */
@Component({
  selector: 'app-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  // ─── Inputs ─────────────────────────────────────────────────────────────────

  readonly type = input<InputType>('text');
  readonly name = input('');
  readonly placeholder = input('');
  readonly size = input<InputSize>('md');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input<string | null>(null);
  readonly hint = input<string | null>(null);
  readonly label = input<string | null>(null);
  readonly icon = input<InputIcon | null>(null);
  readonly shortcutHint = input<string | null>(null);
  readonly prefix = input<string | null>(null);
  readonly suffix = input<string | null>(null);
  readonly ariaLabel = input<string | null>(null);
  readonly fullWidth = input(false);

  // ─── Outputs ────────────────────────────────────────────────────────────────

  readonly inputChange = output<string>();
  readonly inputFocus = output<FocusEvent>();
  readonly inputBlur = output<FocusEvent>();
  readonly inputKeydown = output<KeyboardEvent>();
  readonly iconClick = output<void>();

  // ─── Internal state ─────────────────────────────────────────────────────────

  readonly value = signal('');
  readonly focused = signal(false);

  private onChangeFn: (val: string) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  // ─── Headless instance — recomputed when inputs change ──────────────────────

  readonly instance = computed(() =>
    createInput({
      type: this.type(),
      name: this.name(),
      size: this.size(),
      placeholder: this.placeholder(),
      disabled: this.disabled(),
      readOnly: this.readonly(),
      error: !!this.error(),
      fullWidth: this.fullWidth(),
      prefix: this.prefix() || undefined,
      suffix: this.suffix() || undefined,
      ariaLabel: this.ariaLabel() || undefined,
    }),
  );

  readonly wrapperClasses = computed(() => {
    const inst = this.instance();
    // Apply focused state dynamically since headless captures it at creation
    const base = inst.getClasses();
    if (this.focused() && !base.includes('nui-input--focused')) {
      return base + ' nui-input--focused';
    }
    return base;
  });

  readonly iconPosition = computed(() => this.icon()?.position || 'left');

  // ─── Handlers ───────────────────────────────────────────────────────────────

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChangeFn(val);
    this.inputChange.emit(val);
  }

  onFocus(event: FocusEvent): void {
    this.focused.set(true);
    this.inputFocus.emit(event);
  }

  onBlur(event: FocusEvent): void {
    this.focused.set(false);
    this.onTouchedFn();
    this.inputBlur.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    this.inputKeydown.emit(event);
  }

  onIconClick(): void {
    this.iconClick.emit();
  }

  // ─── ControlValueAccessor ───────────────────────────────────────────────────

  writeValue(value: string): void {
    this.value.set(value || '');
  }

  registerOnChange(fn: (val: string) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Disabled managed via input signal from parent
  }
}
