import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = 'Cheap Accountant';
  protected readonly nav = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/journal', label: 'Journal', icon: '📝' },
    { path: '/ledger', label: 'Ledger', icon: '📚' },
    { path: '/accounts', label: 'Accounts', icon: '🏦' },
  ] as const;
}
