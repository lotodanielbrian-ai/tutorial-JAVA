// Corre adentro de la página, con Firebase simulado. Lo inyecta tests/browser.js.
(function () {
  var log = [];
  var errors = [];
  window.addEventListener('error', function (e) { errors.push(e.message + ' @' + e.lineno); });
  // Los diálogos nativos ya no se usan: si alguno aparece, la prueba lo marca
  window.confirm = function (m) { errors.push('confirm nativo: ' + m); return true; };
  window.alert = function (m) { errors.push('alert nativo: ' + m); };
  window.print = function () {};
  function ok(c, m) { log.push((c ? 'ok    ' : 'FALLA ') + m); }
  function q(s) { return document.querySelector(s); }
  function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function setEd(code) { var e = document.getElementById('code-editor'); e.value = code; e.dispatchEvent(new Event('input')); }
  function unlockF1() { LESSONS.forEach(function (l) { done.add(l.id); }); }
  function idxF2(id) { return LESSONS_F2.findIndex(function (l) { return l.id === id; }); }
  function solutionOf(ex) {
    var tmp = document.createElement('div');
    tmp.innerHTML = ex.hints[ex.hints.length - 1];
    var blocks = tmp.querySelectorAll('.cblock-body');
    return blocks[blocks.length - 1].textContent;
  }

  // Cada vista deja la pantalla lista para la captura y para medir el ancho
  var VIEWS = {
    '#v-lesson': function () { goTo(6); },
    '#v-prac': function () { goTo(6); switchTab('prac'); },
    '#v-panel': function () { unlockF1(); buildSidebar(); Practica.showPanel(); },
    '#v-review': function () { goTo(0); Practica.saveScore('1-5', 0); Practica.saveScore('1-3', 0); forceDue(); Practica.startReview(); },
    '#v-sim': function () { Practica.startSimulacro('super', 10, true); },
    '#v-steps': function () { unlockF1(); showFase(2); goTo(idxF2(124)); switchTab('prac'); },
    '#v-pong': function () { Practica.startPingPong(1); Practica.pongReveal(); },
    '#v-practico': function () { unlockF1(); Practica.startPractico('f2'); },
    '#v-hints': async function () {
      goTo(6); switchTab('ex');
      for (var i = 0; i < 4; i++) { runCode(); await wait(450); }
    }
  };

  function forceDue() {
    var s = Practica.getState();
    Object.keys(s.reviews).forEach(function (k) { s.reviews[k].due = '2020-01-01'; });
  }

  async function resume() {
    ok(LESSONS[cur].id === 12, 'al reingresar vuelve a la lección donde quedó');
    switchTab('ex');
    ok(document.getElementById('code-editor').value.indexOf('// borrador de prueba') !== -1, 'al reingresar conserva el borrador');
  }

  async function offline() {
    for (var i = 0; i < 30 && !document.body.classList.contains('authed'); i++) await wait(100);
    ok(document.body.classList.contains('authed'), 'sin poder leer la nube, la app abre igual');
    ok(!!q('.lh-title'), 'sin poder leer la nube, la lección se ve');
    var note = document.getElementById('sync-note');
    ok(!!note && /no se pierde/.test(note.textContent), 'sin poder leer la nube, avisa que lo hecho no se pierde');
    ok(LESSONS[cur].id === 12, 'sin poder leer la nube, usa lo guardado en este navegador');
    ok(!window.__writes.some(function (w) { return w[0].indexOf('progress/u1') === 0 && w[1].completedLessons; }), 'sin poder leer la nube, no sube lecciones encima de las guardadas');
  }

  async function main() {
    await wait(300);
    var hash = location.hash;
    if (hash === '#resume') { await resume(); return; }
    if (hash === '#offline') { await offline(); return; }
    if (VIEWS[hash]) { await VIEWS[hash](); return; }

    ok(document.body.classList.contains('authed'), 'la app arranca con sesión');
    ok(qa('.tab-btn').length === 4, 'hay 4 pestañas');
    ok(!!q('.pr-ladder'), 'la escalera aparece en la Explicación Simple');
    ok(/Fase 1 · 35 lecciones/.test(q('.sb-sub').textContent), 'el costado dice la fase y sus lecciones');
    ok(/⏱ unos \d+ min/.test(q('.lh-stars').textContent), 'cada lección estima su duración');
    goTo(2);
    ok(q('.pr-ladder').textContent.indexOf('facturas') !== -1, 'la lección 3 (antes corta) tiene escalera');
    ok(q('#pane-simple').textContent.indexOf('Antes de leer') !== -1, 'la lección 3 abre con una pregunta previa');

    // Las lecciones 30 y 32 mostraban "undefined"
    goTo(29);
    ok(q('#pane-ex').textContent.indexOf('undefined') === -1, 'lección 30 sin undefined');
    goTo(31);
    ok(q('#pane-ex').textContent.indexOf('undefined') === -1, 'lección 32 sin undefined');

    // Ejercicio real con if: incorrecto y correcto
    goTo(6);
    setEd('public class Main {\n  public static void main(String[] a) {\n    int nota = 75;\n    System.out.println("Nota: " + nota);\n    System.out.println("Categoría: Bueno");\n  }\n}');
    runCode(); await wait(500);
    ok(q('#out-area').textContent.indexOf('falta algo') !== -1, 'L7 sin if: consola igual pero pide el concepto');
    ok(!done.has(7), 'L7 sin if no se aprueba');
    setEd('public class Main {\n  public static void main(String[] a) {\n    int nota = 75;\n    System.out.println("Nota: " + nota);\n    if (nota >= 90) { System.out.println("Categoría: Excelente"); }\n    else if (nota >= 75) { System.out.println("Categoría: Bueno"); }\n    else { System.out.println("Categoría: Regular"); }\n  }\n}');
    runCode(); await wait(500);
    ok(done.has(7), 'L7 con if se aprueba');
    ok(!!q('.box-ok'), 'muestra Correcto');

    // Error de ejecución real
    goTo(12);
    setEd('public class Main {\n  public static void main(String[] a) {\n    int[] numeros = {5, 2};\n    for (int i = 0; i <= numeros.length; i++) { System.out.println(numeros[i]); }\n  }\n}');
    runCode(); await wait(500);
    ok(q('#out-area').textContent.indexOf('ArrayIndexOutOfBounds') !== -1, 'muestra la excepción real');

    // Bucle infinito no cuelga
    goTo(10);
    setEd('public class Main {\n  public static void main(String[] a) {\n    int i = 1;\n    while (i <= 5) { System.out.println("x"); }\n  }\n}');
    runCode(); await wait(900);
    ok(/bucle|imprimió demasiado/.test(q('#out-area').textContent), 'el bucle infinito se detiene con aviso');

    // Lección 34: el código inicial no aprueba
    goTo(33);
    runCode(); await wait(500);
    ok(!done.has(34), 'L34 no aprueba con el código inicial');
    ok(q('#pane-ex').textContent.indexOf('Entrada simulada') !== -1, 'L34 muestra la entrada simulada');

    // Fallar no entrega la solución
    goTo(7);
    var sol8 = solutionOf(LESSONS[7].exercise);
    for (var f = 0; f < 8; f++) { runCode(); await wait(450); }
    var bodyLine = sol8.split('\n').filter(function (x) { return x.indexOf('case 7') !== -1; })[0].trim();
    ok(q('#hints-area').textContent.indexOf(bodyLine) === -1, 'ocho fallos no muestran la solución');
    ok(q('#hints-area').textContent.indexOf('Pista') !== -1, 'los fallos sí abren pistas');
    ok(q('#hints-area').textContent.indexOf('case ___') !== -1 || q('#hints-area').textContent.indexOf('// ...') !== -1, 'la última pista es la estructura con huecos');
    var offer = q('#solution-area button');
    ok(!!offer, 'después de varios intentos se ofrece ver la solución');
    offer.click();
    ok(q('#solution-area').textContent.indexOf('public class Main') !== -1, 'la solución aparece solo al pedirla');
    ok(Practica.getState().help[8] !== undefined, 'queda registrado que necesitó ayuda');
    ok(Practica.statusOf('x8') === 'wait', 'ese ejercicio vuelve en unos días');
    ok(!done.has(8), 'ver la solución no aprueba el ejercicio');

    // Lo escrito no se pierde
    goTo(6);
    setEd('// borrador en la lección 7\npublic class Main { }');
    switchTab('ex');
    Practica.showPanel();
    Practica.closeSimulacro();
    ok(document.getElementById('code-editor').value.indexOf('borrador en la lección 7') !== -1, 'cerrar Evaluaciones no borra el editor');
    ok(q('#tab-ex').classList.contains('active'), 'cerrar Evaluaciones no cambia de pestaña');
    goTo(8);
    goTo(6);
    ok(document.getElementById('code-editor').value.indexOf('borrador en la lección 7') !== -1, 'cambiar de lección conserva el borrador');
    resetCode();
    ok(document.getElementById('code-editor').value === LESSONS[6].exercise.starter, 'Resetear vuelve al código inicial');
    goTo(8);
    goTo(6);
    ok(document.getElementById('code-editor').value === LESSONS[6].exercise.starter, 'Resetear también borra el borrador');

    // Quiz: exige responder todo
    goTo(13);
    runQuiz(14);
    ok(q('#quiz-result-14').textContent.indexOf('faltan') !== -1, 'el quiz exige todas las respuestas');

    // Reprobar: se explica el error, sin marcar la correcta para el próximo intento
    var quiz14 = LESSONS[13].quiz.questions;
    quiz14.forEach(function (qq, i) {
      var wrong = qa('#pane-ex .quiz-question')[i].querySelector('.quiz-option:not([data-oi="' + qq.correct + '"])');
      wrong.click();
    });
    runQuiz(14);
    ok(q('#quiz-result-14').textContent.indexOf('No alcanzó') !== -1, 'reprobar el cuestionario');
    ok(!q('#pane-ex .quiz-option.correct'), 'al reprobar no se marca la correcta');
    ok(q('#pane-ex .quiz-option input').disabled === true, 'runQuiz deshabilita los inputs radio');
    ok(qa('#pane-ex .quiz-why').length === quiz14.length, 'cada error trae su explicación');
    retryQuiz(14);
    ok(!q('#pane-ex .quiz-why') && !done.has(14), 'reintentar limpia la pantalla');
    goTo(13);

    // Práctica: cada tipo
    goTo(0);
    switchTab('prac');
    ok(qa('#pane-prac .pr-item').length === 11, 'L1 muestra 11 actividades');
    Practica.check('1-0');
    ok(q('#pr-fb-1-0').textContent.indexOf('Respondé') !== -1, 'avisa si no respondés');
    qa('#pr-1-0 .pr-opt').filter(function (b) { return b.dataset.v === '0'; })[0].click();
    Practica.check('1-0');
    ok(q('#pr-fb-1-0').className.indexOf('good') !== -1, 'mc correcta');
    qa('#pr-1-1 .pr-opt')[PRACTICA[1].items[1].a ? 0 : 1].click();
    Practica.check('1-1');
    ok(q('#pr-fb-1-1').className.indexOf('good') !== -1, 'verdadero o falso');
    var it = PRACTICA[1].items[2];
    it.pairs.forEach(function (p, i) { document.getElementById('pr-in-1-2-' + i).value = String(i); });
    Practica.check('1-2');
    ok(q('#pr-fb-1-2').className.indexOf('good') !== -1, 'unir');
    document.getElementById('pr-in-1-3').value = 'Hola che!\nChau';
    Practica.check('1-3');
    ok(q('#pr-fb-1-3').className.indexOf('good') !== -1, 'qué imprime');
    document.getElementById('pr-in-1-4-0').value = 'main';
    document.getElementById('pr-in-1-4-1').value = 'println';
    Practica.check('1-4');
    ok(q('#pr-fb-1-4').className.indexOf('good') !== -1, 'completar');
    qa('#pr-1-5 .pr-line')[0].click();
    Practica.check('1-5');
    ok(q('#pr-fb-1-5').className.indexOf('warn') !== -1, 'error: primer intento fallido da otra oportunidad');
    qa('#pr-1-5 .pr-line')[0].click();
    Practica.check('1-5');
    ok(q('#pr-fb-1-5').className.indexOf('bad') !== -1, 'error: segundo intento revela la respuesta');
    ok(Practica.getState().wrong.indexOf('1-5') !== -1, 'el fallo queda en el repaso');
    var guard = 0;
    while (guard++ < 200) {
      var rows = qa('#pr-1-7 .pr-ord-row code').map(function (c) { return c.textContent; });
      var want = PRACTICA[1].items[7].lines;
      var at = rows.findIndex(function (r, i) { return r !== want[i]; });
      if (at < 0) break;
      Practica.move('1-7', rows.indexOf(want[at]), -1);
    }
    Practica.check('1-7');
    ok(q('#pr-fb-1-7').className.indexOf('good') !== -1, 'ordenar');

    // Respuesta abierta: una palabra no alcanza y decide quien responde
    document.getElementById('pr-in-1-8').value = 'compila';
    Practica.check('1-8');
    ok(q('#pr-fb-1-8').className.indexOf('warn') !== -1 && Practica.getState().scores['1-8'] === undefined, 'una sola palabra no se acepta');
    document.getElementById('pr-in-1-8').value = 'creo que el programa se traduce y después corre en la máquina';
    Practica.check('1-8');
    ok(q('#pr-fb-1-8').textContent.indexOf('Comparala') !== -1 && qa('#pr-fb-1-8 .pr-link').length === 3, 'muestra la respuesta para comparar y tres opciones');
    Practica.rate('1-8', 1);
    ok(q('#pr-fb-1-8').className.indexOf('good') !== -1 && Practica.getState().scores['1-8'] === 1, 'autoevaluación');

    document.getElementById('pr-in-1-9').value = PRACTICA[1].items[9].solution;
    Practica.runReto('1-9');
    ok(q('#pr-fb-1-9').className.indexOf('good') !== -1, 'reto de código correcto');
    ok(q('#pr-header').textContent.indexOf('%') !== -1, 'la barra de dominio se actualiza');

    // La Práctica recuerda lo que hiciste
    goTo(1); goTo(0);
    switchTab('prac');
    var visible = function (k) { var el = document.getElementById('pr-' + k); return !!el && el.getBoundingClientRect().height > 0; };
    ok(!visible('1-0'), 'lo resuelto se oculta al volver');
    ok(!visible('1-5'), 'lo fallado espera y no se puede repetir enseguida');
    ok(visible('1-6'), 'lo pendiente sigue a la vista');
    q('.pr-filter input').click();
    ok(visible('1-0') && visible('1-5'), 'el filtro muestra lo resuelto y lo que espera');
    ok(q('#pr-1-5').textContent.indexOf('Vuelve el') !== -1, 'lo fallado dice cuándo vuelve');
    ok(document.getElementById('pr-1-5').querySelector('fieldset').disabled, 'lo fallado queda bloqueado hasta su fecha');
    ok(q('#pr-1-0').textContent.indexOf('Resuelta') !== -1, 'lo acertado dice que está resuelto');
    q('.pr-filter input').click();

    // Repaso por fechas
    ok(q('#btn-seguir').textContent.indexOf('lección') !== -1, 'sin repasos vencidos, Seguir propone una lección');
    forceDue();
    buildSidebar();
    ok(q('#btn-seguir').textContent.indexOf('repasar') !== -1, 'con repasos vencidos, Seguir propone repasar');
    Practica.showPanel();
    ok(q('#sim-box').textContent.indexOf('Repasar ahora') !== -1, 'el panel Hoy ofrece el repaso');
    ok(qa('#sim-box .pr-map li').length >= 3, 'el panel muestra el mapa de dominio');
    Practica.startReview();
    await wait(50);
    var cards = qa('#sim-box .pr-item');
    ok(cards.length > 0 && cards.length <= 15, 'el repaso arma una tanda de hasta 15');
    ok(!q('#pane-prac .pr-item'), 'durante el repaso no hay ids repetidos');
    var bugCard = q('#sim-box #pr-1-5');
    if (bugCard) {
      qa('#sim-box #pr-1-5 .pr-line')[0].click();
      Practica.check('1-5');
      ok(q('#sim-box #pr-fb-1-5').className.indexOf('bad') !== -1, 'en el repaso vale el primer intento');
    }
    Practica.finishReview();
    ok(q('#sim-box').textContent.indexOf('Repaso terminado') !== -1, 'el repaso muestra un resumen');
    Practica.closeSimulacro();
    ok(!!q('#pane-prac #pr-header'), 'al cerrar, la Práctica se vuelve a dibujar');

    // Simulacro con la lección abierta: las respuestas deben leerse del simulacro
    goTo(0);
    Practica.startSimulacro('super', 30, false);
    await wait(50);
    ok(!qa('#sim-box .pr-item textarea[placeholder*="compañero"]').length, 'el simulacro no incluye respuestas abiertas');
    var outKey = qa('#sim-box .pr-item').map(function (c) { return c.id.replace('pr-', ''); }).filter(function (k) { return k === '1-3'; })[0];
    if (outKey) {
      q('#sim-box #pr-in-1-3').value = 'Hola che!\nChau';
      Practica.finishExam(true);
      await wait(30);
      ok(q('#sim-box #pr-fb-1-3').className.indexOf('good') !== -1, 'el simulacro corrige lo escrito en el simulacro, no en la lección de atrás');
    } else {
      log.push('      (sin 1-3 en la muestra)');
      Practica.finishExam(true);
    }
    Practica.closeSimulacro();
    goTo(0); switchTab('prac');

    Practica.showPanel();
    ok(q('#sim-overlay').classList.contains('show'), 'abre Evaluaciones');
    Practica.startSimulacro('super', 10, true);
    await wait(50);
    ok(qa('#sim-box .pr-item').length === 10, 'simulacro de 10 preguntas');
    ok(!qa('#sim-box .pr-check').length, 'el simulacro no da ayuda hasta el final');
    // Entregar con preguntas en blanco pregunta con un diálogo del sitio, no del navegador
    Practica.finishExam(false);
    await wait(50);
    var dlg = q('.ui-dialog');
    ok(!!dlg && dlg.getAttribute('role') === 'alertdialog' && dlg.getAttribute('aria-modal') === 'true', 'entregar en blanco abre un diálogo propio y accesible');
    ok(!!dlg && dlg.contains(document.activeElement), 'el foco entra al diálogo');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await wait(50);
    ok(!q('.ui-dialog') && !q('#sim-box .sim-result'), 'Escape cancela y deja seguir respondiendo');
    Practica.finishExam(false);
    await wait(50);
    q('.ui-dialog [data-act="ok"]').click();
    await wait(50);
    ok(!q('.ui-dialog'), 'el diálogo se cierra al entregar');
    var writesBeforeReset = window.__writes.length;
    resetGlobalProgress();
    await wait(50);
    ok(!!q('.ui-dialog.is-danger') && document.activeElement === q('.ui-dialog [data-act="cancel"]'), 'borrar el progreso pregunta con un diálogo propio, y el foco arranca en Cancelar');
    q('.ui-dialog [data-act="cancel"]').click();
    await wait(50);
    ok(!q('.ui-dialog') && window.__writes.length === writesBeforeReset, 'cancelar no borra nada');
    ok(!!q('#sim-box .sim-result'), 'muestra la nota');
    ok(Practica.getState().sims.length >= 1, 'guarda el simulacro');
    ok(q('#pane-prac') !== null && !q('#pane-prac .pr-item'), 'durante el simulacro no hay ids repetidos');
    Practica.closeSimulacro();
    var blankOk = false;
    for (var tryN = 0; tryN < 40 && !blankOk; tryN++) {
      Practica.startSimulacro('todo', 30, false);
      var bl = q('#sim-box .pr-blank');
      if (bl) { var cs = getComputedStyle(bl); blankOk = cs.paddingTop === '1px' && cs.marginBottom === '0px' && bl.offsetHeight < 30; }
      Practica.closeSimulacro();
    }
    ok(blankOk, 'los huecos del simulacro tienen tamaño normal');
    await wait(1800);
    ok(window.__writes.some(function (w) { return w[0].indexOf('progress/u1') === 0 && w[1].practice && w[1].practice.reviews; }), 'la práctica y sus fechas se sincronizan con Firestore');

    // Ping-pong oral
    Practica.startPingPong(1);
    ok(q('#sim-box').textContent.indexOf('voz alta') !== -1, 'el ping-pong pide responder en voz alta');
    var cardsPong = Number(/de (\d+)/.exec(q('#sim-box .pr-num').textContent)[1]);
    for (var p = 0; p < cardsPong; p++) { Practica.pongReveal(); Practica.pongRate(p % 2 ? 1 : 0.5); }
    ok(q('#sim-box').textContent.indexOf('Repaso terminado') !== -1, 'el ping-pong termina con un resumen');
    Practica.closeSimulacro();

    // Búsqueda
    var search = document.getElementById('search-input');
    search.value = 'charat';
    filterLessons(search.value);
    var found = qa('.lb').filter(function (b) { return !b.classList.contains('hidden'); }).map(function (b) { return b.dataset.id; });
    ok(found.length === 1 && found[0] === '4', 'la búsqueda encuentra temas que no están en el título');
    search.value = '';
    filterLessons('');

    // La pestaña Práctica se ve en todas las lecciones, también las de cuestionario
    var hidden = [];
    LESSONS.forEach(function (l, i) {
      goTo(i);
      switchTab('prac');
      var pane = document.getElementById('pane-prac');
      if (pane.parentElement.id !== 'main' || !pane.getBoundingClientRect().height) hidden.push(l.id);
    });
    ok(!hidden.length, 'Práctica visible en las 35 lecciones ' + hidden.join(','));
    goTo(0);

    // Fase 2 bloqueada mientras falte la Fase 1
    showFase(2);
    ok(fase === 1 && q('#main').textContent.indexOf('Se desbloquea') !== -1, 'Fase 2 bloqueada muestra el recorrido');
    ok(qa('.f2-roadmap li').length === LESSONS_F2.length, 'el recorrido lista las lecciones');
    showFase(1);
    ok(!!q('.tab-btn'), 'el botón Fase 1 vuelve desde la vista bloqueada');

    // Prueba de nivel
    Practica.startNivel();
    ok(qa('#sim-box .pr-item').length === 30, 'la prueba de nivel tiene 30 preguntas');
    Practica.finishExam(true);
    ok(!fase2Unlocked(), 'reprobar la prueba de nivel no abre la Fase 2');
    Practica.closeSimulacro();
    accreditFase2();
    ok(fase2Unlocked() && done.size < LESSONS.length, 'aprobar la prueba abre la Fase 2 sin marcar lecciones');
    showFase(2);
    ok(fase === 2, 'la Fase 2 abre con la prueba de nivel');
    showFase(1);
    search.value = 'swagger';
    filterLessons(search.value);
    ok(!q('#sb-cross').hidden && q('#sb-cross button').textContent.indexOf('Fase 2') !== -1, 'la búsqueda en Fase 1 avisa coincidencias en Fase 2');
    q('#sb-cross button').click();
    ok(fase === 2 && qa('.lb:not(.hidden)').length >= 1, 'el aviso cross-fase cambia a Fase 2 filtrada');
    search.value = '';
    filterLessons('');
    showFase(1);
    fase2Meta.accredited = null;
    persistFase2();

    // Certificado al final por quiz
    LESSONS.forEach(function (l) { if (l.id !== 14) done.add(l.id); });
    goTo(13);
    for (var i = 0; i < 5; i++) { qa('#pane-ex .quiz-question')[i].querySelector('.quiz-option[data-oi="' + LESSONS[13].quiz.questions[i].correct + '"]').click(); }
    runQuiz(14);
    await wait(800);
    ok(q('#grad-overlay').classList.contains('show'), 'el certificado aparece al terminar con un quiz');
    ok(q('#cert-print').textContent.indexOf('JAMES GOSLING') !== -1, 'el primer certificado conserva su firma');
    q('#grad-overlay button[aria-label="Cerrar"]').click();
    ok(!q('#grad-overlay').classList.contains('show'), 'el certificado se puede cerrar con su botón');

    // Fase 2 desbloqueada
    var cert1Html = q('#cert-print').innerHTML;
    var doneBefore = done.size;
    var writesBefore = window.__writes.filter(function (w) { return w[0].indexOf('rankings') === 0; }).length;
    showFase(2);
    ok(fase === 2 && q('.sidebar').textContent.indexOf('Código limpio') !== -1, 'Fase 2 abre con su propio temario');
    ok(/Fase 2 · 25 lecciones/.test(q('.sb-sub').textContent), 'el costado dice las lecciones de la Fase 2');
    var bad = [];
    LESSONS_F2.forEach(function (l, i) {
      goTo(i);
      var txt = q('#main').textContent;
      if (txt.indexOf('undefined') !== -1 || txt.indexOf('[object') !== -1) bad.push(l.id);
      if (!q('.pr-ladder')) bad.push('escalera ' + l.id);
      if (qa('#pane-prac .pr-item').length < 2) bad.push('practica ' + l.id);
      switchTab('prac');
      var prac = document.getElementById('pane-prac');
      if (prac.parentElement.id !== 'main' || !prac.getBoundingClientRect().height) bad.push('oculta ' + l.id);
      switchTab('simple');
    });
    ok(!bad.length, 'las 25 lecciones renderizan completas ' + bad.join(','));

    // Volver a la Fase 2 respeta el lugar
    goTo(idxF2(118));
    showFase(1);
    showFase(2);
    ok(LESSONS_F2[cur].id === 118, 'volver a la Fase 2 abre la última lección vista');

    // Pasos verificables
    goTo(idxF2(124));
    switchTab('prac');
    var stepKey = PRACTICA[124].items.map(function (x, i) { return x.t === 'step' ? '124-' + i : null; }).filter(Boolean)[0];
    ok(!!document.getElementById('pr-' + stepKey), 'la lección 124 tiene pasos verificables');
    ok(q('#pr-' + stepKey).textContent.indexOf('docker version') !== -1, 'el primer paso comprueba Docker');
    Practica.stepOk(stepKey);
    ok(q('#pr-fb-' + stepKey).className.indexOf('good') !== -1 && Practica.getState().scores[stepKey] === 1, 'un paso se marca como comprobado');
    goTo(idxF2(123));
    goTo(idxF2(124));
    switchTab('prac');
    ok(Practica.statusOf(stepKey) === 'solved', 'el paso queda hecho al volver');
    ok(Practica.dueKeys().indexOf(stepKey) === -1, 'un paso no vuelve al repaso');

    goTo(0);
    setEd(LESSONS_F2[0].exercise.starter);
    runCode(); await wait(500);
    ok(q('#out-area').textContent.indexOf('falta algo') !== -1, 'F2: el código sin refactorizar no aprueba');
    setEd(solutionOf(LESSONS_F2[0].exercise));
    runCode(); await wait(500);
    ok(doneF2.has(101), 'F2: la solución aprueba');
    ok(done.size === doneBefore, 'F2 no toca el progreso de la Fase 1');

    // Quiz: la correcta no queda siempre en la misma posición
    var primeras = {};
    for (var vuelta = 0; vuelta < 12; vuelta++) {
      goTo(3);
      var ops = q('#pane-ex .quiz-question .quiz-option');
      if (ops) primeras[ops.dataset.oi] = 1;
    }
    ok(Object.keys(primeras).length > 1, 'los cuestionarios mezclan las opciones');
    goTo(0);

    // Laboratorio
    var idx = idxF2(112);
    goTo(idx); switchTab('prac');
    var labKey = PRACTICA[112].items.map(function (x, i) { return x.t === 'http' ? '112-' + i : null; }).filter(Boolean)[0];
    document.getElementById('lab-m-' + labKey).value = 'POST';
    document.getElementById('lab-b-' + labKey).value = '{"nombre":"Mate","precio":900,"stock":4}';
    Practica.sendHttp(labKey);
    ok(q('#pr-fb-' + labKey).textContent.indexOf('201') !== -1 && q('#pr-fb-' + labKey).className.indexOf('good') !== -1, 'laboratorio: POST da 201 y cumple el objetivo');

    // Quiz de F2 sin ranking
    idx = idxF2(104);
    goTo(idx);
    LESSONS_F2[idx].quiz.questions.forEach(function (qq, i) { qa('#pane-ex .quiz-question')[i].querySelector('.quiz-option[data-oi="' + qq.correct + '"]').click(); });
    runQuiz(104);
    ok(doneF2.has(104), 'F2: quiz aprobado');
    ok(window.__writes.filter(function (w) { return w[0].indexOf('rankings') === 0; }).length === writesBefore, 'F2 no escribe en el ranking');

    // Simulacro y panel de F2
    Practica.showPanel();
    ok(q('#sim-tramo').textContent.indexOf('Fase 2') !== -1, 'Evaluaciones ofrece tramos de Fase 2');
    Practica.startSimulacro('f2todo', 10, false);
    await wait(50);
    ok(qa('#sim-box .pr-item').length === 10, 'simulacro de Fase 2');
    Practica.closeSimulacro();

    // Parcial práctico: se ejecuta, pero la nota se pone al entregar
    Practica.startPractico('f2');
    await wait(50);
    ok(qa('#sim-box .pr-item').length === 3, 'el parcial práctico tiene 3 ejercicios');
    ok(!!q('#sim-clock').textContent, 'el parcial práctico corre con reloj');
    ok(!qa('#sim-box .hint-btn').some(function (b) { return b.textContent.indexOf('Pista') !== -1; }), 'el parcial práctico no da pistas');
    var keyP = qa('#sim-box .pr-item')[0].id.replace('pr-', '');
    var itemP = Practica.itemOf(keyP);
    q('#sim-box #pr-in-' + keyP).value = itemP.solution;
    Practica.runReto(keyP);
    ok(q('#sim-box #pr-fb-' + keyP).textContent.indexOf('coincide') !== -1, 'ejecutar muestra la consola');
    ok(Practica.getState().scores[keyP] === undefined, 'ejecutar no pone nota');
    Practica.finishExam(true);
    ok(q('#sim-box #pr-fb-' + keyP).className.indexOf('good') !== -1, 'al entregar se corrige el código');
    ok(/1 de 3|2 de 3|3 de 3/.test(q('#sim-box .sim-result').textContent), 'la nota cuenta los ejercicios');
    Practica.closeSimulacro();

    // Segundo certificado
    LESSONS_F2.forEach(function (l) { doneF2.add(l.id); });
    var lastQuiz = LESSONS_F2[LESSONS_F2.length - 1];
    doneF2.delete(lastQuiz.id);
    goTo(LESSONS_F2.length - 1);
    lastQuiz.quiz.questions.forEach(function (qq, i) { qa('#pane-ex .quiz-question')[i].querySelector('.quiz-option[data-oi="' + qq.correct + '"]').click(); });
    runQuiz(lastQuiz.id);
    await wait(800);
    ok(q('#sim-overlay').classList.contains('show') && !!q('#cert2-name'), 'al terminar se ofrece el segundo certificado');
    q('#cert2-name').value = 'Ana Prueba';
    generateCert2();
    var printing = q('#cert-print').textContent;
    ok(printing.indexOf('FASE 2') !== -1 && printing.indexOf('Ana Prueba') !== -1 && printing.indexOf('Spring Boot') !== -1 && printing.indexOf('GOSLING') === -1, 'el segundo certificado muestra el avance');
    await wait(1700);
    ok(q('#cert-print').innerHTML === cert1Html, 'el primer certificado queda intacto');
    ok(window.__writes.some(function (w) { return w[0].indexOf('progress/u1') === 0 && w[1].fase2 && w[1].fase2.done.length === LESSONS_F2.length; }), 'el avance de Fase 2 se guarda en Firestore');
    q('#sim-overlay').classList.remove('show');

    // Guía 0 Conocimiento y Bot Profe Java
    showFase(1);
    goTo(0);
    ok(!!q('.gc-card') && q('#pane-simple').textContent.indexOf('Ejemplo del día a día') !== -1, 'la guía Qué/Por qué/Para qué y ejemplo del día a día se ven en Explicación Simple');
    ok(!!q('.app-fig svg'), 'la figura SVG didáctica se muestra en la app principal');
    ok(!!q('.gc-tip') && q('#pane-tut').textContent.indexOf('Buena práctica profesional') !== -1, 'la buena práctica se ve en Tutorial Técnico');
    ok(!!q('#java-bot-fab'), 'el botón flotante del Profe Java está visible');
    q('#java-bot-fab').click();
    ok(!q('#java-bot-panel').hidden, 'el bot abre su panel');
    q('#java-bot-panel .bot-chip[data-topic="lesson"]').click();
    ok(q('#java-bot-msgs').textContent.indexOf('Qué hacés') !== -1, 'el chip ¿Qué hago y para qué? responde con la lección actual');
    q('#java-bot-panel .bot-chip[data-topic="tip"]').click();
    ok(q('#java-bot-msgs').textContent.indexOf('Buena práctica') !== -1, 'el chip Buenas prácticas responde con consejos');
    q('#java-bot-input').value = 'equals vs ==';
    q('#java-bot-form').dispatchEvent(new Event('submit', { cancelable: true }));
    ok(q('#java-bot-msgs').textContent.indexOf('.equals()') !== -1, 'el bot responde preguntas escritas del usuario');
    q('#java-bot-close').click();
    ok(q('#java-bot-panel').hidden, 'el bot se cierra correctamente');

    // Prepara el reingreso que comprueba tests/browser.js
    showFase(1);
    goTo(11);
    switchTab('ex');
    setEd('// borrador de prueba\n' + LESSONS[11].exercise.starter);
    goTo(11);
    await wait(100);
  }

  main().catch(function (e) { errors.push('EXC ' + e.message + ' ' + (e.stack || '').slice(0, 300)); }).finally(function () {
    var pre = document.createElement('pre');
    pre.id = '__result';
    pre.style.display = 'none';
    pre.textContent = log.join('\n') + '\nerrores JS: ' + JSON.stringify(errors);
    document.body.appendChild(pre);
  });
})();
