import { Pipe, PipeTransform } from '@angular/core';
import { formatMoney } from '../core/util/money';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(cents: number | null | undefined): string {
    return formatMoney(cents ?? 0);
  }
}
