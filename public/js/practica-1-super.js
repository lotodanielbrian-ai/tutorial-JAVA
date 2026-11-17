// Java INPRO — Actividades del tramo Super Básico (lecciones 1 a 6)
// tests/run.js compila cada programa y compara cada respuesta contra Java real.
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

PRACTICA[1] = {
  objetivos: ['Reconocer las partes de un programa: clase, <code>main</code> e instrucción.', 'Escribir un programa que imprima texto en la consola.', 'Diferenciar <code>print</code> de <code>println</code> y leer un error de compilación.'],
  escalera: {
    vida: 'Una receta tiene un título, un paso a paso y cada paso termina con un punto. Si falta el punto o el título, el cocinero se confunde.',
    modelo: 'Un programa es una lista de órdenes exactas. La computadora no interpreta lo que quisiste decir: hace lo que escribiste.',
    pseudo: 'Abrir el programa → empezar por el principal → mostrar un mensaje → terminar.',
    java: '<code>class</code> es el título, <code>main</code> es donde empieza el paso a paso y <code>System.out.println("...");</code> es una orden.',
    real: 'El cartel de “Saldo insuficiente” del cajero es esto mismo: un programa que muestra un texto cuando llega a esa instrucción.'
  },
  items: [
    { t: 'mc', q: 'En una receta, el paso “batir los huevos” sería en Java...', o: ['Una instrucción dentro de main', 'El nombre de la clase principal', 'Un comentario para quien lee', 'Un archivo aparte del proyecto'], a: 0, why: 'Cada acción concreta es una instrucción, y las instrucciones van dentro de <code>main</code>, en orden.' },
    { t: 'tf', q: 'En Java se puede escribir una instrucción suelta, fuera de cualquier clase.', a: false, why: 'Todo el código vive dentro de una clase, y lo que se ejecuta arranca en <code>main</code>.' },
    { t: 'match', q: 'Uní cada parte de la receta con su parte en Java.', pairs: [['Título de la receta', 'class Main'], ['“Empezá por acá”', 'public static void main'], ['Un paso', 'System.out.println("Hola");'], ['El punto final de cada paso', ';']], why: 'La estructura siempre es la misma: clase, <code>main</code> e instrucciones terminadas en punto y coma.' },
    { t: 'output', q: '¿Qué imprime este código?', code: 'System.out.print("Hola ");\nSystem.out.print("che");\nSystem.out.println("!");\nSystem.out.println("Chau");', a: 'Hola che!\nChau', why: '<code>print</code> se queda en la misma línea. Recién <code>println</code> baja a la siguiente después de imprimir.' },
    { t: 'fill', q: 'Completá para que el programa salude.', code: 'public class Main {\n    public static void ___(String[] args) {\n        System.out.___("Hola");\n    }\n}', a: [['main'], ['println', 'print']], out: 'Hola', why: 'La JVM busca un método llamado exactamente <code>main</code>, y <code>println</code> es el que imprime.' },
    { t: 'bug', q: 'Este programa no compila. Tocá la línea con el error.', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola")\n    }\n}', line: 3, fix: '        System.out.println("Hola");', why: 'Falta el punto y coma. El compilador avisa <code>\';\' expected</code>.' },
    { t: 'bug', q: 'Java distingue mayúsculas. ¿Qué línea está mal?', code: 'public class Main {\n    public static void main(String[] args) {\n        system.out.println("Hola");\n    }\n}', line: 3, fix: '        System.out.println("Hola");', why: '<code>System</code> se escribe con S mayúscula. <code>system</code> no existe.' },
    { t: 'order', q: 'Ordená las líneas para formar un programa completo.', lines: ['public class Main {', '    public static void main(String[] args) {', '        System.out.println("Listo");', '    }', '}'], java: true, out: 'Listo', why: 'Primero se abre la clase, adentro <code>main</code>, adentro la instrucción. Se cierra en orden inverso, como una muñeca rusa.' },
    { t: 'short', q: '¿Para qué sirve el método <code>main</code>? Respondé con tus palabras.', any: [['empieza', 'arranca', 'inicio', 'comienza', 'entrada', 'primero', 'ejecuta', 'ejecucion']], model: 'Es el punto de entrada: la JVM empieza a ejecutar el programa desde ahí.', why: 'Sin <code>main</code> el código compila, pero Java no sabe por dónde arrancar.' },
    { t: 'code', title: 'Tu tarjeta de presentación', task: 'Imprimí estas tres líneas, como si fuera la tarjeta de una persona que empieza a programar.', starter: 'public class Main {\n    public static void main(String[] args) {\n        // Escribí acá tus instrucciones\n        \n    }\n}', expected: 'Nombre: Lucía\nCurso: Java INPRO\nEstado: aprendiendo', need: [['println', 'Usá System.out.println.']], hint: 'Cada línea es una instrucción <code>System.out.println("...");</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Nombre: Lucía");\n        System.out.println("Curso: Java INPRO");\n        System.out.println("Estado: aprendiendo");\n    }\n}', why: 'Ya sabés mostrar información: es lo primero que hace cualquier sistema.' }
  ]
};

PRACTICA[2] = {
  prev: 'imprimir con <code>println</code>.',
  objetivos: ['Elegir el tipo adecuado para cada dato: <code>int</code>, <code>double</code>, <code>boolean</code>, <code>String</code>, <code>char</code>.', 'Declarar variables y cambiar su valor.', 'Unir texto y variables con <code>+</code>.'],
  escalera: {
    vida: 'En la cocina guardás el azúcar en un frasco con etiqueta. Podés cambiar lo que hay adentro, pero la etiqueta te dice qué esperar.',
    modelo: 'Una variable es una caja con nombre que guarda un valor de un tipo determinado.',
    pseudo: 'Crear una caja “edad” para números → guardar 25 → mostrar su contenido.',
    java: '<code>int edad = 25;</code> crea la caja, le pone tipo y nombre, y guarda el valor.',
    real: 'Tu perfil en una app son variables: nombre (texto), edad (entero), saldo (decimal), cuenta activa (verdadero o falso).'
  },
  items: [
    { t: 'mc', q: 'En la SUBE, ¿qué tipo conviene para el saldo?', o: ['<code>double</code>', '<code>int</code>', '<code>boolean</code>', '<code>char</code>'], a: 0, why: 'El saldo tiene centavos, así que necesita decimales.' },
    { t: 'match', q: 'Uní cada dato con su tipo.', pairs: [['Cantidad de hijos', 'int'], ['Precio de un café', 'double'], ['¿Tiene licencia?', 'boolean'], ['Nombre de una calle', 'String'], ['Letra del documento', 'char']], why: 'Enteros, decimales, verdadero o falso, texto y un solo carácter: cada dato tiene su tipo.' },
    { t: 'tf', q: '<code>String</code> se escribe con mayúscula porque es una clase, no un tipo primitivo.', a: true, why: 'Los primitivos van en minúscula: <code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code>. <code>String</code> es una clase.' },
    { t: 'output', q: '¿Qué imprime?', code: 'int puntos = 10;\npuntos = puntos + 5;\nString nombre = "Ana";\nSystem.out.println(nombre + " tiene " + puntos);', a: 'Ana tiene 15', why: 'Primero se calcula <code>10 + 5</code>, se guarda en <code>puntos</code> y después se une con el texto.' },
    { t: 'fill', q: 'Declará las variables con el tipo correcto.', code: '___ edad = 30;\n___ altura = 1.72;\n___ activo = true;\n___ inicial = \'L\';\nSystem.out.println(edad + " " + altura + " " + activo + " " + inicial);', a: [['int'], ['double'], ['boolean'], ['char']], out: '30 1.72 true L', why: 'El tipo va antes del nombre y tiene que coincidir con el valor.' },
    { t: 'bug', q: 'El texto va entre comillas dobles. ¿Dónde está el error?', code: 'String ciudad = "Rosario";\nint habitantes = 1200000;\nString pais = Argentina;\nSystem.out.println(ciudad + pais);', line: 3, fix: 'String pais = "Argentina";', why: 'Sin comillas, Java busca una variable llamada <code>Argentina</code> y no la encuentra.' },
    { t: 'bug', q: 'Un entero no puede guardar un decimal sin perder datos. ¿Qué línea no compila?', code: 'int cantidad = 3;\nint precio = 99.50;\nSystem.out.println(cantidad);', line: 2, fix: 'double precio = 99.50;', why: 'Java protesta con <code>possible lossy conversion</code>: en un <code>int</code> se perderían los centavos.' },
    { t: 'order', q: 'Ordená: el programa guarda un precio, le aplica el aumento y lo muestra.', lines: ['double precio = 100.0;', 'precio = precio + 20.5;', 'System.out.println(precio);'], java: true, out: '120.5', why: 'Una variable tiene que existir antes de usarla, y el orden de las instrucciones define el resultado.' },
    { t: 'short', q: '¿Cuál es la diferencia entre <code>int</code> y <code>double</code>?', any: [['decimal', 'coma', 'fraccion']], model: 'int guarda números enteros; double guarda números con decimales.', why: 'Elegir bien el tipo evita perder datos y errores de compilación.' },
    { t: 'code', title: 'El ticket del kiosco', task: 'Declará <code>producto</code>, <code>precio</code> (450.5), <code>cantidad</code> (2) y <code>pagado</code> (true). Imprimí cada dato usando las variables, no el valor escrito a mano.', starter: 'public class Main {\n    public static void main(String[] args) {\n        // Declará las cuatro variables\n        \n        // Imprimí el ticket\n        \n    }\n}', expected: 'Producto: Alfajor\nPrecio: 450.5\nCantidad: 2\nPagado: true', need: [['\\bString\\s+\\w+', 'Guardá el producto en un String.'], ['\\bdouble\\s+\\w+', 'Guardá el precio en un double.'], ['\\bint\\s+\\w+', 'Guardá la cantidad en un int.'], ['\\bboolean\\s+\\w+', 'Guardá si está pagado en un boolean.']], hint: 'Uní texto y variable con +: <code>"Precio: " + precio</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        String producto = "Alfajor";\n        double precio = 450.5;\n        int cantidad = 2;\n        boolean pagado = true;\n        System.out.println("Producto: " + producto);\n        System.out.println("Precio: " + precio);\n        System.out.println("Cantidad: " + cantidad);\n        System.out.println("Pagado: " + pagado);\n    }\n}', why: 'Separar el dato del texto permite cambiar el dato en un solo lugar.' }
  ]
};

PRACTICA[3] = {
  prev: 'variables <code>int</code> y <code>double</code>.',
  objetivos: ['Calcular con <code>+ - * / %</code>.', 'Anticipar la división entera y el resto.', 'Usar paréntesis para controlar el orden y evitar concatenar por error.'],
  escalera: {
    vida: 'Repartís 15 facturas entre 4 personas: cada una come 3 y sobran 3. Dividir y ver qué sobra son dos preguntas distintas.',
    modelo: 'Entre enteros, <code>/</code> da cuántas veces entra y <code>%</code> da lo que sobra.',
    pseudo: 'Tomar total y personas → cada una = total / personas → sobran = resto de esa división.',
    java: '<code>15 / 4</code> da <code>3</code> y <code>15 % 4</code> da <code>3</code>. Con <code>15.0 / 4</code> da <code>3.75</code>.',
    real: 'Con <code>%</code> se reparte carga entre servidores y se decide si un número de factura es par; con <code>/</code> se calculan cuotas.'
  },
  items: [
    { t: 'mc', q: 'Tenés 17 alfajores y cajas de 5. ¿Qué operación te dice cuántos quedan sueltos?', o: ['<code>17 % 5</code>', '<code>17 / 5</code>', '<code>17 * 5</code>', '<code>17 - 5</code>'], a: 0, why: 'El resto (<code>%</code>) es lo que no llega a formar otra caja: 2 alfajores.' },
    { t: 'tf', q: 'En Java, <code>7 / 2</code> da <code>3</code>.', a: true, why: 'Entre enteros el resultado es entero. Para obtener decimales, al menos un operando debe ser decimal.' },
    { t: 'output', q: '¿Qué imprime?', code: 'int a = 17;\nint b = 5;\nSystem.out.println(a / b);\nSystem.out.println(a % b);\nSystem.out.println(a / 5.0);', a: '3\n2\n3.4', why: 'Con dos <code>int</code> la división descarta decimales. Con <code>5.0</code> el resultado es <code>double</code>.' },
    { t: 'output', q: 'Mirá bien los paréntesis. ¿Qué imprime?', code: 'int a = 2;\nint b = 3;\nSystem.out.println("Total: " + a + b);\nSystem.out.println("Total: " + (a + b));\nSystem.out.println(a + b + " total");', a: 'Total: 23\nTotal: 5\n5 total', why: 'Java evalúa de izquierda a derecha. Una vez que aparece un texto, <code>+</code> une. Los paréntesis fuerzan la suma.' },
    { t: 'mc', q: '¿Cuánto da <code>2 + 3 * 4</code>?', o: ['14', '20', '24', '9'], a: 0, why: 'Multiplicación antes que suma, igual que en matemática: <code>3 * 4</code> primero.' },
    { t: 'fill', q: 'Completá para calcular cuánto paga cada persona y cuánto sobra.', code: 'int total = 1000;\nint personas = 3;\nSystem.out.println(total ___ personas);\nSystem.out.println(total ___ personas);', a: [['/'], ['%']], out: '333\n1', why: 'División entera para la parte de cada uno, resto para lo que sobra.' },
    { t: 'bug', q: 'Quieren el promedio de 7 y 8, pero imprime 11. ¿Qué línea corregirías?', code: 'int nota1 = 7;\nint nota2 = 8;\nint promedio = nota1 + nota2 / 2;\nSystem.out.println(promedio);', line: 3, fix: 'int promedio = (nota1 + nota2) / 2;', why: 'La división se hace antes que la suma. Hacen falta paréntesis para sumar primero.' },
    { t: 'bug', q: 'Dividir por cero entero detiene el programa. ¿Qué línea hay que corregir para que no falle?', code: 'int entradas = 100;\nint grupos = 0;\nint porGrupo = entradas / grupos;\nSystem.out.println(porGrupo);', line: 2, fix: 'int grupos = 4;', why: 'Compila, pero al ejecutar lanza <code>ArithmeticException: / by zero</code>. El origen es el valor 0.' },
    { t: 'short', q: '¿Cómo sabés si un número es par usando <code>%</code>?', any: [['% 2', '%2', 'resto', 'dividir por 2', 'dividido 2', 'dividirlo por 2'], ['0', 'cero']], model: 'Si numero % 2 da 0, es par: el resto de dividir por 2 es cero.', why: 'Este truco aparece en casi todos los exámenes de programación.' },
    { t: 'code', title: 'Dividir la cuenta', task: 'Entre <code>amigos</code> personas hay que pagar <code>total</code> pesos. Calculá lo que pone cada una y lo que sobra usando las variables.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int total = 12500;\n        int amigos = 4;\n        // Calculá e imprimí\n        \n    }\n}', expected: 'Cada uno: 3125\nSobra: 0\nCon uno más: 2500', need: [['total\\s*/\\s*amigos', 'Calculá con total / amigos.'], ['total\\s*%\\s*amigos', 'Calculá el sobrante con total % amigos.'], ['amigos\\s*\\+\\s*1', 'Para “uno más”, sumale 1 a amigos con paréntesis.']], hint: 'Con paréntesis: <code>"Cada uno: " + (total / amigos)</code>. Para la tercera línea, <code>total / (amigos + 1)</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int total = 12500;\n        int amigos = 4;\n        System.out.println("Cada uno: " + (total / amigos));\n        System.out.println("Sobra: " + (total % amigos));\n        System.out.println("Con uno más: " + (total / (amigos + 1)));\n    }\n}', why: 'Si cambian los datos, el programa sigue funcionando: para eso se calcula en vez de escribir el resultado.' }
  ]
};

PRACTICA[4] = {
  prev: 'variables <code>String</code> y concatenación.',
  objetivos: ['Usar métodos de <code>String</code>: <code>length</code>, <code>charAt</code>, <code>substring</code>, <code>contains</code>.', 'Recordar que las posiciones empiezan en 0.', 'Comparar textos con <code>equals</code>, no con <code>==</code>.'],
  escalera: {
    vida: 'Una etiqueta de equipaje tiene letras en casilleros numerados. Podés pedir la letra del casillero 0, contar cuántas hay o buscar una palabra.',
    modelo: 'Un <code>String</code> es una secuencia de caracteres con métodos para consultarla y producir textos nuevos.',
    pseudo: 'Tomar el texto → contar letras → pedir la primera → pasar a mayúsculas → mostrar.',
    java: '<code>s.length()</code>, <code>s.charAt(0)</code>, <code>s.toUpperCase()</code>, <code>s.contains("hola")</code>.',
    real: 'Validar un email (que tenga @), buscar en un chat y normalizar nombres en un formulario son operaciones sobre Strings.'
  },
  items: [
    { t: 'mc', q: 'En un buscador escribís “mate”. ¿Qué método dice si un texto incluye esa palabra?', o: ['<code>contains</code>', '<code>length</code>', '<code>charAt</code>', '<code>trim</code>'], a: 0, why: '<code>contains</code> devuelve <code>true</code> si el texto incluye esa secuencia.' },
    { t: 'tf', q: 'En "Java", la letra J está en la posición 0.', a: true, why: 'Los índices empiezan en 0: la J es la posición 0 y la primera a, la 1.' },
    { t: 'output', q: '¿Qué imprime?', code: 'String s = "Programar";\nSystem.out.println(s.length());\nSystem.out.println(s.charAt(0));\nSystem.out.println(s.substring(0, 3));\nSystem.out.println(s.indexOf("gra"));', a: '9\nP\nPro\n3', why: '<code>substring(0, 3)</code> toma de la posición 0 hasta la 3 sin incluirla.' },
    { t: 'output', q: 'Un String no cambia: sus métodos devuelven uno nuevo. ¿Qué imprime?', code: 'String n = "ana";\nn.toUpperCase();\nSystem.out.println(n);\nn = n.toUpperCase();\nSystem.out.println(n);', a: 'ana\nANA', why: 'Los Strings son inmutables. Si no guardás el resultado, se pierde.' },
    { t: 'match', q: 'Uní cada necesidad con su método.', pairs: [['Sacar espacios de los extremos', 'trim()'], ['Saber cuántos caracteres tiene', 'length()'], ['Comparar dos textos', 'equals()'], ['Tomar una parte del texto', 'substring()']], why: 'Conocer estos cuatro métodos resuelve la mayoría de los ejercicios con texto.' },
    { t: 'fill', q: 'Completá para mostrar la inicial en mayúscula y el largo.', code: 'String nombre = "brian";\nSystem.out.println(nombre.___(0));\nSystem.out.println(nombre.___());\nSystem.out.println(nombre.___());', a: [['charAt'], ['toUpperCase'], ['length']], out: 'b\nBRIAN\n5', why: '<code>charAt</code> devuelve un carácter; los métodos sin parámetros igual llevan paréntesis.' },
    { t: 'bug', q: 'En un String el largo es un método. ¿Qué línea no compila?', code: 'String clave = "secreta";\nint largo = clave.length;\nSystem.out.println(largo);', line: 2, fix: 'int largo = clave.length();', why: 'En los arrays es <code>.length</code> sin paréntesis; en los Strings, <code>.length()</code> con paréntesis.' },
    { t: 'bug', q: 'Pide la letra final pero el programa se detiene. ¿Dónde está el error?', code: 'String palabra = "hola";\nchar ultima = palabra.charAt(palabra.length());\nSystem.out.println(ultima);', line: 2, fix: 'char ultima = palabra.charAt(palabra.length() - 1);', why: 'La última posición es <code>length() - 1</code>. Pedir <code>length()</code> se sale del texto y lanza <code>StringIndexOutOfBoundsException</code>.' },
    { t: 'tf', q: 'Para comparar dos textos conviene <code>a.equals(b)</code> y no <code>a == b</code>.', a: true, why: '<code>==</code> compara si son el mismo objeto; <code>equals</code> compara el contenido.' },
    { t: 'code', title: 'Limpiar un formulario', task: 'El usuario escribió su email con espacios y mayúsculas. Limpialo, mostralo y decí si tiene @.', starter: 'public class Main {\n    public static void main(String[] args) {\n        String email = "  ANA.Lopez@Mail.com ";\n        // Limpiá el email y mostrá los datos\n        \n    }\n}', expected: 'Email: ana.lopez@mail.com\nLargo: 18\nTiene arroba: true', need: [['\\.trim\\(', 'Sacá los espacios con trim().'], ['\\.toLowerCase\\(', 'Pasalo a minúsculas con toLowerCase().'], ['\\.contains\\(', 'Revisá el @ con contains.']], hint: 'Podés encadenar: <code>email.trim().toLowerCase()</code>. Guardá el resultado.', solution: 'public class Main {\n    public static void main(String[] args) {\n        String email = "  ANA.Lopez@Mail.com ";\n        String limpio = email.trim().toLowerCase();\n        System.out.println("Email: " + limpio);\n        System.out.println("Largo: " + limpio.length());\n        System.out.println("Tiene arroba: " + limpio.contains("@"));\n    }\n}', why: 'Normalizar lo que escribe el usuario es parte de todo formulario real.' }
  ]
};

PRACTICA[5] = {
  prev: 'tipos numéricos y operadores.',
  objetivos: ['Distinguir conversión automática y cast manual.', 'Saber qué se pierde al pasar de <code>double</code> a <code>int</code>.', 'Usar <code>Math</code> y convertir texto a número.'],
  escalera: {
    vida: 'Pasar agua de un balde a una taza puede derramarse; de una taza a un balde, nunca. Convertir tipos funciona igual.',
    modelo: 'De un tipo chico a uno grande la conversión es automática. Del grande al chico tenés que pedirla, porque podés perder datos.',
    pseudo: 'Tomar 3.7 → cortar los decimales → obtener 3. Redondear 3.7 → obtener 4.',
    java: '<code>double d = 5;</code> es automático. <code>int n = (int) 3.7;</code> es un cast. <code>Math.round(3.7)</code> redondea.',
    real: 'Todo lo que se escribe en un formulario llega como texto: la edad “25” se convierte a número con <code>Integer.parseInt</code>.'
  },
  items: [
    { t: 'mc', q: 'Un formulario web te entrega la edad como <code>"25"</code>. ¿Cómo la convertís en número?', o: ['<code>Integer.parseInt("25")</code>', '<code>(int) "25"</code>', '<code>"25".length()</code>', '<code>Math.round("25")</code>'], a: 0, why: 'Un cast no convierte texto en número. Para eso están los métodos <code>parse</code>.' },
    { t: 'tf', q: 'El cast <code>(int) 3.99</code> da 3.', a: true, why: 'El cast corta los decimales, no redondea. Para redondear está <code>Math.round</code>.' },
    { t: 'output', q: '¿Qué imprime?', code: 'double d = 9.87;\nint n = (int) d;\nSystem.out.println(n);\nSystem.out.println(Math.round(d));\nSystem.out.println(Math.sqrt(49));\nSystem.out.println(Math.pow(2, 3));', a: '9\n10\n7.0\n8.0', why: '<code>sqrt</code> y <code>pow</code> devuelven <code>double</code>, por eso aparece <code>.0</code>.' },
    { t: 'output', q: 'El orden del cast cambia el resultado. ¿Qué imprime?', code: 'int a = 7;\nint b = 2;\nSystem.out.println((double) a / b);\nSystem.out.println((double) (a / b));', a: '3.5\n3.0', why: 'En el primero se convierte <code>a</code> y luego se divide. En el segundo primero se divide entre enteros (3) y recién después se convierte.' },
    { t: 'match', q: 'Uní cada método con lo que hace.', pairs: [['Math.abs(-5)', 'Valor absoluto: 5'], ['Math.max(3, 8)', 'El mayor: 8'], ['Math.ceil(2.1)', 'Redondea hacia arriba: 3.0'], ['Math.floor(2.9)', 'Redondea hacia abajo: 2.0']], why: 'Todos son métodos estáticos: se llaman con <code>Math.</code> adelante, sin crear objetos.' },
    { t: 'fill', q: 'Convertí el texto en número y sacá el descuento.', code: 'String texto = "200";\nint precio = Integer.___(texto);\ndouble descuento = (___) precio * 0.25;\nSystem.out.println(descuento);', a: [['parseInt'], ['double']], out: '50.0', why: 'Primero se convierte el texto. Después el cast asegura que el cálculo sea decimal.' },
    { t: 'bug', q: 'Esta conversión pierde datos y Java no la acepta sola. ¿Qué línea corregís?', code: 'double promedio = 7.8;\nint nota = promedio;\nSystem.out.println(nota);', line: 2, fix: 'int nota = (int) promedio;', why: 'Del tipo grande al chico hay que pedirlo con un cast: así declarás que aceptás perder los decimales.' },
    { t: 'bug', q: 'Un cast no convierte texto. ¿Qué línea cambiarías?', code: 'String edadTexto = "42";\nint edad = (int) edadTexto;\nSystem.out.println(edad + 1);', line: 2, fix: 'int edad = Integer.parseInt(edadTexto);', why: '<code>String</code> e <code>int</code> no son compatibles para un cast. Se usa <code>Integer.parseInt</code>.' },
    { t: 'short', q: '¿Por qué de <code>int</code> a <code>double</code> es automático y al revés no?', any: [['perder', 'pierde', 'perdida', 'decimal', 'precision', 'cortar', 'corta']], model: 'Porque de int a double no se pierde información; de double a int se perderían los decimales, y Java exige que lo pidas.', why: 'El compilador te protege de perder datos sin darte cuenta.' },
    { t: 'code', title: 'Redondear una factura', task: 'La factura da <code>1234.56</code>. Mostrá el valor sin centavos, redondeado y con el IVA del 21% ya sumado y redondeado.', starter: 'public class Main {\n    public static void main(String[] args) {\n        double neto = 1234.56;\n        // Mostrá los tres valores\n        \n    }\n}', expected: 'Sin centavos: 1234\nRedondeado: 1235\nCon IVA: 1494', need: [['\\(int\\)', 'Para sacar los centavos usá el cast (int).'], ['Math\\.round', 'Para redondear usá Math.round.']], hint: 'El IVA: <code>Math.round(neto * 1.21)</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        double neto = 1234.56;\n        System.out.println("Sin centavos: " + (int) neto);\n        System.out.println("Redondeado: " + Math.round(neto));\n        System.out.println("Con IVA: " + Math.round(neto * 1.21));\n    }\n}', why: 'Cortar y redondear dan resultados distintos: en una factura esa diferencia importa.' }
  ]
};

PRACTICA[6] = {
  tramo: 'super',
  prev: 'lecciones 1 a 5.',
  objetivos: ['Combinar variables, Strings, operadores y <code>Math</code>.', 'Medir lo aprendido con un simulacro sin ayudas.'],
  escalera: {
    vida: 'Antes de salir a la ruta hacés un repaso: frenos, nafta y luces. Un examen es ese repaso del conductor.',
    modelo: 'Integrar es usar varias herramientas juntas para resolver un solo problema.',
    pseudo: 'Leer los datos → limpiarlos → calcular → mostrar con el formato pedido.',
    java: 'Se combinan <code>trim()</code>, <code>toUpperCase()</code>, operadores y <code>println</code>.',
    real: 'Una planilla de notas hace exactamente esto: toma datos, los normaliza y calcula un promedio.'
  },
  items: [
    { t: 'output', q: 'Integrador: ¿qué imprime?', code: 'String alumno = " sol ";\nint n1 = 8, n2 = 5;\ndouble prom = (n1 + n2) / 2.0;\nSystem.out.println(alumno.trim().toUpperCase() + ": " + prom);\nSystem.out.println((int) prom);', a: 'SOL: 6.5\n6', why: 'Con <code>2.0</code> la división es decimal, y el cast corta el resultado.' },
    { t: 'bug', q: 'Debería imprimir 6.5, pero imprime 6.0. ¿Qué línea corregís?', code: 'int n1 = 8;\nint n2 = 5;\ndouble prom = (n1 + n2) / 2;\nSystem.out.println(prom);', line: 3, fix: 'double prom = (n1 + n2) / 2.0;', why: 'El <code>double</code> de la izquierda no alcanza: la división ya se hizo entre enteros.' },
    { t: 'code', title: 'Boletín rápido', task: 'Mostrá el nombre limpio en mayúsculas, el promedio con decimales de las dos notas y su valor redondeado.', starter: 'public class Main {\n    public static void main(String[] args) {\n        String nombre = "  pedro  ";\n        int nota1 = 7;\n        int nota2 = 8;\n        // Mostrá el boletín\n        \n    }\n}', expected: 'Alumno: PEDRO\nPromedio: 7.5\nRedondeado: 8', need: [['\\.trim\\(', 'Limpiá el nombre con trim().'], ['Math\\.round', 'Redondeá con Math.round.']], hint: 'Calculá <code>double promedio = (nota1 + nota2) / 2.0;</code>.', solution: 'public class Main {\n    public static void main(String[] args) {\n        String nombre = "  pedro  ";\n        int nota1 = 7;\n        int nota2 = 8;\n        double promedio = (nota1 + nota2) / 2.0;\n        System.out.println("Alumno: " + nombre.trim().toUpperCase());\n        System.out.println("Promedio: " + promedio);\n        System.out.println("Redondeado: " + Math.round(promedio));\n    }\n}', why: 'Ya combinás todo lo del primer tramo en un solo programa.' }
  ]
};
