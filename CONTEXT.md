# Contexto técnico

Referencia para desarrollar el tutorial Java INPRO. Lo que cambia seguido, como la cantidad de actividades, se consulta en el código o en `tests/run.js`.

## Qué es

Sitio estático en Firebase Hosting, sin paso de compilación: HTML, CSS y JavaScript sin frameworks. Cuenta y progreso con Firebase Auth y Firestore. El código del alumno se ejecuta en el navegador.

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `public/index.html` | Esqueleto, certificado y overlays |
| `public/js/ui.js` | `UI.confirm` y `UI.alert`: diálogos propios. No usar `confirm()` ni `alert()` del navegador (la prueba de navegador falla si aparecen) |
| `public/manual.html` | El libro "Java desde cero": se arma con `LESSONS` y `PRACTICA`, más `manual-contenido.js` (capítulo 0, partes, apéndices) y `manual-figuras.js` (una figura SVG por capítulo). Lo arma `manual.js` |
| `public/css/manual.css` · `manual-print.css` | El libro en pantalla (oscuro, interactivo) y en hojas A4 (claro, con índice paginado) |
| `tools/manual-pdf.js` | Genera `public/manual/java-desde-cero.pdf` con Paged.js 0.4.3 y Edge o Chrome. Corre solo antes de cada deploy |
| `public/css/main.css` | Estilos. La sección "Práctica y evaluaciones" está al final |
| `public/js/lessons.js` | `LESSONS`: las 35 lecciones y los helpers `cb`, `ann`, `gl`, `jHL` |
| `public/js/javarun.js` | `JavaRun.run(fuente, { stdin })`: intérprete de Java |
| `public/js/validate.js` | `localValidate`, `judgeProgram`, `conceptCheck`, `gitValidate` y diagnósticos |
| `public/js/practica-*.js` | `PRACTICA`: actividades por lección, una por tramo |
| `public/js/practica-6-ayudas.js` | Pista del segundo intento, explicación de cada pregunta y pregunta previa. Va aparte para no mover las actividades |
| `public/js/practica.js` | `Practica`: dibuja y corrige actividades, repaso espaciado, simulacros, parcial práctico, ping-pong y panel |
| `public/js/fase2-*.js` | `LESSONS_F2` y las actividades de la Fase 2, un archivo por tramo |
| `public/js/apilab.js` | `ApiLab`: servidor simulado que copia las reglas de `kiosco-api` |
| `ejemplos/kiosco-api/` | Proyecto Spring Boot real de referencia |
| `public/js/app.js` | Render de lecciones, editor, quizzes y certificado |
| `public/js/progress.js` | Progreso por `uid`: Firestore y caché en `localStorage` |
| `public/js/ranking.js` | Puntaje, ranking e historial |
| `public/js/auth.js` | Login obligatorio con Google o Facebook |
| `firestore.rules` | Reglas de seguridad |
| `tests/run.js` | Suite completa. `tests/JavaOracle.java` compila y ejecuta con el JDK |
| `tests/sync.js` | Guardado contra un Firestore simulado: carga fallida, dos pestañas, reiniciar en varios navegadores y ranking sin emails |
| `tests/spring-check.js` | Compila fragmentos con Spring, ejecuta SQL en H2 y compara `ApiLab` con la API real |
| `tests/browser.js` | Prueba en Edge o Chrome con Firebase simulado, y mide cada pantalla a 360 px. El guion está en `tests/browser-scenario.js` |
| `tests/corpus/` | Programas para comparar el intérprete con Java. `Valido.java` junta casos correctos que una revisión torpe rechazaría |
| `tests/javac-rejects.js` | Programas que javac rechaza aunque el error esté en código que no se ejecuta |
| `tests/wrong-programs.js` | Programas incorrectos que nunca deben aprobar |
| `.github/workflows/pruebas.yml` | Corre todo en cada push y levanta `docker compose` de verdad |

El orden de los `<script>` importa: `lessons` → `javarun` → `validate` → `practica-1` a `5` → `fase2-*` → `practica-6-ayudas` → `apilab` → `practica` → `progress` → `ranking` → `auth` → `app`.

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

`fase2Unlocked()` exige las 35 lecciones o la prueba de nivel (`fase2.accredited`). La prueba no marca lecciones: el primer certificado sigue pidiendo las 35. `generateCert2()` cambia el texto de `#cert-print` solo mientras imprime y después lo restaura: el primer certificado y su CSS no se tocan.

## Cómo se evalúa un ejercicio

```
runCode → localValidate(id, código)
            ├─ lecciones 31 y 33 → gitValidate (orden de los comandos)
            └─ judgeProgram → JavaRun.run
                 ├─ compile     → mensaje en español, con la línea
                 ├─ exception   → error de ejecución real
                 ├─ limit       → bucle infinito detectado
                 ├─ unsupported → se rechaza y se explica
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
- La última pista de un ejercicio es la solución, dentro de un `cb(...)`. Las pruebas la extraen y la compilan. **Nunca llega sola:** `app.js` separa lo que hay antes de "La solución" como pista, agrega la estructura con `Practica.skeleton` y ofrece la solución aparte después de 3 fallos. Pedirla agrega el ejercicio al repaso.
- `stdin` es la entrada que el emulador le entrega a `Scanner`.

## Estructura de la práctica

```js
PRACTICA[7] = {
  prev: 'qué conviene saber antes',
  objetivos: ['Lo que va a poder hacer'],
  escalera: { vida, modelo, pseudo, java, real },
  tramo: 'super',       // opcional: ofrece el simulacro de ese tramo
  antes: [pregunta, respuesta],  // opcional: en practica-6-ayudas.js
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
| `short` | `any: [[sinónimos]]`, `model` | Lo decide quien responde, comparando con `model`. `any` solo avisa si falta una idea clave |
| `code` | `title`, `task`, `starter`, `expected`, `solution`, `need`, `hint`, `stdin?` | `judgeProgram` y las expresiones de `need` |
| `http` | `task`, `goal`, `demo` | `ApiLab.reached`: verbo, ruta, estado y texto de la respuesta |
| `step` | `do`, `cmd?`, `ok`, `fail?` | Quien lo hace marca que lo comprobó. No vuelve al repaso |

- Si `code` no contiene una clase, las pruebas lo envuelven en un `main`.
- `noRun: true` es para lo que no se puede ejecutar, como comandos git o fragmentos.
- `spring: true` compila el fragmento con Spring real en `tests/spring-check.js`. `sql: true` ejecuta la consulta en H2.
- `demo` en un ítem `http` son los pasos que cumplen el objetivo: la prueba los ejecuta.
- Un `bug` debe resolverse **cambiando una sola línea**, y `line` cuenta desde 1 sobre el código que se muestra.

**El identificador de un ítem es `lección-posición`.** Agregá actividades al final: si reordenás, los puntajes guardados apuntan a otra actividad. `x7` es el ejercicio de la lección 7: lo usan el parcial práctico y el repaso.

Los simulacros solo usan actividades con corrección objetiva: ni `short`, que va al ping-pong, ni `code`, `http` y `step`.

## Datos en Firestore

| Ruta | Contenido |
|---|---|
| `users/{uid}` | Perfil, incluido el email. Solo lo lee quien es dueño |
| `progress/{uid}` | `completedLessons`, `certificateEarned`, `completionDate`, `practice`, `fase2`, `place` |
| `attempts/{uid}/lessons/{id}` | Intentos y mejor nota |
| `rankings/{uid}` | Ranking público |

`practice` guarda `{ scores: { '7-3': 1 }, wrong: ['7-5'], sims: [...], reviews: { '7-3': { box, due, at } }, help: { 8: fecha } }`. Puntaje por ítem: 1 al primer intento, 0.5 al segundo, 0 si se reveló.

**Repaso espaciado.** `reviews` decide cuándo vuelve cada actividad. Acertar sube de caja (1, 3, 7, 14 y 30 días) y fallar la trae mañana, con `box: 0`. Mientras espera queda bloqueada, para que ver la respuesta y repetir no cuente. Repetir antes de la fecha no suma. Una actividad con `box: 0` vale como máximo 0.5 en el dominio. Entre dispositivos gana el `at` más reciente (`mergePractice`).

**Escrituras que suman.** `syncProgress`, `saveFase2`, la práctica y `Ranking.update` escriben dentro de una transacción que lee lo que ya está en la nube y lo combina: las lecciones se unen, las fechas se quedan con la primera y el puntaje no baja. Así ninguna pestaña ni dispositivo borra lo de otro. Si `loadRemote` falla devuelve `{ failed: true }`: la app abre con la caché, avisa y reintenta, y nunca lo toma como cero lecciones. Lo que no se pudo subir se reintenta con el evento `online`.

**Reiniciar.** `resetRemote` no borra `progress/{uid}`: lo reemplaza por `{ resetAt: <id único> }` y borra ranking e intentos. Cada navegador guarda la última marca que vio en `java_reset_gen:<uid>`. Al entrar, si la nube tiene otra marca, la caché local es de antes del reinicio y se descarta. Una pestaña abierta que escribe con una marca vieja recibe `RESET_ELSEWHERE`: no sube nada, borra su caché, adopta la marca nueva (así no entra en un bucle de recargas) y queda congelada hasta recargar. `saveAttempt` también lo comprueba.

`place` guarda `{ fase, f1, f2, at }`, con ids de lección: el reingreso vuelve ahí. Los borradores del editor quedan solo en `localStorage`, en `java_draft_<id>:<uid>`.

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

## El manual

`manual.html` no tiene texto propio de las lecciones: cada capítulo sale de la lección y de su práctica (escalera, objetivos, pregunta previa, "La idea en simple", "En detalle", actividades y desafío). **Corregir una lección corrige el libro.** Las respuestas van al apéndice A y las soluciones (la última pista de cada ejercicio) al B; el glosario sale de los `gl()` de las lecciones.

- En pantalla, los bloques con `main` tienen ▶ Ejecutar y ✎ Editar (usa `JavaRun`), y las respuestas arrancan tapadas.
- Con `?print=1` queda listo para paginar. `node tools/manual-pdf.js` genera el PDF y **falla** si hay errores de JavaScript, entradas del índice sin página o algo más ancho que la hoja. `SHOTS=1,20 REPORT=1` deja capturas y detalles en `tools/.cache`.
- Paged.js aplica las reglas `@media print` de `main.css`, que ocultan todo para imprimir el certificado: `manual-print.css` lo vuelve visible.
- Paged.js descarta los nodos de texto que son solo espacios: `manual.js` pasa los saltos del código a `<br>` en modo impresión. Las cajas con `overflow:hidden` no se parten entre hojas: en la hoja impresa van visibles.
- El PDF no se versiona (pesa ~14 MB): `firebase.json` lo genera en `predeploy`.

## Cómo agregar actividades

1. Agregá el ítem al final de `items` en el `practica-*.js` que corresponda.
2. Corré `node tests/run.js`. Java real verifica la respuesta.
3. Si la prueba dice que JavaRun se comporta distinto, corregí el intérprete o reescribí el ítem.

## Límites de JavaRun

Es un intérprete sin análisis de tipos completo. Sí detecta, porque el curso lo enseña: tipos incompatibles, cast faltante, variable sin inicializar, `private`, `static`, `import` faltante, `final`, método abstracto sin implementar, `@Override` inválido, `return` faltante, excepciones checked sin manejar, orden de `catch` y métodos ausentes en el tipo declarado.

`reviewCode` y `reviewClasses` revisan todo el programa antes de ejecutarlo, también las ramas que no se recorren: símbolos, métodos, tipos simples, código inalcanzable, `break` fuera de lugar, `case` y métodos duplicados, herencia de `final`, sobrescrituras incompatibles y genéricos con primitivos. **Regla: ante la duda, no marcar.** Un programa correcto rechazado es peor que un error que se detecta al ejecutar. Por eso los tipos desconocidos pasan, y `tests/corpus/Valido.java` vigila los falsos rechazos.

Soporta `record`, `enum`, `Map`, `Set`, `Optional`, lambdas, referencias a métodos y streams básicos. `HashSet` y `HashMap` recorren en el mismo orden que Java.

No soporta Spring, varargs, clases anónimas, clases internas que usan al objeto externo, etiquetas ni bloques de texto: devuelve `unsupported`, y el validador lo rechaza con una explicación.

## Comandos

```bash
node tests/run.js                                  # pruebas: requiere Node y un JDK
node tests/sync.js                                 # guardado del progreso: solo Node
node tools/manual-pdf.js                           # el manual en PDF A4: requiere Edge o Chrome
node tests/spring-check.js                         # Spring, SQL y API real: requiere además Maven
node tests/browser.js                              # navegador real: requiere Edge o Chrome
VIEWS=practica,pasos node tests/browser.js         # solo esas pantallas, a 360 px
py -m http.server 8765 --directory public          # sitio en local
firebase deploy --only hosting,firestore           # publicar sitio y reglas
./mvnw spring-boot:run                             # en ejemplos/kiosco-api
```
