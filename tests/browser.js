// Prueba el sitio en un navegador real, con Firebase simulado. Uso: node tests/browser.js
// Requiere Node 22 o superior y Edge o Chrome. BROWSER=ruta elige otro navegador.
// Deja capturas en tests/.tmp-browser para mirarlas: contar elementos no prueba que se vean.
const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..');
const TMP = path.join(__dirname, '.tmp-browser');
const DEBUG_PORT = 9300 + Math.floor(Math.random() * 500);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const CANDIDATES = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium'
].filter(Boolean);

const STUB = `<script>
window.__writes = [];
(function () {
  var user = { uid: 'u1', displayName: 'Prueba', email: 'p@x', photoURL: '', providerData: [{ providerId: 'google.com' }] };
  var snap = function (d) { return { exists: !!d, data: function () { return d || {}; }, forEach: function () {} }; };
  var ref = function (p) {
    return {
      // Con #offline la nube no se puede leer: así se prueba una carga fallida
      get: function () {
        if (location.hash === '#offline' && /^(progress|attempts|rankings)/.test(p)) return Promise.reject(new Error('client is offline'));
        return Promise.resolve(snap(null));
      },
      set: function (d) { window.__writes.push([p, d]); return Promise.resolve(); },
      collection: function (n) { return ref(p + '/' + n); },
      doc: function (n) { return ref(p + '/' + n); },
      orderBy: function () { return this; },
      limit: function () { return this; }
    };
  };
  var db = {
    collection: function (n) { return ref(n); },
    batch: function () { return { delete: function () {}, set: function (r, d) { r.set(d); }, commit: function () { return Promise.resolve(); } }; },
    runTransaction: function (fn) { return fn({ get: function (r) { return r.get(); }, set: function (r, d) { r.set(d); } }); }
  };
  var auth = { currentUser: user, onAuthStateChanged: function (cb) { setTimeout(function () { cb(user); }, 10); }, signOut: function () { return Promise.resolve(); } };
  window.firebase = {
    apps: [1], initializeApp: function () {}, app: function () { return {}; },
    auth: Object.assign(function () { return auth; }, { GoogleAuthProvider: function () {}, FacebookAuthProvider: function () {} }),
    firestore: Object.assign(function () { return db; }, { FieldValue: { serverTimestamp: function () { return 'ts'; } } })
  };
})();
</script>`;

function page() {
  const scenario = fs.readFileSync(path.join(__dirname, 'browser-scenario.js'), 'utf8');
  return fs.readFileSync(path.join(ROOT, 'public/index.html'), 'utf8')
    .replace(/<script src="https:\/\/www\.gstatic[^\n]*\n?/g, '')
    .replace('<script src="js/firebase-config.js"></script>', () => STUB + '<script src="js/firebase-config.js"></script>')
    .replace(/<link[^>]*fonts\.g[^>]*>/g, '')
    .replace('</body>', () => '<script>' + scenario + '</script></body>');
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/test') {
    res.writeHead(200, { 'Content-Type': TYPES['.html'] });
    res.end(page());
    return;
  }
  const file = path.join(ROOT, 'public', url);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'text/plain' });
    res.end(fs.readFileSync(file));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const delay = ms => new Promise(r => setTimeout(r, ms));
const PHONE = 360;
const WIDEST = `Array.from(document.querySelectorAll('#main *, #sim-box *')).filter(function (el) {
  var r = el.getBoundingClientRect();
  return r.width > 0 && r.right > ${PHONE} + 1 && !el.closest('.cblock-body, .pr-lines, .exp-out, .pr-pre');
}).sort(function (a, b) { return b.getBoundingClientRect().right - a.getBoundingClientRect().right; }).slice(0, 8).map(function (el) {
  return el.tagName.toLowerCase() + '.' + String(el.className).split(' ').join('.') + ':' + Math.round(el.getBoundingClientRect().right);
}).join(' ')`;

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = {};
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && pending[d.id]) {
      pending[d.id](d);
      delete pending[d.id];
    }
  };
  return {
    send: (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); }),
    close: () => ws.close()
  };
}

(async () => {
  const exe = CANDIDATES.find(c => fs.existsSync(c));
  if (!exe) { console.log('No encontré Edge ni Chrome. Indicá la ruta con BROWSER.'); process.exit(2); }
  // Un perfil reutilizado conserva el localStorage y da fallas falsas
  fs.rmSync(TMP, { recursive: true, force: true });
  fs.mkdirSync(TMP, { recursive: true });
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;
  const browser = cp.spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', '--remote-debugging-port=' + DEBUG_PORT, '--user-data-dir=' + path.join(TMP, 'perfil'), 'about:blank'], { stdio: 'ignore' });
  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await delay(500);
    try {
      const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json`)).json();
      target = list.find(t => t.type === 'page');
    } catch (e) { /* todavía arranca */ }
  }
  let failed = 0;
  const finish = () => {
    if (process.platform === 'win32') cp.spawnSync('taskkill', ['/F', '/T', '/PID', String(browser.pid)]);
    else browser.kill();
    server.close();
    process.exit(failed ? 1 : 0);
  };
  if (!target) { console.log('El navegador no abrió el puerto de depuración.'); failed = 1; finish(); return; }
  const c = await connect(target.webSocketDebuggerUrl);
  await c.send('Page.enable');
  await c.send('Runtime.enable');

  const evaluate = async expression => {
    const r = await c.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result && r.result.result ? r.result.result.value : undefined;
  };
  const open = async (hash, width, height, mobile) => {
    await c.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: !!mobile });
    await c.send('Page.navigate', { url: `http://127.0.0.1:${port}/test?x=${Date.now()}${hash}` });
  };
  const result = async ms => {
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const text = await evaluate("(document.getElementById('__result') || {}).textContent || ''");
      if (text) return text;
      await delay(300);
    }
    return 'FALLA sin resultado en ' + ms + ' ms';
  };
  const shot = async name => {
    await delay(900);
    const r = await c.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(TMP, name + '.png'), Buffer.from(r.result.data, 'base64'));
  };
  const report = text => {
    console.log(text);
    const js = /errores JS: (.*)$/m.exec(text);
    failed += (text.match(/^FALLA/gm) || []).length + (js && js[1] !== '[]' ? 1 : 0);
  };

  // VIEWS=practica,pasos mide solo esas pantallas: sirve para iterar sobre el diseño
  const onlyViews = process.env.VIEWS ? process.env.VIEWS.split(',') : null;
  if (!onlyViews) {
    await open('', 1280, 900);
    report(await result(60000));
    await shot('final-escritorio');

    // Un reingreso real: el lugar y el borrador tienen que seguir ahí
    await open('#resume', 1280, 900);
    report(await result(15000));

    // Sin poder leer la nube, la app abre igual, avisa y no pisa nada
    await open('#offline', 1280, 900);
    report(await result(15000));
    await shot('sin-conexion');
  }

  const views = [['leccion', '#v-lesson'], ['practica', '#v-prac'], ['panel', '#v-panel'], ['repaso', '#v-review'], ['simulacro', '#v-sim'], ['pasos', '#v-steps'], ['pong', '#v-pong'], ['parcial', '#v-practico'], ['ejercicio', '#v-hints']];
  for (const [name, hash] of views.filter(v => !onlyViews || onlyViews.includes(v[0]))) {
    await open(hash, 1280, 900);
    await result(15000);
    await shot(name);
    await open(hash, PHONE, 800, true);
    report(await result(15000));
    await shot(name + '-movil');
    // Con emulación móvil, innerWidth crece junto con la página: hay que comparar contra el ancho del teléfono
    const doc = await evaluate('document.documentElement.scrollWidth');
    console.log((doc <= PHONE ? 'ok    ' : 'FALLA ') + name + ' a ' + PHONE + ' px: el documento mide ' + doc);
    if (doc > PHONE) {
      failed++;
      console.log('      se salen: ' + await evaluate(WIDEST));
    }
  }

  // El manual: se arma solo, sus ejemplos se ejecutan y se editan, y entra en un teléfono
  if (!onlyViews || onlyViews.includes('manual')) {
    await c.send('Page.addScriptToEvaluateOnNewDocument', { source: "window.__errs = []; addEventListener('error', function (e) { __errs.push(e.message + ' @' + e.lineno); }); window.confirm = function (m) { __errs.push('confirm nativo: ' + m); }; window.alert = function (m) { __errs.push('alert nativo: ' + m); };" });
    const checkManual = async label => {
      for (let i = 0; i < 40 && await evaluate("document.documentElement.getAttribute('data-ready')") !== '1'; i++) await delay(250);
      const r = await evaluate(`(async () => {
        const out = [];
        const ok = (c, m) => out.push((c ? 'ok    ' : 'FALLA ') + '${label}: ' + m);
        const caps = document.querySelectorAll('.mn-chapter').length;
        ok(caps === 36, 'el libro tiene el capítulo 0 y las 35 lecciones (' + caps + ')');
        ok(document.querySelectorAll('.mn-fig svg').length >= 40, 'cada capítulo tiene su figura (' + document.querySelectorAll('.mn-fig svg').length + ')');
        ok(document.querySelectorAll('.mn-item').length > 300, 'hay actividades para comprobar (' + document.querySelectorAll('.mn-item').length + ')');
        ok(document.querySelectorAll('.mn-sol-ch').length === 30 && document.querySelectorAll('.mn-ans').length === document.querySelectorAll('.mn-item').length, 'cada actividad y cada desafío tienen su respuesta');
        const toc = Array.from(document.querySelectorAll('.mn-toc a')).filter(a => !document.getElementById(a.getAttribute('href').slice(1)));
        ok(!toc.length, 'cada entrada del índice lleva a su sección');
        const block = document.querySelector('#cap-1 .mn-runnable');
        block.querySelector('[data-act="run"]').click();
        ok(/Hola/.test(block.querySelector('.mn-result').textContent), 'un ejemplo se ejecuta en el navegador');
        block.querySelector('[data-act="edit"]').click();
        const ta = block.querySelector('textarea.mn-editor');
        ta.value = ta.value.replace(/println\\("[^"]*"\\)/, 'println("Lo cambié yo")');
        block.querySelector('[data-act="run"]').click();
        ok(block.querySelector('.mn-result').textContent.indexOf('Lo cambié yo') !== -1, 'un ejemplo se puede editar y volver a ejecutar');
        ta.value = ta.value.replace(';', '');
        block.querySelector('[data-act="run"]').click();
        ok(/compilación/.test(block.querySelector('.mn-result').textContent), 'un error de compilación se explica');
        const scan = Array.from(document.querySelectorAll('.mn-runnable')).find(b => b.querySelector('.mn-stdin'));
        ok(!!scan, 'los ejemplos con Scanner piden la entrada');
        ok(!/[≥≤≠]/.test(Array.from(document.querySelectorAll('.cblock-body')).map(b => getComputedStyle(b).fontVariantLigatures).join('')) && getComputedStyle(document.querySelector('.cblock-body')).fontVariantLigatures === 'none', 'el código se ve como se tipea: sin ligaduras');
        const sol = document.querySelector('.mn-sol');
        ok(!!sol && !sol.open, 'las respuestas arrancan tapadas');
        ok(!!document.querySelector('a[href="manual/java-desde-cero.pdf"]'), 'se puede descargar el PDF');
        ok(!window.__errs.length, 'sin errores: ' + JSON.stringify(window.__errs));
        return out.join('\\n');
      })()`);
      report(r + '\nerrores JS: []');
    };
    await open('', 1280, 900);
    await c.send('Page.navigate', { url: `http://127.0.0.1:${port}/manual.html` });
    await delay(800);
    await checkManual('manual');
    await evaluate("document.getElementById('cap-7').scrollIntoView(); true");
    await shot('manual-escritorio');
    await c.send('Emulation.setDeviceMetricsOverride', { width: PHONE, height: 800, deviceScaleFactor: 1, mobile: true });
    await c.send('Page.navigate', { url: `http://127.0.0.1:${port}/manual.html?m=${Date.now()}` });
    await delay(800);
    for (let i = 0; i < 40 && await evaluate("document.documentElement.getAttribute('data-ready')") !== '1'; i++) await delay(250);
    await evaluate("document.getElementById('cap-18').scrollIntoView(); true");
    await shot('manual-movil');
    const docW = await evaluate('document.documentElement.scrollWidth');
    console.log((docW <= PHONE ? 'ok    ' : 'FALLA ') + 'manual a ' + PHONE + ' px: el documento mide ' + docW);
    if (docW > PHONE) { failed++; console.log('      se salen: ' + await evaluate(WIDEST.replace("'#main *, #sim-box *'", "'#libro *'"))); }
  }

  c.close();
  console.log('\n' + (failed ? failed + ' fallas' : 'OK: navegador sin fallas ni errores de JavaScript'));
  finish();
})();
