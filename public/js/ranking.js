// Ranking: combined score (lessons + quizzes + certificate)
var Ranking = (function () {
  var QUIZ_IDS = Progress.QUIZ_LESSON_IDS;
  var MAX_TOTAL = 525;
  var FETCH_TIMEOUT_MS = 8000;

  function calcScore(completedLessons, quizScores, certificateEarned) {
    var lessonsCompleted = (completedLessons || []).length;
    var lessonPoints = lessonsCompleted * 10;
    var quizPoints = 0;
    QUIZ_IDS.forEach(function (id) {
      var pct = (quizScores && quizScores[id] != null) ? Number(quizScores[id]) : 0;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      quizPoints += (pct * 15) / 100;
    });
    quizPoints = Math.round(quizPoints * 10) / 10;
    var certificateBonus = certificateEarned ? 100 : 0;
    var totalScore = Math.min(MAX_TOTAL, Math.round(lessonPoints + quizPoints + certificateBonus));
    return {
      lessonsCompleted: lessonsCompleted,
      quizPoints: quizPoints,
      certificateBonus: certificateBonus,
      totalScore: totalScore
    };
  }

  function currentUser() {
    return (typeof AuthUI !== 'undefined' && AuthUI.user) ? AuthUI.user() : (firebaseAuth && firebaseAuth.currentUser);
  }

  function withTimeout(promise, ms) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var t = setTimeout(function () {
        if (done) return;
        done = true;
        reject(new Error('timeout'));
      }, ms);
      promise.then(function (v) {
        if (done) return;
        done = true;
        clearTimeout(t);
        resolve(v);
      }).catch(function (err) {
        if (done) return;
        done = true;
        clearTimeout(t);
        reject(err);
      });
    });
  }

  // El ranking es público: nunca muestra el email, aunque la cuenta no tenga nombre
  function publicName(user) {
    var name = String(user.displayName || '').trim();
    if (!name || name.indexOf('@') !== -1) return 'Estudiante';
    return name.slice(0, 60);
  }

  function publicPhoto(user) {
    var url = String(user.photoURL || '');
    return /^https:\/\//.test(url) && url.length <= 500 ? url : '';
  }

  /**
   * Suma a lo que ya está en la nube: una pestaña vieja no puede bajar el puntaje.
   * Las lecciones salen de unir las de progress/{uid} con las de esta pestaña, y los
   * puntos de cuestionario nunca bajan.
   */
  function update(completedLessons, quizScores, certificateEarned) {
    var user = currentUser();
    if (!firebaseReady || !user || Progress.isFrozen()) return Promise.resolve();
    var progRef = firebaseDb.collection('progress').doc(user.uid);
    var rankRef = firebaseDb.collection('rankings').doc(user.uid);
    var total = typeof LESSONS !== 'undefined' ? LESSONS.length : 35;
    return firebaseDb.runTransaction(function (tx) {
      return Promise.all([tx.get(progRef), tx.get(rankRef)]).then(function (snaps) {
        var prog = snaps[0].exists ? snaps[0].data() : {};
        var prev = snaps[1].exists ? snaps[1].data() : {};
        // Una pestaña de antes de un reinicio no recrea el ranking borrado
        if (Progress.isStale(prog)) {
          var err = new Error('El progreso se reinició desde otra sesión');
          err.code = Progress.RESET_ELSEWHERE;
          err.gen = prog.resetAt || null;
          throw err;
        }
        var lessons = Progress.phase1Ids(Progress.union(prog.completedLessons, completedLessons));
        var cert = !!certificateEarned || !!prog.certificateEarned || lessons.length === total;
        var score = calcScore(lessons, quizScores, cert);
        var quizPoints = Math.min(75, Math.max(score.quizPoints, Number(prev.quizPoints) || 0));
        tx.set(rankRef, {
          displayName: publicName(user),
          photoURL: publicPhoto(user),
          lessonsCompleted: score.lessonsCompleted,
          quizPoints: quizPoints,
          certificateBonus: score.certificateBonus,
          totalScore: Math.min(MAX_TOTAL, Math.round(score.lessonsCompleted * 10 + quizPoints + score.certificateBonus)),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      });
    }).catch(function (err) {
      if (err && err.code === Progress.RESET_ELSEWHERE) { Progress.notifyReset(err.gen); return; }
      console.warn('[Ranking] update failed', err);
    });
  }

  function fetchLeaderboard(limit) {
    if (!firebaseReady) return Promise.resolve([]);
    var lim = limit || 50;
    var query = firebaseDb.collection('rankings')
      .orderBy('totalScore', 'desc')
      .limit(lim)
      .get()
      .then(function (snap) {
        var rows = [];
        var i = 0;
        snap.forEach(function (doc) {
          i++;
          var d = doc.data();
          rows.push({
            rank: i,
            uid: doc.id,
            displayName: d.displayName || 'Anónimo',
            photoURL: d.photoURL || '',
            lessonsCompleted: d.lessonsCompleted || 0,
            quizPoints: d.quizPoints || 0,
            certificateBonus: d.certificateBonus || 0,
            totalScore: d.totalScore || 0
          });
        });
        return rows;
      });
    return withTimeout(query, FETCH_TIMEOUT_MS).catch(function (err) {
      console.warn('[Ranking] fetch failed', err);
      throw err;
    });
  }

  function renderRankingTable(rows, containerId) {
    var el = document.getElementById(containerId || 'ranking-tbody');
    if (!el) return;
    var me = currentUser();
    var myUid = me ? me.uid : null;
    if (!rows.length) {
      el.innerHTML = '<tr><td colspan="6" class="rank-empty">Aún no hay rankings. ¡Completá lecciones!</td></tr>';
      return;
    }
    el.innerHTML = rows.map(function (r) {
      var isMe = myUid && r.uid === myUid;
      var avatar = r.photoURL
        ? '<img class="rank-avatar" src="' + escAttr(r.photoURL) + '" alt="" referrerpolicy="no-referrer">'
        : '<span class="rank-avatar rank-avatar-fallback">☕</span>';
      var cert = r.certificateBonus ? '✅' : '—';
      return '<tr class="' + (isMe ? 'rank-me' : '') + '">' +
        '<td class="rank-pos">' + r.rank + '</td>' +
        '<td class="rank-user">' + avatar + '<span>' + escHtml(r.displayName) + (isMe ? ' <em>(vos)</em>' : '') + '</span></td>' +
        '<td>' + r.lessonsCompleted + '/' + (typeof LESSONS !== 'undefined' ? LESSONS.length : 35) + '</td>' +
        '<td>' + r.quizPoints + '</td>' +
        '<td>' + cert + '</td>' +
        '<td class="rank-total"><strong>' + r.totalScore + '</strong></td>' +
        '</tr>';
    }).join('');
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function showModal() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var overlay = document.getElementById('ranking-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
    var tbody = document.getElementById('ranking-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="rank-empty">Cargando…</td></tr>';
    fetchLeaderboard(50).then(function (rows) {
      renderRankingTable(rows, 'ranking-tbody');
    }).catch(function () {
      if (tbody) {
        tbody.innerHTML = '<tr><td colspan="6" class="rank-empty">No se pudo cargar el ranking. Intentá de nuevo.</td></tr>';
      }
    });
  }

  function hideModal() {
    var overlay = document.getElementById('ranking-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function onOverlayClick(e) {
    if (e && e.target && e.target.id === 'ranking-overlay') hideModal();
  }

  function showHistory() {
    if (typeof AuthUI !== 'undefined' && !AuthUI.requireAuth()) return;
    var overlay = document.getElementById('history-overlay');
    if (!overlay) return;
    overlay.classList.add('show');
    var body = document.getElementById('history-body');
    if (!currentUser()) {
      if (body) body.innerHTML = '<p class="rank-empty">Iniciá sesión para ver tu historial.</p>';
      return;
    }
    if (body) body.innerHTML = '<p class="rank-empty">Cargando…</p>';
    withTimeout(Progress.loadHistory(), FETCH_TIMEOUT_MS).then(function (rows) {
      if (!body) return;
      if (!rows.length) {
        body.innerHTML = '<p class="rank-empty">Todavía no hay intentos guardados.</p>';
        return;
      }
      var html = '<table class="rank-table"><thead><tr><th>Lección</th><th>Tipo</th><th>Nota</th><th>Intentos</th><th>Estado</th></tr></thead><tbody>';
      rows.forEach(function (r) {
        var lesson = (typeof LESSONS !== 'undefined') ? LESSONS.find(function (l) { return l.id === r.lessonId; }) : null;
        var title = lesson ? lesson.title : ('#' + r.lessonId);
        var note = r.type === 'quiz' ? (r.quizCorrect + '/' + r.quizTotal + ' (' + r.scorePercent + '%)') : '—';
        html += '<tr><td>' + r.lessonId + '. ' + escHtml(title) + '</td><td>' + escHtml(r.type) +
          '</td><td>' + note + '</td><td>' + (r.attemptNumber || 1) + '</td><td>' +
          (r.passed ? '✅' : '❌') + '</td></tr>';
      });
      html += '</tbody></table>';
      body.innerHTML = html;
    }).catch(function () {
      if (body) body.innerHTML = '<p class="rank-empty">No se pudo cargar el historial.</p>';
    });
  }

  function hideHistory() {
    var overlay = document.getElementById('history-overlay');
    if (overlay) overlay.classList.remove('show');
  }

  function onHistoryOverlayClick(e) {
    if (e && e.target && e.target.id === 'history-overlay') hideHistory();
  }

  return {
    calcScore: calcScore,
    update: update,
    fetchLeaderboard: fetchLeaderboard,
    showModal: showModal,
    hideModal: hideModal,
    onOverlayClick: onOverlayClick,
    showHistory: showHistory,
    hideHistory: hideHistory,
    onHistoryOverlayClick: onHistoryOverlayClick
  };
})();
