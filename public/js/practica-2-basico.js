// Java INPRO — Actividades del tramo Básico (lecciones 7 a 15)
// tests/run.js compila cada programa y compara cada respuesta contra Java real.
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

PRACTICA[7] = {
  prev: 'operadores y <code>boolean</code>.',
  objetivos: ['Escribir decisiones con <code>if</code>, <code>else if</code> y <code>else</code>.', 'Comparar con <code>== != &lt; &gt; &lt;= &gt;=</code>.', 'Ordenar las condiciones para que cada caso caiga donde debe.'],
  escalera: {
    vida: 'Si llueve llevo paraguas; si no, salgo con anteojos de sol. Tomás decisiones así todo el día.',
    modelo: 'Una condición es una pregunta que da verdadero o falso, y según eso se elige un camino.',
    pseudo: 'SI nota >= 6 → aprobado. SI NO → desaprobado.',
    java: '<code>if (nota &gt;= 6) { ... } else { ... }</code>',
    real: 'El cajero decide: si el saldo alcanza, entrega la plata; si no, muestra “Saldo insuficiente”.'
  },
  items: [
    { t: 'mc', q: 'El semáforo está en amarillo. ¿Qué estructura representa “si está en verde cruzo, si está en amarillo freno, si no espero”?', o: ['<code>if / else if / else</code>', 'Un solo <code>if</code>', 'Un <code>for</code>', 'Dos <code>println</code>'], a: 0, why: 'Son tres caminos excluyentes: Java toma el primero que se cumple e ignora el resto.' },
    { t: 'tf', q: 'En una cadena <code>if / else if</code> pueden ejecutarse dos bloques a la vez.', a: false, why: 'Apenas una condición se cumple, se ejecuta ese bloque y Java salta todo lo demás.' },
    { t: 'output', q: '¿Qué imprime?', code: 'int edad = 16;\nif (edad >= 18) {\n    System.out.println("Mayor");\n} else if (edad >= 16) {\n    System.out.println("Puede votar");\n} else {\n    System.out.println("Menor");\n}\nSystem.out.println("Fin");', a: 'Puede votar\nFin', why: 'Se saltea el primero, entra en el segundo y lo que está después del <code>if</code> se ejecuta siempre.' },
    { t: 'output', q: 'Sin <code>else</code> se evalúan todos. ¿Qué imprime?', code: 'int n = 15;\nif (n > 5) {\n    System.out.println("mayor a 5");\n}\nif (n > 10) {\n    System.out.println("mayor a 10");\n}\nif (n > 20) {\n    System.out.println("mayor a 20");\n}', a: 'mayor a 5\nmayor a 10', why: 'Son tres <code>if</code> independientes: cada uno se evalúa por separado.' },
    { t: 'fill', q: 'Completá la decisión del cajero.', code: 'int saldo = 500;\nint pedido = 800;\n___ (saldo >= pedido) {\n    System.out.println("Entregando");\n} ___ {\n    System.out.println("Saldo insuficiente");\n}', a: [['if'], ['else']], out: 'Saldo insuficiente', why: 'Solo hay dos caminos: alcanza o no alcanza.' },
    { t: 'bug', q: 'Para comparar se usa <code>==</code>. ¿Qué línea no compila?', code: 'int opcion = 2;\nif (opcion = 2) {\n    System.out.println("Elegiste dos");\n}', line: 2, fix: 'if (opcion == 2) {', why: '<code>=</code> asigna y <code>==</code> compara. Un <code>if</code> necesita algo que dé <code>true</code> o <code>false</code>.' },
    { t: 'bug', q: 'Con un 6 se aprueba, pero este programa dice “Desaprobado”. ¿Qué línea corregís?', code: 'int nota = 6;\nif (nota > 6) {\n    System.out.println("Aprobado");\n} else {\n    System.out.println("Desaprobado");\n}', line: 2, fix: 'if (nota >= 6) {', why: 'Es un error de borde: <code>&gt;</code> deja afuera el 6. Probá siempre el valor exacto del límite.' },
    { t: 'order', q: 'Ordená para clasificar la temperatura.', lines: ['int t = 12;', 'if (t > 25) {', '    System.out.println("Calor");', '} else if (t > 15) {', '    System.out.println("Templado");', '} else {', '    System.out.println("Frío");', '}'], java: true, out: 'Frío', why: 'La variable primero, después la condición más alta y al final el caso restante.' },
    { t: 'short', q: '¿Por qué conviene poner las condiciones de mayor a menor en una cadena de notas?', any: [['primero', 'primera', 'antes', 'entra', 'corta', 'salta', 'cumple']], model: 'Porque Java se queda con la primera condición que se cumple; si la general va antes, las más exigentes nunca se evalúan.', why: 'Este error compila sin problemas: es de lógica, y solo se detecta probando casos.' },
    { t: 'code', title: 'Precio de la entrada', task: 'Según la edad: menores de 12 pagan 500; de 12 a 64 pagan 1000; desde 65 pagan 700. Probá tu programa cambiando la edad.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int edad = 70;\n        int precio;\n        // Calculá el precio según la edad\n        \n        System.out.println("Edad: " + edad);\n        System.out.println("Precio: " + precio);\n    }\n}', expected: 'Edad: 70\nPrecio: 700', need: [['\\bif\\b', 'Usá if para decidir el precio.'], ['\\belse\\b', 'Cubrí los demás casos con else.']], hint: 'Asigná <code>precio</code> dentro de cada rama: <code>if (edad &lt; 12) { precio = 500; }</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int edad = 70;\n        int precio;\n        if (edad < 12) {\n            precio = 500;\n        } else if (edad < 65) {\n            precio = 1000;\n        } else {\n            precio = 700;\n        }\n        System.out.println("Edad: " + edad);\n        System.out.println("Precio: " + precio);\n    }\n}', why: 'Con tres rangos, tres ramas. Probalo también con 5 y 30.' }
  ]
};

PRACTICA[8] = {
  prev: '<code>if / else</code>.',
  objetivos: ['Elegir entre varios valores exactos con <code>switch</code>.', 'Entender el efecto de <code>break</code> y el “efecto cascada”.', 'Usar <code>default</code> para lo inesperado.'],
  escalera: {
    vida: 'En el ascensor apretás un número y vas directo a ese piso, sin preguntar piso por piso.',
    modelo: '<code>switch</code> compara un valor contra una lista de casos exactos.',
    pseudo: 'SEGÚN opción: 1 → saldo; 2 → transferir; 3 → salir; otro → inválida.',
    java: '<code>switch (opcion) { case 1: ...; break; default: ...; }</code>',
    real: 'Los menús telefónicos (“marque 1 para ventas”) y los menús de consola del parcial se programan con <code>switch</code>.'
  },
  items: [
    { t: 'mc', q: 'En un ascensor elegís un piso exacto. ¿Cuándo <code>switch</code> es mejor que varios <code>if</code>?', o: ['Cuando comparás un valor contra opciones exactas', 'Cuando comparás rangos como <code>edad &gt; 18</code>', 'Cuando querés repetir algo', 'Nunca'], a: 0, why: '<code>switch</code> trabaja con valores exactos. Para rangos sigue siendo mejor <code>if</code>.' },
    { t: 'tf', q: 'Si te olvidás el <code>break</code>, Java sigue ejecutando el <code>case</code> siguiente.', a: true, why: 'Se llama efecto cascada: sin <code>break</code> la ejecución sigue de largo.' },
    { t: 'output', q: 'Falta un <code>break</code>. ¿Qué imprime?', code: 'int dia = 1;\nswitch (dia) {\n    case 1:\n        System.out.println("Lunes");\n    case 2:\n        System.out.println("Martes");\n        break;\n    case 3:\n        System.out.println("Miércoles");\n}', a: 'Lunes\nMartes', why: 'Entra en <code>case 1</code>, no encuentra <code>break</code> y sigue hasta el del <code>case 2</code>.' },
    { t: 'output', q: 'Varios casos pueden compartir código. ¿Qué imprime?', code: 'char nota = \'B\';\nswitch (nota) {\n    case \'A\':\n    case \'B\':\n        System.out.println("Aprobado");\n        break;\n    default:\n        System.out.println("Recupera");\n}', a: 'Aprobado', why: 'Los <code>case</code> vacíos caen en el siguiente. Es una forma útil de agrupar.' },
    { t: 'fill', q: 'Completá el menú.', code: 'int opcion = 9;\n___ (opcion) {\n    ___ 1:\n        System.out.println("Saldo");\n        ___;\n    ___:\n        System.out.println("Opción inválida");\n}', a: [['switch'], ['case'], ['break'], ['default']], out: 'Opción inválida', why: 'Son las cuatro palabras de cualquier <code>switch</code> clásico.' },
    { t: 'bug', q: '<code>switch</code> no acepta <code>double</code>. ¿Qué línea corregís?', code: 'double opcion = 1.0;\nswitch (opcion) {\n    case 1:\n        System.out.println("Uno");\n}', line: 1, fix: 'int opcion = 1;', why: 'Funciona con <code>int</code>, <code>char</code> y <code>String</code>, entre otros, pero no con <code>double</code> ni <code>boolean</code>.' },
    { t: 'bug', q: 'Debería imprimir solo “Té”. ¿Qué línea hay que agregar o cambiar?', code: 'int bebida = 2;\nswitch (bebida) {\n    case 1: System.out.println("Café"); break;\n    case 2: System.out.println("Té");\n    case 3: System.out.println("Mate"); break;\n}', line: 4, fix: '    case 2: System.out.println("Té"); break;', why: 'Sin <code>break</code> también se imprime “Mate”.' },
    { t: 'match', q: 'Uní cada palabra con su función.', pairs: [['case', 'Un valor posible'], ['break', 'Sale del switch'], ['default', 'Se ejecuta si no coincide ninguno'], ['switch', 'Indica qué valor se evalúa']], why: 'Con estas cuatro piezas se arma cualquier menú.' },
    { t: 'short', q: '¿Para qué sirve <code>default</code>?', any: [['ningun', 'ninguno', 'otro', 'no coincide', 'resto', 'invalid', 'inesperad', 'demas']], model: 'Para el caso en que el valor no coincide con ningún case, por ejemplo una opción inválida.', why: 'Un buen programa siempre contempla lo que el usuario no debería escribir, pero escribe.' },
    { t: 'code', title: 'Cuántos días tiene el mes', task: 'Dado <code>mes</code> (1 a 12), imprimí sus días. Agrupá los <code>case</code> que comparten resultado. Febrero son 28.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int mes = 4;\n        // Usá switch agrupando los meses\n        \n    }\n}', expected: 'El mes 4 tiene 30 días', need: [['\\bswitch\\b', 'Usá switch.'], ['\\bcase\\b', 'Agrupá con case.'], ['\\bdefault\\b', 'Agregá un default para un mes inválido.']], hint: 'Podés escribir <code>case 4: case 6: case 9: case 11:</code> y resolver todos juntos.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int mes = 4;\n        int dias;\n        switch (mes) {\n            case 2:\n                dias = 28;\n                break;\n            case 4: case 6: case 9: case 11:\n                dias = 30;\n                break;\n            default:\n                dias = 31;\n        }\n        System.out.println("El mes " + mes + " tiene " + dias + " días");\n    }\n}', why: 'El efecto cascada, bien usado, evita repetir código.' }
  ]
};

PRACTICA[9] = {
  prev: '<code>if</code> y comparaciones.',
  objetivos: ['Combinar condiciones con <code>&amp;&amp;</code>, <code>||</code> y <code>!</code>.', 'Predecir el resultado con tablas de verdad.', 'Reconocer cuándo Java no evalúa la segunda condición.'],
  escalera: {
    vida: 'Para entrar a un boliche pedís DNI Y tener más de 18. Para pagar aceptan efectivo O tarjeta.',
    modelo: '<code>Y</code> exige que todo se cumpla; <code>O</code> se conforma con una; <code>NO</code> invierte el resultado.',
    pseudo: 'SI edad >= 18 Y tiene entrada → pasa.',
    java: '<code>if (edad &gt;= 18 &amp;&amp; tieneEntrada) { ... }</code>',
    real: 'Un login exige usuario correcto Y clave correcta. Un descuento aplica si sos jubilado O estudiante.'
  },
  items: [
    { t: 'mc', q: 'Para sacar plata necesitás tarjeta Y clave correcta. Tenés la tarjeta, pero te equivocás la clave.', o: ['No podés sacar plata: <code>true &amp;&amp; false</code> da <code>false</code>', 'Podés sacar: una de dos alcanza', 'Depende del banco', 'Java da error'], a: 0, why: 'Con <code>&amp;&amp;</code> todas las condiciones deben ser verdaderas.' },
    { t: 'match', q: 'Uní cada expresión con su resultado.', pairs: [['true && false', 'false'], ['true || false', 'true'], ['!false', 'true (por negación)'], ['false || false', 'false (ninguna se cumple)']], why: 'Si dudás, reemplazá cada parte por su valor y resolvé de a una.' },
    { t: 'output', q: '¿Qué imprime?', code: 'int edad = 20;\nboolean socio = false;\nSystem.out.println(edad >= 18 && socio);\nSystem.out.println(edad >= 18 || socio);\nSystem.out.println(!socio);', a: 'false\ntrue\ntrue', why: 'Reemplazá: <code>true &amp;&amp; false</code>, <code>true || false</code> y <code>!false</code>.' },
    { t: 'tf', q: 'En <code>a &amp;&amp; b</code>, si <code>a</code> es <code>false</code>, Java ni siquiera evalúa <code>b</code>.', a: true, why: 'Se llama cortocircuito: el resultado ya no puede cambiar. Por eso <code>x != 0 &amp;&amp; 10 / x &gt; 1</code> no divide por cero.' },
    { t: 'output', q: 'El cortocircuito evita un error. ¿Qué imprime?', code: 'int x = 0;\nif (x != 0 && 10 / x > 1) {\n    System.out.println("grande");\n} else {\n    System.out.println("seguro");\n}', a: 'seguro', why: 'Como <code>x != 0</code> es falso, no se ejecuta la división.' },
    { t: 'fill', q: 'Entra gratis quien tenga menos de 6 años o más de 80, y no sea un evento privado.', code: 'int edad = 5;\nboolean privado = false;\nif ((edad < 6 ___ edad > 80) ___ ___privado) {\n    System.out.println("Gratis");\n}', a: [['||'], ['&&'], ['!']], out: 'Gratis', why: 'Los paréntesis agrupan la edad; luego se exige que no sea privado.' },
    { t: 'bug', q: 'Quieren el rango 18 a 65, pero Java no lo acepta así. ¿Qué línea corregís?', code: 'int edad = 30;\nif (18 <= edad <= 65) {\n    System.out.println("En edad laboral");\n}', line: 2, fix: 'if (edad >= 18 && edad <= 65) {', why: 'En Java no se encadenan comparaciones: cada una debe ir completa y unida con <code>&amp;&amp;</code>.' },
    { t: 'bug', q: 'Debería aprobar solo con nota de 6 o más Y asistencia. ¿Qué línea tiene el operador equivocado?', code: 'int nota = 3;\nboolean asistio = true;\nif (nota >= 6 || asistio) {\n    System.out.println("Aprobado");\n}', line: 3, fix: 'if (nota >= 6 && asistio) {', why: 'Con <code>||</code> alcanza con una condición, y aprobaría con un 3.' },
    { t: 'short', q: 'Explicá la diferencia entre <code>&amp;&amp;</code> y <code>||</code> con un ejemplo de la vida diaria.', any: [['ambas', 'las dos', 'todas', 'y '], ['una', 'alguna', 'cualquiera', 'o ']], model: '&& exige que se cumplan todas las condiciones (DNI y mayoría de edad); || exige que se cumpla una (efectivo o tarjeta).', why: 'Si podés explicarlo con un ejemplo propio, lo entendiste.' },
    { t: 'code', title: '¿Te aprueban el préstamo?', task: 'El préstamo sale si cobrás al menos 300000 y no tenés deudas, o si tenés garante. Guardá la decisión en un <code>boolean</code>.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int sueldo = 250000;\n        boolean tieneDeudas = false;\n        boolean tieneGarante = true;\n        // Calculá si se aprueba\n        \n    }\n}', expected: 'Aprobado: true', need: [['&&', 'Usá && para exigir las dos condiciones.'], ['\\|\\|', 'Usá || para la alternativa del garante.'], ['!', 'Usá ! para negar tieneDeudas.']], hint: '<code>boolean ok = (sueldo &gt;= 300000 &amp;&amp; !tieneDeudas) || tieneGarante;</code>', solution: 'public class Main {\n    public static void main(String[] args) {\n        int sueldo = 250000;\n        boolean tieneDeudas = false;\n        boolean tieneGarante = true;\n        boolean aprobado = (sueldo >= 300000 && !tieneDeudas) || tieneGarante;\n        System.out.println("Aprobado: " + aprobado);\n    }\n}', why: 'Las reglas de negocio reales son combinaciones lógicas como esta.' }
  ]
};

PRACTICA[10] = {
  prev: 'variables y conversión de texto a número.',
  objetivos: ['Leer datos del teclado con <code>Scanner</code>.', 'Elegir entre <code>nextInt</code>, <code>nextDouble</code>, <code>next</code> y <code>nextLine</code>.', 'Evitar el error clásico de <code>nextLine</code> después de <code>nextInt</code>.'],
  escalera: {
    vida: 'En una ventanilla, el empleado te pregunta el DNI, vos lo decís y él lo anota. Sin esa charla no sabría quién sos.',
    modelo: 'Un programa se vuelve interactivo cuando lee datos en vez de tenerlos escritos en el código.',
    pseudo: 'Preguntar el nombre → leerlo → guardarlo → saludar.',
    java: '<code>Scanner sc = new Scanner(System.in);</code> y <code>String n = sc.nextLine();</code>',
    real: 'Cada campo de un formulario es una entrada de datos. En consola, <code>Scanner</code> cumple ese papel.'
  },
  items: [
    { t: 'mc', q: 'Si <code>println</code> es lo que el programa dice, ¿qué es <code>Scanner</code>?', o: ['Lo que el programa escucha', 'Lo que el programa recuerda', 'Lo que el programa calcula', 'Un tipo de variable'], a: 0, why: 'La salida la da <code>System.out</code>; la entrada se lee de <code>System.in</code> con <code>Scanner</code>.' },
    { t: 'match', q: 'Uní cada dato con el método que lo lee.', pairs: [['Una edad', 'nextInt()'], ['Un precio', 'nextDouble()'], ['Una sola palabra', 'next()'], ['Una línea entera', 'nextLine()']], why: 'Cada método interpreta lo que se escribió en un tipo distinto.' },
    { t: 'tf', q: 'Para usar <code>Scanner</code> hace falta <code>import java.util.Scanner;</code>.', a: true, why: 'Scanner no está en <code>java.lang</code>, así que hay que importarlo al principio del archivo.' },
    { t: 'output', q: 'El usuario escribe <code>Ana</code>, Enter, <code>30</code>, Enter. ¿Qué imprime?', code: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String nombre = sc.nextLine();\n        int edad = sc.nextInt();\n        System.out.println(nombre + " cumple " + (edad + 1));\n    }\n}', stdin: ['Ana', '30'], a: 'Ana cumple 31', why: '<code>nextInt</code> devuelve un número, por eso se puede sumar.' },
    { t: 'bug', q: 'Falta algo para que compile. ¿Qué línea hay que corregir?', code: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner();\n        System.out.println(sc.nextLine());\n    }\n}', line: 5, fix: '        Scanner sc = new Scanner(System.in);', stdin: ['hola'], why: 'Hay que decirle de dónde leer: <code>System.in</code> es el teclado.' },
    { t: 'bug', q: 'Con la entrada 25 y Ana, el nombre queda vacío. ¿Qué línea agregarías antes de leerlo?', code: 'Scanner sc = new Scanner(System.in);\nint edad = sc.nextInt();\nString nombre = sc.nextLine();\nSystem.out.println(nombre + " " + edad);', line: 3, fix: 'sc.nextLine(); String nombre = sc.nextLine();', noRun: true, why: '<code>nextInt</code> deja el Enter sin leer, y <code>nextLine</code> lo toma como línea vacía. Se resuelve con un <code>sc.nextLine();</code> extra.' },
    { t: 'fill', q: 'Completá para leer un precio y mostrar el doble.', code: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new ___(System.in);\n        double precio = sc.___();\n        System.out.println(precio * 2);\n        sc.close();\n    }\n}', a: [['Scanner'], ['nextDouble']], stdin: ['1.5'], out: '3.0', why: 'Se crea el lector y se pide el tipo de dato que se espera.' },
    { t: 'short', q: '¿Por qué un programa que lee datos es más útil que uno con los valores fijos?', any: [['distinto', 'diferente', 'cualquier', 'cambiar', 'usuario', 'reutiliz', 'sin modificar', 'cada vez']], model: 'Porque funciona con los datos de cada usuario sin tener que modificar el código.', why: 'Separar los datos del programa es una de las ideas centrales de la programación.' },
    { t: 'code', title: 'La propina', task: 'Leé con Scanner el monto y el porcentaje de propina, y mostrá el total. El emulador escribe los datos por vos.', starter: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Leé monto y porcentaje\n        \n    }\n}', stdin: ['2000', '10'], expected: 'Propina: 200.0\nTotal: 2200.0', need: [['Scanner', 'Usá Scanner.'], ['nextDouble|nextInt', 'Leé los números con nextDouble o nextInt.']], hint: 'Propina: <code>monto * porcentaje / 100.0</code>.', solution: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double monto = sc.nextDouble();\n        double porcentaje = sc.nextDouble();\n        double propina = monto * porcentaje / 100.0;\n        System.out.println("Propina: " + propina);\n        System.out.println("Total: " + (monto + propina));\n    }\n}', why: 'Si le cambiás la entrada, el mismo programa sirve para cualquier cuenta.' }
  ]
};

PRACTICA[11] = {
  prev: 'condiciones y <code>++</code>.',
  objetivos: ['Repetir mientras se cumpla una condición con <code>while</code>.', 'Reconocer y evitar un bucle infinito.', 'Usar contadores y acumuladores, y <code>do-while</code>.'],
  escalera: {
    vida: 'Mientras tengas hambre, seguís comiendo. No sabés de antemano cuántos bocados vas a dar.',
    modelo: '<code>while</code> repite mientras la condición sea verdadera. Algo adentro debe acercarla a ser falsa.',
    pseudo: 'MIENTRAS clave incorrecta → pedir la clave otra vez.',
    java: '<code>while (i &lt;= 5) { ...; i++; }</code>',
    real: 'Un servidor repite “mientras esté encendido, atender pedidos”. Un menú repite hasta que el usuario elige salir.'
  },
  items: [
    { t: 'mc', q: '“Mientras la pava no hierva, seguí esperando”. ¿Por qué es un <code>while</code> y no algo fijo?', o: ['Porque no sabés cuántas veces vas a repetir', 'Porque siempre son 5 veces', 'Porque no hay condición', 'Porque es un método'], a: 0, why: '<code>while</code> sirve cuando la cantidad de vueltas depende de una condición.' },
    { t: 'output', q: 'Seguí el bucle a mano. ¿Qué imprime?', code: 'int i = 3;\nwhile (i > 0) {\n    System.out.print(i + " ");\n    i--;\n}\nSystem.out.println("¡Ya!");', a: '3 2 1 ¡Ya!', why: 'Cada vuelta imprime y resta 1. Cuando <code>i</code> llega a 0, la condición es falsa.' },
    { t: 'tf', q: 'Un <code>while</code> con la condición falsa desde el principio no ejecuta su cuerpo ni una vez.', a: true, why: 'La condición se evalúa antes de cada vuelta, incluida la primera.' },
    { t: 'output', q: '<code>do-while</code> primero actúa y después pregunta. ¿Qué imprime?', code: 'int n = 10;\ndo {\n    System.out.println("Vuelta " + n);\n    n++;\n} while (n < 5);', a: 'Vuelta 10', why: 'El cuerpo se ejecuta al menos una vez. Recién después se evalúa la condición, que es falsa.' },
    { t: 'output', q: 'Contador y acumulador. ¿Qué imprime?', code: 'int i = 1;\nint suma = 0;\nwhile (i <= 4) {\n    suma += i;\n    i++;\n}\nSystem.out.println(suma);', a: '10', why: 'Va acumulando 1 + 2 + 3 + 4.' },
    { t: 'bug', q: 'Este programa nunca termina. ¿Qué línea corregís?', code: 'int i = 1;\nwhile (i <= 3) {\n    System.out.println(i);\n    i--;\n}', line: 4, fix: '    i++;', noRun: true, why: 'Con <code>i--</code> se aleja del límite: la condición nunca llega a ser falsa.' },
    { t: 'bug', q: 'Debería imprimir 1, 2 y 3, pero falta el 3. ¿Qué línea corregís?', code: 'int i = 1;\nwhile (i < 3) {\n    System.out.println(i);\n    i++;\n}', line: 2, fix: 'while (i <= 3) {', why: 'Es un error por uno: <code>&lt;</code> deja afuera el 3. Probá siempre el primer y el último caso.' },
    { t: 'fill', q: 'Duplicá el ahorro hasta llegar a 1000.', code: 'int ahorro = 100;\nint meses = 0;\n___ (ahorro < 1000) {\n    ahorro ___ 2;\n    meses___;\n}\nSystem.out.println(meses);', a: [['while'], ['*=']  , ['++']], out: '4', why: '100, 200, 400, 800, 1600: se necesitan 4 meses.' },
    { t: 'order', q: 'Ordená: un contador regresivo de 2 a 1 y luego “Fin”.', lines: ['int n = 2;', 'while (n > 0) {', '    System.out.println(n);', '    n--;', '}', 'System.out.println("Fin");'], java: true, out: '2\n1\nFin', why: 'Se declara, se evalúa, se ejecuta, se actualiza. Lo que va después del bucle se ejecuta una sola vez.' },
    { t: 'short', q: '¿Qué tiene que pasar dentro de un <code>while</code> para que no sea infinito?', any: [['cambi', 'actualiz', 'increment', 'modific', 'decrement', 'falsa', 'false']], model: 'La variable de la condición tiene que cambiar para que la condición llegue a ser falsa.', why: 'Es el error más común de los bucles.' },
    { t: 'code', title: 'Pagar en cuotas', task: 'Debés 1000 y pagás 300 por mes. Con un <code>while</code>, mostrá lo que queda después de cada pago, hasta que no quede deuda.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int deuda = 1000;\n        int mes = 0;\n        // Usá while\n        \n    }\n}', expected: 'Mes 1: quedan 700\nMes 2: quedan 400\nMes 3: quedan 100\nMes 4: quedan 0\nDeuda saldada', need: [['\\bwhile\\b', 'Usá while.']], hint: 'El último mes pagás lo que queda: si <code>deuda &lt; 300</code>, la deuda pasa a 0.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int deuda = 1000;\n        int mes = 0;\n        while (deuda > 0) {\n            mes++;\n            deuda -= 300;\n            if (deuda < 0) {\n                deuda = 0;\n            }\n            System.out.println("Mes " + mes + ": quedan " + deuda);\n        }\n        System.out.println("Deuda saldada");\n    }\n}', why: 'No sabías de antemano cuántos meses harían falta: por eso era un <code>while</code>.' }
  ]
};

PRACTICA[12] = {
  prev: '<code>while</code> y contadores.',
  objetivos: ['Usar <code>for</code> cuando se conoce la cantidad de vueltas.', 'Identificar inicio, condición y actualización.', 'Controlar el bucle con <code>break</code> y <code>continue</code>, y anidar bucles.'],
  escalera: {
    vida: 'Dar 10 vueltas a la plaza: sabés cuántas son y las vas contando.',
    modelo: '<code>for</code> reúne en una línea el contador, el límite y el avance.',
    pseudo: 'PARA i desde 1 hasta 10 → repetir.',
    java: '<code>for (int i = 1; i &lt;= 10; i++) { ... }</code>',
    real: 'Enviar la liquidación a cada empleado, o imprimir cada renglón de una factura, se hace recorriendo con <code>for</code>.'
  },
  items: [
    { t: 'mc', q: 'Tenés que regar 12 macetas. ¿Qué bucle se ajusta mejor?', o: ['<code>for</code>, porque sabés cuántas son', '<code>while</code>, porque no se sabe cuántas son', '<code>if</code>', '<code>switch</code>'], a: 0, why: 'Cantidad conocida: <code>for</code>. Cantidad que depende de una condición: <code>while</code>.' },
    { t: 'match', q: 'Uní cada parte de <code>for (int i = 0; i &lt; 5; i++)</code> con su función.', pairs: [['int i = 0', 'Inicio: se ejecuta una vez'], ['i < 5', 'Condición: se evalúa antes de cada vuelta'], ['i++', 'Actualización: se ejecuta al final de cada vuelta']], why: 'Siempre en ese orden: inicio; condición; actualización.' },
    { t: 'output', q: '¿Qué imprime?', code: 'for (int i = 10; i > 0; i -= 3) {\n    System.out.print(i + " ");\n}\nSystem.out.println();', a: '10 7 4 1', why: 'Resta 3 por vuelta. Con -2 la condición es falsa.' },
    { t: 'output', q: '<code>continue</code> saltea y <code>break</code> corta. ¿Qué imprime?', code: 'for (int i = 1; i <= 6; i++) {\n    if (i == 2) {\n        continue;\n    }\n    if (i == 5) {\n        break;\n    }\n    System.out.print(i + " ");\n}\nSystem.out.println();', a: '1 3 4', why: 'El 2 se saltea, y al llegar al 5 el bucle termina.' },
    { t: 'output', q: 'Un bucle dentro de otro. ¿Qué imprime?', code: 'for (int f = 1; f <= 3; f++) {\n    for (int c = 1; c <= f; c++) {\n        System.out.print("#");\n    }\n    System.out.println();\n}', a: '#\n##\n###', why: 'Por cada fila, el bucle interno da tantas vueltas como indica <code>f</code>.' },
    { t: 'fill', q: 'Completá para sumar los pares del 2 al 10.', code: 'int suma = 0;\nfor (int i = ___; i <= 10; i ___ 2) {\n    suma ___ i;\n}\nSystem.out.println(suma);', a: [['2'], ['+=']  , ['+=']], out: '30', why: 'Arranca en 2, avanza de a 2 y acumula: 2 + 4 + 6 + 8 + 10.' },
    { t: 'bug', q: 'Un punto y coma de más: imprime una sola vez. ¿Qué línea corregís?', code: 'for (int i = 0; i < 3; i++); {\n    System.out.println("Hola");\n}', line: 1, fix: 'for (int i = 0; i < 3; i++) {', why: 'Ese <code>;</code> es el cuerpo del bucle: un bucle vacío. El bloque de abajo se ejecuta una sola vez.' },
    { t: 'bug', q: 'La variable del <code>for</code> muere con el bucle. ¿Qué línea no compila?', code: 'for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}\nSystem.out.println(i);', line: 4, fix: 'System.out.println("fin");', why: 'Una variable existe solo en el bloque donde se declaró. Afuera del <code>for</code>, <code>i</code> no existe.' },
    { t: 'tf', q: 'Todo <code>for</code> se puede reescribir como un <code>while</code>.', a: true, why: 'Son equivalentes: elegís el que deja más clara la intención.' },
    { t: 'short', q: '¿Cuándo elegirías <code>for</code> y cuándo <code>while</code>?', any: [['cuantas', 'cantidad', 'veces', 'sabes', 'conoc', 'fijo'], ['condicion', 'no sabes', 'mientras', 'depende', 'hasta']], model: 'for cuando conozco cuántas veces repetir; while cuando la repetición depende de una condición y no sé cuántas veces será.', why: 'Elegir bien hace que el código se entienda solo.' },
    { t: 'code', title: 'Cartón de bingo', task: 'Imprimí una grilla de 3 filas y 4 columnas con los números del 1 al 12, separados por un espacio.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int numero = 1;\n        // Usá dos for anidados\n        \n    }\n}', expected: '1 2 3 4\n5 6 7 8\n9 10 11 12', need: [['for[\\s\\S]*for', 'Usá dos for, uno dentro del otro.']], hint: 'Adentro, <code>System.out.print(numero + " ");</code> y <code>numero++</code>. Al terminar cada fila, <code>System.out.println();</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int numero = 1;\n        for (int fila = 1; fila <= 3; fila++) {\n            for (int col = 1; col <= 4; col++) {\n                System.out.print(numero + " ");\n                numero++;\n            }\n            System.out.println();\n        }\n    }\n}', why: 'Los bucles anidados son la base para trabajar con tablas.' }
  ]
};

PRACTICA[13] = {
  prev: '<code>for</code> y variables.',
  objetivos: ['Crear arrays y acceder por índice.', 'Recorrerlos con <code>for</code> y for-each.', 'Calcular suma, máximo y conteos, y evitar salirse del array.'],
  escalera: {
    vida: 'Un edificio de casillas de correo: cada una tiene un número, todas guardan lo mismo y la cantidad no cambia.',
    modelo: 'Un array es una fila de casilleros del mismo tipo, numerados desde 0, con tamaño fijo.',
    pseudo: 'Crear 5 casilleros → guardar una nota en cada uno → recorrerlos → promediar.',
    java: '<code>int[] notas = {7, 9, 5};</code> y <code>notas[0]</code> vale 7.',
    real: 'Las ventas de cada mes del año entran perfecto en un array de 12 posiciones.'
  },
  items: [
    { t: 'mc', q: 'En un edificio de 5 casillas numeradas desde 0, ¿cuál es la última?', o: ['La 4', 'La 5', 'La 6', 'La 0'], a: 0, why: 'Con <code>n</code> elementos, los índices van de 0 a <code>n - 1</code>.' },
    { t: 'tf', q: 'Una vez creado, un array puede agrandarse agregándole elementos.', a: false, why: 'Su tamaño es fijo. Para listas que crecen se usa <code>ArrayList</code>.' },
    { t: 'output', q: '¿Qué imprime?', code: 'int[] v = {4, 8, 15, 16};\nSystem.out.println(v.length);\nSystem.out.println(v[2]);\nv[0] = v[1] + 1;\nSystem.out.println(v[0]);', a: '4\n15\n9', why: 'El índice 2 es el tercer elemento. <code>v[0]</code> pasa a valer 8 + 1.' },
    { t: 'output', q: 'Dos nombres para el mismo array. ¿Qué imprime?', code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 99;\nSystem.out.println(a[0]);', a: '99', why: 'Asignar un array no lo copia: <code>a</code> y <code>b</code> apuntan al mismo array en memoria.' },
    { t: 'output', q: 'Buscá el mayor. ¿Qué imprime?', code: 'int[] t = {12, 30, 7, 25};\nint mayor = t[0];\nfor (int x : t) {\n    if (x > mayor) {\n        mayor = x;\n    }\n}\nSystem.out.println(mayor);', a: '30', why: 'Se arranca con el primero y se reemplaza cada vez que aparece uno más grande.' },
    { t: 'fill', q: 'Completá para recorrer el array y sumar.', code: 'double[] precios = {10.5, 20.0, 5.5};\ndouble total = 0;\nfor (int i = 0; i < precios.___; i++) {\n    total += precios[___];\n}\nSystem.out.println(total);', a: [['length'], ['i']], out: '36.0', why: 'Se usa <code>length</code>, sin paréntesis, para no escribir el tamaño a mano.' },
    { t: 'bug', q: 'El programa se detiene con <code>ArrayIndexOutOfBoundsException</code>. ¿Qué línea corregís?', code: 'int[] notas = {7, 8, 9};\nfor (int i = 0; i <= notas.length; i++) {\n    System.out.println(notas[i]);\n}', line: 2, fix: 'for (int i = 0; i < notas.length; i++) {', why: 'Con <code>&lt;=</code> intenta leer <code>notas[3]</code>, que no existe.' },
    { t: 'bug', q: 'Un array de <code>int</code> no guarda texto. ¿Qué línea no compila?', code: 'int[] edades = new int[3];\nedades[0] = 20;\nedades[1] = "treinta";\nSystem.out.println(edades[0]);', line: 3, fix: 'edades[1] = 30;', why: 'Todos los elementos de un array son del mismo tipo.' },
    { t: 'order', q: 'Ordená para calcular el promedio de un array.', lines: ['int[] n = {6, 8, 10};', 'int suma = 0;', 'for (int x : n) {', '    suma += x;', '}', 'System.out.println(suma / n.length);'], java: true, out: '8', why: 'Primero los datos, después el acumulador, el recorrido y por último el resultado.' },
    { t: 'match', q: 'Uní cada expresión con su significado.', pairs: [['new int[5]', 'Crea 5 posiciones en 0'], ['v.length', 'Cantidad de elementos'], ['v[v.length - 1]', 'Último elemento'], ['for (int x : v)', 'Recorre cada elemento']], why: 'Con esto resolvés casi cualquier ejercicio de arrays.' },
    { t: 'short', q: '¿Cuándo preferís un for-each y cuándo un <code>for</code> con índice?', any: [['indice', 'posicion'], ['leer', 'recorrer', 'cada', 'todos', 'modificar', 'cambiar']], model: 'for-each cuando solo quiero leer cada elemento; for con índice cuando necesito la posición o modificar el array.', why: 'Con for-each no tenés acceso a la posición.' },
    { t: 'code', title: 'Temperaturas de la semana', task: 'Con el array dado, mostrá el promedio con decimales, la máxima y cuántos días superaron los 25 grados.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int[] temp = {22, 27, 31, 19, 25, 28, 24};\n        // Recorré el array\n        \n    }\n}', expected: 'Promedio: 25.142857142857142\nMáxima: 31\nDías de calor: 3', need: [['\\bfor\\b', 'Recorré el array con for.'], ['\\.length', 'Usá temp.length para el promedio.']], hint: 'Promedio: <code>(double) suma / temp.length</code>. Máxima: compará cada valor con el mayor hasta ahora.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] temp = {22, 27, 31, 19, 25, 28, 24};\n        int suma = 0;\n        int maxima = temp[0];\n        int calor = 0;\n        for (int t : temp) {\n            suma += t;\n            if (t > maxima) {\n                maxima = t;\n            }\n            if (t > 25) {\n                calor++;\n            }\n        }\n        System.out.println("Promedio: " + (double) suma / temp.length);\n        System.out.println("Máxima: " + maxima);\n        System.out.println("Días de calor: " + calor);\n    }\n}', why: 'Acumular, buscar el máximo y contar son los tres patrones más usados con colecciones.' }
  ]
};

PRACTICA[14] = {
  prev: 'haber programado con variables, condiciones y bucles.',
  objetivos: ['Explicar qué es un paradigma de programación.', 'Comparar programación estructurada y orientada a objetos.', 'Reconocer los cuatro pilares de la POO.'],
  escalera: {
    vida: 'Podés cocinar siguiendo una receta paso a paso, o abrir un restaurante con cocinero, mozo y cajero, cada uno con su tarea.',
    modelo: 'Un paradigma es una forma de organizar el pensamiento y el código para resolver problemas.',
    pseudo: 'Estructurado: paso 1, paso 2, paso 3. Objetos: un Cliente pide, un Mozo lleva, una Cocina prepara.',
    java: 'Java es orientado a objetos: los datos y las acciones viven juntos en clases.',
    real: 'En un banco, <code>Cuenta</code> y <code>Cliente</code> son objetos con datos y reglas propias, y eso permite que el sistema crezca ordenado.'
  },
  items: [
    { t: 'mc', q: 'Un restaurante reparte el trabajo entre cocinero, mozo y cajero. ¿A qué paradigma se parece?', o: ['Orientado a objetos', 'Estructurado', 'Lógico', 'Ninguno'], a: 0, why: 'Cada rol tiene sus datos y sus responsabilidades, como los objetos.' },
    { t: 'match', q: 'Uní cada pilar con su idea.', pairs: [['Encapsulamiento', 'Ocultar los datos y exponer métodos'], ['Herencia', 'Reutilizar lo que define una clase padre'], ['Polimorfismo', 'Una misma llamada, distintos comportamientos'], ['Abstracción', 'Mostrar lo esencial y esconder el detalle']], why: 'Son los cuatro pilares que se trabajan en el tramo Intermedio.' },
    { t: 'tf', q: 'Un programa estructurado no puede usar funciones.', a: false, why: 'Al contrario: la programación estructurada organiza el código en funciones o procedimientos.' },
    { t: 'mc', q: '¿Cuál es un lenguaje principalmente declarativo?', o: ['SQL', 'C', 'Assembler', 'Pascal'], a: 0, why: 'En SQL decís qué datos querés, no cómo buscarlos paso a paso.' },
    { t: 'tf', q: 'Java permite programar con objetos, pero también escribir métodos estáticos en un estilo más estructurado.', a: true, why: 'Es lo que hiciste hasta ahora: <code>main</code> es estático. Los objetos aparecen en el próximo tramo.' },
    { t: 'order', q: 'Ordená de lo más antiguo a lo más nuevo.', lines: ['Programación en lenguaje de máquina', 'Programación estructurada', 'Programación orientada a objetos'], why: 'Cada paradigma respondió a la dificultad de manejar programas más grandes.' },
    { t: 'short', q: '¿Qué ventaja da la POO cuando un programa crece mucho?', any: [['organiz', 'mantener', 'mantenimiento', 'reutiliz', 'modular', 'ordenad', 'dividir', 'separa']], model: 'Permite organizar el código en piezas separadas y reutilizables, que son más fáciles de mantener.', why: 'Por eso Java se usa en sistemas grandes, como bancos.' }
  ]
};

PRACTICA[15] = {
  tramo: 'basico',
  prev: 'lecciones 7 a 14.',
  objetivos: ['Integrar arrays, bucles y condiciones.', 'Resolver un problema con acumuladores y contadores.', 'Medir lo aprendido con un simulacro sin ayudas.'],
  escalera: {
    vida: 'A fin de mes revisás los tickets uno por uno, sumás el total y marcás los más caros.',
    modelo: 'Recorrer, decidir y acumular es el patrón que resuelve la mayoría de los problemas con datos.',
    pseudo: 'PARA cada venta → sumar al total → SI supera el mínimo → contarla.',
    java: '<code>for</code> + <code>if</code> + variables acumuladoras.',
    real: 'Los reportes de ventas, las liquidaciones y las estadísticas se construyen sobre este patrón.'
  },
  items: [
    { t: 'output', q: 'Integrador: ¿qué imprime?', code: 'int[] v = {5, 12, 8, 20};\nint c = 0;\nfor (int i = 0; i < v.length; i++) {\n    if (v[i] % 2 == 0 && v[i] > 10) {\n        c++;\n    } else if (v[i] < 6) {\n        c += 5;\n    }\n}\nSystem.out.println(c);', a: '7', why: '5 suma 5; 12 suma 1; 8 no suma; 20 suma 1.' },
    { t: 'bug', q: 'Deberían contarse 2 valores mayores a 5, pero imprime 1. ¿Qué línea sobra?', code: 'int[] v = {3, 9, 12};\nint cuenta = 0;\nfor (int x : v) {\n    cuenta = 0;\n    if (x > 5) {\n        cuenta++;\n    }\n}\nSystem.out.println(cuenta);', line: 4, fix: '    // sin esta línea: el contador no se reinicia', why: 'Reiniciar el contador dentro del bucle borra lo acumulado en cada vuelta. Solo se inicializa una vez, antes del <code>for</code>.' },
    { t: 'code', title: 'Resumen de la caja', task: 'Con los tickets del día, mostrá el total, cuántos superaron 1000 y el ticket más alto.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int[] tickets = {850, 1200, 300, 1500, 990};\n        // Resolvé con un solo for\n        \n    }\n}', expected: 'Total: 4840\nMayores a 1000: 2\nMás alto: 1500', need: [['\\bfor\\b', 'Recorré el array con for.'], ['\\bif\\b', 'Usá if para contar y buscar el mayor.']], hint: 'Tres variables: una acumula, una cuenta y una recuerda el mayor.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int[] tickets = {850, 1200, 300, 1500, 990};\n        int total = 0;\n        int altos = 0;\n        int mayor = tickets[0];\n        for (int t : tickets) {\n            total += t;\n            if (t > 1000) {\n                altos++;\n            }\n            if (t > mayor) {\n                mayor = t;\n            }\n        }\n        System.out.println("Total: " + total);\n        System.out.println("Mayores a 1000: " + altos);\n        System.out.println("Más alto: " + mayor);\n    }\n}', why: 'Con este patrón ya podés resolver gran parte de un primer parcial.' }
  ]
};
