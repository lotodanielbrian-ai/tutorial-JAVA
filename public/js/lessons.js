// Java INPRO — Lessons data + UI helpers
// ── Syntax highlighter ─────────────────────────────────────────────────
function jHL(raw) {
  let s = raw.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  s = s.replace(/(\/\/[^\n]*)/g,'«cc»$1«/»');
  s = s.replace(/(\/\*[\s\S]*?\*\/)/g,'«cc»$1«/»');
  s = s.replace(/("[^"]*")/g,'«cs»$1«/»');
  s = s.replace(/\b(public|class|static|void|int|double|boolean|String|if|else|for|while|return|new|try|catch|finally|switch|case|break|default)\b/g,'«ck»$1«/»');
  s = s.replace(/\b(System|out|println|print|Math|Scanner|ArrayList)\b/g,'«co»$1«/»');
  s = s.replace(/\b([0-9]+(\.[0-9]+)?)\b/g,'«cn»$1«/»');
  s = s.replace(/\b([a-z][a-zA-Z0-9_]*)\(/g,'«cm»$1«/»(');
  
  s = s.replace(/«([a-z]{2})»/g, '<span class="$1">');
  s = s.replace(/«\/»/g, '</span>');
  return s;
}
function cb(label, code) {
  return `<div class="cblock"><div class="cblock-head"><div class="cblock-dots"><span class="cd-r"></span><span class="cd-y"></span><span class="cd-g"></span></div><span>${label}</span></div><div class="cblock-body">${jHL(code)}</div></div>`;
}
function ann(type, icon, html) {
  return `<div class="ann ann-${type}"><div class="ann-icon">${icon}</div><div>${html}</div></div>`;
}
function gl(word, def) {
  return `<span class="glossary" data-def="${def}">${word}</span>`;
}

// ── Lessons ──────────────────────────────────────────────────────────
const LESSONS = [
{
  id:1, level:'super', levelLabel:'Super Básico', stars:'⭐',
  title:'Tu primer programa Java',
  desc:'Entendé la estructura mínima que necesita cualquier programa Java, y aprendé a imprimir texto en pantalla.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📝</span><h4>Pensalo así...</h4>
<p>Imaginate que Java es como una <strong>fábrica muy estricta</strong>. Para hacer algo (aunque sea una sola cosa), necesitás:</p>
<p>1️⃣ Un <strong>edificio</strong> = la <code>class</code> (todo debe estar dentro de un edificio)<br>
2️⃣ Una <strong>máquina principal</strong> = el método <code>main</code> (Java siempre busca esta máquina para arrancar)<br>
3️⃣ Una <strong>instrucción</strong> = por ejemplo <code>System.out.println("Hola")</code> (la orden de imprimir algo en pantalla)</p>
<p>En otros lenguajes como Python podés escribir <code>print("Hola")</code> suelto. En Java NO. Todo va dentro de su edificio y su máquina.</p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que significan las llaves { }?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Abren y cierran BLOQUES de codigo. Todo entre { y } pertenece al mismo bloque (clase, metodo, if, for).</p></div>
<div class="analogy-card"><p><strong>Que pasa si olvido el ;?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ El compilador dice: ';' expected. Sin ; no sabe donde termina la instruccion.</p></div>
<div class="analogy-card"><p><strong>System y system son lo mismo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ NO. Java distingue MAYUSCULAS. System con S mayuscula existe, system no.</p></div>
<div class="analogy-card"><p><strong>Que contienen los () en println("Hola")?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ El ARGUMENTO: el dato que le pasas al metodo, en este caso el texto a imprimir.</p></div>
<div class="analogy-card"><p><strong>Cual es el orden correcto de una clase?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ clase CONTIENE a main, main CONTIENE instrucciones. Como muneca rusa.</p></div>
${ann('java','☕','<strong>¿Por qué tanta "burocracia"?</strong> Porque Java fue diseñado para proyectos enormes (bancos, empresas). Toda esa estructura ayuda a que el código sea organizado cuando crece.')}
<div class="analogy-card"><h4>🖨️ Imprimir en pantalla</h4>
<p><code>System.out.println("texto")</code> → imprime el texto y baja a la siguiente línea<br>
<code>System.out.print("texto")</code> → imprime el texto y se queda en la misma línea<br><br>
Pensalo como una <strong>impresora</strong>: <code>println</code> imprime y le da al Enter, <code>print</code> imprime y espera ahí.</p>
</div>
${ann('tip','💡','Cada instrucción en Java termina con <strong>punto y coma</strong> <code>;</code>. Sin él, Java no sabe dónde termina una y empieza la siguiente. Es como el punto al final de cada oración.')}<div class="analogy-card"><h4>🔤 Glosario de simbolos - que significa cada cosa en pantalla</h4><table class="sym-tbl"><thead><tr><th>Simbolo</th><th>Nombre</th><th>Que hace</th><th>Analogia</th></tr></thead><tbody><tr><td><code>{ }</code></td><td>Llaves</td><td>Abren/cierran BLOQUES</td><td>Tapas de un libro</td></tr><tr><td><code>( )</code></td><td>Parentesis</td><td>Encierran parametros</td><td>Sobre de una carta</td></tr><tr><td><code>[ ]</code></td><td>Corchetes</td><td>Indican lista/array</td><td>Casillero numerado</td></tr><tr><td><code>;</code></td><td>Punto y coma</td><td>FINAL de instruccion</td><td>Punto de una oracion</td></tr><tr><td><code>" "</code></td><td>Comillas dobles</td><td>Delimitan TEXTO</td><td>Globo de dialogo</td></tr><tr><td><code>' '</code></td><td>Comillas simples</td><td>Delimitan UN caracter</td><td>Letra en un cartel</td></tr><tr><td><code>//</code></td><td>Doble barra</td><td>Comentario 1 linea</td><td>Nota al margen</td></tr><tr><td><code>/* */</code></td><td>Barra-asterisco</td><td>Comentario multilinea</td><td>Post-it en la pagina</td></tr></tbody></table></div>
`,
  tutorial: () => `
<div class="ts">
<h3>¿Por qué tanto código para una línea?</h3>
<p>En Java <strong>todo</strong> debe estar dentro de una ${gl('clase','Una clase es un contenedor/molde que agrupa código relacionado. En Java, todo el código debe vivir dentro de una clase.')}. No podés escribir instrucciones sueltas. La estructura mínima siempre es:</p>
${cb('Main.java', `public class Main {
    public static void main(String[] args) {
        System.out.println("¡Hola, Java!");
    }
}`)}
${ann('java','☕','Esto es el programa más corto posible que funciona. Cada parte tiene un motivo de existir.')}
</div>
<div class="ts">
<h3>Qué significa cada palabra</h3>
<table class="sym-tbl">
<thead><tr><th>Palabra</th><th>Qué es</th><th>Por qué está ahí</th></tr></thead>
<tbody>
<tr><td>public</td><td>Modificador de acceso</td><td>La clase/método puede ser accedida desde cualquier lugar</td></tr>
<tr><td>class</td><td>Palabra clave</td><td>Le dice a Java que lo que sigue es una clase (un molde/contenedor)</td></tr>
<tr><td>Main</td><td>Nombre de la clase</td><td>Podés llamarla como quieras, pero debe coincidir EXACTAMENTE con el nombre del archivo (.java)</td></tr>
<tr><td>static</td><td>Modificador</td><td>El método pertenece a la clase, no a un objeto</td></tr>
<tr><td>void</td><td>Tipo de retorno</td><td>Este método no devuelve ningún valor</td></tr>
<tr><td>main</td><td>Nombre del método</td><td>Java busca EXACTAMENTE este nombre para saber por dónde empezar</td></tr>
<tr><td>String[] args</td><td>Parámetro</td><td>Argumentos de línea de comando. Por ahora siempre se escribe así.</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Imprimir texto: println vs print</h3>
${cb('Diferencias de impresión', `public class Main {
    public static void main(String[] args) {
        System.out.println("Con salto de línea");   // imprime y pasa a la siguiente línea
        System.out.println("Segunda línea");
        System.out.print("Sin salto ");              // NO pasa de línea
        System.out.print("continúa aquí");           // sigue en la misma línea
    }
}`)}
</div>
<div class="ts">
<h3>El punto y coma ;</h3>
<p>Cada instrucción en Java <strong>termina con punto y coma</strong>. Sin él, Java no sabe dónde termina una y empieza la siguiente.</p>
${ann('warn','⚠️','<strong>NO termina con ;</strong>: la declaración de clase, la declaración de método, las llaves. <strong>SÍ termina con ;</strong>: todo lo demás.')}
</div>
<div class="ts">
<div class="ts">
<h3>☕ ¿Qué es Java y por qué existe?</h3>
<p>Java fue creado en 1995 por Sun Microsystems (liderado por <strong>James Gosling</strong>) con una promesa revolucionaria: <strong>"Write Once, Run Anywhere"</strong> (escribilo una vez, ejecutalo en cualquier lado).</p>
<p>¿Cómo lo logra? Tu código <code>.java</code> se <strong>compila</strong> a un formato intermedio llamado <strong>bytecode</strong> (<code>.class</code>). Ese bytecode no corre directamente en tu computadora — corre en una <strong>máquina virtual</strong> (JVM: Java Virtual Machine). La JVM traduce el bytecode a instrucciones nativas de cada sistema operativo. Por eso el mismo <code>.class</code> funciona en Windows, Mac, Linux y Android sin cambios.</p>
${cb('Flujo de compilación y ejecución', `Tu código          javac              java
Main.java  ───▶  Main.class  ───▶  JVM  ───▶  Programa corriendo
(código fuente)   (bytecode)       (máquina virtual)`)}
<p>Para instalar Java en tu computadora necesitás el <strong>JDK</strong> (Java Development Kit). Verificá si ya lo tenés abriendo una terminal y escribiendo <code>java -version</code> y <code>javac -version</code>. Si no, descargalo desde <code>oracle.com/java</code> o usá OpenJDK.</p>
${ann('tip','💡','En este tutorial no necesitás instalar nada. El editor web valida tu código automáticamente. Pero cuando pases a proyectos reales, vas a necesitar el JDK y un IDE como Eclipse, IntelliJ o VS Code.')}
</div>

<h3>Comentarios</h3>
${cb('Tipos de comentarios', `// Comentario de una sola línea — Java lo ignora completamente

/* Comentario
   de múltiples
   líneas */

// Los comentarios sirven para explicar el código, son solo para los humanos`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>System.out.println("Hola") // sin ;</code></td><td>';' expected</td><td>Falta el punto y coma que termina la instruccion.</td></tr>
<tr><td><code>public class Main { // sin }</code></td><td>reached end of file while parsing</td><td>El compilador llego al final y no encontro la llave que cierra.</td></tr>
<tr><td><code>system.out.println();</code></td><td>cannot find symbol</td><td>No existe system. Es System con S mayuscula.</td></tr>
<tr><td><code>string nombre = "Ana";</code></td><td>cannot find symbol</td><td>No existe string. La clase es String con S mayuscula.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Escribí un programa que imprima exactamente estas dos líneas en pantalla.',
    expected: '¡Hola, Java!\nBienvenido al tutorial',
    starter: `public class Main {
    public static void main(String[] args) {
        // Escribí tu código aquí
        
    }
}`,
    hints: [
      'Necesitás dos llamadas a <code>System.out.println()</code>, una por línea.',
      'El texto va entre comillas dobles: <code>System.out.println("texto");</code>. Cada instrucción termina con <code>;</code>.',
      'Debería verse así: <code>System.out.println("¡Hola, Java!");</code> seguido de <code>System.out.println("Bienvenido al tutorial");</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Texto incorrecto:</strong> Verificá signos de exclamación y comas exactas.</li><li><strong>Código comentado:</strong> Si usaste <code>//</code>, borralas porque Java ignora esa línea.</li><li><strong>Falta salto de línea:</strong> Usá <code>println()</code> en lugar de <code>print()</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        System.out.println("¡Hola, Java!");
        System.out.println("Bienvenido al tutorial");
    }
}`)}`
    ]
  }
},
{
  id:2, level:'super', levelLabel:'Super Básico', stars:'⭐',
  title:'Variables y tipos de datos',
  desc:'Aprendé a guardar información en variables: números enteros, decimales, texto y valores lógicos.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📦</span><h4>Pensalo así...</h4>
<p>Una variable es como una <strong>caja con etiqueta</strong>. Vos decidís:</p>
<p>1️⃣ <strong>Qué tipo de cosa va adentro</strong> → <code>int</code> (números), <code>String</code> (texto), <code>boolean</code> (sí/no)<br>
2️⃣ <strong>El nombre de la etiqueta</strong> → <code>edad</code>, <code>nombre</code>, <code>precio</code><br>
3️⃣ <strong>Qué valor guardás</strong> → <code>25</code>, <code>"Ana"</code>, <code>19.99</code></p>
<p>La fórmula siempre es: <code>tipo nombre = valor;</code></p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que tipo usarias para una edad?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ int. La edad es un numero entero sin decimales.</p></div>
<div class="analogy-card"><p><strong>char vs String?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ char = UN caracter ('A'), String = TEXTO ("Hola"). char usa comillas simples, String dobles.</p></div>
<div class="analogy-card"><p><strong>Por que int edad = "veinticinco" no funciona?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ int espera NUMERO (25), no TEXTO. El compilador dice: incompatible types.</p></div>
<div class="analogy-card"><p><strong>Que significa camelCase?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Escribir variables con primera minuscula y siguientes mayuscula: nombreCompleto, precioTotal.</p></div>
<div class="analogy-card"><p><strong>Que hace final en una variable?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ La vuelve CONSTANTE: su valor no puede cambiar. Como la fecha de nacimiento en un documento.</p></div>
${ann('java','📌','Java es <strong>estricto con los tipos</strong>. Si la caja es para números enteros (<code>int</code>), no podés meter texto. Otros lenguajes como Python son más flexibles con esto.')}
<div class="analogy-card"><h4>🏷️ Los 4 tipos que más vas a usar</h4>
<p><code>int</code> → números sin decimales (edad, cantidad, año): <code>int edad = 25;</code><br>
<code>double</code> → números con decimales (precio, altura): <code>double precio = 19.99;</code><br>
<code>boolean</code> → verdadero o falso: <code>boolean activo = true;</code><br>
<code>String</code> → texto (va con comillas dobles): <code>String nombre = "Ana";</code></p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>¿Qué es una variable?</h3>
<p>Una variable es un <strong>espacio con nombre</strong> en memoria donde guardás un valor. En Java, antes de usar una variable tenés que decirle qué <strong>tipo de dato</strong> va a guardar.</p>
${cb('Declaración de variables', `int edad = 25;           // guarda el número entero 25
double altura = 1.75;    // guarda el decimal 1.75
boolean esEstudiante = true;  // guarda verdadero o falso
char inicial = 'A';      // guarda UN solo carácter (comillas simples)
String nombre = "Ana";   // guarda texto (comillas dobles)`)}
${ann('java','📌','La sintaxis siempre es: <code>tipo nombreVariable = valor;</code>. Primero el tipo, luego el nombre que vos elegís, luego <code>=</code>, luego el valor.')}
</div>
<div class="ts">
<h3>Tipos primitivos — los 4 más usados</h3>
<table class="sym-tbl">
<thead><tr><th>Tipo</th><th>Qué guarda</th><th>Ejemplo</th><th>Cuándo usarlo</th></tr></thead>
<tbody>
<tr><td>int</td><td>Números enteros</td><td>int x = 42;</td><td>Contadores, edades, IDs</td></tr>
<tr><td>double</td><td>Números decimales</td><td>double pi = 3.14;</td><td>Precios, medidas</td></tr>
<tr><td>boolean</td><td>Verdadero o falso</td><td>boolean ok = true;</td><td>Condiciones, flags</td></tr>
<tr><td>char</td><td>Un solo carácter</td><td>char c = 'A';</td><td>Caracteres sueltos</td></tr>
</tbody>
</table>
${ann('warn','⚠️','<strong>char usa comillas simples</strong> <code>\'A\'</code>, <strong>String usa comillas dobles</strong> <code>"texto"</code>. Es un error muy común confundirlos.')}
</div>
<div class="ts">
<h3>Imprimir variables con concatenación</h3>
${cb('Concatenar variables con texto', `String nombre = "Ana";
int edad = 25;
System.out.println("Nombre: " + nombre);   // → Nombre: Ana
System.out.println("Edad: " + edad);       // → Edad: 25
System.out.println("Hola " + nombre + ", tenés " + edad + " años.");`)}
${ann('tip','💡','Cuando mezclás texto y número con <code>+</code>, Java convierte todo a texto automáticamente.')}
</div>
<div class="ts">
<h3>Reglas para nombrar variables</h3>
<ul>
<li>Empezar con letra minúscula: <code>edad</code>, no <code>Edad</code></li>
<li>Si tiene varias palabras, usá <strong>camelCase</strong>: <code>nombreCompleto</code></li>
<li>Sin espacios, sin guiones, sin acentos en el nombre</li>
<li>No puede ser una palabra reservada (<code>int</code>, <code>class</code>, <code>for</code>)</li>
</ul>
</div>
<div class="ts">
<h3>Variables constantes con final</h3>
${cb('Constantes', `final double PI = 3.14159;   // no puede cambiar de valor
final int MAX_INTENTOS = 3;
// PI = 3.0;  ← esto daría error de compilación
// Convención: constantes en MAYÚSCULAS_CON_GUION`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>edad = 25; // sin tipo</code></td><td>cannot find symbol</td><td>No declaraste el tipo (int). Java no sabe que clase de caja crear.</td></tr>
<tr><td><code>int edad = "25";</code></td><td>incompatible types</td><td>Pusiste texto donde va numero. Quita las comillas.</td></tr>
<tr><td><code>String nombre = Ana; // sin comillas</code></td><td>cannot find symbol</td><td>Ana sin comillas es tratado como variable, no como texto.</td></tr>
<tr><td><code>string nombre = "Ana";</code></td><td>cannot find symbol</td><td>string con minuscula no existe. Es String con S mayuscula.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Declará cuatro variables: nombre="Ana", edad=25, altura=1.75, esEstudiante=true. Imprimí cada una.',
    expected: 'Nombre: Ana\nEdad: 25\nAltura: 1.75\nEstudiante: true',
    starter: `public class Main {
    public static void main(String[] args) {
        // Declará las variables aquí
        
        // Imprimí cada una
        
    }
}`,
    hints: [
      'Necesitás cuatro variables: <code>String nombre = "Ana";</code>, <code>int edad = 25;</code>, <code>double altura = 1.75;</code>, <code>boolean esEstudiante = true;</code>.',
      'Para imprimir, concatená: <code>System.out.println("Nombre: " + nombre);</code>. Hacé lo mismo para las otras tres.',
      'El formato exacto es "Nombre: ", "Edad: ", "Altura: ", "Estudiante: " seguido del valor.',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta el tipo de dato:</strong> Acordate de poner <code>String</code>, <code>int</code>, etc., antes del nombre.</li><li><strong>Mayúsculas:</strong> <code>String</code> va con S mayúscula.</li><li><strong>Concatenación:</strong> Usá el signo <code>+</code> para unir texto y variables.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        String nombre = "Ana";
        int edad = 25;
        double altura = 1.75;
        boolean esEstudiante = true;
        
        System.out.println("Nombre: " + nombre);
        System.out.println("Edad: " + edad);
        System.out.println("Altura: " + altura);
        System.out.println("Estudiante: " + esEstudiante);
    }
}`)}`
    ]
  }
},
{
  id:3, level:'super', levelLabel:'Super Básico', stars:'⭐',
  title:'Operadores aritméticos',
  desc:'Realizá cálculos con números. Descubrí la diferencia entre división entera y decimal.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🧮</span><h4>Pensalo así...</h4>
<p>Java sabe hacer matemáticas, pero tiene una regla rara: <strong>si dividís dos enteros, el resultado es entero</strong> (corta los decimales).</p>
<p><code>15 / 4</code> en tu calculadora = <code>3.75</code><br>
<code>15 / 4</code> en Java con <code>int</code> = <code>3</code> (cortó el .75)</p>
<p>Para obtener decimales, al menos uno debe ser <code>double</code>: <code>15.0 / 4</code> = <code>3.75</code> ✅</p>
</div>
<div class="analogy-card"><h4>🎯 El módulo % — el resto</h4>
<p>El operador <code>%</code> te da el <strong>resto</strong> de la división. Es super útil para saber si un número es par o impar:</p>
<p><code>10 % 2 = 0</code> → es <strong>par</strong> (divide justo)<br>
<code>7 % 2 = 1</code> → es <strong>impar</strong> (sobra 1)</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Los operadores básicos</h3>
${cb('Aritméticos', `int a = 15, b = 4;

int suma       = a + b;   // 19
int resta      = a - b;   // 11
int producto   = a * b;   // 60
int divEntera  = a / b;   // 3  ← OJO: no da 3.75, descarta decimales
int resto      = a % b;   // 3  ← el sobrante de dividir 15 entre 4`)}
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Cuanto da 15 / 4 en Java?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 3. Como ambos son int, Java trunca los decimales. No es 3.75.</p></div>
<div class="analogy-card"><p><strong>Cuanto da 15 % 4?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 3. Es el RESTO de dividir 15 entre 4.</p></div>
<div class="analogy-card"><p><strong>Como saber si un numero es PAR?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Con %. Si numero % 2 == 0, es PAR. Si == 1, es IMPAR.</p></div>
<div class="analogy-card"><p><strong>Que significa x++?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ "Aumentale 1 a x". Igual que x = x + 1 o x += 1.</p></div>
<div class="analogy-card"><p><strong>Diferencia entre ++x y x++?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ ++x: suma primero, despues usa. x++: usa primero, despues suma.</p></div>
${ann('warn','⚠️','<strong>División entre enteros siempre da entero</strong>. <code>15 / 4</code> en Java es <code>3</code>, no <code>3.75</code>. Si necesitás decimales, usá <code>15.0 / 4</code>.')}
</div>
<div class="ts">
<h3>Operadores de asignación abreviados</h3>
<table class="sym-tbl">
<thead><tr><th>Abreviado</th><th>Equivale a</th><th>Ejemplo</th></tr></thead>
<tbody>
<tr><td>x += 5</td><td>x = x + 5</td><td>Si x era 10, ahora es 15</td></tr>
<tr><td>x -= 3</td><td>x = x - 3</td><td>Si x era 10, ahora es 7</td></tr>
<tr><td>x *= 2</td><td>x = x * 2</td><td>Si x era 10, ahora es 20</td></tr>
<tr><td>x /= 4</td><td>x = x / 4</td><td>Si x era 20, ahora es 5</td></tr>
<tr><td>x %= 3</td><td>x = x % 3</td><td>Si x era 10, ahora es 1</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Incremento y decremento</h3>
${cb('++ y --', `int i = 5;
i++;          // i ahora es 6  (equivale a i += 1)
i--;          // i ahora es 5  (equivale a i -= 1)

// Diferencia entre prefijo y sufijo
int a = 5;
int b = a++;  // b = 5, a = 6  → primero asigna, después incrementa
int c = ++a;  // c = 7, a = 7  → primero incrementa, después asigna`)}
</div>
<div class="ts">
<h3>Precedencia de operadores</h3>
${cb('Precedencia', `int r1 = 2 + 3 * 4;      // 14 (no 20) — * primero
int r2 = (2 + 3) * 4;    // 20 — paréntesis primero`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>int r = a + b; // sin parentesis en println</code></td><td>Concatenacion rota</td><td>println("Suma: " + a + b) concatena. Usa println("Suma: " + (a+b)).</td></tr>
<tr><td><code>15 / 4 esperando 3.75</code></td><td>Resultado inesperado</td><td>Division de enteros trunca decimales. Usa 15.0 / 4.</td></tr>
<tr><td><code>int r = a % b; // confundir % con /</code></td><td>Resultado incorrecto</td><td>% es el RESTO, no la division. 15%4=3.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con a=15 y b=4, calculá e imprimí cada resultado con el formato indicado.',
    expected: 'Suma: 19\nResta: 11\nProducto: 60\nDivisión entera: 3\nResto: 3',
    starter: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        // Calculá e imprimí cada resultado
        
    }
}`,
    hints: [
      'Podés calcular directamente en el println: <code>System.out.println("Suma: " + (a + b));</code>. Usá paréntesis.',
      'La división entera: <code>a / b</code> da 3. El resto: <code>a % b</code> da 3.',
      'El formato exacto es "Suma: ", "Resta: ", "Producto: ", "División entera: ", "Resto: ".',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta de paréntesis:</strong> Si hacés <code>"Suma: " + a + b</code> va a concatenar (154) en vez de sumar (19). Usá <code>"Suma: " + (a + b)</code>.</li><li><strong>Símbolos incorrectos:</strong> El resto se calcula con <code>%</code>, no con <code>/</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 4;
        System.out.println("Suma: " + (a + b));
        System.out.println("Resta: " + (a - b));
        System.out.println("Producto: " + (a * b));
        System.out.println("División entera: " + (a / b));
        System.out.println("Resto: " + (a % b));
    }
}`)}`
    ]
  }
},
{
  id:4, level:'super', levelLabel:'Super Básico', stars:'⭐',
  title:'Strings y sus métodos',
  desc:'Manipulá texto: convertí mayúsculas, medí longitud, buscá caracteres y compará cadenas.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔤</span><h4>Pensalo así...</h4>
<p>Un <code>String</code> es como un <strong>collar de letras</strong>. Cada letra tiene una posición (empezando desde 0, no desde 1):</p>
<p><code>"java"</code> → posición 0: <code>j</code>, posición 1: <code>a</code>, posición 2: <code>v</code>, posición 3: <code>a</code></p>
<p>Y como es un <strong>objeto</strong> (no un tipo simple como <code>int</code>), tiene "poderes" (métodos) que podés usar con el punto:</p>
<p><code>"java".toUpperCase()</code> → <code>"JAVA"</code><br>
<code>"java".length()</code> → <code>4</code><br>
<code>"java".charAt(0)</code> → <code>'j'</code></p>
</div>
<div class="analogy-card"><h4>El control remoto del String</h4><p>Un String es un objeto con "botones" (metodos). .toUpperCase() = boton MAYUSCULAS. .length() = boton CONTAR. .charAt(0) = boton PRIMERA LETRA. Cada boton hace algo distinto.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>"Java".charAt(0) devuelve...?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ J. Las posiciones empiezan en 0: J=0, a=1, v=2, a=3.</p></div>
<div class="analogy-card"><p><strong>Forma correcta de comparar Strings?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ texto1.equals(texto2). NUNCA ==. == compara direcciones de memoria, .equals() compara contenido.</p></div>
<div class="analogy-card"><p><strong>"Hola".length() devuelve 4?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si. H(1)+o(2)+l(3)+a(4)=4. Los espacios tambien cuentan.</p></div>
<div class="analogy-card"><p><strong>Que hace .toUpperCase()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Convierte a MAYUSCULAS. "java" -> "JAVA". Lo opuesto: .toLowerCase().</p></div>
<div class="analogy-card"><p><strong>Por que .length() lleva () y .length de array no?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ .length() es METODO (accion). .length es ATRIBUTO (propiedad fija). Metodos llevan ().</p></div>
${ann('warn','❌','<strong>NUNCA uses == para comparar Strings.</strong> Usá siempre <code>.equals()</code>. Es el error #1 de principiantes en Java.')}`,
  tutorial: () => `
<div class="ts">
<h3>String es un objeto, no un primitivo</h3>
<p><code>String</code> (con S mayúscula) es una <strong>clase</strong>. Cada String tiene <strong>métodos</strong> que podés llamar con el punto.</p>
${cb('Métodos de String', `String s = "java tutorial";

System.out.println(s.length());           // 13
System.out.println(s.toUpperCase());      // JAVA TUTORIAL
System.out.println(s.charAt(0));          // j
System.out.println(s.contains("tutorial")); // true
System.out.println(s.substring(5));       // tutorial
System.out.println(s.replace("java", "Java")); // Java tutorial`)}
${ann('warn','⚠️','<strong>Los índices empiezan en 0</strong>. El primer carácter es <code>.charAt(0)</code>.')}
</div>
<div class="ts">
<h3>Comparar Strings — equals(), no ==</h3>
${cb('Error clásico vs forma correcta', `String a = "hola";
String b = "hola";

// MAL (compara referencias en memoria, no el contenido)
if (a == b) { }         // puede dar resultados inesperados

// BIEN (compara el contenido del texto)
if (a.equals(b)) { }    // siempre correcto`)}
</div>
<div class="ts">
<h3>Concatenación de Strings</h3>
${cb('Cuidado con + entre números y texto', `System.out.println("Resultado: " + 2 + 3);   // "Resultado: 23" (NO 5)
System.out.println("Resultado: " + (2 + 3)); // "Resultado: 5"  ← correcto`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>"Hola".length; // sin ()</code></td><td>Error de compilacion</td><td>length() es un METODO, necesita parentesis.</td></tr>
<tr><td><code>if (a == b) para Strings</code></td><td>Resultado impredecible</td><td>== compara direcciones de memoria. Usa .equals().</td></tr>
<tr><td><code>"Hola".charAt(4)</code></td><td>StringIndexOutOfBoundsException</td><td>Indices van de 0 a length()-1. charAt(4) en "Hola" (4 letras) esta fuera de rango.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con String s = "java tutorial", imprimí los resultados usando métodos de String.',
    expected: "Original: java tutorial\nMayúsculas: JAVA TUTORIAL\nLongitud: 13\nPrimera letra: j\nContiene 'tutorial': true",
    starter: `public class Main {
    public static void main(String[] args) {
        String s = "java tutorial";
        // Usá métodos de String para imprimir cada línea
        
    }
}`,
    hints: [
      'Para mayúsculas: <code>.toUpperCase()</code>. Para longitud: <code>.length()</code> (con paréntesis).',
      'Primera letra: <code>s.charAt(0)</code>. Contiene: <code>s.contains("tutorial")</code>.',
      'La quinta línea: <code>System.out.println("Contiene \'tutorial\': " + s.contains("tutorial"));</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Olvidar paréntesis:</strong> Los métodos llevan paréntesis al final, ej: <code>.length()</code>.</li><li><strong>Índices erróneos:</strong> La primera letra es <code>charAt(0)</code>, no 1.</li><li><strong>Comillas:</strong> Las comillas dobles dentro de otras comillas dobles se escapan o se usan comillas simples: <code>"Contiene 'tutorial': "</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        String s = "java tutorial";
        System.out.println("Original: " + s);
        System.out.println("Mayúsculas: " + s.toUpperCase());
        System.out.println("Longitud: " + s.length());
        System.out.println("Primera letra: " + s.charAt(0));
        System.out.println("Contiene 'tutorial': " + s.contains("tutorial"));
    }
}`)}`
    ]
  }
},
{
  id:5, level:'super', levelLabel:'Super Básico', stars:'⭐',
  title:'Conversiones y la clase Math',
  desc:'Convertí entre tipos (casting), pasá de String a número y usá funciones matemáticas.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔄</span><h4>Pensalo así...</h4>
<p><strong>Widening</strong> (automático): es como pasar agua de un vaso chico a uno grande. Siempre funciona, no se pierde nada.<br>
<code>int → double</code>: el 7 se convierte en 7.0</p>
<p><strong>Narrowing</strong> (manual): es como pasar agua de un vaso grande a uno chico. Puede derramarse (perder datos).<br>
<code>double → int</code>: el 3.9 se convierte en 3 (¡CORTA los decimales!)</p>
</div>
<div class="analogy-card"><h4>📐 Math — tu calculadora científica</h4>
<p><code>Math.round(3.7)</code> → 4 (redondea)<br>
<code>Math.sqrt(16)</code> → 4.0 (raíz cuadrada)<br>
<code>Math.pow(2, 10)</code> → 1024.0 (2 elevado a la 10)<br>
<code>Math.max(5, 9)</code> → 9 (el mayor)<br>
<code>Math.abs(-5)</code> → 5 (valor absoluto)</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Conversión automática (widening)</h3>
${cb('Widening', `int entero = 7;
double decimal = entero;    // automático: int → double = 7.0`)}
</div>
<div class="ts">
<h3>Cast manual (narrowing)</h3>
${cb('Casting explícito', `double d = 3.9;
int truncado = (int) d;    // 3 — NO redondea, simplemente corta`)}
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>(int) 3.9 = ?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 3. El cast CORTA decimales, NO redondea.</p></div>
<div class="analogy-card"><p><strong>Math.round(3.9) = ?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 4. Redondea al entero mas cercano.</p></div>
<div class="analogy-card"><p><strong>Integer.parseInt("100") hace...?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Convierte el TEXTO "100" en el NUMERO 100. Parsear = leer e interpretar.</p></div>
<div class="analogy-card"><p><strong>Math.sqrt(25)?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 5.0. sqrt = raiz cuadrada. 5x5=25.</p></div>
<div class="analogy-card"><p><strong>Math.pow(2, 3)?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 8.0. 2 elevado a la 3 = 2x2x2 = 8.</p></div>
${ann('warn','⚠️','El cast <code>(int) 3.9</code> da <code>3</code>, no <code>4</code>. Si querés redondear, usá <code>Math.round()</code>.')}
</div>
<div class="ts">
<h3>String ↔ número</h3>
${cb('Parsear', `String texto = "42";
int numero = Integer.parseInt(texto);     // 42 como int
double d = Double.parseDouble("3.14");    // 3.14 como double
String s = String.valueOf(42);            // "42" como String`)}
</div>
<div class="ts">
<h3>La clase Math</h3>
<table class="sym-tbl">
<thead><tr><th>Método</th><th>Qué hace</th><th>Ejemplo</th></tr></thead>
<tbody>
<tr><td>Math.round(x)</td><td>Redondea</td><td>Math.round(3.7) → 4</td></tr>
<tr><td>Math.ceil(x)</td><td>Redondea arriba</td><td>Math.ceil(3.1) → 4.0</td></tr>
<tr><td>Math.floor(x)</td><td>Redondea abajo</td><td>Math.floor(3.9) → 3.0</td></tr>
<tr><td>Math.abs(x)</td><td>Valor absoluto</td><td>Math.abs(-5) → 5</td></tr>
<tr><td>Math.pow(x,y)</td><td>Potencia</td><td>Math.pow(2,10) → 1024.0</td></tr>
<tr><td>Math.sqrt(x)</td><td>Raíz cuadrada</td><td>Math.sqrt(16) → 4.0</td></tr>
<tr><td>Math.max(a,b)</td><td>El mayor</td><td>Math.max(5,9) → 9</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>(int) 3.9 esperando 4</code></td><td>Resultado incorrecto</td><td>(int) trunca, NO redondea. Usa Math.round().</td></tr>
<tr><td><code>Integer.parseInt("abc")</code></td><td>NumberFormatException</td><td>El texto no es un numero valido.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Realizá conversiones y cálculos. Imprimí los resultados exactos.',
    expected: 'Entero: 7\nDecimal: 7.0\nCortado a int: 3\nRedondeado: 4\nRaíz de 16: 4.0',
    starter: `public class Main {
    public static void main(String[] args) {
        int entero = 7;
        double d = 3.7;
        // 1. El entero tal cual
        // 2. El entero convertido a double
        // 3. d casteado a int
        // 4. d redondeado con Math.round()
        // 5. La raíz cuadrada de 16
        
    }
}`,
    hints: [
      'Para "Decimal: 7.0", hacé <code>double dec = entero;</code> (widening automático).',
      'Cast: <code>(int) d</code> da 3. Redondeado: <code>Math.round(d)</code> da 4.',
      'Formato: "Cortado a int: " + (int)d, "Raíz de 16: " + Math.sqrt(16).',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Casting incorrecto:</strong> El cast se escribe <code>(int) d</code>, no <code>int(d)</code>.</li><li><strong>Confundir redondeo con cast:</strong> El cast solo corta decimales, <code>Math.round()</code> redondea al entero más cercano.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int entero = 7;
        double d = 3.7;
        System.out.println("Entero: " + entero);
        System.out.println("Decimal: " + (double)entero);
        System.out.println("Cortado a int: " + (int)d);
        System.out.println("Redondeado: " + Math.round(d));
        System.out.println("Raíz de 16: " + Math.sqrt(16));
    }
}`)}`
    ]
  }
},
{
  id:6, level:'super', levelLabel:'Examen Super Básico', stars:'⭐⭐',
  title:'Examen Super Básico',
  desc:'Demostrá que dominás variables, operadores, Strings, Math y conversiones antes de pasar al nivel Básico.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏆</span><h4>¡Tu primer examen!</h4>
<p>Llegaste al final del nivel <strong>Super Básico</strong>. Este examen evalúa todo lo que aprendiste en las primeras 5 lecciones: variables, tipos, operadores, Strings, Math y conversiones.</p>
<p>Si hiciste los ejercicios, esto te sale solo. ¡Confiá en vos!</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Requerimientos del Examen</h3>
<p>Tenés una variable nombre con espacios extra y 3 notas. Tu misión:</p>
<ol>
  <li>Eliminá los espacios del nombre con <code>.trim()</code></li>
  <li>Convertilo a MAYÚSCULAS con <code>.toUpperCase()</code></li>
  <li>Calculá el promedio de las 3 notas (sumá y dividí)</li>
  <li>Redondeá el promedio con <code>Math.round()</code></li>
  <li>Imprimí exactamente:<br><code>NOMBRE: JAVA STUDENT</code><br><code>PROMEDIO: 82</code></li>
</ol>
</div>`,
  exercise: {
    desc: 'Procesá el nombre (trim + toUpperCase) y calculá el promedio redondeado de las 3 notas.',
    expected: 'NOMBRE: JAVA STUDENT\nPROMEDIO: 82',
    starter: `public class Main {
    public static void main(String[] args) {
        String nombre = "  Java Student  ";
        int nota1 = 85, nota2 = 72, nota3 = 90;
        
        // Procesá el nombre y calculá el promedio
        
    }
}`,
    hints: [
      'Eliminá espacios: <code>String nombreLimpio = nombre.trim();</code>',
      'Mayúsculas: <code>String nombreMayus = nombreLimpio.toUpperCase();</code>',
      'Promedio: <code>int promedio = (nota1 + nota2 + nota3) / 3;</code> — con int la división trunca decimales.',
      'Al usar int, (85+72+90)/3 = 247/3 = 82 (trunca). Justo lo que necesitás, no hace falta Math.round.',
      '<strong>Errores comunes:</strong><ul><li><strong>Olvidar ()</strong>: .trim() y .toUpperCase() llevan parentesis.</li><li><strong>Division entera</strong>: con int ya trunca, no necesitas Math.round.</li></ul><strong>La solucion:</strong><br>Si seguis trabado, copia este codigo:<br>' + cb('Solucion', 'public class Main {\n    public static void main(String[] args) {\n        String nombre = "  Java Student  ";\n        int nota1 = 85, nota2 = 72, nota3 = 90;\n        nombre = nombre.trim().toUpperCase();\n        int promedio = (nota1 + nota2 + nota3) / 3;\n        System.out.println("NOMBRE: " + nombre);\n        System.out.println("PROMEDIO: " + promedio);\n    }\n}')
    ]
  }
},
{
  id:7, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Condicionales: if / else',
  desc:'Tomá decisiones en tu código. Ejecutá distintas instrucciones según una condición.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🚦</span><h4>Pensalo así...</h4>
<p>Un <code>if</code> es como un <strong>semáforo</strong> en tu código:</p>
<p>🟢 Si la condición es <strong>verdadera</strong> → ejecuta el primer bloque<br>
🔴 Si es <strong>falsa</strong> → ejecuta el bloque del <code>else</code> (si existe)</p>
<p>Con <code>else if</code> es como un semáforo con <strong>muchas opciones</strong>: evalúa de arriba para abajo y ejecuta la primera que se cumple.</p>
</div><h3>Mini-Quiz: entendiste el concepto?</h3>
<div class="analogy-card"><p><strong>Que evalua un if?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Un boolean (true/false). La condicion DEBE ser true o false, no puede ser un numero suelto.</p></div>
<div class="analogy-card"><p><strong>Diferencia entre = y ==?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">= ASIGNA (x=5). == COMPARA (if x==5). El error mas comun: poner if(x=5) en vez de if(x==5).</p></div>
<div class="analogy-card"><p><strong>Que pasa con ; despues del if()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">El ; cierra el if con cuerpo VACIO. El bloque {} de abajo se ejecuta SIEMPRE. Error silencioso muy peligroso.</p></div>
<div class="analogy-card"><p><strong>Necesito else siempre?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">No. else es OPCIONAL. Usa solo if cuando solo queres actuar si la condicion se cumple.</p></div>
<div class="analogy-card"><p><strong>Cuando usar ternario vs if-else?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Ternario para asignaciones simples: String r=(edad>=18)?"Mayor":"Menor". If-else para logica compleja con multiples lineas.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>Estructura básica if / else</h3>
${cb('if / else', `int edad = 20;

if (edad >= 18) {
    System.out.println("Mayor de edad");
} else {
    System.out.println("Menor de edad");
}`)}
</div>
<div class="ts">
<h3>else if — múltiples condiciones</h3>
${cb('Cadena if / else if / else', `int nota = 75;

if (nota >= 90) {
    System.out.println("Excelente");
} else if (nota >= 75) {
    System.out.println("Bueno");
} else if (nota >= 60) {
    System.out.println("Regular");
} else {
    System.out.println("Insuficiente");
}`)}
</div>
<div class="ts">
<h3>Operadores de comparación</h3>
<table class="sym-tbl">
<thead><tr><th>Operador</th><th>Significado</th><th>Ejemplo</th></tr></thead>
<tbody>
<tr><td>==</td><td>Igual a</td><td>x == 5</td></tr>
<tr><td>!=</td><td>Distinto de</td><td>x != 5</td></tr>
<tr><td>&gt;</td><td>Mayor que</td><td>x &gt; 5</td></tr>
<tr><td>&lt;</td><td>Menor que</td><td>x &lt; 5</td></tr>
<tr><td>&gt;=</td><td>Mayor o igual</td><td>x &gt;= 5</td></tr>
<tr><td>&lt;=</td><td>Menor o igual</td><td>x &lt;= 5</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Operador ternario</h3>
${cb('Ternario', `int edad = 20;
String resultado = (edad >= 18) ? "Mayor" : "Menor";
// condición ? valorSiTrue : valorSiFalse`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>if(x = 5){...}</code></td><td>Error de compilacion</td><td>= asigna, no compara. Usa ==.</td></tr>
<tr><td><code>if(edad>=18);{...}</code></td><td>{} se ejecuta SIEMPRE</td><td>El ; cierra el if con cuerpo vacio.</td></tr>
<tr><td><code>else{...} sin if</code></td><td>'else' without 'if'</td><td>else necesita un if inmediato antes.</td></tr>
<tr><td><code>Orden incorrecto de condiciones</code></td><td>No entra a ciertos casos</td><td>Pusiste >=60 antes que >=90.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con nota=75, imprimí la nota y su categoría (≥90 Excelente · ≥75 Bueno · ≥60 Regular · <60 Insuficiente).',
    expected: 'Nota: 75\nCategoría: Bueno',
    starter: `public class Main {
    public static void main(String[] args) {
        int nota = 75;
        System.out.println("Nota: " + nota);
        // Determiná e imprimí la categoría
        
    }
}`,
    hints: [
      'Necesitás <code>if / else if / else</code>. Las condiciones van de mayor a menor.',
      'Estructura: <code>if (nota >= 90)</code>, <code>else if (nota >= 75)</code>, <code>else if (nota >= 60)</code>, <code>else</code>.',
      'Podés usar: <code>String cat;</code> y asignarla dentro del if, luego <code>System.out.println("Categoría: " + cat);</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Orden de condiciones:</strong> Si ponés <code>&gt;= 60</code> antes que <code>&gt;= 90</code>, el 75 va a caer en el 60 y frenar ahí. ¡Siempre de mayor a menor!</li><li><strong>Falta de llaves:</strong> Asegurate de que cada <code>if</code> y <code>else if</code> tenga sus llaves <code>{ }</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int nota = 75;
        System.out.println("Nota: " + nota);
        
        if (nota >= 90) {
            System.out.println("Categoría: Excelente");
        } else if (nota >= 75) {
            System.out.println("Categoría: Bueno");
        } else if (nota >= 60) {
            System.out.println("Categoría: Regular");
        } else {
            System.out.println("Categoría: Insuficiente");
        }
    }
}`)}`
    ]
  }
},
{
  id:8, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Switch / case',
  desc:'Elegí entre múltiples opciones de forma clara. Ideal para menús y selecciones.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🎛️</span><h4>Pensalo así...</h4>
<p>Un <code>switch</code> es como una <strong>máquina expendedora</strong>: apretás un botón (1, 2 o 3) y sale algo diferente. Cada botón es un <code>case</code>.</p>
<p>Si apretás un botón que no existe → entra al <code>default</code> (como un mensaje de "opción inválida").</p>
<p><code>break</code> es importante: sin él, la máquina "cae" al siguiente case como si lo hubieras apretado también.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Estructura del switch</h3>
${cb('Switch con int', `int opcion = 2;

switch (opcion) {
    case 1:
        System.out.println("Elegiste la opción uno");
        break;
    case 2:
        System.out.println("Elegiste la opción dos");
        break;
    case 3:
        System.out.println("Elegiste la opción tres");
        break;
    default:
        System.out.println("Opción no válida");
}`)}
<div class="analogy-card"><h4>El GPS que recalcula</h4><p>else if es como un GPS cuando hay multiples rutas. Java evalua de ARRIBA hacia ABAJO. La PRIMERA condicion que se cumple, se ejecuta. Las demas se ignoran.</p></div>
<div class="analogy-card"><h4>El control remoto del switch</h4><p>Boton 1=Netflix, 2=YouTube, 3=Spotify. Cada boton dispara una app distinta. Sin break, al apretar 1 tambien ejecuta 2 y 3. ¡Error comun!</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Para que sirve break en switch?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para SALIR del switch. Sin break, Java ejecuta los cases siguientes (fall-through).</p></div>
<div class="analogy-card"><p><strong>Que pasa sin default?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Nada. Pero es buena practica tenerlo siempre.</p></div>
<div class="analogy-card"><p><strong>Switch con double o boolean?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ NO. Solo int, char, String y enum.</p></div>
<div class="analogy-card"><p><strong>Cuando switch vs if-else?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Switch: UNA variable contra VALORES EXACTOS. If-else: RANGOS (>18, entre 60 y 90).</p></div>
<div class="analogy-card"><p><strong>Ventaja de agrupar cases sin break?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Varios cases comparten codigo. Ej: lunes a viernes -> "dia laboral". Unico caso intencional.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que evalua un if?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Un boolean (true/false). La condicion DEBE ser true o false.</p></div>
<div class="analogy-card"><p><strong>Diferencia entre = y ==?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ = ASIGNA (x=5). == COMPARA (if x==5). Error comun: if(x=5) en vez de if(x==5).</p></div>
<div class="analogy-card"><p><strong>Que pasa con ; despues del if()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ El ; cierra el if con cuerpo VACIO. El {} de abajo se ejecuta SIEMPRE. Error silencioso.</p></div>
<div class="analogy-card"><p><strong>Necesito else siempre?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. Es OPCIONAL. Usa solo if cuando solo queres actuar si se cumple.</p></div>
<div class="analogy-card"><p><strong>Cuando usar ternario?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para asignaciones simples: String r = (edad>=18)?"Mayor":"Menor"; Para logica compleja, if-else.</p></div>
${ann('warn','⚠️','<strong>No te olvides del break</strong>. Sin él, Java sigue ejecutando los cases siguientes (fall-through).')}
</div>
<div class="ts">
<h3>Switch con String</h3>
${cb('Switch con texto', `String dia = "lunes";

switch (dia) {
    case "lunes":
    case "martes":
    case "miercoles":
    case "jueves":
    case "viernes":
        System.out.println("Día laboral");
        break;
    case "sabado":
    case "domingo":
        System.out.println("Fin de semana");
        break;
    default:
        System.out.println("Día no válido");
}`)}
${ann('tip','💡','Podés agrupar cases sin break para que compartan el mismo bloque de código.')}
</div>
<div class="ts">
<h3>¿Cuándo usar switch vs if-else?</h3>
<table class="sym-tbl">
<thead><tr><th>Situación</th><th>Mejor opción</th></tr></thead>
<tbody>
<tr><td>Comparar contra valores exactos (1, 2, 3)</td><td>switch</td></tr>
<tr><td>Evaluar rangos (edad > 18)</td><td>if-else</td></tr>
<tr><td>Menú de opciones</td><td>switch</td></tr>
<tr><td>Condiciones complejas (&&, ||)</td><td>if-else</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>case 1 (sin dos puntos)</code></td><td>Error de sintaxis</td><td>El case lleva : (dos puntos), no ;.</td></tr>
<tr><td><code>Olvidaste break;</code></td><td>Ejecuta case Y el siguiente</td><td>Fall-through: Java sigue de largo.</td></tr>
<tr><td><code>switch(3.14)</code></td><td>Error de compilacion</td><td>No acepta double, float ni boolean.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con int dia = 3, imprimí el nombre del día (1=Lunes...7=Domingo). Si no es 1-7, imprimí "Día inválido".',
    expected: 'Día 3: Miércoles',
    starter: `public class Main {
    public static void main(String[] args) {
        int dia = 3;
        // Usá switch para determinar el nombre del día
        
    }
}`,
    hints: [
      'Usá <code>switch (dia)</code> con cases del 1 al 7. Cada case imprime el nombre.',
      'Case 3: <code>System.out.println("Dia " + dia + ": Miercoles");</code> seguido de <code>break;</code>',
      'El default es para valores fuera de 1-7: <code>System.out.println("Día inválido");</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Olvidar el break:</strong> Si te olvidás de poner <code>break;</code> al final de cada case, Java va a ejecutar todos los demás cases seguidos.</li><li><strong>Sintaxis del case:</strong> El case lleva dos puntos al final, no punto y coma: <code>case 1:</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int dia = 3;
        switch (dia) {
            case 1: System.out.println("Día " + dia + ": Lunes"); break;
            case 2: System.out.println("Día " + dia + ": Martes"); break;
            case 3: System.out.println("Día " + dia + ": Miércoles"); break;
            case 4: System.out.println("Día " + dia + ": Jueves"); break;
            case 5: System.out.println("Día " + dia + ": Viernes"); break;
            case 6: System.out.println("Día " + dia + ": Sábado"); break;
            case 7: System.out.println("Día " + dia + ": Domingo"); break;
            default: System.out.println("Día inválido");
        }
    }
}`)}`
    ]
  }
},
{
  id:9, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Operadores lógicos',
  desc:'Combiná condiciones con AND, OR y NOT para decisiones más complejas.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔗</span><h4>Pensalo así...</h4>
<p><code>&&</code> (AND) = "Y" → <strong>ambas</strong> deben ser verdaderas. Como para entrar a un bar: tenés que ser mayor de edad <strong>Y</strong> tener documento.<br>
<code>||</code> (OR) = "O" → basta con <strong>una</strong>. Como para un descuento: sos estudiante <strong>O</strong> sos jubilado.<br>
<code>!</code> (NOT) = "NO" → invierte. Si es true, lo vuelve false y viceversa.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Los tres operadores lógicos</h3>
${cb('Combinando condiciones', `int edad = 20;
boolean tieneLicencia = true;

if (edad >= 18 && tieneLicencia) {
    System.out.println("Puede manejar");
}

boolean esAdmin = false;
boolean esSuperuser = true;

if (esAdmin || esSuperuser) {
    System.out.println("Tiene acceso");
}

boolean listaVacia = false;
if (!listaVacia) {
    System.out.println("La lista tiene elementos");
}`)}
</div>
<div class="ts">
<h3>Evaluación en cortocircuito</h3>
${cb('Short-circuit', `String texto = null;
if (texto != null && texto.length() > 0) {
    // Si texto es null, NO llama .length() — se frena antes
}`)}
<div class="analogy-card"><h4>La receta de cocina - &&</h4><p>&& es como una receta: necesitas TODOS los ingredientes. "Si tengo harina Y huevos -> hago torta". Falta uno -> no hay torta.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Cuando da true &&?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Solo cuando AMBAS son true. true&&true=true. Todo lo demas=false.</p></div>
<div class="analogy-card"><p><strong>Que es el cortocircuito?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Con &&, si la primera es false, NO evalua la segunda. Permite null!=null && obj.isValid().</p></div>
<div class="analogy-card"><p><strong>Diferencia & vs &&?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ && hace cortocircuito. & evalua AMBAS siempre. && es mas eficiente.</p></div>
<div class="analogy-card"><p><strong>Que hace ! (NOT)?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Invierte: !true=false, !false=true. Util: if(!lista.isEmpty()).</p></div>
<div class="analogy-card"><p><strong>Parentesis en condiciones mixtas?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ && antes que ||. Ante duda, pone parentesis: (a&&b)||c.</p></div>
${ann('tip','💡','Con <code>&&</code> si la primera es false, la segunda ni se evalúa. Con <code>||</code> si la primera es true, la segunda ni se evalúa.')}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>if(x&y) en vez de &&</code></td><td>Sin cortocircuito</td><td>& es AND bit a bit. Evalua ambos siempre.</td></tr>
<tr><td><code>if(a&&b||c) sin ()</code></td><td>Ambiguo</td><td>&& antes que ||. Agrega parentesis.</td></tr>
<tr><td><code>if(x=5&&y=3)</code></td><td>Error</td><td>= asigna. Usa == para comparar.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con edad=20 y tieneLicencia=true, determiná si puede manejar (edad≥18 Y licencia).',
    expected: 'Puede manejar: true',
    starter: `public class Main {
    public static void main(String[] args) {
        int edad = 20;
        boolean tieneLicencia = true;
        // Evaluá con && y guardá en un boolean
        
    }
}`,
    hints: [
      'Combiná: <code>edad >= 18 && tieneLicencia</code>.',
      'Podés hacer: <code>boolean puedeManejar = edad >= 18 && tieneLicencia;</code>',
      'Imprimí: <code>System.out.println("Puede manejar: " + puedeManejar);</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Confundir && con ||:</strong> Queremos que se cumplan AMBAS, por lo que necesitás AND (<code>&&</code>), no OR (<code>||</code>).</li><li><strong>Olvidar concatenar:</strong> Usá el <code>+</code> para unir el texto con la variable booleana en el println.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int edad = 20;
        boolean tieneLicencia = true;
        
        boolean puedeManejar = (edad >= 18 && tieneLicencia);
        System.out.println("Puede manejar: " + puedeManejar);
    }
}`)}`
    ]
  }
},
{
  id:10, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Scanner (entrada de datos)',
  desc:'Leé datos del teclado. Permití que el usuario interactúe con tu programa.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">⌨️</span><h4>Pensalo así...</h4>
<p><code>Scanner</code> es como un <strong>micrófono</strong> que le das al usuario para que hable con tu programa.</p>
<p><code>scanner.nextLine()</code> → escucha una frase completa (String)<br>
<code>scanner.nextInt()</code> → escucha un número entero<br>
<code>scanner.nextDouble()</code> → escucha un número decimal</p>
<p>Importante: siempre tenés que importar <code>java.util.Scanner</code> y crear el objeto antes de usarlo.</p>
</div>
<div class="analogy-card"><h4>El mozo tomando tu pedido</h4><p>Scanner es un mozo. nextInt() -> "cuantas empanadas?", nextLine() -> "algun comentario?". Lee lo que escribiste y lo guarda en variables.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que import necesito para Scanner?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ import java.util.Scanner; como primera linea.</p></div>
<div class="analogy-card"><p><strong>next() vs nextLine()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ next()=UNA palabra. nextLine()=linea COMPLETA hasta Enter.</p></div>
<div class="analogy-card"><p><strong>Que es InputMismatchException?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Error cuando el usuario escribe texto donde esperabas numero. Prevenilo con hasNextInt().</p></div>
<div class="analogy-card"><p><strong>Por que falla nextLine() despues de nextInt()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ nextInt() deja el Enter en el buffer. nextLine() lo lee vacio. Solucion: sc.nextLine() extra.</p></div>
<div class="analogy-card"><p><strong>Necesito .close()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Buena practica. Pero cierra System.in y no podes volver a leer del teclado.</p></div>
${ann('warn','⚠️','<strong>Problema clásico:</strong> después de <code>nextInt()</code>, si usás <code>nextLine()</code>, se come el Enter. Solución: poné un <code>scanner.nextLine();</code> extra para consumir el salto.')}`,
  tutorial: () => `
<div class="ts">
<h3>Crear y usar Scanner</h3>
${cb('Scanner básico', `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("¿Cómo te llamás? ");
        String nombre = scanner.nextLine();
        
        System.out.print("¿Cuántos años tenés? ");
        int edad = scanner.nextInt();
        
        System.out.println("Hola " + nombre + ", tenés " + edad + " años.");
        scanner.close();
    }
}`)}
</div>
<div class="ts">
<h3>Métodos de Scanner</h3>
<table class="sym-tbl">
<thead><tr><th>Método</th><th>Lee</th><th>Tipo</th></tr></thead>
<tbody>
<tr><td>nextLine()</td><td>Línea completa</td><td>String</td></tr>
<tr><td>nextInt()</td><td>Número entero</td><td>int</td></tr>
<tr><td>nextDouble()</td><td>Número decimal</td><td>double</td></tr>
<tr><td>next()</td><td>Una palabra (hasta espacio)</td><td>String</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Ejemplo con cálculo</h3>
${cb('Calcular edad', `Scanner scanner = new Scanner(System.in);

System.out.print("Año de nacimiento: ");
int anioNac = scanner.nextInt();

int edad = 2024 - anioNac;
System.out.println("Tenés " + edad + " años.");

scanner.close();`)}
</div><div class="ts"><h3>Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>Olvidaste import java.util.Scanner;</code></td><td>cannot find symbol</td><td>Java no conoce la clase Scanner sin el import.</td></tr>
<tr><td><code>nextInt() recibe "abc"</code></td><td>InputMismatchException</td><td>El usuario escribio texto donde esperabas un numero.</td></tr>
<tr><td><code>nextInt() y despues nextLine()</code></td><td>nextLine() lee vacio</td><td>El Enter del nextInt() quedo en el buffer. Solucion: sc.nextLine() extra.</td></tr>
<tr><td><code>Olvidaste scanner.close()</code></td><td>Memory leak</td><td>El scanner queda abierto consumiendo recursos del sistema.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Nota: Scanner no funciona en esta consola web. Escribí un programa que simule la entrada con variables fijas: nombre="María" y edad=22. Imprimí el saludo.',
    expected: 'Hola María, tenés 22 años.',
    starter: `public class Main {
    public static void main(String[] args) {
        // Simulá la entrada con variables fijas
        String nombre = "María";
        int edad = 22;
        // Imprimí el saludo
        
    }
}`,
    hints: [
      'Las variables ya están declaradas. Solo necesitás el println.',
      'Concatená: <code>"Hola " + nombre + ", tenés " + edad + " años."</code>',
      'El formato exacto: "Hola María, tenés 22 años." con punto al final.',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Faltan espacios:</strong> Si imprimís <code>"Hola"+nombre</code> te va a salir "HolaMaría". Acordate de poner espacios adentro de las comillas <code>"Hola " + nombre</code>.</li><li><strong>Falta el punto:</strong> El ejercicio te pide que termine en punto. Fijate bien en el output esperado.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        String nombre = "María";
        int edad = 22;
        System.out.println("Hola " + nombre + ", tenés " + edad + " años.");
    }
}`)}`
    ]
  }
},
{
  id:11, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Bucle while',
  desc:'Repetí instrucciones mientras se cumpla una condición. Ideal cuando no sabés cuántas veces.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">♾️</span><h4>Pensalo así...</h4>
<p><code>while</code> = <strong>"mientras"</strong>. Es como comer galletitas: "mientras tenga hambre, sigo comiendo".</p>
<p>La diferencia con <code>for</code>:<br>
<code>for</code> → sabés cuántas vueltas ("comé 5 galletitas")<br>
<code>while</code> → no sabés cuántas ("comé hasta que no tengas hambre")</p>
<p><code>do-while</code> = "comé al menos una galletita, y después fijate si seguís".</p>
</div>
<div class="analogy-card"><h4>Esperar el colectivo</h4><p>"Mientras no llegue el 60, sigo esperando." No sabes cuantos minutos. While es para cuando NO sabes cuantas iteraciones necesitas.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>while vs do-while?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ while: condicion ANTES (puede no ejecutarse). do-while: AL MENOS UNA VEZ.</p></div>
<div class="analogy-card"><p><strong>Que causa bucle infinito?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Condicion que NUNCA se vuelve false. Causa #1: olvidar i++ dentro del while.</p></div>
<div class="analogy-card"><p><strong>Cuando while en vez de for?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cuando NO sabes cuantas iteraciones. Ej: leer hasta EOF, esperar "salir".</p></div>
<div class="analogy-card"><p><strong>Que pasa con ; despues del while()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cierra el while con cuerpo VACIO. Java se congela para siempre.</p></div>
<div class="analogy-card"><p><strong>Para que sirve while(true)+break?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Repetir hasta que pase algo especifico. El break te saca cuando se cumple la condicion.</p></div>
${ann('warn','❌','<strong>Peligro: bucle infinito</strong>. Si olvidás cambiar la variable de la condición dentro del while, nunca termina. Es el error más común.')}`,
  tutorial: () => `
<div class="ts">
<h3>El bucle while</h3>
${cb('while', `int contador = 1;

while (contador <= 5) {
    System.out.println("Contando: " + contador);
    contador++;   // ¡IMPORTANTÍSIMO! Sin esto, bucle infinito
}`)}
</div>
<div class="ts">
<h3>do-while — ejecuta al menos una vez</h3>
${cb('do-while', `int intentos = 0;

do {
    System.out.println("Intentando... " + intentos);
    intentos++;
} while (intentos < 3);
// El cuerpo se ejecuta ANTES de revisar la condición`)}
</div>
<div class="ts">
<h3>Cuándo usar while vs for</h3>
<table class="sym-tbl">
<thead><tr><th>Situación</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>Recorrer del 1 al 100</td><td>for</td></tr>
<tr><td>Leer hasta que el usuario escriba "salir"</td><td>while</td></tr>
<tr><td>Reintentar hasta que funcione</td><td>do-while</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>Olvidaste incrementar</code></td><td>Bucle infinito</td><td>La variable de control nunca cambia.</td></tr>
<tr><td><code>while(i<=5);</code></td><td>Bucle vacio infinito</td><td>El ; cierra el while. El {} corre una vez despues.</td></tr>
<tr><td><code>while(i=5)</code></td><td>Error</td><td>= asigna. La condicion debe ser booleana.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Usá while para imprimir "Contando: 1" hasta "Contando: 5", y luego "¡Listo!".',
    expected: 'Contando: 1\nContando: 2\nContando: 3\nContando: 4\nContando: 5\n¡Listo!',
    starter: `public class Main {
    public static void main(String[] args) {
        int i = 1;
        // Usá while para imprimir "Contando: " + i mientras i <= 5
        
        // Después del bucle, imprimí "¡Listo!"
    }
}`,
    hints: [
      'La condición: <code>i <= 5</code>. Dentro: imprimir y luego <code>i++</code>.',
      'Si el programa corre para siempre, es porque olvidaste el <code>i++</code>.',
      'Después del while, <code>System.out.println("¡Listo!");</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Bucle infinito (se cuelga):</strong> Si olvidás poner <code>i++;</code> dentro de las llaves del while, <code>i</code> siempre valdrá 1 y nunca terminará.</li><li><strong>Orden incorrecto:</strong> El "¡Listo!" va AFUERA de las llaves del while, al final de todo.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int i = 1;
        while (i <= 5) {
            System.out.println("Contando: " + i);
            i++;
        }
        System.out.println("¡Listo!");
    }
}`)}`
    ]
  }
},
{
  id:12, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Bucle for',
  desc:'Repetí instrucciones un número determinado de veces.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔁</span><h4>Pensalo así...</h4>
<p>Un <code>for</code> es como dar vueltas en una pista de atletismo:</p>
<p>1️⃣ <strong>Inicio</strong>: empezás en la vuelta 0 → <code>int i = 0</code><br>
2️⃣ <strong>Condición</strong>: seguís mientras no hayas dado 5 vueltas → <code>i < 5</code><br>
3️⃣ <strong>Paso</strong>: cada vuelta sumás 1 → <code>i++</code></p>
<p>Resultado: hacés la vuelta 0, 1, 2, 3, 4 → ¡5 vueltas en total!</p>
</div><h3>Mini-Quiz: entendiste el concepto?</h3>
<div class="analogy-card"><p><strong>Que hace cada parte del for?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Inicio: declara variable (1 vez). Condicion: se evalua antes de cada vuelta. Paso: se ejecuta despues del cuerpo.</p></div>
<div class="analogy-card"><p><strong>for(;;) es valido?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Si, es un bucle INFINITO. Las 3 partes son opcionales. Necesitas un break adentro para salir.</p></div>
<div class="analogy-card"><p><strong>Error off-by-one: < vs <=?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600"><5 = 0,1,2,3,4 (5 vueltas). <=5 = 0,1,2,3,4,5 (6 vueltas). Revisa siempre la condicion.</p></div>
<div class="analogy-card"><p><strong>Que hace break en un for?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">SALE del bucle inmediatamente. No ejecuta mas iteraciones.</p></div>
<div class="analogy-card"><p><strong>Que hace continue?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Salta a la SIGUIENTE iteracion. No ejecuta el resto del cuerpo para esta vuelta.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>Anatomía del bucle for</h3>
${cb('Partes del for', `//   inicio    condición   actualización
for (int i = 0; i < 5;       i++) {
    System.out.println("Iteración: " + i);
}
// Imprime: 0, 1, 2, 3, 4  (5 iteraciones, NUNCA imprime 5)`)}
</div>
<div class="ts">
<h3>Patrones comunes</h3>
${cb('Variantes', `// De 1 a 5 (inclusive)
for (int i = 1; i <= 5; i++) {
    System.out.println(i);   // 1, 2, 3, 4, 5
}

// Countdown
for (int i = 5; i >= 1; i--) {
    System.out.println(i);   // 5, 4, 3, 2, 1
}

// De 2 en 2
for (int i = 0; i <= 10; i += 2) {
    System.out.println(i);   // 0, 2, 4, 6, 8, 10
}`)}
</div>
<div class="ts">
<h3>break y continue</h3>
${cb('Control de flujo', `for (int i = 0; i < 10; i++) {
    if (i == 5) break;        // sale del bucle
    System.out.println(i);    // imprime 0 1 2 3 4
}

for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue; // salta los pares
    System.out.println(i);    // imprime 1 3 5 7 9
}`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>for(int i=0;i<5;i++);</code></td><td>Bucle vacio</td><td>El ; cierra el for. El {} corre UNA vez despues.</td></tr>
<tr><td><code>for(int i=1;i<=5;i--)</code></td><td>Bucle infinito</td><td>i nunca llega a >5.</td></tr>
<tr><td><code>Off-by-one: < vs <=</code></td><td>Una iteracion de mas/menos</td><td>Revisa la condicion con cuidado.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Imprimí la tabla de multiplicar del 3, del 3×1 al 3×5.',
    expected: '3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15',
    starter: `public class Main {
    public static void main(String[] args) {
        // Usá un for con i de 1 a 5
        
    }
}`,
    hints: [
      'El bucle: <code>for (int i = 1; i <= 5; i++)</code>.',
      'Dentro: <code>System.out.println("3 x " + i + " = " + (3 * i));</code>',
      'Los paréntesis en <code>(3 * i)</code> son importantes para que no concatene como texto.',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Bucle infinito:</strong> Revisá que la condición sea <code>i &lt;= 5</code> y que sumes con <code>i++</code>.</li><li><strong>Empieza en 0:</strong> El for debe empezar en <code>i = 1</code> para hacer "3 x 1".</li><li><strong>Concatenación rota:</strong> Si ves "3 x 1 = 31", te faltan los paréntesis en <code>(3 * i)</code> para que primero multiplique y luego convierta a texto.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println("3 x " + i + " = " + (3 * i));
        }
    }
}`)}`
    ]
  }
},
{
  id:13, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Arrays',
  desc:'Guardá múltiples valores del mismo tipo en una sola variable.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🗄️</span><h4>Pensalo así...</h4>
<p>Un array es como un <strong>casillero del colegio</strong>. Tiene un número fijo de casillas, cada una con un número (empezando desde 0).</p>
<p><code>int[] notas = {8, 5, 9, 7};</code><br>
Casilla 0: 8 | Casilla 1: 5 | Casilla 2: 9 | Casilla 3: 7</p>
<p>Para ver el contenido de la casilla 2: <code>notas[2]</code> → <code>9</code><br>
Para saber cuántas casillas: <code>notas.length</code> → <code>4</code> (¡sin paréntesis!)</p>
</div>
<div class="analogy-card"><h4>Caja de DVDs</h4><p>6 discos numerados 0-5. Cada disco tiene un capitulo. No podes meter un septimo disco. Capacidad fija. Para expandir: ArrayList.</p></div>
<div class="analogy-card"><h4>La cinta transportadora</h4><p>Los items pasan uno por uno por la cinta. Los procesas en orden. Cuando se acaban, el for termina. Sabes exactamente cuantos son.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Primer indice de un array?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ 0. El ultimo es length-1.</p></div>
<div class="analogy-card"><p><strong>.length o .length() para arrays?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ .length SIN parentesis (ATRIBUTO). String usa .length() CON parentesis (METODO).</p></div>
<div class="analogy-card"><p><strong>Que pasa con nums[5] en array de 5?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ ArrayIndexOutOfBoundsException. Indices validos: 0 a 4.</p></div>
<div class="analogy-card"><p><strong>println(nums) directo que imprime?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Hash [I@1a2b3c. NO imprime valores. Recorrelo con for.</p></div>
<div class="analogy-card"><p><strong>Puedo cambiar el tamano despues de crear?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ NO. Tamano FIJO. Para dinamico: ArrayList.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que hace cada parte del for?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Inicio: declara variable (1 vez). Condicion: antes de cada iteracion. Paso: despues del cuerpo.</p></div>
<div class="analogy-card"><p><strong>Que hace break en un for?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ SALE del bucle inmediatamente. No ejecuta mas iteraciones.</p></div>
<div class="analogy-card"><p><strong>Que hace continue?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Salta a la SIGUIENTE iteracion. No ejecuta el resto del cuerpo.</p></div>
<div class="analogy-card"><p><strong>Error off-by-one?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ <5 = 0,1,2,3,4 (5 vueltas). <=5 = 0,1,2,3,4,5 (6 vueltas). Revisa siempre.</p></div>
<div class="analogy-card"><p><strong>for(;;) es valido?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si, bucle INFINITO. Las 3 partes son opcionales. Necesitas break adentro.</p></div>
${ann('warn','⚠️','El tamaño del array es <strong>fijo</strong>. Una vez creado, no podés agregar ni quitar casillas. Para eso necesitás <code>ArrayList</code>.')}`,
  tutorial: () => `
<div class="ts">
<h3>¿Qué es un array?</h3>
${cb('Declaración', `int[] numeros = new int[5];   // 5 espacios, todos en 0
numeros[0] = 10;
numeros[4] = 50;

int[] datos = {5, 2, 8, 1, 9, 3};  // inicializar directo
String[] nombres = {"Ana", "Luis", "María"};`)}
</div>
<div class="ts">
<h3>Recorrer un array</h3>
${cb('For clásico y for-each', `int[] nums = {5, 2, 8, 1, 9};

// For clásico — cuando necesitás el índice
for (int i = 0; i < nums.length; i++) {
    System.out.println("Posición " + i + ": " + nums[i]);
}

// For-each — más simple
for (int n : nums) {
    System.out.println(n);
}

// Sumar todos
int suma = 0;
for (int n : nums) { suma += n; }
System.out.println("Suma: " + suma);`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>nums[5] en array de 5</code></td><td>ArrayIndexOutOfBoundsException</td><td>Indices validos: 0 a 4.</td></tr>
<tr><td><code>nums.length()</code></td><td>Error compilacion</td><td>.length es atributo, no metodo.</td></tr>
<tr><td><code>println(nums) directo</code></td><td>Hash en vez de valores</td><td>Usa for para imprimir cada elemento.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Con {5, 2, 8, 1, 9, 3}, imprimí todos los elementos separados por espacio y la suma.',
    expected: 'Elementos: 5 2 8 1 9 3\nSuma: 28',
    starter: `public class Main {
    public static void main(String[] args) {
        int[] numeros = {5, 2, 8, 1, 9, 3};
        // Imprimí elementos y suma
        
    }
}`,
    hints: [
      'Usá <code>System.out.print("Elementos: ")</code> y luego un for que imprima cada número + espacio.',
      'Para la suma: <code>int suma = 0;</code> y dentro del for <code>suma += numeros[i];</code>',
      'Terminá la línea de elementos con <code>System.out.println();</code> para el salto.',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>println vs print:</strong> Para que los números salgan en la misma línea, usá <code>print(n + " ")</code>, y luego un <code>println()</code> vacío al final del bucle.</li><li><strong>Fuera de rango:</strong> El for debe ir hasta <code>numeros.length</code> estricto (<code>&lt;</code>), no <code>&lt;=</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int[] numeros = {5, 2, 8, 1, 9, 3};
        
        System.out.print("Elementos: ");
        int suma = 0;
        for (int i = 0; i < numeros.length; i++) {
            System.out.print(numeros[i]); if (i < numeros.length - 1) System.out.print(" ");
            suma += numeros[i];
        }
        System.out.println();
        System.out.println("Suma: " + suma);
    }
}`)}`
    ]
  }
},
{
  id:14, level:'basico', levelLabel:'Básico', stars:'⭐⭐',
  title:'Paradigmas de Programación',
  desc:'Conocé los diferentes enfoques para resolver problemas con código: imperativo, declarativo y orientado a objetos.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏛️</span><h4>Pensalo así...</h4>
<p>Un <strong>paradigma</strong> es como un <strong>estilo arquitectónico</strong>. Así como hay casas de estilo colonial, moderno o minimalista, en programación hay diferentes estilos para escribir código:</p>
<p>1️⃣ <strong>Imperativo</strong> → Das instrucciones paso a paso ("hacé esto, después esto, después esto"). Es como una receta de cocina. Es el que venimos usando.</p>
<p>2️⃣ <strong>Declarativo</strong> → Decís QUÉ querés, no CÓMO hacerlo. Es como pedir comida: "quiero una pizza", no le explicás al mozo cómo hacerla.</p>
<p>3️⃣ <strong>Orientado a Objetos (POO)</strong> → Organizás el código en "objetos" que tienen datos y comportamiento, como mini-programas independientes que colaboran entre sí.</p>
</div>
${ann('java','📌','Java es principalmente <strong>orientado a objetos</strong>, pero podés escribir código imperativo dentro de los métodos. El paradigma OO es lo que hace a Java tan poderoso para proyectos grandes.')}
<div class="analogy-card"><h4>🧩 Imperativo vs POO</h4>
<p><strong>Imperativo:</strong> <code>calcularArea(base, altura)</code> → una función que recibe datos<br>
<strong>POO:</strong> <code>rectangulo.calcularArea()</code> → un objeto que conoce sus propios datos y sabe qué hacer con ellos</p>
<p>La diferencia clave es <strong>dónde viven los datos</strong>. En POO, los datos y las operaciones viajan juntos dentro del objeto.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Los tres grandes paradigmas</h3>
<table class="sym-tbl">
<thead><tr><th>Paradigma</th><th>Foco</th><th>Ejemplo</th></tr></thead>
<tbody>
<tr><td>Imperativo</td><td>CÓMO hacer las cosas (pasos)</td><td>C, Pascal, scripts</td></tr>
<tr><td>Declarativo</td><td>QUÉ resultado querés</td><td>SQL, HTML, regex</td></tr>
<tr><td>Orientado a Objetos</td><td>Objetos que colaboran</td><td>Java, C#, Python</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Programación Imperativa</h3>
${cb('Imperativo', `int[] numeros = {1, 2, 3, 4, 5};
int suma = 0;
for (int i = 0; i < numeros.length; i++) {
    suma += numeros[i];
}
System.out.println("Suma: " + suma);  // paso a paso`)}
<p>Le decimos a la máquina <strong>exactamente cada paso</strong>: creá una variable, recorré el array, sumá, imprimí.</p>
</div>
<div class="ts">
<h3>Programación Orientada a Objetos</h3>
${cb('POO', `class Calculadora {
    private int[] datos;
    
    Calculadora(int[] datos) {
        this.datos = datos;
    }
    
    int sumar() {
        int total = 0;
        for (int n : datos) total += n;
        return total;
    }
}

// Uso:
Calculadora calc = new Calculadora(new int[]{1,2,3,4,5});
System.out.println("Suma: " + calc.sumar());`)}
<p>Los datos y la operación viven juntos en la clase <code>Calculadora</code>. El objeto sabe sumarse a sí mismo.</p>
</div>
<div class="ts">
<div class="analogy-card"><h4>⏳ Cronología: de POP a POO</h4>
<p><strong>1970s — Programación procedural (POP)</strong>: Con C y Pascal, los programas eran secuencias de funciones. Datos y lógica separados. Funcionaba bien para proyectos chicos, pero al crecer el código se volvía difícil de mantener.</p>
<p><strong>1980s — Nace la POO</strong>: Smalltalk y C++ introducen el concepto de <strong>objetos</strong> que agrupan datos Y comportamiento. Un objeto "Factura" sabe calcular su propio total, en vez de tener una función suelta <code>calcularTotal(factura)</code>.</p>
<p><strong>1995 — Java populariza la POO</strong>: James Gosling diseña Java para electrodomésticos inteligentes, pero la web explota y Java se convierte en el lenguaje de Internet. Su filosofía: todo es un objeto, todo pertenece a una clase.</p>
${ann('java','📌','Java llevó la POO al mainstream corporativo. Bancos, gobiernos, empresas — todos adoptaron Java porque la POO permitía sistemas enormes, mantenibles y con equipos de cientos de programadores.')}
</div>

<div class="analogy-card"><h4>⚖️ POP vs POO — ventajas y desventajas</h4>
<table class="sym-tbl">
<thead><tr><th>Aspecto</th><th>POP (Procedural)</th><th>POO (Objetos)</th></tr></thead>
<tbody>
<tr><td>Curva de aprendizaje</td><td>✅ Más fácil al inicio</td><td>❌ Más conceptos que aprender</td></tr>
<tr><td>Proyectos chicos</td><td>✅ Rápido y directo</td><td>❌ Demasiada estructura para poco</td></tr>
<tr><td>Proyectos grandes</td><td>❌ Difícil de mantener</td><td>✅ Escala bien, código organizado</td></tr>
<tr><td>Reutilización</td><td>❌ Copiar y pegar funciones</td><td>✅ Herencia y composición</td></tr>
<tr><td>Trabajo en equipo</td><td>❌ Conflictos frecuentes</td><td>✅ Cada dev trabaja en sus clases</td></tr>
<tr><td>Rendimiento</td><td>✅ Menos sobrecarga</td><td>❌ Ligera sobrecarga por objetos</td></tr>
</tbody>
</table>
<p>Hoy la mayoría de los lenguajes (Python, JavaScript, C#) son <strong>multi-paradigma</strong>: te dejan elegir el enfoque según el problema. Java es mayormente POO pero incorporó elementos funcionales en versiones recientes.</p>
</div>

<h3>Los 4 pilares de la POO</h3>
<p>Estos conceptos los vamos a ver en detalle en las próximas lecciones:</p>
<ul>
<li><strong>Encapsulamiento:</strong> Ocultar datos internos (private)</li>
<li><strong>Herencia:</strong> Crear clases a partir de otras (extends)</li>
<li><strong>Polimorfismo:</strong> Un mismo método, distintos comportamientos</li>
<li><strong>Abstracción:</strong> Ocultar complejidad innecesaria</li>
</ul>
${ann('tip','💡','No te preocupes si ahora no entendés todos los pilares. Los vas a ir descubriendo lección por lección. ¡Es un viaje!')}
</div>`,
  quiz: {
    passing: 3,
    questions: [
      { question: '¿Qué paradigma usamos cuando damos instrucciones paso a paso?', options: ['Imperativo', 'Declarativo', 'Funcional', 'Reactivo'], correct: 0 },
      { question: '¿Cuál es el paradigma principal de Java?', options: ['Imperativo puro', 'Programación Lógica', 'Orientado a Objetos', 'Programación Funcional'], correct: 2 },
      { question: 'En POO, ¿dónde viven los datos y las operaciones?', options: ['En funciones sueltas', 'Dentro del objeto (clase)', 'En archivos separados', 'En la memoria RAM del sistema'], correct: 1 },
      { question: '¿Cuál NO es un pilar de la POO?', options: ['Encapsulamiento', 'Herencia', 'Iteración', 'Polimorfismo'], correct: 2 },
      { question: 'SQL es un ejemplo de paradigma...', options: ['Imperativo', 'Orientado a Objetos', 'Declarativo', 'Estructurado'], correct: 2 }
    ]
  }
},
{
  id:15, level:'basico', levelLabel:'Examen Básico', stars:'⭐⭐⭐',
  title:'Examen Integrador',
  desc:'Poné a prueba todo lo que aprendiste: condicionales, bucles, arrays y cálculos.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🎓</span><h4>¡Llegaste al final!</h4>
<p>Este es el <strong>examen integrador</strong>. Aquí no hay teoría nueva, vas a tener que usar todo lo que aprendiste hasta ahora para resolver un problema real.</p>
<p>¡Confiá en vos! Si resolviste los ejercicios anteriores, este desafío es pan comido.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Requerimientos del Examen</h3>
<p>Se te da un array con ventas diarias: <code>int[] ventas = {150, 300, 50, 400, 200};</code></p>
<p>Tu misión es escribir el código que haga lo siguiente:</p>
<ol>
  <li>Creá una variable para llevar el total de ventas.</li>
  <li>Creá una variable para contar cuántas ventas superan los $200.</li>
  <li>Usá un <strong>bucle for</strong> para recorrer el array.</li>
  <li>Dentro del bucle, sumá cada venta al total.</li>
  <li>Además, usá un <strong>if</strong> para detectar si la venta actual es <code>> 200</code>. Si lo es, sumale 1 a la cantidad de ventas altas.</li>
  <li>Por último, imprimí exactamente estas dos líneas:<br><code>Total vendido: 1100</code><br><code>Ventas exitosas: 2</code> (asegurate de usar las variables, no escribir el número directo).</li>
</ol>
</div>`,
  exercise: {
    desc: 'Calculá el total y contá las ventas que superan los $200.',
    expected: 'Total vendido: 1100\nVentas exitosas: 2',
    starter: `public class Main {
    public static void main(String[] args) {
        int[] ventas = {150, 300, 50, 400, 200};
        
        // Escribí tu código aquí
        
    }
}`,
    hints: [
      'Necesitás declarar: <code>int total = 0;</code> y <code>int exitosas = 0;</code>.',
      'El bucle: <code>for (int i = 0; i < ventas.length; i++) { ... }</code>.',
      'Dentro del bucle: <code>total += ventas[i];</code> y luego <code>if (ventas[i] > 200) { exitosas++; }</code>',
      'Al final, imprimí los resultados usando <code>System.out.println("Total vendido: " + total);</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Impresión incorrecta:</strong> Verificá que los textos sean exactos.</li><li><strong>Bucle fuera de rango:</strong> Usá <code>&lt; ventas.length</code>, sin el <code>=</code>.</li><li><strong>Falta concatenar:</strong> Usá <code>+</code> para unir texto y variable al imprimir.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        int[] ventas = {150, 300, 50, 400, 200};
        
        int total = 0;
        int exitosas = 0;
        
        for (int i = 0; i < ventas.length; i++) {
            total += ventas[i];
            if (ventas[i] > 200) {
                exitosas++;
            }
        }
        
        System.out.println("Total vendido: " + total);
        System.out.println("Ventas exitosas: " + exitosas);
    }
}`)}`
    ]
  }
},
{
  id:16, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Métodos sin retorno (void)',
  desc:'Organizá tu código en bloques reutilizables.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📋</span><h4>Pensalo así...</h4>
<p>Un método es como una <strong>receta de cocina</strong>. La escribís una vez y la usás cuantas veces quieras.</p>
<p><code>void</code> = la receta <strong>no devuelve</strong> nada (como "lavar los platos" — es una acción, no produce un resultado que guardés).</p>
<p>Si el método tiene <strong>parámetros</strong>, son los ingredientes que le pasás.</p>
</div><h3>Mini-Quiz: entendiste el concepto?</h3>
<div class="analogy-card"><p><strong>Que significa void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">El metodo ejecuta una accion pero NO devuelve ningun valor. Como "hace esto" sin esperar respuesta.</p></div>
<div class="analogy-card"><p><strong>Donde se declara un metodo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">FUERA del main pero DENTRO de la clase. Los metodos no pueden estar anidados.</p></div>
<div class="analogy-card"><p><strong>Por que se usan metodos void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Para REUTILIZAR codigo. Si una tarea se repite, la pones en un metodo y la llamas cuando haga falta.</p></div>
<div class="analogy-card"><p><strong>Un metodo void puede tener parametros?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">Si. Puede recibir datos para trabajar (String nombre, int veces) pero sigue sin devolver nada.</p></div>
<div class="analogy-card"><p><strong>Por que static en estos metodos?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">main es static y solo puede llamar a otros metodos static directamente. Con objetos ya no hara falta.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>¿Para qué sirven los métodos?</h3>
${cb('Con método', `public class Main {
    static void mostrarMenu() {
        System.out.println("=== Menú ===");
        System.out.println("1. Jugar");
    }
    public static void main(String[] args) {
        mostrarMenu();   // primera llamada
        mostrarMenu();   // segunda — sin repetir código
    }
}`)}
</div>
<div class="ts">
<h3>Métodos con parámetros</h3>
${cb('Parámetros', `static void imprimir(String mensaje, int veces) {
    for (int i = 0; i < veces; i++) {
        System.out.println(mensaje);
    }
}

public static void main(String[] args) {
    imprimir("Hola", 3);    // imprime "Hola" 3 veces
}`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>static void dentro de main</code></td><td>Error compilacion</td><td>Metodo no puede estar dentro de otro. Va FUERA.</td></tr>
<tr><td><code>imprimir; sin ()</code></td><td>Error</td><td>Siempre parentesis: imprimir().</td></tr>
<tr><td><code>void imprimir() // sin static</code></td><td>Error</td><td>Desde static solo llamas static.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá imprimirSeparador() que imprima "--- --- ---". Llamalo 3 veces.',
    expected: '--- --- ---\n--- --- ---\n--- --- ---',
    starter: `public class Main {
    
    // Definí el método aquí
    
    public static void main(String[] args) {
        // Llamá al método 3 veces
        
    }
}`,
    hints: [
      'Declaralo como <code>static void imprimirSeparador()</code> con un println dentro.',
      'Llamá con <code>imprimirSeparador();</code> tres veces en el main.',
      'El método va FUERA del main pero DENTRO de la clase Main.',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Método dentro del main:</strong> Un método no puede existir adentro de otro. <code>imprimirSeparador</code> debe estar por encima o por debajo del bloque <code>main</code>, pero antes del final de la clase.</li><li><strong>Olvidar static:</strong> Como <code>main</code> es static, los métodos que llama directamente también deben ser static.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    
    static void imprimirSeparador() {
        System.out.println("--- --- ---");
    }
    
    public static void main(String[] args) {
        imprimirSeparador();
        imprimirSeparador();
        imprimirSeparador();
    }
}`)}`
    ]
  }
},
{
  id:17, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Métodos con retorno',
  desc:'Creá métodos que calculan algo y devuelven el resultado.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏭</span><h4>Pensalo así...</h4>
<p>Un método con retorno es como una <strong>máquina expendedora</strong>: le metés algo (parámetros), la máquina trabaja, y te devuelve algo (return).</p>
<p><code>int sumar(3, 4)</code> → la máquina recibe 3 y 4, y te devuelve <code>7</code>.</p>
<p>La diferencia con <code>void</code>: void es una máquina que hace algo pero no te da nada de vuelta (como un triturador de basura).</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>El tipo de retorno y return</h3>
${cb('Método con retorno', `static int sumar(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    int resultado = sumar(3, 4);
    System.out.println(resultado);       // 7
    System.out.println(sumar(10, 20));   // 30
}`)}
<div class="analogy-card"><h4>El cajero que da el vuelto</h4><p>Le pasas tu tarjeta y el monto. El cajero procesa y te DEVUELVE el dinero. Return = te da algo que podes usar despues. Void = solo imprime el recibo.</p></div>
<div class="analogy-card"><h4>El chef que recibe ordenes</h4><p>Decis "chef, prepara la mesa para 4" -> el chef pone platos y cubiertos. No te devuelve nada, solo ejecuta la orden. Asi funciona void.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Diferencia void vs int en metodo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ void=no devuelve nada. int=devuelve numero. El tipo antes del nombre indica QUE devuelve.</p></div>
<div class="analogy-card"><p><strong>Puedo usar el resultado sin guardarlo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si. println(sumar(3,4)) imprime 7 directo.</p></div>
<div class="analogy-card"><p><strong>Return dentro de if?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Todos los caminos deben terminar en return. Si el if no se ejecuta, da error.</p></div>
<div class="analogy-card"><p><strong>Return y parametros a la vez?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Son independientes. Podes recibir datos Y devolver resultado.</p></div>
<div class="analogy-card"><p><strong>Cuando return vs void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Return: necesitas el resultado. Void: solo ejecutar accion.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que significa void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ El metodo ejecuta una accion pero NO devuelve valor. Como "hace esto" sin esperar respuesta.</p></div>
<div class="analogy-card"><p><strong>Puede tener parametros un metodo void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si. Recibe datos pero sigue sin devolver nada.</p></div>
<div class="analogy-card"><p><strong>Donde se declara: dentro o fuera del main?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ FUERA del main, DENTRO de la clase.</p></div>
<div class="analogy-card"><p><strong>Por que se declaran static?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ main es static y solo llama metodos static. Con objetos no hara falta.</p></div>
<div class="analogy-card"><p><strong>Cuando usar metodos void?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para REUTILIZAR codigo. Si una tarea se repite, la pones en un metodo.</p></div>
${ann('java','📌','El tipo antes del nombre define QUÉ devuelve. Si es <code>int</code>, el <code>return</code> debe devolver un <code>int</code>.')}
</div>
<div class="ts">
<h3>Métodos que devuelven distintos tipos</h3>
${cb('Tipos de retorno', `static double calcularPromedio(int a, int b, int c) {
    return (a + b + c) / 3.0;
}

static boolean esMayorDeEdad(int edad) {
    return edad >= 18;
}`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>void f(){return x;}</code></td><td>Error</td><td>void no devuelve nada.</td></tr>
<tr><td><code>int f(){x;} sin return</code></td><td>Error</td><td>Promete devolver int pero falta return.</td></tr>
<tr><td><code>return "texto" en int</code></td><td>Error</td><td>Tipo de retorno no coincide.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá calcularArea(int base, int altura) que devuelva base×altura. Usalo con base=6, altura=4.',
    expected: 'Área del rectángulo: 24',
    starter: `public class Main {
    
    // Creá el método aquí
    
    public static void main(String[] args) {
        // Llamá y mostrá el resultado
        
    }
}`,
    hints: [
      'Declará: <code>static int calcularArea(int base, int altura)</code>. Dentro: <code>return base * altura;</code>',
      'En el main: <code>int area = calcularArea(6, 4);</code>',
      'Imprimí: <code>System.out.println("Área del rectángulo: " + area);</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Tipo de retorno void:</strong> Si usás <code>void</code> no podés usar <code>return</code>. Tenés que usar <code>int</code> en la firma del método.</li><li><strong>Llamada incorrecta:</strong> Al llamarlo debés pasarle los valores entre paréntesis separados por coma: <code>calcularArea(6, 4)</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    
    static int calcularArea(int base, int altura) {
        return base * altura;
    }
    
    public static void main(String[] args) {
        int area = calcularArea(6, 4);
        System.out.println("Área del rectángulo: " + area);
    }
}`)}`
    ]
  }
},
{
  id:18, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Clases y Objetos',
  desc:'Creá tus propios tipos de datos. Entendé la diferencia entre clase y objeto.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏗️</span><h4>Pensalo así...</h4>
<p><strong>Clase</strong> = el <strong>plano de una casa</strong>. Define cómo es la casa (cuántas habitaciones, color, etc.)<br>
<strong>Objeto</strong> = una <strong>casa real</strong> construida con ese plano. Podés construir muchas casas diferentes del mismo plano.</p>
<p><code>class Persona</code> = el plano (define que tiene nombre y edad)<br>
<code>new Persona()</code> = una persona real (Carlos, 30 años)<br>
Podés crear otra: <code>new Persona()</code> (Laura, 25 años)</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Clase = molde, Objeto = instancia</h3>
${cb('Definición y creación', `class Persona {
    String nombre;
    int edad;
    
    void presentarse() {
        System.out.println("Soy " + nombre + " y tengo " + edad + " años");
    }
}

public class Main {
    public static void main(String[] args) {
        Persona p1 = new Persona();
        p1.nombre = "Carlos";
        p1.edad = 30;
        p1.presentarse();    // Soy Carlos y tengo 30 años
    }
}`)}
</div>
<div class="ts">
<h3>El operador new</h3>
<p><code>new Persona()</code> reserva memoria para el objeto. Sin <code>new</code>, la variable es <code>null</code>.</p>
<div class="analogy-card"><h4>El molde de galletitas</h4><p>La clase es el molde con forma de estrella. Cada objeto es una galletita hecha con ese molde. Todas tienen la misma forma, pero distinto color y chispas.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Clase vs objeto: diferencia?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Clase=MOLDE. Objeto=INSTANCIA concreta con valores reales.</p></div>
<div class="analogy-card"><p><strong>Para que sirve new?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Reserva memoria y llama al constructor. Sin new, la variable es null.</p></div>
<div class="analogy-card"><p><strong>Persona p; sin new que pasa?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ p=null. p.nombre da NullPointerException.</p></div>
<div class="analogy-card"><p><strong>Cuantos objetos por clase?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Infinitos. Como un plano puede generar miles de casas.</p></div>
<div class="analogy-card"><p><strong>Cuando crear una clase?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para agrupar datos relacionados (nombre+edad de persona, titulo+autor de libro).</p></div>
<div class="analogy-card"><h4>Glosario de simbolos POO - que significa cada palabra</h4><table class="sym-tbl"><thead><tr><th>Simbolo/Palabra</th><th>Nombre</th><th>Que hace</th><th>Cuando usarlo</th></tr></thead><tbody><tr><td><code>class</code></td><td>Clase</td><td>Define un nuevo TIPO de dato</td><td>Siempre que creas un objeto nuevo</td></tr><tr><td><code>new</code></td><td>Instanciador</td><td>Crea un OBJETO en memoria</td><td>Siempre antes del constructor</td></tr><tr><td><code>private</code></td><td>Privado</td><td>Oculta el atributo del exterior</td><td>SIEMPRE en atributos de instancia</td></tr><tr><td><code>public</code></td><td>Publico</td><td>Permite acceso desde cualquier clase</td><td>En getters, setters y metodos principales</td></tr><tr><td><code>this</code></td><td>Auto-referencia</td><td>"Yo mismo" - el objeto actual</td><td>Para diferenciar atributo de parametro</td></tr><tr><td><code>extends</code></td><td>Herencia</td><td>Hereda de una clase padre</td><td>Relacion "ES UN" (Perro ES Animal)</td></tr><tr><td><code>implements</code></td><td>Implementa</td><td>Cumple un contrato (interfaz)</td><td>Para definir capacidades (Volador, Nadador)</td></tr><tr><td><code>@Override</code></td><td>Sobrescritura</td><td>Redefine un metodo del padre</td><td>Al cambiar comportamiento heredado</td></tr></tbody></table></div>
${ann('warn','⚠️','Si la variable es null e intentás llamar un método, obtenés <code>NullPointerException</code> — el error más común en Java.')}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>p.nombre sin new</code></td><td>NullPointerException</td><td>p es null. Siempre new antes.</td></tr>
<tr><td><code>class persona minuscula</code></td><td>Convencion</td><td>Clases empiezan con MAYUSCULA.</td></tr>
<tr><td><code>Persona() sin new</code></td><td>Error</td><td>Falta new.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá clase Persona con nombre y edad. Método presentarse(). Creá "Carlos", 30 años.',
    expected: 'Soy Carlos y tengo 30 años',
    starter: `class Persona {
    // Atributos y método presentarse()
    
}

public class Main {
    public static void main(String[] args) {
        // Creá el objeto y llamá al método
        
    }
}`,
    hints: [
      'Atributos: <code>String nombre;</code> e <code>int edad;</code>.',
      'Método: <code>void presentarse() { System.out.println("Soy " + nombre + " y tengo " + edad + " años"); }</code>',
      'En main: <code>Persona p = new Persona();</code>, asigná valores, llamá <code>p.presentarse();</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta la clase:</strong> Tenés que crear <code>class Persona { }</code> arriba de <code>public class Main</code>.</li><li><strong>No usar new:</strong> Para crear el objeto debés instanciarlo con <code>new Persona()</code>, de lo contrario dará error.</li><li><strong>Faltan paréntesis en el método:</strong> Al llamar al método usá <code>p.presentarse()</code> con paréntesis.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `class Persona {
    String nombre;
    int edad;
    
    void presentarse() {
        System.out.println("Soy " + nombre + " y tengo " + edad + " años");
    }
}

public class Main {
    public static void main(String[] args) {
        Persona p = new Persona();
        p.nombre = "Carlos";
        p.edad = 30;
        p.presentarse();
    }
}`)}`
    ]
  }
},
{
  id:19, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Constructores',
  desc:'Inicializá objetos con valores al crearlos. Entendé this.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔧</span><h4>Pensalo así...</h4>
<p>Un constructor es como el <strong>pedido de fábrica</strong>. En vez de crear la casa vacía y después pintarla, le decís a la fábrica: "hacéme una casa roja con 3 habitaciones" desde el principio.</p>
<p>Sin constructor: <code>Persona p = new Persona(); p.nombre = "Ana"; p.edad = 25;</code> (3 líneas)<br>
Con constructor: <code>Persona p = new Persona("Ana", 25);</code> (1 línea, más limpio)</p>
</div>
<div class="analogy-card"><h4>El auto con configuracion de fabrica</h4><p>En vez de comprar un auto vacio y despues ponerle motor y color, lo pedis YA configurado: "rojo, 4 puertas, motor 2.0". El constructor crea el objeto con sus valores en una sola linea.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Constructor = metodo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. Se llama IGUAL que la clase y no lleva tipo de retorno.</p></div>
<div class="analogy-card"><p><strong>Devuelve valor un constructor?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. No lleva void, ni int, ni nada. Solo inicializa.</p></div>
<div class="analogy-card"><p><strong>Para que sirve this?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Diferencia ATRIBUTO (this.nombre) de PARAMETRO (nombre).</p></div>
<div class="analogy-card"><p><strong>Que pasa sin constructor?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Java crea uno VACIO automatico. Si definis uno con parametros, desaparece.</p></div>
<div class="analogy-card"><p><strong>Constructor vs setters?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Constructor: OBLIGATORIOS al crear. Setters: OPCIONALES o que cambian.</p></div>
${ann('java','📌','<code>this</code> = "yo mismo". Cuando el parámetro se llama igual que el atributo, <code>this.nombre</code> es el atributo y <code>nombre</code> solo es el parámetro.')}`,
  tutorial: () => `
<div class="ts">
<h3>¿Qué es un constructor?</h3>
${cb('Con constructor', `class Producto {
    String nombre;
    double precio;
    
    Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
    
    void mostrarInfo() {
        System.out.println("Producto: " + nombre + " - Precio: $" + precio);
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto("Laptop", 1500.0);
        p.mostrarInfo();
    }
}`)}
</div>
<div class="ts">
<h3>Constructor vs método normal</h3>
<table class="sym-tbl">
<thead><tr><th>Característica</th><th>Constructor</th><th>Método</th></tr></thead>
<tbody>
<tr><td>Nombre</td><td>IGUAL que la clase</td><td>Cualquier nombre</td></tr>
<tr><td>Tipo de retorno</td><td>Ninguno (ni void)</td><td>void o un tipo</td></tr>
<tr><td>Se llama</td><td>Automáticamente con new</td><td>Cuando vos lo invocás</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>void Producto()</code></td><td>Error</td><td>Constructor NO lleva void.</td></tr>
<tr><td><code>nombre=nombre sin this</code></td><td>Logica</td><td>Asignas parametro a si mismo.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá clase Producto con constructor(nombre, precio) y mostrarInfo(). Creá "Laptop" a $1500.',
    expected: 'Producto: Laptop - Precio: $1500.0',
    starter: `class Producto {
    // Atributos, constructor, método
    
}

public class Main {
    public static void main(String[] args) {
        // Creá y mostrá
        
    }
}`,
    hints: [
      'Constructor: <code>Producto(String nombre, double precio) { this.nombre = nombre; this.precio = precio; }</code>',
      'Método: <code>void mostrarInfo() { System.out.println("Producto: " + nombre + " - Precio: $" + precio); }</code>',
      'En main: <code>Producto p = new Producto("Laptop", 1500.0); p.mostrarInfo();</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Constructor con void:</strong> El constructor NUNCA lleva void. Se llama igual que la clase: <code>Producto(...)</code>.</li><li><strong>Olvidar el this:</strong> Si los parámetros se llaman igual que los atributos, debés usar <code>this.nombre = nombre;</code> para diferenciarlos.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `class Producto {
    String nombre;
    double precio;
    
    Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
    
    void mostrarInfo() {
        System.out.println("Producto: " + nombre + " - Precio: $" + precio);
    }
}

public class Main {
    public static void main(String[] args) {
        Producto p = new Producto("Laptop", 1500.0);
        p.mostrarInfo();
    }
}`)}`
    ]
  }
},
{
  id:20, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Encapsulamiento (getters/setters)',
  desc:'Protegé los datos de tus objetos. Controlá cómo se acceden y modifican.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔒</span><h4>Pensalo así...</h4>
<p>El encapsulamiento es como un <strong>cajero automático</strong>. No podés meter la mano adentro y agarrar billetes (acceso directo). Tenés que usar los botones (getters/setters) que <strong>validan</strong> antes de darte plata.</p>
<p><code>private</code> = la plata está guardada adentro, nadie la toca directo<br>
<code>getPrecio()</code> = el botón para ver cuánta plata hay<br>
<code>setPrecio(100)</code> = el botón para cambiar, pero puede validar ("no aceptamos negativos")</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>¿Por qué encapsular?</h3>
<p>Sin encapsulamiento, cualquiera puede poner valores inválidos:</p>
${cb('Problema sin encapsular', `class Producto {
    String nombre;
    double precio;    // ¡cualquiera puede poner precio = -500!
}

Producto p = new Producto();
p.precio = -500;  // Esto no tiene sentido pero Java lo permite`)}
</div>
<div class="ts">
<h3>Solución: private + getters/setters</h3>
${cb('Encapsulado correctamente', `class Producto {
    private String nombre;
    private double precio;
    
    // Constructor
    Producto(String nombre, double precio) {
        this.nombre = nombre;
        setPrecio(precio);  // usa el setter para validar
    }
    
    // Getter — permite LEER el valor
    public String getNombre() {
        return nombre;
    }
    
    // Setter — permite CAMBIAR el valor (con validación)
    public void setPrecio(double precio) {
        if (precio > 0) {
            this.precio = precio;
        } else {
            System.out.println("Error: precio debe ser positivo");
        }
    }
    
    public double getPrecio() {
        return precio;
    }
}`)}
<div class="analogy-card"><h4>La configuracion del celular</h4><p>No cambias el brillo tocando los circuitos internos. Usas el menu (setter) que VALIDA. El getter te muestra el brillo actual sin dejarte romper nada.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Por que usar private?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Protege datos. Si precio es public, cualquiera pone precio=-500.</p></div>
<div class="analogy-card"><p><strong>Siempre getter+setter?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. Si solo debe leerse: solo getter. Si no debe verse: ninguno.</p></div>
<div class="analogy-card"><p><strong>Validacion: setter o constructor?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ AMBOS. Setter valida siempre. Constructor llama al setter.</p></div>
<div class="analogy-card"><p><strong>Sin public ni private?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Package-private. No recomendado para atributos.</p></div>
<div class="analogy-card"><p><strong>Ventaja extra de encapsular?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cambias implementacion interna sin afectar al resto del codigo.</p></div>
${ann('ok','✅','Convención: los atributos siempre <code>private</code>. Para cada uno, un <code>get</code> (leer) y un <code>set</code> (escribir con validación).')}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>public String nombre</code></td><td>Vulnerable</td><td>Siempre usa private.</td></tr>
<tr><td><code>private sin setter</code></td><td>Invisible</td><td>Asegurate de tener metodos necesarios.</td></tr>
<tr><td><code>setEdad sin validar</code></td><td>Dato invalido</td><td>Valida en el setter.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá clase Persona con nombre (private) y edad (private). Getter y setter para ambos. setEdad valida que edad > 0.',
    expected: 'Nombre: Ana\nEdad: 25',
    starter: `class Persona {
    private String nombre;
    private int edad;
    
    // Constructor, getters y setters
    
}

public class Main {
    public static void main(String[] args) {
        // Creá persona, mostrá datos con getters
        
    }
}`,
    hints: [
      'NO necesitas constructor. Declara los atributos: <code>private String nombre;</code> e <code>private int edad;</code>. Luego crea los 4 metodos get/set.',
      'Getter: <code>public String getNombre() { return nombre; }</code>',
      'En main: <code>Persona p = new Persona(); p.setNombre("Ana"); p.setEdad(25);</code><br>Luego imprimi: <code>System.out.println("Nombre: " + p.getNombre());</code> y <code>System.out.println("Edad: " + p.getEdad());</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta private:</strong> Asegurate de que los atributos <code>nombre</code> y <code>edad</code> tengan la palabra <code>private</code> antes de su tipo.</li><li><strong>Validación ausente:</strong> En el <code>setEdad(int nuevaEdad)</code> tenés que validar con <code>if (nuevaEdad &gt; 0)</code> antes de asignarlo.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `class Persona {
    private String nombre;
    private int edad;
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public int getEdad() { return edad; }
    public void setEdad(int edad) {
        if (edad > 0) {
            this.edad = edad;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Persona p = new Persona();
        p.setNombre("Ana");
        p.setEdad(25);
        System.out.println("Nombre: " + p.getNombre());
        System.out.println("Edad: " + p.getEdad());
    }
}`)}`
    ]
  }
},
{
  id:21, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Herencia',
  desc:'Creá clases que heredan atributos y métodos de otras clases.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">👨‍👧</span><h4>Pensalo así...</h4>
<p>La herencia es como la <strong>herencia familiar</strong>. Un hijo hereda características del padre (ojos, altura) pero también puede tener las suyas propias.</p>
<p><code>class Animal</code> → tiene nombre y puede hacer sonido<br>
<code>class Perro extends Animal</code> → hereda nombre y sonido, pero agrega "buscar palo"</p>
<p>La palabra clave es <code>extends</code> = "extiende" (hereda de).</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Clase padre y clase hija</h3>
${cb('Herencia básica', `class Animal {
    String nombre;
    
    Animal(String nombre) {
        this.nombre = nombre;
    }
    
    void hacerSonido() {
        System.out.println(nombre + " hace un sonido");
    }
}

class Perro extends Animal {
    String raza;
    
    Perro(String nombre, String raza) {
        super(nombre);    // llama al constructor del padre
        this.raza = raza;
    }
    
    void buscarPalo() {
        System.out.println(nombre + " busca el palo!");
    }
}

public class Main {
    public static void main(String[] args) {
        Perro p = new Perro("Rex", "Labrador");
        p.hacerSonido();   // heredado de Animal
        p.buscarPalo();    // propio de Perro
    }
}`)}
</div>
<div class="ts">
<h3>super — llamar al padre</h3>
<p><code>super()</code> llama al constructor del padre. <code>super.metodo()</code> llama a un método del padre.</p>
<div class="analogy-card"><h4>El catalogo de productos</h4><p>class Producto tiene nombre y precio (comun). class Libro extends Producto hereda eso y agrega autor y paginas. class Electrodomestico extends Producto agrega consumo y garantia.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que hereda la clase hija?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ TODO lo public y protected del padre. Private existe pero no accesible.</p></div>
<div class="analogy-card"><p><strong>Para que sirve super()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Llama al CONSTRUCTOR del padre. DEBE ser primera linea.</p></div>
<div class="analogy-card"><p><strong>Herencia multiple en Java?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. Solo UNA clase. Para multiples capacidades: interfaces.</p></div>
<div class="analogy-card"><p><strong>Cuando usar herencia?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Relacion "ES UN": Perro ES Animal. Si es "TIENE UN" -> composicion.</p></div>
<div class="analogy-card"><p><strong>Padre sin constructor vacio?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Hija OBLIGADA a llamar super() con parametros.</p></div>
${ann('java','📌','<code>super()</code> debe ser la <strong>primera línea</strong> del constructor de la clase hija.')}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>extends sin super()</code></td><td>Error</td><td>Si padre no tiene constructor vacio.</td></tr>
<tr><td><code>extends A, B</code></td><td>Error</td><td>Java no permite herencia multiple de clases.</td></tr>
<tr><td><code>Animal a=new Perro(); a.buscarPalo()</code></td><td>Error</td><td>Variable Animal solo ve metodos de Animal.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá Animal con nombre y hacerSonido(). Perro extends Animal con raza y buscarPalo(). Creá "Rex" Labrador.',
    expected: 'Rex hace un sonido\nRex busca el palo!',
    starter: `class Animal {
    // nombre + constructor + hacerSonido()
    
}

class Perro extends Animal {
    // raza + constructor con super + buscarPalo()
    
}

public class Main {
    public static void main(String[] args) {
        // Creá y probá
        
    }
}`,
    hints: [
      'Animal: <code>String nombre;</code>, constructor, <code>void hacerSonido() { System.out.println(nombre + " hace un sonido"); }</code>',
      'Perro: <code>extends Animal</code>. Constructor llama <code>super(nombre);</code>',
      'Main: <code>Perro p = new Perro("Rex", "Labrador"); p.hacerSonido(); p.buscarPalo();</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta la palabra extends:</strong> Para heredar, se escribe <code>class Perro extends Animal</code>.</li><li><strong>Llamar a super() incorrectamente:</strong> El constructor de Perro DEBE llamar a <code>super(nombre);</code> en su primera línea para que Animal se inicialice.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `class Animal {
    String nombre;
    
    Animal(String nombre) {
        this.nombre = nombre;
    }
    
    void hacerSonido() {
        System.out.println(nombre + " hace un sonido");
    }
}

class Perro extends Animal {
    String raza;
    
    Perro(String nombre, String raza) {
        super(nombre);
        this.raza = raza;
    }
    
    void buscarPalo() {
        System.out.println(nombre + " busca el palo!");
    }
}

public class Main {
    public static void main(String[] args) {
        Perro p = new Perro("Rex", "Labrador");
        p.hacerSonido();
        p.buscarPalo();
    }
}`)}`
    ]
  }
},
{
  id:22, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Polimorfismo',
  desc:'El mismo método puede comportarse de forma diferente según el objeto que lo llame.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🎭</span><h4>Pensalo así...</h4>
<p><strong>Polimorfismo</strong> = "muchas formas". Es como el botón de "encender" en distintos aparatos:</p>
<p>🔌 Encender una <strong>tele</strong> → muestra imagen<br>
🔌 Encender una <strong>radio</strong> → emite sonido<br>
🔌 Encender una <strong>lámpara</strong> → ilumina</p>
<p>Todos tienen el método <code>encender()</code>, pero cada uno lo implementa distinto. ¡Eso es polimorfismo!</p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Que es overriding?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Hija redefine metodo del padre con MISMA firma. @Override.</p></div>
<div class="analogy-card"><p><strong>Override vs Overload?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Override: misma firma, DISTINTA clase. Overload: mismo nombre, DISTINTOS params.</p></div>
<div class="analogy-card"><p><strong>Sin @Override que pasa?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Funciona pero sin red de seguridad. El compilador no verifica.</p></div>
<div class="analogy-card"><p><strong>Por que guardar Perro en variable Animal?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Codigo GENERICO: un metodo recibe Animal y sirve para Perro, Gato, etc.</p></div>
<div class="analogy-card"><p><strong>Cuando usar polimorfismo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Tratar objetos relacionados uniformemente. Ej: procesar pagos.</p></div>
${ann('java','📌','En Java, el polimorfismo se logra con <strong>@Override</strong> (sobrescritura de métodos). Una clase hija puede redefinir un método de la clase padre para darle su propio comportamiento.')}
<div class="analogy-card"><h4>🔄 Sobrescritura vs Sobrecarga</h4>
<p><strong>Sobrescritura (@Override):</strong> misma firma, distinto comportamiento (clase hija cambia lo que hace el padre)<br>
<strong>Sobrecarga:</strong> mismo nombre, distintos parámetros (ej: <code>sumar(int, int)</code> y <code>sumar(double, double)</code>)</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Sobrescritura de métodos (@Override)</h3>
${cb('Polimorfismo con @Override', `class Animal {
    void hacerSonido() {
        System.out.println("El animal hace un sonido");
    }
}

class Perro extends Animal {
    @Override
    void hacerSonido() {
        System.out.println("El perro ladra: ¡Guau!");
    }
}

class Gato extends Animal {
    @Override
    void hacerSonido() {
        System.out.println("El gato maúlla: ¡Miau!");
    }
}`)}
</div>
<div class="ts">
<h3>Usando polimorfismo</h3>
${cb('Array polimórfico', `Animal[] animales = {new Perro(), new Gato(), new Animal()};

for (Animal a : animales) {
    a.hacerSonido();  // cada uno ejecuta SU versión
}
// "El perro ladra: ¡Guau!"
// "El gato maúlla: ¡Miau!"
// "El animal hace un sonido"`)}
${ann('ok','✅','La magia: aunque la variable es de tipo <code>Animal</code>, Java busca el método en la clase REAL del objeto (Perro, Gato). Esto se llama <strong>binding dinámico</strong>.')}
</div>
<div class="ts">
<h3>¿Por qué es útil?</h3>
<p>Podés escribir código genérico que funcione con cualquier subclase, sin saber cuál es. Si mañana agregás <code>class Pajaro extends Animal</code>, el bucle de arriba funciona sin cambiar nada.</p>
${ann('tip','💡','La anotación <code>@Override</code> es opcional pero MUY recomendada. Si te equivocás en el nombre del método, el compilador te avisa.')}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>@Override con distinto param</code></td><td>No es override, es overload</td><td>@Override daria error.</td></tr>
<tr><td><code>(Perro)new Animal()</code></td><td>ClassCastException</td><td>Downcasting solo si objeto real es del tipo.</td></tr>
<tr><td><code>sin @Override</code></td><td>Funciona sin seguridad</td><td>Si renombras padre, compilador no avisa.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá Animal con hacerSonido(). Luego Perro y Gato que sobrescriban el método. Creá un array y recorrelo.',
    expected: 'El perro ladra: ¡Guau!\nEl gato maúlla: ¡Miau!',
    starter: `class Animal {
    // Método hacerSonido()
    
}

class Perro extends Animal {
    // Sobrescribí hacerSonido()
    
}

class Gato extends Animal {
    // Sobrescribí hacerSonido()
    
}

public class Main {
    public static void main(String[] args) {
        // Creá array de Animal y recorrelo
        
    }
}`,
    hints: [
      'Animal: <code>void hacerSonido() { System.out.println("Sonido genérico"); }</code>',
      'Perro: <code>@Override void hacerSonido() { System.out.println("El perro ladra: ¡Guau!"); }</code>',
      'Gato: <code>@Override void hacerSonido() { System.out.println("El gato maúlla: ¡Miau!"); }</code>',
      `Animal[] a = { new Perro(), new Gato() }; for (Animal animal : a) animal.hacerSonido();`,
      `Solucion: ${cb('Solución', `class Animal {
    void hacerSonido() {
        System.out.println("Sonido genérico");
    }
}

class Perro extends Animal {
    @Override
    void hacerSonido() {
        System.out.println("El perro ladra: ¡Guau!");
    }
}

class Gato extends Animal {
    @Override
    void hacerSonido() {
        System.out.println("El gato maúlla: ¡Miau!");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animales = { new Perro(), new Gato() };
        for (Animal a : animales) {
            a.hacerSonido();
        }
    }
}`)}`
    ]
  }
},
{
  id:23, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Clases Abstractas e Interfaces',
  desc:'Definí contratos que otras clases deben cumplir. Aprendé a usar abstract e interface.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📜</span><h4>Pensalo así...</h4>
<p>Una <strong>clase abstracta</strong> es como un <strong>plano incompleto</strong>: define qué debe tener una casa (paredes, techo) pero deja algunos detalles para que cada constructor los complete a su manera.</p>
<p>Una <strong>interface</strong> es como un <strong>contrato</strong>: "si querés ser parte de este sistema, tenés que cumplir con estas reglas sí o sí".</p>
<p><code>abstract class Figura</code> → "toda figura tiene área, pero cada una la calcula distinto"<br>
<code>interface Volador</code> → "todo lo que vuela debe implementar el método volar()"</p>
</div>
<div class="analogy-card"><h4>El enchufe universal</h4><p>Una interfaz es como un enchufe estandar: define LA FORMA (dos patas planas, 220V) pero no QUE APARATO. Cualquier aparato que cumpla la forma funciona.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Puedo instanciar clase abstracta?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. new Figura() da error. Solo clases concretas.</p></div>
<div class="analogy-card"><p><strong>Multiples interfaces?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si. class Pato implements Volador, Nadador.</p></div>
<div class="analogy-card"><p><strong>Abstract vs Interface?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Abstract: comparten CODIGO. Interface: comparten CAPACIDADES.</p></div>
<div class="analogy-card"><p><strong>Metodos con cuerpo en interface?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si, con default (Java 8+).</p></div>
<div class="analogy-card"><p><strong>extends vs implements?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ extends=heredo de UNA clase. implements=cumplo VARIOS contratos.</p></div>
${ann('java','📌','<strong>abstract</strong> = no se puede instanciar, puede tener métodos sin cuerpo.<br><strong>interface</strong> = solo define QUÉ métodos deben existir, no CÓMO (hasta Java 8).')}`,
  tutorial: () => `
<div class="ts">
<h3>Clase Abstracta</h3>
${cb('Abstract', `abstract class Figura {
    abstract double calcularArea();  // sin cuerpo
    
    void mostrarTipo() {  // método normal
        System.out.println("Soy una figura");
    }
}

class Circulo extends Figura {
    double radio;
    Circulo(double r) { radio = r; }
    
    @Override
    double calcularArea() {
        return Math.PI * radio * radio;
    }
}`)}
</div>
<div class="ts">
<h3>Interface</h3>
${cb('Interface', `interface Imprimible {
    void imprimir();  // público y abstracto por defecto
}

class Documento implements Imprimible {
    public void imprimir() {
        System.out.println("Imprimiendo documento...");
    }
}

class Foto implements Imprimible {
    public void imprimir() {
        System.out.println("Imprimiendo foto en alta calidad...");
    }
}`)}
</div>
<div class="ts">
<h3>Abstract vs Interface</h3>
<table class="sym-tbl">
<thead><tr><th>Característica</th><th>Abstract Class</th><th>Interface</th></tr></thead>
<tbody>
<tr><td>Instanciar</td><td>No se puede</td><td>No se puede</td></tr>
<tr><td>Métodos con cuerpo</td><td>Sí</td><td>Sí (desde Java 8, con default)</td></tr>
<tr><td>Herencia múltiple</td><td>No (solo una)</td><td>Sí (varias)</td></tr>
<tr><td>Constructores</td><td>Sí</td><td>No</td></tr>
<tr><td>Palabra clave</td><td>extends</td><td>implements</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>implements sin implementar</code></td><td>Error</td><td>Obligatorio implementar todos los metodos.</td></tr>
<tr><td><code>new Volador()</code></td><td>Error</td><td>No se instancia interfaz.</td></tr>
<tr><td><code>Dos interfaces, mismo default</code></td><td>Error</td><td>La clase debe sobrescribir.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá interface Imprimible con método imprimir(). Clases Documento y Foto que la implementen. Probá ambas.',
    expected: 'Imprimiendo documento...\nImprimiendo foto...',
    starter: `// Creá la interface y las clases aquí

public class Main {
    public static void main(String[] args) {
        // Probá ambas implementaciones
        
    }
}`,
    hints: [
      '<code>interface Imprimible { void imprimir(); }</code>',
      '<code>class Documento implements Imprimible { public void imprimir() { System.out.println("Imprimiendo documento..."); } }</code>',
      '<code>class Foto implements Imprimible { public void imprimir() { System.out.println("Imprimiendo foto..."); } }</code>',
      `Solucion: ${cb('Solución', `interface Imprimible {
    void imprimir();
}

class Documento implements Imprimible {
    public void imprimir() {
        System.out.println("Imprimiendo documento...");
    }
}

class Foto implements Imprimible {
    public void imprimir() {
        System.out.println("Imprimiendo foto...");
    }
}

public class Main {
    public static void main(String[] args) {
        Imprimible doc = new Documento();
        Imprimible foto = new Foto();
        doc.imprimir();
        foto.imprimir();
    }
}`)}`
    ]
  }
},
{
  id:24, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'ArrayList',
  desc:'Listas de tamaño dinámico. Agregá, eliminá y recorrí elementos.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📋</span><h4>Pensalo así...</h4>
<p>Si un <strong>array</strong> es un casillero con candado (tamaño fijo), un <strong>ArrayList</strong> es una <strong>lista de compras</strong>: podés agregar y tachar items cuando quieras.</p>
<p><code>.add("Manzana")</code> → agrega al final<br>
<code>.remove(0)</code> → saca el primero<br>
<code>.get(1)</code> → mirá qué hay en la posición 1<br>
<code>.size()</code> → cuántos items hay</p>
</div>
<div class="analogy-card"><h4>La playlist de musica</h4><p>ArrayList es como una playlist: agregas canciones (.add), quitas (.remove), ves cuantas hay (.size). A diferencia de un CD (array), la playlist crece y se achica.</p></div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>ArrayList vs array?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cuando no sabes cuantos elementos o necesitas agregar/quitar dinamicamente.</p></div>
<div class="analogy-card"><p><strong>ArrayList<int> funciona?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ No. Solo objetos. Usa Integer (wrapper). Java hace autoboxing.</p></div>
<div class="analogy-card"><p><strong>.length o .size()?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ size() CON parentesis (METODO). Array usa .length (ATRIBUTO).</p></div>
<div class="analogy-card"><p><strong>Elemento en posicion 3?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ nums.get(3). Con .get() en vez de [3].</p></div>
<div class="analogy-card"><p><strong>ArrayList es mas lento?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Ligeramente. La flexibilidad lo compensa.</p></div>
${ann('warn','⚠️','Necesitás <code>import java.util.ArrayList;</code> al principio del archivo. Sin eso, Java no sabe qué es ArrayList.')}`,
  tutorial: () => `
<div class="ts">
<h3>ArrayList básico</h3>
${cb('Crear y usar', `import java.util.ArrayList;

ArrayList<String> frutas = new ArrayList<>();
frutas.add("Manzana");
frutas.add("Banana");
frutas.add("Naranja");

System.out.println(frutas.size());      // 3
System.out.println(frutas.get(0));      // Manzana
System.out.println(frutas.contains("Banana")); // true`)}
</div>
<div class="ts">
<h3>Métodos principales</h3>
<table class="sym-tbl">
<thead><tr><th>Método</th><th>Qué hace</th></tr></thead>
<tbody>
<tr><td>add(elem)</td><td>Agrega al final</td></tr>
<tr><td>get(índice)</td><td>Obtiene por posición</td></tr>
<tr><td>size()</td><td>Cantidad de elementos</td></tr>
<tr><td>remove(índice)</td><td>Elimina por posición</td></tr>
<tr><td>contains(obj)</td><td>True si existe</td></tr>
<tr><td>clear()</td><td>Vacía la lista</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>Recorrer un ArrayList</h3>
${cb('For-each', `for (String fruta : frutas) {
    System.out.println(fruta);
}`)}
</div>
<div class="ts">
<h3>ArrayList con números — Autoboxing</h3>
${cb('Wrapper types', `// ArrayList<int> NO funciona. Usá Integer:
ArrayList<Integer> numeros = new ArrayList<>();
numeros.add(42);   // autoboxing: int → Integer
int n = numeros.get(0);   // unboxing: Integer → int`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>ArrayList<int></code></td><td>Error</td><td>Solo objetos. Usa Integer.</td></tr>
<tr><td><code>nums.length</code></td><td>Error</td><td>ArrayList usa .size().</td></tr>
<tr><td><code>Olvidar import</code></td><td>cannot find symbol</td><td>Agrega import java.util.ArrayList.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá ArrayList de Strings, agregá "Manzana", "Banana", "Naranja". Imprimí cada una y el total.',
    expected: 'Manzana\nBanana\nNaranja\nTotal de frutas: 3',
    starter: `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> frutas = new ArrayList<>();
        // Agregá, imprimí, total
        
    }
}`,
    hints: [
      'Agregá: <code>frutas.add("Manzana");</code> etc.',
      'Recorrelo: <code>for (String fruta : frutas) { System.out.println(fruta); }</code>',
      'Total: <code>System.out.println("Total de frutas: " + frutas.size());</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Falta el import:</strong> Recordá que la primera línea de tu archivo debe ser <code>import java.util.ArrayList;</code>.</li><li><strong>Uso de length en vez de size():</strong> Para arrays se usa <code>.length</code>, pero para ArrayList se debe usar el método <code>.size()</code>.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> frutas = new ArrayList<>();
        frutas.add("Manzana");
        frutas.add("Banana");
        frutas.add("Naranja");
        
        for (String fruta : frutas) {
            System.out.println(fruta);
        }
        
        System.out.println("Total de frutas: " + frutas.size());
    }
}`)}`
    ]
  }
},
{
  id:25, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Estructura de Proyectos Java',
  desc:'Aprendé cómo se organizan los archivos, paquetes y la estructura de un proyecto real.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📁</span><h4>Pensalo así...</h4>
<p>Un proyecto Java es como un <strong>edificio de oficinas</strong> bien organizado:</p>
<p>📁 <strong>src/</strong> → donde está TODO tu código fuente (.java)<br>
📁 <strong>paquetes</strong> → carpetas que organizan clases relacionadas (como departamentos)<br>
📄 <strong>Main.java</strong> → la entrada principal (la recepción del edificio)<br>
📦 <strong>JAR</strong> → el edificio empaquetado para distribuir</p>
</div>
${ann('java','📌','Los paquetes se declaran con <code>package</code> al principio de cada archivo y se importan con <code>import</code>. Ayudan a evitar conflictos de nombres.')}
<div class="analogy-card"><h4>🏢 Convenciones de nombres</h4>
<p><code>com.empresa.proyecto.modulo</code> → dominio al revés (como un sitio web)<br>
Ejemplo: <code>com.google.maps.geolocation</code></p>
<p>Las clases van en <strong>PascalCase</strong>, los paquetes en <strong>minúsculas</strong>.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Estructura típica de un proyecto</h3>
${cb('Árbol del proyecto', `mi-proyecto/
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── miapp/
│                   ├── Main.java
│                   ├── modelo/
│                   │   └── Usuario.java
│                   └── servicio/
│                       └── UsuarioService.java
├── pom.xml (Maven) o build.gradle
└── README.md`)}
</div>
<div class="ts">
<h3>Paquetes en código</h3>
${cb('Uso de package', `// Archivo: src/com/miapp/modelo/Usuario.java
package com.miapp.modelo;

public class Usuario {
    private String nombre;
    public Usuario(String nombre) { this.nombre = nombre; }
}

// Archivo: src/com/miapp/Main.java
package com.miapp;

import com.miapp.modelo.Usuario;

public class Main {
    public static void main(String[] args) {
        Usuario u = new Usuario("Ana");
    }
}`)}
</div>
<div class="ts">
<h3>Modificadores de acceso entre paquetes</h3>
<table class="sym-tbl">
<thead><tr><th>Modificador</th><th>Misma clase</th><th>Mismo paquete</th><th>Subclase</th><th>Todos</th></tr></thead>
<tbody>
<tr><td>private</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>(default)</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
<tr><td>protected</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td></tr>
<tr><td>public</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr>
</tbody>
</table>
${ann('tip','💡','Si no ponés ningún modificador (default), la clase solo es visible dentro de su mismo paquete. Para APIs públicas usá <code>public</code>.')}
<div class="ts">
<h3>🛠️ Compilar un proyecto con múltiples archivos</h3>
<p>Cuando tu proyecto crece y tiene varias clases en distintos paquetes, compilar archivo por archivo es inviable. La terminal te permite compilar todo de una vez:</p>
${cb('Compilación desde terminal', `# Desde la raíz del proyecto (donde está src/)
javac -d bin src/main/java/com/miapp/**/*.java

# Esto compila TODOS los .java y pone los .class en la carpeta bin/
# Luego ejecutás con:
java -cp bin com.miapp.Main`)}
<p>En proyectos reales no hacés esto manualmente. Usás <strong>Maven</strong> (<code>mvn compile</code>, <code>mvn package</code>) o <strong>Gradle</strong> (<code>gradle build</code>) que automatizan compilación, tests, y empaquetado.</p>
${ann('ok','✅','El comando <code>javac -d bin</code> compila y organiza los .class respetando la estructura de paquetes. El flag <code>-cp bin</code> le dice a java dónde buscar las clases compiladas.')}
</div>
</div>`,
  quiz: {
    passing: 3,
    questions: [
      { question: '¿Dónde se coloca el código fuente en un proyecto Java?', options: ['En la raíz del proyecto', 'En la carpeta src/', 'En la carpeta bin/', 'En cualquier lado'], correct: 1 },
      { question: '¿Para qué sirven los paquetes (packages)?', options: ['Para comprimir archivos', 'Para organizar y agrupar clases relacionadas', 'Para instalar librerías', 'Para crear ejecutables'], correct: 1 },
      { question: '¿Qué visibilidad tiene un miembro sin modificador (default)?', options: ['Solo la misma clase', 'Mismo paquete', 'Todas las clases', 'Solo subclases'], correct: 1 },
      { question: '¿Cómo se llama la herramienta de construcción más usada en Java?', options: ['npm', 'pip', 'Maven / Gradle', 'make'], correct: 2 },
      { question: '¿Qué extensión tiene un archivo compilado de Java?', options: ['.java', '.class', '.jar', '.exe'], correct: 1 }
    ]
  }
},
{
  id:26, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Entrada y Salida de Archivos',
  desc:'Leé y escribí archivos de texto con FileWriter, BufferedWriter y try-with-resources.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📄</span><h4>Pensalo así...</h4>
<p>Leer y escribir archivos es como trabajar con un <strong>block de notas conectado a tu programa</strong>:</p>
<p>✍️ <strong>FileWriter</strong> → abre el block y escribe carácter por carácter<br>
✍️ <strong>BufferedWriter</strong> → escribe de a bloques, más rápido (como escribir párrafos enteros)<br>
📖 <strong>BufferedReader</strong> → lee de a bloques, más eficiente</p>
<p><strong>try-with-resources</strong> cierra automáticamente los archivos. Sin eso, tenés que cerrarlos manualmente con <code>.close()</code>.</p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Por que try-with-resources?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cierra archivo AUTOMATICAMENTE al salir del try.</p></div>
<div class="analogy-card"><p><strong>BufferedReader vs FileReader?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ BufferedReader envuelve a FileReader. Lee bloques, tiene readLine().</p></div>
<div class="analogy-card"><p><strong>Que hace split(",")?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Divide String por coma. "Ana,25" -> ["Ana","25"]. Clave para CSV.</p></div>
<div class="analogy-card"><p><strong>Archivo no existe?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ FileNotFoundException. Siempre try-catch.</p></div>
<div class="analogy-card"><p><strong>FileWriter sobreescribe?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Por defecto SI. new FileWriter("f.txt",true) para append.</p></div>
${ann('warn','⚠️','Siempre manejá las operaciones de archivos con <strong>try-catch</strong>. Los archivos pueden no existir, no tener permisos, o el disco puede estar lleno.')}`,
  tutorial: () => `
<div class="ts">
<h3>Escribir en un archivo</h3>
${cb('FileWriter + BufferedWriter', `import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        String ruta = "salida.txt";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(ruta))) {
            writer.write("Primera línea");
            writer.newLine();
            writer.write("Segunda línea");
            System.out.println("Archivo escrito correctamente.");
        } catch (IOException e) {
            System.out.println("Error al escribir: " + e.getMessage());
        }
    }
}`)}
${ann('ok','✅','El <strong>try-with-resources</strong> (try con paréntesis) cierra el writer automáticamente al terminar el bloque.')}
</div>
<div class="ts">
<h3>Leer un archivo</h3>
${cb('BufferedReader', `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

try (BufferedReader reader = new BufferedReader(new FileReader("entrada.txt"))) {
    String linea;
    while ((linea = reader.readLine()) != null) {
        System.out.println(linea);
    }
} catch (IOException e) {
    System.out.println("Error al leer: " + e.getMessage());
}`)}
</div>
<div class="ts">
<h3>Resumen de clases de I/O</h3>
<table class="sym-tbl">
<thead><tr><th>Clase</th><th>Para qué</th></tr></thead>
<tbody>
<tr><td>FileWriter</td><td>Escribir texto carácter por carácter</td></tr>
<tr><td>BufferedWriter</td><td>Escribir texto con buffer (más rápido)</td></tr>
<tr><td>FileReader</td><td>Leer texto carácter por carácter</td></tr>
<tr><td>BufferedReader</td><td>Leer texto con buffer (más rápido)</td></tr>
<tr><td>PrintWriter</td><td>Escribir con println() como en consola</td></tr>
</tbody>
</table>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>FileReader sin try</code></td><td>Error</td><td>IOException requiere try-catch.</td></tr>
<tr><td><code>Ruta absoluta</code></td><td>No portable</td><td>Usa rutas relativas.</td></tr>
<tr><td><code>Olvidar close()</code></td><td>Memory leak</td><td>Usa try-with-resources.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Escribí un programa que cree un archivo "mensaje.txt" con el texto "Hola desde Java" y luego imprima "Archivo creado exitosamente".',
    expected: 'Archivo creado exitosamente',
    starter: `import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        // Escribí el archivo con try-with-resources
        
    }
}`,
    hints: [
      'Usá <code>try (BufferedWriter writer = new BufferedWriter(new FileWriter("mensaje.txt")))</code>',
      'Dentro: <code>writer.write("Hola desde Java");</code> y luego <code>System.out.println("Archivo creado exitosamente");</code>',
      'El catch atrapa <code>IOException</code>.',
      `Solucion: ${cb('Solución', `import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("mensaje.txt"))) {
            writer.write("Hola desde Java");
            System.out.println("Archivo creado exitosamente");
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`)}`
    ]
  }
},
{
  id:27, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Try-catch (manejo de errores)',
  desc:'Atrapá errores antes de que tu programa explote. Manejá excepciones con elegancia.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🥅</span><h4>Pensalo así...</h4>
<p><code>try-catch</code> es como una <strong>red de seguridad</strong> en un trapecio. Si el acróbata (tu código) se cae (error), la red (catch) lo atrapa en vez de estrellarse contra el piso.</p>
<p><code>try { ... }</code> → "intentá hacer esto"<br>
<code>catch (Exception e) { ... }</code> → "si falla, hacé esto otro"<br>
<code>finally { ... }</code> → "pase lo que pase, siempre hacé esto"</p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Checked vs unchecked?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Checked: compilador OBLIGA try-catch. Unchecked: opcional.</p></div>
<div class="analogy-card"><p><strong>Que hace finally?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Se ejecuta SIEMPRE. Ideal para cerrar recursos.</p></div>
<div class="analogy-card"><p><strong>Varios catch para un try?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Si. Mas especificos primero.</p></div>
<div class="analogy-card"><p><strong>No atrapar excepcion?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ CRASH. Stack trace en rojo.</p></div>
<div class="analogy-card"><p><strong>Cuando usar try-catch?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Errores RECUPERABLES (archivo, input). Deja crashear bugs de codigo.</p></div>
${ann('tip','💡','Sin try-catch, si tu programa intenta dividir por cero o convertir "abc" a número, se detiene completamente. Con try-catch, podés manejarlo elegantemente.')}`,
  tutorial: () => `
<div class="ts">
<h3>Estructura try-catch</h3>
${cb('Manejo de errores', `public class Main {
    public static void main(String[] args) {
        try {
            int resultado = 10 / 0;  // esto causa ArithmeticException
            System.out.println(resultado);
        } catch (ArithmeticException e) {
            System.out.println("Error: no se puede dividir por cero");
        }
        
        System.out.println("El programa sigue funcionando");
    }
}`)}
${ann('ok','✅','Sin el try-catch, el programa se detendría en la línea del error. Con try-catch, atrapa el error y sigue ejecutando.')}
</div>
<div class="ts">
<h3>Errores comunes que podés atrapar</h3>
<table class="sym-tbl">
<thead><tr><th>Excepción</th><th>Cuándo ocurre</th></tr></thead>
<tbody>
<tr><td>ArithmeticException</td><td>División por cero</td></tr>
<tr><td>NumberFormatException</td><td>Integer.parseInt("abc")</td></tr>
<tr><td>ArrayIndexOutOfBoundsException</td><td>Acceder a índice fuera del array</td></tr>
<tr><td>NullPointerException</td><td>Llamar método sobre null</td></tr>
<tr><td>InputMismatchException</td><td>Scanner recibe tipo incorrecto</td></tr>
</tbody>
</table>
</div>
<div class="ts">
<h3>try-catch-finally</h3>
${cb('Finally siempre se ejecuta', `try {
    int[] arr = {1, 2, 3};
    System.out.println(arr[10]);  // error: índice 10 no existe
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Error: índice fuera del rango");
} finally {
    System.out.println("Esto se ejecuta siempre");
}`)}
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>catch{ } sin tipo</code></td><td>Error sintaxis</td><td>Necesita tipo: catch(Exception e){ }</td></tr>
<tr><td><code>catch vacio</code></td><td>Error silencioso</td><td>Al menos imprime el error.</td></tr>
<tr><td><code>Exception antes que IOException</code></td><td>Error</td><td>Especificos primero.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Intentá convertir "abc" a int con Integer.parseInt() dentro de un try-catch. Atrapá el error.',
    expected: 'Intentando convertir...\nError: el texto no es un número válido\nPrograma finalizado',
    starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Intentando convertir...");
        // Usá try-catch para atrapar el error
        
        System.out.println("Programa finalizado");
    }
}`,
    hints: [
      'Dentro del try: <code>int num = Integer.parseInt("abc");</code> — esto lanza NumberFormatException.',
      'El catch atrapa: <code>catch (NumberFormatException e) { ... }</code>',
      'Dentro del catch: <code>System.out.println("Error: el texto no es un número válido");</code>',
      `<strong>Posibles errores comunes:</strong><ul><li><strong>Sintaxis del catch:</strong> Acordate de que el bloque va estructurado como <code>catch (TipoDeError variable) { }</code>.</li><li><strong>Falta código fuera del try:</strong> Asegurate de que el mensaje "Programa finalizado" esté afuera de los bloques try y catch, al final del main.</li></ul><strong>La solución:</strong><br>Si seguís trabado, copiá este código:<br>${cb('Solución', `public class Main {
    public static void main(String[] args) {
        System.out.println("Intentando convertir...");
        try {
            int num = Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            System.out.println("Error: el texto no es un número válido");
        }
        System.out.println("Programa finalizado");
    }
}`)}`
    ]
  }
},
{
  id:28, level:'inter', levelLabel:'Intermedio', stars:'⭐⭐⭐',
  title:'Excepciones Propias y Debugging',
  desc:'Creá tus propias excepciones personalizadas y aprendé técnicas básicas de debugging.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔍</span><h4>Pensalo así...</h4>
<p>Crear tu propia excepción es como definir una <strong>alarma personalizada</strong> en tu casa:</p>
<p>🏠 Java ya tiene alarmas genéricas (NullPointerException, IOException)<br>
🔔 Pero vos podés crear la tuya: "AlarmaDePuertaAbierta", que solo suene cuando la puerta queda mal cerrada</p>
<p>Con <code>throw new MiExcepcion("mensaje")</code> lanzás tu alarma. Con <code>catch (MiExcepcion e)</code> la atrapás.</p>
</div>
<h3>🧪 Mini-Quiz</h3>
<div class="analogy-card"><p><strong>Cuando crear excepcion propia?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Cuando las estandar no describen bien el problema.</p></div>
<div class="analogy-card"><p><strong>throw vs throws?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ throw LANZA (dentro). throws DECLARA (en firma).</p></div>
<div class="analogy-card"><p><strong>Exception o RuntimeException?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Exception=checked. RuntimeException=unchecked. Negocio -> Exception.</p></div>
<div class="analogy-card"><p><strong>Como leer stack trace?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Arriba->abajo. Tipo de error, luego ubicacion (clase, metodo, linea).</p></div>
<div class="analogy-card"><p><strong>Como hacer debugging?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ println, stack trace, debugger paso a paso en IDE.</p></div>
${ann('tip','💡','<strong>Debugging:</strong> Usá <code>System.out.println()</code> para imprimir valores en puntos clave. Es la técnica más simple y efectiva para entender qué está pasando.')}`,
  tutorial: () => `
<div class="ts">
<h3>Crear una excepción propia</h3>
${cb('Excepción personalizada', `class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensaje) {
        super(mensaje);
    }
}

class CuentaBancaria {
    private double saldo;
    
    void retirar(double monto) throws SaldoInsuficienteException {
        if (monto > saldo) {
            throw new SaldoInsuficienteException(
                "No tenés suficiente saldo. Intentaste retirar $" + monto
            );
        }
        saldo -= monto;
    }
}`)}
</div>
<div class="ts">
<h3>Usar la excepción propia</h3>
${cb('Lanzar y atrapar', `CuentaBancaria cuenta = new CuentaBancaria();

try {
    cuenta.retirar(500);
} catch (SaldoInsuficienteException e) {
    System.out.println("Error: " + e.getMessage());
}`)}
</div>
<div class="ts">
<h3>Técnicas de Debugging</h3>
<table class="sym-tbl">
<thead><tr><th>Técnica</th><th>Cómo se hace</th></tr></thead>
<tbody>
<tr><td>Print debugging</td><td>System.out.println("valor de x: " + x);</td></tr>
<tr><td>Stack trace</td><td>e.printStackTrace();</td></tr>
<tr><td>Assertions</td><td>assert x > 0 : "x debe ser positivo";</td></tr>
<tr><td>Logging</td><td>java.util.logging.Logger</td></tr>
</tbody>
</table>
${ann('warn','⚠️','Las excepciones checked (que extienden Exception, no RuntimeException) obligan a quien las usa a poner try-catch o declarar <code>throws</code>.')}
<div class="ts">
<h3>📦 Exportar un .jar ejecutable</h3>
<p>Un archivo <strong>.jar</strong> (Java ARchive) es un paquete comprimido que contiene todos tus <code>.class</code> y recursos. Es el formato estándar para distribuir aplicaciones Java.</p>
${cb('Crear un .jar desde terminal', `# 1. Compilar todo
javac -d bin src/**/*.java

# 2. Crear MANIFEST.MF (indica cuál es la clase principal)
echo Main-Class: com.miapp.Main > manifest.txt

# 3. Empaquetar
jar cfm mi-app.jar manifest.txt -C bin .

# 4. Ejecutar
java -jar mi-app.jar`)}
<p>En proyectos profesionales usás Maven o Gradle para esto. Pero saber cómo funciona por detrás te ayuda a entender qué pasa cuando algo falla.</p>
${ann('ok','✅','El MANIFEST.MF es un archivo de metadatos dentro del .jar. La línea <code>Main-Class:</code> le dice a Java qué clase ejecutar cuando alguien hace doble clic en el .jar.')}
</div>
</div><div class="ts"><h3>🆘 Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>throw sin throws</code></td><td>Error</td><td>Checked requiere throws en firma.</td></tr>
<tr><td><code>class sin extends Exception</code></td><td>No es excepcion</td><td>Debe heredar de Exception.</td></tr>
<tr><td><code>printStackTrace en produccion</code></td><td>Mala practica</td><td>Usa logger.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Creá EdadInvalidaException. Una clase Persona con setEdad() que lance la excepción si edad < 0 o > 120. Probala.',
    expected: 'Edad asignada: 25\nError: La edad -5 no es válida',
    starter: `// Creá la excepción y la clase Persona

public class Main {
    public static void main(String[] args) {
        // Probá con edad válida e inválida
        
    }
}`,
    hints: [
      '<code>class EdadInvalidaException extends Exception { EdadInvalidaException(String msg) { super(msg); } }</code>',
      'En Persona: <code>void setEdad(int edad) throws EdadInvalidaException { if (edad < 0 || edad > 120) throw new EdadInvalidaException("La edad " + edad + " no es válida"); this.edad = edad; }</code>',
      'Proba con 25 (edad valida) y -5 (invalida) en uno o dos bloques try-catch. Lo importante es que el error se atrape.',
      `Solucion: ${cb('Solución', `class EdadInvalidaException extends Exception {
    EdadInvalidaException(String mensaje) {
        super(mensaje);
    }
}

class Persona {
    private int edad;
    
    void setEdad(int edad) throws EdadInvalidaException {
        if (edad < 0 || edad > 120) {
            throw new EdadInvalidaException("La edad " + edad + " no es válida");
        }
        this.edad = edad;
        System.out.println("Edad asignada: " + edad);
    }
}

public class Main {
    public static void main(String[] args) {
        Persona p = new Persona();
        try {
            p.setEdad(25);
            p.setEdad(-5);
        } catch (EdadInvalidaException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}`)}`
    ]
  }
},
{
  id:29, level:'inter', levelLabel:'Examen Intermedio', stars:'⭐⭐⭐',
  title:'Proyecto Final: Menú Interactivo con POO',
  desc:'Integrá todo lo aprendido: creá un menú interactivo con switch, ArrayList, POO y manejo de errores.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏁</span><h4>¡El desafío final!</h4>
<p>Este proyecto integra <strong>todos los conceptos clave</strong> que aprendiste:</p>
<p>🧩 <strong>POO</strong>: interface, clases, objetos<br>
📋 <strong>ArrayList</strong>: colección dinámica de tareas<br>
🔄 <strong>switch + while</strong>: menú interactivo<br>
🥅 <strong>try-catch</strong>: manejo de errores de entrada<br>
📦 <strong>Encapsulamiento</strong>: atributos privados con getters</p>
<p>Vas a construir una <strong>aplicación de consola</strong> con menú interactivo. Podés elegir entre dos temáticas (o inventar la tuya):</p>
<p>📐 <strong>Calculadora de áreas</strong>: menú con opciones para calcular área de rectángulo, círculo y triángulo. Usá una interfaz <code>Calculable</code> que cada figura implemente.<br>
📋 <strong>Gestor de tareas</strong>: menú para agregar, listar y eliminar tareas usando <code>ArrayList</code>. ¡Es un mini programa real!</p>
</div>
${ann('java','📌','Este es el proyecto que podés mostrar en tu portfolio. Demuestra que entendés cómo se estructura una aplicación Java completa.')}`,
  tutorial: () => `
<div class="ts">
<h3>Requerimientos del Proyecto</h3>
<ol>
  <li>Creá una <strong>interface</strong> <code>Gestionable</code> con métodos <code>agregar()</code> y <code>listar()</code>.</li>
  <li>Creá una clase <code>Tarea</code> con atributos privados: <code>descripcion</code> (String) y <code>completada</code> (boolean).</li>
  <li>Creá una clase <code>GestorTareas</code> que implemente <code>Gestionable</code>, use un <code>ArrayList&lt;Tarea&gt;</code> para almacenar, y tenga un método con retorno <code>contarCompletadas()</code>.</li>
  <li>En el <code>main</code>, usá un <strong>switch</strong> dentro de un <strong>while</strong> para mostrar opciones:</li>
</ol>
</div>
<div class="ts">
<h3>Estructura del menú</h3>
${cb('Menú esperado', `=== GESTOR DE TAREAS ===
1. Agregar tarea
2. Listar tareas
3. Contar completadas
4. Salir
Elegí una opción: `)}
</div>
<div class="ts">
<h3>Ejemplo de interacción</h3>
${cb('Output esperado', `=== GESTOR DE TAREAS ===
1. Agregar tarea
2. Listar tareas
3. Contar completadas
4. Salir
Tarea agregada: Estudiar Java
Tarea agregada: Hacer ejercicio
Lista de tareas:
- Estudiar Java [Pendiente]
- Hacer ejercicio [Pendiente]
Tareas completadas: 0
¡Hasta luego!`)}
</div>`,
  exercise: {
    desc: 'Construí el gestor de tareas con interface, ArrayList, menú interactivo (switch+while) y try-catch.',
    expected: '=== GESTOR DE TAREAS ===\n1. Agregar tarea\n2. Listar tareas\n3. Contar completadas\n4. Salir\nTarea agregada: Estudiar Java\nTarea agregada: Hacer ejercicio\nLista de tareas:\n- Estudiar Java [Pendiente]\n- Hacer ejercicio [Pendiente]\nTareas completadas: 0\n¡Hasta luego!',
    starter: `import java.util.ArrayList;
import java.util.Scanner;

// Interface Gestionable

// Clase Tarea

// Clase GestorTareas

public class Main {
    public static void main(String[] args) {
        // Menú interactivo con switch y while
        
    }
}`,
    hints: [
      'Interface: <code>interface Gestionable { void agregar(String desc); void listar(); }</code>',
      'Tarea: <code>private String descripcion; private boolean completada;</code> más constructor y getters.',
      'GestorTareas: <code>ArrayList&lt;Tarea&gt; tareas = new ArrayList&lt;&gt;();</code> implementa Gestionable.',
      'Menú: <code>while (opcion != 4) { switch (opcion) { case 1: ... } }</code> con Scanner dentro de try-catch.',
      'Acordate de importar <code>java.util.Scanner</code> y <code>java.util.ArrayList</code>.',
      `Solucion: ${cb('Solución', `import java.util.ArrayList;
import java.util.Scanner;

interface Gestionable {
    void agregar(String descripcion);
    void listar();
}

class Tarea {
    private String descripcion;
    private boolean completada;
    
    Tarea(String descripcion) {
        this.descripcion = descripcion;
        this.completada = false;
    }
    
    String getDescripcion() { return descripcion; }
    boolean isCompletada() { return completada; }
    void marcarCompletada() { completada = true; }
}

class GestorTareas implements Gestionable {
    private ArrayList<Tarea> tareas = new ArrayList<>();
    
    public void agregar(String descripcion) {
        tareas.add(new Tarea(descripcion));
        System.out.println("Tarea agregada: " + descripcion);
    }
    
    public void listar() {
        System.out.println("Lista de tareas:");
        for (Tarea t : tareas) {
            String estado = t.isCompletada() ? "Hecha" : "Pendiente";
            System.out.println("- " + t.getDescripcion() + " [" + estado + "]");
        }
    }
    
    int contarCompletadas() {
        int count = 0;
        for (Tarea t : tareas) {
            if (t.isCompletada()) count++;
        }
        return count;
    }
}

public class Main {
    public static void main(String[] args) {
        GestorTareas gestor = new GestorTareas();
        int opcion = 0;
        int paso = 0;  // simula entrada del usuario
        
        while (opcion != 4) {
            System.out.println("=== GESTOR DE TAREAS ===");
            System.out.println("1. Agregar tarea");
            System.out.println("2. Listar tareas");
            System.out.println("3. Contar completadas");
            System.out.println("4. Salir");
            System.out.print("Opción: ");
            
            try {
                // Simulado: secuencia de opciones 1,1,2,3,4
                int[] pasos = {1, 1, 2, 3, 4};
                opcion = pasos[paso++];
                switch (opcion) {
                    case 1: gestor.agregar("Estudiar Java"); break;
                    case 2: gestor.listar(); break;
                    case 3: System.out.println("Tareas completadas: " + gestor.contarCompletadas()); break;
                    case 4: System.out.println("¡Hasta luego!"); break;
                }
            } catch (Exception e) {
                System.out.println("Error");
            }
        }
    }
}`)}`
    ]
  }
},
{
  id:30, level:'avanzado', levelLabel:'Avanzado', stars:'⭐⭐⭐⭐',
  title:'Control de Versiones y Git',
  desc:'Aprendé qué es Git, por qué se usa en la universidad y en el trabajo, y entendé los conceptos fundamentales del control de versiones contextualizado en proyectos Java.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">📸</span><h4>Pensalo así...</h4>
<p>Git es como el <strong>historial de cambios de Google Docs</strong>, pero para tu código Java. Cada <code>commit</code> es una foto completa de tu proyecto en ese momento: podés ver quién cambió qué, cuándo, y volver atrás si algo se rompe.</p>
</div>

<div class="analogy-card"><h4>👥 Sin Git = caos en equipo</h4>
<p>Imaginá 5 compañeros editando el mismo <code>Main.java</code> al mismo tiempo sin control de cambios. Uno borra un método que otro necesitaba. Con Git, cada uno trabaja en su rama y después unen todo sin perder nada.</p>
</div>

<div class="analogy-card"><h4>🎓 Git en la facultad</h4>
<p>Cada TP que entregás es un <strong>commit</strong>. Si el profe te pide "mostrame la versión que tenías antes de agregar la división", Git la tiene guardada. Si trabajás en grupo, Git evita que pises el código de tu compañero.</p>
</div>

<h3>🧪 Mini-Quiz: ¿entendiste Git?</h3>
<div class="analogy-card"><p><strong>1. ¿Qué es un commit en Git?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Una FOTO completa de tu proyecto en un momento dado. Guarda quién hizo el cambio, cuándo, y un mensaje descriptivo. Como un checkpoint al que podés volver.</p></div>
<div class="analogy-card"><p><strong>2. ¿Para qué sirve .gitignore en un proyecto Java?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para decirle a Git qué archivos IGNORAR. En Java, típicamente ignorás: *.class (bytecode compilado), bin/ (carpeta de salida), .idea/ (config del IDE). Solo versionás los .java y archivos de configuración.</p></div>
<div class="analogy-card"><p><strong>3. ¿Git necesita internet para funcionar?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ NO. Git es DISTRIBUIDO: cada copia del repositorio es completa e independiente. Podés commitear, ver historial y volver atrás sin internet. Solo necesitás conexión para push/pull (compartir con otros).</p></div>
<div class="analogy-card"><p><strong>4. ¿Por qué usar Git aunque trabajes solo en un TP?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Para tener HISTORIAL. Si hoy rompés algo que ayer funcionaba, Git te deja volver atrás en segundos. Además, es la herramienta que usa el 100% de la industria: practicarla desde la facultad te da ventaja.</p></div>
<div class="analogy-card"><p><strong>5. ¿Qué guarda cada commit además de los archivos modificados?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Quién lo hizo (author), cuándo (timestamp), y un mensaje descriptivo (commit message). Por eso los mensajes deben ser CLAROS: "Arreglo división por cero en calcularPromedio()" en vez de "fix".</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>¿Qué es un sistema de control de versiones?</h3>
<p>Un VCS (Version Control System) <strong>registra los cambios</strong> en tu código a lo largo del tiempo. Te permite:</p>
<ul>
  <li>Ver <strong>quién</strong> cambió <strong>qué</strong> y <strong>cuándo</strong></li>
  <li>Volver a <strong>cualquier versión anterior</strong> si algo se rompe</li>
  <li>Trabajar en <strong>equipo sin pisarse</strong> los cambios</li>
</ul>
<p>Git es el VCS más usado del mundo (90%+ de los desarrolladores según StackOverflow). Fue creado por Linus Torvalds (el creador de Linux) en 2005.</p>
</div>

<div class="ts">
<h3>Conceptos clave de Git</h3>
<table class="sym-tbl">
<thead><tr><th>Concepto</th><th>Significado</th><th>Analogía Java</th></tr></thead>
<tbody>
<tr><td>Repositorio</td><td>Carpeta con superpoderes: recuerda TODAS las versiones</td><td>Tu proyecto Java con una carpeta .git/ oculta</td></tr>
<tr><td>Commit</td><td>Foto completa del proyecto en un momento dado</td><td>Un snapshot de todos tus .java en ese instante</td></tr>
<tr><td>Branch (rama)</td><td>Línea independiente de desarrollo</td><td>Dos versiones paralelas de tu proyecto</td></tr>
<tr><td>Merge</td><td>Unir dos ramas en una sola</td><td>Combinar tu trabajo con el de tu compañero</td></tr>
<tr><td>Working Directory</td><td>Tus archivos .java actuales</td><td>Lo que ves y editás en el IDE</td></tr>
<tr><td>Staging Area</td><td>Archivos seleccionados para el próximo commit</td><td>Los .java que marcaste como "listos para guardar"</td></tr>
</tbody>
</table>
</div>

<div class="ts">
<h3>Flujo de trabajo Git</h3>
${cb('Áreas de Git', `Working Directory          Staging Area            Repository (.git/)
┌──────────────┐       ┌──────────────┐       ┌──────────────────┐
│ Main.java     │ add →│ Main.java     │commit→│ abc123: "v1.0"    │
│ Calculo.java  │       │ Calculo.java  │       │ def456: "+div"    │
│ *.class       │       │              │       │ ghi789: "fix bug" │
└──────────────┘       └──────────────┘       └──────────────────┘
    editás               seleccionás              guardás foto`)}
<p><strong>Flujo diario:</strong> editás tu .java → <code>git add</code> (seleccionás qué guardar) → <code>git commit</code> (guardás la foto con mensaje).</p>
</div>

<div class="ts">
<h3>¿Qué archivos versionar en un proyecto Java?</h3>
<table class="sym-tbl">
<thead><tr><th>Archivo</th><th>¿Versionar?</th><th>Por qué</th></tr></thead>
<tbody>
<tr><td><code>*.java</code></td><td>✅ SÍ</td><td>Es tu código fuente, lo más valioso</td></tr>
<tr><td><code>*.class</code></td><td>❌ NO</td><td>Se genera automáticamente al compilar</td></tr>
<tr><td><code>bin/</code></td><td>❌ NO</td><td>Carpeta de salida del compilador</td></tr>
<tr><td><code>.gitignore</code></td><td>✅ SÍ</td><td>Define qué ignorar, es parte del proyecto</td></tr>
<tr><td><code>.idea/</code></td><td>❌ NO</td><td>Configuración local del IDE (IntelliJ)</td></tr>
<tr><td><code>README.md</code></td><td>✅ SÍ</td><td>Documentación del proyecto</td></tr>
</tbody>
</table>
</div>

<div class="ts">
<h3>Instalación de Git</h3>
<p>Para verificar si ya tenés Git instalado, abrí una terminal y escribí:</p>
${cb('Verificar instalación', `git --version
# git version 2.43.0  ← si ves algo así, ya lo tenés

git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"`)}
${ann('tip','💡','En este tutorial no necesitás instalar Git. Los ejercicios simulan los comandos. Pero cuando trabajes en proyectos reales, instalalo desde <code>git-scm.com</code>.')}
</div>
`,
  quiz: {
    passing: 5,
    desc: 'Responde las 5 preguntas. Necesitás todas correctas para completar la lección.',
    questions: [
      { q:'¿Qué es un commit en Git?', options:['Una foto completa del proyecto en un momento dado','Un archivo comprimido','Un mensaje de error','Una rama del proyecto'], correct:0 },
      { q:'¿Para qué sirve .gitignore en un proyecto Java?', options:['Inicializar Git','Ignorar archivos que no querés versionar (como *.class)','Crear un commit automático','Borrar el historial de Git'], correct:1 },
      { q:'¿Git es centralizado o distribuido?', options:['Centralizado (depende de un servidor)','Distribuido (cada copia es completa)','Ambos, según configuración','Ninguno, es peer-to-peer'], correct:1 },
      { q:'¿Qué guarda cada commit además de los archivos modificados?', options:['Solo el nombre del archivo','Solo la fecha del cambio','Quién, cuándo y un mensaje descriptivo','Nada más que los archivos'], correct:2 },
      { q:'¿Por qué usar Git aunque trabajes solo en un TP universitario?', options:['Para tener historial y poder volver atrás si rompés algo','Porque es obligatorio en todas las materias','Para que el profe vea tu código en tiempo real','No sirve si trabajás solo'], correct:0 }
    ]
  }
},
{
  id:31, level:'avanzado', levelLabel:'Avanzado', stars:'⭐⭐⭐⭐',
  title:'Git en tu Proyecto Java',
  desc:'Aprendé los comandos esenciales de Git aplicados a un proyecto Java real: init, add, commit, log y checkout.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔐</span><h4>Pensalo así...</h4>
<p><code>git init</code> = crear una <strong>bóveda vacía</strong> para tu proyecto. Como hacer <code>new</code> pero para carpetas enteras.</p>
<p><code>git add Main.java</code> = "esta clase está lista, guardala en la caja fuerte". Como preparar los documentos antes de archivarlos.</p>
<p><code>git commit -m "mensaje"</code> = cerrar la bóveda con un candado y una etiqueta que dice EXACTAMENTE qué cambió. Como documentar tu código con comentarios.</p>
</div>

<div class="analogy-card"><h4>⏪ Ctrl+Z infinito</h4>
<p><code>git checkout abc123 -- Calculadora.java</code> es como <strong>Ctrl+Z llevado al extremo</strong>. No solo deshacés el último cambio: podés volver a como estaba tu archivo hace 3 días, 2 semanas, o 50 commits atrás.</p>
</div>

<h3>🧪 Mini-Quiz: ¿entendiste los comandos?</h3>
<div class="analogy-card"><p><strong>1. ¿Qué hace git init?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Inicializa un NUEVO repositorio Git en la carpeta actual. Crea la carpeta oculta .git/ que contiene toda la base de datos de versiones. Solo se hace UNA vez por proyecto.</p></div>
<div class="analogy-card"><p><strong>2. ¿Diferencia entre git add y git commit?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ add = SELECCIONAR qué archivos guardar (preparar). commit = GUARDAR la foto con mensaje (ejecutar). Son dos pasos separados para que puedas elegir exactamente qué cambios incluís en cada commit.</p></div>
<div class="analogy-card"><p><strong>3. ¿Para qué sirve git log?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Muestra el HISTORIAL completo de commits: quién, cuándo, y el mensaje de cada uno. --oneline lo resume en una línea por commit. Es tu libro de actas del proyecto.</p></div>
<div class="analogy-card"><p><strong>4. ¿Qué hace git checkout HASH -- archivo.java?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Restaura UN archivo específico a como estaba en ese commit. Ideal cuando rompiste una clase y querés volver a la versión que funcionaba, sin perder los cambios en otros archivos.</p></div>
<div class="analogy-card"><p><strong>5. ¿Buen mensaje de commit o malo?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ BUENO: "Agrego validación de edad en setEdad() para evitar valores negativos". MALO: "cambios", "fix", "update". Un buen mensaje describe QUÉ cambió y POR QUÉ, no solo QUE cambió.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>Comandos esenciales — aplicados a un proyecto Java</h3>
${cb('Flujo completo sobre MiCalculadora', `# 1. Crear proyecto Java
mkdir MiCalculadora && cd MiCalculadora

# 2. Inicializar Git (solo una vez por proyecto)
git init

# 3. Crear .gitignore para Java
echo "*.class" > .gitignore
echo "bin/" >> .gitignore

# 4. Escribir Calculadora.java (suma y resta)
# ... editás el archivo en tu IDE ...

# 5. Ver qué cambió
git status

# 6. Preparar archivos para el commit
git add Calculadora.java .gitignore

# 7. Guardar snapshot con mensaje descriptivo
git commit -m "Calculadora: implemento suma y resta"

# 8. Agregar multiplicación
# ... editás Calculadora.java ...
git add Calculadora.java
git commit -m "Calculadora: agrego método multiplicar()"

# 9. Ver historial
git log --oneline
# def456 Calculadora: agrego método multiplicar()
# abc123 Calculadora: implemento suma y resta

# 10. ¡Rompiste todo! Volver a la versión anterior
git checkout abc123 -- Calculadora.java`)}
</div>

<div class="ts">
<h3>.gitignore para Java — plantilla estándar</h3>
${cb('.gitignore recomendado', `# Archivos compilados
*.class

# Directorios de salida
bin/
target/
build/

# Configuración de IDEs
.idea/
*.iml
.settings/
.project
.classpath

# Archivos de sistema
.DS_Store
Thumbs.db`)}
${ann('ok','✅','Este .gitignore cubre Eclipse (.settings/, .project, .classpath), IntelliJ (.idea/, *.iml), y VS Code. Así no versionás archivos de configuración personal que varían según la máquina.')}
</div>

<div class="ts">
<h3>Buenos vs malos mensajes de commit</h3>
<table class="sym-tbl">
<thead><tr><th>❌ Mal mensaje</th><th>✅ Buen mensaje</th><th>Por qué</th></tr></thead>
<tbody>
<tr><td>fix</td><td>Arreglo división por cero en calcularPromedio()</td><td>Describe QUÉ y DÓNDE</td></tr>
<tr><td>cambios</td><td>Agrego validación de edad en setEdad()</td><td>Específico, no genérico</td></tr>
<tr><td>update</td><td>Refactorizo GestorTareas para usar ArrayList en vez de array</td><td>Explica POR QUÉ</td></tr>
<tr><td>asd</td><td>Agrego constructor con parámetros a clase Producto</td><td>Profesional, no basura</td></tr>
</tbody>
</table>
${ann('java','📌','En la facultad y en el trabajo, tus commits son tu carta de presentación. Un historial limpio con buenos mensajes demuestra profesionalismo. Un historial lleno de "fix" y "asd" demuestra lo contrario.')}
</div>

<div class="ts">
<h3>Flujo diario resumido</h3>
${cb('Tu rutina con Git', `# Al empezar el día
git status                   # ¿qué cambié ayer?

# Después de cada cambio significativo
git add Archivo.java         # preparo lo que modifiqué
git commit -m "descripción"  # guardo con mensaje claro

# Al terminar el día
git log --oneline -5         # reviso los últimos 5 commits`)}
</div>
<div class="ts"><h3>Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>Escribiste "git comit" en vez de "commit"</code></td><td>git: comit is not a git command</td><td>Error de tipeo. Git es estricto con los nombres de comandos.</td></tr>
<tr><td><code>git add sin haber hecho git init</code></td><td>fatal: not a git repository</td><td>Necesitas inicializar el repositorio primero con git init.</td></tr>
<tr><td><code>git commit sin mensaje (-m)</code></td><td>Aborts the commit</td><td>Git necesita un mensaje. Usa -m "descripcion".</td></tr>
<tr><td><code>git log muestra muchas lineas</code></td><td>Dificil de leer</td><td>Usa git log --oneline para ver una linea por commit.</td></tr>
</tbody></table></div>
<div class="ts"><h3>Errores comunes</h3><table class="sym-tbl"><thead><tr><th>Escribiste</th><th>Error</th><th>Por que</th></tr></thead><tbody><tr><td><code>git push sin haber configurado remote</code></td><td>fatal: No configured push destination</td><td>Necesitas git remote add origin URL primero.</td></tr>
<tr><td><code>Archivos .class en el commit</code></td><td>Repositorio con basura</td><td>Creaste .gitignore ANTES del primer commit. Agrega *.class y bin/.</td></tr>
<tr><td><code>git checkout sin guardar cambios</code></td><td>Cambios no guardados se pierden</td><td>Hace commit de tus cambios actuales antes de hacer checkout.</td></tr>
<tr><td><code>Mensaje de commit "fix" o "update"</code></td><td>Historial inutil</td><td>Escribi mensajes descriptivos: que cambiaste y por que.</td></tr>
</tbody></table></div>
`,
  exercise: {
    desc: 'Simulá el flujo Git para tu proyecto Java: creaste Main.java con un método saludar(), luego agregaste despedir(), y necesitás recuperar SOLO la versión con saludar(). Escribí los comandos en orden.',
    expected: 'git init\ngit add Main.java\ngit commit -m "Agrego metodo saludar()"\ngit add Main.java\ngit commit -m "Agrego metodo despedir()"\ngit log --oneline\ngit checkout abc123 -- Main.java',
    starter: `// Simulá los comandos de Git para este escenario:
// 1. Creaste Main.java con método saludar()
// 2. Agregaste método despedir()
// 3. Necesitás recuperar la versión que solo tenía saludar()

// Escribí tus comandos Git aquí (uno por línea):

`,
    hints: [
      '⚠️ Los comandos Git se escriben como texto plano, SIN // adelante. Van solos en cada linea, no dentro de codigo Java ni como comentarios.',
      'Primero necesitás inicializar Git: <code>git init</code>',
      'Luego preparar y guardar el archivo: <code>git add Main.java</code> y <code>git commit -m "mensaje"</code>',
      'Después del segundo cambio, otro add + commit con mensaje diferente.',
      'Para recuperar: <code>git log --oneline</code> para ver los hashes, luego <code>git checkout &lt;hash&gt; -- Main.java</code>',
      `<strong>La solución:</strong><br>${cb('Flujo completo', `git init
git add Main.java
git commit -m "Agrego metodo saludar()"
git add Main.java
git commit -m "Agrego metodo despedir()"
git log --oneline
git checkout abc123 -- Main.java`)}`
    ]
  }
},
{
  id:32, level:'avanzado', levelLabel:'Avanzado', stars:'⭐⭐⭐⭐',
  title:'IDEs para Java + Git Integrado',
  desc:'Conocé los entornos de desarrollo más usados: Eclipse, IntelliJ IDEA y VS Code. Aprendé cómo integrar Git en cada uno.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🔧</span><h4>Pensalo así...</h4>
<p>Un <strong>IDE</strong> (Entorno de Desarrollo Integrado) es tu <strong>banco de trabajo completo</strong>: editor, compilador, debugger y Git integrados en una sola herramienta. Como un taller mecánico que tiene todas las herramientas juntas en vez de buscarlas por separado.</p>
</div>

<div class="analogy-card"><h4>🏭 Eclipse — el taller clásico</h4>
<p>Es el IDE que probablemente usa tu profe en clase. Gratuito, robusto, con décadas de historia. Tiene una <strong>perspectiva dedicada a Git</strong> donde ves el historial, los cambios, y podés commitear sin salir del entorno.</p>
</div>

<div class="analogy-card"><h4>🚀 IntelliJ IDEA — el taller premium</h4>
<p>El preferido por las empresas. Su autocompletado es el más inteligente del mercado: te sugiere código, detecta errores antes de compilar, y tiene Git integrado <strong>de fábrica</strong> (sin necesidad de plugins).</p>
</div>

<div class="analogy-card"><h4>🪶 VS Code — la navaja suiza</h4>
<p>Liviano, rápido, modular. No es un IDE Java "puro" pero con las extensiones correctas se convierte en uno. Ideal si trabajás con varios lenguajes (Java, Python, HTML, JavaScript). Git se integra con una extensión oficial.</p>
</div>

<h3>🧪 Mini-Quiz: ¿entendiste los IDEs?</h3>
<div class="analogy-card"><p><strong>1. ¿Cuál es el IDE más liviano en consumo de recursos?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ VS Code. Consume ~1 GB de RAM. Eclipse ~2 GB. IntelliJ ~4 GB. Si tenés una compu con poca memoria, VS Code es tu mejor opción.</p></div>
<div class="analogy-card"><p><strong>2. ¿Qué IDE tiene Git nativo sin necesidad de plugins?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ IntelliJ IDEA. Viene con Git integrado de fábrica. Eclipse necesita el plugin EGit (que suele venir preinstalado). VS Code necesita la extensión oficial de Git.</p></div>
<div class="analogy-card"><p><strong>3. ¿Cómo se hace un commit en Eclipse?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Clic derecho en el proyecto → Team → Commit. O desde la perspectiva Git: seleccionás los archivos, escribís el mensaje, y apretás Commit.</p></div>
<div class="analogy-card"><p><strong>4. ¿Qué atajo formatea el código automáticamente en Eclipse?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Ctrl+Shift+F. También útil: Ctrl+Space (autocompletar), Ctrl+Shift+O (organizar imports), Ctrl+/ (comentar/descomentar).</p></div>
<div class="analogy-card"><p><strong>5. ¿Podés usar Git desde la terminal aunque tengas un IDE?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ Sí. Todos los IDEs tienen una terminal integrada. Podés usar los comandos git directamente desde ahí. De hecho, muchos desarrolladores senior prefieren la terminal para Git porque es más rápido y preciso.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>Comparativa de IDEs para Java</h3>
<table class="sym-tbl">
<thead><tr><th>Característica</th><th>Eclipse</th><th>IntelliJ IDEA</th><th>VS Code</th></tr></thead>
<tbody>
<tr><td>Gratuito</td><td>✅</td><td>✅ (Community)</td><td>✅</td></tr>
<tr><td>Curva de aprendizaje</td><td>Media</td><td>Baja</td><td>Baja</td></tr>
<tr><td>Git integrado</td><td>✅ (plugin EGit)</td><td>✅ (nativo)</td><td>✅ (extensión)</td></tr>
<tr><td>Cómo commitear</td><td>Team → Commit</td><td>Ctrl+K → Commit</td><td>Source Control → Commit</td></tr>
<tr><td>Debugger Java</td><td>✅</td><td>✅✅ (superior)</td><td>✅ (con extensiones)</td></tr>
<tr><td>Autocompletado</td><td>✅</td><td>✅✅✅</td><td>✅</td></tr>
<tr><td>RAM recomendada</td><td>2 GB</td><td>4 GB</td><td>1 GB</td></tr>
<tr><td>Plugins / Extensiones</td><td>✅</td><td>✅</td><td>✅✅✅</td></tr>
</tbody>
</table>
</div>

<div class="ts">
<h3>Git en Eclipse — paso a paso</h3>
${cb('Flujo Git en Eclipse', `1. Window → Perspective → Open Perspective → Git
2. En la vista "Git Repositories", clic derecho → "Create Repository"
3. Seleccioná la carpeta de tu proyecto
4. Los archivos modificados aparecen en "Git Staging"
5. Arrastralos de "Unstaged" a "Staged Changes"
6. Escribí el mensaje de commit
7. Clic en "Commit" (o "Commit and Push")`)}
</div>

<div class="ts">
<h3>Git en IntelliJ IDEA — paso a paso</h3>
${cb('Flujo Git en IntelliJ', `1. VCS → Enable Version Control Integration → Git
2. Los archivos nuevos aparecen en ROJO (sin trackear)
3. Los modificados aparecen en AZUL
4. Ctrl+K abre la ventana de commit
5. Seleccionás los archivos, escribís el mensaje
6. Clic en "Commit"`)}
</div>

<div class="ts">
<h3>Atajos de teclado esenciales</h3>
<table class="sym-tbl">
<thead><tr><th>Acción</th><th>Eclipse</th><th>IntelliJ</th><th>VS Code</th></tr></thead>
<tbody>
<tr><td>Autocompletar</td><td>Ctrl+Space</td><td>Ctrl+Space</td><td>Ctrl+Space</td></tr>
<tr><td>Formatear código</td><td>Ctrl+Shift+F</td><td>Ctrl+Alt+L</td><td>Shift+Alt+F</td></tr>
<tr><td>Organizar imports</td><td>Ctrl+Shift+O</td><td>Ctrl+Alt+O</td><td>Shift+Alt+O</td></tr>
<tr><td>Comentar línea</td><td>Ctrl+/</td><td>Ctrl+/</td><td>Ctrl+/</td></tr>
<tr><td>Ejecutar</td><td>Ctrl+F11</td><td>Shift+F10</td><td>F5</td></tr>
</tbody>
</table>
${ann('tip','💡','No necesitás memorizar todos. Empezá con Ctrl+Space (autocompletar) y Ctrl+/ (comentar). Son los que más vas a usar.')}
</div>
`,
  quiz: {
    passing: 4,
    desc: 'Responde las 4 preguntas. Necesitás todas correctas para completar la lección.',
    questions: [
      { q:'¿Qué IDE tiene Git integrado nativamente sin necesidad de plugins?', options:['Eclipse','IntelliJ IDEA','VS Code','NetBeans'], correct:1 },
      { q:'En Eclipse, ¿cómo se hace un commit?', options:['Team → Commit','File → Save','Ctrl+S','Git → Push'], correct:0 },
      { q:'¿Cuál es el IDE más liviano en consumo de recursos?', options:['Eclipse','IntelliJ IDEA','VS Code','NetBeans'], correct:2 },
      { q:'¿Qué atajo formatea el código en Eclipse?', options:['Ctrl+Shift+F','Ctrl+S','Ctrl+Z','F5'], correct:0 }
    ]
  }
},
{
  id:33, level:'avanzado', levelLabel:'Avanzado', stars:'⭐⭐⭐⭐',
  title:'Proyecto Integrador: Java + Git',
  desc:'Simulá un día real de trabajo: escribís Java, versionás con Git, rompés algo, y lo recuperás. Integración completa de todo lo aprendido.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏁</span><h4>El puente al mundo real</h4>
<p>Este es el escenario que vas a vivir en tu primer trabajo o pasantía: escribís código Java, lo versionás con Git, cometés un error, y necesitás recuperar una versión anterior. <strong>Es exactamente lo que hacen los developers todos los días.</strong></p>
</div>

<div class="analogy-card"><h4>📋 El escenario</h4>
<p>Trabajás en <code>GestorNotas.java</code>, un sistema para calcular promedios de alumnos.</p>
<p><strong>Día 1:</strong> Creás el archivo con constructor y método <code>agregarNota()</code>. Funciona perfecto. Commit.</p>
<p><strong>Día 2:</strong> Agregás <code>calcularPromedio()</code> pero introducís un bug: división por cero cuando no hay notas.</p>
<p><strong>Día 3:</strong> El profe te pide la versión del día 1. Con Git, la recuperás en segundos.</p>
</div>

<h3>🧪 Mini-Quiz: ¿listo para el integrador?</h3>
<div class="analogy-card"><p><strong>1. ¿Cuál es el orden correcto de comandos?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ init → add → commit → (trabajar) → add → commit → log → checkout. Primero inicializás, después versionás cada cambio, y si algo sale mal, consultás el historial y recuperás.</p></div>
<div class="analogy-card"><p><strong>2. ¿Qué pasa si me olvido de git add antes de commit?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ El commit se crea VACÍO (no guarda nada). Git solo guarda en el commit los archivos que estaban en el staging area (los que hiciste add). Sin add = sin cambios en el commit.</p></div>
<div class="analogy-card"><p><strong>3. ¿git checkout borra los cambios actuales?</strong></p><p class="quiz-reveal" onclick="var n=this.nextElementSibling;n.style.display=n.style.display==='block'?'none':'block'" style="cursor:pointer;color:var(--blue);font-weight:600">👆 Ver respuesta</p><p style="display:none;color:var(--greentx);font-weight:600">✅ SÍ. Reemplaza el archivo actual por la versión del commit que elegiste. Por eso es importante commitear seguido: si no guardaste tus cambios actuales, los perdés al hacer checkout.</p></div>
`,
  tutorial: () => `
<div class="ts">
<h3>Escenario completo: Java + Git</h3>
${cb('Día a día con Git', `📁 GestorNotas/
├── .git/
├── .gitignore          (ignora *.class, bin/)
├── GestorNotas.java
└── Main.java

# ============ DÍA 1 ============
# Creás el proyecto y la clase principal
git init
git add GestorNotas.java Main.java .gitignore
git commit -m "GestorNotas: constructor y método agregarNota()"

# ============ DÍA 2 ============
# Agregás calcularPromedio() pero con bug
# ... editás GestorNotas.java ...
git add GestorNotas.java
git commit -m "GestorNotas: agrego calcularPromedio() - ATENCIÓN: tiene bug"

# ============ DÍA 3 ============
# El profe pide la versión del día 1
git log --oneline
# def456 GestorNotas: agrego calcularPromedio() - ATENCIÓN: tiene bug
# abc123 GestorNotas: constructor y método agregarNota()

# ¡Recuperar la versión buena!
git checkout abc123 -- GestorNotas.java
# Listo. GestorNotas.java vuelve a ser la versión del día 1.`)}
</div>

<div class="ts">
<h3>Consejos para tu día a día</h3>
<ul>
  <li><strong>Commiteá seguido:</strong> cada vez que terminás una funcionalidad chica, hacé commit. No esperes a tener 50 cambios para un solo commit.</li>
  <li><strong>Mensajes descriptivos:</strong> en 6 meses, no vas a recordar qué hacía "fix bug". Escribí como si se lo explicaras a tu yo del futuro.</li>
  <li><strong>git status antes de cada commit:</strong> revisá qué archivos cambiaron para no commitear basura (archivos de prueba, .class, etc.).</li>
  <li><strong>.gitignore primero:</strong> crealo ANTES del primer commit. Si ya commiteaste un .class, Git lo va a seguir rastreando aunque después lo agregues a .gitignore.</li>
</ul>
</div>
<div class="ts">
<h3>🌐 Publicar tu proyecto en GitHub</h3>
<p>Hasta ahora trabajaste en LOCAL (solo en tu computadora). Para compartir tu código con el profe o con tu equipo, necesitás publicarlo en un repositorio REMOTO como GitHub.</p>
${cb('Conectar tu repo local con GitHub', `# 1. Creá un repositorio vacío en github.com (NO marques "Add a README")
# 2. Copiá la URL que te da (ej: https://github.com/tuusuario/MiTP.git)

# 3. Conectá tu repo local con el remoto
git remote add origin https://github.com/tuusuario/MiTP.git

# 4. Subí tu código (la primera vez)
git push -u origin main

# 5. A partir de ahora, cada vez que quieras subir cambios:
git push`)}
<p><strong>Explicación:</strong> <code>git remote add</code> = "este es el servidor donde vive la copia compartida". <code>git push</code> = "mandale mis commits al servidor". <code>origin</code> es el nombre convencional del remoto principal. <code>main</code> es la rama principal (antes se llamaba <code>master</code>).</p>
${ann('tip','💡','Para el parcial: creá el repo en GitHub, hacé git push, y en el README.md poné el enlace. Así el profe puede clonar tu proyecto y ejecutarlo. GitHub también es tu portfolio profesional.')}
</div>
</div>
`,
  exercise: {
    desc: 'Simulá el flujo Git completo para GestorNotas.java: inicializá el repo, hacé 2 commits (día 1 y día 2), y recuperá la versión del día 1 con git checkout.',
    expected: 'git init\ngit add GestorNotas.java\ngit commit -m "GestorNotas: agrego constructor y metodo agregarNota()"\ngit add GestorNotas.java\ngit commit -m "GestorNotas: agrego calcularPromedio() - ATENCION: tiene bug"\ngit log --oneline\ngit checkout abc123 -- GestorNotas.java',
    starter: `// Simulá los comandos Git para el proyecto GestorNotas.java:
// Día 1: creás GestorNotas.java con agregarNota()
// Día 2: agregás calcularPromedio() (con bug)
// Día 3: recuperás la versión del día 1

// Escribí los comandos en orden:

`,
    hints: [
      '⚠️ Los comandos Git van como texto plano, SIN //. No los pongas dentro de una clase Java ni como comentarios.',
      'Inicializá Git: <code>git init</code>',
      'Día 1: <code>git add GestorNotas.java</code> + <code>git commit -m "mensaje descriptivo"</code>',
      'Día 2: otro <code>git add</code> + <code>git commit</code> con mensaje diferente',
      'Día 3: <code>git log --oneline</code> para ver los hashes, luego <code>git checkout &lt;hash&gt; -- GestorNotas.java</code>',
      `<strong>La solución:</strong><br>${cb('Flujo completo', `git init
git add GestorNotas.java
git commit -m "GestorNotas: agrego constructor y metodo agregarNota()"
git add GestorNotas.java
git commit -m "GestorNotas: agrego calcularPromedio() - ATENCION: tiene bug"
git log --oneline
git checkout abc123 -- GestorNotas.java`)}`
    ]
  }
},
{
  id:34, level:'examen', levelLabel:'Proyecto Final', stars:'🏆🏆🏆',
  title:'Proyecto Final: Java + POO + Git',
  desc:'El examen final del curso. Integrá Java, POO y Git en un proyecto completo de gestión de biblioteca.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">🏁</span><h4>¡El examen final!</h4>
<p>Integrá <strong>todo lo aprendido</strong> en las 33 lecciones: creá una aplicación de consola para gestionar una biblioteca personal, usando POO, colecciones, menú interactivo y control de versiones con Git.</p>
<p>Este es el examen más cercano a un parcial universitario real. ¡Demostrá todo lo que sabés!</p>
</div>
<div class="analogy-card"><h4>📋 Requisitos mínimos</h4>
<p><strong>1.</strong> Clase <code>Libro</code> con atributos privados (título, autor, año, género), constructor y getters.<br>
<strong>2.</strong> Clase <code>Biblioteca</code> con <code>ArrayList&lt;Libro&gt;</code> y métodos agregar/listar/buscar/eliminar.<br>
<strong>3.</strong> Menú interactivo con <code>while</code> + <code>switch</code> + <code>try-catch</code>.<br>
<strong>4.</strong> Versionar con Git: <code>init</code>, <code>add</code>, <code>commit</code>.</p>
</div>`,
  tutorial: () => `
<div class="ts">
<h3>Consejos</h3>
<ul>
  <li>Empezá por la clase <code>Libro</code> (la más simple).</li>
  <li>Después creá <code>Biblioteca</code> con el <code>ArrayList</code>.</li>
  <li>Por último, armá el menú en <code>Main</code>.</li>
  <li>Probá cada parte antes de pasar a la siguiente.</li>
  <li>Commiteá después de cada funcionalidad terminada usando <code>git add</code> y <code>git commit</code>.</li>
</ul>
</div>`,
  exercise: {
    desc: 'Creá un proyecto de gestión de biblioteca con POO, ArrayList, menú while+switch+try-catch y Git.',
    expected: '',
    starter: `// Proyecto Final: Biblioteca Personal
// 1. Clase Libro (atributos private, constructor, getters)
// 2. Clase Biblioteca (ArrayList<Libro>, métodos CRUD)
// 3. Main (menú while+switch+try-catch)
// 4. Versionar con Git (init, add, commit)

public class Main {
    public static void main(String[] args) {
        // Tu menú interactivo aquí
        
    }
}`,
    hints: [
      'Clase Libro: <code>private String titulo, autor, genero; private int anio;</code> + constructor + getters',
      'Clase Biblioteca: <code>private ArrayList<Libro> libros = new ArrayList<>();</code> + métodos CRUD',
      'Menu: usa <code>while(opcion != 5)</code> para mantener el ciclo, imprimi las opciones con <code>println</code>, lee la opcion con <code>Scanner.nextInt()</code> dentro de un <code>try-catch</code>, y usa <code>switch(opcion)</code> con cases para cada funcionalidad.',
      'Git: Despues de cerrar la clase Main con }, escribi en lineas separadas (SIN //): git init, git add ., git commit -m "Proyecto Final Biblioteca". IMPORTANTE: No uses // para los comandos Git. Van como texto plano, no como comentarios.',
      'No hay output esperado fijo. Mientras tengas las clases, el menú y los comandos Git, ¡está aprobado!'
    ]
  }
},
{
  id:35, level:'entrevista', levelLabel:'Entrevista junior', stars:'💼',
  title:'Preguntas de entrevista',
  desc:'Diez preguntas de opción múltiple como las que hacen en una entrevista laboral para un puesto junior de Java.',
  simple: () => `
<div class="analogy-card"><span class="emoji-big">💼</span><h4>Un paso más: la entrevista</h4>
<p>En un laburo junior no te piden que recites el manual. Te preguntan si entendés lo que escribís: cómo se compara un texto, qué hace <code>main</code>, qué colección usar, y qué pasa si dividís enteros.</p>
<p>Este paso es un cuestionario. Hay <strong>una sola respuesta correcta</strong> por pregunta. Si te equivocás, el resultado te muestra cuál era y podés reintentar.</p>
</div>
<div class="analogy-card"><h4>Cómo se responde en una entrevista</h4>
<p>No adivines en silencio. Decí la respuesta y el porqué en una frase. Por ejemplo: «Uso <code>equals</code>, porque <code>==</code> compara si son el mismo objeto, no si el texto es igual».</p>
</div>
`,
  tutorial: () => `
<div class="ts">
<h3>Lo que suelen preguntar</h3>
<ul>
<li><strong>String:</strong> es una clase, inmutable. Para comparar el texto se usa <code>equals</code>, no <code>==</code>.</li>
<li><strong>main:</strong> la firma que busca la JVM es <code>public static void main(String[] args)</code>.</li>
<li><strong>ArrayList:</strong> crece con <code>add</code> y permite repetidos. Un array tiene tamaño fijo.</li>
<li><strong>Overload:</strong> mismo nombre, distintos parámetros, en la misma clase. Override es redefinir un método de la clase padre.</li>
<li><strong>Excepciones:</strong> <code>IOException</code> es checked: hay que atraparla o declararla. <code>NullPointerException</code> es unchecked.</li>
<li><strong>private:</strong> el atributo solo se usa dentro de su clase. Afuera se entra por getters y setters.</li>
<li><strong>División entera:</strong> <code>5 / 2</code> da <code>2</code>, no <code>2.5</code>.</li>
<li><strong>Constructor:</strong> se llama con <code>new</code> para dejar el objeto listo.</li>
</ul>
</div>
${ann('tip','💡','Si no sabés una, descartá primero la que es claramente falsa. En la entrevista también vale decir «no estoy seguro, pero creo que…» y explicar el razonamiento.')}
`,
  quiz: {
    passing: 7,
    questions: [
      { question: '¿Qué imprime System.out.println("Hola" == new String("Hola"));?', options: ['true', 'false', 'null', 'No compila'], correct: 1 },
      { question: '¿Cómo se compara el texto de dos String?', options: ['Con ==', 'Con equals', 'Con compare', 'Con is'], correct: 1 },
      { question: '¿Cuál es la firma correcta del punto de entrada?', options: ['public void main(String args)', 'public static void main(String[] args)', 'static main()', 'public static int main()'], correct: 1 },
      { question: '¿Qué es String en Java?', options: ['Un tipo primitivo', 'Una clase inmutable', 'Un array de int', 'Un método de System'], correct: 1 },
      { question: '¿Qué estructura permite repetidos y crece con add?', options: ['Un array de tamaño fijo', 'HashSet', 'ArrayList', 'Un método void'], correct: 2 },
      { question: '¿Qué es la sobrecarga (overload)?', options: ['El mismo nombre con distintos parámetros, en la misma clase', 'Redefinir un método del padre', 'Borrar un método', 'Heredar de dos clases a la vez'], correct: 0 },
      { question: '¿Cuál de estas excepciones es checked y obliga a try-catch o throws?', options: ['NullPointerException', 'ArithmeticException', 'IOException', 'ArrayIndexOutOfBoundsException'], correct: 2 },
      { question: '¿Quién puede leer un atributo private?', options: ['Cualquier clase', 'Solo las clases hijas', 'Solo la misma clase', 'Solo el método main'], correct: 2 },
      { question: '¿Qué imprime int x = 5; System.out.println(x / 2);?', options: ['2.5', '2', '3', 'Un error de compilación'], correct: 1 },
      { question: '¿Para qué sirve el constructor?', options: ['Para destruir el objeto', 'Para inicializar el objeto cuando se hace new', 'Para importar paquetes', 'Para comparar dos String'], correct: 1 }
    ]
  }
}
];