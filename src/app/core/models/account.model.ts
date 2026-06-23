// The five account categories used in double-entry bookkeeping.
export type AccountType = 'asset' | 'liability' | 'equity' | 'income' | 'expense';

export type NormalSide = 'debit' | 'credit';

export interface Account {
  readonly id: string;
  readonly code: string;
  readonly name: string;
  readonly type: AccountType;
}

export const ACCOUNT_TYPES: readonly AccountType[] = [
  'asset',
  'liability',
  'equity',
  'income',
  'expense',
];

// Side that increases each account type's balance.
export const NORMAL_SIDE: Record<AccountType, NormalSide> = {
  asset: 'debit',
  expense: 'debit',
  liability: 'credit',
  equity: 'credit',
  income: 'credit',
};

export const ACCOUNT_TYPE_LABEL: Record<AccountType, string> = {
  asset: 'Assets',
  liability: 'Liabilities',
  equity: 'Equity',
  income: 'Income',
  expense: 'Expenses',
};
