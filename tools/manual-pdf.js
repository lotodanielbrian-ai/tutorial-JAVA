// Genera el PDF del manual "Java desde cero" en hojas A4: tapa, índice con números de
// página, capítulos, apéndices y marcadores para navegar.
// Uso:
//   node tools/manual-pdf.js            → public/manual/java-desde-cero.pdf
//   node tools/manual-pdf.js --tomo=1   → public/manual/tomo-1-super-basico.pdf
//   node tools/manual-pdf.js --tomos    → genera los 6 tomos en public/manual/
//   node tools/manual-pdf.js --all      → completo + los 6 tomos
// Requiere Node 22+ y Edge o Chrome. La primera vez descarga Paged.js (versión fija).
const http = require('http');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const CACHE = path.join(__dirname, '.cache');
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

function loadTomos() {
  const ctx = { cb: () => '', ann: () => '' };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(PUBLIC, 'js/manual-contenido.js'), 'utf8'), ctx);
  return vm.runInContext('MANUAL.TOMOS', ctx);
}

function selectJobs() {
  const tomos = loadTomos();
  const args = process.argv.slice(2);
  const tomoArg = args.find(a => /^--tomo=[1-6]$/.test(a));
  if (tomoArg) {
    const id = tomoArg.split('=')[1];
    const t = tomos.find(x => x.id === id);
    return [{ url: `/manual.html?print=1&tomo=${t.id}`, out: path.join(PUBLIC, 'manual', `${t.slug}.pdf`), label: t.num }];
  }
  const tomoJobs = tomos.map(t => ({
    url: `/manual.html?print=1&tomo=${t.id}`,
    out: path.join(PUBLIC, 'manual', `${t.slug}.pdf`),
    label: t.num
  }));
  const fullJob = { url: '/manual.html?print=1', out: path.join(PUBLIC, 'manual', 'java-desde-cero.pdf'), label: 'Completo (Fase 1)' };
  const f2Job = { url: '/manual.html?print=1&fase=2', out: path.join(PUBLIC, 'manual', 'java-fase-2.pdf'), label: 'Completo (Fase 2)' };
  if (args.includes('--tomos')) return tomoJobs;
  if (args.includes('--fase2')) return [f2Job];
  if (args.includes('--all')) return [fullJob, f2Job].concat(tomoJobs);
  return [fullJob];
}

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
  const jobs = selectJobs();
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
  let errors = [];
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

  let anyFail = 0;
  for (const job of jobs) {
    errors = [];
    console.log(`\n=== ${job.label} (${job.url}) ===`);
    await c.send('Page.navigate', { url: `http://127.0.0.1:${port}${job.url}` });
    for (let i = 0; i < 60; i++) {
      await delay(500);
      if (await evaluate("document.documentElement.getAttribute('data-ready')") === '1') break;
    }
    await evaluate('document.fonts.ready.then(() => true)', true);
    if (errors.length) { console.log('Errores de JavaScript al armar el libro:\n' + errors.join('\n')); anyFail = 1; continue; }

    console.log('Paginando con Paged.js…');
    await evaluate('window.PagedConfig = { auto: false }; true');
    await evaluate(paged + '\n;true');
    const t0 = Date.now();
    const pages = await evaluate('window.PagedPolyfill.preview().then(f => f.total)', true);
    console.log('  ' + pages + ' páginas en ' + Math.round((Date.now() - t0) / 1000) + ' s');

    const tocMissing = await evaluate(`Array.from(document.querySelectorAll('.mn-toc a')).filter(a => {
      const v = getComputedStyle(a, '::after').content; return !v || v === 'none' || !/\\d/.test(v);
    }).length`);
    const overflow = await evaluate(`Array.from(document.querySelectorAll('.pagedjs_page_content')).filter(p => {
      const right = p.getBoundingClientRect().right + 2;
      return Array.from(p.querySelectorAll(':scope > div *')).some(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.width < 1500 && r.right > right; });
    }).length`);

    if (process.env.SHOTS && jobs.length === 1) {
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
    if (!pdf.result || !pdf.result.data) { console.log('No se pudo imprimir: ' + JSON.stringify(pdf.error || pdf)); anyFail = 1; continue; }
    fs.mkdirSync(path.dirname(job.out), { recursive: true });
    fs.writeFileSync(job.out, Buffer.from(pdf.result.data, 'base64'));
    const kb = Math.round(fs.statSync(job.out).size / 1024);

    const zlib = require('zlib');
    const raw = fs.readFileSync(job.out);
    const rawLatin = raw.toString('latin1');
    let type3 = (rawLatin.match(/\/Subtype\s*\/Type3/g) || []).length;
    let outlines = (rawLatin.match(/\/Type\s*\/Outlines\b/g) || []).length;
    let outlineItems = (rawLatin.match(/\/Title\s*(?:\(|<)/g) || []).length;
    for (let at = raw.indexOf('stream'); at !== -1; at = raw.indexOf('stream', at + 6)) {
      let start = at + 6;
      if (raw[start] === 13) start++;
      if (raw[start] === 10) start++;
      const end = raw.indexOf('endstream', start);
      if (end === -1) break;
      try {
        const dec = zlib.inflateSync(raw.subarray(start, end)).toString('latin1');
        type3 += (dec.match(/\/Subtype\s*\/Type3/g) || []).length;
        outlines += (dec.match(/\/Type\s*\/Outlines\b/g) || []).length;
        outlineItems += (dec.match(/\/Title\s*(?:\(|<)/g) || []).length;
      } catch (e) { /* no es Flate */ }
      at = end;
    }
    console.log('PDF: ' + path.relative(ROOT, job.out) + ' · ' + pages + ' páginas · ' + kb + ' KB · marcadores: ' + outlineItems);
    if (!outlines || !outlineItems) console.log('FALLA: el PDF quedó sin marcadores de navegación (/Outlines)');
    if (type3) console.log('FALLA: ' + type3 + ' fuentes Type 3 (emojis de color)');
    if (tocMissing) console.log('FALLA: ' + tocMissing + ' entradas del índice sin número de página');
    if (overflow) console.log('FALLA: ' + overflow + ' páginas con contenido más ancho que la hoja');
    if (errors.length || tocMissing || overflow || type3 || !outlines || !outlineItems) anyFail = 1;
  }

  c.close();
  finish(anyFail);
})().catch(e => { console.error(e); process.exit(1); });
