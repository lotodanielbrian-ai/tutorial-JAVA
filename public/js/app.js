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

var CERT2 = {
  title: 'CERTIFICADO DE FASE 2',
  desc: 'Por haber completado la <b>Fase 1 de fundamentos de Java</b> y la <b>Fase 2 de desarrollo backend</b>, con parciales prácticos y coloquio, demostrando que puede construir, probar, documentar y empaquetar una API REST con Java y Spring Boot.',
  descAccredited: 'Por haber acreditado los <b>fundamentos de Java</b> con la prueba de nivel y completado la <b>Fase 2 de desarrollo backend</b>, con parciales prácticos y coloquio, demostrando que puede construir, probar, documentar y empaquetar una API REST con Java y Spring Boot.',
  skills: ['Java SE · POO', 'Spring Boot · Maven', 'API REST · DTO', 'JPA · SQL · MySQL', 'JUnit · Mockito', 'Docker · Swagger', 'Código limpio · SOLID'],
  sign: '<b>BRIAN DANIEL LOTO</b><br>Autor del curso'
};

function showCert2Overlay() {
  var box = document.getElementById('sim-box');
  var user = typeof AuthUI !== 'undefined' && AuthUI.user ? AuthUI.user() : null;
  var f1 = Progress.getCompletionDate();
  var f2 = fase2Meta.completionDate;
  var when = function (iso) { return iso ? new Date(iso).toLocaleDateString('es-AR') : '—'; };
  box.innerHTML = `
    <div class="sim-head"><h2>🎓 Fase 2 completada</h2><button type="button" class="hint-btn" onclick="document.getElementById('sim-overlay').classList.remove('show')">✕ Cerrar</button></div>
    <p>Terminaste las dos fases. Este certificado resume tu avance.</p>
    <table class="rank-table"><tbody>
      <tr><td>Fase 1 · Fundamentos de Java</td><td>${done.size === LESSONS.length ? LESSONS.length + ' lecciones' : 'Prueba de nivel'}</td><td>${when(done.size === LESSONS.length ? f1 : fase2Meta.accredited)}</td></tr>
      <tr><td>Fase 2 · Backend con Spring Boot</td><td>${LESSONS_F2.length} lecciones</td><td>${when(f2)}</td></tr>
    </tbody></table>
    <label for="cert2-name" class="f2-label">Nombre y apellido:</label>
    <input type="text" id="cert2-name" autocomplete="off">
    <button type="button" class="btn-cert" onclick="generateCert2()">Emitir Certificado (PDF)</button>`;
  document.getElementById('cert2-name').value = (user && user.displayName) || '';
  document.getElementById('sim-overlay').classList.add('show');
}

// Reutiliza el diseño del primer certificado: cambia el texto solo mientras imprime
function generateCert2() {
  var printEl = document.getElementById('cert-print');
  var saved = printEl.innerHTML;
  var set = function (sel, html) { var el = printEl.querySelector(sel); if (el) el.innerHTML = html; };
  var name = document.getElementById('cert2-name').value.trim() || 'Estudiante Java';
  set('.cert-title', CERT2.title);
  set('.cert-desc', done.size === LESSONS.length ? CERT2.desc : CERT2.descAccredited);
  set('.cert-skills', CERT2.skills.map(function (s) { return '<span class="cert-skill">' + s + '</span>'; }).join(''));
  set('.cert-name', esc(name));
  var sign = printEl.querySelector('.cert-sign');
  if (sign) {
    var code = sign.querySelector('.cert-sig-code');
    if (code) code.textContent = 'fase = 2; // completada';
    sign.lastChild.remove();
    sign.lastChild.remove();
    sign.lastChild.remove();
    sign.insertAdjacentHTML('beforeend', CERT2.sign);
  }
  set('#cert-date', new Date(fase2Meta.completionDate || Date.now()).toLocaleDateString('es-AR'));
  document.getElementById('sim-overlay').classList.remove('show');
  printEl.classList.add('show-cert');
  document.body.classList.add('printing-cert2');
  var ps = document.createElement('style');
  ps.textContent = '@page { size: 320mm 180mm; margin: 0mm; }';
  document.head.appendChild(ps);
  setTimeout(function() { window.print(); }, 800);
  setTimeout(function() {
    printEl.classList.remove('show-cert');
    printEl.innerHTML = saved;
    document.body.classList.remove('printing-cert2');
    ps.remove();
  }, 1500);
}

function resetGlobalProgress() {
  UI.confirm({
    title: '¿Borrar todo tu progreso?',
    message: 'Se reinician las lecciones, la práctica, la Fase 2 y tu lugar en el ranking, en todos tus dispositivos. No se puede deshacer.',
    okText: 'Sí, borrar todo',
    cancelText: 'Cancelar',
    danger: true,
    icon: '🗑️'
  }).then(function (yes) {
    if (!yes) return;
    if (typeof Progress === 'undefined' || !Progress.resetRemote) { location.reload(); return; }
    Progress.resetRemote().then(function (ok) {
      if (ok) { location.reload(); return; }
      // Si falló, recargar muestra el progreso real, que sigue guardado
      UI.alert({
        title: 'No se pudo reiniciar',
        message: 'No hay conexión. Tu progreso sigue guardado: probá de nuevo en un rato.',
        icon: '📡'
      }).then(function () { location.reload(); });
    });
  });
}

function clearSessionProgress() {
  done = new Set();
  quizBestScores = {};
  cur = 0;
  hintLevel = 0;
  if (typeof _quizAnswers !== 'undefined') _quizAnswers = {};
  if (typeof Practica !== 'undefined') Practica.setState(null);
  fase = 1;
  curF1 = 0;
  curF2 = 0;
  failCount = 0;
  doneF2 = new Set();
  fase2Meta = { completionDate: null, certShown: false, accredited: null };
}

// ── State (empty until login loads this user's data) ───────────────────
let cur = 0;
let done = new Set();
var quizBestScores = {}; // lessonId -> best percent (0-100)
let hintLevel = 0;
var editorErrorLine = 0;

// ── Fases ──────────────────────────────────────────────────────────────
// La Fase 2 tiene su propia lista y su propio progreso: LESSONS, done, el
// certificado y el ranking de la Fase 1 no cambian.
var fase = 1;
var curF1 = 0;
var curF2 = 0;
var lockedView = false;
var doneF2 = new Set();
var fase2Meta = { completionDate: null, certShown: false, accredited: null };

function lessonList() { return fase === 2 ? LESSONS_F2 : LESSONS; }
function doneSet() { return fase === 2 ? doneF2 : done; }
function fase2Unlocked() { return done.size === LESSONS.length || !!fase2Meta.accredited; }

function persistFase2() {
  if (typeof Progress !== 'undefined' && Progress.saveFase2) {
    Progress.saveFase2({ done: [...doneF2], completionDate: fase2Meta.completionDate, certShown: fase2Meta.certShown, accredited: fase2Meta.accredited });
  }
}

// La prueba de nivel abre la Fase 2: no marca lecciones ni cambia el primer certificado
function accreditFase2() {
  if (!fase2Meta.accredited) fase2Meta.accredited = new Date().toISOString();
  persistFase2();
  buildSidebar();
}

function showFase(n) {
  if (n === 2 && !fase2Unlocked()) { showFase2Locked(); return; }
  if (n === fase) {
    if (lockedView) render();
    return;
  }
  keepDraft();
  if (fase === 1) curF1 = cur;
  else curF2 = cur;
  fase = n;
  cur = n === 1 ? curF1 : curF2;
  resetExerciseHelp();
  render();
  savePlace();
}

function savePlace() {
  if (fase === 1) curF1 = cur;
  else curF2 = cur;
  if (typeof Progress !== 'undefined' && Progress.savePlace) {
    Progress.savePlace({ fase: fase, f1: LESSONS[curF1].id, f2: LESSONS_F2[curF2].id, at: Date.now() });
  }
}

function showFase2Locked() {
  var rows = LESSONS_F2.map(function (l) { return '<li>' + l.title + '</li>'; }).join('');
  document.getElementById('main').innerHTML = `
    <div class="lh-header">
      <div class="lv-badge badge-avanzado">Fase 2 · Backend con Spring Boot</div>
      <div class="lh-title">🔒 Se desbloquea con el certificado de la Fase 1</div>
      <div class="lh-desc">Completá las ${LESSONS.length} lecciones para abrir esta etapa. Llevás ${done.size} de ${LESSONS.length}.</div>
    </div>
    <div class="f2-roadmap"><h4>Lo que te espera</h4><ol>${rows}</ol></div>
    <div class="nav-row"><button type="button" class="nav-btn-lesson" onclick="render()">← Volver a la Fase 1</button><button type="button" class="nav-btn-lesson" onclick="Practica.startNivel()">🎯 Rendir la prueba de nivel</button></div>`;
  lockedView = true;
  window.scrollTo({top:0, behavior:'smooth'});
}

function saveDone() {
  if (typeof Progress === 'undefined' || !Progress.activeUid || !Progress.activeUid()) return;
  if (fase === 2) {
    if (doneF2.size === LESSONS_F2.length && !fase2Meta.completionDate) fase2Meta.completionDate = new Date().toISOString();
    persistFase2();
    return;
  }
  Progress.saveLocalCache(Progress.activeUid(), [...done], quizBestScores);
  if (Progress.syncProgress) {
    Progress.syncProgress([...done], cur, done.size === LESSONS.length).then(adoptLessons);
  }
}

// Lo que se completó en otra pestaña o dispositivo también se ve en esta
function adoptLessons(merged) {
  if (!merged || !merged.completedLessons) return;
  const before = done.size;
  merged.completedLessons.forEach(id => done.add(id));
  if (done.size === before) return;
  Progress.saveLocalCache(Progress.activeUid(), [...done], quizBestScores);
  buildSidebar();
}

// ── Search ─────────────────────────────────────────────────────────────
var lessonIndex = {};

function foldText(s) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Busca también adentro de cada lección: "HashMap" o "@Autowired" rara vez están en el título
function lessonText(id) {
  if (!lessonIndex[id]) {
    const l = LESSONS.concat(LESSONS_F2).find(x => x.id === id);
    lessonIndex[id] = foldText((l.title + ' ' + l.desc + ' ' + l.simple() + ' ' + l.tutorial()).replace(/<[^>]+>/g, ' '));
  }
  return lessonIndex[id];
}

function filterLessons(query) {
  const q = foldText(query).trim();
  document.querySelectorAll('.lb').forEach(btn => {
    if (!q) { btn.classList.remove('hidden'); return; }
    btn.classList.toggle('hidden', !lessonText(Number(btn.dataset.id)).includes(q));
  });
  var sbList = document.getElementById('sb-list');
  if (!sbList) return;
  var cross = document.getElementById('sb-cross');
  if (!cross) {
    cross = document.createElement('div');
    cross.id = 'sb-cross';
    cross.className = 'sb-cross';
    sbList.appendChild(cross);
  }
  if (!q) { cross.hidden = true; cross.innerHTML = ''; return; }
  var otherFase = fase === 1 ? 2 : 1;
  if (otherFase === 2 && !fase2Unlocked()) { cross.hidden = true; cross.innerHTML = ''; return; }
  var otherList = otherFase === 2 ? LESSONS_F2 : LESSONS;
  var hits = otherList.filter(function (l) { return lessonText(l.id).includes(q); }).length;
  if (hits > 0) {
    cross.hidden = false;
    cross.innerHTML = '<button type="button" class="sb-cross-btn" onclick="showFase(' + otherFase + ')">🔎 Ver ' + hits + ' coincidencia' + (hits === 1 ? '' : 's') + ' en Fase ' + otherFase + '</button>';
  } else {
    cross.hidden = true;
    cross.innerHTML = '';
  }
}

// ── Sidebar ────────────────────────────────────────────────────────────
function buildSidebar() {
  const list = lessonList();
  const finished = doneSet();
  const groups = fase === 2
    ? { limpio: [], spring: [], api: [], calidad: [], entrega: [], extra: [], coloquio: [] }
    : { super: [], basico: [], inter: [], avanzado: [], examen: [], entrevista: [] };
  list.forEach(l => {
    if (groups[l.level]) groups[l.level].push(l);
  });
  const labels = fase === 2
    ? { limpio: '🧹 Código limpio', spring: '🌱 Spring Boot', api: '🔌 API REST', calidad: '🧪 Calidad', entrega: '🐳 Entrega', extra: '➕ Para ir más lejos', coloquio: '🎓 Parciales y coloquio' }
    : { super: '🌱 Super Básico', basico: '📘 Básico', inter: '🚀 Intermedio', avanzado: '🔧 Avanzado', examen: '🎓 Exámenes Finales', entrevista: '💼 Entrevista junior' };
  let html = `<div class="fase-switch">
    <button type="button" class="${fase === 1 ? 'active' : ''}" onclick="showFase(1)">Fase 1</button>
    <button type="button" class="${fase === 2 ? 'active' : ''}" onclick="showFase(2)">${fase2Unlocked() ? '' : '🔒 '}Fase 2</button>
  </div>`;
  for (const [key, lessons] of Object.entries(groups)) {
    html += `<div class="lv-group"><div class="lv-label">${labels[key]}</div>`;
    lessons.forEach(l => {
      const isDone = finished.has(l.id);
      const isActive = l.id === list[cur].id;
      html += `<button class="lb${isActive?' active':''}${isDone?' done':''}" data-id="${l.id}" onclick="goTo(${list.indexOf(l)})">
        <span class="l-num">${String(l.id % 100).padStart(2,'0')}</span>
        <div class="l-dot"></div>
        <span style="flex:1">${l.title}</span>
        ${typeof Practica !== 'undefined' ? Practica.badge(l.id) : ''}
        <span class="l-stars">${l.stars}</span>
      </button>`;
    });
    html += '</div>';
  }
  document.getElementById('sb-list').innerHTML = html;
  const search = document.getElementById('search-input');
  if (search && search.value) filterLessons(search.value);
  const sub = document.querySelector('.sb-sub');
  if (sub) sub.textContent = `Java INPRO · Fase ${fase} · ${list.length} lecciones`;
  paintSeguir();
  const pct = Math.round(finished.size / list.length * 100);
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('prog-lbl').textContent = `${finished.size} de ${list.length} completados · ${pct}%`;
  var certBtn = document.getElementById('cert-btn');
  var fullList = finished.size === list.length;
  if (certBtn) {
    certBtn.style.display = fullList ? 'inline-flex' : 'none';
    certBtn.onclick = fase === 2 ? showCert2Overlay : showCertOverlay;
  }
}

// ── Qué sigue ──────────────────────────────────────────────────────────
function nextLessonIndex() {
  const list = lessonList();
  const finished = doneSet();
  for (let i = 0; i < list.length; i++) {
    const at = (cur + i) % list.length;
    if (!finished.has(list[at].id)) return at;
  }
  return -1;
}

function nextStep() {
  const due = typeof Practica !== 'undefined' ? Practica.dueCount() : 0;
  if (due) return { text: 'repasar ' + due, go: () => Practica.startReview() };
  const at = nextLessonIndex();
  if (at !== -1) return { text: 'lección ' + (lessonList()[at].id % 100), go: () => goTo(at) };
  if (fase === 1 && fase2Unlocked()) return { text: 'Fase 2', go: () => showFase(2) };
  return { text: 'evaluaciones', go: () => Practica.showPanel() };
}

function paintSeguir() {
  const btn = document.getElementById('btn-seguir');
  if (btn) btn.textContent = '▶ Seguir: ' + nextStep().text;
}

function seguir() {
  nextStep().go();
}

function lessonFigure(l) {
  if (typeof FIGURAS === 'undefined' || !FIGURAS[l.id]) return '';
  var f = FIGURAS[l.id]();
  if (!f || !f.svg) return '';
  return '<figure class="app-fig">' + f.svg + '<figcaption>' + esc(f.caption || '') + '</figcaption></figure>';
}

// ── Main render ────────────────────────────────────────────────────────
function render() {
  lockedView = false;
  const l = lessonList()[cur];
  const badgeClass = { super:'badge-super', basico:'badge-basico', inter:'badge-inter', avanzado:'badge-avanzado', examen:'badge-examen', entrevista:'badge-entrevista', limpio:'badge-super', spring:'badge-basico', api:'badge-inter', calidad:'badge-avanzado', entrega:'badge-examen', extra:'badge-entrevista', coloquio:'badge-examen' }[l.level];
  const exBtnLabel = l.quiz ? '📝 Cuestionario' : '💻 Ejercicio';
  const exPaneHtml = l.quiz ? buildQuiz(l) : buildExercise(l);
  document.getElementById('main').innerHTML = `
    <div class="lh-header">
      <div class="lv-badge ${badgeClass}">${l.levelLabel}</div>
      <div class="lh-title">${l.title}</div>
      <div class="lh-desc">${l.desc}</div>
      <div class="lh-stars">Dificultad: ${l.stars}${typeof Practica !== 'undefined' ? ' · ⏱ unos ' + Practica.estimate(l) + ' min' : ''}</div>
    </div>
    <div class="tabs">
      <button type="button" class="tab-btn active" id="tab-simple" onclick="switchTab('simple')">🏠 Explicación Simple</button>
      <button type="button" class="tab-btn" id="tab-tut" onclick="switchTab('tut')">📖 Tutorial Técnico</button>
      <button type="button" class="tab-btn" id="tab-ex" onclick="switchTab('ex')">${exBtnLabel}</button>
      <button type="button" class="tab-btn" id="tab-prac" onclick="switchTab('prac')">🧠 Práctica</button>
    </div>
    <div class="tab-pane active" id="pane-simple">${l.id === 1 ? '<div class="gc-ex-note"><div><strong>🧭 ¿Primera vez programando?</strong> Antes de escribir código, podés leer el <strong>Capítulo 0</strong>: qué es Java, por qué no es JavaScript y cómo funciona.</div><a class="gc-bot-btn" href="manual.html#cap-0" target="_blank" rel="noopener">📖 Abrir Capítulo 0</a></div>' : ''}${typeof GuiaCero !== 'undefined' ? GuiaCero.cardSimple(l) : ''}${typeof Practica !== 'undefined' ? Practica.ladder(l) : ''}${lessonFigure(l)}${l.simple()}</div>
    <div class="tab-pane" id="pane-tut">${l.tutorial()}${typeof GuiaCero !== 'undefined' ? GuiaCero.cardTutorial(l) : ''}</div>
    <div class="tab-pane" id="pane-ex">${exPaneHtml}</div>
    <div class="tab-pane" id="pane-prac">${typeof Practica !== 'undefined' ? Practica.buildTab(l) : ''}</div>
    <div class="nav-row">
      <button type="button" class="nav-btn-lesson" onclick="goTo(cur-1)" ${cur===0?'disabled':''}>← Anterior</button>
      <button type="button" class="nav-btn-lesson" onclick="goTo(cur+1)" ${cur===lessonList().length-1?'disabled':''}>Siguiente →</button>
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
  offerCertificate();
  if (typeof JavaBot !== 'undefined' && JavaBot.syncLesson) JavaBot.syncLesson(l);
}

function showCertOverlay() {
  var nameInput = document.getElementById('cert-name');
  if (nameInput && !nameInput.value && typeof AuthUI !== 'undefined' && AuthUI.user && AuthUI.user()) {
    nameInput.value = AuthUI.user().displayName || '';
  }
  document.getElementById('grad-overlay').classList.add('show');
}

// El manual es un libro aparte (manual.html), con su PDF en hojas A4: se abre en otra pestaña
// para no perder el lugar ni el código del curso
function showManual() {
  var w = window.open('manual.html', '_blank', 'noopener');
  if (!w) location.href = 'manual.html';
}

function switchTab(t) {
  ['simple','tut','ex','prac'].forEach(tab => {
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
  if (idx < 0 || idx >= lessonList().length) return;
  keepDraft();
  cur = idx;
  resetExerciseHelp();
  render();
  savePlace();
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
    keepDraft();
    closeSuggest();
  }
}

function onEditorInput() {
  updateLineNumbers();
  refreshSuggest();
  keepDraft();
}

// Lo escrito no se pierde al cambiar de lección o recargar
function keepDraft() {
  const ed = document.getElementById('code-editor');
  if (!ed || typeof Progress === 'undefined' || !Progress.saveDraft) return;
  const l = lessonList()[cur];
  if (!l.exercise) return;
  if (ed.value === l.exercise.starter) Progress.clearDraft(l.id);
  else Progress.saveDraft(l.id, ed.value);
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
  const isDone = doneSet().has(l.id);
  const displayExpected = ex.expected.replace(/\\n/g,'\n');
  const draft = typeof Progress !== 'undefined' && Progress.loadDraft ? Progress.loadDraft(l.id) : null;
  return `
    <div class="ex-task">
      <h4>🎯 Tarea</h4>
      <p>${ex.desc}</p>
      ${typeof GuiaCero !== 'undefined' ? GuiaCero.cardExercise(l) : ''}
      ${ex.stdin ? `<div class="exp-out-label">Entrada simulada (el emulador la escribe por vos)</div><div class="exp-out">${esc(ex.stdin.join('\n'))}</div>` : ''}
      <div class="exp-out-label">Output esperado</div>
      <div class="exp-out">${esc(displayExpected)}</div>
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
      <textarea class="code-editor" id="code-editor" spellcheck="false" autocomplete="off" autocapitalize="off">${esc(draft !== null ? draft : ex.starter)}</textarea>
    </div>
    <div class="btn-row">
      <button type="button" class="run-btn" id="run-btn" onclick="runCode()">▶ Ejecutar</button>
      <button type="button" class="hint-btn" onclick="showHint()">💡 Pista</button>
      <span id="run-status"></span>
    </div>
    <div id="out-area"></div>
    ${isDone ? `<div class="success-card"><h3>✅ ¡Completado!</h3><p>Ya resolviste este ejercicio correctamente.</p></div>` : ''}
    <div id="hints-area"></div>
    <div id="solution-area"></div>
  `;
}

function resetCode() {
  const ed = document.getElementById('code-editor');
  if (ed) {
    ed.value = lessonList()[cur].exercise.starter;
    keepDraft();
    editorErrorLine = 0;
    updateLineNumbers();
    keepDraft();
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
  keepDraft();
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

function shuffledIndexes(n) {
  var list = [];
  for (var i = 0; i < n; i++) list.push(i);
  for (var j = n - 1; j > 0; j--) {
    var k = Math.floor(Math.random() * (j + 1));
    var t = list[j];
    list[j] = list[k];
    list[k] = t;
  }
  return list;
}

function buildQuiz(l) {
  var qz = l.quiz;
  _quizAnswers[l.id] = {};
  var html = '<div><h4>🧪 Cuestionario — ' + qz.passing + ' correctas para aprobar</h4>' + (typeof GuiaCero !== 'undefined' ? GuiaCero.cardExercise(l) : '');
  for (var qi = 0; qi < qz.questions.length; qi++) {
    var q = qz.questions[qi];
    html += '<div class="quiz-question"><h4>' + (qi + 1) + '. ' + q.question + '</h4>';
    var order = shuffledIndexes(q.options.length);
    for (var pos = 0; pos < order.length; pos++) {
      var oi = order[pos];
      var letter = String.fromCharCode(65 + pos);
      html += '<label class="quiz-option" data-oi="' + oi + '">' +
        '<span class="quiz-opt-letter">' + letter + '</span>' +
        '<span>' + q.options[oi] + '</span>' +
        '<input type="radio" name="q' + l.id + '_' + qi + '" value="' + oi + '" class="sr-only" onchange="selectQuizOption(' + qi + ',' + oi + ',this.parentElement,' + l.id + ')">' +
        '</label>';
    }
    html += '</div>';
  }
  html += '<div style="text-align:center;margin-top:16px">' +
    '<button type="button" class="run-btn" onclick="runQuiz(' + l.id + ')" style="display:inline-flex">✅ Verificar respuestas</button>' +
    '</div><div id="quiz-result-' + l.id + '" style="margin-top:16px"></div></div>';
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
  var l = lessonList().find(function(x) { return x.id === lid; });
  if (!l || !l.quiz) return;
  var correct = 0;
  var total = l.quiz.questions.length;
  var resultDiv = document.getElementById('quiz-result-' + lid);
  if (Object.keys(_quizAnswers[lid] || {}).length < total) {
    resultDiv.innerHTML = '<div class="quiz-score fail">Te faltan preguntas por responder.</div>';
    return;
  }
  var questionsDiv = document.querySelectorAll('#pane-ex .quiz-question');
  l.quiz.questions.forEach(function (q, qi) { if (_quizAnswers[lid][qi] === q.correct) correct++; });
  var pct = Math.round(correct / total * 100);
  var passed = correct >= l.quiz.passing;
  for (var qi = 0; qi < total; qi++) {
    var q = l.quiz.questions[qi];
    var selected = _quizAnswers[lid][qi];
    var qDiv = questionsDiv[qi];
    var opts = qDiv.querySelectorAll('.quiz-option');
    for (var pos = 0; pos < opts.length; pos++) {
      var oi = Number(opts[pos].dataset.oi);
      opts[pos].classList.add('disabled');
      var radio = opts[pos].querySelector('input');
      if (radio) radio.disabled = true;
      // Si no aprobó, la correcta queda sin marcar: el próximo intento tiene que salir de la memoria
      if (oi === q.correct && (passed || selected === q.correct)) { opts[pos].classList.add('correct'); }
      else if (oi === selected && selected !== q.correct) { opts[pos].classList.add('incorrect'); }
    }
    if (selected !== q.correct && q.why) qDiv.insertAdjacentHTML('beforeend', '<div class="quiz-why">💡 ' + q.why + '</div>');
  }
  var cls = passed ? 'pass' : 'fail';
  var emoji = passed ? '🎉' : '😔';
  resultDiv.innerHTML = '<div class="quiz-score ' + cls + '">' + emoji + ' Obtuviste ' + correct + ' de ' + total + ' (' + pct + '%) — ' + (passed ? '¡Aprobado!' : 'No alcanzó el mínimo') + '</div>' +
    (passed ? '<button type="button" class="quiz-retry-btn" onclick="retryQuiz(' + lid + ')" style="display:none">Reintentar</button>' : '<button type="button" class="quiz-retry-btn" onclick="retryQuiz(' + lid + ')">🔄 Reintentar</button>');
  if (fase === 1 && typeof Progress !== 'undefined' && Progress.saveAttempt) {
    Progress.saveAttempt({
      lessonId: lid,
      type: 'quiz',
      passed: passed,
      quizCorrect: correct,
      quizTotal: total,
      scorePercent: pct
    });
  }
  if (passed && fase === 1) {
    var prev = quizBestScores[lid] || 0;
    if (pct > prev) quizBestScores[lid] = pct;
    if (typeof Progress !== 'undefined' && Progress.saveQuizScores) {
      Progress.saveQuizScores(quizBestScores);
    }
  }
  if (passed && !doneSet().has(lid)) {
    doneSet().add(lid);
    saveDone();
    launchConfetti();
    buildSidebar();
    offerCertificate();
  }
  if (fase === 1 && typeof Ranking !== 'undefined' && Ranking.update) {
    Ranking.update([...done], quizBestScores, done.size === LESSONS.length);
  }
}

function offerCertificate() {
  if (fase === 2) {
    if (doneF2.size === LESSONS_F2.length && !fase2Meta.certShown) {
      fase2Meta.certShown = true;
      persistFase2();
      setTimeout(showCert2Overlay, 600);
    }
    return;
  }
  if (done.size === LESSONS.length && typeof Progress !== 'undefined' && !Progress.wasCertShown()) {
    Progress.markCertShown();
    setTimeout(function() { document.getElementById('grad-overlay').classList.add('show'); }, 600);
  }
}

function completeExercise() {
  if (fase === 2) {
    doneF2.add(LESSONS_F2[cur].id);
    saveDone();
    launchConfetti();
    buildSidebar();
    offerCertificate();
    return;
  }
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
  buildSidebar();
  offerCertificate();
}

function retryQuiz(lid) {
  _quizAnswers[lid] = {};
  var l = lessonList().find(function(x) { return x.id === lid; });
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
  if (lessonList()[cur].quiz) return;

  const code = document.getElementById('code-editor').value;
  keepDraft();
  const btn = document.getElementById('run-btn');
  const status = document.getElementById('run-status');
  const outArea = document.getElementById('out-area');

  btn.disabled = true;
  status.textContent = 'Ejecutando…';
  status.className = 'run-status';
  outArea.innerHTML = '';

  setTimeout(() => {
    try {
      const ex = lessonList()[cur].exercise;
      const expected = ex.expected.replace(/\\n/g,'\n').trimEnd();
      
      const res = localValidate(lessonList()[cur].id, code);
      const isGit = lessonList()[cur].id === 31 || lessonList()[cur].id === 33;
      const style = (!isGit && typeof styleNotes === 'function') ? styleNotes(code) : '';
      const styleBox = style ? `<div class="out-box box-expected"><div class="out-head">Buenas prácticas</div><div class="out-body style-note">${style}</div></div>` : '';

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
                ${res.suggest ? `<div class="compile-suggest">${esc(res.suggest)}</div>` : ''}
                <div class="gc-err-help"><button type="button" class="pr-link" onclick="JavaBot.openTopic('code')">🤖 Preguntarle al Profe Java por este error</button></div>
              </div>
            </div>
            <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
          </div>` + styleBox;
        failedRun();
      } else if (res.simulated) {
        var got = normalizeOutput(res.output);
        var wanted = normalizeOutput(expected);
        var consoleBox = esc(got ? got : '(no imprimió nada)');
        if (res.runtime) {
          if (res.blameLine) highlightErrorLine(res.blameLine);
          outArea.innerHTML = `
            <div class="cmp-grid">
              <div class="out-box box-err">
                <div class="out-head">Error al ejecutar</div>
                <div class="out-body">${got ? consoleBox : ''}<div class="compile-javac">${esc(res.runtime)}</div><div class="compile-why">El programa compiló, pero se detuvo en la línea ${res.blameLine}.</div><div class="gc-err-help"><button type="button" class="pr-link" onclick="JavaBot.openTopic('code')">🤖 Preguntarle al Profe Java por este error</button></div></div>
              </div>
              <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
            </div>` + styleBox;
          failedRun();
        } else if (got === wanted && res.conceptErr) {
          clearErrorLine();
          outArea.innerHTML = `
            <div class="cmp-grid">
              <div class="out-box box-err">
                <div class="out-head">La consola coincide, pero falta algo</div>
                <div class="out-body">${consoleBox}<div class="compile-suggest">${esc(res.conceptErr)}</div><div class="gc-err-help"><button type="button" class="pr-link" onclick="JavaBot.openTopic('code')">🤖 Preguntarle al Profe Java por este error</button></div></div>
              </div>
              <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
            </div>` + styleBox;
          failedRun();
        } else if (got === wanted) {
          clearErrorLine();
          completeExercise();
          outArea.innerHTML = `
            <div class="out-box box-ok"><div class="out-head">Correcto</div><div class="out-body">${esc(got)}</div></div>` + styleBox;
        } else {
          if (res.blameLine) highlightErrorLine(res.blameLine);
          else clearErrorLine();
          outArea.innerHTML = `
            <div class="cmp-grid">
              <div class="out-box box-err">
                <div class="out-head">Incorrecto</div>
                <div class="out-body">${consoleBox}${res.suggest ? `<div class="compile-why">La consola no coincide con lo que pide el ejercicio.</div><div class="compile-suggest">${esc(res.suggest)}</div>` : '<div class="compile-why">La consola no coincide con lo que pide el ejercicio.</div>'}<div class="gc-err-help"><button type="button" class="pr-link" onclick="JavaBot.openTopic('code')">🤖 Preguntarle al Profe Java por este error</button></div></div>
              </div>
              <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
            </div>` + styleBox;
          failedRun();
        }
      } else if (res.err) {
        if (res.line) highlightErrorLine(res.line);
        else clearErrorLine();
        outArea.innerHTML = `
          <div class="cmp-grid">
            <div class="out-box box-err"><div class="out-head">Incorrecto</div><div class="out-body">${esc(res.err)}<div class="gc-err-help"><button type="button" class="pr-link" onclick="JavaBot.openTopic('code')">🤖 Preguntarle al Profe Java por este error</button></div></div></div>
            <div class="out-box box-expected"><div class="out-head">Output esperado</div><div class="out-body">${esc(expected)}</div></div>
          </div>` + styleBox;
        failedRun();
      } else if (res.ok) {
        clearErrorLine();
        completeExercise();
        outArea.innerHTML = `
          <div class="out-box box-ok"><div class="out-head">Correcto</div><div class="out-body">${esc(res.output || expected)}</div></div>` + styleBox;
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

// ── Pistas ─────────────────────────────────────────────────────────────
var SOLUTION_AFTER = 3;
var failCount = 0;

function resetExerciseHelp() {
  hintLevel = 0;
  failCount = 0;
}

// La última pista de cada ejercicio trae la solución: se pide aparte, nunca llega sola.
// Lo anterior a la solución, como los errores comunes, sigue siendo una pista.
function splitLastHint(ex) {
  const last = ex.hints[ex.hints.length - 1];
  const at = last.search(/(<[^>]+>\s*)*(La solución|Solución)/);
  return at > 0 ? { guide: last.slice(0, at), solution: last.slice(at) } : { guide: '', solution: last };
}

function guideHints(ex) {
  const list = ex.hints.slice(0, -1);
  const last = splitLastHint(ex);
  if (last.guide.replace(/<[^>]+>/g, '').trim()) list.push(last.guide);
  const code = Practica.solutionText(ex);
  if (/\bclass\b/.test(code)) list.push('La estructura, para que completes lo que falta:<pre class="pr-pre">' + esc(Practica.skeleton(code)) + '</pre>');
  return list;
}

function paintHints() {
  const ex = lessonList()[cur].exercise;
  const hints = guideHints(ex);
  const ha = document.getElementById('hints-area');
  if (!ha) return;
  if (hintLevel) {
    let html = `<div class="hint-n">💡 Pista ${hintLevel} de ${hints.length}</div>`;
    for (let i = 0; i < hintLevel; i++) html += `<div class="hint-box">${hints[i]}</div>`;
    ha.innerHTML = html;
  }
  const sa = document.getElementById('solution-area');
  if (sa && failCount >= SOLUTION_AFTER && !sa.innerHTML) {
    sa.innerHTML = '<div class="btn-row"><button type="button" class="hint-btn" onclick="showSolution()">Ver una solución</button><span class="hint-n">Probá primero con las pistas: lo que resolvés por tu cuenta es lo que queda.</span></div>';
  }
}

function showHint() {
  const hints = guideHints(lessonList()[cur].exercise);
  if (hintLevel < hints.length) hintLevel++;
  paintHints();
}

function failedRun() {
  failCount++;
  showHint();
}

function showSolution() {
  const l = lessonList()[cur];
  document.getElementById('solution-area').innerHTML = '<div class="hint-box">' + splitLastHint(l.exercise).solution + '</div><div class="hint-n">Leela, cerrala y escribila de memoria. En unos días este ejercicio vuelve en tu repaso.</div>';
  Practica.noteHelp(l.id);
  paintSeguir();
}

// ── Init ───────────────────────────────────────────────────────────────
/** Replace in-memory progress with this user's merged state (never another user's). */
function applyUserProgress(state) {
  clearSessionProgress();
  var lessons = (state && state.completedLessons) || [];
  lessons.forEach(function (id) { done.add(id); });
  quizBestScores = Object.assign({}, (state && state.scores) || {});
  if (typeof Practica !== 'undefined') Practica.setState(state && state.practice);
  var f2 = (state && state.fase2) || {};
  doneF2 = new Set(f2.done || []);
  fase2Meta = { completionDate: f2.completionDate || null, certShown: !!f2.certShown, accredited: f2.accredited || null };
  restorePlace(state && state.place);
  if (typeof Progress !== 'undefined' && Progress.activeUid && Progress.activeUid()) {
    Progress.saveLocalCache(Progress.activeUid(), [...done], quizBestScores, {
      completionDate: state && state.completionDate,
      certShown: state && state.certShown
    });
  }
}

// Volver donde quedaste. Sin lugar guardado, a la primera lección sin completar
function restorePlace(place) {
  const indexOf = (list, id) => Math.max(0, list.findIndex(l => l.id === id));
  if (place) {
    curF1 = indexOf(LESSONS, place.f1);
    curF2 = indexOf(LESSONS_F2, place.f2);
    fase = place.fase === 2 && fase2Unlocked() ? 2 : 1;
    cur = fase === 2 ? curF2 : curF1;
    return;
  }
  cur = Math.max(0, nextLessonIndex());
  curF1 = cur;
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