import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ACCOUNT_TYPE_LABEL } from '../../core/models/account.model';
import { AccountsStore } from '../../core/state/accounts.store';
import { JournalStore } from '../../core/state/journal.store';
import { MoneyPipe } from '../../shared/money.pipe';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MoneyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly accounts = inject(AccountsStore);
  private readonly journal = inject(JournalStore);

  protected readonly typeLabel = ACCOUNT_TYPE_LABEL;
  protected readonly balances = this.journal.balances;
  protected readonly recent = computed(() => this.journal.recent().slice(0, 5));

  protected readonly accountCount = computed(() => this.accounts.accounts().length);
  protected readonly entryCount = computed(() => this.journal.entries().length);

  protected readonly totals = this.journal.totals;
  protected readonly isBalanced = computed(() => {
    const { debits, credits } = this.totals();
    return debits === credits;
  });

  // Only accounts that have postings, to keep the trial balance tidy.
  protected readonly activeBalances = computed(() =>
    this.balances().filter((row) => row.debits !== 0 || row.credits !== 0),
  );

  protected accountName(id: string): string {
    return this.accounts.get(id)?.name ?? 'Unknown';
  }
}
