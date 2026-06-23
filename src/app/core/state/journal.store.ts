import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { Account, NORMAL_SIDE } from '../models/account.model';
import { JournalEntry, Posting } from '../models/journal-entry.model';
import { LocalStorageService } from '../storage/local-storage.service';
import { newId } from '../util/id';
import { SEED_ENTRIES } from '../util/seed';
import { AccountsStore } from './accounts.store';

const STORAGE_KEY = 'cheap-accountant/journal/v1';

export interface AccountBalance {
  readonly account: Account;
  readonly debits: number;
  readonly credits: number;
  // Net balance on the account's normal side.
  readonly balance: number;
}

export interface LedgerRow {
  readonly entryId: string;
  readonly date: string;
  readonly memo: string;
  readonly debit: number;
  readonly credit: number;
  readonly runningBalance: number;
}

@Injectable({ providedIn: 'root' })
export class JournalStore {
  private readonly storage = inject(LocalStorageService);
  private readonly accounts = inject(AccountsStore);

  private readonly _entries = signal<JournalEntry[]>(
    this.storage.read<JournalEntry[]>(STORAGE_KEY, SEED_ENTRIES),
  );

  readonly entries = this._entries.asReadonly();

  readonly recent = computed(() =>
    [...this._entries()].sort(
      (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
    ),
  );

  readonly totals = computed(() => {
    let debits = 0;
    let credits = 0;
    for (const entry of this._entries()) {
      for (const line of entry.lines) {
        debits += line.debit;
        credits += line.credit;
      }
    }
    return { debits, credits };
  });

  // One aggregated row per account (the trial balance).
  readonly balances = computed<AccountBalance[]>(() => {
    const totalsByAccount = new Map<string, { debits: number; credits: number }>();
    for (const entry of this._entries()) {
      for (const line of entry.lines) {
        const current = totalsByAccount.get(line.accountId) ?? { debits: 0, credits: 0 };
        current.debits += line.debit;
        current.credits += line.credit;
        totalsByAccount.set(line.accountId, current);
      }
    }

    return this.accounts.sorted().map((account) => {
      const totals = totalsByAccount.get(account.id) ?? { debits: 0, credits: 0 };
      const balance =
        NORMAL_SIDE[account.type] === 'debit'
          ? totals.debits - totals.credits
          : totals.credits - totals.debits;
      return { account, debits: totals.debits, credits: totals.credits, balance };
    });
  });

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this._entries()));
  }

  // Running ledger for one account, oldest posting first.
  ledgerFor(accountId: Signal<string | undefined>): Signal<LedgerRow[]> {
    return computed<LedgerRow[]>(() => {
      const id = accountId();
      const account = id ? this.accounts.get(id) : undefined;
      if (!account) {
        return [];
      }

      const debitNormal = NORMAL_SIDE[account.type] === 'debit';
      const chronological = [...this._entries()].sort(
        (a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt),
      );

      const rows: LedgerRow[] = [];
      let running = 0;
      for (const entry of chronological) {
        for (const line of entry.lines) {
          if (line.accountId !== account.id) {
            continue;
          }
          running += debitNormal ? line.debit - line.credit : line.credit - line.debit;
          rows.push({
            entryId: entry.id,
            date: entry.date,
            memo: entry.memo,
            debit: line.debit,
            credit: line.credit,
            runningBalance: running,
          });
        }
      }
      return rows;
    });
  }

  add(entry: { date: string; memo: string; lines: Posting[] }): void {
    const record: JournalEntry = {
      id: newId(),
      createdAt: new Date().toISOString(),
      ...entry,
    };
    this._entries.update((list) => [...list, record]);
  }

  remove(id: string): void {
    this._entries.update((list) => list.filter((entry) => entry.id !== id));
  }
}
