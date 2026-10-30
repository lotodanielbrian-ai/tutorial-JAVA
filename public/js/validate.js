// Java INPRO — Code validation (ejecuta con JavaRun, diagnostica y revisa conceptos)

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
  if (/\)\s*(throws\s+[\w,\s]+)?\{.*\}\s*$/.test(s)) return false;
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

function allLessons() {
  var list = typeof LESSONS === 'undefined' || !LESSONS ? [] : LESSONS;
  return typeof LESSONS_F2 === 'undefined' ? list : list.concat(LESSONS_F2);
}

function lessonExpected(id) {
  var list = allLessons();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id && list[i].exercise && list[i].exercise.expected != null) {
      return String(list[i].exercise.expected).replace(/\\n/g, '\n');
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

function normalizeOutput(text) {
  return String(text == null ? '' : text).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/\s+$/, '');
}

function compileResult(source, r, expected) {
  var ce = r.compile;
  var lines = source.split('\n');
  var friendly = checkJavaSyntax(source);
  if (friendly && friendly.line === ce.line) return friendly;
  var sim = simulateJava(source, expected);
  if (sim && sim.syntax && sim.line === ce.line) return sim;
  return {
    syntax: true,
    line: ce.line,
    lineText: lines[ce.line - 1] != null ? lines[ce.line - 1] : '',
    javac: ce.javac,
    why: ce.why,
    err: 'Línea ' + ce.line + ': ' + ce.javac
  };
}

/** Ejecuta el programa de verdad y devuelve lo que muestra la consola. */
function judgeProgram(source, expected, stdin) {
  var r = JavaRun.run(source, { stdin: stdin });
  if (r.compile) return compileResult(source, r, expected);
  if (r.unsupported) return { unsupported: r.unsupported };
  if (r.noMain) return { err: 'Falta el método main: public static void main(String[] args).' };
  if (r.limit) return { err: r.limit, line: r.line };
  var res = { simulated: true, output: normalizeOutput(r.output), blameLine: 0, suggest: '' };
  if (r.exception) {
    res.runtime = 'Exception in thread "main" ' + r.exception;
    res.blameLine = r.line;
    return res;
  }
  var printsOnly = simulateJava(source, expected);
  if (printsOnly && printsOnly.simulated) {
    res.blameLine = printsOnly.blameLine;
    res.suggest = printsOnly.suggest;
  }
  return res;
}

function lessonStdin(id) {
  var list = allLessons();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id === id && list[i].exercise) return list[i].exercise.stdin || [];
  }
  return [];
}

// La consola correcta no alcanza: cada lección pide usar su concepto.
function conceptCheck(id, source) {
  var code = maskJava(source);
  // Fase 2: cada ejercicio declara sus conceptos en need: [[regex, mensaje], ...]
  if (id >= 100) {
    var ex = allLessons().filter(function (l) { return l.id === id; })[0].exercise;
    var miss = (ex.need || []).filter(function (n) { return !new RegExp(n[0]).test(code); })[0];
    return miss ? miss[1] : '';
  }
  function has(str) { return code.indexOf(str) !== -1; }
  function re(rx) { return rx.test(code); }
  var loop = re(/\b(for|while)\b/);
  switch (id) {
    case 1: return has('println') ? '' : 'Usá System.out.println para imprimir.';
    case 2: return (re(/\bString\s+\w+/) && re(/\bint\s+\w+/) && re(/\bdouble\s+\w+/) && re(/\bboolean\s+\w+/)) ? '' : 'Declará las cuatro variables: String, int, double y boolean.';
    case 3: return (re(/\ba\s*\+\s*b\b/) && re(/\ba\s*-\s*b\b/) && re(/\ba\s*\*\s*b\b/) && re(/\ba\s*\/\s*b\b/) && re(/\ba\s*%\s*b\b/)) ? '' : 'Calculá cada resultado con a y b, no escribas el número a mano.';
    case 4: return (has('.toUpperCase(') && has('.length(') && has('.charAt(') && has('.contains(')) ? '' : 'Usá los métodos .toUpperCase(), .length(), .charAt() y .contains().';
    case 5: return (has('(int)') && has('Math.round') && has('Math.sqrt')) ? '' : 'Usá el cast (int), Math.round() y Math.sqrt().';
    case 6: return (has('.trim()') && has('.toUpperCase()')) ? '' : 'Procesá el nombre con .trim() y .toUpperCase().';
    case 7: return (re(/\bif\b/) && re(/\belse\b/)) ? '' : 'Resolvelo con if / else: la categoría tiene que decidirla el programa.';
    case 8: return (re(/\bswitch\b/) && re(/\bcase\b/) && re(/\bdefault\b/)) ? '' : 'Usá switch con sus case y un default.';
    case 9: return has('&&') ? '' : 'Combiná las dos condiciones con &&.';
    case 10: return has('+') ? '' : 'Uní el texto y las variables con +.';
    case 11: return (re(/\bwhile\b/) && re(/\+\+|\+=/)) ? '' : 'Usá un while que incremente la variable.';
    case 12: return re(/\bfor\b/) ? '' : 'Usá un bucle for.';
    case 13: return (has('[]') && loop) ? '' : 'Recorré el array con un bucle.';
    case 15: return (loop && re(/\bif\b/)) ? '' : 'Recorré ventas con un bucle y usá un if para contar.';
    case 16: return (has('static void imprimirSeparador') && (code.split('imprimirSeparador').length > 3 || loop)) ? '' : 'Definí imprimirSeparador() y llamalo 3 veces.';
    case 17: return (has('static int calcularArea') && re(/\breturn\b/)) ? '' : 'calcularArea tiene que devolver el resultado con return.';
    case 18: return (has('class Persona') && has('new Persona(') && has('presentarse(')) ? '' : 'Creá la clase Persona, un objeto con new y llamá a presentarse().';
    case 19: return (has('Producto(String') && has('this.') && has('new Producto(')) ? '' : 'Definí el constructor de Producto, usá this y creá el objeto con new.';
    case 20: return (re(/private\s+String\s+nombre/) && re(/private\s+int\s+edad/) && has('getNombre') && has('setEdad')) ? '' : 'Usá atributos private con sus getters y setters.';
    case 21: return (has('extends Animal') && has('super(')) ? '' : 'Usá extends Animal y llamá a super().';
    case 22: return (has('extends Animal') && has('hacerSonido') && loop) ? '' : 'Perro y Gato tienen que sobrescribir hacerSonido() y el main recorrer un array de Animal.';
    case 23: return (re(/\binterface\b/) && re(/\bimplements\b/)) ? '' : 'Definí una interfaz y clases que la implementen.';
    case 24: return (has('ArrayList') && has('.add(') && has('.size(')) ? '' : 'Usá ArrayList con .add() y .size().';
    case 26: return (has('FileWriter') && has('BufferedWriter') && has('.write(') && re(/\bcatch\b/)) ? '' : 'Usá FileWriter, BufferedWriter, write() y un try-catch.';
    case 27: return (re(/\btry\b/) && has('Integer.parseInt') && re(/\bcatch\b/)) ? '' : 'Usá Integer.parseInt dentro de un try-catch.';
    case 28: return (has('extends Exception') && has('throw new') && re(/\btry\b/)) ? '' : 'Creá la excepción con extends Exception, lanzala con throw y atrapala con try-catch.';
    case 29:
      if (!re(/\bswitch\b/) || !re(/\bwhile\b/)) return 'El menú necesita switch dentro de un while.';
      if (!re(/\binterface\b/) || !re(/\bimplements\b/)) return 'Definí la interface Gestionable e implementala.';
      if (!has('ArrayList') || !re(/\bprivate\b/) || !re(/\btry\b/)) return 'Usá ArrayList, atributos private y try-catch.';
      return '';
    case 34:
      if (!has('class Libro') || !has('class Biblioteca')) return 'Creá las clases Libro y Biblioteca.';
      if (!re(/\bprivate\b/) || !has('ArrayList')) return 'Libro lleva atributos private y Biblioteca guarda los libros en un ArrayList.';
      if (!re(/\bswitch\b/) || !re(/\bwhile\b/) || !re(/\btry\b/)) return 'El menú necesita while, switch y try-catch.';
      return '';
  }
  return '';
}

function gitCommands(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map(function (l) {
    return l.replace(/^\s*(?:\/\/.*)?$/, '').trim();
  }).filter(Boolean);
}

function gitValidate(id, source) {
  var cmds = gitCommands(source);
  var file = id === 31 ? 'Main.java' : 'GestorNotas.java';
  var pendingAdd = false;
  var commits = 0;
  var logged = false;
  var restored = false;
  if (!cmds.length || cmds[0] !== 'git init') return { err: 'El primer comando tiene que ser git init: sin repositorio, Git no puede registrar nada.' };
  for (var i = 1; i < cmds.length; i++) {
    var c = cmds[i];
    if (!/^git\s/.test(c)) return { err: 'Línea "' + c + '": cada línea tiene que ser un comando git.' };
    if (/^git add\s+\S/.test(c)) { pendingAdd = true; continue; }
    if (/^git commit\b/.test(c)) {
      if (!pendingAdd) return { err: 'Antes de cada git commit hay que preparar los cambios con git add.' };
      if (!/-m\s+".+"/.test(c)) return { err: 'Cada commit lleva un mensaje: git commit -m "qué cambió".' };
      pendingAdd = false;
      commits++;
      continue;
    }
    if (/^git log\b/.test(c)) { logged = true; continue; }
    if (/^git (checkout|restore)\b/.test(c)) {
      if (!logged) return { err: 'Primero consultá el historial con git log para saber a qué commit volver.' };
      if (c.indexOf(file) === -1) return { err: 'Indicá qué archivo recuperar: ' + file + '.' };
      restored = true;
      continue;
    }
    if (/^git (status|diff)\b/.test(c)) continue;
    return { err: 'Revisá este comando: ' + c };
  }
  if (commits < 2) return { err: 'Hacé al menos 2 commits, uno por cada cambio del proyecto.' };
  if (!logged) return { err: 'Consultá el historial con git log.' };
  if (!restored) return { err: 'Recuperá la versión anterior con git checkout <commit> -- ' + file + '.' };
  return { ok: true, output: cmds.join('\n') };
}

function localValidate(id, c) {
  if (id === 31 || id === 33) return gitValidate(id, c);
  var res = judgeProgram(c, lessonExpected(id), lessonStdin(id));
  if (res.unsupported) {
    var missing = conceptCheck(id, c);
    return missing ? { err: missing } : { ok: true, unverified: res.unsupported };
  }
  if (res.simulated && !res.runtime) res.conceptErr = conceptCheck(id, c);
  return res;
}
