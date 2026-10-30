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
| **2. Backend** | 25 lecciones: código limpio, Spring Boot, API REST, JPA, MySQL, testing y Docker | Al completar la Fase 1 | Segundo, con el avance de las dos fases |

La Fase 2 sigue el orden del segundo semestre de Programación 1. Ver [PLAN-FASE-2.md](PLAN-FASE-2.md).

## Qué incluye

- **Explicación simple:** cada lección arranca con una escalera de cinco pasos, de la vida diaria a un sistema real
- **Tutorial técnico:** código, tablas y errores comunes
- **Ejercicio con editor:** autocompletado, pistas y un intérprete que ejecuta tu código de verdad
- **Práctica:** 486 actividades de diez tipos, con devolución inmediata
- **Evaluaciones:** simulacros con tiempo, nota del 1 al 10 y repaso de errores
- **Parciales simulados y coloquio:** en la Fase 1 y en la Fase 2, como en la cursada
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
```

Requiere Node y un JDK en el `PATH`. Compila con Java real las soluciones y las actividades, compara el intérprete contra el JDK y verifica que los programas incorrectos no aprueben.

Para lo que no corre en el navegador:

```bash
node tests/spring-check.js
```

Requiere además Maven. Compila los fragmentos con Spring real, ejecuta las consultas en H2 y compara el laboratorio con la API en vivo.

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
