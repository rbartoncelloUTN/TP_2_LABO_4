import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateHour',
  standalone: true,
})
export class DateHourPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const [hour, minutes] = value.split(':');

    if (Number(hour) > 12) {
      return `${Number(hour) - 12}:${minutes} PM`;
    }

    return `${hour}:${minutes} AM`;
  }
}
