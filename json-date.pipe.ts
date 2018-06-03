import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * JSONDATE PIPE
 * Recibe una fecha en formate JSON de .NEN
 */
@Pipe({name: 'jsondate'})
export class JsonDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: string, format: string = 'dd-MM-yyyy') {
    let date = new Date(parseInt(value.substr(6)));
    return this.datePipe.transform(date, format);
  }
}
