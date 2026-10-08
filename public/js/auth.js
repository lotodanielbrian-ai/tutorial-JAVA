// Auth: Google / Facebook — login obligatorio (sin modo invitado)
var AuthUI = (function () {
  var _readyCallbacks = [];
  var _authedCallbacks = [];
  var _authReady = false;
  var _appStarted = false;
  var _user = null;

  function user() { return _user; }

  function isLoggedIn() { return !!_user; }

  function requireAuth() {
    return !!_user;
  }

  function onReady(cb) {
    if (_authReady) cb();
    else _readyCallbacks.push(cb);
  }

  function onAuthed(cb) {
    if (_user && _appStarted) cb(_user);
    else _authedCallbacks.push(cb);
  }

  function _fireReady() {
    _authReady = true;
    _readyCallbacks.splice(0).forEach(function (cb) {
      try { cb(); } catch (e) { console.error(e); }
    });
  }

  function _fireAuthed() {
    var list = _authedCallbacks.splice(0);
    list.forEach(function (cb) {
      try { cb(_user); } catch (e) { console.error(e); }
    });
  }

  function setStatus(msg) {
    var el = document.getElementById('login-gate-status');
    if (el) el.textContent = msg || '';
    var loading = document.getElementById('login-gate-loading');
    if (loading) {
      if (msg) loading.removeAttribute('hidden');
      else loading.setAttribute('hidden', '');
    }
  }

  function showGate() {
    document.body.classList.add('auth-pending');
    document.body.classList.remove('authed');
    var gate = document.getElementById('login-gate');
    if (gate) gate.style.display = '';
  }

  function showApp() {
    document.body.classList.remove('auth-pending');
    document.body.classList.add('authed');
    var gate = document.getElementById('login-gate');
    if (gate) gate.style.display = 'none';
  }

  function updateAuthUI(opts) {
    var revealApp = !opts || opts.revealApp !== false;
    var authBox = document.getElementById('auth-box');
    var avatar = document.getElementById('user-avatar');
    var nameEl = document.getElementById('user-name');
    var hintEl = document.querySelector('#auth-box .user-hint');

    if (_user) {
      if (nameEl) nameEl.textContent = _user.displayName || _user.email || 'Usuario';
      if (hintEl) hintEl.textContent = 'Progreso en la nube';
      if (avatar) {
        if (_user.photoURL) {
          avatar.innerHTML = '<img src="' + _user.photoURL.replace(/"/g, '') + '" alt="" referrerpolicy="no-referrer">';
        } else {
          avatar.textContent = '👤';
        }
        avatar.style.display = 'flex';
      }
      if (authBox) authBox.classList.add('logged-in');
      if (revealApp) showApp();
    } else {
      if (nameEl) nameEl.textContent = '—';
      if (hintEl) hintEl.textContent = '';
      if (avatar) {
        avatar.textContent = '👤';
        avatar.style.display = 'flex';
      }
      if (authBox) authBox.classList.remove('logged-in');
      showGate();
    }
  }

  function upsertUserProfile(u) {
    if (!firebaseReady || !u) return Promise.resolve();
    var provider = (u.providerData && u.providerData[0] && u.providerData[0].providerId) || 'unknown';
    return firebaseDb.collection('users').doc(u.uid).set({
      displayName: u.displayName || '',
      email: u.email || '',
      photoURL: u.photoURL || '',
      provider: provider,
      lastActiveAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true }).then(function () {
      return firebaseDb.collection('users').doc(u.uid).get().then(function (snap) {
        if (!snap.exists || !snap.data().createdAt) {
          return firebaseDb.collection('users').doc(u.uid).set({
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      });
    }).catch(function (err) {
      console.warn('[Auth] upsert profile failed', err);
    });
  }

  function clearAppShell() {
    var main = document.getElementById('main');
    if (main) main.innerHTML = '';
    var list = document.getElementById('sb-list');
    if (list) list.innerHTML = '';
    var fill = document.getElementById('prog-fill');
    if (fill) fill.style.width = '0%';
    var lbl = document.getElementById('prog-lbl');
    if (lbl) lbl.textContent = '0 de 34 completados';
    var certBtn = document.getElementById('cert-btn');
    if (certBtn) certBtn.style.display = 'none';
  }

  function clearSessionState() {
    if (typeof clearSessionProgress === 'function') {
      clearSessionProgress();
    } else {
      if (typeof done !== 'undefined') done = new Set();
      if (typeof quizBestScores !== 'undefined') quizBestScores = {};
      if (typeof cur !== 'undefined') cur = 0;
    }
    if (typeof Progress !== 'undefined' && Progress.setActiveUid) {
      Progress.setActiveUid(null);
    }
    if (typeof Progress !== 'undefined' && Progress.purgeLegacyGlobalKeys) {
      Progress.purgeLegacyGlobalKeys();
    }
    window.__javaInproStarted = false;
    _appStarted = false;
  }

  function mountApp() {
    setStatus('Cargando tutorial…');
    try {
      if (typeof startApp === 'function') {
        startApp();
      } else if (typeof render === 'function') {
        render();
      }
    } catch (e) {
      console.error('[Auth] mountApp failed', e);
      setStatus('Error al cargar el tutorial. Recargá la página.');
      return;
    }
    _appStarted = true;
    setStatus('');
    showApp();
    _fireAuthed();
  }

  function afterLogin(u) {
    _user = u;
    setStatus('Sincronizando progreso…');
    updateAuthUI({ revealApp: false });
    // Isolate: only this uid's cache + Firestore (never another user's local data)
    if (typeof Progress !== 'undefined') {
      Progress.purgeLegacyGlobalKeys();
      Progress.setActiveUid(u.uid);
    }
    if (typeof clearSessionProgress === 'function') clearSessionProgress();

    return upsertUserProfile(u).then(function () {
      return Progress.loadRemote();
    }).then(function (remote) {
      var state = Progress.loadUserState(u.uid, remote);
      if (typeof applyUserProgress === 'function') {
        applyUserProgress(state);
      } else if (typeof applyProgressFromRemote === 'function') {
        applyProgressFromRemote(state.completedLessons, state.scores);
      }
      var cert = state.completedLessons.length === (typeof LESSONS !== 'undefined' ? LESSONS.length : 34);
      return Progress.syncProgress(state.completedLessons, typeof cur !== 'undefined' ? cur : 0, cert).then(function () {
        return Ranking.update(state.completedLessons, state.scores, cert);
      });
    }).then(function () {
      mountApp();
    }).catch(function (err) {
      console.warn('[Auth] afterLogin error', err);
      mountApp();
    });
  }

  function authErrorMessage(providerLabel, err) {
    if (!err) return 'Error desconocido al iniciar sesión con ' + providerLabel + '.';
    if (err.code === 'auth/configuration-not-found') {
      return 'Authentication no está configurado en Firebase (auth/configuration-not-found).\n\n' +
        'Activá el proveedor en:\nhttps://console.firebase.google.com/project/java-inpro-tutorial/authentication/providers\n' +
        'y volvé a intentar.';
    }
    if (err.code === 'auth/operation-not-allowed') {
      if (providerLabel === 'Facebook') {
        return 'Facebook Login aún no está habilitado.\n\n' +
          '1) Creá una app en https://developers.facebook.com\n' +
          '2) En Firebase → Authentication → Sign-in method → Facebook\n' +
          '   pegá App ID y App Secret y activá el proveedor.\n' +
          '3) Copiá el OAuth redirect URI de Firebase a la app de Meta.\n\n' +
          'Detalle en el README del proyecto.';
      }
      return 'El proveedor ' + providerLabel + ' está deshabilitado en Firebase Auth.\n\n' +
        'Habilitalo en Authentication > Sign-in method.';
    }
    if (err.code === 'auth/unauthorized-domain') {
      return 'Este dominio no está autorizado para Auth.\n\n' +
        'Agregá java-inpro-tutorial.web.app en Authentication > Settings > Authorized domains.';
    }
    return 'Error al iniciar sesión con ' + providerLabel + ': ' + (err.message || err);
  }

  function signInGoogle() {
    if (!firebaseReady) {
      setStatus('Firebase no está configurado.');
      alert('Firebase no está configurado.');
      return;
    }
    setStatus('Abriendo Google…');
    var provider = new firebase.auth.GoogleAuthProvider();
    firebaseAuth.signInWithPopup(provider).then(function () {
      setStatus('');
    }).catch(function (err) {
      console.error(err);
      setStatus('');
      if (err.code === 'auth/popup-closed-by-user') return;
      alert(authErrorMessage('Google', err));
    });
  }

  function signInFacebook() {
    if (!firebaseReady) {
      setStatus('Firebase no está configurado.');
      alert('Firebase no está configurado.');
      return;
    }
    setStatus('Abriendo Facebook…');
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');
    firebaseAuth.signInWithPopup(provider).then(function () {
      setStatus('');
    }).catch(function (err) {
      console.error(err);
      setStatus('');
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') return;
      alert(authErrorMessage('Facebook', err));
    });
  }

  function signOut() {
    clearSessionState();
    if (!firebaseAuth) {
      _user = null;
      clearAppShell();
      updateAuthUI();
      return;
    }
    firebaseAuth.signOut().then(function () {
      _user = null;
      clearSessionState();
      clearAppShell();
      updateAuthUI();
    }).catch(function (err) {
      console.error(err);
    });
  }

  function init() {
    updateAuthUI();
  }

  function bootstrap() {
    document.body.classList.add('auth-pending');
    document.body.classList.remove('authed');

    if (!firebaseReady || !firebaseAuth) {
      _user = null;
      updateAuthUI();
      setStatus('Firebase no disponible. Revisá la configuración.');
      _fireReady();
      return;
    }

    setStatus('Comprobando sesión…');
    firebaseAuth.onAuthStateChanged(function (u) {
      if (u) {
        afterLogin(u).finally(function () {
          if (!_authReady) _fireReady();
        });
      } else {
        _user = null;
        clearSessionState();
        setStatus('');
        clearAppShell();
        updateAuthUI();
        if (!_authReady) _fireReady();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }

  return {
    init: init,
    onReady: onReady,
    onAuthed: onAuthed,
    user: user,
    isLoggedIn: isLoggedIn,
    requireAuth: requireAuth,
    signInGoogle: signInGoogle,
    signInFacebook: signInFacebook,
    signOut: signOut
  };
})();
