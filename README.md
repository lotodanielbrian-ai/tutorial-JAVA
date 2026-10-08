# Tutorial JAVA

Tutorial interactivo para aprender Java desde cero: 35 lecciones con explicación simple, tutorial técnico, ejercicios, exámenes, entrevista junior y certificado.

El sitio publicado está en [java-inpro-tutorial.firebaseapp.com](https://java-inpro-tutorial.firebaseapp.com/). El proyecto de Firebase es `java-inpro-tutorial`.

**Autor:** Brian Daniel Loto

**Todos los derechos reservados.** © 2026 Brian Daniel Loto. Queda prohibida la reproducción, distribución o modificación de este material sin autorización del autor.

## Qué incluye

- Explicación simple, con analogías, mini-quiz y glosario
- Tutorial técnico, con código, tablas y errores comunes
- Ejercicio con editor, autocompletado de Java y pistas
- Examen por tramo y exámenes finales
- Entrevista junior: diez preguntas de opción múltiple como en un puesto laboral
- Manual y certificado al completar las 35 lecciones
- Progreso, ranking e historial con Firebase Auth y Firestore

Al apretar **Ejecutar**, el emulador corre los `println`, muestra la consola real y dice **Incorrecto** o **Correcto**. Si una línea está mal, la marca en rojo y sugiere cómo escribirla. Aunque imprima bien, explica camelCase, PascalCase, snake_case y las constantes en mayúsculas.

## Cómo abrirlo

Los archivos del sitio están en `public/`. Para verlos en local:

```bash
py -m http.server 8765 --directory public
```

Después abrí `http://127.0.0.1:8765/`. El ingreso con Google o Facebook usa el proyecto Firebase que ya está en producción.

## Publicar

```bash
firebase deploy --only hosting
```

`firebase.json` apunta el hosting a la carpeta `public`.
