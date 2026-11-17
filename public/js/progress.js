// Progress sync: Firestore (source of truth) + localStorage cache scoped by uid
var Progress = (function () {
  var QUIZ_LESSON_IDS = [14, 25, 30, 32, 35];
  var ACTIVE_UID_KEY = 'java_active_uid';
  var LEGACY_KEYS = [
    'java_done_v2',
    'java_quiz_scores',
    'java_completion_date',
    'java_cert_shown'
  ];

  function currentUser() {
    return (typeof AuthUI !== 'undefined' && AuthUI.user) ? AuthUI.user() : (firebaseAuth && firebaseAuth.currentUser);
  }

  function activeUid() {
    try {
      return localStorage.getItem(ACTIVE_UID_KEY) || '';
    } catch (e) {
      return '';
    }
  }

  function setActiveUid(uid) {
    if (!uid) {
      try { localStorage.removeItem(ACTIVE_UID_KEY); } catch (e) { /* ignore */ }
      return;
    }
    try { localStorage.setItem(ACTIVE_UID_KEY, uid); } catch (e) { /* ignore */ }
  }

  function keyFor(base, uid) {
    var id = uid || activeUid();
    if (!id) return null;
    return base + ':' + id;
  }

  function getJson(base, uid, fallback) {
    var k = keyFor(base, uid);
    if (!k) return fallback;
    try {
      var raw = localStorage.getItem(k);
      if (raw == null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function setJson(base, uid, value) {
    var k = keyFor(base, uid);
    if (!k) return;
    try {
      localStorage.setItem(k, JSON.stringify(value));
    } catch (e) { /* ignore */ }
  }

  function getStr(base, uid) {
    var k = keyFor(base, uid);
    if (!k) return null;
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  }

  function setStr(base, uid, value) {
    var k = keyFor(base, uid);
    if (!k) return;
    try {
      localStorage.setItem(k, value);
    } catch (e) { /* ignore */ }
  }

  function removeKey(base, uid) {
    var k = keyFor(base, uid);
    if (!k) return;
    try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
  }

  /** Delete unscoped legacy keys so they never mix into another account */
  function purgeLegacyGlobalKeys() {
    LEGACY_KEYS.forEach(function (k) {
      try { localStorage.removeItem(k); } catch (e) { /* ignore */ }
    });
  }

  function clearLocalForUid(uid) {
    if (!uid) return;
    removeKey('java_done_v2', uid);
    removeKey('java_quiz_scores', uid);
    removeKey('java_completion_date', uid);
    removeKey('java_cert_shown', uid);
    removeKey('java_practice', uid);
    removeKey('java_fase2', uid);
    removeKey('java_place', uid);
    clearDrafts(uid);
  }

  function clearDrafts(uid) {
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k.indexOf('java_draft_') === 0 && k.slice(-(uid.length + 1)) === ':' + uid) localStorage.removeItem(k);
      }
    } catch (e) { /* ignore */ }
  }

  function saveLocalCache(uid, completedLessons, scores, extras) {
    if (!uid) return;
    setJson('java_done_v2', uid, completedLessons || []);
    setJson('java_quiz_scores', uid, scores || {});
    if (extras) {
      if (extras.completionDate) setStr('java_completion_date', uid, extras.completionDate);
      if (extras.certShown) setStr('java_cert_shown', uid, extras.certShown);
    }
  }

  function loadLocalCache(uid) {
    if (!uid) {
      return { completedLessons: [], scores: {}, completionDate: null, certShown: null, practice: null, place: null };
    }
    var completedLessons = getJson('java_done_v2', uid, []);
    if (!Array.isArray(completedLessons)) completedLessons = [];
    var scores = getJson('java_quiz_scores', uid, {});
    if (!scores || typeof scores !== 'object') scores = {};
    return {
      completedLessons: completedLessons,
      scores: scores,
      completionDate: getStr('java_completion_date', uid),
      certShown: getStr('java_cert_shown', uid),
      practice: getJson('java_practice', uid, null),
      fase2: getJson('java_fase2', uid, null),
      place: getJson('java_place', uid, null)
    };
  }

  /**
   * Merge ONLY this user's uid-scoped local cache with their Firestore data.
   * Never reads global/legacy keys.
   */
  function loadUserState(uid, remote) {
    var local = loadLocalCache(uid);
    var remoteDone = (remote && remote.completedLessons) || [];
    var remoteScores = (remote && remote.scores) || {};
    var mergedDone = Array.from(new Set(local.completedLessons.concat(remoteDone)));
    var mergedScores = Object.assign({}, local.scores);
    Object.keys(remoteScores).forEach(function (k) {
      mergedScores[k] = Math.max(Number(mergedScores[k]) || 0, Number(remoteScores[k]) || 0);
    });
    return {
      completedLessons: mergedDone,
      scores: mergedScores,
      completionDate: local.completionDate || (remote && remote.completionDate) || null,
      certShown: local.certShown || null,
      practice: mergePractice(local.practice, remote && remote.practice),
      fase2: mergeFase2(local.fase2, remote && remote.fase2),
      place: newestPlace(local.place, remote && remote.place),
      certificateEarned: !!(remote && remote.certificateEarned) ||
        mergedDone.length === (typeof LESSONS !== 'undefined' ? LESSONS.length : 35)
    };
  }

  function mergePractice(local, remote) {
    var a = local || {};
    var b = remote || {};
    var scores = Object.assign({}, a.scores || {});
    Object.keys(b.scores || {}).forEach(function (k) {
      scores[k] = Math.max(scores[k] === undefined ? 0 : scores[k], b.scores[k]);
    });
    // Gana el resultado más reciente: un error nuevo sobre algo ya aprobado no se pierde
    var reviews = Object.assign({}, a.reviews || {});
    Object.keys(b.reviews || {}).forEach(function (k) {
      if (!reviews[k] || (b.reviews[k].at || 0) > (reviews[k].at || 0)) reviews[k] = b.reviews[k];
    });
    var wrong = Array.from(new Set((a.wrong || []).concat(b.wrong || []))).filter(function (k) {
      return reviews[k] ? reviews[k].box === 0 : scores[k] < 1;
    });
    return { scores: scores, wrong: wrong, sims: mergeSims(a.sims, b.sims), reviews: reviews, help: Object.assign({}, b.help || {}, a.help || {}) };
  }

  // Los simulacros de los dos lados, sin repetir y en orden: quedan los últimos 20
  function mergeSims(a, b) {
    var seen = Object.create(null);
    var all = [];
    (b || []).concat(a || []).forEach(function (s) {
      var k = JSON.stringify(s);
      if (seen[k]) return;
      seen[k] = true;
      all.push(s);
    });
    all.sort(function (x, y) { return (x.at || 0) - (y.at || 0); });
    return all.slice(-20);
  }

  // Entre dos fechas gana la primera: la de aprobar o terminar no se reescribe
  function earliest(x, y) {
    if (!x) return y || null;
    if (!y) return x;
    return x < y ? x : y;
  }

  function union(a, b) {
    return Array.from(new Set((a || []).concat(b || [])));
  }

  function phase1Ids(list) {
    if (typeof LESSONS === 'undefined') return list;
    var valid = new Set(LESSONS.map(function (l) { return l.id; }));
    return list.filter(function (id) { return valid.has(id); });
  }

  /**
   * Escribe en progress/{uid} combinando con lo que ya está en la nube, dentro de
   * una transacción. Ninguna pestaña ni dispositivo puede borrar el avance de otro,
   * aunque haya entrado sin poder leerlo: lo de la nube siempre se suma.
   */
  function mergeIntoProgress(uid, build) {
    var ref = firebaseDb.collection('progress').doc(uid);
    return firebaseDb.runTransaction(function (tx) {
      return tx.get(ref).then(function (snap) {
        var fields = build(snap.exists ? snap.data() : {});
        tx.set(ref, fields, { merge: true });
        return fields;
      });
    });
  }

  // Lo que no se pudo subir se reintenta al volver la conexión
  var pendingRetry = Object.create(null);

  function retryLater(name, fn) {
    pendingRetry[name] = fn;
  }

  function retryPending() {
    var fns = pendingRetry;
    pendingRetry = Object.create(null);
    Object.keys(fns).forEach(function (k) { fns[k](); });
  }

  function newestPlace(local, remote) {
    if (!local) return remote || null;
    if (!remote) return local;
    return (remote.at || 0) > (local.at || 0) ? remote : local;
  }

  function mergeFase2(local, remote) {
    var a = local || {};
    var b = remote || {};
    return {
      done: union(a.done, b.done),
      completionDate: earliest(a.completionDate, b.completionDate),
      certShown: !!(a.certShown || b.certShown),
      accredited: earliest(a.accredited, b.accredited)
    };
  }

  function saveFase2(fase2) {
    var uid = activeUid();
    if (!uid) return Promise.resolve();
    setJson('java_fase2', uid, fase2);
    var user = currentUser();
    if (!firebaseReady || !user || user.uid !== uid) return Promise.resolve();
    return mergeIntoProgress(uid, function (remote) {
      return { fase2: mergeFase2(fase2, remote.fase2) };
    }).then(function (fields) {
      return fields.fase2;
    }).catch(function (err) {
      console.warn('[Progress] saveFase2 failed', err);
      retryLater('fase2', function () { saveFase2(getJson('java_fase2', uid, fase2)); });
    });
  }

  var practiceTimer = null;
  var pendingPractice = null;

  function flushPractice() {
    if (practiceTimer) clearTimeout(practiceTimer);
    practiceTimer = null;
    var pending = pendingPractice;
    pendingPractice = null;
    if (!pending) return Promise.resolve();
    var user = currentUser();
    if (!firebaseReady || !user || user.uid !== pending.uid) return Promise.resolve();
    return mergeIntoProgress(pending.uid, function (remote) {
      return { practice: mergePractice(pending.practice, remote.practice) };
    }).catch(function (err) {
      console.warn('[Progress] savePractice failed', err);
      retryLater('practice', function () {
        if (!pendingPractice) pendingPractice = { uid: pending.uid, practice: getJson('java_practice', pending.uid, pending.practice) };
        flushPractice();
      });
    });
  }

  function savePractice(practice) {
    var uid = activeUid();
    if (!uid) return;
    setJson('java_practice', uid, practice);
    pendingPractice = { uid: uid, practice: practice };
    if (practiceTimer) clearTimeout(practiceTimer);
    practiceTimer = setTimeout(flushPractice, 1500);
  }

  var placeTimer = null;

  function savePlace(place) {
    var uid = activeUid();
    if (!uid) return;
    setJson('java_place', uid, place);
    if (placeTimer) clearTimeout(placeTimer);
    placeTimer = setTimeout(function () {
      var user = currentUser();
      if (!firebaseReady || !user || user.uid !== uid) return;
      firebaseDb.collection('progress').doc(uid).set({ place: place }, { merge: true }).catch(function (err) {
        console.warn('[Progress] savePlace failed', err);
      });
    }, 2000);
  }

  // Los borradores quedan en este navegador: el código a medio escribir no necesita viajar
  function saveDraft(id, code) { setStr('java_draft_' + id, activeUid(), code); }
  function loadDraft(id) { return getStr('java_draft_' + id, activeUid()); }
  function clearDraft(id) { removeKey('java_draft_' + id, activeUid()); }

  /**
   * Sube las lecciones completas sumándolas a las de la nube: nunca las reemplaza.
   * Devuelve la lista combinada (o null si no se pudo), para que la pestaña adopte
   * lo que se completó en otra.
   */
  function syncProgress(completedLessons, currentLesson, certificateEarned) {
    var user = currentUser();
    if (!user) return Promise.resolve(null);
    var uid = user.uid;
    var total = typeof LESSONS !== 'undefined' ? LESSONS.length : 35;
    saveLocalCache(uid, completedLessons, getJson('java_quiz_scores', uid, {}));
    if (certificateEarned && !getStr('java_completion_date', uid)) {
      setStr('java_completion_date', uid, new Date().toISOString());
    }
    if (!firebaseReady) return Promise.resolve(null);
    return mergeIntoProgress(uid, function (remote) {
      var lessons = phase1Ids(union(remote.completedLessons, completedLessons));
      var cert = !!remote.certificateEarned || lessons.length === total;
      var payload = {
        completedLessons: lessons,
        currentLesson: typeof currentLesson === 'number' ? currentLesson : 0,
        certificateEarned: cert,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      // La fecha del certificado se fija una sola vez, la primera
      if (cert && !remote.completionDate) payload.completionDate = firebase.firestore.FieldValue.serverTimestamp();
      return payload;
    }).then(function (payload) {
      return { completedLessons: payload.completedLessons, certificateEarned: payload.certificateEarned };
    }).catch(function (err) {
      console.warn('[Progress] sync failed', err);
      retryLater('lessons', function () {
        syncProgress(getJson('java_done_v2', uid, completedLessons), currentLesson, certificateEarned);
      });
      return null;
    });
  }

  function saveAttempt(opts) {
    var user = currentUser();
    if (!firebaseReady || !user || !opts) return Promise.resolve();
    var ref = firebaseDb.collection('attempts').doc(user.uid).collection('lessons').doc(String(opts.lessonId));
    return ref.get().then(function (snap) {
      var prev = snap.exists ? snap.data() : {};
      var attemptNumber = (prev.attemptNumber || 0) + 1;
      var bestPercent = Math.max(prev.scorePercent || 0, opts.scorePercent || 0);
      return ref.set({
        type: opts.type || 'exercise',
        passed: !!opts.passed || !!prev.passed,
        quizCorrect: opts.quizCorrect || 0,
        quizTotal: opts.quizTotal || 0,
        scorePercent: bestPercent,
        attemptNumber: attemptNumber,
        lastAttemptAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    }).catch(function (err) {
      console.warn('[Progress] saveAttempt failed', err);
    });
  }

  function saveQuizScores(scores) {
    var uid = activeUid();
    if (!uid) return;
    setJson('java_quiz_scores', uid, scores || {});
  }

  function markCertShown() {
    var uid = activeUid();
    if (!uid) return;
    setStr('java_cert_shown', uid, '1');
  }

  function wasCertShown() {
    var uid = activeUid();
    if (!uid) return false;
    return !!getStr('java_cert_shown', uid);
  }

  function getCompletionDate() {
    var uid = activeUid();
    if (!uid) return null;
    return getStr('java_completion_date', uid);
  }

  var LOAD_TIMEOUT_MS = 12000;

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
      promise.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
    });
  }

  /**
   * Lee el progreso de la nube. Si falla, devuelve { failed: true }: quien llama
   * no debe tomarlo como "cero lecciones".
   */
  function loadRemote() {
    var user = currentUser();
    if (!firebaseReady || !user) {
      return Promise.resolve({ completedLessons: [], scores: {} });
    }
    var progressP = firebaseDb.collection('progress').doc(user.uid).get();
    var attemptsP = firebaseDb.collection('attempts').doc(user.uid).collection('lessons').get();
    return withTimeout(Promise.all([progressP, attemptsP]), LOAD_TIMEOUT_MS).then(function (results) {
      var progSnap = results[0];
      var attSnap = results[1];
      var progData = progSnap.exists ? progSnap.data() : {};
      var completedLessons = progData.completedLessons || [];
      var finished = progData.completionDate && progData.completionDate.toDate ? progData.completionDate.toDate().toISOString() : null;
      var scores = {};
      attSnap.forEach(function (doc) {
        var d = doc.data();
        var id = parseInt(doc.id, 10);
        if (QUIZ_LESSON_IDS.indexOf(id) !== -1 && d.scorePercent != null) {
          scores[id] = d.scorePercent;
        }
      });
      return {
        completedLessons: completedLessons,
        scores: scores,
        certificateEarned: !!progData.certificateEarned,
        completionDate: finished,
        practice: progData.practice || null,
        fase2: progData.fase2 || null,
        place: progData.place || null
      };
    }).catch(function (err) {
      console.warn('[Progress] loadRemote failed', err);
      return { failed: true, completedLessons: [], scores: {} };
    });
  }

  function resetRemote() {
    var user = currentUser();
    if (!user) return Promise.resolve();
    // Lo pendiente de antes del reinicio no tiene que volver a subir
    if (practiceTimer) clearTimeout(practiceTimer);
    if (placeTimer) clearTimeout(placeTimer);
    practiceTimer = null;
    placeTimer = null;
    pendingPractice = null;
    pendingRetry = Object.create(null);
    clearLocalForUid(user.uid);
    if (!firebaseReady) return Promise.resolve();
    var batch = firebaseDb.batch();
    batch.delete(firebaseDb.collection('progress').doc(user.uid));
    batch.delete(firebaseDb.collection('rankings').doc(user.uid));
    return firebaseDb.collection('attempts').doc(user.uid).collection('lessons').get().then(function (snap) {
      snap.forEach(function (doc) { batch.delete(doc.ref); });
      return batch.commit();
    }).catch(function (err) {
      console.warn('[Progress] resetRemote failed', err);
    });
  }

  function loadHistory() {
    var user = currentUser();
    if (!firebaseReady || !user) return Promise.resolve([]);
    return firebaseDb.collection('attempts').doc(user.uid).collection('lessons').get().then(function (snap) {
      var rows = [];
      snap.forEach(function (doc) {
        var d = doc.data();
        rows.push({
          lessonId: parseInt(doc.id, 10),
          type: d.type,
          passed: d.passed,
          quizCorrect: d.quizCorrect,
          quizTotal: d.quizTotal,
          scorePercent: d.scorePercent,
          attemptNumber: d.attemptNumber
        });
      });
      rows.sort(function (a, b) { return a.lessonId - b.lessonId; });
      return rows;
    }).catch(function (err) {
      console.warn('[Progress] loadHistory failed', err);
      return [];
    });
  }

  // One-time: strip dangerous shared keys
  purgeLegacyGlobalKeys();

  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('pagehide', flushPractice);
    window.addEventListener('online', retryPending);
  }

  return {
    flushPractice: flushPractice,
    retryPending: retryPending,
    phase1Ids: phase1Ids,
    union: union,
    syncProgress: syncProgress,
    saveAttempt: saveAttempt,
    loadRemote: loadRemote,
    loadUserState: loadUserState,
    loadLocalCache: loadLocalCache,
    saveLocalCache: saveLocalCache,
    saveQuizScores: saveQuizScores,
    savePractice: savePractice,
    saveFase2: saveFase2,
    savePlace: savePlace,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    clearDraft: clearDraft,
    mergePractice: mergePractice,
    markCertShown: markCertShown,
    wasCertShown: wasCertShown,
    getCompletionDate: getCompletionDate,
    clearLocalForUid: clearLocalForUid,
    purgeLegacyGlobalKeys: purgeLegacyGlobalKeys,
    setActiveUid: setActiveUid,
    activeUid: activeUid,
    resetRemote: resetRemote,
    loadHistory: loadHistory,
    QUIZ_LESSON_IDS: QUIZ_LESSON_IDS
  };
})();
