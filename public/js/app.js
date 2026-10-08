// Java INPRO — App core (render, editor, quiz, certificate)
// Progress is per Firebase uid (see Progress.*). Never use global localStorage keys.

function generateCert() {
  const name = document.getElementById('cert-name').value.trim() || 'Estudiante Java';
  document.getElementById('cert-name-display').textContent = name;
  const stored = (typeof Progress !== 'undefined' && Progress.getCompletionDate)
    ? Progress.getCompletionDate()
    : null;
  const d = stored ? new Date(stored) : new Date();
  const fechaStr = d.toLocaleDateString('es-AR');
  document.getElementById('cert-date').textContent = fechaStr;
  var previewEl = document.getElementById('cert-date-preview');
  if (previewEl) previewEl.innerText = 'Fecha de finalización: ' + fechaStr;
  document.getElementById('grad-overlay').classList.remove('show');
  document.getElementById('cert-print').classList.add('show-cert');
  var ps = document.createElement('style');
  ps.textContent = '@page { size: 320mm 180mm; margin: 0mm; }';
  document.head.appendChild(ps);
  setTimeout(function() { window.print(); }, 800);
  setTimeout(function() { document.getElementById('cert-print').classList.remove('show-cert'); ps.remove(); }, 1500);
}

function resetGlobalProgress() {
  if (confirm("¿Estás seguro de que querés borrar todo tu progreso? Esto reiniciará todas las lecciones.")) {
    done = new Set();
    quizBestScores = {};
    cur = 0;
    if (typeof Progress !== 'undefined' && Progress.resetRemote) {
      Progress.resetRemote().finally(function() { location.reload(); });
    } else {
      location.reload();
    }
  }
}

function clearSessionProgress() {
  done = new Set();
  quizBestScores = {};
  cur = 0;
  hintLevel = 0;
  if (typeof _quizAnswers !== 'undefined') _quizAnswers = {};
}

// ── State (empty until login loads this user's data) ───────────────────
let cur = 0;
let done = new Set();
var quizBestScores = {}; // lessonId -> best percent (0-100)
let hintLevel = 0;
var editorErrorLine = 0;

function saveDone() {
  if (typeof Progress === 'undefined' || !Progress.activeUid || !Progress.activeUid()) return;
  Progress.saveLocalCache(Progress.activeUid(), [...done], quizBestScores);
  if (Progress.syncProgress) {
    Progress.syncProgress([...done], cur, done.size === LESSONS.length);
  }
}

// ── Search ─────────────────────────────────────────────────────────────
function filterLessons(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.lb').forEach(btn => {
    if (!q) { btn.classList.remove('hidden'); return; }
    const text = btn.textContent.toLowerCase();
    btn.classList.toggle('hidden', !text.includes(q));
  });
}

// ── Sidebar ────────────────────────────────────────────────────────────
function buildSidebar() {
  const groups = { super: [], basico: [], inter: [], avanzado: [], examen: [] };
  LESSONS.forEach(l => {
    if (groups[l.level]) groups[l.level].push(l);
  });
  const labels = { super: '🌱 Super Básico', basico: '📘 Básico', inter: '🚀 Intermedio', avanzado: '🔧 Avanzado', examen: '🎓 Exámenes Finales' };
  let html = '';
  for (const [key, lessons] of Object.entries(groups)) {
    html += `<div class="lv-group"><div class="lv-label">${labels[key]}</div>`;
    lessons.forEach(l => {
      const isDone = done.has(l.id);
      const isActive = l.id === LESSONS[cur].id;
      html += `<button class="lb${isActive?' active':''}${isDone?' done':''}" onclick="goTo(${LESSONS.indexOf(l)})">
        <span class="l-num">${String(l.id).padStart(2,'0')}</span>
        <div class="l-dot"></div>
        <span style="flex:1">${l.title}</span>
        <span class="l-stars">${l.stars}</span>
      </button>`;
    });
    html += '</div>';
  }
  document.getElementById('sb-list').innerHTML = html;
  const pct = Math.round(done.size / LESSONS.length * 100);
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-lbl').textContent = `${done.size} de ${LESSONS.length} completados · ${pct}%`;
  var certBtn = document.getElementById('cert-btn');
  if (certBtn) certBtn.style.display = done.size === LESSONS.length ? 'inline-flex' : 'none';
}

// ── Main render ────────────────────────────────────────────────────────
function render() {
  const l = LESSONS[cur];
  const badgeClass = { super:'badge-super', basico:'badge-basico', inter:'badge-inter', avanzado:'badge-avanzado', examen:'badge-examen' }[l.level];
  const exBtnLabel = l.quiz ? '📝 Cuestionario' : '💻 Ejercicio';
  const exPaneHtml = l.quiz ? buildQuiz(l) : buildExercise(l);
  document.getElementById('main').innerHTML = `
    <div class="lh-header">
      <div class="lv-badge ${badgeClass}">${l.levelLabel}</div>
      <div class="lh-title">${l.title}</div>
      <div class="lh-desc">${l.desc}</div>
      <div class="lh-stars">Dificultad: ${l.stars}</div>
    </div>
    <div class="tabs">
      <button type="button" class="tab-btn active" id="tab-simple" onclick="switchTab('simple')">🏠 Explicación Simple</button>
      <button type="button" class="tab-btn" id="tab-tut" onclick="switchTab('tut')">📖 Tutorial Técnico</button>
      <button type="button" class="tab-btn" id="tab-ex" onclick="switchTab('ex')">${exBtnLabel}</button>
    </div>
    <div class="tab-pane active" id="pane-simple">${l.simple()}</div>
    <div class="tab-pane" id="pane-tut">${l.tutorial()}</div>
    <div class="tab-pane" id="pane-ex">${exPaneHtml}</div>
    <div class="nav-row">
      <button type="button" class="nav-btn-lesson" onclick="goTo(cur-1)" ${cur===0?'disabled':''}>← Anterior</button>
      <button type="button" class="nav-btn-lesson" onclick="goTo(cur+1)" ${cur===LESSONS.length-1?'disabled':''}>Siguiente →</button>
    </div>
  `;
  buildSidebar();
  window.scrollTo({top:0, behavior:'smooth'});
  editorErrorLine = 0;
  const ed = document.getElementById('code-editor');
  if (ed) {
    ed.addEventListener('keydown', handleEditorKeydown);
    ed.addEventListener('input', onEditorInput);
    ed.addEventListener('keyup', onEditorCaretMove);
    ed.addEventListener('click', onEditorCaretMove);
    ed.addEventListener('scroll', onEditorScroll);
    updateLineNumbers();
  }
  closeSuggest();
  if (done.size === LESSONS.length && typeof Progress !== 'undefined' && !Progress.wasCertShown()) {
    Progress.markCertShown();
    setTimeout(function() { document.getElementById('grad-overlay').classList.add('show'); }, 600);
  }
}

function showCertOverlay() {
  var nameInput = document.getElementById('cert-name');
  if (nameInput && !nameInput.value && typeof AuthUI !== 'undefined' && AuthUI.user && AuthUI.user()) {
    nameInput.value = AuthUI.user().displayName || '';
  }
  document.getElementById('grad-overlay').classList.add('show');
}

function showManual() {
  document.getElementById('manual-overlay').classList.toggle('show');
}

function printManual() {
  var ps = document.createElement('style');
  ps.textContent = '@page { size: A4; margin: 1.5cm; }';
  document.head.appendChild(ps);
  window.print();
  setTimeout(function() { ps.remove(); }, 500);
}

function switchTab(t) {
  ['simple','tut','ex'].forEach(tab => {
    const btn = document.getElementById('tab-' + tab);
    const pane = document.getElementById('pane-' + tab);
    if (btn) btn.classList.toggle('active', t === tab);
    if (pane) pane.classList.toggle('active', t === tab);
  });
  if (t === 'ex') {
    setTimeout(() => { updateLineNumbers(); }, 50);
  }
}

function goTo(idx) {
  if (idx < 0 || idx >= LESSONS.length) return;
  cur = idx;
  hintLevel = 0;
  render();
  var sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('open');
  var overlay = document.querySelector('.sidebar-overlay');
  if (overlay) overlay.classList.remove('show');
}

function toggleSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show');
}

function handleEditorKeydown(e) {
  if (suggestOpen()) {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveSuggest(1); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); moveSuggest(-1); return; }
    if (e.key === 'Enter' || e.key === 'Tab') { e.preventDefault(); acceptSuggest(); return; }
    if (e.key === 'Escape') { e.preventDefault(); closeSuggest(); return; }
  }
  if (e.key === 'Tab') {
    e.preventDefault();
    const s = this.selectionStart, en = this.selectionEnd;
    this.value = this.value.substring(0, s) + '    ' + this.value.substring(en);
    this.selectionStart = this.selectionEnd = s + 4;
    updateLineNumbers();
    closeSuggest();
  }
}

function onEditorInput() {
  updateLineNumbers();
  refreshSuggest();
}

function onEditorCaretMove(e) {
  if (!suggestOpen()) return;
  if (e && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape')) return;
  refreshSuggest();
}

function onEditorScroll() {
  syncScroll();
  if (suggestOpen()) positionSuggest();
  positionErrorBar();
}

// ── Line Numbers ───────────────────────────────────────────────────────
function updateLineNumbers() {
  const ed = document.getElementById('code-editor');
  const ln = document.getElementById('line-numbers');
  if (!ed || !ln) return;
  const lines = ed.value.split('\n').length;
  ln.innerHTML = Array.from({length: lines}, (_, i) => `<div class="${editorErrorLine === i + 1 ? 'ln-err' : ''}">${i + 1}</div>`).join('');
  positionErrorBar();
}

function highlightErrorLine(line) {
  editorErrorLine = line || 0;
  updateLineNumbers();
  var ed = document.getElementById('code-editor');
  if (!ed || !editorErrorLine) return;
  var style = window.getComputedStyle(ed);
  var lh = parseFloat(style.lineHeight) || 23;
  var pad = parseFloat(style.paddingTop) || 0;
  var target = pad + (editorErrorLine - 1) * lh;
  if (target < ed.scrollTop || target > ed.scrollTop + ed.clientHeight - lh) {
    ed.scrollTop = Math.max(0, target - ed.clientHeight / 3);
  }
  positionErrorBar();
}

function clearErrorLine() {
  editorErrorLine = 0;
  var bar = document.getElementById('err-line-bar');
  if (bar) bar.hidden = true;
  updateLineNumbers();
}

function positionErrorBar() {
  var bar = document.getElementById('err-line-bar');
  var ed = document.getElementById('code-editor');
  if (!bar || !ed) return;
  if (!editorErrorLine) { bar.hidden = true; return; }
  var style = window.getComputedStyle(ed);
  var lh = parseFloat(style.lineHeight) || 23;
  var pad = parseFloat(style.paddingTop) || 0;
  bar.hidden = false;
  bar.style.height = lh + 'px';
  bar.style.top = (pad + (editorErrorLine - 1) * lh - ed.scrollTop) + 'px';
}

function syncScroll() {
  const ed = document.getElementById('code-editor');
  const ln = document.getElementById('line-numbers');
  if (ed && ln) ln.scrollTop = ed.scrollTop;
}

// ── Exercise ───────────────────────────────────────────────────────────
function buildExercise(l) {
  const ex = l.exercise;
  const isDone = done.has(l.id);
  const displayExpected = ex.expected.replace(/\\n/g,'\n');
  return `
    <div class="ex-task">
      <h4>🎯 Tarea</h4>
      <p>${ex.desc}</p>
      <div class="exp-out-label">Output esperado</div>
      <div class="exp-out">${displayExpected}</div>
    </div>
    <div class="ed-label">
      <span>Tu código</span>
      <div class="ed-actions">
        <button type="button" onclick="resetCode()">↺ Resetear</button>
      </div>
    </div>
    <div class="editor-wrap">
      <div class="line-numbers" id="line-numbers"></div>
      <div class="err-line-bar" id="err-line-bar" hidden></div>
      <textarea class="code-editor" id="code-editor" spellcheck="false" autocomplete="off" autocapitalize="off">${ex.starter}</textarea>
    </div>
    <div class="btn-row">
      <button type="button" class="run-btn" id="run-btn" onclick="runCode()">▶ Ejecutar</button>
      <button type="button" class="hint-btn" onclick="showHint()">💡 Pista</button>
      <span id="run-status"></span>
    </div>
    <div id="out-area"></div>
    ${isDone ? `<div class="success-card"><h3>✅ ¡Completado!</h3><p>Ya resolviste este ejercicio correctamente.</p></div>` : ''}
    <div id="hints-area"></div>
  `;
}

function resetCode() {
  const ed = document.getElementById('code-editor');
  if (ed) {
    ed.value = LESSONS[cur].exercise.starter;
    editorErrorLine = 0;
    updateLineNumbers();
    closeSuggest();
  }
}

// ── Autocompletado Java ────────────────────────────────────────────────
var JAVA_SNIPPETS = [
  { label: 'System.out.println("texto")', detail: 'imprime y baja de línea', insert: 'System.out.println("|");' },
  { label: 'System.out.print("texto")', detail: 'imprime y se queda en la línea', insert: 'System.out.print("|");' },
  { label: 'System.out.printf("")', detail: 'imprime con formato', insert: 'System.out.printf("|");' },
  { label: 'System.in', detail: 'entrada estándar', insert: 'System.in' },
  { label: 'Scanner', detail: 'leer datos del teclado', insert: 'Scanner' },
  { label: 'new Scanner(System.in)', detail: 'crear un lector', insert: 'new Scanner(System.in)' },
  { label: 'public static void main(String[] args)', detail: 'punto de entrada', insert: 'public static void main(String[] args) {\n    |\n}' },
  { label: 'String', detail: 'texto', insert: 'String |' },
  { label: 'int', detail: 'entero', insert: 'int |' },
  { label: 'double', detail: 'decimal', insert: 'double |' },
  { label: 'boolean', detail: 'verdadero o falso', insert: 'boolean |' },
  { label: 'if', detail: 'condición', insert: 'if (|) {\n    \n}' },
  { label: 'else', detail: 'si no se cumple', insert: 'else {\n    |\n}' },
  { label: 'for', detail: 'repetir con contador', insert: 'for (int i = 0; i < |; i++) {\n    \n}' },
  { label: 'while', detail: 'repetir mientras', insert: 'while (|) {\n    \n}' },
  { label: 'return', detail: 'devolver un valor', insert: 'return |;' },
  { label: 'try / catch', detail: 'intentar y capturar errores', insert: 'try {\n    |\n} catch (Exception e) {\n    \n}' },
  { label: 'catch', detail: 'capturar una excepción', insert: 'catch (Exception e) {\n    |\n}' }
];

var suggestState = { items: [], active: 0 };

function suggestBox() {
  var box = document.getElementById('java-suggest');
  if (box) return box;
  box = document.createElement('div');
  box.id = 'java-suggest';
  box.className = 'java-suggest';
  box.hidden = true;
  box.setAttribute('role', 'listbox');
  box.addEventListener('mousedown', function (e) {
    var btn = e.target.closest('.java-suggest-item');
    if (!btn) return;
    e.preventDefault();
    suggestState.active = Number(btn.dataset.index);
    acceptSuggest();
  });
  document.body.appendChild(box);
  window.addEventListener('scroll', function () {
    if (suggestOpen()) positionSuggest();
  }, true);
  return box;
}

function suggestOpen() {
  var box = document.getElementById('java-suggest');
  return !!(box && !box.hidden);
}

function closeSuggest() {
  var box = document.getElementById('java-suggest');
  if (box) box.hidden = true;
  suggestState.items = [];
  suggestState.active = 0;
}

function editorToken(value, cursor) {
  var before = value.slice(0, cursor);
  var match = before.match(/[A-Za-z0-9_.]+$/);
  if (!match) return null;
  return { text: match[0], start: cursor - match[0].length, end: cursor };
}

function tokenInStringOrComment(value, cursor) {
  var lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  var line = value.slice(lineStart, cursor);
  var inString = false;
  var commentAt = -1;
  for (var i = 0; i < line.length; i++) {
    var ch = line.charAt(i);
    if (ch === '"') inString = !inString;
    if (!inString && ch === '/' && line.charAt(i + 1) === '/') {
      commentAt = i;
      break;
    }
  }
  return inString || commentAt !== -1;
}

function snippetMatches(snippet, token) {
  var body = snippet.insert.replace('|', '');
  if (snippet.label.indexOf(token) === 0 || body.indexOf(token) === 0) return true;
  var sources = [snippet.label, body];
  for (var s = 0; s < sources.length; s++) {
    var src = sources[s];
    var from = 0;
    while (from < src.length) {
      var at = src.indexOf(token, from);
      if (at === -1) break;
      var prev = at === 0 ? '' : src.charAt(at - 1);
      if (prev === '' || prev === '.' || prev === ' ' || prev === '(') return true;
      from = at + 1;
    }
  }
  return false;
}

function refreshSuggest() {
  var ed = document.getElementById('code-editor');
  if (!ed) { closeSuggest(); return; }
  var cursor = ed.selectionStart;
  if (cursor !== ed.selectionEnd) { closeSuggest(); return; }
  if (tokenInStringOrComment(ed.value, cursor)) { closeSuggest(); return; }
  var token = editorToken(ed.value, cursor);
  if (!token || token.text.length < 2) { closeSuggest(); return; }
  var items = JAVA_SNIPPETS.filter(function (snippet) {
    return snippetMatches(snippet, token.text);
  });
  items.sort(function (a, b) {
    var ab = a.insert.replace('|', '');
    var bb = b.insert.replace('|', '');
    var ar = (a.label.indexOf(token.text) === 0 || ab.indexOf(token.text) === 0) ? 0 : 1;
    var br = (b.label.indexOf(token.text) === 0 || bb.indexOf(token.text) === 0) ? 0 : 1;
    return ar - br;
  });
  items = items.slice(0, 8);
  if (!items.length) { closeSuggest(); return; }
  suggestState.items = items;
  suggestState.active = 0;
  var box = suggestBox();
  box.innerHTML = items.map(function (snippet, i) {
    return '<button type="button" class="java-suggest-item' + (i === suggestState.active ? ' active' : '') + '" role="option" data-index="' + i + '" aria-selected="' + (i === suggestState.active ? 'true' : 'false') + '">' +
      '<span class="java-suggest-label">' + snippet.label + '</span>' +
      '<span class="java-suggest-detail">' + snippet.detail + '</span>' +
      '</button>';
  }).join('');
  box.hidden = false;
  positionSuggest();
}

function moveSuggest(delta) {
  if (!suggestState.items.length) return;
  suggestState.active = (suggestState.active + delta + suggestState.items.length) % suggestState.items.length;
  var box = suggestBox();
  var buttons = box.querySelectorAll('.java-suggest-item');
  for (var i = 0; i < buttons.length; i++) {
    var on = i === suggestState.active;
    buttons[i].classList.toggle('active', on);
    buttons[i].setAttribute('aria-selected', on ? 'true' : 'false');
    if (on) buttons[i].scrollIntoView({ block: 'nearest' });
  }
}

function acceptSuggest() {
  var ed = document.getElementById('code-editor');
  var snippet = suggestState.items[suggestState.active];
  if (!ed || !snippet) return;
  var token = editorToken(ed.value, ed.selectionStart);
  if (!token) return;
  var raw = snippet.insert;
  var cursorAt = raw.indexOf('|');
  var text = raw.replace('|', '');
  ed.value = ed.value.slice(0, token.start) + text + ed.value.slice(token.end);
  var pos = token.start + (cursorAt === -1 ? text.length : cursorAt);
  ed.selectionStart = ed.selectionEnd = pos;
  ed.focus();
  closeSuggest();
  updateLineNumbers();
}

function positionSuggest() {
  var ed = document.getElementById('code-editor');
  var box = document.getElementById('java-suggest');
  if (!ed || !box || box.hidden) return;
  var pos = caretClientPos(ed);
  box.style.left = '0px';
  box.style.top = '0px';
  var rect = box.getBoundingClientRect();
  var left = pos.left;
  var top = pos.top + pos.line + 4;
  if (left + rect.width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - rect.width - 8);
  if (left < 8) left = 8;
  if (top + rect.height > window.innerHeight - 8) top = Math.max(8, pos.top - rect.height - 4);
  box.style.left = left + 'px';
  box.style.top = top + 'px';
}

function caretClientPos(el) {
  var style = window.getComputedStyle(el);
  var mirror = document.createElement('div');
  var props = ['boxSizing','width','overflowX','overflowY','borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','paddingTop','paddingRight','paddingBottom','paddingLeft','fontStyle','fontVariant','fontWeight','fontStretch','fontSize','fontFamily','lineHeight','letterSpacing','textIndent','textTransform','tabSize'];
  mirror.style.position = 'absolute';
  mirror.style.visibility = 'hidden';
  mirror.style.whiteSpace = 'pre-wrap';
  mirror.style.wordWrap = 'break-word';
  mirror.style.top = '0';
  mirror.style.left = '0';
  props.forEach(function (prop) { mirror.style[prop] = style[prop]; });
  mirror.style.width = el.offsetWidth + 'px';
  mirror.textContent = el.value.substring(0, el.selectionStart);
  var span = document.createElement('span');
  span.textContent = el.value.substring(el.selectionStart) || '.';
  mirror.appendChild(span);
  document.body.appendChild(mirror);
  var rect = el.getBoundingClientRect();
  var top = rect.top + (span.offsetTop - el.scrollTop);
  var left = rect.left + (span.offsetLeft - el.scrollLeft);
  var line = span.offsetHeight || parseFloat(style.lineHeight) || 20;
  document.body.removeChild(mirror);
  return { top: top, left: left, line: line };
}

// ── Quiz ────────────────────────────────────────────────────────────────
var _quizAnswers = {};

function buildQuiz(l) {
  var qz = l.quiz;
  _quizAnswers[l.id] = {};
  var html = '<div><h4>🧪 Cuestionario — ' + qz.passing + ' correctas para aprobar</h4>';
  for (var qi = 0; qi < qz.questions.length; qi++) {
    var q = qz.questions[qi];
    html += '<div class="quiz-question"><h4>' + (qi + 1) + '. ' + q.question + '</h4>';
    for (var oi = 0; oi < q.options.length; oi++) {
      var letter = String.fromCharCode(65 + oi);
      html += '<label class="quiz-option" onclick="selectQuizOption(' + qi + ',' + oi + ',this,' + l.id + ')">' +
        '<span class="quiz-opt-letter">' + letter + '</span>' +
        '<span>' + q.options[oi] + '</span>' +
        '<input type="radio" name="q' + l.id + '_' + qi + '" value="' + oi + '" style="display:none">' +
        '</label>';
    }
    html += '</div>';
  }
  html += '<div style="text-align:center;margin-top:16px">' +
    '<button type="button" class="run-btn" onclick="runQuiz(' + l.id + ')" style="display:inline-flex">✅ Verificar respuestas</button>' +
    '</div><div id="quiz-result-' + l.id + '" style="margin-top:16px"></div>';
  return html;
}

function selectQuizOption(qi, oi, el, lid) {
  var qz = document.querySelectorAll('#pane-ex .quiz-question')[qi];
  if (!qz) return;
  var opts = qz.querySelectorAll('.quiz-option');
  for (var i = 0; i < opts.length; i++) { opts[i].classList.remove('selected'); }
  el.classList.add('selected');
  _quizAnswers[lid][qi] = oi;
}

function runQuiz(lid) {
  if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
  var l = LESSONS.find(function(x) { return x.id === lid; });
  if (!l || !l.quiz) return;
  var correct = 0;
  var total = l.quiz.questions.length;
  var resultDiv = document.getElementById('quiz-result-' + lid);
  var questionsDiv = document.querySelectorAll('#pane-ex .quiz-question');
  for (var qi = 0; qi < total; qi++) {
    var q = l.quiz.questions[qi];
    var selected = _quizAnswers[lid][qi];
    var qDiv = questionsDiv[qi];
    var opts = qDiv.querySelectorAll('.quiz-option');
    for (var oi = 0; oi < opts.length; oi++) {
      opts[oi].classList.add('disabled');
      if (oi === q.correct) { opts[oi].classList.add('correct'); }
      else if (oi === selected && selected !== q.correct) { opts[oi].classList.add('incorrect'); }
    }
    if (selected === q.correct) correct++;
  }
  var pct = Math.round(correct / total * 100);
  var passed = correct >= l.quiz.passing;
  var cls = passed ? 'pass' : 'fail';
  var emoji = passed ? '🎉' : '😔';
  resultDiv.innerHTML = '<div class="quiz-score ' + cls + '">' + emoji + ' Obtuviste ' + correct + ' de ' + total + ' (' + pct + '%) — ' + (passed ? '¡Aprobado!' : 'No alcanzó el mínimo') + '</div>' +
    (passed ? '<button type="button" class="quiz-retry-btn" onclick="retryQuiz(' + lid + ')" style="display:none">Reintentar</button>' : '<button type="button" class="quiz-retry-btn" onclick="retryQuiz(' + lid + ')">🔄 Reintentar</button>');
  if (typeof Progress !== 'undefined' && Progress.saveAttempt) {
    Progress.saveAttempt({
      lessonId: lid,
      type: 'quiz',
      passed: passed,
      quizCorrect: correct,
      quizTotal: total,
      scorePercent: pct
    });
  }
  if (passed) {
    var prev = quizBestScores[lid] || 0;
    if (pct > prev) quizBestScores[lid] = pct;
    if (typeof Progress !== 'undefined' && Progress.saveQuizScores) {
      Progress.saveQuizScores(quizBestScores);
    }
  }
  if (passed && !done.has(lid)) {
    done.add(lid);
    saveDone();
    launchConfetti();
    buildSidebar();
  }
  if (typeof Ranking !== 'undefined' && Ranking.update) {
    Ranking.update([...done], quizBestScores, done.size === LESSONS.length);
  }
}

function retryQuiz(lid) {
  _quizAnswers[lid] = {};
  var l = LESSONS.find(function(x) { return x.id === lid; });
  if (!l) return;
  var pane = document.getElementById('pane-ex');
  pane.innerHTML = buildQuiz(l);
  setTimeout(function() { updateLineNumbers(); }, 50);
}

// ── Confetti ───────────────────────────────────────────────────────────
function launchConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#f59e0b','#34d399','#60a5fa','#f472b6','#a78bfa','#fbbf24'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    piece.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
  setTimeout(() => container.remove(), 3000);
}

// ── Run Code (Local Simulator) ─────────────────────────────────────────

function runCode() {
  if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
  if (LESSONS[cur].quiz) return;

  const code = document.getElementById('code-editor').value;
  const btn = document.getElementById('run-btn');
  const status = document.getElementById('run-status');
  const outArea = document.getElementById('out-area');

  btn.disabled = true;
  status.textContent = 'Evaluando localmente…';
  status.className = 'run-status';
  outArea.innerHTML = '';

  setTimeout(() => {
    try {
      const ex = LESSONS[cur].exercise;
      const expected = ex.expected.replace(/\\n/g,'\n').trimEnd();
      
      const res = localValidate(LESSONS[cur].id, code);

      if (res.syntax) {
        highlightErrorLine(res.line);
        outArea.innerHTML = `
          <div class="cmp-grid">
            <div class="out-box box-err">
              <div class="out-head">Incorrecto</div>
              <div class="out-body">
                <div class="compile-src">${esc(res.lineText || '')}</div>
                <div class="compile-javac">Línea ${res.line}: ${esc(res.javac || '')}</div>
                <div class="compile-why">${esc(res.why || '')}</div>
              </div>
            </div>
            <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
          </div>`;
        showHint();
      } else if (res.err) {
        clearErrorLine();
        outArea.innerHTML = `
          <div class="cmp-grid">
            <div class="out-box box-err"><div class="out-head">Incorrecto</div><div class="out-body">${esc(res.err)}</div></div>
            <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
          </div>`;
        showHint();
      } else if (res.ok) {
        clearErrorLine();
        done.add(LESSONS[cur].id);
        saveDone();
        if (typeof Progress !== 'undefined' && Progress.saveAttempt) {
          Progress.saveAttempt({
            lessonId: LESSONS[cur].id,
            type: 'exercise',
            passed: true,
            quizCorrect: 0,
            quizTotal: 0,
            scorePercent: 100
          });
        }
        if (typeof Ranking !== 'undefined' && Ranking.update) {
          Ranking.update([...done], quizBestScores, done.size === LESSONS.length);
        }
        launchConfetti();
        outArea.innerHTML = `
          <div class="out-box box-ok"><div class="out-head">Correcto</div><div class="out-body">${esc(expected)}</div></div>`;
        buildSidebar();
        if (done.size === LESSONS.length && typeof Progress !== 'undefined' && !Progress.wasCertShown()) {
          Progress.markCertShown();
          setTimeout(function() { document.getElementById('grad-overlay').classList.add('show'); }, 600);
        }
        if (typeof Progress !== 'undefined' && Progress.setCompletionDateIso) {
          Progress.setCompletionDateIso(new Date().toISOString());
        }
      }
    } catch(e) {
      outArea.innerHTML = `
        <div class="out-box box-err">
          <div class="out-head">Incorrecto</div>
          <div class="out-body">${esc(e.message)}</div>
        </div>`;
    } finally {
      btn.disabled = false;
      status.textContent = '';
      status.className = '';
    }
  }, 400); // Simulamos una pequeña demora para efecto visual
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showHint() {
  const hints = LESSONS[cur].exercise.hints;
  const ha = document.getElementById('hints-area');
  if (!ha) return;
  if (hintLevel < hints.length) {
    hintLevel++;
    let html = `<div class="hint-n">💡 Pista ${hintLevel} de ${hints.length} — guía progresiva (no da la respuesta)</div>`;
    for (let i = 0; i < hintLevel; i++) {
      html += `<div class="hint-box">${hints[i]}</div>`;
    }
    ha.innerHTML = html;
  }
}

// ── Init ───────────────────────────────────────────────────────────────
/** Replace in-memory progress with this user's merged state (never another user's). */
function applyUserProgress(state) {
  clearSessionProgress();
  var lessons = (state && state.completedLessons) || [];
  lessons.forEach(function (id) { done.add(id); });
  quizBestScores = Object.assign({}, (state && state.scores) || {});
  if (typeof Progress !== 'undefined' && Progress.activeUid && Progress.activeUid()) {
    Progress.saveLocalCache(Progress.activeUid(), [...done], quizBestScores, {
      completionDate: state && state.completionDate,
      certShown: state && state.certShown
    });
  }
}

// Back-compat name used by auth.js
function applyProgressFromRemote(completedLessons, scores) {
  applyUserProgress({ completedLessons: completedLessons || [], scores: scores || {} });
}

function startApp() {
  if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
  render();
  if (typeof AuthUI !== 'undefined' && AuthUI.init) AuthUI.init();
}

// AuthUI.mountApp() llama startApp() en cada login (incluye reentrada tras Salir)