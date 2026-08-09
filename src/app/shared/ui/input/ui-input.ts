import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { UiInputSize } from '../types';

@Component({
  selector: 'ui-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiInputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ui-input" [class.ui-input--error]="!!error()" [class.ui-input--disabled]="disabled()">
      @if (label()) {
        <label class="ui-input__label" [for]="inputId">
          {{ label() }}
          @if (required()) {
            <span class="ui-input__required" aria-hidden="true">*</span>
          }
        </label>
      }

      <div class="ui-input__control" [class]="'ui-input__control--' + size()">
        <span class="ui-input__affix ui-input__affix--prefix">
          <ng-content select="[prefix]" />
        </span>

        <input
          [id]="inputId"
          class="ui-input__field"
          [type]="type()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [attr.aria-invalid]="!!error()"
          [attr.aria-describedby]="describedBy"
          [value]="value()"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />

        <span class="ui-input__affix ui-input__affix--suffix">
          <ng-content select="[suffix]" />
        </span>
      </div>

      @if (error()) {
        <p class="ui-input__message ui-input__message--error" [id]="errorId">{{ error() }}</p>
      } @else if (hint()) {
        <p class="ui-input__message ui-input__message--hint" [id]="hintId">{{ hint() }}</p>
      }
    </div>
  `,
  styleUrl: './ui-input.scss',
})
export class UiInputComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly placeholder = input('');
  readonly hint = input<string>();
  readonly error = input<string>();
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'>('text');
  readonly size = input<UiInputSize>('md');
  readonly required = input(false);
  readonly readonly = input(false);
  readonly disabled = input(false);

  protected readonly value = signal('');
  protected readonly inputId = `ui-input-${Math.random().toString(36).slice(2, 9)}`;
  protected readonly hintId = `${this.inputId}-hint`;
  protected readonly errorId = `${this.inputId}-error`;

  protected get describedBy(): string | null {
    if (this.error()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  }

  private onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Controlled via disabled input; forms can still call this.
    void isDisabled;
  }

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }
}
