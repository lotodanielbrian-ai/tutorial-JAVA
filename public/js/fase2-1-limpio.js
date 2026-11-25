// Java INPRO — Fase 2, tramo Código limpio (lecciones 101 a 104).
// Las lecciones van en LESSONS_F2: agregarlas a LESSONS rompería el certificado y el ranking de la Fase 1.
var LESSONS_F2 = typeof LESSONS_F2 === 'undefined' ? [] : LESSONS_F2;
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

function f2Mini(q, a) {
  return `<div class="analogy-card"><p><strong>${q}</strong></p><p class="quiz-reveal" tabindex="0" role="button" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click()}" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ ${a}</p></div>`;
}
function f2Card(emoji, title, html) {
  return `<div class="analogy-card"><span class="emoji-big">${emoji}</span><h4>${title}</h4>${html}</div>`;
}
function f2Pc(title, steps) {
  return `<div class="analogy-card"><h4>🖥️ En tu computadora: ${title}</h4><ol style="padding-left:20px;line-height:1.8">${steps.map(function (s) { return '<li>' + s + '</li>'; }).join('')}</ol></div>`;
}

LESSONS_F2.push({
  id: 101, level: 'limpio', levelLabel: 'Código limpio', stars: '⭐⭐',
  title: 'Deuda técnica y código limpio',
  desc: 'Entendé por qué un programa que funciona puede ser un problema, y escribí código que otra persona pueda leer.',
  simple: () => `
${f2Card('💳', 'Pensalo así...', `<p>La <strong>deuda técnica</strong> es como pagar con tarjeta lo que no podés pagar hoy. Te sacás el problema de encima, pero la cuenta vuelve con intereses.</p>
<p>Un arreglo "atado con alambre" te salva esta semana. Dentro de dos meses, cada cambio cerca de ese código cuesta el doble, porque primero hay que entender qué hiciste.</p>`)}
${f2Card('🍝', 'Código espagueti', `<p>Si metés cada cosa nueva donde queda más cerca, todo termina enredado: tirás de un fideo y se mueve el plato entero. El <strong>código limpio</strong> es lo contrario: cada parte hace una sola cosa y se entiende al leerla.</p>`)}
${f2Mini('¿Por qué x es un mal nombre?', 'Porque dentro de dos semanas nadie sabe si es una edad, un precio o una altura. edadUsuario lo dice todo.')}
${f2Mini('¿La deuda técnica es siempre un error?', 'No: a veces conviene tomarla para llegar a una fecha. El problema es no pagarla nunca.')}
${f2Mini('¿Qué es hardcodear?', 'Dejar un valor clavado en el código, como un 21 de IVA repetido. Cuando cambia, hay que buscarlo por todos lados.')}`,
  tutorial: () => `
<div class="ts"><h3>Las reglas de nombrado</h3>
<p>Un nombre tiene que contar qué guarda o qué hace, sin obligarte a leer el resto del código.</p>
${cb('Antes y después', `// Antes: hay que adivinar
int x = 28;
double c(double a, double b) { return a - a * b / 100; }

// Después: se entiende solo
int edadUsuario = 28;
double calcularSueldoNeto(double sueldoBruto, double porcentajeDescuento) {
    return sueldoBruto - sueldoBruto * porcentajeDescuento / 100;
}`)}
<table class="sym-tbl"><thead><tr><th>Elemento</th><th>Regla</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td>Variable</td><td>Sustantivo con contexto</td><td><code>saldoDisponible</code></td></tr>
<tr><td>Método</td><td>Verbo que dice qué hace</td><td><code>calcularTotal()</code></td></tr>
<tr><td>Clase</td><td>La entidad que representa</td><td><code>Factura</code></td></tr>
<tr><td>Constante</td><td>Mayúsculas con guion bajo</td><td><code>IVA_GENERAL</code></td></tr>
</tbody></table></div>
<div class="ts"><h3>Un método limpio</h3>
<p>Tiene nombre claro, <strong>una sola responsabilidad</strong> y, si hace falta, documentación con Javadoc.</p>
${cb('Javadoc', `/**
 * Calcula el mayor de dos números.
 *
 * @param a primer número
 * @param b segundo número
 * @return el mayor de los dos
 */
int obtenerMayor(int a, int b) {
    return a > b ? a : b;
}`)}
${ann('tip', '💡', 'Si para explicar un método necesitás decir "y además...", probablemente sean dos métodos.')}
</div>
<div class="ts"><h3>Hardcodear genera deuda</h3>
<p>Validar el tipo de reporte con textos sueltos funciona hoy. Cuando aparezca un formato nuevo, habrá que abrir y romper ese código.</p>
${cb('Del valor suelto a la constante', `// Deuda: el 21 está repetido y sin explicación
double total = neto * 1.21;

// Mejor: un solo lugar para cambiar
static final double IVA_GENERAL = 1.21;
double total = neto * IVA_GENERAL;`)}
</div>
<div class="ts"><h3>La pirámide del buen sistema</h3>
<p>Primero <strong>legibilidad</strong>, encima <strong>mantenibilidad</strong> y arriba <strong>escalabilidad</strong>. No se puede construir de la punta a la base: si el código no se entiende, nadie lo va a poder hacer crecer.</p></div>`,
  exercise: {
    desc: 'Este programa funciona, pero nadie entiende qué hace. Refactorizalo: cambiá el nombre del método c y de las variables a, b y x por nombres que expliquen qué representan. La consola no debe cambiar.',
    expected: 'Neto: 166000.0',
    need: [['^(?![\\s\\S]*\\bdouble\\s+c\\s*\\()', 'El método todavía se llama c: poné un nombre que diga qué calcula.'], ['^(?![\\s\\S]*\\bdouble\\s+[abx]\\b)', 'Quedan variables de una sola letra: nombralas según lo que guardan.']],
    starter: `public class Main {
    static double c(double x, double y) {
        return x - x * y / 100;
    }

    public static void main(String[] args) {
        double a = 200000;
        double b = 17;
        System.out.println("Neto: " + c(a, b));
    }
}`,
    hints: [
      'El valor 200000 es un sueldo bruto, y 17 es un porcentaje de descuento.',
      'Un método lleva un verbo: <code>calcularSueldoNeto</code>.',
      'Cambiá también los parámetros <code>x</code> e <code>y</code> dentro del método.',
      `La solución:<br>${cb('Solución', `public class Main {
    static double calcularSueldoNeto(double sueldoBruto, double porcentajeDescuento) {
        return sueldoBruto - sueldoBruto * porcentajeDescuento / 100;
    }

    public static void main(String[] args) {
        double sueldoBruto = 200000;
        double porcentajeDescuento = 17;
        System.out.println("Neto: " + calcularSueldoNeto(sueldoBruto, porcentajeDescuento));
    }
}`)}`
    ]
  }
});

PRACTICA[101] = {
  prev: 'métodos y clases de la Fase 1.',
  objetivos: ['Explicar qué es la deuda técnica y qué la provoca.', 'Elegir nombres que expliquen el código.', 'Reconocer un valor hardcodeado y reemplazarlo.'],
  escalera: {
    vida: 'Pagar con tarjeta lo que hoy no podés: te salva ahora y después llega con intereses.',
    modelo: 'Cada atajo en el código es una deuda: el próximo cambio cuesta más.',
    pseudo: 'Detectar un nombre confuso → renombrarlo → separar lo que hace dos cosas → volver a probar.',
    java: '<code>int x</code> pasa a ser <code>int edadUsuario</code>, y <code>1.21</code> pasa a ser <code>IVA_GENERAL</code>.',
    real: 'Un sistema de facturación vive años: el código limpio es lo que permite sumar un medio de pago nuevo sin romper los demás.'
  },
  items: [
    { t: 'mc', q: 'Tapás una gotera con cinta para salir del paso y nunca la arreglás. En software, eso es...', o: ['Deuda técnica', 'Una interfaz', 'Un patrón de diseño', 'Refactorizar'], a: 0, why: 'Es una solución rápida que después hay que pagar con más trabajo.' },
    { t: 'tf', q: 'Si el programa funciona, el código está bien escrito.', a: false, why: 'Funcionar es lo mínimo. También tiene que poder leerse, cambiarse y crecer.' },
    { t: 'match', q: 'Uní cada elemento con un buen nombre.', pairs: [['Variable', 'saldoDisponible'], ['Método', 'calcularTotal'], ['Clase', 'Factura'], ['Constante', 'IVA_GENERAL']], why: 'Sustantivos para datos y clases, verbos para métodos, mayúsculas para constantes.' },
    { t: 'bug', q: '¿Qué línea tiene el nombre que peor explica lo que hace?', code: 'double precioConIva = 1210;\ndouble f(double m) { return m * 0.9; }\nString nombreCliente = "Ana";', line: 2, fix: 'double aplicarDescuento(double monto) { return monto * 0.9; }', noRun: true, why: 'Ni <code>f</code> ni <code>m</code> dicen nada. Hay que leer el cuerpo para entenderlo.' },
    { t: 'fill', q: 'Completá para no repetir el valor del IVA.', code: 'public class Main {\n    static ___ double IVA = 1.21;\n    public static void main(String[] args) {\n        System.out.println(100 * ___);\n    }\n}', a: [['final'], ['IVA']], out: '121.0', why: '<code>final</code> impide cambiar el valor, y así hay un solo lugar para modificarlo.' },
    { t: 'order', q: 'Ordená la pirámide, de la base a la punta.', lines: ['Legibilidad', 'Mantenibilidad', 'Escalabilidad'], why: 'Lo que no se entiende no se puede mantener, y lo que no se mantiene no puede crecer.' },
    { t: 'short', q: '¿Por qué conviene pagar la deuda técnica temprano?', any: [['cuesta', 'crece', 'mas caro', 'intereses', 'peor', 'complica', 'tiempo', 'dificil']], model: 'Porque cuanto más tiempo pasa, más código depende de ese atajo y más cuesta corregirlo.', why: 'Como una deuda real: lo que no se paga crece.' },
    { t: 'code', title: 'Sacá el número mágico', task: 'El 1.21 está repetido. Creá una constante <code>IVA</code> y usala en los dos cálculos.', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Café: " + 1000 * 1.21);\n        System.out.println("Té: " + 500 * 1.21);\n    }\n}', expected: 'Café: 1210.0\nTé: 605.0', need: [['final\\s+double\\s+IVA', 'Definí la constante: static final double IVA = 1.21;'], ['^(?![\\s\\S]*\\*\\s*1\\.21)', 'Todavía hay un 1.21 suelto en una cuenta.']], hint: 'Declarala arriba del <code>main</code>: <code>static final double IVA = 1.21;</code>.', solution: 'public class Main {\n    static final double IVA = 1.21;\n\n    public static void main(String[] args) {\n        System.out.println("Café: " + 1000 * IVA);\n        System.out.println("Té: " + 500 * IVA);\n    }\n}', why: 'Si cambia el impuesto, se corrige en una sola línea.' }
  ]
};

LESSONS_F2.push({
  id: 102, level: 'limpio', levelLabel: 'Código limpio', stars: '⭐⭐',
  title: 'DRY, KISS y refactorización',
  desc: 'Aprendé a no repetirte, a no complicar lo simple y a mejorar el código sin cambiar lo que hace.',
  simple: () => `
${f2Card('🧹', 'Refactorizar es ordenar el placard', `<p>Sacás todo, separás por tipo y volvés a guardar. La ropa es la misma, pero ahora encontrás lo que buscás. <strong>Refactorizar</strong> es eso: reordenar el código para que sea mejor, <strong>sin cambiar lo que hace</strong>.</p>`)}
${f2Card('🔁', 'DRY: no te repitas', `<p>Si ya tenés una llave que abre la puerta, no hacés otra cada vez. <em>Don't Repeat Yourself</em>: si algo ya está escrito, se reutiliza.</p>`)}
${f2Card('🎯', 'KISS: hacelo simple', `<p>Te pidieron una calculadora que sume dos números. No hace falta validar la genealogía de los números primos. <em>Keep It Simple</em>: primero resolvé el problema, después mejoralo.</p>`)}
${f2Mini('¿Refactorizar agrega funciones nuevas?', 'No es su objetivo: el programa hace lo mismo, pero el código queda mejor.')}
${f2Mini('¿Qué es lo primero para no romper nada?', 'Tener una forma de comprobar que sigue funcionando igual, idealmente con pruebas.')}`,
  tutorial: () => `
<div class="ts"><h3>DRY: extraer un método</h3>
<p>Lo más común al refactorizar es separar responsabilidades y sacar lo repetido a un solo lugar.</p>
${cb('Antes y después', `// Antes: la misma cuenta tres veces
System.out.println(1000 * 1.21);
System.out.println(2500 * 1.21);
System.out.println(800 * 1.21);

// Después: si cambia la cuenta, se toca un solo lugar
static double conIva(double neto) {
    return neto * 1.21;
}`)}
</div>
<div class="ts"><h3>KISS: la solución más corta que funciona</h3>
${cb('Antes y después', `// Antes: tres líneas para decir algo obvio
boolean esMayor;
if (edad >= 18) { esMayor = true; } else { esMayor = false; }

// Después
boolean esMayor = edad >= 18;`)}
${ann('tip', '💡', 'No te exijas escribirlo perfecto de entrada. Primero un algoritmo que resuelva el problema; después lo simplificás.')}
</div>
<div class="ts"><h3>El proceso seguro</h3>
<ol><li>Comprobá que funciona antes de tocar.</li><li>Hacé un cambio chico.</li><li>Volvé a probar.</li><li>Hacé un commit.</li></ol>
<p>Muchos cambios chicos y probados son mucho más seguros que uno gigante.</p>
${ann('java', '☕', 'Tu IDE refactoriza por vos: seleccioná código y usá "Rename" o "Extract Method". Cambia todas las referencias sin errores de tipeo.')}
</div>`,
  exercise: {
    desc: 'La fórmula del IVA está repetida tres veces. Extraé un método conIva(double neto) y usalo en las tres líneas. La consola no debe cambiar.',
    expected: 'Yerba: 1210.0\nMate: 3025.0\nTermo: 21780.0',
    need: [['static\\s+double\\s+conIva\\s*\\(\\s*double', 'Creá el método static double conIva(double neto).'], ['^(?![\\s\\S]*1\\.21[\\s\\S]*1\\.21)', 'La fórmula tiene que aparecer una sola vez, dentro del método.']],
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Yerba: " + 1000 * 1.21);
        System.out.println("Mate: " + 2500 * 1.21);
        System.out.println("Termo: " + 18000 * 1.21);
    }
}`,
    hints: [
      'El método recibe el neto y devuelve el total.',
      'Dentro del <code>println</code> llamalo: <code>"Yerba: " + conIva(1000)</code>.',
      `La solución:<br>${cb('Solución', `public class Main {
    static double conIva(double neto) {
        return neto * 1.21;
    }

    public static void main(String[] args) {
        System.out.println("Yerba: " + conIva(1000));
        System.out.println("Mate: " + conIva(2500));
        System.out.println("Termo: " + conIva(18000));
    }
}`)}`
    ]
  }
});

PRACTICA[102] = {
  prev: 'métodos con retorno.',
  objetivos: ['Aplicar DRY extrayendo código repetido.', 'Aplicar KISS simplificando lo innecesario.', 'Refactorizar sin cambiar el comportamiento.'],
  escalera: {
    vida: 'Ordenar el placard: es la misma ropa, pero ahora encontrás todo.',
    modelo: 'Refactorizar mejora la estructura sin cambiar el resultado.',
    pseudo: 'Probar → cambiar poco → volver a probar → guardar.',
    java: 'Tres cuentas iguales pasan a ser un método <code>conIva()</code>.',
    real: 'Es lo más común al heredar un proyecto ajeno: una clase gigante que hay que separar sin que deje de andar.'
  },
  items: [
    { t: 'match', q: 'Uní cada sigla con su idea.', pairs: [['DRY', 'No repetir lo que ya está escrito'], ['KISS', 'Elegir la solución simple'], ['Refactorizar', 'Mejorar sin cambiar lo que hace'], ['Código espagueti', 'Todo enredado y dependiente']], why: 'Las tres primeras son las herramientas para combatir la cuarta.' },
    { t: 'tf', q: 'Refactorizar cambia lo que el programa le muestra al usuario.', a: false, why: 'Si cambia el comportamiento, es otra cosa: refactorizar solo mejora la estructura interna.' },
    { t: 'mc', q: '¿Qué versión aplica KISS?', o: ['<code>return edad &gt;= 18;</code>', '<code>if (edad &gt;= 18 == true) { return true; } else { return false; }</code>', 'Tres métodos para una comparación', 'Una clase nueva para comparar'], a: 0, why: 'La comparación ya da un <code>boolean</code>: se devuelve directo.' },
    { t: 'output', q: 'Después de refactorizar, el resultado debe ser igual. ¿Qué imprime?', code: 'public class Main {\n    static int duplicar(int n) {\n        return n * 2;\n    }\n    public static void main(String[] args) {\n        System.out.println(duplicar(4) + duplicar(5));\n    }\n}', a: '18', why: 'Se resuelve cada llamada y después se suman: 8 + 10.' },
    { t: 'bug', q: 'Este refactor cambió el resultado. ¿Qué línea lo rompió?', code: 'public class Main {\n    static int sumaIva(int neto) {\n        return neto * 2;\n    }\n    public static void main(String[] args) {\n        System.out.println(sumaIva(100));\n    }\n}', line: 3, fix: '        return neto + 21;', why: 'La regla era sumar 21, y el refactor cambió el comportamiento: por eso hay que probar antes y después.' },
    { t: 'order', q: 'Ordená un refactor seguro.', lines: ['Comprobar que funciona', 'Hacer un cambio chico', 'Volver a probar', 'Guardar con un commit'], why: 'Si algo falla, sabés exactamente qué cambio lo rompió.' },
    { t: 'short', q: '¿Por qué copiar y pegar código genera problemas más adelante?', any: [['cambiar', 'corregir', 'todos', 'varios', 'cada', 'olvid', 'errores', 'lugar']], model: 'Porque si hay que corregir algo, hay que encontrarlo y cambiarlo en cada copia, y es fácil olvidar alguna.', why: 'Un error copiado tres veces son tres errores.' },
    { t: 'code', title: 'Simplificá', task: 'Reemplazá el <code>if</code> por una sola línea. El método debe seguir devolviendo lo mismo.', starter: 'public class Main {\n    static boolean aprobo(int nota) {\n        if (nota >= 6) {\n            return true;\n        } else {\n            return false;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(aprobo(7));\n        System.out.println(aprobo(3));\n    }\n}', expected: 'true\nfalse', need: [['return\\s+nota\\s*>=\\s*6', 'Devolvé directamente la comparación.'], ['^(?![\\s\\S]*\\bif\\b)', 'El if ya no hace falta.']], hint: 'Una comparación ya es un <code>boolean</code>.', solution: 'public class Main {\n    static boolean aprobo(int nota) {\n        return nota >= 6;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(aprobo(7));\n        System.out.println(aprobo(3));\n    }\n}', why: 'Menos líneas, misma lógica y más fácil de leer.' }
  ]
};

LESSONS_F2.push({
  id: 103, level: 'limpio', levelLabel: 'Código limpio', stars: '⭐⭐⭐',
  title: 'Principios SOLID',
  desc: 'Cinco reglas para que las clases sean fáciles de cambiar y de extender.',
  simple: () => `
${f2Card('🎪', 'El circo de pueblo', `<p>La que vende las entradas también hace malabares, y el payaso vende pochoclo. Funciona, pero si falta uno se cae todo. En una clase pasa igual: si hace de todo, cualquier cambio la rompe. Por eso cada actor debería tener <strong>un solo rol</strong>.</p>`)}
${f2Card('🔌', 'El enchufe de pared', `<p>Tu casa no depende de una heladera en particular: depende del <strong>enchufe</strong>. Cualquier aparato con esa ficha funciona. SOLID busca lo mismo: depender de contratos, no de piezas concretas.</p>`)}
${f2Mini('¿Qué significa la S?', 'Responsabilidad única: una clase, una sola razón para cambiar.')}
${f2Mini('¿Tengo que memorizar SOLID para programar?', 'Primero entender la idea. Con la práctica se aplica casi sin pensarlo.')}`,
  tutorial: () => `
<div class="ts"><h3>Las cinco letras</h3>
<table class="sym-tbl"><thead><tr><th>Letra</th><th>Principio</th><th>En una frase</th><th>Analogía</th></tr></thead><tbody>
<tr><td><strong>S</strong></td><td>Single Responsibility</td><td>Una clase, una responsabilidad</td><td>Cada actor del circo, un rol</td></tr>
<tr><td><strong>O</strong></td><td>Open/Closed</td><td>Abierta a extender, cerrada a modificar</td><td>Sumar un accesorio sin desarmar la máquina</td></tr>
<tr><td><strong>L</strong></td><td>Liskov Substitution</td><td>Una hija puede reemplazar a su padre</td><td>Un remís cubre el lugar de un taxi</td></tr>
<tr><td><strong>I</strong></td><td>Interface Segregation</td><td>Muchas interfaces chicas</td><td>Herramientas sueltas, no una navaja suiza</td></tr>
<tr><td><strong>D</strong></td><td>Dependency Inversion</td><td>Depender de abstracciones</td><td>Depender del enchufe, no de la heladera</td></tr>
</tbody></table></div>
<div class="ts"><h3>Open/Closed con una interfaz</h3>
<p>Cada medio de pago nuevo obliga a tocar el <code>if</code>. Con una interfaz, se agrega una clase y el resto no cambia.</p>
${cb('Antes y después', `// Antes: hay que modificar esto por cada medio nuevo
if (tipo.equals("tarjeta")) { total = monto * 1.1; }
else if (tipo.equals("efectivo")) { total = monto * 0.9; }

// Después: agregar un medio es agregar una clase
interface MedioPago {
    double cobrar(double monto);
}

class Tarjeta implements MedioPago {
    public double cobrar(double monto) { return monto * 1.1; }
}`)}
</div>
<div class="ts"><h3>Inversión de dependencias</h3>
<p>Una clase de alto nivel no debería conocer a una de bajo nivel, sino a su interfaz. Spring se apoya en esta idea en toda la aplicación.</p>
${cb('Dependencia de una abstracción', `class Pedido {
    private final MedioPago medio;  // interfaz, no una clase concreta

    Pedido(MedioPago medio) {
        this.medio = medio;
    }
}`)}
${ann('warn', '⚠️', 'SOLID no es una ley. Llevar la responsabilidad única al extremo crea decenas de clases minúsculas, y eso también es un problema.')}
</div>`,
  exercise: {
    desc: 'Eliminá el if: creá la interfaz MedioPago con double cobrar(double monto), y las clases Tarjeta (10% de recargo) y Efectivo (10% de descuento). El main recorre un array de MedioPago.',
    expected: 'Tarjeta: 1100.0\nEfectivo: 900.0',
    need: [['\\binterface\\s+MedioPago', 'Definí la interfaz MedioPago.'], ['implements\\s+MedioPago[\\s\\S]*implements\\s+MedioPago', 'Tarjeta y Efectivo deben implementar MedioPago.'], ['^(?![\\s\\S]*\\bif\\b)', 'El objetivo es que ya no haga falta el if.']],
    starter: `public class Main {
    static double cobrar(String tipo, double monto) {
        if (tipo.equals("Tarjeta")) {
            return monto * 1.1;
        }
        return monto * 0.9;
    }

    public static void main(String[] args) {
        System.out.println("Tarjeta: " + cobrar("Tarjeta", 1000));
        System.out.println("Efectivo: " + cobrar("Efectivo", 1000));
    }
}`,
    hints: [
      'Agregá un método <code>String nombre()</code> a la interfaz para imprimir la etiqueta.',
      'En <code>main</code>: <code>MedioPago[] medios = { new Tarjeta(), new Efectivo() };</code>.',
      `La solución:<br>${cb('Solución', `interface MedioPago {
    String nombre();
    double cobrar(double monto);
}

class Tarjeta implements MedioPago {
    public String nombre() { return "Tarjeta"; }
    public double cobrar(double monto) { return monto * 11 / 10; }
}

class Efectivo implements MedioPago {
    public String nombre() { return "Efectivo"; }
    public double cobrar(double monto) { return monto * 0.9; }
}

public class Main {
    public static void main(String[] args) {
        MedioPago[] medios = { new Tarjeta(), new Efectivo() };
        for (MedioPago m : medios) {
            System.out.println(m.nombre() + ": " + m.cobrar(1000));
        }
    }
}`)}`
    ]
  }
});

PRACTICA[103] = {
  prev: 'interfaces, herencia y polimorfismo.',
  objetivos: ['Reconocer los cinco principios SOLID.', 'Reemplazar un <code>if</code> por polimorfismo.', 'Depender de una interfaz en lugar de una clase concreta.'],
  escalera: {
    vida: 'Un enchufe acepta cualquier aparato con la ficha correcta: la casa no depende de la heladera.',
    modelo: 'Las clases deberían tener un solo rol y depender de contratos.',
    pseudo: 'En vez de preguntar qué medio es, pedirle a cada medio que cobre.',
    java: '<code>interface MedioPago</code> y una clase por cada medio.',
    real: 'Sumar cripto como medio de pago es agregar una clase, sin tocar el proceso de cobro que ya funciona.'
  },
  items: [
    { t: 'match', q: 'Uní cada letra con su principio.', pairs: [['S', 'Responsabilidad única'], ['O', 'Abierto a extensión, cerrado a modificación'], ['L', 'Sustitución de Liskov'], ['I', 'Segregación de interfaces'], ['D', 'Inversión de dependencias']], why: 'Son los cinco principios que forman la sigla.' },
    { t: 'mc', q: 'Una clase <code>Factura</code> calcula totales, manda mails y guarda en la base. ¿Qué principio rompe?', o: ['Responsabilidad única', 'Liskov', 'Segregación de interfaces', 'Ninguno'], a: 0, why: 'Tiene tres razones para cambiar: debería repartirse en tres clases.' },
    { t: 'tf', q: 'Es mejor una interfaz grande con todos los métodos que varias chicas.', a: false, why: 'La segregación de interfaces dice lo contrario: nadie debería depender de lo que no usa.' },
    { t: 'mc', q: 'Si una clase hija lanza un error en un método que su padre resolvía, rompe...', o: ['Liskov: ya no puede reemplazar a su padre', 'Responsabilidad única: hace demasiadas cosas', 'Open/Closed: hay que modificar a su padre', 'DRY: repite código que ya tenía su padre'], a: 0, why: 'Una hija debe poder usarse en lugar del padre sin sorpresas.' },
    { t: 'output', q: 'Polimorfismo sin un solo if. ¿Qué imprime?', code: 'interface Envio {\n    int costo();\n}\n\nclass Moto implements Envio {\n    public int costo() { return 500; }\n}\n\nclass Camion implements Envio {\n    public int costo() { return 3000; }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Envio[] envios = { new Moto(), new Camion() };\n        int total = 0;\n        for (Envio e : envios) {\n            total += e.costo();\n        }\n        System.out.println(total);\n    }\n}', a: '3500', why: 'El bucle no sabe qué clase es cada envío: solo usa el contrato.' },
    { t: 'bug', q: 'Esta clase depende de algo concreto y no se puede cambiar. ¿Qué línea corregís?', code: 'interface Notificador {\n    void enviar(String m);\n}\n\nclass Mail implements Notificador {\n    public void enviar(String m) { System.out.println("Mail: " + m); }\n}\n\nclass Pedido {\n    private Mail notificador = new Mail();\n    void confirmar() { notificador.enviar("Listo"); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Pedido().confirmar();\n    }\n}', line: 10, fix: '    private Notificador notificador = new Mail();', noRun: true, why: 'El atributo debería ser del tipo de la interfaz. Mejor aún si llega por constructor, como vas a ver con la inyección de dependencias.' },
    { t: 'short', q: 'Explicá Open/Closed con un ejemplo propio.', any: [['agregar', 'sumar', 'extender', 'nueva', 'nuevo'], ['sin', 'no cambi', 'no modific', 'no toc']], model: 'Puedo agregar un medio de pago nuevo creando una clase, sin modificar el código que ya funciona.', why: 'La clave es agregar sin tocar lo que ya anda.' }
  ]
};

LESSONS_F2.push({
  id: 104, level: 'limpio', levelLabel: 'Código limpio', stars: '⭐⭐',
  title: 'Antipatrones STUPID',
  desc: 'Reconocé los errores de diseño más comunes y sabé con qué se curan.',
  simple: () => `
${f2Card('🩺', 'Recetario médico', `<p>Un <strong>patrón</strong> es una solución probada para un problema común. Un <strong>antipatrón</strong> es lo contrario: algo que parece buena idea y a la larga enferma el proyecto. Si reconocés el síntoma, ya sabés qué remedio aplicar.</p>`)}
${f2Mini('¿Por qué se llama STUPID?', 'Es una sigla en inglés con seis errores. Y da lo contrario de SOLID.')}
${f2Mini('¿Qué es el alto acoplamiento?', 'Dos piezas tan pegadas que no podés cambiar una sin romper la otra.')}`,
  tutorial: () => `
<div class="ts"><h3>Los seis antipatrones</h3>
<table class="sym-tbl"><thead><tr><th>Letra</th><th>Antipatrón</th><th>El problema</th><th>El remedio</th></tr></thead><tbody>
<tr><td><strong>S</strong></td><td>Singleton mal usado</td><td>Un estado global que todos tocan</td><td>Inyección de dependencias</td></tr>
<tr><td><strong>T</strong></td><td>Tight Coupling</td><td>Clases demasiado atadas</td><td>Interfaces e inyección</td></tr>
<tr><td><strong>U</strong></td><td>Untestability</td><td>Código imposible de probar</td><td>Separar responsabilidades</td></tr>
<tr><td><strong>P</strong></td><td>Premature Optimization</td><td>Complicar antes de tiempo</td><td>KISS</td></tr>
<tr><td><strong>I</strong></td><td>Indescriptive Naming</td><td>Nombres que no dicen nada</td><td>Renombrar con sentido</td></tr>
<tr><td><strong>D</strong></td><td>Duplication</td><td>Código repetido</td><td>DRY y refactorizar</td></tr>
</tbody></table>
${ann('tip', '💡', 'Antes de optimizar, medí. La mayoría de las veces la parte lenta no es la que creías.')}
</div>`,
  quiz: {
    passing: 4,
    questions: [
      { question: 'Dos clases dependen tanto una de la otra que no podés cambiar una sin romper la otra. ¿Qué antipatrón es?', options: ['Alto acoplamiento', 'Duplicación', 'Optimización prematura', 'Nombres confusos'], correct: 0 },
      { question: '¿Qué remedio corresponde a la duplicación?', options: ['DRY y refactorizar', 'Agregar comentarios', 'Usar más variables globales', 'Compilar de nuevo'], correct: 0 },
      { question: 'Complicar un algoritmo por las dudas, sin saber si hace falta, es...', options: ['Optimización prematura', 'Refactorizar', 'Polimorfismo', 'Encapsular'], correct: 0 },
      { question: '¿Qué ayuda más a resolver el alto acoplamiento?', options: ['Interfaces e inyección de dependencias', 'Un solo archivo gigante', 'Variables públicas', 'Más static'], correct: 0 },
      { question: 'Un sistema se apoya en un objeto global que cualquiera modifica. ¿Qué problema trae?', options: ['Es difícil de probar y de razonar', 'Corre más rápido siempre', 'Ninguno', 'No compila'], correct: 0 }
    ]
  }
});

PRACTICA[104] = {
  prev: 'DRY, KISS y SOLID.',
  objetivos: ['Reconocer los antipatrones STUPID.', 'Asociar cada síntoma con su remedio.'],
  escalera: {
    vida: 'Un médico reconoce el síntoma y sabe qué receta corresponde.',
    modelo: 'Un antipatrón es un error de diseño repetido y conocido, con una solución conocida.',
    pseudo: 'Si está repetido → DRY. Si está atado → interfaz. Si está complicado → KISS.',
    java: 'Cambiar un atributo <code>static</code> compartido por uno que llega por constructor.',
    real: 'En una revisión de código se señalan estos problemas por su nombre: conocerlos es hablar el idioma del equipo.'
  },
  items: [
    { t: 'match', q: 'Uní cada síntoma con su remedio.', pairs: [['Código repetido', 'DRY y refactorizar'], ['Clases muy atadas', 'Interfaces e inyección'], ['Nombres confusos', 'Renombrar con sentido'], ['Complicar antes de tiempo', 'KISS']], why: 'Es el recetario: síntoma y tratamiento.' },
    { t: 'tf', q: 'Optimizar todo desde el primer día es una buena práctica.', a: false, why: 'Agrega complejidad sin saber si hace falta. Primero que funcione y se entienda; después se mide.' },
    { t: 'output', q: 'Un estado global sorprende. ¿Qué imprime?', code: 'public class Main {\n    static int contador = 0;\n    static void a() { contador++; }\n    static void b() { contador = 10; }\n    public static void main(String[] args) {\n        a();\n        b();\n        a();\n        System.out.println(contador);\n    }\n}', a: '11', why: 'Cualquier método puede pisar el valor: por eso el estado global cuesta tanto de seguir.' },
    { t: 'short', q: '¿Por qué un código muy acoplado es difícil de probar?', any: [['depende', 'atad', 'aislar', 'separar', 'junto', 'sin la otra', 'todo']], model: 'Porque no se puede probar una pieza sola: depende de las demás y hay que levantar todo junto.', why: 'Si es fácil de probar, suele estar bien diseñado.' },
    { t: 'mc', q: 'Si <code>PedidoService</code> hace <code>new MysqlRepo()</code> adentro, ¿qué problema aparece?', o: ['Queda acoplado y cuesta testearlo aislado', 'No compila si el método main no es static', 'Spring genera dos bases de datos vacías', 'La consulta SQL siempre devuelve null'], a: 0, hint: 'Pensá cómo harías para reemplazar esa base por un doble en un test unitario.', why: 'Es alto acoplamiento (Tight Coupling): no podés inyectar un repositorio falso para testear.' },
    { t: 'tf', q: 'Usar un Singleton global mutable para guardar datos de sesión facilita escribir tests independientes.', a: false, why: 'El estado global compartido contamina otros tests y hace que el orden de ejecución importe.' }
  ]
};
