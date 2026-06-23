import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { startWith } from 'rxjs';
import { Posting } from '../../core/models/journal-entry.model';
import { AccountsStore } from '../../core/state/accounts.store';
import { JournalStore } from '../../core/state/journal.store';
import { toCents } from '../../core/util/money';
import { MoneyPipe } from '../../shared/money.pipe';

type LineForm = FormGroup<{
  accountId: FormControl<string>;
  debit: FormControl<number>;
  credit: FormControl<number>;
}>;

@Component({
  selector: 'app-journal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MoneyPipe],
  templateUrl: './journal.html',
  styleUrl: './journal.scss',
})
export class Journal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly accounts = inject(AccountsStore);
  private readonly journal = inject(JournalStore);

  protected readonly accountOptions = this.accounts.sorted;
  protected readonly entries = this.journal.recent;

  protected readonly form = this.fb.group({
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    memo: ['', Validators.required],
    lines: this.fb.array<LineForm>([this.newLine(), this.newLine()]),
  });

  // Recompute totals whenever a line value changes.
  private readonly linesChanged = toSignal(this.lines.valueChanges.pipe(startWith(null)), {
    initialValue: null,
  });

  protected readonly totals = computed(() => {
    this.linesChanged();
    let debits = 0;
    let credits = 0;
    for (const line of this.lines.getRawValue()) {
      debits += toCents(line.debit);
      credits += toCents(line.credit);
    }
    return { debits, credits, difference: debits - credits, balanced: debits > 0 && debits === credits };
  });

  protected get lines(): FormArray<LineForm> {
    return this.form.controls.lines;
  }

  protected addLine(): void {
    this.lines.push(this.newLine());
  }

  protected removeLine(index: number): void {
    if (this.lines.length > 2) {
      this.lines.removeAt(index);
    }
  }

  // A posting is either a debit or a credit, never both.
  protected clearOpposite(index: number, keep: 'debit' | 'credit'): void {
    const other = keep === 'debit' ? 'credit' : 'debit';
    this.lines.at(index).controls[other].setValue(0);
  }

  protected submit(): void {
    const postings = this.toPostings();
    if (this.form.invalid || !this.totals().balanced || postings.length < 2) {
      this.form.markAllAsTouched();
      return;
    }

    const { date, memo } = this.form.getRawValue();
    this.journal.add({ date, memo, lines: postings });
    this.resetForm();
  }

  protected deleteEntry(id: string): void {
    this.journal.remove(id);
  }

  protected accountName(id: string): string {
    return this.accounts.get(id)?.name ?? 'Unknown';
  }

  private toPostings(): Posting[] {
    return this.lines
      .getRawValue()
      .map((line) => ({
        accountId: line.accountId,
        debit: toCents(line.debit),
        credit: toCents(line.credit),
      }))
      .filter((line) => line.accountId && (line.debit > 0 || line.credit > 0));
  }

  private newLine(): LineForm {
    return this.fb.group({
      accountId: ['', Validators.required],
      debit: [0],
      credit: [0],
    });
  }

  private resetForm(): void {
    this.lines.clear();
    this.lines.push(this.newLine());
    this.lines.push(this.newLine());
    this.form.reset({ date: new Date().toISOString().slice(0, 10), memo: '' });
  }
}
