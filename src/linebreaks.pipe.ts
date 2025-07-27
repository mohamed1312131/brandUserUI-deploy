import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true, // ✅ required for standalone usage
  name: 'linebreaks'
})
export class LinebreaksPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value
      .replace(/ /g, '&nbsp;')      // preserve spacing
      .replace(/\n/g, '<br>');      // convert newlines to <br>
  }
}
