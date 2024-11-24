import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'RutParse',
  standalone: true,
})
export class RutParsePipe implements PipeTransform {

  transform(rut: string, ...args: unknown[]): unknown {
    rut = rut.replace(/[^\dKk]/g, '');
    if (rut.length < 9) {
      return 'RUT inválido';
    }
    rut = rut.slice(0, 9);
    const rutNumero = rut.slice(0, -1);
    const digitoVerificador = rut.slice(-1).toUpperCase();

    const rutFormateado = rutNumero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return rutFormateado +'-' + digitoVerificador;
  }

}
