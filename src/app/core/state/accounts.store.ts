import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Account, AccountType } from '../models/account.model';
import { LocalStorageService } from '../storage/local-storage.service';
import { newId } from '../util/id';
import { SEED_ACCOUNTS } from '../util/seed';

const STORAGE_KEY = 'cheap-accountant/accounts/v1';

@Injectable({ providedIn: 'root' })
export class AccountsStore {
  private readonly storage = inject(LocalStorageService);

  private readonly _accounts = signal<Account[]>(
    this.storage.read<Account[]>(STORAGE_KEY, SEED_ACCOUNTS),
  );

  readonly accounts = this._accounts.asReadonly();

  readonly sorted = computed(() =>
    [...this._accounts()].sort((a, b) => a.code.localeCompare(b.code)),
  );

  readonly byId = computed(() => {
    const map = new Map<string, Account>();
    for (const account of this._accounts()) {
      map.set(account.id, account);
    }
    return map;
  });

  constructor() {
    effect(() => this.storage.write(STORAGE_KEY, this._accounts()));
  }

  add(input: { code: string; name: string; type: AccountType }): void {
    const account: Account = { id: newId(), ...input };
    this._accounts.update((list) => [...list, account]);
  }

  remove(id: string): void {
    this._accounts.update((list) => list.filter((account) => account.id !== id));
  }

  get(id: string): Account | undefined {
    return this.byId().get(id);
  }
}
