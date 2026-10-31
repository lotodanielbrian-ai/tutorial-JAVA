# Kiosco API

Proyecto de referencia de la Fase 2 de Java INPRO: una API REST para gestionar los productos de un kiosco. Reúne en un solo lugar lo que enseña el curso.

## Qué incluye

- API REST con cinco operaciones y una consulta propia
- Capas: `controller`, `service`, `repository`, `model`, `dto` y `exception`
- JPA con H2 en memoria y perfil para MySQL
- Validación de datos, manejo global de errores y logs
- 20 tests: unitarios con Mockito, de controller con MockMvc y de integración
- Documentación con Swagger
- `Dockerfile` y `docker-compose.yml`

**Regla de negocio:** un producto de más de $5000 lleva 15% de recargo. Se borra de forma lógica.

## Cómo levantarlo

Necesitás Java 17 o superior.

```bash
./mvnw spring-boot:run
```

En Windows, usá `mvnw.cmd spring-boot:run`.

| Dirección | Para qué |
|---|---|
| `http://localhost:8080/swagger-ui.html` | Probar la API |
| `http://localhost:8080/h2-console` | Ver la base. JDBC URL: `jdbc:h2:mem:kiosco`, usuario `sa`, sin contraseña |

## Endpoints

| Verbo | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/productos` | 200 |
| `GET` | `/api/productos/{id}` | 200 o 404 |
| `GET` | `/api/productos/poco-stock?minimo=5` | 200 |
| `POST` | `/api/productos` | 201, 400 o 409 |
| `PUT` | `/api/productos/{id}` | 200, 400 o 404 |
| `DELETE` | `/api/productos/{id}` | 204 o 404 |

## Pruebas

```bash
./mvnw test
```

## Con Docker y MySQL

```bash
docker compose up --build
```

## Para estudiar

No lo copies: leelo, cerralo y armá el tuyo sobre otro tema. Probá romperlo: cambiá el recargo y mirá qué test falla.
