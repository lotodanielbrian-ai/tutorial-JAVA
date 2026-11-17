// Java INPRO — Manual: arma el libro "Java desde cero" con los mismos datos del curso
// (LESSONS, PRACTICA) más los textos de manual-contenido.js y las figuras de
// manual-figuras.js. En pantalla es interactivo; con ?print=1 queda listo para que
// tools/manual-pdf.js lo pagine en hojas A4.
var Manual = (function () {
  var PRINT = /[?&]print=1/.test(location.search);
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
  var LEVEL = { super: 'Súper básico', basico: 'Básico', inter: 'Intermedio', avanzado: 'Avanzado', examen: 'Proyecto', entrevista: 'Entrevista' };
  var ESCALERA = [['vida', '🏠', 'En la vida diaria'], ['modelo', '💡', 'La idea'], ['pseudo', '📝', 'En pasos'], ['java', '☕', 'En Java'], ['real', '💼', 'En un sistema real']];

  // ── Piezas de cada capítulo ──────────────────────────────────────────
  function escalera(e) {
    if (!e) return '';
    return '<section class="mn-escalera" aria-label="De la vida diaria al código"><h3 class="mn-h">De la vida diaria al código</h3><ol>' +
      ESCALERA.map(function (s) {
        return e[s[0]] ? '<li><span class="mn-step-ico" aria-hidden="true">' + s[1] + '</span><div><strong>' + s[2] + '</strong><p>' + e[s[0]] + '</p></div></li>' : '';
      }).join('') + '</ol></section>';
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
    var html = '<article class="mn-chapter" id="cap-' + cap + '" data-part="' + partN + '">' + runHead('Capítulo ' + cap + ' · ' + l.title);
    html += '<header class="mn-ch-head"><div class="mn-ch-num">Capítulo ' + cap + '</div><h2 class="mn-ch-title">' + esc(l.title) + '</h2>' +
      '<p class="mn-ch-desc">' + esc(l.desc) + '</p><p class="mn-ch-meta">' + (LEVEL[l.level] || '') + ' · ' + l.stars + '</p></header>';
    if (P.objetivos) html += '<section class="mn-goals"><h3 class="mn-h">Al terminar vas a poder</h3><ul>' + P.objetivos.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></section>';
    // La pregunta previa se piensa antes de leer: en pantalla la respuesta arranca tapada
    if (P.antes) html += '<aside class="mn-before"><strong>🤔 ' + P.antes[0] + '</strong>' +
      '<details class="mn-sol mn-screen"><summary>Ver respuesta</summary><div>' + P.antes[1] + '</div></details>' +
      '<p class="mn-before-a mn-print-only"><span>Respuesta:</span> ' + P.antes[1] + '</p></aside>';
    html += escalera(P.escalera);
    html += figura(cap, cap);
    html += '<section class="mn-simple"><h3 class="mn-h mn-h-big">La idea en simple</h3>' + l.simple() + '</section>';
    html += '<section class="mn-detail"><h3 class="mn-h mn-h-big">En detalle</h3>' + l.tutorial() + '</section>';

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
      html += '<section class="mn-check"><h3 class="mn-h mn-h-big">Comprobá lo que aprendiste</h3><p class="mn-small">Las respuestas, con su explicación, están en el <a href="#ap-respuestas">apéndice A</a>.</p>' + acts.join('') + '</section>';
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

  // ── Partes del libro ────────────────────────────────────────────────
  function cover() {
    return '<section class="mn-cover" id="tapa"><div class="mn-cover-band"></div>' +
      '<div class="mn-cover-in"><p class="mn-cover-kicker">Java INPRO</p><h1>Java<br>desde cero</h1>' +
      '<p class="mn-cover-sub">De no saber nada a tu primer proyecto con objetos y Git. Un libro para aprender aunque nunca hayas programado.</p>' +
      '<div class="mn-cover-art">' + coverArt() + '</div>' +
      '<p class="mn-cover-foot">' + esc(MANUAL.EDICION) + ' · 35 capítulos · figuras, actividades y soluciones</p></div></section>';
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
    return '<section class="mn-front" id="como-usar"><h2 class="mn-front-title">Antes de empezar</h2>' +
      '<p>Este libro acompaña al curso <strong>Java INPRO</strong>, pero se puede leer solo. Está pensado para alguien que <strong>nunca programó</strong>: cada idea nueva arranca de algo que ya conocés y recién al final llega al código.</p>' +
      '<p>Leelo en orden. Cada capítulo usa lo anterior, y el capítulo 0 explica qué es Java, para qué sirve y cómo instalarlo.</p>' +
      '<table class="sym-tbl mn-legend"><thead><tr><th>Vas a ver</th><th>Para qué</th></tr></thead><tbody>' +
      '<tr><td>🏠 💡 📝 ☕ 💼</td><td>La escalera de la vida diaria al código</td></tr>' +
      '<tr><td>Figura N.1</td><td>La idea dibujada</td></tr>' +
      '<tr><td>☐ N.1, N.2 …</td><td>Actividades para comprobar lo aprendido (respuestas en el apéndice A)</td></tr>' +
      '<tr><td>🏆 Desafío</td><td>Un programa para escribir vos (soluciones en el apéndice B)</td></tr>' +
      '<tr><td>💡 ⚠️ ☕</td><td>Consejos, errores típicos y datos del mundo Java</td></tr></tbody></table>' +
      '<p class="mn-small">Versión interactiva, con ejemplos que se ejecutan y se pueden editar: <strong>java-inpro-tutorial.web.app/manual.html</strong></p></section>';
  }

  function toc() {
    var rows = '<li class="mn-toc-part"><a href="#cap-0">0 · Antes de escribir código<span class="mn-toc-dots"></span></a></li>';
    MANUAL.CAP0.forEach(function (s, i) { rows += '<li class="mn-toc-sub"><a href="#c0-' + s.id + '">0.' + (i + 1) + ' ' + esc(s.titulo) + '<span class="mn-toc-dots"></span></a></li>'; });
    MANUAL.PARTES.forEach(function (p) {
      rows += '<li class="mn-toc-part"><a href="#parte-' + p.n + '">Parte ' + p.n + ' · ' + esc(p.titulo) + '<span class="mn-toc-dots"></span></a></li>';
      p.ids.forEach(function (id) {
        var l = LESSONS.find(function (x) { return x.id === id; });
        rows += '<li><a href="#cap-' + id + '"><span class="mn-toc-n">' + id + '</span>' + esc(l.title) + '<span class="mn-toc-dots"></span></a></li>';
      });
    });
    rows += '<li class="mn-toc-part"><a href="#apendices">Apéndices<span class="mn-toc-dots"></span></a></li>' +
      ['A · Respuestas de las actividades#ap-respuestas', 'B · Soluciones de los desafíos#ap-soluciones', 'C · Mensajes de error traducidos#ap-errores', 'D · Hoja de referencia rápida#ap-referencia', 'E · Glosario#ap-glosario']
        .map(function (s) { var p = s.split('#'); return '<li class="mn-toc-sub"><a href="#' + p[1] + '">' + p[0] + '<span class="mn-toc-dots"></span></a></li>'; }).join('');
    return '<nav class="mn-toc" id="indice" aria-label="Índice"><h2 class="mn-front-title">Índice</h2><ol>' + rows + '</ol></nav>';
  }

  function chapter0() {
    var html = '<article class="mn-chapter mn-cap0" id="cap-0">' + runHead('Capítulo 0 · Antes de escribir código') + '<header class="mn-ch-head"><div class="mn-ch-num">Capítulo 0</div><h2 class="mn-ch-title">Antes de escribir código</h2>' +
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
        var l = LESSONS.find(function (x) { return x.id === id; });
        return '<li><span>' + id + '</span> ' + esc(l.title) + '</li>';
      }).join('') + '</ol></section>';
  }

  function glossary() {
    var seen = {}, list = [];
    LESSONS.forEach(function (l) {
      var src = l.simple() + l.tutorial();
      var re = /<span class="glossary" data-def="([^"]*)">([^<]*)<\/span>/g, m;
      while ((m = re.exec(src))) {
        var word = m[2].trim(), k = word.toLowerCase();
        if (!seen[k]) { seen[k] = true; list.push({ w: word, d: m[1], cap: l.id }); }
      }
    });
    list.sort(function (a, b) { return a.w.localeCompare(b.w, 'es', { sensitivity: 'base' }); });
    return '<dl class="mn-gloss">' + list.map(function (g) {
      return '<dt>' + esc(g.w) + ' <a class="mn-ref" href="#cap-' + g.cap + '">cap. ' + g.cap + '</a></dt><dd>' + g.d + '</dd>';
    }).join('') + '</dl>';
  }

  function appendices() {
    var html = '<section class="mn-part mn-part-ap" id="apendices"><div class="mn-part-n">Apéndices</div><h2 class="mn-part-title">Para consultar</h2>' +
      '<p class="mn-part-text">Respuestas, soluciones, errores traducidos, una hoja de referencia y el glosario.</p></section>';
    html += '<article class="mn-appendix" id="ap-respuestas">' + runHead('Apéndice A · Respuestas') + '<h2 class="mn-ap-title">A · Respuestas de las actividades</h2>' +
      answers.map(function (c) {
        return '<section class="mn-ans-ch"><h3>Capítulo ' + c.cap + ' · ' + esc(c.titulo) + '</h3>' +
          c.items.map(function (a) { return '<div class="mn-ans"><a class="mn-num" href="#act-' + a.n.replace('.', '-') + '">' + a.n + '</a><div>' + a.html + '</div></div>'; }).join('') + '</section>';
      }).join('') + '</article>';
    html += '<article class="mn-appendix" id="ap-soluciones">' + runHead('Apéndice B · Soluciones') + '<h2 class="mn-ap-title">B · Soluciones de los desafíos</h2>' +
      '<p class="mn-small">Hay muchas soluciones correctas: si la tuya imprime la salida esperada y usa lo que pide el capítulo, está bien.</p>' +
      solutions.map(function (s) {
        return '<section class="mn-sol-ch" id="sol-' + s.cap + '"><h3>Capítulo ' + s.cap + ' · ' + esc(s.titulo) + '</h3>' + cb('Solución', s.code) + '</section>';
      }).join('') + '</article>';
    html += '<article class="mn-appendix" id="ap-errores">' + runHead('Apéndice C · Errores') + '<h2 class="mn-ap-title">C · Mensajes de error traducidos</h2>' +
      '<table class="sym-tbl mn-err"><thead><tr><th>El mensaje dice</th><th>Cuándo</th><th>Qué significa y qué hacer</th></tr></thead><tbody>' +
      MANUAL.ERRORES.map(function (e) { return '<tr><td>' + esc(e[0]) + '</td><td>' + e[1] + '</td><td>' + esc(e[2]) + '</td></tr>'; }).join('') + '</tbody></table></article>';
    html += '<article class="mn-appendix" id="ap-referencia">' + runHead('Apéndice D · Referencia') + '<h2 class="mn-ap-title">D · Hoja de referencia rápida</h2>' +
      '<table class="sym-tbl mn-ref-tbl"><tbody>' + MANUAL.REFERENCIA.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td><code>' + esc(r[1]) + '</code></td></tr>'; }).join('') + '</tbody></table></article>';
    html += '<article class="mn-appendix" id="ap-glosario">' + runHead('Apéndice E · Glosario') + '<h2 class="mn-ap-title">E · Glosario</h2>' + glossary() + '</article>';
    return html;
  }

  function backCover() {
    return '<section class="mn-back"><p>Java INPRO · <strong>Java desde cero</strong></p><p class="mn-small">' + esc(MANUAL.EDICION) +
      '. Los ejemplos y las soluciones se verifican con el compilador de Java real antes de cada edición.</p></section>';
  }

  // ── Interactividad (solo en pantalla) ───────────────────────────────
  function enhanceCode(root) {
    root.querySelectorAll('.cblock').forEach(function (block, i) {
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

  function wire(root) {
    root.addEventListener('click', function (e) {
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

  function navBar() {
    var opts = '<option value="indice">Índice</option><option value="cap-0">0 · Antes de escribir código</option>' +
      LESSONS.map(function (l) { return '<option value="cap-' + l.id + '">' + l.id + ' · ' + esc(l.title) + '</option>'; }).join('') +
      '<option value="apendices">Apéndices</option>';
    var bar = document.createElement('header');
    bar.className = 'mn-bar mn-screen';
    bar.innerHTML = '<a class="mn-brand" href="index.html" title="Volver al curso">☕ <span>Java desde cero</span></a>' +
      '<label class="mn-jump"><span class="mn-sr">Ir a</span><select aria-label="Ir al capítulo">' + opts + '</select></label>' +
      '<div class="mn-actions"><a class="mn-btn" href="manual/java-desde-cero.pdf" download>⬇ PDF</a>' +
      '<button type="button" class="mn-btn ghost" onclick="window.print()">🖨 Imprimir</button>' +
      '<a class="mn-btn ghost" href="index.html">← Curso</a></div><div class="mn-progress" aria-hidden="true"><span></span></div>';
    document.body.prepend(bar);
    bar.querySelector('select').addEventListener('change', function () {
      var t = document.getElementById(this.value);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    var fill = bar.querySelector('.mn-progress span');
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      fill.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%';
    }, { passive: true });
  }

  function build() {
    var html = cover() + howTo() + toc() + chapter0();
    MANUAL.PARTES.forEach(function (p) {
      html += partOpener(p);
      p.ids.forEach(function (id) { html += chapter(LESSONS.find(function (l) { return l.id === id; }), p.n); });
    });
    html += appendices() + backCover();
    var root = document.getElementById('libro');
    root.innerHTML = html;
    if (PRINT) {
      hardenCode(root);
      document.documentElement.classList.add('libro-claro', 'libro-print');
      // Los estilos de hoja también se aplican en pantalla, para que Paged.js los vea
      var link = document.getElementById('manual-print-css');
      if (link) link.media = 'all';
    } else {
      navBar();
      enhanceCode(root);
      wire(root);
      if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
    }
    document.documentElement.setAttribute('data-ready', '1');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();

  return { build: build, stats: function () { return { answers: answers.length, solutions: solutions.length }; } };
})();
