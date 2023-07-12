const { Observable } = require("rxjs");
const { filter } = require("rxjs/operators");

/*
  JavaScript posee dos maneras de manejar la asincronicidad, a través de:
  Observables y Promesas, que comparten el mismo objetivo, pero con características y
comportamientos diferentes.

¿Qué es la asincronicidad en JavaScript?
  La asincronicidad se refiere a cuando Javascript utiliza procesos asíncronos para realizar
muchas tareas a la vez, tareas que pueden tomar determinado tiempo o nunca finalizar.
  Es decir, este lenguaje de programación es un monohilo y esto significa que solo puede
hacer una cosa a la vez y la ejecución de un proceso demorará a los que vengan
posteriormente hasta que este termine.

  Es así como la lectura de archivos o las peticiones HTTP son procesos asíncronos y se
requiere de un método para manipular este tipo de procesos como los observables y promesas.
 */

/*

¿Qué son las promesas?
  Las promesas son un método algo más sencillo y directo para manipular procesos asincrónicos
en Javascript. Además, estos objetos tienen dos posibles estados:
  - Resuelto
  - Rechazado
  Dependiendo si el proceso asincrónico se ejecutó correctamente hubo algún error.

  Desde el año 2017 se especificó en el estandar de EcmaScript la posibilidad de manipular
promesas de una manera mucho más fácil con async/await. Async para especificar que una
función es asíncrona y Await para esperar por el resultado sin bloquear el hilo de ejecución.

Características de las Promesas
  - Ofrecen mayor simplicidad
  - Emiten un único valor
  - Evitan el callback hell
  - No se puede cancelar
  - Proveen una robusta API nativa de Javascript disponible desde ES 2017
  - Constituyen librerías populares como AXIOS o Fetch

*/
const doSomething = () => {
  return new Promise((resolve) => {
    // resolve("valor 1");
    // resolve("valor 2");
    /*
    este no estaria recibien el fetch porque una vez
    resulto la promesa ya no retorna los siguientes
    valores, ya que fue resuelta.
    */
    setTimeout(() => {
      resolve("valor 3");
    }, 3000);
  });
};

(async () => {
  const rta = await doSomething();
  console.log(rta);
})();


/*

¿Qué son los observables?
  Gran parte del ecosistema Angular está basado en observables y la librería RxJS es tu mejor
aliado a la hora de manipularlos. El patrón de diseño “observador” centraliza la tarea de
informar un cambio de estado de un determinado dato o la finalización de un proceso,
notificando a múltiples interesados cuando esto sucede sin necesidad de que tengan que
consultar cambios activamente.

Características de los Observables en Javascript
  - Emiten múltiples datos
  - Permiten escuchar cualquier tipo de proceso, (peticiones a una API, lectura de archivos, etc.)
  - Notifican a múltiples interesados
  - Pueden cancelarse
  - Manipulan otros datos (transformar, filtrar, etc.) con RxJS.
  - Son propensos al callback hell

 */
const doSomething$ = () => {
  return new Observable((observer) => {
    observer.next("valor 1 $");
    observer.next("valor 2 $");
    observer.next("valor 3 $");
    observer.next(null);
    setTimeout(() => {
      observer.next("valor 4 $");
    }, 5000);
    setTimeout(() => {
      observer.next(null);
    }, 8000);
    setTimeout(() => {
      observer.next("valor 5 $");
    }, 10000);
  });
};

(() => {
  const obs$ = doSomething$();
  obs$.pipe(filter((value) => value !== null)).subscribe((rta) => {
    console.log(rta);
  });
})();
