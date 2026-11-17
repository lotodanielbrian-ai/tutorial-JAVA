// Java INPRO — Práctica: actividades por lección, simulacros y repaso espaciado.
// El contenido vive en practica-*.js. No afecta el certificado ni el ranking:
// mide dominio por separado para que nadie pierda el progreso que ya tiene.
var Practica = (function () {
  var MASTERY = 80;
  var PASS_NOTE = 6;
  var NIVEL_PCT = 80;
  var NIVEL_SIZE = 30;
  var MIN_WORDS = 5;
  var INTERVALS = [1, 3, 7, 14, 30];
  var DAILY_LIMIT = 15;
  var PONG_SIZE = 10;
  var PRACTICO_SIZE = 3;
  var PRACTICO_MIN = 15;
  var HELP_DAYS = 2;
  var NEVER = '9999-12-31';
  var LABELS = {
    http: '🔌 Laboratorio de API', mc: '🔘 Opción múltiple', tf: '⚖️ Verdadero o falso', fill: '✍️ Completar', bug: '🐞 Encontrar el error',
    output: '👀 ¿Qué imprime?', order: '🧩 Ordenar', match: '🔗 Unir', short: '💬 Respondé con tus palabras', code: '🏗️ Reto de código', step: '🛠️ En tu computadora'
  };
  // Minutos aproximados por actividad, para estimar la duración de una lección
  var MINUTES = { mc: 0.75, tf: 0.5, output: 1.5, fill: 1, bug: 1.5, order: 1.5, match: 1.5, short: 2, code: 6, http: 2, step: 10 };
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
  var PRACTICOS = {
    f1: { label: 'Parcial práctico · Fase 1', lessons: [13, 15, 17, 19, 22, 24, 27, 28] },
    f2: { label: 'Parcial práctico · Fase 2', lessons: [107, 110, 111, 112, 117, 123, 124] }
  };

  var state = emptyState();
  var tries = {};
  var picks = {};
  var orders = {};
  var solutionSeen = {};
  var sim = null;
  var showAll = false;
  var minutes = {};

  function emptyState() { return { scores: {}, wrong: [], sims: [], reviews: {}, help: {} }; }

  function e(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
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

  // ── Fechas ───────────────────────────────────────────────────────────
  function dayKey(d) {
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function today() { return dayKey(new Date()); }
  function addDays(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    return dayKey(d);
  }
  function fmtDay(key) {
    var p = key.split('-');
    return p[2] + '/' + p[1];
  }

  // ── Claves de actividad ──────────────────────────────────────────────
  // "14-2" es la actividad 2 de la lección 14; "x14" es el ejercicio de esa lección
  function isExerciseKey(key) { return String(key).charAt(0) === 'x'; }
  function lessonIdOf(key) { return Number(String(key).replace('x', '').split('-')[0]); }

  function dataFor(id) { return (typeof PRACTICA !== 'undefined' && PRACTICA[id]) || null; }

  function findLesson(id) {
    var list = id >= 100 ? LESSONS_F2 : LESSONS;
    return list.filter(function (l) { return l.id === id; })[0] || null;
  }

  function unhtml(s) {
    return s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  }

  // La última pista de cada ejercicio trae la solución
  function solutionOf(ex) {
    var blocks = ex.hints[ex.hints.length - 1].split('<div class="cblock-body">');
    if (blocks.length < 2) return '';
    return unhtml(blocks[blocks.length - 1].split('</div></div>')[0]);
  }

  function exerciseItem(id) {
    var l = findLesson(id);
    if (!l || !l.exercise || id === 31 || id === 33) return null;
    var ex = l.exercise;
    return {
      t: 'code', exId: id, title: l.title, task: ex.desc, starter: ex.starter, stdin: ex.stdin || [],
      expected: ex.expected.replace(/\\n/g, '\n'), hint: ex.hints[0], solution: solutionOf(ex), why: ''
    };
  }

  function itemOf(key) {
    if (isExerciseKey(key)) return exerciseItem(lessonIdOf(key));
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

  function gradeExercise(it, code) {
    var res = localValidate(it.exId, code);
    var bad = res.syntax || res.err || res.runtime || !res.simulated || res.conceptErr ||
      normalizeOutput(res.output) !== normalizeOutput(it.expected);
    return { passed: !bad, res: res };
  }

  function gradeCode(it, code) {
    if (it.exId) return gradeExercise(it, code);
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
      // Se compara el texto: dos filas pueden compartir la misma respuesta
      case 'match': return it.pairs.every(function (p, i) { return it.pairs[ans[i]][1] === p[1]; });
      case 'code': return gradeCode(it, ans).passed;
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
      case 'code': return '<pre class="pr-pre">' + e(it.solution) + '</pre>';
    }
    return '';
  }

  // Deja la estructura de la solución y borra lo que el alumno tiene que escribir
  function skeleton(code) {
    var lines = code.split('\n').map(function (ln) {
      var t = ln.trim();
      var pad = ln.match(/^\s*/)[0];
      if (!t || /^(import|package|class|interface|record|enum|abstract|@|\/\/)/.test(t) || /^[{}]/.test(t)) return ln;
      if (/^(if|for|while|else if|switch|catch)\b/.test(t) && /\{$/.test(t)) return pad + t.replace(/\(.*\)/, '(___)');
      if (/^(else|try|do)\b/.test(t) && /\{$/.test(t)) return ln;
      if (/^(public|private|protected|static)\b/.test(t) && /[{;]$/.test(t)) return ln;
      if (/^[\w<>\[\], ]+\([^;]*\)\s*\{$/.test(t)) return ln;
      if (/^case\b|^default\b/.test(t)) return pad + 'case ___:';
      return pad + '// ...';
    });
    return lines.filter(function (ln, i) { return !(i && ln === lines[i - 1] && /\/\/ \.\.\.$/.test(ln)); }).join('\n');
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
        var seen = {};
        var rights = shuffled(it.pairs.map(function (p, i) { return i; })).filter(function (r) {
          var text = it.pairs[r][1];
          if (seen[text]) return false;
          seen[text] = true;
          return true;
        });
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
      case 'step':
        return '<p class="pr-task">' + it.do + '</p>' +
          (it.cmd ? '<pre class="pr-pre">' + e(it.cmd) + '</pre>' : '') +
          '<div class="pr-step-ok"><strong>Tiene que pasar:</strong> ' + it.ok + '</div>' +
          (it.fail ? '<details class="pr-step-fail"><summary>Si no funciona</summary><p>' + it.fail + '</p></details>' : '');
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

  function statusChip(key, status) {
    var r = state.reviews[key];
    if (status === 'wait') return '<span class="pr-status wait">⏳ Vuelve el ' + fmtDay(r.due) + '</span>';
    if (status === 'due') return '<span class="pr-status due">🔁 Para repasar hoy</span>';
    if (status === 'solved') return '<span class="pr-status solved">✅ Resuelta' + (r && r.due !== NEVER ? ' · vuelve el ' + fmtDay(r.due) : '') + '</span>';
    return '';
  }

  function renderItem(it, key, label, exam, status) {
    var q = it.t === 'code' ? (it.title || 'Reto') : it.q;
    var waiting = status === 'wait';
    var action = '';
    if (waiting) {
      action = '';
    } else if (it.t === 'http') {
      action = '<button type="button" class="run-btn" onclick="Practica.sendHttp(\'' + key + '\')">▶ Enviar</button>';
    } else if (it.t === 'code') {
      action = '<button type="button" class="run-btn" onclick="Practica.runReto(\'' + key + '\')">▶ Ejecutar</button>' +
        (exam ? '' : '<button type="button" class="hint-btn" onclick="Practica.retoHint(\'' + key + '\')">💡 Pista</button>') +
        '<button type="button" class="hint-btn" onclick="Practica.resetReto(\'' + key + '\')">↺ Resetear</button>';
    } else if (it.t === 'step') {
      action = '<button type="button" class="pr-check" onclick="Practica.stepOk(\'' + key + '\')">✅ Lo comprobé</button>';
    } else if (!exam) {
      action = '<button type="button" class="pr-check" onclick="Practica.check(\'' + key + '\')">' + (it.t === 'short' ? 'Comparar' : 'Comprobar') + '</button>';
    }
    var body = bodyOf(it, key);
    var fb = waiting ? ' bad"' : '"';
    var fbHtml = waiting ? '<strong>📌 Respuesta:</strong> ' + answerText(it) + '<div class="pr-why">' + it.why + '</div>' : '';
    return '<article class="pr-item' + (status ? ' is-' + status : '') + '" id="pr-' + key + '">' +
      '<div class="pr-head"><span class="pr-chip">' + LABELS[it.t] + '</span>' + (status ? statusChip(key, status) : '') + '<span class="pr-num">' + label + '</span></div>' +
      '<div class="pr-q">' + q + '</div>' + (waiting ? '<fieldset class="pr-fs" disabled>' + body + '</fieldset>' : body) +
      (action ? '<div class="pr-actions">' + action + '</div>' : '') +
      '<div class="pr-fb' + fb + ' id="pr-fb-' + key + '" aria-live="polite">' + fbHtml + '</div></article>';
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
      case 'code':
        v = $('pr-in-' + key).value;
        return v === it.starter ? null : v;
    }
    return null;
  }

  function lock(key) {
    var card = $('pr-' + key);
    if (!card) return;
    card.classList.add('locked');
    var fields = card.querySelectorAll('input, textarea, select, .pr-opt, .pr-line, .pr-actions button, .pr-ord-btns button');
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
    if (it.t === 'short') { compareShort(key, it, ans); return; }
    tries[key] = (tries[key] || 0) + 1;
    // En el repaso vale el primer intento: es lo que mide si te acordás
    var attempts = sim && sim.review ? 1 : 2;
    if (grade(it, ans)) {
      var earned = tries[key] === 1 ? 1 : 0.5;
      saveScore(key, earned);
      lock(key);
      feedback(key, 'good', '<strong>✅ ' + (tries[key] === 1 ? '¡Bien!' : 'Ahora sí.') + '</strong> ' + it.why);
    } else if (tries[key] < attempts) {
      feedback(key, 'warn', '<strong>🤔 Todavía no.</strong> ' + (it.hint || 'Volvé a leerlo con calma y probá otra vez. Tenés un intento más.'));
    } else {
      saveScore(key, 0);
      lock(key);
      feedback(key, 'bad', '<strong>📌 Respuesta:</strong> ' + answerText(it) + '<div class="pr-why">' + it.why + '</div><div class="pr-why">Vuelve en tu repaso de mañana.</div>');
    }
    refreshHeader(lessonIdOf(key));
  }

  function rateButtons(key) {
    return '<div class="pr-rate">' +
      '<button type="button" class="pr-link" onclick="Practica.rate(\'' + key + '\',1)">Lo dije completo</button>' +
      '<button type="button" class="pr-link" onclick="Practica.rate(\'' + key + '\',0.5)">Me faltó una parte</button>' +
      '<button type="button" class="pr-link" onclick="Practica.rate(\'' + key + '\',0)">No lo sabía</button></div>';
  }

  // Las palabras clave no leen matices: en una respuesta abierta decide quien responde
  function compareShort(key, it, text) {
    if (text.trim().split(/\s+/).length < MIN_WORDS) {
      feedback(key, 'warn', 'Escribí una frase completa: explicarlo es lo que lo fija.');
      return;
    }
    lock(key);
    var clue = gradeShort(it, text) ? '' : '<div class="pr-why">🔎 No encontré una de las ideas clave en tu respuesta. Comparala con calma.</div>';
    feedback(key, 'warn', '<strong>Comparala con esta respuesta:</strong> ' + it.model + clue + '<div class="pr-why">¿Tu respuesta decía lo mismo, con tus palabras?</div>' + rateButtons(key));
  }

  function rate(key, value) {
    var it = itemOf(key);
    saveScore(key, value);
    feedback(key, value >= 1 ? 'good' : 'bad', '<strong>' + (value >= 1 ? '✅ Anotado.' : '📌 Vuelve en tu repaso de mañana.') + '</strong> ' + it.why);
    refreshHeader(lessonIdOf(key));
  }

  function stepOk(key) {
    var it = itemOf(key);
    state.scores[key] = 1;
    persist();
    lock(key);
    feedback(key, 'good', '<strong>✅ Comprobado.</strong> ' + it.why);
    refreshHeader(lessonIdOf(key));
    if (typeof buildSidebar === 'function' && !sim) buildSidebar();
  }

  // ── Repaso espaciado ─────────────────────────────────────────────────
  // Acertar aleja la próxima vuelta y fallar la trae mañana. Repetir antes de
  // la fecha no suma: la memoria se fortalece cuando ya empezaba a olvidarse.
  function schedule(key, good) {
    var r = state.reviews[key];
    var at = Date.now();
    if (isExerciseKey(key)) {
      state.reviews[key] = { box: good ? 1 : 0, due: good ? NEVER : addDays(HELP_DAYS), at: at };
      return;
    }
    if (!good) {
      state.reviews[key] = { box: 0, due: addDays(1), at: at };
      return;
    }
    if (r && r.box > 0 && r.due > today()) return;
    var box = Math.min((r ? r.box : 0) + 1, INTERVALS.length);
    state.reviews[key] = { box: box, due: addDays(INTERVALS[box - 1]), at: at };
  }

  function statusOf(key) {
    var r = state.reviews[key];
    var s = state.scores[key];
    if (r && r.box === 0 && r.due > today()) return 'wait';
    if (r && r.due <= today()) return 'due';
    if (s !== undefined && s >= 1) return 'solved';
    if (s !== undefined) return 'due';
    return 'new';
  }

  function dueKeys() {
    var now = today();
    var dated = Object.keys(state.reviews).filter(function (k) { return state.reviews[k].due <= now; });
    var undated = state.wrong.filter(function (k) { return !state.reviews[k]; });
    return dated.concat(undated).filter(function (k) {
      var it = itemOf(k);
      return it && it.t !== 'step';
    });
  }

  function nextDue() {
    var now = today();
    return Object.keys(state.reviews).map(function (k) { return state.reviews[k].due; })
      .filter(function (d) { return d > now && d !== NEVER; }).sort()[0] || '';
  }

  function noteHelp(id) {
    state.help[id] = today();
    if (exerciseItem(id)) state.reviews['x' + id] = { box: 0, due: addDays(HELP_DAYS), at: Date.now() };
    persist();
  }

  function saveScore(key, value) {
    var prev = state.scores[key];
    if (prev === undefined || value > prev) state.scores[key] = value;
    schedule(key, value >= 1);
    var at = state.wrong.indexOf(key);
    if (value >= 1 && at !== -1) state.wrong.splice(at, 1);
    if (value < 1 && at === -1) state.wrong.push(key);
    if (sim) sim.results[key] = value;
    persist();
    if (typeof buildSidebar === 'function' && !sim) buildSidebar();
  }

  function persist() {
    if (typeof Progress !== 'undefined' && Progress.savePractice) Progress.savePractice(state);
  }

  // ── Retos de código ──────────────────────────────────────────────────
  function retoMessage(res) {
    if (res.syntax) {
      return '<strong>Línea ' + res.line + ':</strong> <code>' + e(res.javac) + '</code><div class="pr-why">' + e(res.why) + '</div>' + (res.suggest ? '<pre class="pr-pre">' + e(res.suggest) + '</pre>' : '');
    }
    if (res.err) return e(res.err);
    if (res.runtime) return (res.output ? '<pre class="pr-pre">' + e(res.output) + '</pre>' : '') + '<pre class="pr-pre pr-err">' + e(res.runtime) + '</pre>';
    if (res.conceptErr) return 'La consola coincide, pero falta algo: ' + e(res.conceptErr);
    return 'La consola no coincide con el output esperado.<pre class="pr-pre">' + e(res.output || '(no imprimió nada)') + '</pre>';
  }

  function runReto(key) {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var it = itemOf(key);
    var result = gradeCode(it, $('pr-in-' + key).value);
    var res = result.res;
    // En un examen se puede ejecutar, pero la nota se pone al entregar
    if (sim && !sim.review) {
      feedback(key, result.passed ? 'good' : 'warn', result.passed ? '<strong>La consola coincide.</strong><pre class="pr-pre">' + e(res.output) + '</pre>' : retoMessage(res));
      return;
    }
    tries[key] = (tries[key] || 0) + 1;
    if (result.passed) {
      saveScore(key, solutionSeen[key] ? 0.5 : 1);
      feedback(key, 'good', '<strong>✅ Correcto.</strong><pre class="pr-pre">' + e(res.output) + '</pre>' + (it.why ? '<div class="pr-why">' + it.why + '</div>' : ''));
      if (typeof launchConfetti === 'function') launchConfetti();
      refreshHeader(lessonIdOf(key));
      return;
    }
    var msg = retoMessage(res);
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
      refreshHeader(lessonIdOf(key));
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
    saveScore(key, 0);
    feedback(key, 'warn', '<strong>Una solución posible.</strong> Leela, cerrala y escribila de memoria: así se aprende.<pre class="pr-pre">' + e(itemOf(key).solution) + '</pre>');
  }

  // ── Pestaña de la lección ────────────────────────────────────────────
  // Lo que fallaste no cuenta completo hasta que lo recuerdes en un repaso
  function mastery(id) {
    var p = dataFor(id);
    if (!p || !p.items || !p.items.length) return { pct: 0, done: 0, total: 0 };
    var sum = 0, doneCount = 0;
    p.items.forEach(function (_, i) {
      var key = id + '-' + i;
      var s = state.scores[key];
      var r = state.reviews[key];
      if (s !== undefined) {
        sum += r && r.box === 0 ? Math.min(s, 0.5) : s;
        doneCount++;
      }
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
    var statuses = items.map(function (_, i) { return statusOf(l.id + '-' + i); });
    var pending = statuses.filter(function (s) { return s === 'new' || s === 'due'; }).length;
    if (items.length) {
      html += '<p class="pr-how">Tenés <strong>dos intentos</strong> por actividad. Lo que falles vuelve en tu <strong>repaso</strong>, y lo que aciertes vuelve más adelante para que no se olvide.</p>';
    }
    if (pending < items.length) {
      html += '<label class="pr-filter"><input type="checkbox" onchange="Practica.toggleAll(this.checked)"' + (showAll ? ' checked' : '') + '> Mostrar también las ' + (items.length - pending) + ' resueltas o en espera</label>';
    }
    if (items.length && !pending) html += '<p class="pr-how">✅ No te queda nada pendiente en esta lección.</p>';
    html += '<div id="pr-list" class="pr-list' + (showAll ? '' : ' only-pending') + '">';
    items.forEach(function (it, i) {
      html += renderItem(it, l.id + '-' + i, (i + 1) + ' de ' + items.length, false, statuses[i]);
    });
    return html + '</div>';
  }

  function toggleAll(on) {
    showAll = on;
    var list = $('pr-list');
    if (list) list.classList.toggle('only-pending', !on);
  }

  function refreshTab() {
    var pane = $('pane-prac');
    if (pane && typeof lessonList === 'function') pane.innerHTML = buildTab(lessonList()[cur]);
  }

  function ladder(l) {
    var p = dataFor(l.id);
    if (!p || !p.escalera) return '';
    var before = p.antes && typeof f2Mini === 'function' ? f2Mini(p.antes[0], p.antes[1]) : '';
    return before + '<div class="pr-ladder"><h4>🪜 De la vida diaria al código</h4><ol>' + LADDER.map(function (s) {
      return '<li><span class="pr-step"><span aria-hidden="true">' + s[1] + '</span> ' + s[2] + '</span><span class="pr-step-txt">' + p.escalera[s[0]] + '</span></li>';
    }).join('') + '</ol></div>';
  }

  function badge(id) {
    var m = mastery(id);
    return m.total && m.pct >= MASTERY ? '<span class="l-mastery" title="Dominio alcanzado">🧠</span>' : '';
  }

  function estimate(l) {
    if (minutes[l.id]) return minutes[l.id];
    var p = dataFor(l.id);
    var reading = (l.simple() + l.tutorial()).replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length / 170;
    var practice = ((p && p.items) || []).reduce(function (sum, it) { return sum + (MINUTES[it.t] || 1); }, 0);
    var task = l.quiz ? l.quiz.questions.length : 10;
    minutes[l.id] = Math.max(5, Math.round((reading + practice + task) / 5) * 5);
    return minutes[l.id];
  }

  // ── Mapa de dominio ──────────────────────────────────────────────────
  function mapRows(list) {
    var order = [];
    var groups = {};
    list.forEach(function (l) {
      var m = mastery(l.id);
      if (!m.total) return;
      if (!groups[l.level]) {
        groups[l.level] = { label: l.levelLabel, sum: 0, count: 0, weak: null, weakPct: 101 };
        order.push(l.level);
      }
      var g = groups[l.level];
      g.sum += m.pct;
      g.count++;
      if (m.pct < g.weakPct) { g.weak = l; g.weakPct = m.pct; }
    });
    return order.map(function (k) {
      var g = groups[k];
      var pct = Math.round(g.sum / g.count);
      var faseId = list === LESSONS_F2 ? 2 : 1;
      return '<li><span>' + e(g.label) + '</span><div class="pr-bar"><div class="pr-bar-fill" style="width:' + pct + '%"></div></div><strong>' + pct + '%</strong>' +
        // Sin empezar no hay nada que reforzar: el enlace aparece cuando hay algo flojo
        (pct > 0 && g.weakPct < MASTERY ? '<button type="button" class="pr-link" onclick="Practica.goLesson(' + faseId + ',' + list.indexOf(g.weak) + ')">Reforzar: ' + e(g.weak.title) + '</button>' : '') + '</li>';
    }).join('');
  }

  function mapHtml(unlocked) {
    return '<div class="sim-review"><h4>🗺️ Tu mapa de dominio</h4><ul class="pr-map">' + mapRows(LESSONS) + (unlocked ? mapRows(LESSONS_F2) : '') + '</ul></div>';
  }

  // ── Simulacro y repaso ───────────────────────────────────────────────
  function lessonsFor(tramo) { return TRAMOS[tramo].fase2 ? LESSONS_F2 : LESSONS; }

  // Las respuestas abiertas se ensayan en el ping-pong: una nota automática no las mide bien
  function examable(it) { return it.t !== 'code' && it.t !== 'http' && it.t !== 'step' && it.t !== 'short'; }

  function poolFor(tramo) {
    var levels = TRAMOS[tramo].levels;
    var out = [];
    lessonsFor(tramo).forEach(function (l) {
      if (levels.indexOf(l.level) === -1) return;
      var p = dataFor(l.id);
      if (!p || !p.items) return;
      p.items.forEach(function (it, i) {
        if (examable(it)) out.push(l.id + '-' + i);
      });
    });
    return out;
  }

  // Reparte por lección para que el simulacro no se concentre en un solo tema
  function balanced(keys, count) {
    var byLesson = {};
    shuffled(keys).forEach(function (k) {
      var id = lessonIdOf(k);
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
    var ran = !!sim;
    stopTimer();
    sim = null;
    var box = $('sim-overlay');
    if (box) box.classList.remove('show');
    // Solo el examen vació la pestaña: la lección de atrás, con su editor, queda como estaba
    if (ran) {
      refreshTab();
      if (typeof buildSidebar === 'function') buildSidebar();
    }
  }

  function todayHtml() {
    var due = dueKeys().length;
    var html = '<div class="sim-review sim-today"><h4>📅 Hoy</h4>';
    if (due) {
      var count = Math.min(due, DAILY_LIMIT);
      html += '<p>Tenés <strong>' + due + '</strong> para repasar. Una tanda de ' + count + ' lleva unos ' + Math.max(2, Math.round(count * 1.25)) + ' minutos. Volver cuando ya empezaba a olvidarse es lo que más fija lo aprendido.</p>' +
        '<button type="button" class="run-btn" onclick="Practica.startReview()">🔁 Repasar ahora</button>';
    } else {
      var next = nextDue();
      html += '<p>No tenés repasos pendientes. ' + (next ? 'El próximo es el <strong>' + fmtDay(next) + '</strong>.' : 'Lo que respondas en la Práctica va a volver acá en el momento justo.') + '</p>';
    }
    return html + '</div>';
  }

  function showPanel() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var unlocked = typeof fase2Unlocked === 'function' && fase2Unlocked();
    var last = state.sims.slice(-5).reverse();
    var html = '<div class="sim-head"><h2>🧪 Evaluaciones</h2><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">✕ Cerrar</button></div>' +
      todayHtml() + mapHtml(unlocked) +
      '<div class="sim-review"><h4>📝 Simulacro</h4><p class="sim-lead">Mezcla actividades al azar y no da pistas hasta el final, como un examen. Sirve para saber qué sabés de verdad.</p>' +
      '<div class="sim-form">' +
      '<label>Tramo<select id="sim-tramo">' + Object.keys(TRAMOS).filter(function (k) { return !TRAMOS[k].fase2 || unlocked; }).map(function (k) { return '<option value="' + k + '">' + TRAMOS[k].label + '</option>'; }).join('') + '</select></label>' +
      '<label>Preguntas<select id="sim-count"><option value="10">10</option><option value="20" selected>20</option><option value="30">30</option></select></label>' +
      '<label class="sim-check"><input type="checkbox" id="sim-timer"> Con tiempo (90 segundos por pregunta)</label>' +
      '</div><button type="button" class="run-btn" onclick="Practica.fromForm()">Empezar simulacro</button></div>' +
      '<div class="sim-review"><h4>🏗️ Parcial práctico</h4><p class="sim-lead">' + PRACTICO_SIZE + ' ejercicios de código con reloj (' + PRACTICO_MIN + ' minutos cada uno). Podés ejecutar todo lo que quieras, pero no hay pistas y la nota se pone al entregar.</p>' +
      '<div class="sim-btns"><button type="button" class="hint-btn" onclick="Practica.startPractico(\'f1\')">Fase 1</button>' +
      (unlocked ? '<button type="button" class="hint-btn" onclick="Practica.startPractico(\'f2\')">Fase 2</button>' : '') + '</div></div>' +
      '<div class="sim-review"><h4>🎤 Ping-pong oral</h4><p class="sim-lead">Preguntas de a una, para responder en voz alta como en el coloquio. Después comparás con los puntos clave y te evaluás.</p>' +
      '<div class="sim-btns"><button type="button" class="hint-btn" onclick="Practica.startPingPong(1)">Fase 1</button>' +
      (unlocked ? '<button type="button" class="hint-btn" onclick="Practica.startPingPong(2)">Fase 2</button>' : '') + '</div></div>';
    if (!unlocked) {
      html += '<div class="sim-review"><h4>🎯 Prueba de nivel</h4><p class="sim-lead">' + NIVEL_SIZE + ' preguntas de toda la Fase 1. Con ' + NIVEL_PCT + '% o más se abre la Fase 2. Sirve si ya venís con esos temas: no cambia tu primer certificado ni el ranking.</p>' +
        '<button type="button" class="hint-btn" onclick="Practica.startNivel()">Rendir la prueba</button></div>';
    }
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

  function startPractico(name) {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var p = PRACTICOS[name];
    var keys = shuffled(p.lessons).slice(0, PRACTICO_SIZE).map(function (id) { return 'x' + id; });
    beginExam(keys, p.label, keys.length * PRACTICO_MIN * 60, false);
  }

  function startNivel() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    beginExam(balanced(poolFor('todo'), NIVEL_SIZE), 'Prueba de nivel', 0, false);
    sim.nivel = true;
  }

  function startReview() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var keys = balanced(dueKeys(), DAILY_LIMIT);
    if (!keys.length) return;
    beginExam(keys, 'Repaso de hoy', 0, true);
  }

  function beginExam(keys, label, seconds, review) {
    picks = {};
    tries = {};
    solutionSeen = {};
    // Los ids de cada actividad se repiten en la lección de atrás: closeSimulacro la vuelve a dibujar
    var pane = $('pane-prac');
    if (pane) pane.innerHTML = '';
    sim = { keys: keys, label: label, left: seconds, review: review, timer: null, results: {} };
    var html = '<div class="sim-head"><h2>' + (review ? '🔁 ' : '🧪 ') + e(label) + '</h2><span class="sim-clock" id="sim-clock"></span></div>';
    keys.forEach(function (k, i) {
      html += renderItem(itemOf(k), k, (review ? 'Actividad ' : 'Pregunta ') + (i + 1) + ' de ' + keys.length, !review);
    });
    html += '<div class="sim-end">' + (review
      ? '<button type="button" class="run-btn" onclick="Practica.finishReview()">✅ Terminar el repaso</button>'
      : '<button type="button" class="run-btn" onclick="Practica.finishExam(false)">✅ Entregar</button><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">Cancelar</button>') + '</div>';
    $('sim-box').innerHTML = html;
    $('sim-box').scrollTop = 0;
    openOverlay();
    if (seconds) {
      paintClock();
      startClock();
    }
  }

  function startClock() {
    sim.timer = setInterval(function () {
      sim.left--;
      paintClock();
      if (sim.left <= 0) finishExam(true);
    }, 1000);
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

  function finishReview() {
    if (!sim) return;
    var keys = Object.keys(sim.results);
    var good = keys.filter(function (k) { return sim.results[k] >= 1; }).length;
    var skipped = sim.keys.length - keys.length;
    var box = $('sim-box');
    box.innerHTML = '<div class="sim-head"><h2>🔁 Repaso terminado</h2></div>' +
      '<div class="sim-result pass"><div class="sim-note">' + good + ' <small>/ ' + keys.length + '</small></div><div>' +
      (keys.length - good ? (keys.length - good) + ' vuelven mañana. ' : '¡Todas firmes! ') + (skipped ? skipped + ' siguen pendientes.' : '') + '</div></div>' +
      '<div class="sim-end"><button type="button" class="run-btn" onclick="Practica.showPanel()">Volver a Evaluaciones</button><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">Cerrar</button></div>';
    box.scrollTop = 0;
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
        if (sim.left) startClock();
        return;
      }
    }
    keys.forEach(function (k) {
      var it = itemOf(k);
      var ans = readAnswer(it, k);
      var good = ans !== null && grade(it, ans);
      var id = lessonIdOf(k);
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
    state.sims.push({ fecha: new Date().toLocaleDateString('es-AR'), tramo: sim.label, nota: nota, pct: pct });
    state.sims = state.sims.slice(-20);
    persist();
    var verdict = nota >= PASS_NOTE ? 'Aprobado.' : 'Todavía no alcanza: repasá las lecciones de abajo y volvé a intentarlo.';
    if (sim.nivel) {
      var passed = pct >= NIVEL_PCT;
      if (passed && typeof accreditFase2 === 'function') accreditFase2();
      verdict = passed ? '🔓 Se abrió la Fase 2.' : 'Para abrir la Fase 2 hace falta ' + NIVEL_PCT + '%. Empezá por las lecciones de abajo.';
    }
    var weak = Object.keys(byLesson).filter(function (id) { return byLesson[id].ok < byLesson[id].total; })
      .sort(function (a, b) { return byLesson[a].ok / byLesson[a].total - byLesson[b].ok / byLesson[b].total; });
    var summary = '<div class="sim-result ' + (nota >= PASS_NOTE ? 'pass' : 'fail') + '"><div class="sim-note">' + nota + ' <small>/ 10</small></div>' +
      '<div>' + (timeUp ? '⏱ Se terminó el tiempo. ' : '') + correct + ' de ' + keys.length + ' correctas (' + pct + '%). ' + verdict + '</div></div>';
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

  // ── Ping-pong oral ───────────────────────────────────────────────────
  function pongPool(faseId) {
    var out = [];
    Object.keys(PRACTICA).forEach(function (id) {
      if ((Number(id) >= 100) !== (faseId === 2)) return;
      (PRACTICA[id].items || []).forEach(function (it, i) {
        if (it.t === 'short') out.push(id + '-' + i);
      });
    });
    return out;
  }

  function startPingPong(faseId) {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var pool = pongPool(faseId);
    // Primero lo que toca repasar; después, el resto al azar
    var due = shuffled(dueKeys().filter(function (k) { return pool.indexOf(k) !== -1; }));
    var rest = shuffled(pool.filter(function (k) { return due.indexOf(k) === -1; }));
    sim = { pong: true, keys: due.concat(rest).slice(0, PONG_SIZE), at: 0, results: {}, timer: null, left: 0, review: true };
    paintPong();
    openOverlay();
  }

  function paintPong() {
    var key = sim.keys[sim.at];
    var it = itemOf(key);
    var l = findLesson(lessonIdOf(key));
    $('sim-box').innerHTML = '<div class="sim-head"><h2>🎤 Ping-pong oral</h2><span class="pr-num">' + (sim.at + 1) + ' de ' + sim.keys.length + '</span></div>' +
      '<p class="sim-lead">' + e(l.title) + '</p><div class="pr-item"><div class="pr-q">' + it.q + '</div>' +
      '<p class="pr-how">Respondé en voz alta: qué es, para qué sirve y un ejemplo tuyo.</p><div id="pong-answer"></div>' +
      '<div class="pr-actions" id="pong-actions"><button type="button" class="run-btn" onclick="Practica.pongReveal()">Ver los puntos clave</button></div></div>' +
      '<div class="sim-end"><button type="button" class="hint-btn" onclick="Practica.closeSimulacro()">Terminar</button></div>';
    $('sim-box').scrollTop = 0;
  }

  function pongReveal() {
    var it = itemOf(sim.keys[sim.at]);
    $('pong-answer').innerHTML = '<div class="pr-fb warn"><strong>Puntos clave:</strong> ' + it.model + '<div class="pr-why">' + it.why + '</div></div>';
    $('pong-actions').innerHTML = '<button type="button" class="pr-check" onclick="Practica.pongRate(1)">Lo dije completo</button>' +
      '<button type="button" class="hint-btn" onclick="Practica.pongRate(0.5)">Me faltó una parte</button>' +
      '<button type="button" class="hint-btn" onclick="Practica.pongRate(0)">No lo sabía</button>';
  }

  function pongRate(value) {
    saveScore(sim.keys[sim.at], value);
    sim.at++;
    if (sim.at < sim.keys.length) paintPong();
    else finishReview();
  }

  function goLesson(faseId, idx) {
    closeSimulacro();
    if (typeof showFase === 'function') showFase(faseId);
    if (typeof goTo === 'function') goTo(idx);
  }

  // Quien ya venía practicando no tiene fechas: lo acertado se reparte en dos semanas
  function seedReviews() {
    var now = today();
    Object.keys(state.scores).forEach(function (k, i) {
      if (state.reviews[k] || isExerciseKey(k)) return;
      var it = itemOf(k);
      if (!it || it.t === 'step') return;
      state.reviews[k] = state.scores[k] >= 1 ? { box: 1, due: addDays(1 + i % 14), at: 0 } : { box: 0, due: now, at: 0 };
    });
  }

  function setState(next) {
    state = emptyState();
    if (next) {
      state.scores = next.scores || {};
      state.wrong = next.wrong || [];
      state.sims = next.sims || [];
      state.reviews = next.reviews || {};
      state.help = next.help || {};
      seedReviews();
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
    estimate: estimate,
    check: check,
    rate: rate,
    stepOk: stepOk,
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
    startPractico: startPractico,
    startNivel: startNivel,
    startReview: startReview,
    startPingPong: startPingPong,
    pongReveal: pongReveal,
    pongRate: pongRate,
    finishExam: finishExam,
    finishReview: finishReview,
    closeSimulacro: closeSimulacro,
    goLesson: goLesson,
    toggleAll: toggleAll,
    noteHelp: noteHelp,
    dueCount: function () { return dueKeys().length; },
    setState: setState,
    getState: getState,
    stats: stats,
    gradeShort: gradeShort,
    gradeFill: gradeFill,
    gradeCode: gradeCode,
    gradeOutput: gradeOutput,
    grade: grade,
    itemOf: itemOf,
    saveScore: saveScore,
    statusOf: statusOf,
    dueKeys: dueKeys,
    mastery: mastery,
    skeleton: skeleton,
    solutionText: solutionOf,
    poolFor: poolFor,
    INTERVALS: INTERVALS
  };
})();
