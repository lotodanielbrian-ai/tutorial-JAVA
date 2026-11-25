// Java INPRO — Bot de ayuda "Profe Java" (offline, sensible al contexto y enfocado en 0 conocimiento + buenas prácticas)
var JavaBot = (function () {
  var initialized = false;
  var panelOpen = false;
  var tipCursor = 0;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fold(s) {
    return String(s == null ? '' : s)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s.+/@=!&|%-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function currentLesson() {
    if (typeof lessonList === 'function' && typeof cur === 'number') {
      var list = lessonList();
      if (list && list[cur]) return list[cur];
    }
    var all = (typeof LESSONS !== 'undefined' ? LESSONS : []).concat(typeof LESSONS_F2 !== 'undefined' ? LESSONS_F2 : []);
    if (typeof document !== 'undefined' && document.getElementById('libro') && all.length) {
      var caps = document.querySelectorAll('article.mn-ch[id^="cap-"]');
      var bestId = null;
      for (var i = 0; i < caps.length; i++) {
        var rect = caps[i].getBoundingClientRect();
        var cid = parseInt(caps[i].id.replace('cap-', ''), 10);
        if (!isNaN(cid) && cid > 0) {
          if (bestId === null) bestId = cid;
          if (rect.top <= 160) bestId = cid;
        }
      }
      if (bestId !== null) {
        var found = all.find(function (l) { return l.id === bestId; });
        if (found) return found;
      }
    }
    if (typeof LESSONS !== 'undefined' && LESSONS.length) return LESSONS[0];
    return null;
  }

  // ── Base de conocimiento: Java + Buenas Prácticas (>= 36 temas) ──────
  var KB = [
    {
      id: 'variables',
      lessonId: 2,
      keywords: ['variable', 'variables', 'tipo', 'tipos', 'int', 'double', 'boolean', 'char', 'byte', 'bytes', 'short', 'long', 'float', 'primitivo', 'primitivos', 'dato', 'declarar', 'cajita'],
      title: 'Variables y tipos de datos en Java',
      que: 'Una variable es un espacio con nombre en memoria donde guardás un valor que tu programa va a leer o cambiar. Los primitivos ocupan tamaño fijo: <code>byte</code> (1 byte), <code>short</code> (2), <code>int</code> (4), <code>long</code> (8), <code>float</code> (4), <code>double</code> (8), <code>char</code> (2) y <code>boolean</code>.',
      porque: 'Java te pide elegir el tipo (<code>int</code> para enteros, <code>double</code> para decimales, <code>String</code> para texto, <code>boolean</code> para verdadero/falso) para atrapar errores antes de ejecutar.',
      ejemplo: 'Como frascos rotulados en la cocina: no guardás leche en la caja de sal ni pesos con centavos en un frasco de enteros.',
      buenaPractica: 'Usá nombres descriptivos en <code>camelCase</code> (ej. <code>precioUnitario</code>, nunca <code>p1</code> ni <code>x</code>).'
    },
    {
      id: 'division',
      lessonId: 3,
      keywords: ['division', 'dividir', 'divido', 'dividir por cero', 'por cero', 'entera', 'decimal', 'resto', 'modulo', '%', 'operador', 'operadores', 'cuenta', 'promedio'],
      title: 'División entera, división por cero y operador resto (%)',
      que: 'Si dividís dos enteros (<code>7 / 2</code>), Java descarta lo que viene después de la coma y da <code>3</code>; el operador <code>%</code> te da lo que sobró (<code>1</code>). Dividir un <code>int</code> por <code>0</code> lanza <code>ArithmeticException</code>; con <code>double</code> (<code>10.0 / 0</code>) da <code>Infinity</code>.',
      porque: 'En Java el resultado conserva el tipo de los operandos: entero con entero da entero.',
      ejemplo: 'Repartir 7 empanadas entre 2 personas: tocan 3 enteras cada uno (<code>7 / 2</code>) y sobra 1 en la caja (<code>7 % 2</code>). Si querés 3.5, usá <code>7.0 / 2</code>.',
      buenaPractica: 'Para promedios reales con decimales usá <code>double</code> en al menos un número (<code>/ 3.0</code>) y verificá que el divisor no sea <code>0</code> antes de dividir.'
    },
    {
      id: 'strings',
      lessonId: 4,
      keywords: ['string', 'texto', 'textos', 'cadena', 'cadenas', 'equals', '==', 'comparar', 'comparar textos', 'trim', 'mayuscula', 'touppercase', 'tolowercase', 'contains', 'charat', 'length'],
      title: 'Strings y cómo comparar textos correctamente',
      que: '<code>String</code> guarda texto y trae métodos como <code>.trim()</code>, <code>.toUpperCase()</code>, <code>.length()</code> y <code>.equals(...)</code>.',
      porque: '<code>==</code> compara si dos variables apuntan a la misma dirección en memoria, mientras <code>.equals()</code> compara las letras reales del texto.',
      ejemplo: 'Dos personas pueden tener billetes distintos pero ambos dicen "$1000": <code>==</code> pregunta si es el mismo papel; <code>.equals()</code> pregunta si valen lo mismo.',
      buenaPractica: 'Compará siempre textos con <code>a.equals(b)</code> (o <code>"admin".equals(rol)</code> para evitar fallos si <code>rol</code> es <code>null</code>).'
    },
    {
      id: 'casting',
      lessonId: 5,
      keywords: ['cast', 'casting', 'math', 'round', 'sqrt', 'parseint', 'parsedouble', 'convertir', 'conversion'],
      title: 'Conversiones de tipos y clase Math',
      que: 'Convertir es pasar un dato de texto a número (<code>Integer.parseInt</code>) o transformar un decimal a entero (<code>(int)</code> / <code>Math.round</code>).',
      porque: 'Lo que escribe el usuario entra como texto, pero para sumar o promediar la computadora necesita valores numéricos.',
      ejemplo: 'Leer el precio impreso en un cartel ("$450") para pasarlo a la calculadora.',
      buenaPractica: '<code>Math.round(double)</code> devuelve <code>long</code>: si lo guardás en <code>int</code> hacé <code>(int) Math.round(valor)</code>.'
    },
    {
      id: 'condicionales',
      lessonId: 7,
      keywords: ['if', 'else', 'condicional', 'condicion', 'decision', 'mayor', 'menor', 'comparacion'],
      title: 'Decisiones con if / else if / else',
      que: 'Ejecuta un bloque de código solo cuando una condición evaluada resulta <code>true</code>.',
      porque: 'Sin condicionales el programa haría siempre lo mismo sin importar notas, edades o saldos.',
      ejemplo: 'El molinete del subte: si la tarjeta tiene saldo, gira y pasa; si no, suena la alarma y no abre.',
      buenaPractica: 'Ordená las condiciones de la más estricta a la más amplia (ej. primero <code>&gt;= 90</code>, luego <code>&gt;= 75</code>) y evitá anidar demasiados <code>if</code> dentro de otros <code>if</code>.'
    },
    {
      id: 'switch',
      lessonId: 8,
      keywords: ['switch', 'case', 'break', 'default', 'menu', 'opcion'],
      title: 'Opciones múltiples con switch / case',
      que: 'Compara una variable contra varios valores fijos concretos de manera limpia y ordenada.',
      porque: 'Reemplaza cadenas largas de <code>if / else if</code> cuando siempre evaluás la misma variable (número, menú o día).',
      ejemplo: 'Botones de un ascensor: apretás 1, 2 o 3 y vas directo al piso elegido; otro número cae en <code>default</code>.',
      buenaPractica: 'Poné siempre <code>break;</code> al final de cada <code>case</code> clásico y agregá un <code>default</code> para entradas inesperadas.'
    },
    {
      id: 'logicos',
      lessonId: 9,
      keywords: ['logico', 'logicos', 'and', 'or', 'not', '&&', '||', '!', 'combinar'],
      title: 'Operadores lógicos (&&, ||, !)',
      que: 'Combinan dos o más condiciones: <code>&amp;&amp;</code> exige ambas, <code>||</code> exige al menos una, y <code>!</code> invierte verdadero/falso.',
      porque: 'Las reglas reales rara vez miran un solo dato aislado.',
      ejemplo: 'Subir al avión requiere pasaje <strong>Y</strong> documento (<code>&amp;&amp;</code>); pagar el pasaje acepta tarjeta <strong>O</strong> efectivo (<code>||</code>).',
      buenaPractica: 'Agrupá condiciones compuestas con paréntesis para no depender de memoria sobre precedencia.'
    },
    {
      id: 'scanner',
      lessonId: 10,
      keywords: ['scanner', 'teclado', 'leer', 'entrada', 'nextline', 'nextint', 'system.in', 'close', 'buffer'],
      title: 'Leer del teclado con Scanner (y evitar la trampa del Enter)',
      que: '<code>Scanner</code> captura lo que escribe el usuario desde la entrada estándar (<code>System.in</code>).',
      porque: '<code>nextInt()</code> lee solo el número y deja un salto de línea (Enter) pendiente que hace que un <code>nextLine()</code> posterior lea vacío.',
      ejemplo: 'Anotar primero la edad en un formulario y, sin pasar al renglón siguiente, querer leer el nombre completo.',
      buenaPractica: 'Leé números como texto y convertilos con <code>Integer.parseInt(sc.nextLine())</code>. Además, cerrá <code>Scanner(System.in)</code> solo al final de <code>main</code>, no en el medio del programa.'
    },
    {
      id: 'bucles',
      lessonId: 11,
      keywords: ['while', 'for', 'bucle', 'bucles', 'ciclo', 'repetir', 'infinito', 'contador', 'iteracion', 'iterar'],
      title: 'Bucles while y for (y cómo evitar bucles infinitos)',
      que: 'Repiten instrucciones automáticamente: <code>for</code> cuando sabés cuántas vueltas dar, y <code>while</code> cuando dependés de una condición abierta.',
      porque: 'Evitan copiar y pegar código y permiten recorrer listas de cualquier tamaño.',
      ejemplo: '<code>for</code> es subir 10 escalones contados; <code>while</code> es revolver el café hasta que no quede azúcar en el fondo.',
      buenaPractica: 'En todo <code>while</code> asegurate de modificar la variable de control dentro del bloque para que la condición llegue a ser falsa.'
    },
    {
      id: 'arrays',
      lessonId: 13,
      keywords: ['array', 'arrays', 'arreglo', 'arreglos', 'indice', 'length', 'arrayindexoutofbounds', 'corchetes', 'lista fija'],
      title: 'Arrays y el clásico error de índice fuera de rango',
      que: 'Un array guarda varios valores del mismo tipo en posiciones numeradas desde <code>0</code> hasta <code>array.length - 1</code>.',
      porque: 'Si un array tiene 4 lugares, sus índices válidos son <code>0, 1, 2, 3</code>: pedir el índice <code>4</code> lanza <code>ArrayIndexOutOfBoundsException</code>.',
      ejemplo: 'Una fila de 4 casilleros numerados 0, 1, 2 y 3: no existe la puerta número 4.',
      buenaPractica: 'Recorré siempre con <code>i &lt; datos.length</code> (menor estricto, nunca <code>&lt;=</code>) o usá <code>for-each</code> si no necesitás el índice.'
    },
    {
      id: 'metodos',
      lessonId: 17,
      keywords: ['metodo', 'metodos', 'funcion', 'funciones', 'void', 'return', 'parametro', 'parametros'],
      title: 'Métodos: void vs return',
      que: 'Un método agrupa una tarea con nombre propio. Si dice <code>void</code> solo ejecuta; si declara un tipo (<code>int</code>, <code>String</code>), devuelve un valor con <code>return</code>.',
      porque: 'Dividir un programa grande en métodos chicos evita código repetido y hace más fácil leer y probar cada parte.',
      ejemplo: 'Un microondas que calienta y suena (<code>void</code>) vs una balanza que calcula el peso y te entrega el número (<code>return</code>) para cobrar según ese valor.',
      buenaPractica: 'Que tus métodos de cálculo devuelvan el dato con <code>return</code> en lugar de imprimir adentro: así podés reutilizarlos y testearlos.'
    },
    {
      id: 'clases',
      lessonId: 18,
      keywords: ['clase', 'clases', 'objeto', 'objetos', 'new', 'atributo', 'instancia', 'poo', 'oop'],
      title: 'Clases y Objetos (Programación Orientada a Objetos)',
      que: 'Una clase es el molde que define qué datos y acciones tiene algo; un objeto es cada ejemplar concreto creado con <code>new</code>.',
      porque: 'Agrupar datos relacionados (ej. nombre y precio dentro de <code>Producto</code>) ordena el código como modelamos el mundo real.',
      ejemplo: 'La clase es el plano de un auto (hay uno); los objetos son el auto rojo de Juan y el azul de Ana circulando en la calle.',
      buenaPractica: 'Nombrá las clases en singular con PascalCase (<code>Cliente</code>, <code>Factura</code>) y mantené cada clase enfocada en un solo concepto.'
    },
    {
      id: 'constructores',
      lessonId: 19,
      keywords: ['constructor', 'constructores', 'this', 'inicializar'],
      title: 'Constructores y la palabra clave this',
      que: 'El constructor es el método especial (mismo nombre que la clase, sin retorno) que corre automáticamente al hacer <code>new</code>, y <code>this</code> apunta al objeto actual.',
      porque: 'Evita crear objetos vacíos o incompletos: garantiza que nazcan con sus datos obligatorios ya cargados.',
      ejemplo: 'Al abrir una cuenta bancaria ya te piden nombre y DNI desde el alta, no después.',
      buenaPractica: 'Usá <code>this.campo = campo;</code> para desambiguar sin inventar abreviaturas feas en los parámetros.'
    },
    {
      id: 'encapsulamiento',
      lessonId: 20,
      keywords: ['encapsulamiento', 'private', 'public', 'getter', 'getters', 'setter', 'setters'],
      title: 'Encapsulamiento: atributos private, getters y setters',
      que: 'Oculta los atributos internos con <code>private</code> para que solo puedan leerse o modificarse pasando por métodos controlados.',
      porque: 'Impide que otra parte del código ponga un precio en <code>-200</code> o una edad en <code>-5</code> sin validación.',
      ejemplo: 'No abrís la caja registradora con las manos desde la calle: pedís al cajero (<code>setter</code>) que verifique el movimiento.',
      buenaPractica: 'Atributos siempre <code>private</code>; validá reglas de negocio dentro de los setters o métodos de dominio (ej. <code>retirar(monto)</code>).'
    },
    {
      id: 'herencia',
      lessonId: 21,
      keywords: ['herencia', 'extends', 'super', 'subclase', 'superclase'],
      title: 'Herencia (extends y super)',
      que: 'Permite que una clase hija reutilice atributos y métodos de una clase padre (<code>extends</code>) e inicialice la base con <code>super(...)</code>.',
      porque: 'Evita duplicar campos comunes entre tipos emparentados ("un Gerente ES UN Empleado").',
      ejemplo: 'Moto y Camión comparten patente y velocidad de <code>Vehiculo</code>, pero cada uno agrega lo propio.',
      buenaPractica: 'Aplicá herencia solo cuando la relación "ES UN" sea estricta; si es "TIENE UN", usá composición (un atributo dentro de la clase).'
    },
    {
      id: 'polimorfismo',
      lessonId: 22,
      keywords: ['polimorfismo', 'override', 'sobrescribir', '@override'],
      title: 'Polimorfismo y @Override',
      que: 'Diferentes clases comparten el mismo método pero cada una lo ejecuta a su manera.',
      porque: 'Permite recorrer una lista mixta (<code>MedioPago[]</code>) llamando <code>cobrar()</code> sin escribir diez <code>if</code> distintos.',
      ejemplo: 'El botón "Pagar" funciona igual para efectivo, tarjeta o QR, pero por dentro cada medio aplica otra lógica.',
      buenaPractica: 'Colocá siempre <code>@Override</code> sobre métodos sobrescritos para que el compilador verifique la firma exacta.'
    },
    {
      id: 'interfaces',
      lessonId: 23,
      keywords: ['interface', 'interfaz', 'interfaces', 'implements', 'abstract', 'abstracta', 'contrato'],
      title: 'Interfaces y Clases Abstractas',
      que: 'Una interfaz define qué métodos debe ofrecer una clase (un contrato), mientras una clase abstracta comparte código base incompleto.',
      porque: 'Permite cambiar una implementación por otra (ej. envío por Email o SMS) sin reescribir quien las usa.',
      ejemplo: 'El enchufe de la pared es una interfaz estándar: conectás cualquier marca que cumpla la forma de las patas.',
      buenaPractica: 'Programá apuntando a interfaces (<code>Notificador n</code>) en vez de clases concretas.'
    },
    {
      id: 'arraylist',
      lessonId: 24,
      keywords: ['arraylist', 'lista', 'listas', 'coleccion', 'colecciones', 'add', 'remove', 'size', 'get'],
      title: 'ArrayList y listas dinámicas',
      que: 'Una lista que crece y se achica automáticamente con <code>.add()</code>, <code>.get()</code>, <code>.remove()</code> y <code>.size()</code>.',
      porque: 'Casi nunca sabés de antemano cuántos productos o usuarios va a cargar la persona.',
      ejemplo: 'Un carrito de compras online donde agregás y sacás productos en cualquier momento.',
      buenaPractica: 'En <code>ArrayList</code> es <code>.size()</code> (con paréntesis), y para borrar elementos dentro de un bucle recorré hacia atrás o usá <code>removeIf</code>.'
    },
    {
      id: 'archivos',
      lessonId: 26,
      keywords: ['archivo', 'archivos', 'filewriter', 'bufferedwriter', 'filereader', 'ioexception', 'try with resources'],
      title: 'Lectura y escritura de archivos (I/O)',
      que: 'Guarda y lee texto persistente en disco usando streams/writers como <code>FileWriter</code> y <code>BufferedWriter</code>.',
      porque: 'Todo lo guardado en variables desaparece al cerrar el programa; los archivos permanecen.',
      ejemplo: 'Pasar tus cuentas del pizarrón a un cuaderno antes de cerrar el local.',
      buenaPractica: 'Usá siempre <code>try (BufferedWriter bw = new BufferedWriter(...))</code> para garantizar el cierre automático del archivo incluso ante errores.'
    },
    {
      id: 'excepciones',
      lessonId: 27,
      keywords: ['try', 'catch', 'finally', 'throw', 'throws', 'excepcion', 'excepciones', 'error', 'numberformatexception', 'nullpointer', 'nullpointerexception'],
      title: 'Manejo de errores con try-catch y excepciones',
      que: '<code>try</code> envuelve código riesgoso y <code>catch</code> atrapa fallos concretos para responder sin colgar la app.',
      porque: 'Un dato mal ingresado o un archivo faltante no deberían cerrar todo el programa abruptamente.',
      ejemplo: 'La red debajo del trapecista: si falla un salto, atrapa la caída y permite continuar.',
      buenaPractica: 'Atrapá excepciones específicas primero, nunca dejes un <code>catch</code> vacío silencioso, y revisá objetos contra <code>null</code> para evitar <code>NullPointerException</code>.'
    },
    {
      id: 'static',
      lessonId: null,
      keywords: ['static', 'instancia', 'estatico'],
      title: '¿Cuándo usar static y cuándo no?',
      que: 'Un miembro <code>static</code> pertenece a la clase entera (no hace falta hacer <code>new</code>); uno sin <code>static</code> pertenece a cada objeto individual.',
      porque: '<code>main</code> y funciones utilitarias puras como <code>Math.round</code> se llaman sin crear objetos; en cambio el saldo es propio de cada <code>Cuenta</code>.',
      ejemplo: 'El reglamento del edificio es común a todos (<code>static</code>), pero las llaves del departamento 3B son de cada objeto vecino.',
      buenaPractica: 'Usá <code>static</code> para constantes (<code>static final</code>) y utilidades sin estado; dejá el estado del dominio en atributos de instancia.'
    },
    {
      id: 'git',
      lessonId: 31,
      keywords: ['git', 'commit', 'git add', 'git init', 'git log', 'checkout', 'restore', 'branch', 'rama', 'versiones', 'github'],
      title: 'Control de versiones con Git',
      que: 'Registra fotos históricas de tu código (<code>git add</code> → <code>git commit -m "..."</code>) para poder volver atrás o colaborar en equipo.',
      porque: 'Sin Git, un cambio que rompe todo puede hacerte perder horas de trabajo.',
      ejemplo: 'Puntos de guardado con descripción en un juego: siempre podés volver a la última partida sana.',
      buenaPractica: 'Hacé commits chicos y frecuentes con mensajes claros, y revisá <code>git status</code> antes de confirmar.'
    },
    {
      id: 'clean_code',
      lessonId: 101,
      keywords: ['limpio', 'clean code', 'deuda tecnica', 'magico', 'magicos', 'constante', 'final', 'camel', 'camelcase', 'nombrar', 'nombres'],
      title: 'Código limpio, nombres claros y constantes',
      que: 'Escribir código que otro desarrollador (o vos en 3 meses) entienda al primer vistazo sin adivinar.',
      porque: 'El 80% del tiempo profesional se pasa leyendo y manteniendo código existente, no escribiéndolo de cero.',
      ejemplo: 'Rotular los interruptores de luz ("Cocina", "Pasillo") en vez de numerarlos "1, 2, 3".',
      buenaPractica: 'Reemplazá números mágicos como <code>1.21</code> por <code>static final double IVA_GENERAL = 1.21;</code> y nombrá métodos con verbos claros.'
    },
    {
      id: 'dry_kiss',
      lessonId: 102,
      keywords: ['dry', 'kiss', 'refactor', 'refactorizar', 'duplicado', 'repetir', 'simple'],
      title: 'Principios DRY, KISS y Refactorización',
      que: '<strong>DRY</strong> ("No te repitas"): cada regla en un único lugar. <strong>KISS</strong> ("Mantenelo simple"): evitá complejidad innecesaria.',
      porque: 'Si copiás una fórmula en 4 sitios y un día cambia, seguro queda desactualizada en alguno.',
      ejemplo: 'Un único menú impreso en caja en lugar de 5 pizarras distintas escritas a mano.',
      buenaPractica: 'Extraé métodos cortos cuando detectes lógica duplicada y devolvé directo comparaciones booleanas (<code>return nota &gt;= 6;</code>).'
    },
    {
      id: 'solid',
      lessonId: 103,
      keywords: ['solid', 'srp', 'ocp', 'lsp', 'isp', 'dip', 'stupid', 'antipatron'],
      title: 'Principios SOLID y cómo evitar STUPID',
      que: 'Cinco guías para que cada clase tenga una sola razón de cambio, se extienda por interfaces y reciba sus dependencias.',
      porque: 'Evitan código rígido donde tocar un cálculo rompe cinco pantallas distintas.',
      ejemplo: 'Enchufes modulares en la casa en lugar de soldar los electrodomésticos a la pared.',
      buenaPractica: 'Si una clase tiene un <code>if/else</code> gigante por tipo o un método de 150 líneas, dividí responsabilidades usando interfaces.'
    },
    {
      id: 'spring',
      lessonId: 105,
      keywords: ['spring', 'spring boot', 'maven', 'pom', 'pom.xml', 'starter', 'dependency'],
      title: 'Spring Boot y Maven en proyectos reales',
      que: 'Maven gestiona librerías y compilación desde <code>pom.xml</code>; Spring Boot levanta servidor web, configuración y cableado automático.',
      porque: 'Te permite concentrarte en reglas de negocio en lugar de configurar infraestructura manual repetitiva.',
      ejemplo: 'Alquilar un local habilitado con luz y agua lista en vez de construir las paredes antes de poder vender.',
      buenaPractica: 'Usá siempre Maven Wrapper (<code>mvnw</code>) para que todos compilen con la misma versión y mantené limpio <code>pom.xml</code>.'
    },
    {
      id: 'http_rest',
      lessonId: 106,
      keywords: ['http', 'rest', 'api', 'get', 'post', 'put', 'delete', 'status', '200', '201', '400', '404', '409', '500', 'curl', 'swagger', 'postman'],
      title: 'HTTP, API REST y códigos de estado',
      que: 'Protocolo cliente-servidor: el verbo indica acción (<code>GET</code> leer, <code>POST</code> crear, <code>PUT</code> actualizar, <code>DELETE</code> borrar) y el código informa qué pasó.',
      porque: 'Permite que cualquier web o app móvil hable con tu backend Java usando un estándar universal.',
      ejemplo: '<code>200 OK</code> llegó tu pedido; <code>201 Created</code> alta confirmada; <code>400</code> pediste mal; <code>404</code> no existe; <code>409</code> ya existía duplicado; <code>500</code> se rompió la cocina.',
      buenaPractica: 'Rutas en plural (<code>/api/productos</code>), sin verbos en la URL, y validá siempre devolviendo <code>400</code> o <code>404</code> claros en lugar de <code>500</code>.'
    },
    {
      id: 'capas_di',
      lessonId: 107,
      keywords: ['capa', 'capas', 'controller', 'service', 'repository', 'inyeccion', 'di', 'autowired', 'dto', 'record'],
      title: 'Arquitectura en capas, DTOs e Inyección de Dependencias',
      que: 'Divide el backend en <strong>Controller</strong> (HTTP/DTO), <strong>Service</strong> (reglas de negocio) y <strong>Repository</strong> (datos), conectados por constructor.',
      porque: 'Permite probar la lógica sin base de datos y cambiar respuestas JSON sin romper tablas internas.',
      ejemplo: 'Mozo (Controller) toma pedido, Chef (Service) cocina aplicando recetas, Depósito (Repository) guarda insumos.',
      buenaPractica: 'Inyectá dependencias por constructor con campos <code>private final</code> y usá <code>record</code> para DTOs inmutables.'
    },
    {
      id: 'jpa_sql',
      lessonId: 109,
      keywords: ['jpa', 'entity', 'entidad', 'h2', 'mysql', 'sql', 'select', 'insert', 'update', 'join', 'relacion', 'onetomany', 'manytoone', 'jpql', 'borrado logico'],
      title: 'JPA, SQL y relaciones entre entidades',
      que: 'Mapea clases Java (<code>@Entity</code>) a tablas relacionales, genera consultas con <code>JpaRepository</code> y conecta entidades con llaves foráneas.',
      porque: 'Guarda los datos de forma persistente e íntegra entre reinicios.',
      ejemplo: 'Un cliente tiene muchos pedidos (<code>@OneToMany</code>), y cada pedido pertenece a un único cliente (<code>@ManyToOne</code>).',
      buenaPractica: 'Usá borrado lógico (<code>activo = false</code>) para no perder historial contable, comillas simples en SQL y DTOs para no causar recursión JSON.'
    },
    {
      id: 'modern_java',
      lessonId: 108,
      keywords: ['optional', 'stream', 'lambda', 'lambdas', 'map', 'hashmap', 'filter', 'maptoint'],
      title: 'Java moderno: Map, Optional y Streams',
      que: '<code>Map</code> busca por clave al instante, <code>Optional</code> representa un resultado que puede faltar sin usar <code>null</code> crudo, y <code>Stream</code> filtra/transforma listas en cadena.',
      porque: 'Reduce bucles largos a tuberías declarativas claras y evita muchos <code>NullPointerException</code>.',
      ejemplo: 'Una cinta transportadora con estaciones: filtrás manzanas sanas (<code>filter</code>), les ponés etiqueta (<code>map</code>) y las contás.',
      buenaPractica: 'Usá <code>Optional</code> en retornos de búsqueda (con <code>orElseThrow</code>), no como parámetro ni atributo.'
    },
    {
      id: 'testing',
      lessonId: 114,
      keywords: ['test', 'testing', 'junit', 'mockito', 'mockmvc', 'aaa', 'arrange', 'act', 'assert', 'unitario', 'prueba', 'verify'],
      title: 'Testing con JUnit, Mockito y patrón AAA',
      que: 'Programas automáticos que prueban tu código en 3 pasos: <strong>Arrange</strong> (preparar), <strong>Act</strong> (ejecutar) y <strong>Assert</strong> (comprobar).',
      porque: 'Aseguran que un cambio nuevo no rompió lo que ayer ya funcionaba.',
      ejemplo: 'Poner una pesa patrón de 1 kg en una balanza antes de abrir el local para verificar que marca 1.000 g.',
      buenaPractica: 'Probá casos borde (<code>0</code>, negativos, límite exacto, no encontrado) y aislá dependencias externas con dobles/mocks.'
    },
    {
      id: 'docker_seguridad',
      lessonId: 118,
      keywords: ['docker', 'dockerfile', 'compose', 'contenedor', 'valid', 'validacion', 'notblank', 'positive', 'advice', 'restcontrolleradvice', 'secret', 'password'],
      title: 'Validación (@Valid), Logs seguros y Docker',
      que: 'Validar entradas en la puerta con <code>@Valid</code>, centralizar errores en <code>@RestControllerAdvice</code>, loguear sin secretos y empaquetar en contenedores Docker.',
      porque: 'Protege la aplicación de datos inválidos, filtración de credenciales y fallos de entorno ("en mi PC anda").',
      ejemplo: 'Control de equipaje antes de embarcar + contenedor estandarizado que viaja igual en cualquier puerto.',
      buenaPractica: 'Usá variables de entorno para claves (<code>${DB_PASSWORD}</code>), validá DTOs con <code>@Valid</code> y usá nombres de servicio (<code>db</code>) en Docker Compose.'
    },
    {
      id: 'logs',
      lessonId: 117,
      keywords: ['log', 'logs', 'logging', 'slf4j', 'logger', 'log.info', 'log.warn', 'log.error', 'bitacora'],
      title: 'Qué es un log (y logging profesional con SLF4J)',
      que: 'Un <strong>log</strong> es un registro con fecha, hora y nivel (<code>INFO</code>, <code>WARN</code>, <code>ERROR</code>) de lo que fue ocurriendo mientras la aplicación corría.',
      porque: 'En producción no estás mirando la pantalla del servidor: cuando un usuario reporta un fallo, los logs son la caja negra que te dice exactamente qué pasó.',
      ejemplo: 'La bitácora de guardia de un edificio donde se anota a qué hora entró cada proveedor y si sonó alguna alarma.',
      buenaPractica: 'Usá <code>@Slf4j</code> con <code>log.info("Producto {}", id)</code> en lugar de <code>System.out.println</code>, y <strong>nunca</strong> loguees contraseñas ni tokens.'
    },
    {
      id: 'que_es_java',
      lessonId: 0,
      keywords: ['que es java', 'para que sirve java', 'lenguaje java', 'bytecode', 'compilado'],
      title: '¿Qué es Java y para qué sirve?',
      que: 'Java es un lenguaje de programación orientado a objetos, fuertemente tipado y multiplataforma: tu código (<code>.java</code>) se compila a <em>bytecode</em> (<code>.class</code>) y corre en la <strong>JVM</strong> en Windows, Mac o Linux.',
      porque: 'Por su estabilidad, seguridad y ecosistema (Spring Boot), es uno de los lenguajes más usados en bancos, sistemas de gestión, APIs empresariales y Android.',
      ejemplo: 'Como escribir una partitura estándar: cualquier orquesta (JVM en Windows, Linux o Mac) la puede interpretar igual.',
      buenaPractica: 'Antes de memorizar sintaxis, entendé el flujo: escribís <code>.java</code> → <code>javac</code> revisa y compila → <code>java</code> ejecuta en la JVM.'
    },
    {
      id: 'java_vs_js',
      lessonId: 0,
      keywords: ['javascript', 'java y javascript', 'java vs javascript', 'son lo mismo', 'js'],
      title: 'Java y JavaScript NO son lo mismo',
      que: 'Solo comparten cuatro letras en el nombre por marketing de 1995. <strong>Java</strong> es compilado, de tipos estrictos y fuerte en servidores/backend; <strong>JavaScript</strong> nació para el navegador web y tiene tipado dinámico.',
      porque: 'Confundirlos te lleva a buscar ejemplos o soluciones que no compilan en Java.',
      ejemplo: 'Se parecen tanto como "auto" y "autopista" o "jamón" y "hámster": nombres parecidos, mundos distintos.',
      buenaPractica: 'Cuando busques documentación o errores en internet, escribí siempre <code>java</code> (no <code>js</code>) junto a tu consulta.'
    },
    {
      id: 'random',
      lessonId: null,
      keywords: ['random', 'aleatorio', 'aleatorios', 'azar', 'dado', 'math.random', 'numero aleatorio'],
      title: 'Números aleatorios con Random y Math.random()',
      que: '<code>new Random().nextInt(6) + 1</code> (de <code>java.util.Random</code>) genera un entero al azar entre 1 y 6; <code>Math.random()</code> devuelve un <code>double</code> entre <code>0.0</code> (incluido) y <code>1.0</code> (excluido).',
      porque: 'Sirve para dados, sorteos, juegos, simulaciones y datos de prueba.',
      ejemplo: 'Tirar un dado de 6 caras: <code>nextInt(6)</code> da <code>0..5</code>, por eso sumás <code>1</code> para obtener <code>1..6</code>.',
      buenaPractica: 'Creá un solo objeto <code>Random</code> fuera del bucle (no uno nuevo en cada vuelta) y pasale una semilla fija en tests si querés resultados reproducibles.'
    },
    {
      id: 'stringbuilder',
      lessonId: null,
      keywords: ['stringbuilder', 'stringbuffer', 'concatenar en bucle', 'append'],
      title: 'StringBuilder: armar textos largos sin desperdiciar memoria',
      que: '<code>StringBuilder</code> es un texto mutable que te permite ir agregando fragmentos con <code>.append(...)</code> y al final obtener el <code>String</code> con <code>.toString()</code>.',
      porque: 'En Java los <code>String</code> son inmutables: concatenar con <code>+</code> dentro de un bucle de miles de vueltas crea miles de objetos intermedios descartables.',
      ejemplo: 'Escribir una lista en una pizarra borrable (<code>StringBuilder</code>) en vez de fotocopiar toda la hoja cada vez que agregás un renglón (<code>String +</code>).',
      buenaPractica: 'Para 2 o 3 textos sueltos usá <code>+</code> sin miedo; cuando armes un texto acumulando dentro de un <code>for</code> o <code>while</code>, elegí <code>StringBuilder</code>.'
    },
    {
      id: 'tostring',
      lessonId: 18,
      keywords: ['tostring', 'imprimir objeto', 'arroba', 'direccion de memoria'],
      title: 'Por qué sobrescribir toString() en tus clases',
      que: '<code>toString()</code> define cómo se convierte tu objeto a texto cuando lo pasás a <code>System.out.println(obj)</code>.',
      porque: 'Si no lo sobrescribís, Java imprime algo críptico como <code>Persona@15db9742</code> (nombre de clase + código hash).',
      ejemplo: 'Como ponerle una etiqueta legible a una caja ("Yerba 1kg - $4500") en vez de mostrar solo su número de inventario interno.',
      buenaPractica: 'Anotá siempre <code>@Override public String toString()</code> en tus clases modelo para depurar y mostrar datos con claridad.'
    },
    {
      id: 'sobrecarga',
      lessonId: 17,
      keywords: ['sobrecarga', 'overloading', 'overload', 'mismo nombre'],
      title: 'Sobrecarga de métodos y constructores (Overloading)',
      que: 'Es declarar dos o más métodos (o constructores) con el <strong>mismo nombre</strong> pero distinta lista de parámetros (cantidad o tipo).',
      porque: 'Permite llamar a la misma operación de formas cómodas, por ejemplo <code>sumar(int a, int b)</code> y <code>sumar(double a, double b)</code> o <code>println</code> con cualquier tipo.',
      ejemplo: 'Un café que acepta pedir "cortado" (tamaño estándar) o "cortado grande, sin azúcar" usando el mismo pedido base.',
      buenaPractica: 'La sobrecarga se distingue por los parámetros, <strong>no</strong> por el tipo de retorno. No confundas sobrecarga (misma clase) con sobrescritura (<code>@Override</code> en herencia).'
    },
    {
      id: 'matrices',
      lessonId: 13,
      keywords: ['matriz', 'matrices', 'bidimensional', 'array 2d', 'bucles anidados', 'for anidado'],
      title: 'Matrices (arrays 2D) y bucles anidados',
      que: 'Una matriz (<code>int[][] tabla = new int[3][4];</code>) es un array de arrays organizado en filas y columnas, que normalmente se recorre con un <code>for</code> dentro de otro <code>for</code>.',
      porque: 'Modela grillas reales: tableros de juegos, horarios semanales, asientos de cine o planillas de notas.',
      ejemplo: 'Las butacas de un cine: el primer índice elige la fila (<code>f</code>) y el segundo elige el asiento dentro de esa fila (<code>c</code>).',
      buenaPractica: 'Usá <code>f</code> y <code>c</code> (fila y columna) como nombres de índice y <code>tabla[f].length</code> para el límite interno.'
    },
    {
      id: 'algoritmo',
      lessonId: 0,
      keywords: ['algoritmo', 'algoritmos', 'paso a paso', 'pseudocodigo'],
      title: '¿Qué es un algoritmo?',
      que: 'Un algoritmo es una secuencia ordenada y finita de pasos exactos para resolver un problema antes de escribirlo en cualquier lenguaje.',
      porque: 'Si primero podés explicar la solución en pasos claros en español, escribirla en Java pasa a ser solo traducción.',
      ejemplo: 'Una receta de fideos: hervir agua → agregar sal → cocer 8 minutos → colar. Si alterás el orden, sale mal.',
      buenaPractica: 'Antes de programar un ejercicio largo, anotá 3 o 4 pasos en comentarios dentro de <code>main</code> y recién después escribí el código.'
    },
    {
      id: 'instalar_jdk',
      lessonId: 0,
      keywords: ['instalar', 'instalo', 'instalacion', 'jdk', 'jre', 'jvm', 'javac', 'temurin', 'adoptium'],
      title: 'Cómo instalar Java (JDK) y ejecutar en tu PC',
      que: 'El <strong>JDK</strong> trae el compilador (<code>javac</code>) y la máquina virtual (<code>JVM</code>) para compilar y correr programas Java fuera del navegador.',
      porque: 'En este curso podés practicar directo en la web, pero en proyectos reales necesitás un JDK LTS (21 o 25) instalado en tu computadora.',
      ejemplo: 'Practicar en un simulador de manejo está genial; instalar el JDK es subirte al auto real con el motor encendido.',
      buenaPractica: 'Instalá Eclipse Temurin LTS (Java 21 o 25) y comprobá en terminal con <code>java -version</code> y <code>javac -version</code>.'
    },
    {
      id: 'main_entry',
      lessonId: 1,
      keywords: ['public static void main', 'main', 'string[] args', 'punto de entrada'],
      title: 'Qué significa public static void main(String[] args)',
      que: 'Es la puerta de entrada obligatoria donde la JVM empieza a ejecutar cualquier programa Java.',
      porque: '<code>public</code> permite que Java lo llame desde afuera; <code>static</code> permite correrlo sin crear objetos; <code>void</code> indica que no devuelve valor; <code>String[] args</code> recibe argumentos de consola.',
      ejemplo: 'La puerta principal con cartel "ENTRADA" de un edificio: aunque haya diez oficinas adentro, siempre entrás por ahí primero.',
      buenaPractica: 'No pongas toda la lógica gigante adentro de <code>main</code>: usalo para arrancar el programa y delegá el trabajo en métodos y clases.'
    },
    {
      id: 'print_println',
      lessonId: 1,
      keywords: ['print', 'println', 'printf', 'imprimir', 'consola', 'salto de linea'],
      title: 'Diferencia entre print, println y printf',
      que: '<code>println</code> imprime y baja al renglón siguiente; <code>print</code> sigue en la misma línea; <code>printf</code> formatea decimales y columnas (<code>%.2f</code>).',
      porque: 'Elegir el adecuado evita que dos salidas queden pegadas en el mismo renglón o con demasiados decimales.',
      ejemplo: '<code>println</code> escribe un renglón y aprieta Enter; <code>print</code> escribe sin apretar Enter.',
      buenaPractica: 'Usá <code>printf("%.2f%n", precio)</code> cuando muestres montos de dinero o promedios con cantidad fija de decimales (ojo: según el idioma de la PC, <code>printf</code> puede mostrar coma decimal).'
    },
    {
      id: 'do_while_foreach',
      lessonId: 11,
      keywords: ['do while', 'do-while', 'for each', 'for-each', 'foreach'],
      title: 'Cuándo usar do-while y for-each',
      que: '<code>do-while</code> ejecuta el bloque al menos una vez y recién al final evalúa la condición; <code>for-each</code> (<code>for (Tipo x : lista)</code>) recorre todos los elementos sin manejar índices.',
      porque: '<code>do-while</code> sirve para menús o pedir datos al menos una vez; <code>for-each</code> evita errores de índice (<code>ArrayIndexOutOfBounds</code>).',
      ejemplo: '<code>do-while</code> es probar la comida una vez antes de decidir si le falta sal; <code>for-each</code> es revisar cada carta del buzón una por una sin numerarlas.',
      buenaPractica: 'Usá <code>for-each</code> siempre que solo leas elementos; usá <code>for</code> clásico cuando necesites el índice o modificar posiciones.'
    },
    {
      id: 'hashset',
      lessonId: null,
      keywords: ['hashset', 'set', 'duplicados', 'conjunto', 'conjuntos'],
      title: 'HashSet y Set: colecciones sin elementos repetidos',
      que: 'Un <code>Set</code> (como <code>HashSet&lt;String&gt;</code>) guarda elementos únicos: si agregás algo repetido, lo ignora automáticamente.',
      porque: 'Evita tener que recorrer toda una lista con un bucle cada vez que querés comprobar si un dato ya existía.',
      ejemplo: 'Un álbum de figuritas sin repetidas o una lista de invitados por DNI único.',
      buenaPractica: 'Si necesitás evitar duplicados y buscar rápido por pertenencia (<code>.contains()</code>), elegí <code>Set</code> en lugar de <code>ArrayList</code>.'
    },
    {
      id: 'lombok',
      lessonId: 109,
      keywords: ['lombok', '@getter', '@setter', '@data', '@requiredargsconstructor', '@slf4j', '@builder'],
      title: 'Qué es Lombok en proyectos Spring Boot',
      que: 'Lombok es una librería que genera automáticamente en compilación getters, setters, constructores y loggers a partir de anotaciones como <code>@Getter</code>, <code>@RequiredArgsConstructor</code> o <code>@Slf4j</code>.',
      porque: 'Ahorra escribir decenas de líneas repetitivas (boilerplate) manteniendo las clases limpias y fáciles de leer.',
      ejemplo: 'Un sello de goma en una oficina: estampás en un segundo un bloque estándar que siempre es igual.',
      buenaPractica: 'En entidades JPA preferí <code>@Getter</code> y <code>@Setter</code> en vez de <code>@Data</code> (que genera <code>equals/toString</code> peligrosos con relaciones), y usá <code>record</code> para DTOs.'
    },
    {
      id: 'errores_compilacion',
      lessonId: 1,
      keywords: ['cannot find symbol', 'incompatible types', 'reached end of file while parsing', 'expected', 'no compila', 'error de compilacion', 'punto y coma', 'llave sin cerrar'],
      title: 'Errores de compilación más comunes en Java',
      que: 'Son los avisos rojos de <code>javac</code> antes de ejecutar: <code>cannot find symbol</code> (variable o método mal escrito o sin declarar), <code>incompatible types</code> (guardar un tipo en otro, ej. <code>String</code> en <code>int</code>), <code>\';\' expected</code> (falta punto y coma) y <code>reached end of file while parsing</code> (falta cerrar una llave <code>}</code>).',
      porque: 'El compilador revisa ortografía, tipos y llaves para evitar que el programa falle a mitad de camino.',
      ejemplo: 'Como un corrector ortográfico antes de imprimir un contrato: te marca exactamente el número de renglón con el desliz.',
      buenaPractica: 'Leé siempre el <strong>primer</strong> error de arriba hacia abajo y mirá el número de línea (y la línea inmediatamente anterior): corregir el primero suele desaparecer los demás.'
    },
    {
      id: 'errores_runtime',
      lessonId: 27,
      keywords: ['arrayindexoutofboundsexception', 'indexoutofboundsexception', 'nullpointerexception', 'numberformatexception', 'inputmismatchexception', 'arithmeticexception', 'stackoverflowerror', 'concurrentmodificationexception'],
      title: 'Excepciones en ejecución (Runtime) más frecuentes',
      que: '<code>NullPointerException</code> (usar un objeto vacío <code>null</code>), <code>ArrayIndexOutOfBoundsException</code> (índice negativo o <code>&gt;= length</code>), <code>NumberFormatException</code> (parsear letras como número) y <code>InputMismatchException</code> (<code>Scanner</code> esperaba número y llegó texto).',
      porque: 'El código estaba bien escrito, pero al correr apareció un dato inesperado o fuera de rango.',
      ejemplo: 'Como ir a buscar el departamento 5 en un edificio que solo tiene pisos 0 a 3: el cartel existe, pero esa puerta no.',
      buenaPractica: 'Revisá los límites de tus índices (<code>0</code> hasta <code>length - 1</code>), validá contra <code>null</code> antes de llamar métodos y envolvê conversiones de entrada en <code>try / catch</code>.'
    },
    {
      id: 'json',
      lessonId: 106,
      keywords: ['json', 'serializar', 'deserializar', 'jackson', 'requestbody', 'body', 'payload'],
      title: 'Qué es JSON y cómo viaja en una API REST',
      que: 'JSON (JavaScript Object Notation) es un formato de texto liviano basado en pares <code>"clave": valor</code> (por ejemplo <code>{"nombre":"Alfajor","precio":1200}</code>) para intercambiar datos entre clientes y servidores.',
      porque: 'Permite que una app web, un celular o Postman hablen con tu backend en Java sin importar en qué lenguaje esté hecho cada uno.',
      ejemplo: 'Un formulario estándar universal que cualquier oficina entiende sin importar el idioma interno de cada empleado.',
      buenaPractica: 'Usá <code>record</code> o clases DTO dedicadas con <code>@RequestBody</code> y dejá que Spring (con Jackson) convierta automáticamente entre JSON y objetos Java.'
    },
    {
      id: 'enum',
      lessonId: null,
      keywords: ['enum', 'enumerado', 'enumeracion', 'estados fijos'],
      title: 'Qué es un enum en Java',
      que: 'Un <code>enum</code> define un conjunto cerrado y fijo de valores posibles (por ejemplo <code>enum EstadoPedido { PENDIENTE, PAGADO, ENVIADO }</code>).',
      porque: 'Evita errores de tipeo que pasarían con <code>String</code> sueltos como <code>"pagdo"</code> o <code>"PAGADO "</code>.',
      ejemplo: 'Un semáforo solo puede estar en ROJO, AMARILLO o VERDE: nunca en "azul".',
      buenaPractica: 'Usá <code>enum</code> siempre que un campo represente categorías, roles o estados fijos en vez de cadenas o números mágicos.'
    },
    {
      id: 'recursividad',
      lessonId: null,
      keywords: ['recursividad', 'recursion', 'recursivo', 'caso base', 'factorial'],
      title: 'Qué es la recursividad (y el caso base)',
      que: 'Es una técnica donde un método se llama a sí mismo con un problema más chico hasta llegar a un <strong>caso base</strong> que corta la cadena.',
      porque: 'Simplifica problemas naturalmente jerárquicos como carpetas dentro de carpetas, árboles o cálculos matemáticos como factorial.',
      ejemplo: 'Abrir muñecas rusas (matrioshkas) una por una hasta llegar a la más chiquita que ya no se abre (el caso base).',
      buenaPractica: 'Definí siempre el caso base en la primera línea del método: si te olvidás de cortar o no achicás el problema, Java lanza <code>StackOverflowError</code>.'
    },
    {
      id: 'buenas_practicas',
      lessonId: 101,
      keywords: ['buena practica', 'buenas practicas', 'consejo', 'consejos', 'tip', 'tips', 'recomendacion', 'estilo', 'profesional'],
      title: 'Las 5 reglas de oro en Java para empezar bien',
      que: 'Hábitos simples desde tu primer programa que te evitan el 80% de los errores comunes.',
      porque: 'Aprender buenos hábitos desde el día uno es mucho más fácil que corregir código confuso después.',
      ejemplo: 'Cocinar limpiando la mesada mientras avanzás: terminás más rápido y sin accidentes.',
      buenaPractica: '1) Nombres claros en <code>camelCase</code>. 2) Identar con 4 espacios. 3) Comparar <code>String</code> con <code>.equals()</code>. 4) Dividir en métodos cortos. 5) No repetir números mágicos ni código.'
    },
    {
      id: 'como_empezar',
      lessonId: 1,
      keywords: ['hola', 'ayuda', 'cero', 'no entiendo', 'no entiendo nada', 'por donde empiezo', 'perdido', 'trabe', 'trabo', 'empezar', 'empiezo', 'como funciona', 'para que', 'que hago'],
      title: 'Cómo destrabarte si empezás con 0 conocimiento',
      que: 'No hace falta memorizar todo antes de probar: leé primero "Qué estás haciendo", mirá el ejemplo del día a día y probá un cambio chico en el editor.',
      porque: 'La programación se entiende haciendo pruebas chicas y leyendo qué respondió la consola o el compilador.',
      ejemplo: 'Como aprender a andar en bici o cocinar: primero probás moverte 2 metros en un tramo corto y después ajustás.',
      buenaPractica: 'Cuando salga un error rojo, mirá primero el número de línea y probá el botón "🐞 Revisar mi código" acá arriba: te explico sin quemarte la respuesta.'
    }
  ];

  // ── Banco curado de consejos de buenas prácticas (>= 25) ──────────────
  var TIPS_JAVA = [
    {
      title: 'Usá nombres que cuenten qué guardan',
      rule: 'Evitá letras sueltas como <code>x</code>, <code>a</code> o <code>temp</code> fuera de contadores de bucle.',
      before: 'double p = 1500 * 1.21;',
      after: 'double precioConIva = precioNeto * IVA_GENERAL;'
    },
    {
      title: 'Compará textos siempre con .equals()',
      rule: 'En Java, <code>==</code> sobre <code>String</code> compara direcciones de memoria y falla con textos leídos por teclado.',
      before: 'if (nombre == "Ana")',
      after: 'if ("Ana".equals(nombre))'
    },
    {
      title: 'Cuidado con la división entera',
      rule: 'Dividir dos <code>int</code> descarta decimales silenciosamente (<code>5 / 2 == 2</code>).',
      before: 'double prom = (85 + 72 + 90) / 3;',
      after: 'double prom = (85 + 72 + 90) / 3.0;'
    },
    {
      title: 'Respetá PascalCase y camelCase',
      rule: 'Clases en Mayúscula (<code>GestorTareas</code>), variables y métodos en minúscula (<code>calcularTotal()</code>), constantes en <code>MAYUSCULAS_CON_GUION</code>.',
      before: 'class gestor_tareas { int TotalVenta; }',
      after: 'class GestorTareas { int totalVenta; }'
    },
    {
      title: 'No dejes números mágicos sueltos',
      rule: 'Si un número como <code>0.21</code> o <code>18</code> representa una regla del negocio, dale nombre con <code>static final</code>.',
      before: 'if (edad >= 18) total = monto * 1.21;',
      after: 'static final int EDAD_MINIMA = 18;\nstatic final double IVA = 1.21;'
    },
    {
      title: 'Evitá la trampa de nextInt() + nextLine()',
      rule: 'Después de <code>nextInt()</code> queda un Enter en el buffer. Leé la línea entera y convertila.',
      before: 'int edad = sc.nextInt();\nString nom = sc.nextLine(); // queda vacío',
      after: 'int edad = Integer.parseInt(sc.nextLine());\nString nom = sc.nextLine();'
    },
    {
      title: 'Devolvé comparaciones booleanas directo',
      rule: 'Si un método devuelve <code>boolean</code>, no hace falta envolverlo en un <code>if (...) return true; else return false;</code>.',
      before: 'if (nota >= 6) { return true; } else { return false; }',
      after: 'return nota >= 6;'
    },
    {
      title: 'Usá llaves { } incluso en if de una línea',
      rule: 'Agregar una segunda línea sin llaves genera bugs silenciosos muy difíciles de ver.',
      before: 'if (activo) saldo += 100;',
      after: 'if (activo) {\n    saldo += 100;\n}'
    },
    {
      title: 'Cuidado con el <= en índices de arrays',
      rule: 'Un array de largo <code>N</code> va de <code>0</code> a <code>N - 1</code>. Usar <code>&lt;=</code> dispara <code>ArrayIndexOutOfBoundsException</code>.',
      before: 'for (int i = 0; i <= notas.length; i++)',
      after: 'for (int i = 0; i < notas.length; i++)'
    },
    {
      title: 'Separá cálculo (return) de impresión (println)',
      rule: 'Un método que devuelve el resultado se puede reutilizar y testear con JUnit; uno que solo imprime no.',
      before: 'static void sumar(int a, int b) { System.out.println(a + b); }',
      after: 'static int sumar(int a, int b) { return a + b; }'
    },
    {
      title: 'Encapsulá atributos con private y validá en setters',
      rule: 'Protegé el estado válido dentro del propio objeto en lugar de confiar en quien lo llama.',
      before: 'public double precio;',
      after: 'private double precio;\npublic void setPrecio(double p) { if (p > 0) this.precio = p; }'
    },
    {
      title: 'Anotá siempre @Override al sobrescribir',
      rule: 'Si cambiás sin querer una letra o parámetro del método padre, el compilador te avisa al instante.',
      before: 'public void hacersonido() { ... }',
      after: '@Override\npublic void hacerSonido() { ... }'
    },
    {
      title: 'Preferí composición antes que herencia forzada',
      rule: 'Heredá solo si "A ES UN B". Si "A TIENE UN B", guardalo como atributo privado.',
      before: 'class Pedido extends Cliente { ... }',
      after: 'class Pedido { private Cliente cliente; }'
    },
    {
      title: 'No borres elementos de ArrayList mientras avanzás con for-each',
      rule: 'Modificar una lista durante un <code>for-each</code> lanza <code>ConcurrentModificationException</code>.',
      before: 'for (Item x : lista) { if (x.vacio()) lista.remove(x); }',
      after: 'lista.removeIf(Item::vacio); // o recorrer i-- hacia atrás'
    },
    {
      title: 'Usá try-with-resources para cerrar archivos automáticamente',
      rule: 'Garantiza que el archivo se cierre siempre, incluso si ocurre una excepción en el medio.',
      before: 'BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"));',
      after: 'try (BufferedWriter bw = new BufferedWriter(new FileWriter("a.txt"))) {\n    ...\n}'
    },
    {
      title: 'Nunca dejes un bloque catch vacío',
      rule: 'Tragarse una excepción oculta fallos reales y vuelve imposible encontrar por qué algo no se guardó.',
      before: 'catch (Exception e) { }',
      after: 'catch (IOException e) { System.out.println("Error al leer archivo: " + e.getMessage()); }'
    },
    {
      title: 'Atrapá excepciones específicas antes que Exception',
      rule: 'Cada fallo distinto merece un mensaje o acción distinta.',
      before: 'catch (Exception e) { ... }',
      after: 'catch (NumberFormatException e) { ... }'
    },
    {
      title: 'Commits pequeños y mensajes claros en Git',
      rule: 'Un commit debe explicar qué cambió para poder volver atrás con precisión.',
      before: 'git commit -m "cambios varios"',
      after: 'git commit -m "Valido precio positivo al crear producto"'
    },
    {
      title: 'Aplicá DRY: extraé lógica duplicada',
      rule: 'Cuando copiás una misma fórmula o regla más de dos veces, convertila en un método.',
      before: 'double t1 = a * 1.21; double t2 = b * 1.21;',
      after: 'double t1 = conIva(a); double t2 = conIva(b);'
    },
    {
      title: 'Usá retornos tempranos (guard clauses) para evitar flechas anidadas',
      rule: 'Validá los casos inválidos al principio del método y salí rápido.',
      before: 'if (u != null) { if (u.activo()) { procesar(u); } }',
      after: 'if (u == null || !u.activo()) return;\nprocesar(u);'
    },
    {
      title: 'Inyectá dependencias por constructor en Spring',
      rule: 'Los campos <code>private final</code> inyectados por constructor garantizan que el objeto nunca arranque incompleto y facilitan tests.',
      before: '@Autowired private ProductoRepository repo;',
      after: 'private final ProductoRepository repo;\npublic ProductoService(ProductoRepository repo) { this.repo = repo; }'
    },
    {
      title: 'Nunca expongas @Entity directo en Controllers: usá DTOs',
      rule: 'Los DTOs (o <code>record</code>) protegen campos sensibles y evitan bucles infinitos al serializar relaciones en JSON.',
      before: 'public List&lt;Usuario&gt; listar()',
      after: 'public List&lt;UsuarioResponse&gt; listar()'
    },
    {
      title: 'Validá en la frontera de entrada con @Valid',
      rule: 'Rechazá datos rotos apenas llegan al Controller antes de ensuciar la capa de servicio o la base.',
      before: 'public ResponseEntity&lt;?&gt; crear(@RequestBody ProductoRequest req)',
      after: 'public ResponseEntity&lt;?&gt; crear(@Valid @RequestBody ProductoRequest req)'
    },
    {
      title: 'Usá Optional como retorno de búsqueda, nunca como parámetro',
      rule: 'Obliga a quien llama a decidir qué hacer cuando no hay resultado (ej. <code>orElseThrow</code>).',
      before: 'Producto buscar(Long id) // devuelve null',
      after: 'Optional&lt;Producto&gt; buscarPorId(Long id)'
    },
    {
      title: 'Nunca subas claves ni contraseñas a Git',
      rule: 'Usá variables de entorno en <code>application.properties</code> o <code>docker-compose.yml</code>.',
      before: 'password=miClaveReal123',
      after: 'password=${DB_PASSWORD}'
    },
    {
      title: 'En tests JUnit probá siempre los valores límite',
      rule: 'Los bugs suelen esconderse justo en el borde (<code>0</code>, <code>5000</code>, cadena vacía, lista con 1 elemento).',
      before: 'verificar(descuento(10000), 9000);',
      after: 'verificar(descuento(5000), 5000); // justo en el límite'
    }
  ];

  // ── Búsqueda en base de conocimiento y lecciones ─────────────────────
  function renderEntry(entry, extraNote) {
    var linkBtn = '';
    if (entry.lessonId === 0) {
      linkBtn = '<div class="bot-card-act"><button type="button" class="pr-link" onclick="JavaBot.goLesson(0)">📖 Leer Capítulo 0 · Antes de escribir código</button></div>';
    } else if (entry.lessonId && typeof currentLesson === 'function') {
      var active = currentLesson();
      if (!active || active.id !== entry.lessonId) {
        linkBtn = '<div class="bot-card-act"><button type="button" class="pr-link" onclick="JavaBot.goLesson(' + entry.lessonId + ')">📖 Ir a la Lección ' + (entry.lessonId % 100) + ' (Fase ' + (entry.lessonId > 100 ? '2' : '1') + ')</button></div>';
      }
    }
    return '<div class="bot-card">' +
      '<div class="bot-card-title">' + esc(entry.title) + '</div>' +
      '<p><strong>Qué es:</strong> ' + entry.que + '</p>' +
      '<p><strong>Por qué / Para qué:</strong> ' + entry.porque + '</p>' +
      '<p><strong>☕ En la vida real:</strong> ' + entry.ejemplo + '</p>' +
      '<p class="bot-bp"><strong>✨ Buena práctica:</strong> ' + entry.buenaPractica + '</p>' +
      (extraNote ? '<p>' + extraNote + '</p>' : '') +
      linkBtn +
      '</div>';
  }

  function renderTip(tip) {
    return '<div class="bot-card">' +
      '<div class="bot-card-title">💡 Buena práctica: ' + esc(tip.title) + '</div>' +
      '<p>' + tip.rule + '</p>' +
      '<pre class="pr-pre">❌ Antes:\n' + esc(tip.before) + '\n\n✅ Mejor así:\n' + esc(tip.after) + '</pre>' +
      '</div>';
  }

  function findBestLesson(q) {
    if (typeof LESSONS === 'undefined') return null;
    var all = LESSONS.concat(typeof LESSONS_F2 !== 'undefined' ? LESSONS_F2 : []);
    var tokens = q.split(/\s+/).filter(function (w) { return w.length >= 3; });
    if (!tokens.length) return null;
    var best = null, bestScore = 0;
    all.forEach(function (l) {
      var g = typeof GuiaCero !== 'undefined' ? GuiaCero.get(l.id) : null;
      var hay = fold(l.title + ' ' + l.desc + ' ' + (g ? g.que + ' ' + g.dia + ' ' + g.tip : ''));
      var sc = 0;
      tokens.forEach(function (t) {
        if (hay.indexOf(t) !== -1) sc += fold(l.title).indexOf(t) !== -1 ? 4 : 1;
      });
      if (sc > bestScore) { bestScore = sc; best = l; }
    });
    return bestScore >= 2 ? best : null;
  }

  var GENERIC_KW = { error: 1, dato: 1, tipo: 1, tipos: 1, codigo: 1, java: 1, valor: 1, get: 1, add: 1, set: 1, map: 1, simple: 1, cuerpo: 1 };

  function escapeRx(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function matchKeyword(q, k) {
    if (!k) return false;
    if (/^[a-z0-9_@.\s-]+$/.test(k) && /[a-z0-9]/.test(k)) {
      return new RegExp('(?:^|[^a-z0-9_@])' + escapeRx(k) + '(?:$|[^a-z0-9_])').test(q);
    }
    return q.indexOf(k) !== -1;
  }

  function ask(rawQuery, ctx) {
    var q = fold(rawQuery);
    var lesson = (ctx && ctx.lesson) || currentLesson();

    if (!q) {
      var tip0 = TIPS_JAVA[tipCursor % TIPS_JAVA.length];
      tipCursor++;
      return { title: tip0.title, lessonId: lesson ? lesson.id : null, html: renderTip(tip0) };
    }

    if (/^(gracias|muchas gracias|mil gracias|genial|perfecto|barbaro|buenisimo|joya|dale|ok|okay|chau|hasta luego)$/.test(q)) {
      return {
        title: '¡De nada!',
        lessonId: lesson ? lesson.id : null,
        html: '<div class="bot-card"><div class="bot-card-title">☕ ¡De nada! Cuando quieras seguimos</div><p>Si te trabás en algún ejercicio o querés un consejo de buenas prácticas, escribime acá.</p></div>'
      };
    }

    if (/^(hola|buenas|buen dia|buenas tardes|buenas noches|hey|que tal)$/.test(q)) {
      return {
        title: '¡Hola! Soy Profe Java',
        lessonId: lesson ? lesson.id : null,
        html: '<div class="bot-card"><div class="bot-card-title">👋 ¡Hola! ¿En qué te ayudo hoy?</div><p>Podés preguntarme por cualquier concepto (<code>variables</code>, <code>== vs equals</code>, <code>Random</code>, <code>Spring</code>, <code>Docker</code>) o tocar <strong>🐞 Revisar mi código</strong> para analizar tu ejercicio.</p></div>'
      };
    }

    if (/^(me sale error|no entiendo el error|tengo un error|me tira error|me da error|no anda|mi codigo no anda|no funciona mi codigo|revisar mi codigo|revisa mi codigo)$/.test(q)) {
      var diag = analyzeCurrentCode();
      return {
        title: 'Revisión de tu código',
        lessonId: lesson ? lesson.id : null,
        html: diag.html + '<div class="bot-card-act"><button type="button" class="pr-link" onclick="JavaBot.openTopic(\'code\')">🐞 Volver a revisar mi código</button></div>'
      };
    }

    if (/\b(consejo|tip|otra buena practica|buena practica al azar)\b/.test(q) && q.split(' ').length <= 5) {
      var tip = TIPS_JAVA[tipCursor % TIPS_JAVA.length];
      tipCursor++;
      return { title: tip.title, lessonId: lesson ? lesson.id : null, html: renderTip(tip) };
    }

    var best = null, bestScore = 0;
    var introEntry = null, introScore = 0;
    KB.forEach(function (item) {
      var score = 0;
      item.keywords.forEach(function (kw) {
        var k = fold(kw);
        if (!k) return;
        if (q === k) score += 24;
        else if (matchKeyword(q, k)) score += GENERIC_KW[k] ? 1 : Math.max(5, k.length);
      });
      if (item.id === 'como_empezar') {
        introEntry = item;
        introScore = score;
        return;
      }
      if (lesson && item.lessonId === lesson.id && score > 0) score += 1;
      if (score > bestScore) { bestScore = score; best = item; }
    });

    if (best && bestScore >= 4) {
      return { title: best.title, lessonId: best.lessonId, html: renderEntry(best) };
    }

    if (introEntry && introScore >= 12) {
      return { title: introEntry.title, lessonId: introEntry.lessonId, html: renderEntry(introEntry) };
    }

    var matchLesson = findBestLesson(q);
    if (matchLesson) {
      var g = typeof GuiaCero !== 'undefined' ? GuiaCero.get(matchLesson.id) : null;
      var lad = typeof PRACTICA !== 'undefined' && PRACTICA[matchLesson.id] ? PRACTICA[matchLesson.id].escalera : null;
      if (g) {
        return {
          title: matchLesson.title,
          lessonId: matchLesson.id,
          html: renderEntry({
            lessonId: matchLesson.id,
            title: 'Lección ' + (matchLesson.id % 100) + ': ' + matchLesson.title,
            que: g.que,
            porque: g.porque + ' ' + g.paraque,
            ejemplo: g.dia + (lad && lad.vida ? ' ' + lad.vida : ''),
            buenaPractica: g.tip
          })
        };
      }
    }

    if (introEntry && introScore >= 4) {
      return { title: introEntry.title, lessonId: introEntry.lessonId, html: renderEntry(introEntry) };
    }

    // Fallback amigable contextualizado en la lección actual
    if (lesson && typeof GuiaCero !== 'undefined' && GuiaCero.get(lesson.id)) {
      var curG = GuiaCero.get(lesson.id);
      return {
        title: lesson.title,
        lessonId: lesson.id,
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">🤖 Todavía no tengo una ficha exacta para "' + esc(rawQuery) + '", pero puedo orientarte</div>' +
          '<p>Probá preguntar por conceptos como <code>variables</code>, <code>String equals</code>, <code>if/else</code>, <code>while</code>, <code>arrays</code>, <code>clases</code>, <code>ArrayList</code>, <code>try-catch</code>, <code>SOLID</code>, <code>DTO</code> o <code>buenas prácticas</code>.</p>' +
          '<p>Mientras tanto, en tu lección actual (<strong>' + esc(lesson.title) + '</strong>): ' + curG.que + '</p>' +
          '<p class="bot-bp"><strong>✨ Consejo clave:</strong> ' + curG.tip + '</p>' +
          '</div>'
      };
    }

    return {
      title: 'Ayuda general Java',
      lessonId: null,
      html: renderEntry(KB[KB.length - 1])
    };
  }

  // ── Analizador de código actual + errores ────────────────────────────
  function explainRuntime(runtime) {
    if (/ArrayIndexOutOfBounds/i.test(runtime)) {
      return 'Intentaste leer una posición del array que no existe. Recordá que los índices empiezan en <code>0</code> y terminan en <code>length - 1</code>.';
    }
    if (/NullPointerException/i.test(runtime)) {
      return 'Trataste de usar un método sobre una variable que todavía está vacía (<code>null</code>), como abrir un sobre sin carta adentro.';
    }
    if (/InputMismatchException/i.test(runtime)) {
      return 'El <code>Scanner</code> esperaba un número, pero el texto que llegó no era un número entero/decimal. Revisá el orden de lectura o usá <code>Integer.parseInt(sc.nextLine())</code>.';
    }
    if (/NumberFormatException/i.test(runtime)) {
      return 'Intentaste convertir a número un texto que tiene letras o símbolos (por ejemplo <code>Integer.parseInt("abc")</code>). Envolvelo en <code>try / catch</code>.';
    }
    if (/ArithmeticException/i.test(runtime)) {
      return 'Dividiste por cero, que en matemática y en enteros de Java es imposible.';
    }
    return 'El programa compiló bien, pero se frenó al ejecutar una operación inválida en esa línea.';
  }

  function analyzeCurrentCode() {
    var lesson = currentLesson();
    if (!lesson) return { html: '<p>No detecté una lección activa.</p>' };
    var g = typeof GuiaCero !== 'undefined' ? GuiaCero.get(lesson.id) : null;

    if (lesson.quiz) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">📝 Cuestionario: ' + esc(lesson.title) + '</div>' +
          '<p>Esta lección se evalúa con preguntas conceptuales.</p>' +
          (g ? '<p><strong>Para qué te sirve:</strong> ' + g.paraque + '</p><p class="bot-bp"><strong>✨ Tip antes de responder:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    var ed = typeof document !== 'undefined' ? document.getElementById('code-editor') : null;
    if (!ed) {
      var isManual = typeof document !== 'undefined' && !!document.getElementById('libro');
      if (isManual) {
        var mnEd = document.querySelector('textarea.mn-editor');
        if (mnEd && typeof JavaRun !== 'undefined') {
          var mr = JavaRun.run(mnEd.value || '', { stdin: [] });
          if (mr.compile) {
            return {
              html: '<div class="bot-card"><div class="bot-card-title">🔎 Revisión del ejemplo editado (Línea ' + esc(mr.compile.line) + ')</div>' +
                '<p><strong>Error:</strong> <code>' + esc(mr.compile.javac) + '</code></p>' +
                (mr.compile.why ? '<p>' + esc(mr.compile.why) + '</p>' : '') + '</div>'
            };
          }
          if (mr.exception) {
            return {
              html: '<div class="bot-card"><div class="bot-card-title">💥 Excepción al ejecutar el ejemplo</div>' +
                '<p><code>' + esc(mr.exception) + '</code></p><p>' + explainRuntime(mr.exception) + '</p></div>'
            };
          }
          if (mr.unsupported) {
            return {
              html: '<div class="bot-card"><div class="bot-card-title">ℹ️ Fuera del emulador del navegador</div>' +
                '<p>Este fragmento usa <code>' + esc(mr.unsupported) + '</code>, que el emulador del navegador no simula. En tu JDK real funciona.</p></div>'
            };
          }
          return {
            html: '<div class="bot-card"><div class="bot-card-title">✅ El ejemplo editado compila y corre bien</div>' +
              '<p><strong>Salida:</strong></p><pre class="pr-pre">' + esc(mr.output || '(sin salida)') + '</pre></div>'
          };
        }
        return {
          html: '<div class="bot-card"><div class="bot-card-title">📖 Estás leyendo el Manual</div>' +
            '<p>Hacé clic en <strong>✎ Editar</strong> en cualquier ejemplo ejecutable del libro para modificarlo y volver a pedirme que lo revise, o volvé al <a href="index.html">curso interactivo</a> para practicar los desafíos.</p>' +
            (g ? '<p class="bot-bp"><strong>✨ Tip del capítulo:</strong> ' + g.tip + '</p>' : '') +
            '</div>'
        };
      }
      return {
        html: '<div class="bot-card"><div class="bot-card-title">💻 Ejercicio de la lección</div>' +
          '<p>Abrí la pestaña <strong>💻 Ejercicio</strong> para escribir código y te lo reviso al instante.</p>' +
          (g ? '<p class="bot-bp"><strong>✨ Tip:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    var code = ed.value || '';
    if (typeof localValidate !== 'function') {
      return { html: '<p>El validador local no está disponible en este contexto.</p>' };
    }

    var res = localValidate(lesson.id, code);
    var style = (!lesson.git && typeof styleNotes === 'function') ? styleNotes(code) : '';
    var expected = lesson.exercise && lesson.exercise.expected ? lesson.exercise.expected.replace(/\\n/g, '\n').trimEnd() : '';

    if (res.syntax) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">🔎 Revisión de tu código (Línea ' + esc(res.line) + ')</div>' +
          '<p><strong>Qué pasó:</strong> Java encontró un error de escritura antes de poder correr: <code>' + esc(res.javac) + '</code></p>' +
          '<p><strong>Por qué te frena:</strong> ' + esc(res.why || 'El compilador necesita que cada palabra, llave y punto y coma siga sus reglas exactas.') + '</p>' +
          (res.suggest ? '<p class="bot-bp"><strong>🛠️ Cómo destrabarte (sin spoiler):</strong> ' + esc(res.suggest) + '</p>' : '') +
          '</div>'
      };
    }

    if (res.runtime) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">💥 Se detuvo al ejecutar' + (res.blameLine ? ' (Línea ' + res.blameLine + ')' : '') + '</div>' +
          '<p><code>' + esc(res.runtime) + '</code></p>' +
          '<p><strong>En criollo:</strong> ' + explainRuntime(res.runtime) + '</p>' +
          (g ? '<p class="bot-bp"><strong>✨ Buena práctica:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    if (res.err) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">🔎 Revisión de comandos</div>' +
          '<p><strong>Qué ajustar:</strong> ' + esc(res.err) + '</p>' +
          (g ? '<p class="bot-bp"><strong>✨ Buena práctica:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    if (res.simulated) {
      var got = typeof normalizeOutput === 'function' ? normalizeOutput(res.output) : String(res.output || '').trimEnd();
      var wanted = typeof normalizeOutput === 'function' ? normalizeOutput(expected) : expected.trimEnd();
      if (got === wanted && res.conceptErr) {
        return {
          html: '<div class="bot-card">' +
            '<div class="bot-card-title">🟡 ¡Casi! La consola coincide, pero falta aplicar el tema</div>' +
            '<p>' + esc(res.conceptErr) + '</p>' +
            '<p><strong>Por qué importa:</strong> Si escribís el resultado a mano sin usar la herramienta de esta lección, el programa no sirve cuando cambien los datos.</p>' +
            (style ? '<p class="bot-bp"><strong>✨ Estilo:</strong> ' + style + '</p>' : '') +
            '</div>'
        };
      }
      if (got === wanted) {
        return {
          html: '<div class="bot-card">' +
            '<div class="bot-card-title">✅ ¡Tu código ya cumple la consigna!</div>' +
            '<p>La salida coincide exactamente con lo esperado.</p>' +
            (style ? '<p class="bot-bp"><strong>✨ Mejora de estilo recomendada:</strong> ' + style + '</p>' : '') +
            (g ? '<p class="bot-bp"><strong>💡 Buena práctica para llevarte:</strong> ' + g.tip + '</p>' : '') +
            '</div>'
        };
      }
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">🧪 Tu código corrió, pero imprime otra cosa</div>' +
          '<p><strong>Imprimió:</strong></p><pre class="pr-pre">' + esc(got || '(nada)') + '</pre>' +
          '<p>Revisá mayúsculas, tildes, espacios y si falta algún cálculo o bucle. ' + (res.suggest ? esc(res.suggest) : '') + '</p>' +
          (style ? '<p class="bot-bp"><strong>✨ Además noté esto de estilo:</strong> ' + style + '</p>' : '') +
          '</div>'
      };
    }

    if (res.unsupported) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">ℹ️ Fuera del emulador del navegador</div>' +
          '<p>Tu código usa algo que el emulador del navegador no simula (<code>' + esc(res.unsupported) + '</code>). Eso no significa que esté mal: probalo en tu JDK local o resolvé con las herramientas de esta lección.</p>' +
          (g ? '<p class="bot-bp"><strong>✨ Buena práctica:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    if (res.ok) {
      return {
        html: '<div class="bot-card">' +
          '<div class="bot-card-title">✅ ¡Secuencia correcta!</div>' +
          (g ? '<p class="bot-bp"><strong>✨ Buena práctica:</strong> ' + g.tip + '</p>' : '') +
          '</div>'
      };
    }

    return { html: '<p>Probá ejecutar tu código primero y después pedime una revisión.</p>' };
  }

  // ── UI del Bot en el navegador ───────────────────────────────────────
  function ensureDom() {
    if (initialized || typeof document === 'undefined' || !document.body) return;
    initialized = true;

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.id = 'java-bot-fab';
    fab.className = 'bot-fab';
    fab.setAttribute('aria-label', 'Abrir bot de ayuda Profe Java');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = '🤖 <span>Profe Java</span>';
    fab.addEventListener('click', toggle);

    var panel = document.createElement('section');
    panel.id = 'java-bot-panel';
    panel.className = 'bot-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Profe Java — Bot de ayuda');
    panel.hidden = true;
    panel.innerHTML =
      '<div class="bot-head">' +
        '<div>' +
          '<div class="bot-title">☕ Profe Java · Ayuda 0 Conocimiento</div>' +
          '<div class="bot-sub" id="java-bot-sub">Listo para ayudarte</div>' +
        '</div>' +
        '<button type="button" id="java-bot-close" class="bot-close" aria-label="Cerrar bot de ayuda">✕</button>' +
      '</div>' +
      '<div class="bot-chips">' +
        '<button type="button" class="bot-chip" data-topic="lesson">🧭 ¿Qué hago y para qué?</button>' +
        '<button type="button" class="bot-chip" data-topic="vida">🏠 Ejemplo del día a día</button>' +
        '<button type="button" class="bot-chip" data-topic="tip">✨ Buenas prácticas</button>' +
        '<button type="button" class="bot-chip" data-topic="code">🐞 Revisar mi código</button>' +
        '<button type="button" class="bot-chip" data-topic="random">💡 Consejo Java</button>' +
      '</div>' +
      '<div class="bot-msgs" id="java-bot-msgs" aria-live="polite"></div>' +
      '<form class="bot-form" id="java-bot-form">' +
        '<input type="text" id="java-bot-input" autocomplete="off" placeholder="Preguntá algo de Java o buenas prácticas…">' +
        '<button type="submit" class="bot-send">Enviar</button>' +
      '</form>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    document.getElementById('java-bot-close').addEventListener('click', close);
    panel.querySelectorAll('.bot-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openTopic(btn.getAttribute('data-topic'));
      });
    });
    document.getElementById('java-bot-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = document.getElementById('java-bot-input');
      var text = inp.value.trim();
      if (!text) return;
      inp.value = '';
      appendMsg('user', esc(text));
      var ans = ask(text);
      appendMsg('bot', ans.html);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panelOpen) close();
    });

    appendMsg('bot',
      '<div class="bot-card">' +
        '<div class="bot-card-title">👋 ¡Hola! Soy Profe Java</div>' +
        '<p>Si empezás con <strong>0 conocimiento</strong>, tocá cualquiera de los botones de arriba o escribime tu duda (ej. <em>"para qué sirve equals"</em>, <em>"qué es un constructor"</em>, <em>"buenas prácticas"</em> o <em>"no entiendo el error"</em>).</p>' +
      '</div>'
    );
    syncLesson(currentLesson());
  }

  function appendMsg(role, html) {
    ensureDom();
    var box = document.getElementById('java-bot-msgs');
    if (!box) return;
    var el = document.createElement('div');
    el.className = 'bot-msg ' + role;
    el.innerHTML = html;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
  }

  function open() {
    ensureDom();
    var panel = document.getElementById('java-bot-panel');
    var fab = document.getElementById('java-bot-fab');
    if (!panel || !fab) return;
    panel.hidden = false;
    panelOpen = true;
    fab.setAttribute('aria-expanded', 'true');
    syncLesson(currentLesson());
    var inp = document.getElementById('java-bot-input');
    if (inp) inp.focus();
  }

  function close() {
    var panel = document.getElementById('java-bot-panel');
    var fab = document.getElementById('java-bot-fab');
    if (!panel || !fab) return;
    panel.hidden = true;
    panelOpen = false;
    fab.setAttribute('aria-expanded', 'false');
    fab.focus();
  }

  function toggle() {
    if (panelOpen) close();
    else open();
  }

  function syncLesson(lesson) {
    var sub = typeof document !== 'undefined' ? document.getElementById('java-bot-sub') : null;
    if (!sub || !lesson) return;
    sub.textContent = 'Lección ' + (lesson.id % 100) + ' · ' + lesson.title;
  }

  function openTopic(topic) {
    open();
    var l = currentLesson();
    var g = l && typeof GuiaCero !== 'undefined' ? GuiaCero.get(l.id) : null;
    var lad = l && typeof PRACTICA !== 'undefined' && PRACTICA[l.id] ? PRACTICA[l.id].escalera : null;

    if (topic === 'lesson') {
      appendMsg('user', '¿Qué estoy haciendo acá, por qué y para qué?');
      if (l && g) {
        appendMsg('bot',
          '<div class="bot-card">' +
            '<div class="bot-card-title">🧭 ' + esc(l.title) + '</div>' +
            '<p><strong>Qué hacés:</strong> ' + g.que + '</p>' +
            '<p><strong>Por qué existe:</strong> ' + g.porque + '</p>' +
            '<p><strong>Para qué sirve:</strong> ' + g.paraque + '</p>' +
            '<p><strong>🎯 Práctica:</strong> ' + g.practica + '</p>' +
          '</div>'
        );
      } else {
        appendMsg('bot', ask('como empezar').html);
      }
      return;
    }

    if (topic === 'vida') {
      appendMsg('user', 'Dame un ejemplo del día a día');
      if (l && g) {
        appendMsg('bot',
          '<div class="bot-card">' +
            '<div class="bot-card-title">🏠 En la vida diaria: ' + esc(l.title) + '</div>' +
            '<p><strong>Ejemplo cotidiano:</strong> ' + g.dia + '</p>' +
            (lad && lad.vida ? '<p><strong>Otro ángulo:</strong> ' + lad.vida + '</p>' : '') +
            (lad && lad.real ? '<p><strong>💼 En un sistema real:</strong> ' + lad.real + '</p>' : '') +
          '</div>'
        );
      } else {
        appendMsg('bot', ask('buenas practicas').html);
      }
      return;
    }

    if (topic === 'tip') {
      appendMsg('user', 'Dame un consejo de buenas prácticas para esta lección');
      var randTip = TIPS_JAVA[tipCursor % TIPS_JAVA.length];
      tipCursor++;
      if (l && g) {
        appendMsg('bot',
          '<div class="bot-card">' +
            '<div class="bot-card-title">✨ Buena práctica en: ' + esc(l.title) + '</div>' +
            '<p>' + g.tip + '</p>' +
          '</div>' + renderTip(randTip)
        );
      } else {
        appendMsg('bot', renderTip(randTip));
      }
      return;
    }

    if (topic === 'code') {
      appendMsg('user', 'Revisá mi código actual y dame un consejo');
      appendMsg('bot', analyzeCurrentCode().html);
      return;
    }

    if (topic === 'random') {
      appendMsg('user', 'Tirame un consejo práctico de Java');
      var tip = TIPS_JAVA[tipCursor % TIPS_JAVA.length];
      tipCursor++;
      appendMsg('bot', renderTip(tip));
      return;
    }

    var ans = ask(String(topic || ''));
    appendMsg('bot', ans.html);
  }

  function goLesson(id) {
    if (id === 0) {
      if (typeof document !== 'undefined' && document.getElementById('cap-0')) {
        document.getElementById('cap-0').scrollIntoView({ behavior: 'smooth', block: 'start' });
        close();
      } else if (typeof location !== 'undefined') {
        location.href = 'manual.html#cap-0';
      }
      return;
    }
    if (typeof showFase === 'function' && typeof LESSONS !== 'undefined' && typeof LESSONS_F2 !== 'undefined') {
      var isF2 = id > 100;
      if (isF2 && typeof fase2Unlocked === 'function' && !fase2Unlocked()) {
        appendMsg('bot', '<p>🔒 Esa es una lección de Fase 2. Se abre al completar la Fase 1 o aprobando la prueba de nivel.</p>');
        return;
      }
      if (typeof fase !== 'undefined' && ((isF2 && fase !== 2) || (!isF2 && fase !== 1))) {
        showFase(isF2 ? 2 : 1);
      }
      var list = isF2 ? LESSONS_F2 : LESSONS;
      var idx = list.findIndex(function (x) { return x.id === id; });
      if (idx !== -1 && typeof goTo === 'function') goTo(idx);
      return;
    }
    if (typeof document !== 'undefined') {
      var cap = document.getElementById('cap-' + id);
      if (cap) {
        cap.scrollIntoView({ behavior: 'smooth', block: 'start' });
        close();
        return;
      }
      if (typeof MANUAL !== 'undefined' && MANUAL.TOMOS) {
        var tomo = MANUAL.TOMOS.find(function (t) { return t.ids.indexOf(id) !== -1; });
        if (tomo) {
          location.href = 'manual.html?tomo=' + tomo.id + '#cap-' + id;
        }
      }
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureDom);
    else ensureDom();
  }

  return {
    KB: KB,
    TIPS_JAVA: TIPS_JAVA,
    ask: ask,
    analyzeCurrentCode: analyzeCurrentCode,
    open: open,
    close: close,
    toggle: toggle,
    openTopic: openTopic,
    syncLesson: syncLesson,
    goLesson: goLesson
  };
})();
