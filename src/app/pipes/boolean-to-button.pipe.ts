import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToButton',
  standalone: true,
})
export class BooleanToButtonPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (value) {
      return 'Si';
    } else if (value === false) {
      return 'No';
    } else {
      return '-';
    }
  }
}
