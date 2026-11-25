// Pruebas del tutorial. Uso: node tests/run.js  (requiere Node y un JDK en el PATH)
// 1. Datos: forma de lecciones y actividades.
// 2. Soluciones oficiales: compilan, imprimen el output esperado y el validador las aprueba.
// 3. Código de las actividades: las respuestas coinciden con lo que hace Java de verdad.
// 4. Intérprete: JavaRun da el mismo resultado que javac/java en todo el corpus.
// 5. Validador: los programas incorrectos se rechazan.
// 6. Memoria del alumno: fechas de repaso, combinación de dispositivos y pistas.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(__dirname, '.tmp');
const CASES = path.join(TMP, 'cases');
const only = process.argv[2] || '';

const ctx = { console };
vm.createContext(ctx);
function load(file) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), ctx, { filename: file });
}
['public/js/lessons.js', 'public/js/javarun.js', 'public/js/validate.js'].forEach(load);
vm.runInContext('this.LESSONS = LESSONS;', ctx);
for (const f of fs.readdirSync(path.join(ROOT, 'public/js')).sort()) {
  if (/^(practica-|fase2-).*\.js$/.test(f)) load('public/js/' + f);
}
load('public/js/apilab.js');
load('public/js/practica.js');
load('public/js/guia-cero.js');
load('public/js/bot.js');
load('public/js/manual-figuras.js');
load('public/js/manual-contenido.js');
vm.runInContext('this.LESSONS_F2 = LESSONS_F2;', ctx);
const LESSONS_F1 = ctx.LESSONS;
const LESSONS = LESSONS_F1.concat(ctx.LESSONS_F2);
const PRACTICA = vm.runInContext('typeof PRACTICA === "undefined" ? {} : PRACTICA', ctx);

let failures = 0;
let checks = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { failures++; console.log('  FALLA: ' + msg); }
}

const unhtml = s => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
function codeBlocks(html) {
  const out = [];
  const re = /<div class="cblock-body">([\s\S]*?)<\/div><\/div>/g;
  let m;
  while ((m = re.exec(html))) out.push(unhtml(m[1]));
  return out;
}
const wrap = body => (/\bclass\s+\w+/.test(body) ? body : 'public class Main {\n  public static void main(String[] args) {\n' + body + '\n  }\n}\n');
const norm = s => String(s == null ? '' : s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\s+$/, '');

// ── Registro de programas para el oráculo ──────────────────────────────
const programs = [];
function addProgram(tag, code, stdin) {
  const p = { tag: String(programs.length).padStart(4, '0') + '_' + tag.replace(/[^A-Za-z0-9_]/g, '_'), code, stdin };
  programs.push(p);
  return p;
}

// Una etiqueta desconocida se traga el texto: ArrayList<int> se mostraba como ArrayList
const HTML_TAGS = new Set('a b br code div em h3 h4 h5 i input label li ol p pre small span strong sub sup table tbody td th thead tr u ul'.split(' '));
function checkHtml(html, at) {
  if (typeof html !== 'string') return;
  const open = [];
  const re = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[2].toLowerCase();
    if (tag === 'br' || tag === 'input') continue;
    ok(HTML_TAGS.has(tag), at + ': etiqueta desconocida <' + tag + '>. Escribí &lt; si es código');
    if (!HTML_TAGS.has(tag)) continue;
    if (!m[1]) open.push(tag);
    else ok(open.pop() === tag, at + ': </' + tag + '> sin abrir');
  }
  ok(!open.length, at + ': sin cerrar ' + open.join(','));
}

// ── 1. Datos ───────────────────────────────────────────────────────────
function checkData() {
  console.log('1. Datos');
  const ids = LESSONS.map(l => l.id);
  ok(new Set(ids).size === ids.length, 'ids de lección repetidos');
  for (const l of LESSONS) {
    [l.desc, l.simple(), l.tutorial()].forEach(h => checkHtml(h, 'lección ' + l.id));
    if (l.exercise) [l.exercise.desc].concat(l.exercise.hints).forEach(h => checkHtml(h, 'ejercicio ' + l.id));
    if (l.quiz) l.quiz.questions.forEach(q => [q.question].concat(q.options).forEach(h => checkHtml(h, 'cuestionario ' + l.id)));
    ok(!!l.exercise !== !!l.quiz, 'lección ' + l.id + ' debe tener exercise o quiz');
    if (l.quiz) {
      ok(l.quiz.passing <= l.quiz.questions.length, 'lección ' + l.id + ': passing mayor que la cantidad de preguntas');
      l.quiz.questions.forEach((q, i) => {
        ok(typeof q.question === 'string' && q.question.length > 3, 'lección ' + l.id + ' pregunta ' + i + ' sin texto');
        ok(q.correct >= 0 && q.correct < q.options.length, 'lección ' + l.id + ' pregunta ' + i + ': correct fuera de rango');
        ok(q.why, 'lección ' + l.id + ' pregunta ' + i + ': un cuestionario tiene que explicar el porqué');
        checkHtml(q.why, 'cuestionario ' + l.id);
      });
    }
    if (l.exercise && l.id > 100) ok(l.exercise.need && l.exercise.need.length, 'lección ' + l.id + ': faltan los conceptos a exigir');
    if (l.exercise) ok(l.exercise.expected.length > 0, 'lección ' + l.id + ': expected vacío deja aprobar sin programar');
    const r = l.exercise && !l.exercise.gitOnly ? ctx.localValidate(l.id, l.exercise.starter) : null;
    if (r) {
      const passes = r.ok || (r.simulated && !r.runtime && !r.conceptErr && norm(r.output) === norm(l.exercise.expected));
      ok(!passes, 'lección ' + l.id + ': el código inicial sin tocar aprueba');
    }
  }
  ok(LESSONS_F1.length === 35, 'la Fase 1 debe seguir con 35 lecciones: el certificado y el ranking dependen de eso');
  const tfs = Object.keys(PRACTICA).flatMap(id => (PRACTICA[id].items || []).filter(it => it.t === 'tf'));
  const trues = tfs.filter(it => it.a).length / tfs.length;
  ok(trues > 0.4 && trues < 0.6, 'verdadero o falso desparejo: responder siempre lo mismo no debe alcanzar. Verdaderos: ' + Math.round(trues * 100) + '%');
  ok(LESSONS_F1.every(l => l.id < 100) && ctx.LESSONS_F2.every(l => l.id > 100), 'los ids de cada fase no deben cruzarse');
  const validTypes = ['mc', 'tf', 'fill', 'bug', 'output', 'order', 'match', 'short', 'code', 'http', 'step'];
  const seen = {};
  for (const id of Object.keys(PRACTICA)) {
    const p = PRACTICA[id];
    ok(LESSONS.some(l => String(l.id) === id), 'PRACTICA[' + id + '] no corresponde a una lección');
    ok(p.escalera && ['vida', 'modelo', 'pseudo', 'java', 'real'].every(k => p.escalera[k]), 'lección ' + id + ': escalera incompleta');
    ok(Array.isArray(p.antes) && p.antes.length === 2 && p.antes[0] && p.antes[1], 'lección ' + id + ': falta pregunta previa (antes)');
    ok(Array.isArray(p.objetivos) && p.objetivos.length >= 2, 'lección ' + id + ': faltan objetivos');
    ok(Array.isArray(p.items) && p.items.length >= 6, 'lección ' + id + ': faltan actividades (mínimo 6, tiene ' + (p.items || []).length + ')');
    (p.items || []).forEach((it, i) => {
      const at = 'lección ' + id + ' ítem ' + i + ' (' + it.t + ')';
      ok(validTypes.includes(it.t), at + ': tipo desconocido');
      ok(it.q || it.t === 'code', at + ': sin consigna');
      [it.q, it.why, it.hint, it.task, it.model, it.do, it.ok, it.fail].concat(it.o || []).forEach(h => checkHtml(h, at));
      if (it.t === 'order') ok(new Set(it.lines).size === it.lines.length, at + ': líneas repetidas: no se puede corregir por posición');
      if (it.t === 'http') {
        const server = ctx.ApiLab.seed();
        let res = null;
        it.demo.forEach(step => { res = Object.assign({ method: step[0], url: step[1] }, ctx.ApiLab.handle(server, step[0], step[1], step[2] || '')); });
        ok(ctx.ApiLab.reached(it, res), at + ': el objetivo no se alcanza: ' + JSON.stringify(res).slice(0, 160));
      }
      ok(it.why || it.t === 'code', at + ': sin explicación');
      const key = it.t + '|' + (it.q || it.title || '') + '|' + (it.code || '');
      ok(!seen[key], at + ': repetido con ' + seen[key]);
      seen[key] = at;
      if (it.t === 'mc') {
        ok(it.o.length >= 3 && it.a >= 0 && it.a < it.o.length, at + ': opciones o respuesta inválida');
        ok(new Set(it.o).size === it.o.length, at + ': opciones repetidas');
        const sizes = it.o.map(o => unhtml(o).length);
        const others = sizes.filter((_, n) => n !== it.a);
        ok(sizes[it.a] < 1.4 * Math.max(...others), at + ': la correcta se delata por ser mucho más larga');
      }
      if (it.t === 'mc' || it.t === 'bug') ok(it.hint, at + ': el segundo intento necesita una pista propia');
      if (it.t === 'tf') ok(typeof it.a === 'boolean', at + ': a debe ser boolean');
      if (it.t === 'fill') {
        const blanks = (it.code.match(/___/g) || []).length;
        ok(blanks > 0 && blanks === it.a.length, at + ': huecos ' + blanks + ' != respuestas ' + it.a.length);
      }
      if (it.t === 'bug') {
        const n = it.code.split('\n').length;
        ok(it.line >= 1 && it.line <= n, at + ': línea fuera de rango');
        ok(it.fix, at + ': sin corrección');
      }
      if (it.t === 'order') ok(it.lines.length >= 3, at + ': pocas líneas');
      if (it.t === 'match') ok(it.pairs.length >= 3, at + ': pocos pares');
      if (it.t === 'short') {
        ok(it.any && it.any.length > 0 && it.model, at + ': sin palabras clave o respuesta modelo');
        if (it.any && it.model) ok(ctx.Practica.gradeShort(it, it.model), at + ': la respuesta modelo no aprueba');
      }
      if (it.t === 'code') ok(it.expected && it.starter && it.solution, at + ': reto incompleto');
      if (it.t === 'step') ok(it.do && it.ok, at + ': un paso dice qué hacer y cómo comprobarlo');
    });
  }

  // Guía 0 Conocimiento (60/60), jHL sin spans corruptos, equilibrio de quizzes, Bot Java y validador flexible
  const gc = ctx.GuiaCero.validateAll(LESSONS);
  ok(gc.total === 60 && !gc.missing.length, 'GuiaCero debe cubrir las 60 lecciones (faltan: ' + gc.missing.join(',') + ')');
  LESSONS.forEach(l => {
    const d = ctx.GuiaCero.get(l.id);
    if (d) [d.que, d.porque, d.paraque, d.dia, d.practica, d.tip].forEach(h => checkHtml(h, 'GuiaCero L' + l.id));
    if (l.quiz) {
      let scoreFirst = 0, scoreLast = 0;
      l.quiz.questions.forEach(q => {
        const lens = q.options.map(o => unhtml(o).length);
        const maxLen = Math.max(...lens);
        if (lens.indexOf(maxLen) === q.correct) scoreFirst++;
        if (lens.lastIndexOf(maxLen) === q.correct) scoreLast++;
      });
      ok(scoreFirst < l.quiz.passing && scoreLast < l.quiz.passing, 'cuestionario L' + l.id + ' no debe aprobarse eligiendo siempre la opción más larga (' + scoreFirst + '/' + scoreLast + ' vs ' + l.quiz.passing + ')');
    }
    const htmls = [l.simple(), l.tutorial()].concat(l.exercise ? l.exercise.hints : []);
    const cbMatches = htmls.join('\n').match(/<div class="cblock-body">([\s\S]*?)<\/div><\/div>/g) || [];
    cbMatches.forEach(blk => {
      const inner = blk.replace(/^<div class="cblock-body">|<\/div><\/div>$/g, '');
      const hasNestedSpanInCC = (inner.match(/<span class="c[cs]">[\s\S]*?<\/span>/g) || []).some(tok => /<span class="c[sknm]">/.test(tok.slice(18)));
      ok(!hasNestedSpanInCC, 'jHL corrompió comentario/string en lección ' + l.id);
    });
  });

  ok(ctx.JavaBot && ctx.JavaBot.KB.length >= 35 && ctx.JavaBot.TIPS_JAVA.length >= 25, 'JavaBot debe tener >=35 temas y >=25 tips');
  [
    ['que es un algoritmo', /algoritmo/i],
    ['como instalo java', /JDK|instalar/i],
    ['no entiendo public static void main', /public static void main/i],
    ['diferencia entre print y println', /print/i],
    ['que es char', /Variables/i],
    ['para que sirve do while', /do-while/i],
    ['for each como funciona', /for-each/i],
    ['que es hashset', /HashSet/i],
    ['que es lombok', /Lombok/i],
    ['como uso maven', /Maven/i],
    ['que es h2', /JPA|SQL/i],
    ['que significa error 404', /HTTP|REST/i],
    ['por que me da nullpointerexception', /try-catch|excepciones/i],
    ['que es encapsulamiento', /Encapsulamiento/i],
    ['diferencia entre interfaz y clase abstracta', /Interfaces/i],
    ['como borrar de un arraylist', /ArrayList/i],
    ['que es try with resources', /archivos/i],
    ['como vuelvo atras en git', /Git/i],
    ['que ide me conviene', /IDE/i],
    ['que es un dto', /DTO|capas/i],
    ['no entiendo nada por donde empiezo', /destrabarte/i],
    ['cannot find symbol', /compilación/i],
    ['arrayindexoutofboundsexception', /Runtime/i],
    ['que es json', /JSON/i],
    ['que es un enum', /enum/i],
    ['que es recursividad', /recursividad/i],
    ['para que sirve constructor', /Constructor/i],
    ['por qué == no funciona con textos', /Strings/i],
    ['cómo uso random', /Random/i],
    ['qué pasa si divido por cero', /División/i],
    ['qué es un log', /log/i],
    ['cuántos bytes tiene un long', /Variables/i],
    ['qué es Java', /Qué es Java/i],
    ['Java y JavaScript son lo mismo', /JavaScript/i],
    ['me sale error', /Revisión de tu código/i],
    ['matriz', /Matrices/i],
    ['bucles anidados', /Matrices/i],
    ['toString', /toString/i],
    ['StringBuilder', /StringBuilder/i],
    ['sobrecarga', /Sobrecarga/i],
    ['paso por valor o referencia', /Paso por valor/i],
    ['cómo ordeno una lista o array', /ordenar/i],
    ['qué es una llave foránea', /JPA|SQL/i],
    ['gracias', /De nada/i],
    ['tema inexistente xyzz', /.+/]
  ].forEach(([q, expectedTitle]) => {
    const ans = ctx.JavaBot.ask(q, { lesson: LESSONS[0] });
    ok(ans && typeof ans.html === 'string' && ans.html.indexOf('bot-card') !== -1, 'JavaBot.ask(' + q + ') debe responder tarjeta útil');
    ok(expectedTitle.test(ans.title), 'JavaBot.ask(' + q + ') respondió "' + ans.title + '" en lugar de ' + expectedTitle);
  });
  {
    const aL7 = ctx.JavaBot.ask('ayuda', { lesson: LESSONS.find(x => x.id === 7) });
    const aL107 = ctx.JavaBot.ask('ayuda', { lesson: LESSONS.find(x => x.id === 107) });
    ok(aL7.lessonId === 7 && aL107.lessonId === 107 && aL7.title !== aL107.title, 'JavaBot.ask("ayuda") debe adaptarse a la lección activa');
    ctx.JavaBot.ask('qué es un enum', { lesson: LESSONS[0] });
    const follow = ctx.JavaBot.ask('y eso para qué sirve', { lesson: LESSONS[0] });
    ok(/enum/i.test(follow.title), 'JavaBot debe recordar el último tema en seguimientos cortos (respondió: ' + follow.title + ')');
  }

  // Frases técnicas falsas prohibidas (anti-regresión)
  LESSONS.forEach(l => {
    const txt = l.simple() + '\n' + l.tutorial();
    ok(!/Sin new,\s*la variable es null/i.test(txt), 'lección ' + l.id + ': contiene afirmación falsa sobre new/null');
    ok(!/El Dockerfile define un contenedor/i.test(txt), 'lección ' + l.id + ': el Dockerfile define una imagen, no un contenedor');
  });

  // Figuras SVG 100% (60/60 lecciones + orientación) con marker IDs únicos
  const seenMarkerIds = new Set();
  Object.keys(ctx.FIGURAS || {}).forEach(k => {
    const f = ctx.FIGURAS[k]();
    ok(f && f.svg && f.svg.indexOf('<svg') === 0, 'figura SVG inválida para clave ' + k);
    const mm = f && f.svg && f.svg.match(/<marker\s+id="([^"]+)"/);
    if (mm) {
      ok(!seenMarkerIds.has(mm[1]), 'marker SVG duplicado: ' + mm[1]);
      seenMarkerIds.add(mm[1]);
    }
  });
  LESSONS.forEach(l => {
    const f = ctx.FIGURAS && ctx.FIGURAS[l.id] && ctx.FIGURAS[l.id]();
    ok(f && f.svg && f.svg.indexOf('<svg') === 0, 'falta figura SVG para la lección ' + l.id);
  });

  // Casos críticos de JavaRun (regresiones QA: Arrays.sort rango, setCharAt, Map.merge, switch con flechas)
  {
    const rSort = ctx.JavaRun.run('import java.util.Arrays; public class Main { public static void main(String[] args) { int[] a = {5, 4, 1, 2, 9}; Arrays.sort(a, 1, 4); System.out.println(Arrays.toString(a)); } }');
    ok(rSort.ok && norm(rSort.output) === '[5, 1, 2, 4, 9]', 'JavaRun Arrays.sort(a, 1, 4) falló: ' + JSON.stringify(rSort));
    const rSb = ctx.JavaRun.run('public class Main { public static void main(String[] args) { StringBuilder sb = new StringBuilder("hola"); sb.setCharAt(0, \'H\'); System.out.println(sb.toString()); } }');
    ok(rSb.ok && norm(rSb.output) === 'Hola', 'JavaRun StringBuilder.setCharAt falló: ' + JSON.stringify(rSb));
    const rMerge = ctx.JavaRun.run('import java.util.*; public class Main { public static void main(String[] args) { Map<String, Integer> m = new HashMap<>(); m.merge("a", 1, Integer::sum); m.merge("a", 2, Integer::sum); System.out.println(m.get("a")); } }');
    ok(rMerge.ok && norm(rMerge.output) === '3', 'JavaRun Map.merge falló: ' + JSON.stringify(rMerge));
    const rSw = ctx.JavaRun.run('public class Main { enum Dia { LUN, MAR } public static void main(String[] args) { Dia d = Dia.MAR; switch (d) { case LUN -> System.out.println("1"); case MAR -> System.out.println("2"); } } }');
    ok(rSw.ok && norm(rSw.output) === '2', 'JavaRun switch con flechas falló: ' + JSON.stringify(rSw));
    const rFqcn = ctx.JavaRun.run('public class Main { public static void main(String[] args) { int[] a = {3, 1, 2}; java.util.Arrays.sort(a); System.out.println(a[0]); } }');
    ok(rFqcn.ok && norm(rFqcn.output) === '1', 'JavaRun java.util.Arrays.sort falló: ' + JSON.stringify(rFqcn));
    const rBox = ctx.JavaRun.run('public class Main { public static void main(String[] args) { Integer a = 100, b = 100, c = 128, d = 128; System.out.println((a == b) + " " + (c == d)); } }');
    ok(rBox.ok && norm(rBox.output) === 'true false', 'JavaRun caché de Integer falló: ' + JSON.stringify(rBox));
    const rRnd = ctx.JavaRun.run('import java.util.Random; public class Main { public static void main(String[] args) { Random r = new Random(42); System.out.println(r.nextInt(100) + "," + r.nextInt(100)); } }');
    ok(rRnd.ok && norm(rRnd.output) === '30,63', 'JavaRun Random(42) falló: ' + JSON.stringify(rRnd));
  }
  ok(ctx.MANUAL && Array.isArray(ctx.MANUAL.ERRORES_F2) && ctx.MANUAL.ERRORES_F2.length >= 8, 'MANUAL.ERRORES_F2 debe tener errores de Fase 2');
  ok(ctx.MANUAL && Array.isArray(ctx.MANUAL.REFERENCIA_F2) && ctx.MANUAL.REFERENCIA_F2.length >= 10, 'MANUAL.REFERENCIA_F2 debe tener referencia de Fase 2');

  const vL3 = ctx.localValidate(3, wrap('int a = 15, b = 4;\nSystem.out.println("Suma: " + (b + a));\nSystem.out.println("Resta: " + (a - b));\nSystem.out.println("Producto: " + (b * a));\nSystem.out.println("División entera: " + (a / b));\nSystem.out.println("Resto: " + (a % b));'));
  ok(vL3.simulated && !vL3.conceptErr, 'L3 debe aceptar b + a y b * a');
  const vL11 = ctx.localValidate(11, wrap('int i = 1;\nwhile (i <= 5) {\n  System.out.println("Contando: " + i);\n  i = i + 1;\n}\nSystem.out.println("¡Listo!");'));
  ok(vL11.simulated && !vL11.conceptErr, 'L11 debe aceptar i = i + 1');
  const vL16 = ctx.localValidate(16, 'public class Main {\n  static void imprimirSeparador () {\n    System.out.println("--- --- ---");\n  }\n  public static void main(String[] args) {\n    imprimirSeparador (); imprimirSeparador (); imprimirSeparador ();\n  }\n}');
  ok(vL16.simulated && !vL16.conceptErr, 'L16 debe aceptar espacios antes de ()');
  const vGit = ctx.localValidate(31, "git init\ngit add Main.java\ngit commit -m 'uno'\ngit add Main.java\ngit commit -m 'dos'\ngit log --oneline\ngit checkout abc123 -- Main.java");
  ok(vGit.ok, 'gitValidate debe aceptar comillas simples en -m');
}

// ── 2 y 3. Programas a verificar con el JDK ────────────────────────────
const verifications = [];

function collectSolutions() {
  for (const l of LESSONS) {
    if (!l.exercise || l.id === 31 || l.id === 33) continue;
    const blocks = codeBlocks(l.exercise.hints.join('\n'));
    const sol = blocks[blocks.length - 1];
    ok(!!sol, 'lección ' + l.id + ': sin solución en las pistas');
    if (!sol) continue;
    const p = addProgram('sol' + l.id, sol, l.exercise.stdin);
    verifications.push(res => {
      ok(res(p).status === 'ok', 'solución ' + l.id + ' no corre: ' + res(p).status + ' ' + res(p).error);
      ok(norm(res(p).stdout) === norm(l.exercise.expected), 'solución ' + l.id + ' imprime otra cosa: ' + JSON.stringify(norm(res(p).stdout).slice(0, 200)));
      const v = ctx.localValidate(l.id, sol);
      const passes = v.ok || (v.simulated && !v.runtime && !v.conceptErr && norm(v.output) === norm(l.exercise.expected));
      ok(passes, 'el validador rechaza la solución de la lección ' + l.id + ': ' + JSON.stringify(v).slice(0, 220));
    });
  }
  for (const id of [31, 33]) {
    const l = LESSONS_F1.find(x => x.id === id);
    const blocks = codeBlocks(l.exercise.hints.join('\n'));
    const v = ctx.localValidate(id, blocks[blocks.length - 1]);
    ok(v.ok, 'el validador rechaza los comandos oficiales de la lección ' + id + ': ' + JSON.stringify(v));
  }
}

function collectPractice() {
  for (const id of Object.keys(PRACTICA)) {
    (PRACTICA[id].items || []).forEach((it, i) => {
      const at = 'lección ' + id + ' ítem ' + i + ' (' + it.t + ')';
      const tag = 'p' + id + '_' + i;
      if (it.t === 'output') {
        const p = addProgram(tag, wrap(it.code), it.stdin);
        verifications.push(res => {
          const r = res(p);
          ok(r.status === 'ok' || (r.status === 'exception' && it.throws), at + ': no corre: ' + r.status + ' ' + r.error);
          ok(norm(r.stdout) === norm(it.a), at + ': Java imprime ' + JSON.stringify(norm(r.stdout)) + ' y la respuesta dice ' + JSON.stringify(norm(it.a)));
        });
      }
      if (it.t === 'fill' && !it.noRun) {
        let filled = it.code;
        it.a.forEach(alts => { filled = filled.replace('___', alts[0]); });
        const p = addProgram(tag, wrap(filled), it.stdin);
        verifications.push(res => {
          const r = res(p);
          ok(r.status === 'ok', at + ': con la respuesta no corre: ' + r.status + ' ' + r.error);
          if (it.out !== undefined) ok(norm(r.stdout) === norm(it.out), at + ': imprime ' + JSON.stringify(norm(r.stdout)));
        });
      }
      if (it.t === 'bug' && !it.noRun) {
        const lines = it.code.split('\n');
        lines[it.line - 1] = it.fix;
        const bad = addProgram(tag + '_mal', wrap(it.code), it.stdin);
        const good = addProgram(tag + '_bien', wrap(lines.join('\n')), it.stdin);
        verifications.push(res => {
          const rb = res(bad), rg = res(good);
          ok(rg.status === 'ok', at + ': la corrección no corre: ' + rg.status + ' ' + rg.error);
          ok(rb.status !== 'ok' || norm(rb.stdout) !== norm(rg.stdout), at + ': el código con error se comporta igual que el corregido');
        });
      }
      if (it.t === 'order' && it.java) {
        const p = addProgram(tag, wrap(it.lines.join('\n')), it.stdin);
        verifications.push(res => {
          ok(res(p).status === 'ok', at + ': el orden correcto no corre: ' + res(p).error);
          if (it.out !== undefined) ok(norm(res(p).stdout) === norm(it.out), at + ': imprime ' + JSON.stringify(norm(res(p).stdout)));
        });
      }
      if (it.t === 'code') {
        const p = addProgram(tag, it.solution, it.stdin);
        verifications.push(res => {
          const r = res(p);
          ok(r.status === 'ok', at + ': la solución no corre: ' + r.status + ' ' + r.error);
          ok(norm(r.stdout) === norm(it.expected), at + ': la solución imprime ' + JSON.stringify(norm(r.stdout).slice(0, 200)));
          const g = ctx.Practica.gradeCode(it, it.solution);
          ok(g.passed, at + ': el evaluador rechaza la solución: ' + JSON.stringify(g).slice(0, 200));
          const s = ctx.Practica.gradeCode(it, it.starter);
          ok(!s.passed, at + ': el código inicial aprueba');
        });
      }
    });
  }
}

function collectCorpus() {
  const dir = path.join(__dirname, 'corpus');
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.java'))) {
    addProgram('corpus_' + f.replace('.java', ''), fs.readFileSync(path.join(dir, f), 'utf8'));
  }
  // javac tiene que rechazarlos de verdad: si no, el caso está mal escrito
  const rejects = require('./javac-rejects.js');
  for (const name of Object.keys(rejects)) {
    const p = addProgram('rechazo_' + name, rejects[name]);
    verifications.push(res => ok(res(p).status === 'compile', 'javac no rechaza ' + name + ': ' + res(p).status));
  }
}

function runOracle() {
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(CASES, { recursive: true });
  for (const p of programs) {
    const d = path.join(CASES, p.tag);
    fs.mkdirSync(d);
    const m = p.code.match(/public\s+(?:final\s+|abstract\s+)?class\s+(\w+)/);
    fs.writeFileSync(path.join(d, (m ? m[1] : 'Main') + '.java'), p.code, 'utf8');
    if (p.stdin && p.stdin.length) fs.writeFileSync(path.join(d, 'stdin.txt'), p.stdin.join('\n') + '\n', 'utf8');
  }
  const build = path.join(TMP, 'oracle');
  fs.mkdirSync(build);
  const opts = { encoding: 'utf8', env: Object.assign({}, process.env, { JAVA_TOOL_OPTIONS: '' }) };
  const c = cp.spawnSync('javac', ['-encoding', 'UTF-8', '-d', build, path.join(__dirname, 'JavaOracle.java')], opts);
  if (c.status !== 0) { console.log(c.stderr); process.exit(2); }
  // cwd en la carpeta temporal: las actividades de archivos escriben en el directorio actual
  const r = cp.spawnSync('java', ['-cp', build, '-Dfile.encoding=UTF-8', 'JavaOracle', CASES], Object.assign({ timeout: 300000, cwd: TMP }, opts));
  console.log('  ' + (r.stdout || '').trim());
  if (r.status !== 0) { console.log(r.stderr); process.exit(2); }
}

function oracleResult(p) {
  const d = path.join(CASES, p.tag);
  const read = n => (fs.existsSync(path.join(d, n)) ? fs.readFileSync(path.join(d, n), 'utf8') : '');
  return { status: read('status.txt'), stdout: read('stdout.txt'), error: read('error.txt') };
}

// ── 4. JavaRun contra el JDK ───────────────────────────────────────────
function compareInterpreter() {
  console.log('4. JavaRun contra javac/java (' + programs.length + ' programas)');
  const unsupported = {};
  let same = 0;
  for (const p of programs) {
    const real = oracleResult(p);
    const mine = ctx.JavaRun.run(p.code, { stdin: p.stdin || [], maxSteps: 1500000 });
    const tag = p.tag;
    if (mine.unsupported) { unsupported[mine.unsupported] = (unsupported[mine.unsupported] || 0) + 1; continue; }
    if (real.status === 'compile') {
      ok(!!mine.compile, tag + ': javac rechaza (' + real.error.trim().split('\n')[0] + ') y JavaRun no: ' + JSON.stringify(mine).slice(0, 120));
      if (mine.compile) same++;
      continue;
    }
    if (real.status === 'timeout') { ok(!!mine.limit, tag + ': Java no termina y JavaRun sí'); same++; continue; }
    if (mine.compile) { ok(false, tag + ': javac acepta y JavaRun rechaza: ' + JSON.stringify(mine.compile)); continue; }
    const ra = norm(real.stdout).split('\n'), mi = norm(mine.output).split('\n');
    const at = ra.findIndex((l, i) => l !== mi[i]);
    const bad = at === -1 && mi.length !== ra.length ? ra.length : at;
    ok(bad === -1, tag + ': salida distinta en la línea ' + (bad + 1) + '\n    java:    ' + JSON.stringify(ra[bad]) + '\n    javarun: ' + JSON.stringify(mi[bad]));
    if (real.status === 'exception') {
      // El texto de NullPointerException y de los errores de archivo depende de la JVM y del sistema
      const loose = /^java\.(lang\.NullPointerException|io\.FileNotFoundException)/.test(real.error);
      const same2 = loose ? real.error.split(':')[0] === mine.exception.split(':')[0] : mine.exception === real.error.trim();
      ok(same2, tag + ': excepción distinta. java: ' + real.error.trim() + ' | javarun: ' + mine.exception);
    } else ok(real.status === 'ok' && mine.ok, tag + ': terminó distinto: java ' + real.status + ' javarun ' + JSON.stringify(mine).slice(0, 140));
    same++;
  }
  console.log('  iguales: ' + same + ' · sin soporte: ' + JSON.stringify(unsupported));
}

// ── 5. Programas incorrectos que no deben aprobar ──────────────────────
function checkWrongPrograms() {
  console.log('5. Programas incorrectos');
  const wrongs = require('./wrong-programs.js');
  for (const w of wrongs(wrap)) {
    const l = LESSONS.find(x => x.id === w.id);
    const v = ctx.localValidate(w.id, w.code);
    const passes = v.ok || (v.simulated && !v.runtime && !v.conceptErr && norm(v.output) === norm(l.exercise.expected));
    ok(!passes, 'lección ' + w.id + ' aprueba: ' + w.why);
  }
}

// ── 6. Memoria del alumno ──────────────────────────────────────────────
function day(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function checkMemory() {
  console.log('6. Memoria del alumno');
  load('public/js/progress.js');
  const P = ctx.Practica;
  const G = ctx.Progress;
  const key = '14-0';
  const review = () => P.getState().reviews[key];

  P.setState(null);
  ok(P.statusOf(key) === 'new', 'una actividad sin responder debe ser nueva');
  P.saveScore(key, 1);
  ok(review().box === 1 && review().due === day(1), 'acertar la primera vez vuelve mañana');
  ok(P.statusOf(key) === 'solved', 'lo acertado queda resuelto hasta su fecha');
  P.saveScore(key, 1);
  ok(review().box === 1, 'repetir antes de la fecha no suma');
  review().due = day(0);
  ok(P.statusOf(key) === 'due' && P.dueKeys().includes(key), 'al llegar la fecha vuelve al repaso');
  P.saveScore(key, 1);
  ok(review().box === 2 && review().due === day(3), 'acertar en el repaso aleja la próxima vuelta');
  review().box = P.INTERVALS.length;
  review().due = day(0);
  P.saveScore(key, 1);
  ok(review().box === P.INTERVALS.length && review().due === day(30), 'el intervalo máximo es de 30 días');

  const before = P.mastery(14).pct;
  P.saveScore(key, 0);
  ok(review().box === 0 && review().due === day(1), 'fallar lo trae mañana');
  ok(P.statusOf(key) === 'wait', 'lo fallado espera hasta mañana: ver la respuesta y repetir no vale');
  ok(P.getState().wrong.includes(key), 'lo fallado queda para repasar');
  ok(P.mastery(14).pct < before, 'fallar algo ya aprobado baja el dominio');

  const merged = G.mergePractice(P.getState(), { scores: { [key]: 1 }, wrong: [], reviews: { [key]: { box: 3, due: day(5), at: 1 } } });
  ok(merged.wrong.includes(key) && merged.reviews[key].box === 0, 'un error nuevo sobre algo aprobado sobrevive a la recarga');
  const newer = G.mergePractice({ scores: { [key]: 1 }, wrong: [key], reviews: { [key]: { box: 0, due: day(1), at: 5 } } }, { scores: { [key]: 1 }, wrong: [], reviews: { [key]: { box: 2, due: day(3), at: 9 } } });
  ok(!newer.wrong.includes(key) && newer.reviews[key].box === 2, 'entre dos dispositivos gana el resultado más reciente');
  const old = G.mergePractice({ scores: { a: 0.5, b: 1 }, wrong: ['a', 'b'] }, null);
  ok(old.wrong.length === 1 && old.wrong[0] === 'a', 'los datos viejos, sin fechas, se siguen combinando');

  P.setState({ scores: { '14-1': 1, '14-2': 0 }, wrong: ['14-2'] });
  ok(P.getState().reviews['14-1'].box === 1, 'lo aprobado antes de esta versión recibe una fecha');
  ok(P.statusOf('14-2') === 'due', 'lo fallado antes de esta versión queda para hoy');

  P.setState(null);
  const shared = P.itemOf('23-2');
  const firstOf = text => shared.pairs.findIndex(p => p[1] === text);
  ok(P.grade(shared, shared.pairs.map(p => firstOf(p[1]))), 'una respuesta repetida en Unir no puede marcarse mal');

  for (const t of ['todo', 'f2todo']) {
    const types = new Set(P.poolFor(t).map(k => P.itemOf(k).t));
    ok(!types.has('short') && !types.has('step') && !types.has('code'), t + ': el simulacro solo usa actividades con corrección objetiva');
  }

  for (const l of LESSONS) {
    if (!l.exercise || l.id === 31 || l.id === 33) continue;
    const it = P.itemOf('x' + l.id);
    ok(it.solution && P.gradeCode(it, it.solution).passed, 'lección ' + l.id + ': el parcial práctico rechaza la solución oficial');
    ok(!P.gradeCode(it, it.starter).passed, 'lección ' + l.id + ': el parcial práctico aprueba el código inicial');
    const sk = P.skeleton(it.solution);
    ok(sk !== it.solution, 'lección ' + l.id + ': el esqueleto no debe ser la solución completa');
    ok(!P.gradeCode(it, sk).passed, 'lección ' + l.id + ': el esqueleto aprueba sin escribir nada');
  }
}

checkData();
console.log('2 y 3. Soluciones y actividades');
collectSolutions();
collectPractice();
collectCorpus();
runOracle();
const res = p => oracleResult(p);
verifications.forEach(v => v(res));
compareInterpreter();
checkWrongPrograms();
checkMemory();

console.log('\n' + (failures ? failures + ' fallas en ' + checks + ' verificaciones' : 'OK: ' + checks + ' verificaciones'));
process.exit(failures ? 1 : 0);
