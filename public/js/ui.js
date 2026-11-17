// Diálogos del sitio: reemplazan a confirm() y alert() del navegador, que salen
// fuera de la página, con el nombre del dominio y sin el estilo del curso.
// UI.confirm y UI.alert devuelven una promesa. Escape cancela, Enter acepta y el
// foco queda adentro del diálogo hasta cerrarlo; después vuelve a donde estaba.
var UI = (function () {
  var queue = Promise.resolve();

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function open(opts) {
    return new Promise(function (resolve) {
      var previous = document.activeElement;
      var overlay = document.createElement('div');
      overlay.className = 'ui-dialog-overlay';
      var titleId = 'ui-dialog-title-' + Date.now();
      var msgId = titleId + '-msg';
      overlay.innerHTML =
        '<div class="ui-dialog' + (opts.danger ? ' is-danger' : '') + '" role="' + (opts.cancelText ? 'alertdialog' : 'dialog') + '" aria-modal="true" aria-labelledby="' + titleId + '" aria-describedby="' + msgId + '">' +
          '<div class="ui-dialog-icon" aria-hidden="true">' + esc(opts.icon || (opts.danger ? '⚠️' : 'ℹ️')) + '</div>' +
          '<h2 class="ui-dialog-title" id="' + titleId + '">' + esc(opts.title || '') + '</h2>' +
          '<p class="ui-dialog-msg" id="' + msgId + '">' + esc(opts.message || '') + '</p>' +
          '<div class="ui-dialog-actions">' +
            (opts.cancelText ? '<button type="button" class="ui-btn ui-btn-ghost" data-act="cancel">' + esc(opts.cancelText) + '</button>' : '') +
            '<button type="button" class="ui-btn ' + (opts.danger ? 'ui-btn-danger' : 'ui-btn-primary') + '" data-act="ok">' + esc(opts.okText || 'Aceptar') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);
      var buttons = overlay.querySelectorAll('button');
      // En una acción que borra, el foco arranca en Cancelar: Enter por reflejo no borra nada
      var first = opts.danger && opts.cancelText ? overlay.querySelector('[data-act="cancel"]') : overlay.querySelector('[data-act="ok"]');

      function close(value) {
        document.removeEventListener('keydown', onKey, true);
        overlay.remove();
        if (previous && previous.focus && document.contains(previous)) previous.focus();
        resolve(value);
      }

      function onKey(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(!opts.cancelText); return; }
        if (e.key === 'Tab') {
          var list = Array.prototype.slice.call(buttons);
          var i = list.indexOf(document.activeElement);
          e.preventDefault();
          var next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : (i + 1) % list.length;
          list[next].focus();
        }
      }

      overlay.addEventListener('click', function (e) {
        var act = e.target.getAttribute && e.target.getAttribute('data-act');
        if (act) close(act === 'ok');
        else if (e.target === overlay && opts.cancelText) close(false);
      });
      document.addEventListener('keydown', onKey, true);
      first.focus();
    });
  }

  // Un diálogo por vez: si se piden dos, el segundo espera al primero
  function enqueue(opts) {
    var p = queue.then(function () { return open(opts); });
    queue = p.catch(function () {});
    return p;
  }

  /** Pregunta antes de una acción. Resuelve true si la persona acepta. */
  function confirm(opts) {
    if (typeof opts === 'string') opts = { message: opts };
    return enqueue({
      title: opts.title || '¿Seguís?',
      message: opts.message,
      okText: opts.okText || 'Aceptar',
      cancelText: opts.cancelText || 'Cancelar',
      danger: !!opts.danger,
      icon: opts.icon
    });
  }

  /** Avisa algo. Resuelve cuando la persona lo cierra. */
  function alert(opts) {
    if (typeof opts === 'string') opts = { message: opts };
    return enqueue({
      title: opts.title || 'Aviso',
      message: opts.message,
      okText: opts.okText || 'Entendido',
      icon: opts.icon
    });
  }

  return { confirm: confirm, alert: alert };
})();
