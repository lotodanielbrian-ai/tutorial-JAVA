// Java INPRO — Manual: arma el libro "Java desde cero" (Edición completa o por Tomo ?tomo=1..6)
// con los mismos datos del curso (LESSONS, LESSONS_F2, PRACTICA, GuiaCero) más manual-contenido.js
// y manual-figuras.js. En pantalla es interactivo con vista hoja A4; con ?print=1 queda listo
// para que tools/manual-pdf.js pagine el libro completo o cada tomo en hojas A4.
var Manual = (function () {
  var PRINT = /[?&]print=1/.test(location.search);
  var TOMO_MATCH = /[?&]tomo=([1-6])\b/.exec(location.search);
  var TOMO_ID = TOMO_MATCH ? TOMO_MATCH[1] : '';
  var TOMO = (typeof MANUAL !== 'undefined' && MANUAL.TOMOS && TOMO_ID)
    ? MANUAL.TOMOS.find(function (t) { return t.id === TOMO_ID; }) || null
    : null;
  var answers = [];   // apéndice A: [{ cap, titulo, items: [{ n, html }] }]
  var solutions = []; // apéndice B: [{ cap, titulo, code, stdin, expected }]
  var figureCount = {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function strip(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent;
  }

  function allLessons() {
    var f1 = typeof LESSONS !== 'undefined' ? LESSONS : [];
    var f2 = typeof LESSONS_F2 !== 'undefined' ? LESSONS_F2 : [];
    return f1.concat(f2);
  }

  function findLessonById(id) {
    return allLessons().find(function (x) { return x.id === id; }) || null;
  }

  function activeLessons() {
    if (TOMO) return TOMO.ids.map(findLessonById).filter(Boolean);
    return typeof LESSONS !== 'undefined' ? LESSONS : [];
  }

  // Mezcla determinista: el mismo libro sale igual cada vez que se genera
  function seeded(seedText) {
    var h = 2166136261;
    for (var i = 0; i < seedText.length; i++) { h ^= seedText.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }
  function shuffled(list, seed) {
    var rnd = seeded(seed), out = list.slice();
    for (var i = out.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = out[i]; out[i] = out[j]; out[j] = t; }
    // Que no quede en el orden original: si no, el ejercicio se resuelve solo
    if (out.length > 1 && out.every(function (x, k) { return x === list[k]; })) out.push(out.shift());
    return out;
  }

  var LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  var LEVEL = {
    super: 'Súper básico', basico: 'Básico', inter: 'Intermedio', avanzado: 'Avanzado', examen: 'Proyecto', entrevista: 'Entrevista',
    limpio: 'Código limpio', spring: 'Spring Boot', api: 'API REST', calidad: 'Calidad', entrega: 'Entrega', extra: 'Avanzado F2', coloquio: 'Coloquio'
  };
  var ESCALERA = [['vida', '🏠', 'En la vida diaria'], ['modelo', '💡', 'La idea'], ['pseudo', '📝', 'En pasos'], ['java', '☕', 'En Java'], ['real', '💼', 'En un sistema real']];

  // ── Piezas de cada capítulo ──────────────────────────────────────────
  function escalera(e) {
    if (!e) return '';
    return '<section class="mn-escalera" aria-label="De la vida diaria al código"><h3 class="mn-h">De la vida diaria al código</h3><ol>' +
      ESCALERA.map(function (s) {
        return e[s[0]] ? '<li><span class="mn-step-ico" aria-hidden="true">' + s[1] + '</span><div><strong>' + s[2] + '</strong><p>' + e[s[0]] + '</p></div></li>' : '';
      }).join('') + '</ol></section>';
  }

  function guiaPedagogica(id) {
    if (typeof GuiaCero === 'undefined') return '';
    var d = GuiaCero.get(id);
    if (!d) return '';
    return '<section class="mn-guia" aria-label="Qué estás haciendo, por qué y para qué">' +
      '<h3 class="mn-h">Qué estás haciendo, por qué y para qué</h3>' +
      '<div class="mn-guia-grid">' +
        '<div class="mn-guia-box"><strong>Qué hacés</strong><p>' + d.que + '</p></div>' +
        '<div class="mn-guia-box"><strong>Por qué existe</strong><p>' + d.porque + '</p></div>' +
        '<div class="mn-guia-box"><strong>Para qué sirve</strong><p>' + d.paraque + '</p></div>' +
      '</div>' +
      '<div class="mn-guia-day"><strong>☕ Ejemplo del día a día:</strong> ' + d.dia + '</div>' +
      '</section>';
  }

  function buenaPracticaTip(id) {
    if (typeof GuiaCero === 'undefined') return '';
    var d = GuiaCero.get(id);
    if (!d || !d.tip) return '';
    return '<aside class="mn-tip"><strong>✨ Buena práctica profesional:</strong> ' + d.tip + '</aside>';
  }

  function figura(key, cap) {
    var f = FIGURAS[key] && FIGURAS[key]();
    if (!f) return '';
    figureCount[cap] = (figureCount[cap] || 0) + 1;
    return '<figure class="mn-fig">' + f.svg + '<figcaption><strong>Figura ' + cap + '.' + figureCount[cap] + '</strong> · ' + esc(f.caption) + '</figcaption></figure>';
  }

  function codeBox(code, numbered) {
    var lines = String(code).split('\n');
    var body = numbered
      ? lines.map(function (l, i) { return '<span class="mn-ln">' + (i + 1) + '</span>' + jHL(l); }).join('\n')
      : jHL(code);
    return '<pre class="mn-code' + (numbered ? ' numbered' : '') + '">' + body + '</pre>';
  }

  // Una actividad de práctica como ejercicio de libro, con su respuesta aparte
  function item(it, n, key) {
    var q = '', a = '';
    switch (it.t) {
      case 'mc':
        q = it.q + (it.code ? codeBox(it.code) : '') + '<ol class="mn-opts">' + it.o.map(function (o, i) { return '<li><span>' + LETTERS[i] + ')</span> ' + o + '</li>'; }).join('') + '</ol>';
        a = '<strong>' + LETTERS[it.a] + ')</strong> ' + it.o[it.a];
        break;
      case 'tf':
        q = it.q + (it.code ? codeBox(it.code) : '') + '<p class="mn-tf">Verdadero ☐ &nbsp;&nbsp; Falso ☐</p>';
        a = '<strong>' + (it.a ? 'Verdadero' : 'Falso') + '</strong>';
        break;
      case 'output':
        q = it.q + codeBox(it.code) + (it.stdin ? '<p class="mn-small">Entrada: <code>' + esc([].concat(it.stdin).join(' ⏎ ')) + '</code></p>' : '') + '<div class="mn-write" aria-hidden="true"></div>';
        a = '<pre class="mn-out">' + esc(it.a) + '</pre>';
        break;
      case 'fill':
        var k = 0;
        q = it.q + '<pre class="mn-code">' + jHL(it.code).replace(/___/g, function () { k++; return '<span class="mn-blank">' + k + '</span>'; }) + '</pre>';
        a = it.a.map(function (alts, i) { return (it.a.length > 1 ? '[' + (i + 1) + '] ' : '') + '<code>' + esc(alts[0]) + '</code>'; }).join(' · ');
        break;
      case 'bug':
        q = it.q + codeBox(it.code, true);
        a = 'Línea <strong>' + it.line + '</strong>' + (it.fix ? ': <code>' + esc(String(it.fix).trim()) + '</code>' : '');
        break;
      case 'order':
        var lines = shuffled(it.lines, key);
        q = it.q + '<ol class="mn-order">' + lines.map(function (l, i) { return '<li><span>' + LETTERS[i].toUpperCase() + '</span><code>' + esc(l) + '</code></li>'; }).join('') + '</ol>';
        a = it.lines.map(function (l) { return LETTERS[lines.indexOf(l)].toUpperCase(); }).join(' → ');
        break;
      case 'match':
        var right = shuffled(it.pairs.map(function (p) { return p[1]; }), key);
        q = it.q + '<div class="mn-match"><ol>' + it.pairs.map(function (p) { return '<li>' + p[0] + '</li>'; }).join('') + '</ol><ol class="mn-letters">' +
          right.map(function (r, i) { return '<li><span>' + LETTERS[i] + ')</span> ' + r + '</li>'; }).join('') + '</ol></div>';
        a = it.pairs.map(function (p, i) { return (i + 1) + '-' + LETTERS[right.indexOf(p[1])]; }).join(' · ');
        break;
      case 'short':
        q = it.q + '<div class="mn-write tall" aria-hidden="true"></div>';
        a = '<em>Respuesta modelo:</em> ' + it.model;
        break;
      case 'http':
        if (!TOMO) return null;
        q = '<strong>' + esc(it.q) + ':</strong> ' + it.task + '<div class="mn-write" aria-hidden="true"></div>';
        a = '<code>' + esc(it.goal.method + ' ' + it.goal.path.replace(/^\^|\$$/g, '')) + '</code> → HTTP <strong>' + it.goal.status + '</strong>' +
          (it.demo && it.demo.length ? '<pre class="mn-out">' + esc(it.demo.map(function (d) { return d[0] + ' ' + d[1] + (d[2] ? '\n' + d[2] : ''); }).join('\n')) + '</pre>' : '');
        break;
      case 'step':
        if (!TOMO) return null;
        q = '<strong>' + esc(it.q) + ':</strong> ' + it.do + (it.cmd ? codeBox(it.cmd) : '') + '<p class="mn-small">Tiene que pasar: ' + it.ok + '</p>';
        a = '<em>Comprobación:</em> ' + it.ok;
        break;
      case 'code':
        if (!TOMO) return null;
        q = '<strong>Reto práctico — ' + esc(it.title || 'Código') + ':</strong> ' + it.task +
          (it.stdin && it.stdin.length ? '<p class="mn-small">Entrada simulada: <code>' + esc(it.stdin.join(' ⏎ ')) + '</code></p>' : '') +
          '<p class="mn-small">Salida esperada:</p><pre class="mn-out">' + esc(it.expected) + '</pre>' +
          (it.starter ? codeBox(it.starter) : '');
        a = cb('Solución', it.solution);
        break;
      default:
        return null;
    }
    var full = a + (it.why ? '<div class="mn-why">' + it.why + '</div>' : '');
    return { q: '<div class="mn-item" id="act-' + n.replace('.', '-') + '"><span class="mn-num">' + n + '</span><div class="mn-q">' + q +
      '<details class="mn-sol mn-screen"><summary>Ver respuesta</summary><div>' + full + '</div></details></div></div>', a: full };
  }

  // La solución del ejercicio es el último bloque de código de su última pista
  function solutionOf(ex) {
    var d = document.createElement('div');
    d.innerHTML = ex.hints[ex.hints.length - 1];
    var blocks = d.querySelectorAll('.cblock-body');
    return blocks.length ? blocks[blocks.length - 1].textContent : '';
  }

  function chapter(l, partN) {
    var P = (typeof PRACTICA !== 'undefined' && PRACTICA[l.id]) || {};
    var cap = l.id;
    var g = typeof GuiaCero !== 'undefined' ? GuiaCero.get(cap) : null;
    var html = '<article class="mn-chapter" id="cap-' + cap + '" data-part="' + partN + '">' + runHead('Capítulo ' + cap + ' · ' + l.title);
    html += '<header class="mn-ch-head"><div class="mn-ch-top"><div class="mn-ch-num">Capítulo ' + cap + '</div>' +
      '<button type="button" class="mn-btn ghost mn-print-ch mn-screen" data-print-cap="cap-' + cap + '">🖨 Imprimir tema (A4)</button></div>' +
      '<h2 class="mn-ch-title">' + esc(l.title) + '</h2>' +
      '<p class="mn-ch-desc">' + esc(l.desc) + '</p><p class="mn-ch-meta">' + (LEVEL[l.level] || '') + ' · ' + l.stars + '</p></header>';
    if (P.objetivos) html += '<section class="mn-goals"><h3 class="mn-h">Al terminar vas a poder</h3><ul>' + P.objetivos.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></section>';
    // La pregunta previa se piensa antes de leer: en pantalla la respuesta arranca tapada
    if (P.antes) html += '<aside class="mn-before"><strong>🤔 ' + P.antes[0] + '</strong>' +
      '<details class="mn-sol mn-screen"><summary>Ver respuesta</summary><div>' + P.antes[1] + '</div></details>' +
      '<p class="mn-before-a mn-print-only"><span>Respuesta:</span> ' + P.antes[1] + '</p></aside>';
    html += guiaPedagogica(cap);
    html += escalera(P.escalera);
    html += figura(cap, cap);
    html += '<section class="mn-simple"><h3 class="mn-h mn-h-big">La idea en simple</h3>' + l.simple() + '</section>';
    html += '<section class="mn-detail"><h3 class="mn-h mn-h-big">En detalle</h3>' + l.tutorial() + buenaPracticaTip(cap) + '</section>';

    // Comprobá lo que aprendiste
    var acts = [], ans = [];
    var n = 0;
    (P.items || []).forEach(function (it, i) {
      var r = item(it, cap + '.' + (n + 1), cap + '-' + i);
      if (!r) return;
      n++;
      acts.push(r.q);
      ans.push({ n: cap + '.' + n, html: r.a });
    });
    if (l.quiz) {
      l.quiz.questions.forEach(function (q) {
        var it = { t: 'mc', q: q.question, o: q.options, a: q.correct, why: q.why };
        var r = item(it, cap + '.' + (n + 1), 'quiz-' + cap + '-' + n);
        n++;
        acts.push(r.q);
        ans.push({ n: cap + '.' + n, html: r.a });
      });
    }
    if (acts.length) {
      html += '<section class="mn-check"><h3 class="mn-h mn-h-big">Comprobá lo que aprendiste</h3>' +
        (g ? '<p class="mn-small"><strong>Para qué practicás esto:</strong> ' + g.practica + '</p>' : '') +
        '<p class="mn-small">Las respuestas, con su explicación, están en el <a href="#ap-respuestas">apéndice A</a>.</p>' + acts.join('') + '</section>';
      answers.push({ cap: cap, titulo: l.title, items: ans });
    }

    if (l.exercise) {
      var ex = l.exercise;
      html += '<section class="mn-challenge"><h3 class="mn-h mn-h-big">🏆 Desafío</h3><p>' + ex.desc + '</p>' +
        (ex.stdin ? '<p class="mn-small">Entrada que recibe el programa:</p><pre class="mn-out">' + esc([].concat(ex.stdin).join('\n')) + '</pre>' : '') +
        '<p class="mn-small">Salida esperada:</p><pre class="mn-out">' + esc(ex.expected) + '</pre>' +
        (ex.starter ? '<p class="mn-small">Punto de partida:</p>' + cb('Main.java', ex.starter) : '') +
        '<p class="mn-small">Una solución está en el <a href="#sol-' + cap + '">apéndice B</a>. En la web podés resolverlo en la pestaña Ejercicio de la lección ' + cap + '.</p></section>';
      solutions.push({ cap: cap, titulo: l.title, code: solutionOf(ex) });
    }
    return html + '</article>';
  }

  // Encabezado de página: en papel se repite arriba en cada hoja del capítulo
  function runHead(text) { return '<div class="mn-run-head" aria-hidden="true">' + esc(text) + '</div>'; }

  // Paged.js descarta los nodos de texto que son solo espacios: en el código, los
  // saltos de línea y la sangría entre colores se perderían. Se vuelven <br> y espacios duros.
  function hardenCode(root) {
    // Un bloque de más de 30 líneas no entra en media hoja: se deja partir entre páginas
    root.querySelectorAll('.cblock').forEach(function (b) {
      var body = b.querySelector('.cblock-body');
      if (body && body.textContent.split('\n').length > 30) b.classList.add('mn-long');
    });
    root.querySelectorAll('.cblock-body, .mn-code, pre.mn-out').forEach(function (box) {
      var walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      var nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(function (node) {
        var text = node.nodeValue;
        if (text.indexOf('\n') === -1 && /\S/.test(text)) return;
        var frag = document.createDocumentFragment();
        text.split('\n').forEach(function (part, i) {
          if (i) frag.appendChild(document.createElement('br'));
          if (part) frag.appendChild(document.createTextNode(/\S/.test(part) ? part.replace(/^ +/, function (s) { return s.replace(/ /g, ' '); }) : part.replace(/ /g, ' ')));
        });
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  // ── Partes y Tomos del libro ────────────────────────────────────────
  function cover() {
    var kicker = TOMO ? 'Java INPRO · ' + TOMO.num + ' · ' + TOMO.nivel : 'Java INPRO';
    var title = TOMO ? TOMO.num + '<br>' + esc(TOMO.nivel) : 'Java<br>desde cero';
    var sub = TOMO ? esc(TOMO.titulo) + '. ' + esc(TOMO.subtitulo) : 'De no saber nada a tu primer proyecto con objetos y Git. Un libro para aprender aunque nunca hayas programado.';
    var foot = TOMO
      ? esc(MANUAL.EDICION) + ' · ' + TOMO.ids.length + ' capítulos' + (TOMO.includeCap0 ? ' + cap. 0' : '') + ' · A4 imprimible con actividades y soluciones'
      : esc(MANUAL.EDICION) + ' · 35 capítulos · figuras, actividades y soluciones';
    return '<section class="mn-cover" id="tapa"><div class="mn-cover-band"></div>' +
      '<div class="mn-cover-in"><p class="mn-cover-kicker">' + esc(kicker) + '</p><h1>' + title + '</h1>' +
      '<p class="mn-cover-sub">' + sub + '</p>' +
      '<div class="mn-cover-art">' + coverArt() + '</div>' +
      '<p class="mn-cover-foot">' + foot + '</p></div></section>';
  }

  function tomoShelf() {
    if (!MANUAL || !MANUAL.TOMOS) return '';
    return '<section class="mn-tomos mn-screen" aria-label="Colección por tomos">' +
      '<div class="mn-tomos-head">' +
        '<div><h2>📚 Manual por Tomos (Súper Básico → Fase 2)</h2>' +
        '<p class="mn-small">Elegí el tomo de tu etapa actual o leé la edición completa de Fase 1. Todos vienen seccionados para imprimir en A4.</p></div>' +
        (TOMO ? '<a class="mn-btn ghost" href="manual.html">📖 Ver edición completa (Fase 1)</a>' : '') +
      '</div>' +
      '<div class="mn-tomos-grid">' +
      MANUAL.TOMOS.map(function (t) {
        var active = TOMO && TOMO.id === t.id;
        return '<article class="mn-tomo-card' + (active ? ' active' : '') + '">' +
          '<div class="mn-tomo-num">' + esc(t.num) + ' · ' + esc(t.nivel) + '</div>' +
          '<h3>' + esc(t.titulo) + '</h3>' +
          '<p>' + esc(t.subtitulo) + '</p>' +
          '<div class="mn-tomo-meta">Capítulos ' + t.ids[0] + ' al ' + t.ids[t.ids.length - 1] + (t.includeCap0 ? ' (+ Cap. 0)' : '') + '</div>' +
          '<div class="mn-tomo-actions">' +
            '<a class="mn-btn" href="manual.html?tomo=' + t.id + '">' + (active ? '✓ Viendo ahora' : 'Abrir tomo') + '</a>' +
            '<a class="mn-btn ghost" href="manual/' + esc(t.slug) + '.pdf" download>⬇ PDF A4</a>' +
          '</div></article>';
      }).join('') +
      '</div></section>';
  }

  function coverArt() {
    return '<svg viewBox="0 0 520 250" class="fig" role="img" aria-label="Una taza de café junto a una ventana de código">' +
      '<rect x="20" y="20" width="300" height="190" rx="12" class="f-box"/><rect x="20" y="20" width="300" height="28" rx="12" class="f-acc"/>' +
      '<circle cx="40" cy="34" r="5" class="f-bad"/><circle cx="58" cy="34" r="5" class="f-acc"/><circle cx="76" cy="34" r="5" class="f-ok"/>' +
      '<text x="40" y="80" class="f-t f-m f-b" text-anchor="start">public class Main {</text>' +
      '<text x="58" y="106" class="f-t f-m" text-anchor="start">public static void main(…) {</text>' +
      '<text x="80" y="132" class="f-t f-m f-ta" text-anchor="start">System.out.println("¡Hola!");</text>' +
      '<text x="58" y="158" class="f-t f-m" text-anchor="start">}</text><text x="40" y="184" class="f-t f-m" text-anchor="start">}</text>' +
      '<path d="M370,110 h110 v70 a40,40 0 0 1 -40,40 h-30 a40,40 0 0 1 -40,-40 z" class="f-acc"/>' +
      '<path d="M480,128 a22,22 0 0 1 0,40" class="f-ln f-ln-acc" style="stroke-width:8"/>' +
      '<path d="M395,95 c-10,-15 10,-20 0,-38 M425,95 c-10,-15 10,-20 0,-38 M455,95 c-10,-15 10,-20 0,-38" class="f-ln f-ln-acc"/>' +
      '<rect x="350" y="226" width="150" height="8" rx="4" class="f-acc"/></svg>';
  }

  function howTo() {
    var lead = TOMO
      ? 'Este <strong>' + esc(TOMO.num) + ' (' + esc(TOMO.nivel) + ')</strong> acompaña paso a paso tus ejercicios en Java INPRO, seccionado en hojas A4 para estudiar o imprimir.'
      : 'Este libro acompaña al curso <strong>Java INPRO</strong>, pero se puede leer solo. Está pensado para alguien que <strong>nunca programó</strong>: cada idea nueva arranca de algo que ya conocés y recién al final llega al código.';
    return '<section class="mn-front" id="como-usar"><h2 class="mn-front-title">Antes de empezar</h2>' +
      '<p>' + lead + '</p>' +
      '<p>Leelo en orden. Cada capítulo abre con <strong>Qué estás haciendo, Por qué y Para qué</strong>, un <strong>ejemplo del día a día</strong> y la escalera de la vida real al código.</p>' +
      '<table class="sym-tbl mn-legend"><thead><tr><th>Vas a ver</th><th>Para qué</th></tr></thead><tbody>' +
      '<tr><td>🧭 ☕</td><td>Qué hacés, por qué existe, para qué sirve y ejemplo del día a día</td></tr>' +
      '<tr><td>🏠 💡 📝 ☕ 💼</td><td>La escalera de la vida diaria al código</td></tr>' +
      '<tr><td>Figura N.1</td><td>La idea dibujada</td></tr>' +
      '<tr><td>☐ N.1, N.2 …</td><td>Actividades para comprobar lo aprendido (respuestas en el apéndice A)</td></tr>' +
      '<tr><td>🏆 Desafío</td><td>Un programa para escribir vos (soluciones en el apéndice B)</td></tr>' +
      '<tr><td>✨ 💡 ⚠️ ☕</td><td>Buenas prácticas profesionales, consejos y errores típicos</td></tr></tbody></table>' +
      '<p class="mn-small">Versión interactiva, con ejemplos que se ejecutan y se pueden editar: <strong>java-inpro-tutorial.web.app/manual.html</strong></p></section>';
  }

  function toc() {
    var rows = '';
    if (!TOMO || TOMO.includeCap0) {
      rows += '<li class="mn-toc-part"><a href="#cap-0">0 · Antes de escribir código<span class="mn-toc-dots"></span></a></li>';
      MANUAL.CAP0.forEach(function (s, i) { rows += '<li class="mn-toc-sub"><a href="#c0-' + s.id + '">0.' + (i + 1) + ' ' + esc(s.titulo) + '<span class="mn-toc-dots"></span></a></li>'; });
    }
    if (TOMO) {
      rows += '<li class="mn-toc-part"><a href="#parte-' + TOMO.id + '">' + esc(TOMO.num) + ' · ' + esc(TOMO.titulo) + '<span class="mn-toc-dots"></span></a></li>';
      activeLessons().forEach(function (l) {
        rows += '<li><a href="#cap-' + l.id + '"><span class="mn-toc-n">' + l.id + '</span>' + esc(l.title) + '<span class="mn-toc-dots"></span></a></li>';
      });
    } else {
      MANUAL.PARTES.forEach(function (p) {
        rows += '<li class="mn-toc-part"><a href="#parte-' + p.n + '">Parte ' + p.n + ' · ' + esc(p.titulo) + '<span class="mn-toc-dots"></span></a></li>';
        p.ids.forEach(function (id) {
          var l = findLessonById(id);
          if (l) rows += '<li><a href="#cap-' + id + '"><span class="mn-toc-n">' + id + '</span>' + esc(l.title) + '<span class="mn-toc-dots"></span></a></li>';
        });
      });
    }
    rows += '<li class="mn-toc-part"><a href="#apendices">Apéndices<span class="mn-toc-dots"></span></a></li>' +
      ['A · Respuestas de las actividades#ap-respuestas', 'B · Soluciones de los desafíos#ap-soluciones', 'C · Mensajes de error traducidos#ap-errores', 'D · Hoja de referencia rápida#ap-referencia', 'E · Glosario#ap-glosario']
        .map(function (s) { var p = s.split('#'); return '<li class="mn-toc-sub"><a href="#' + p[1] + '">' + p[0] + '<span class="mn-toc-dots"></span></a></li>'; }).join('');
    return '<nav class="mn-toc" id="indice" aria-label="Índice"><h2 class="mn-front-title">Índice</h2><ol>' + rows + '</ol></nav>';
  }

  function chapter0() {
    var html = '<article class="mn-chapter mn-cap0" id="cap-0">' + runHead('Capítulo 0 · Antes de escribir código') + '<header class="mn-ch-head"><div class="mn-ch-top"><div class="mn-ch-num">Capítulo 0</div>' +
      '<button type="button" class="mn-btn ghost mn-print-ch mn-screen" data-print-cap="cap-0">🖨 Imprimir tema (A4)</button></div>' +
      '<h2 class="mn-ch-title">Antes de escribir código</h2>' +
      '<p class="mn-ch-desc">Qué es programar, qué es Java, para qué sirve y para qué no, cómo instalarlo y cómo leer los errores.</p></header>';
    MANUAL.CAP0.forEach(function (s, i) {
      html += '<section class="mn-c0" id="c0-' + s.id + '"><h3 class="mn-c0-title"><span>0.' + (i + 1) + '</span> ' + esc(s.titulo) + '</h3>' +
        escalera(s.escalera) + (s.figura ? figura(s.figura, 0) : '') + s.html() + '</section>';
    });
    return html + '</article>';
  }

  function partOpener(p) {
    return '<section class="mn-part" id="parte-' + p.n + '"><div class="mn-part-n">Parte ' + p.n + '</div><h2 class="mn-part-title">' + esc(p.titulo) + '</h2>' +
      '<p class="mn-part-text">' + esc(p.texto) + '</p><ol class="mn-part-list">' + p.ids.map(function (id) {
        var l = findLessonById(id);
        return l ? '<li><span>' + id + '</span> ' + esc(l.title) + '</li>' : '';
      }).join('') + '</ol></section>';
  }

  function tomoOpener(t) {
    return '<section class="mn-part" id="parte-' + t.id + '"><div class="mn-part-n">' + esc(t.num) + ' · ' + esc(t.nivel) + '</div>' +
      '<h2 class="mn-part-title">' + esc(t.titulo) + '</h2>' +
      '<p class="mn-part-text">' + esc(t.subtitulo) + '</p><ol class="mn-part-list">' + t.ids.map(function (id) {
        var l = findLessonById(id);
        return l ? '<li><span>' + id + '</span> ' + esc(l.title) + '</li>' : '';
      }).join('') + '</ol></section>';
  }

  function glossary(lessonsList) {
    var seen = {}, list = [];
    lessonsList.forEach(function (l) {
      var src = l.simple() + l.tutorial();
      var re = /<span class="glossary" data-def="([^"]*)">([^<]*)<\/span>/g, m;
      while ((m = re.exec(src))) {
        var word = m[2].trim(), k = word.toLowerCase();
        if (!seen[k]) { seen[k] = true; list.push({ w: word, d: m[1], cap: l.id }); }
      }
    });
    if (!list.length && typeof GuiaCero !== 'undefined') {
      lessonsList.forEach(function (l) {
        var g = GuiaCero.get(l.id);
        if (g) list.push({ w: l.title, d: g.que + ' ' + g.tip, cap: l.id });
      });
    }
    list.sort(function (a, b) { return a.w.localeCompare(b.w, 'es', { sensitivity: 'base' }); });
    return '<dl class="mn-gloss">' + list.map(function (g) {
      return '<dt>' + esc(g.w) + ' <a class="mn-ref" href="#cap-' + g.cap + '">cap. ' + g.cap + '</a></dt><dd>' + g.d + '</dd>';
    }).join('') + '</dl>';
  }

  function appendices(lessonsList) {
    var html = '<section class="mn-part mn-part-ap" id="apendices"><div class="mn-part-n">Apéndices</div><h2 class="mn-part-title">Para consultar</h2>' +
      '<p class="mn-part-text">Respuestas, soluciones, errores traducidos, una hoja de referencia y el glosario.</p></section>';
    html += '<article class="mn-appendix" id="ap-respuestas">' + runHead('Apéndice A · Respuestas') + '<h2 class="mn-ap-title">A · Respuestas de las actividades</h2>' +
      answers.map(function (c) {
        return '<section class="mn-ans-ch"><h3>Capítulo ' + c.cap + ' · ' + esc(c.titulo) + '</h3>' +
          c.items.map(function (a) { return '<div class="mn-ans"><a class="mn-num" href="#act-' + a.n.replace('.', '-') + '">' + a.n + '</a><div>' + a.html + '</div></div>'; }).join('') + '</section>';
      }).join('') + '</article>';
    html += '<article class="mn-appendix" id="ap-soluciones">' + runHead('Apéndice B · Soluciones') + '<h2 class="mn-ap-title">B · Soluciones de los desafíos</h2>' +
      '<p class="mn-small">Hay muchas soluciones correctas: si la tuya imprime la salida esperada y usa lo que pide el capítulo, está bien.</p>' +
      (solutions.length
        ? solutions.map(function (s) {
            return '<section class="mn-sol-ch" id="sol-' + s.cap + '"><h3>Capítulo ' + s.cap + ' · ' + esc(s.titulo) + '</h3>' + cb('Solución', s.code) + '</section>';
          }).join('')
        : '<p class="mn-small">Este tomo evalúa mediante actividades y cuestionarios.</p>') +
      '</article>';
    var isF2Tomo = TOMO && (TOMO.id === '5' || TOMO.id === '6');
    var errsList = (isF2Tomo && MANUAL.ERRORES_F2) ? MANUAL.ERRORES_F2 : MANUAL.ERRORES;
    var refList = (isF2Tomo && MANUAL.REFERENCIA_F2) ? MANUAL.REFERENCIA_F2 : MANUAL.REFERENCIA;
    html += '<article class="mn-appendix" id="ap-errores">' + runHead('Apéndice C · Errores') + '<h2 class="mn-ap-title">C · Mensajes de error traducidos</h2>' +
      '<table class="sym-tbl mn-err"><thead><tr><th>El mensaje dice</th><th>Cuándo</th><th>Qué significa y qué hacer</th></tr></thead><tbody>' +
      errsList.map(function (e) { return '<tr><td>' + esc(e[0]) + '</td><td>' + e[1] + '</td><td>' + esc(e[2]) + '</td></tr>'; }).join('') + '</tbody></table></article>';
    html += '<article class="mn-appendix" id="ap-referencia">' + runHead('Apéndice D · Referencia') + '<h2 class="mn-ap-title">D · Hoja de referencia rápida</h2>' +
      '<table class="sym-tbl mn-ref-tbl"><tbody>' + refList.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td><code>' + esc(r[1]) + '</code></td></tr>'; }).join('') + '</tbody></table></article>';
    html += '<article class="mn-appendix" id="ap-glosario">' + runHead('Apéndice E · Glosario') + '<h2 class="mn-ap-title">E · Glosario</h2>' + glossary(lessonsList) + '</article>';
    return html;
  }

  function backCover() {
    var title = TOMO ? esc(TOMO.num + ' · ' + TOMO.titulo) : 'Java desde cero';
    return '<section class="mn-back"><p>Java INPRO · <strong>' + title + '</strong></p><p class="mn-small">' + esc(MANUAL.EDICION) +
      '. Los ejemplos y las soluciones se verifican con el compilador de Java real antes de cada edición. Emojis del PDF: Twemoji, CC-BY 4.0.</p></section>';
  }

  // ── Interactividad (solo en pantalla) ───────────────────────────────
  function enhanceCode(root) {
    root.querySelectorAll('.cblock').forEach(function (block) {
      var body = block.querySelector('.cblock-body');
      if (!body) return;
      var code = body.textContent;
      if (!/static\s+void\s+main\s*\(/.test(code)) return;
      block.classList.add('mn-runnable');
      block.dataset.original = code;
      var needsInput = /new\s+Scanner\s*\(\s*System\.in/.test(code);
      var bar = document.createElement('div');
      bar.className = 'mn-run-bar mn-screen';
      bar.innerHTML = '<button type="button" class="mn-btn" data-act="run">▶ Ejecutar</button>' +
        '<button type="button" class="mn-btn ghost" data-act="edit">✎ Editar</button>' +
        '<button type="button" class="mn-btn ghost" data-act="reset" hidden>↺ Original</button>' +
        (needsInput ? '<label class="mn-stdin">Entrada (una por línea)<textarea rows="2" spellcheck="false" aria-label="Entrada del programa"></textarea></label>' : '') +
        '<pre class="mn-out mn-result" aria-live="polite" hidden></pre>';
      block.appendChild(bar);
    });
  }

  function currentCode(block) {
    var ta = block.querySelector('textarea.mn-editor');
    return ta ? ta.value : block.dataset.original;
  }

  function runBlock(block) {
    var out = block.querySelector('.mn-result');
    var input = block.querySelector('.mn-stdin textarea');
    var stdin = input && input.value ? input.value.split('\n') : [];
    var r;
    try { r = JavaRun.run(currentCode(block), { stdin: stdin }); } catch (e) { r = { exception: 'El emulador no pudo ejecutarlo: ' + e.message }; }
    var text, cls = 'ok';
    if (r.compile) { text = '❌ Error de compilación en la línea ' + r.compile.line + ':\n' + r.compile.javac + (r.compile.why ? '\n\n' + strip(r.compile.why) : ''); cls = 'bad'; }
    else if (r.exception) {
      text = (r.output || '') + '💥 ' + r.exception + (r.line ? ' (línea ' + r.line + ')' : '');
      if (r.type === 'NoSuchElementException' && input) text += '\n\nEl programa quiso leer del teclado y no había nada: escribí la entrada en el cuadro, una por línea.';
      cls = 'bad';
    }
    else if (r.unsupported) { text = (r.output || '') + 'ℹ️ Esto usa algo que el emulador del navegador no tiene (' + r.unsupported + '). En tu computadora funciona.'; cls = 'warn'; }
    else if (r.limit) { text = (r.output || '') + '⏱ ' + r.limit; cls = 'bad'; }
    else if (r.noMain) { text = 'Falta el método main.'; cls = 'bad'; }
    else text = r.output === '' ? '(el programa no imprimió nada)' : r.output;
    out.hidden = false;
    out.className = 'mn-out mn-result is-' + cls;
    out.textContent = text;
  }

  function toggleEdit(block, btn) {
    var body = block.querySelector('.cblock-body');
    var ta = block.querySelector('textarea.mn-editor');
    if (ta) return;
    ta = document.createElement('textarea');
    ta.className = 'mn-editor';
    ta.spellcheck = false;
    ta.setAttribute('aria-label', 'Código editable');
    ta.value = block.dataset.original;
    ta.rows = Math.min(24, ta.value.split('\n').length + 1);
    ta.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      var s = ta.selectionStart;
      ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = s + 4;
    });
    body.hidden = true;
    body.after(ta);
    btn.hidden = true;
    block.querySelector('[data-act="reset"]').hidden = false;
    ta.focus();
  }

  function resetBlock(block) {
    var ta = block.querySelector('textarea.mn-editor');
    if (ta) ta.remove();
    block.querySelector('.cblock-body').hidden = false;
    block.querySelector('[data-act="edit"]').hidden = false;
    block.querySelector('[data-act="reset"]').hidden = true;
    var out = block.querySelector('.mn-result');
    out.hidden = true;
  }

  function printChapter(capId) {
    var el = document.getElementById(capId);
    if (!el) return;
    document.body.classList.add('mn-printing-one');
    el.classList.add('mn-print-target');
    var cleaned = false;
    var cleanup = function () {
      if (cleaned) return;
      cleaned = true;
      document.body.classList.remove('mn-printing-one');
      el.classList.remove('mn-print-target');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
    setTimeout(cleanup, 1200);
  }

  function toggleA4View(btn) {
    var on = document.body.classList.toggle('mn-a4-view');
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  function wire(root) {
    root.addEventListener('click', function (e) {
      var printBtn = e.target.closest && e.target.closest('[data-print-cap]');
      if (printBtn) { printChapter(printBtn.getAttribute('data-print-cap')); return; }
      var btn = e.target.closest && e.target.closest('.mn-run-bar button');
      if (!btn) return;
      var block = btn.closest('.cblock');
      var act = btn.getAttribute('data-act');
      if (act === 'run') runBlock(block);
      else if (act === 'edit') toggleEdit(block, btn);
      else if (act === 'reset') resetBlock(block);
    });
    // Las preguntas de "Ver respuesta" de las lecciones, también con teclado
    root.querySelectorAll('.quiz-reveal').forEach(function (p) {
      p.setAttribute('role', 'button');
      p.setAttribute('tabindex', '0');
      p.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); } });
    });
  }

  function navBar(lessonsList) {
    var tomoOpts = '<option value="">📚 Completo (F1)</option>' +
      (MANUAL.TOMOS || []).map(function (t) {
        return '<option value="' + t.id + '"' + (TOMO && TOMO.id === t.id ? ' selected' : '') + '>' + esc(t.num + ' · ' + t.nivel) + '</option>';
      }).join('');
    var capOpts = '<option value="indice">Índice</option>' +
      (!TOMO || TOMO.includeCap0 ? '<option value="cap-0">0 · Antes de escribir código</option>' : '') +
      lessonsList.map(function (l) { return '<option value="cap-' + l.id + '">' + l.id + ' · ' + esc(l.title) + '</option>'; }).join('') +
      '<option value="apendices">Apéndices</option>';
    var pdfHref = TOMO ? ('manual/' + TOMO.slug + '.pdf') : 'manual/java-desde-cero.pdf';
    var bar = document.createElement('header');
    bar.className = 'mn-bar mn-screen';
    bar.innerHTML = '<a class="mn-brand" href="index.html" title="Volver al curso">☕ <span>' + (TOMO ? esc(TOMO.num) : 'Java desde cero') + '</span></a>' +
      '<label class="mn-tomo-sel"><span class="mn-sr">Tomo</span><select id="mn-tomo-select" aria-label="Elegir tomo">' + tomoOpts + '</select></label>' +
      '<label class="mn-jump"><span class="mn-sr">Ir a</span><select id="mn-cap-select" aria-label="Ir al capítulo">' + capOpts + '</select></label>' +
      '<div class="mn-actions">' +
      '<button type="button" class="mn-btn ghost" id="mn-a4-btn" aria-pressed="false" title="Ver cada tema como hoja imprimible A4">📄 Hoja A4</button>' +
      '<a class="mn-btn" href="' + esc(pdfHref) + '" download>⬇ PDF</a>' +
      '<button type="button" class="mn-btn ghost" onclick="window.print()">🖨 Imprimir</button>' +
      '<a class="mn-btn ghost" href="index.html">← Curso</a></div><div class="mn-progress" aria-hidden="true"><span></span></div>';
    document.body.prepend(bar);
    bar.querySelector('#mn-tomo-select').addEventListener('change', function () {
      location.href = this.value ? ('manual.html?tomo=' + this.value) : 'manual.html';
    });
    bar.querySelector('#mn-cap-select').addEventListener('change', function () {
      var t = document.getElementById(this.value);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    bar.querySelector('#mn-a4-btn').addEventListener('click', function () { toggleA4View(this); });
    var fill = bar.querySelector('.mn-progress span');
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      fill.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }, { passive: true });
  }

  function build() {
    answers = [];
    solutions = [];
    figureCount = {};
    var lessonsList = activeLessons();
    if (TOMO) document.title = TOMO.num + ' · ' + TOMO.titulo + ' · Java INPRO';

    var html = cover();
    if (!PRINT) html += tomoShelf();
    html += howTo() + toc();
    if (!TOMO || TOMO.includeCap0) html += chapter0();

    if (TOMO) {
      html += tomoOpener(TOMO);
      lessonsList.forEach(function (l) { html += chapter(l, TOMO.id); });
    } else {
      MANUAL.PARTES.forEach(function (p) {
        html += partOpener(p);
        p.ids.forEach(function (id) {
          var l = findLessonById(id);
          if (l) html += chapter(l, p.n);
        });
      });
    }

    html += appendices(lessonsList) + backCover();
    var root = document.getElementById('libro');
    root.innerHTML = html;
    if (PRINT) {
      hardenCode(root);
      document.documentElement.classList.add('libro-claro', 'libro-print');
      // Los estilos de hoja también se aplican en pantalla, para que Paged.js los vea
      var link = document.getElementById('manual-print-css');
      if (link) link.media = 'all';
    } else {
      navBar(lessonsList);
      enhanceCode(root);
      wire(root);
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }
    (PRINT ? staticFonts().then(function () { return emojiImages(document.body); }) : Promise.resolve()).then(function () {
      document.documentElement.setAttribute('data-ready', '1');
    });
  }

  // Google Fonts sirve Inter y JetBrains Mono como fuentes variables, y los emojis son de color:
  // Chrome incrusta las dos cosas en el PDF como fuentes Type 3, que algunos visores no dibujan
  // (quedan cajas vacías). Para el PDF se usan fuentes estáticas, un archivo por grosor.
  var STATIC_FONTS = ['inter@5.1.0/400', 'inter@5.1.0/500', 'inter@5.1.0/600', 'inter@5.1.0/700', 'inter@5.1.0/800',
    'jetbrains-mono@5.1.0/400', 'jetbrains-mono@5.1.0/500', 'jetbrains-mono@5.1.0/700', 'noto-emoji@5.1.0/400'];

  // Los emojis se dibujan con la fuente de color del sistema, que el PDF incrusta como Type 3
  // (algunos visores la muestran vacía). En papel cada emoji pasa a ser su imagen de Twemoji
  // (CC-BY 4.0): una imagen vectorial se ve igual en cualquier visor.
  var EMOJI = /[0-9#*]️?⃣|\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}️?)*/gu;
  var TWEMOJI = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/';
  var SVGNS = 'http://www.w3.org/2000/svg';

  function emojiUrl(seq) {
    var cps = Array.from(seq).map(function (c) { return c.codePointAt(0).toString(16); });
    if (cps.indexOf('200d') === -1) cps = cps.filter(function (c) { return c !== 'fe0f'; });
    return TWEMOJI + cps.join('-') + '.svg';
  }

  function emojiImages(root) {
    var loads = [];
    var track = function (img, fallback) {
      loads.push(new Promise(function (resolve) {
        img.addEventListener('load', resolve);
        img.addEventListener('error', function () { fallback(); resolve(); });
      }));
    };
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var has = new RegExp(EMOJI.source, 'u'); // sin g: test() con g avanza lastIndex y saltea nodos
    while (walker.nextNode()) if (has.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    var svgTexts = [];
    nodes.forEach(function (node) {
      var text = node.parentElement && node.parentElement.closest('text');
      if (text) { if (svgTexts.indexOf(text) === -1) svgTexts.push(text); return; }
      var frag = document.createDocumentFragment(), last = 0, v = node.nodeValue, m;
      EMOJI.lastIndex = 0;
      while ((m = EMOJI.exec(v))) {
        if (m.index > last) frag.appendChild(document.createTextNode(v.slice(last, m.index)));
        var img = document.createElement('img');
        img.className = 'mn-emoji';
        img.alt = m[0];
        img.src = emojiUrl(m[0]);
        (function (img, seq) { track(img, function () { img.replaceWith(document.createTextNode(seq)); }); })(img, m[0]);
        frag.appendChild(img);
        last = m.index + m[0].length;
      }
      if (last < v.length) frag.appendChild(document.createTextNode(v.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    // En las figuras el emoji sale del texto y se dibuja como <image> justo antes
    svgTexts.forEach(function (text) {
      var found = (text.textContent.match(EMOJI) || [])[0];
      if (!found) return;
      var size = parseFloat(getComputedStyle(text).fontSize) * 1.15;
      var x0 = parseFloat(text.getAttribute('x')), y0 = parseFloat(text.getAttribute('y'));
      var w = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) w.currentNode.nodeValue = w.currentNode.nodeValue.replace(EMOJI, '').replace(/^\s+/, '');
      var img = document.createElementNS(SVGNS, 'image');
      img.setAttribute('href', emojiUrl(found));
      img.setAttribute('width', size);
      img.setAttribute('height', size);
      var box = text.textContent.trim() ? text.getBBox() : null;
      img.setAttribute('x', box ? box.x - size - 3 : x0);
      img.setAttribute('y', box ? box.y + (box.height - size) / 2 : y0 - size * 0.85);
      loads.push(new Promise(function (resolve) { img.addEventListener('load', resolve); img.addEventListener('error', resolve); }));
      text.parentNode.insertBefore(img, text);
    });
    return Promise.all(loads);
  }

  function staticFonts() {
    document.querySelectorAll('link[href*="fonts.googleapis.com/css"]').forEach(function (l) { l.remove(); });
    return Promise.all(STATIC_FONTS.map(function (name) {
      return new Promise(function (resolve) {
        var l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = 'https://cdn.jsdelivr.net/npm/@fontsource/' + name + '.css';
        l.onload = l.onerror = resolve;
        document.head.appendChild(l);
      });
    })).then(function () {
      // Cada fuente viene en subconjuntos que se bajan recién cuando un texto los usa, y eso
      // pasaría durante la paginación: se cargan antes, con todos los caracteres del libro
      var seen = {}, chars = '';
      Array.from(document.body.textContent).forEach(function (ch) { if (!seen[ch]) { seen[ch] = true; chars += ch; } });
      return Promise.all(['400 16px Inter', '500 16px Inter', '600 16px Inter', '700 16px Inter', '800 16px Inter',
        '400 16px "JetBrains Mono"', '500 16px "JetBrains Mono"', '700 16px "JetBrains Mono"', '400 16px "Noto Emoji"']
        .map(function (f) { return document.fonts.load(f, chars).catch(function () {}); }));
    }).then(function () { return document.fonts.ready; });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  return {
    build: build,
    toggleA4View: toggleA4View,
    printChapter: printChapter,
    stats: function () { return { answers: answers.length, solutions: solutions.length, tomo: TOMO ? TOMO.id : 'all' }; }
  };
})();
