# Tutorial JAVA

Tutorial interactivo para aprender Java desde cero hasta construir una API profesional, de la vida diaria al código. Tiene dos fases, 60 lecciones, ejercicios ejecutables, evaluaciones y dos certificados.

El sitio publicado está en [java-inpro-tutorial.firebaseapp.com](https://java-inpro-tutorial.firebaseapp.com/). El proyecto de Firebase es `java-inpro-tutorial`.

**Autor:** Brian Daniel Loto

**Todos los derechos reservados.** © 2026 Brian Daniel Loto. Queda prohibida la reproducción, distribución o modificación de este material sin autorización del autor.

Basado en el Módulo Didáctico 2024 de **Introducción a la Programación** del Instituto Superior Santo Domingo.

## Las dos fases

| Fase | Contenido | Se desbloquea | Certificado |
|---|---|---|---|
| **1. Fundamentos** | 35 lecciones: Java, POO, excepciones, Git y entrevista junior | Desde el inicio | Primero |
| **2. Backend** | 25 lecciones: código limpio, Spring Boot, API REST, JPA, MySQL, testing y Docker | Al completar la Fase 1, o con la prueba de nivel | Segundo, con el avance de las dos fases |

La Fase 2 sigue el orden del segundo semestre de Programación 1. Ver [PLAN-FASE-2.md](PLAN-FASE-2.md).

## Qué incluye

- **Guía 0 Conocimiento:** en las 60 lecciones explica qué estás haciendo, por qué existe, para qué sirve, un ejemplo del día a día y una buena práctica profesional, más acceso al **Capítulo 0: ¿Qué es Java?**
- **Explicación simple e ilustrada:** escalera de cinco pasos de la vida diaria al código + **66 figuras SVG didácticas** (6 de orientación y 60/60 lecciones)
- **Asistente offline Profe Java (`JavaBot`) + capa opcional Ollama:** disponible en la app y en el manual; responde dudas de Java, buenas prácticas, errores y analiza tu código sin dar la solución. Opcionalmente se conecta a **Ollama en tu propia PC** (`nomic-embed-text` para búsqueda semántica + modelo socrático como `qwen2.5-coder:7b`) con *fallback* automático al motor offline
- **Manual "Java desde cero" en 6 Tomos + Completo F1 y F2:** vista interactiva ejecutable en pantalla, vista imprimible en hoja A4 y **8 PDFs A4 con marcadores** (edición completa Fase 1, edición completa Fase 2 y Tomos I a VI)
- **Tutorial técnico:** código, tablas y errores comunes
- **Ejercicio con editor:** autocompletado, pistas y un intérprete que ejecuta tu código de verdad
- **Práctica:** 549 actividades de once tipos, con devolución inmediata
- **Repaso espaciado:** cada actividad vuelve a los 1, 3, 7, 14 y 30 días; lo que fallás vuelve al día siguiente
- **Evaluaciones:** simulacros, parcial práctico con código y reloj, ping-pong oral, prueba de nivel y mapa de dominio
- **Parciales simulados y coloquio:** en la Fase 1 y en la Fase 2, con listas de pasos verificables para hacer el proyecto real
- **Entrevista junior**, manual y certificado al completar las 35 lecciones
- **Progreso, ranking e historial** con Firebase Auth y Firestore

## Tipos de actividad

| Tipo | Qué entrena |
|---|---|
| Opción múltiple | Reconocer un concepto |
| Verdadero o falso | Detectar ideas equivocadas |
| Unir | Relacionar conceptos |
| ¿Qué imprime? | Leer código y anticipar qué hace |
| Completar | Escribir con andamiaje |
| Ordenar | Entender la estructura de un programa |
| Encontrar el error | Depurar código y comandos Git |
| Respondé con tus palabras | Explicar lo aprendido |
| Reto de código | Resolver un problema desde cero |
| Laboratorio de API | Practicar verbos, rutas y códigos contra un servidor simulado |
| En tu computadora | Hacer el proyecto real, con cómo comprobar cada paso |

## Cómo se evalúa

Al apretar **Ejecutar**, el emulador corre tu programa: tipos, condiciones, bucles, arrays, clases, herencia, excepciones, `ArrayList`, `Scanner` con entrada simulada y archivos en memoria.

Para aprobar, la consola tiene que coincidir con lo pedido y tenés que haber usado el concepto de la lección. Si algo falla, marca la línea, muestra el mensaje real de Java y explica el error en español.

La práctica mide tu dominio por separado: no cambia el certificado ni el ranking.

## Cómo abrirlo

Los archivos del sitio están en `public/`. Para verlos en local:

```bash
py -m http.server 8765 --directory public
```

Después abrí `http://127.0.0.1:8765/`. El ingreso con Google o Facebook usa el proyecto Firebase que ya está en producción.

## Pruebas

```bash
node tests/run.js
node tests/bot-regression.js
node tests/sync.js
```

Requiere Node y un JDK en el `PATH`. Compila con Java real las soluciones y las actividades, compara el intérprete contra el JDK, valida las 66 figuras SVG, `GuiaCero`, la regresión de `JavaBot` (incluyendo casos negativos "no tengo ficha" y capa Ollama) y el guardado del progreso (`sync.js`).

### IA local opcional con Ollama (uso personal, $0)

Si querés búsqueda semántica + guía socrática en tu propia PC sin gastar nada, instalá [Ollama](https://ollama.com/), bajá los modelos y habilitá CORS para el origen del sitio:

```powershell
ollama pull nomic-embed-text
ollama pull qwen2.5-coder:7b
setx OLLAMA_ORIGINS "https://java-inpro-tutorial.web.app,http://127.0.0.1:8765"
```

Después reiniciá Ollama, abrí **Profe Java → ⚙️** y activá **Usar Ollama local**. Si Ollama está apagado, el asistente sigue funcionando offline automáticamente.

Para generar y verificar los 8 PDFs A4 del manual (edición completa Fase 1, edición completa Fase 2 y 6 Tomos, con marcadores y sin fuentes Type 3):

```bash
node tools/manual-pdf.js --all
```

Para lo que no corre en el navegador:

```bash
node tests/spring-check.js
```

Requiere además Maven. Compila los fragmentos con Spring real, ejecuta las consultas en H2, compara el laboratorio con la API en vivo y comprueba lo que publica Swagger.

Para probar el sitio en un navegador real, con Firebase simulado y midiendo cada pantalla a 360 px:

```bash
node tests/browser.js
```

Requiere Node 22 o superior y Edge o Chrome. Deja capturas en `tests/.tmp-browser`.

GitHub Actions corre las tres en cada push y, además, levanta `docker compose` de verdad sobre `kiosco-api`.

## Publicar

```bash
firebase deploy --only hosting,firestore
```

Publicá el sitio y las reglas juntos, porque los topes de `firestore.rules` tienen que coincidir con el puntaje de `ranking.js`.

## Documentación

- [AUDITORIA.md](AUDITORIA.md): hallazgos, decisiones pedagógicas y propuestas pendientes
- [CONTEXT.md](CONTEXT.md): arquitectura y cómo agregar contenido
- [PLAN-FASE-2.md](PLAN-FASE-2.md): diseño de la Fase 2 y su relación con las clases
- [CAMBIOS.txt](CAMBIOS.txt): resumen de los cambios
- [material/README.md](material/README.md): índice del material de consulta
- [ejemplos/kiosco-api](ejemplos/kiosco-api): proyecto Spring Boot de referencia
- [docs/facebook-login.md](docs/facebook-login.md): cómo habilitar el ingreso con Facebook
