// Java INPRO — Actividades del tramo Avanzado, proyecto final y entrevista (lecciones 30 a 35)
// El “error en la consulta” de este tramo son comandos de Git: consultar el historial es la consulta del curso.
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

PRACTICA[30] = {
  prev: 'tener un proyecto Java con varios archivos.',
  objetivos: ['Explicar qué problema resuelve el control de versiones.', 'Reconocer las tres zonas de Git: trabajo, preparación y repositorio.', 'Usar <code>.gitignore</code> para no versionar lo que se genera solo.'],
  escalera: {
    vida: 'Guardar “tp_final”, “tp_final2”, “tp_final_ahora_si” es control de versiones hecho a mano, y siempre termina mal.',
    modelo: 'Git guarda fotos del proyecto llamadas commits. Cada una dice quién la hizo, cuándo y por qué.',
    pseudo: 'Cambiar archivos → elegir qué entra en la foto → sacar la foto con un mensaje.',
    java: 'Se versionan los <code>.java</code>; los <code>.class</code> se ignoran porque se generan al compilar.',
    real: 'Todo equipo de desarrollo trabaja así: se puede volver atrás, ver quién cambió qué y colaborar sin pisarse.'
  },
  items: [
    { t: 'mc', q: 'Tenés “tp1”, “tp1_final” y “tp1_final_v2”. ¿Qué problema resuelve Git?', o: ['Tener un historial ordenado sin duplicar archivos', 'Compilar más rápido', 'Buscar errores de sintaxis', 'Comprimir el código'], a: 0, why: 'Un solo proyecto y un historial completo de sus cambios.' },
    { t: 'match', q: 'Uní cada zona de Git con su función.', pairs: [['Directorio de trabajo', 'Donde editás los archivos'], ['Staging (preparación)', 'Lo que va a entrar en la foto'], ['Repositorio', 'El historial de fotos'], ['Remoto', 'La copia en GitHub']], why: 'Un cambio pasa de trabajo a preparación con <code>git add</code>, y al repositorio con <code>git commit</code>.' },
    { t: 'tf', q: 'Git solo sirve si trabajás en equipo.', a: false, why: 'Trabajando sola o solo también querés poder volver atrás cuando algo se rompe.' },
    { t: 'tf', q: 'Los archivos <code>.class</code> conviene dejarlos fuera del repositorio.', a: true, why: 'Se generan al compilar. Solo se versiona lo que no se puede regenerar.' },
    { t: 'fill', q: 'Completá el <code>.gitignore</code> de un proyecto Java.', code: '# Archivos compilados\n___.class\n\n# Carpeta de salida\n___/', a: [['*'], ['bin', 'out', 'target']], noRun: true, why: 'El asterisco es un comodín: ignora todos los <code>.class</code>.' },
    { t: 'order', q: 'Ordená el camino de un cambio hasta llegar a GitHub.', lines: ['Editás Main.java', 'git add Main.java', 'git commit -m "Agrego el menú"', 'git push'], why: 'Primero se prepara, después se guarda en el historial y por último se sube.' },
    { t: 'mc', q: '¿Cuál es el mejor mensaje de commit?', o: ['Valido que la edad no sea negativa', 'cambios', 'arreglo', 'asdf'], a: 0, why: 'Dentro de seis meses, ese mensaje es lo único que te explica el porqué del cambio.' },
    { t: 'short', q: '¿Qué es un commit?', any: [['foto', 'version', 'snapshot', 'estado', 'guardad', 'registro', 'punto']], model: 'Una foto del proyecto en un momento dado, con autor, fecha y mensaje, a la que se puede volver.', why: 'El historial de Git es una cadena de commits.' }
  ]
};

PRACTICA[31] = {
  prev: 'qué es Git y qué es un commit.',
  objetivos: ['Iniciar un repositorio y registrar cambios.', 'Consultar el historial con <code>git log</code>.', 'Recuperar una versión anterior de un archivo.'],
  escalera: {
    vida: 'Sacás fotos de una obra día por día. Si algo sale mal, mirás las fotos y volvés a cómo estaba.',
    modelo: 'Cada commit tiene un identificador. Con él se puede consultar o recuperar cualquier momento.',
    pseudo: 'Crear repositorio → agregar → guardar → cambiar → guardar → consultar historial → volver.',
    java: '<code>git init</code>, <code>git add</code>, <code>git commit -m</code>, <code>git log</code>, <code>git checkout</code>.',
    real: 'Si una versión rompe producción, el equipo mira el historial y recupera la última que funcionaba.'
  },
  items: [
    { t: 'match', q: 'Uní cada comando con su función.', pairs: [['git init', 'Crea el repositorio'], ['git status', 'Muestra qué cambió'], ['git add', 'Prepara los cambios'], ['git commit', 'Guarda la foto'], ['git log', 'Consulta el historial']], why: 'Con estos cinco comandos se resuelve casi todo el trabajo diario.' },
    { t: 'order', q: 'Ordená los comandos del primer commit.', lines: ['git init', 'git add Main.java', 'git commit -m "Primer commit"', 'git log --oneline'], why: 'Sin repositorio no hay nada que preparar, y sin preparar no hay nada que guardar.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: se quiere ver el historial resumido en una línea por commit.', code: 'git status\ngit add .\ngit log --online', line: 3, fix: 'git log --oneline', noRun: true, why: 'La opción es <code>--oneline</code>. Con una letra distinta, Git responde que no la reconoce.' },
    { t: 'bug', q: 'Git no permite guardar sin preparar. ¿Qué línea hay que cambiar?', code: 'git init\ngit status\ngit commit -m "Agrego saludar"', line: 2, fix: 'git add Main.java', noRun: true, why: 'Sin <code>git add</code>, el commit responde que no hay nada preparado.' },
    { t: 'bug', q: 'El comando quedó mal escrito. ¿Qué línea corregís?', code: 'git add Main.java\ngit commit "Agrego menú"\ngit log', line: 2, fix: 'git commit -m "Agrego menú"', noRun: true, why: 'El mensaje va después de la opción <code>-m</code>.' },
    { t: 'fill', q: 'Completá para recuperar la versión de un commit anterior.', code: 'git ___ --oneline\ngit ___ a1b2c3 -- Main.java', a: [['log'], ['checkout', 'restore --source']], noRun: true, why: 'Primero se consulta el identificador y después se recupera el archivo.' },
    { t: 'tf', q: '<code>git add .</code> prepara todos los archivos modificados de la carpeta actual.', a: true, why: 'El punto significa “todo lo que está acá”. Por eso conviene tener un buen <code>.gitignore</code>.' },
    { t: 'mc', q: '¿Qué conviene hacer antes de cada commit?', o: ['Revisar con <code>git status</code> qué se va a guardar', 'Borrar el historial', 'Crear otro repositorio', 'Cerrar el editor'], a: 0, why: 'Así evitás subir archivos que no querías.' },
    { t: 'short', q: '¿Qué hace <code>git log</code> y para qué te sirve?', any: [['historial', 'commits', 'cambios'], ['ver', 'muestra', 'consult', 'lista', 'revisar', 'volver', 'buscar', 'saber']], model: 'Muestra el historial de commits, con su identificador, autor y mensaje; sirve para saber qué cambió y a dónde volver.', why: 'Es la consulta que más vas a usar en Git.' }
  ]
};

PRACTICA[32] = {
  prev: 'comandos básicos de Git.',
  objetivos: ['Comparar los IDE más usados para Java.', 'Usar un IDE para detectar y depurar errores.', 'Hacer commits desde el IDE y entender qué comando corre por detrás.'],
  escalera: {
    vida: 'Podés cortar el pasto con tijera, pero una cortadora te ahorra horas. El resultado es el mismo; el esfuerzo, no.',
    modelo: 'Un IDE reúne editor, compilador, depurador y Git en una sola herramienta.',
    pseudo: 'Escribir → el IDE marca el error → corregir → ejecutar → commit desde el panel.',
    java: 'Eclipse, IntelliJ IDEA y VS Code compilan y ejecutan Java con un botón.',
    real: 'En un trabajo vas a usar un IDE todo el día: el autocompletado y el depurador son herramientas de productividad real.'
  },
  items: [
    { t: 'mc', q: '¿Qué ofrece un IDE que un bloc de notas no?', o: ['Autocompletado, marcado de errores y depurador', 'Una JVM distinta', 'Otro lenguaje', 'Mejor resultado del programa'], a: 0, why: 'El código es el mismo: el IDE te ayuda a escribirlo y a revisarlo.' },
    { t: 'match', q: 'Uní cada acción en la interfaz con su comando Git.', pairs: [['Marcar archivos para el commit', 'git add'], ['Escribir el mensaje y confirmar', 'git commit'], ['Subir al remoto', 'git push'], ['Bajar los cambios del equipo', 'git pull']], why: 'Los botones del IDE ejecutan esos comandos por vos.' },
    { t: 'tf', q: 'Si usás un IDE, no hace falta entender Git.', a: false, why: 'Cuando algo falla, entender qué pasa por detrás es lo que te permite resolverlo.' },
    { t: 'order', q: 'Ordená cómo depurar en un IDE.', lines: ['Hacer clic en el margen para poner un punto de interrupción', 'Ejecutar en modo Debug', 'Avanzar paso a paso (Step Over)', 'Mirar los valores de las variables', 'Detener y corregir el código'], why: 'Es la forma profesional de reemplazar los <code>println</code> de prueba.' },
    { t: 'match', q: 'Uní cada botón del depurador con lo que hace.', pairs: [['Step Over', 'Ejecuta la línea sin entrar al método'], ['Step Into', 'Entra al método'], ['Resume', 'Sigue hasta el próximo punto'], ['Breakpoint', 'Pausa en una línea']], why: 'Los nombres cambian poco de un IDE a otro.' },
    { t: 'short', q: '¿Qué es un punto de interrupción (breakpoint)?', any: [['pausa', 'detiene', 'frena', 'para ', 'parar', 'interrump'], ['linea', 'ejecucion', 'programa', 'variables', 'lugar']], model: 'Una marca en una línea que detiene el programa ahí para inspeccionar las variables.', why: 'Permite ver qué está pasando adentro en lugar de adivinarlo.' }
  ]
};

PRACTICA[33] = {
  tramo: 'avanzado',
  prev: 'lecciones 30 a 32.',
  objetivos: ['Encadenar un flujo de trabajo completo con Git sobre un proyecto Java.', 'Encontrar y revertir un commit que introdujo un error.', 'Medir lo aprendido con un simulacro sin ayudas.'],
  escalera: {
    vida: 'Un diario de obra: cada día se anota qué se hizo. Si aparece una grieta, se mira qué se hizo ese día.',
    modelo: 'Commits chicos y con buenos mensajes convierten el historial en una herramienta para encontrar errores.',
    pseudo: 'Día 1: commit. Día 2: commit con un error. Día 3: consultar → recuperar el día 1.',
    java: 'Un commit por método terminado de <code>GestorNotas.java</code>.',
    real: 'Si aparece un error en producción, se busca en el historial el commit que lo introdujo.'
  },
  items: [
    { t: 'bug', q: 'Encontrá el error en la consulta: se quiere recuperar el archivo de un commit anterior.', code: 'git add GestorNotas.java\ngit commit -m "Agrego promedio"\ngit log --oneline\ngit checkout -- a1b2c3 GestorNotas.java', line: 4, fix: 'git checkout a1b2c3 -- GestorNotas.java', noRun: true, why: 'El identificador del commit va antes de <code>--</code>. Lo que sigue a <code>--</code> son archivos.' },
    { t: 'mc', q: '¿Por qué conviene un commit por cada cambio terminado y no uno gigante al final?', o: ['Porque se puede volver a un punto exacto', 'Porque Git cobra por tamaño', 'Porque el compilador lo exige', 'Porque es obligatorio'], a: 0, why: 'Un commit chico aísla el cambio: encontrar un error es mucho más fácil.' },
    { t: 'order', q: 'Ordená cómo recuperar una versión sana.', lines: ['Detectar que el programa falla', 'git log --oneline', 'Identificar el último commit correcto', 'git checkout a1b2c3 -- GestorNotas.java', 'Probar el programa', 'git commit -m "Restauro versión estable"'], why: 'Recuperar el archivo no cierra el trabajo: hay que probarlo y dejarlo registrado.' }
  ]
};

PRACTICA[34] = {
  tramo: 'avanzado',
  prev: 'todo el curso.',
  objetivos: ['Diseñar una aplicación completa con clases, colecciones, menú y validación.', 'Versionar el proyecto con Git.', 'Presentar el proyecto como una pieza de portfolio.'],
  escalera: {
    vida: 'Una biblioteca de barrio tiene libros, una persona que los administra y un mostrador que atiende. Cada parte hace una sola cosa.',
    modelo: 'Separar responsabilidades: <code>Libro</code> guarda datos, <code>Biblioteca</code> tiene las reglas y <code>Main</code> habla con el usuario.',
    pseudo: 'Mostrar menú → leer opción → pedirle a Biblioteca la acción → mostrar el resultado → repetir.',
    java: 'Clases con atributos <code>private</code>, un <code>ArrayList&lt;Libro&gt;</code> y un menú con <code>while</code>, <code>switch</code> y <code>try-catch</code>.',
    real: 'Es la estructura de un sistema real: modelo, lógica de negocio e interfaz. Cambia la escala, no la idea.'
  },
  items: [
    { t: 'order', q: 'Ordená cómo versionar el proyecto final.', lines: ['git init', 'Crear .gitignore con *.class', 'git add .', 'git commit -m "Clase Libro"', 'Programar Biblioteca y hacer git add .', 'git commit -m "Clase Biblioteca"', 'git log --oneline'], why: 'Un commit por funcionalidad deja ver cómo creció el proyecto.' },
    { t: 'match', q: 'Uní cada clase con su responsabilidad.', pairs: [['Libro', 'Guardar los datos de un libro'], ['Biblioteca', 'Agregar, buscar y eliminar'], ['Main', 'Mostrar el menú y leer la entrada']], why: 'Cada clase con una sola responsabilidad: si cambia el menú, no se toca la lógica.' },
    { t: 'bug', q: 'Encontrá el error: compara títulos y nunca encuentra nada.', code: 'String buscado = new String("El Aleph");\nString titulo = "El Aleph";\nif (titulo == buscado) {\n    System.out.println("Encontrado");\n} else {\n    System.out.println("No está");\n}', line: 3, fix: 'if (titulo.equals(buscado)) {', why: '<code>==</code> compara referencias. Para comparar el contenido se usa <code>equals</code>.' },
    { t: 'bug', q: 'Si eliminás mientras recorrés con for-each, Java lanza una excepción. ¿Qué línea cambiarías?', code: 'for (Libro l : libros) {\n    if (l.getTitulo().equals(titulo)) {\n        libros.remove(l);\n    }\n}', line: 1, fix: 'for (int i = libros.size() - 1; i >= 0; i--) { Libro l = libros.get(i);', noRun: true, why: 'Modificar la lista durante un for-each lanza <code>ConcurrentModificationException</code>. Con un <code>for</code> por índice se evita.' },
    { t: 'short', q: 'Si te preguntan en una entrevista por qué separaste <code>Biblioteca</code> de <code>Main</code>, ¿qué respondés?', any: [['responsabilidad', 'separ', 'organiz', 'mantener', 'reutiliz', 'independ', 'cambiar']], model: 'Para separar responsabilidades: la lógica no depende de la consola, así que puedo cambiar el menú o reutilizarla sin tocar las reglas.', why: 'Saber explicar tus decisiones de diseño vale tanto como el código.' }
  ]
};

PRACTICA[35] = {
  tramo: 'todo',
  prev: 'todo el curso.',
  objetivos: ['Responder preguntas técnicas explicando el porqué.', 'Leer código ajeno y predecir su resultado.', 'Rendir un simulacro general del curso.'],
  escalera: {
    vida: 'En una entrevista no alcanza con saber manejar: te piden que expliques por qué frenaste ahí.',
    modelo: 'Se evalúa si entendés lo que escribís. Responder con el motivo vale más que recitar una definición.',
    pseudo: 'Escuchar → pensar en voz alta → responder → dar el porqué con un ejemplo.',
    java: 'Clásicos: <code>==</code> y <code>equals</code>, <code>ArrayList</code> y array, overload y override, checked y unchecked.',
    real: 'Las pruebas técnicas junior suelen combinar preguntas teóricas, lectura de código y un ejercicio corto.'
  },
  items: [
    { t: 'output', q: 'Clásico de entrevista. ¿Qué imprime?', code: 'String a = "java";\nString b = "java";\nString c = new String("java");\nSystem.out.println(a == b);\nSystem.out.println(a == c);\nSystem.out.println(a.equals(c));', a: 'true\nfalse\ntrue', why: 'Los literales iguales comparten el mismo objeto. <code>new</code> crea otro. <code>equals</code> compara el contenido.' },
    { t: 'output', q: 'Otro clásico: ¿qué imprime?', code: 'int x = 5;\nint y = x++ + ++x;\nSystem.out.println(x);\nSystem.out.println(y);', a: '7\n12', why: '<code>x++</code> usa 5 y lo deja en 6; <code>++x</code> lo sube a 7 y usa 7. La suma es 12.' },
    { t: 'output', q: '<code>finally</code> y <code>return</code>. ¿Qué imprime?', code: 'public class Main {\n    static int prueba() {\n        try {\n            return 1;\n        } finally {\n            System.out.println("finally");\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(prueba());\n    }\n}', a: 'finally\n1', why: '<code>finally</code> se ejecuta antes de que el método termine de devolver el valor.' },
    { t: 'mc', q: '¿Cuál es la diferencia entre sobrecarga y sobreescritura?', o: ['Sobrecarga: mismos nombres con distintos parámetros. Sobreescritura: la hija redefine el método', 'Son sinónimos', 'La sobrecarga necesita herencia', 'La sobreescritura cambia los parámetros'], a: 0, why: 'Una se resuelve al compilar y la otra al ejecutar.' },
    { t: 'tf', q: 'Una interfaz puede tener métodos con implementación usando <code>default</code>.', a: true, why: 'Desde Java 8. Permite agregar métodos sin romper las clases que ya la implementaban.' },
    { t: 'tf', q: 'Los <code>String</code> se pueden modificar sin crear un objeto nuevo.', a: false, why: 'Son inmutables: cada método devuelve un String nuevo, por eso hay que guardar el resultado.' },
    { t: 'match', q: 'Uní cada herramienta con cuándo usarla.', pairs: [['Array', 'Cantidad fija y conocida'], ['ArrayList', 'Lista que cambia de tamaño'], ['Interfaz', 'Contrato que cumplen clases distintas'], ['Clase abstracta', 'Código común entre clases parecidas']], why: 'Elegir bien la herramienta y explicar por qué es una pregunta frecuente en entrevistas.' },
    { t: 'bug', q: 'En una prueba técnica te dan este método. ¿Qué línea tiene el error?', code: 'public class Main {\n    static int contarPares(int[] v) {\n        int c = 0;\n        for (int i = 1; i < v.length; i++) {\n            if (v[i] % 2 == 0) {\n                c++;\n            }\n        }\n        return c;\n    }\n    public static void main(String[] args) {\n        System.out.println(contarPares(new int[]{2, 3, 4}));\n    }\n}', line: 4, fix: '        for (int i = 0; i < v.length; i++) {', why: 'Empezar en 1 saltea el primer elemento. Es un error por uno típico.' },
    { t: 'short', q: 'Explicá qué es la JVM como si hablaras con alguien que no programa.', any: [['ejecuta', 'corre', 'traduce', 'interpreta', 'hace funcionar'], ['java', 'programa', 'bytecode', 'computadora', 'sistema']], model: 'Es un programa que ejecuta el código de Java compilado en cualquier computadora, sin importar su sistema operativo.', why: 'Explicar algo técnico en simple es una habilidad que se evalúa.' },
    { t: 'short', q: '¿Qué es el encapsulamiento y por qué importa? Respondé como en una entrevista.', any: [['privad', 'private', 'ocult', 'proteg'], ['metodo', 'getter', 'setter', 'valid', 'control', 'acceso']], model: 'Es ocultar los atributos con private y exponerlos con métodos, para validar los datos y controlar cómo se modifican.', why: 'Definición, motivo y ejemplo: esa es la estructura de una buena respuesta.' }
  ]
};
