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

function localValidate(id, c) {
  var isGitLesson = (id === 31 || id === 33);
  if (!isGitLesson) {
    var syntaxErr = checkJavaSyntax(c);
    if (syntaxErr) return syntaxErr;
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
    case 32: return { ok: false, err: "Esta lección es un cuestionario. Andá a la pestaña Cuestionario para completarlo." };
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