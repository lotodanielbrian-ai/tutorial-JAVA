// Guardado del progreso contra un Firestore simulado: cargas que fallan, dos pestañas
// sobre la misma nube y el nombre público del ranking. Uso: node tests/sync.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
let checks = 0;
let failures = 0;
function ok(cond, msg) {
  checks++;
  if (!cond) { failures++; console.log('  FALLA: ' + msg); }
}

// ── Firestore en memoria ───────────────────────────────────────────────
const TS = { __serverTimestamp: true };
function isPlain(v) { return v && typeof v === 'object' && !Array.isArray(v) && v !== TS; }
function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
function deepMerge(into, from) {
  Object.keys(from).forEach(k => {
    if (isPlain(from[k]) && isPlain(into[k])) deepMerge(into[k], from[k]);
    else into[k] = clone(from[k]);
  });
  return into;
}

function makeDb() {
  const docs = new Map();
  const db = { docs, failReads: false, failWrites: false };
  const snap = p => ({ exists: docs.has(p), data: () => clone(docs.get(p)) || {} });
  const write = (p, d, o) => {
    if (o && o.merge && docs.has(p)) deepMerge(docs.get(p), d);
    else docs.set(p, clone(d));
  };
  const ref = p => ({
    path: p,
    get() {
      if (db.failReads) return Promise.reject(new Error('client is offline'));
      const kids = [...docs.keys()].filter(k => k.startsWith(p + '/') && !k.slice(p.length + 1).includes('/'));
      return Promise.resolve(Object.assign(snap(p), {
        forEach: fn => kids.forEach(k => fn({ id: k.split('/').pop(), data: () => clone(docs.get(k)) }))
      }));
    },
    set(d, o) {
      if (db.failWrites) return Promise.reject(new Error('unavailable'));
      write(p, d, o);
      return Promise.resolve();
    },
    collection: n => ref(p + '/' + n),
    doc: n => ref(p + '/' + n)
  });
  db.api = {
    collection: n => ref(n),
    runTransaction(fn) {
      if (db.failReads || db.failWrites) return Promise.reject(new Error('client is offline'));
      const queued = [];
      const tx = { get: r => r.get(), set: (r, d, o) => queued.push([r.path, d, o]) };
      return fn(tx).then(result => { queued.forEach(q => write(q[0], q[1], q[2])); return result; });
    },
    batch() {
      const ops = [];
      return {
        delete: r => ops.push(() => docs.delete(r.path)),
        set: (r, d, o) => ops.push(() => write(r.path, d, o)),
        commit() {
          if (db.failReads || db.failWrites) return Promise.reject(new Error('client is offline'));
          ops.forEach(op => op());
          return Promise.resolve();
        }
      };
    }
  };
  return db;
}

function makeStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    key: i => [...m.keys()][i],
    get length() { return m.size; }
  };
}

const SOURCES = ['public/js/progress.js', 'public/js/ranking.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8'));

// Una pestaña: su propio Progress y Ranking, con la nube y el localStorage que le toquen
function tab(db, storage, user) {
  const ctx = {
    console: { warn() {}, log: console.log, error: console.error },
    setTimeout, clearTimeout, Promise, JSON, Object, Array, Set, Math, Number, String, Date,
    localStorage: storage,
    window: { addEventListener() {} },
    LESSONS: Array.from({ length: 35 }, (_, i) => ({ id: i + 1 })),
    firebaseReady: true,
    firebaseDb: db.api,
    firebase: { firestore: { FieldValue: { serverTimestamp: () => TS } } },
    AuthUI: { user: () => user }
  };
  vm.createContext(ctx);
  SOURCES.forEach(src => vm.runInContext(src, ctx));
  ctx.Progress.setActiveUid(user.uid);
  return ctx;
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const progressDoc = db => db.docs.get('progress/u1') || {};

async function main() {
  const user = { uid: 'u1', displayName: 'Ana Pérez', email: 'ana@mail.com', photoURL: 'https://lh3.googleusercontent.com/a/x' };

  console.log('1. Una carga fallida no borra la nube');
  {
    const db = makeDb();
    db.docs.set('progress/u1', { completedLessons: range(1, 35), certificateEarned: true, completionDate: 'fecha-original', practice: { scores: { '7-1': 1 }, reviews: { '7-1': { box: 3, due: '2030-01-01', at: 50 } }, wrong: [], sims: [] } });
    const t = tab(db, makeStorage(), user);
    db.failReads = true;
    const remote = await t.Progress.loadRemote();
    ok(remote.failed === true, 'una carga fallida tiene que avisar que falló');
    const state = t.Progress.loadUserState('u1', remote);
    // Lo mismo que hacía afterLogin antes: subir lo que tiene este navegador
    await t.Progress.syncProgress(state.completedLessons, 0, false);
    db.failReads = false;
    ok(progressDoc(db).completedLessons.length === 35, 'sin conexión, sincronizar no tiene que tocar la nube');
    const merged = await t.Progress.syncProgress(state.completedLessons, 0, false);
    const doc = progressDoc(db);
    ok(doc.completedLessons.length === 35, 'con la nube sin leer, subir cero lecciones no borra las 35 guardadas');
    ok(doc.certificateEarned === true, 'el certificado de la nube no se pierde');
    ok(doc.completionDate === 'fecha-original', 'la fecha del certificado no se reescribe');
    ok(merged && merged.completedLessons.length === 35, 'la pestaña recibe las lecciones de la nube para mostrarlas');
    t.Progress.savePractice({ scores: {}, reviews: {}, wrong: [], sims: [] });
    await t.Progress.flushPractice();
    ok(progressDoc(db).practice.reviews['7-1'].box === 3, 'una práctica vacía no borra la de la nube');
  }

  console.log('2. Dos pestañas no se pisan');
  {
    const db = makeDb();
    const storage = makeStorage();
    db.docs.set('progress/u1', { completedLessons: range(1, 11) });
    const a = tab(db, storage, user);
    const b = tab(db, storage, user);
    await a.Progress.syncProgress(range(1, 12), 11, false);
    const fromB = await b.Progress.syncProgress(range(1, 11).concat([13]), 12, false);
    const lessons = progressDoc(db).completedLessons;
    ok(lessons.includes(12) && lessons.includes(13), 'las lecciones de las dos pestañas quedan guardadas');
    ok(fromB.completedLessons.includes(12), 'la pestaña vieja se entera de lo que hizo la otra');

    a.Progress.savePractice({ scores: { '7-1': 1 }, reviews: { '7-1': { box: 2, due: '2030-01-03', at: 200 } }, wrong: [], sims: [{ tramo: 'A', at: 10 }] });
    await a.Progress.flushPractice();
    b.Progress.savePractice({ scores: { '8-1': 0, '7-1': 0.5 }, reviews: { '8-1': { box: 0, due: '2030-01-02', at: 150 }, '7-1': { box: 0, due: '2030-01-01', at: 100 } }, wrong: ['8-1', '7-1'], sims: [{ tramo: 'B', at: 20 }] });
    await b.Progress.flushPractice();
    const p = progressDoc(db).practice;
    ok(p.reviews['7-1'].box === 2, 'un repaso viejo de otra pestaña no pisa uno más nuevo');
    ok(p.reviews['8-1'] && p.wrong.includes('8-1'), 'lo respondido en la otra pestaña también queda');
    ok(!p.wrong.includes('7-1'), 'lo resuelto después no vuelve a figurar como error');
    ok(p.scores['7-1'] === 1, 'el mejor puntaje de cada actividad se conserva');
    ok(p.sims.length === 2, 'los simulacros de las dos pestañas se conservan');

    await a.Progress.saveFase2({ done: [101], completionDate: null, certShown: false, accredited: '2026-11-01T00:00:00Z' });
    await b.Progress.saveFase2({ done: [102], completionDate: null, certShown: false, accredited: null });
    const f2 = progressDoc(db).fase2;
    ok(f2.done.includes(101) && f2.done.includes(102), 'la Fase 2 de las dos pestañas se suma');
    ok(f2.accredited === '2026-11-01T00:00:00Z', 'una pestaña vieja no borra la prueba de nivel aprobada');
  }

  console.log('3. Ranking');
  {
    const db = makeDb();
    const storage = makeStorage();
    db.docs.set('progress/u1', { completedLessons: range(1, 20) });
    const a = tab(db, storage, user);
    await a.Ranking.update(range(1, 20), { 14: 100 }, false);
    let r = db.docs.get('rankings/u1');
    ok(r.lessonsCompleted === 20 && r.quizPoints === 15 && r.totalScore === 215, 'el puntaje se calcula como antes');
    ok(r.displayName === 'Ana Pérez', 'con nombre, el ranking muestra el nombre');
    await a.Ranking.update(range(1, 5), {}, false);
    r = db.docs.get('rankings/u1');
    ok(r.lessonsCompleted === 20 && r.quizPoints === 15, 'una pestaña vieja no baja el puntaje');

    const noName = tab(db, storage, { uid: 'u1', displayName: '', email: 'ana@mail.com', photoURL: '' });
    await noName.Ranking.update(range(1, 20), {}, false);
    r = db.docs.get('rankings/u1');
    ok(r.displayName === 'Estudiante', 'sin nombre, el ranking no muestra el email');
    ok(!JSON.stringify(r).includes('@'), 'ningún campo del ranking lleva un email');

    const mailName = tab(db, storage, { uid: 'u1', displayName: 'ana@mail.com', email: 'ana@mail.com', photoURL: 'javascript:alert(1)' });
    await mailName.Ranking.update(range(1, 20), {}, false);
    r = db.docs.get('rankings/u1');
    ok(r.displayName === 'Estudiante', 'un nombre que es un email tampoco se publica');
    ok(r.photoURL === '', 'solo se publican fotos con https');
    const keys = Object.keys(r).sort().join(',');
    ok(keys === 'certificateBonus,displayName,lessonsCompleted,photoURL,quizPoints,totalScore,updatedAt', 'el ranking solo escribe los campos que permiten las reglas: ' + keys);
  }

  console.log('4. Reintentos');
  {
    const db = makeDb();
    const t = tab(db, makeStorage(), user);
    db.failWrites = true;
    const r = await t.Progress.syncProgress([1, 2, 3], 2, false);
    ok(r === null, 'si no se pudo subir, avisa');
    db.failWrites = false;
    t.Progress.retryPending();
    await new Promise(res => setTimeout(res, 20));
    ok((progressDoc(db).completedLessons || []).length === 3, 'al volver la conexión, lo pendiente se sube');
    await t.Progress.resetRemote();
    const keys = Object.keys(progressDoc(db));
    ok(keys.length === 1 && keys[0] === 'resetAt', 'reiniciar deja la nube vacía, solo con la marca de reinicio');
  }

  console.log('5. Reiniciar llega a todos los navegadores');
  {
    const db = makeDb();
    const storeA = makeStorage();
    const storeB = makeStorage();
    // Los dos navegadores entran y guardan progreso
    const a = tab(db, storeA, user);
    a.Progress.loadUserState('u1', await a.Progress.loadRemote());
    await a.Progress.syncProgress(range(1, 5), 4, false);
    const b = tab(db, storeB, user);
    const stB = b.Progress.loadUserState('u1', await b.Progress.loadRemote());
    ok(stB.completedLessons.length === 5, 'antes de reiniciar, el otro navegador ve el progreso');
    await b.Progress.syncProgress(range(1, 5), 4, false);
    b.Progress.savePractice({ scores: { '7-1': 1 }, reviews: { '7-1': { box: 2, due: '2030-01-03', at: 200 } }, wrong: [], sims: [] });
    await b.Progress.flushPractice();
    await b.Ranking.update(range(1, 5), {}, false);
    ok(db.docs.has('rankings/u1'), 'el ranking existe antes de reiniciar');

    // A reinicia
    const resetOk = await a.Progress.resetRemote();
    ok(resetOk === true, 'reiniciar con conexión avisa que funcionó');
    ok(!db.docs.has('rankings/u1'), 'reiniciar borra el ranking');

    // La pestaña de B que quedó abierta intenta guardar lo viejo
    let reloads = 0;
    b.Progress.setResetHandler(() => { reloads++; });
    const stale = await b.Progress.syncProgress(range(1, 6), 5, false);
    ok(stale === null, 'una pestaña de antes del reinicio no puede subir lecciones');
    b.Progress.savePractice({ scores: { '7-1': 1 }, reviews: {}, wrong: [], sims: [] });
    await b.Progress.flushPractice().catch(() => {});
    await b.Progress.saveFase2({ done: [101], completionDate: null, certShown: false, accredited: null });
    await b.Ranking.update(range(1, 6), {}, false);
    await b.Progress.saveAttempt({ lessonId: 14, type: 'quiz', passed: true, scorePercent: 100 });
    ok(![...db.docs.keys()].some(k => k.startsWith('attempts/')), 'la pestaña vieja no sube intentos de cuestionario');
    const after = Object.keys(progressDoc(db));
    ok(after.length === 1 && after[0] === 'resetAt', 'nada de la pestaña vieja llega a la nube: ' + after.join(','));
    ok(!db.docs.has('rankings/u1'), 'la pestaña vieja no recrea el ranking');
    ok(reloads >= 1, 'la pestaña vieja se entera y se recarga');
    ok(!storeB.getItem('java_done_v2:u1'), 'la pestaña vieja borra su caché');

    // B vuelve a entrar: tiene que ver el progreso vacío
    const b2 = tab(db, storeB, user);
    const st2 = b2.Progress.loadUserState('u1', await b2.Progress.loadRemote());
    ok(st2.completedLessons.length === 0, 'al volver a entrar en otro navegador, el progreso está reiniciado');
    ok(Object.keys(st2.practice.scores).length === 0, 'la práctica también está reiniciada');

    // Desde ahí guarda normal
    const fresh = await b2.Progress.syncProgress([1], 0, false);
    ok(fresh && fresh.completedLessons.length === 1 && progressDoc(db).completedLessons.length === 1, 'después del reinicio se guarda normal');
    ok(progressDoc(db).resetAt, 'la marca de reinicio se conserva');

    // Un navegador con caché vieja que entra por primera vez después del reinicio
    const storeC = makeStorage();
    storeC.setItem('java_done_v2:u1', JSON.stringify(range(1, 20)));
    const c = tab(db, storeC, user);
    const stC = c.Progress.loadUserState('u1', await c.Progress.loadRemote());
    ok(stC.completedLessons.length === 1, 'una caché de antes del reinicio no vuelve: ' + stC.completedLessons.length);

    // Si la carga falla y la pestaña detecta el reinicio al escribir, no queda en un bucle de recargas
    const storeD = makeStorage();
    storeD.setItem('java_done_v2:u1', JSON.stringify(range(1, 9)));
    const d = tab(db, storeD, user);
    db.failReads = true;
    d.Progress.loadUserState('u1', await d.Progress.loadRemote());
    db.failReads = false;
    let dReloads = 0;
    d.Progress.setResetHandler(() => { dReloads++; });
    await d.Progress.syncProgress(range(1, 9), 8, false);
    ok(dReloads === 1 && progressDoc(db).completedLessons.length === 1, 'detecta el reinicio aunque no haya podido leer');
    const d2 = tab(db, storeD, user);
    db.failReads = true;
    d2.Progress.loadUserState('u1', await d2.Progress.loadRemote());
    db.failReads = false;
    let d2Reloads = 0;
    d2.Progress.setResetHandler(() => { d2Reloads++; });
    await d2.Progress.syncProgress([2], 1, false);
    ok(d2Reloads === 0 && progressDoc(db).completedLessons.includes(2), 'después de recargar ya no se considera vieja: no hay bucle');
  }

  console.log('5b. Un intento de cuestionario de antes del reinicio');
  {
    const db = makeDb();
    const a = tab(db, makeStorage(), user);
    a.Progress.loadUserState('u1', await a.Progress.loadRemote());
    const e = tab(db, makeStorage(), user);
    e.Progress.loadUserState('u1', await e.Progress.loadRemote());
    await a.Progress.resetRemote();
    let reloads = 0;
    e.Progress.setResetHandler(() => { reloads++; });
    await e.Progress.saveAttempt({ lessonId: 14, type: 'quiz', passed: true, scorePercent: 100 });
    ok(![...db.docs.keys()].some(k => k.startsWith('attempts/')), 'un intento de antes del reinicio no llega a la nube');
    ok(reloads === 1 && e.Progress.isFrozen(), 'el intento viejo hace que la pestaña se entere del reinicio');
  }

  console.log('6. Reiniciar sin conexión');
  {
    const db = makeDb();
    db.docs.set('progress/u1', { completedLessons: range(1, 3) });
    const storage = makeStorage();
    const t = tab(db, storage, user);
    t.Progress.loadUserState('u1', await t.Progress.loadRemote());
    t.Progress.saveLocalCache('u1', range(1, 3), {});
    db.failWrites = true;
    const r = await t.Progress.resetRemote();
    db.failWrites = false;
    ok(r === false, 'sin conexión, reiniciar avisa que no se pudo');
    ok(progressDoc(db).completedLessons.length === 3, 'sin conexión, la nube queda como estaba');
    ok(JSON.parse(storage.getItem('java_done_v2:u1')).length === 3, 'sin conexión, este navegador conserva su progreso');
  }

  console.log('7. Cuentas que nunca reiniciaron');
  {
    const db = makeDb();
    db.docs.set('progress/u1', { completedLessons: range(1, 4) });
    const storage = makeStorage();
    storage.setItem('java_done_v2:u1', JSON.stringify([5]));
    const t = tab(db, storage, user);
    const st = t.Progress.loadUserState('u1', await t.Progress.loadRemote());
    ok(st.completedLessons.length === 5, 'sin reinicios, la caché local se sigue sumando');
    const r = await t.Progress.syncProgress(st.completedLessons, 0, false);
    ok(r && progressDoc(db).completedLessons.length === 5, 'sin reinicios, se guarda como siempre');
  }

  console.log('\n' + (failures ? failures + ' fallas en ' + checks + ' verificaciones' : 'OK: ' + checks + ' verificaciones'));
  process.exit(failures ? 1 : 0);
}

main().catch(e => { console.error(e); process.exit(1); });
