# Shared Component Specification

Every shared component in `src/app/shared/components/` **must** follow this spec.

## Architecture

Each component is a **thin wrapper** around a `@nexa-ui/*` headless package.

```
@nexa-ui/headless-package  →  shared component  →  admin-portal consumers
       (logic/classes)           (Angular binding)         (template usage)
```

### Responsibilities

| Layer | Owns |
|-------|------|
| **Nexa UI headless** | State machines, class generation, ARIA, validation logic |
| **Nexa UI styles** (`packages/styles/`) | All visual tokens, colors, spacing, typography, states |
| **Shared component** | Angular binding (inputs/outputs/signals), template, `ControlValueAccessor` if form control |
| **Consumer** | Configuration via inputs, reacting to outputs |

### What the shared component does NOT do

- Define its own CSS / visual styles
- Duplicate logic already in the headless package
- Import from `@nexa-ui/angular` (causes dual Angular instance at runtime)
- Use `CommonModule` / `NgIf` / `NgFor` (use `@if` / `@for` control flow)

---

## File Structure

```
src/app/shared/components/<name>/
├── <name>.component.ts        # Component class
├── <name>.component.html      # Template
└── <name>.component.spec.ts   # Tests (optional per component)
```

Barrel export in `src/app/shared/components/index.ts`.

---

## Component Class Pattern

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { createXxx } from '@nexa-ui/<package>';
import type { XxxType, XxxSize } from '@nexa-ui/<package>';

@Component({
  selector: 'app-<name>',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './<name>.component.html',
  // host: { class: 'contents' }  ← use when host element should not affect layout
})
export class XxxComponent {
  // ─── Inputs (use Angular signal inputs) ─────────────────────────────────
  readonly variant = input<XxxVariant>('default');
  readonly size = input<XxxSize>('md');
  readonly disabled = input(false);
  // ... minimal API, expose only what Nexa UI supports

  // ─── Outputs (use output()) ─────────────────────────────────────────────
  readonly clicked = output<MouseEvent>();

  // ─── Headless instance (computed, reacts to input changes) ──────────────
  readonly instance = computed(() =>
    createXxx({
      variant: this.variant(),
      size: this.size(),
      disabled: this.disabled(),
    }),
  );

  // ─── Handlers (delegate to headless, gate emissions) ────────────────────
  handleClick(event: MouseEvent): void {
    if (this.instance().handleClick(event)) {
      this.clicked.emit(event);
    }
  }
}
```

---

## Rules

1. **Selector**: `app-<name>` (e.g. `app-button`, `app-input`)
2. **Standalone**: Always `standalone: true`
3. **Change Detection**: Always `OnPush`
4. **Encapsulation**: `ViewEncapsulation.None` (global Nexa UI CSS applies)
5. **Inputs**: Use `input()` signal function — not `@Input()` decorator
6. **Outputs**: Use `output()` function — not `@Output()` decorator
7. **Headless**: Always use `computed()` wrapping the headless `createXxx()` factory
8. **Types**: Re-export relevant types from the headless package for consumer convenience
9. **No local styles**: No `styleUrl`, no component-level CSS
10. **Forms**: Implement `ControlValueAccessor` if the component is a form control
11. **Template**: Use `instance().classes` for the wrapper class binding, `instance().ariaProps` for ARIA
12. **Barrel**: Export from `src/app/shared/components/index.ts`

---

## Styles

Component CSS lives in `nexa-ui/packages/styles/nui-<name>.css` and is registered globally in `angular.json`:

```json
"styles": [
  "src/styles.scss",
  "../../../nexa-ui/packages/styles/nui-<name>.css"
]
```

Do **not** copy CSS locally. The single source of truth is the nexa-ui repo.

---

## Token Bridge

Base design tokens (`--ui-*`) and their Nexa UI mappings (`--nui-*`) are defined in:
- `nexa-ui/packages/styles/_tokens.scss`
- `nexa-ui/packages/styles/_nui-tokens.scss`

These are imported globally via `src/styles.scss`. Components never reference tokens directly.

---

## tsconfig Paths

Headless packages are mapped in `tsconfig.json`:

```json
"@nexa-ui/<package>": ["../../../nexa-ui/packages/<package>/src/index.ts"]
```

Only map **headless** packages (no Angular dependency). Never map `@nexa-ui/angular`.

---

## Checklist for New Components

- [ ] Identify the headless package (`@nexa-ui/<package>`)
- [ ] Add tsconfig path if not already present
- [ ] Create component files following the pattern above
- [ ] Use `createXxx()` in a `computed()` for the headless instance
- [ ] Template binds `instance().classes`, `instance().ariaProps`, etc.
- [ ] Copy CSS to `nexa-ui/packages/styles/nui-<name>.css` if not already there
- [ ] Register CSS in `angular.json` styles array
- [ ] Export from `shared/components/index.ts`
- [ ] Verify `tsc --noEmit` passes
- [ ] Restart dev server (angular.json changes require restart)
