import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiToastContainerComponent } from './shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UiToastContainerComponent],
  template: `
    <router-outlet />
    <ui-toast-container />
  `,
  styleUrl: './app.scss',
})
export class App {}
