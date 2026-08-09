import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { UiTableColumn } from '../types';

@Component({
  selector: 'ui-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ui-table" [class.ui-table--striped]="striped()" [class.ui-table--hoverable]="hoverable()">
      <table>
        <thead>
          <tr>
            @for (column of columns(); track column.key) {
              <th
                [style.width]="column.width ?? null"
                [class]="'ui-table__cell--' + (column.align ?? 'left')"
                [class.ui-table__cell--sortable]="column.sortable"
                [attr.aria-sort]="sortKey() === column.key ? sortDirection() : null"
                (click)="column.sortable ? onSort(column.key) : null"
              >
                <span class="ui-table__header-content">
                  {{ column.header }}
                  @if (column.sortable && sortKey() === column.key) {
                    <span class="ui-table__sort-icon" aria-hidden="true">
                      {{ sortDirection() === 'asc' ? '↑' : '↓' }}
                    </span>
                  }
                </span>
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @if (data().length === 0) {
            <tr>
              <td class="ui-table__empty" [attr.colspan]="columns().length">
                {{ emptyMessage() }}
              </td>
            </tr>
          } @else {
            @for (row of data(); track $index) {
              <tr (click)="rowClick.emit(row)">
                @for (column of columns(); track column.key) {
                  <td [class]="'ui-table__cell--' + (column.align ?? 'left')">
                    {{ resolveCell(row, column) }}
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './ui-table.scss',
})
export class UiTableComponent<T extends Record<string, unknown>> {
  readonly columns = input.required<UiTableColumn<T>[]>();
  readonly data = input<T[]>([]);
  readonly striped = input(true);
  readonly hoverable = input(true);
  readonly emptyMessage = input('No records found');
  readonly sortKey = input<string | null>(null);
  readonly sortDirection = input<'asc' | 'desc'>('asc');

  readonly sortChange = output<{ key: string; direction: 'asc' | 'desc' }>();
  readonly rowClick = output<T>();

  resolveCell(row: T, column: UiTableColumn<T>): string {
    if (column.cell) {
      return String(column.cell(row) ?? '');
    }
    return String(row[column.key] ?? '');
  }

  onSort(key: string): void {
    const direction =
      this.sortKey() === key && this.sortDirection() === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ key, direction });
  }
}
