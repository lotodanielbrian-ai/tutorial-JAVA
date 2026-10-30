// Pruebas del tutorial. Uso: node tests/run.js  (requiere Node y un JDK en el PATH)
// 1. Datos: forma de lecciones y actividades.
// 2. Soluciones oficiales: compilan, imprimen el output esperado y el validador las aprueba.
// 3. Código de las actividades: las respuestas coinciden con lo que hace Java de verdad.
// 4. Intérprete: JavaRun da el mismo resultado que javac/java en todo el corpus.
// 5. Validador: los programas incorrectos se rechazan.
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

// ── 1. Datos ───────────────────────────────────────────────────────────
function checkData() {
  console.log('1. Datos');
  const ids = LESSONS.map(l => l.id);
  ok(new Set(ids).size === ids.length, 'ids de lección repetidos');
  for (const l of LESSONS) {
    ok(!!l.exercise !== !!l.quiz, 'lección ' + l.id + ' debe tener exercise o quiz');
    if (l.quiz) {
      ok(l.quiz.passing <= l.quiz.questions.length, 'lección ' + l.id + ': passing mayor que la cantidad de preguntas');
      l.quiz.questions.forEach((q, i) => {
        ok(typeof q.question === 'string' && q.question.length > 3, 'lección ' + l.id + ' pregunta ' + i + ' sin texto');
        ok(q.correct >= 0 && q.correct < q.options.length, 'lección ' + l.id + ' pregunta ' + i + ': correct fuera de rango');
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
  ok(LESSONS_F1.every(l => l.id < 100) && ctx.LESSONS_F2.every(l => l.id > 100), 'los ids de cada fase no deben cruzarse');
  const validTypes = ['mc', 'tf', 'fill', 'bug', 'output', 'order', 'match', 'short', 'code', 'http'];
  const seen = {};
  for (const id of Object.keys(PRACTICA)) {
    const p = PRACTICA[id];
    ok(LESSONS.some(l => String(l.id) === id), 'PRACTICA[' + id + '] no corresponde a una lección');
    ok(p.escalera && ['vida', 'modelo', 'pseudo', 'java', 'real'].every(k => p.escalera[k]), 'lección ' + id + ': escalera incompleta');
    ok(Array.isArray(p.objetivos) && p.objetivos.length >= 2, 'lección ' + id + ': faltan objetivos');
    (p.items || []).forEach((it, i) => {
      const at = 'lección ' + id + ' ítem ' + i + ' (' + it.t + ')';
      ok(validTypes.includes(it.t), at + ': tipo desconocido');
      ok(it.q || it.t === 'code', at + ': sin consigna');
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
      }
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
    });
  }
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

console.log('\n' + (failures ? failures + ' fallas en ' + checks + ' verificaciones' : 'OK: ' + checks + ' verificaciones'));
process.exit(failures ? 1 : 0);
