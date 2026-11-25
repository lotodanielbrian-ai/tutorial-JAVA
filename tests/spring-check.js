// Verifica lo que el intérprete no alcanza. Uso: node tests/spring-check.js
// Requiere Maven en el PATH o MVN=ruta/a/mvn, y opcionalmente M2=ruta/al/repositorio.
// 1. Compila con Spring real los fragmentos marcados spring: true.
// 2. Ejecuta en H2 las consultas marcadas sql: true.
// 3. Levanta ejemplos/kiosco-api y compara cada respuesta con el laboratorio del navegador.
// 4. Comprueba que Swagger publica lo que documentan las anotaciones del controller.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..');
const API = path.join(ROOT, 'ejemplos', 'kiosco-api');
const TMP = path.join(__dirname, '.tmp-spring');
const MVN = process.env.MVN || (process.platform === 'win32' ? 'mvn.cmd' : 'mvn');
const repo = process.env.M2 ? ['-Dmaven.repo.local=' + process.env.M2] : [];

const ctx = { console };
vm.createContext(ctx);
function load(f) { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }); }
['public/js/lessons.js', 'public/js/javarun.js', 'public/js/validate.js'].forEach(load);
for (const f of fs.readdirSync(path.join(ROOT, 'public/js')).sort()) {
  if (/^(practica-|fase2-).*\.js$/.test(f)) load('public/js/' + f);
}
load('public/js/apilab.js');
const PRACTICA = vm.runInContext('PRACTICA', ctx);

let fails = 0;
let checks = 0;
function ok(c, m) { checks++; if (!c) { fails++; console.log('  FALLA: ' + m); } }

const IMPORTS = [
  'org.springframework.web.bind.annotation.*', 'org.springframework.http.*', 'org.springframework.stereotype.*',
  'org.springframework.boot.*', 'org.springframework.boot.autoconfigure.*', 'org.springframework.data.jpa.repository.*',
  'jakarta.persistence.*', 'lombok.*', 'java.util.*', 'org.junit.jupiter.api.*', 'org.junit.jupiter.api.extension.*',
  'org.mockito.*', 'org.mockito.junit.jupiter.*', 'org.springframework.test.web.servlet.*'
].map(i => 'import ' + i + ';').join('\n') + '\n';

fs.rmSync(TMP, { recursive: true, force: true });
const SRC = path.join(TMP, 'src');
const OUT = path.join(TMP, 'out');
fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

console.log('Empaquetando kiosco-api...');
const opts = { cwd: API, encoding: 'utf8', shell: process.platform === 'win32', maxBuffer: 1 << 26 };
const mvnArgs = a => repo.concat(['-q', '-B'], a).map(x => (/ /.test(x) ? '"' + x + '"' : x));
const pkg = cp.spawnSync(MVN, mvnArgs(['clean', 'package']), opts);
ok(pkg.status === 0, 'mvn package falló: ' + (pkg.stdout || '').split('\n').filter(l => /ERROR|Tests run:.*Fail/.test(l)).slice(0, 5).join(' | '));
const cpFile = path.join(TMP, 'cp.txt');
cp.spawnSync(MVN, mvnArgs(['dependency:build-classpath', '-Dmdep.outputFile=' + cpFile, '-Dmdep.includeScope=test']), opts);
const classpath = fs.readFileSync(cpFile, 'utf8').trim();

console.log('1. Fragmentos de Spring');
let n = 0;
function compile(name, code) {
  const file = path.join(SRC, name + '.java');
  fs.writeFileSync(file, IMPORTS + code.replace(/public class /g, 'class '), 'utf8');
  const argFile = path.join(TMP, 'args.txt');
  fs.writeFileSync(argFile, ['-cp', '"' + classpath.replace(/\\/g, '/') + '"', '-d', '"' + OUT.replace(/\\/g, '/') + '"', '-encoding', 'UTF-8', '-Xlint:none', '-proc:full', '"' + file.replace(/\\/g, '/') + '"'].join('\n'));
  return cp.spawnSync('javac', ['@' + argFile], { encoding: 'utf8', maxBuffer: 1 << 24 });
}
for (const id of Object.keys(PRACTICA)) {
  (PRACTICA[id].items || []).forEach((it, i) => {
    if (!it.spring) return;
    const at = 'lección ' + id + ' ítem ' + i;
    let code = it.code;
    if (it.t === 'fill') it.a.forEach(alts => { code = code.replace('___', alts[0]); });
    if (it.t === 'bug') {
      const lines = code.split('\n');
      lines[it.line - 1] = it.fix;
      code = lines.join('\n');
    }
    const r = compile('F' + id + '_' + i, code);
    ok(r.status === 0, at + ' no compila con Spring: ' + (r.stderr || '').split('\n').slice(0, 3).join(' | '));
    n++;
  });
}
console.log('  compilados: ' + n);

console.log('2. Consultas SQL en H2');
const statements = [];
for (const id of Object.keys(PRACTICA)) {
  (PRACTICA[id].items || []).forEach((it, i) => {
    if (!it.sql) return;
    const fixed = it.code.split('\n');
    fixed[it.line - 1] = it.fix;
    statements.push({ at: 'lección ' + id + ' ítem ' + i, bad: it.code, good: fixed.join('\n') });
  });
}
const runner = `import java.nio.file.*; import java.sql.*; import java.util.*;
public class SqlCheck { public static void main(String[] a) throws Exception {
  List<String> out = new ArrayList<>();
  for (String f : Files.readString(Path.of(a[0])).split("\\n====\\n")) {
    try (Connection c = DriverManager.getConnection("jdbc:h2:mem:t" + System.nanoTime()); Statement s = c.createStatement()) {
      s.execute("CREATE TABLE productos (id BIGINT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(80), precio DOUBLE, stock INT, activo BOOLEAN)");
      s.execute("CREATE TABLE clientes (id BIGINT AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(80))");
      s.execute("CREATE TABLE pedidos (id BIGINT AUTO_INCREMENT PRIMARY KEY, cliente_id BIGINT, total DOUBLE)");
      try { for (String q : f.split(";")) if (!q.isBlank()) s.execute(q); out.add("ok"); } catch (SQLException e) { out.add("error"); }
    }
  }
  System.out.println(String.join(",", out));
} }`;
const sqlDir = path.join(TMP, 'sql');
fs.mkdirSync(sqlDir);
fs.writeFileSync(path.join(sqlDir, 'SqlCheck.java'), runner);
const list = statements.flatMap(s => [s.bad, s.good]);
fs.writeFileSync(path.join(sqlDir, 'in.txt'), list.join('\n====\n'));
cp.spawnSync('javac', ['-d', sqlDir, path.join(sqlDir, 'SqlCheck.java')], { encoding: 'utf8' });
const run = cp.spawnSync('java', ['-cp', sqlDir + path.delimiter + classpath, 'SqlCheck', path.join(sqlDir, 'in.txt')], { encoding: 'utf8', maxBuffer: 1 << 24 });
const results = (run.stdout || '').trim().split(',');
statements.forEach((s, i) => {
  ok(results[i * 2] === 'error', s.at + ': la consulta con error se ejecuta sin fallar');
  ok(results[i * 2 + 1] === 'ok', s.at + ': la consulta corregida falla');
});
console.log('  consultas: ' + statements.length);

console.log('3. Laboratorio contra la API real');
const jar = path.join(API, 'target', 'kiosco-api-1.0.0.jar');
const PORT = 8100 + Math.floor(Math.random() * 800);
const app = cp.spawn('java', ['-jar', jar, '--server.port=' + PORT], { stdio: 'ignore' });
const norm = s => { try { const o = JSON.parse(s); return JSON.stringify(o, (k, v) => (k === 'fecha' ? undefined : v)); } catch (e) { return s; } };
const J = { 'Content-Type': 'application/json' };
const script = [
  ['GET', '/api/productos'], ['GET', '/api/productos/3'], ['GET', '/api/productos/99'], ['GET', '/api/productos/poco-stock?minimo=5'],
  ['POST', '/api/productos', '{"nombre":"Mate","precio":900,"stock":4}'], ['POST', '/api/productos', '{"nombre":"Mate","precio":900,"stock":4}'],
  ['POST', '/api/productos', '{"nombre":"","precio":900,"stock":4}'], ['POST', '/api/productos', '{"nombre":"X","precio":-5,"stock":1}'],
  ['POST', '/api/productos', '{"nombre":'], ['PUT', '/api/productos/1', '{"nombre":"Alfajor triple","precio":1500,"stock":20}'],
  ['PUT', '/api/productos/1', '{"nombre":"Mate","precio":1500,"stock":20}'],
  ['PUT', '/api/productos/99', '{"nombre":"Nada","precio":1,"stock":1}'], ['DELETE', '/api/productos/2'], ['GET', '/api/productos/2'],
  ['DELETE', '/api/productos/2'], ['PATCH', '/api/productos/1'], ['GET', '/api/productos/abc'], ['DELETE', '/api/productos/abc'],
  ['PATCH', '/api/productos/abc'], ['GET', '/api/nada'], ['POST', '/api/nada', '{}'], ['GET', '/api/productos']
];
(async () => {
  let up = false;
  for (let i = 0; i < 60 && !up; i++) {
    try { await fetch(`http://localhost:${PORT}/api/productos`); up = true; } catch (e) { await new Promise(r => setTimeout(r, 1000)); }
  }
  ok(up, 'la API real no levantó');
  const server = ctx.ApiLab.seed();
  for (const [method, url, body] of script) {
    const real = await fetch(`http://localhost:${PORT}${url}`, { method, headers: body ? J : {}, body });
    const text = await real.text();
    const sim = ctx.ApiLab.handle(server, method, url, body || '');
    ok(real.status === sim.status, `${method} ${url}: real ${real.status} y laboratorio ${sim.status}`);
    ok(norm(text) === norm(sim.body), `${method} ${url}: distinto cuerpo\n    real: ${text.slice(0, 160)}\n    lab:  ${sim.body.slice(0, 160)}`);
  }
  console.log('  pedidos comparados: ' + script.length);
  console.log('4. Documentación');
  const docs = await (await fetch(`http://localhost:${PORT}/v3/api-docs`)).json();
  const obtener = docs.paths['/api/productos/{id}'].get;
  ok((docs.tags || []).some(t => t.name === 'Productos'), 'falta @Tag en la documentación');
  ok(/Busca un producto/.test(obtener.summary), 'falta @Operation en la documentación');
  ok(/No hay un producto activo/.test((obtener.responses['404'] || {}).description), 'falta @ApiResponse 404 en la documentación');
  ok(obtener.parameters[0].description === 'Id del producto', 'falta @Parameter en la documentación');
  ok(String(obtener.parameters[0].example) === '1', 'falta el ejemplo de @Parameter en la documentación');
  // En Windows java.exe lanza un hijo: hay que cerrar el árbol, y antes de matar al padre
  if (process.platform === 'win32') cp.spawnSync('taskkill', ['/F', '/T', '/PID', String(app.pid)]);
  else app.kill();
  fs.rmSync(TMP, { recursive: true, force: true });
  console.log('\n' + (fails ? fails + ' fallas en ' + checks + ' verificaciones' : 'OK: ' + checks + ' verificaciones'));
  process.exit(fails ? 1 : 0);
})();
