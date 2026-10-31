// Java INPRO — Práctica: actividades por lección, simulacros y repaso de errores.
// El contenido vive en practica-*.js. No afecta el certificado ni el ranking:
// mide dominio por separado para que nadie pierda el progreso que ya tiene.
var Practica = (function () {
  var MASTERY = 80;
  var PASS_NOTE = 6;
  var LABELS = {
    http: '🔌 Laboratorio de API', mc: '🔘 Opción múltiple', tf: '⚖️ Verdadero o falso', fill: '✍️ Completar', bug: '🐞 Encontrar el error',
    output: '👀 ¿Qué imprime?', order: '🧩 Ordenar', match: '🔗 Unir', short: '💬 Respondé con tus palabras', code: '🏗️ Reto de código'
  };
  var LADDER = [
    ['vida', '🏠', 'En la vida diaria'],
    ['modelo', '🧠', 'La idea'],
    ['pseudo', '📝', 'En pasos'],
    ['java', '☕', 'En Java'],
    ['real', '💼', 'En un sistema real']
  ];
  var TRAMOS = {
    todo: { label: 'Todo el curso', levels: ['super', 'basico', 'inter', 'avanzado', 'examen', 'entrevista'] },
    super: { label: '🌱 Super Básico', levels: ['super'] },
    basico: { label: '📘 Básico', levels: ['basico'] },
    inter: { label: '🚀 Intermedio', levels: ['inter'] },
    avanzado: { label: '🔧 Avanzado', levels: ['avanzado', 'examen'] },
    f2limpio: { label: '🧹 Fase 2 · Código limpio', levels: ['limpio'], fase2: true },
    f2parcial1: { label: '🌱 Fase 2 · Primer parcial', levels: ['spring', 'api'], fase2: true },
    f2parcial2: { label: '🧪 Fase 2 · Segundo parcial', levels: ['calidad', 'entrega'], fase2: true },
    f2todo: { label: '🎓 Fase 2 completa', levels: ['limpio', 'spring', 'api', 'calidad', 'entrega', 'extra', 'coloquio'], fase2: true }
  };

  var state = emptyState();
  var tries = {};
  var picks = {};
  var orders = {};
  var solutionSeen = {};
  var sim = null;

  function emptyState() { return { scores: {}, wrong: [], sims: [] }; }

  function e(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function attr(s) { return e(s).replace(/"/g, '&quot;'); }
  function $(id) { return document.getElementById(id); }

  function shuffled(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  function dataFor(id) { return (typeof PRACTICA !== 'undefined' && PRACTICA[id]) || null; }

  function itemOf(key) {
    var parts = String(key).split('-');
    var p = dataFor(Number(parts[0]));
    return p && p.items ? p.items[Number(parts[1])] : null;
  }

  // ── Corrección ───────────────────────────────────────────────────────
  function folded(s) {
    return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function compact(s) { return String(s == null ? '' : s).replace(/\s+/g, ''); }

  function gradeShort(it, text) {
    var answer = folded(text);
    return it.any.every(function (group) {
      return group.some(function (word) { return answer.indexOf(folded(word)) !== -1; });
    });
  }

  function gradeFill(it, values) {
    return it.a.every(function (alts, i) {
      return alts.some(function (alt) { return compact(alt) === compact(values[i]); });
    });
  }

  function gradeOutput(it, text) { return normalizeOutput(text) === normalizeOutput(it.a); }

  function gradeCode(it, code) {
    var res = judgeProgram(code, it.expected, it.stdin || []);
    if (res.unsupported) {
      return { passed: false, res: { err: 'Este programa usa ' + res.unsupported + ', que el emulador no ejecuta. Resolvelo con lo visto en la lección.' } };
    }
    if (!res.simulated || res.runtime) return { passed: false, res: res };
    if (normalizeOutput(res.output) !== normalizeOutput(it.expected)) return { passed: false, res: res };
    var masked = maskJava(code);
    var missing = (it.need || []).filter(function (n) { return !new RegExp(n[0]).test(masked); });
    if (missing.length) {
      res.conceptErr = missing[0][1];
      return { passed: false, res: res };
    }
    return { passed: true, res: res };
  }

  function grade(it, ans) {
    switch (it.t) {
      case 'mc': return ans === it.a;
      case 'tf': return ans === it.a;
      case 'bug': return ans === it.line;
      case 'output': return gradeOutput(it, ans);
      case 'fill': return gradeFill(it, ans);
      case 'short': return gradeShort(it, ans);
      case 'order': return ans.join(',') === it.lines.map(function (_, i) { return i; }).join(',');
      case 'match': return it.pairs.every(function (_, i) { return ans[i] === i; });
    }
    return false;
  }

  function answerText(it) {
    switch (it.t) {
      case 'mc': return it.o[it.a];
      case 'tf': return it.a ? 'Verdadero' : 'Falso';
      case 'bug': return 'Línea ' + it.line + ': <code>' + e(it.fix.trim()) + '</code>';
      case 'output': return '<pre class="pr-pre">' + e(it.a) + '</pre>';
      case 'fill': return it.a.map(function (alts) { return '<code>' + e(alts[0]) + '</code>'; }).join(' · ');
      case 'short': return it.model;
      case 'order': return '<pre class="pr-pre">' + e(it.lines.join('\n')) + '</pre>';
      case 'match': return it.pairs.map(function (p) { return e(p[0]) + ' → ' + e(p[1]); }).join('<br>');
    }
    return '';
  }

  // ── Dibujo de cada actividad ─────────────────────────────────────────
  function codeBlock(code) { return typeof cb === 'function' ? cb('Java', code) : '<pre class="pr-pre">' + e(code) + '</pre>'; }

  function bodyOf(it, key) {
    var html = '';
    switch (it.t) {
      case 'mc':
        if (it.code) html += codeBlock(it.code);
        html += '<div class="pr-opts">' + shuffled(it.o.map(function (o, i) { return i; })).map(function (i) {
          return '<button type="button" class="pr-opt" data-v="' + i + '" onclick="Practica.pick(\'' + key + '\',' + i + ',this)">' + it.o[i] + '</button>';
        }).join('') + '</div>';
        return html;
      case 'tf':
        if (it.code) html += codeBlock(it.code);
        return html + '<div class="pr-opts pr-opts-row">' +
          '<button type="button" class="pr-opt" onclick="Practica.pick(\'' + key + '\',true,this)">Verdadero</button>' +
          '<button type="button" class="pr-opt" onclick="Practica.pick(\'' + key + '\',false,this)">Falso</button></div>';
      case 'output':
        return codeBlock(it.code) + '<textarea class="pr-input" id="pr-in-' + key + '" rows="' + Math.min(6, String(it.a).split('\n').length + 1) + '" spellcheck="false" autocomplete="off" aria-label="Lo que imprime el programa" placeholder="Escribí exactamente lo que aparece en la consola"></textarea>';
      case 'fill': {
        var parts = it.code.split('___');
        var filled = '';
        parts.forEach(function (part, i) {
          filled += e(part);
          if (i < parts.length - 1) {
            var size = Math.max(4, it.a[i][0].length + 1);
            filled += '<input class="pr-blank" id="pr-in-' + key + '-' + i + '" style="width:' + size + 'ch" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Hueco ' + (i + 1) + '">';
          }
        });
        return '<pre class="pr-pre pr-fill">' + filled + '</pre>';
      }
      case 'bug':
        return '<div class="pr-lines">' + it.code.split('\n').map(function (ln, i) {
          return '<button type="button" class="pr-line" onclick="Practica.pick(\'' + key + '\',' + (i + 1) + ',this)"><span class="pr-ln">' + (i + 1) + '</span><span>' + (e(ln) || ' ') + '</span></button>';
        }).join('') + '</div>';
      case 'order': {
        var idx = it.lines.map(function (_, i) { return i; });
        var seq = shuffled(idx);
        while (seq.join() === idx.join()) seq = shuffled(idx);
        orders[key] = seq;
        return '<ol class="pr-order" id="pr-ord-' + key + '">' + orderRows(it, key) + '</ol>';
      }
      case 'match': {
        var rights = shuffled(it.pairs.map(function (p, i) { return i; }));
        return '<div class="pr-match">' + it.pairs.map(function (p, i) {
          return '<label class="pr-match-row"><span>' + e(p[0]) + '</span><select id="pr-in-' + key + '-' + i + '"><option value="">Elegí…</option>' +
            rights.map(function (r) { return '<option value="' + r + '">' + e(it.pairs[r][1]) + '</option>'; }).join('') + '</select></label>';
        }).join('') + '</div>';
      }
      case 'short':
        return '<textarea class="pr-input" id="pr-in-' + key + '" rows="3" aria-label="Tu respuesta" placeholder="Explicalo como se lo contarías a un compañero"></textarea>';
      case 'http':
        return ApiLab.render(key, it);
      case 'code':
        return '<p class="pr-task">' + it.task + '</p>' +
          (it.stdin && it.stdin.length ? '<div class="exp-out-label">Entrada simulada</div><div class="exp-out">' + e(it.stdin.join('\n')) + '</div>' : '') +
          '<div class="exp-out-label">Output esperado</div><div class="exp-out">' + e(it.expected) + '</div>' +
          '<textarea class="pr-editor" id="pr-in-' + key + '" rows="' + Math.min(18, it.starter.split('\n').length + 4) + '" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Tu código">' + e(it.starter) + '</textarea>';
    }
    return '';
  }

  function orderRows(it, key) {
    return orders[key].map(function (lineIdx, pos) {
      return '<li class="pr-ord-row"><code>' + (e(it.lines[lineIdx]) || ' ') + '</code><span class="pr-ord-btns">' +
        '<button type="button" onclick="Practica.move(\'' + key + '\',' + pos + ',-1)" aria-label="Subir"' + (pos === 0 ? ' disabled' : '') + '>↑</button>' +
        '<button type="button" onclick="Practica.move(\'' + key + '\',' + pos + ',1)" aria-label="Bajar"' + (pos === orders[key].length - 1 ? ' disabled' : '') + '>↓</button></span></li>';
    }).join('');
  }

  function renderItem(it, key, label, exam) {
    var q = it.t === 'code' ? (it.title || 'Reto') : it.q;
    var action = '';
    if (it.t === 'http') {
      action = '<button type="button" class="run-btn" onclick="Practica.sendHttp(\'' + key + '\')">▶ Enviar</button>';
    } else if (it.t === 'code') {
      action = '<button type="button" class="run-btn" onclick="Practica.runReto(\'' + key + '\')">▶ Ejecutar</button>' +
        '<button type="button" class="hint-btn" onclick="Practica.retoHint(\'' + key + '\')">💡 Pista</button>' +
        '<button type="button" class="hint-btn" onclick="Practica.resetReto(\'' + key + '\')">↺ Resetear</button>';
    } else if (!exam) {
      action = '<button type="button" class="pr-check" onclick="Practica.check(\'' + key + '\')">Comprobar</button>';
    }
    return '<article class="pr-item" id="pr-' + key + '">' +
      '<div class="pr-head"><span class="pr-chip">' + LABELS[it.t] + '</span><span class="pr-num">' + label + '</span></div>' +
      '<div class="pr-q">' + q + '</div>' + bodyOf(it, key) +
      (action ? '<div class="pr-actions">' + action + '</div>' : '') +
      '<div class="pr-fb" id="pr-fb-' + key + '" aria-live="polite"></div></article>';
  }

  // ── Interacción ──────────────────────────────────────────────────────
  function pick(key, value, el) {
    var card = $('pr-' + key);
    if (!card || card.classList.contains('locked')) return;
    picks[key] = value;
    var all = card.querySelectorAll('.pr-opt, .pr-line');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    el.classList.add('selected');
  }

  function move(key, pos, delta) {
    var card = $('pr-' + key);
    if (!card || card.classList.contains('locked')) return;
    var seq = orders[key];
    var to = pos + delta;
    var t = seq[pos];
    seq[pos] = seq[to];
    seq[to] = t;
    $('pr-ord-' + key).innerHTML = orderRows(itemOf(key), key);
  }

  function readAnswer(it, key) {
    var i, v, out;
    switch (it.t) {
      case 'mc': case 'tf': case 'bug':
        return Object.prototype.hasOwnProperty.call(picks, key) ? picks[key] : null;
      case 'output': case 'short':
        v = $('pr-in-' + key).value;
        return v.trim() ? v : null;
      case 'fill':
        out = [];
        for (i = 0; i < it.a.length; i++) {
          v = $('pr-in-' + key + '-' + i).value;
          if (!v.trim()) return null;
          out.push(v);
        }
        return out;
      case 'order': return orders[key].slice();
      case 'match':
        out = [];
        for (i = 0; i < it.pairs.length; i++) {
          v = $('pr-in-' + key + '-' + i).value;
          if (v === '') return null;
          out.push(Number(v));
        }
        return out;
    }
    return null;
  }

  function lock(key) {
    var card = $('pr-' + key);
    if (!card) return;
    card.classList.add('locked');
    var fields = card.querySelectorAll('input, textarea, select, .pr-opt, .pr-line, .pr-check, .pr-ord-btns button');
    for (var i = 0; i < fields.length; i++) fields[i].disabled = true;
  }

  function feedback(key, cls, html) {
    var fb = $('pr-fb-' + key);
    if (fb) {
      fb.className = 'pr-fb ' + cls;
      fb.innerHTML = html;
    }
  }

  function check(key) {
    var it = itemOf(key);
    if (!it) return;
    var ans = readAnswer(it, key);
    if (ans === null) { feedback(key, 'warn', 'Respondé antes de comprobar.'); return; }
    tries[key] = (tries[key] || 0) + 1;
    if (grade(it, ans)) {
      var earned = tries[key] === 1 ? 1 : 0.5;
      saveScore(key, earned);
      lock(key);
      feedback(key, 'good', '<strong>✅ ' + (tries[key] === 1 ? '¡Bien!' : 'Ahora sí.') + '</strong> ' + it.why);
    } else if (tries[key] < 2) {
      feedback(key, 'warn', '<strong>🤔 Todavía no.</strong> ' + (it.hint || 'Volvé a leerlo con calma y probá otra vez. Tenés un intento más.'));
    } else {
      saveScore(key, 0);
      lock(key);
      // Las palabras clave no leen matices: en una respuesta abierta decide quien responde
      var self = it.t === 'short' ? '<div class="pr-why"><button type="button" class="pr-link" onclick="Practica.selfOk(\'' + key + '\')">Mi respuesta decía lo mismo</button></div>' : '';
      feedback(key, 'bad', '<strong>📌 Respuesta:</strong> ' + answerText(it) + '<div class="pr-why">' + it.why + '</div><div class="pr-why">Queda guardada para tu repaso de errores.</div>' + self);
    }
    refreshHeader(Number(String(key).split('-')[0]));
  }

  function selfOk(key) {
    saveScore(key, 1);
    feedback(key, 'good', '<strong>✅ Anotado.</strong> ' + itemOf(key).why);
    refreshHeader(Number(String(key).split('-')[0]));
  }

  function saveScore(key, value) {
    var prev = state.scores[key];
    if (prev === undefined || value > prev) state.scores[key] = value;
    var at = state.wrong.indexOf(key);
    if (value >= 1 && at !== -1) state.wrong.splice(at, 1);
    if (value < 1 && at === -1) state.wrong.push(key);
    persist();
    if (typeof buildSidebar === 'function' && !sim) buildSidebar();
  }

  function persist() {
    if (typeof Progress !== 'undefined' && Progress.savePractice) Progress.savePractice(state);
  }

  // ── Retos de código ──────────────────────────────────────────────────
  function runReto(key) {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var it = itemOf(key);
    var result = gradeCode(it, $('pr-in-' + key).value);
    var res = result.res;
    tries[key] = (tries[key] || 0) + 1;
    if (result.passed) {
      saveScore(key, solutionSeen[key] ? 0.5 : 1);
      feedback(key, 'good', '<strong>✅ Correcto.</strong><pre class="pr-pre">' + e(res.output) + '</pre>' + (it.why ? '<div class="pr-why">' + it.why + '</div>' : ''));
      if (typeof launchConfetti === 'function') launchConfetti();
      refreshHeader(Number(String(key).split('-')[0]));
      return;
    }
    var msg;
    if (res.syntax) {
      msg = '<strong>Línea ' + res.line + ':</strong> <code>' + e(res.javac) + '</code><div class="pr-why">' + e(res.why) + '</div>' + (res.suggest ? '<pre class="pr-pre">' + e(res.suggest) + '</pre>' : '');
    } else if (res.err) {
      msg = e(res.err);
    } else if (res.runtime) {
      msg = (res.output ? '<pre class="pr-pre">' + e(res.output) + '</pre>' : '') + '<pre class="pr-pre pr-err">' + e(res.runtime) + '</pre>';
    } else if (res.conceptErr) {
      msg = 'La consola coincide, pero falta algo: ' + e(res.conceptErr);
    } else {
      msg = 'La consola no coincide con el output esperado.<pre class="pr-pre">' + e(res.output || '(no imprimió nada)') + '</pre>';
    }
    if (tries[key] >= 2 && !solutionSeen[key]) {
      msg += '<div class="pr-why"><button type="button" class="pr-link" onclick="Practica.showSolution(\'' + key + '\')">Ver una solución</button></div>';
    }
    feedback(key, 'bad', msg);
  }

  function sendHttp(key) {
    var it = itemOf(key);
    var res = ApiLab.send(key);
    var ok = ApiLab.reached(it, res);
    var box = '<pre class="pr-pre">HTTP ' + res.status + '\n' + e(res.body) + '</pre>';
    if (ok) {
      saveScore(key, 1);
      feedback(key, 'good', '<strong>✅ Objetivo cumplido.</strong>' + box + it.why);
      refreshHeader(Number(String(key).split('-')[0]));
    } else {
      feedback(key, 'warn', '<strong>Respuesta del servidor.</strong>' + box + (it.hint || 'Todavía no es lo que se pide. Revisá el verbo, la ruta y el cuerpo.'));
    }
  }

  function retoHint(key) {
    var it = itemOf(key);
    feedback(key, 'warn', '<strong>💡 Pista:</strong> ' + it.hint);
  }

  function resetReto(key) {
    $('pr-in-' + key).value = itemOf(key).starter;
    feedback(key, '', '');
  }

  function showSolution(key) {
    solutionSeen[key] = true;
    feedback(key, 'warn', '<strong>Una solución posible.</strong> Leela, cerrala y escribila de memoria: así se aprende.<pre class="pr-pre">' + e(itemOf(key).solution) + '</pre>');
  }

  // ── Pestaña de la lección ────────────────────────────────────────────
  function mastery(id) {
    var p = dataFor(id);
    if (!p || !p.items || !p.items.length) return { pct: 0, done: 0, total: 0 };
    var sum = 0, doneCount = 0;
    p.items.forEach(function (_, i) {
      var s = state.scores[id + '-' + i];
      if (s !== undefined) { sum += s; doneCount++; }
    });
    return { pct: Math.round(sum / p.items.length * 100), done: doneCount, total: p.items.length };
  }

  function headerHtml(id) {
    var m = mastery(id);
    if (!m.total) return '';
    var text = m.pct >= MASTERY ? '🧠 ¡Dominio alcanzado!' : 'Meta: ' + MASTERY + '% de dominio';
    return '<div class="pr-progress"><div class="pr-bar"><div class="pr-bar-fill" style="width:' + m.pct + '%"></div></div>' +
      '<div class="pr-progress-txt"><span>' + text + '</span><span>' + m.pct + '% · ' + m.done + ' de ' + m.total + '</span></div></div>';
  }

  function refreshHeader(id) {
    var box = $('pr-header');
    if (box) box.innerHTML = headerHtml(id);
  }

  function buildTab(l) {
    var p = dataFor(l.id);
    tries = {};
    picks = {};
    solutionSeen = {};
    if (!p) return '<p>Esta lección todavía no tiene actividades.</p>';
    var html = '<div class="pr-goals"><h4>🎯 Al terminar vas a poder</h4><ul>' +
      p.objetivos.map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></div>';
    if (p.prev) html += '<p class="pr-prev"><strong>Antes de empezar:</strong> ' + p.prev + '</p>';
    html += '<div id="pr-header">' + headerHtml(l.id) + '</div>';
    if (p.tramo) {
      html += '<div class="pr-sim-cta"><div><strong>🧪 Simulacro de ' + TRAMOS[p.tramo].label + '</strong><br>Preguntas al azar de todo el tramo, sin ayuda hasta el final.</div>' +
        '<button type="button" class="run-btn" onclick="Practica.startSimulacro(\'' + p.tramo + '\',12,false)">Empezar</button></div>';
    }
    var items = p.items || [];
    if (items.length) {
      html += '<p class="pr-how">Tenés <strong>dos intentos</strong> por actividad. Lo que falles queda en tu <strong>repaso de errores</strong>.</p>';
    }
    items.forEach(function (it, i) {
      html += renderItem(it, l.id + '-' + i, (i + 1) + ' de ' + items.length);
    });
    return html;
  }

  function ladder(l) {
    var p = dataFor(l.id);
    if (!p || !p.escalera) return '';
    return '<div class="pr-ladder"><h4>🪜 De la vida diaria al código</h4><ol>' + LADDER.map(function (s) {
      return '<li><span class="pr-step"><span aria-hidden="true">' + s[1] + '</span> ' + s[2] + '</span><span class="pr-step-txt">' + p.escalera[s[0]] + '</span></li>';
    }).join('') + '</ol></div>';
  }

  function badge(id) {
    var m = mastery(id);
    return m.total && m.pct >= MASTERY ? '<span class="l-mastery" title="Dominio alcanzado">🧠</span>' : '';
  }

  // ── Simulacro y repaso ───────────────────────────────────────────────
  function lessonsFor(tramo) { return TRAMOS[tramo].fase2 ? LESSONS_F2 : LESSONS; }

  function poolFor(tramo) {
    var levels = TRAMOS[tramo].levels;
    var out = [];
    lessonsFor(tramo).forEach(function (l) {
      if (levels.indexOf(l.level) === -1) return;
      var p = dataFor(l.id);
      if (!p || !p.items) return;
      p.items.forEach(function (it, i) {
        if (it.t !== 'code' && it.t !== 'http') out.push(l.id + '-' + i);
      });
    });
    return out;
  }

  // Reparte por tipo y por lección para que el simulacro no se concentre en un solo tema
  function balanced(keys, count) {
    var byLesson = {};
    shuffled(keys).forEach(function (k) {
      var id = k.split('-')[0];
      (byLesson[id] = byLesson[id] || []).push(k);
    });
    var lessons = shuffled(Object.keys(byLesson));
    var out = [];
    while (out.length < count && lessons.length) {
      lessons = lessons.filter(function (id) { return byLesson[id].length; });
      lessons.forEach(function (id) {
        if (out.length < count && byLesson[id].length) out.push(byLesson[id].pop());
      });
    }
    return shuffled(out);
  }

  function openOverlay() {
    var box = $('sim-overlay');
    if (box) box.classList.add('show');
  }

  function closeSimulacro() {
    stopTimer();
    sim = null;
    var box = $('sim-overlay');
    if (box) box.classList.remove('show');
    if (typeof render === 'function') render();
  }

  // Un reto de código o de laboratorio no se puede responder en un examen
  function reviewable() {
    return state.wrong.filter(function (k) {
      var it = itemOf(k);
      return it && it.t !== 'code' && it.t !== 'http';
    });
  }

  function showPanel() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var wrong = reviewable();
    var last = state.sims.slice(-5).reverse();
    var html = '<div class="sim-head"><h2>🧪 Evaluaciones</h2><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">✕ Cerrar</button></div>' +
      '<p class="sim-lead">Un simulacro mezcla actividades al azar y no da pistas hasta el final, como un examen. Sirve para saber qué sabés de verdad.</p>' +
      '<div class="sim-form">' +
      '<label>Tramo<select id="sim-tramo">' + Object.keys(TRAMOS).filter(function (k) { return !TRAMOS[k].fase2 || (typeof fase2Unlocked === 'function' && fase2Unlocked()); }).map(function (k) { return '<option value="' + k + '">' + TRAMOS[k].label + '</option>'; }).join('') + '</select></label>' +
      '<label>Preguntas<select id="sim-count"><option value="10">10</option><option value="20" selected>20</option><option value="30">30</option></select></label>' +
      '<label class="sim-check"><input type="checkbox" id="sim-timer"> Con tiempo (90 segundos por pregunta)</label>' +
      '</div><button type="button" class="run-btn" onclick="Practica.fromForm()">Empezar simulacro</button>' +
      '<div class="sim-review"><h4>🔁 Repaso de errores</h4>' + (wrong.length
        ? '<p>Tenés <strong>' + wrong.length + '</strong> actividades para volver a intentar. Volver sobre lo que costó es lo que más fija lo aprendido.</p><button type="button" class="hint-btn" onclick="Practica.startReview()">Repasar mis errores</button>'
        : '<p>No tenés errores pendientes. Lo que falles en las actividades va a aparecer acá.</p>') + '</div>';
    if (last.length) {
      html += '<div class="sim-review"><h4>📈 Últimos simulacros</h4><ul class="sim-history">' + last.map(function (s) {
        return '<li><span>' + e(s.fecha) + ' · ' + e(s.tramo) + '</span><strong>' + s.nota + ' / 10</strong></li>';
      }).join('') + '</ul></div>';
    }
    $('sim-box').innerHTML = html;
    openOverlay();
  }

  function fromForm() {
    startSimulacro($('sim-tramo').value, Number($('sim-count').value), $('sim-timer').checked);
  }

  function startSimulacro(tramo, count, timed) {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var keys = balanced(poolFor(tramo), count);
    if (!keys.length) return;
    beginExam(keys, TRAMOS[tramo].label, timed ? keys.length * 90 : 0, false);
  }

  function startReview() {
    var keys = shuffled(reviewable()).slice(0, 20);
    if (!keys.length) return;
    beginExam(keys, 'Repaso de errores', 0, true);
  }

  function beginExam(keys, label, seconds, review) {
    picks = {};
    tries = {};
    // Los ids de cada actividad se repiten en la lección de atrás: closeSimulacro la vuelve a dibujar
    var pane = $('pane-prac');
    if (pane) pane.innerHTML = '';
    sim = { keys: keys, label: label, left: seconds, review: review, timer: null };
    var html = '<div class="sim-head"><h2>🧪 ' + e(label) + '</h2><span class="sim-clock" id="sim-clock"></span></div>';
    keys.forEach(function (k, i) {
      html += renderItem(itemOf(k), k, 'Pregunta ' + (i + 1) + ' de ' + keys.length, true);
    });
    html += '<div class="sim-end"><button type="button" class="run-btn" onclick="Practica.finishExam(false)">✅ Entregar</button>' +
      '<button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">Cancelar</button></div>';
    $('sim-box').innerHTML = html;
    $('sim-box').scrollTop = 0;
    openOverlay();
    if (seconds) {
      paintClock();
      sim.timer = setInterval(function () {
        sim.left--;
        paintClock();
        if (sim.left <= 0) finishExam(true);
      }, 1000);
    }
  }

  function paintClock() {
    var el = $('sim-clock');
    if (!el || !sim) return;
    var m = Math.floor(sim.left / 60);
    var s = sim.left % 60;
    el.textContent = '⏱ ' + m + ':' + (s < 10 ? '0' : '') + s;
    el.classList.toggle('late', sim.left <= 60);
  }

  function stopTimer() {
    if (sim && sim.timer) {
      clearInterval(sim.timer);
      sim.timer = null;
    }
  }

  function finishExam(timeUp) {
    if (!sim) return;
    stopTimer();
    var byLesson = {};
    var correct = 0;
    var keys = sim.keys;
    if (!timeUp) {
      var blank = keys.filter(function (k) { return readAnswer(itemOf(k), k) === null; }).length;
      if (blank && !confirm('Te faltan ' + blank + ' preguntas sin responder. ¿Entregás igual?')) {
        if (sim.left) {
          sim.timer = setInterval(function () {
            sim.left--;
            paintClock();
            if (sim.left <= 0) finishExam(true);
          }, 1000);
        }
        return;
      }
    }
    keys.forEach(function (k) {
      var it = itemOf(k);
      var ans = readAnswer(it, k);
      var good = ans !== null && grade(it, ans);
      var id = k.split('-')[0];
      byLesson[id] = byLesson[id] || { ok: 0, total: 0 };
      byLesson[id].total++;
      if (good) { correct++; byLesson[id].ok++; }
      saveScore(k, good ? 1 : 0);
      lock(k);
      if (good) feedback(k, 'good', '<strong>✅ Correcta.</strong> ' + it.why);
      else feedback(k, 'bad', '<strong>' + (ans === null ? '⬜ Sin responder.' : '❌ Incorrecta.') + ' Respuesta:</strong> ' + answerText(it) + '<div class="pr-why">' + it.why + '</div>');
    });
    var pct = Math.round(correct / keys.length * 100);
    var nota = Math.max(1, Math.round(correct / keys.length * 100) / 10);
    if (!sim.review) {
      state.sims.push({ fecha: new Date().toLocaleDateString('es-AR'), tramo: sim.label, nota: nota, pct: pct });
      state.sims = state.sims.slice(-20);
    }
    persist();
    var weak = Object.keys(byLesson).filter(function (id) { return byLesson[id].ok < byLesson[id].total; })
      .sort(function (a, b) { return byLesson[a].ok / byLesson[a].total - byLesson[b].ok / byLesson[b].total; });
    var summary = '<div class="sim-result ' + (nota >= PASS_NOTE ? 'pass' : 'fail') + '"><div class="sim-note">' + nota + ' <small>/ 10</small></div>' +
      '<div>' + (timeUp ? '⏱ Se terminó el tiempo. ' : '') + correct + ' de ' + keys.length + ' correctas (' + pct + '%). ' +
      (nota >= PASS_NOTE ? 'Aprobado.' : 'Todavía no alcanza: repasá las lecciones de abajo y volvé a intentarlo.') + '</div></div>';
    if (weak.length) {
      summary += '<div class="sim-review"><h4>📚 Qué repasar primero</h4><ul class="sim-weak">' + weak.slice(0, 6).map(function (id) {
        var inF2 = Number(id) >= 100;
        var list = inF2 ? LESSONS_F2 : LESSONS;
        var idx = list.findIndex(function (l) { return String(l.id) === id; });
        return '<li><button type="button" class="pr-link" onclick="Practica.goLesson(' + (inF2 ? 2 : 1) + ',' + idx + ')">' + e(list[idx].title) + '</button><span>' + byLesson[id].ok + ' de ' + byLesson[id].total + '</span></li>';
      }).join('') + '</ul></div>';
    }
    var box = $('sim-box');
    var end = box.querySelector('.sim-end');
    if (end) end.innerHTML = '<button type="button" class="run-btn" onclick="Practica.showPanel()">Volver a Evaluaciones</button><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">Cerrar</button>';
    var head = box.querySelector('.sim-head');
    head.insertAdjacentHTML('afterend', summary);
    box.scrollTop = 0;
    if (nota >= PASS_NOTE && typeof launchConfetti === 'function') launchConfetti();
  }

  function goLesson(faseId, idx) {
    closeSimulacro();
    if (typeof showFase === 'function') showFase(faseId);
    if (typeof goTo === 'function') goTo(idx);
  }

  function setState(next) {
    state = emptyState();
    if (next) {
      state.scores = next.scores || {};
      state.wrong = next.wrong || [];
      state.sims = next.sims || [];
    }
  }

  function getState() { return state; }

  function stats() {
    var total = 0;
    Object.keys(PRACTICA || {}).forEach(function (id) { total += (PRACTICA[id].items || []).length; });
    return { total: total, done: Object.keys(state.scores).length };
  }

  return {
    buildTab: buildTab,
    ladder: ladder,
    badge: badge,
    check: check,
    selfOk: selfOk,
    pick: pick,
    move: move,
    runReto: runReto,
    sendHttp: sendHttp,
    retoHint: retoHint,
    resetReto: resetReto,
    showSolution: showSolution,
    showPanel: showPanel,
    fromForm: fromForm,
    startSimulacro: startSimulacro,
    startReview: startReview,
    finishExam: finishExam,
    closeSimulacro: closeSimulacro,
    goLesson: goLesson,
    setState: setState,
    getState: getState,
    stats: stats,
    gradeShort: gradeShort,
    gradeFill: gradeFill,
    gradeCode: gradeCode,
    gradeOutput: gradeOutput
  };
})();
