# Auditoría del tutorial Java INPRO

**Fecha:** 30 de octubre de 2026
**Alcance:** código de `public/`, contenido de las 35 lecciones, reglas de Firebase, archivos del repositorio y material del Módulo Didáctico 2024.

## Resultado

El contenido teórico era sólido, pero la evaluación no medía lo que decía medir. El botón **Ejecutar** solo ejecutaba programas de pocos `println`. Desde la lección 7 buscaba palabras en el texto, así que aprobaba programas incorrectos y rechazaba soluciones correctas.

| Medición | Antes | Después |
|---|---|---|
| Programas incorrectos de prueba que aprobaban | 6 de 8 | 0 de 17 |
| Soluciones oficiales rechazadas por el validador | 4 (lecciones 5, 17, 20 y 29) | 0 |
| Lecciones con preguntas que mostraban "undefined" | 2 (30 y 32) | 0 |
| Tipos de actividad | 2 (opción múltiple y código) | 9 |
| Actividades evaluables | 30 ejercicios y 29 preguntas | Las mismas, más 313 nuevas |
| Pruebas automáticas | Ninguna | 2.875 verificaciones contra el JDK real |

## Cómo se auditó

- Se compilaron y ejecutaron con **javac/java 17** las soluciones oficiales y los ejemplos del tutorial.
- Se probaron programas incorrectos a propósito contra el validador.
- Se leyó el código de la aplicación y las reglas de Firestore.
- Se compararon los HTML legados contra `public/`, lección por lección.
- Se usó en **Edge** real, con Firebase simulado: 42 pasos en escritorio, más capturas en escritorio y móvil.

## Hallazgos corregidos

### Críticos

| # | Problema | Efecto | Solución |
|---|---|---|---|
| 1 | El validador buscaba palabras clave y no ejecutaba | Seis `println` aprobaban la lección de `while`; un `for` que imprimía cualquier cosa aprobaba la de `for` | Intérprete real (`javarun.js`) que compara la salida y exige usar el concepto de la lección |
| 2 | Falsos errores del emulador | Las soluciones oficiales de las lecciones 5, 17, 20 y 29 se marcaban como incorrectas | El intérprete decide primero; las heurísticas solo mejoran el mensaje de un error real |
| 3 | La lección 34 tenía `expected` vacío | El proyecto final se aprobaba **sin escribir nada**. El camino oficial (comandos git sueltos en un `.java`) no compilaba | Proyecto con entrada simulada y salida exacta, con solución verificada. Git se evalúa en su pestaña Práctica |
| 4 | Las lecciones 30 y 32 usaban `q` en vez de `question` | Cuestionarios con "undefined" como pregunta | Datos corregidos y prueba automática |
| 5 | Las reglas de Firestore limitaban a 34 lecciones y 500 puntos, según la copia local. No se pudo confirmar cuáles están publicadas | Al completar las 35, el ranking dejaría de actualizarse y el bono de certificado no llegaría | Reglas en 35 lecciones, 75 de quizzes y 525 puntos. Publicadas |

### Altos

| # | Problema | Solución |
|---|---|---|
| 6 | `users/{uid}` tenía lectura pública, y ese documento guarda el **email** | Solo lo lee quien es dueño. El ranking usa otra colección. Publicado |
| 7 | La fecha del certificado se reescribía en cada ejercicio y en cada inicio de sesión | Se fija una sola vez y se recupera desde Firestore |
| 8 | El certificado no aparecía si la última lección era un cuestionario, como la 35 | Se ofrece al completar por cualquier vía |
| 9 | El quiz 35 no sumaba puntos en el ranking | Agregado, y el código comparte una sola lista |
| 10 | `firestore.rules`, los índices y `.gitignore` existían solo en `repo original/`, fuera de git | Recuperados en la raíz y versionados |
| 11 | La solución de la lección 29 no imprimía el output esperado | Reescrita con `Scanner` real y verificada |

### Medios

| # | Problema | Solución |
|---|---|---|
| 12 | Diez lecciones tenían una explicación simple de 250 a 550 caracteres, contra unos 1.300 del resto | Escalera "De la vida diaria al código" en las 35 lecciones |
| 13 | Toda la evaluación era opción múltiple o código | Nueve tipos, con devolución inmediata |
| 14 | Los quizzes se podían enviar en blanco | Se exigen todas las respuestas |
| 15 | "Scanner no funciona en esta consola" | Funciona con entrada simulada, y la lección 10 ya lo usa de verdad |
| 16 | Mini-quizzes y pistas sin tildes ni signo de apertura | 345 correcciones solo en texto visible, sin tocar código |
| 17 | Un `println` partido en dos líneas daba un falso error | Resuelto por el mismo cambio del hallazgo 2 |
| 18 | Salidas esperadas sin escapar en HTML | Escapadas |
| 19 | La fila de botones de la barra lateral se desbordaba | Ajuste con varias líneas |

### Limpieza de archivos

| Archivo | Por qué se quitó |
|---|---|
| `introduccion a java/java-tutorial-v2.html` | Copia idéntica byte a byte de la de `HTML JAVA/` |
| `HTML JAVA/java-tutorial-v2.html` | Versión vieja de 28 lecciones |
| `repo original/java-tutorial-v2.html` | Versión de 34 lecciones. El texto de cada lección coincide con `public/` |
| `repo original/public/index.html` | Versión anterior del sitio |

Los cuatro quedaron en la **Papelera de reciclaje**, porque no estaban en git. Antes de quitarlos se comparó el texto de las 34 lecciones: no había contenido único. Solo queda `public/index.html`.

## Decisión pedagógica

El curso sigue una secuencia de andamiaje, que va retirando la ayuda a medida que crece la autonomía:

1. **Vida diaria:** una situación conocida, como repartir facturas o un cajero.
2. **La idea:** el concepto, sin código.
3. **En pasos:** el pseudocódigo.
4. **En Java:** la sintaxis.
5. **En un sistema real:** para qué se usa en un trabajo.

Las actividades repiten esa escala: reconocer, leer código, completar, encontrar el error, explicar con palabras propias y escribir desde cero. Además:

- **Devolución inmediata y explicada:** cada respuesta explica el porqué, no solo si estuvo bien.
- **Dos intentos:** primero una pista y después la respuesta. Es una forma de aprender del error.
- **Maestría:** la meta es 80% de dominio por lección.
- **Repaso de errores:** lo fallado vuelve hasta resolverlo.
- **Evaluación sin ayudas:** los simulacros no dan pistas hasta entregar, y dicen qué lecciones repasar.
- **Práctica auténtica:** la lección 29 reproduce el Parcial 1 real de la materia, con su criterio de puntaje.

Las respuestas abiertas se corrigen por palabras clave, que no leen matices. Por eso, después de dos intentos la persona ve la respuesta modelo y puede autoevaluarse. La práctica mide dominio aparte: **no cambia el certificado ni el ranking**, y nadie pierde su progreso.

El programa no incluye SQL. La única "consulta" del curso es consultar el historial con Git, así que "encontrar el error en la consulta" se resolvió con comandos `git`, `javac` y `java`.

## Limitaciones conocidas

- **El intérprete no reemplaza a javac.** Detecta los errores que enseña el curso, pero sin un análisis de tipos completo. Un error en una rama que no se ejecuta, como una variable mal escrita, puede pasar sin aviso.
- **Sin soporte:** `HashMap`, `enum`, `record`, lambdas y streams. Si un alumno los usa, se revisa la estructura y se avisa que la salida no se verificó.
- **El puntaje se calcula en el navegador.** Las reglas acotan los valores, pero una persona con conocimientos podría escribirse un puntaje alto dentro de esos límites.
- **Las respuestas abiertas** dependen de palabras clave, compensadas con la autoevaluación.
- **Los quizzes originales** muestran la respuesta correcta al fallar y no explican el porqué.

## Propuestas pendientes

Ordenadas por impacto sobre el aprendizaje y el producto.

| Prioridad | Propuesta | Por qué |
|---|---|---|
| Alta | Agregar explicación a las preguntas de los quizzes originales | Hoy son la parte con menos devolución |
| Alta | Calcular el ranking en una Cloud Function | Es la única forma de que el puntaje sea confiable |
| Media | Lecciones de `HashMap`, `enum`, testing con JUnit y SOLID | Se piden en entrevistas junior y el curso no las cubre |
| Media | Repetición espaciada por fechas en el repaso | Hoy el repaso no considera cuánto tiempo pasó |
| Media | Panel docente con resultados por tema | Permitiría ver dónde se traba un grupo |
| Media | Acceso por teclado en los quizzes originales | Hoy dependen del mouse |
| Baja | Compilación real en servidor (Judge0) | Cerraría las limitaciones del intérprete, con costo de infraestructura |
| Baja | Unificar los archivos y minificarlos | El sitio creció y carga más JavaScript |
| Baja | Encabezado Content-Security-Policy | Una capa más contra inyección de código |

## Auditoría del segundo semestre

**Fecha:** 30 de octubre de 2026. Se revisó `PR1 - Agosto 2026`: 9 clases en video, con transcripción automática.

| Hallazgo | Decisión |
|---|---|
| El repositorio es público, y los videos muestran caras, nombres y voces de compañeros | Videos y transcripciones quedan fuera de git |
| Cada video pesa más de 100 MB, el límite de GitHub | Quedan en Descargas |
| Las transcripciones confunden términos: "Sprint" por Spring, "Moquito" por Mockito | Los conceptos se reescribieron y se verificaron con código real |
| No está el enunciado escrito de los parciales | Se reconstruyeron los criterios desde las clases, con enunciados propios |
| Faltan las clases 10 a 12 y el segundo parcial | Quedan como pendiente en el plan |

### Error encontrado después de publicar

La pestaña **Práctica se veía vacía en las lecciones con cuestionario** (14, 25, 30, 32 y 35). `buildQuiz` abría un `<div>` sin cerrarlo, y esa pestaña quedaba dentro de la del cuestionario, que está oculta. Las pruebas contaban elementos en el DOM y pasaban. Ahora se comprueba que se vea en cada lección.

### Auditoría previa a publicar la Fase 2

Se revisó con ojo crítico lo que las pruebas todavía no cubrían. Todo quedó corregido.

| Hallazgo | Efecto | Solución |
|---|---|---|
| Ids repetidos entre el simulacro y la lección abierta | El simulacro leía la respuesta de la lección de atrás y la daba por errónea | Se vacía la práctica de atrás mientras dura el simulacro |
| Las 64 preguntas de cuestionario de la Fase 2 tenían la correcta en la opción A | Se aprobaba sin leer | Las opciones se mezclan en cada intento |
| El repaso de errores incluía retos de código | Quedaban como "sin responder" | Solo entran actividades que se puedan responder ahí |
| `ArrayList<int>` y `Optional<String>` sin escapar | El navegador borraba el `<...>` | Escapados, con prueba permanente de HTML |
| El certificado 2 ocupaba 3 páginas | Se repetía al imprimir | Se oculta el resto de la página, solo para este certificado |
| El manejador global convertía en 500 los errores de Spring | Una ruta o un id inválidos daban 500 | Hereda de `ResponseEntityExceptionHandler` |
| Falsos errores del intérprete en Java válido | Atributo privado repetido en una hija, clase anidada calificada, `getClass` en un número | Corregidos, con un corpus de casos difíciles |
| Etiquetas, bloques de texto y clases internas | Daban un error falso | Ahora figuran como no soportados |

### Errores que detectó la verificación

| Qué se probó | Qué apareció |
|---|---|
| Levantar la API de ejemplo | Un verbo no permitido daba 500 en vez de 405 |
| Correr sus tests | `@EnableJpaAuditing` en la clase principal rompe `@WebMvcTest` |
| Ejecutar el SQL en H2 | Una consulta "corregida" no era válida, y un `JOIN` sin `ON` no falla: combina todas las filas |

Los tres quedaron como contenido de las lecciones.

## Segunda auditoría: 31 de octubre de 2026

**Conclusión:** la base estaba sana. El contenido enseña bien y la corrección de ejercicios es sólida: 42 de 44 ejercicios rechazaban imprimir la salida a mano. El punto débil era que el sitio no recordaba al alumno: no sabía dónde quedó, qué olvidó ni qué le convenía hacer hoy.

| Medición | Antes | Después |
|---|---|---|
| Ejercicios que entregaban la solución sin pedirla | 44 de 44 | 0 |
| Preguntas de cuestionario con explicación | 0 de 93 | 93 de 93 |
| Actividades de error y opción múltiple con pista propia | 0 de 139 | 141 de 141 |
| Programas que javac rechaza y JavaRun también | 36 de 52 | 52 de 52, con un banco permanente de 31 casos |
| Elegir siempre la opción más larga | 65% de aciertos | 48% |
| Responder siempre "Falso" | 63% de aciertos | 49% |
| Pantallas con desborde horizontal a 360 px | 4 de 9 | 0 de 9 |
| Código perdido al cerrar Evaluaciones o cambiar de lección | Sí | No |
| Reingreso en la lección donde quedó | No | Sí |
| Repaso por fechas | No | Sí, sobre 519 actividades |

### Errores corregidos

| Hallazgo | Efecto | Solución |
|---|---|---|
| Cada fallo abría otra pista y la última era la solución, con el rótulo "no da la respuesta" | Se aprobaba copiando, sin costo | Pistas con estructura y huecos. La solución se pide aparte y agrega el ejercicio al repaso |
| `closeSimulacro` redibujaba toda la lección y no había borradores | Se perdía el código escrito | Solo redibuja si hubo examen, y hay borradores por lección y usuario |
| `currentLesson` se guardaba y nunca se leía | Cada ingreso arrancaba en la lección 1 | Se guarda `place` y se vuelve ahí |
| Un error de simulacro en algo aprobado desaparecía al recargar | Se perdía lo que más había que repasar | Se combina por fecha, y el dominio baja |
| La Práctica no mostraba lo resuelto, y salir y volver reiniciaba los intentos | Ver la respuesta y repetir daba 100% | Estado por actividad. Lo fallado espera hasta mañana |
| 37 de 56 respuestas abiertas se aprobaban con una sola idea clave | Una palabra daba "¡Bien!" | Mínimo de texto, comparación con la respuesta y autoevaluación en tres niveles |
| Un programa con etiquetas y salida incorrecta aprobaba cinco ejercicios | Aprobación sin verificar | `unsupported` se rechaza, igual que en los retos |
| "Clase abstracta" aparecía dos veces en una actividad de Unir | Una respuesta correcta se marcaba mal | Se compara el texto, y las opciones no se repiten |
| `main` sin `min-width:0` | Una tabla ensanchaba toda la pantalla en el teléfono | Corregido, con medición permanente |
| El botón Fase 1 no respondía desde la vista bloqueada | Había que usar otro botón | Corregido |
| La página decía 35 lecciones | Dato viejo | Corregido, y el costado muestra la fase activa |

### Errores que detectó la verificación

| Qué se probó | Qué apareció |
|---|---|
| Encender Docker en esta PC | La virtualización está apagada en el BIOS: WSL2 no arranca. Es un requisito del parcial, y quedó en la lección 124 como primer paso |
| Comparar el proyecto con la clase 9 | El profesor nombró `@ApiResponse` y `@Parameter`, y el ejemplo y la lección 119 solo usaban `@Tag` y `@Operation` |
| Banco de Java válido contra la revisión nueva | Dos errores viejos: una variable declarada en otro `case` y `name()` dentro de un `enum` daban falso rechazo |
| Medir a 360 px con emulación móvil | `innerWidth` crece con la página y daba un falso OK: hay que comparar contra el ancho del teléfono |

### Propuestas pendientes

| Propuesta | Por qué |
|---|---|
| Reescribir distractores de los cuestionarios | En 35 de 93 preguntas la correcta sigue siendo claramente la más larga. Las 22 corregidas eran de la Práctica |
| Puntos clave por respuesta abierta | Hoy se compara contra una respuesta modelo. Una lista de ideas calibraría mejor la autoevaluación |
| Búsqueda entre fases | El buscador mira el contenido, pero solo de la fase activa |
| Pistas por opción elegida | Hoy la pista es una por actividad, no una por cada error posible |
| CSP | Primero hay que sacar los `onclick` en línea |

## Tercera auditoría: 17 de noviembre de 2026

**Pregunta:** ¿alguien que nunca programó sale sabiendo Java: qué es, para qué sirve, qué se puede hacer y qué no?

**Conclusión:** el motor sigue siendo lo más sólido del proyecto. Lo que falla es lo que lo rodea:
- el progreso se puede perder;
- 7 cuestionarios se aprueban sin leer;
- unas 25 afirmaciones del contenido enseñan algo falso;
- falta el primer paso: no hay una entrada que explique qué es Java antes de escribir `public static void main`.

Se cruzó con una auditoría externa: lo que se pudo confirmar en el código está incluido y lo que no, descartado al final.

### Puntaje

| Área | Nota | Por qué |
|---|---|---|
| Corrección automática e intérprete | 8,5 | 40.899 verificaciones; igual que Java en 321 programas. Algunos falsos rechazos y un fallo interno sin atrapar |
| Actividades de la Fase 1 | 7,5 | Variadas y explicadas; unas 15 con una respuesta discutible o demasiado estrecha |
| Interfaz y móvil | 7 | Sin errores de JavaScript ni desborde a 360 px, pero con fallas de teclado y de diálogos |
| Contenido de la Fase 2 | 7 | Fiel al proyecto real; 8 errores, uno de configuración que rompe Docker |
| Contenido de la Fase 1 | 6,5 | La escalera funciona; unas 15 afirmaciones falsas y consignas que contradicen la salida |
| Validez de los cuestionarios | 5 | 7 de 16 se aprueban eligiendo siempre la opción más larga |
| Guardado del progreso | 4 | Una carga fallida o dos pestañas abiertas pueden borrar el avance |
| Práctica de código en la Fase 2 | 4 | Solo 3 de 25 lecciones hacen escribir código |
| Orientación para alguien de cero | 4 | No explica qué es Java, dónde se usa, qué no conviene hacer con él ni cómo instalarlo |
| **Global** | **6** | Base técnica muy sólida; faltan el primer paso, un guardado confiable y corregir contenido |

### Mediciones

| Prueba | Resultado |
|---|---|
| `node tests/run.js` | OK, 40.899 verificaciones |
| `node tests/browser.js` | OK, sin errores de JavaScript; 9 pantallas sin desborde |
| 40 programas típicos de principiante, contra Java 21 | 35 iguales, 5 distintos |
| Elegir siempre la opción más larga en los 16 cuestionarios | Aprueba 7: L25, L113, L116, L119, L120, L121 y L125 |
| Preguntas de cuestionario cuya correcta mide más de 1,3 veces cualquier otra | 37 de 93 |

### Guardado del progreso

| Prioridad | Hallazgo | Efecto | Arreglo propuesto |
|---|---|---|---|
| Crítica | Si `loadRemote` falla, devuelve cero lecciones, y `afterLogin` igual sincroniza (`progress.js:358`, `auth.js:185`) | Con una red inestable en un dispositivo nuevo, se pisa el progreso de la nube con cero | No escribir si la carga falló; usar `arrayUnion` para las lecciones |
| Crítica | Cada pestaña escribe su copia completa de `completedLessons`, `fase2` y `practice` | Con dos pestañas o dispositivos abiertos, una borra lo que hizo la otra | Escrituras por clave, o escuchar los cambios y combinarlos |
| Alta | El ranking usa el email cuando la cuenta no tiene nombre (`ranking.js:59`), y esa colección es de lectura pública | El email queda visible para cualquiera | Usar "Estudiante" como nombre de respaldo |
| Alta | Las reglas de `rankings` no limitan `displayName`, `photoURL` ni los campos extra | Se puede guardar texto enorme o una imagen de cualquier servidor | `hasOnly` y largo máximo |
| Alta | Sin conexión, la entrada espera para siempre | Queda en "Sincronizando…" | Abrir con la caché y sincronizar después |
| Alta | Reiniciar el progreso solo borra la caché de ese navegador | Otro dispositivo lo vuelve a subir | Guardar la fecha del reinicio |

### Intérprete

| Caso | JavaRun | Java |
|---|---|---|
| `import java.time.LocalDate;` | Falso error "cannot find symbol" | Funciona. Debería dar `unsupported` |
| `java.util.Arrays.sort(a)` con el nombre completo | Falso error "cannot find symbol: java" | Funciona |
| `Integer c = 128, d = 128; c == d` | `true` | `false`, porque Java solo reutiliza los objetos `Integer` de -128 a 127 |
| `new Random()` | No soportado | Muy usado al empezar: dados, adivinar un número |
| `printf("%.2f", 1.6543)` en una PC en español | `1.65` | `1,65`. `JavaOracle.java` fija `Locale.ROOT` y lo oculta |
| `Arrays.sort(a, 1, 3)` | Error interno sin atrapar: traba "Entregar" en el parcial práctico | Ordena el rango |
| `sb.setCharAt`, `map.merge`, `list.subList` | "El método no existe" | Existen. Deberían dar `unsupported` |

### Errores de contenido que enseñan algo falso

| Lección | Dice | En realidad |
|---|---|---|
| 6 | Pide redondear con `Math.round` y la pista dice que con `int` "no hace falta" | Truncar no es redondear. `int p = Math.round(x)` no compila porque devuelve `long`, y la lección 5 no lo explica |
| 18 | "Sin `new`, la variable es `null`" | Una variable local sin valor no compila; solo los atributos empiezan en `null` |
| 33 | "Si olvido `git add`, el commit se crea vacío" | Git no hace el commit y avisa que no hay nada preparado |
| 14 | "Todo es un objeto" | `int`, `double`, `boolean` y `char` son primitivos |
| 4 | Muestra `==` con dos literales `"hola"` | Da `true`, porque Java reutiliza los textos literales iguales, así que el alumno prueba la regla y deja de creerle. Usar `new String` o Scanner |
| 9 | `null!=null && obj.isValid()`; "`&` es AND bit a bit" | El ejemplo está roto; con `boolean`, `&` es un AND que evalúa los dos lados |
| 3 | "`% 2 == 1` es impar" | Falla con negativos: usar `!= 0` |
| 10 y 26 | No cerrar es un "memory leak" | Sin `close`, el archivo puede quedar incompleto; cerrar `System.in` trae más problemas |
| 27 | Dividir por cero detiene el programa | Solo con enteros; `10.0 / 0` da `Infinity` |
| 17 | `int sumar(3, 4)` | No es Java: mezcla declarar con llamar |
| 22 | "El polimorfismo se logra con `@Override`" | Lo logra la sobrescritura; la anotación solo la verifica |
| 31 | "Commit sin `-m` aborta" | Abre vim; hay que enseñar a salir |
| 32 | VS Code necesita una extensión para Git | Lo trae incorporado, así que la respuesta del quiz es discutible |
| 1 | "Todo lo demás termina con `;`" | Induce a escribir `if (...);` |
| P3 #8 | Marca la línea 2 como la que "falla al ejecutar" | Falla la 3 |
| P102 #5 | El IVA como `neto + 21` | Es `neto * 1.21` |
| P112 #3 | Sin `@PathVariable` el endpoint da error | Responde 200 con `producto null` |
| 118 | "El Dockerfile define un contenedor" | Define una imagen |
| 116 y 118 | El yml fija `localhost:3306` y Compose pasa `DB_HOST` | Nadie lee `DB_HOST`: Docker falla. El proyecto real usa `${DB_HOST:localhost}` |
| 121 | `@Min` sin `@NotNull` en `stock` | Un stock nulo pasa la validación y termina en 500 |
| 117 y 121 | Sumar `@ExceptionHandler(MethodArgumentNotValidException)` | Choca con `ResponseEntityExceptionHandler` y la app no arranca. Hay que sobrescribir `handleMethodArgumentNotValid` |

### Consignas y corrección

| Dónde | Problema |
|---|---|
| Lección 29 | Ofrece dos temas pero solo acepta uno; muestra el prompt "Elegí una opción:" y la salida esperada no lo tiene |
| Lección 34 | Pide "género" y no está ni en la entrada ni en la salida |
| Lección 8 | La pista no tiene tildes y la salida sí |
| Lección 23 | El texto del tutorial no coincide con el del ejercicio, y la lección de abstractas no usa ninguna clase abstracta |
| `conceptCheck` | Rechaza código correcto: L3 `b + a`, L11 `i = i + 1`, L18 y L19 con espacio antes de `(`, y `git commit -m '...'` con comillas simples |
| `conceptCheck` | Aprueba sin el concepto: L10 sin Scanner y L20 sin validar en `setEdad` |
| Ejercicios que no ejercitan | L7 prueba una sola nota, en L8 el `default` nunca corre, L9 no usa `\|\|` ni `!`, y en L29 `contarCompletadas` siempre da 0 |
| Ítems de error | Con más de una línea válida: L8 #6, L10 #6, L17 #7 y #8, L23 #7, L25 #8 y L107 #4 |
| Huecos de completar | Demasiado estrictos: distingue mayúsculas en SQL (L116 #7), y no acepta `+=1` (L11 #8) ni `var` (L2 #5) |
| Respuestas abiertas | L9 #9 se aprueba con casi cualquier texto; en L125, varias se cumplen repitiendo la pregunta |
| Práctica | Acertar en el segundo intento muestra la tarjeta en rojo, como si hubiera fallado |
| Cuestionario | Con el teclado se puede cambiar la respuesta después de "Verificar" |
| Resaltador `jHL` | Colorea palabras clave y números dentro de comentarios y textos |
| kiosco-api y ApiLab | Un `PUT` con nombre duplicado da 500 en vez de 409 |
| Leyenda del ranking | Dice "máx 60 · 500", y el cálculo real es 75 y 525 |

### Pedagogía para alguien de cero

**Lo que más falta es la orientación.** La lección 1 arranca con `public static void main` y una tabla de modificadores. Falta una entrada previa que responda:

- Qué es programar y qué es un algoritmo.
- Dónde se usa Java: Android, sistemas de bancos y comercios, aplicaciones empresariales, big data (Kafka, Hadoop), Minecraft y tarjetas SIM.
- Qué no conviene hacer con Java: lo que corre en el navegador (eso es JavaScript), scripts rápidos, drivers y el día a día de machine learning.
- Que Java y JavaScript son lenguajes distintos.
- JDK, JRE y JVM, juntos y con un dibujo.
- Las versiones LTS y el recolector de basura.
- Por qué Java es estricto con los tipos.
- Error de compilación frente a error de ejecución.
- Instalar el JDK y un IDE, y correr el primer programa fuera del navegador. Hoy recién aparece en la lección 32, y solo como comparación de IDEs.

Conviene empezar con una victoria rápida (cambiar el texto y ejecutar) y explicar después.

**Temas ausentes:**
- bucles anidados y matrices;
- alcance de variables;
- `toString()`, `StringBuilder` y `Random`;
- `long` y desbordamiento;
- aritmética con `char`;
- inmutabilidad de String (recién en L35);
- `static` frente a instancia;
- recursión, sobrecarga y paso por valor.

**Solo al pasar:** `printf`, `do-while`, `break`/`continue` y el error de `nextInt` seguido de `nextLine`.

**Saltos:**
- La lección 26 (archivos) usa try-catch antes de la 27, que es la que lo enseña.
- La lección 29 junta de golpe bucle, Scanner, interfaz, ArrayList, try-catch y `parseInt(nextLine())`, y entre la 11 y la 28 no se vuelve a leer entrada.
- La lección 28 mezcla excepciones, depuración, aserciones, logging y `.jar`.
- Las lecciones 8, 13 y 17 repiten el mini-quiz de la anterior.

**Recursos que ayudarían:**
- un dibujo de la variable apuntando al objeto, en L4, L13 y L18;
- una tabla de traza, vuelta por vuelta, en L11 y L12;
- que un `;` faltante no destape pistas solo.

### Ejercicios propuestos

| Dónde | Qué sumar |
|---|---|
| Lecciones con pocas actividades | L6 y L15 tienen 3, L29 tiene 4, L33 tiene 3 y L34 tiene 5: llevarlas a 6 o más. L33 promete "revertir un commit" y no tiene ningún ítem de `revert` |
| Fase 1, con `push` en `practica-5-extra.js` | Bucles anidados, una matriz, alcance de variables, `toString`, `StringBuilder`, inmutabilidad, `static`, `nextLine` después de `nextInt`, y borrar de un `ArrayList` dentro de un bucle |
| Fase 2, en Java puro (el intérprete ya soporta records, interfaces, Map, Optional y streams) | SRP en `Factura` (103), regla de negocio en el service (107), query methods en memoria (110), inyectar una `Tasa` (111), Request → entidad → Response (112), elegir el código HTTP (106), bordes y excepciones (114), `verify(never())` a mano (115), borrado lógico (116), mensaje amable con detalle en el log (117), JOIN con streams (120), `@Valid` propio (121), Builder (122) y 409 por duplicado (124) |
| Fase 2, avisos | `jakarta` frente a `javax`, `FetchType` por defecto, `@Data` con relaciones (`StackOverflowError`), `201` con `Location`, `.dockerignore`, y que `down -v` borra los datos |

### Prioridades

1. Guardado: no escribir si la carga falló, usar `arrayUnion` y sacar el email del ranking.
2. Cuestionarios: reescribir los distractores de los 7 vulnerables y sumar una prueba que falle si se aprueban eligiendo la opción más larga.
3. Una lección 0 de orientación, fuera de `LESSONS` para no tocar el certificado.
4. Corregir las tablas de errores de contenido y de consignas.
5. Actividades nuevas para los temas ausentes y código en la Fase 2.
6. Intérprete: `unsupported` en vez de falsos errores, `Random`, la caché de `Integer` y un aviso sobre la coma decimal.

### Descartado de la auditoría externa

| Afirmación | Por qué no |
|---|---|
| "Ninguna lección define `antes`" | 18 lo tienen, en `practica-6-ayudas.js` |
| La lección 16 rechaza un espacio antes de `(` | La regla no incluye el paréntesis: pasa |

### Estado del repositorio

El trabajo de la segunda auditoría estuvo 17 días sin commitear ni publicar, y la CI nunca había corrido. Quedó commiteado y publicado junto con este informe.

### Corregido el mismo día: guardado y ranking

| Hallazgo | Solución |
|---|---|
| Una carga fallida pisaba la nube con cero lecciones | `loadRemote` avisa `{ failed: true }`. La app abre con lo de este navegador, muestra un aviso y reintenta (5 s, 15 s, 30 s… y enseguida si vuelve la conexión). Nunca sube sobre lo que no pudo leer |
| Dos pestañas o dispositivos se pisaban | Lecciones, Fase 2, práctica y ranking se escriben en una transacción que lee la nube y suma: las lecciones se unen, el repaso más reciente gana, las fechas se quedan con la primera y el puntaje no baja. La pestaña adopta lo que se completó en otra |
| El ranking podía publicar el email | Sin nombre, o con un nombre que es un email, se publica "Estudiante". Solo se publican fotos `https` |
| Las reglas del ranking no limitaban texto ni campos | `hasOnly` con los 7 campos, nombre de hasta 60 caracteres y sin `@`, foto de hasta 500 |
| Lo que no se pudo subir se perdía hasta el próximo cambio | Se reintenta con el evento `online`, y al entrar se sube la práctica y la Fase 2 combinadas |

**Cómo se verificó:**
- `tests/sync.js`, nuevo, simula Firestore con lecturas que fallan y dos pestañas sobre la misma nube: 27 verificaciones. Contra el código anterior, la misma prueba muestra el error: la nube pasaba de 35 lecciones a cero y perdía el certificado.
- `tests/browser.js` suma `#offline`: sin poder leer la nube, la app abre, avisa y no sube lecciones.
- Las reglas compilan con `firebase deploy --dry-run`.
- En producción había 2 documentos de ranking y ninguno con email, así que el cambio de reglas no deja ninguno inválido.

**Sigue pendiente:**
- Reiniciar el progreso solo borra la caché de ese navegador.
- La práctica se combina por actividad: si dos pestañas responden la misma actividad a la vez, gana el repaso con la fecha más reciente, que es lo esperado.

## Cómo verificar

```bash
node tests/run.js
```

Requiere Node y un JDK en el `PATH`. Compila cada programa con Java real y compara cada respuesta. Si alguien cambia una actividad y deja una respuesta incorrecta, la prueba falla.

Para la Fase 2:

```bash
node tests/spring-check.js
```

Para el sitio en un navegador real:

```bash
node tests/browser.js
```
