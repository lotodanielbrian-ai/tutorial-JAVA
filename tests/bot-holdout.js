// Batería independiente (holdout) de 30 preguntas reales de alumnos que NO se usan
// como keywords literales en bot.js: mide si JavaBot generaliza de verdad.
// Uso: node tests/bot-holdout.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ctx = { console };
vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });

['public/js/lessons.js', 'public/js/javarun.js', 'public/js/validate.js'].forEach(load);
vm.runInContext('this.LESSONS = LESSONS;', ctx);
for (const f of fs.readdirSync(path.join(ROOT, 'public/js')).sort()) {
  if (/^(practica-|fase2-).*\.js$/.test(f)) load('public/js/' + f);
}
['public/js/apilab.js', 'public/js/practica.js', 'public/js/guia-cero.js', 'public/js/bot.js'].forEach(load);
vm.runInContext('this.LESSONS_F2 = LESSONS_F2;', ctx);

const f1 = ctx.LESSONS;
const all = f1.concat(ctx.LESSONS_F2);

const HOLDOUT = [
  ['por qué mi programa no termina nunca', /bucle infinito/i],
  ['cómo paso de string a int', /convertir|parseInt/i],
  ['diferencia entre = y ==', /asignar.*comparar|= \(asignar\)/i],
  ['qué es null', /null/i],
  ['qué es un bean', /Bean/i],
  ['si pongo 5 / 2 por qué me da 2 y no 2.5', /División/i],
  ['por qué mi scanner se salta el nombre después de la edad', /Scanner/i],
  ['cuál es la diferencia entre array y arraylist', /ArrayList|Arrays/i],
  ['para qué sirve poner private en los atributos', /Encapsulamiento/i],
  ['qué hace la palabra super en una subclase', /Herencia/i],
  ['cuándo conviene crear una interfaz', /Interfaces/i],
  ['para qué pongo @Override arriba de un método', /Polimorfismo/i],
  ['cómo evito que el programa explote si escriben letras en vez de números', /try-catch|excepciones|convertir/i],
  ['cómo guardo datos en un archivo de texto', /archivos/i],
  ['cómo subo mi proyecto a github', /Git/i],
  ['qué diferencia hay entre get y post en una api', /HTTP|REST/i],
  ['por qué se usa controller service y repository separados', /capas/i],
  ['qué hace @Valid en un controlador', /@Valid|Validación/i],
  ['para qué sirve un mock en junit', /Testing|Mockito/i],
  ['qué es un contenedor en docker', /Docker/i],
  ['cómo filtro una lista en java moderno', /Streams|Optional/i],
  ['para qué sirve @Entity en una clase', /JPA|SQL/i],
  ['qué pasa si no cierro una llave al final del archivo', /compilación/i],
  ['por qué me imprime Persona@4e25154f en la consola', /toString/i],
  ['cómo genero un número al azar entre 1 y 10', /aleatorios|Random/i],
  ['qué significa que un método sea void', /Métodos/i],
  ['qué es el principio dry', /DRY/i],
  ['para qué sirve switch en vez de muchos if', /switch/i],
  ['qué son && y || en una condición', /lógicos/i],
  ['cómo sé qué versión de jdk tengo instalada', /instalar Java|JDK/i]
];

let passed = 0;
const misses = [];
for (const [q, rx] of HOLDOUT) {
  const ans = ctx.JavaBot.ask(q, { lesson: f1[0] });
  if (ans && rx.test(ans.title || '')) passed++;
  else misses.push({ q, got: ans ? ans.title : '(vacío)', expected: String(rx) });
}

// Pruebas de memoria por faceta + sugerencias con tipeo
let extraOk = true;
const check = (cond, msg) => { if (!cond) { extraOk = false; console.log('  FALLA: ' + msg); } };

ctx.JavaBot.ask('qué es un constructor', { lesson: f1[0] });
const fWhy = ctx.JavaBot.ask('por qué se usa', { lesson: f1[0] });
check(/Constructores/i.test(fWhy.title) && /Por qué y para qué/.test(fWhy.html) && !/Ejemplo cotidiano/.test(fWhy.html),
  'continuación "por qué se usa" debe responder solo el porqué de Constructores (dio: ' + fWhy.title + ')');

const fEx = ctx.JavaBot.ask('dame un ejemplo', { lesson: f1[0] });
check(/Constructores/i.test(fEx.title) && /Ejemplo de:/.test(fEx.html) && !/Por qué y para qué/.test(fEx.html),
  'continuación "dame un ejemplo" debe responder solo el ejemplo de Constructores (dio: ' + fEx.title + ')');

const typo1 = ctx.JavaBot.ask('escaner', { lesson: f1[0] });
check(/Scanner/i.test(typo1.html), 'tipeo "escaner" debe sugerir Scanner');

const typo2 = ctx.JavaBot.ask('sentencia fro', { lesson: f1[0] });
check(/Bucles|for/i.test(typo2.html), 'tipeo "sentencia fro" debe sugerir Bucles/for');

const pct = Math.round((passed / HOLDOUT.length) * 100);
console.log('JavaBot holdout: ' + passed + '/' + HOLDOUT.length + ' (' + pct + '%)');
misses.forEach(m => console.log('  [MISS] ' + m.q + ' => ' + m.got + ' (esperado ' + m.expected + ')'));

if (passed < 27 || !extraOk) {
  console.log('FALLA: el holdout exige >= 27/30 (90%) y memoria/sugerencias OK');
  process.exit(1);
}
console.log('OK: holdout >= 90% y memoria/sugerencias verificadas');
