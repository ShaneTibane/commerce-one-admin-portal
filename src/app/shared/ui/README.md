# Design System

Reusable Angular UI components for the Commerce One admin portal.

## Components

| Selector | Description |
|----------|-------------|
| `ui-button` | Primary actions with variants, sizes, loading state |
| `ui-input` | Form input with label, hint, error, prefix/suffix slots |
| `ui-card` | Content container with header, body, footer slots |
| `ui-badge` | Status labels with semantic variants |
| `ui-table` | Data table with sorting and empty state |
| `ui-dropdown` | Menu with items or custom content |
| `ui-tabs` / `ui-tab` | Tabbed navigation with content panels |
| `ui-breadcrumbs` | Hierarchical navigation trail |
| `ui-modal` | Dialog overlay with header and footer slots |
| `ui-toast-container` | Global toast host (place once in app root) |

## Usage

Import from the barrel:

```typescript
import { UiButtonComponent, UiCardComponent, ToastService } from '@app/shared/ui';
```

### Button

```html
<ui-button variant="primary" size="md">Save</ui-button>
<ui-button variant="danger" [loading]="saving()">Delete</ui-button>
```

### Input

```html
<ui-input label="Email" placeholder="you@example.com" [error]="emailError()" />
```

Works with reactive forms via `ControlValueAccessor`.

### Card

```html
<ui-card title="Orders" subtitle="Last 24 hours">
  <div cardActions>
    <ui-button variant="ghost" size="sm">View all</ui-button>
  </div>
  <!-- body -->
  <div cardFooter>
    <ui-button>Export</ui-button>
  </div>
</ui-card>
```

### Table

```typescript
columns: UiTableColumn<Order>[] = [
  { key: 'id', header: 'Order #', sortable: true },
  { key: 'total', header: 'Total', align: 'right', cell: (row) => `$${row.total}` },
];
```

```html
<ui-table [columns]="columns" [data]="orders()" (sortChange)="onSort($event)" />
```

### Dropdown

```html
<ui-dropdown [items]="menuItems" (itemSelect)="onSelect($event)">
  <ui-button dropdownTrigger variant="outline">Actions</ui-button>
</ui-dropdown>
```

### Tabs

```html
<ui-tabs [(activeId)]="activeTab">
  <ui-tab id="orders" label="Orders" badge="12">...</ui-tab>
  <ui-tab id="drivers" label="Drivers">...</ui-tab>
</ui-tabs>
```

### Breadcrumbs

```html
<ui-breadcrumbs [items]="[
  { label: 'Dashboard', route: '/' },
  { label: 'Orders' }
]" />
```

### Modal

```html
<ui-modal [(open)]="showModal" title="Confirm delete">
  <p>Are you sure?</p>
  <div modalFooter>
    <ui-button variant="ghost" (click)="showModal.set(false)">Cancel</ui-button>
    <ui-button variant="danger">Delete</ui-button>
  </div>
</ui-modal>
```

### Toasts

Add once to `app.html`:

```html
<ui-toast-container />
```

```typescript
private readonly toast = inject(ToastService);

save(): void {
  this.toast.success('Order updated');
}
```

## Design Tokens

CSS custom properties are defined in `src/styles/_tokens.scss` and applied globally via `src/styles.scss`.
