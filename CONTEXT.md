# Contexto técnico

Referencia para desarrollar el tutorial Java INPRO. Lo que cambia seguido, como la cantidad de actividades, se consulta en el código o en `tests/run.js`.

## Qué es

Sitio estático en Firebase Hosting, sin paso de compilación: HTML, CSS y JavaScript sin frameworks. Cuenta y progreso con Firebase Auth y Firestore. El código del alumno se ejecuta en el navegador.

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `public/index.html` | Esqueleto, certificado, manual y overlays |
| `public/css/main.css` | Estilos. La sección "Práctica y evaluaciones" está al final |
| `public/js/lessons.js` | `LESSONS`: las 35 lecciones y los helpers `cb`, `ann`, `gl`, `jHL` |
| `public/js/javarun.js` | `JavaRun.run(fuente, { stdin })`: intérprete de Java |
| `public/js/validate.js` | `localValidate`, `judgeProgram`, `conceptCheck`, `gitValidate` y diagnósticos |
| `public/js/practica-*.js` | `PRACTICA`: actividades por lección, una por tramo |
| `public/js/practica.js` | `Practica`: dibuja y corrige actividades, simulacros y repaso |
| `public/js/fase2-*.js` | `LESSONS_F2` y las actividades de la Fase 2, un archivo por tramo |
| `public/js/apilab.js` | `ApiLab`: servidor simulado que copia las reglas de `kiosco-api` |
| `ejemplos/kiosco-api/` | Proyecto Spring Boot real de referencia |
| `public/js/app.js` | Render de lecciones, editor, quizzes y certificado |
| `public/js/progress.js` | Progreso por `uid`: Firestore y caché en `localStorage` |
| `public/js/ranking.js` | Puntaje, ranking e historial |
| `public/js/auth.js` | Login obligatorio con Google o Facebook |
| `firestore.rules` | Reglas de seguridad |
| `tests/run.js` | Suite completa. `tests/JavaOracle.java` compila y ejecuta con el JDK |
| `tests/spring-check.js` | Compila fragmentos con Spring, ejecuta SQL en H2 y compara `ApiLab` con la API real |
| `tests/corpus/` | Programas para comparar el intérprete con Java |
| `tests/wrong-programs.js` | Programas incorrectos que nunca deben aprobar |

El orden de los `<script>` importa: `lessons` → `javarun` → `validate` → `practica-*` → `fase2-*` → `apilab` → `practica` → `progress` → `ranking` → `auth` → `app`.

## Las dos fases

`app.js` tiene una variable `fase`. Las funciones `lessonList()` y `doneSet()` devuelven la lista y el progreso de la fase activa.

| | Fase 1 | Fase 2 |
|---|---|---|
| Lecciones | `LESSONS` | `LESSONS_F2` |
| Ids | 1 a 35 | 101 a 125 |
| Progreso | `done` | `doneF2`, en `progress/{uid}.fase2` |
| Ranking | Sí | No |
| Intentos en `attempts` | Sí | No |
| Conceptos a exigir | `conceptCheck` por id | `exercise.need` |

`fase2Unlocked()` exige las 35 lecciones. `generateCert2()` cambia el texto de `#cert-print` solo mientras imprime y después lo restaura: el primer certificado y su CSS no se tocan.

## Cómo se evalúa un ejercicio

```
runCode → localValidate(id, código)
            ├─ lecciones 31 y 33 → gitValidate (orden de los comandos)
            └─ judgeProgram → JavaRun.run
                 ├─ compile     → mensaje en español, con la línea
                 ├─ exception   → error de ejecución real
                 ├─ limit       → bucle infinito detectado
                 ├─ unsupported → solo conceptCheck, y lo avisa
                 └─ ok          → compara la salida y luego conceptCheck
```

Aprobar exige **dos** cosas: que la consola coincida y que se haya usado el concepto de la lección. Sin lo segundo, se podría imprimir el resultado a mano. Los textos dentro de strings no cuentan, porque `conceptCheck` trabaja sobre `maskJava`.

`checkJavaSyntax` y `simulateJava` son heurísticas antiguas con buenos mensajes, pero también con falsos errores. **Solo se usan después de que JavaRun confirma un error de compilación, y solo si señalan la misma línea.**

## Estructura de una lección

```js
{
  id, level, levelLabel, stars, title, desc,
  simple: () => '...html...',
  tutorial: () => '...html...',
  exercise: { desc, expected, starter, hints, stdin? },  // o bien:
  quiz: { passing, questions: [{ question, options, correct }] }
}
```

- `level`: `super`, `basico`, `inter`, `avanzado`, `examen` o `entrevista`.
- La última pista de un ejercicio es la solución, dentro de un `cb(...)`. Las pruebas la extraen y la compilan.
- `stdin` es la entrada que el emulador le entrega a `Scanner`.

## Estructura de la práctica

```js
PRACTICA[7] = {
  prev: 'qué conviene saber antes',
  objetivos: ['Lo que va a poder hacer'],
  escalera: { vida, modelo, pseudo, java, real },
  tramo: 'super',       // opcional: ofrece el simulacro de ese tramo
  items: [ ... ]
};
```

Todo ítem lleva `t`, `q` y `why`, y puede llevar `hint`. Excepción: `code` usa `title` y `task`.

| `t` | Campos propios | Se corrige con |
|---|---|---|
| `mc` | `o`, `a` (índice), `code?` | Comparación del índice |
| `tf` | `a` (boolean), `code?` | Comparación |
| `output` | `code`, `a` (texto), `stdin?` | Salida exacta, sin espacios finales |
| `fill` | `code` con `___`, `a: [[alternativas]]`, `out?`, `noRun?` | Cada hueco, ignorando espacios |
| `bug` | `code`, `line`, `fix`, `noRun?` | Línea elegida |
| `order` | `lines` en orden correcto, `java?`, `out?` | Secuencia |
| `match` | `pairs: [[izq, der]]` | Cada par |
| `short` | `any: [[sinónimos]]`, `model` | Un sinónimo de cada grupo, sin tildes ni mayúsculas |
| `code` | `title`, `task`, `starter`, `expected`, `solution`, `need`, `hint`, `stdin?` | `judgeProgram` y las expresiones de `need` |
| `http` | `task`, `goal`, `demo` | `ApiLab.reached`: verbo, ruta, estado y texto de la respuesta |

- Si `code` no contiene una clase, las pruebas lo envuelven en un `main`.
- `noRun: true` es para lo que no se puede ejecutar, como comandos git o fragmentos.
- `spring: true` compila el fragmento con Spring real en `tests/spring-check.js`. `sql: true` ejecuta la consulta en H2.
- `demo` en un ítem `http` son los pasos que cumplen el objetivo: la prueba los ejecuta.
- Un `bug` debe resolverse **cambiando una sola línea**, y `line` cuenta desde 1 sobre el código que se muestra.

**El identificador de un ítem es `lección-posición`.** Agregá actividades al final: si reordenás, los puntajes guardados apuntan a otra actividad.

## Datos en Firestore

| Ruta | Contenido |
|---|---|
| `users/{uid}` | Perfil, incluido el email. Solo lo lee quien es dueño |
| `progress/{uid}` | `completedLessons`, `certificateEarned`, `completionDate`, `practice` |
| `attempts/{uid}/lessons/{id}` | Intentos y mejor nota |
| `rankings/{uid}` | Ranking público |

`practice` guarda `{ scores: { '7-3': 1 }, wrong: ['7-5'], sims: [...] }`. Puntaje por ítem: 1 al primer intento, 0.5 al segundo, 0 si se reveló.

## Reglas que no hay que romper

- **Agregar una lección a `LESSONS` cambia su largo**: quienes ya tienen el certificado dejarían de tener el 100%, y hay que actualizar `firestore.rules`. Lo nuevo va en `LESSONS_F2` o en `PRACTICA`.
- **Actividades de la Fase 1:** van en `practica-5-extra.js` con `push`, para no mover los ítems existentes.
- **`ApiLab` copia a `kiosco-api`:** si cambia una regla de la API, cambiala en los dos lados. `spring-check.js` lo detecta.
- **Repositorio público:** nada de `material/`, salvo su README. Ni videos, ni transcripciones, ni PDF del instituto.
- **Reglas y sitio se publican juntos.** Si cambiás el puntaje máximo (`MAX_TOTAL` en `ranking.js`), actualizá `validRanking()`.
- **Nada de progreso en claves globales de `localStorage`**: siempre por `uid`, para que dos cuentas no se mezclen.
- **UTF-8 siempre.** El contenido tiene acentos y emojis.
- **Mapas en `javarun.js`:** creá los diccionarios con `dict()`. Con un objeto común, `toString` parece una clave existente.
- **No tocar `@media print` sin probar la impresión** del manual y del certificado.

## Cómo agregar actividades

1. Agregá el ítem al final de `items` en el `practica-*.js` que corresponda.
2. Corré `node tests/run.js`. Java real verifica la respuesta.
3. Si la prueba dice que JavaRun se comporta distinto, corregí el intérprete o reescribí el ítem.

## Límites de JavaRun

Es un intérprete sin análisis de tipos completo. Sí detecta, porque el curso lo enseña: tipos incompatibles, cast faltante, variable sin inicializar, `private`, `static`, `import` faltante, `final`, método abstracto sin implementar, `@Override` inválido, `return` faltante, excepciones checked sin manejar, orden de `catch` y métodos ausentes en el tipo declarado.

Soporta `record`, `enum`, `Map`, `Optional`, lambdas, referencias a métodos y streams básicos.

No detecta símbolos inexistentes en ramas que no se ejecutan. No soporta Spring, `HashSet`, varargs, clases anónimas ni `break` con etiqueta: devuelve `unsupported`, y el validador lo informa.

## Comandos

```bash
node tests/run.js                                  # pruebas: requiere Node y un JDK
node tests/spring-check.js                         # Spring, SQL y API real: requiere además Maven
py -m http.server 8765 --directory public          # sitio en local
firebase deploy --only hosting,firestore           # publicar sitio y reglas
./mvnw spring-boot:run                             # en ejemplos/kiosco-api
```
