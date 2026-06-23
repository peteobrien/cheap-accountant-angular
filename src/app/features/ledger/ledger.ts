import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NORMAL_SIDE, ACCOUNT_TYPE_LABEL } from '../../core/models/account.model';
import { AccountsStore } from '../../core/state/accounts.store';
import { JournalStore } from '../../core/state/journal.store';
import { MoneyPipe } from '../../shared/money.pipe';

@Component({
  selector: 'app-ledger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoneyPipe],
  templateUrl: './ledger.html',
  styleUrl: './ledger.scss',
})
export class Ledger {
  private readonly accounts = inject(AccountsStore);
  private readonly journal = inject(JournalStore);
  private readonly router = inject(Router);

  // Populated from the :accountId route param.
  readonly accountId = input<string>();

  protected readonly normalSide = NORMAL_SIDE;
  protected readonly typeLabel = ACCOUNT_TYPE_LABEL;
  protected readonly accountOptions = this.accounts.sorted;

  protected readonly account = computed(() => {
    const id = this.accountId();
    return id ? this.accounts.get(id) : undefined;
  });

  protected readonly rows = this.journal.ledgerFor(this.accountId);

  protected readonly closingBalance = computed(() => {
    const rows = this.rows();
    return rows.length > 0 ? rows[rows.length - 1].runningBalance : 0;
  });

  protected select(id: string): void {
    void this.router.navigate(['/ledger', id]);
  }
}
