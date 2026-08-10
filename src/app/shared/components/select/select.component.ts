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
import { createSelect } from '@nexa-ui/selection';
import type { SelectOption, SelectionMode } from '@nexa-ui/selection';

export type { SelectOption, SelectionMode };

/**
 * Shared select — thin wrapper around @nexa-ui/selection headless.
 *
 * All visual tokens/styles/states are owned by Nexa UI.
 * This component exposes a minimal API for admin-portal consumers.
 */
@Component({
  selector: 'app-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  // ─── Inputs ─────────────────────────────────────────────────────────────────

  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input('Select...');
  readonly mode = input<SelectionMode>('single');
  readonly searchable = input(false);
  readonly clearable = input(false);
  readonly disabled = input(false);
  readonly name = input('');

  /** Label displayed above the selected value (e.g. "Tenant") */
  readonly label = input<string | null>(null);

  /** Show icon in the trigger (uses the selected option's icon field) */
  readonly showIcon = input(false);

  /** Default icon SVG path when no option icon is set */
  readonly defaultIcon = input<string | null>(null);

  // ─── Outputs ────────────────────────────────────────────────────────────────

  readonly selectionChange = output<string | string[]>();

  // ─── Internal state ─────────────────────────────────────────────────────────

  readonly value = signal<string | string[]>('');
  readonly isOpen = signal(false);
  readonly focusedIndex = signal(-1);
  readonly query = signal('');

  private onChangeFn: (val: string | string[]) => void = () => undefined;
  private onTouchedFn: () => void = () => undefined;

  // ─── Headless instance ──────────────────────────────────────────────────────

  readonly instance = computed(() =>
    createSelect({
      options: this.options(),
      mode: this.mode(),
      defaultValue: this.value()
        ? (Array.isArray(this.value()) ? this.value() as string[] : [this.value() as string])
        : undefined,
      searchable: this.searchable(),
      placeholder: this.placeholder(),
      clearable: this.clearable(),
      disabled: this.disabled(),
      onChange: (val) => {
        this.value.set(val);
        this.onChangeFn(val);
        this.selectionChange.emit(val);
      },
      onOpen: () => this.isOpen.set(true),
      onClose: () => {
        this.isOpen.set(false);
        this.query.set('');
        this.onTouchedFn();
      },
    }),
  );

  /** The currently selected option object (for icon/label rendering) */
  readonly selectedOption = computed(() => {
    const sel = this.instance().selected;
    if (sel.length === 0) return null;
    return this.options().find(o => o.value === sel[0]) || null;
  });

  // ─── Handlers ───────────────────────────────────────────────────────────────

  onTriggerClick(): void {
    this.instance().toggle();
    this.syncState();
  }

  onKeydown(event: KeyboardEvent): void {
    this.instance().handleKeyDown(event.key);
    this.syncState();
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
    }
  }

  onOptionClick(value: string): void {
    this.instance().select(value);
    this.syncState();
  }

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.instance().setQuery(val);
    this.query.set(val);
    this.syncState();
  }

  onClear(event: MouseEvent): void {
    event.stopPropagation();
    this.instance().clear();
    this.syncState();
  }

  private syncState(): void {
    const inst = this.instance();
    this.isOpen.set(inst.isOpen);
    this.focusedIndex.set(inst.focusedIndex);
  }

  // ─── ControlValueAccessor ───────────────────────────────────────────────────

  writeValue(value: string | string[]): void {
    this.value.set(value || (this.mode() === 'multiple' ? [] : ''));
  }

  registerOnChange(fn: (val: string | string[]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // Disabled managed via input signal from parent
  }
}
