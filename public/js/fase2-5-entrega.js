// Java INPRO — Fase 2, tramos Entrega, Extras, Parciales y Coloquio (lecciones 118 a 125).
var LESSONS_F2 = typeof LESSONS_F2 === 'undefined' ? [] : LESSONS_F2;
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

LESSONS_F2.push({
  id: 118, level: 'entrega', levelLabel: 'Entrega', stars: '⭐⭐⭐⭐',
  title: 'Docker',
  desc: 'Empaquetá tu aplicación con todo lo que necesita, para que corra igual en cualquier máquina.',
  simple: () => `
${f2Card('🚢', 'El contenedor del barco', `<p>Antes, cada carga se acomodaba a mano. El <strong>contenedor</strong> cambió todo: mismo tamaño y mismo trato, sin importar lo que lleve adentro. Docker hace lo mismo con el software: tu aplicación viaja con Java, sus librerías y su configuración.</p>
<p>Se terminó el "en mi máquina funciona".</p>`)}
${f2Mini('¿Qué diferencia hay entre imagen y contenedor?', 'La imagen es la receta congelada. El contenedor es esa receta en marcha.')}
${f2Mini('¿Y entre Dockerfile y Docker Compose?', 'El Dockerfile define un contenedor. Compose coordina varios, como la aplicación y la base.')}`,
  tutorial: () => `
<div class="ts"><h3>Conceptos</h3>
<table class="sym-tbl"><thead><tr><th>Término</th><th>Qué es</th><th>Analogía</th></tr></thead><tbody>
<tr><td>Imagen</td><td>Plantilla de solo lectura</td><td>Una clase</td></tr>
<tr><td>Contenedor</td><td>Una imagen en ejecución</td><td>Un objeto</td></tr>
<tr><td>Dockerfile</td><td>Receta para crear una imagen</td><td>El plano</td></tr>
<tr><td>Docker Compose</td><td>Orquesta varios contenedores</td><td>El director de orquesta</td></tr>
<tr><td>Volumen</td><td>Datos que sobreviven al contenedor</td><td>Un disco externo</td></tr>
<tr><td>Docker Hub</td><td>Repositorio de imágenes</td><td>GitHub de imágenes</td></tr>
</tbody></table></div>
<div class="ts"><h3>Dockerfile</h3>
${cb('Dockerfile', `FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`)}
<table class="sym-tbl"><thead><tr><th>Instrucción</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>FROM</code></td><td>La imagen base</td></tr>
<tr><td><code>WORKDIR</code></td><td>La carpeta de trabajo</td></tr>
<tr><td><code>COPY</code></td><td>Copia archivos</td></tr>
<tr><td><code>RUN</code></td><td>Ejecuta al construir</td></tr>
<tr><td><code>EXPOSE</code></td><td>Documenta el puerto</td></tr>
<tr><td><code>ENTRYPOINT</code></td><td>El comando al arrancar</td></tr>
</tbody></table>
${ann('tip', '💡', 'Son dos etapas: una imagen pesada compila, y una liviana (solo JRE) ejecuta. El resultado final ocupa mucho menos.')}
</div>
<div class="ts"><h3>Docker Compose</h3>
${cb('docker-compose.yml', `services:
  db:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: kiosco
    ports:
      - "3307:3306"
    volumes:
      - datos-kiosco:/var/lib/mysql

  api:
    build: .
    environment:
      SPRING_PROFILES_ACTIVE: mysql
      DB_HOST: db
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  datos-kiosco:`)}
${ann('warn', '⚠️', 'Adentro de la red de Docker, la aplicación llega a la base por el nombre del servicio (<code>db</code>), no por <code>localhost</code>.')}
${ann('warn', '⚠️', 'En <code>"3307:3306"</code> el primer número es tu computadora, y el segundo, el contenedor. Así podés tener varias bases sin que choquen los puertos.')}
<table class="sym-tbl"><thead><tr><th>Comando</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>docker compose up --build</code></td><td>Construye y levanta</td></tr>
<tr><td><code>docker compose up -d</code></td><td>Levanta en segundo plano</td></tr>
<tr><td><code>docker compose down</code></td><td>Detiene y elimina los contenedores</td></tr>
<tr><td><code>docker compose logs -f</code></td><td>Sigue los logs</td></tr>
<tr><td><code>docker ps</code></td><td>Lista lo que está corriendo</td></tr>
<tr><td><code>docker images</code></td><td>Lista las imágenes</td></tr>
</tbody></table>
${f2Pc('levantar todo', [
    'Instalá y abrí Docker Desktop.',
    'En <code>ejemplos/kiosco-api</code>, ejecutá <code>docker compose up --build</code>.',
    'Esperá a que MySQL quede listo y abrí <code>http://localhost:8080/swagger-ui.html</code>.',
    'Creá un producto, corré <code>docker compose down</code> y volvé a levantar: el dato sigue ahí, gracias al volumen.'
  ])}
</div>`,
  quiz: {
    passing: 5,
    questions: [
      { question: '¿Qué problema resuelve Docker?', options: ['Que la aplicación corra igual en cualquier máquina', 'Escribir código por vos', 'Reemplazar a Git', 'Hacer pruebas unitarias'], correct: 0 },
      { question: '¿Cuál es la diferencia entre imagen y contenedor?', options: ['El contenedor es una imagen en ejecución', 'Son lo mismo', 'La imagen corre y el contenedor no', 'El contenedor es un archivo Java'], correct: 0 },
      { question: '¿Qué archivo define varios servicios juntos?', options: ['docker-compose.yml', 'pom.xml', 'Dockerfile', 'data.sql'], correct: 0 },
      { question: '¿Qué instrucción elige la imagen base?', options: ['FROM', 'RUN', 'COPY', 'EXPOSE'], correct: 0 },
      { question: 'En "3307:3306", ¿qué es el 3307?', options: ['El puerto de tu computadora', 'El puerto del contenedor', 'La versión de MySQL', 'La memoria'], correct: 0 },
      { question: '¿Qué permite conservar los datos de la base?', options: ['Un volumen', 'Un RUN', 'El WORKDIR', 'Una imagen más grande'], correct: 0 }
    ]
  }
});

PRACTICA[118] = {
  prev: 'empaquetar con Maven y configurar MySQL.',
  objetivos: ['Diferenciar imagen, contenedor y volumen.', 'Leer un Dockerfile.', 'Levantar varios servicios con Docker Compose.'],
  escalera: {
    vida: 'Un contenedor de barco se trata igual sin importar lo que lleve adentro.',
    modelo: 'La aplicación viaja junto con todo lo que necesita para correr.',
    pseudo: 'Compilar → crear la imagen → levantar la base → levantar la aplicación.',
    java: 'Se copia el <code>.jar</code> a la imagen y se ejecuta con <code>java -jar</code>.',
    real: 'Las empresas despliegan contenedores: el mismo que probaste es el que llega a producción.'
  },
  items: [
    { t: 'order', q: 'Ordená un Dockerfile.', lines: ['FROM eclipse-temurin:17-jre', 'WORKDIR /app', 'COPY target/*.jar app.jar', 'EXPOSE 8080', 'ENTRYPOINT ["java", "-jar", "app.jar"]'], why: 'Base, carpeta, archivo, puerto y comando de arranque.' },
    { t: 'match', q: 'Uní cada comando de Docker con lo que hace.', pairs: [['docker compose up --build', 'Construye y levanta'], ['docker compose down', 'Detiene y elimina'], ['docker ps', 'Lista lo que corre'], ['docker compose logs -f', 'Sigue los logs']], why: 'Con estos cuatro alcanza para el día a día.' },
    { t: 'bug', q: 'Encontrá el error: la aplicación corre en un contenedor y no encuentra la base.', code: 'environment:\n  SPRING_PROFILES_ACTIVE: mysql\n  DB_HOST: localhost', line: 3, fix: '  DB_HOST: db', noRun: true, why: 'Dentro de un contenedor, <code>localhost</code> es el propio contenedor. La base se llama <code>db</code>.' },
    { t: 'bug', q: 'Encontrá el error en este Dockerfile: la imagen no sabe qué ejecutar.', code: 'FROM eclipse-temurin:17-jre\nWORKDIR /app\nCOPY target/*.jar app.jar\nEXPOSE 8080\nRUN ["java", "-version"]', line: 5, fix: 'ENTRYPOINT ["java", "-jar", "app.jar"]', noRun: true, why: '<code>RUN</code> se ejecuta al construir. Lo que corre al arrancar va en <code>ENTRYPOINT</code> o <code>CMD</code>.' },
    { t: 'tf', q: 'Si borrás un contenedor sin volumen, sus datos se pierden.', a: true, why: 'Lo que está adentro del contenedor muere con él.' },
    { t: 'fill', q: 'Completá el servicio de la base.', code: 'services:\n  db:\n    ___: mysql:8.4\n    ___:\n      - "3307:3306"', a: [['image'], ['ports']], noRun: true, why: '<code>image</code> elige qué correr y <code>ports</code> conecta tu máquina con el contenedor.' },
    { t: 'short', q: '¿Qué significa "en mi máquina funciona" y cómo lo resuelve Docker?', any: [['distinto', 'diferente', 'version', 'configuracion', 'entorno', 'otra maquina', 'instal'], ['mismo', 'igual', 'empaquet', 'contenedor', 'imagen', 'incluye', 'todo']], model: 'Que el programa depende de lo instalado en cada PC. Docker empaqueta la aplicación con su entorno, y corre igual en todos lados.', why: 'El problema nunca fue el código, sino el entorno.' }
  ]
};

LESSONS_F2.push({
  id: 119, level: 'entrega', levelLabel: 'Entrega', stars: '⭐⭐⭐',
  title: 'Swagger y entrega del proyecto',
  desc: 'Documentá tu API y entregá un proyecto que cualquiera pueda levantar.',
  simple: () => `
${f2Card('📖', 'El manual del electrodoméstico', `<p>Un aparato sin manual obliga a adivinar. <strong>Swagger</strong> es un manual que se escribe solo, a partir de tu código, y además permite probar la API desde el navegador.</p>
<p>Tu proyecto también necesita su manual: un <strong>README</strong> que diga qué es y cómo levantarlo.</p>`)}
${f2Mini('¿OpenAPI y Swagger son lo mismo?', 'OpenAPI es el estándar. Swagger es la herramienta que lo muestra.')}
${f2Mini('¿Qué es lo primero que mira un reclutador?', 'Tu README y tu historial de commits.')}`,
  tutorial: () => `
<div class="ts"><h3>Documentar con anotaciones</h3>
<p>Con la dependencia <code>springdoc-openapi-starter-webmvc-ui</code>, Swagger ya funciona. Con anotaciones lo enriquecés:</p>
${cb('Controller documentado', `@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Gestión de los productos del kiosco")
public class ProductoController {

    @GetMapping("/{id}")
    @Operation(summary = "Busca un producto por id")
    public ProductoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }
}`)}
<table class="sym-tbl"><thead><tr><th>Dirección</th><th>Qué muestra</th></tr></thead><tbody>
<tr><td><code>/swagger-ui.html</code></td><td>La interfaz para probar</td></tr>
<tr><td><code>/v3/api-docs</code></td><td>La especificación en JSON</td></tr>
</tbody></table></div>
<div class="ts"><h3>Un buen README</h3>
<ol><li>Qué hace el proyecto, en dos líneas.</li><li>Tecnologías y versiones.</li><li>Cómo levantarlo, paso a paso.</li><li>Los endpoints principales.</li><li>Cómo correr las pruebas.</li></ol></div>
<div class="ts"><h3>Antes de entregar</h3>
${cb('Lista de control', `[ ] mvn clean package termina sin errores
[ ] Los tests pasan
[ ] Los 5 endpoints responden con el código correcto
[ ] Los errores devuelven un mensaje claro
[ ] No hay contraseñas en el código
[ ] target/ está en .gitignore
[ ] El README explica cómo levantarlo`)}
${ann('tip', '💡', 'Probá tu entrega en una carpeta nueva, como si fueras otra persona. Si necesitás algo que no está escrito, falta en el README.')}
${ann('java', '☕', 'Un repositorio prolijo con un proyecto propio es tu mejor carta en una entrevista.')}
</div>`,
  quiz: {
    passing: 4,
    questions: [
      { question: '¿Qué dependencia agrega Swagger a Spring Boot?', options: ['springdoc-openapi', 'lombok', 'h2', 'mysql-connector-j'], correct: 0 },
      { question: '¿En qué dirección se ve la interfaz de Swagger?', options: ['/swagger-ui.html', '/h2-console', '/api/productos', '/docker'], correct: 0 },
      { question: '¿Qué anotación describe un endpoint?', options: ['@Operation', '@Entity', '@Id', '@Mock'], correct: 0 },
      { question: '¿Qué no debe faltar en un README?', options: ['Cómo levantar el proyecto', 'Las contraseñas', 'Tu nota', 'El contenido de target'], correct: 0 },
      { question: '¿Qué conviene hacer antes de entregar?', options: ['Probar el proyecto desde cero en una carpeta nueva', 'Borrar los tests', 'Subir target', 'Sacar el README'], correct: 0 }
    ]
  }
});

PRACTICA[119] = {
  prev: 'controllers y Git.',
  objetivos: ['Documentar una API con Swagger.', 'Escribir un README útil.', 'Revisar un proyecto antes de entregarlo.'],
  escalera: {
    vida: 'Un electrodoméstico sin manual obliga a adivinar.',
    modelo: 'La documentación generada desde el código no se desactualiza.',
    pseudo: 'Agregar la dependencia → anotar → abrir /swagger-ui.html.',
    java: '<code>@Tag</code> y <code>@Operation</code> en el controller.',
    real: 'Tu API la consume otro equipo: Swagger evita preguntas y errores de integración.'
  },
  items: [
    { t: 'fill', q: 'Completá la documentación.', code: 'class DocController {\n    @io.swagger.v3.oas.annotations.___(summary = "Lista los productos")\n    @___\n    public String listar() {\n        return "[]";\n    }\n}', a: [['Operation'], ['GetMapping']], spring: true, noRun: true, why: '<code>@Operation</code> agrega la descripción que se ve en Swagger.' },
    { t: 'order', q: 'Ordená cómo entregar el proyecto.', lines: ['Correr mvn clean package', 'Comprobar que los tests pasan', 'Probar los endpoints', 'Revisar el README', 'Comprimir y entregar sin la carpeta target'], why: 'Comprobar antes de entregar evita la peor sorpresa: un proyecto que no levanta.' },
    { t: 'tf', q: 'La carpeta <code>target</code> debe subirse a Git.', a: false, why: 'Se genera al compilar: pesa y no aporta.' },
    { t: 'bug', q: 'Encontrá el error de seguridad en este archivo versionado.', code: 'spring:\n  datasource:\n    url: jdbc:mysql://localhost:3306/kiosco\n    password: MiClaveReal2026', line: 4, fix: '    password: ${DB_PASSWORD}', noRun: true, why: 'Las contraseñas no van al repositorio: se leen de variables de entorno.' },
    { t: 'short', q: '¿Qué le contarías a alguien sobre tu proyecto en un README?', any: [['que hace', 'proyecto', 'descrip', 'objetivo'], ['levant', 'ejecut', 'instal', 'correr', 'como']], model: 'Qué hace el proyecto, con qué tecnologías está hecho y cómo levantarlo y probarlo paso a paso.', why: 'Si otra persona no puede levantarlo sola, el README no cumple.' }
  ]
};

LESSONS_F2.push({
  id: 120, level: 'extra', levelLabel: 'Para ir más lejos', stars: '⭐⭐⭐⭐',
  title: 'Relaciones entre entidades',
  desc: 'Conectá tablas: un cliente con sus pedidos, y un pedido con sus productos.',
  simple: () => `
${f2Card('🧾', 'La libreta del almacén', `<p>Un <strong>cliente</strong> tiene muchos <strong>pedidos</strong>, y cada pedido es de un solo cliente. Si copiaras el nombre del cliente en cada pedido, al corregirlo tendrías que cambiarlo cien veces. Por eso se separan las tablas y se conectan con una <strong>clave foránea</strong>.</p>`)}
${f2Mini('¿Quién guarda la clave foránea?', 'El lado "muchos": cada pedido guarda el id de su cliente.')}
${f2Mini('¿Qué es el problema N+1?', 'Traer 100 pedidos y hacer otra consulta por cada uno para buscar su cliente: 101 consultas.')}`,
  tutorial: () => `
<div class="ts"><h3>Tipos de relación</h3>
<table class="sym-tbl"><thead><tr><th>Relación</th><th>Ejemplo</th><th>Anotación</th></tr></thead><tbody>
<tr><td>Uno a uno</td><td>Persona y DNI</td><td><code>@OneToOne</code></td></tr>
<tr><td>Uno a muchos</td><td>Cliente y pedidos</td><td><code>@OneToMany</code></td></tr>
<tr><td>Muchos a uno</td><td>Pedidos y cliente</td><td><code>@ManyToOne</code></td></tr>
<tr><td>Muchos a muchos</td><td>Alumnos y materias</td><td><code>@ManyToMany</code></td></tr>
</tbody></table>
${cb('Cliente y pedidos', `@Entity
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "cliente")
    private List<Pedido> pedidos;
}

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}`)}
${ann('warn', '⚠️', 'Si devolvés estas entidades como JSON, Cliente incluye Pedido y Pedido incluye Cliente, hasta el infinito. Otra razón para usar DTO.')}
</div>
<div class="ts"><h3>Con SQL</h3>
${cb('JOIN', `SELECT c.nombre, p.total
FROM clientes c
JOIN pedidos p ON p.cliente_id = c.id
WHERE p.total > 1000;`)}
</div>`,
  quiz: {
    passing: 4,
    questions: [
      { question: 'Un cliente tiene muchos pedidos. Desde Pedido, ¿qué anotación corresponde?', options: ['@ManyToOne', '@OneToOne', '@Id', '@Column'], correct: 0 },
      { question: '¿Dónde queda la clave foránea?', options: ['En la tabla del lado "muchos"', 'En la tabla del lado "uno"', 'En ambas', 'En el pom.xml'], correct: 0 },
      { question: '¿Qué hace un JOIN?', options: ['Combina filas de dos tablas', 'Borra una tabla', 'Crea un índice', 'Copia la base'], correct: 0 },
      { question: 'Alumnos y materias es una relación...', options: ['Muchos a muchos', 'Uno a uno', 'Uno a muchos', 'Ninguna'], correct: 0 },
      { question: '¿Por qué devolver DTO con entidades relacionadas?', options: ['Para evitar referencias circulares en el JSON', 'Porque Java lo exige', 'Para escribir más', 'No hay motivo'], correct: 0 }
    ]
  }
});

PRACTICA[120] = {
  prev: 'entidades y SQL.',
  objetivos: ['Modelar relaciones entre entidades.', 'Escribir un JOIN.', 'Evitar referencias circulares con DTO.'],
  escalera: {
    vida: 'En la libreta del almacén cada cliente tiene su página, y los pedidos se anotan en ella.',
    modelo: 'Las tablas se separan para no repetir datos, y se conectan por claves.',
    pseudo: 'Cada pedido guarda el id de su cliente.',
    java: '<code>@ManyToOne</code> y <code>@OneToMany(mappedBy = "cliente")</code>.',
    real: 'Casi todo sistema es una red de relaciones: clientes, pedidos, productos, pagos.'
  },
  items: [
    { t: 'match', q: 'Uní cada caso con su relación.', pairs: [['Persona y DNI', 'Uno a uno'], ['Cliente y pedidos', 'Uno a muchos'], ['Alumnos y materias', 'Muchos a muchos']], why: 'Preguntate cuántos de cada lado puede haber.' },
    { t: 'fill', q: 'Completá la relación.', code: '@Entity\nclass ClienteA {\n    @Id\n    private Long id;\n}\n\n@Entity\nclass PedidoA {\n    @Id\n    private Long id;\n\n    @___\n    @___(name = "cliente_id")\n    private ClienteA cliente;\n}', a: [['ManyToOne'], ['JoinColumn']], spring: true, noRun: true, why: 'Muchos pedidos apuntan a un cliente, y <code>JoinColumn</code> nombra la columna.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: no da error, pero muestra cada cliente con los pedidos de todos.', code: 'SELECT c.nombre, p.total\nFROM clientes c\nJOIN pedidos p\nWHERE p.total > 1000;', line: 3, fix: 'JOIN pedidos p ON p.cliente_id = c.id', noRun: true, why: 'Sin <code>ON</code> la base combina todas las filas con todas. Es el peor tipo de error: no falla, y devuelve datos equivocados.' },
    { t: 'tf', q: 'Copiar el nombre del cliente en cada pedido es una buena idea.', a: false, why: 'Se llama redundancia: al cambiarlo, habría que actualizarlo en todas las filas.' }
  ]
};

LESSONS_F2.push({
  id: 121, level: 'extra', levelLabel: 'Para ir más lejos', stars: '⭐⭐⭐',
  title: 'Validación de datos',
  desc: 'Rechazá los datos inválidos en la puerta, antes de que lleguen a tu lógica.',
  simple: () => `
${f2Card('🚪', 'El de seguridad', `<p>El de seguridad controla en la puerta, no adentro del local. Si validás al entrar, el resto del sistema puede confiar en lo que recibe. <strong>Nunca confíes en lo que manda el cliente</strong>.</p>`)}
${f2Mini('¿Alcanza con validar en la pantalla?', 'No: cualquiera puede llamar a tu API sin pasar por la pantalla.')}`,
  tutorial: () => `
<div class="ts"><h3>Bean Validation</h3>
${cb('ProductoRequest.java', `public record ProductoRequest(
        @NotBlank(message = "El nombre es obligatorio") String nombre,
        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser positivo") Double precio,
        @Min(value = 0, message = "El stock no puede ser negativo") Integer stock) {
}`)}
<table class="sym-tbl"><thead><tr><th>Anotación</th><th>Comprueba</th></tr></thead><tbody>
<tr><td><code>@NotNull</code></td><td>No es nulo</td></tr>
<tr><td><code>@NotBlank</code></td><td>Texto con contenido</td></tr>
<tr><td><code>@Size(min, max)</code></td><td>Largo del texto</td></tr>
<tr><td><code>@Min</code>, <code>@Max</code></td><td>Rango numérico</td></tr>
<tr><td><code>@Positive</code></td><td>Mayor que cero</td></tr>
<tr><td><code>@Email</code></td><td>Formato de correo</td></tr>
</tbody></table>
${ann('warn', '⚠️', 'Las anotaciones no hacen nada sin <code>@Valid</code> en el controller. Y hace falta la dependencia <code>spring-boot-starter-validation</code>.')}
${cb('En el controller', `@PostMapping
public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
    ...
}`)}
<p>Si un dato no pasa, Spring lanza <code>MethodArgumentNotValidException</code>, que se atrapa en el manejador global para devolver un 400 claro.</p>
</div>`,
  quiz: {
    passing: 3,
    questions: [
      { question: '¿Qué activa las validaciones en el controller?', options: ['@Valid', '@Service', '@Id', '@Mock'], correct: 0 },
      { question: '¿Qué anotación rechaza un texto vacío o con espacios?', options: ['@NotBlank', '@NotNull', '@Id', '@Min'], correct: 0 },
      { question: '¿Qué código devuelve la API ante un dato inválido?', options: ['400', '200', '201', '500'], correct: 0 },
      { question: '¿Por qué validar en el servidor si la pantalla ya valida?', options: ['Porque se puede llamar a la API sin la pantalla', 'No hace falta', 'Para que sea más lento', 'Por estética'], correct: 0 }
    ]
  }
});

PRACTICA[121] = {
  prev: 'DTO y manejo de errores.',
  objetivos: ['Validar datos con anotaciones.', 'Responder errores de validación con claridad.'],
  escalera: {
    vida: 'El de seguridad controla en la puerta, no adentro del local.',
    modelo: 'Lo que entra se valida primero: el resto del sistema confía en esos datos.',
    pseudo: 'Si el nombre está vacío → rechazar con 400 y explicar.',
    java: '<code>@NotBlank</code> en el DTO y <code>@Valid</code> en el controller.',
    real: 'Es la primera defensa contra datos corruptos, y parte de la seguridad de una API.'
  },
  items: [
    { t: 'fill', q: 'Completá las validaciones.', code: 'record ClienteRequest(\n        @jakarta.validation.constraints.___ String nombre,\n        @jakarta.validation.constraints.___ String email) {\n}', a: [['NotBlank'], ['Email']], spring: true, noRun: true, why: 'Cada campo declara su regla.' },
    { t: 'bug', q: 'Las anotaciones del DTO no están haciendo nada. ¿Qué línea corregís?', code: '@PostMapping\npublic ProductoResponse crear(@RequestBody ProductoRequest request) {\n    return service.crear(request);\n}', line: 2, fix: 'public ProductoResponse crear(@Valid @RequestBody ProductoRequest request) {', noRun: true, why: 'Sin <code>@Valid</code>, las anotaciones del DTO se ignoran.' },
    { t: 'http', q: 'Precio inválido', task: 'Mandá un precio negativo y conseguí el <strong>400</strong> con su mensaje.', goal: { method: 'POST', path: '^/api/productos$', status: 400, contains: 'positivo' }, demo: [['POST', '/api/productos', '{"nombre":"Mate","precio":-5,"stock":1}']], hint: '<code>{"nombre":"Mate","precio":-5,"stock":1}</code>', why: 'El mensaje dice exactamente qué corregir.' },
    { t: 'http', q: 'JSON roto', task: 'Mandá un JSON mal formado y mirá qué pasa.', goal: { method: 'POST', path: '^/api/productos$', status: 400, contains: 'JSON' }, demo: [['POST', '/api/productos', '{"nombre":']], hint: 'Probá escribir <code>{"nombre":</code> y dejarlo incompleto.', why: 'Ni siquiera llega a tu código: falla al leer el cuerpo.' },
    { t: 'tf', q: 'Validar en el frontend es suficiente.', a: false, why: 'Cualquiera puede llamar a la API directamente con curl o Postman.' }
  ]
};

LESSONS_F2.push({
  id: 122, level: 'extra', levelLabel: 'Para ir más lejos', stars: '⭐⭐⭐⭐',
  title: 'Patrones de diseño',
  desc: 'Soluciones probadas a problemas comunes: Strategy, Factory y Builder.',
  simple: () => `
${f2Card('📐', 'Recetas de especialistas', `<p>Durante años, especialistas analizaron código y vieron los mismos problemas una y otra vez. Un <strong>patrón de diseño</strong> es la solución que encontraron: no es código para copiar, es una forma de resolver.</p>`)}
${f2Mini('¿Hay que usar patrones siempre?', 'No. Si un patrón no resuelve un problema real, es complicar de más: KISS.')}`,
  tutorial: () => `
<div class="ts"><h3>Tres patrones útiles</h3>
<table class="sym-tbl"><thead><tr><th>Patrón</th><th>Problema</th><th>Analogía</th></tr></thead><tbody>
<tr><td>Strategy</td><td>Varias formas de hacer lo mismo</td><td>Elegir cómo llegar: colectivo, tren o auto</td></tr>
<tr><td>Factory</td><td>Crear objetos sin saber cuál</td><td>Pedís un café y la máquina decide cómo</td></tr>
<tr><td>Builder</td><td>Objetos con muchos datos</td><td>Armar tu hamburguesa paso a paso</td></tr>
</tbody></table></div>
<div class="ts"><h3>Strategy</h3>
${cb('Una interfaz, varias formas', `interface Descuento {
    double aplicar(double precio);
}

class SinDescuento implements Descuento {
    public double aplicar(double precio) { return precio; }
}

class DiezPorCiento implements Descuento {
    public double aplicar(double precio) { return precio * 0.9; }
}`)}
<p>Es el mismo ejemplo que se vio en SOLID para reemplazar el <code>if</code> de los medios de pago.</p>
</div>
<div class="ts"><h3>Factory</h3>
${cb('Centralizar la creación', `class DescuentoFactory {
    static Descuento crear(String tipo) {
        return switch (tipo) {
            case "DIEZ" -> new DiezPorCiento();
            default -> new SinDescuento();
        };
    }
}`)}
<p>Con Lombok, el Builder se obtiene con <code>@Builder</code>. Spring usa estos patrones todo el tiempo: los beans son singletons administrados por el contenedor.</p>
</div>`,
  exercise: {
    desc: 'Aplicá Strategy y Factory. Creá la interfaz Descuento y dos implementaciones: SinDescuento y DiezPorCiento. DescuentoFactory.crear(String) elige la correcta según el texto "DIEZ". El main calcula el precio con cada tipo.',
    expected: 'DIEZ: 900.0\nNINGUNO: 1000.0',
    need: [['\\binterface\\s+Descuento', 'Definí la interfaz Descuento.'], ['class\\s+DescuentoFactory', 'Creá DescuentoFactory.'], ['implements\\s+Descuento[\\s\\S]*implements\\s+Descuento', 'Creá las dos implementaciones.']],
    starter: `// Definí Descuento, sus implementaciones y DescuentoFactory

public class Main {
    public static void main(String[] args) {
        String[] tipos = {"DIEZ", "NINGUNO"};
        // Para cada tipo, pedile a la fábrica el descuento y aplicalo a 1000

    }
}`,
    hints: [
      'La fábrica recibe un <code>String</code> y devuelve un <code>Descuento</code>.',
      `La solución:<br>${cb('Solución', `interface Descuento {
    double aplicar(double precio);
}

class SinDescuento implements Descuento {
    public double aplicar(double precio) {
        return precio;
    }
}

class DiezPorCiento implements Descuento {
    public double aplicar(double precio) {
        return precio * 0.9;
    }
}

class DescuentoFactory {
    static Descuento crear(String tipo) {
        return tipo.equals("DIEZ") ? new DiezPorCiento() : new SinDescuento();
    }
}

public class Main {
    public static void main(String[] args) {
        String[] tipos = {"DIEZ", "NINGUNO"};
        for (String tipo : tipos) {
            System.out.println(tipo + ": " + DescuentoFactory.crear(tipo).aplicar(1000));
        }
    }
}`)}`
    ]
  }
});

PRACTICA[122] = {
  prev: 'interfaces y SOLID.',
  objetivos: ['Reconocer Strategy, Factory y Builder.', 'Elegir un patrón para un problema real.'],
  escalera: {
    vida: 'Una receta probada por muchos cocineros antes que vos.',
    modelo: 'Un patrón es una solución conocida a un problema repetido.',
    pseudo: 'Hay varias formas de calcular → una interfaz y una clase por cada forma.',
    java: '<code>interface Descuento</code> con varias implementaciones.',
    real: 'En una entrevista, nombrar el patrón muestra que conocés el problema y su solución.'
  },
  items: [
    { t: 'match', q: 'Uní cada patrón con su problema.', pairs: [['Strategy', 'Varias formas de hacer lo mismo'], ['Factory', 'Elegir qué objeto crear'], ['Builder', 'Armar objetos con muchos datos']], why: 'Primero el problema; después, el patrón.' },
    { t: 'output', q: 'Strategy en acción. ¿Qué imprime?', code: 'interface Envio {\n    int costo(int km);\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Envio moto = km -> km * 10;\n        Envio camion = km -> km * 50 + 100;\n        System.out.println(moto.costo(5));\n        System.out.println(camion.costo(5));\n    }\n}', a: '50\n350', why: 'Una interfaz con un solo método se puede implementar con una lambda.' },
    { t: 'tf', q: 'Conviene aplicar patrones aunque el problema no exista todavía.', a: false, why: 'Es optimización prematura. KISS primero.' },
    { t: 'short', q: '¿Qué patrón usa Spring para entregarte los beans y qué ventaja tiene?', any: [['inyeccion', 'singleton', 'dependenc', 'contenedor'], ['desacopl', 'una sola', 'unica', 'reutiliz', 'administr', 'cambiar']], model: 'Inyección de dependencias con beans singleton: Spring administra una instancia y desacopla las clases.', why: 'Sin saberlo, ya venías usando patrones.' }
  ]
};

LESSONS_F2.push({
  id: 123, level: 'coloquio', levelLabel: 'Primer parcial', stars: '🏆',
  title: 'Primer parcial simulado',
  desc: 'Un ABM completo, como en el primer parcial: cinco operaciones, capas y una regla de negocio.',
  simple: () => `
${f2Card('📝', 'Qué se evalúa', `<p>Es 100% práctico. Se pide una <strong>API REST</strong> sobre un tema cotidiano: tareas, préstamos o pedidos. Tiene que cumplir:</p>
<ul><li>Java 17+, Spring Boot 3, Maven, H2 y Spring Data JPA.</li>
<li>Paquetes <code>controller</code>, <code>service</code>, <code>repository</code> y <code>model</code>.</li>
<li>Cinco endpoints: dos GET, un POST, un PUT y un DELETE.</li>
<li>Una regla de negocio simple, como un recargo si el precio supera un valor.</li>
<li>Código limpio, con DRY, KISS y SOLID.</li></ul>`)}
${ann('tip', '💡', 'Para promocionar se piden 7 o más en los dos parciales. Sin esa nota queda el recuperatorio, y con él se pierde el coloquio: no dejes de entregar.')}`,
  tutorial: () => `
<div class="ts"><h3>La receta en orden</h3>
<ol><li>Generá el proyecto en <code>start.spring.io</code>.</li><li>Configurá H2 en <code>application.yml</code>.</li><li>Escribí la entidad.</li><li>Creá el repository.</li><li>Definí la interfaz del service y su implementación, con la regla.</li><li>Escribí el controller.</li><li>Probá cada endpoint con Swagger o Postman.</li></ol>
${ann('java', '☕', 'Este es tu machete de estudio: mirá cómo está resuelto <code>ejemplos/kiosco-api</code>, cerralo y armá el tuyo desde cero sobre otro tema.')}
</div>
<div class="ts"><h3>Cómo entrenar</h3>
<p>El ejercicio resuelve la misma lógica en Java puro para correr en el navegador. Después hacé la versión real en tu computadora, con otro tema: un gestor de turnos, una concesionaria o una farmacia.</p>
${f2Pc('el parcial de práctica', [
    'Elegí un tema y tres atributos.',
    'Inventá una regla de negocio.',
    'Armá la API en menos de 3 horas, sin copiar.',
    'Probá los cinco endpoints y un error.',
    'Compará con <code>ejemplos/kiosco-api</code> y anotá qué faltó.'
  ])}
</div>`,
  exercise: {
    desc: 'Armá el ABM de un gestor de pedidos en tres capas. Comandos: ALTA nombre monto, LISTAR, MODIFICAR id monto, BAJA id, FIN. Regla: si el monto supera 5000, se guarda con 10% de descuento. Ids desde 1. Si el id no existe, imprimí "No existe". Leé los comandos con Scanner.',
    expected: 'Creado 1: Yerba 1000.0\nCreado 2: Termo 9000.0\n1 Yerba 1000.0\n2 Termo 9000.0\nModificado 1: 2000.0\nNo existe\nEliminado 2\n1 Yerba 2000.0\nFin',
    stdin: ['ALTA Yerba 1000', 'ALTA Termo 10000', 'LISTAR', 'MODIFICAR 1 2000', 'MODIFICAR 9 500', 'BAJA 2', 'LISTAR', 'FIN'],
    need: [['class\\s+\\w*Service', 'Creá una capa de servicio.'], ['class\\s+\\w*Repository', 'Creá una capa de repositorio.'], ['\\bwhile\\b', 'Leé comandos en un bucle.'], ['Optional|Map<|List<', 'Guardá los pedidos en una colección.']],
    starter: `import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

// Creá Pedido, PedidoRepository y PedidoService

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Leé cada línea y separala con split(" ")

    }
}`,
    hints: [
      'El modelo puede ser un record: <code>record Pedido(int id, String nombre, double monto) { }</code>.',
      'El repository guarda en un <code>LinkedHashMap&lt;Integer, Pedido&gt;</code>, así conserva el orden.',
      'La regla va en el service: <code>monto &gt; 5000 ? monto * 0.9 : monto</code>.',
      `La solución:<br>${cb('Solución', `import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;

record Pedido(int id, String nombre, double monto) {
}

class PedidoRepository {
    private final Map<Integer, Pedido> datos = new LinkedHashMap<>();
    private int proximoId = 1;

    int generarId() {
        return proximoId++;
    }

    void guardar(Pedido pedido) {
        datos.put(pedido.id(), pedido);
    }

    Optional<Pedido> buscar(int id) {
        return Optional.ofNullable(datos.get(id));
    }

    List<Pedido> todos() {
        return new ArrayList<>(datos.values());
    }

    void borrar(int id) {
        datos.remove(id);
    }
}

class PedidoService {
    private final PedidoRepository repository;

    PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    private double aplicarRegla(double monto) {
        return monto > 5000 ? monto * 0.9 : monto;
    }

    Pedido crear(String nombre, double monto) {
        Pedido pedido = new Pedido(repository.generarId(), nombre, aplicarRegla(monto));
        repository.guardar(pedido);
        return pedido;
    }

    List<Pedido> listar() {
        return repository.todos();
    }

    Optional<Pedido> modificar(int id, double monto) {
        return repository.buscar(id).map(p -> {
            Pedido nuevo = new Pedido(id, p.nombre(), aplicarRegla(monto));
            repository.guardar(nuevo);
            return nuevo;
        });
    }

    boolean eliminar(int id) {
        if (repository.buscar(id).isEmpty()) {
            return false;
        }
        repository.borrar(id);
        return true;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        PedidoService service = new PedidoService(new PedidoRepository());
        boolean seguir = true;
        while (seguir) {
            String[] partes = sc.nextLine().split(" ");
            switch (partes[0]) {
                case "ALTA":
                    Pedido creado = service.crear(partes[1], Double.parseDouble(partes[2]));
                    System.out.println("Creado " + creado.id() + ": " + creado.nombre() + " " + creado.monto());
                    break;
                case "LISTAR":
                    service.listar().forEach(p -> System.out.println(p.id() + " " + p.nombre() + " " + p.monto()));
                    break;
                case "MODIFICAR":
                    Optional<Pedido> cambiado = service.modificar(Integer.parseInt(partes[1]), Double.parseDouble(partes[2]));
                    System.out.println(cambiado.map(p -> "Modificado " + p.id() + ": " + p.monto()).orElse("No existe"));
                    break;
                case "BAJA":
                    System.out.println(service.eliminar(Integer.parseInt(partes[1])) ? "Eliminado " + partes[1] : "No existe");
                    break;
                default:
                    System.out.println("Fin");
                    seguir = false;
            }
        }
    }
}`)}`
    ]
  }
});

PRACTICA[123] = {
  tramo: 'f2parcial1',
  prev: 'lecciones 105 a 113.',
  objetivos: ['Construir un ABM completo en capas.', 'Aplicar una regla de negocio.', 'Medir lo aprendido con un simulacro.'],
  escalera: {
    vida: 'Un examen de manejo: juntás todo lo practicado, en un solo recorrido.',
    modelo: 'Es la misma receta, repetida con otro tema.',
    pseudo: 'Entidad → repository → service → controller → probar.',
    java: 'Cinco endpoints, H2 y JPA.',
    real: 'Un ABM es la tarea más común de un junior: hacerlo sin ayuda ya te vuelve útil en un equipo.'
  },
  items: [
    { t: 'order', q: 'Ordená cómo armar el parcial.', lines: ['Generar el proyecto', 'Configurar H2', 'Crear la entidad', 'Crear el repository', 'Escribir el service con la regla', 'Escribir el controller', 'Probar los cinco endpoints'], why: 'De adentro hacia afuera: cada capa se apoya en la anterior.' },
    { t: 'match', q: 'Uní cada operación con su endpoint.', pairs: [['Listar', 'GET /api/pedidos'], ['Buscar uno', 'GET /api/pedidos/1'], ['Dar de alta', 'POST /api/pedidos'], ['Modificar', 'PUT /api/pedidos/1'], ['Eliminar', 'DELETE /api/pedidos/1']], why: 'Son los cinco endpoints que pide el parcial.' }
  ]
};

LESSONS_F2.push({
  id: 124, level: 'coloquio', levelLabel: 'Segundo parcial', stars: '🏆🏆',
  title: 'Segundo parcial simulado',
  desc: 'Sobre el ABM: excepciones controladas, pruebas, documentación y Docker.',
  simple: () => `
${f2Card('📝', 'Qué se suma', `<p>El segundo parcial es <strong>muy parecido al primero</strong>, sobre un proyecto ya armado o un sistema nuevo, como facturación. Se agrega lo visto desde la clase 6:</p>
<ul><li>Tests unitarios con JUnit y Mockito.</li>
<li>Control de excepciones en la capa de servicio.</li>
<li>Una base de datos real con MySQL.</li>
<li>Logs.</li>
<li>Documentación con Swagger.</li>
<li>Docker.</li></ul>
<p>Por ejemplo: si al generar una factura el dato no está en la base, no debe explotar: se contiene la excepción y se responde un mensaje claro.</p>`)}
${ann('warn', '⚠️', 'Tiene fecha firme: entregarlo tarde deja afuera del coloquio y queda solo la condición de regular.')}`,
  tutorial: () => `
<div class="ts"><h3>Lista para aprobar</h3>
${cb('Control final', `[ ] La lógica lanza excepciones propias en el service
[ ] @RestControllerAdvice responde 404, 400 y 500
[ ] Hay tests del service con Mockito
[ ] Hay tests del controller con MockMvc
[ ] Hay logs de INFO y ERROR
[ ] Swagger documenta los endpoints
[ ] Corre con MySQL
[ ] docker compose up levanta todo`)}
${ann('java', '☕', 'En <code>ejemplos/kiosco-api</code> está todo esto junto: es tu mejor machete. Usalo para entender, y después escribí el tuyo.')}
</div>`,
  exercise: {
    desc: 'Sistema de facturación con control de errores. Facturador.generar(int clienteId, double monto) lanza ClienteNoEncontrado si el cliente no existe, y MontoInvalido si el monto no es positivo. Con los casos dados, imprimí el resultado o el mensaje, sin que el programa se detenga. Un manejar(RuntimeException) traduce cada error a su código.',
    expected: '200: Factura de Ana por 1500.0\n404: Cliente 7 no encontrado\n400: Monto inválido: -10.0',
    need: [['extends\\s+RuntimeException[\\s\\S]*extends\\s+RuntimeException', 'Creá las dos excepciones.'], ['\\bthrow\\s+new', 'Lanzá las excepciones desde el service.'], ['\\bcatch\\b', 'Contené el error con catch.'], ['Map<', 'Guardá los clientes en un Map.']],
    starter: `import java.util.HashMap;
import java.util.Map;

// Creá las excepciones y la clase Facturador

public class Main {
    public static void main(String[] args) {
        Map<Integer, String> clientes = new HashMap<>();
        clientes.put(1, "Ana");
        int[] ids = {1, 7, 1};
        double[] montos = {1500, 100, -10};
        // Generá cada factura y controlá los errores

    }
}`,
    hints: [
      'Cada excepción extiende <code>RuntimeException</code> y le pasa el mensaje a <code>super</code>.',
      'Validá el monto antes o después del cliente: los casos solo prueban uno por vez.',
      'Dentro del <code>for</code>, un <code>try-catch</code> por factura.',
      `La solución:<br>${cb('Solución', `import java.util.HashMap;
import java.util.Map;

class ClienteNoEncontrado extends RuntimeException {
    ClienteNoEncontrado(int id) {
        super("Cliente " + id + " no encontrado");
    }
}

class MontoInvalido extends RuntimeException {
    MontoInvalido(double monto) {
        super("Monto inválido: " + monto);
    }
}

class Facturador {
    private final Map<Integer, String> clientes;

    Facturador(Map<Integer, String> clientes) {
        this.clientes = clientes;
    }

    String generar(int clienteId, double monto) {
        if (!clientes.containsKey(clienteId)) {
            throw new ClienteNoEncontrado(clienteId);
        }
        if (monto <= 0) {
            throw new MontoInvalido(monto);
        }
        return "Factura de " + clientes.get(clienteId) + " por " + monto;
    }
}

public class Main {
    static String manejar(RuntimeException e) {
        int codigo = e instanceof ClienteNoEncontrado ? 404 : e instanceof MontoInvalido ? 400 : 500;
        return codigo + ": " + e.getMessage();
    }

    public static void main(String[] args) {
        Map<Integer, String> clientes = new HashMap<>();
        clientes.put(1, "Ana");
        int[] ids = {1, 7, 1};
        double[] montos = {1500, 100, -10};
        Facturador facturador = new Facturador(clientes);
        for (int i = 0; i < ids.length; i++) {
            try {
                System.out.println("200: " + facturador.generar(ids[i], montos[i]));
            } catch (RuntimeException e) {
                System.out.println(manejar(e));
            }
        }
    }
}`)}`
    ]
  }
});

PRACTICA[124] = {
  tramo: 'f2parcial2',
  prev: 'lecciones 114 a 119.',
  objetivos: ['Agregar pruebas y control de errores a un ABM.', 'Empaquetar y documentar el proyecto.', 'Medir lo aprendido con un simulacro.'],
  escalera: {
    vida: 'Ya manejás: ahora sumás luces, seguro y revisión técnica.',
    modelo: 'Un proyecto profesional no solo funciona: se prueba, se documenta y se despliega.',
    pseudo: 'ABM → excepciones → tests → logs → Swagger → Docker.',
    java: '<code>@RestControllerAdvice</code>, Mockito y <code>docker compose up</code>.',
    real: 'Esta lista es lo que distingue un ejercicio de un proyecto que se puede mostrar en una entrevista.'
  },
  items: [
    { t: 'bug', q: 'Una búsqueda sin control explota. ¿Qué línea corregís?', code: 'public FacturaResponse generar(Long clienteId) {\n    Cliente cliente = repository.findById(clienteId).get();\n    return crearFactura(cliente);\n}', line: 2, fix: '    Cliente cliente = repository.findById(clienteId).orElseThrow(() -> new RecursoNoEncontradoException("Cliente", clienteId));', noRun: true, why: '<code>get()</code> sobre vacío lanza una excepción genérica y daría 500. Con <code>orElseThrow</code> se responde 404.' },
    { t: 'order', q: 'Ordená cómo mejorar un ABM para el segundo parcial.', lines: ['Crear las excepciones de negocio', 'Agregar el manejador global', 'Escribir los tests', 'Cambiar a MySQL', 'Documentar con Swagger', 'Dockerizar'], why: 'Primero la calidad del código, y al final el empaquetado.' },
    { t: 'tf', q: 'El segundo parcial se puede entregar tarde sin consecuencias.', a: false, why: 'Fuera de fecha se pierde la carrera al coloquio.' }
  ]
};

LESSONS_F2.push({
  id: 125, level: 'coloquio', levelLabel: 'Coloquio', stars: '🏆🏆🏆',
  title: 'Coloquio: defensa oral',
  desc: 'La última instancia: un ejercicio práctico y la defensa de la teoría en voz alta.',
  simple: () => `
${f2Card('🎤', 'Por qué hay un coloquio', `<p>Hasta acá todo fue práctico. El coloquio suma lo que falta: <strong>explicar lo que hiciste</strong>. Es el mismo músculo que una entrevista laboral. Se llega con 7 o más en los dos parciales, y se resuelve un ejercicio y se defiende la teoría.</p>`)}
${f2Card('🗣️', 'Cómo responder', `<p>Una buena respuesta tiene tres partes: <strong>qué es</strong>, <strong>para qué sirve</strong> y <strong>un ejemplo tuyo</strong>.</p>
<p><em>"Un DTO es un objeto para transferir datos. Sirve para no exponer la entidad. En mi proyecto, ProductoRequest no incluye el id porque lo genera la base."</em></p>`)}
${ann('tip', '💡', 'Practicá en voz alta. Saber algo y poder explicarlo son dos habilidades distintas.')}`,
  tutorial: () => `
<div class="ts"><h3>Preguntas para ensayar</h3>
<table class="sym-tbl"><thead><tr><th>Tema</th><th>Pregunta</th></tr></thead><tbody>
<tr><td>Código limpio</td><td>¿Qué es la deuda técnica? ¿Qué es SOLID?</td></tr>
<tr><td>Spring</td><td>¿Qué aporta Spring Boot? ¿Qué es un bean?</td></tr>
<tr><td>Arquitectura</td><td>¿Qué hace cada capa? ¿Por qué interfaces en el service?</td></tr>
<tr><td>REST</td><td>¿Diferencia entre PUT y PATCH? ¿Qué significan 201 y 404?</td></tr>
<tr><td>Datos</td><td>¿Qué es JPA? ¿Qué es un DTO? ¿Borrado físico o lógico?</td></tr>
<tr><td>Testing</td><td>¿Qué es AAA? ¿Qué es un mock?</td></tr>
<tr><td>Docker</td><td>¿Imagen o contenedor? ¿Para qué sirve un volumen?</td></tr>
</tbody></table>
${ann('java', '☕', 'Cerrá con el cuestionario y con la práctica de esta lección. Al aprobar las dos fases, se habilita tu segundo certificado.')}
</div>`,
  quiz: {
    passing: 8,
    questions: [
      { question: '¿Qué es la deuda técnica?', options: ['El costo futuro de soluciones rápidas', 'Lo que cuesta una licencia', 'Un error de compilación', 'Un tipo de base de datos'], correct: 0 },
      { question: '¿Qué dice la S de SOLID?', options: ['Una clase, una sola responsabilidad', 'Usar static', 'Evitar interfaces', 'Escribir sin comentarios'], correct: 0 },
      { question: '¿Qué es un bean?', options: ['Un objeto administrado por Spring', 'Un archivo de configuración', 'Una tabla', 'Un test'], correct: 0 },
      { question: '¿Dónde va la lógica de negocio?', options: ['En el service', 'En el controller', 'En el repository', 'En el application.yml'], correct: 0 },
      { question: '¿Cuál es la inyección recomendada?', options: ['Por constructor', 'Por atributo público', 'Con new', 'Con static'], correct: 0 },
      { question: '¿Qué diferencia hay entre PUT y PATCH?', options: ['PUT reemplaza todo y PATCH una parte', 'PATCH crea', 'PUT elimina', 'No hay diferencia'], correct: 0 },
      { question: '¿Para qué sirve un DTO?', options: ['Transferir solo los datos necesarios', 'Crear tablas', 'Ejecutar tests', 'Levantar Docker'], correct: 0 },
      { question: '¿Qué es un mock?', options: ['Un doble que reemplaza una dependencia', 'Un tipo de excepción', 'Una tabla temporal', 'Un comando Git'], correct: 0 },
      { question: '¿Qué es un contenedor?', options: ['Una imagen en ejecución', 'Una carpeta', 'Un archivo .java', 'Un endpoint'], correct: 0 },
      { question: '¿Qué estructura tiene un test?', options: ['Preparar, ejecutar y verificar', 'Compilar y borrar', 'Leer e imprimir', 'Solo verificar'], correct: 0 }
    ]
  }
});

PRACTICA[125] = {
  tramo: 'f2todo',
  prev: 'toda la Fase 2.',
  objetivos: ['Defender en voz alta las decisiones de un proyecto.', 'Explicar la teoría con ejemplos propios.', 'Rendir un simulacro general.'],
  escalera: {
    vida: 'Explicarle a alguien cómo llegar a tu casa demuestra que conocés el camino.',
    modelo: 'Saber hacer y saber explicar son dos cosas distintas, y las dos se entrenan.',
    pseudo: 'Qué es → para qué sirve → un ejemplo de tu proyecto.',
    java: 'Tu propio proyecto es la mejor fuente de ejemplos.',
    real: 'Una entrevista técnica es un coloquio: te preguntan por qué hiciste lo que hiciste.'
  },
  items: [
    { t: 'short', q: 'Defendé: ¿por qué tu service es una interfaz y una implementación?', any: [['desacopl', 'contrato', 'cambiar', 'reemplaz', 'separ', 'probar']], model: 'Para separar el contrato de la implementación: el controller depende de la interfaz y puedo cambiar el cómo sin tocarlo.', why: 'Es inversión de dependencias aplicada a tu proyecto.' },
    { t: 'short', q: 'Defendé: ¿por qué no devolvés la entidad en el controller?', any: [['dto', 'expon', 'datos', 'interno', 'segur', 'acopl']], model: 'Porque usaría un DTO para no exponer datos internos y no atar la API a la estructura de la tabla.', why: 'Motivo técnico y motivo de seguridad.' },
    { t: 'short', q: 'Defendé: ¿qué probarías primero si tuvieras poco tiempo?', any: [['negocio', 'service', 'regla', 'importante', 'logica', 'critic']], model: 'La lógica de negocio del service, y sus casos de borde: es donde un error cuesta más.', why: 'Priorizar también es una habilidad profesional.' },
    { t: 'short', q: 'Explicá la diferencia entre error de compilación, excepción y error de lógica.', any: [['compil'], ['ejecu', 'excepcion', 'corriendo'], ['logic', 'resultado', 'mal', 'incorrect']], model: 'El de compilación no deja generar el programa; la excepción ocurre al ejecutar; el de lógica corre sin fallar, pero da un resultado incorrecto.', why: 'Cada uno se detecta con una herramienta distinta.' }
  ]
};
