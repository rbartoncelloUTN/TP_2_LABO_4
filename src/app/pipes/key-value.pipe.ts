import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue',
  standalone: true,
})
export class KeyValuePipe implements PipeTransform {
  transform(value: { [key: string]: any }): { key: string; value: any }[] {
    return Object.keys(value).map((key) => ({ key, value: value[key] }));
  }
}
