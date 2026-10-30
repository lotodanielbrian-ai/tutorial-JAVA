# Tutorial JAVA

Tutorial interactivo para aprender Java desde cero, de la vida diaria al código: 35 lecciones con explicación simple, tutorial técnico, ejercicios ejecutables, evaluaciones, entrevista junior y certificado.

El sitio publicado está en [java-inpro-tutorial.firebaseapp.com](https://java-inpro-tutorial.firebaseapp.com/). El proyecto de Firebase es `java-inpro-tutorial`.

**Autor:** Brian Daniel Loto

**Todos los derechos reservados.** © 2026 Brian Daniel Loto. Queda prohibida la reproducción, distribución o modificación de este material sin autorización del autor.

Basado en el Módulo Didáctico 2024 de **Introducción a la Programación** del Instituto Superior Santo Domingo.

## Qué incluye

- **Explicación simple:** cada lección arranca con una escalera de cinco pasos, de la vida diaria a un sistema real
- **Tutorial técnico:** código, tablas y errores comunes
- **Ejercicio con editor:** autocompletado, pistas y un intérprete que ejecuta tu código de verdad
- **Práctica:** más de 300 actividades de nueve tipos, con devolución inmediata
- **Evaluaciones:** simulacros con tiempo, nota del 1 al 10 y repaso de errores
- **Simulacro del Parcial 1:** el parcial real de la materia, en la lección 29
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

## Publicar

```bash
firebase deploy --only hosting,firestore
```

Publicá el sitio y las reglas juntos, porque los topes de `firestore.rules` tienen que coincidir con el puntaje de `ranking.js`.

## Documentación

- [AUDITORIA.md](AUDITORIA.md): hallazgos, decisiones pedagógicas y propuestas pendientes
- [CONTEXT.md](CONTEXT.md): arquitectura y cómo agregar contenido
- [CAMBIOS.txt](CAMBIOS.txt): resumen de los cambios
