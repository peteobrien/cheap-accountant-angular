import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ACCOUNT_TYPE_LABEL,
  ACCOUNT_TYPES,
  AccountType,
} from '../../core/models/account.model';
import { AccountsStore } from '../../core/state/accounts.store';
import { JournalStore } from '../../core/state/journal.store';
import { MoneyPipe } from '../../shared/money.pipe';

interface AccountGroup {
  readonly type: AccountType;
  readonly label: string;
  readonly rows: { id: string; code: string; name: string; balance: number }[];
}

@Component({
  selector: 'app-accounts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, MoneyPipe],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss',
})
export class Accounts {
  private readonly accounts = inject(AccountsStore);
  private readonly journal = inject(JournalStore);
  private readonly fb = inject(FormBuilder);

  protected readonly types = ACCOUNT_TYPES;
  protected readonly typeLabel = ACCOUNT_TYPE_LABEL;

  // Typed, non-nullable reactive form.
  protected readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.pattern(/^\d{3,6}$/)]],
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['asset' as AccountType, Validators.required],
  });

  protected readonly groups = computed<AccountGroup[]>(() => {
    const balanceById = new Map(this.journal.balances().map((b) => [b.account.id, b.balance]));
    return ACCOUNT_TYPES.map((type) => ({
      type,
      label: ACCOUNT_TYPE_LABEL[type],
      rows: this.accounts
        .sorted()
        .filter((account) => account.type === type)
        .map((account) => ({
          id: account.id,
          code: account.code,
          name: account.name,
          balance: balanceById.get(account.id) ?? 0,
        })),
    })).filter((group) => group.rows.length > 0);
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.accounts.add(this.form.getRawValue());
    this.form.reset({ code: '', name: '', type: 'asset' });
  }

  protected remove(id: string): void {
    this.accounts.remove(id);
  }
}
