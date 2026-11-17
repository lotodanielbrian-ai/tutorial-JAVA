// Java INPRO — Figuras del manual: un diagrama por capítulo, en SVG.
// Los colores salen de variables CSS (--f-*), así la misma figura sirve en la
// pantalla oscura y en el libro impreso claro.
var FIGURAS = (function () {
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── Piezas ────────────────────────────────────────────────────────────
  function T(x, y, txt, cls, anchor) {
    var lines = String(txt).split('\n');
    var a = anchor || 'middle';
    if (lines.length === 1) return '<text x="' + x + '" y="' + y + '" class="f-t ' + (cls || '') + '" text-anchor="' + a + '">' + esc(txt) + '</text>';
    var start = y - (lines.length - 1) * 8;
    return '<text x="' + x + '" y="' + start + '" class="f-t ' + (cls || '') + '" text-anchor="' + a + '">' +
      lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? 16 : 0) + '">' + esc(l) + '</tspan>'; }).join('') + '</text>';
  }
  function R(x, y, w, h, cls, rx) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx == null ? 8 : rx) + '" class="' + (cls || 'f-box') + '"/>';
  }
  // Caja con texto centrado
  function B(x, y, w, h, txt, cls, tcls) {
    return R(x, y, w, h, cls) + T(x + w / 2, y + h / 2 + 5, txt, tcls);
  }
  function A(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="f-ln ' + (cls || '') + '" marker-end="url(#f-arrow)"/>';
  }
  function L(x1, y1, x2, y2, cls) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="f-ln ' + (cls || '') + '"/>';
  }
  function P(d, cls, arrow) {
    return '<path d="' + d + '" class="f-ln ' + (cls || '') + '"' + (arrow ? ' marker-end="url(#f-arrow)"' : '') + '/>';
  }
  function D(cx, cy, w, h, txt, cls) {
    var pts = [cx + ',' + (cy - h / 2), (cx + w / 2) + ',' + cy, cx + ',' + (cy + h / 2), (cx - w / 2) + ',' + cy].join(' ');
    return '<polygon points="' + pts + '" class="' + (cls || 'f-acc') + '"/>' + T(cx, cy + 5, txt, 'f-m');
  }
  function C(cx, cy, r, cls) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="' + (cls || 'f-box') + '"/>';
  }
  function svg(w, h, body, label) {
    return '<svg class="fig" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><marker id="f-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="f-head"/></marker></defs>' +
      body + '</svg>';
  }
  function fig(w, h, body, caption) { return { svg: svg(w, h, body, caption), caption: caption }; }

  // Fila de casillas con índice abajo
  function cells(x, y, values, opts) {
    opts = opts || {};
    var cw = opts.w || 44;
    var out = '';
    values.forEach(function (v, i) {
      var cls = (opts.hi && opts.hi.indexOf(i) !== -1) ? 'f-acc' : 'f-box';
      out += R(x + i * cw, y, cw, 40, cls, 4) + T(x + i * cw + cw / 2, y + 26, v, 'f-m f-b');
      if (opts.index !== false) out += T(x + i * cw + cw / 2, y + 58, String(i), 'f-s f-m');
    });
    return out;
  }

  // ── Capítulo 0: orientación ──────────────────────────────────────────
  var F = {};

  F.programa = function () {
    var b = '';
    b += B(10, 60, 104, 64, '🧠 Tu idea\n"saludar"', 'f-blue');
    b += A(114, 92, 140, 92);
    b += R(142, 60, 112, 64, 'f-box') + T(198, 88, 'Main.java', 'f-m f-b') + T(198, 106, 'código fuente', 'f-s');
    b += A(254, 92, 290, 92); b += T(272, 80, 'javac', 'f-s f-m');
    b += R(292, 60, 112, 64, 'f-acc') + T(348, 88, 'Main.class', 'f-m f-b') + T(348, 106, 'bytecode', 'f-s');
    b += A(404, 92, 440, 92); b += T(422, 80, 'java', 'f-s f-m');
    b += B(442, 60, 84, 64, 'JVM', 'f-acc', 'f-b');
    b += A(526, 92, 552, 92);
    b += B(554, 60, 76, 64, '¡Hola!', 'f-ok', 'f-m');
    b += T(198, 150, 'Lo escribís\nvos', 'f-s');
    b += T(348, 150, 'Lo genera\nel compilador', 'f-s');
    b += T(484, 150, 'Lo ejecuta en\ncada sistema', 'f-s');
    b += T(320, 30, 'Escribís una vez: el mismo .class corre en Windows, Mac, Linux y Android', 'f-s');
    return fig(640, 170, b, 'De tu idea a la pantalla: escribir, compilar y ejecutar');
  };

  F.jdk = function () {
    var b = '';
    b += R(20, 20, 600, 190, 'f-blue', 14) + T(40, 46, 'JDK · Java Development Kit', 'f-b', 'start') + T(40, 66, 'Para PROGRAMAR: trae el compilador javac, el depurador y otras herramientas', 'f-s', 'start');
    b += R(50, 80, 540, 116, 'f-acc', 12) + T(70, 104, 'JRE · Java Runtime Environment', 'f-b', 'start') + T(70, 122, 'Para EJECUTAR: la JVM + las bibliotecas estándar (String, Math, ArrayList…)', 'f-s', 'start');
    b += R(80, 136, 220, 48, 'f-ok', 10) + T(190, 158, 'JVM', 'f-b') + T(190, 175, 'ejecuta el bytecode', 'f-s');
    b += R(320, 136, 250, 48, 'f-box', 10) + T(445, 158, 'Bibliotecas', 'f-b') + T(445, 175, 'código listo para usar', 'f-s');
    return fig(640, 220, b, 'El JDK contiene al JRE, y el JRE contiene a la JVM. Para aprender, instalás el JDK');
  };

  F.usos = function () {
    var items = [
      ['📱', 'Apps de Android', 'Muchas apps se escriben en Java o en Kotlin, que corre sobre la misma base'],
      ['🏦', 'Bancos y pagos', 'Los sistemas que mueven tu dinero, del lado del servidor'],
      ['🛒', 'Comercio online', 'Servidores que atienden pedidos, stock y facturas'],
      ['📊', 'Grandes datos', 'Herramientas como Kafka, Hadoop o Spark procesan millones de datos'],
      ['🎮', 'Minecraft', 'La edición Java del juego, y sus mods, se programan en Java'],
      ['💳', 'Chips y tarjetas', 'Java Card corre adentro de tarjetas SIM y bancarias']
    ];
    var b = '';
    items.forEach(function (it, i) {
      var x = 10 + (i % 3) * 210, y = 10 + Math.floor(i / 3) * 104;
      b += R(x, y, 200, 94, 'f-box', 10);
      b += T(x + 16, y + 34, it[0], 'f-emoji', 'start') + T(x + 50, y + 32, it[1], 'f-b', 'start');
      var words = it[2].split(' '), line = '', lines = [];
      words.forEach(function (w) { if ((line + ' ' + w).trim().length > 30) { lines.push(line.trim()); line = w; } else line += ' ' + w; });
      lines.push(line.trim());
      lines.forEach(function (l, j) { b += T(x + 16, y + 56 + j * 15, l, 'f-s', 'start'); });
    });
    return fig(640, 220, b, 'Dónde trabaja Java todos los días');
  };

  F.noJava = function () {
    var rows = [
      ['Una página que corre en el navegador', 'JavaScript'],
      ['Un script rápido de 10 líneas', 'Python'],
      ['Un driver o un sistema operativo', 'C o Rust'],
      ['Probar ideas de inteligencia artificial', 'Python'],
      ['Un juego 3D de alto rendimiento', 'C++ o C#']
    ];
    var b = T(160, 22, 'Si querés hacer…', 'f-b') + T(500, 22, '…conviene más', 'f-b');
    rows.forEach(function (r, i) {
      var y = 34 + i * 40;
      b += B(10, y, 300, 32, r[0], 'f-box') + A(316, y + 16, 400, y + 16) + B(406, y, 190, 32, r[1], 'f-blue', 'f-b');
    });
    return fig(640, 240, b, 'Java puede casi todo, pero no siempre es la mejor herramienta');
  };

  F.javascript = function () {
    var rows = [['', 'Java', 'JavaScript'], ['Dónde corre', 'En la JVM: servidores, Android', 'En el navegador (y en Node.js)'], ['Tipos', 'Estrictos: int edad = 25;', 'Flexibles: let edad = 25;'], ['Se compila', 'Sí, a bytecode', 'No hace falta'], ['Parecido', 'Solo el nombre y algo de sintaxis', '']];
    var b = '';
    rows.forEach(function (r, i) {
      var y = 10 + i * 38;
      var head = i === 0;
      b += R(10, y, 150, 32, head ? 'f-none' : 'f-box', 4) + T(20, y + 21, r[0], 'f-b', 'start');
      if (i === 4) { b += R(166, y, 464, 32, 'f-acc', 4) + T(398, y + 21, r[1], 'f-b'); return; }
      b += R(166, y, 230, 32, head ? 'f-acc' : 'f-box', 4) + T(281, y + 21, r[1], head ? 'f-b' : '');
      b += R(400, y, 230, 32, head ? 'f-blue' : 'f-box', 4) + T(515, y + 21, r[2], head ? 'f-b' : '');
    });
    return fig(640, 200, b, 'Java y JavaScript son lenguajes distintos: el nombre es una coincidencia de marketing de 1995');
  };

  F.errores = function () {
    var b = '';
    b += B(10, 40, 130, 50, '✍️ Escribís', 'f-box');
    b += A(140, 65, 170, 65);
    b += B(172, 40, 130, 50, '⚙️ Compilás', 'f-acc');
    b += A(302, 65, 332, 65);
    b += B(334, 40, 130, 50, '▶ Ejecutás', 'f-acc');
    b += A(464, 65, 494, 65);
    b += B(496, 40, 134, 50, '✅ Resultado', 'f-ok');
    b += R(172, 104, 130, 96, 'f-bad', 8) + T(237, 124, 'De compilación', 'f-b') + T(237, 164, 'Falta un ;\nint x = "hola";\nnombre mal escrito', 'f-s f-m');
    b += R(334, 104, 130, 96, 'f-bad', 8) + T(399, 124, 'De ejecución', 'f-b') + T(399, 164, 'dividir por 0\níndice fuera\nnull.length()', 'f-s f-m');
    b += R(496, 104, 134, 96, 'f-bad', 8) + T(563, 124, 'De lógica', 'f-b') + T(563, 164, 'corre, pero\nel resultado\nestá mal', 'f-s');
    b += T(320, 22, 'Dónde aparece cada tipo de error', 'f-s');
    return fig(640, 210, b, 'Tres clases de errores: el compilador te avisa de los primeros; los otros los descubrís al probar');
  };

  // ── Capítulos ────────────────────────────────────────────────────────
  F[1] = function () {
    var b = '';
    b += R(10, 10, 330, 180, 'f-blue', 12) + T(26, 34, '🏢 public class Main  { … }', 'f-m f-b', 'start') + T(26, 52, 'el edificio: todo vive adentro', 'f-s', 'start');
    b += R(30, 66, 290, 108, 'f-acc', 10) + T(46, 90, '⚙️ public static void main(…)', 'f-m f-b', 'start') + T(46, 108, 'la máquina donde arranca el programa', 'f-s', 'start');
    b += R(50, 120, 250, 40, 'f-ok', 8) + T(175, 145, 'System.out.println("Hola");', 'f-m');
    b += T(490, 40, 'Cada instrucción termina con ;', 'f-s') + T(490, 60, 'Cada { tiene su }', 'f-s');
    b += A(360, 140, 300, 140);
    b += B(380, 110, 230, 60, 'println → imprime y baja\nprint → imprime y se queda', 'f-box', 'f-s f-m');
    return fig(640, 200, b, 'La estructura mínima: una clase que contiene a main, que contiene las instrucciones');
  };

  F[2] = function () {
    var vars = [['int', 'edad', '25'], ['double', 'precio', '19.99'], ['String', 'nombre', '"Ana"'], ['boolean', 'activo', 'true'], ['char', 'inicial', "'A'"]];
    var b = '';
    vars.forEach(function (v, i) {
      var x = 10 + i * 126;
      b += R(x, 20, 114, 26, 'f-acc', 6) + T(x + 57, 38, v[0], 'f-m f-b');
      b += R(x, 52, 114, 70, 'f-box', 8) + T(x + 57, 94, v[2], 'f-m f-b');
      b += R(x + 14, 130, 86, 24, 'f-blue', 12) + T(x + 57, 147, v[1], 'f-m');
    });
    b += T(320, 182, 'tipo (qué entra)  ·  valor (lo guardado)  ·  nombre (la etiqueta)', 'f-s');
    return fig(640, 196, b, 'Una variable es una caja con etiqueta: el tipo dice qué puede guardar');
  };

  F[3] = function () {
    var b = T(320, 20, '7 caramelos repartidos de a 2', 'f-b');
    var pos = [[60, 70], [90, 70], [190, 70], [220, 70], [320, 70], [350, 70], [470, 70]];
    [[45, 60], [175, 60], [305, 60]].forEach(function (g) { b += R(g[0], 44, 90, 52, 'f-ok', 26); });
    pos.forEach(function (p, i) { b += C(p[0] + 6, p[1], 11, i === 6 ? 'f-bad' : 'f-acc'); });
    b += T(155, 124, '3 grupos completos', 'f-s') + T(476, 124, '1 sobra', 'f-s');
    b += B(60, 140, 220, 44, '7 / 2  →  3', 'f-blue', 'f-m f-b');
    b += B(360, 140, 220, 44, '7 % 2  →  1', 'f-acc', 'f-m f-b');
    b += T(320, 206, 'Con dos int, / descarta los decimales. 7 / 2.0 sí da 3.5', 'f-s');
    return fig(640, 216, b, 'División entera y resto: / cuenta los grupos y % lo que sobra');
  };

  F[4] = function () {
    var chars = ['H', 'o', 'l', 'a', '␣', 'J', 'a', 'v', 'a'];
    var b = T(20, 30, 'String s = "Hola Java";', 'f-m f-b', 'start');
    b += cells(60, 50, chars, { w: 52, hi: [5] });
    b += P('M60,124 L60,134 L268,134 L268,124', 'f-ln-acc') + T(164, 154, 's.substring(0, 4) → "Hola"', 'f-m f-s');
    b += A(346, 170, 346, 112, 'f-ln-acc') + T(346, 190, 's.charAt(5) → \'J\'', 'f-m f-s');
    b += T(560, 154, 's.length() → 9', 'f-m f-s');
    b += T(320, 214, 'Las posiciones empiezan en 0 · el final de substring no se incluye', 'f-s');
    return fig(640, 224, b, 'Un String es una fila de caracteres numerados desde 0');
  };

  F[5] = function () {
    var t = ['byte', 'short', 'int', 'long', 'float', 'double'];
    var b = '';
    t.forEach(function (n, i) { b += B(10 + i * 106, 60, 92, 40, n, i === 2 || i === 5 ? 'f-acc' : 'f-box', 'f-m f-b'); if (i) b += A(i * 106 + 2, 80, i * 106 + 10, 80); });
    b += A(40, 34, 600, 34, 'f-ln-ok') + T(320, 24, 'Automático: de chico a grande, no se pierde nada', 'f-s f-tok');
    b += A(600, 126, 40, 126, 'f-ln-bad') + T(320, 146, 'Con cast: (int) 9.99 → 9   puede perder datos', 'f-s f-tbad');
    b += R(40, 160, 560, 40, 'f-blue') + T(320, 178, 'Texto → número', 'f-s f-b') + T(320, 194, 'Integer.parseInt("42")  ·  Double.parseDouble("3.5")', 'f-s f-m');
    return fig(640, 206, b, 'Conversiones: ensanchar es automático, achicar exige un cast');
  };

  F[6] = function () {
    var b = '';
    b += B(10, 50, 150, 44, '"  Java Student  "', 'f-box', 'f-m f-s');
    b += A(160, 72, 222, 72) + T(191, 40, 'trim()', 'f-s f-m');
    b += B(224, 50, 130, 44, '"Java Student"', 'f-box', 'f-m f-s');
    b += A(354, 72, 470, 72) + T(412, 40, 'toUpperCase()', 'f-s f-m');
    b += B(472, 50, 140, 44, '"JAVA STUDENT"', 'f-ok', 'f-m f-s');
    b += B(10, 130, 220, 44, '85 + 72 + 90 = 247', 'f-box', 'f-m');
    b += A(230, 152, 276, 152) + T(253, 142, '/ 3', 'f-s f-m');
    b += B(278, 130, 110, 44, '82', 'f-ok', 'f-m f-b') + T(500, 146, 'con int: 82,33 → 82', 'f-s') + T(500, 164, '(trunca, no redondea)', 'f-s');
    return fig(640, 190, b, 'El examen junta lo visto: métodos de String encadenados y división entera');
  };

  F[7] = function () {
    var b = '';
    b += D(320, 54, 200, 72, 'nota >= 60 ?');
    b += P('M220,54 L110,54 L110,104', '', true) + T(160, 46, 'true', 'f-s f-tok');
    b += P('M420,54 L530,54 L530,104', '', true) + T(480, 46, 'false', 'f-s f-tbad');
    b += B(30, 106, 160, 44, '"Aprobado"', 'f-ok', 'f-m');
    b += B(450, 106, 160, 44, '"Desaprobado"', 'f-bad', 'f-m');
    b += P('M110,150 L110,180 L300,180', '', true) + P('M530,150 L530,180 L340,180', '', true);
    b += B(250, 168, 140, 30, 'sigue el programa', 'f-box', 'f-s');
    return fig(640, 206, b, 'if / else: el programa elige un solo camino según la condición');
  };

  F[8] = function () {
    var b = B(10, 80, 120, 44, 'dia = 3', 'f-blue', 'f-m f-b');
    var cases = [['case 1', '"Lunes"'], ['case 2', '"Martes"'], ['case 3', '"Miércoles"'], ['default', '"No válido"']];
    cases.forEach(function (c, i) {
      var y = 10 + i * 48, hi = i === 2;
      b += P('M130,102 C160,102 160,' + (y + 18) + ' 190,' + (y + 18), hi ? 'f-ln-acc' : 'f-dash', hi);
      b += B(192, y, 110, 36, c[0], hi ? 'f-acc' : 'f-box', 'f-m');
      b += A(302, y + 18, 336, y + 18, hi ? 'f-ln-acc' : 'f-dash');
      b += B(338, y, 130, 36, c[1], hi ? 'f-ok' : 'f-box', 'f-m f-s');
    });
    b += B(490, 104, 140, 36, 'break → sale', 'f-acc', 'f-m f-s');
    b += P('M468,122 L488,122', 'f-ln-acc', true);
    return fig(640, 206, b, 'switch: compara una variable contra valores exactos y salta al case que coincide');
  };

  F[9] = function () {
    var b = T(160, 20, 'Y  (&&)', 'f-b') + T(480, 20, 'O  (||)', 'f-b');
    // Y: en serie
    b += L(20, 80, 60, 80) + B(60, 64, 70, 32, 'A', 'f-acc', 'f-m f-b') + L(130, 80, 170, 80) + B(170, 64, 70, 32, 'B', 'f-acc', 'f-m f-b') + L(240, 80, 270, 80) + C(286, 80, 16, 'f-ok') + T(286, 85, '💡', 'f-s');
    b += T(160, 128, 'La luz prende solo si A y B', 'f-s') + T(160, 146, 'están cerradas a la vez', 'f-s');
    // O: en paralelo
    b += L(360, 80, 390, 80) + P('M390,80 L390,56 L420,56') + P('M390,80 L390,104 L420,104') + B(420, 40, 70, 32, 'A', 'f-acc', 'f-m f-b') + B(420, 88, 70, 32, 'B', 'f-acc', 'f-m f-b') + P('M490,56 L520,56 L520,80') + P('M490,104 L520,104 L520,80') + L(520, 80, 560, 80) + C(576, 80, 16, 'f-ok') + T(576, 85, '💡', 'f-s');
    b += T(480, 146, 'Alcanza con que una esté cerrada', 'f-s');
    b += B(170, 166, 300, 32, '!  invierte: !true → false', 'f-blue', 'f-m f-s');
    return fig(640, 206, b, 'Operadores lógicos como circuitos: && en serie, || en paralelo');
  };

  F[10] = function () {
    var b = T(20, 24, 'Lo que tipeaste queda en una fila esperando:', 'f-s', 'start');
    b += cells(20, 36, ['2', '5', '⏎', 'A', 'n', 'a', '⏎'], { w: 50, index: false, hi: [2] });
    b += P('M20,90 L20,100 L120,100 L120,90', 'f-ln-ok') + T(70, 120, 'nextInt() → 25', 'f-m f-s f-tok');
    b += A(145, 150, 145, 84, 'f-ln-bad') + T(145, 168, 'nextLine() lee "" (el ⏎ que quedó)', 'f-m f-s f-tbad', 'start');
    b += B(400, 36, 230, 44, 'Solución: después de nextInt(),\nun sc.nextLine() extra', 'f-ok', 'f-s');
    b += B(400, 100, 230, 44, 'o leer todo como línea:\nInteger.parseInt(sc.nextLine())', 'f-blue', 'f-s f-m');
    return fig(640, 186, b, 'Scanner lee de una fila: nextInt deja el Enter, y el nextLine siguiente se lo come');
  };

  F[11] = function () {
    var b = '';
    b += B(250, 6, 140, 34, 'int i = 1;', 'f-box', 'f-m');
    b += A(320, 40, 320, 58);
    b += D(320, 92, 180, 64, 'i <= 3 ?');
    b += A(320, 124, 320, 146) + T(334, 140, 'true', 'f-s f-tok', 'start');
    b += B(230, 148, 180, 50, 'println(i);\ni++;', 'f-acc', 'f-m');
    b += P('M230,173 L150,173 L150,92 L228,92', '', true) + T(150, 200, 'vuelve a preguntar', 'f-s');
    b += A(410, 92, 500, 92) + T(455, 84, 'false', 'f-s f-tbad');
    b += B(502, 74, 120, 36, 'sale', 'f-ok');
    return fig(640, 210, b, 'while: pregunta antes de cada vuelta; si la condición nunca se vuelve false, no termina');
  };

  F[12] = function () {
    var b = '';
    b += T(320, 30, 'for (int i = 0;  i < 3;  i++) { … }', 'f-m f-b');
    b += P('M180,38 L180,58', 'f-ln-blue', true) + T(180, 76, '① inicio (una vez)', 'f-s');
    b += P('M330,38 L330,58', 'f-ln-acc', true) + T(330, 76, '② condición', 'f-s');
    b += P('M440,38 L440,58', 'f-ln-ok', true) + T(450, 76, '③ paso', 'f-s');
    var rows = [['vuelta', 'i', 'i < 3', 'hace'], ['1', '0', 'true', 'cuerpo'], ['2', '1', 'true', 'cuerpo'], ['3', '2', 'true', 'cuerpo'], ['—', '3', 'false', 'sale']];
    rows.forEach(function (r, i) {
      var y = 90 + i * 24;
      r.forEach(function (c, j) {
        b += R(170 + j * 76, y, 76, 24, i === 0 ? 'f-acc' : (r[2] === 'false' ? 'f-bad' : 'f-box'), 0) + T(208 + j * 76, y + 17, c, i === 0 ? 'f-s f-b' : 'f-s f-m');
      });
    });
    return fig(640, 214, b, 'for junta en una línea el inicio, la condición y el paso; la tabla sigue cada vuelta');
  };

  F[13] = function () {
    var b = T(20, 26, 'int[] notas = {8, 6, 9, 7};', 'f-m f-b', 'start');
    b += cells(150, 50, ['8', '6', '9', '7'], { w: 64, hi: [2] });
    b += R(406, 50, 64, 40, 'f-bad', 4) + T(438, 76, '✗', 'f-b f-tbad') + T(438, 108, '4', 'f-s f-m');
    b += T(232, 140, 'notas[2] → 9', 'f-m f-s') + T(310, 160, 'notas.length → 4 (sin paréntesis)', 'f-m f-s');
    b += T(500, 140, 'notas[4] →', 'f-m f-s f-tbad') + T(530, 158, 'ArrayIndexOutOfBounds', 'f-m f-s f-tbad');
    b += T(320, 192, 'Tamaño fijo · índices de 0 a length - 1 · se recorre con un for', 'f-s');
    return fig(640, 204, b, 'Un array: casillas del mismo tipo, numeradas desde 0');
  };

  F[14] = function () {
    var b = T(160, 22, 'Procedural', 'f-b') + T(480, 22, 'Orientada a objetos', 'f-b');
    b += B(30, 40, 110, 44, 'datos', 'f-box') + B(30, 100, 110, 44, 'datos', 'f-box');
    b += B(180, 40, 120, 30, 'calcular()', 'f-blue', 'f-m f-s') + B(180, 78, 120, 30, 'imprimir()', 'f-blue', 'f-m f-s') + B(180, 116, 120, 30, 'guardar()', 'f-blue', 'f-m f-s');
    b += A(140, 62, 178, 55, 'f-dash') + A(140, 122, 178, 93, 'f-dash');
    [0, 1].forEach(function (k) {
      var x = 360 + k * 140;
      b += R(x, 40, 124, 108, 'f-acc', 16) + T(x + 62, 62, k ? 'luis' : 'ana', 'f-b f-m') + T(x + 62, 84, 'nombre, edad', 'f-s') + R(x + 12, 96, 100, 40, 'f-blue', 6) + T(x + 62, 120, 'presentarse()', 'f-s f-m');
    });
    b += T(160, 176, 'Las funciones trabajan sobre datos sueltos', 'f-s') + T(480, 176, 'Cada objeto junta sus datos y lo que sabe hacer', 'f-s');
    return fig(640, 190, b, 'Dos formas de organizar un programa');
  };

  F[15] = function () {
    var v = ['150', '320', '90', '480', '200'];
    var b = T(20, 26, 'int[] ventas = {150, 320, 90, 480, 200};   ¿cuántas superan 200?', 'f-m f-s', 'start');
    v.forEach(function (n, i) {
      var ok = Number(n) > 200;
      b += R(40 + i * 110, 46, 90, 44, ok ? 'f-ok' : 'f-box', 6) + T(85 + i * 110, 74, n, 'f-m f-b') + T(85 + i * 110, 112, ok ? '✓ cuenta' : '✗', ok ? 'f-s f-tok' : 'f-s');
    });
    b += A(40, 136, 590, 136, 'f-ln-acc') + T(315, 156, 'for recorre cada casilla · if decide si suma al contador', 'f-s');
    b += B(220, 168, 200, 32, 'contador = 2', 'f-acc', 'f-m f-b');
    return fig(640, 210, b, 'Bucle + condición: el patrón de contar lo que cumple una regla (200 no supera a 200)');
  };

  F[16] = function () {
    var b = B(20, 70, 150, 60, 'main', 'f-box', 'f-m f-b');
    [0, 1, 2].forEach(function (i) { b += A(170, 82 + i * 18, 270, 82 + i * 18, 'f-ln-acc'); });
    b += T(220, 66, 'lo llama 3 veces', 'f-s');
    b += R(272, 50, 200, 100, 'f-acc', 14) + T(372, 80, '⚙️ imprimirSeparador()', 'f-m f-b') + T(372, 104, 'void: hace algo,', 'f-s') + T(372, 122, 'no devuelve nada', 'f-s');
    b += A(472, 100, 520, 100) + B(522, 70, 110, 60, '----------\n----------\n----------', 'f-ok', 'f-m f-s');
    return fig(640, 180, b, 'Un método void es una tarea con nombre: la escribís una vez y la usás cuando quieras');
  };

  F[17] = function () {
    var b = B(10, 46, 60, 36, '3', 'f-blue', 'f-m f-b') + B(10, 96, 60, 36, '4', 'f-blue', 'f-m f-b');
    b += A(70, 64, 160, 80) + A(70, 114, 160, 98) + T(110, 40, 'parámetros', 'f-s');
    b += R(162, 46, 200, 90, 'f-acc', 14) + T(262, 76, '⚙️ int sumar(int a, int b)', 'f-m f-s f-b') + T(262, 104, 'return a + b;', 'f-m');
    b += A(362, 90, 430, 90) + T(396, 80, 'devuelve', 'f-s');
    b += B(432, 70, 60, 40, '7', 'f-ok', 'f-m f-b');
    b += T(320, 172, 'int resultado = sumar(3, 4);   // resultado vale 7', 'f-m f-s');
    return fig(640, 186, b, 'Un método con return: recibe datos, calcula y te devuelve un resultado que podés guardar');
  };

  F[18] = function () {
    var b = R(10, 30, 180, 130, 'f-blue', 10) + T(100, 54, 'class Persona', 'f-m f-b') + L(10, 64, 190, 64) + T(24, 86, 'String nombre;', 'f-m f-s', 'start') + T(24, 106, 'int edad;', 'f-m f-s', 'start') + L(10, 118, 190, 118) + T(24, 142, 'presentarse()', 'f-m f-s', 'start');
    b += T(100, 182, 'el molde', 'f-s');
    b += A(190, 70, 290, 52) + A(190, 120, 290, 132) + T(240, 100, 'new', 'f-m f-s');
    b += R(292, 20, 150, 70, 'f-acc', 12) + T(367, 46, 'nombre = "Ana"', 'f-m f-s') + T(367, 68, 'edad = 30', 'f-m f-s');
    b += R(292, 104, 150, 70, 'f-acc', 12) + T(367, 130, 'nombre = "Luis"', 'f-m f-s') + T(367, 152, 'edad = 25', 'f-m f-s');
    b += B(510, 36, 110, 34, 'Persona p1', 'f-box', 'f-m f-s') + A(510, 53, 444, 53, 'f-ln-acc');
    b += B(510, 120, 110, 34, 'Persona p2', 'f-box', 'f-m f-s') + A(510, 137, 444, 137, 'f-ln-acc');
    b += T(565, 182, 'la variable apunta al objeto', 'f-s');
    return fig(640, 196, b, 'La clase es el molde; cada new fabrica un objeto, y la variable guarda la flecha hacia él');
  };

  F[19] = function () {
    var steps = ['new Producto(\n"Yerba", 1500)', '1. reserva memoria', '2. corre el constructor:\nthis.nombre = nombre;', '3. devuelve el objeto listo'];
    var b = '';
    steps.forEach(function (s, i) {
      var x = 10 + i * 158;
      b += B(x, 50, 146, 64, s, i === 0 ? 'f-blue' : (i === 3 ? 'f-ok' : 'f-acc'), i ? 'f-s' : 'f-m f-s');
      if (i) b += A(x - 12, 82, x - 2, 82);
    });
    b += T(320, 150, 'this.nombre es el atributo del objeto · nombre es el parámetro que llegó', 'f-s');
    b += T(320, 172, 'Sin constructor propio, Java usa uno vacío; si escribís uno, el vacío desaparece', 'f-s');
    return fig(640, 184, b, 'El constructor deja listo el objeto apenas nace');
  };

  F[20] = function () {
    var b = R(180, 30, 280, 140, 'f-acc', 60) + T(320, 64, '🔒 private int edad;', 'f-m f-b') + T(320, 86, 'nadie la toca desde afuera', 'f-s');
    b += B(220, 104, 200, 32, 'if (edad >= 0) …', 'f-blue', 'f-m f-s');
    b += B(10, 52, 130, 36, 'getEdad()', 'f-ok', 'f-m') + A(140, 70, 186, 80) + T(76, 104, 'leer: puerta de salida', 'f-s');
    b += B(500, 40, 130, 36, 'setEdad(30)', 'f-ok', 'f-m') + A(500, 58, 452, 80) + T(566, 92, 'pasa ✓', 'f-s f-tok');
    b += B(500, 116, 130, 36, 'setEdad(-5)', 'f-bad', 'f-m') + A(500, 134, 452, 124, 'f-ln-bad') + T(566, 170, 'la validación lo frena ✗', 'f-s f-tbad');
    return fig(640, 184, b, 'Encapsular: los datos quedan adentro y solo se cambian por métodos que controlan');
  };

  F[21] = function () {
    var b = R(220, 10, 200, 76, 'f-blue', 10) + T(320, 32, 'Animal', 'f-m f-b') + T(320, 54, 'nombre', 'f-m f-s') + T(320, 72, 'comer()', 'f-m f-s');
    b += R(60, 128, 200, 60, 'f-acc', 10) + T(160, 152, 'Perro extends Animal', 'f-m f-s f-b') + T(160, 174, '+ ladrar()', 'f-m f-s');
    b += R(380, 128, 200, 60, 'f-acc', 10) + T(480, 152, 'Gato extends Animal', 'f-m f-s f-b') + T(480, 174, '+ maullar()', 'f-m f-s');
    b += A(160, 126, 270, 88) + A(480, 126, 370, 88);
    b += T(320, 116, '"es un"', 'f-s');
    b += T(320, 206, 'Perro hereda nombre y comer() sin reescribirlos, y suma lo propio', 'f-s');
    return fig(640, 216, b, 'Herencia: la clase hija recibe lo del padre y agrega lo suyo');
  };

  F[22] = function () {
    var b = T(20, 24, 'Animal[] zoo = { new Perro(), new Gato(), new Vaca() };', 'f-m f-s', 'start');
    [['Perro', '"Guau"'], ['Gato', '"Miau"'], ['Vaca', '"Muu"']].forEach(function (a, i) {
      var x = 40 + i * 200;
      b += R(x, 40, 160, 44, 'f-box', 4) + T(x + 80, 58, 'zoo[' + i + ']', 'f-s f-m') + T(x + 80, 76, a[0], 'f-m f-b');
      b += A(x + 80, 84, x + 80, 116) + T(x + 86, 104, 'hacerSonido()', 'f-s f-m', 'start');
      b += B(x + 20, 118, 120, 40, a[1], 'f-ok', 'f-m f-b');
    });
    b += T(320, 186, 'El mismo mensaje, y cada objeto responde a su manera', 'f-s');
    return fig(640, 198, b, 'Polimorfismo: una variable del tipo padre, y cada objeto ejecuta su propia versión');
  };

  F[23] = function () {
    var b = R(200, 10, 240, 64, 'f-blue', 10) + T(320, 34, 'interface Imprimible', 'f-m f-b') + T(320, 56, 'void imprimir();   // el contrato', 'f-m f-s');
    b += R(40, 120, 220, 60, 'f-acc', 10) + T(150, 144, 'Documento implements', 'f-m f-s f-b') + T(150, 166, '"Imprimiendo documento..."', 'f-m f-s');
    b += R(380, 120, 220, 60, 'f-acc', 10) + T(490, 144, 'Foto implements', 'f-m f-s f-b') + T(490, 166, '"Imprimiendo foto..."', 'f-m f-s');
    b += A(150, 118, 270, 76, 'f-dash') + A(490, 118, 370, 76, 'f-dash');
    b += T(320, 206, 'Clase abstracta: un molde a medio hacer · Interfaz: solo la lista de lo que hay que saber hacer', 'f-s');
    return fig(640, 216, b, 'Una interfaz es un contrato: cada clase que la implementa promete esos métodos');
  };

  F[24] = function () {
    var b = T(20, 24, 'ArrayList<String> carrito', 'f-m f-b', 'start');
    b += cells(20, 36, ['Yerba', 'Pan', 'Leche'], { w: 80 });
    b += R(260, 36, 80, 40, 'f-ok', 4) + T(300, 62, 'Café', 'f-m f-b') + T(300, 94, '3', 'f-s f-m') + T(420, 62, '← add("Café") la agranda', 'f-s f-tok');
    b += T(20, 134, 'remove(1):', 'f-m f-s', 'start');
    b += cells(20, 146, ['Yerba', 'Leche', 'Café'], { w: 80 });
    b += P('M180,140 C150,128 130,128 110,140', 'f-ln-acc', true) + T(460, 172, 'los de la derecha se corren:\nlos índices cambian', 'f-s');
    return fig(640, 214, b, 'ArrayList: una lista que crece y se achica sola');
  };

  F[25] = function () {
    var rows = [['📁 mi-app', 0], ['📁 src/main/java', 1], ['📁 com/miapp', 2], ['☕ Main.java', 3], ['📁 modelo', 3], ['☕ Producto.java', 4]];
    var b = '';
    rows.forEach(function (r, i) { b += T(30 + r[1] * 26, 30 + i * 28, r[0], r[0].indexOf('☕') === 0 ? 'f-m f-b' : 'f-m', 'start'); });
    b += A(260, 170, 340, 170, 'f-ln-acc');
    b += B(344, 150, 286, 40, 'package com.miapp.modelo;', 'f-acc', 'f-m');
    b += T(486, 60, 'El package de cada archivo', 'f-s') + T(486, 78, 'tiene que coincidir con', 'f-s') + T(486, 96, 'las carpetas donde está', 'f-s');
    return fig(640, 200, b, 'Carpetas y paquetes: el proyecto se ordena como un archivo de oficina');
  };

  F[26] = function () {
    var b = B(10, 60, 130, 60, '☕ Programa\nwrite("Hola")', 'f-box', 'f-s');
    b += A(140, 90, 200, 90);
    b += R(202, 50, 170, 80, 'f-acc', 10) + T(287, 78, 'BufferedWriter', 'f-m f-b') + T(287, 100, 'junta el texto', 'f-s') + T(287, 118, 'en un balde', 'f-s');
    b += A(372, 90, 450, 90, 'f-ln-ok') + T(411, 80, 'close()', 'f-m f-s');
    b += B(452, 60, 170, 60, '📄 datos.txt', 'f-ok', 'f-m');
    b += T(320, 156, 'Sin close(), el balde puede no vaciarse y el archivo queda vacío o incompleto', 'f-s f-tbad');
    b += T(320, 176, 'try (…) { } cierra solo, aunque haya un error', 'f-s');
    return fig(640, 188, b, 'Escribir un archivo: el texto pasa por un búfer que se vacía al cerrar');
  };

  F[27] = function () {
    var b = B(20, 40, 160, 50, 'try {\n  riesgoso();', 'f-blue', 'f-m f-s');
    b += A(180, 65, 260, 65) + T(220, 56, '¿error?', 'f-s');
    b += B(262, 40, 150, 50, 'no: sigue el try', 'f-ok', 'f-s');
    b += P('M100,90 L100,130 L260,130', 'f-ln-bad', true) + T(170, 122, 'sí: salta', 'f-s f-tbad');
    b += B(262, 108, 150, 44, 'catch (Exception e)', 'f-bad', 'f-m f-s');
    b += A(412, 65, 470, 100) + A(412, 130, 470, 112);
    b += B(472, 82, 150, 44, 'finally: siempre', 'f-acc', 'f-s');
    b += T(320, 186, 'El programa no se cae: atrapa el error, lo maneja y sigue', 'f-s');
    return fig(640, 198, b, 'try / catch / finally: un plan B para lo que puede fallar');
  };

  F[28] = function () {
    var b = B(250, 6, 140, 34, 'Throwable', 'f-box', 'f-m f-b');
    b += B(90, 70, 160, 34, 'Exception', 'f-blue', 'f-m f-b') + B(420, 70, 140, 34, 'Error', 'f-box', 'f-m');
    b += A(300, 40, 190, 68) + A(340, 40, 480, 68);
    b += B(10, 140, 160, 34, 'IOException', 'f-acc', 'f-m f-s') + B(180, 140, 210, 34, 'RuntimeException', 'f-acc', 'f-m f-s');
    b += A(130, 104, 90, 138) + A(200, 104, 280, 138);
    b += T(90, 194, 'checked: obliga a try o throws', 'f-s') + T(285, 194, 'unchecked: no obliga', 'f-s');
    b += B(410, 130, 220, 48, 'class SaldoInsuficiente\nextends Exception', 'f-ok', 'f-m f-s');
    b += A(410, 150, 252, 92, 'f-dash');
    b += T(520, 194, 'la tuya, con nombre del negocio', 'f-s');
    return fig(640, 206, b, 'La familia de las excepciones: de quién heredás decide si Java te obliga a manejarla');
  };

  F[29] = function () {
    var b = B(20, 20, 200, 120, '=== GESTOR ===\n1. Agregar\n2. Listar\n3. Contar\n4. Salir', 'f-box', 'f-m f-s');
    b += A(220, 80, 270, 80);
    b += D(340, 80, 140, 60, 'opción');
    b += A(410, 80, 460, 40) + A(410, 80, 460, 80) + A(410, 80, 460, 120);
    b += B(462, 24, 168, 32, 'case 1: agregar()', 'f-acc', 'f-m f-s') + B(462, 64, 168, 32, 'case 2: listar()', 'f-acc', 'f-m f-s') + B(462, 104, 168, 32, 'case 4: salir', 'f-ok', 'f-m f-s');
    b += P('M630,40 L636,40 L636,176 L340,176 L340,112', '', true);
    b += T(470, 196, 'while: vuelve a leer otra opción hasta que elijas salir', 'f-s');
    return fig(640, 206, b, 'Un menú es un while que envuelve a un switch');
  };

  F[30] = function () {
    var b = R(10, 40, 180, 110, 'f-box', 10) + T(100, 66, '📂 Carpeta de trabajo', 'f-b') + T(100, 92, 'donde editás', 'f-s') + T(100, 112, 'Main.java (modificado)', 'f-s f-m');
    b += R(230, 40, 180, 110, 'f-acc', 10) + T(320, 66, '📋 Staging', 'f-b') + T(320, 92, 'lo elegido para', 'f-s') + T(320, 112, 'el próximo commit', 'f-s');
    b += R(450, 40, 180, 110, 'f-ok', 10) + T(540, 66, '🗄️ Repositorio', 'f-b') + T(540, 92, 'el historial', 'f-s') + T(540, 112, 'de fotos guardadas', 'f-s');
    b += A(190, 24, 230, 24, 'f-ln-acc') + T(210, 16, 'git add', 'f-m f-s');
    b += A(410, 24, 450, 24, 'f-ln-ok') + T(430, 16, 'git commit', 'f-m f-s');
    b += T(320, 180, 'git status te dice qué hay en cada zona', 'f-s');
    return fig(640, 196, b, 'Las tres zonas de Git: editás, elegís qué guardar y guardás una foto con mensaje');
  };

  F[31] = function () {
    var commits = [['a1b2', 'Primer programa'], ['c3d4', 'Agrego Producto'], ['e5f6', 'Valido el precio'], ['g7h8', 'Arreglo el menú']];
    var b = L(60, 70, 560, 70, 'f-ln-acc');
    commits.forEach(function (c, i) {
      var x = 70 + i * 160;
      b += C(x, 70, 14, i === 3 ? 'f-ok' : 'f-acc') + T(x, 40, c[0], 'f-m f-s') + T(x, 108, c[1], 'f-s');
    });
    b += T(550, 22, 'HEAD → main', 'f-m f-s f-ta');
    b += T(240, 160, 'git log muestra la historia · cada commit se puede recuperar', 'f-s');
    return fig(640, 178, b, 'Un historial de commits: cada punto es una foto del proyecto con su mensaje');
  };

  F[32] = function () {
    var b = R(10, 10, 620, 190, 'f-box', 10) + R(10, 10, 620, 26, 'f-acc', 10);
    b += T(30, 28, '●  ●  ●     IntelliJ IDEA · Eclipse · VS Code', 'f-s', 'start');
    b += R(20, 44, 140, 146, 'f-none', 4) + T(30, 62, '📁 Proyecto', 'f-s f-b', 'start') + T(40, 82, '☕ Main.java', 'f-s f-m', 'start') + T(40, 100, '☕ Producto.java', 'f-s f-m', 'start');
    b += R(170, 44, 450, 96, 'f-none', 4) + T(186, 64, '1  public class Main {', 'f-s f-m', 'start') + C(178, 80, 5, 'f-bad') + T(186, 84, '2      int total = 0;    ← breakpoint', 'f-s f-m', 'start') + T(186, 104, '3      …', 'f-s f-m', 'start');
    b += R(170, 146, 450, 44, 'f-none', 4) + T(186, 166, '▶ Consola · 🐞 Depurador · 🔀 Git', 'f-s', 'start') + T(186, 182, 'total = 0', 'f-s f-m', 'start');
    return fig(640, 210, b, 'Las partes de un IDE: explorador, editor, consola, depurador y Git en una sola ventana');
  };

  F[33] = function () {
    var b = R(20, 50, 220, 100, 'f-acc', 12) + T(130, 78, '💻 Tu repositorio local', 'f-b') + T(130, 104, 'git init · add · commit', 'f-m f-s');
    b += R(400, 50, 220, 100, 'f-blue', 12) + T(510, 78, '☁️ GitHub (origin)', 'f-b') + T(510, 104, 'copia remota compartida', 'f-s');
    b += A(240, 82, 398, 82, 'f-ln-ok') + T(320, 74, 'git push', 'f-m f-s');
    b += A(398, 120, 240, 120, 'f-ln-acc') + T(320, 140, 'git pull · git clone', 'f-m f-s');
    b += T(320, 176, 'La primera vez:', 'f-s f-b') + T(320, 194, 'git remote add origin <url>  ·  git branch -M main  ·  git push -u origin main', 'f-s f-m');
    return fig(640, 206, b, 'Local y remoto: push sube tus commits, pull trae los de los demás');
  };

  F[34] = function () {
    var b = R(20, 40, 200, 110, 'f-blue', 10) + T(120, 62, 'Biblioteca', 'f-m f-b') + L(20, 72, 220, 72) + T(32, 94, '- ArrayList<Libro> libros', 'f-m f-s', 'start') + T(32, 116, '+ agregar · listar', 'f-m f-s', 'start') + T(32, 136, '+ buscar · eliminar', 'f-m f-s', 'start');
    b += R(420, 40, 200, 110, 'f-acc', 10) + T(520, 62, 'Libro', 'f-m f-b') + L(420, 72, 620, 72) + T(432, 94, '- titulo, autor, anio', 'f-m f-s', 'start') + T(432, 116, '+ getTitulo() …', 'f-m f-s', 'start');
    b += '<polygon points="220,95 232,89 244,95 232,101" class="f-acc"/>' + L(244, 95, 418, 95) + T(400, 86, '0..*', 'f-s f-m');
    b += T(330, 116, 'tiene muchos', 'f-s');
    b += B(170, 168, 300, 34, 'Main: menú con while + switch + Scanner', 'f-box', 'f-s');
    return fig(640, 212, b, 'El diseño del proyecto final: una Biblioteca que guarda Libros');
  };

  F[35] = function () {
    var topics = ['POO: 4 pilares', 'String y ==', 'Colecciones', 'Excepciones', 'Git', 'static', 'Sobrecarga', 'Leer código'];
    var b = R(240, 80, 160, 50, 'f-acc', 25) + T(320, 110, '🎯 Entrevista junior', 'f-b');
    topics.forEach(function (t, i) {
      var ang = (i / topics.length) * Math.PI * 2 - Math.PI / 2;
      var x = 320 + Math.cos(ang) * 240, y = 105 + Math.sin(ang) * 82;
      b += L(320 + Math.cos(ang) * 90, 105 + Math.sin(ang) * 32, x - Math.cos(ang) * 40, y - Math.sin(ang) * 10, 'f-dash');
      b += B(x - 62, y - 15, 124, 30, t, 'f-box', 'f-s');
    });
    return fig(640, 214, b, 'Lo que suelen preguntar en una primera entrevista');
  };

  return F;
})();
