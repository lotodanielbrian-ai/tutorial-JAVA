// Suite de regresión de JavaBot (motor offline + capa opcional Ollama).
// Protege casos aprobados, evita falsos positivos ("no tengo ficha" fuera de Java),
// verifica memoria por faceta, tipeos y fallback seguro cuando Ollama está apagado.
// Uso: node tests/bot-regression.js
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

// 1. Casos positivos de regresión (tienen que seguir respondiendo la ficha correcta)
const REGRESSION = [
  ['por qué mi if no entra nunca', /if \/ else|Condicionales/i],
  ['nunca entiendo los objetos', /Clases y Objetos/i],
  ['cómo comparo dos números', /if \/ else|comparación de números/i],
  ['cómo sé si un número es par', /División|par/i],
  ['qué es el garbage collector', /Garbage Collector/i],
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
  ['cómo sé qué versión de jdk tengo instalada', /instalar Java|JDK/i],
  ['¿puedo heredar de dos clases?', /Herencia/i],
  ['cómo mockeo un repositorio', /Testing|Mockito/i],
  ['qué es una variable de entorno', /entorno/i],
  ['no me compila y no sé por qué', /Revisión de tu código/i],
  ['arreglo bidimencional', /Matrices/i],
  ['por qué 0.1 + 0.2 no da 0.3 exacto en dinero', /BigDecimal/i],
  ['si sobrescribo equals tengo que implementar hashCode', /hashCode/i],
  ['diferencia entre excepción checked y unchecked', /checked/i],
  ['para qué sirven los records en Java', /Records/i],
  ['qué diferencia hay entre break y continue', /break y continue/i],
  ['por qué no debo usar @Data en una entidad JPA', /Lombok/i],
  ['qué es polimorfismo en programación orientada a objetos', /Polimorfismo/i],
  ['cómo leo un decimal con Scanner', /Scanner/i],
  ['cómo recorro una tabla de filas y columnas', /Matrices/i],
  ['por qué conviene usar DTO y no exponer la entidad', /capas|DTO|Records/i]
];

// 2. Casos negativos / fuera de tema (NO deben ser secuestrados por fichas ajenas)
const MUST_SAY_NOT_FOUND = [
  'cuánto dinero gana un programador java',
  'cómo subo una imagen a mi app',
  'quién ganó el mundial de fútbol'
];

let failures = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) { failures++; console.log('  FALLA: ' + msg); }
};

for (const [q, rx] of REGRESSION) {
  const ans = ctx.JavaBot.ask(q, { lesson: f1[0] });
  ok(ans && !ans.notFound && rx.test(ans.title || ''), '"' + q + '" respondió "' + (ans && ans.title) + '" (esperado ' + rx + ')');
}

for (const q of MUST_SAY_NOT_FOUND) {
  const ans = ctx.JavaBot.ask(q, { lesson: f1[0] });
  ok(ans && ans.notFound === true, '"' + q + '" debería decir sin ficha exacta (respondió: "' + (ans && ans.title) + '")');
}

// 3. Memoria por faceta y sugerencias con tipeo
ctx.JavaBot.ask('qué es un constructor', { lesson: f1[0] });
const fWhy = ctx.JavaBot.ask('por qué se usa', { lesson: f1[0] });
ok(/Constructores/i.test(fWhy.title) && /Por qué y para qué/.test(fWhy.html) && !/Ejemplo cotidiano/.test(fWhy.html),
  'continuación "por qué se usa" falló: ' + fWhy.title);

const fEx = ctx.JavaBot.ask('dame un ejemplo', { lesson: f1[0] });
ok(/Constructores/i.test(fEx.title) && /Ejemplo de:/.test(fEx.html) && !/Por qué y para qué/.test(fEx.html),
  'continuación "dame un ejemplo" falló: ' + fEx.title);

const fBp = ctx.JavaBot.ask('¿y alguna buena práctica?', { lesson: f1[0] });
ok(/Constructores/i.test(fBp.title) && /Buena práctica en:/.test(fBp.html),
  'continuación "¿y alguna buena práctica?" falló: ' + fBp.title);

const typo1 = ctx.JavaBot.ask('escaner', { lesson: f1[0] });
ok(/Scanner/i.test(typo1.html), 'tipeo "escaner" debe sugerir Scanner');

const typo2 = ctx.JavaBot.ask('sentencia fro', { lesson: f1[0] });
ok(/Bucles|for/i.test(typo2.html), 'tipeo "sentencia fro" debe sugerir Bucles/for');

// 4. Capa Ollama opcional: coseno, config por defecto apagada y fallback offline
ok(Math.abs(ctx.JavaBot.cosine([1, 0], [1, 0]) - 1) < 1e-6, 'cosine([1,0],[1,0]) debe dar 1');
ok(Math.abs(ctx.JavaBot.cosine([1, 0], [0, 1])) < 1e-6, 'cosine([1,0],[0,1]) debe dar 0');
ok(ctx.JavaBot.ollamaConfig().enabled === false, 'Ollama debe arrancar desactivado por defecto (opt-in)');

ctx.JavaBot.askAsync('qué es un constructor', { lesson: f1[0] }).then(ans => {
  ok(/Constructores/i.test(ans.title), 'askAsync en modo offline debe responder Constructores');
  if (failures) {
    console.log('\n' + failures + ' fallas en ' + checks + ' verificaciones de JavaBot');
    process.exit(1);
  }
  console.log('OK: ' + checks + ' verificaciones de regresión de JavaBot (positivos, "no sé", memoria, tipeos y capa Ollama)');
});
