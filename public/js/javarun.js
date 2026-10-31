// Java INPRO — Intérprete de un subconjunto de Java que corre en el navegador.
// Ejecuta de verdad el código del alumno: tipos, control de flujo, arrays, POO,
// excepciones, ArrayList, Scanner con entrada fija y archivos en memoria.
// tests/run.js compara sus resultados contra javac/java reales.
// Lo que no soporta devuelve { unsupported } y validate.js decide qué hacer.
var JavaRun = (function () {
  var MAX_STEPS = 3000000;
  var MAX_OUTPUT = 200000;
  var MAX_DEPTH = 900;

  function Unsupported(what) { this.what = what; }
  function CompileError(line, javac, why) { this.line = line; this.javac = javac; this.why = why; }
  function JThrow(obj) { this.obj = obj; }
  function Limit(why) { this.why = why; }
  function ExitProgram(code) { this.code = code; }

  // ── Valores ──────────────────────────────────────────────────────────
  // int/short/byte: number · boolean: boolean · null: null
  function JDouble(v) { this.v = v; }
  function JFloat(v) { this.v = v; }
  function JLong(v) { this.v = v; }
  function JChar(v) { this.v = v; }
  function JStr(s) { this.s = s; }
  function JArr(type, a) { this.type = type; this.a = a; this.id = nextId(); }
  function JList(a, kind) { this.a = a; this.kind = kind || 'ArrayList'; this.id = nextId(); }
  function JSb(s) { this.s = s; this.id = nextId(); }
  function JObj(cls) { this.cls = cls; this.f = Object.create(null); this.byClass = Object.create(null); this.id = nextId(); }
  function ClassRef(name) { this.name = name; }
  function ClassOf(name) { this.name = name; }
  function Native(kind, st) { this.kind = kind; this.st = st || {}; this.id = nextId(); }
  function JMap(kind) { this.kind = kind; this.e = []; this.peak = 0; this.id = nextId(); }
  function JEntry(k, v) { this.k = k; this.v = v; }
  function JOpt(v) { this.v = v; }
  function JFn(call) { this.call = call; this.id = nextId(); }
  function JPipe(a, kind) { this.a = a; this.kind = kind || 'obj'; }
  function Collector(kind, sep) { this.kind = kind; this.sep = sep; }

  // Sin prototipo: 'toString' o 'constructor' no deben parecer claves del mapa
  function dict(o) { return Object.assign(Object.create(null), o); }

  var idSeq = 0;
  function nextId() { idSeq += 7919; return idSeq; }

  // ── Léxico ───────────────────────────────────────────────────────────
  var OPS3 = ['...', '<<=', '>>=', '>>>'];
  var OPS2 = ['==', '!=', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '->', '::', '<<'];

  function lex(src) {
    var toks = [];
    var i = 0, line = 1, n = src.length;
    function err(msg, why) { throw new CompileError(line, msg, why); }
    function esc() {
      var c = src.charAt(i + 1);
      i += 2;
      if (c === 'n') return '\n';
      if (c === 't') return '\t';
      if (c === 'r') return '\r';
      if (c === 'b') return '\b';
      if (c === 'f') return '\f';
      if (c === '0') return '\0';
      if (c === '"' || c === "'" || c === '\\') return c;
      if (c === 'u') {
        while (src.charAt(i) === 'u') i++;
        var hex = src.substr(i, 4);
        i += 4;
        return String.fromCharCode(parseInt(hex, 16));
      }
      err('illegal escape character', 'Esa secuencia con \\ no existe en Java.');
    }
    while (i < n) {
      var ch = src.charAt(i), nx = src.charAt(i + 1);
      if (ch === '\n') { line++; i++; continue; }
      if (ch === ' ' || ch === '\t' || ch === '\r') { i++; continue; }
      if (ch === '/' && nx === '/') { while (i < n && src.charAt(i) !== '\n') i++; continue; }
      if (ch === '/' && nx === '*') {
        i += 2;
        while (i < n && !(src.charAt(i) === '*' && src.charAt(i + 1) === '/')) { if (src.charAt(i) === '\n') line++; i++; }
        i += 2;
        continue;
      }
      if (src.substr(i, 3) === '"""') throw new Unsupported('bloques de texto');
      if (ch === '"') {
        var s = '';
        i++;
        while (i < n && src.charAt(i) !== '"') {
          if (src.charAt(i) === '\n') err('unclosed string literal', 'Abriste comillas dobles y no las cerraste en esa línea.');
          if (src.charAt(i) === '\\') { s += esc(); continue; }
          s += src.charAt(i++);
        }
        i++;
        toks.push({ k: 'str', v: s, line: line, pos: i });
        continue;
      }
      if (ch === "'") {
        var c = '';
        i++;
        if (src.charAt(i) === '\\') c = esc();
        else c = src.charAt(i++);
        if (src.charAt(i) !== "'") err('unclosed character literal', 'Un char lleva un solo carácter entre comillas simples.');
        i++;
        toks.push({ k: 'chr', v: c.charCodeAt(0), line: line, pos: i });
        continue;
      }
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx))) {
        var st = i;
        var isHex = ch === '0' && (nx === 'x' || nx === 'X');
        var isBin = ch === '0' && (nx === 'b' || nx === 'B');
        var num = '';
        var ty = 'int';
        if (isHex || isBin) {
          i += 2;
          while (i < n && /[0-9a-fA-F_]/.test(src.charAt(i))) i++;
          num = src.slice(st, i).replace(/_/g, '');
        } else {
          while (i < n && /[0-9_]/.test(src.charAt(i))) i++;
          if (src.charAt(i) === '.' && /[0-9]/.test(src.charAt(i + 1))) { ty = 'double'; i++; while (i < n && /[0-9_]/.test(src.charAt(i))) i++; }
          else if (src.charAt(i) === '.' && !/[A-Za-z_]/.test(src.charAt(i + 1))) { ty = 'double'; i++; }
          if (/[eE]/.test(src.charAt(i)) && /[0-9+\-]/.test(src.charAt(i + 1))) {
            ty = 'double';
            i += 2;
            while (i < n && /[0-9]/.test(src.charAt(i))) i++;
          }
          num = src.slice(st, i).replace(/_/g, '');
        }
        var suf = src.charAt(i);
        if (/[lL]/.test(suf)) { ty = 'long'; i++; }
        else if (!isHex && /[fF]/.test(suf)) { ty = 'float'; i++; }
        else if (!isHex && /[dD]/.test(suf)) { ty = 'double'; i++; }
        if (ty === 'int') {
          var iv = Number(num);
          if (iv > 2147483648) err('integer number too large', 'Ese número no entra en un int. Para valores grandes usá long y agregale una L al final.');
        }
        toks.push({ k: 'num', v: num, ty: ty, line: line, pos: i });
        continue;
      }
      if (/[A-Za-z_$À-ɏ]/.test(ch)) {
        var b = i;
        while (i < n && /[A-Za-z0-9_$À-ɏ]/.test(src.charAt(i))) i++;
        toks.push({ k: 'id', v: src.slice(b, i), line: line, pos: i });
        continue;
      }
      var three = src.substr(i, 3), two = src.substr(i, 2);
      if (OPS3.indexOf(three) !== -1) {
        if (three === '>>>') { toks.push({ k: 'op', v: '>', line: line, pos: i + 1 }); i++; continue; }
        toks.push({ k: 'op', v: three, line: line, pos: i + 3 });
        i += 3;
        continue;
      }
      if (OPS2.indexOf(two) !== -1) { toks.push({ k: 'op', v: two, line: line, pos: i + 2 }); i += 2; continue; }
      if ('{}()[].,;+-*/%=<>!&|^~?:@'.indexOf(ch) !== -1) { toks.push({ k: 'op', v: ch, line: line, pos: i + 1 }); i++; continue; }
      err("illegal character: '" + ch + "'", 'Ese carácter no corresponde en Java.');
    }
    toks.push({ k: 'eof', v: '<eof>', line: line, pos: n });
    return toks;
  }

  // ── Sintaxis ─────────────────────────────────────────────────────────
  var PRIMS = dict({ 'int': 1, 'double': 1, 'float': 1, 'long': 1, 'short': 1, 'byte': 1, 'boolean': 1, 'char': 1 });
  var MODS = dict({ 'public': 1, 'private': 1, 'protected': 1, 'static': 1, 'final': 1, 'abstract': 1, 'synchronized': 1, 'transient': 1, 'volatile': 1, 'native': 1, 'strictfp': 1, 'default': 1, 'sealed': 1 });
  var RESERVED = dict({ 'if': 1, 'else': 1, 'for': 1, 'while': 1, 'do': 1, 'switch': 1, 'case': 1, 'return': 1, 'break': 1, 'continue': 1, 'new': 1, 'try': 1, 'catch': 1, 'finally': 1, 'throw': 1, 'class': 1, 'interface': 1, 'extends': 1, 'implements': 1, 'instanceof': 1, 'this': 1, 'super': 1, 'null': 1, 'true': 1, 'false': 1, 'void': 1, 'import': 1, 'package': 1, 'enum': 1, 'throws': 1 });

  function parse(toks) {
    var p = 0;
    function t() { return toks[p]; }
    function la(k) { return toks[p + k] || toks[toks.length - 1]; }
    function is(v) { var x = toks[p]; return x.v === v && (x.k === 'op' || x.k === 'id'); }
    function eat(v) { if (is(v)) { p++; return true; } return false; }
    function fail(msg, why, line) { throw new CompileError(line || t().line, msg, why); }
    function expect(v) {
      if (is(v)) return toks[p++];
      var line = (v === ';' || v === ')') && p > 0 ? toks[p - 1].line : t().line;
      if (v === ';') fail("';' expected", 'Cada instrucción termina con punto y coma.', line);
      if (v === ')') fail("')' expected", 'Falta cerrar un paréntesis.', line);
      fail("'" + v + "' expected", 'Java esperaba ' + v + ' en este lugar.', line);
    }
    function ident() {
      var x = t();
      if (x.k !== 'id' || RESERVED[x.v]) fail('<identifier> expected', 'Acá va un nombre. ' + (RESERVED[x.v] ? x.v + ' es una palabra reservada de Java.' : ''));
      p++;
      return x.v;
    }

    function skipAnnotation() {
      expect('@');
      var name = ident();
      while (eat('.')) name = ident();
      if (is('(')) {
        var d = 0;
        do {
          if (is('(')) d++;
          if (is(')')) d--;
          p++;
        } while (d > 0 && t().k !== 'eof');
      }
      return name;
    }

    function typeArgs() {
      if (!is('<')) return true;
      p++;
      if (eat('>')) return true;
      for (;;) {
        if (eat('?')) {
          if (is('extends') || is('super')) { p++; if (!type()) return false; }
        } else if (!type()) return false;
        if (eat(',')) continue;
        return eat('>');
      }
    }

    // Devuelve el nombre del tipo o null, sin lanzar error
    function type() {
      var x = t();
      if (x.k !== 'id' || (RESERVED[x.v] && x.v !== 'void')) return null;
      p++;
      var name = x.v;
      if (!PRIMS[name]) {
        if (!typeArgs()) return null;
        while (is('.') && la(1).k === 'id' && !RESERVED[la(1).v]) {
          p += 2;
          name = toks[p - 1].v;
          if (!typeArgs()) return null;
        }
      }
      while (is('[') && la(1).v === ']') { p += 2; name += '[]'; }
      return name;
    }

    function program() {
      var classes = [];
      var imports = [];
      if (is('package')) { while (!is(';') && t().k !== 'eof') p++; expect(';'); }
      while (is('import')) {
        p++;
        var path = '';
        while (!is(';') && t().k !== 'eof') { path += t().v; p++; }
        expect(';');
        imports.push(path);
      }
      while (t().k !== 'eof') {
        if (eat(';')) continue;
        classes.push.apply(classes, classDecl());
      }
      classes.imports = imports;
      return classes;
    }

    function modifiers() {
      var m = {};
      for (;;) {
        if (is('@') && la(1).v !== 'interface') { if (skipAnnotation() === 'Override') m.override = 1; continue; }
        if (t().k === 'id' && MODS[t().v] && !(t().v === 'default' && (la(1).v === ':' || la(1).v === '->'))) { m[t().v] = 1; p++; continue; }
        return m;
      }
    }

    function classDecl(mods) {
      var m = mods || modifiers();
      var isEnum = is('enum');
      var isRecord = atRecord();
      var isInterface = is('interface');
      if (!isInterface && !isEnum && !isRecord && !is('class')) fail('class, interface, enum, or record expected', 'Acá Java espera una clase o una interfaz.');
      p++;
      var line = t().line;
      var name = ident();
      if (is('<')) typeArgs();
      var c = { name: name, line: line, sup: null, ifaces: [], isAbstract: !!m.abstract || isInterface, isInterface: isInterface, fields: [], methods: [], ctors: [], inits: [], statics: [], isEnum: isEnum, isRecord: isRecord, enumConsts: [], recParams: null, compact: null };
      if (isRecord) c.recParams = params();
      if (eat('extends')) {
        if (isInterface) {
          do { c.ifaces.push(type()); } while (eat(','));
        } else c.sup = type();
      }
      if (eat('implements')) { do { c.ifaces.push(type()); } while (eat(',')); }
      expect('{');
      if (isEnum) enumBody(c);
      var nested = [];
      while (!is('}')) {
        if (t().k === 'eof') fail('reached end of file while parsing', 'Falta cerrar una llave }.');
        member(c, nested);
      }
      expect('}');
      return [c].concat(nested);
    }

    function atRecord() {
      return t().v === 'record' && la(1).k === 'id' && (la(2).v === '(' || la(2).v === '<');
    }

    function enumBody(c) {
      while (t().k === 'id' && !RESERVED[t().v]) {
        var line = t().line;
        var nm = ident();
        var list = is('(') ? args() : [];
        if (is('{')) throw new Unsupported('constantes de enum con cuerpo');
        c.enumConsts.push({ name: nm, args: list, line: line });
        if (!eat(',')) break;
      }
      eat(';');
    }

    function params() {
      var list = [];
      expect('(');
      if (!is(')')) {
        do {
          modifiers();
          var ty = type();
          if (!ty) fail('<identifier> expected', 'Cada parámetro lleva tipo y nombre, por ejemplo int edad.');
          if (eat('...')) throw new Unsupported('varargs');
          var nm = ident();
          while (is('[')) { p++; expect(']'); ty += '[]'; }
          list.push({ type: ty, name: nm });
        } while (eat(','));
      }
      expect(')');
      return list;
    }

    function throwsClause() {
      var list = [];
      if (eat('throws')) { do { list.push(type()); } while (eat(',')); }
      return list;
    }

    function member(c, nested) {
      if (eat(';')) return;
      var line = t().line;
      var m = modifiers();
      if (is('class') || is('interface') || is('enum') || atRecord()) {
        var inner = classDecl(m);
        inner.forEach(function (x) { x.outer = c.name; nested.push(x); });
        return;
      }
      if (is('{')) {
        var b = block();
        if (m.static) c.statics.push({ kind: 'block', body: b });
        else c.inits.push({ kind: 'block', body: b });
        return;
      }
      if (is('<')) typeArgs();
      if (c.isRecord && t().k === 'id' && t().v === c.name && la(1).v === '{') {
        p++;
        c.compact = block();
        return;
      }
      if (t().k === 'id' && t().v === c.name && la(1).v === '(') {
        p++;
        var ps = params();
        var ctorThrows = throwsClause();
        c.ctors.push({ params: ps, body: block(), access: access(m), line: line, throwsList: ctorThrows });
        return;
      }
      var ty = type();
      if (!ty) fail('illegal start of type', 'Java esperaba un tipo o una declaración acá.');
      if (is('(')) fail('invalid method declaration; return type required', 'A este método le falta el tipo de retorno. Si no devuelve nada, usá void. Si es un constructor, tiene que llamarse igual que la clase.', line);
      var nm = ident();
      if (is('(')) {
        var plist = params();
        var th = throwsClause();
        var body = null;
        if (is('{')) body = block();
        else {
          expect(';');
          if (!c.isInterface && !m.abstract && !m.native) fail('missing method body, or declare abstract', 'Este método no tiene cuerpo { }. Agregale llaves o declaralo abstract.', line);
        }
        if (body && m.abstract) fail('abstract methods cannot have a body', 'Un método abstract no lleva cuerpo: termina en punto y coma.', line);
        c.methods.push({ name: nm, params: plist, ret: ty, body: body, isStatic: !!m.static, isAbstract: !body, access: access(m), throwsList: th, cls: c.name, line: line, override: !!m.override });
        return;
      }
      for (;;) {
        var fty = ty;
        while (is('[')) { p++; expect(']'); fty += '[]'; }
        var init = null;
        if (eat('=')) init = is('{') ? arrayInit(fty) : expr();
        var entry = { kind: 'field', name: nm, type: fty, init: init, isStatic: !!m.static || c.isInterface, isFinal: !!m.final || c.isInterface, access: access(m) || (c.isInterface ? 'public' : ''), line: line, cls: c.name };
        c.fields.push(entry);
        if (entry.isStatic) c.statics.push(entry);
        else c.inits.push(entry);
        if (!eat(',')) break;
        nm = ident();
      }
      expect(';');
    }

    function access(m) { return m['private'] ? 'private' : m['protected'] ? 'protected' : m['public'] ? 'public' : ''; }

    function block() {
      var line = t().line;
      expect('{');
      var body = [];
      while (!is('}')) {
        if (t().k === 'eof') fail('reached end of file while parsing', 'Falta cerrar una llave }.');
        body.push(stmt());
      }
      expect('}');
      return { k: 'block', body: body, line: line };
    }

    function looksLikeDecl() {
      var x = t();
      if (x.k !== 'id') return false;
      if (x.v === 'final') return true;
      if (RESERVED[x.v]) return false;
      var save = p;
      var ty = type();
      var yes = !!ty && t().k === 'id' && !RESERVED[t().v] && t().v !== 'instanceof' && (la(1).v === '=' || la(1).v === ';' || la(1).v === ',' || la(1).v === ':' || la(1).v === '[');
      p = save;
      return yes;
    }

    function localDecl() {
      var line = t().line;
      var m = modifiers();
      var ty = type();
      var decls = [];
      do {
        var nm = ident();
        var dty = ty;
        while (is('[')) { p++; expect(']'); dty += '[]'; }
        var init = null;
        if (eat('=')) init = is('{') ? arrayInit(dty) : expr();
        decls.push({ name: nm, type: dty, init: init, isFinal: !!m.final, line: line });
      } while (eat(','));
      return { k: 'local', decls: decls, line: line };
    }

    function arrayInit(ty) {
      var line = t().line;
      if (ty.slice(-2) !== '[]') fail('illegal initializer for ' + ty, 'Las llaves { } solo sirven para inicializar arrays.', line);
      var el = ty.slice(0, -2);
      var items = [];
      expect('{');
      while (!is('}')) {
        items.push(is('{') ? arrayInit(el) : expr());
        if (!eat(',')) break;
      }
      expect('}');
      return { k: 'arrlit', type: el, items: items, line: line };
    }

    function stmt() {
      var x = t(), line = x.line, n;
      if (is('{')) return block();
      if (eat(';')) return { k: 'empty', line: line };
      if (is('@')) { modifiers(); return stmt(); }
      if (x.k === 'id') {
        if (la(1).v === ':' && !RESERVED[x.v]) throw new Unsupported('etiquetas');
        switch (x.v) {
          case 'if': {
            p++;
            expect('(');
            var c = expr();
            expect(')');
            var a = stmt();
            var b = null;
            if (eat('else')) b = stmt();
            return { k: 'if', c: c, a: a, b: b, line: line };
          }
          case 'while': {
            p++;
            expect('(');
            var wc = expr();
            expect(')');
            return { k: 'while', c: wc, body: stmt(), line: line };
          }
          case 'do': {
            p++;
            var db = stmt();
            expect('while');
            expect('(');
            var dc = expr();
            expect(')');
            expect(';');
            return { k: 'do', c: dc, body: db, line: line };
          }
          case 'for': return forStmt();
          case 'switch': {
            var sw = switchBody();
            eat(';');
            return { k: 'switchs', sw: sw, line: line };
          }
          case 'return': {
            p++;
            var rv = is(';') ? null : expr();
            expect(';');
            return { k: 'return', v: rv, line: line };
          }
          case 'break':
            p++;
            if (t().k === 'id') throw new Unsupported('break con etiqueta');
            expect(';');
            return { k: 'break', line: line };
          case 'continue':
            p++;
            if (t().k === 'id') throw new Unsupported('continue con etiqueta');
            expect(';');
            return { k: 'continue', line: line };
          case 'throw':
            p++;
            n = expr();
            expect(';');
            return { k: 'throw', v: n, line: line };
          case 'try': return tryStmt();
          case 'class': case 'interface': case 'enum':
            throw new Unsupported('clases locales');
          case 'yield':
            if (la(1).v !== '=' && la(1).v !== '.') {
              p++;
              n = expr();
              expect(';');
              return { k: 'yield', v: n, line: line };
            }
            break;
          case 'else':
            fail("illegal start of expression", 'Este else no tiene un if antes. Revisá las llaves.');
            break;
        }
      }
      if (looksLikeDecl()) {
        n = localDecl();
        expect(';');
        return n;
      }
      n = expr();
      if (['assign', 'incdec', 'call', 'new', 'switche', 'ctorcall'].indexOf(n.k) === -1) fail('not a statement', 'Esto no hace nada por sí solo. Una instrucción tiene que asignar, llamar a un método o crear algo.', line);
      expect(';');
      return { k: 'expr', e: n, line: line };
    }

    function forStmt() {
      var line = t().line;
      expect('for');
      expect('(');
      if (looksLikeDecl()) {
        var save = p;
        modifiers();
        var ty = type();
        var nm = ident();
        if (eat(':')) {
          var it = expr();
          expect(')');
          return { k: 'foreach', type: ty, name: nm, it: it, body: stmt(), line: line };
        }
        p = save;
      }
      var init = [], upd = [], cond = null;
      if (!is(';')) {
        if (looksLikeDecl()) init.push(localDecl());
        else {
          do { var ie = expr(); init.push({ k: 'expr', e: ie, line: line }); } while (eat(','));
        }
      }
      expect(';');
      if (!is(';')) cond = expr();
      expect(';');
      if (!is(')')) { do { upd.push(expr()); } while (eat(',')); }
      expect(')');
      return { k: 'for', init: init, c: cond, upd: upd, body: stmt(), line: line };
    }

    function switchBody() {
      var line = t().line;
      expect('switch');
      expect('(');
      var e = expr();
      expect(')');
      expect('{');
      var cases = [];
      while (!is('}')) {
        var labels = [];
        var isDefault = false;
        if (eat('default')) isDefault = true;
        else {
          if (!is('case')) fail("case, default, or '}' expected", 'Dentro de un switch solo van bloques case y default.');
          p++;
          do { labels.push(ternary()); } while (eat(','));
        }
        var arrow = false;
        if (eat('->')) arrow = true;
        else expect(':');
        var body = [];
        if (arrow) {
          if (is('{')) body.push(block());
          else if (is('throw')) body.push(stmt());
          else {
            var ln = t().line;
            var ve = expr();
            expect(';');
            body.push({ k: 'arrowval', e: ve, line: ln });
          }
        } else {
          while (!is('case') && !is('default') && !is('}')) {
            if (t().k === 'eof') fail('reached end of file while parsing', 'Falta cerrar el switch con }.');
            body.push(stmt());
          }
        }
        cases.push({ labels: labels, isDefault: isDefault, arrow: arrow, body: body });
      }
      expect('}');
      return { k: 'switche', e: e, cases: cases, line: line };
    }

    function tryStmt() {
      var line = t().line;
      expect('try');
      var res = [];
      if (eat('(')) {
        while (!is(')')) {
          modifiers();
          var ty = type();
          var nm = ident();
          expect('=');
          res.push({ name: nm, type: ty, init: expr(), line: line });
          if (!eat(';')) break;
        }
        expect(')');
      }
      var body = block();
      var catches = [];
      while (is('catch')) {
        p++;
        expect('(');
        modifiers();
        var types = [type()];
        while (eat('|')) types.push(type());
        var v = ident();
        expect(')');
        catches.push({ types: types, name: v, body: block() });
      }
      var fin = null;
      if (eat('finally')) fin = block();
      if (!catches.length && !fin && !res.length) fail("'catch' or 'finally' expected", 'Un try necesita al menos un catch o un finally.', line);
      return { k: 'try', res: res, body: body, catches: catches, fin: fin, line: line };
    }

    function expr() { return assignment(); }

    function assignment() {
      var left = ternary();
      var x = t();
      if (x.k === 'op' && (x.v === '=' || x.v === '+=' || x.v === '-=' || x.v === '*=' || x.v === '/=' || x.v === '%=' || x.v === '&=' || x.v === '|=' || x.v === '^=' || x.v === '<<=')) {
        if (left.k !== 'name' && left.k !== 'field' && left.k !== 'index') fail('unexpected type', 'A la izquierda del = tiene que ir una variable.');
        p++;
        return { k: 'assign', op: x.v, target: left, v: assignment(), line: x.line };
      }
      return left;
    }

    function ternary() {
      var c = binary(0);
      if (is('?')) {
        var line = t().line;
        p++;
        var a = ternary();
        expect(':');
        var b = ternary();
        return { k: 'cond', c: c, a: a, b: b, line: line };
      }
      return c;
    }

    var LEVELS = [['||'], ['&&'], ['|'], ['^'], ['&'], ['==', '!='], ['<', '>', '<=', '>=', 'instanceof'], ['<<', '>>', '>>>'], ['+', '-'], ['*', '/', '%']];

    function shiftAt() {
      if (t().v === '>' && la(1).v === '>' && la(1).pos === t().pos + 1) {
        if (la(2).v === '>' && la(2).pos === t().pos + 2) return '>>>';
        return '>>';
      }
      return null;
    }

    function binary(level) {
      if (level >= LEVELS.length) return unary();
      var left = binary(level + 1);
      for (;;) {
        var x = t();
        var opv = x.v;
        if (level === 7) {
          var s = shiftAt();
          if (s) opv = s;
        } else if (level === 6 && shiftAt()) return left;
        if (LEVELS[level].indexOf(opv) === -1 || (x.k !== 'op' && !(x.k === 'id' && opv === 'instanceof'))) return left;
        p += opv === '>>' ? 2 : opv === '>>>' ? 3 : 1;
        if (opv === 'instanceof') {
          var ty = type();
          var bind = null;
          if (t().k === 'id' && !RESERVED[t().v]) bind = ident();
          left = { k: 'instanceof', e: left, type: ty, bind: bind, line: x.line };
          continue;
        }
        var right = binary(level + 1);
        if (opv === '+' && left.k === 'lit' && right.k === 'lit' && left.lt === 'String' && right.lt === 'String') {
          left = { k: 'lit', lt: 'String', v: left.v + right.v, line: x.line };
        } else {
          left = { k: 'bin', op: opv, a: left, b: right, line: x.line };
        }
      }
    }

    function unary() {
      var x = t();
      if (x.k === 'op') {
        if (x.v === '-' || x.v === '+' || x.v === '!' || x.v === '~') {
          p++;
          if (x.v === '-' && t().k === 'num') {
            var nt = t();
            nt.neg = true;
            var lit = postfix(primary());
            nt.neg = false;
            return lit;
          }
          return { k: 'un', op: x.v, e: unary(), line: x.line };
        }
        if (x.v === '++' || x.v === '--') {
          p++;
          return { k: 'incdec', op: x.v, prefix: true, e: unary(), line: x.line };
        }
        if (x.v === '(') {
          var save = p;
          p++;
          var ty = type();
          if (ty && is(')')) {
            var after = la(1);
            var base = ty.replace(/\[\]/g, '');
            var isCast = PRIMS[base] ? true : (after.k === 'id' && after.v !== 'instanceof') || after.k === 'str' || after.k === 'chr' || after.k === 'num' || after.v === '(' || after.v === '!' || after.v === '~';
            if (isCast) {
              p++;
              return { k: 'cast', type: ty, e: unary(), line: x.line };
            }
          }
          p = save;
        }
      }
      return postfix(primary());
    }

    function postfix(e) {
      for (;;) {
        var x = t();
        if (is('.')) {
          p++;
          if (is('<')) typeArgs();
          if (is('new')) throw new Unsupported('clases internas');
          var nm = t().v === 'class' ? (p++, 'class') : ident();
          if (is('(')) e = { k: 'call', target: e, name: nm, args: args(), line: x.line };
          else e = { k: 'field', target: e, name: nm, line: x.line };
          continue;
        }
        if (is('[')) {
          p++;
          var ix = expr();
          expect(']');
          e = { k: 'index', a: e, i: ix, line: x.line };
          continue;
        }
        if (is('++') || is('--')) {
          p++;
          e = { k: 'incdec', op: x.v, prefix: false, e: e, line: x.line };
          continue;
        }
        if (is('::')) {
          p++;
          var mref = t().v;
          p++;
          e = { k: 'mref', target: e, name: mref, line: x.line };
          continue;
        }
        return e;
      }
    }

    function args() {
      var list = [];
      expect('(');
      if (!is(')')) { do { list.push(expr()); } while (eat(',')); }
      expect(')');
      return list;
    }

    function primary() {
      var x = t();
      if (x.k === 'num') {
        p++;
        var txt = (x.neg ? '-' : '') + x.v;
        if (x.ty === 'int') {
          var iv = Number(x.v);
          if (iv === 2147483648 && !x.neg) throw new CompileError(x.line, 'integer number too large', 'Ese número no entra en un int.');
          return { k: 'lit', lt: 'int', v: (x.neg ? -iv : iv) | 0, line: x.line };
        }
        if (x.ty === 'long') return { k: 'lit', lt: 'long', v: x.neg ? -BigInt(x.v) : BigInt(x.v), line: x.line };
        return { k: 'lit', lt: x.ty, v: x.ty === 'float' ? Math.fround(Number(txt)) : Number(txt), line: x.line };
      }
      if (x.k === 'str') { p++; return { k: 'lit', lt: 'String', v: x.v, line: x.line }; }
      if (x.k === 'chr') { p++; return { k: 'lit', lt: 'char', v: x.v, line: x.line }; }
      if (is('(')) {
        if (parenLambda()) return lambda();
        p++;
        var inner = expr();
        expect(')');
        return inner;
      }
      if (x.k === 'id') {
        switch (x.v) {
          case 'true': p++; return { k: 'lit', lt: 'boolean', v: true, line: x.line };
          case 'false': p++; return { k: 'lit', lt: 'boolean', v: false, line: x.line };
          case 'null': p++; return { k: 'lit', lt: 'null', v: null, line: x.line };
          case 'this':
            p++;
            if (is('(')) return { k: 'ctorcall', isSuper: false, args: args(), line: x.line };
            return { k: 'this', line: x.line };
          case 'super':
            p++;
            if (is('(')) return { k: 'ctorcall', isSuper: true, args: args(), line: x.line };
            expect('.');
            var sn = ident();
            if (is('(')) return { k: 'call', target: { k: 'super', line: x.line }, name: sn, args: args(), line: x.line };
            return { k: 'field', target: { k: 'this', line: x.line }, name: sn, line: x.line };
          case 'new': return newExpr();
          case 'switch': return switchBody();
        }
        if (RESERVED[x.v] || PRIMS[x.v]) {
          if (PRIMS[x.v] && la(1).v === '.') throw new Unsupported('literal de clase');
          fail('illegal start of expression', x.v + ' no puede ir en este lugar.');
        }
        if (la(1).v === '->') return lambda();
        p++;
        if (is('(')) return { k: 'call', target: null, name: x.v, args: args(), line: x.line };
        return { k: 'name', name: x.v, line: x.line };
      }
      fail('illegal start of expression', 'Java no esperaba ' + x.v + ' en este lugar.');
    }

    function parenLambda() {
      var d = 0;
      for (var i = p; i < toks.length; i++) {
        if (toks[i].v === '(' && toks[i].k === 'op') d++;
        if (toks[i].v === ')' && toks[i].k === 'op') {
          d--;
          if (d === 0) return !!toks[i + 1] && toks[i + 1].v === '->';
        }
      }
      return false;
    }

    function lambda() {
      var line = t().line;
      var ps = [];
      if (is('(')) {
        p++;
        while (!is(')')) {
          modifiers();
          var ty = null;
          if (la(1).v !== ',' && la(1).v !== ')') ty = type();
          ps.push({ name: ident(), type: ty });
          if (!eat(',')) break;
        }
        expect(')');
      } else {
        ps.push({ name: ident(), type: null });
      }
      expect('->');
      var isExpr = !is('{');
      return { k: 'lambda', params: ps, body: isExpr ? expr() : block(), isExpr: isExpr, line: line };
    }

    function newExpr() {
      var line = t().line;
      expect('new');
      var x = t();
      if (x.k !== 'id') fail('<identifier> expected', 'Después de new va el nombre de una clase.');
      p++;
      var name = x.v;
      if (!PRIMS[name]) {
        typeArgs();
        while (is('.')) { p++; name = ident(); typeArgs(); }
      }
      if (is('[')) {
        var dims = [];
        var extra = 0;
        while (is('[')) {
          p++;
          if (is(']')) { p++; extra++; continue; }
          dims.push(expr());
          expect(']');
        }
        if (is('{')) {
          var ty = name;
          for (var i = 0; i < extra; i++) ty += '[]';
          return arrayInit(ty);
        }
        if (!dims.length) fail('array dimension missing', 'Al crear un array indicá el tamaño o los valores.', line);
        return { k: 'newarr', type: name, dims: dims, extra: extra, line: line };
      }
      var a = args();
      if (is('{')) throw new Unsupported('clases anónimas');
      return { k: 'new', name: name, args: a, line: line };
    }

    return program();
  }

  // ── Número a texto como lo hace Java ─────────────────────────────────
  function expandSci(s) {
    var m = /^(-?)(\d)(?:\.(\d+))?e([+-]?\d+)$/.exec(s);
    if (!m) return s;
    var digits = m[2] + (m[3] || '');
    var exp = Number(m[4]);
    var point = 1 + exp;
    if (point <= 0) return m[1] + '0.' + new Array(1 - point).join('0') + digits;
    if (point >= digits.length) return m[1] + digits + new Array(point - digits.length + 1).join('0');
    return m[1] + digits.slice(0, point) + '.' + digits.slice(point);
  }

  function shortestFloat(n) {
    for (var p = 1; p <= 9; p++) {
      var s = n.toPrecision(p);
      if (Math.fround(Number(s)) === n) return String(Number(s));
    }
    return String(n);
  }

  function fpText(n, isFloat) {
    if (n !== n) return 'NaN';
    if (n === Infinity) return 'Infinity';
    if (n === -Infinity) return '-Infinity';
    if (n === 0) return (1 / n < 0) ? '-0.0' : '0.0';
    var abs = Math.abs(n);
    var s = isFloat ? shortestFloat(n) : String(n);
    if (abs >= 1e-3 && abs < 1e7) {
      s = expandSci(s);
      return s.indexOf('.') === -1 ? s + '.0' : s;
    }
    var neg = n < 0 ? '-' : '';
    var sci = isFloat ? Number(s).toExponential() : abs.toExponential();
    if (isFloat) sci = sci.replace(/^-/, '');
    var m = /^(\d)(?:\.(\d+))?e([+-])(\d+)$/.exec(sci);
    return neg + m[1] + '.' + (m[2] || '0') + 'E' + (m[3] === '-' ? '-' : '') + m[4];
  }

  // Redondea un decimal HALF_UP sobre su representación corta, como Formatter
  function roundDecimal(n, places) {
    var neg = n < 0 || (n === 0 && 1 / n < 0);
    var s = expandSci(String(Math.abs(n)));
    var parts = s.split('.');
    var ip = parts[0];
    var fp = parts[1] || '';
    if (fp.length <= places) {
      return (neg ? '-' : '') + ip + (places ? '.' + fp + new Array(places - fp.length + 1).join('0') : '');
    }
    var digits = (ip + fp.slice(0, places)).split('').map(Number);
    if (fp.charAt(places) >= '5') {
      var i = digits.length - 1;
      while (i >= 0) {
        if (digits[i] === 9) { digits[i] = 0; i--; } else { digits[i]++; break; }
      }
      if (i < 0) digits.unshift(1);
    }
    var txt = digits.join('');
    var cut = txt.length - places;
    return (neg ? '-' : '') + txt.slice(0, cut) + (places ? '.' + txt.slice(cut) : '');
  }

  // ── Ejecución ────────────────────────────────────────────────────────
  var PRELUDE = [
    'class Object {}',
    'class Throwable { private String message; private Throwable cause;',
    '  Throwable() {} Throwable(String m) { message = m; } Throwable(String m, Throwable c) { message = m; cause = c; }',
    '  public String getMessage() { return message; } public String getLocalizedMessage() { return message; } public Throwable getCause() { return cause; }',
    '  public String toString() { String n = getClass().getName(); return message == null ? n : n + ": " + message; }',
    '  public void printStackTrace() {} }'
  ];
  var HIERARCHY = [
    ['Exception', 'Throwable', 'java.lang'], ['Error', 'Throwable', 'java.lang'], ['RuntimeException', 'Exception', 'java.lang'],
    ['StackOverflowError', 'Error', 'java.lang'], ['ArithmeticException', 'RuntimeException', 'java.lang'], ['NullPointerException', 'RuntimeException', 'java.lang'],
    ['ClassCastException', 'RuntimeException', 'java.lang'], ['IllegalArgumentException', 'RuntimeException', 'java.lang'], ['IllegalStateException', 'RuntimeException', 'java.lang'],
    ['UnsupportedOperationException', 'RuntimeException', 'java.lang'], ['NumberFormatException', 'IllegalArgumentException', 'java.lang'], ['IndexOutOfBoundsException', 'RuntimeException', 'java.lang'],
    ['ArrayIndexOutOfBoundsException', 'IndexOutOfBoundsException', 'java.lang'], ['StringIndexOutOfBoundsException', 'IndexOutOfBoundsException', 'java.lang'],
    ['NegativeArraySizeException', 'RuntimeException', 'java.lang'], ['NoSuchElementException', 'RuntimeException', 'java.util'], ['InputMismatchException', 'NoSuchElementException', 'java.util'],
    ['IOException', 'Exception', 'java.io'], ['FileNotFoundException', 'IOException', 'java.io'], ['InterruptedException', 'Exception', 'java.lang'],
    ['CloneNotSupportedException', 'Exception', 'java.lang']
  ];
  var PACKAGES = dict({ Throwable: 'java.lang', Object: 'java.lang' });
  HIERARCHY.forEach(function (h) {
    PACKAGES[h[0]] = h[2];
    PRELUDE.push('class ' + h[0] + ' extends ' + h[1] + ' { ' + h[0] + '() { super(); } ' + h[0] + '(String m) { super(m); } ' + (h[1] === 'Throwable' || h[0] === 'RuntimeException' ? h[0] + '(String m, Throwable c) { super(m, c); } ' : '') + '}');
  });
  var preludeAst = null;

  var BUILTIN_STATIC = dict({ Math: 1, Integer: 1, Double: 1, Long: 1, Float: 1, Short: 1, Byte: 1, Boolean: 1, Character: 1, String: 1, System: 1, Arrays: 1, Collections: 1, List: 1, Objects: 1, Thread: 1, Optional: 1, Stream: 1, IntStream: 1, Collectors: 1, Comparator: 1, Map: 1 });
  var BOXED = dict({ Integer: 'int', Double: 'double', Long: 'long', Float: 'float', Short: 'short', Byte: 'byte', Character: 'char', Boolean: 'boolean' });
  var KNOWN_NATIVE = dict({ String: 1, Object: 1, ArrayList: 1, List: 1, LinkedList: 1, Collection: 1, Iterable: 1, StringBuilder: 1, StringBuffer: 1, Scanner: 1, File: 1, FileWriter: 1, BufferedWriter: 1, PrintWriter: 1, FileReader: 1, BufferedReader: 1, Comparable: 1, Runnable: 1, Cloneable: 1, Serializable: 1, AutoCloseable: 1, Closeable: 1, CharSequence: 1, Number: 1, Map: 1, HashMap: 1, LinkedHashMap: 1, TreeMap: 1, Optional: 1, Function: 1, BiFunction: 1, Predicate: 1, Consumer: 1, Supplier: 1, UnaryOperator: 1, BinaryOperator: 1, Comparator: 1 });

  function run(source, opts) {
    opts = opts || {};
    var out = '';
    var steps = 0;
    var depth = 0;
    var maxSteps = opts.maxSteps || MAX_STEPS;
    var stdin = (opts.stdin || []).join('\n');
    if (stdin.length) stdin += '\n';
    var stdinPos = 0;
    var files = Object.create(null);
    var classes = Object.create(null);
    var interned = Object.create(null);
    var curLine = 0;

    function intern(s) {
      var k = '$' + s;
      return interned[k] || (interned[k] = new JStr(s));
    }
    function str(s) { return new JStr(s); }

    function write(text) {
      out += text;
      if (out.length > MAX_OUTPUT) throw new Limit('El programa imprimió demasiado texto. Revisá que el bucle tenga una condición de salida.');
    }

    function tick() {
      if (++steps > maxSteps) throw new Limit('El programa no termina: seguramente hay un bucle infinito. Revisá que la condición del bucle llegue a ser falsa.');
    }

    function typeName(v) {
      if (v === null || v === undefined) return 'null';
      if (typeof v === 'number') return 'int';
      if (typeof v === 'boolean') return 'boolean';
      if (v instanceof JDouble) return 'double';
      if (v instanceof JFloat) return 'float';
      if (v instanceof JLong) return 'long';
      if (v instanceof JChar) return 'char';
      if (v instanceof JStr) return 'String';
      if (v instanceof JArr) return v.type + '[]';
      if (v instanceof JList) return v.kind;
      if (v instanceof JSb) return 'StringBuilder';
      if (v instanceof JObj) return v.cls.name;
      if (v instanceof Native) return v.kind;
      if (v instanceof JMap) return v.kind;
      if (v instanceof JOpt) return 'Optional';
      return 'Object';
    }

    function isNum(v) { return typeof v === 'number' || v instanceof JDouble || v instanceof JFloat || v instanceof JLong || v instanceof JChar; }

    function compileErr(line, javac, why) { throw new CompileError(line || curLine, javac, why); }

    function incompatible(v, target, line) {
      var from = typeName(v);
      if (isNum(v) && (target === 'int' || target === 'long' || target === 'float' || target === 'short' || target === 'byte' || target === 'char') && !(typeof v === 'number')) {
        compileErr(line, 'incompatible types: possible lossy conversion from ' + from + ' to ' + target, 'Un ' + from + ' no entra en un ' + target + ' sin perder datos. Si es lo que querés, hacé un cast: (' + target + ') valor.');
      }
      compileErr(line, 'incompatible types: ' + from + ' cannot be converted to ' + target, 'Estás guardando un ' + from + ' donde va un ' + target + '. Revisá el tipo de la variable y el valor.');
    }

    function coerce(v, type, line) {
      if (v instanceof JFn) return v;
      switch (type) {
        case 'int': case 'short': case 'byte':
          if (typeof v === 'number') return v;
          if (v instanceof JChar) return v.v;
          return incompatible(v, type, line);
        case 'long':
          if (typeof v === 'number') return new JLong(BigInt(v));
          if (v instanceof JLong) return v;
          if (v instanceof JChar) return new JLong(BigInt(v.v));
          return incompatible(v, type, line);
        case 'double':
          if (v instanceof JDouble) return v;
          if (isNum(v)) return new JDouble(asNumber(v));
          return incompatible(v, type, line);
        case 'float':
          if (v instanceof JFloat) return v;
          if (typeof v === 'number' || v instanceof JLong || v instanceof JChar) return new JFloat(Math.fround(asNumber(v)));
          return incompatible(v, type, line);
        case 'char':
          if (v instanceof JChar) return v;
          if (typeof v === 'number') return new JChar(v & 0xffff);
          return incompatible(v, type, line);
        case 'boolean':
          if (typeof v === 'boolean') return v;
          return incompatible(v, type, line);
        case 'String':
          if (v === null || v instanceof JStr) return v;
          return incompatible(v, type, line);
        case 'var': case 'Object':
          return v;
      }
      if (BOXED[type]) {
        if (v === null) return null;
        return coerce(v, BOXED[type], line);
      }
      if (type.slice(-2) === '[]') {
        if (v === null || v instanceof JArr) return v;
        return incompatible(v, type, line);
      }
      if (classes[type] && !isPrelude(type)) {
        if (v === null) return null;
        if (!instanceOf(v, type)) return incompatible(v, type, line);
      }
      return v;
    }

    function isPrelude(name) { return !!(classes[name] && classes[name].builtin); }

    function defaultValue(type) {
      switch (type) {
        case 'int': case 'short': case 'byte': return 0;
        case 'long': return new JLong(BigInt(0));
        case 'double': return new JDouble(0);
        case 'float': return new JFloat(0);
        case 'char': return new JChar(0);
        case 'boolean': return false;
      }
      return null;
    }

    function asNumber(v) {
      if (typeof v === 'number') return v;
      if (v instanceof JLong) return Number(v.v);
      return v.v;
    }

    function toBig(v) {
      if (v instanceof JLong) return v.v;
      return BigInt(Math.trunc(asNumber(v)));
    }

    function toStr(v) {
      if (v === null || v === undefined) return 'null';
      if (typeof v === 'number' || typeof v === 'boolean') return String(v);
      if (v instanceof JStr) return v.s;
      if (v instanceof JDouble) return fpText(v.v, false);
      if (v instanceof JFloat) return fpText(v.v, true);
      if (v instanceof JLong) return v.v.toString();
      if (v instanceof JChar) return String.fromCharCode(v.v);
      if (v instanceof JList) return '[' + v.a.map(function (x) { return x === v ? '(this Collection)' : toStr(x); }).join(', ') + ']';
      if (v instanceof JSb) return v.s;
      if (v instanceof JMap) return '{' + mapEntries(v).map(toStr).join(', ') + '}';
      if (v instanceof JEntry) return toStr(v.k) + '=' + toStr(v.v);
      if (v instanceof JOpt) return v.v === null ? 'Optional.empty' : 'Optional[' + toStr(v.v) + ']';
      if (v instanceof JFn) return 'Lambda@' + v.id.toString(16);
      if (v instanceof JObj) {
        var r = callVirtual(v, 'toString', [], curLine);
        return r === null ? 'null' : r.s;
      }
      if (v instanceof JArr) {
        var code = { 'int': '[I', 'double': '[D', 'char': '[C', 'long': '[J', 'boolean': '[Z', 'float': '[F' }[v.type] || ('[L' + v.type + ';');
        return code + '@' + v.id.toString(16);
      }
      if (v instanceof ClassOf) return 'class ' + v.name;
      if (v instanceof Native) return v.kind + '@' + v.id.toString(16);
      return String(v);
    }

    // ── Clases ─────────────────────────────────────────────────────────
    function defineClass(c, builtin) {
      if (classes[c.name] && !classes[c.name].builtin && !builtin) {
        compileErr(c.line, 'duplicate class: ' + c.name, 'Hay dos clases con el mismo nombre.');
      }
      if (c.isRecord) expandRecord(c);
      classes[c.name] = {
        isEnum: c.isEnum, isRecord: c.isRecord, enumConsts: c.enumConsts, recParams: c.recParams,
        name: c.name, sup: c.sup, ifaces: c.ifaces, isAbstract: c.isAbstract, isInterface: c.isInterface, outer: c.outer,
        fields: c.fields, methods: c.methods, ctors: c.ctors, inits: c.inits, statics: c.statics,
        st: Object.create(null), ready: false, builtin: !!builtin, line: c.line
      };
    }

    // Un record es azúcar: atributos final, constructor canónico y un método por campo
    function expandRecord(c) {
      var body = c.compact ? c.compact.body.slice() : [];
      c.recParams.forEach(function (rp) {
        c.fields.push({ kind: 'field', name: rp.name, type: rp.type, init: null, isStatic: false, isFinal: true, access: 'private', line: c.line, cls: c.name });
        body.push({ k: 'expr', line: c.line, e: { k: 'assign', op: '=', line: c.line, target: { k: 'field', target: { k: 'this', line: c.line }, name: rp.name, line: c.line }, v: { k: 'name', name: rp.name, line: c.line } } });
        var exists = c.methods.some(function (m) { return m.name === rp.name && !m.params.length; });
        if (!exists) c.methods.push({ name: rp.name, params: [], ret: rp.type, isStatic: false, isAbstract: false, access: 'public', throwsList: [], cls: c.name, line: c.line, override: false, body: { k: 'block', line: c.line, body: [{ k: 'return', line: c.line, v: { k: 'field', target: { k: 'this', line: c.line }, name: rp.name, line: c.line } }] } });
      });
      c.ctors.push({ params: c.recParams, body: { k: 'block', body: body, line: c.line }, access: 'public', line: c.line, throwsList: [] });
    }

    function supOf(c) {
      if (c.name === 'Object') return null;
      return classes[c.sup || 'Object'] || null;
    }

    function ancestors(c) {
      var list = [];
      var seen = {};
      (function walk(k) {
        if (!k || seen[k.name]) return;
        seen[k.name] = 1;
        list.push(k);
        walk(supOf(k));
        k.ifaces.forEach(function (i) { walk(classes[i]); });
      })(c);
      return list;
    }

    function instanceOf(v, name) {
      if (v === null) return false;
      if (name === 'Object') return true;
      if (v instanceof JObj) {
        return ancestors(v.cls).some(function (k) { return k.name === name; });
      }
      if (v instanceof JStr) return name === 'String' || name === 'CharSequence' || name === 'Comparable';
      if (v instanceof JList) return name === v.kind || name === 'List' || name === 'Collection' || name === 'Iterable';
      if (v instanceof JSb) return name === 'StringBuilder' || name === 'StringBuffer' || name === 'CharSequence';
      if (BOXED[name]) return typeName(v) === BOXED[name];
      if (name === 'Number') return typeof v === 'number' || v instanceof JDouble || v instanceof JLong || v instanceof JFloat;
      if (v instanceof JArr) return name === v.type + '[]';
      return typeName(v) === name;
    }

    function checkClasses() {
      Object.keys(classes).forEach(function (name) {
        var c = classes[name];
        if (c.builtin) return;
        if (c.sup && !classes[c.sup] && !KNOWN_NATIVE[c.sup]) compileErr(c.line, 'cannot find symbol: class ' + c.sup, 'La clase ' + c.sup + ' no existe. Revisá el nombre después de extends.');
        c.ifaces.forEach(function (i) {
          if (!classes[i] && !KNOWN_NATIVE[i]) compileErr(c.line, 'cannot find symbol: class ' + i, 'La interfaz ' + i + ' no existe. Revisá el nombre después de implements.');
        });
        if (c.sup && classes[c.sup] && classes[c.sup].isInterface) compileErr(c.line, 'no interface expected here', c.sup + ' es una interfaz: se usa con implements, no con extends.');
        c.ifaces.forEach(function (i) {
          if (classes[i] && !classes[i].isInterface && !c.isInterface) compileErr(c.line, 'interface expected here', i + ' es una clase: se usa con extends, no con implements.');
        });
        if (c.isAbstract) return;
        var chain = ancestors(c);
        chain.forEach(function (k) {
          k.methods.forEach(function (m) {
            if (!m.isAbstract) return;
            var impl = chain.some(function (o) {
              return o.methods.some(function (x) { return !x.isAbstract && x.name === m.name && x.params.length === m.params.length; });
            });
            if (!impl) compileErr(c.line, c.name + ' is not abstract and does not override abstract method ' + m.name + '() in ' + k.name, 'La clase ' + c.name + ' tiene que implementar ' + m.name + '(), porque ' + k.name + ' lo exige.');
          });
        });
      });
    }

    // ── Chequeos que javac hace sin ejecutar ───────────────────────────
    function isChecked(name) {
      var c = classes[name];
      if (!c || !ancestors(c).some(function (k) { return k.name === 'Throwable'; })) return false;
      return !ancestors(c).some(function (k) { return k.name === 'RuntimeException' || k.name === 'Error'; });
    }

    function isHandled(name, handlers) {
      return handlers.some(function (h) {
        return h === name || (classes[name] && classes[h] && ancestors(classes[name]).some(function (k) { return k.name === h; }));
      });
    }

    function needsHandling(name, handlers, line) {
      if (isChecked(name) && !isHandled(name, handlers)) {
        compileErr(line, 'unreported exception ' + name + '; must be caught or declared to be thrown', name + ' es una excepción checked: atrapala con try-catch o declarala con throws en el método.');
      }
    }

    var IO_NEW = dict({ FileWriter: 'IOException', FileReader: 'FileNotFoundException' });

    function scanThrows(node, handlers) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(function (x) { scanThrows(x, handlers); }); return; }
      if (node.k === 'try') {
        var caught = [];
        node.catches.forEach(function (c) {
          c.types.forEach(function (ty) {
            if (isHandled(ty, caught)) compileErr(node.line, 'exception ' + ty + ' has already been caught', 'Un catch anterior ya atrapa ' + ty + '. Ordenalos del más específico al más general.');
            caught.push(ty);
          });
        });
        var inner = handlers.slice();
        node.catches.forEach(function (c) { inner.push.apply(inner, c.types); });
        scanThrows(node.res, inner);
        scanThrows(node.body, inner);
        node.catches.forEach(function (c) { scanThrows(c.body, handlers); });
        scanThrows(node.fin, handlers);
        return;
      }
      if (node.k === 'throw' && node.v.k === 'new') needsHandling(node.v.name, handlers, node.line);
      if (node.k === 'new') {
        if (IO_NEW[node.name]) needsHandling(IO_NEW[node.name], handlers, node.line);
        var nc = classes[node.name];
        if (nc) {
          nc.ctors.forEach(function (ct) {
            if (ct.params.length === node.args.length) (ct.throwsList || []).forEach(function (t) { needsHandling(t, handlers, node.line); });
          });
        }
      }
      if (node.k === 'call') {
        Object.keys(classes).forEach(function (cn) {
          classes[cn].methods.forEach(function (m) {
            if (classes[cn].builtin || m.name !== node.name || m.params.length !== node.args.length) return;
            m.throwsList.forEach(function (t) { needsHandling(t, handlers, node.line); });
          });
        });
      }
      Object.keys(node).forEach(function (k) {
        if (k !== 'line' && typeof node[k] === 'object') scanThrows(node[k], handlers);
      });
    }

    // Una clase de java.util o java.io necesita su import
    var NEEDS_IMPORT = dict({
      ArrayList: 'java.util', LinkedList: 'java.util', List: 'java.util', Arrays: 'java.util', Collections: 'java.util', Scanner: 'java.util', Objects: 'java.util',
      NoSuchElementException: 'java.util', InputMismatchException: 'java.util',
      File: 'java.io', FileWriter: 'java.io', FileReader: 'java.io', BufferedWriter: 'java.io', BufferedReader: 'java.io', PrintWriter: 'java.io',
      IOException: 'java.io', FileNotFoundException: 'java.io',
      Map: 'java.util', HashMap: 'java.util', LinkedHashMap: 'java.util', TreeMap: 'java.util', Optional: 'java.util', Comparator: 'java.util',
      Function: 'java.util.function', BiFunction: 'java.util.function', Predicate: 'java.util.function', Consumer: 'java.util.function', Supplier: 'java.util.function', UnaryOperator: 'java.util.function', BinaryOperator: 'java.util.function',
      Stream: 'java.util.stream', IntStream: 'java.util.stream', Collectors: 'java.util.stream'
    });

    function checkImports(toks, imports, list) {
      var own = {};
      list.forEach(function (c) { own[c.name] = 1; });
      toks.forEach(function (tok, i) {
        if (tok.k !== 'id' || !NEEDS_IMPORT[tok.v] || own[tok.v]) return;
        if (i > 0 && toks[i - 1].v === '.') return;
        var pkg = NEEDS_IMPORT[tok.v];
        if (imports.indexOf(pkg + '.' + tok.v) !== -1 || imports.indexOf(pkg + '.*') !== -1) return;
        compileErr(tok.line, 'cannot find symbol: class ' + tok.v, 'Falta el import. Agregá al principio del archivo: import ' + pkg + '.' + tok.v + ';');
      });
    }

    function scanReturns(node, ret, name) {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) { node.forEach(function (x) { scanReturns(x, ret, name); }); return; }
      if (node.k === 'lambda') return;
      if (node.k === 'return') {
        if (ret === 'void' && node.v) compileErr(node.line, 'incompatible types: unexpected return value', name + ' es void: no puede devolver un valor. Si tiene que devolverlo, cambiá void por el tipo.');
        if (ret !== 'void' && !node.v) compileErr(node.line, 'incompatible types: missing return value', name + ' tiene que devolver un ' + ret + '.');
        return;
      }
      Object.keys(node).forEach(function (k) {
        if (k !== 'line' && typeof node[k] === 'object') scanReturns(node[k], ret, name);
      });
    }

    function checkOverride(c, m) {
      if (!m.override) return;
      if ((m.name === 'toString' && !m.params.length) || (m.name === 'hashCode' && !m.params.length) || (m.name === 'equals' && m.params.length === 1)) return;
      var found = ancestors(classes[c.name]).slice(1).some(function (k) {
        return k.methods.some(function (x) { return x.name === m.name && x.params.length === m.params.length; });
      });
      if (!found) compileErr(m.line, 'method does not override or implement a method from a supertype', m.name + '() no existe en la clase padre. Revisá que el nombre y los parámetros sean idénticos.');
    }

    function hasBreak(s) {
      if (!s || typeof s !== 'object') return false;
      if (Array.isArray(s)) return s.some(hasBreak);
      if (s.k === 'break') return true;
      if (s.k === 'while' || s.k === 'for' || s.k === 'do' || s.k === 'foreach' || s.k === 'switchs') return false;
      return Object.keys(s).some(function (k) { return k !== 'line' && typeof s[k] === 'object' && hasBreak(s[k]); });
    }

    // Solo marca lo que es seguro: ante la duda, deja que se ejecute
    function canFallOff(s) {
      switch (s.k) {
        case 'return': case 'throw': return false;
        case 'block': return s.body.length ? canFallOff(s.body[s.body.length - 1]) : true;
        case 'if': return !s.b || canFallOff(s.a) || canFallOff(s.b);
        case 'while': return !(s.c.k === 'lit' && s.c.v === true) || hasBreak(s.body);
        case 'for': return !!s.c || hasBreak(s.body);
        case 'local': case 'expr': case 'foreach': case 'empty': return true;
      }
      return false;
    }

    function staticChecks(list) {
      list.forEach(function (c) {
        c.methods.forEach(function (m) {
          if (!m.body) return;
          checkOverride(c, m);
          scanReturns(m.body, m.ret, m.name);
          if (m.ret !== 'void' && canFallOff(m.body)) compileErr(m.line, 'missing return statement', 'El método ' + m.name + ' promete devolver ' + m.ret + ', pero hay un camino que termina sin return.');
          scanThrows(m.body, m.throwsList.slice());
        });
        c.ctors.forEach(function (ct) { scanThrows(ct.body, ct.throwsList.slice()); });
      });
    }

    function initClass(c) {
      if (c.ready) return;
      c.ready = true;
      var sup = supOf(c);
      if (sup) initClass(sup);
      c.fields.forEach(function (f) { if (f.isStatic) c.st[f.name] = { type: f.type, v: defaultValue(f.type), isFinal: f.isFinal }; });
      var frame = { self: null, cls: c, isStatic: true };
      if (c.isEnum) {
        c.enumValues = [];
        c.enumConsts.forEach(function (ec, ordinal) {
          var o = new JObj(c);
          o.enumName = ec.name;
          o.ordinal = ordinal;
          initFields(o, c);
          construct(o, c, ec.args.map(function (a) { return ev(a, frame, newScope()); }), ec.line);
          c.st[ec.name] = { type: c.name, v: o, isFinal: true, set: true };
          c.enumValues.push(o);
        });
      }
      c.statics.forEach(function (s) {
        if (s.kind === 'block') { execBlock(s.body, frame, newScope()); return; }
        if (s.init) c.st[s.name].v = coerce(ev(s.init, frame, newScope(), s.type), s.type, s.line);
      });
    }

    function newScope(parent) { return Object.create(parent || null); }

    function instantiate(c, args, line) {
      initClass(c);
      if (c.isInterface || c.isAbstract) compileErr(line, c.name + ' is abstract; cannot be instantiated', 'No se puede crear un objeto de una clase abstracta o interfaz. Creá una clase hija concreta.');
      var o = new JObj(c);
      initFields(o, c);
      construct(o, c, args, line);
      return o;
    }

    function initFields(o, c) {
      var sup = supOf(c);
      if (sup) initFields(o, sup);
      o.byClass[c.name] = Object.create(null);
      c.fields.forEach(function (f) {
        if (f.isStatic) return;
        var slot = { type: f.type, v: defaultValue(f.type), cls: c.name, access: f.access, isFinal: f.isFinal, set: false };
        o.f[f.name] = slot;
        o.byClass[c.name][f.name] = slot;
      });
    }

    function runInits(o, c) {
      var frame = { self: o, cls: c, isStatic: false };
      c.inits.forEach(function (s) {
        if (s.kind === 'block') { execBlock(s.body, frame, newScope()); return; }
        if (s.init) {
          var slot = o.byClass[c.name][s.name];
          slot.v = coerce(ev(s.init, frame, newScope(), s.type), s.type, s.line);
          slot.set = true;
        }
      });
    }

    function construct(o, c, args, line) {
      var ctor = null;
      if (c.ctors.length) {
        ctor = pick(c.ctors, args);
        if (!ctor) {
          compileErr(line, 'constructor ' + c.name + ' in class ' + c.name + ' cannot be applied to given types', 'Los argumentos no coinciden con ningún constructor de ' + c.name + '. Revisá cantidad y tipos.');
        }
      } else if (args.length) {
        compileErr(line, 'constructor ' + c.name + ' in class ' + c.name + ' cannot be applied to given types', c.name + ' no tiene un constructor que reciba esos datos. Definilo o creá el objeto sin argumentos.');
      }
      var sup = supOf(c);
      if (!ctor) {
        if (sup) construct(o, sup, [], line);
        runInits(o, c);
        return;
      }
      var body = ctor.body.body;
      var first = body.length && body[0].k === 'expr' && body[0].e.k === 'ctorcall' ? body[0].e : null;
      var frame = { self: o, cls: c, isStatic: false };
      var sc = bindParams(ctor.params, args, line);
      enter();
      try {
        var startAt = 0;
        if (first) {
          var vals = first.args.map(function (a) { return ev(a, frame, sc); });
          if (first.isSuper) {
            if (sup) construct(o, sup, vals, first.line);
            runInits(o, c);
          } else {
            construct(o, c, vals, first.line);
          }
          startAt = 1;
        } else {
          if (sup) {
            if (sup.ctors.length && !pick(sup.ctors, [])) {
              compileErr(ctor.line, 'constructor ' + sup.name + ' in class ' + sup.name + ' cannot be applied to given types', sup.name + ' no tiene constructor vacío, así que el constructor de ' + c.name + ' debe empezar con super(...).');
            }
            construct(o, sup, [], line);
          }
          runInits(o, c);
        }
        for (var i = startAt; i < body.length; i++) {
          var r = exec(body[i], frame, sc);
          if (r) break;
        }
      } finally { leave(); }
    }

    function enter() {
      if (++depth > MAX_DEPTH) {
        depth--;
        throwJava('StackOverflowError', null, curLine);
      }
    }
    function leave() { depth--; }

    function bindParams(params, args, line) {
      var sc = newScope();
      for (var i = 0; i < params.length; i++) {
        sc[params[i].name] = { type: params[i].type, v: coerce(args[i], params[i].type, line) };
      }
      return sc;
    }

    function score(paramType, v) {
      if (v instanceof JFn) return classes[paramType] && !classes[paramType].isInterface ? -1 : 2;
      var t = typeName(v);
      if (paramType === t) return 4;
      if (v === null) return PRIMS[paramType] ? -1 : 2;
      if (BOXED[paramType] === t) return 2;
      var num = { 'byte': 1, 'short': 2, 'char': 2, 'int': 3, 'long': 4, 'float': 5, 'double': 6 };
      if (num[paramType] && num[t]) return num[paramType] > num[t] ? 3 : -1;
      if (paramType === 'Object') return 1;
      if (PRIMS[paramType] || paramType === 'String') return -1;
      if (paramType.slice(-2) === '[]') return (v instanceof JArr) ? 3 : -1;
      if (classes[paramType] && !isPrelude(paramType)) return instanceOf(v, paramType) ? 3 : -1;
      if (classes[paramType]) return instanceOf(v, paramType) ? 3 : -1;
      if (v instanceof JObj || !PRIMS[t]) return 1;
      return 1;
    }

    function pick(list, args) {
      var best = null, bestScore = -1;
      list.forEach(function (m) {
        if (m.params.length !== args.length) return;
        var total = 0;
        for (var i = 0; i < args.length; i++) {
          var s = score(m.params[i].type, args[i]);
          if (s < 0) return;
          total += s;
        }
        if (total > bestScore) { best = m; bestScore = total; }
      });
      return best;
    }

    function findMethod(c, name, args) {
      var chain = ancestors(c);
      var named = [];
      chain.forEach(function (k) {
        k.methods.forEach(function (m) { if (m.name === name) named.push(m); });
      });
      var concrete = named.filter(function (m) { return !m.isAbstract; });
      var found = null, bestScore = -1;
      for (var i = 0; i < concrete.length; i++) {
        var m = concrete[i];
        if (m.params.length !== args.length) continue;
        var total = 0, ok = true;
        for (var j = 0; j < args.length; j++) {
          var s = score(m.params[j].type, args[j]);
          if (s < 0) { ok = false; break; }
          total += s;
        }
        if (ok && total > bestScore) { found = m; bestScore = total; }
      }
      return found;
    }

    function invoke(m, self, args, line) {
      tick();
      var c = classes[m.cls];
      var frame = { self: self, cls: c, isStatic: m.isStatic };
      var sc = bindParams(m.params, args, line);
      enter();
      var saved = curLine;
      try {
        var r = execBlock(m.body, frame, sc);
        curLine = saved;
        if (r && r.ret) {
          if (m.ret === 'void') return undefined;
          return coerce(r.v, m.ret, r.line);
        }
        if (m.ret !== 'void') compileErr(m.line, 'missing return statement', 'El método ' + m.name + ' promete devolver ' + m.ret + ' pero terminó sin un return.');
        return undefined;
      } catch (e) {
        if (e instanceof RangeError) throwJava('StackOverflowError', null, line);
        throw e;
      } finally { leave(); }
    }

    function missingMethod(name, args, line) {
      compileErr(line, 'cannot find symbol: method ' + name, 'El método ' + name + ' no existe con esos argumentos. Revisá el nombre (Java distingue mayúsculas), la cantidad y los tipos.');
    }

    function callVirtual(o, name, args, line) {
      var m = findMethod(o.cls, name, args);
      if (m) return invoke(m, o, args, line);
      return objectMethod(o, name, args, line);
    }

    function objectMethod(o, name, args, line) {
      if (o.cls.isEnum) {
        switch (name) {
          case 'name': case 'toString': return str(o.enumName);
          case 'ordinal': return o.ordinal;
          case 'compareTo': return o.ordinal - args[0].ordinal;
        }
      }
      if (o.cls.isRecord) {
        var fields = o.cls.recParams.map(function (rp) { return rp.name; });
        switch (name) {
          case 'toString':
            return str(o.cls.name + '[' + fields.map(function (fn) { return fn + '=' + toStr(o.f[fn].v); }).join(', ') + ']');
          case 'equals':
            return args[0] instanceof JObj && args[0].cls === o.cls && fields.every(function (fn) { return sameValue(o.f[fn].v, args[0].f[fn].v); });
          case 'hashCode':
            return fields.reduce(function (h, fn) { return (Math.imul(31, h) + hashOf(o.f[fn].v)) | 0; }, 0);
        }
      }
      switch (name) {
        case 'toString': return str(o.cls.name + '@' + o.id.toString(16));
        case 'equals': return o === args[0];
        case 'hashCode': return o.id;
        case 'getClass': return new ClassOf(o.cls.name);
      }
      missingMethod(name, args, line);
    }

    function throwJava(name, msg, line) {
      curLine = line || curLine;
      var o = instantiate(classes[name], msg == null ? [] : [str(msg)], line);
      throw new JThrow(o);
    }

    // ── Sentencias ─────────────────────────────────────────────────────
    var BRK = { brk: true };
    var CONT = { cont: true };

    function execBlock(b, f, parent) {
      var sc = newScope(parent);
      var body = b.body;
      for (var i = 0; i < body.length; i++) {
        var r = exec(body[i], f, sc);
        if (r) return r;
      }
      return undefined;
    }

    function truthy(n, f, sc) {
      var v = ev(n, f, sc);
      if (typeof v !== 'boolean') {
        compileErr(n.line, 'incompatible types: ' + typeName(v) + ' cannot be converted to boolean', 'Una condición tiene que dar true o false. ¿Usaste = (asignar) en lugar de == (comparar)?');
      }
      return v;
    }

    function declare(sc, name, slot, line) {
      if (sc[name] !== undefined) {
        compileErr(line, 'variable ' + name + ' is already defined', 'Ya declaraste ' + name + ' antes. Para cambiar su valor, escribí ' + name + ' = valor; sin el tipo.');
      }
      sc[name] = slot;
    }

    function exec(n, f, sc) {
      tick();
      curLine = n.line;
      var r, i;
      switch (n.k) {
        case 'block': return execBlock(n, f, sc);
        case 'empty': return undefined;
        case 'local':
          for (i = 0; i < n.decls.length; i++) {
            var d = n.decls[i];
            if (d.init) {
              var v = ev(d.init, f, sc, d.type);
              var ty = d.type === 'var' ? typeName(v) : d.type;
              declare(sc, d.name, { type: ty, v: coerce(v, ty, d.line), isFinal: d.isFinal, set: true }, d.line);
            } else {
              declare(sc, d.name, { type: d.type, v: undefined, isFinal: d.isFinal, set: false }, d.line);
            }
          }
          return undefined;
        case 'expr': ev(n.e, f, sc); return undefined;
        case 'if':
          if (truthy(n.c, f, sc)) return exec(n.a, f, newScope(sc));
          if (n.b) return exec(n.b, f, newScope(sc));
          return undefined;
        case 'while':
          while (truthy(n.c, f, sc)) {
            tick();
            r = exec(n.body, f, newScope(sc));
            if (r === BRK) break;
            if (r && r !== CONT) return r;
          }
          return undefined;
        case 'do':
          do {
            tick();
            r = exec(n.body, f, newScope(sc));
            if (r === BRK) break;
            if (r && r !== CONT) return r;
          } while (truthy(n.c, f, sc));
          return undefined;
        case 'for': {
          var fs = newScope(sc);
          for (i = 0; i < n.init.length; i++) exec(n.init[i], f, fs);
          while (!n.c || truthy(n.c, f, fs)) {
            tick();
            r = exec(n.body, f, newScope(fs));
            if (r === BRK) break;
            if (r && r !== CONT) return r;
            for (i = 0; i < n.upd.length; i++) ev(n.upd[i], f, fs);
          }
          return undefined;
        }
        case 'foreach': {
          var it = ev(n.it, f, sc);
          if (it === null) throwJava('NullPointerException', null, n.line);
          if (!(it instanceof JArr) && !(it instanceof JList)) compileErr(n.line, 'for-each not applicable to expression type', 'El for-each recorre arrays y colecciones.');
          var items = it.a;
          for (var ix = 0; ix < items.length; ix++) {
            tick();
            var ls = newScope(sc);
            declare(ls, n.name, { type: n.type, v: coerce(items[ix], n.type === 'var' ? 'Object' : n.type, n.line), set: true }, n.line);
            r = exec(n.body, f, ls);
            if (r === BRK) break;
            if (r && r !== CONT) return r;
          }
          return undefined;
        }
        case 'switchs': {
          r = runSwitch(n.sw, f, sc, false);
          if (r === BRK) return undefined;
          return r;
        }
        case 'return':
          return { ret: true, v: n.v ? ev(n.v, f, sc) : undefined, line: n.line };
        case 'break': return BRK;
        case 'continue': return CONT;
        case 'yield': return { yld: true, v: ev(n.v, f, sc) };
        case 'arrowval': return { yld: true, v: ev(n.e, f, sc) };
        case 'throw': {
          var ex = ev(n.v, f, sc);
          if (ex === null) throwJava('NullPointerException', null, n.line);
          if (!instanceOf(ex, 'Throwable')) compileErr(n.line, 'incompatible types: ' + typeName(ex) + ' cannot be converted to Throwable', 'Con throw solo se lanzan excepciones, por ejemplo throw new Exception("mensaje");');
          throw new JThrow(ex);
        }
        case 'try': return execTry(n, f, sc);
      }
      throw new Unsupported('sentencia ' + n.k);
    }

    function caseMatches(sv, lab, f, sc) {
      if (sv instanceof JObj && sv.cls.isEnum && lab.k === 'name') return sv.enumName === lab.name;
      var lv = ev(lab, f, sc);
      if (sv instanceof JStr) return lv instanceof JStr && lv.s === sv.s;
      return asNumber(sv) === asNumber(lv);
    }

    function runSwitch(n, f, sc, isExpr) {
      var sv = ev(n.e, f, sc);
      if (sv === null) throwJava('NullPointerException', null, n.line);
      if (typeof sv === 'boolean' || sv instanceof JDouble || sv instanceof JFloat || sv instanceof JLong) {
        compileErr(n.line, 'incompatible types: ' + typeName(sv) + ' cannot be converted to int', 'switch trabaja con int, char o String. No acepta double ni boolean.');
      }
      var start = -1;
      var i, j;
      for (i = 0; i < n.cases.length && start < 0; i++) {
        for (j = 0; j < n.cases[i].labels.length; j++) {
          if (caseMatches(sv, n.cases[i].labels[j], f, sc)) { start = i; break; }
        }
      }
      if (start < 0) {
        for (i = 0; i < n.cases.length; i++) if (n.cases[i].isDefault) { start = i; break; }
      }
      if (start < 0) return undefined;
      var sc2 = newScope(sc);
      for (i = start; i < n.cases.length; i++) {
        var c = n.cases[i];
        for (j = 0; j < c.body.length; j++) {
          var r = exec(c.body[j], f, sc2);
          if (r) {
            if (r.yld && !isExpr) return undefined;
            return r;
          }
        }
        if (c.arrow) return undefined;
      }
      return undefined;
    }

    function execTry(n, f, sc) {
      var result;
      var pending = null;
      var sc2 = newScope(sc);
      var opened = [];
      try {
        try {
          n.res.forEach(function (rs) {
            var v = ev(rs.init, f, sc2);
            sc2[rs.name] = { type: rs.type, v: v, set: true };
            opened.push(v);
          });
          result = execBlock(n.body, f, sc2);
        } finally {
          for (var i = opened.length - 1; i >= 0; i--) closeResource(opened[i], n.line);
        }
      } catch (e) {
        if (e instanceof RangeError) {
          try { throwJava('StackOverflowError', null, n.line); } catch (so) { e = so; }
        }
        if (!(e instanceof JThrow)) throw e;
        var handled = false;
        for (var c = 0; c < n.catches.length && !handled; c++) {
          var cc = n.catches[c];
          var hit = cc.types.some(function (ty) {
            if (!classes[ty]) compileErr(n.line, 'cannot find symbol: class ' + ty, 'La excepción ' + ty + ' no existe. Revisá el nombre.');
            return instanceOf(e.obj, ty);
          });
          if (hit) {
            handled = true;
            var cs = newScope(sc);
            cs[cc.name] = { type: cc.types[0], v: e.obj, set: true };
            try {
              result = execBlock(cc.body, f, cs);
            } catch (e2) {
              if (!(e2 instanceof JThrow)) throw e2;
              pending = e2;
            }
          }
        }
        if (!handled) pending = e;
      }
      if (n.fin) {
        var fr = execBlock(n.fin, f, sc);
        if (fr) return fr;
      }
      if (pending) throw pending;
      return result;
    }

    function closeResource(v, line) {
      if (v instanceof JObj) { callVirtual(v, 'close', [], line); return; }
      if (v instanceof Native) nativeCall(v, 'close', [], line);
    }

    // ── Expresiones ────────────────────────────────────────────────────
    // Una hija puede declarar un atributo con el nombre de uno de su padre: cada clase ve el suyo
    function ownField(o, name, f) {
      for (var k = f.cls; k; k = supOf(k)) {
        if (o.byClass[k.name] && o.byClass[k.name][name]) return o.byClass[k.name][name];
      }
      return o.f[name];
    }

    function lookup(name, f, sc) {
      var slot = sc[name];
      if (slot) return slot;
      if (f.self) {
        var fs = ownField(f.self, name, f);
        if (fs) {
          checkAccess(fs, name, f, curLine);
          return fs;
        }
      }
      var c = f.cls;
      while (c) {
        var chain = ancestors(c);
        for (var i = 0; i < chain.length; i++) {
          initClass(chain[i]);
          if (chain[i].st[name]) return chain[i].st[name];
        }
        if (!f.self) {
          for (var j = 0; j < chain.length; j++) {
            if (chain[j].fields.some(function (x) { return x.name === name && !x.isStatic; })) {
              compileErr(curLine, 'non-static variable ' + name + ' cannot be referenced from a static context', name + ' pertenece a cada objeto. Desde un método static hay que acceder con un objeto: objeto.' + name + '.');
            }
          }
        }
        c = c.outer ? classes[c.outer] : null;
      }
      return null;
    }

    function isClassName(name) { return !!(classes[name] || BUILTIN_STATIC[name]); }

    function readSlot(slot, name, line) {
      if (slot.v === undefined) {
        compileErr(line, 'variable ' + name + ' might not have been initialized', 'Declaraste ' + name + ' pero nunca le diste un valor. Asignale uno antes de usarla.');
      }
      return slot.v;
    }

    function noSymbol(name, line) {
      compileErr(line, 'cannot find symbol: ' + name, name + ' no está declarada. Revisá que exista, que el nombre sea idéntico (Java distingue mayúsculas) y que esté en este bloque.');
    }

    function binary(op, a, b, line) {
      if (op === '+' && (a instanceof JStr || b instanceof JStr)) return str(toStr(a) + toStr(b));
      if (op === '==' || op === '!=') {
        var eq;
        if (isNum(a) && isNum(b)) {
          if (a instanceof JLong && b instanceof JLong) eq = a.v === b.v;
          else eq = asNumber(a) === asNumber(b);
        } else {
          if (typeof a !== typeof b && (typeof a === 'boolean' || typeof b === 'boolean' || isNum(a) || isNum(b)) && a !== null && b !== null) {
            compileErr(line, 'incomparable types: ' + typeName(a) + ' and ' + typeName(b), 'No se puede comparar un ' + typeName(a) + ' con un ' + typeName(b) + '.');
          }
          if ((a === null && isNum(b)) || (b === null && isNum(a))) {
            compileErr(line, 'incomparable types: ' + typeName(a) + ' and ' + typeName(b), 'Un tipo primitivo no puede ser null.');
          }
          eq = a === b;
        }
        return op === '==' ? eq : !eq;
      }
      if (typeof a === 'boolean' && typeof b === 'boolean' && (op === '&' || op === '|' || op === '^')) {
        return op === '&' ? (a && b) : op === '|' ? (a || b) : (a !== b);
      }
      if (!isNum(a) || !isNum(b)) {
        compileErr(line, "bad operand types for binary operator '" + op + "'", 'El operador ' + op + ' no se puede usar entre ' + typeName(a) + ' y ' + typeName(b) + '.');
      }
      if (a instanceof JDouble || b instanceof JDouble || a instanceof JFloat || b instanceof JFloat) {
        var isF = !(a instanceof JDouble || b instanceof JDouble);
        var x = asNumber(a), y = asNumber(b);
        var d;
        switch (op) {
          case '+': d = x + y; break;
          case '-': d = x - y; break;
          case '*': d = x * y; break;
          case '/': d = x / y; break;
          case '%': d = x % y; break;
          case '<': return x < y;
          case '>': return x > y;
          case '<=': return x <= y;
          case '>=': return x >= y;
          default: compileErr(line, "bad operand types for binary operator '" + op + "'", 'Ese operador no se usa con decimales.');
        }
        return isF ? new JFloat(Math.fround(d)) : new JDouble(d);
      }
      if (a instanceof JLong || b instanceof JLong) {
        var p = toBig(a), q = toBig(b);
        var l;
        switch (op) {
          case '+': l = p + q; break;
          case '-': l = p - q; break;
          case '*': l = p * q; break;
          case '/':
            if (q === BigInt(0)) throwJava('ArithmeticException', '/ by zero', line);
            l = p / q; break;
          case '%':
            if (q === BigInt(0)) throwJava('ArithmeticException', '/ by zero', line);
            l = p % q; break;
          case '<': return p < q;
          case '>': return p > q;
          case '<=': return p <= q;
          case '>=': return p >= q;
          case '&': l = p & q; break;
          case '|': l = p | q; break;
          case '^': l = p ^ q; break;
          case '<<': l = p << (q & BigInt(63)); break;
          case '>>': l = p >> (q & BigInt(63)); break;
          default: throw new Unsupported('operador ' + op + ' con long');
        }
        return new JLong(BigInt.asIntN(64, l));
      }
      var ia = asNumber(a), ib = asNumber(b);
      switch (op) {
        case '+': return (ia + ib) | 0;
        case '-': return (ia - ib) | 0;
        case '*': return Math.imul(ia, ib);
        case '/':
          if (ib === 0) throwJava('ArithmeticException', '/ by zero', line);
          return (ia / ib) | 0;
        case '%':
          if (ib === 0) throwJava('ArithmeticException', '/ by zero', line);
          return (ia % ib) | 0;
        case '<': return ia < ib;
        case '>': return ia > ib;
        case '<=': return ia <= ib;
        case '>=': return ia >= ib;
        case '&': return ia & ib;
        case '|': return ia | ib;
        case '^': return ia ^ ib;
        case '<<': return ia << ib;
        case '>>': return ia >> ib;
        case '>>>': return (ia >>> ib) | 0;
      }
      throw new Unsupported('operador ' + op);
    }

    function castTo(v, type, line) {
      switch (type) {
        case 'int': case 'short': case 'byte': case 'char': case 'long': {
          if (typeof v === 'boolean' || v instanceof JStr || v === null) {
            compileErr(line, 'incompatible types: ' + typeName(v) + ' cannot be converted to ' + type, 'Con un cast no se convierte texto a número. Para eso está Integer.parseInt().');
          }
          var big;
          if (v instanceof JDouble || v instanceof JFloat) {
            var d = v.v;
            if (d !== d) big = BigInt(0);
            else if (d === Infinity || d >= 9223372036854775807) big = type === 'long' ? BigInt('9223372036854775807') : BigInt(2147483647);
            else if (d === -Infinity || d <= -9223372036854775808) big = type === 'long' ? BigInt('-9223372036854775808') : BigInt(-2147483648);
            else big = BigInt(Math.trunc(d));
            if (type !== 'long') {
              if (big > BigInt(2147483647)) big = BigInt(2147483647);
              if (big < BigInt(-2147483648)) big = BigInt(-2147483648);
            }
          } else big = toBig(v);
          if (type === 'long') return new JLong(BigInt.asIntN(64, big));
          var i32 = Number(BigInt.asIntN(32, big));
          if (type === 'int') return i32;
          if (type === 'short') return (i32 << 16) >> 16;
          if (type === 'byte') return (i32 << 24) >> 24;
          return new JChar(i32 & 0xffff);
        }
        case 'double': return isNum(v) ? new JDouble(asNumber(v)) : incompatible(v, 'double', line);
        case 'float': return isNum(v) ? new JFloat(Math.fround(asNumber(v))) : incompatible(v, 'float', line);
        case 'boolean': case 'String': return coerce(v, type, line);
      }
      if (BOXED[type]) return coerce(v, type, line);
      if (v !== null && (classes[type] || type === 'String') && !instanceOf(v, type)) {
        var msg = 'class ' + typeName(v) + ' cannot be cast to class ' + type;
        throwJava('ClassCastException', msg, line);
      }
      return v;
    }

    function narrowLike(v, type, line) {
      if (PRIMS[type] && isNum(v) && type !== 'boolean') return castTo(v, type, line);
      return v;
    }

    function ev(n, f, sc, hint) {
      switch (n.k) {
        case 'lit':
          switch (n.lt) {
            case 'String': return intern(n.v);
            case 'char': return new JChar(n.v);
            case 'double': return new JDouble(n.v);
            case 'float': return new JFloat(n.v);
            case 'long': return new JLong(n.v);
          }
          return n.v;
        case 'name': {
          var slot = lookup(n.name, f, sc);
          if (slot) return readSlot(slot, n.name, n.line);
          if (isClassName(n.name)) return new ClassRef(n.name);
          if (f.cls.outer) throw new Unsupported('clases internas');
          noSymbol(n.name, n.line);
        }
        // falls through
        case 'bin': {
          if (n.op === '&&') {
            var l = ev(n.a, f, sc);
            if (typeof l !== 'boolean') compileErr(n.line, "bad operand types for binary operator '&&'", '&& une condiciones que dan true o false.');
            if (!l) return false;
            var r = ev(n.b, f, sc);
            if (typeof r !== 'boolean') compileErr(n.line, "bad operand types for binary operator '&&'", '&& une condiciones que dan true o false.');
            return r;
          }
          if (n.op === '||') {
            var o1 = ev(n.a, f, sc);
            if (typeof o1 !== 'boolean') compileErr(n.line, "bad operand types for binary operator '||'", '|| une condiciones que dan true o false.');
            if (o1) return true;
            var o2 = ev(n.b, f, sc);
            if (typeof o2 !== 'boolean') compileErr(n.line, "bad operand types for binary operator '||'", '|| une condiciones que dan true o false.');
            return o2;
          }
          var a = ev(n.a, f, sc);
          var b = ev(n.b, f, sc);
          if (a instanceof ClassRef || b instanceof ClassRef) noSymbol((a instanceof ClassRef ? a : b).name, n.line);
          return binary(n.op, a, b, n.line);
        }
        case 'un': {
          var v = ev(n.e, f, sc);
          if (n.op === '!') {
            if (typeof v !== 'boolean') compileErr(n.line, "bad operand type " + typeName(v) + " for unary operator '!'", '! niega un boolean.');
            return !v;
          }
          if (!isNum(v)) compileErr(n.line, "bad operand type " + typeName(v) + " for unary operator '" + n.op + "'", 'Ese operador va con números.');
          if (n.op === '+') return v instanceof JChar ? v.v : v;
          if (n.op === '~') return v instanceof JLong ? new JLong(~v.v) : ~asNumber(v);
          if (v instanceof JDouble) return new JDouble(-v.v);
          if (v instanceof JFloat) return new JFloat(-v.v);
          if (v instanceof JLong) return new JLong(BigInt.asIntN(64, -v.v));
          return (-asNumber(v)) | 0;
        }
        case 'cond': {
          var cv = truthy(n.c, f, sc);
          var picked = ev(cv ? n.a : n.b, f, sc, hint);
          if (isNum(picked)) {
            // Promoción numérica entre las dos ramas, sin evaluar la otra
            if (n.a.k === 'lit' && n.a.lt === 'double' || n.b.k === 'lit' && n.b.lt === 'double') return new JDouble(asNumber(picked));
          }
          return picked;
        }
        case 'assign': return assign(n, f, sc);
        case 'incdec': {
          var ref = lvalue(n.e, f, sc, true);
          var old = ref.get();
          if (!isNum(old)) compileErr(n.line, "bad operand type " + typeName(old) + " for unary operator '" + n.op + "'", '++ y -- van con variables numéricas.');
          var upd = binary(n.op === '++' ? '+' : '-', old, 1, n.line);
          var nv = old instanceof JChar ? new JChar(upd & 0xffff) : old instanceof JDouble || old instanceof JFloat || old instanceof JLong ? upd : narrowLike(upd, ref.type || 'int', n.line);
          ref.set(nv);
          return n.prefix ? nv : old;
        }
        case 'cast': return castTo(ev(n.e, f, sc), n.type, n.line);
        case 'instanceof': {
          var iv = ev(n.e, f, sc);
          var res = instanceOf(iv, n.type);
          if (res && n.bind) sc[n.bind] = { type: n.type, v: iv, set: true };
          return res;
        }
        case 'this':
          if (!f.self) compileErr(n.line, 'non-static variable this cannot be referenced from a static context', 'this no existe en un método static: no hay ningún objeto.');
          return f.self;
        case 'new': return newObject(n, f, sc);
        case 'newarr': {
          var dims = n.dims.map(function (d) {
            var v2 = ev(d, f, sc);
            if (typeof v2 !== 'number') incompatible(v2, 'int', n.line);
            if (v2 < 0) throwJava('NegativeArraySizeException', String(v2), n.line);
            return v2;
          });
          var base = n.type;
          for (var e = 0; e < n.extra; e++) base += '[]';
          return makeArray(base, dims, 0);
        }
        case 'arrlit': {
          var vals = n.items.map(function (it) {
            return coerce(ev(it, f, sc, n.type), n.type, it.line);
          });
          return new JArr(n.type, vals);
        }
        case 'index': {
          var arr = ev(n.a, f, sc);
          var idx = ev(n.i, f, sc);
          return indexRef(arr, idx, n).get();
        }
        case 'field': return fieldGet(n, f, sc);
        case 'call': return callExpr(n, f, sc);
        case 'switche': {
          var sr = runSwitch(n, f, sc, true);
          if (sr && sr.yld) return sr.v;
          if (sr) throw new Unsupported('switch como expresión');
          return undefined;
        }
        case 'lambda': return makeLambda(n, f, sc);
        case 'mref': return methodRef(n, f, sc);
        case 'ctorcall':
          compileErr(n.line, 'call to super must be first statement in constructor', 'super(...) o this(...) tienen que ser la primera línea del constructor.');
      }
      throw new Unsupported('expresión ' + n.k);
    }

    function makeLambda(n, f, sc) {
      return new JFn(function (args) {
        var ls = newScope(sc);
        n.params.forEach(function (lp, i) {
          ls[lp.name] = { type: lp.type || 'var', v: lp.type ? coerce(args[i], lp.type, n.line) : args[i], set: true };
        });
        if (n.isExpr) return ev(n.body, f, ls);
        var r = execBlock(n.body, f, ls);
        return r && r.ret ? r.v : undefined;
      });
    }

    function callOn(recv, name, args, line) {
      if (recv === null) throwJava('NullPointerException', null, line);
      if (recv instanceof JObj) return callVirtual(recv, name, args, line);
      return nativeCall(recv, name, args, line);
    }

    function methodRef(n, f, sc) {
      var line = n.line;
      var isType = n.target.k === 'name' && !lookup(n.target.name, f, sc) && (isClassName(n.target.name) || KNOWN_NATIVE[n.target.name]);
      if (!isType) {
        var recv = ev(n.target, f, sc);
        return new JFn(function (args) { return callOn(recv, n.name, args, line); });
      }
      var cname = n.target.name;
      if (n.name === 'new') {
        return new JFn(function (args) {
          if (classes[cname]) return instantiate(classes[cname], args, line);
          return newObject({ name: cname, args: [], line: line }, f, sc);
        });
      }
      var user = classes[cname] && !BUILTIN_STATIC[cname] ? classes[cname] : null;
      return new JFn(function (args) {
        if (user) {
          var sm = user.methods.filter(function (m) { return m.name === n.name && m.isStatic; });
          if (sm.length) return invoke(sm[0], null, args, line);
          return callOn(args[0], n.name, args.slice(1), line);
        }
        var statics = { String: { valueOf: 1, format: 1, join: 1 } };
        var isStatic = cname !== 'String' || (statics.String[n.name] === 1);
        if (isStatic && BUILTIN_STATIC[cname] && !(BOXED[cname] && /^(intValue|doubleValue|toString|compareTo|equals)$/.test(n.name) && args.length < 2 && n.name !== 'toString')) {
          return staticCall(cname, n.name, args, line);
        }
        return callOn(args[0], n.name, args.slice(1), line);
      });
    }

    function makeArray(type, dims, level) {
      var a = [];
      var el = type;
      for (var k = level + 1; k < dims.length; k++) el += '[]';
      for (var i = 0; i < dims[level]; i++) {
        a.push(level + 1 < dims.length ? makeArray(type, dims, level + 1) : defaultValue(el));
      }
      return new JArr(el, a);
    }

    function indexRef(arr, idx, n) {
      if (arr === null) throwJava('NullPointerException', 'Cannot load from array because value is null', n.line);
      if (!(arr instanceof JArr)) compileErr(n.line, 'array required, but ' + typeName(arr) + ' found', 'Los corchetes [ ] son para arrays. En un ArrayList usá .get(i); en un String, .charAt(i).');
      if (idx instanceof JChar) idx = idx.v;
      if (typeof idx !== 'number') incompatible(idx, 'int', n.line);
      if (idx < 0 || idx >= arr.a.length) throwJava('ArrayIndexOutOfBoundsException', 'Index ' + idx + ' out of bounds for length ' + arr.a.length, n.line);
      return {
        type: arr.type,
        get: function () { return arr.a[idx]; },
        set: function (v) { arr.a[idx] = coerce(v, arr.type, n.line); }
      };
    }

    function checkAccess(slot, name, f, line) {
      if (slot.access !== 'private' || !slot.cls) return;
      var c = f.cls;
      var same = false;
      while (c) {
        if (c.name === slot.cls) same = true;
        c = c.outer ? classes[c.outer] : null;
      }
      var root = classes[slot.cls];
      while (!same && root && root.outer) {
        root = classes[root.outer];
        if (root.name === f.cls.name || f.cls.outer === root.name) same = true;
      }
      if (!same) compileErr(line, name + ' has private access in ' + slot.cls, name + ' es private: solo se puede usar dentro de ' + slot.cls + '. Desde afuera usá sus getters y setters.');
    }

    function fieldGet(n, f, sc) {
      var t = ev(n.target, f, sc);
      if (t instanceof ClassRef) return staticField(t.name, n.name, n.line, f);
      if (t === null) throwJava('NullPointerException', 'Cannot read field "' + n.name + '" because value is null', n.line);
      if (t instanceof JArr) {
        if (n.name === 'length') return t.a.length;
        compileErr(n.line, 'cannot find symbol: ' + n.name, 'Un array solo tiene el atributo length.');
      }
      if (t instanceof JObj) {
        var slot = t === f.self ? ownField(t, n.name, f) : t.f[n.name];
        if (slot) {
          checkAccess(slot, n.name, f, n.line);
          return slot.v;
        }
        var chain = ancestors(t.cls);
        for (var i = 0; i < chain.length; i++) {
          initClass(chain[i]);
          if (chain[i].st[n.name]) return chain[i].st[n.name].v;
        }
      }
      if (t instanceof JStr && n.name === 'length') {
        compileErr(n.line, 'cannot find symbol: length', 'En un String el largo es un método: se escribe .length() con paréntesis.');
      }
      if (t instanceof JList && n.name === 'length') {
        compileErr(n.line, 'cannot find symbol: length', 'En un ArrayList el tamaño se pide con .size().');
      }
      compileErr(n.line, 'cannot find symbol: ' + n.name, typeName(t) + ' no tiene un atributo llamado ' + n.name + '.');
    }

    function staticField(cname, name, line) {
      if (classes[cname] && !BUILTIN_STATIC[cname]) {
        var chain = ancestors(classes[cname]);
        for (var i = 0; i < chain.length; i++) {
          initClass(chain[i]);
          if (chain[i].st[name]) return chain[i].st[name].v;
        }
        if (classes[cname].fields.some(function (x) { return x.name === name; })) {
          compileErr(line, 'non-static variable ' + name + ' cannot be referenced from a static context', name + ' pertenece a cada objeto, no a la clase.');
        }
        if (classes[name] && classes[name].outer === cname) return new ClassRef(name);
        compileErr(line, 'cannot find symbol: ' + name, cname + ' no tiene ' + name + '.');
      }
      if (cname === 'System') {
        if (name === 'out') return OUT;
        if (name === 'err') return ERR;
        if (name === 'in') return IN;
      }
      if (cname === 'Math') {
        if (name === 'PI') return new JDouble(Math.PI);
        if (name === 'E') return new JDouble(Math.E);
      }
      if (cname === 'Integer') {
        if (name === 'MAX_VALUE') return 2147483647;
        if (name === 'MIN_VALUE') return -2147483648;
      }
      if (cname === 'Long') {
        if (name === 'MAX_VALUE') return new JLong(BigInt('9223372036854775807'));
        if (name === 'MIN_VALUE') return new JLong(BigInt('-9223372036854775808'));
      }
      if (cname === 'Double') {
        if (name === 'MAX_VALUE') return new JDouble(Number.MAX_VALUE);
        if (name === 'MIN_VALUE') return new JDouble(Number.MIN_VALUE);
        if (name === 'POSITIVE_INFINITY') return new JDouble(Infinity);
        if (name === 'NEGATIVE_INFINITY') return new JDouble(-Infinity);
        if (name === 'NaN') return new JDouble(NaN);
      }
      throw new Unsupported(cname + '.' + name);
    }

    function lvalue(n, f, sc, reading) {
      if (n.k === 'name') {
        var slot = lookup(n.name, f, sc);
        if (!slot && f.cls.outer) throw new Unsupported('clases internas');
        if (!slot) noSymbol(n.name, n.line);
        return {
          type: slot.type,
          get: function () { return readSlot(slot, n.name, n.line); },
          set: function (v) {
            if (slot.isFinal && (slot.set || !slot.cls)) {
              if (slot.set || slot.v !== undefined) compileErr(n.line, 'cannot assign a value to final variable ' + n.name, n.name + ' es final: una vez asignada no puede cambiar.');
            }
            slot.v = coerce(v, slot.type, n.line);
            slot.set = true;
          }
        };
      }
      if (n.k === 'index') {
        var arr = ev(n.a, f, sc);
        var idx = ev(n.i, f, sc);
        return indexRef(arr, idx, n);
      }
      if (n.k === 'field') {
        var t = ev(n.target, f, sc);
        if (t === null) throwJava('NullPointerException', 'Cannot assign field "' + n.name + '" because value is null', n.line);
        var fs = null;
        if (t instanceof ClassRef) {
          if (!classes[t.name]) throw new Unsupported('asignación a ' + t.name);
          initClass(classes[t.name]);
          ancestors(classes[t.name]).some(function (k) { fs = k.st[n.name]; return !!fs; });
        } else if (t instanceof JObj) {
          fs = t === f.self ? ownField(t, n.name, f) : t.f[n.name];
          if (!fs) ancestors(t.cls).some(function (k) { fs = k.st[n.name]; return !!fs; });
        }
        if (!fs) {
          if (t instanceof JArr && n.name === 'length') compileErr(n.line, 'cannot assign a value to final variable length', 'El tamaño de un array no se puede cambiar.');
          compileErr(n.line, 'cannot find symbol: ' + n.name, typeName(t) + ' no tiene un atributo llamado ' + n.name + '.');
        }
        checkAccess(fs, n.name, f, n.line);
        return {
          type: fs.type,
          get: function () { return fs.v; },
          set: function (v) {
            if (fs.isFinal && fs.set) compileErr(n.line, 'cannot assign a value to final variable ' + n.name, n.name + ' es final: no puede cambiar.');
            fs.v = coerce(v, fs.type, n.line);
            fs.set = true;
          }
        };
      }
      compileErr(n.line, 'unexpected type', 'A la izquierda del = tiene que ir una variable.');
    }

    function assign(n, f, sc) {
      var ref = lvalue(n.target, f, sc, n.op !== '=');
      if (n.op === '=') {
        var v = ev(n.v, f, sc, ref.type);
        ref.set(v);
        return ref.get();
      }
      var old = ref.get();
      var op = n.op.slice(0, -1);
      var rhs = ev(n.v, f, sc);
      var res = binary(op, old, rhs, n.line);
      if (res instanceof JStr) { ref.set(res); return res; }
      ref.set(narrowLike(res, ref.type, n.line));
      return ref.get();
    }

    function newObject(n, f, sc) {
      var args = n.args.map(function (a) { return ev(a, f, sc); });
      var cname = n.name;
      if (classes[cname]) return instantiate(classes[cname], args, n.line);
      switch (cname) {
        case 'String':
          if (!args.length) return str('');
          if (args[0] instanceof JArr) return str(args[0].a.map(toStr).join(''));
          return str(toStr(args[0]));
        case 'ArrayList': case 'LinkedList':
          if (args[0] instanceof JList) return new JList(args[0].a.slice(), cname);
          return new JList([], cname);
        case 'HashMap': case 'LinkedHashMap': case 'TreeMap': {
          var nm = new JMap(cname);
          if (args[0] instanceof JMap) args[0].e.forEach(function (en) { mapPut(nm, en.k, en.v); });
          return nm;
        }
        case 'StringBuilder': case 'StringBuffer':
          return new JSb(args[0] instanceof JStr ? args[0].s : '');
        case 'Object': return instantiate(classes.Object, [], n.line);
        case 'Scanner':
          if (!args.length) compileErr(n.line, 'no suitable constructor found for Scanner(no arguments)', 'Scanner necesita saber de dónde leer: new Scanner(System.in).');
          if (args[0] === IN) return new Native('Scanner');
          if (args[0] instanceof Native && args[0].kind === 'File') return new Native('FileReader', { text: readFile(args[0].st.path, n.line), pos: 0 });
          throw new Unsupported('Scanner sobre esa fuente');
        case 'File': return new Native('File', { path: toStr(args[0]) });
        case 'FileWriter': case 'BufferedWriter': case 'PrintWriter':
          return openWriter(cname, args, n.line);
        case 'FileReader': case 'BufferedReader':
          if (args[0] instanceof Native) return args[0].kind === 'File' ? new Native('FileReader', { text: readFile(args[0].st.path, n.line), pos: 0 }) : args[0];
          return new Native('FileReader', { text: readFile(toStr(args[0]), n.line), pos: 0 });
        case 'Integer': case 'Double': case 'Long': case 'Boolean': case 'Character':
          return args[0];
      }
      if (/^[a-z]/.test(cname) || !cname) noSymbol(cname, n.line);
      if (KNOWN_NATIVE[cname]) throw new Unsupported('new ' + cname);
      if (/^(HashSet|TreeSet|LinkedHashSet|Random|Date|LocalDate|LocalDateTime|Thread|Stack|Queue|PriorityQueue|ArrayDeque)$/.test(cname)) throw new Unsupported(cname);
      compileErr(n.line, 'cannot find symbol: class ' + cname, 'La clase ' + cname + ' no existe. Revisá el nombre, las mayúsculas y que hayas hecho el import.');
    }

    function openWriter(kind, args, line) {
      if (args[0] instanceof Native && args[0].kind === 'Writer') return args[0];
      var path = args[0] instanceof Native ? args[0].st.path : toStr(args[0]);
      var append = args[1] === true;
      if (!append || files[path] === undefined) files[path] = '';
      return new Native('Writer', { path: path });
    }

    function readFile(path, line) {
      if (files[path] === undefined) throwJava('FileNotFoundException', path + ' (No such file or directory)', line);
      return files[path];
    }

    // javac mira el tipo de la variable, no el objeto real: Animal a = new Perro(); a.buscar();
    function checkDeclared(n, f, sc) {
      if (n.target.k !== 'name') return;
      var slot = lookup(n.target.name, f, sc);
      var decl = slot && classes[slot.type];
      if (!decl || decl.builtin || decl.isEnum) return;
      if (n.name === 'toString' || n.name === 'equals' || n.name === 'hashCode' || n.name === 'getClass') return;
      var known = ancestors(decl).some(function (k) {
        return k.methods.some(function (m) { return m.name === n.name && m.params.length === n.args.length; });
      });
      if (!known) compileErr(n.line, 'cannot find symbol: method ' + n.name, 'La variable ' + n.target.name + ' es de tipo ' + slot.type + ', y ese tipo no tiene ' + n.name + '(). Declarala con el tipo que lo tiene o hacé un cast.');
    }

    function callExpr(n, f, sc) {
      var i;
      var args;
      if (n.target === null) {
        args = n.args.map(function (a) { return ev(a, f, sc); });
        if (f.self) {
          var own = findMethod(f.self.cls, n.name, args);
          if (own) return invoke(own, own.isStatic ? null : f.self, args, n.line);
        }
        var c = f.cls;
        while (c) {
          var m = findMethod(c, n.name, args);
          if (m) {
            if (m.isStatic) return invoke(m, null, args, n.line);
            if (!f.self) compileErr(n.line, 'non-static method ' + n.name + '() cannot be referenced from a static context', n.name + ' no es static, así que necesita un objeto. Declaralo static o llamalo desde un objeto.');
            var vm = findMethod(f.self.cls, n.name, args) || m;
            return invoke(vm, f.self, args, n.line);
          }
          c = c.outer ? classes[c.outer] : null;
        }
        if (f.self && (n.name === 'toString' || n.name === 'getClass' || n.name === 'hashCode' || n.name === 'equals')) return objectMethod(f.self, n.name, args, n.line);
        missingMethod(n.name, args, n.line);
      }
      if (n.target.k === 'super') {
        args = n.args.map(function (a) { return ev(a, f, sc); });
        var sup = supOf(f.cls);
        var sm = sup ? findMethod(sup, n.name, args) : null;
        if (!sm) f.cls.ifaces.some(function (ifn) { sm = classes[ifn] ? findMethod(classes[ifn], n.name, args) : null; return !!sm; });
        if (sm) return invoke(sm, f.self, args, n.line);
        return objectMethod(f.self, n.name, args, n.line);
      }
      var t = ev(n.target, f, sc);
      args = n.args.map(function (a) { return ev(a, f, sc); });
      checkDeclared(n, f, sc);
      if (t instanceof ClassRef) {
        if (classes[t.name] && !BUILTIN_STATIC[t.name]) {
          initClass(classes[t.name]);
          if (classes[t.name].isEnum && n.name === 'values') return new JArr(t.name, classes[t.name].enumValues.slice());
          if (classes[t.name].isEnum && n.name === 'valueOf') return enumValueOf(classes[t.name], args[0], n.line);
          var cm = findMethod(classes[t.name], n.name, args);
          if (!cm) missingMethod(n.name, args, n.line);
          if (!cm.isStatic) compileErr(n.line, 'non-static method ' + n.name + '() cannot be referenced from a static context', n.name + ' no es static: llamalo desde un objeto, no desde la clase.');
          initClass(classes[t.name]);
          return invoke(cm, null, args, n.line);
        }
        return staticCall(t.name, n.name, args, n.line);
      }
      if (t === null) throwJava('NullPointerException', 'Cannot invoke "' + n.name + '()" because value is null', n.line);
      if (t instanceof JFn) return lambdaCall(t, n, args, f, sc);
      if (t instanceof JObj) {
        var pm = findMethod(t.cls, n.name, args);
        if (pm) {
          if (pm.access === 'private') checkAccess({ access: 'private', cls: pm.cls }, n.name + '()', f, n.line);
          return invoke(pm, t, args, n.line);
        }
        return objectMethod(t, n.name, args, n.line);
      }
      if (t instanceof JList && n.name === 'remove' && boxedArg(n.args[0])) {
        for (i = 0; i < t.a.length; i++) {
          if (sameValue(args[0], t.a[i])) { t.a.splice(i, 1); return true; }
        }
        return false;
      }
      return nativeCall(t, n.name, args, n.line);
    }

    function lambdaCall(fn, n, args, f, sc) {
      if (n.name === 'reversed') return new JFn(function (a) { return fn.call([a[1], a[0]]); });
      if (n.name === 'negate') return new JFn(function (a) { return !fn.call(a); });
      // Una interfaz propia fija los tipos: op.aplicar(7, 2) con double trabaja en double
      var slot = n.target.k === 'name' ? lookup(n.target.name, f, sc) : null;
      var iface = slot && classes[slot.type];
      var sig = null;
      if (iface) {
        ancestors(iface).some(function (k) {
          sig = k.methods.filter(function (m) { return m.name === n.name && m.isAbstract; })[0] || null;
          return !!sig;
        });
        if (!sig) {
          var dm = findMethod(iface, n.name, args);
          if (dm) throw new Unsupported('métodos default en una lambda');
          missingMethod(n.name, args, n.line);
        }
      }
      var vals = sig ? args.map(function (a, i) { return coerce(a, sig.params[i].type, n.line); }) : args;
      var res = fn.call(vals);
      return sig && sig.ret !== 'void' ? coerce(res, sig.ret, n.line) : res;
    }

    // remove(Integer.valueOf(x)) borra por valor; remove(i) borra por posición
    function boxedArg(n) {
      return !!n && ((n.k === 'cast' && BOXED[n.type]) || (n.k === 'call' && n.name === 'valueOf' && n.target && n.target.k === 'name' && !!BOXED[n.target.name]));
    }

    // ── Biblioteca ─────────────────────────────────────────────────────
    var OUT = new Native('PrintStream', { err: false });
    var ERR = new Native('PrintStream', { err: true });
    var IN = new Native('InputStream');

    function sameValue(a, b) {
      if (a === b) return true;
      if (a === null || b === null) return false;
      if (a instanceof JObj) return callVirtual(a, 'equals', [b], curLine) === true;
      if (a instanceof JStr) return b instanceof JStr && a.s === b.s;
      if (isNum(a) && isNum(b)) return typeName(a) === typeName(b) && asNumber(a) === asNumber(b);
      return false;
    }

    function javaFormat(fmt, args, line) {
      var ai = 0;
      return fmt.replace(/%(-)?(0)?(\+)?(,)?(\d+)?(?:\.(\d+))?([a-zA-Z%])/g, function (all, left, zero, plus, comma, width, prec, conv) {
        if (conv === 'n') return '\n';
        if (conv === '%') return '%';
        if (ai >= args.length) throwJava('IllegalArgumentException', "Format specifier '" + all + "'", line);
        var v = args[ai++];
        var s = '';
        switch (conv) {
          case 'd':
            if (!isNum(v) || v instanceof JDouble || v instanceof JFloat) throwJava('IllegalArgumentException', 'd != ' + (v instanceof JDouble ? 'java.lang.Double' : 'java.lang.String'), line);
            s = toStr(v instanceof JChar ? v.v : v);
            break;
          case 'f':
            if (!(v instanceof JDouble || v instanceof JFloat)) throwJava('IllegalArgumentException', 'f != java.lang.Integer', line);
            s = roundDecimal(v.v, prec === undefined ? 6 : Number(prec));
            break;
          case 'e': case 'E':
            s = asNumber(v).toExponential(prec === undefined ? 6 : Number(prec)).replace(/e([+-])(\d)$/, 'e$10$2');
            if (conv === 'E') s = s.toUpperCase();
            break;
          case 's': case 'S':
            s = toStr(v);
            if (prec !== undefined) s = s.slice(0, Number(prec));
            if (conv === 'S') s = s.toUpperCase();
            break;
          case 'c': s = v instanceof JChar ? toStr(v) : String.fromCharCode(asNumber(v)); break;
          case 'b': s = v === null ? 'false' : (typeof v === 'boolean' ? String(v) : 'true'); break;
          case 'x': s = (asNumber(v) >>> 0).toString(16); break;
          case 'X': s = (asNumber(v) >>> 0).toString(16).toUpperCase(); break;
          default: throw new Unsupported('printf %' + conv);
        }
        if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/, ',').replace(/(\.\d*),/, '$1');
        if (comma) {
          var pts = s.split('.');
          pts[0] = pts[0].replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          s = pts.join('.');
        }
        if (plus && s.charAt(0) !== '-') s = '+' + s;
        var w = width ? Number(width) : 0;
        if (s.length < w) {
          var pad = new Array(w - s.length + 1).join(zero ? '0' : ' ');
          if (left) s += pad;
          else if (zero && (s.charAt(0) === '-' || s.charAt(0) === '+')) s = s.charAt(0) + pad + s.slice(1);
          else s = pad + s;
        }
        return s;
      });
    }

    function needStr(v, line) {
      if (!(v instanceof JStr)) compileErr(line, 'incompatible types: ' + typeName(v) + ' cannot be converted to String', 'Este método espera un texto.');
      return v.s;
    }

    function needInt(v, line) {
      if (v instanceof JChar) return v.v;
      if (typeof v !== 'number') compileErr(line, 'incompatible types: ' + typeName(v) + ' cannot be converted to int', 'Este método espera un número entero.');
      return v;
    }

    function parseIntJava(s, line) {
      if (s === null) throwJava('NumberFormatException', 'Cannot parse null string: null', line);
      var txt = s.s;
      if (!/^[+-]?\d+$/.test(txt)) {
        throwJava('NumberFormatException', txt === '' ? 'For input string: ""' : 'For input string: "' + txt + '"', line);
      }
      var n = Number(txt);
      if (n > 2147483647 || n < -2147483648) throwJava('NumberFormatException', 'For input string: "' + txt + '"', line);
      return n;
    }

    function parseDoubleJava(s, line) {
      if (s === null) throwJava('NullPointerException', null, line);
      var txt = s.s.trim();
      if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[dDfF]?$/.test(txt)) {
        throwJava('NumberFormatException', txt === '' ? 'empty String' : 'For input string: "' + s.s + '"', line);
      }
      return Number(txt.replace(/[dDfF]$/, ''));
    }

    function staticCall(cname, name, a, line) {
      switch (cname) {
        case 'Math': return mathCall(name, a, line);
        case 'Integer':
          switch (name) {
            case 'parseInt': return parseIntJava(a[0], line);
            case 'valueOf': return a[0] instanceof JStr ? parseIntJava(a[0], line) : coerce(a[0], 'int', line);
            case 'toString': return str(toStr(a[0]));
            case 'compare': return asNumber(a[0]) < asNumber(a[1]) ? -1 : asNumber(a[0]) === asNumber(a[1]) ? 0 : 1;
            case 'toBinaryString': return str((a[0] >>> 0).toString(2));
            case 'toHexString': return str((a[0] >>> 0).toString(16));
            case 'max': return Math.max(a[0], a[1]);
            case 'min': return Math.min(a[0], a[1]);
            case 'sum': return (a[0] + a[1]) | 0;
          }
          break;
        case 'Double':
          switch (name) {
            case 'parseDouble': return new JDouble(parseDoubleJava(a[0], line));
            case 'valueOf': return a[0] instanceof JStr ? new JDouble(parseDoubleJava(a[0], line)) : coerce(a[0], 'double', line);
            case 'toString': return str(toStr(coerce(a[0], 'double', line)));
            case 'compare': return asNumber(a[0]) < asNumber(a[1]) ? -1 : asNumber(a[0]) === asNumber(a[1]) ? 0 : 1;
            case 'isNaN': return asNumber(a[0]) !== asNumber(a[0]);
          }
          break;
        case 'Long':
          if (name === 'parseLong' || name === 'valueOf') {
            if (!(a[0] instanceof JStr)) return coerce(a[0], 'long', line);
            if (!/^[+-]?\d+$/.test(a[0].s)) throwJava('NumberFormatException', 'For input string: "' + a[0].s + '"', line);
            return new JLong(BigInt(a[0].s));
          }
          if (name === 'toString') return str(toStr(a[0]));
          break;
        case 'Boolean':
          if (name === 'parseBoolean') return a[0] !== null && a[0].s.toLowerCase() === 'true';
          if (name === 'valueOf') return typeof a[0] === 'boolean' ? a[0] : (a[0] !== null && a[0].s.toLowerCase() === 'true');
          break;
        case 'Character': {
          var code = a[0] instanceof JChar ? a[0].v : a[0];
          var ch = String.fromCharCode(code);
          switch (name) {
            case 'isDigit': return /[0-9]/.test(ch);
            case 'isLetter': return /\p{L}/u.test(ch);
            case 'isLetterOrDigit': return /[\p{L}0-9]/u.test(ch);
            case 'isUpperCase': return /\p{Lu}/u.test(ch);
            case 'isLowerCase': return /\p{Ll}/u.test(ch);
            case 'isWhitespace': return /\s/.test(ch);
            case 'toUpperCase': return new JChar(ch.toUpperCase().charCodeAt(0));
            case 'toLowerCase': return new JChar(ch.toLowerCase().charCodeAt(0));
            case 'getNumericValue': return /[0-9]/.test(ch) ? code - 48 : -1;
            case 'toString': return str(ch);
            case 'valueOf': return a[0];
          }
          break;
        }
        case 'String':
          switch (name) {
            case 'valueOf': return str(a[0] instanceof JArr ? a[0].a.map(toStr).join('') : toStr(a[0]));
            case 'format': return str(javaFormat(needStr(a[0], line), a.slice(1), line));
            case 'join': {
              var parts = a[1] instanceof JList || a[1] instanceof JArr ? a[1].a : a.slice(1);
              return str(parts.map(toStr).join(toStr(a[0])));
            }
          }
          break;
        case 'System':
          if (name === 'currentTimeMillis') return new JLong(BigInt(Date.now()));
          if (name === 'nanoTime') return new JLong(BigInt(Date.now()) * BigInt(1000000));
          if (name === 'exit') throw new ExitProgram(a[0]);
          if (name === 'lineSeparator') return str('\n');
          break;
        case 'Arrays': return arraysCall(name, a, line);
        case 'Collections': {
          var l = a[0];
          if (name === 'sort') { l.a.sort(a[1] ? fnCompare(a[1]) : compareValues); return undefined; }
          if (name === 'reverse') { l.a.reverse(); return undefined; }
          if (name === 'max' || name === 'min') {
            if (!l.a.length) throwJava('NoSuchElementException', null, line);
            return l.a.slice().sort(compareValues)[name === 'max' ? l.a.length - 1 : 0];
          }
          break;
        }
        case 'List':
          if (name === 'of') return new JList(a.slice(), 'ImmutableCollections.ListN');
          break;
        case 'Optional':
          if (name === 'of') {
            if (a[0] === null) throwJava('NullPointerException', null, line);
            return new JOpt(a[0]);
          }
          if (name === 'ofNullable') return new JOpt(a[0]);
          if (name === 'empty') return new JOpt(null);
          break;
        case 'Stream':
          if (name === 'of') return new JPipe(a.length === 1 && a[0] instanceof JArr ? a[0].a.slice() : a.slice());
          break;
        case 'IntStream':
          if (name === 'range' || name === 'rangeClosed') {
            var seq = [];
            for (var r = a[0]; name === 'range' ? r < a[1] : r <= a[1]; r++) seq.push(r);
            return new JPipe(seq, 'int');
          }
          break;
        case 'Collectors':
          if (name === 'toList') return new Collector('list');
          if (name === 'joining') return new Collector('joining', a.length ? toStr(a[0]) : '');
          break;
        case 'Comparator':
          if (name === 'comparing' || name === 'comparingInt' || name === 'comparingDouble') {
            return new JFn(function (x) { return compareValues(a[0].call([x[0]]), a[0].call([x[1]])); });
          }
          if (name === 'naturalOrder') return new JFn(function (x) { return compareValues(x[0], x[1]); });
          if (name === 'reverseOrder') return new JFn(function (x) { return compareValues(x[1], x[0]); });
          break;
        case 'Map':
          if (name === 'of') {
            var im = new JMap('LinkedHashMap');
            for (var mi = 0; mi + 1 < a.length; mi += 2) mapPut(im, a[mi], a[mi + 1]);
            return im;
          }
          break;
        case 'Objects':
          if (name === 'equals') return sameValue(a[0], a[1]);
          if (name === 'isNull') return a[0] === null;
          if (name === 'nonNull') return a[0] !== null;
          break;
        case 'Thread':
          if (name === 'sleep') return undefined;
          break;
      }
      if (cname === 'Math' || cname === 'Integer' || cname === 'String') missingMethod(cname + '.' + name, a, line);
      throw new Unsupported(cname + '.' + name);
    }

    function compareValues(x, y) {
      if (x instanceof JStr) return x.s < y.s ? -1 : x.s > y.s ? 1 : 0;
      if (x instanceof JObj) {
        var r = callVirtual(x, 'compareTo', [y], curLine);
        return r;
      }
      return asNumber(x) - asNumber(y);
    }

    function arraysCall(name, a, line) {
      var arr = a[0];
      if (name === 'asList') {
        if (a.length === 1 && arr instanceof JArr) return new JList(arr.a.slice(), 'Arrays.ArrayList');
        return new JList(a.slice(), 'Arrays.ArrayList');
      }
      if (arr === null) throwJava('NullPointerException', null, line);
      if (!(arr instanceof JArr)) compileErr(line, 'no suitable method found for ' + name, 'Arrays.' + name + ' espera un array.');
      switch (name) {
        case 'toString': return str('[' + arr.a.map(toStr).join(', ') + ']');
        case 'deepToString':
          return str((function deep(x) { return '[' + x.a.map(function (e) { return e instanceof JArr ? deep(e) : toStr(e); }).join(', ') + ']'; })(arr));
        case 'sort':
          arr.a.sort(a[1] ? fnCompare(a[1]) : compareValues);
          return undefined;
        case 'stream':
          return new JPipe(arr.a.slice(), arr.type === 'int' ? 'int' : arr.type === 'double' ? 'double' : 'obj');
        case 'fill': {
          var v = coerce(a[1], arr.type, line);
          for (var i = 0; i < arr.a.length; i++) arr.a[i] = v;
          return undefined;
        }
        case 'copyOf': {
          var out2 = arr.a.slice(0, a[1]);
          while (out2.length < a[1]) out2.push(defaultValue(arr.type));
          return new JArr(arr.type, out2);
        }
        case 'equals':
          return arr.a.length === a[1].a.length && arr.a.every(function (x, k) { return sameValue(x, a[1].a[k]); });
      }
      throw new Unsupported('Arrays.' + name);
    }

    function mathCall(name, a, line) {
      var x = a.length ? asNumber(a[0]) : 0;
      var y = a.length > 1 ? asNumber(a[1]) : 0;
      function dbl(v) { return new JDouble(v); }
      function promoted() {
        if (a[0] instanceof JDouble || a[1] instanceof JDouble) return 'double';
        if (a[0] instanceof JFloat || a[1] instanceof JFloat) return 'float';
        if (a[0] instanceof JLong || a[1] instanceof JLong) return 'long';
        return 'int';
      }
      a.forEach(function (v) {
        if (!isNum(v)) compileErr(line, 'incompatible types: ' + typeName(v) + ' cannot be converted to double', 'Math trabaja con números.');
      });
      switch (name) {
        case 'sqrt': return dbl(Math.sqrt(x));
        case 'cbrt': return dbl(Math.cbrt(x));
        case 'pow': return dbl(Math.pow(x, y));
        case 'abs':
          if (a[0] instanceof JDouble) return dbl(Math.abs(x));
          if (a[0] instanceof JFloat) return new JFloat(Math.abs(x));
          if (a[0] instanceof JLong) return new JLong(a[0].v < BigInt(0) ? -a[0].v : a[0].v);
          return Math.abs(x) | 0;
        case 'max': case 'min': {
          var ty = promoted();
          if (ty === 'long') {
            var p = toBig(a[0]), q = toBig(a[1]);
            return new JLong((name === 'max') === (p > q) ? p : q);
          }
          var r = name === 'max' ? Math.max(x, y) : Math.min(x, y);
          return ty === 'double' ? dbl(r) : ty === 'float' ? new JFloat(r) : r;
        }
        case 'round':
          if (a[0] instanceof JFloat) return Math.floor(x + 0.5) | 0;
          return new JLong(BigInt(Math.floor(x + 0.5)));
        case 'floor': return dbl(Math.floor(x));
        case 'ceil': return dbl(Math.ceil(x));
        case 'rint': return dbl(Math.round(x));
        case 'random': return dbl(Math.random());
        case 'hypot': return dbl(Math.hypot(x, y));
        case 'log': return dbl(Math.log(x));
        case 'log10': return dbl(Math.log10(x));
        case 'exp': return dbl(Math.exp(x));
        case 'sin': return dbl(Math.sin(x));
        case 'cos': return dbl(Math.cos(x));
        case 'tan': return dbl(Math.tan(x));
        case 'floorMod': return ((x % y) + y) % y;
        case 'floorDiv': return Math.floor(x / y);
      }
      missingMethod('Math.' + name, a, line);
    }

    function nativeCall(t, name, a, line) {
      if (t instanceof JStr) return stringCall(t, name, a, line);
      if (t instanceof JList) return listCall(t, name, a, line);
      if (t instanceof JSb) return sbCall(t, name, a, line);
      if (t instanceof JMap) return mapCall(t, name, a, line);
      if (t instanceof JOpt) return optCall(t, name, a, line);
      if (t instanceof JPipe) return pipeCall(t, name, a, line);
      if (t instanceof JFn) return t.call(a);
      if (t instanceof JEntry) {
        if (name === 'getKey') return t.k;
        if (name === 'getValue') return t.v;
        if (name === 'toString') return str(toStr(t));
        missingMethod(name, a, line);
      }
      if (t instanceof JArr) {
        if (name === 'clone') return new JArr(t.type, t.a.slice());
        if (name === 'length') compileErr(line, 'cannot find symbol: method length()', 'En un array el tamaño es un atributo: se escribe .length sin paréntesis.');
        if (name === 'getClass') return new ClassOf(t.type + '[]');
        missingMethod(name, a, line);
      }
      if (t instanceof ClassOf) {
        if (name === 'getSimpleName') return str(t.name);
        if (name === 'getName') return str(PACKAGES[t.name] && classes[t.name] && classes[t.name].builtin ? PACKAGES[t.name] + '.' + t.name : t.name);
        missingMethod(name, a, line);
      }
      if (t instanceof Native) return streamCall(t, name, a, line);
      // Primitivos en cajas (Integer, Double, Character...)
      switch (name) {
        case 'equals': return sameValue(t, a[0]);
        case 'getClass': return new ClassOf({ 'int': 'Integer', 'double': 'Double', 'float': 'Float', 'long': 'Long', 'char': 'Character', 'boolean': 'Boolean' }[typeName(t)]);
        case 'toString': return str(toStr(t));
        case 'hashCode': return asNumber(t) | 0;
        case 'intValue': return castTo(t, 'int', line);
        case 'doubleValue': return castTo(t, 'double', line);
        case 'longValue': return castTo(t, 'long', line);
        case 'charValue': case 'booleanValue': return t;
        case 'compareTo': return asNumber(t) < asNumber(a[0]) ? -1 : asNumber(t) === asNumber(a[0]) ? 0 : 1;
      }
      if (typeof t === 'number' || typeof t === 'boolean' || t instanceof JDouble || t instanceof JChar || t instanceof JLong) {
        compileErr(line, typeName(t) + ' cannot be dereferenced', 'Un ' + typeName(t) + ' es un tipo primitivo: no tiene métodos.');
      }
      throw new Unsupported('método ' + name);
    }

    function strIndex(s, i, line) {
      if (i < 0 || i >= s.length) throwJava('StringIndexOutOfBoundsException', 'index ' + i + ', length ' + s.length, line);
    }

    function toRegex(src) {
      try { return new RegExp(src, 'g'); } catch (e) { throw new Unsupported('expresión regular'); }
    }

    function stringCall(t, name, a, line) {
      var s = t.s;
      var other;
      switch (name) {
        case 'length': return s.length;
        case 'charAt': {
          var ci = needInt(a[0], line);
          if (ci < 0 || ci >= s.length) throwJava('StringIndexOutOfBoundsException', 'Index ' + ci + ' out of bounds for length ' + s.length, line);
          return new JChar(s.charCodeAt(ci));
        }
        case 'substring': {
          var b = needInt(a[0], line);
          var e = a.length > 1 ? needInt(a[1], line) : s.length;
          if (b < 0 || e > s.length || b > e) throwJava('StringIndexOutOfBoundsException', 'begin ' + b + ', end ' + e + ', length ' + s.length, line);
          return str(s.substring(b, e));
        }
        case 'indexOf': {
          var from = a.length > 1 ? a[1] : 0;
          return s.indexOf(toStr(a[0]), from);
        }
        case 'lastIndexOf': return s.lastIndexOf(toStr(a[0]));
        case 'contains': return s.indexOf(toStr(a[0])) !== -1;
        case 'startsWith': return s.indexOf(needStr(a[0], line)) === 0;
        case 'endsWith': {
          other = needStr(a[0], line);
          return s.length >= other.length && s.slice(s.length - other.length) === other;
        }
        case 'equals': return a[0] instanceof JStr && a[0].s === s;
        case 'equalsIgnoreCase': return a[0] instanceof JStr && a[0].s.toLowerCase() === s.toLowerCase();
        case 'compareTo': case 'compareToIgnoreCase': {
          var x = name === 'compareTo' ? s : s.toLowerCase();
          var y = name === 'compareTo' ? needStr(a[0], line) : needStr(a[0], line).toLowerCase();
          var lim = Math.min(x.length, y.length);
          for (var i = 0; i < lim; i++) {
            if (x.charCodeAt(i) !== y.charCodeAt(i)) return x.charCodeAt(i) - y.charCodeAt(i);
          }
          return x.length - y.length;
        }
        case 'isEmpty': return s.length === 0;
        case 'isBlank': return s.trim().length === 0;
        case 'toUpperCase': return str(s.toUpperCase());
        case 'toLowerCase': return str(s.toLowerCase());
        case 'trim': case 'strip': return str(s.trim());
        case 'replace': return str(s.split(toStr(a[0])).join(toStr(a[1])));
        case 'replaceAll': return str(s.replace(toRegex(needStr(a[0], line)), needStr(a[1], line)));
        case 'replaceFirst': return str(s.replace(new RegExp(needStr(a[0], line)), needStr(a[1], line)));
        case 'matches': return new RegExp('^(?:' + needStr(a[0], line) + ')$').test(s);
        case 'split': {
          var pieces = s.split(new RegExp(needStr(a[0], line)));
          while (pieces.length > 1 && pieces[pieces.length - 1] === '') pieces.pop();
          return new JArr('String', pieces.map(function (x2) { return str(x2); }));
        }
        case 'concat': return str(s + needStr(a[0], line));
        case 'repeat': return str(new Array(needInt(a[0], line) + 1).join(s));
        case 'toCharArray': return new JArr('char', s.split('').map(function (c) { return new JChar(c.charCodeAt(0)); }));
        case 'toString': case 'intern': return name === 'intern' ? intern(s) : t;
        case 'hashCode': {
          var h = 0;
          for (var j = 0; j < s.length; j++) h = (Math.imul(31, h) + s.charCodeAt(j)) | 0;
          return h;
        }
        case 'getClass': return new ClassOf('String');
      }
      if (name === 'size') compileErr(line, 'cannot find symbol: method size()', 'Un String no tiene size(). Su largo se pide con .length().');
      missingMethod(name, a, line);
    }

    function listIndex(l, i, line) {
      if (i < 0 || i >= l.a.length) throwJava('IndexOutOfBoundsException', 'Index ' + i + ' out of bounds for length ' + l.a.length, line);
    }

    function listCall(l, name, a, line) {
      var i;
      if (l.kind === 'ImmutableCollections.ListN' && /^(add|remove|set|clear|addAll|sort)$/.test(name)) throwJava('UnsupportedOperationException', null, line);
      switch (name) {
        case 'stream': return new JPipe(l.a.slice());
        case 'forEach': l.a.slice().forEach(function (x) { a[0].call([x]); }); return undefined;
        case 'removeIf': {
          var before = l.a.length;
          l.a = l.a.filter(function (x) { return !a[0].call([x]); });
          return l.a.length !== before;
        }
        case 'sort': l.a.sort(a[0] ? fnCompare(a[0]) : compareValues); return undefined;
        case 'add':
          if (a.length === 2) {
            i = needInt(a[0], line);
            if (i < 0 || i > l.a.length) throwJava('IndexOutOfBoundsException', 'Index: ' + i + ', Size: ' + l.a.length, line);
            l.a.splice(i, 0, a[1]);
            return undefined;
          }
          l.a.push(a[0]);
          return true;
        case 'get': i = needInt(a[0], line); listIndex(l, i, line); return l.a[i];
        case 'set': {
          i = needInt(a[0], line);
          listIndex(l, i, line);
          var old = l.a[i];
          l.a[i] = a[1];
          return old;
        }
        case 'size': return l.a.length;
        case 'isEmpty': return l.a.length === 0;
        case 'clear': l.a.length = 0; return undefined;
        case 'contains': return l.a.some(function (x) { return sameValue(a[0], x); });
        case 'indexOf':
          for (i = 0; i < l.a.length; i++) if (sameValue(a[0], l.a[i])) return i;
          return -1;
        case 'remove':
          if (typeof a[0] === 'number') {
            listIndex(l, a[0], line);
            return l.a.splice(a[0], 1)[0];
          }
          for (i = 0; i < l.a.length; i++) {
            if (sameValue(a[0], l.a[i])) { l.a.splice(i, 1); return true; }
          }
          return false;
        case 'addAll': l.a.push.apply(l.a, a[0].a); return true;
        case 'toString': return str(toStr(l));
        case 'equals':
          return a[0] instanceof JList && a[0].a.length === l.a.length && l.a.every(function (x, k) { return sameValue(x, a[0].a[k]); });
        case 'getClass': return new ClassOf(l.kind);
        case 'addFirst': l.a.unshift(a[0]); return undefined;
        case 'addLast': l.a.push(a[0]); return undefined;
        case 'getFirst': return l.a[0];
        case 'getLast': return l.a[l.a.length - 1];
      }
      if (name === 'length') compileErr(line, 'cannot find symbol: method length()', 'En un ArrayList el tamaño se pide con .size().');
      if (name === 'iterator') throw new Unsupported('ArrayList.iterator');
      missingMethod(name, a, line);
    }

    function hashOf(v) {
      if (v === null) return 0;
      if (typeof v === 'number') return v;
      if (typeof v === 'boolean') return v ? 1231 : 1237;
      if (v instanceof JChar) return v.v;
      if (v instanceof JLong) return Number(BigInt.asIntN(32, v.v ^ (v.v >> BigInt(32))));
      if (v instanceof JStr) return stringCall(v, 'hashCode', [], curLine);
      if (v instanceof JObj) return callVirtual(v, 'hashCode', [], curLine);
      return 0;
    }

    function mapFind(m, key) {
      for (var i = 0; i < m.e.length; i++) {
        if (sameValue(key, m.e[i].k)) return i;
      }
      return -1;
    }

    function mapPut(m, k, v) {
      var at = mapFind(m, k);
      if (at !== -1) {
        var old = m.e[at].v;
        m.e[at].v = v;
        return old;
      }
      m.e.push(new JEntry(k, v));
      m.peak = Math.max(m.peak, m.e.length);
      return null;
    }

    // Reproduce el orden de HashMap: tabla de potencia de 2 que nunca se achica, por cubeta y por llegada
    function mapEntries(m) {
      if (m.kind === 'LinkedHashMap') return m.e.slice();
      if (m.kind === 'TreeMap') return m.e.slice().sort(function (x, y) { return compareValues(x.k, y.k); });
      var n = 16;
      while (m.peak > n * 0.75) n *= 2;
      function bucket(en) {
        var h = hashOf(en.k);
        return (h ^ (h >>> 16)) & (n - 1);
      }
      return m.e.slice().sort(function (x, y) { return bucket(x) - bucket(y); });
    }

    function mapCall(m, name, a, line) {
      var at;
      switch (name) {
        case 'put': return mapPut(m, a[0], a[1]);
        case 'get': at = mapFind(m, a[0]); return at === -1 ? null : m.e[at].v;
        case 'getOrDefault': at = mapFind(m, a[0]); return at === -1 ? a[1] : m.e[at].v;
        case 'containsKey': return mapFind(m, a[0]) !== -1;
        case 'containsValue': return m.e.some(function (en) { return sameValue(a[0], en.v); });
        case 'putIfAbsent':
          at = mapFind(m, a[0]);
          if (at !== -1) return m.e[at].v;
          mapPut(m, a[0], a[1]);
          return null;
        case 'remove':
          at = mapFind(m, a[0]);
          return at === -1 ? null : m.e.splice(at, 1)[0].v;
        case 'putAll': a[0].e.forEach(function (en) { mapPut(m, en.k, en.v); }); return undefined;
        case 'size': return m.e.length;
        case 'isEmpty': return m.e.length === 0;
        case 'clear': m.e = []; return undefined;
        case 'keySet': return new JList(mapEntries(m).map(function (en) { return en.k; }), 'KeySet');
        case 'values': return new JList(mapEntries(m).map(function (en) { return en.v; }), 'Values');
        case 'entrySet': return new JList(mapEntries(m), 'EntrySet');
        case 'forEach': mapEntries(m).forEach(function (en) { a[0].call([en.k, en.v]); }); return undefined;
        case 'toString': return str(toStr(m));
      }
      missingMethod(name, a, line);
    }

    function optCall(o, name, a, line) {
      var present = o.v !== null;
      switch (name) {
        case 'isPresent': return present;
        case 'isEmpty': return !present;
        case 'get': case 'getAsInt': case 'getAsDouble':
          if (!present) throwJava('NoSuchElementException', 'No value present', line);
          return o.v;
        case 'orElse': return present ? o.v : a[0];
        case 'orElseGet': return present ? o.v : a[0].call([]);
        case 'orElseThrow':
          if (present) return o.v;
          if (!a.length) throwJava('NoSuchElementException', 'No value present', line);
          throw new JThrow(a[0].call([]));
        case 'ifPresent': if (present) a[0].call([o.v]); return undefined;
        case 'map': return present ? new JOpt(a[0].call([o.v])) : o;
        case 'filter': return present && a[0].call([o.v]) ? o : new JOpt(null);
        case 'toString': return str(toStr(o));
      }
      missingMethod(name, a, line);
    }

    function fnCompare(fn) {
      return function (x, y) { return asNumber(fn.call([x, y])); };
    }

    function pipeCall(s, name, a, line) {
      switch (name) {
        case 'filter': return new JPipe(s.a.filter(function (x) { return a[0].call([x]); }), s.kind);
        case 'map': return new JPipe(s.a.map(function (x) { return a[0].call([x]); }), s.kind);
        case 'mapToInt': return new JPipe(s.a.map(function (x) { return a[0].call([x]); }), 'int');
        case 'mapToDouble': return new JPipe(s.a.map(function (x) { return coerce(a[0].call([x]), 'double', line); }), 'double');
        case 'boxed': return new JPipe(s.a.slice());
        case 'sorted': return new JPipe(s.a.slice().sort(a[0] ? fnCompare(a[0]) : compareValues), s.kind);
        case 'limit': return new JPipe(s.a.slice(0, Number(toBig(a[0]))), s.kind);
        case 'skip': return new JPipe(s.a.slice(Number(toBig(a[0]))), s.kind);
        case 'peek': s.a.forEach(function (x) { a[0].call([x]); }); return s;
        case 'distinct': {
          var seen = [];
          s.a.forEach(function (x) { if (!seen.some(function (y) { return sameValue(x, y); })) seen.push(x); });
          return new JPipe(seen, s.kind);
        }
        case 'forEach': s.a.forEach(function (x) { a[0].call([x]); }); return undefined;
        case 'toList': return new JList(s.a.slice(), 'ImmutableCollections.ListN');
        case 'collect':
          if (a[0].kind === 'joining') return str(s.a.map(toStr).join(a[0].sep));
          return new JList(s.a.slice(), 'ArrayList');
        case 'count': return new JLong(BigInt(s.a.length));
        case 'sum':
          if (s.kind === 'int') return s.a.reduce(function (t, x) { return (t + x) | 0; }, 0);
          return new JDouble(s.a.reduce(function (t, x) { return t + asNumber(x); }, 0));
        case 'average':
          if (!s.a.length) return new JOpt(null);
          return new JOpt(new JDouble(s.a.reduce(function (t, x) { return t + asNumber(x); }, 0) / s.a.length));
        case 'max': case 'min': {
          if (!s.a.length) return new JOpt(null);
          var cmp = a[0] ? fnCompare(a[0]) : compareValues;
          return new JOpt(s.a.slice().sort(cmp)[name === 'max' ? s.a.length - 1 : 0]);
        }
        case 'findFirst': case 'findAny': return new JOpt(s.a.length ? s.a[0] : null);
        case 'anyMatch': return s.a.some(function (x) { return a[0].call([x]); });
        case 'allMatch': return s.a.every(function (x) { return a[0].call([x]); });
        case 'noneMatch': return !s.a.some(function (x) { return a[0].call([x]); });
        case 'reduce': return s.a.reduce(function (acc, x) { return a[1].call([acc, x]); }, a[0]);
      }
      throw new Unsupported('Stream.' + name);
    }

    function enumValueOf(c, name, line) {
      var hit = c.enumValues.filter(function (o) { return o.enumName === toStr(name); })[0];
      if (!hit) throwJava('IllegalArgumentException', 'No enum constant ' + c.name + '.' + toStr(name), line);
      return hit;
    }

    function sbCall(b, name, a, line) {
      switch (name) {
        case 'append': b.s += toStr(a[0]); return b;
        case 'toString': return str(b.s);
        case 'length': return b.s.length;
        case 'charAt': strIndex(b.s, a[0], line); return new JChar(b.s.charCodeAt(a[0]));
        case 'reverse': b.s = b.s.split('').reverse().join(''); return b;
        case 'insert': b.s = b.s.slice(0, a[0]) + toStr(a[1]) + b.s.slice(a[0]); return b;
        case 'deleteCharAt': strIndex(b.s, a[0], line); b.s = b.s.slice(0, a[0]) + b.s.slice(a[0] + 1); return b;
        case 'setLength': b.s = b.s.slice(0, a[0]); return undefined;
        case 'isEmpty': return b.s.length === 0;
      }
      missingMethod(name, a, line);
    }

    function readToken(line, conv) {
      while (stdinPos < stdin.length && /\s/.test(stdin.charAt(stdinPos))) stdinPos++;
      if (stdinPos >= stdin.length) throwJava('NoSuchElementException', null, line);
      var st = stdinPos;
      while (stdinPos < stdin.length && !/\s/.test(stdin.charAt(stdinPos))) stdinPos++;
      var tok = stdin.slice(st, stdinPos);
      if (conv && !conv.test(tok)) {
        stdinPos = st;
        throwJava('InputMismatchException', 'For input string: "' + tok + '"', line);
      }
      return tok;
    }

    function peekToken() {
      var q = stdinPos;
      while (q < stdin.length && /\s/.test(stdin.charAt(q))) q++;
      if (q >= stdin.length) return null;
      var e = q;
      while (e < stdin.length && !/\s/.test(stdin.charAt(e))) e++;
      return stdin.slice(q, e);
    }

    function streamCall(t, name, a, line) {
      if (t.kind === 'PrintStream') {
        var sink = t.st.err ? function () {} : write;
        switch (name) {
          case 'println': {
            if (a.length && a[0] instanceof JArr && a[0].type === 'char') { sink(a[0].a.map(toStr).join('') + '\n'); return undefined; }
            sink((a.length ? toStr(a[0]) : '') + '\n');
            return undefined;
          }
          case 'print':
            if (!a.length) compileErr(line, 'no suitable method found for print(no arguments)', 'print necesita un valor entre paréntesis. Para bajar de línea usá println().');
            sink(toStr(a[0]));
            return undefined;
          case 'printf': case 'format':
            sink(javaFormat(needStr(a[0], line), a.slice(1), line));
            return undefined;
          case 'flush': return undefined;
        }
        missingMethod(name, a, line);
      }
      if (t.kind === 'Scanner') {
        switch (name) {
          case 'nextInt': return Number(readToken(line, /^[+-]?\d+$/));
          case 'nextLong': return new JLong(BigInt(readToken(line, /^[+-]?\d+$/)));
          case 'nextDouble': return new JDouble(Number(readToken(line, /^[+-]?(\d+\.?\d*|\.\d+)$/)));
          case 'nextBoolean': return readToken(line, /^(true|false)$/i).toLowerCase() === 'true';
          case 'next': return str(readToken(line));
          case 'nextLine': {
            if (stdinPos >= stdin.length) throwJava('NoSuchElementException', 'No line found', line);
            var nl = stdin.indexOf('\n', stdinPos);
            var txt = stdin.slice(stdinPos, nl);
            stdinPos = nl + 1;
            return str(txt);
          }
          case 'hasNext': return peekToken() !== null;
          case 'hasNextLine': return stdinPos < stdin.length;
          case 'hasNextInt': { var pt = peekToken(); return pt !== null && /^[+-]?\d+$/.test(pt); }
          case 'hasNextDouble': { var pd = peekToken(); return pd !== null && /^[+-]?(\d+\.?\d*|\.\d+)$/.test(pd); }
          case 'close': return undefined;
        }
        missingMethod(name, a, line);
      }
      if (t.kind === 'Writer') {
        switch (name) {
          case 'write': case 'print': case 'append': files[t.st.path] += toStr(a[0]); return undefined;
          case 'println': files[t.st.path] += (a.length ? toStr(a[0]) : '') + '\n'; return undefined;
          case 'newLine': files[t.st.path] += '\n'; return undefined;
          case 'flush': case 'close': return undefined;
        }
        missingMethod(name, a, line);
      }
      if (t.kind === 'FileReader') {
        var st = t.st;
        switch (name) {
          case 'readLine': case 'nextLine': {
            if (st.pos >= st.text.length) {
              if (name === 'nextLine') throwJava('NoSuchElementException', 'No line found', line);
              return null;
            }
            var end = st.text.indexOf('\n', st.pos);
            if (end < 0) end = st.text.length;
            var ln = st.text.slice(st.pos, end);
            st.pos = end + 1;
            return str(ln);
          }
          case 'hasNextLine': case 'hasNext': case 'ready': return st.pos < st.text.length;
          case 'close': return undefined;
        }
        missingMethod(name, a, line);
      }
      if (t.kind === 'File') {
        switch (name) {
          case 'exists': return files[t.st.path] !== undefined;
          case 'getName': return str(t.st.path);
          case 'delete': { var had = files[t.st.path] !== undefined; delete files[t.st.path]; return had; }
          case 'length': return new JLong(BigInt((files[t.st.path] || '').length));
        }
      }
      throw new Unsupported(t.kind + '.' + name);
    }

    // ── Arranque ───────────────────────────────────────────────────────
    try {
      if (!preludeAst) preludeAst = parse(lex(PRELUDE.join('\n')));
      preludeAst.forEach(function (c) { defineClass(c, true); });
      var userToks = lex(source);
      var user = parse(userToks);
      user.forEach(function (c) {
        if (classes[c.name] && !classes[c.name].builtin) defineClass(c);
        else defineClass(c);
      });
      checkClasses();
      checkImports(userToks, user.imports, user);
      staticChecks(user);
      var mainClass = null, mainMethod = null;
      user.forEach(function (c) {
        c.methods.forEach(function (m) {
          if (m.name === 'main' && m.isStatic && m.ret === 'void' && m.params.length === 1 && m.params[0].type === 'String[]') {
            if (!mainClass || c.name === 'Main') { mainClass = c; mainMethod = m; }
          }
        });
      });
      if (!mainMethod) return { noMain: true, output: '' };
      initClass(classes[mainClass.name]);
      invoke(mainMethod, null, [new JArr('String', [])], mainMethod.line);
      return { ok: true, output: out, steps: steps };
    } catch (e) {
      if (e instanceof ExitProgram) return { ok: true, output: out, steps: steps };
      if (e instanceof Unsupported) return { unsupported: e.what, output: out };
      if (e instanceof CompileError) return { compile: { line: e.line || 1, javac: e.javac, why: e.why }, output: '' };
      if (e instanceof Limit) return { limit: e.why, line: curLine, output: out };
      if (e instanceof JThrow) {
        var text;
        try { text = toStr(e.obj); } catch (x) { text = e.obj.cls.name; }
        return { exception: text, type: e.obj.cls.name, line: curLine, output: out };
      }
      if (e instanceof RangeError) return { exception: 'java.lang.StackOverflowError', type: 'StackOverflowError', line: curLine, output: out };
      throw e;
    }
  }

  return { run: run, fpText: fpText };
})();
