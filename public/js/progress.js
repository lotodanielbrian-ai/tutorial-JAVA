// Progress sync: Firestore (source of truth) + localStorage cache scoped by uid
var Progress = (function () {
  var QUIZ_LESSON_IDS = [14, 25, 30, 32];
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
      return { completedLessons: [], scores: {}, completionDate: null, certShown: null };
    }
    var completedLessons = getJson('java_done_v2', uid, []);
    if (!Array.isArray(completedLessons)) completedLessons = [];
    var scores = getJson('java_quiz_scores', uid, {});
    if (!scores || typeof scores !== 'object') scores = {};
    return {
      completedLessons: completedLessons,
      scores: scores,
      completionDate: getStr('java_completion_date', uid),
      certShown: getStr('java_cert_shown', uid)
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
      completionDate: local.completionDate || null,
      certShown: local.certShown || null,
      certificateEarned: !!(remote && remote.certificateEarned) ||
        mergedDone.length === (typeof LESSONS !== 'undefined' ? LESSONS.length : 34)
    };
  }

  function syncProgress(completedLessons, currentLesson, certificateEarned) {
    var user = currentUser();
    if (!user) return Promise.resolve();
    var uid = user.uid;
    saveLocalCache(uid, completedLessons, getJson('java_quiz_scores', uid, {}));
    if (certificateEarned) {
      setStr('java_completion_date', uid, new Date().toISOString());
    }
    if (!firebaseReady) return Promise.resolve();
    var payload = {
      completedLessons: completedLessons,
      currentLesson: typeof currentLesson === 'number' ? currentLesson : 0,
      certificateEarned: !!certificateEarned,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (certificateEarned) {
      payload.completionDate = firebase.firestore.FieldValue.serverTimestamp();
    }
    return firebaseDb.collection('progress').doc(uid).set(payload, { merge: true }).catch(function (err) {
      console.warn('[Progress] sync failed', err);
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

  function setCompletionDateIso(iso) {
    var uid = activeUid();
    if (!uid) return;
    setStr('java_completion_date', uid, iso);
  }

  function loadRemote() {
    var user = currentUser();
    if (!firebaseReady || !user) {
      return Promise.resolve({ completedLessons: [], scores: {} });
    }
    var progressP = firebaseDb.collection('progress').doc(user.uid).get();
    var attemptsP = firebaseDb.collection('attempts').doc(user.uid).collection('lessons').get();
    return Promise.all([progressP, attemptsP]).then(function (results) {
      var progSnap = results[0];
      var attSnap = results[1];
      var completedLessons = progSnap.exists ? (progSnap.data().completedLessons || []) : [];
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
        certificateEarned: !!(progSnap.exists && progSnap.data().certificateEarned)
      };
    }).catch(function (err) {
      console.warn('[Progress] loadRemote failed', err);
      return { completedLessons: [], scores: {} };
    });
  }

  function resetRemote() {
    var user = currentUser();
    if (!user) return Promise.resolve();
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

  return {
    syncProgress: syncProgress,
    saveAttempt: saveAttempt,
    loadRemote: loadRemote,
    loadUserState: loadUserState,
    loadLocalCache: loadLocalCache,
    saveLocalCache: saveLocalCache,
    saveQuizScores: saveQuizScores,
    markCertShown: markCertShown,
    wasCertShown: wasCertShown,
    getCompletionDate: getCompletionDate,
    setCompletionDateIso: setCompletionDateIso,
    clearLocalForUid: clearLocalForUid,
    purgeLegacyGlobalKeys: purgeLegacyGlobalKeys,
    setActiveUid: setActiveUid,
    activeUid: activeUid,
    resetRemote: resetRemote,
    loadHistory: loadHistory,
    QUIZ_LESSON_IDS: QUIZ_LESSON_IDS
  };
})();
