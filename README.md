# Tutorial JAVA

Tutorial interactivo para aprender Java desde cero: 34 lecciones con explicación simple, tutorial técnico, ejercicios, exámenes y certificado.

El sitio publicado está en [java-inpro-tutorial.firebaseapp.com](https://java-inpro-tutorial.firebaseapp.com/). El proyecto de Firebase es `java-inpro-tutorial`.

## Qué incluye

- Explicación simple, con analogías, mini-quiz y glosario
- Tutorial técnico, con código, tablas y errores comunes
- Ejercicio con editor, autocompletado de Java y pistas
- Examen por tramo y exámenes finales
- Manual y certificado al completar las 34 lecciones
- Progreso, ranking e historial con Firebase Auth y Firestore

Al apretar **Ejecutar**, el emulador marca errores de sintaxis (código fuera de la clase, punto y coma, comillas, mayúsculas) y dice **Incorrecto** o **Correcto**.

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
