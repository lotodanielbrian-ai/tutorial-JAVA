# Kiosco API

Proyecto de referencia de la Fase 2 de Java INPRO: una API REST para gestionar los productos de un kiosco. Reúne en un solo lugar lo que enseña el curso.

## Qué incluye

- API REST con cinco operaciones y una consulta propia
- Capas: `controller`, `service`, `repository`, `model`, `dto` y `exception`
- JPA con H2 en memoria y perfil para MySQL
- Validación de datos, manejo global de errores y logs
- 20 tests: unitarios con Mockito, de controller con MockMvc y de integración
- Documentación con Swagger: `@Tag`, `@Operation`, `@ApiResponse` y `@Parameter`
- `Dockerfile`, `Dockerfile.simple` y `docker-compose.yml`

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

Primero comprobá que Docker responde: `docker version` tiene que mostrar `Client` y `Server`. En Windows, si dice que no puede iniciar, activá la virtualización en el BIOS: SVM Mode en AMD, VT-x en Intel.

```bash
docker compose up --build
```

Cuando `db` figure como `healthy` y `api` arranque, abrí `http://localhost:8080/swagger-ui.html`.

| Comando | Para qué |
|---|---|
| `docker compose down` | Baja los contenedores y conserva los datos |
| `docker compose down -v` | También borra el volumen, para probar desde cero |
| `docker compose logs -f api` | Sigue los logs de la aplicación |

### Versión liviana

El `Dockerfile` compila adentro de Docker: funciona en cualquier máquina, pero baja la imagen de Maven y todas las dependencias. `Dockerfile.simple` solo copia el `.jar` que ya generaste, y construye mucho más rápido:

```bash
./mvnw clean package
docker build -f Dockerfile.simple -t kiosco-api .
```

Para usarlo con Compose, cambiá `build: .` por:

```yaml
build:
  context: .
  dockerfile: Dockerfile.simple
```

### Solo la base en Docker

Para correr la aplicación desde tu IDE y dejar la base en un contenedor, levantá `db` y usá el puerto publicado:

```bash
docker compose up -d db
DB_PORT=3307 ./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

En PowerShell, la variable se define antes: `$env:DB_PORT = "3307"`.

## Para estudiar

No lo copies: leelo, cerralo y armá el tuyo sobre otro tema. Probá romperlo: cambiá el recargo y mirá qué test falla.
