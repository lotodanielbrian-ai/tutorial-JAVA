// Java INPRO — Lo que el curso dice cuando te equivocás, y la pregunta previa de cada lección.
// Va aparte para no mover las actividades: su clave es lección-posición.
(function () {
  // Segundo intento: orienta sin dar la respuesta
  var PISTAS = {
    '1-0': 'Pensá en dónde ocurren las acciones que ejecuta el programa.',
    '2-0': 'El saldo puede tener centavos. ¿Qué tipo los admite?',
    '2-10': 'Imaginá leerlo sin contexto: ¿cuál te dice qué guarda?',
    '3-0': 'No preguntan cuántas cajas se llenan, sino cuántos sobran.',
    '3-4': 'Acordate del orden: primero se multiplica.',
    '4-0': 'Buscás un método que responda sí o no.',
    '5-0': 'Un texto no se castea: hace falta un método que lo interprete.',
    '7-0': 'Contá cuántos caminos distintos hay.',
    '8-0': 'Mirá si comparás contra valores fijos o contra rangos.',
    '9-0': 'Con Y tienen que cumplirse las dos condiciones.',
    '10-0': 'println saca información del programa. ¿Qué la hace entrar?',
    '11-0': '¿Sabés de antemano cuántas veces vas a esperar?',
    '12-0': '¿Sabés cuántas macetas son antes de empezar?',
    '13-0': 'Si la primera es la 0, contá hasta la quinta.',
    '14-0': 'Cada persona tiene datos y tareas propias. ¿Qué paradigma trabaja así?',
    '14-3': 'Declarativo: decís qué querés, no cómo conseguirlo.',
    '16-0': 'Una sola orden dispara varios pasos guardados con un nombre.',
    '16-10': 'Pensá cuántas razones distintas tiene para cambiar.',
    '17-0': 'Preguntate qué podés hacer con el valor después.',
    '18-0': 'La clase es el molde. ¿Qué sale del molde?',
    '19-0': 'Su trabajo es dejar listo algo que acaba de nacer.',
    '20-0': 'Preguntate quién puede tocar el dato y con qué controles.',
    '21-0': 'Probá la frase "es un": tiene que ser cierta en la vida real.',
    '22-0': 'Un mismo mensaje, muchas formas de responder.',
    '23-0': 'Es un contrato: no importa qué aparato sea, mientras cumpla la forma.',
    '24-0': 'Pensá qué pasa cuando alguien agrega otro producto al carrito.',
    '25-0': 'Cumplen la función de las secciones: agrupar lo relacionado.',
    '26-0': 'Pensá qué pasa con la memoria cuando el programa se cierra.',
    '27-0': 'Preguntate qué haría una aplicación que te gusta usar.',
    '27-6': 'Fijate en el orden de los catch: uno general antes de uno específico.',
    '28-0': 'Uno ocurre en el cuerpo del método y el otro en la firma.',
    '30-0': 'Pensá qué reemplaza a esas copias con nombres distintos.',
    '30-6': 'Un buen mensaje dice qué cambió, sin abrir el código.',
    '31-7': 'Antes de guardar conviene mirar qué va a entrar.',
    '31-9': 'Pensá qué puede ver alguien que no te conoce.',
    '32-0': 'Pensá en lo que te ayuda mientras escribís.',
    '33-1': 'Imaginá que necesitás deshacer solo un cambio.',
    '35-3': 'Preguntate cuál ocurre en la misma clase y cuál entre padre e hija.',
    '101-0': 'Salir del paso hoy tiene un costo más adelante.',
    '102-2': 'KISS: lo más simple que resuelve el problema.',
    '103-1': 'Contá cuántos motivos distintos tendría para cambiar.',
    '103-3': 'Una hija debería poder usarse donde se usa a su padre.',
    '105-2': 'Buscá el archivo donde Maven lee lo que necesita el proyecto.',
    '107-1': 'Es una regla del negocio, no de HTTP ni de SQL.',
    '109-3': 'Buscás una base que viva en memoria, adentro de la aplicación.',
    '110-4': 'El producto podría no existir. ¿Cómo lo representa Java?',
    '111-0': 'Las dependencias tienen que ser visibles y no poder cambiar.',
    '114-3': 'Los errores aparecen en los bordes: probá a cada lado del límite.',
    '115-2': 'Buscás una anotación de testing que levante solo la capa web.',
    '116-5': 'Sin filtro, el cambio alcanza a todas las filas.',
    '117-2': 'Separá lo que necesita el usuario de lo que necesita quien arregla el error.',
    '118-8': 'Fijate de dónde sale el archivo que copia el Dockerfile.',
    '1-5': 'Cada instrucción tiene que terminar de la misma manera.',
    '1-6': 'Buscá una palabra que debería empezar con mayúscula.',
    '2-5': 'Buscá un texto escrito sin sus comillas.',
    '2-6': 'Buscá un número con decimales en una variable que no los admite.',
    '3-6': 'Recordá qué se calcula primero: la suma o la división.',
    '3-7': 'Seguí el valor que termina como divisor.',
    '4-6': 'Buscá un método escrito sin sus paréntesis.',
    '4-7': 'Si el largo es 4, ¿cuál es el último índice válido?',
    '5-6': 'Un double no entra en un int sin pedirlo explícitamente.',
    '5-7': 'Ese dato es un String: hace falta un método que lo convierta.',
    '6-1': 'Seguí los tipos: int entre int da int.',
    '7-5': 'Un solo = asigna. Buscá la condición.',
    '7-6': 'Probá mentalmente el caso exacto de 6.',
    '8-5': 'Mirá el tipo de la variable que entra al switch.',
    '8-6': 'Sin algo que lo corte, un case sigue con el siguiente.',
    '9-6': 'Java evalúa de a una comparación, no dos juntas.',
    '9-7': 'Las dos condiciones son obligatorias. ¿Qué operador las exige?',
    '10-4': 'Scanner necesita saber de dónde leer.',
    '10-5': 'nextInt deja algo pendiente en la entrada.',
    '11-5': 'Mirá hacia dónde se mueve la variable del bucle.',
    '11-6': 'Probá la condición cuando i vale 3.',
    '12-6': 'Mirá qué hay justo después del paréntesis del for.',
    '12-7': 'Buscá una variable usada fuera del bloque donde nació.',
    '13-6': 'Probá la condición con el último valor que toma i.',
    '13-7': 'Mirá el tipo de cada valor que se guarda.',
    '15-1': 'Seguí el contador en cada vuelta: ¿alguien lo vuelve a 0?',
    '16-5': 'Un método static solo llama de forma directa a otros static.',
    '16-6': 'Compará la cantidad de parámetros con la cantidad de valores que le pasás.',
    '17-6': 'Recorré todos los caminos del método: cada uno tiene que devolver algo.',
    '17-7': 'Mirá la firma: promete no devolver nada, y adentro hay un return con valor.',
    '17-8': 'El método devuelve un valor. ¿Quién lo guarda?',
    '18-6': 'Buscá dónde debería aparecer new.',
    '18-7': 'Compará cómo se escribe el nombre de la clase en cada lado.',
    '19-6': 'Compará lo que pide el constructor con lo que recibe new.',
    '19-7': 'Un constructor no tiene tipo de retorno.',
    '20-5': 'Buscá el acceso directo desde otra clase.',
    '20-6': 'Si parámetro y atributo se llaman igual, ¿a cuál te referís?',
    '21-5': 'La hija tiene que inicializar primero a su padre.',
    '21-6': 'Buscá el modificador que le cierra el paso a la hija.',
    '22-6': 'Compará el nombre con el del método del padre.',
    '22-7': 'El tipo de la variable decide qué métodos se pueden llamar.',
    '23-6': 'Compará lo que promete la interfaz con lo que escribe la clase.',
    '23-7': 'Buscá un new sobre una clase incompleta.',
    '24-6': 'ArrayList no viene incluida: hay que traerla.',
    '24-7': 'length es de los arrays. Las listas tienen otro método.',
    '24-8': 'Los índices empiezan en 0: contá cuál es el último.',
    '25-6': 'java ejecuta una clase, no un archivo.',
    '25-7': 'Hay una instrucción que siempre va primero en el archivo.',
    '26-5': 'Las operaciones con archivos pueden fallar, y Java obliga a decirlo.',
    '26-6': 'Compará los nombres de archivo entre la escritura y la lectura.',
    '27-7': 'Mirá qué excepción lanza realmente la línea que falla.',
    '28-5': 'Si extiende Exception, la firma tiene que avisarlo.',
    '28-6': 'Una excepción es un objeto: se crea como cualquier otro.',
    '29-1': 'parseInt puede lanzar una excepción: hay que contenerla.',
    '31-2': 'Revisá letra por letra las opciones del comando.',
    '31-3': 'Seguí el flujo: modificar, preparar, guardar.',
    '31-4': 'El mensaje del commit necesita su opción.',
    '33-0': 'El orden es: commit, luego -- y luego el archivo.',
    '34-2': 'Con objetos, == compara referencias, no contenido.',
    '34-3': 'Al eliminar, los índices se corren: pensá desde qué punta conviene recorrer.',
    '35-7': 'Seguí el índice: ¿se revisa el primer elemento?',
    '101-3': 'Sin abrir el cuerpo, ¿qué nombre no dice nada de lo que hace?',
    '102-4': 'Refactorizar no cambia el resultado: compará la cuenta con la versión anterior.',
    '103-5': 'Buscá una variable que nombra una clase concreta y no un contrato.',
    '105-5': 'Mirá qué archivo se le pasa a java -jar.',
    '106-5': 'En REST la acción la dice el verbo, no la ruta.',
    '107-3': 'Un controller recibe y responde. ¿Qué línea hace otra cosa?',
    '108-3': 'Mirá qué pasa al pedir el valor de un Optional vacío.',
    '109-2': 'Toda entidad necesita su clave primaria.',
    '109-5': 'Buscá dónde hay comillas dobles.',
    '110-2': 'Mirá el nombre después de FROM: ¿es la clase?',
    '110-3': 'El nombre del método tiene que coincidir con un atributo.',
    '111-5': 'Buscá un new adentro de la clase.',
    '112-2': 'La ruta tiene un {id}: ¿qué anotación lo conecta con el parámetro?',
    '113-3': 'Falta decirle al servidor en qué formato viene el cuerpo.',
    '114-5': 'Probá mentalmente el caso exacto de 5000.',
    '115-5': 'Un test vale por lo que verifica. ¿Qué línea no verifica nada?',
    '116-1': 'Leé las palabras clave de SQL una por una.',
    '116-2': 'A una cláusula le falta una palabra.',
    '116-3': 'Contá columnas y contá valores.',
    '116-4': 'Buscá un texto sin sus comillas simples.',
    '117-4': 'Buscá un dato que nunca debería quedar escrito.',
    '118-2': 'Adentro de un contenedor, localhost es él mismo.',
    '118-3': 'Una cosa es lo que corre al construir, y otra lo que corre al arrancar.',
    '118-7': 'Hay una forma de esperar a que la base esté sana.',
    '119-3': 'Buscá algo que no debería quedar en Git.',
    '120-2': 'Un JOIN necesita decir cómo se conectan las tablas.',
    '121-1': 'Mirá qué le falta al parámetro para que se apliquen sus reglas.',
    '124-0': 'Mirá qué pasa con get() si el cliente no existe.'
  };

  // Por qué es así cada respuesta de los cuestionarios
  var POR_QUE = {
    14: [
      'En el imperativo describís cómo hacerlo, paso a paso, y la máquina obedece.',
      'Java organiza todo en clases y objetos, aunque también admite otros estilos.',
      'La idea central de la POO es juntar los datos con lo que se puede hacer con ellos.',
      'Los pilares son abstracción, encapsulamiento, herencia y polimorfismo. Iterar es repetir, y existe en cualquier paradigma.',
      'En SQL decís qué datos querés y el motor decide cómo buscarlos.'
    ],
    25: [
      'Por convención, src guarda el código fuente, y lo compilado va a otra carpeta.',
      'Evitan choques de nombres y separan el proyecto por temas.',
      'Sin modificador, el acceso llega al mismo paquete: menos que public y más que private.',
      'Automatizan compilar, descargar dependencias y empaquetar.',
      'javac traduce el .java a bytecode, que queda en un .class para la JVM.'
    ],
    30: [
      'Cada commit guarda el estado del proyecto, y por eso se puede volver a él.',
      'Lo que se genera al compilar no se versiona: se puede volver a crear.',
      'Cada persona tiene el historial completo, así que se puede trabajar sin conexión.',
      'El historial no sirve solo para saber qué cambió, también quién, cuándo y por qué.',
      'El historial te protege incluso de vos: podés probar sin miedo a perder lo que funcionaba.'
    ],
    32: [
      'Los IDE solo muestran botones para Git: el que hace el trabajo es Git, que tiene que estar instalado.',
      'En Eclipse, las acciones de Git están en el menú Team.',
      'El debugger frena el programa en una línea (breakpoint) y te deja avanzar de a una mirando cuánto vale cada variable.',
      'Formatear con un atajo te ahorra acomodar el código a mano.'
    ],
    35: [
      'Con objetos, == compara referencias, y new crea un objeto distinto.',
      'equals compara el contenido, que es lo que casi siempre querés.',
      'La JVM busca exactamente esa firma para arrancar.',
      'Un String no cambia: cada operación crea uno nuevo.',
      'Un ArrayList crece solo, permite repetidos y conserva el orden.',
      'Sobrecargar es ofrecer variantes del mismo método. El compilador elige según los parámetros.',
      'Las checked las verifica el compilador. Suelen venir de afuera del programa, como archivos.',
      'private limita el acceso a la propia clase. Lo demás pasa por getters y setters.',
      'Entre enteros, la división descarta los decimales.',
      'El constructor deja el objeto en un estado válido desde que nace.'
    ],
    104: [
      'Si dos clases se conocen demasiado, cualquier cambio se propaga de una a la otra.',
      'Una sola versión del código hace que corregir sea cambiar un solo lugar.',
      'Primero medí: optimizar sin evidencia agrega complejidad y no siempre mejora nada.',
      'Una interfaz separa el qué del cómo, y la inyección permite cambiar la pieza sin tocar el resto.',
      'Si cualquiera puede cambiarlo, no sabés quién lo hizo, y los tests dependen unos de otros.'
    ],
    105: [
      'Spring Boot elige valores por defecto razonables y trae el servidor adentro.',
      'Maven lee el pom.xml y descarga lo que el proyecto necesita.',
      'Spring Boot 3 exige Java 17 o superior.',
      'package compila, corre los tests y arma el .jar en target.',
      'Es el valor por defecto. Se cambia con server.port.',
      'target se genera al compilar: pesa mucho y se puede volver a crear.'
    ],
    106: [
      'POST pide crear algo nuevo. GET solo lee.',
      'Los 4xx son errores del pedido. Un 404 dice que eso no está.',
      '201 significa creado: es más preciso que un 200.',
      'PUT manda el recurso completo. PATCH, solo lo que cambia.',
      'La acción la dice el verbo. La ruta nombra el recurso.',
      'Los 4xx son culpa del pedido, y los 5xx, del servidor.'
    ],
    109: [
      '@Entity le dice a JPA que esa clase se guarda en una tabla.',
      '@Id marca el dato que identifica cada fila.',
      'En memoria, la base muere con el proceso. Por eso sirve para practicar.',
      'JPA es la especificación, e Hibernate es quien la implementa.',
      'nullable se aplica en la tabla: la base rechaza la fila sin ese dato.',
      'La configuración vive afuera del código: cambiar de base no toca el Java.'
    ],
    113: [
      'springdoc lee tu código y arma una página para probar la API.',
      'Sin ese encabezado, Spring no sabe leer el cuerpo y responde 415.',
      'Con la auditoría de JPA, la fecha se completa sin escribir código.',
      'Los errores viven en los casos raros: si solo probás lo normal, los descubre quien lo usa.',
      'curl manda pedidos HTTP desde la terminal, sin interfaz.'
    ],
    116: [
      'El código no cambia: JPA abstrae el motor de base de datos.',
      'WHERE es lo que limita a qué filas afecta. Sin él, afecta a todas.',
      'La fila sigue en la tabla, y las consultas la filtran.',
      'update compara las entidades con las tablas y agrega lo que falta.',
      'SELECT lee, INSERT agrega, UPDATE modifica y DELETE borra.',
      'Por eso, para no chocar con otra base, Docker suele publicar otro puerto.'
    ],
    118: [
      'La aplicación viaja con su entorno, y deja de depender de lo instalado en cada PC.',
      'Igual que una clase y un objeto: la imagen es la plantilla.',
      'El Dockerfile define una imagen. Compose coordina varios contenedores.',
      'Toda imagen parte de otra: FROM dice de cuál.',
      'Primero va el puerto de tu máquina y después el del contenedor.',
      'El contenedor es descartable. El volumen vive afuera de él.'
    ],
    119: [
      'Con esa dependencia, Swagger funciona sin escribir nada más.',
      '/v3/api-docs muestra lo mismo en JSON, y /swagger-ui.html lo muestra para humanos.',
      '@Operation describe el endpoint, y @Tag agrupa varios.',
      'Si nadie puede levantarlo, nadie puede evaluarlo ni usarlo.',
      'Es la única forma de saber que no depende de algo que solo está en tu máquina.'
    ],
    120: [
      'Muchos pedidos apuntan a un cliente: desde Pedido, la relación es muchos a uno.',
      'Cada pedido guarda el id de su único cliente. Al revés no entraría en una columna.',
      'Une las filas según la condición del ON.',
      'Un alumno cursa muchas materias, y cada materia tiene muchos alumnos.',
      'Cliente incluye Pedido y Pedido incluye Cliente: sin DTO, el JSON no termina nunca.'
    ],
    121: [
      'Sin @Valid, las anotaciones del DTO no se aplican.',
      '@NotNull acepta textos vacíos. @NotBlank exige contenido real.',
      'El pedido está mal: es un error del cliente, no del servidor.',
      'Cualquiera puede llamar a tu API con curl o Postman.'
    ],
    125: [
      'Igual que un préstamo: hoy ganás tiempo, y después pagás intereses al mantenerlo.',
      'Si una clase tiene un solo motivo para cambiar, cambiarla es seguro.',
      'Spring lo crea, lo conecta y lo entrega donde hace falta.',
      'El controller traduce HTTP, y el repository habla con la base. La regla queda en el medio.',
      'Con constructor, las dependencias se ven y pueden ser final.',
      'PUT manda todo el recurso, y PATCH solo lo que cambia.',
      'Evita exponer la entidad y permite que la API y la tabla cambien por separado.',
      'Permite probar una clase sin la base ni el resto del sistema.',
      'La imagen es la plantilla, y el contenedor es esa plantilla corriendo.',
      'Es el patrón AAA: arrange, act y assert.'
    ]
  };

  // Preguntar antes de leer prepara la atención. Las lecciones que ya abren con mini-quiz no lo necesitan.
  var ANTES = {
    3: ['Antes de leer: si repartís 7 caramelos entre 2 personas, ¿cuántos le tocan a cada una y cuántos sobran?', 'Tres a cada una y sobra uno. Esas son las dos operaciones de esta lección: dividir y sacar el resto.'],
    5: ['Antes de leer: si tenés 3,99 en una variable entera, ¿qué creés que pasa con los decimales?', 'Se cortan, no se redondean. Por eso importa elegir bien el tipo.'],
    6: ['Antes de empezar: ¿recordás cómo se llama lo que guarda un texto, y cómo se saca su largo?', 'Un String, con <code>length()</code>. Si dudaste, repasá la lección de Strings antes del examen.'],
    8: ['Antes de leer: si tu programa tiene un menú con 7 opciones, ¿te imaginás escribiendo 7 if seguidos?', 'Se puede, pero se lee mal. Para comparar un valor contra opciones fijas existe <code>switch</code>.'],
    9: ['Antes de leer: "tengo DNI y entrada" contra "tengo DNI o entrada". ¿Cuál es más difícil de cumplir?', 'La primera: exige las dos cosas. Es la diferencia entre <code>&amp;&amp;</code> y <code>||</code>.'],
    14: ['Antes de leer: ¿es lo mismo decir "andá a la esquina y doblá" que "quiero estar en la plaza"?', 'No: uno dice cómo y el otro qué. Esa es la diferencia entre imperativo y declarativo.'],
    15: ['Antes de empezar: ¿cómo contarías cuántos números de una lista son mayores a 5?', 'Un contador en 0, un bucle y un if. Es el patrón que vas a usar en este examen.'],
    17: ['Antes de leer: una calculadora que muestra el resultado, ¿te deja usarlo en la cuenta siguiente?', 'Solo si lo devuelve. Mostrar y devolver no son lo mismo, y de eso trata esta lección.'],
    18: ['Antes de leer: ¿qué diferencia hay entre el plano de una casa y la casa?', 'El plano se usa una vez, y con él se pueden construir muchas casas. Es la idea de clase y objeto.'],
    20: ['Antes de leer: ¿dejarías que cualquiera escriba directamente en tu saldo del banco?', 'No: las operaciones pasan por reglas. Encapsular es lo mismo en código.'],
    21: ['Antes de leer: si todos los animales tienen nombre, ¿tiene sentido repetirlo en Perro, Gato y Pez?', 'No: se define una vez en Animal, y los demás lo heredan.'],
    25: ['Antes de leer: si guardaras 200 archivos en una sola carpeta, ¿cómo encontrarías uno?', 'Con dificultad. Los paquetes hacen en código lo que las carpetas hacen en tu computadora.'],
    29: ['Antes de empezar: ¿qué estructura usarías para un menú que se repite hasta elegir Salir?', 'Un <code>while</code> con un <code>switch</code> adentro. Es el corazón de este parcial.'],
    34: ['Antes de empezar: ¿qué clases necesitaría un sistema de biblioteca?', 'Al menos una para el libro y otra que gestione la colección. Definir eso primero ordena todo lo demás.'],
    35: ['Antes de empezar: ¿sabrías explicar en voz alta la diferencia entre == y equals?', 'Si dudaste, es una señal útil: en esta lección están las preguntas que más se repiten en entrevistas.'],
    123: ['Antes de empezar: sin mirar, ¿podés nombrar las cuatro capas de una API y qué hace cada una?', 'Controller recibe, service decide, repository guarda y model representa los datos.'],
    124: ['Antes de empezar: ¿qué debería responder tu API si piden un id que no existe?', 'Un 404 con un mensaje claro. Nunca un 500 con el detalle interno del error.'],
    125: ['Antes de empezar: ¿qué tres partes tiene una buena respuesta oral?', 'Qué es, para qué sirve y un ejemplo tuyo.']
  };

  Object.keys(PISTAS).forEach(function (key) {
    var parts = key.split('-');
    PRACTICA[parts[0]].items[parts[1]].hint = PISTAS[key];
  });

  LESSONS.concat(LESSONS_F2).forEach(function (l) {
    if (l.quiz && POR_QUE[l.id]) {
      l.quiz.questions.forEach(function (q, i) { q.why = POR_QUE[l.id][i]; });
    }
  });

  Object.keys(ANTES).forEach(function (id) { PRACTICA[id].antes = ANTES[id]; });
})();
