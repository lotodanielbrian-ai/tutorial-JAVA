// Java INPRO — Textos propios del manual: orientación (capítulo 0), presentación de
// las partes y apéndices que no salen de las lecciones. Usa cb() y ann() de lessons.js.
var MANUAL = (function () {
  var EDICION = 'Edición de noviembre de 2026';

  // Cada sección del capítulo 0 sigue la misma escalera que el resto del libro
  var CAP0 = [
    {
      id: 'programar', titulo: '¿Qué es programar?',
      escalera: {
        vida: 'Una receta: “hervir agua, agregar los fideos, esperar 8 minutos”. Si un paso falta o está desordenado, la comida sale mal.',
        modelo: 'Programar es escribir instrucciones tan exactas que una máquina las pueda seguir sin pensar. La computadora no adivina: hace lo que escribiste, ni más ni menos.',
        pseudo: 'Un <strong>algoritmo</strong> es la receta en pasos, antes de cualquier lenguaje: “pedir la edad → si es 18 o más, decir mayor; si no, decir menor”.',
        java: 'Un <strong>lenguaje de programación</strong> como Java es el idioma en el que le dictás esa receta a la computadora.',
        real: 'La app del banco, el semáforo y el cajero automático siguen algoritmos que alguien escribió.'
      },
      html: function () {
        return '<div class="ts"><h3>Del pensamiento al código</h3>' +
          '<p>Antes de tocar Java conviene separar dos cosas: <strong>qué</strong> querés que pase y <strong>cómo</strong> se escribe. La primera es el algoritmo y se puede pensar en papel. La segunda es la sintaxis del lenguaje, y es lo que vas a aprender capítulo a capítulo.</p>' +
          '<p>Mirá el mismo problema en los tres niveles:</p>' +
          '<table class="sym-tbl"><thead><tr><th>Nivel</th><th>Cómo se ve</th></tr></thead><tbody>' +
          '<tr><td>En palabras</td><td>Si la persona tiene 18 años o más, es mayor de edad. Si no, es menor.</td></tr>' +
          '<tr><td>En pasos</td><td>LEER edad → SI edad ≥ 18 ENTONCES mostrar “Mayor” SI NO mostrar “Menor”</td></tr>' +
          '<tr><td>En Java</td><td><code>if (edad &gt;= 18) { System.out.println("Mayor"); } else { System.out.println("Menor"); }</code></td></tr>' +
          '</tbody></table>' +
          ann('tip', '💡', 'Si no podés explicar un problema en pasos, todavía no es momento de escribir código. Primero el papel, después el teclado.') +
          '</div>';
      }
    },
    {
      id: 'java', titulo: '¿Qué es Java?',
      figura: 'programa',
      escalera: {
        vida: 'Un traductor que viaja con vos: escribís una carta en un idioma intermedio y, en cada país, alguien la lee en el idioma local.',
        modelo: 'Java se escribe una vez y se ejecuta en cualquier sistema que tenga una <strong>JVM</strong> (máquina virtual de Java).',
        pseudo: 'Escribir Main.java → compilarlo a Main.class (bytecode) → la JVM lo ejecuta en Windows, Mac, Linux o Android.',
        java: '<code>javac Main.java</code> compila; <code>java Main</code> ejecuta.',
        real: 'Por eso una empresa puede desarrollar en una notebook con Windows y poner el mismo programa en un servidor con Linux.'
      },
      html: function () {
        return '<div class="ts"><h3>Un poco de historia</h3>' +
          '<p>Java nació en 1995 en Sun Microsystems, en un equipo liderado por James Gosling. La promesa era <em>“write once, run anywhere”</em>: escribilo una vez, ejecutalo en cualquier lado. Hoy lo desarrolla Oracle junto con la comunidad OpenJDK, y sale una versión nueva cada seis meses.</p>' +
          '<h3>Lo que lo distingue</h3><table class="sym-tbl"><thead><tr><th>Característica</th><th>Qué significa para vos</th></tr></thead><tbody>' +
          '<tr><td>Orientado a objetos</td><td>Organizás el programa en objetos que juntan datos y comportamiento (capítulos 18 a 24).</td></tr>' +
          '<tr><td>Tipado estático</td><td>Cada variable declara qué guarda: <code>int edad = 25;</code>. El compilador te frena si mezclás tipos, antes de ejecutar.</td></tr>' +
          '<tr><td>Compilado a bytecode</td><td>El código pasa por <code>javac</code> y después lo ejecuta la JVM, que además compila en caliente (JIT) las partes que más se usan para que corran rápido.</td></tr>' +
          '<tr><td>Recolector de basura</td><td>No tenés que liberar la memoria a mano: la JVM borra los objetos que ya nadie usa.</td></tr>' +
          '<tr><td>Biblioteca estándar enorme</td><td>Texto, matemática, listas, archivos, fechas y redes ya vienen resueltos.</td></tr>' +
          '<tr><td>Compatibilidad</td><td>Un programa de hace veinte años, por lo general, todavía compila y corre.</td></tr>' +
          '</tbody></table>' +
          ann('java', '☕', '¿Por qué tanta gente lo usa? Es estable, rápido, tiene una comunidad gigante y muchísimas ofertas de trabajo, sobre todo en sistemas de empresas.') +
          '</div>';
      }
    },
    {
      id: 'usos', titulo: '¿Para qué se usa Java?',
      figura: 'usos',
      escalera: {
        vida: 'Pensá en lo que no se ve de una compra online: el stock, el cobro, la factura, el envío. Todo eso corre en servidores.',
        modelo: 'Java brilla en programas grandes que tienen que funcionar todo el día durante años: sistemas de empresas, servidores y apps.',
        pseudo: 'Celular → pide el saldo → servidor en Java consulta la base de datos → responde → el celular lo muestra.',
        java: 'En la Fase 2 del curso vas a construir justamente eso: una API con Spring Boot.',
        real: 'Bancos, aerolíneas, comercios, gobiernos y muchas apps de Android usan Java todos los días.'
      },
      html: function () {
        return '<div class="ts"><h3>Tipos de programas que se hacen con Java</h3>' +
          '<table class="sym-tbl"><thead><tr><th>Tipo</th><th>Ejemplos</th></tr></thead><tbody>' +
          '<tr><td>Backend (servidores)</td><td>APIs de bancos, comercio electrónico, reservas. Es el uso más común en el trabajo.</td></tr>' +
          '<tr><td>Móvil</td><td>Apps de Android, escritas en Java o en Kotlin, que funciona sobre la misma base.</td></tr>' +
          '<tr><td>Empresarial</td><td>Sistemas de gestión, facturación, recursos humanos.</td></tr>' +
          '<tr><td>Datos</td><td>Kafka, Hadoop y Spark procesan millones de registros.</td></tr>' +
          '<tr><td>Escritorio</td><td>Herramientas como el IDE IntelliJ IDEA, que está escrito en Java.</td></tr>' +
          '<tr><td>Juegos</td><td>Minecraft: Java Edition y sus mods.</td></tr>' +
          '<tr><td>Dispositivos</td><td>Java Card corre adentro de tarjetas SIM y de crédito.</td></tr>' +
          '</tbody></table></div>';
      }
    },
    {
      id: 'no', titulo: '¿Qué no conviene hacer con Java?',
      figura: 'noJava',
      escalera: {
        vida: 'Con un destornillador podés clavar un clavo, pero el martillo es mejor. Cada herramienta tiene su fuerte.',
        modelo: 'Java puede hacer casi de todo, pero en algunos terrenos otro lenguaje es más simple o más rápido.',
        pseudo: 'Elegir la herramienta → según dónde corre el programa, qué tan rápido hay que escribirlo y cuánto tiene que durar.',
        java: 'Java gana cuando el programa es grande, va a durar años y lo mantienen varias personas.',
        real: 'En una empresa típica conviven Java en el servidor, JavaScript en la web y Python para análisis de datos.'
      },
      html: function () {
        return '<div class="ts"><h3>Lo que Java no hace (o no hace bien)</h3><ul>' +
          '<li><strong>No corre adentro del navegador.</strong> Las páginas web interactivas se programan en JavaScript. Hace años existían los “applets” de Java, pero ya no funcionan en ningún navegador actual.</li>' +
          '<li><strong>No es ideal para scripts rápidos.</strong> Para automatizar algo en diez líneas, Python suele ser más directo.</li>' +
          '<li><strong>No controla el hardware de bajo nivel.</strong> Drivers y sistemas operativos se escriben en C, C++ o Rust.</li>' +
          '<li><strong>No es lo más común para experimentar con inteligencia artificial.</strong> Ahí domina Python, aunque los sistemas que después usan esos modelos muchas veces corren en Java.</li>' +
          '</ul>' + ann('ok', '✅', 'Nada de esto es una desventaja para aprender: lo que aprendés con Java (variables, condiciones, bucles, objetos) se usa igual en cualquier otro lenguaje.') + '</div>';
      }
    },
    {
      id: 'javascript', titulo: 'Java no es JavaScript',
      figura: 'javascript',
      escalera: {
        vida: '“Auto” y “autopista” se parecen en el nombre, pero son cosas distintas.',
        modelo: 'JavaScript nació en 1995 con ese nombre por una estrategia de marketing, para aprovechar la fama de Java. No tienen el mismo origen.',
        pseudo: 'Java → servidores y Android. JavaScript → páginas web.',
        java: 'En Java: <code>int edad = 25;</code>. En JavaScript: <code>let edad = 25;</code>.',
        real: 'Este mismo sitio está hecho en JavaScript, y adentro trae un intérprete que ejecuta tu código Java.'
      },
      html: function () {
        return '<div class="ts"><p>Si buscás ayuda en internet, fijate que la respuesta sea de <strong>Java</strong>: un código de JavaScript no va a compilar en Java, aunque se parezca.</p></div>';
      }
    },
    {
      id: 'jdk', titulo: 'JDK, JRE y JVM: las piezas',
      figura: 'jdk',
      escalera: {
        vida: 'Una cocina completa (JDK) incluye la heladera con ingredientes (bibliotecas) y el horno (JVM). Para comer alcanza con heladera y horno; para cocinar necesitás la cocina entera.',
        modelo: 'La JVM ejecuta, el JRE es lo necesario para ejecutar y el JDK suma las herramientas para programar.',
        pseudo: 'Programar → instalar el JDK. Solo usar un programa hecho → alcanza con lo que trae ese programa.',
        java: '<code>javac</code> viene en el JDK; <code>java</code> pone en marcha la JVM.',
        real: 'Desde Java 11 ya no se distribuye un JRE suelto: se instala el JDK.'
      },
      html: function () {
        return '<div class="ts"><h3>¿Qué versión instalo?</h3>' +
          '<p>Java saca una versión cada seis meses, y cada dos años una de ellas es <strong>LTS</strong> (soporte a largo plazo). Las empresas usan casi siempre una LTS.</p>' +
          '<table class="sym-tbl"><thead><tr><th>Versión</th><th>Año</th><th>Estado</th></tr></thead><tbody>' +
          '<tr><td>Java 8</td><td>2014</td><td>LTS histórica: todavía la vas a encontrar en sistemas viejos</td></tr>' +
          '<tr><td>Java 11</td><td>2018</td><td>LTS</td></tr>' +
          '<tr><td>Java 17</td><td>2021</td><td>LTS: la mínima para Spring Boot 3, que usa la Fase 2</td></tr>' +
          '<tr><td>Java 21</td><td>2023</td><td>LTS</td></tr>' +
          '<tr><td>Java 25</td><td>2025</td><td>LTS más reciente. La próxima prevista es la 29, en 2027</td></tr>' +
          '</tbody></table>' +
          ann('tip', '💡', 'Instalá un JDK LTS: el 21 o el 25. Todo lo de este libro funciona desde Java 17.') + '</div>';
      }
    },
    {
      id: 'instalar', titulo: 'Tu primer programa fuera del navegador',
      escalera: {
        vida: 'Practicar en el simulador de manejo está bien; después hay que subirse a un auto de verdad.',
        modelo: 'El curso ejecuta tu código en el navegador. En tu computadora vas a usar el JDK y un editor.',
        pseudo: 'Instalar el JDK → escribir Main.java → compilarlo → ejecutarlo.',
        java: '<code>javac Main.java</code> y después <code>java Main</code>.',
        real: 'Así arranca cualquier proyecto real, con el IDE haciendo esos pasos por vos.'
      },
      html: function () {
        return '<div class="ts"><h3>Paso a paso</h3><ol class="mn-steps">' +
          '<li><strong>Instalá un JDK.</strong> Por ejemplo, Eclipse Temurin desde <em>adoptium.net</em>, o el de Oracle. Elegí la versión LTS para tu sistema.</li>' +
          '<li><strong>Comprobá la instalación.</strong> Abrí una terminal (en Windows, “Símbolo del sistema” o PowerShell) y escribí:' + cb('Terminal', 'java -version\njavac -version') + 'Si las dos responden con un número de versión, está listo.</li>' +
          '<li><strong>Escribí el programa.</strong> Creá una carpeta, y adentro un archivo <code>Main.java</code>:' + cb('Main.java', 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("¡Hola desde mi computadora!");\n    }\n}') + '</li>' +
          '<li><strong>Compilá y ejecutá</strong> desde esa carpeta:' + cb('Terminal', 'javac Main.java     # crea Main.class\njava Main           # lo ejecuta') + 'Atajo: desde Java 11, <code>java Main.java</code> compila y ejecuta un solo archivo de una vez.</li>' +
          '<li><strong>Elegí un IDE</strong> cuando los programas crezcan: IntelliJ IDEA, Eclipse o VS Code con el paquete de extensiones para Java (capítulo 32).</li></ol>' +
          '<h3>Diferencias que vas a notar en tu PC</h3>' +
          ann('warn', '⚠️', '<strong>La coma decimal.</strong> Si tu computadora está en español, <code>System.out.printf("%.2f", 1.5)</code> imprime <code>1,50</code> y no <code>1.50</code>, y <code>Scanner.nextDouble()</code> espera que escribas <code>1,5</code>. En este libro y en el curso vas a ver el punto. Si querés el punto en tu PC: <code>String.format(java.util.Locale.US, "%.2f", x)</code>.') +
          ann('tip', '💡', 'El intérprete del curso no tiene algunas clases, como <code>Random</code> o <code>LocalDate</code>. En tu computadora funcionan todas.') + '</div>';
      }
    },
    {
      id: 'errores', titulo: 'Los tres tipos de errores',
      figura: 'errores',
      escalera: {
        vida: 'Una carta puede tener faltas de ortografía (se ven al leerla), una dirección que no existe (falla al enviarla) o un mensaje equivocado (llega, pero dice otra cosa).',
        modelo: 'Hay errores de compilación, de ejecución y de lógica. Cada uno aparece en un momento distinto.',
        pseudo: 'Compilar → ¿errores? → corregir → ejecutar → ¿se cae? → corregir → ¿el resultado es el esperado? → probar con otros datos.',
        java: '<code>Main.java:5: error: \';\' expected</code> se lee: archivo, línea, tipo y mensaje.',
        real: 'Los programadores con experiencia también se equivocan todo el tiempo: la diferencia es que leen el mensaje con calma.'
      },
      html: function () {
        return '<div class="ts"><h3>Cómo leer un mensaje de error</h3>' +
          cb('Lo que muestra javac', 'Main.java:5: error: \';\' expected\n        System.out.println("Hola")\n                                  ^') +
          '<table class="sym-tbl"><thead><tr><th>Parte</th><th>Qué te dice</th></tr></thead><tbody>' +
          '<tr><td>Main.java</td><td>El archivo</td></tr><tr><td>:5</td><td>La línea: empezá a mirar ahí (a veces el error está en la anterior)</td></tr>' +
          '<tr><td>error: \';\' expected</td><td>Qué esperaba encontrar</td></tr><tr><td>^</td><td>La posición exacta</td></tr></tbody></table>' +
          ann('tip', '💡', 'Corregí <strong>el primer error</strong> y volvé a compilar: muchas veces los siguientes desaparecen solos. El apéndice C traduce los mensajes más comunes.') + '</div>';
      }
    },
    {
      id: 'libro', titulo: 'Cómo está armado cada capítulo',
      escalera: {
        vida: 'Empieza con algo que ya conocés de la vida diaria…',
        modelo: '…sigue con la idea, sin código…',
        pseudo: '…la pasa a pasos, como una receta…',
        java: '…la escribe en Java…',
        real: '…y te muestra dónde se usa en un sistema de verdad.'
      },
      html: function () {
        return '<div class="ts"><p>Esa escalera, <strong>de la vida diaria al código</strong>, abre cada capítulo. Después vienen:</p><ul>' +
          '<li><strong>Una figura</strong> que muestra la idea antes de las palabras.</li>' +
          '<li><strong>La idea en simple</strong>: analogías y preguntas rápidas.</li>' +
          '<li><strong>En detalle</strong>: la sintaxis, ejemplos completos y los errores comunes.</li>' +
          '<li><strong>Comprobá lo que aprendiste</strong>: actividades numeradas. Las respuestas, con su explicación, están en el apéndice A.</li>' +
          '<li><strong>Desafío</strong>: un programa para escribir vos. Las soluciones están en el apéndice B.</li></ul>' +
          ann('java', '☕', 'En la versión web de este libro, los ejemplos completos tienen un botón <strong>▶ Ejecutar</strong> y se pueden editar: cambiá algo y mirá qué pasa. Equivocarse ahí no cuesta nada.') + '</div>';
      }
    }
  ];

  var PARTES = [
    { n: 'I', titulo: 'Los primeros pasos', ids: [1, 2, 3, 4, 5, 6], texto: 'Escribir, guardar datos en variables, hacer cuentas y trabajar con texto. Al final, un examen que junta todo.' },
    { n: 'II', titulo: 'Decidir y repetir', ids: [7, 8, 9, 10, 11, 12, 13, 14, 15], texto: 'Que el programa tome decisiones, lea lo que escribís y repita tareas. Los arrays, y una mirada a las formas de programar.' },
    { n: 'III', titulo: 'Programar con objetos', ids: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], texto: 'Métodos, clases, objetos, herencia y colecciones. Archivos, errores controlados y un primer proyecto con menú.' },
    { n: 'IV', titulo: 'Herramientas de trabajo', ids: [30, 31, 32, 33], texto: 'Git para guardar la historia del código, GitHub para compartirlo y los IDE para programar con ayuda.' },
    { n: 'V', titulo: 'El proyecto final', ids: [34, 35], texto: 'Un sistema completo con objetos, colecciones, archivos y Git, y las preguntas típicas de una entrevista.' }
  ];

  // Apéndice C: mensajes del compilador y de ejecución, traducidos
  var ERRORES = [
    ['\';\' expected', 'Compilación', 'Falta un punto y coma al final de la instrucción (mirá también la línea anterior).'],
    ['cannot find symbol', 'Compilación', 'Un nombre que Java no conoce: variable mal escrita, sin declarar, o falta un import. Java distingue mayúsculas.'],
    ['incompatible types: String cannot be converted to int', 'Compilación', 'Guardás un dato en una variable de otro tipo. Para texto → número usá Integer.parseInt.'],
    ['possible lossy conversion from double to int', 'Compilación', 'Pasás un decimal a entero: hace falta un cast (int), sabiendo que se pierden los decimales.'],
    ['variable x might not have been initialized', 'Compilación', 'Usás una variable antes de darle un valor.'],
    ['missing return statement', 'Compilación', 'Un método que devuelve algo tiene un camino sin return.'],
    ['class X is public, should be declared in a file named X.java', 'Compilación', 'El nombre del archivo tiene que ser igual al de la clase pública.'],
    ['reached end of file while parsing', 'Compilación', 'Falta cerrar una llave }.'],
    ['\'else\' without \'if\'', 'Compilación', 'Un else que no tiene su if: casi siempre un ; o una llave de más.'],
    ['non-static method … cannot be referenced from a static context', 'Compilación', 'Llamás desde main a un método que no es static: agregale static o creá un objeto.'],
    ['unreported exception IOException; must be caught or declared to be thrown', 'Compilación', 'Esa operación puede fallar: rodeala con try-catch o agregá throws.'],
    ['unreachable statement', 'Compilación', 'Código que nunca se ejecuta, por ejemplo después de un return o un break.'],
    ['ArithmeticException: / by zero', 'Ejecución', 'Dividiste un entero por cero.'],
    ['ArrayIndexOutOfBoundsException', 'Ejecución', 'Usaste una posición que no existe: los índices van de 0 a length - 1.'],
    ['StringIndexOutOfBoundsException', 'Ejecución', 'Lo mismo, con las posiciones de un texto (charAt, substring).'],
    ['NullPointerException', 'Ejecución', 'Usaste un objeto que vale null: todavía no se creó con new.'],
    ['NumberFormatException', 'Ejecución', 'Integer.parseInt recibió un texto que no es un número, como "abc".'],
    ['InputMismatchException', 'Ejecución', 'Scanner esperaba un número y escribiste otra cosa (o un decimal con punto en una PC que usa coma).']
  ];

  // Apéndice D: hoja de referencia rápida
  var REFERENCIA = [
    ['Tipos', 'int 25 · double 3.14 · boolean true · char \'A\' · String "Hola" · long 3000000000L'],
    ['Imprimir', 'System.out.println(x); · System.out.print(x); · System.out.printf("%d %.2f %s%n", n, d, s);'],
    ['Aritmética', '+ - * / %  ·  x += 2;  ·  i++;  ·  7 / 2 → 3  ·  7 / 2.0 → 3.5  ·  7 % 2 → 1'],
    ['Comparar', '== != < > <= >=  ·  textos: a.equals(b)'],
    ['Lógicos', '&& (y)  ·  || (o)  ·  ! (no)'],
    ['Decidir', 'if (c) { } else if (c2) { } else { }  ·  switch (x) { case 1: …; break; default: … }  ·  c ? a : b'],
    ['Repetir', 'while (c) { }  ·  do { } while (c);  ·  for (int i = 0; i < n; i++) { }  ·  for (String s : lista) { }'],
    ['Leer', 'Scanner sc = new Scanner(System.in); · sc.nextInt() · sc.nextLine() · Integer.parseInt(sc.nextLine())'],
    ['String', 'length() · charAt(i) · substring(a, b) · indexOf("x") · contains("x") · toUpperCase() · trim() · equals(o)'],
    ['Math', 'Math.max(a, b) · Math.min · Math.abs · Math.pow(b, e) · Math.sqrt(x) · Math.round(x)'],
    ['Arrays', 'int[] a = new int[5]; · int[] b = {1, 2, 3}; · a.length · a[0] · Arrays.toString(a)'],
    ['ArrayList', 'ArrayList<String> l = new ArrayList<>(); · add(x) · get(i) · set(i, x) · remove(i) · size() · contains(x)'],
    ['Métodos', 'static int sumar(int a, int b) { return a + b; }  ·  static void saludar() { … }'],
    ['Clases', 'class Persona { private String nombre; Persona(String n) { this.nombre = n; } String getNombre() { return nombre; } }'],
    ['Herencia', 'class Perro extends Animal { @Override void hacerSonido() { … } }  ·  super(…)'],
    ['Interfaz', 'interface Imprimible { void imprimir(); }  ·  class Foto implements Imprimible { … }'],
    ['Errores', 'try { … } catch (NumberFormatException e) { … } finally { … }  ·  throw new MiError("…");'],
    ['Git', 'git init · git status · git add . · git commit -m "msg" · git log --oneline · git push · git pull']
  ];

  return { EDICION: EDICION, CAP0: CAP0, PARTES: PARTES, ERRORES: ERRORES, REFERENCIA: REFERENCIA };
})();
