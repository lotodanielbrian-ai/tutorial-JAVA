// Genera el PDF del manual "Java desde cero" en hojas A4: tapa, índice con números de
// página, capítulos, apéndices y marcadores para navegar.
// Uso: node tools/manual-pdf.js            → public/manual/java-desde-cero.pdf
// Requiere Node 22+ y Edge o Chrome. La primera vez descarga Paged.js (versión fija).
const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CACHE = path.join(__dirname, '.cache');
const OUT = path.join(PUBLIC, 'manual', 'java-desde-cero.pdf');
const PAGED_URL = 'https://unpkg.com/pagedjs@0.4.3/dist/paged.polyfill.js';
const PAGED_FILE = path.join(CACHE, 'paged.polyfill-0.4.3.js');
const PORT = 9800 + Math.floor(Math.random() * 150);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.pdf': 'application/pdf', '.svg': 'image/svg+xml' };
const CANDIDATES = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium'
].filter(Boolean);

const delay = ms => new Promise(r => setTimeout(r, ms));

async function pagedSource() {
  if (fs.existsSync(PAGED_FILE)) return fs.readFileSync(PAGED_FILE, 'utf8');
  fs.mkdirSync(CACHE, { recursive: true });
  console.log('Descargando Paged.js 0.4.3…');
  const res = await fetch(PAGED_URL);
  if (!res.ok) throw new Error('No se pudo descargar Paged.js: HTTP ' + res.status);
  const src = await res.text();
  fs.writeFileSync(PAGED_FILE, src);
  return src;
}

async function connect(url) {
  const ws = new WebSocket(url);
  await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
  let id = 0;
  const pending = {};
  const listeners = [];
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; }
    else if (d.method) listeners.forEach(fn => fn(d));
  };
  return {
    send: (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); }),
    on: fn => listeners.push(fn),
    close: () => ws.close()
  };
}

(async () => {
  const exe = CANDIDATES.find(c => fs.existsSync(c));
  if (!exe) { console.log('No encontré Edge ni Chrome. Indicá la ruta con BROWSER.'); process.exit(2); }
  const paged = await pagedSource();

  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(PUBLIC, url === '/' ? 'index.html' : url);
    if (file.startsWith(PUBLIC) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(fs.readFileSync(file));
    } else { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, r));
  const port = server.address().port;

  const profile = path.join(CACHE, 'perfil');
  fs.rmSync(profile, { recursive: true, force: true });
  const browser = cp.spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', '--remote-debugging-port=' + PORT, '--user-data-dir=' + profile, 'about:blank'], { stdio: 'ignore' });
  const finish = code => {
    if (process.platform === 'win32') cp.spawnSync('taskkill', ['/F', '/T', '/PID', String(browser.pid)]);
    else browser.kill();
    server.close();
    process.exit(code);
  };

  let target = null;
  for (let i = 0; i < 40 && !target; i++) {
    await delay(500);
    try { target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find(t => t.type === 'page'); } catch (e) { /* arrancando */ }
  }
  if (!target) { console.log('El navegador no abrió el puerto de depuración.'); finish(1); return; }

  const c = await connect(target.webSocketDebuggerUrl);
  const errors = [];
  c.on(m => {
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception ? m.params.exceptionDetails.exception.description : m.params.exceptionDetails.text);
  });
  await c.send('Page.enable');
  await c.send('Runtime.enable');
  const evaluate = async (expression, awaitPromise) => {
    const r = await c.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: !!awaitPromise });
    if (r.result && r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception ? r.result.exceptionDetails.exception.description : r.result.exceptionDetails.text);
    return r.result && r.result.result ? r.result.result.value : undefined;
  };

  await c.send('Page.navigate', { url: `http://127.0.0.1:${port}/manual.html?print=1` });
  for (let i = 0; i < 60; i++) {
    await delay(500);
    if (await evaluate("document.documentElement.getAttribute('data-ready')") === '1') break;
  }
  await evaluate('document.fonts.ready.then(() => true)', true);
  if (errors.length) { console.log('Errores de JavaScript al armar el libro:\n' + errors.join('\n')); finish(1); return; }

  console.log('Paginando con Paged.js…');
  await evaluate('window.PagedConfig = { auto: false }; true');
  await evaluate(paged + '\n;true');
  const t0 = Date.now();
  const pages = await evaluate('window.PagedPolyfill.preview().then(f => f.total)', true);
  console.log('  ' + pages + ' páginas en ' + Math.round((Date.now() - t0) / 1000) + ' s');

  // Que el índice tenga números: si un enlace no encontró su página, se avisa
  const tocMissing = await evaluate(`Array.from(document.querySelectorAll('.mn-toc a')).filter(a => {
    const v = getComputedStyle(a, '::after').content; return !v || v === 'none' || !/\\d/.test(v);
  }).length`);
  // Contenido que se sale de la hoja (el div de columnas de Paged.js no cuenta)
  const overflow = await evaluate(`Array.from(document.querySelectorAll('.pagedjs_page_content')).filter(p => {
    const right = p.getBoundingClientRect().right + 2;
    return Array.from(p.querySelectorAll(':scope > div *')).some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.width < 1500 && r.right > right; });
  }).length`);

  // SHOTS=1,5,20 guarda esas páginas como imagen en tools/.cache/shots, para revisarlas a ojo
  if (process.env.SHOTS) {
    const dir = path.join(CACHE, 'shots');
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (const n of process.env.SHOTS.split(',').map(Number)) {
      const box = await evaluate(`(() => { const p = document.querySelector('.pagedjs_page[data-page-number="${n}"]'); if (!p) return null;
        p.scrollIntoView(); const r = p.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; })()`);
      if (!box) { console.log('  no existe la página ' + n); continue; }
      const shot = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, clip: { x: box.x, y: box.y, width: box.w, height: box.h, scale: 1 } });
      fs.writeFileSync(path.join(dir, 'p' + n + '.png'), Buffer.from(shot.result.data, 'base64'));
    }
    console.log('  capturas en ' + path.relative(ROOT, dir));
  }
  if (process.env.EVAL) console.log(await evaluate(process.env.EVAL));
  if (process.env.REPORT) {
    console.log(await evaluate(`(() => {
      const toc = Array.from(document.querySelectorAll('.mn-toc a')).filter(a => !/\\d/.test(getComputedStyle(a, '::after').content || '')).slice(0, 8).map(a => a.getAttribute('href'));
      const wide = Array.from(document.querySelectorAll('.pagedjs_page_content')).filter(p => Array.from(p.querySelectorAll(':scope > div *')).some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.width < 1500 && r.right > p.getBoundingClientRect().right + 2; })).slice(0, 6).map(p => {
        const page = p.closest('.pagedjs_page').dataset.pageNumber;
        const el = Array.from(p.querySelectorAll(':scope > div *')).filter(e => { const r = e.getBoundingClientRect(); return r.width < 1500 && r.right > p.getBoundingClientRect().right + 2; }).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
        return page + ': ' + (el ? el.tagName + '.' + el.className + ' ' + Math.round(el.getBoundingClientRect().width) : '?');
      });
      return 'índice sin número: ' + toc.join(' ') + '\\nanchos: ' + wide.join(' | ');
    })()`));
  }

  const pdf = await c.send('Page.printToPDF', {
    preferCSSPageSize: true,
    printBackground: true,
    generateDocumentOutline: true,
    generateTaggedPDF: true,
    transferMode: 'ReturnAsBase64'
  });
  if (!pdf.result || !pdf.result.data) { console.log('No se pudo imprimir: ' + JSON.stringify(pdf.error || pdf)); finish(1); return; }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, Buffer.from(pdf.result.data, 'base64'));
  const kb = Math.round(fs.statSync(OUT).size / 1024);
  console.log('PDF: ' + path.relative(ROOT, OUT) + ' · ' + pages + ' páginas · ' + kb + ' KB');
  // Un índice sin páginas o algo que se sale de la hoja es un libro roto: falla, para que la CI lo vea
  if (tocMissing) console.log('FALLA: ' + tocMissing + ' entradas del índice sin número de página');
  if (overflow) console.log('FALLA: ' + overflow + ' páginas con contenido más ancho que la hoja (REPORT=1 dice cuáles)');
  if (errors.length) console.log('Errores de JavaScript durante la paginación:\n' + errors.join('\n'));
  c.close();
  finish(errors.length || tocMissing || overflow ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
