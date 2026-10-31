# Plan de la Fase 2

**Objetivo:** convertir el segundo semestre de Programación 1 (backend con Spring Boot) en una segunda etapa del tutorial, con la misma pedagogía que la primera, que se desbloquea al terminar la Fase 1 y otorga un segundo certificado.

**Estado:** publicado el 31 de octubre de 2026, desde la rama `evaluaciones-y-auditoria`.

## Cómo funciona

| Tema | Decisión |
|---|---|
| Desbloqueo | Se abre con las 35 lecciones de la Fase 1 completas. Antes, muestra el recorrido y el avance |
| Lecciones | 25 lecciones en 7 tramos, en `LESSONS_F2` |
| Actividades | 161 de 10 tipos, más un ejercicio o cuestionario por lección |
| Certificado | Segundo certificado con el avance de las dos fases. Reusa el diseño del primero sin modificarlo |
| Ranking | No cambia: la Fase 2 no suma puntos ni escribe en `rankings` |
| Fase 1 | Sigue con 35 lecciones: su certificado, sus puntajes y su ranking quedan iguales |
| Progreso | `progress/{uid}.fase2`. No requiere cambiar las reglas de Firestore |

## De las clases a las lecciones

La secuencia respeta el orden de la cursada. Cada lección usa la escalera de la Fase 1: vida diaria, idea, pasos, Java y sistema real.

| Clase | Fecha | Tema de la clase | Lecciones |
|---|---|---|---|
| 1 | 28/08 | Deuda técnica, código limpio, DRY, KISS, SOLID, antipatrones STUPID | 101 a 104 |
| 2 | 04/09 | Spring y Spring Boot, Maven, SDKMAN, Spring Initializr, dependencias | 105 |
| 3 | 11/09 | HTTP, REST, capas, entidad, Lombok, repository, H2 | 106, 107, 109, 110 |
| 4 | 18/09 | Inyección de dependencias, controllers, DTO, Postman, Swagger | 111, 112, 113 |
| 5 | 25/09 | API completa, auditoría JPA, `data.sql`, YAML, `nullable` | 109, 112, 113, 123 |
| 6 | 02/10 | Testing: JUnit, ciclo de vida, Mockito, spy, reflection, MockMvc | 114, 115 |
| 7 | 09/10 | MySQL, JDBC, `@Query`, borrado lógico, consultas por nombre | 110, 116 |
| 8 | 16/10 | Logging, niveles, excepciones, `@ControllerAdvice`, respuestas genéricas | 117 |
| 9 | 23/10 | Docker, Dockerfile, Compose, volúmenes, documentación con Swagger | 118, 119 |
| Parciales | | Primer y segundo desempeño | 123, 124 |
| Coloquio | | Ejercicio práctico y defensa oral | 125 |

## Lo que se agregó además de las clases

| Lección | Por qué |
|---|---|
| 108 Records, Map, Optional y lambdas | Spring los usa en todos lados, y la Fase 1 no los enseña |
| 120 Relaciones entre entidades | Casi todo sistema real las necesita |
| 121 Validación de datos | Es la primera defensa de una API |
| 122 Patrones de diseño | El profesor los anticipa, y se piden en entrevistas |

## Tipos de actividad

Son los nueve de la Fase 1, más uno nuevo: el **Laboratorio de API**, un servidor simulado en el navegador para practicar verbos, rutas y códigos sin instalar nada.

Spring no corre en el navegador. Por eso cada lección combina tres caminos:

1. **Ejercicios en Java puro**, que el intérprete sí ejecuta: capas, DTO, repositorios falsos y excepciones.
2. **Laboratorio de API y actividades** sobre anotaciones, comandos y consultas SQL.
3. **"En tu computadora"**: pasos para hacerlo de verdad sobre `ejemplos/kiosco-api`.

## Cómo se evalúa como en la cursada

- **Parcial 1:** ABM con capas, cinco endpoints y una regla de negocio.
- **Parcial 2:** lo anterior más tests, excepciones, MySQL, logs, Swagger y Docker.
- **Coloquio:** ejercicio y defensa oral, con preguntas para ensayar.

Los enunciados son propios, escritos a partir de lo que la cátedra explicó en clase. No se copió el enunciado real.

## Material y publicación

El repositorio es **público**, así que no todo se puede subir.

| Material | Dónde queda | Por qué |
|---|---|---|
| Videos (1,6 GB) | En Descargas, sin mover | Muestran caras y voces de compañeros, y GitHub no admite archivos de ese tamaño |
| Transcripciones | `material/fase-2/`, fuera de git | Incluyen intervenciones de la clase |
| PDF del módulo | `material/fase-1/`, fuera de git | Son material del instituto |
| Versiones viejas | `material/historico/`, fuera de git | Ya no se usan |
| Lecciones, ejemplos y notas | Versionados | Son contenido propio |

## Pendiente

| Tema | Detalle |
|---|---|
| Integrar a `main` | La rama publicada todavía no está en `main` |
| Probar con una cuenta real | Login y guardado de la Fase 2 con Firebase real |
| Probar Docker | El `Dockerfile` y el `docker-compose.yml` no se ejecutaron: Docker no estaba corriendo en esta PC |
| Clases 10 a 12 | Todavía no están en la carpeta. La 11 y la 12 son material anexo |
| Segundo parcial | El enunciado se publica después de la clase 9. Conviene ajustar la lección 124 cuando esté |
| Ranking de la Fase 2 | Quedó afuera a propósito, hasta decidir qué hacer con el ranking |
| Manual | El manual imprimible cubre solo la Fase 1 |
| Spring Security y JWT | No están en la cursada. Sería el siguiente paso natural |
