import { Account } from '../models/account.model';
import { JournalEntry } from '../models/journal-entry.model';

export const SEED_ACCOUNTS: Account[] = [
  { id: 'acc-cash', code: '1000', name: 'Cash', type: 'asset' },
  { id: 'acc-ar', code: '1100', name: 'Accounts Receivable', type: 'asset' },
  { id: 'acc-equipment', code: '1500', name: 'Equipment', type: 'asset' },
  { id: 'acc-ap', code: '2000', name: 'Accounts Payable', type: 'liability' },
  { id: 'acc-loan', code: '2100', name: 'Bank Loan', type: 'liability' },
  { id: 'acc-capital', code: '3000', name: "Owner's Capital", type: 'equity' },
  { id: 'acc-sales', code: '4000', name: 'Sales Revenue', type: 'income' },
  { id: 'acc-rent', code: '5000', name: 'Rent Expense', type: 'expense' },
  { id: 'acc-supplies', code: '5100', name: 'Supplies Expense', type: 'expense' },
];

export const SEED_ENTRIES: JournalEntry[] = [
  {
    id: 'je-seed-1',
    date: '2026-01-02',
    memo: 'Owner invests starting capital',
    createdAt: '2026-01-02T09:00:00.000Z',
    lines: [
      { accountId: 'acc-cash', debit: 1_000_000, credit: 0 },
      { accountId: 'acc-capital', debit: 0, credit: 1_000_000 },
    ],
  },
  {
    id: 'je-seed-2',
    date: '2026-01-05',
    memo: 'Buy equipment with cash',
    createdAt: '2026-01-05T10:30:00.000Z',
    lines: [
      { accountId: 'acc-equipment', debit: 250_000, credit: 0 },
      { accountId: 'acc-cash', debit: 0, credit: 250_000 },
    ],
  },
  {
    id: 'je-seed-3',
    date: '2026-01-12',
    memo: 'Cash sale to customer',
    createdAt: '2026-01-12T14:15:00.000Z',
    lines: [
      { accountId: 'acc-cash', debit: 48_000, credit: 0 },
      { accountId: 'acc-sales', debit: 0, credit: 48_000 },
    ],
  },
  {
    id: 'je-seed-4',
    date: '2026-01-31',
    memo: 'Pay monthly office rent',
    createdAt: '2026-01-31T16:45:00.000Z',
    lines: [
      { accountId: 'acc-rent', debit: 30_000, credit: 0 },
      { accountId: 'acc-cash', debit: 0, credit: 30_000 },
    ],
  },
];
