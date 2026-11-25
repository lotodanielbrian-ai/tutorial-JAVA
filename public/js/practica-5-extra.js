// Java INPRO — Actividades que suman temas a la Fase 1: lo que estaba en los PDF del módulo
// y no en el sitio, más lo que el segundo semestre da por sabido.
// Van al final de cada lección: los puntajes guardados dependen de la posición de cada ítem.
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

PRACTICA[1].items.push(
  { t: 'short', q: '¿Qué es un algoritmo? Dá un ejemplo de tu vida diaria.', any: [['pasos', 'instrucciones', 'secuencia', 'orden', 'receta']], model: 'Una secuencia ordenada de pasos para resolver un problema, como una receta de cocina.', why: 'Antes de programar hay que tener claro el algoritmo: el lenguaje es solo cómo se escribe.' }
);

PRACTICA[2].items.push(
  { t: 'mc', q: 'Dentro de dos semanas tenés que leer este código. ¿Qué nombre te ayuda más?', o: ['int edadUsuario', 'int variable1', 'int datoNuevo', 'int numeroAux'], a: 0, why: 'Un buen nombre explica qué guarda, y te ahorra leer todo el código.' }
);

PRACTICA[5].items.push(
  { t: 'output', q: 'Con <code>printf</code> controlás el formato. ¿Qué imprime?', code: 'String nombre = "Ana";\nint edad = 30;\ndouble altura = 1.6543;\nSystem.out.printf("%s tiene %d años y mide %.2f%n", nombre, edad, altura);', a: 'Ana tiene 30 años y mide 1.65', why: '<code>%s</code> es texto, <code>%d</code> un entero, <code>%.2f</code> un decimal con dos cifras y <code>%n</code> baja de línea.' },
  { t: 'match', q: 'Uní cada formato de <code>printf</code> con lo que imprime.', pairs: [['%s', 'Texto'], ['%d', 'Número entero'], ['%.2f', 'Decimal con dos cifras'], ['%n', 'Salto de línea']], why: 'Los valores se reemplazan en orden, de izquierda a derecha.' }
);

PRACTICA[13].items.push(
  { t: 'output', q: 'Una matriz es un array de arrays. ¿Qué imprime?', code: 'int[][] asientos = {{1, 2, 3}, {4, 5, 6}};\nSystem.out.println(asientos[1][2]);\nSystem.out.println(asientos.length);\nSystem.out.println(asientos[0].length);', a: '6\n2\n3', why: 'El primer índice es la fila y el segundo la columna. <code>length</code> da las filas, y <code>asientos[0].length</code>, las columnas.' },
  { t: 'code', title: 'Asientos del cine', task: 'Sumá las butacas ocupadas de cada fila de la matriz, usando dos <code>for</code> anidados. Un 1 significa ocupado.', starter: 'public class Main {\n    public static void main(String[] args) {\n        int[][] sala = {{1, 0, 1}, {1, 1, 0}, {0, 0, 1}};\n        // Recorré la matriz y contá\n        \n    }\n}', expected: 'Fila 0: 2\nFila 1: 2\nFila 2: 1\nTotal: 5', need: [['for[\\s\\S]*for', 'Usá dos for anidados.'], ['\\.length', 'Usá length para recorrer sin escribir el tamaño.']], hint: 'El bucle de afuera recorre las filas. Adentro, <code>sala[f][c]</code> es cada butaca.', solution: 'public class Main {\n    public static void main(String[] args) {\n        int[][] sala = {{1, 0, 1}, {1, 1, 0}, {0, 0, 1}};\n        int total = 0;\n        for (int f = 0; f < sala.length; f++) {\n            int ocupadas = 0;\n            for (int c = 0; c < sala[f].length; c++) {\n                ocupadas += sala[f][c];\n            }\n            System.out.println("Fila " + f + ": " + ocupadas);\n            total += ocupadas;\n        }\n        System.out.println("Total: " + total);\n    }\n}', why: 'Las tablas, las planillas y los tableros son matrices.' }
);

PRACTICA[16].items.push(
  { t: 'mc', q: 'Un método se llama <code>procesar()</code>, valida datos, calcula y además imprime. ¿Qué harías?', o: ['Separarlo en métodos con una sola responsabilidad', 'Dejarlo así mientras siga funcionando bien', 'Agregarle comentarios que expliquen cada parte', 'Copiarlo a otra clase para tener un respaldo'], a: 0, why: 'Un método hace una sola cosa y su nombre lo dice. Lo vas a profundizar en la Fase 2.' }
);

PRACTICA[24].items.push(
  { t: 'output', q: 'Un <code>Map</code> busca por clave, no por posición. ¿Qué imprime?', code: 'import java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> stock = new LinkedHashMap<>();\n        stock.put("yerba", 3);\n        stock.put("mate", 7);\n        stock.put("yerba", 5);\n        System.out.println(stock.get("yerba"));\n        System.out.println(stock.size());\n        System.out.println(stock.getOrDefault("termo", 0));\n    }\n}', a: '5\n2\n0', why: 'Una clave repetida reemplaza su valor. <code>getOrDefault</code> evita el <code>null</code> si no existe.' }
);

PRACTICA[25].items.push(
  { t: 'match', q: 'Uní cada sigla con lo que es.', pairs: [['JDK', 'Herramientas para desarrollar, con el compilador'], ['JRE', 'Lo necesario para ejecutar'], ['JVM', 'La máquina que corre el bytecode']], why: 'El JDK incluye al JRE, y el JRE incluye a la JVM.' }
);

PRACTICA[27].items.push(
  { t: 'tf', q: 'Si atrapás una excepción con <code>catch</code>, el programa sigue funcionando.', a: true, why: 'Es la red de seguridad: se registra el problema y la ejecución continúa.' }
);

PRACTICA[31].items.push(
  { t: 'mc', q: 'Tu repositorio de ejercicios tiene un buen historial. ¿Para qué te sirve en una búsqueda laboral?', o: ['Muestra código propio y cómo trabajás', 'Reemplaza el título en cualquier búsqueda', 'Solo ocupa espacio en tu cuenta', 'No sirve: las empresas nunca lo miran'], a: 0, why: 'Un repositorio con commits claros es una buena carta en una entrevista.' },
  { t: 'tf', q: '<code>git clone</code> copia un repositorio remoto a tu computadora.', a: true, why: 'Es el primer paso para trabajar en un proyecto existente, y lo que hace GitHub Classroom con cada tarea.' }
);

PRACTICA[4].items.push(
  { t: 'output', q: 'Comparar texto con <code>==</code> no es lo mismo que <code>.equals()</code>. ¿Qué imprime?', code: 'String a = new String("Java");\nString b = "Java";\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));', a: 'false\ntrue', why: '<code>==</code> compara si apuntan al mismo objeto en memoria; <code>.equals()</code> compara el texto letra por letra.' }
);

PRACTICA[6].items.push(
  { t: 'output', q: 'Un clásico de principiantes: dividir enteros vs decimales. ¿Qué imprime?', code: 'System.out.println((5 + 2) / 2);\nSystem.out.println((5 + 2) / 2.0);', a: '3\n3.5', why: 'Entero entre entero descarta decimales (<code>3</code>); poniendo <code>2.0</code> Java conserva el decimal (<code>3.5</code>).' },
  { t: 'mc', q: '¿Qué tipo de dato devuelve <code>Math.round(3.7)</code> en Java?', o: ['long', 'float', 'double', 'String'], a: 0, hint: 'Es un entero más grande que <code>int</code>.', why: '<code>Math.round(double)</code> devuelve <code>long</code>. Si querés guardarlo en un <code>int</code> hacé <code>(int) Math.round(x)</code>.' },
  { t: 'bug', q: 'El promedio pierde los centavos por división entera. ¿Qué línea corregís?', code: 'int a = 7, b = 8;\ndouble promedio = (a + b) / 2;\nSystem.out.println(promedio);', line: 2, fix: 'double promedio = (a + b) / 2.0;', hint: 'Fijate cómo dividís dos enteros antes de guardar en <code>double</code>.', why: '<code>(7 + 8) / 2</code> se calcula primero como entero (<code>7</code>) y recién después pasa a <code>7.0</code>.' }
);

PRACTICA[10].items.push(
  { t: 'code', title: 'Ficha sin salto vacío', task: 'Leé primero la edad (entero) y después el nombre completo con espacios usando <code>Integer.parseInt(sc.nextLine())</code> para no perder la línea. Imprimí <code>Nombre (edad años)</code>.', stdin: ['25', 'Ana Gómez'], starter: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Leé edad y nombre completo sin nextInt()\n        \n    }\n}', expected: 'Ana Gómez (25 años)', need: [['Integer\\.parseInt', 'Usá Integer.parseInt(sc.nextLine()) para leer la edad.'], ['nextLine', 'Usá sc.nextLine() para leer toda la línea sin dejar saltos sueltos.']], hint: 'Hacé <code>int edad = Integer.parseInt(sc.nextLine());</code> y luego <code>String nombre = sc.nextLine();</code>.', solution: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int edad = Integer.parseInt(sc.nextLine());\n        String nombre = sc.nextLine();\n        System.out.println(nombre + " (" + edad + " años)");\n    }\n}', why: 'Leer todo con <code>nextLine()</code> y convertir números evita el clásico bug del Enter pendiente tras <code>nextInt()</code>.' }
);

PRACTICA[11].items.push(
  { t: 'output', q: 'Seguí el valor de <code>i</code> paso a paso en este <code>while</code>. ¿Qué imprime?', code: 'int i = 2;\nwhile (i < 8) {\n    System.out.println(i);\n    i += 2;\n}', a: '2\n4\n6', why: 'Empieza en 2, suma de a 2 (2, 4, 6) y cuando llega a 8 la condición <code>i &lt; 8</code> ya es falsa.' }
);

PRACTICA[15].items.push(
  { t: 'output', q: 'Recorrido con contador y acumulador. ¿Qué imprime?', code: 'int[] v = {10, 25, 15, 30};\nint cant = 0, suma = 0;\nfor (int x : v) {\n    if (x >= 20) { cant++; suma += x; }\n}\nSystem.out.println(cant);\nSystem.out.println(suma);', a: '2\n55', why: 'Solo 25 y 30 cumplen <code>x &gt;= 20</code>: son 2 ventas que suman 55.' },
  { t: 'bug', q: 'Queremos el máximo de números negativos, pero imprime 0. ¿Qué línea corregís?', code: 'int[] nums = {-5, -2, -9};\nint max = 0;\nfor (int n : nums) {\n    if (n > max) max = n;\n}\nSystem.out.println(max);', line: 2, fix: 'int max = nums[0];', hint: 'Si arrancás el máximo en <code>0</code>, ningún número negativo le gana.', why: 'Al buscar máximo o mínimo, inicializá siempre con el primer elemento real (<code>nums[0]</code>).' },
  { t: 'order', q: 'Ordená el código para sumar todos los números del array.', java: true, out: '12', lines: ['int[] a = {3, 4, 5};', 'int suma = 0;', 'for (int n : a) { suma += n; }', 'System.out.println(suma);'], why: 'El acumulador <code>suma = 0</code> va afuera y antes del bucle.' }
);

PRACTICA[29].items.push(
  { t: 'fill', q: 'Completá la lectura segura de una opción del menú sin trabar el <code>Scanner</code>.', code: 'int opcion = Integer.___(sc.___());', a: [['parseInt'], ['nextLine']], noRun: true, why: 'En menús conviene leer la línea completa y convertirla a entero con <code>Integer.parseInt</code>.' },
  { t: 'mc', q: '¿Por qué conviene que <code>GestorTareas</code> implemente la interfaz <code>Gestionable</code>?', o: ['Define un contrato claro de qué operaciones ofrece', 'Hace que Java ejecute los bucles mucho más rápido', 'Evita tener que importar ArrayList en el archivo', 'Permite crear atributos privados sin constructores'], a: 0, hint: 'Pensá en qué separa el contrato de cómo se guarda la lista por dentro.', why: 'Las interfaces obligan a cumplir los métodos acordados sin atar al resto del programa a una implementación única.' }
);

PRACTICA[33].items.push(
  { t: 'tf', q: 'Correr <code>git status</code> antes de confirmar cambios ayuda a evitar subir archivos no deseados.', a: true, why: 'Muestra exactamente qué archivos modificaste y cuáles están preparados para el próximo commit.' },
  { t: 'tf', q: 'Ejecutar <code>git checkout HASH -- GestorNotas.java</code> borra todos los commits viejos del historial.', a: false, why: 'Solo restaura ese archivo en tu carpeta de trabajo; todo el historial de commits sigue intacto.' },
  { t: 'mc', q: '¿Qué comando lista el historial resumido para encontrar el hash de un commit anterior?', o: ['git log --oneline', 'git status --all', 'git add --history', 'git init --check'], a: 0, hint: 'Es el comando de historial combinado con una bandera de una línea por commit.', why: '<code>git log --oneline</code> muestra cada commit en una sola línea con su hash corto y mensaje.' }
);

PRACTICA[34].items.push(
  { t: 'output', q: 'Para borrar elementos de un <code>ArrayList</code> sin saltear ni fallar, se recorre hacia atrás. ¿Qué imprime?', code: 'import java.util.ArrayList;\n\npublic class Main {\n    public static void main(String[] args) {\n        ArrayList<String> lista = new ArrayList<>();\n        lista.add("Java");\n        lista.add("mal");\n        lista.add("POO");\n        for (int i = lista.size() - 1; i >= 0; i--) {\n            if (lista.get(i).equals("mal")) lista.remove(i);\n        }\n        System.out.println(lista.size());\n    }\n}', a: '2', why: 'Al recorrer de atrás hacia adelante, borrar un elemento no corre los índices que todavía faltan revisar.' }
);
