# jsondate-pipe

Ya sabemos que un `Pipe`o [Filter en AngularJs](https://docs.angularjs.org/api/ng/filter/filter) no es más que un tipo de función que nos ayuda a modificar el valor de salida de una propiedad en nuestro HTML.

Angular incorpora varios pipe que nos ayudan en tareas especificas, pero queremos aprender a crear `Pipe` personalizado adaptados a la necesidad de nuestra aplicación.

## Uso práctico de un pipe personalizo
Las fechas en formato JSON de .NET tienen este formato `/Date(1420434120000)/`, utilizaremos un Pipe para formatear esto a una fecha legible.

El objetivo es crear un pipe, para utilizarlo de la siguiente forma.
`{{ fechaNacimiento | jsondate: dd-MM-yyyy }}`

Nuestro `Pipe` recibirá un valor y el formato de salida, el formato es opcional y aplicaremos uno por defecto.

## Crear pipe personalizado
Crearemos un archivo `joson-date.pipe.ts`. Exportamos una clase llamada `JsonDatePipe`

```javascript
export class JsonDatePipe {}
```

Para añadir el nombre a nuestro Pipe, utilizaremos el decorador `@Pipe` 

```javascript
import { Pipe } from '@angular/core';

@Pipe({ name: 'jsondate' })
export class JsonDatePipe {}
```

Como puedes ver, el nombre de nuestro `pipe`, es definido en la propiedad `name` del decorador.

Ya tenemos una clase configurada, podemos registrarla en nuestro `AppModule` y pasar al siguiente paso.
```javascript
// ....
import { JsonDatePipe } from './json-date.pipe';

@NgModule({
  // ....
  declarations: [ 
      JsonDatePipe
  ],
  // ....
})
export class AppModule { }
```

> Normalmente los `Pipe` son clases compartida por toda la aplicación, una buena práctica sería registrarlo en un módulo compartido y exportarla para su uso en cualquier componente de la aplicación.

## Transformación de datos con `PipeTransform`
Para transformar los datos de entrada en un pipe, implementamos la interfaz `PipeTransform` importada de `@angular/core`

```javascript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsondate' })
export class JsonDatePipe implements PipeTransform {
    transform() {}
}
```

Al implementar esta interfaz, es obligatorio utilizar la función `transform` la cual recibe un parámetro obligatorio y debe retornar un valor transformado.

```javascript
export interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
```

## Transformar valor de entrada

**¿Como recibe un pipe el valor de entrada?** Al utilizar en nuestro HTML `{{ fechaNacimiento | jsondate }}` recibiremos en la función `transform` como primer parámetro el valor de `fechaNacimiento`

```javascript
@Pipe({ name: 'jsondate' })
export class JsonDatePipe implements PipeTransform {
    transform(date: string) {
        // Tranformación...
    }
}
```

Ahora podemos implementar la lógica necesaria para retornar una fecha válida.

```javascript
...
export class JsonDatePipe implements PipeTransform {
  transform(value: string) {
    return new Date(parseInt(value.substr(6)));
  }
}
```

Más simple imposible. Creamos una instancia de Date() utilizando el valor numérico de la fecha.

Resultado: `Fri Nov 16 2018 00:03:20 GMT+0100 (CET)`

## Formatear fecha
**Opcion 1:** Utilizar el Pipe `date` de angular, el cual recibe como segundo parámetro el formato de la fecha.
`{{fecha | jsondate | date:'dd-MM-yyyy'}}`

**Opción 2:** Extender el Pipe date de angular y utilizarlo dentro de nuestro pipe personalizado.

En mi caso utilizaré la opción 2, voy a extender el pipe date para utilizar su función `transform()` y poder pasarle el formato.

## Extender Pipe en angular
Para extender un pipe en angular, necesitamos poder utilizarlo como un servicio más, esto lo logramos agregando la clase `DatePipe` en los `providers` de nuestro `AppModule`, así ya podemos utilizarlo en el inyector de dependencias.

### 1. Inyectar DatePipe
```javascript
...
import { DatePipe } from '@angular/common';
import { JsonDatePipe } from './json-date.pipe';

@NgModule({
  ...
  declarations: [ AppComponent, JsonDatePipe ],
  providers: [DatePipe],
  ...
})
export class AppModule { }
```

Ahora podemos inyectar `DatePipe` en `JsonDatePipe`
```javascript
@Pipe({name: 'jsondate'})
export class JsonDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  ...
}
```

Ahora tenemos disponible la función `datePipe.format(fecha, format)` que recibe una fecha y un formato.

### Agregar parámertros a nuestro pipe
Ahora necesitamos agregar un **segundo parámetro** a la función tranforma de nuestro `JsonPipe`, este será el formato y opcional con un valor por defecto.
```javascript
@Pipe({name: 'jsondate'})
export class JsonDatePipe implements PipeTransform {
  ...
  transform(value: string, format: string = 'dd-MM-yyyy') {
    ...
  }
}
```

### Enviar parámetro a un pipe desde el HTML
Ahora para utilizar nuestro Pipe utilizaremos la siguiente sintaxis. 
```html
{{ fecha | jsondate }} o {{ fecha: jsondate: 'formato' }}
```

## Código completo del Pipe
Aquí el código completo de nuestro pipe personalizado que recibe la **fecha en formato JSON de .NET** y la convierte a una fecha legible para el usuario.

```javascript 
// json-date.pipe.ts
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
```

Podemos utilizar todos los parámetros que existen en la [documentación oficial para el pipe `date`](https://angular.io/api/common/DatePipe).

## Conclusión
Hemos creado un pipe o tubería personalizada en angular, hemos extendido la funcionalidad del `Pipe date` y utilizado sus funciones internas.

Creo que es un buen punto de partida para hacernos una idea de lo que podemos llegar hacer con los Pipe de angular. Espero que te sirba el ejemplo para poder seguir avanzando.

## Referencias:
* [Angular DatePipe github](https://github.com/angular/angular/blob/master/packages/common/src/pipes/date_pipe.ts)
* [Angular DatePipe API](https://angular.io/api/common/DatePipe)
* [Inyección de dependencia](https://angular.io/guide/dependency-injection-in-action)
