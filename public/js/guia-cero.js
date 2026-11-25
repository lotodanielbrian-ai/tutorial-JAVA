// Java INPRO — Guía pedagógica "0 Conocimiento" (cobertura 60/60 lecciones)
// Responde en cada lección: Qué estás haciendo · Por qué · Para qué · Ejemplo del día a día · Buena práctica.
// También completa PRACTICA[id].antes en las 42 lecciones que aún no tenían pregunta previa, sin pisar las existentes.
var GuiaCero = (function () {
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var DATA = {
    1: {
      que: 'Estás escribiendo tu primera orden real para que la computadora muestre un mensaje en pantalla.',
      porque: 'La computadora no adivina intenciones: necesita saber dónde empieza el programa (<code>main</code>) y dónde termina cada orden (<code>;</code>).',
      paraque: 'Todo sistema —un cajero, una app bancaria o un juego— arranca ejecutando instrucciones línea por línea desde <code>main</code>.',
      dia: 'Pensá en el cartel de una panadería al abrir: ponés un letrero en la vidriera que dice "¡Recién horneado!". Si no colgás el letrero dentro del horario de apertura (<code>main</code>), nadie lo lee.',
      practica: 'Vas a modificar y agregar llamadas a <code>System.out.println(...)</code> para controlar qué aparece en la consola.',
      tip: 'Respetá mayúsculas y minúsculas (<code>System</code> con S mayúscula) y terminá cada instrucción con <code>;</code>.',
      antes: ['¿Alguna vez le diste una orden exacta a alguien por mensaje de texto para que no haya malentendidos?', 'Programar es eso mismo: darle a la computadora órdenes exactas, paso a paso, usando palabras que Java entiende.']
    },
    2: {
      que: 'Estás creando "cajitas" con nombre y etiqueta de tipo para guardar datos en memoria.',
      porque: 'Java exige aclarar qué vas a guardar (<code>int</code>, <code>double</code>, <code>String</code>, <code>boolean</code>) para no mezclar cuentas de plata con texto.',
      paraque: 'Cada dato de un usuario —nombre, saldo, edad o si está activo— vive guardado en una variable mientras corre el programa.',
      dia: 'En la cocina tenés frascos rotulados: "Sal", "Azúcar", "Harina". No ponés agua en una bolsa de papel ni azúcar en el frasco de aceite: cada envase (tipo de dato) cuida lo que guarda.',
      practica: 'Vas a declarar cuatro variables de distinto tipo y mostrarlas combinadas en pantalla.',
      tip: 'Usá nombres que se entiendan solos en <code>camelCase</code> (ej. <code>precioFinal</code> en lugar de <code>p</code> o <code>x</code>).',
      antes: ['¿Si tenés una lista de compras, qué datos anotás con números y cuáles con palabras?', 'Las cantidades y precios son números (<code>int</code>/<code>double</code>) y los nombres de productos son texto (<code>String</code>).']
    },
    3: {
      que: 'Estás haciendo cuentas matemáticas con variables y guardando cada resultado.',
      porque: 'En Java dividir dos enteros (<code>7 / 2</code>) descarta los decimales (da <code>3</code>), y el operador <code>%</code> te da el resto de la división.',
      paraque: 'Calcular totales, cuotas, descuentos, vueltos o saber si un número es par depende directamente de estos cinco operadores.',
      dia: 'Tenés 7 alfajores para repartir entre 2 amigos en partes iguales: a cada uno le tocan <code>3</code> enteros (<code>7 / 2</code>) y sobra <code>1</code> en la caja (<code>7 % 2</code>).',
      practica: 'Vas a sumar, restar, multiplicar, dividir y sacar el resto usando variables en lugar de números escritos a mano.',
      tip: 'Calculá con variables (<code>precio * cantidad</code>), nunca escribas el resultado fijo: si cambia un precio, el programa recalcula solo.'
    },
    4: {
      que: 'Estás trabajando con texto (<code>String</code>) usando herramientas listas para medir, limpiar y comparar palabras.',
      porque: 'Un texto ingresado por una persona suele traer espacios de más o mayúsculas mezcladas, y en Java dos <code>String</code> se comparan con <code>.equals()</code>, no con <code>==</code>.',
      paraque: 'Validar correos, formatear nombres en facturas o buscar palabras en un buscador usa estos métodos todos los días.',
      dia: 'Cuando buscás "yerba" en una tienda online aunque alguien lo haya cargado como " YERBA ", el sistema limpia espacios (<code>trim</code>) y unifica mayúsculas/minúsculas antes de comparar.',
      practica: 'Vas a transformar un texto con <code>.toUpperCase()</code>, contar letras con <code>.length()</code>, extraer una inicial y verificar si contiene una palabra.',
      tip: 'Para comparar el contenido de dos textos usá siempre <code>texto1.equals(texto2)</code>; dejá <code>==</code> solo para números y booleanos.',
      antes: ['Si alguien escribe "  Ana  " con espacios en un formulario, ¿es igual a "Ana" para vos?', 'Para una persona sí, pero para la computadora los espacios son caracteres distintos: por eso primero se limpia el texto con <code>.trim()</code>.']
    },
    5: {
      que: 'Estás pasando datos de un tipo a otro (texto a número o decimal a entero) y usando fórmulas de <code>Math</code>.',
      porque: 'Todo lo que llega de un formulario o teclado entra como texto (<code>String</code>), pero para sumar o promediar necesitás convertirlo a número.',
      paraque: 'Convertir precios ingresados como texto, redondear cuotas y calcular distancias o raíces cuadradas.',
      dia: 'Un billete dice "$1500" impreso en papel (texto), pero para calcular cuánto vuelto dar primero tenés que leerlo como valor numérico (<code>1500</code>).',
      practica: 'Vas a truncar un decimal con <code>(int)</code>, redondear con <code>Math.round</code> y sacar raíz con <code>Math.sqrt</code>.',
      tip: 'Recordá que <code>Math.round(double)</code> devuelve un <code>long</code> (no un <code>int</code>), y que dividir por <code>3.0</code> conserva decimales mientras <code>/ 3</code> entre enteros trunca.'
    },
    6: {
      que: 'Estás integrando todo el nivel Súper Básico en un boletín completo.',
      porque: 'En la vida real los problemas nunca vienen separados por tema: combinan texto limpio, cálculos y conversiones juntos.',
      paraque: 'Afianzar la base antes de empezar a tomar decisiones con <code>if</code> y repetir acciones con bucles.',
      dia: 'Como armar un recibo completo de club o escuela: recibís un nombre desprolijo, calculás el promedio de 3 notas y lo imprimís prolijo.',
      practica: 'Vas a limpiar un nombre con <code>.trim().toUpperCase()</code> y calcular el promedio entero de tres notas.',
      tip: 'Si dividís <code>(85 + 72 + 90) / 3</code> entre enteros da <code>82</code>; si querés promedio decimal exacto dividí por <code>3.0</code> antes de redondear.'
    },
    7: {
      que: 'Estás enseñándole al programa a elegir distintos caminos según se cumpla o no una condición.',
      porque: 'Sin condicionales todos los usuarios recibirían siempre el mismo mensaje sin importar su nota, edad o saldo.',
      paraque: 'Aprobar o desaprobar exámenes, aplicar descuentos, validar contraseñas o bloquear compras sin saldo.',
      dia: 'Al subir al colectivo apoyás la tarjeta SUBE: <strong>si</strong> tenés saldo suficiente pasa a verde y cobrás; <strong>si no</strong>, suena rojo y muestra "Saldo insuficiente".',
      practica: 'Vas a clasificar una nota numérica en "Excelente", "Bueno" o "Regular" usando <code>if</code>, <code>else if</code> y <code>else</code>.',
      tip: 'Ordená las condiciones de la más exigente a la menos exigente (ej. primero <code>&gt;= 90</code>, después <code>&gt;= 75</code>) para que no caigan en la rama equivocada.',
      antes: ['¿Cómo decidís si llevás paraguas antes de salir de casa?', 'Mirás el pronóstico (condición): si dice lluvia, llevás paraguas; si no, salís sin él. Eso es un <code>if / else</code>.']
    },
    8: {
      que: 'Estás eligiendo entre varias opciones puntuales de una misma variable usando <code>switch</code>.',
      porque: 'Cuando comparás un mismo número o texto contra 5 o 7 valores fijos, <code>switch</code> se lee mucho más limpio que encadenar siete <code>else if</code>.',
      paraque: 'Menús de cajero automático, días de la semana, estados de un pedido o tipos de envío.',
      dia: 'En el ascensor apretás un número concreto (1, 2, 3 o PB): cada botón lleva directamente a un piso fijo, y si apretás algo inválido no hace nada (<code>default</code>).',
      practica: 'Vas a convertir un número del 1 al 7 en el nombre del día correspondiente con <code>switch</code>, <code>case</code>, <code>break</code> y <code>default</code>.',
      tip: 'No olvides el <code>break;</code> al final de cada <code>case</code> tradicional: sin él, Java sigue ejecutando los casos de abajo (fall-through).'
    },
    9: {
      que: 'Estás combinando varias condiciones al mismo tiempo con Y (<code>&amp;&amp;</code>), O (<code>||</code>) y NO (<code>!</code>).',
      porque: 'Las decisiones reales casi nunca dependen de un solo dato: suelen exigir dos requisitos juntos o una alternativa.',
      paraque: 'Reglas de negocio como "puede comprar si es mayor de edad <strong>Y</strong> tiene saldo", o "entra gratis si es jubilado <strong>O</strong> menor de 5".',
      dia: 'Para retirar un paquete en el correo necesitás tu DNI <strong>Y</strong> el código de seguimiento (<code>&amp;&amp;</code>); para pagar podés usar débito <strong>O</strong> efectivo (<code>||</code>).',
      practica: 'Vas a verificar si una persona puede ingresar combinando edad y entrada válida con <code>&amp;&amp;</code>.',
      tip: 'Usá paréntesis cuando mezcles <code>&amp;&amp;</code> y <code>||</code> para que cualquier lector entienda al instante el orden de evaluación.'
    },
    10: {
      que: 'Estás leyendo datos que escribe el usuario desde el teclado mediante <code>Scanner</code>.',
      porque: 'Hasta acá los datos estaban fijos en el código; con <code>Scanner</code> el programa reacciona a entradas reales externas.',
      paraque: 'Cualquier programa interactivo de consola, menú de opciones o carga de pedidos empieza leyendo entradas.',
      dia: 'Es como hablar con el empleado de una ventanilla: el sistema pregunta "¿Cómo te llamás?", espera a que respondas, y recién ahí usa tu nombre.',
      practica: 'Vas a leer un nombre y una edad desde la entrada simulada usando <code>Scanner</code> y saludar con esos datos.',
      tip: 'Si leés un número con <code>nextInt()</code> y después un texto con <code>nextLine()</code>, queda un Enter suelto en el buffer: preferí leer con <code>Integer.parseInt(sc.nextLine())</code>.',
      antes: ['¿Qué cambia entre una película grabada y un videojuego?', 'La película muestra siempre lo mismo; el videojuego espera tu entrada (teclado o botón) y responde según lo que hiciste.']
    },
    11: {
      que: 'Estás repitiendo un bloque de instrucciones mientras una condición siga siendo verdadera (<code>while</code>).',
      porque: 'No vas a copiar y pegar 100 veces la misma línea ni sabés siempre de antemano cuántas veces habrá que insistir hasta lograr un dato válido.',
      paraque: 'Reintentar una contraseña hasta acertar, leer archivo línea por línea hasta el final o mantener vivo un menú hasta que el usuario elija salir.',
      dia: 'Seguís revolviendo el café <em>mientras</em> queden grumos de azúcar sin disolver: no contaste 7 vueltas exactas, parás cuando se cumple la condición.',
      practica: 'Vas a contar del 1 al 5 con un bucle <code>while</code> actualizando la variable contador en cada vuelta.',
      tip: 'Verificá siempre que dentro del <code>while</code> cambie algo que acerque la condición a <code>false</code>, o vas a crear un bucle infinito.',
      antes: ['¿Cuándo dejás de cargar nafta en el tanque?', 'Cuando el surtidor detecta que está lleno: repetís "cargar" mientras siga habiendo lugar.']
    },
    12: {
      que: 'Estás usando el bucle <code>for</code> para repetir una tarea un número exacto de veces con contador automático.',
      porque: 'El <code>for</code> junta en una sola línea el inicio, la condición de corte y el avance del contador, evitando olvidar incrementarlo.',
      paraque: 'Generar tablas, imprimir facturas por renglón, repetir 10 cuotas o recorrer cada casillero de un arreglo.',
      dia: 'Subir una escalera de 10 escalones contando del 1 al 10: sabés exactamente dónde arrancás, cuándo llegaste arriba y que vas de a 1 escalón.',
      practica: 'Vas a generar la tabla de multiplicar del 5 usando un bucle <code>for</code>.',
      tip: 'Usá <code>i &lt; n</code> cuando recorrés índices desde <code>0</code> (de <code>0</code> a <code>n - 1</code>) y <code>i &lt;= n</code> solo cuando contás desde <code>1</code> hasta <code>n</code> inclusive.',
      antes: ['Si tenés que entregar 5 recibos numerados del 1 al 5, ¿qué cambia entre un recibo y el siguiente?', 'Solo cambia el número de orden: la acción de imprimir es idéntica 5 veces seguidas.']
    },
    13: {
      que: 'Estás guardando varios valores del mismo tipo juntos dentro de un arreglo (<code>array</code>) numerado desde 0.',
      porque: 'Sería imposible trabajar con 1.000 notas creando variables <code>nota1, nota2... nota1000</code> por separado.',
      paraque: 'Listas de precios fijas, notas de un curso, días del mes, asientos de una fila o mediciones de sensores.',
      dia: 'Pensá en una huevera de 6 lugares o un edificio con departamentos del 0 al 5: todos guardan lo mismo y cada puerta tiene un número de índice fijo.',
      practica: 'Vas a declarar un array de números, recorrerlo con un bucle y calcular su suma y máximo.',
      tip: 'En Java los índices arrancan en <code>0</code> y el último es <code>array.length - 1</code>; si usás <code>&lt;= array.length</code> salta <code>ArrayIndexOutOfBoundsException</code>.',
      antes: ['¿Por qué en un casillero de correos cada puerta tiene un número consecutivo?', 'Para ubicar rápido cualquier carta por su posición exacta, sin tener que ponerle un nombre inventado a cada puerta.']
    },
    14: {
      que: 'Estás conociendo los estilos principales de pensar y organizar código (paradigmas).',
      porque: 'No todos los lenguajes resuelven igual: entender "qué es imperativo vs orientado a objetos" te ubica antes de pasar a métodos y clases.',
      paraque: 'En entrevistas técnicas y equipos reales necesitás saber por qué Java prioriza objetos y cuándo conviene expresar qué querés (declarativo).',
      dia: 'Pedir un plato en un restaurante describiendo qué querés ("una milanesa con puré", declarativo) vs cocinar paso a paso siguiendo la receta (imperativo).',
      practica: 'Vas a responder un cuestionario conceptual comparando paradigma imperativo, declarativo, funcional y orientado a objetos.',
      tip: 'No memorices definiciones de diccionario: asociá cada paradigma con un ejemplo concreto de cómo resuelve el mismo problema.'
    },
    15: {
      que: 'Estás resolviendo tu primer examen integrador combinando arrays, bucles y condicionales.',
      porque: 'Pasar de ejemplos sueltos a resolver un problema completo te muestra si podés encadenar variables, recorridos e <code>if</code> sin trabarte.',
      paraque: 'Procesar ventas, notas o estadísticas simples como en un parcial universitario o prueba técnica inicial.',
      dia: 'Cerrar la caja de un kiosco al final del día: recorrés cada ticket guardado, sumás el total vendido y buscás cuál fue la venta más alta.',
      practica: 'Vas a recorrer un array de ventas para contar cuántas superan un umbral y sumar el total.',
      tip: 'Antes de programar un integrador, anotá en español qué variables necesitás (ej. <code>suma</code>, <code>contador</code>, <code>maximo</code>) e inicializalas fuera del bucle.'
    },
    16: {
      que: 'Estás agrupando instrucciones repetidas bajo un nombre propio: un método <code>void</code> (que ejecuta y no devuelve valor).',
      porque: 'Copiar y pegar el mismo bloque en cuatro lugares multiplica errores cuando mañana tengas que cambiar una sola línea.',
      paraque: 'Dividir un programa largo en acciones claras y reutilizables: imprimir encabezados, mostrar menús o enviar una notificación.',
      dia: 'El botón "Calentar 30 segundos" del microondas: apretás un botón con nombre claro sin tener que programar la potencia y el reloj cada vez.',
      practica: 'Vas a definir el método <code>imprimirSeparador()</code> y llamarlo tres veces desde <code>main</code>.',
      tip: 'Cada método debería hacer una única tarea bien nombrada con un verbo en infinitivo (ej. <code>imprimirTicket()</code>).',
      antes: ['¿Qué hacés cuando una misma receta incluye "hacer salsa blanca" en tres platos distintos?', 'Escribís la receta de la salsa una sola vez aparte y en cada plato decís "usar salsa blanca". Eso es un método.']
    },
    17: {
      que: 'Estás creando métodos que reciben datos (parámetros), hacen un cálculo y devuelven el resultado con <code>return</code>.',
      porque: 'Si un método imprime directo en consola solo sirve para mirar; si devuelve un valor (<code>return</code>), podés guardarlo, sumarlo o reutilizarlo en otra cuenta.',
      paraque: 'Calcular precios con IVA, validar si un stock alcanza o transformar textos en funciones independientes y testeables.',
      dia: 'Le das naranjas a una exprimidora (parámetros) y te devuelve un vaso de jugo (<code>return</code>): después decidís si te lo tomás o lo usás en una torta.',
      practica: 'Vas a crear <code>calcularArea(int base, int altura)</code> devolviendo el área con <code>return</code> e imprimiéndola desde <code>main</code>.',
      tip: 'Separar el cálculo (método con <code>return</code>) de la impresión (<code>println</code> en <code>main</code>) es una de las mejores prácticas clave para poder testear después.'
    },
    18: {
      que: 'Estás creando tus propios tipos de datos con <strong>Clases</strong> (el molde) y <strong>Objetos</strong> (las cosas creadas con <code>new</code>).',
      porque: 'Cuando un producto tiene nombre, precio y stock, manejar tres arrays sueltos se vuelve caótico; mejor agrupar dato + comportamiento en un solo objeto.',
      paraque: 'Modelar usuarios, productos, cuentas bancarias o pedidos tal como pide la Programación Orientada a Objetos.',
      dia: 'El plano de una casa es la <strong>clase</strong> (uno solo en papel); cada casa construida en el barrio con ese plano es un <strong>objeto</strong> distinto con su propia dirección y color.',
      practica: 'Vas a definir la clase <code>Persona</code> con atributos y el método <code>presentarse()</code>, crear un objeto con <code>new</code> y usarlo.',
      tip: 'Las clases empiezan con Mayúscula (<code>Persona</code>, <code>Producto</code>) y los objetos y métodos con minúscula (<code>persona1</code>, <code>presentarse()</code>).'
    },
    19: {
      que: 'Estás aprendiendo a inicializar cada objeto con sus valores completos apenas nace, usando constructores y <code>this</code>.',
      porque: 'Si creás un <code>Producto</code> vacío y te olvidás de llenarle el precio, queda roto a mitad de camino.',
      paraque: 'Garantizar que todo cliente, pedido o turno médico exista desde el primer segundo con sus datos obligatorios cargados.',
      dia: 'Cuando comprás un celular nuevo ya viene con sistema y batería listos para usar desde la caja, no tenés que soldar vos la pantalla después.',
      practica: 'Vas a escribir el constructor de <code>Producto</code> usando <code>this</code> para distinguir parámetros de atributos.',
      tip: '<code>this.nombre</code> siempre refiere al atributo del objeto; <code>nombre</code> sin <code>this</code> refiere al parámetro recibido en el constructor.',
      antes: ['Si llenás una ficha de socio nueva, ¿qué datos te piden sí o sí el primer día?', 'Nombre y DNI: en Java, el constructor exige esos datos obligatorios en el momento mismo de hacer <code>new Socio(...)</code>.']
    },
    20: {
      que: 'Estás protegiendo los datos internos de tus objetos con <code>private</code> y controlando cambios con getters y setters.',
      porque: 'Si cualquiera pudiera hacer <code>producto.precio = -500</code> desde afuera, los datos quedarían corruptos.',
      paraque: 'Aplicar reglas de seguridad en el propio objeto (no aceptar edades negativas ni saldos inválidos sin validar).',
      dia: 'En un banco no metés la mano adentro de la bóveda para cambiar tu saldo: le pedís al cajero automático (<code>setter</code>), que primero verifica si la operación es válida.',
      practica: 'Vas a encapsular atributos <code>private</code> y exponer getters/setters seguros en la clase.',
      tip: 'Dejá los atributos siempre <code>private</code> y usá el setter para validar (ej. rechazar edades o montos negativos) en un solo lugar.'
    },
    21: {
      que: 'Estás creando clases nuevas que heredan atributos y métodos de una clase base usando <code>extends</code> y <code>super</code>.',
      porque: 'Si <code>Perro</code>, <code>Gato</code> y <code>Pajaro</code> tienen todos nombre y edad, copiar esos campos en cada archivo duplica código.',
      paraque: 'Compartir estructura común entre tipos emparentados ("un Gerente ES UN Empleado") sin repetir código.',
      dia: 'Todos los vehículos tienen patente y velocidad, pero además una moto tiene cilindrada y un camión tiene carga máxima: parten de la misma ficha base.',
      practica: 'Vas a crear una subclase que hereda de <code>Animal</code> e inicializa su parte base llamando a <code>super(...)</code>.',
      tip: 'Usá herencia solo cuando la relación "ES UN" sea verdadera; si es "TIENE UN" (ej. un Auto tiene un Motor), preferí composición (un atributo).'
    },
    22: {
      que: 'Estás logrando que distintos objetos respondan de manera diferente a un mismo método usando polimorfismo y <code>@Override</code>.',
      porque: 'Podés recorrer una sola lista de <code>Animal[]</code> llamando a <code>hacerSonido()</code> sin llenar el código de <code>if (esPerro) ... else if (esGato)</code>.',
      paraque: 'Agregar nuevos medios de pago, descuentos o tipos de usuario mañana sin tocar el código que los recorre.',
      dia: 'El botón "Reproducir" (▶) funciona igual para una canción, un video o un podcast, aunque por dentro cada archivo haga algo distinto.',
      practica: 'Vas a sobrescribir <code>hacerSonido()</code> en subclases y recorrer un array polimórfico de <code>Animal</code>.',
      tip: 'Anotá siempre <code>@Override</code> al sobrescribir: si te equivocás en una letra del nombre del método, el compilador te avisa enseguida.',
      antes: ['¿Cómo puede un mismo enchufe dar energía a una lámpara, un cargador y un ventilador?', 'Porque comparten la misma forma de entrada (mismo método), pero cada aparato hace su propio trabajo al recibir corriente.']
    },
    23: {
      que: 'Estás definiendo contratos con <code>interface</code> y moldes incompletos con clases <code>abstract</code>.',
      porque: 'A veces querés exigir qué métodos debe saber hacer una clase (<code>pagar()</code>, <code>notificar()</code>) sin atarte a cómo lo implementa cada una.',
      paraque: 'Desacoplar piezas grandes: tu sistema puede cambiar de envío por mail a WhatsApp cumpliendo la misma interfaz.',
      dia: 'Un contrato de franquicia dice: "tenés que vender hamburguesas y cobrar con QR" (<code>interface</code>), aunque cada sucursal tenga su propia cocina.',
      practica: 'Vas a crear una interfaz y hacer que distintas clases la implementen con <code>implements</code>.',
      tip: 'En Java una clase puede heredar solo una clase (<code>extends</code>), pero puede implementar múltiples interfaces (<code>implements</code>): preferí interfaces para definir capacidades.',
      antes: ['¿Qué tienen en común todos los controles remotos universales?', 'Cumplen el mismo contrato de botones (subir volumen, cambiar canal) aunque la marca del televisor cambie.']
    },
    24: {
      que: 'Estás usando <code>ArrayList</code> para manejar listas que crecen y se achican dinámicamente.',
      porque: 'Un array común tiene tamaño fijo desde que nace; casi nunca sabés cuántos clientes o tareas va a cargar el usuario.',
      paraque: 'Carritos de compra, listas de tareas, resultados de búsquedas y colecciones reales en prácticamente cualquier app Java.',
      dia: 'La mochila de compras vs la huevera: en la huevera siempre caben 6; en la mochila vas metiendo o sacando artículos (<code>.add</code> / <code>.remove</code>) según necesites.',
      practica: 'Vas a crear un <code>ArrayList</code>, agregar elementos con <code>.add()</code>, medir con <code>.size()</code> y recorrerlos.',
      tip: 'Usá <code>.size()</code> (con paréntesis) en <code>ArrayList</code>, a diferencia de <code>.length</code> (sin paréntesis) en arrays; y si borrás en bucle, recorré hacia atrás o usá <code>Iterator</code>.',
      antes: ['¿Qué hacés si invitaste a 5 amigos a comer y a último momento se suman 3 más?', 'No podés achicar ni agrandar una mesa fija de cemento: traés sillas plegables (<code>ArrayList</code>) que se adaptan en el momento.']
    },
    25: {
      que: 'Estás aprendiendo cómo se ordenan los archivos, paquetes (<code>package</code>) y carpetas de un proyecto Java real.',
      porque: 'En proyectos con decenas de clases no podés tirar todos los <code>.java</code> sueltos en una sola carpeta sin chocar nombres.',
      paraque: 'Ubicar rápidamente modelos, servicios y utilidades en IDEs como IntelliJ, Eclipse o proyectos Spring Boot.',
      dia: 'En un estudio contable o biblioteca no ponés todas las boletas en una misma pila: usás carpetas rotuladas por año, cliente y rubro (paquetes).',
      practica: 'Vas a responder un cuestionario sobre paquetes, <code>import</code>, estructura <code>src/</code> y archivos compilados.',
      tip: 'El nombre del <code>package</code> arriba del archivo debe coincidir exactamente con la ruta de carpetas (ej. <code>com.miapp.modelo</code> → <code>com/miapp/modelo/</code>).'
    },
    26: {
      que: 'Estás guardando texto en un archivo del disco y volviéndolo a leer con <code>FileWriter</code> y <code>BufferedWriter</code>.',
      porque: 'Las variables en RAM se borran apenas se apaga o cierra el programa; los archivos permiten recordar datos entre ejecuciones.',
      paraque: 'Exportar reportes, guardar listas, leer configuraciones o registrar logs en disco.',
      dia: 'Escribir en un pizarrón (memoria RAM: al borrar o cerrar se va) vs anotarlo en un cuaderno (archivo en disco: sigue ahí mañana).',
      practica: 'Vas a escribir líneas en un archivo dentro de <code>try (...)</code> y manejar posibles fallos de lectura/escritura con <code>catch (IOException e)</code>.',
      tip: 'Usá siempre <code>try (BufferedWriter bw = ...)</code> (<em>try-with-resources</em>) para que Java cierre el archivo automáticamente incluso si ocurre un error.',
      antes: ['¿Qué pasa con tus mensajes escritos en un bloc de notas si cortan la luz antes de apretar Guardar?', 'Se pierden porque estaban solo en memoria temporal; guardar en archivo persiste los datos en disco.']
    },
    27: {
      que: 'Estás atrapando errores en tiempo de ejecución con <code>try-catch</code> para que el programa no se cierre de golpe.',
      porque: 'Un usuario puede escribir "hola" cuando pedís un número, o intentar dividir por cero: hay que contener el golpe y avisar bien.',
      paraque: 'Hacer aplicaciones tolerantes a fallos que siguen funcionando ante entradas inválidas o caídas temporales.',
      dia: 'La red de seguridad debajo de un trapecista (<code>try</code> es el salto, <code>catch</code> es la red): si algo sale mal, atajás la caída y seguís el show sin lastimar a nadie.',
      practica: 'Vas a convertir un texto potencialmente inválido con <code>Integer.parseInt</code> dentro de un <code>try-catch</code> manejando <code>NumberFormatException</code>.',
      tip: 'Atrapá la excepción más específica posible (ej. <code>NumberFormatException</code> antes que <code>Exception</code>) y nunca dejes un bloque <code>catch</code> vacío tragándose el error.',
      antes: ['Si en un cajero apretás mal una tecla, ¿conviene que se apague toda la máquina o que te muestre "dato inválido"?', 'Conviene mostrar el aviso y dejarte reintentar: eso logra <code>try-catch</code>.']
    },
    28: {
      que: 'Estás creando tus propias excepciones con nombre claro y aprendiendo a rastrear fallos paso a paso (debugging).',
      porque: 'Un error genérico dice poco; una excepción como <code>SaldoInsuficienteException</code> le cuenta al instante a tu código qué regla de negocio se rompió.',
      paraque: 'Separar reglas del negocio de errores técnicos y leer stacktraces sin miedo al investigar un bug.',
      dia: 'En un tablero de auto no se prende una única luz que dice "Algo anda mal": hay testigos separados para batería, aceite y combustible para saber qué revisar.',
      practica: 'Vas a definir una excepción propia extendiendo <code>Exception</code>, lanzarla con <code>throw</code> y atraparla con <code>try-catch</code>.',
      tip: 'Cuando veas un stacktrace largo en Java, leé primero el mensaje de arriba y buscá la primera línea que pertenece a <strong>tu</strong> paquete/archivo.',
      antes: ['¿Por qué en medicina no todos los dolores se llaman igual y tienen diagnósticos concretos?', 'Porque sabiendo exactamente qué falló (excepción específica) podés aplicar el tratamiento correcto.']
    },
    29: {
      que: 'Estás armando una aplicación completa en consola integrando POO, listas, menú y validación.',
      porque: 'Es el puente entre ejercicios chicos y construir un pequeño sistema funcional de punta a punta.',
      paraque: 'Demostrar que podés combinar <code>while</code>, <code>switch</code>, <code>interface</code>, <code>ArrayList</code> y <code>try-catch</code> en un mismo programa coherente.',
      dia: 'Es como atender un mostrador completo de tareas: mostrás opciones, agregás pedidos, listás pendientes y no dejás que una tecla mal apretada cierre el local.',
      practica: 'Vas a completar el sistema <code>GestorTareas</code> con interfaz <code>Gestionable</code>, lista encapsulada, menú y manejo seguro de entradas.',
      tip: 'Construilo por partes y ejecutalo tras cada cambio: primero la interfaz y clase, después la lista, luego el menú <code>while + switch</code> y por último el <code>try-catch</code>.'
    },
    30: {
      que: 'Estás entendiendo qué es el control de versiones (Git) y por qué nadie trabaja profesionalmente guardando copias sueltas.',
      porque: 'Guardar archivos como <code>proyecto_final_v2_ahora_si.java</code> se rompe cuando editás dos veces o trabajás en equipo.',
      paraque: 'Tener historial completo con fecha, motivo de cada cambio, posibilidad de volver atrás sin perder trabajo y colaborar con otros.',
      dia: 'Es como las "partidas guardadas" con nombre y descripción en un videojuego: si una jugada sale mal, volvés al punto de control exacto.',
      practica: 'Vas a aprobar un cuestionario conceptual sobre repositorio, staging, commits, ramas y flujo básico de Git.',
      tip: 'Hacé commits chicos y enfocados en un solo cambio con mensajes claros en presente o imperativo (ej. "Agrego validación de edad").',
      antes: ['¿Alguna vez sobrescribiste un documento importante y quisiste recuperar cómo estaba ayer?', 'Git resuelve exactamente eso para el código: guarda fotos exactas (commits) de cada avance.']
    },
    31: {
      que: 'Estás practicando los comandos reales de Git (<code>init</code>, <code>add</code>, <code>commit</code>, <code>log</code>, <code>checkout</code>) sobre un proyecto Java.',
      porque: 'No alcanza con entender qué es Git en teoría: tenés que saber moverte cuando la terminal o el IDE piden guardar o recuperar un archivo.',
      paraque: 'Versionar cualquier proyecto desde el día uno y rescatar un archivo roto a partir de su historial.',
      dia: 'Preparar una caja para mudanza: primero elegís qué entra en la caja (<code>git add</code>), después la sellás con etiqueta (<code>git commit -m</code>), y si hace falta buscás en el inventario (<code>git log</code>).',
      practica: 'Vas a escribir la secuencia correcta de comandos Git para iniciar un repo, hacer 2 commits y recuperar un archivo anterior.',
      tip: 'Nunca hagas <code>git commit</code> sin revisar antes con <code>git status</code> qué archivos estás por guardar.',
      antes: ['¿Cuál es la diferencia entre poner productos en el carrito de compras y pasar por la caja a pagar?', '<code>git add</code> los pone en el área de preparación (el carrito); <code>git commit</code> confirma y guarda la foto definitiva en el historial.']
    },
    32: {
      que: 'Estás conociendo los entornos profesionales de programación (IDEs) y cómo integran Java + Git.',
      porque: 'Programar en un bloc de notas sin autocompletado, depurador ni aviso instantáneo de errores te frena innecesariamente.',
      paraque: 'Elegir y usar IntelliJ IDEA, Eclipse o VS Code con atajos reales cuando pases de la web a tu computadora.',
      dia: 'Pasar de amasar todo a mano con un cuchillo desafilado a trabajar en una cocina equipada con batidora, balanza y temporizador.',
      practica: 'Vas a responder preguntas sobre qué resuelve un IDE, debugging visual y Git integrado.',
      tip: 'Aprendé a usar el modo Debug (breakpoints + paso a paso) de tu IDE: ahorra horas frente a llenar el código de <code>System.out.println</code>.',
      antes: ['¿Por qué un escritor usa un editor con corrector y búsqueda en vez de máquina de escribir?', 'Porque le marca errores al instante y le permite navegar todo el proyecto sin perder tiempo.']
    },
    33: {
      que: 'Estás simulando un flujo real de trabajo: escribir código Java, versionarlo en Git, detectar un daño y volver atrás.',
      porque: 'En un trabajo real Java y Git conviven minuto a minuto: el código evoluciona junto con su historial.',
      paraque: 'Perder el miedo a experimentar sabiendo que podés revertir un archivo dañado al último estado funcional.',
      dia: 'Antes de tocar la instalación eléctrica sacás foto de cómo estaban conectados los cables: si algo no enciende, volvés exactamente al estado de la foto.',
      practica: 'Vas a secuenciar comandos de Git aplicados sobre <code>GestorNotas.java</code> hasta recuperar su versión sana.',
      tip: 'Siempre verificá tu programa antes de hacer commit, así cada punto en <code>git log</code> representa una versión que compila.',
      antes: ['¿Qué te da más tranquilidad antes de probar un cambio riesgoso en tu proyecto?', 'Tener un commit reciente guardado con todo funcionando para poder volver atrás en segundos.']
    },
    34: {
      que: 'Estás rindiendo el Proyecto Final integrador de la Fase 1: una Biblioteca completa en Java con POO y menú seguro.',
      porque: 'Demuestra tu autonomía para leer requerimientos completos, diseñar clases colaborando y entregar un programa sólido.',
      paraque: 'Consolidar todo Java SE antes de dar el salto a arquitectura profesional, Spring Boot y APIs en Fase 2.',
      dia: 'Armar el sistema de préstamos de una biblioteca barrial: dar de alta libros, listarlos, buscarlos por título y manejar errores sin caerse.',
      practica: 'Vas a implementar las clases <code>Libro</code> y <code>Biblioteca</code> con encapsulamiento, lista dinámica y menú interactivo completo.',
      tip: 'Cuidá la responsabilidad de cada clase: <code>Libro</code> representa un libro y <code>Biblioteca</code> administra la colección; no mezcles el menú dentro de <code>Libro</code>.'
    },
    35: {
      que: 'Estás poniendo a prueba tu comprensión conceptual frente a preguntas reales de entrevista Java junior.',
      porque: 'En entrevistas técnicas te preguntan por qué ocurre algo (inmutabilidad de <code>String</code>, checked vs unchecked, contrato de <code>interface</code>), no solo sintaxis.',
      paraque: 'Llegar preparado a coloquios, parciales orales y primeras búsquedas laborales sabiendo explicar el fundamento.',
      dia: 'Es como rendir el examen teórico de manejo: no basta con saber doblar, te preguntan qué significa cada señal y quién tiene prioridad.',
      practica: 'Vas a resolver 10 preguntas técnicas de nivel junior explicando conceptos clave de Java SE.',
      tip: 'Cuando dudes entre dos opciones en una entrevista, pensá en el porqué en memoria o compilación antes de adivinar.'
    },
    101: {
      que: 'Estás aprendiendo a diferenciar "código que solo funciona hoy" de código limpio que cualquiera puede mantener.',
      porque: 'En proyectos reales pasás mucho más tiempo leyendo y modificando código viejo que escribiéndolo por primera vez.',
      paraque: 'Evitar que tu aplicación se vuelva imposible de corregir a los pocos meses (deuda técnica descontrolada).',
      dia: 'Arreglar una pérdida de agua con cinta aisladora resuelve el minuto, pero si lo hacés en todas las cañerías de la casa terminás inundado.',
      practica: 'Vas a refactorizar variables y métodos crípticos a nombres expresivos sin cambiar el comportamiento.',
      tip: 'Cada constante fija repetida (<code>1.21</code>) merece un nombre en <code>static final</code> en MAYÚSCULAS para no quedar como número mágico.',
      antes: ['Si abrís un archivo tuyo de hace 3 meses y ves variables llamadas a, b y c, ¿sabés rápido qué hacen?', 'Casi nunca: nombrar bien desde el inicio ahorra el doble de tiempo al futuro vos o a tu equipo.']
    },
    102: {
      que: 'Estás aplicando DRY (no repetir lógica), KISS (mantenerlo simple) y refactorización segura.',
      porque: 'Si una fórmula de IVA está copiada en 5 archivos y mañana cambia la tasa, seguro te olvidás de actualizar uno.',
      paraque: 'Centralizar reglas de negocio en un método único y simplificar condicionales enroscados.',
      dia: 'Tener un único tarifario en la caja del local en lugar de pegar precios distintos escritos a mano en cada pared.',
      practica: 'Vas a extraer una fórmula duplicada en el método <code>conIva(...)</code> asegurando que el resultado no cambie.',
      tip: 'Refactorizá siempre en pasos chicos y comprobá después de cada paso que las pruebas siguen dando igual.',
      antes: ['¿Por qué conviene tener una sola copia oficial de un reglamento en la oficina?', 'Porque si hay tres copias distintas repartidas, cuando cambia una regla nadie sabe cuál vale.']
    },
    103: {
      que: 'Estás conociendo los 5 principios SOLID para diseñar clases flexibles y desacopladas.',
      porque: 'Cuando agregás un medio de pago o un descuento nuevo, no deberías tener que abrir y arriesgar clases ya probadas.',
      paraque: 'Construir backends escalables en Java y Spring Boot donde cada pieza se enchufa por interfaz.',
      dia: 'Un tomacorriente estándar de pared: podés enchufar una pava, un cargador o una lámpara nueva sin romper la pared para recablear la casa.',
      practica: 'Vas a reemplazar una cadena rígida de <code>if</code> por polimorfismo implementando la interfaz <code>MedioPago</code>.',
      tip: 'Si ves un <code>if/switch</code> preguntando por el tipo de objeto para decidir comportamiento, es señal de aplicar Open/Closed con una interfaz.',
      antes: ['Si cada vez que comprás un electrodoméstico nuevo tuvieras que cambiar todos los cables de tu casa, ¿sería práctico?', 'Para nada: por eso definimos enchufes estándar (interfaces) y cada aparato nuevo simplemente los implementa.']
    },
    104: {
      que: 'Estás detectando los errores clásicos de diseño (antipatrones STUPID) antes de caer en ellos.',
      porque: 'Saber qué evitar (Singletons globales abusivos, acoplamiento fuerte, sobre-ingeniería) es tan valioso como saber patrones.',
      paraque: 'Hacer code reviews críticos y escribir código fácil de probar con JUnit/Mockito.',
      dia: 'Como aprender las señales de tránsito prohibidas: reconocer a tiempo una calle sin salida o un cruce peligroso.',
      practica: 'Vas a identificar antipatrones de diseño y elegir cómo corregir código rígido o acoplado.',
      tip: 'Preguntate siempre: "¿puedo probar esta clase sin levantar una base de datos real?". Si no podés, probablemente esté acoplada.',
      antes: ['¿Por qué un único empleado que hace ventas, caja, limpieza y envíos paraliza el negocio si falta?', 'Porque concentra demasiadas responsabilidades (God Object / alto acoplamiento): igual pasa cuando una clase hace todo.']
    },
    105: {
      que: 'Estás entrando al ecosistema real de proyectos Java con Maven y Spring Boot.',
      porque: 'En la industria nadie compila 40 librerías descargando archivos <code>.jar</code> a mano: Maven gestiona dependencias y Spring Boot arma la base web.',
      paraque: 'Levantar servicios backend profesionales en minutos con estructura estándar (<code>pom.xml</code>, <code>application.properties</code>).',
      dia: 'En vez de talar árboles y fabricar ladrillos para abrir un comercio, alquilás un local con luz, agua y habilitación base ya lista para empezar a vender.',
      practica: 'Vas a evaluar tu comprensión de <code>pom.xml</code>, starters, servidor embebido e inyección automática de Spring Boot.',
      tip: 'Mantené ordenado <code>pom.xml</code> agregando solo dependencias que realmente usás y ejecutá el proyecto desde Maven Wrapper (<code>mvnw</code>).',
      antes: ['¿Cómo instalás herramientas o ingredientes cuando ya vienen en un kit organizado por receta?', 'Maven cumple el rol del inventario de ingredientes (dependencias) y Spring Boot arma el entorno base de la cocina.']
    },
    106: {
      que: 'Estás aprendiendo el idioma con el que se comunican clientes y servidores en internet: HTTP y API REST.',
      porque: 'Tu backend Java no tiene pantalla: responde pedidos HTTP (<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>) intercambiando datos JSON y códigos de estado.',
      paraque: 'Conectar aplicaciones web, celulares y otros sistemas contra tus endpoints REST.',
      dia: 'Ir a un restaurante: la mesa (cliente) hace un pedido por menú (verbo + ruta) al mozo (HTTP), y la cocina responde con el plato (JSON) o un aviso claro si no queda (<code>404</code>).',
      practica: 'Vas a probar endpoints en el Laboratorio de API y distinguir verbos y códigos HTTP (<code>200, 201, 400, 404</code>).',
      tip: 'Usá sustantivos en plural para las rutas (<code>/api/productos</code>) y dejá que el verbo HTTP indique la acción (no pongas verbos como <code>/crearProducto</code>).',
      antes: ['¿Cuando pedís un café por mostrador, qué diferencia hay entre consultar el precio y hacer un pedido nuevo?', 'Consultar no cambia nada en caja (<code>GET</code>); pedir un café crea un ticket nuevo (<code>POST</code>).']
    },
    107: {
      que: 'Estás organizando un backend Spring Boot en 3 capas claras: Controller, Service y Repository.',
      porque: 'Si metés validaciones SQL y manejo HTTP juntos en un solo archivo, el proyecto colapsa apenas crece.',
      paraque: 'Que cada capa sea intercambiable, legible y fácil de probar por separado.',
      dia: 'Un restaurante ordenado: el mozo atiende mesas y traduce pedidos (<strong>Controller</strong>), el chef cocina aplicando reglas (<strong>Service</strong>) y el depósito guarda/busca insumos (<strong>Repository</strong>).',
      practica: 'Vas a estructurar las tres clases colaborando y detectar qué código pertenece a cada capa.',
      tip: 'Regla de oro: el <strong>Controller</strong> habla HTTP, el <strong>Service</strong> guarda reglas de negocio y el <strong>Repository</strong> solo accede a datos.',
      antes: ['¿Por qué en una clínica quien atiende recepción no es quien realiza la cirugía ni quien archiva radiografías?', 'Separar roles evita caos, errores y permite mejorar cada área sin frenar las otras.']
    },
    108: {
      que: 'Estás incorporando herramientas de Java moderno que aparecen todo el tiempo en Spring: <code>record</code>, <code>Map</code>, <code>Optional</code> y <code>Stream</code>.',
      porque: 'Escriben en 3 líneas claras lo que antes llevaba 25 líneas de getters repetitivos, bucles y chequeos manuales contra <code>null</code>.',
      paraque: 'Crear DTOs inmutables, evitar <code>NullPointerException</code> al buscar por ID y filtrar/transformar colecciones de API.',
      dia: 'Un diccionario rápido por palabra clave (<code>Map</code>) o una caja etiquetada que avisa si vino vacía o llena antes de abrirla (<code>Optional</code>).',
      practica: 'Vas a definir un <code>record</code> y usar <code>.stream()</code>, <code>.filter()</code> y <code>Optional</code> para consultar datos.',
      tip: 'Usá <code>Optional</code> como valor de retorno en búsquedas que pueden no encontrar nada, nunca como parámetro de un método ni atributo de clase.',
      antes: ['Si buscás un libro en el catálogo y no existe, ¿es mejor recibir "no encontrado" explícito o romper la máquina al intentar abrir la tapa?', 'Recibir un resultado opcional explícito (<code>Optional</code>) evita sorpresas como <code>NullPointerException</code>.']
    },
    109: {
      que: 'Estás conectando clases Java con tablas de base de datos usando entidades JPA (<code>@Entity</code>) y H2 en memoria.',
      porque: 'Escribir cientos de consultas SQL repetitivas para cada campo es propenso a errores; JPA mapea tus objetos automáticamente.',
      paraque: 'Persistir productos, clientes y ventas de forma limpia apenas arranca Spring Boot.',
      dia: 'Una planilla inteligente: definís la ficha de un producto en Java con sus columnas anotadas y JPA crea y llena el casillero equivalente en la base.',
      practica: 'Vas a evaluar anotaciones clave de JPA (<code>@Entity</code>, <code>@Id</code>, <code>@GeneratedValue</code>) y errores frecuentes de mapeo.',
      tip: 'Toda entidad JPA necesita un identificador con <code>@Id</code> y un constructor vacío (<code>protected</code> o <code>public</code>) para que Hibernate pueda instanciarla.',
      antes: ['¿Qué tienen en común los atributos de una clase Java (id, nombre, precio) con las columnas de una planilla de Excel?', 'Cada objeto equivale a una fila de la tabla y cada atributo equivale a una columna.']
    },
    110: {
      que: 'Estás consultando la base de datos sin SQL manual usando <code>JpaRepository</code>, métodos derivados y <code>@Query</code>.',
      porque: 'Spring Data genera automáticamente consultas como <code>findByNombre</code> o <code>existsByNombre</code> solo leyendo el nombre del método.',
      paraque: 'Buscar productos, verificar duplicados o filtrar stock bajo en segundos con cero código repetitivo.',
      dia: 'Le decís al encargado del archivo "traeme las facturas por cliente" siguiendo un formato estándar de pedido, sin tener que ir vos estante por estante.',
      practica: 'Vas a implementar una interfaz de repositorio sobre <code>Map</code>/<code>Optional</code> y detectar errores típicos en firmas JPQL.',
      tip: 'En JPQL (<code>@Query</code>) nombrás la <strong>clase Java y sus atributos</strong> (ej. <code>Producto p</code>), no el nombre de la tabla SQL.',
      antes: ['Si pedís un expediente por número o por apellido, ¿te gustaría armar el procedimiento entero cada vez?', 'No: usás pedidos estandarizados como <code>findByApellido</code> y el sistema resuelve la búsqueda.']
    },
    111: {
      que: 'Estás aplicando Inyección de Dependencias: recibir lo que una clase necesita por constructor en vez de fabricarlo con <code>new</code>.',
      porque: 'Si <code>Servicio</code> crea adentro <code>new BaseReal()</code>, nunca vas a poder enchufarle una base de prueba en un test sin cambiar el código.',
      paraque: 'Que Spring conecte las capas automáticamente y tus servicios sean 100% testeables.',
      dia: 'En lugar de que cada empleado de reparto fabrique su propia moto en el escritorio, la empresa se la entrega en la puerta (puede darle moto, bici o auto según el día).',
      practica: 'Vas a refactorizar un constructor para recibir la interfaz <code>Notificador</code> sin hacer <code>new Mail()</code> adentro.',
      tip: 'Preferí siempre la <strong>inyección por constructor</strong> con campos <code>private final</code> en lugar de poner <code>@Autowired</code> directo sobre atributos.',
      antes: ['¿Es mejor que tu televisor traiga el cable soldado fijo a la pared o un enchufe desconectable?', 'Un enchufe desconectable (inyección por constructor): permite probarlo, mudarlo o cambiar el cable sin romper el aparato.']
    },
    112: {
      que: 'Estás construyendo Controllers REST reales y separando la entidad interna de la respuesta pública (DTO).',
      porque: 'Exponer entidades crudas revela columnas internas (como contraseñas o campos de auditoría) y acopla tu API a la base de datos.',
      paraque: 'Definir contratos estables en JSON con <code>@RestController</code>, <code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PathVariable</code> y <code>record</code> DTO.',
      dia: 'En un banco, la ficha interna tiene notas confidenciales del empleado, pero el comprobante impreso para el cliente (<strong>DTO</strong>) muestra solo fecha, monto y número de operación.',
      practica: 'Vas a transformar entidades a <code>UsuarioResponse</code> usando <code>stream().map(...)</code> y enviar pedidos HTTP con el simulador.',
      tip: 'Usá <code>record</code> de Java para DTOs inmutables y devolvé <code>ResponseEntity</code> con el código HTTP exacto (<code>201 Created</code> al crear, <code>204</code> al borrar).',
      antes: ['¿Le mostrarías al cliente toda tu planilla interna de costos cuando solo pide ver el ticket?', 'Claro que no: mostrás un comprobante adaptado (DTO) con los datos justos y seguros.']
    },
    113: {
      que: 'Estás aprendiendo a probar manualmente tus endpoints REST usando Swagger, Postman y <code>curl</code>.',
      porque: 'Que tu proyecto compile y arranque en verde no garantiza que reciba bien el JSON ni que devuelva los códigos HTTP correctos.',
      paraque: 'Verificar rutas reales antes de entregar una funcionalidad o conectarla con un frontend.',
      dia: 'Probar que el timbre, la cerradura y el portero eléctrico funcionen apretándolos desde la vereda antes de entregar las llaves del departamento.',
      practica: 'Vas a diagnosticar encabezados faltantes en <code>curl</code> y ejecutar flujos CRUD completos en ApiLab.',
      tip: 'Al enviar JSON con <code>curl</code> o Postman verificá siempre el header <code>Content-Type: application/json</code> y el verbo HTTP correcto.',
      antes: ['Si abrís una tienda online, ¿la publicás sin probar antes si el botón "Comprar" funciona?', 'Nunca: primero simulás compras reales como cliente para confirmar cada respuesta.']
    },
    114: {
      que: 'Estás escribiendo tests unitarios automáticos con JUnit siguiendo el patrón AAA (Arrange · Act · Assert).',
      porque: 'Probar todo a mano después de cada cambio cansa, se olvida y deja escapar regresiones en los casos borde.',
      paraque: 'Tener un botón verde que en segundos verifica cientos de reglas de negocio antes de hacer un commit o entrega.',
      dia: 'Antes de vender una balanza de cocina, ponés una pesa patrón de 500 g (<em>Arrange</em>), leés el visor (<em>Act</em>) y comprobás que marque exactamente 500 g (<em>Assert</em>).',
      practica: 'Vas a escribir verificaciones incluyendo valores límite (casos borde como <code>5000</code>).',
      tip: 'Testeá siempre los casos límite (<code>0</code>, límite exacto, lista vacía, nulo) y nombrá cada test indicando qué escenario verifica y qué espera.',
      antes: ['¿Cómo sabés después de arreglar los frenos de un auto que no desconectaste la bocina sin querer?', 'Con una lista de chequeo automática que prueba frenos, luces y bocina en cada revisión.']
    },
    115: {
      que: 'Estás aprendiendo a aislar cada capa en tests usando dobles/mocks (Mockito) y simulando pedidos HTTP (MockMvc).',
      porque: 'Para probar una regla del <code>Service</code> no necesitás levantar MySQL ni la red: simulás qué respondería el repositorio.',
      paraque: 'Tests unitarios ultrarrápidos y deterministas tanto para lógica de negocio como para validaciones del Controller.',
      dia: 'Probar un piloto automático en un simulador de vuelo en tierra: cambiás el viento o simulás una falla de motor sin tener que despegar un avión real.',
      practica: 'Vas a usar un repositorio falso (<code>RepoFalso</code>) simulando casos existentes y no existentes y analizando aserciones útiles.',
      tip: 'Un test debe probar comportamiento real (salidas, excepciones o llamadas críticas), nunca pasar solo por poner <code>assertTrue(true)</code>.',
      antes: ['¿Necesitás tener clientes reales esperando en la puerta para entrenar al cajero nuevo en el sistema?', 'No: podés practicar con pedidos simulados en caja de prueba (mocks) sin tocar la plata real.']
    },
    116: {
      que: 'Estás pasando de bases temporales en memoria a MySQL con SQL real y borrado lógico.',
      porque: 'H2 en memoria se borra al reiniciar; en producción los datos sobreviven y muchas veces no se eliminan físicamente sino marcando <code>activo = false</code>.',
      paraque: 'Persistir historiales reales, mantener integridad referencial y escribir consultas <code>SELECT / INSERT / UPDATE</code> correctas.',
      dia: 'Cuando un empleado deja la empresa no quemamos su legajo y sus recibos: lo pasamos a "inactivo" (borrado lógico) para no perder el historial contable.',
      practica: 'Vas a corregir errores comunes en sentencias SQL (comillas simples, orden de columnas y <code>ORDER BY</code>) y repasar conceptos.',
      tip: 'En SQL el texto siempre va entre comillas simples (<code>\'Yerba\'</code>) y nunca borres ni actualices una tabla sin revisar primero la cláusula <code>WHERE</code>.',
      antes: ['Si anulás una factura en un comercio, ¿desaparece el número del talonario o queda marcada como anulada?', 'Queda marcada como anulada (borrado lógico) para conservar el historial contable intacto.']
    },
    117: {
      que: 'Estás centralizando errores con un handler global y dejando registro claro de eventos mediante Logging.',
      porque: 'Llenar cada método de <code>try-catch</code> repetidos y exponer stacktraces crudos al usuario es inseguro e inmantenible.',
      paraque: 'Devolver respuestas JSON limpias (<code>404</code>, <code>409</code>) desde un único <code>@RestControllerAdvice</code> y diagnosticar fallos sin imprimir contraseñas.',
      dia: 'La bitácora del edificio registra quién entró y qué alerta saltó sin gritar claves privadas por el altoparlante; y la recepción da siempre respuestas prolijas.',
      practica: 'Vas a crear excepciones propias con <code>RuntimeException</code> y detectar logs que filtran datos sensibles.',
      tip: 'Nunca loguees contraseñas, tokens ni datos personales sensibles, y transformá tus excepciones de dominio en códigos HTTP coherentes (ej. <code>404</code> o <code>409</code>).',
      antes: ['¿Conviene decirle a un cliente "Error SQL #423 tabla users linea 89" o "El producto solicitado no existe"?', 'Un mensaje claro y seguro (<code>404</code>), guardando el detalle técnico solo en el registro interno (log) sin secretos.']
    },
    118: {
      que: 'Estás empaquetando tu aplicación y su base de datos en contenedores Docker reproducibles.',
      porque: 'La clásica excusa "en mi máquina funciona" ocurre por diferencias de versión de Java, sistema operativo o configuración de MySQL.',
      paraque: 'Levantar con un solo comando (<code>docker compose up</code>) el entorno completo igual en desarrollo, testing y servidor.',
      dia: 'Es como transportar mercadería en contenedores marítimos estandarizados: el puerto, el barco y el camión manipulan la misma caja cerrada sin abrirla ni rearmarla.',
      practica: 'Vas a depurar archivos <code>Dockerfile</code> y <code>docker-compose.yml</code> (red entre servicios, <code>ENTRYPOINT</code> y healthchecks).',
      tip: 'Dentro de Docker Compose un servicio habla con otro por su nombre de servicio (ej. <code>db</code>), no por <code>localhost</code>, y usá <code>condition: service_healthy</code>.',
      antes: ['¿Por qué una franquicia envía los módulos de cocina ya armados exactamente iguales a cada sucursal?', 'Para asegurar que el resultado final funcione igual en cualquier ciudad sin depender del local.']
    },
    119: {
      que: 'Estás documentando tu API automáticamente con Swagger / OpenAPI y preparando el proyecto para entregar sin secretos.',
      porque: 'Nadie sabe usar una API si tiene que leer todo tu código fuente para adivinar qué rutas y campos espera.',
      paraque: 'Generar documentación interactiva en el navegador y entregar repositorios limpios con variables de entorno en vez de claves pegadas.',
      dia: 'Entregar un electrodoméstico con su manual de botones ilustrado y enchufable en cualquier casa (sin dejar tu clave WiFi pegada con cinta).',
      practica: 'Vas a identificar errores de seguridad en archivos de configuración versionados y reforzar buenas prácticas de entrega.',
      tip: 'Jamás subas contraseñas reales a Git: usá variables de entorno como <code>${DB_PASSWORD}</code> y dejá un archivo de ejemplo <code>.env.example</code>.',
      antes: ['¿Subirías la clave de tu homebanking dentro de un trabajo práctico público?', 'Nunca: las claves van en variables de entorno fuera del código versionado.']
    },
    120: {
      que: 'Estás conectando entidades relacionadas entre sí (como un Cliente con sus Pedidos usando llaves foráneas).',
      porque: 'Las aplicaciones reales casi nunca tienen una sola tabla aislada: las compras pertenecen a clientes y contienen productos.',
      paraque: 'Modelar <code>@OneToMany</code> y <code>@ManyToOne</code> en JPA sin caer en bucles infinitos de JSON ni consultas rotas.',
      dia: 'La factura de compra apunta a un único cliente arriba, mientras un mismo cliente puede tener decenas de facturas acumuladas en el mes.',
      practica: 'Vas a repasar uniones SQL (<code>JOIN ... ON</code>), cardinalidades y errores comunes al serializar relaciones en JSON.',
      tip: 'Evitá devolver entidades bidireccionales directo desde el Controller (causan recursión infinita al serializar JSON): convertilas siempre a DTOs.',
      antes: ['¿Un pedido tiene un solo cliente dueño, pero un cliente puede hacer muchos pedidos?', 'Sí: esa relación se modela como Muchos a Uno (<code>@ManyToOne</code>) desde el Pedido hacia el Cliente.']
    },
    121: {
      que: 'Estás protegiendo la entrada de la API validando automáticamente los DTOs con Bean Validation.',
      porque: 'Si un precio negativo o un nombre vacío llegan al servicio y a la base de datos, después cuesta el doble limpiar el daño.',
      paraque: 'Rechazar en la puerta pedidos mal armados devolviendo <code>400 Bad Request</code> claro gracias a <code>@Valid</code>, <code>@NotBlank</code> y <code>@Positive</code>.',
      dia: 'El control de equipaje en la puerta del aeropuerto: revisa documentos y peso permitido antes de dejarte subir al avión.',
      practica: 'Vas a detectar cuando falta <code>@Valid</code> en el Controller y probar validaciones de entrada con ApiLab.',
      tip: 'Poné las anotaciones de validación en el DTO de entrada (<code>@NotBlank</code>, <code>@Positive</code>), activalas con <code>@Valid</code> en el Controller y no valides recién en la base.',
      antes: ['¿Conviene detectar que falta un ingrediente antes de empezar a cocinar o recién cuando el plato ya está en el horno?', 'Antes de empezar: validar con <code>@Valid</code> en el Controller frena datos rotos antes de entrar a la lógica.']
    },
    122: {
      que: 'Estás incorporando patrones de diseño probados (Strategy, Factory y Builder) sobre problemas ya conocidos.',
      porque: 'Muchos problemas de arquitectura se repiten en todos los sistemas: no hace falta reinventar soluciones frágiles desde cero.',
      paraque: 'Elegir algoritmos intercambiables (Strategy), centralizar creación compleja (Factory) y construir objetos legibles (Builder).',
      dia: 'Elegir en una app si calculás envío por moto, correo o retiro (<strong>Strategy</strong>) pidiéndole al mostrador central que cree el calculador adecuado (<strong>Factory</strong>).',
      practica: 'Vas a repasar implementaciones de Strategy + Factory en Java distinguiendo cuándo aporta valor cada patrón.',
      tip: 'No fuerces patrones de diseño donde un método simple alcanza: primero mantené el código claro (KISS) y usá el patrón cuando haya variación real.',
      antes: ['¿Por qué los arquitectos usan planos tipo para puentes o escaleras en vez de inventar la física desde cero?', 'Porque son diseños ya comprobados que evitan errores estructurales conocidos.']
    },
    123: {
      que: 'Estás armando tu Primer Parcial Simulado: una API CRUD completa por capas con regla de negocio real.',
      porque: 'Integra arquitectura en capas, DTOs, validaciones y persistencia bajo consigna realista antes de una evaluación real.',
      paraque: 'Ganar seguridad implementando de principio a fin Controller + Service + Repository + excepción controlada.',
      dia: 'Abrir la sucursal de un kiosco real: alta de productos, consulta, búsqueda por ID, actualización de stock y regla que impide duplicar nombres o vender sin stock.',
      practica: 'Vas a completar los pasos guiados en computadora y verificar orden y arquitectura de un ABM completo.',
      tip: 'Empezá probando el camino feliz completo (crear → listar → buscar → actualizar) y recién después sumá los casos de error.'
    },
    124: {
      que: 'Estás armando tu Segundo Parcial Simulado sumando errores globales, tests, MySQL/Docker y Swagger.',
      porque: 'Una aplicación entregable necesita pruebas automáticas, respuestas de error homogéneas, documentación y contenedor listo para correr.',
      paraque: 'Preparar el entregable completo tal como se exige al cerrar un curso o entrar a un proyecto backend junior.',
      dia: 'Pasar de tener un prototipo andando en el taller a entregar un producto con manual de uso, caja embalada (Docker) y control de calidad aprobado (JUnit/MockMvc).',
      practica: 'Vas a verificar paso a paso excepciones globales, validaciones, Swagger y configuración lista para Docker.',
      tip: 'Probá levantar la app desde cero en un entorno limpio con tus propias instrucciones del <code>README</code>: si alguien más puede correrla en 2 pasos, está lista para entregar.'
    },
    125: {
      que: 'Estás defendiendo todo el recorrido técnico en formato coloquio oral y respuesta breve argumentada.',
      porque: 'En la universidad y en entrevistas laborales necesitás explicar con claridad por qué tomaste cada decisión técnica.',
      paraque: 'Transformar código memorizado en criterio profesional explicable en voz alta.',
      dia: 'Defender tu propio proyecto frente a un cliente o jurado: contar cómo está organizado, qué pasa ante errores y cómo probaste que funciona.',
      practica: 'Vas a responder 18 preguntas cortas de defensa oral y el cuestionario integrador de cierre de Fase 2.',
      tip: 'Respondé siempre en tres tiempos: <strong>qué es</strong> el concepto, <strong>qué problema resuelve</strong> y <strong>en qué archivo o capa</strong> lo usaste.'
    }
  };

  function syncAntesToPractica() {
    if (typeof PRACTICA === 'undefined') return;
    Object.keys(DATA).forEach(function (id) {
      if (PRACTICA[id] && !PRACTICA[id].antes && DATA[id].antes) {
        PRACTICA[id].antes = DATA[id].antes;
      }
    });
  }
  syncAntesToPractica();

  function get(id) {
    return DATA[id] || null;
  }

  function cardSimple(lesson) {
    var d = get(lesson && lesson.id);
    if (!d) return '';
    return '' +
      '<div class="gc-card">' +
        '<div class="gc-head">' +
          '<h4>🧭 Qué estás haciendo, por qué y para qué</h4>' +
          '<button type="button" class="gc-bot-btn" onclick="JavaBot.openTopic(\'lesson\')">🤖 Preguntar al Profe Java</button>' +
        '</div>' +
        '<div class="gc-grid">' +
          '<div class="gc-item"><span class="gc-tag">Qué hacés</span><p>' + d.que + '</p></div>' +
          '<div class="gc-item"><span class="gc-tag">Por qué</span><p>' + d.porque + '</p></div>' +
          '<div class="gc-item"><span class="gc-tag">Para qué sirve</span><p>' + d.paraque + '</p></div>' +
        '</div>' +
        (typeof PRACTICA !== 'undefined' && PRACTICA[lesson.id] && PRACTICA[lesson.id].escalera ? '' : '<div class="gc-day"><strong>☕ Ejemplo del día a día:</strong> ' + d.dia + '</div>') +
      '</div>';
  }

  function cardTutorial(lesson) {
    var d = get(lesson && lesson.id);
    if (!d) return '';
    return '' +
      '<div class="gc-tip">' +
        '<div class="gc-tip-body">' +
          '<strong>✨ Buena práctica profesional en esta lección:</strong> ' + d.tip +
        '</div>' +
        '<button type="button" class="gc-bot-btn" onclick="JavaBot.openTopic(\'tip\')">🤖 Ver más buenas prácticas</button>' +
      '</div>';
  }

  function cardExercise(lesson) {
    var d = get(lesson && lesson.id);
    if (!d) return '';
    return '' +
      '<div class="gc-ex-note">' +
        '<div><strong>🎯 Para qué hacés esta práctica:</strong> ' + d.practica + '</div>' +
        '<button type="button" class="gc-bot-btn" onclick="JavaBot.openTopic(\'lesson\')">🤖 Ayuda del Profe Java</button>' +
      '</div>';
  }

  function validateAll(lessons) {
    var missing = [];
    (lessons || []).forEach(function (l) {
      var d = DATA[l.id];
      if (!d || !d.que || !d.porque || !d.paraque || !d.dia || !d.practica || !d.tip) {
        missing.push(l.id);
      }
    });
    return { total: Object.keys(DATA).length, missing: missing, esc: esc };
  }

  return {
    DATA: DATA,
    get: get,
    cardSimple: cardSimple,
    cardTutorial: cardTutorial,
    cardExercise: cardExercise,
    syncAntes: syncAntesToPractica,
    validateAll: validateAll
  };
})();
