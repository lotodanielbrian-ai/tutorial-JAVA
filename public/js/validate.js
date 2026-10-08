// Java INPRO — Code validation (syntax + pattern matching)

function checkJavaSyntax(source) {
  var lines = source.split('\n');
  function fail(line, javac, why) {
    var n = line < 1 ? 1 : line;
    return {
      syntax: true,
      line: n,
      lineText: lines[n - 1] != null ? lines[n - 1] : '',
      javac: javac,
      why: why,
      err: 'Línea ' + n + ': ' + javac
    };
  }

  var tokens = [];
  var i = 0;
  var line = 1;
  var col = 1;

  function bump(ch) {
    if (ch === '\n') { line++; col = 1; }
    else col++;
  }

  while (i < source.length) {
    var ch = source.charAt(i);
    var nx = source.charAt(i + 1);

    if (ch === '\n') { bump(ch); i++; continue; }
    if (ch === '\r' || ch === ' ' || ch === '\t') { bump(ch); i++; continue; }

    if (ch === '/' && nx === '/') {
      while (i < source.length && source.charAt(i) !== '\n') { bump(source.charAt(i)); i++; }
      continue;
    }
    if (ch === '/' && nx === '*') {
      var commentLine = line;
      bump(ch); bump(nx); i += 2;
      var commentClosed = false;
      while (i < source.length) {
        if (source.charAt(i) === '*' && source.charAt(i + 1) === '/') {
          bump('*'); bump('/'); i += 2; commentClosed = true; break;
        }
        bump(source.charAt(i)); i++;
      }
      if (!commentClosed) {
        return fail(commentLine, 'unclosed comment', 'Abriste un comentario con /* y no lo cerraste con */.');
      }
      continue;
    }

    if (ch === '"') {
      var strLine = line;
      bump(ch); i++;
      var strClosed = false;
      while (i < source.length && source.charAt(i) !== '\n') {
        if (source.charAt(i) === '\\') {
          bump(source.charAt(i));
          if (i + 1 < source.length && source.charAt(i + 1) !== '\n') { bump(source.charAt(i + 1)); i += 2; }
          else i++;
          continue;
        }
        if (source.charAt(i) === '"') { bump('"'); i++; strClosed = true; break; }
        bump(source.charAt(i)); i++;
      }
      if (!strClosed) {
        return fail(strLine, 'unclosed string literal', 'Abriste comillas dobles " y no las cerraste en esa línea. El texto va entre " y ".');
      }
      tokens.push({ type: 'string', value: '""', line: strLine });
      continue;
    }

    if (ch === "'") {
      var charLine = line;
      bump(ch); i++;
      var charBody = '';
      var charClosed = false;
      while (i < source.length && source.charAt(i) !== '\n') {
        if (source.charAt(i) === '\\') {
          charBody += source.charAt(i + 1) || '';
          bump(source.charAt(i));
          if (i + 1 < source.length && source.charAt(i + 1) !== '\n') { bump(source.charAt(i + 1)); i += 2; }
          else i++;
          continue;
        }
        if (source.charAt(i) === "'") { bump("'"); i++; charClosed = true; break; }
        charBody += source.charAt(i);
        bump(source.charAt(i)); i++;
      }
      if (!charClosed) {
        return fail(charLine, 'unclosed character literal', 'Abriste una comilla simple \' y no la cerraste. Un char lleva un solo carácter entre comillas simples, por ejemplo \'A\'.');
      }
      if (charBody.length === 0) {
        return fail(charLine, 'empty character literal', 'Las comillas simples vacías \'\' no sirven. Adentro va un carácter: \'A\'. Para un texto usá comillas dobles.');
      }
      if (charBody.length > 1) {
        return fail(charLine, 'unclosed character literal', 'Las comillas simples son para UN carácter, por ejemplo \'A\'. Para un texto usá comillas dobles: "hola".');
      }
      tokens.push({ type: 'char', value: "''", line: charLine });
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx))) {
      var numLine = line;
      var num = ch;
      bump(ch); i++;
      if (num === '0' && (source.charAt(i) === 'x' || source.charAt(i) === 'X')) {
        num += source.charAt(i); bump(source.charAt(i)); i++;
        while (i < source.length && /[0-9a-fA-F]/.test(source.charAt(i))) { num += source.charAt(i); bump(source.charAt(i)); i++; }
      } else {
        while (i < source.length && /[0-9]/.test(source.charAt(i))) { num += source.charAt(i); bump(source.charAt(i)); i++; }
        if (source.charAt(i) === '.' && /[0-9]/.test(source.charAt(i + 1))) {
          num += '.'; bump('.'); i++;
          while (i < source.length && /[0-9]/.test(source.charAt(i))) { num += source.charAt(i); bump(source.charAt(i)); i++; }
        }
      }
      if (i < source.length && /[lLfFdD]/.test(source.charAt(i))) { bump(source.charAt(i)); i++; }
      tokens.push({ type: 'number', value: num, line: numLine });
      continue;
    }

    if (/[A-Za-z_$]/.test(ch)) {
      var idLine = line;
      var id = ch;
      bump(ch); i++;
      while (i < source.length && /[A-Za-z0-9_$]/.test(source.charAt(i))) {
        id += source.charAt(i); bump(source.charAt(i)); i++;
      }
      tokens.push({ type: 'ident', value: id, line: idLine });
      continue;
    }

    var two = ch + nx;
    if (two === '++' || two === '--' || two === '&&' || two === '||' || two === '==' || two === '!=' || two === '<=' || two === '>=' || two === '+=' || two === '-=' || two === '*=' || two === '/=' || two === '%=' || two === '<<' || two === '>>' || two === '->') {
      tokens.push({ type: 'op', value: two, line: line });
      bump(ch); bump(nx); i += 2;
      continue;
    }

    if ('{}()[].,;+-*/%=<>!&|^~?:@'.indexOf(ch) !== -1) {
      var kind = 'op';
      if ('{}()[]'.indexOf(ch) !== -1) kind = 'bracket';
      else if (ch === ',' || ch === ';') kind = 'punct';
      else if (ch === '.') kind = 'dot';
      tokens.push({ type: kind, value: ch, line: line });
      bump(ch); i++;
      continue;
    }

    return fail(line, "illegal character: '" + ch + "'", 'Ese carácter no corresponde en Java (' + ch + '). Si es un texto, tiene que ir entre comillas. Si es un char, entre comillas simples.');
  }

  var closers = { '}': '{', ')': '(', ']': '[' };
  var openerName = { '{': 'llave {', '(': 'paréntesis (', '[': 'corchete [' };
  var closerName = { '}': 'llave }', ')': 'paréntesis )', ']': 'corchete ]' };
  var stack = [];
  var depth = 0;
  var topLevel = { 'public': 1, 'private': 1, 'protected': 1, 'static': 1, 'final': 1, 'abstract': 1, 'class': 1, 'interface': 1, 'enum': 1, 'import': 1, 'package': 1 };
  var t = 0;
  while (t < tokens.length) {
    var tok = tokens[t];
    if (tok.value === '{' || tok.value === '(' || tok.value === '[') {
      stack.push(tok);
      if (tok.value === '{') depth++;
      t++;
      continue;
    }
    if (tok.value === '}' || tok.value === ')' || tok.value === ']') {
      var open = stack.length ? stack[stack.length - 1].value : '';
      if (closers[tok.value] !== open) {
        if (!stack.length) {
          return fail(tok.line, 'class, interface, or enum expected', 'Este cierre ' + tok.value + ' no abre nada. Revisá que no hayas cerrado la clase antes de tiempo.');
        }
        var openTok = stack[stack.length - 1];
        var expectedClose = openTok.value === '{' ? '}' : openTok.value === '(' ? ')' : ']';
        return fail(tok.line, "')' expected", 'Acá se cierra con el símbolo equivocado. Se esperaba ' + (closerName[expectedClose] || expectedClose) + ', el que abre en la línea ' + openTok.line + '.');
      }
      stack.pop();
      if (tok.value === '}') depth--;
      t++;
      continue;
    }
    if (depth === 0 && tok.value !== ';') {
      if (tok.type !== 'ident' && tok.value !== '@') {
        return fail(tok.line, 'class, interface, or enum expected', 'Esta instrucción está fuera de la clase. En Java el código va adentro de la clase y, para que se ejecute, adentro de main.');
      }
      if (tok.value !== '@' && !topLevel[tok.value]) {
        return fail(tok.line, 'class, interface, or enum expected', 'Esta instrucción está fuera de la clase. La llave } de la clase ya cerró el bloque, así que Java no ejecuta lo que sigue. Mové el código adentro de main.');
      }
      if (tok.value === 'import' || tok.value === 'package') {
        while (t < tokens.length && tokens[t].value !== ';') t++;
        if (t >= tokens.length) {
          return fail(tok.line, "';' expected", 'A un import o package le falta el punto y coma ; al final.');
        }
        t++;
        continue;
      }
      while (t < tokens.length && tokens[t].value !== '{' && tokens[t].value !== ';') t++;
      if (t >= tokens.length) {
        return fail(tok.line, 'reached end of file while parsing', 'Falta la llave { que abre la clase o el bloque.');
      }
      continue;
    }
    t++;
  }
  if (stack.length) {
    var unclosed = stack[stack.length - 1];
    var what = openerName[unclosed.value] || 'bloque';
    return fail(unclosed.line, 'reached end of file while parsing', 'Falta cerrar ' + what + ' que abriste en la línea ' + unclosed.line + '. Cada apertura tiene que tener su cierre.');
  }

  for (var k = 0; k < tokens.length; k++) {
    var curTok = tokens[k];
    var prevTok = k > 0 ? tokens[k - 1] : null;
    var nextTok = k + 1 < tokens.length ? tokens[k + 1] : null;
    if (curTok.type === 'ident' && curTok.value === 'system') {
      return fail(curTok.line, 'cannot find symbol: system', 'Java distingue mayúsculas. La clase se llama System, con S mayúscula. system no existe.');
    }
    if (curTok.type === 'ident' && curTok.value === 'string' && nextTok && nextTok.type === 'ident') {
      return fail(curTok.line, 'cannot find symbol: string', 'El tipo texto es String, con S mayúscula. string no es una clase.');
    }
    if (curTok.type === 'ident' && (curTok.value === 'println' || curTok.value === 'print' || curTok.value === 'printf') && prevTok && prevTok.value === '.' && (!nextTok || nextTok.value !== '(')) {
      return fail(curTok.line, "'(' expected", 'Los métodos llevan paréntesis. Escribí System.out.println("texto"); con los paréntesis y el punto y coma.');
    }
  }

  function isLiteral(tok) { return tok && (tok.type === 'string' || tok.type === 'char' || tok.type === 'number'); }
  for (var a = 1; a < tokens.length; a++) {
    var left = tokens[a - 1];
    var right = tokens[a];
    if (isLiteral(left) && isLiteral(right)) {
      return fail(right.line, "',' expected", 'Entre dos valores hace falta una coma o un +. Por ejemplo calcularArea(6, 4) o "Hola " + nombre.');
    }
  }

  var masked = maskJava(source).split('\n');
  for (var ln = 0; ln < masked.length; ln++) {
    if (lineNeedsSemicolon(masked[ln])) {
      return fail(ln + 1, "';' expected", 'Cada instrucción termina con punto y coma ;. Sin él, Java no sabe dónde termina una y empieza la siguiente.');
    }
  }
  return null;
}

function maskJava(source) {
  var out = '';
  var i = 0;
  while (i < source.length) {
    var ch = source.charAt(i);
    var nx = source.charAt(i + 1);
    if (ch === '/' && nx === '/') {
      while (i < source.length && source.charAt(i) !== '\n') { out += ' '; i++; }
      continue;
    }
    if (ch === '/' && nx === '*') {
      out += '  '; i += 2;
      while (i < source.length && !(source.charAt(i) === '*' && source.charAt(i + 1) === '/')) {
        out += source.charAt(i) === '\n' ? '\n' : ' ';
        i++;
      }
      if (i < source.length) { out += '  '; i += 2; }
      continue;
    }
    if (ch === '"' || ch === "'") {
      var quote = ch;
      out += ' '; i++;
      while (i < source.length && source.charAt(i) !== '\n' && source.charAt(i) !== quote) {
        if (source.charAt(i) === '\\') { out += ' '; i++; if (i < source.length && source.charAt(i) !== '\n') { out += ' '; i++; } continue; }
        out += source.charAt(i) === '\n' ? '\n' : ' ';
        i++;
      }
      if (source.charAt(i) === quote) { out += ' '; i++; }
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function lineNeedsSemicolon(rawLine) {
  var s = rawLine.trim();
  if (!s) return false;
  if (/[;{]\s*$/.test(s)) return false;
  if (/^}\s*$/.test(s)) return false;
  if (/^}\s*(else|catch|finally)\b/.test(s)) return false;
  if (/,\s*$/.test(s)) return false;
  if (/^(case|default)\b/.test(s)) return false;
  if (/^(if|else|for|while|do|try|catch|finally|switch)\b/.test(s)) return false;
  if (/^@/.test(s) && !/=/.test(s)) return false;
  if (/^(public|private|protected|static|final|abstract|class|interface|enum|import|package)\b/.test(s)) {
    if (/^(import|package)\b/.test(s)) return true;
    if (/=/.test(s)) return true;
    return false;
  }
  if (/^([\w.<>,\[\]]+\s+)+\w+\s*\([^;]*\)\s*$/.test(s) && !/=/.test(s)) return false;
  var isStmt = /^(return|break|continue|throw)\b/.test(s)
    || /=/.test(s)
    || /\b(System|int|double|float|long|short|byte|boolean|char|String|var)\b/.test(s)
    || /[\w\])]\s*\(/.test(s)
    || /\.\s*\w+/.test(s)
    || /\+\+|--/.test(s);
  return isStmt;
}

function lessonExpected(id) {
  if (typeof LESSONS === 'undefined' || !LESSONS) return '';
  for (var i = 0; i < LESSONS.length; i++) {
    if (LESSONS[i].id === id && LESSONS[i].exercise && LESSONS[i].exercise.expected != null) {
      return String(LESSONS[i].exercise.expected).replace(/\\n/g, '\n');
    }
  }
  return '';
}

function suggestPrint(name, expected) {
  var label = '';
  var key = String(name || '').toLowerCase();
  if (expected && key) {
    var lines = String(expected).split('\n');
    for (var i = 0; i < lines.length; i++) {
      var idx = lines[i].indexOf(':');
      if (idx < 1) continue;
      var lab = lines[i].slice(0, idx).trim();
      var compact = lab.toLowerCase().replace(/\s+/g, '');
      if (compact === key || key.indexOf(compact) !== -1 || compact.indexOf(key) !== -1) {
        label = lab;
        break;
      }
    }
  }
  if (!name) return 'System.out.println("texto");';
  if (!label) return 'System.out.println("texto" + ' + name + ');';
  return 'System.out.println("' + label + ': " + ' + name + ');';
}

function extractMainBody(source) {
  var match = /void\s+main\s*\(/.exec(source);
  if (!match) return null;
  var i = source.indexOf('{', match.index);
  if (i < 0) return null;
  var start = i + 1;
  var line = 1;
  for (var k = 0; k < start; k++) if (source.charAt(k) === '\n') line++;
  var depth = 1;
  var j = start;
  while (j < source.length && depth > 0) {
    var c = source.charAt(j);
    var n = source.charAt(j + 1);
    if (c === '/' && n === '/') {
      while (j < source.length && source.charAt(j) !== '\n') j++;
      continue;
    }
    if (c === '/' && n === '*') {
      j += 2;
      while (j < source.length && !(source.charAt(j) === '*' && source.charAt(j + 1) === '/')) j++;
      j += 2;
      continue;
    }
    if (c === '"' || c === "'") {
      var q = c;
      j++;
      while (j < source.length && source.charAt(j) !== q && source.charAt(j) !== '\n') {
        if (source.charAt(j) === '\\') j++;
        j++;
      }
      j++;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) break;
    }
    j++;
  }
  return { text: source.slice(start, j), startLine: line };
}

function bodyHasUnsupported(text) {
  var masked = maskJava(text);
  if (/\b(for|while|if|else|switch|try|catch|new|return|throw|Scanner|interface|extends|implements|import|package|class)\b/.test(masked)) return true;
  if (/\[/.test(masked) || /\+\+|--/.test(masked)) return true;
  return false;
}

function lexSnippet(text, startLine) {
  var tokens = [];
  var i = 0;
  var line = startLine;
  function bump(ch) { if (ch === '\n') line++; }
  while (i < text.length) {
    var ch = text.charAt(i);
    var nx = text.charAt(i + 1);
    if (ch === '\n' || ch === '\r' || ch === ' ' || ch === '\t') { bump(ch); i++; continue; }
    if (ch === '/' && nx === '/') {
      while (i < text.length && text.charAt(i) !== '\n') i++;
      continue;
    }
    if (ch === '/' && nx === '*') {
      i += 2;
      while (i < text.length && !(text.charAt(i) === '*' && text.charAt(i + 1) === '/')) { bump(text.charAt(i)); i++; }
      i += 2;
      continue;
    }
    if (ch === '"') {
      var strLine = line;
      i++;
      var s = '';
      var closed = false;
      while (i < text.length && text.charAt(i) !== '\n') {
        if (text.charAt(i) === '\\') {
          var e = text.charAt(i + 1);
          if (e === 'n') s += '\n';
          else if (e === 't') s += '\t';
          else if (e) s += e;
          i += 2;
          continue;
        }
        if (text.charAt(i) === '"') { i++; closed = true; break; }
        s += text.charAt(i);
        i++;
      }
      if (!closed) return { errorLine: strLine };
      tokens.push({ type: 'string', value: s, line: strLine });
      continue;
    }
    if (ch === "'") {
      var charLine = line;
      i++;
      var body = '';
      var charClosed = false;
      while (i < text.length && text.charAt(i) !== '\n') {
        if (text.charAt(i) === '\\') { body += text.charAt(i + 1) || ''; i += 2; continue; }
        if (text.charAt(i) === "'") { i++; charClosed = true; break; }
        body += text.charAt(i);
        i++;
      }
      if (!charClosed || body.length !== 1) return { errorLine: charLine };
      tokens.push({ type: 'char', value: body, line: charLine });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(nx))) {
      var numLine = line;
      var raw = ch;
      var isDouble = false;
      i++;
      while (i < text.length && /[0-9]/.test(text.charAt(i))) { raw += text.charAt(i); i++; }
      if (text.charAt(i) === '.' && /[0-9]/.test(text.charAt(i + 1))) {
        isDouble = true;
        raw += '.';
        i++;
        while (i < text.length && /[0-9]/.test(text.charAt(i))) { raw += text.charAt(i); i++; }
      }
      if (/[lLfFdD]/.test(text.charAt(i))) {
        if (text.charAt(i) === 'f' || text.charAt(i) === 'F' || text.charAt(i) === 'd' || text.charAt(i) === 'D') isDouble = true;
        i++;
      }
      tokens.push({ type: 'number', value: Number(raw), numType: isDouble ? 'double' : 'int', line: numLine });
      continue;
    }
    if (/[A-Za-z_$]/.test(ch)) {
      var idLine = line;
      var id = ch;
      i++;
      while (i < text.length && /[A-Za-z0-9_$]/.test(text.charAt(i))) { id += text.charAt(i); i++; }
      tokens.push({ type: 'ident', value: id, line: idLine });
      continue;
    }
    var two = ch + nx;
    if (two === '==' || two === '!=' || two === '<=' || two === '>=' || two === '&&' || two === '||' || two === '++' || two === '--' || two === '+=' || two === '-=' || two === '*=' || two === '/=' || two === '%=') {
      tokens.push({ type: 'op', value: two, line: line });
      i += 2;
      continue;
    }
    if ('+-*/%=<>!&|^~?:.()'.indexOf(ch) !== -1 || ch === ';' || ch === ',') {
      tokens.push({ type: 'op', value: ch, line: line });
      i++;
      continue;
    }
    return { errorLine: line, unsupported: true };
  }
  return { tokens: tokens };
}

function splitBySemi(tokens) {
  var stmts = [];
  var cur = [];
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i].value === ';') {
      if (cur.length) stmts.push(cur);
      cur = [];
    } else cur.push(tokens[i]);
  }
  if (cur.length) stmts.push(cur);
  return stmts;
}

function javaText(val) {
  if (!val) return '';
  if (val.kind === 'string' || val.kind === 'char') return val.value;
  if (val.kind === 'boolean') return val.value ? 'true' : 'false';
  if (val.kind === 'double') {
    var n = val.value;
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n)) + '.0';
    return String(Math.round(n * 1e10) / 1e10);
  }
  return String(val.value);
}

function simulateJava(source, expected) {
  var body = extractMainBody(source);
  if (!body) return { unsupported: true };
  if (bodyHasUnsupported(body.text)) return { unsupported: true };
  var lexed = lexSnippet(body.text, body.startLine);
  if (!lexed.tokens) return { unsupported: true };
  var lines = source.split('\n');
  var env = {};
  var output = '';
  var prints = [];
  var stmts = splitBySemi(lexed.tokens);
  var types = { 'int': 1, 'double': 1, 'float': 1, 'long': 1, 'short': 1, 'byte': 1, 'boolean': 1, 'char': 1, 'String': 1 };

  function fail(line, javac, why, name) {
    var n = line < 1 ? 1 : line;
    return {
      syntax: true,
      line: n,
      lineText: lines[n - 1] != null ? lines[n - 1] : '',
      javac: javac,
      why: why,
      suggest: suggestPrint(name, expected),
      err: 'Línea ' + n + ': ' + javac
    };
  }

  function isValueTok(t) {
    return t.type === 'string' || t.type === 'number' || t.type === 'char' || t.type === 'ident';
  }

  function diagnoseArgs(args) {
    var name = '';
    for (var i = 0; i < args.length; i++) {
      if (args[i].value === '=' ) {
        for (var j = i + 1; j < args.length; j++) {
          if (args[j].type === 'ident' && args[j].value !== 'true' && args[j].value !== 'false') { name = args[j].value; break; }
        }
        return fail(args[i].line, "illegal start of expression", 'El signo = asigna un valor, no une texto. Para imprimir la etiqueta y la variable usá +.', name);
      }
    }
    var prev = false;
    for (var k = 0; k < args.length; k++) {
      var t = args[k];
      if (isValueTok(t)) {
        if (prev) {
          name = t.type === 'ident' ? t.value : name;
          if (!name) {
            for (var p = k - 1; p >= 0; p--) if (args[p].type === 'ident') { name = args[p].value; break; }
          }
          return fail(t.line, "'+' expected", 'Entre el texto y la variable falta el +. Sin él, Java no sabe que tiene que unirlos.', name);
        }
        prev = true;
      } else if (t.value === '+' || t.value === '-' || t.value === '*' || t.value === '/' || t.value === '%' || t.value === '(') {
        prev = false;
      } else if (t.value !== ')') {
        return { unsupported: true };
      }
    }
    return null;
  }

  function evalArgs(args, stmtLine) {
    var p = { i: 0, t: args, env: env, line: stmtLine };
    function peek() { return p.t[p.i]; }
    function next() { return p.t[p.i++]; }
    function parseAdd() {
      var left = parseMul();
      if (!left || left.unsupported || left.syntax) return left;
      while (peek() && (peek().value === '+' || peek().value === '-')) {
        var op = next().value;
        var right = parseMul();
        if (!right || right.unsupported || right.syntax) return right;
        if (op === '+' && (left.kind === 'string' || right.kind === 'string' || left.kind === 'char' || right.kind === 'char')) {
          left = { kind: 'string', value: javaText(left) + javaText(right) };
        } else if (left.kind === 'boolean' || right.kind === 'boolean' || left.kind === 'string' || right.kind === 'string') {
          return { unsupported: true };
        } else {
          var kind = (left.kind === 'double' || right.kind === 'double') ? 'double' : 'int';
          var n = op === '+' ? (left.value + right.value) : (left.value - right.value);
          if (kind === 'int') n = n < 0 ? Math.ceil(n) : Math.floor(n);
          left = { kind: kind, value: n };
        }
      }
      return left;
    }
    function parseMul() {
      var left = parseUnary();
      if (!left || left.unsupported || left.syntax) return left;
      while (peek() && (peek().value === '*' || peek().value === '/' || peek().value === '%')) {
        var op = next().value;
        var right = parseUnary();
        if (!right || right.unsupported || right.syntax) return right;
        if (left.kind === 'string' || right.kind === 'string' || left.kind === 'boolean' || right.kind === 'boolean') return { unsupported: true };
        var kind = (left.kind === 'double' || right.kind === 'double') ? 'double' : 'int';
        var n = 0;
        if (op === '*') n = left.value * right.value;
        else if (right.value === 0) return fail(stmtLine, 'arithmetic exception', 'No se puede dividir por cero.', '');
        else if (op === '/') n = left.value / right.value;
        else n = left.value % right.value;
        if (kind === 'int') n = n < 0 ? Math.ceil(n) : Math.floor(n);
        left = { kind: kind, value: n };
      }
      return left;
    }
    function parseUnary() {
      var tok = peek();
      if (!tok) return fail(stmtLine, "';' expected", 'Falta el valor a imprimir.', '');
      if (tok.value === '(') {
        next();
        var inner = parseAdd();
        if (!inner || inner.unsupported || inner.syntax) return inner;
        if (!peek() || peek().value !== ')') return { unsupported: true };
        next();
        return inner;
      }
      if (tok.value === '-' && p.t[p.i + 1] && p.t[p.i + 1].type === 'number') {
        next();
        var num = next();
        return { kind: num.numType, value: -num.value };
      }
      next();
      if (tok.type === 'string') return { kind: 'string', value: tok.value };
      if (tok.type === 'char') return { kind: 'char', value: tok.value };
      if (tok.type === 'number') return { kind: tok.numType, value: tok.value };
      if (tok.type === 'ident') {
        if (tok.value === 'true' || tok.value === 'false') return { kind: 'boolean', value: tok.value === 'true' };
        if (!Object.prototype.hasOwnProperty.call(env, tok.value)) {
          return fail(tok.line, 'cannot find symbol: ' + tok.value, 'La variable ' + tok.value + ' no está declarada. Primero va el tipo y el nombre, por ejemplo int ' + tok.value + ' = 0;', tok.value);
        }
        return env[tok.value];
      }
      return { unsupported: true };
    }
    var value = parseAdd();
    if (!value || value.unsupported || value.syntax) return value;
    if (p.i < args.length) return { unsupported: true };
    return value;
  }

  for (var s = 0; s < stmts.length; s++) {
    var stmt = stmts[s];
    var idx = 0;
    if (stmt[0] && stmt[0].value === 'final') idx = 1;
    var head = stmt[idx];
    if (!head) continue;
    if (types[head.value] && stmt[idx + 1] && stmt[idx + 1].type === 'ident') {
      var vname = stmt[idx + 1].value;
      var vtype = head.value === 'float' ? 'double' : (head.value === 'long' || head.value === 'short' || head.value === 'byte' ? 'int' : head.value);
      if (vtype === 'String') vtype = 'string';
      if (stmt[idx + 2] && stmt[idx + 2].value === '=') {
        var ev = evalArgs(stmt.slice(idx + 3), head.line);
        if (!ev || ev.unsupported) return { unsupported: true };
        if (ev.syntax) return ev;
        var okType = (vtype === 'string' && ev.kind === 'string') || (vtype === 'char' && ev.kind === 'char') || (vtype === 'boolean' && ev.kind === 'boolean') || (vtype === 'double' && (ev.kind === 'double' || ev.kind === 'int')) || (vtype === 'int' && ev.kind === 'int');
        if (!okType) return fail(head.line, 'incompatible types', 'El valor no corresponde al tipo ' + head.value + '. Un texto va entre comillas y un número, no.', vname);
        if (vtype === 'double' && ev.kind === 'int') ev = { kind: 'double', value: ev.value };
        env[vname] = ev;
      } else if (!stmt[idx + 2]) {
        env[vname] = vtype === 'string' ? { kind: 'string', value: '' } : vtype === 'boolean' ? { kind: 'boolean', value: false } : vtype === 'char' ? { kind: 'char', value: '\0' } : vtype === 'double' ? { kind: 'double', value: 0 } : { kind: 'int', value: 0 };
      } else return { unsupported: true };
      continue;
    }
    if (head.value === 'System' && stmt[1] && stmt[1].value === '.' && stmt[2] && stmt[2].value === 'out' && stmt[3] && stmt[3].value === '.' && stmt[4] && (stmt[4].value === 'println' || stmt[4].value === 'print') && stmt[5] && stmt[5].value === '(' && stmt[stmt.length - 1] && stmt[stmt.length - 1].value === ')') {
      var args = stmt.slice(6, stmt.length - 1);
      var diagnosed = diagnoseArgs(args);
      if (diagnosed) return diagnosed;
      var names = [];
      for (var a = 0; a < args.length; a++) {
        if (args[a].type === 'ident' && args[a].value !== 'true' && args[a].value !== 'false') names.push(args[a].value);
      }
      var printed = args.length ? evalArgs(args, head.line) : { kind: 'string', value: '' };
      if (!printed || printed.unsupported) return { unsupported: true };
      if (printed.syntax) return printed;
      var chunk = javaText(printed) + (stmt[4].value === 'println' ? '\n' : '');
      output += chunk;
      prints.push({ line: head.line, text: chunk.replace(/\n$/, ''), names: names });
      continue;
    }
    if (head.type === 'ident' && stmt[1] && stmt[1].value === '=' && env[head.value]) {
      var assigned = evalArgs(stmt.slice(2), head.line);
      if (!assigned || assigned.unsupported) return { unsupported: true };
      if (assigned.syntax) return assigned;
      env[head.value] = assigned;
      continue;
    }
    return { unsupported: true };
  }

  var shown = output.replace(/\s+$/, '');
  var blameLine = 0;
  var suggest = '';
  if (expected) {
    var gotLines = shown.length ? shown.split('\n') : [];
    var expLines = String(expected).replace(/\s+$/, '').split('\n');
    var count = Math.max(gotLines.length, expLines.length);
    for (var li = 0; li < count; li++) {
      if ((gotLines[li] || '') !== (expLines[li] || '')) {
        var pr = prints[li] || prints[prints.length - 1];
        if (pr) {
          blameLine = pr.line;
          if (pr.names && pr.names.length) suggest = suggestPrint(pr.names[0], expected);
        }
        break;
      }
    }
  }
  return { simulated: true, output: shown, blameLine: blameLine, suggest: suggest, prints: prints };
}

function styleNotes(source) {
  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  var intro = 'En Java los nombres siguen un estilo para que el código se lea igual en todos lados.'
    + '<br><strong>camelCase</strong>: variables y métodos. La primera palabra va en minúscula y las siguientes empiezan con mayúscula: <code>esEstudiante</code>, <code>nombreCompleto</code>.'
    + '<br><strong>PascalCase</strong>: clases. Cada palabra empieza con mayúscula: <code>Main</code>, <code>Persona</code>.'
    + '<br><strong>snake_case</strong>: palabras separadas con _. No es el estilo de Java para variables. <code>nombre_completo</code> se escribe <code>nombreCompleto</code>.'
    + '<br><strong>MAYUSCULAS_CON_GUION</strong>: constantes <code>final</code>, por ejemplo <code>MAX_INTENTOS</code>.';
  var masked = maskJava(source);
  var notes = [];
  var seen = {};
  var re = /\b(int|double|float|long|short|byte|boolean|char|String)\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  var m;
  while ((m = re.exec(masked))) {
    var name = m[2];
    if (seen[name] || name === 'args') continue;
    seen[name] = 1;
    var isFinal = new RegExp('\\bfinal\\s+(?:int|double|float|long|short|byte|boolean|char|String)\\s+' + name + '\\b').test(masked);
    if (isFinal) {
      if (!/^[A-Z][A-Z0-9_]*$/.test(name)) notes.push('La constante <code>' + escHtml(name) + '</code> conviene escribirla en MAYUSCULAS_CON_GUION.');
      continue;
    }
    if (name.indexOf('_') !== -1) notes.push('<code>' + escHtml(name) + '</code> está en snake_case. En Java las variables van en camelCase.');
    else if (/^[A-Z]/.test(name)) notes.push('<code>' + escHtml(name) + '</code> empieza con mayúscula. Una variable va en camelCase; una clase, en PascalCase.');
  }
  var cre = /\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/g;
  while ((m = cre.exec(masked))) {
    if (!/^[A-Z][A-Za-z0-9]*$/.test(m[1])) notes.push('La clase <code>' + escHtml(m[1]) + '</code> debería estar en PascalCase.');
  }
  if (!notes.length) intro += '<br>Los nombres de este código siguen esas convenciones.';
  else intro += '<br>' + notes.join('<br>');
  return intro;
}

function localValidate(id, c) {
  var isGitLesson = (id === 31 || id === 33);
  if (!isGitLesson) {
    var syntaxErr = checkJavaSyntax(c);
    if (syntaxErr) return syntaxErr;
    var sim = simulateJava(c, lessonExpected(id));
    if (sim && sim.syntax) return sim;
    if (sim && sim.simulated) return sim;
  }
  const code = c.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  if (!isGitLesson && !code.includes('class')) return { err: "Falta definir una clase (ej. 'class Main')." };

  const has = (str) => code.includes(str);
  
  switch(id) {
    case 1: return (has('println("¡Hola, Java!")') && has('println("Bienvenido al tutorial")')) ? { ok: true } : { err: "Asegurate de imprimir las dos frases exactas pedidas." };
    case 2: return (has('String') && has('int') && has('double') && has('boolean') && has('System.out.println')) ? { ok: true } : { err: "Declaraste las 4 variables? (String, int, double, boolean) Y usaste System.out.println?" };
    case 3: return ((has('a+b')||has('a + b')) && (has('a-b')||has('a - b')) && (has('a*b')||has('a * b')) && (has('a/b')||has('a / b')) && (has('a%b')||has('a % b'))) ? { ok: true } : { err: "Asegurate de calcular la suma (+), resta (-), producto (*), división (/) y resto (%)." };
    case 4: return (has('.toUpperCase(') && has('.length(') && has('.charAt(0)') && has('.contains("tutorial")')) ? { ok: true } : { err: "Usá los métodos .toUpperCase(), .length(), .charAt(0) y .contains()." };
    case 5: return (has('double') && has('(int)') && has('Math.round') && has('Math.sqrt')) ? { ok: true } : { err: "Asegurate de usar widening (double), narrowing (int), Math.round() y Math.sqrt()." };
        case 6:
      if (!has('.trim()')) return { err: "Usá .trim() para eliminar los espacios del nombre." };
      if (!has('.toUpperCase()')) return { err: "Convertí el nombre a mayúsculas con .toUpperCase()." };
      if (!has('+')) return { err: "Concatená texto y variables con +." };
      return { ok: true };
case 7: return (has('if') && has('else if') && has('else') && (has('>= 90')||has('>=90'))) ? { ok: true } : { err: "Usá la estructura if / else if / else para evaluar la nota." };
    case 8: return (has('switch') && has('case') && has('break') && has('default')) ? { ok: true } : { err: "Usá la estructura switch con cases, breaks y default." };
    case 9: return (has('&&')) ? { ok: true } : { err: "Debés usar el operador && para evaluar ambas condiciones." };
    case 10: return (has('String') && has('int') && has('Hola') && has('22')) ? { ok: true } : { err: "Declaraste las variables como se pedía y concatenaste bien el string?" };
    case 11: return (has('while') && (has('<= 5') || has('<=5')) && has('++') && has('¡Listo!')) ? { ok: true } : { err: "Usá un bucle while, incrementá la variable, y al final imprimí '¡Listo!'." };
    case 12: return (has('for') && (has('<= 5') || has('< 6') || has('<=5') || has('<6')) && has('*')) ? { ok: true } : { err: "Usá un bucle for que vaya del 1 al 5 para la tabla del 3." };
    case 13: return ((has('int[]') || has('int []')) && (has('for') || has('while')) && has('+')) ? { ok: true } : { err: "Creá el array y recorrelo con un for para sumar." };
        case 14: case 25: return { ok: false, err: "Esta leccion es un cuestionario, no un ejercicio de codigo." };
    //SKIP: 14 es quiz (Paradigmas), validación no aplica
    case 16: return (has('static void imprimirSeparador') && has('--- --- ---') && code.split('imprimirSeparador').length > 3) ? { ok: true } : { err: "Definí el método imprimirSeparador() y llamalo 3 veces." };
    case 17: return (has('static int calcularArea') && has('return') && has('*') && (has('calcularArea(6,') || has('calcularArea(6,4)') || has('calcularArea(6, 4)') || has('calcularArea( 6,'))) ? { ok: true } : { err: "Definí calcularArea con retorno (return) y llamalo con 6 y 4." };
    case 18: return (has('class Persona') && has('void presentarse') && has('new Persona()')) ? { ok: true } : { err: "Creá la clase Persona, el método presentarse, y un objeto nuevo." };
    case 19: return (has('Producto(String') && has('this.') && has('new Producto("Laptop"')) ? { ok: true } : { err: "Creá el constructor y usalo para instanciar el Producto." };
    case 20: return (has('private String nombre') && has('private int edad') && has('public String getNombre')) ? { ok: true } : { err: "Asegurate de usar private en los atributos y definir los métodos get/set." };
    case 21: return (has('class Perro extends Animal') && has('super(')) ? { ok: true } : { err: "Asegurate de usar 'extends Animal' y 'super()'." };
    case 22: return (code.includes('@Override') || (has('void hacerSonido()') && has('new Perro(') && has('new Gato('))) ? { ok: true } : { err: "Creá Perro y Gato que hereden de Animal y sobrescribí hacerSonido()." };
    case 23: return (has('interface') && has('implements')) ? { ok: true } : { err: "Definí una interfaz y clases que la implementen." };
    case 24: return (has('ArrayList<String>') && has('.add("Manzana")') && has('.add("Banana")') && has('.add("Naranja")') && has('.size()')) ? { ok: true } : { err: "Creá el ArrayList, usá .add() 3 veces y mostrá el total con .size()." };
    //SKIP: 25 es quiz (Proyectos), validación no aplica
    case 26: return (has('FileWriter') && has('BufferedWriter') && has('.write(') && has('catch')) ? { ok: true } : { err: "Asegurate de usar FileWriter, BufferedWriter, write() y un try-catch." };
    case 27: return (has('try') && has('Integer.parseInt') && has('catch')) ? { ok: true } : { err: "Usá un bloque try-catch para atrapar el error." };
    case 28: return (has('extends Exception') && has('throw new') && has('try')) ? { ok: true } : { err: "Creá tu propia excepción con extends Exception, lanzala con throw y atrapala con try-catch." };
    case 30:     case 34:
      if (!has('class') || !has('private')) return { err: "Creá una clase con atributos privados." };
      if (!has('ArrayList')) return { err: "Usá ArrayList para gestionar la colección." };
      if (!has('switch')) return { err: "Implementá un menú con switch." };
      if (!has('while')) return { err: "Usá while para mantener el menú activo." };
      if (!has('try')) return { err: "Manejá errores con try-catch." };
      if (!has('git init')) return { err: "Versioná el proyecto con git init." };
      if (!has('git add')) return { err: "Usá git add para preparar archivos." };
      if (!has('git commit')) return { err: "Guardá los cambios con git commit." };
      return { ok: true };
return { ok: false, err: "Esta lección es un cuestionario. Andá a la pestaña Cuestionario para completarlo." };
    case 31:
      if (!has('git init')) return { err: "Inicializá el repositorio con git init." };
      if (!has('git add')) return { err: "Usá git add para preparar los archivos." };
      if (!has('git commit')) return { err: "Guardá los cambios con git commit." };
      if (!has('git log')) return { err: "Consultá el historial con git log." };
      if (!has('git checkout')) return { err: "Recuperá la versión anterior con git checkout." };
      return { ok: true };
    case 32: case 35: return { ok: false, err: "Esta lección es un cuestionario. Andá a la pestaña Cuestionario para completarlo." };
    case 33:
      if (!has('git init')) return { err: "Inicializá el repositorio con git init." };
      if (!has('git add')) return { err: "Prepará los archivos con git add." };
      var commits = (code.match(/git commit/g) || []).length;
      if (commits < 2) return { err: "Hacé al menos 2 commits para registrar los cambios de cada día." };
      if (!has('git log')) return { err: "Consultá el historial con git log." };
      if (!has('git checkout')) return { err: "Recuperá la versión anterior con git checkout." };
      return { ok: true };
    case 15:
      if (!has('for') && !has('while')) return { err: "Tenés que usar un bucle (for o while) para recorrer el array." };
      if (!has('if')) return { err: "Tenés que usar un if para verificar si la venta superó los 200." };
      if (!has('ventas')) return { err: "Usá el array ventas que se te dio en el starter." };
      return { ok: true };
    case 29:
      if (!has('switch')) return { err: "Tenés que usar switch para el menú." };
      if (!has('while')) return { err: "Tenés que usar while para mantener el menú." };
      var oopCount = 0;
      if (has('interface') || has('abstract class')) oopCount++;
      if (has('ArrayList')) oopCount++;
      if (has('try') || has('catch')) oopCount++;
      if (has('private')) oopCount++;
      if (has('implements')) oopCount++;
      if (has('Scanner')) oopCount++;
      if (oopCount < 5) return { err: "Usá al menos 5 elementos: interfaz, ArrayList, try-catch, private, implements y Scanner." };
      return { ok: true };
  }
  return { ok: false, err: "Error de validación general." };
}