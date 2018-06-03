import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * JSONDATE PIPE
 * Recibe una fecha en formate JSON de .NET
 * 
 * 1 - Agrega `DatePipe` en los providers: [] de tu aplicación
 * 2 - Agregar `JsonDatePipe` entre los declarations: [] de tu aplicación
 * 3 - Utilizarlo en tus plantillas: {{ fecha | jsondate:'format - opcional' }}
 */
@Pipe({name: 'jsondate'})
export class JsonDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: string, format: string = 'dd-MM-yyyy') {
    let date = new Date(parseInt(value.substr(6)));
    return this.datePipe.transform(date, format);
  }
}
