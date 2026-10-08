// Firebase configuration — Java INPRO Tutorial (java-inpro-tutorial)
var firebaseConfig = {
  apiKey: "AIzaSyBQ_fxj7OJ9yoVXvDa0NyLWh4u-LgPNes0",
  authDomain: "java-inpro-tutorial.firebaseapp.com",
  projectId: "java-inpro-tutorial",
  storageBucket: "java-inpro-tutorial.firebasestorage.app",
  messagingSenderId: "678950159339",
  appId: "1:678950159339:web:be3b196904a2874ba3cfae"
};

var firebaseApp = null;
var firebaseAuth = null;
var firebaseDb = null;
var firebaseReady = false;

(function initFirebase() {
  if (typeof firebase === 'undefined') {
    console.warn('[Firebase] SDK not loaded');
    return;
  }
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'REPLACE_ME') {
    console.warn('[Firebase] Config placeholder — set public/js/firebase-config.js after creating a project');
    return;
  }
  try {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
    firebaseDb = firebase.firestore();
    firebaseReady = true;
  } catch (e) {
    console.error('[Firebase] Init error:', e);
  }
})();
