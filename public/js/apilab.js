// Java INPRO — Laboratorio de API: un servidor simulado en el navegador.
// Copia las reglas de ejemplos/kiosco-api para practicar verbos, rutas y códigos
// sin instalar nada. tests/run.js compara sus respuestas con la API real.
var ApiLab = (function () {
  var UMBRAL = 5000;
  var RECARGO = 1.15;

  function seed() {
    return {
      nextId: 4,
      rows: [
        { id: 1, nombre: 'Alfajor', precio: 1200, stock: 30, activo: true },
        { id: 2, nombre: 'Yerba', precio: 4500, stock: 3, activo: true },
        { id: 3, nombre: 'Termo', precio: 18000, stock: 8, activo: true }
      ]
    };
  }

  var servers = {};

  function dbl(n) { return Number.isInteger(n) ? n.toFixed(1) : String(n); }

  function toJson(p) {
    var final = p.precio > UMBRAL ? Math.round(p.precio * RECARGO * 100) / 100 : p.precio;
    return '{"id":' + p.id + ',"nombre":' + JSON.stringify(p.nombre) + ',"precio":' + dbl(p.precio) + ',"precioFinal":' + dbl(final) + ',"stock":' + p.stock + '}';
  }

  function error(status, mensaje) {
    return { status: status, body: JSON.stringify({ estado: status, mensaje: mensaje }) };
  }

  function validate(body) {
    var data;
    try {
      data = JSON.parse(body);
    } catch (e) {
      return { err: error(400, 'El JSON enviado no es válido') };
    }
    if (data === null || typeof data !== 'object') return { err: error(400, 'El JSON enviado no es válido') };
    if (typeof data.nombre !== 'string' || !data.nombre.trim()) return { err: error(400, 'El nombre es obligatorio') };
    if (data.precio === undefined || data.precio === null) return { err: error(400, 'El precio es obligatorio') };
    if (typeof data.precio !== 'number' || data.precio <= 0) return { err: error(400, 'El precio debe ser positivo') };
    if (data.stock === undefined || data.stock === null) return { err: error(400, 'El stock es obligatorio') };
    if (!Number.isInteger(data.stock) || data.stock < 0) return { err: error(400, 'El stock no puede ser negativo') };
    return { data: data };
  }

  function handle(server, method, url, body) {
    var parts = url.split('?');
    var path = parts[0].replace(/\/$/, '');
    var live = server.rows.filter(function (p) { return p.activo; });
    if (path === '/api/productos') {
      if (method === 'GET') return { status: 200, body: '[' + live.map(toJson).join(',') + ']' };
      if (method === 'POST') {
        var v = validate(body);
        if (v.err) return v.err;
        if (server.rows.some(function (p) { return p.nombre === v.data.nombre; })) return error(409, 'Ya existe un producto llamado ' + v.data.nombre);
        var nuevo = { id: server.nextId++, nombre: v.data.nombre, precio: v.data.precio, stock: v.data.stock, activo: true };
        server.rows.push(nuevo);
        return { status: 201, body: toJson(nuevo) };
      }
      return error(405, 'Ese verbo no existe en esta ruta');
    }
    if (path === '/api/productos/poco-stock') {
      if (method !== 'GET') return error(405, 'Ese verbo no existe en esta ruta');
      var match = /minimo=(\d+)/.exec(parts[1] || '');
      var minimo = match ? Number(match[1]) : 5;
      var few = live.filter(function (p) { return p.stock < minimo; }).sort(function (a, b) { return a.stock - b.stock; });
      return { status: 200, body: '[' + few.map(toJson).join(',') + ']' };
    }
    var one = /^\/api\/productos\/(\d+)$/.exec(path);
    if (one) {
      var id = Number(one[1]);
      var row = live.filter(function (p) { return p.id === id; })[0];
      var missing = error(404, 'Producto con id ' + id + ' no encontrado');
      if (method === 'GET') return row ? { status: 200, body: toJson(row) } : missing;
      if (method === 'PUT') {
        var u = validate(body);
        if (u.err) return u.err;
        if (!row) return missing;
        row.nombre = u.data.nombre;
        row.precio = u.data.precio;
        row.stock = u.data.stock;
        return { status: 200, body: toJson(row) };
      }
      if (method === 'DELETE') {
        if (!row) return missing;
        row.activo = false;
        return { status: 204, body: '' };
      }
      return error(405, 'Ese verbo no existe en esta ruta');
    }
    if (/^\/api\/productos\/[^/]+$/.test(path)) {
      if (method === 'GET' || method === 'PUT' || method === 'DELETE') return error(400, 'El pedido no es válido');
      return error(405, 'Ese verbo no existe en esta ruta');
    }
    return error(404, 'La ruta no existe');
  }

  function render(key, it) {
    var methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    servers[key] = seed();
    return '<p class="pr-task">' + it.task + '</p>' +
      '<div class="lab-row"><select id="lab-m-' + key + '" aria-label="Verbo HTTP">' + methods.map(function (m) { return '<option>' + m + '</option>'; }).join('') + '</select>' +
      '<input id="lab-u-' + key + '" value="/api/productos" spellcheck="false" autocomplete="off" aria-label="Ruta"></div>' +
      '<textarea class="pr-input lab-body" id="lab-b-' + key + '" rows="3" spellcheck="false" aria-label="Cuerpo JSON" placeholder="Cuerpo JSON, solo para POST y PUT"></textarea>';
  }

  function send(key) {
    var method = document.getElementById('lab-m-' + key).value;
    var url = document.getElementById('lab-u-' + key).value.trim();
    var body = document.getElementById('lab-b-' + key).value;
    return Object.assign({ method: method, url: url }, handle(servers[key], method, url, body));
  }

  function reached(it, res) {
    return res.method === it.goal.method && res.status === it.goal.status && new RegExp(it.goal.path).test(res.url) &&
      (!it.goal.contains || res.body.indexOf(it.goal.contains) !== -1);
  }

  return { render: render, send: send, reached: reached, handle: handle, seed: seed };
})();
