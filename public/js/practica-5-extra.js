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
