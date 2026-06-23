// Amounts are stored in integer cents to avoid floating-point rounding errors.
export interface Posting {
  readonly accountId: string;
  readonly debit: number;
  readonly credit: number;
}

export interface JournalEntry {
  readonly id: string;
  readonly date: string;
  readonly memo: string;
  readonly lines: readonly Posting[];
  // Orders entries posted on the same date.
  readonly createdAt: string;
}

export function entryTotals(lines: readonly Posting[]): { debits: number; credits: number } {
  return lines.reduce(
    (acc, line) => ({ debits: acc.debits + line.debit, credits: acc.credits + line.credit }),
    { debits: 0, credits: 0 },
  );
}

export function isBalanced(lines: readonly Posting[]): boolean {
  const { debits, credits } = entryTotals(lines);
  return debits > 0 && debits === credits;
}
