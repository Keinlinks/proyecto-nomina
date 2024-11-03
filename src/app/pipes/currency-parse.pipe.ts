import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appCurrencyParse',
  standalone: true,
})
export class CurrencyParsePipe implements PipeTransform {

  transform(value: number): string {

    return new Intl.NumberFormat('es-CL').format(value);
  }
}
