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

### Errores que detectó la verificación

| Qué se probó | Qué apareció |
|---|---|
| Levantar la API de ejemplo | Un verbo no permitido daba 500 en vez de 405 |
| Correr sus tests | `@EnableJpaAuditing` en la clase principal rompe `@WebMvcTest` |
| Ejecutar el SQL en H2 | Una consulta "corregida" no era válida, y un `JOIN` sin `ON` no falla: combina todas las filas |

Los tres quedaron como contenido de las lecciones.

## Cómo verificar

```bash
node tests/run.js
```

Requiere Node y un JDK en el `PATH`. Compila cada programa con Java real y compara cada respuesta. Si alguien cambia una actividad y deja una respuesta incorrecta, la prueba falla.

Para la Fase 2:

```bash
node tests/spring-check.js
```
