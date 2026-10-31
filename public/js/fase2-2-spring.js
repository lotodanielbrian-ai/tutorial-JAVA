// Java INPRO — Fase 2, tramo Spring Boot (lecciones 105 a 110).
// El código de Spring se verifica con tests/spring-check.js contra el JDK y las librerías reales.
var LESSONS_F2 = typeof LESSONS_F2 === 'undefined' ? [] : LESSONS_F2;
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

LESSONS_F2.push({
  id: 105, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'Spring Boot y Maven',
  desc: 'Creá tu primer proyecto real: qué resuelve Spring Boot, cómo funciona Maven y cómo está armado un proyecto.',
  simple: () => `
${f2Card('🏠', 'Pensalo así...', `<p>Podés construir una casa comprando cada ladrillo y cada caño (<strong>Spring</strong>), o mudarte a una casa ya armada, con luz y agua, y dedicarte a decorarla (<strong>Spring Boot</strong>). El framework resuelve lo repetitivo para que vos te ocupes de la lógica de tu negocio.</p>`)}
${f2Card('🛒', 'Maven es tu lista de compras', `<p>El <code>pom.xml</code> es la lista. Anotás lo que necesitás y Maven va al mercado (<strong>Maven Central</strong>), lo descarga y lo deja listo. Nunca más hay que bajar un <code>.jar</code> a mano.</p>`)}
${f2Mini('¿Por qué no hace falta instalar un servidor?', 'Porque Spring Boot trae Tomcat embebido: tu aplicación ya incluye su propio servidor web.')}
${f2Mini('¿Qué diferencia hay entre JAR y WAR?', 'El JAR se ejecuta solo, con java -jar. El WAR se despliega dentro de un servidor externo.')}
${f2Mini('¿Qué hace mvn clean?', 'Borra la carpeta target con todo lo compilado, para empezar de cero.')}`,
  tutorial: () => `
<div class="ts"><h3>Spring frente a Spring Boot</h3>
<table class="sym-tbl"><thead><tr><th></th><th>Spring</th><th>Spring Boot</th></tr></thead><tbody>
<tr><td>Configuración</td><td>Manual y extensa</td><td>Automática, con valores por defecto</td></tr>
<tr><td>Servidor</td><td>Externo</td><td>Tomcat embebido</td></tr>
<tr><td>Dependencias</td><td>Una por una</td><td>Paquetes llamados <em>starters</em></td></tr>
<tr><td>Dónde se invierte el tiempo</td><td>En configurar</td><td>En la lógica de negocio</td></tr>
</tbody></table></div>
<div class="ts"><h3>Qué necesitás</h3>
<ul><li><strong>JDK 17 o superior</strong>. Spring Boot 3 no funciona con versiones anteriores. Conviene la última LTS.</li>
<li><strong>Un IDE</strong>: IntelliJ, VS Code o Eclipse.</li>
<li><strong>Maven</strong>: el proyecto ya trae <code>mvnw</code>, así que ni siquiera hace falta instalarlo.</li></ul>
${ann('tip', '💡', 'Con <strong>SDKMAN</strong> podés instalar y cambiar entre versiones de Java y Maven con un comando, sin tocar las variables de entorno.')}</div>
<div class="ts"><h3>La estructura de un proyecto</h3>
${cb('Carpetas', `kiosco-api/
├── pom.xml                     lista de dependencias
├── src/main/java/...           tu código
├── src/main/resources/
│   ├── application.yml         configuración
│   └── data.sql                datos iniciales
├── src/test/java/...           tus pruebas
└── target/                     lo compilado, no va a Git`)}
</div>
<div class="ts"><h3>El ciclo de vida de Maven</h3>
<table class="sym-tbl"><thead><tr><th>Comando</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>mvn clean</code></td><td>Borra <code>target</code></td></tr>
<tr><td><code>mvn compile</code></td><td>Compila el código</td></tr>
<tr><td><code>mvn test</code></td><td>Compila y ejecuta las pruebas</td></tr>
<tr><td><code>mvn package</code></td><td>Genera el <code>.jar</code></td></tr>
<tr><td><code>mvn spring-boot:run</code></td><td>Levanta la aplicación</td></tr>
</tbody></table></div>
<div class="ts"><h3>Una dependencia en el pom.xml</h3>
${cb('pom.xml', `<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>`)}
<table class="sym-tbl"><thead><tr><th>Starter</th><th>Para qué</th></tr></thead><tbody>
<tr><td><code>spring-boot-starter-web</code></td><td>API REST con Tomcat</td></tr>
<tr><td><code>spring-boot-starter-data-jpa</code></td><td>Base de datos con JPA</td></tr>
<tr><td><code>h2</code></td><td>Base de datos en memoria</td></tr>
<tr><td><code>lombok</code></td><td>Menos código repetitivo</td></tr>
<tr><td><code>spring-boot-devtools</code></td><td>Reinicia la aplicación al guardar</td></tr>
<tr><td><code>springdoc-openapi</code></td><td>Documentación con Swagger</td></tr>
</tbody></table></div>
<div class="ts"><h3>La clase principal</h3>
${cb('KioscoApiApplication.java', `@SpringBootApplication
public class KioscoApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(KioscoApiApplication.class, args);
    }
}`)}
${f2Pc('tu primer proyecto', [
    'Entrá a <code>start.spring.io</code>.',
    'Elegí Maven, Java 17 o superior y Spring Boot 3.',
    'Agregá las dependencias Spring Web, Spring Data JPA, H2 y Lombok.',
    'Apretá <strong>Generate</strong>, descomprimí y abrí la carpeta en tu IDE.',
    'Ejecutá <code>./mvnw spring-boot:run</code> y mirá el puerto 8080 en la consola.'
  ])}
${ann('java', '☕', 'Tenés un proyecto completo de referencia en <code>ejemplos/kiosco-api</code> del repositorio del curso.')}
</div>`,
  quiz: {
    passing: 5,
    questions: [
      { question: '¿Qué aporta Spring Boot sobre Spring?', options: ['Configuración automática y servidor embebido', 'Otro lenguaje de programación', 'Una base de datos', 'Un sistema operativo'], correct: 0 },
      { question: '¿Dónde se declaran las dependencias de un proyecto Maven?', options: ['pom.xml', 'application.yml', 'data.sql', 'Main.java'], correct: 0 },
      { question: '¿Qué versión mínima de Java pide Spring Boot 3?', options: ['17', '8', '11', '21'], correct: 0 },
      { question: '¿Qué comando genera el .jar del proyecto?', options: ['mvn package', 'mvn clean', 'java run', 'git commit'], correct: 0 },
      { question: '¿En qué puerto arranca Tomcat por defecto?', options: ['8080', '3306', '443', '21'], correct: 0 },
      { question: '¿Qué carpeta no debería subirse a Git?', options: ['target', 'src', 'src/main/resources', 'src/test'], correct: 0 }
    ]
  }
});

PRACTICA[105] = {
  prev: 'clases, paquetes y Git de la Fase 1.',
  objetivos: ['Explicar qué resuelven Spring Boot y Maven.', 'Crear un proyecto con Spring Initializr.', 'Usar el ciclo de vida de Maven.'],
  escalera: {
    vida: 'Mudarte a una casa con luz y agua en lugar de construirla ladrillo por ladrillo.',
    modelo: 'Un framework resuelve lo repetitivo. Vos te ocupás de la lógica de tu negocio.',
    pseudo: 'Elegir dependencias → generar el proyecto → compilar → ejecutar.',
    java: '<code>@SpringBootApplication</code> y <code>SpringApplication.run(...)</code>.',
    real: 'La mayoría de los puestos Java piden Spring Boot: es el punto de partida de un backend profesional.'
  },
  items: [
    { t: 'match', q: 'Uní cada comando con lo que hace.', pairs: [['mvn clean', 'Borra la carpeta target'], ['mvn compile', 'Compila el código'], ['mvn test', 'Ejecuta las pruebas'], ['mvn package', 'Genera el .jar']], why: 'Cada fase de Maven incluye las anteriores: <code>package</code> compila y prueba antes de empaquetar.' },
    { t: 'tf', q: 'Una aplicación Spring Boot necesita instalar Tomcat aparte.', a: false, why: 'Tomcat viene embebido en el <code>.jar</code>.' },
    { t: 'mc', q: 'Te faltan librerías al compilar. ¿Dónde las agregás?', o: ['En <code>pom.xml</code>', 'En <code>data.sql</code>', 'Copiando archivos a <code>target</code>', 'En el <code>README</code>'], a: 0, why: 'Maven lee el <code>pom.xml</code> y descarga lo que haga falta.' },
    { t: 'order', q: 'Ordená cómo crear y levantar un proyecto.', lines: ['Generarlo en start.spring.io', 'Abrirlo en el IDE', 'Esperar que Maven baje las dependencias', 'Ejecutar mvnw spring-boot:run', 'Ver el puerto 8080 en la consola'], why: 'Es la receta de cualquier proyecto nuevo.' },
    { t: 'fill', q: 'Completá la clase principal.', code: '@___\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.___(Application.class, args);\n    }\n}', a: [['SpringBootApplication'], ['run']], spring: true, noRun: true, why: 'Esa anotación activa la configuración automática y <code>run</code> levanta la aplicación.' },
    { t: 'bug', q: 'Encontrá el error en el comando: se quiere ejecutar el proyecto.', code: 'mvn clean\nmvn package\njava -jar pom.xml', line: 3, fix: 'java -jar target/kiosco-api-1.0.0.jar', noRun: true, why: 'Lo que se ejecuta es el <code>.jar</code> generado en <code>target</code>, no el <code>pom.xml</code>.' },
    { t: 'short', q: '¿Qué problema resuelve Maven?', any: [['dependencia', 'librer', 'descarg', 'compil', 'construc', 'version']], model: 'Gestiona las dependencias y las versiones, y automatiza compilar, probar y empaquetar el proyecto.', why: 'Sin Maven habría que buscar cada librería a mano.' }
  ]
};

LESSONS_F2.push({
  id: 106, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'HTTP y API REST',
  desc: 'Entendé cómo se hablan el cliente y el servidor: verbos, rutas, códigos de estado y JSON.',
  simple: () => `
${f2Card('🍽️', 'El mozo del restaurante', `<p>Vos no entrás a la cocina: le pedís al <strong>mozo</strong>, él lleva el pedido y vuelve con el plato. Una <strong>API</strong> es ese mozo: el cliente pide, el servidor prepara y la API trae la respuesta.</p>
<p>Hay un menú (las <strong>rutas</strong>), una forma de pedir (los <strong>verbos</strong>) y un resultado claro: acá está tu plato (200), se acabó (404) o la cocina se incendió (500).</p>`)}
${f2Mini('¿Qué es JSON?', 'Un formato de texto para intercambiar datos: {"nombre":"Yerba","precio":4500}.')}
${f2Mini('¿De quién es la culpa en un 404? ¿Y en un 500?', 'Los 4xx son errores del cliente. Los 5xx son errores del servidor.')}`,
  tutorial: () => `
<div class="ts"><h3>Los verbos</h3>
<table class="sym-tbl"><thead><tr><th>Verbo</th><th>Acción</th><th>Equivalente SQL</th><th>Anotación</th></tr></thead><tbody>
<tr><td><code>GET</code></td><td>Leer</td><td>SELECT</td><td><code>@GetMapping</code></td></tr>
<tr><td><code>POST</code></td><td>Crear</td><td>INSERT</td><td><code>@PostMapping</code></td></tr>
<tr><td><code>PUT</code></td><td>Reemplazar todo</td><td>UPDATE</td><td><code>@PutMapping</code></td></tr>
<tr><td><code>PATCH</code></td><td>Cambiar una parte</td><td>UPDATE</td><td><code>@PatchMapping</code></td></tr>
<tr><td><code>DELETE</code></td><td>Eliminar</td><td>DELETE</td><td><code>@DeleteMapping</code></td></tr>
</tbody></table>
${ann('tip', '💡', 'PUT reemplaza toda la entidad. PATCH cambia solo los campos que le mandás.')}
</div>
<div class="ts"><h3>Los códigos de estado</h3>
<table class="sym-tbl"><thead><tr><th>Código</th><th>Significado</th><th>Cuándo</th></tr></thead><tbody>
<tr><td><code>200</code></td><td>OK</td><td>Salió bien</td></tr>
<tr><td><code>201</code></td><td>Created</td><td>Se creó un recurso</td></tr>
<tr><td><code>204</code></td><td>No Content</td><td>Salió bien, sin nada que devolver</td></tr>
<tr><td><code>400</code></td><td>Bad Request</td><td>Datos mal enviados</td></tr>
<tr><td><code>401</code></td><td>Unauthorized</td><td>Sin credenciales</td></tr>
<tr><td><code>403</code></td><td>Forbidden</td><td>Sin permiso</td></tr>
<tr><td><code>404</code></td><td>Not Found</td><td>No existe</td></tr>
<tr><td><code>409</code></td><td>Conflict</td><td>Choca con lo que hay, como un duplicado</td></tr>
<tr><td><code>500</code></td><td>Internal Server Error</td><td>Falló el servidor</td></tr>
</tbody></table></div>
<div class="ts"><h3>Las rutas de un recurso</h3>
<p>En REST la ruta nombra <strong>el recurso</strong>, en plural, y el verbo dice qué hacer con él.</p>
${cb('Convención REST', `GET    /api/productos        lista todos
GET    /api/productos/3      busca uno
POST   /api/productos        crea uno
PUT    /api/productos/3      reemplaza uno
DELETE /api/productos/3      elimina uno`)}
${ann('warn', '⚠️', 'Evitá rutas como <code>/api/borrarProducto</code>: el verbo DELETE ya lo dice.')}
</div>
<div class="ts"><h3>Una respuesta en JSON</h3>
${cb('Respuesta', `{
  "id": 3,
  "nombre": "Termo",
  "precio": 18000.0,
  "stock": 8
}`)}
${ann('java', '☕', 'En la pestaña Práctica vas a usar un laboratorio con un servidor simulado para hacer pedidos reales, sin instalar nada.')}
</div>`,
  quiz: {
    passing: 5,
    questions: [
      { question: '¿Qué verbo se usa para crear un recurso?', options: ['POST', 'GET', 'DELETE', 'HEAD'], correct: 0 },
      { question: '¿Qué significa un 404?', options: ['El recurso no existe', 'Se creó bien', 'Falló el servidor', 'Falta iniciar sesión'], correct: 0 },
      { question: 'Tras crear un recurso, ¿qué código corresponde?', options: ['201', '200', '204', '500'], correct: 0 },
      { question: '¿Cuál es la diferencia entre PUT y PATCH?', options: ['PUT reemplaza todo y PATCH cambia una parte', 'Son idénticos', 'PATCH borra', 'PUT solo lee'], correct: 0 },
      { question: '¿Cuál es la ruta más correcta en REST?', options: ['DELETE /api/productos/3', 'GET /api/borrarProducto?id=3', 'POST /borrar', 'GET /eliminar/3'], correct: 0 },
      { question: 'Los códigos 5xx indican un error...', options: ['Del servidor', 'Del cliente', 'De red del usuario', 'De diseño visual'], correct: 0 }
    ]
  }
});

PRACTICA[106] = {
  prev: 'qué es un cliente y un servidor web.',
  objetivos: ['Elegir el verbo HTTP correcto.', 'Interpretar códigos de estado.', 'Diseñar rutas REST.'],
  escalera: {
    vida: 'Un mozo lleva tu pedido a la cocina y vuelve con el plato: no entrás a cocinar.',
    modelo: 'El cliente envía una petición con verbo y ruta. El servidor devuelve un estado y datos.',
    pseudo: 'Pedir la lista → recibir 200 con los datos. Pedir algo inexistente → recibir 404.',
    java: 'Cada verbo tiene su anotación: <code>@GetMapping</code>, <code>@PostMapping</code>...',
    real: 'Cuando tu app del banco muestra el saldo, está haciendo un GET a una API como esta.'
  },
  items: [
    { t: 'match', q: 'Uní cada acción con su verbo.', pairs: [['Ver el catálogo', 'GET'], ['Cargar un producto nuevo', 'POST'], ['Reemplazar todos los datos', 'PUT'], ['Dar de baja', 'DELETE']], why: 'Cada verbo tiene un significado: usarlo bien hace que la API se entienda sola.' },
    { t: 'match', q: 'Uní cada situación con su código.', pairs: [['Se creó el pedido', '201'], ['Pedís el producto 999 y no existe', '404'], ['Mandaste el precio negativo', '400'], ['Se cayó la base de datos', '500']], why: 'Los 2xx son éxito, los 4xx son del cliente y los 5xx del servidor.' },
    { t: 'http', q: 'Tu primer pedido', task: 'Pedile al servidor la lista completa de productos.', goal: { method: 'GET', path: '^/api/productos$', status: 200 }, demo: [['GET', '/api/productos']], hint: 'Usá GET sobre <code>/api/productos</code>.', why: 'Un GET lee sin cambiar nada.' },
    { t: 'http', q: 'Buscá uno solo', task: 'Traé únicamente el producto con id 3 y mirá su <code>precioFinal</code>: lleva recargo por ser caro.', goal: { method: 'GET', path: '^/api/productos/3$', status: 200, contains: '20700' }, demo: [['GET', '/api/productos/3']], hint: 'El id va en la ruta: <code>/api/productos/3</code>.', why: 'El servidor aplica su regla de negocio: el cliente no la calcula.' },
    { t: 'http', q: 'Provocá un 404', task: 'Pedí un producto que no exista y leé la respuesta.', goal: { method: 'GET', path: '/api/productos/\\d+', status: 404 }, demo: [['GET', '/api/productos/99']], hint: 'Probá con un id alto, como 99.', why: 'Un buen error explica qué pasó, no solo un número.' },
    { t: 'bug', q: 'Encontrá el error en el diseño de estas rutas.', code: 'GET    /api/productos\nGET    /api/productos/3\nGET    /api/productos/borrar/3\nPOST   /api/productos', line: 3, fix: 'DELETE /api/productos/3', noRun: true, why: 'Un GET nunca debe modificar datos. Borrar es <code>DELETE</code> sobre el recurso.' },
    { t: 'tf', q: 'Una petición GET debería poder repetirse sin cambiar nada en el servidor.', a: true, why: 'Es la promesa de GET: solo lee.' },
    { t: 'short', q: 'Explicá con tus palabras qué es una API.', any: [['comunic', 'intermedi', 'pedido', 'peticion', 'puente', 'mozo', 'interfaz', 'hablar'], ['sistema', 'cliente', 'servidor', 'programa', 'aplicacion', 'datos']], model: 'Es la forma en que dos programas se comunican: el cliente hace pedidos y el servidor responde con datos.', why: 'Si podés explicarlo con el ejemplo del mozo, ya lo entendiste.' }
  ]
};

LESSONS_F2.push({
  id: 107, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'Arquitectura en capas',
  desc: 'Separá la aplicación en controller, service y repository: cada capa con una responsabilidad.',
  simple: () => `
${f2Card('🍕', 'La pizzería', `<p>El <strong>cajero</strong> toma el pedido (controller). El <strong>pizzero</strong> sabe la receta y arma la pizza (service). El <strong>encargado del depósito</strong> trae los ingredientes (repository). El cajero no amasa y el pizzero no cobra. Si cambia el proveedor, la receta sigue igual.</p>`)}
${f2Mini('¿Dónde va la regla "si supera $5000 lleva recargo"?', 'En el service: es lógica de negocio.')}
${f2Mini('¿El controller puede hablar directo con la base?', 'No debería: pasa siempre por el service.')}`,
  tutorial: () => `
<div class="ts"><h3>El recorrido de un pedido</h3>
${cb('Flujo', `Cliente  →  Controller  →  Service  →  Repository  →  Base de datos
             recibe        decide       consulta       guarda
Cliente  ←  Controller  ←  Service  ←  Repository  ←  Base de datos`)}
<table class="sym-tbl"><thead><tr><th>Capa</th><th>Responsabilidad</th><th>Anotación</th></tr></thead><tbody>
<tr><td>Controller</td><td>Recibe HTTP y responde</td><td><code>@RestController</code></td></tr>
<tr><td>Service</td><td>Lógica de negocio</td><td><code>@Service</code></td></tr>
<tr><td>Repository</td><td>Acceso a datos</td><td><code>@Repository</code></td></tr>
<tr><td>Model</td><td>Las entidades</td><td><code>@Entity</code></td></tr>
<tr><td>DTO</td><td>Lo que entra y sale de la API</td><td><code>record</code></td></tr>
<tr><td>Exception</td><td>Errores de la aplicación</td><td><code>@RestControllerAdvice</code></td></tr>
</tbody></table></div>
<div class="ts"><h3>El paquete de cada cosa</h3>
${cb('Paquetes', `com.javainpro.kiosco
├── controller/   ProductoController
├── service/      ProductoService, ProductoServiceImpl
├── repository/   ProductoRepository
├── model/        Producto
├── dto/          ProductoRequest, ProductoResponse
└── exception/    GlobalExceptionHandler`)}
${ann('tip', '💡', 'El service se define en dos partes: una interfaz con el qué y una clase con el cómo. Así podés cambiar la implementación sin tocar el controller.')}
</div>
<div class="ts"><h3>¿Por qué se llama MVC?</h3>
<p>Modelo, Vista y Controlador. En una API REST no hay vista: lo que viaja es JSON. Existen otras arquitecturas, como la hexagonal o el diseño guiado por dominio, pero en capas es la más simple y usada para empezar.</p>
${ann('java', '☕', 'El ejercicio no usa Spring para poder correr en el navegador: armás las mismas tres capas en Java puro. La idea es idéntica.')}
</div>`,
  exercise: {
    desc: 'Armá las tres capas sin Spring. ProductoRepository guarda los precios. ProductoService aplica la regla: si el precio supera 5000, suma 15%. ProductoController recibe un nombre e imprime el resultado. Main solo crea las capas y llama al controller.',
    expected: 'Alfajor: 1200.0\nTermo: 20700.0',
    need: [['class\\s+ProductoRepository', 'Creá la clase ProductoRepository.'], ['class\\s+ProductoService', 'Creá la clase ProductoService.'], ['class\\s+ProductoController', 'Creá la clase ProductoController.']],
    starter: `// Creá ProductoRepository, ProductoService y ProductoController

public class Main {
    public static void main(String[] args) {
        // Creá las capas y consultá "Alfajor" (1200) y "Termo" (18000)

    }
}`,
    hints: [
      'El repository tiene un método <code>double buscarPrecio(String nombre)</code> con un <code>if</code>.',
      'El service recibe el repository por constructor y tiene <code>double precioFinal(String nombre)</code>.',
      'El controller recibe el service y tiene <code>void mostrar(String nombre)</code>.',
      `La solución:<br>${cb('Solución', `class ProductoRepository {
    double buscarPrecio(String nombre) {
        return nombre.equals("Termo") ? 18000 : 1200;
    }
}

class ProductoService {
    private final ProductoRepository repository;

    ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    double precioFinal(String nombre) {
        double precio = repository.buscarPrecio(nombre);
        return precio > 5000 ? precio * 1.15 : precio;
    }
}

class ProductoController {
    private final ProductoService service;

    ProductoController(ProductoService service) {
        this.service = service;
    }

    void mostrar(String nombre) {
        System.out.println(nombre + ": " + service.precioFinal(nombre));
    }
}

public class Main {
    public static void main(String[] args) {
        ProductoController controller = new ProductoController(new ProductoService(new ProductoRepository()));
        controller.mostrar("Alfajor");
        controller.mostrar("Termo");
    }
}`)}`
    ]
  }
});

PRACTICA[107] = {
  prev: 'clases, interfaces y responsabilidad única.',
  objetivos: ['Ubicar cada responsabilidad en su capa.', 'Seguir el recorrido de un pedido.', 'Organizar un proyecto en paquetes.'],
  escalera: {
    vida: 'En una pizzería, el cajero toma el pedido, el pizzero cocina y el depósito trae los ingredientes.',
    modelo: 'Cada capa tiene una sola responsabilidad y solo habla con la siguiente.',
    pseudo: 'Recibir el pedido → aplicar reglas → consultar datos → responder.',
    java: '<code>@RestController</code> → <code>@Service</code> → <code>@Repository</code>.',
    real: 'Si mañana la API se reemplaza por otra interfaz, la lógica del service no cambia.'
  },
  items: [
    { t: 'match', q: 'Uní cada rol de la pizzería con su capa.', pairs: [['Cajero', 'Controller'], ['Pizzero', 'Service'], ['Depósito', 'Repository'], ['La pizza', 'Model']], why: 'Cada uno hace lo suyo y nadie se mete en el trabajo del otro.' },
    { t: 'mc', q: '¿En qué capa va validar que el stock alcance para vender?', o: ['Service', 'Controller', 'Repository', 'En el <code>pom.xml</code>'], a: 0, why: 'Es una regla del negocio.' },
    { t: 'order', q: 'Ordená el camino de un GET.', lines: ['El cliente envía la petición', 'El controller la recibe', 'El service aplica la lógica', 'El repository consulta la base', 'El controller devuelve JSON'], why: 'Entra por el controller y vuelve por el mismo camino.' },
    { t: 'bug', q: 'Esta capa está haciendo trabajo que no le corresponde. ¿Qué línea sobra?', code: '@RestController\nclass ProductoController {\n    private final ProductoRepository repository;\n    ProductoController(ProductoRepository repository) { this.repository = repository; }\n    @GetMapping("/precio")\n    public double precio() {\n        return repository.findAll().get(0).getPrecio() * 1.15;\n    }\n}', line: 7, fix: '        return service.precioFinal();', noRun: true, why: 'El cálculo del recargo es lógica de negocio: va en el service, y el controller solo lo llama.' },
    { t: 'tf', q: 'El repository debería conocer las reglas de negocio.', a: false, why: 'Solo guarda y consulta. Las reglas están en el service.' },
    { t: 'fill', q: 'Completá las anotaciones de cada capa.', code: '@___\nclass ProductoControllerA {\n}\n\n@___\nclass ProductoServiceA {\n}', a: [['RestController'], ['Service']], spring: true, noRun: true, why: 'Con ellas Spring detecta y crea cada clase.' },
    { t: 'short', q: '¿Qué ganás separando en capas en lugar de escribir todo en una clase?', any: [['responsabilidad', 'separ', 'cambiar', 'mantener', 'probar', 'orden', 'reutiliz']], model: 'Cada parte tiene su responsabilidad, y se puede cambiar o probar una sin tocar las demás.', why: 'Es la responsabilidad única llevada a toda la aplicación.' }
  ]
};

LESSONS_F2.push({
  id: 108, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'Records, Map, Optional y lambdas',
  desc: 'Las herramientas de Java moderno que aparecen en cada proyecto Spring.',
  simple: () => `
${f2Card('📦', 'Optional: la caja que puede venir vacía', `<p>Pedís un paquete al correo. Antes de usar lo que tiene adentro, te fijás si llegó algo. <code>Optional</code> es esa caja: te obliga a pensar qué pasa si no hay nada, y te salva del famoso <code>NullPointerException</code>.</p>`)}
${f2Card('📒', 'Map: la agenda', `<p>En una agenda buscás por nombre, no por posición. <code>Map</code> guarda pares de <strong>clave</strong> y <strong>valor</strong>: le das el DNI y te devuelve la persona.</p>`)}
${f2Card('🏭', 'Stream: la cinta de una fábrica', `<p>Los productos pasan por una cinta: uno filtra los fallados, otro los etiqueta y al final se empaquetan. Un <code>stream</code> hace eso con una lista, y cada paso recibe una <strong>lambda</strong>: una función chiquita que escribís en el momento.</p>`)}
${f2Mini('¿Qué es un record?', 'Una clase para llevar datos: los atributos, el constructor y los métodos de lectura se escriben solos.')}
${f2Mini('¿Qué es un enum?', 'Un tipo con valores fijos, como los días de la semana o los estados de un pedido.')}`,
  tutorial: () => `
<div class="ts"><h3>record y enum</h3>
${cb('Tipos modernos', `record ProductoResponse(Long id, String nombre, Double precio) {
}

ProductoResponse r = new ProductoResponse(1L, "Yerba", 4500.0);
System.out.println(r.nombre());   // sin get

enum Estado { PENDIENTE, ENVIADO, ENTREGADO }

Estado e = Estado.ENVIADO;`)}
</div>
<div class="ts"><h3>Map</h3>
${cb('Clave y valor', `Map<String, Integer> stock = new HashMap<>();
stock.put("yerba", 3);
stock.get("yerba");                // 3
stock.getOrDefault("mate", 0);     // 0
stock.containsKey("yerba");        // true`)}
${ann('warn', '⚠️', '<code>HashMap</code> no garantiza ningún orden. Si necesitás el orden de carga, usá <code>LinkedHashMap</code>.')}
</div>
<div class="ts"><h3>Optional</h3>
${cb('Sin null', `Optional<Producto> encontrado = repository.findById(id);

// Mal: si está vacío, explota
Producto p = encontrado.get();

// Bien: dice qué hacer si no está
Producto p = encontrado.orElseThrow(() -> new NoEncontradoException(id));`)}
</div>
<div class="ts"><h3>Lambdas y referencias a métodos</h3>
${cb('Funciones cortas', `x -> x * 2                    // recibe x, devuelve el doble
(a, b) -> a + b               // dos parámetros
() -> new Exception("Error")  // sin parámetros
Producto::getNombre           // referencia a un método`)}
</div>
<div class="ts"><h3>Streams</h3>
${cb('La cinta de la fábrica', `List<String> baratos = productos.stream()
        .filter(p -> p.precio() < 5000)   // deja pasar
        .map(ProductoResponse::nombre)    // transforma
        .toList();                        // empaqueta`)}
<table class="sym-tbl"><thead><tr><th>Operación</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>filter</code></td><td>Deja pasar lo que cumple una condición</td></tr>
<tr><td><code>map</code></td><td>Transforma cada elemento</td></tr>
<tr><td><code>sorted</code></td><td>Ordena</td></tr>
<tr><td><code>toList</code></td><td>Junta el resultado en una lista</td></tr>
<tr><td><code>count</code>, <code>sum</code></td><td>Calculan un total</td></tr>
</tbody></table>
${ann('java', '☕', 'En un service, <code>stream().map(...)</code> convierte entidades en DTO. Lo vas a escribir todo el tiempo.')}
</div>`,
  exercise: {
    desc: 'Con un record Producto(String nombre, double precio), filtrá los que cuestan menos de 5000, ordená por precio y mostrá solo los nombres. Después buscá "Termo" con un Optional e imprimí su precio, o 0 si no está.',
    expected: '[Alfajor, Yerba]\nTermo: 18000.0\nDulce: 0.0',
    need: [['\\brecord\\s+Producto', 'Definí el record Producto.'], ['\\.stream\\(\\)', 'Usá stream().'], ['\\.filter\\(', 'Filtrá con filter.'], ['Optional', 'Devolvé un Optional en la búsqueda.']],
    starter: `import java.util.Comparator;
import java.util.List;
import java.util.Optional;

// Definí el record Producto

public class Main {
    static List<Producto> productos = List.of(
        new Producto("Yerba", 4500),
        new Producto("Termo", 18000),
        new Producto("Alfajor", 1200)
    );

    // Creá static Optional<Producto> buscar(String nombre)

    public static void main(String[] args) {
        // Imprimí los baratos, y el precio de "Termo" y "Dulce"

    }
}`,
    hints: [
      'El record entra en una línea: <code>record Producto(String nombre, double precio) { }</code>.',
      'Ordená con <code>.sorted(Comparator.comparing(Producto::precio))</code> y transformá con <code>.map(Producto::nombre)</code>.',
      'Para buscar: <code>.filter(p -&gt; p.nombre().equals(nombre)).findFirst()</code>.',
      'Para el precio: <code>buscar(n).map(Producto::precio).orElse(0.0)</code>.',
      `La solución:<br>${cb('Solución', `import java.util.Comparator;
import java.util.List;
import java.util.Optional;

record Producto(String nombre, double precio) {
}

public class Main {
    static List<Producto> productos = List.of(
        new Producto("Yerba", 4500),
        new Producto("Termo", 18000),
        new Producto("Alfajor", 1200)
    );

    static Optional<Producto> buscar(String nombre) {
        return productos.stream().filter(p -> p.nombre().equals(nombre)).findFirst();
    }

    public static void main(String[] args) {
        List<String> baratos = productos.stream()
                .filter(p -> p.precio() < 5000)
                .sorted(Comparator.comparing(Producto::precio))
                .map(Producto::nombre)
                .toList();
        System.out.println(baratos);
        System.out.println("Termo: " + buscar("Termo").map(Producto::precio).orElse(0.0));
        System.out.println("Dulce: " + buscar("Dulce").map(Producto::precio).orElse(0.0));
    }
}`)}`
    ]
  }
});

PRACTICA[108] = {
  prev: 'ArrayList, clases e interfaces.',
  objetivos: ['Usar <code>record</code>, <code>enum</code> y <code>Map</code>.', 'Evitar <code>null</code> con <code>Optional</code>.', 'Transformar listas con lambdas y streams.'],
  escalera: {
    vida: 'Una cinta de fábrica: filtra los fallados, etiqueta el resto y empaqueta.',
    modelo: 'Un stream describe qué hacer con cada elemento, en pasos encadenados.',
    pseudo: 'De la lista → dejar los baratos → quedarse con el nombre → juntar.',
    java: '<code>lista.stream().filter(...).map(...).toList()</code>',
    real: 'Convertir las filas de la base en respuestas JSON se hace con esta cadena en casi todo service.'
  },
  items: [
    { t: 'output', q: 'Seguí la cinta. ¿Qué imprime?', code: 'import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> n = List.of(1, 2, 3, 4, 5, 6);\n        System.out.println(n.stream().filter(x -> x % 2 == 0).map(x -> x * 10).toList());\n    }\n}', a: '[20, 40, 60]', why: 'Primero quedan los pares y después se multiplican.' },
    { t: 'output', q: 'Un record imprime sus datos solo. ¿Qué imprime?', code: 'record Punto(int x, int y) {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Punto p = new Punto(2, 5);\n        System.out.println(p);\n        System.out.println(p.x() + p.y());\n    }\n}', a: 'Punto[x=2, y=5]\n7', why: 'Un record genera <code>toString</code> y los métodos de lectura, que van sin <code>get</code>.' },
    { t: 'output', q: 'Contar con un Map. ¿Qué imprime?', code: 'import java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class Main {\n    public static void main(String[] args) {\n        Map<String, Integer> c = new LinkedHashMap<>();\n        String[] votos = {"a", "b", "a"};\n        for (String v : votos) {\n            c.put(v, c.getOrDefault(v, 0) + 1);\n        }\n        System.out.println(c);\n    }\n}', a: '{a=2, b=1}', why: '<code>getOrDefault</code> evita el <code>null</code> la primera vez.' },
    { t: 'bug', q: 'Si el producto no existe, explota. ¿Qué línea corregís?', code: 'import java.util.Optional;\n\npublic class Main {\n    public static void main(String[] args) {\n        Optional<String> nombre = Optional.empty();\n        System.out.println(nombre.get());\n    }\n}', line: 6, fix: '        System.out.println(nombre.orElse("Sin datos"));', why: '<code>get()</code> sobre un Optional vacío lanza <code>NoSuchElementException</code>.' },
    { t: 'fill', q: 'Completá para quedarte con los nombres en mayúsculas.', code: 'import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<String> n = List.of("ana", "luis");\n        System.out.println(n.___().map(String::toUpperCase).___());\n    }\n}', a: [['stream'], ['toList']], out: '[ANA, LUIS]', why: 'Abrís con <code>stream()</code> y cerrás con <code>toList()</code>.' },
    { t: 'match', q: 'Uní cada herramienta con su uso.', pairs: [['record', 'Llevar datos sin escribir getters'], ['enum', 'Un conjunto fijo de valores'], ['Map', 'Buscar por clave'], ['Optional', 'Un valor que puede faltar']], why: 'Las cuatro aparecen en casi cualquier proyecto Spring.' },
    { t: 'tf', q: 'Un <code>HashMap</code> mantiene el orden en que cargaste los datos.', a: false, why: 'No garantiza ningún orden. Para eso está <code>LinkedHashMap</code>.' },
    { t: 'code', title: 'Estadísticas de ventas', task: 'Con el array de ventas, mostrá cuántas superan 1000 y el total de esas ventas, usando streams.', starter: 'import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> ventas = List.of(500, 1500, 800, 2500);\n        // Usá stream, filter, count y sum\n        \n    }\n}', expected: 'Ventas altas: 2\nTotal: 4000', need: [['\\.stream\\(\\)', 'Usá stream().'], ['\\.filter\\(', 'Filtrá con filter.'], ['mapToInt', 'Para sumar, convertí con mapToInt.']], hint: 'Para sumar: <code>.mapToInt(v -&gt; v).sum()</code>.', solution: 'import java.util.List;\n\npublic class Main {\n    public static void main(String[] args) {\n        List<Integer> ventas = List.of(500, 1500, 800, 2500);\n        long altas = ventas.stream().filter(v -> v > 1000).count();\n        int total = ventas.stream().filter(v -> v > 1000).mapToInt(v -> v).sum();\n        System.out.println("Ventas altas: " + altas);\n        System.out.println("Total: " + total);\n    }\n}', why: 'Sin contadores ni acumuladores: describís el resultado que querés.' }
  ]
};

LESSONS_F2.push({
  id: 109, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'Entidades, JPA y H2',
  desc: 'Convertí una clase Java en una tabla sin escribir SQL, con una base de datos en memoria.',
  simple: () => `
${f2Card('🗣️', 'El traductor', `<p>Java habla de objetos y la base de datos habla de tablas. <strong>JPA</strong> es la norma, e <strong>Hibernate</strong> es el traductor que convierte <code>repository.save(producto)</code> en un <code>INSERT</code>. A esto se le llama <strong>ORM</strong>.</p>`)}
${f2Card('🧽', 'H2: una base en un pizarrón', `<p>H2 corre en memoria: al apagar la aplicación, se borra. Es como un pizarrón para practicar sin instalar nada. Cuando el proyecto madura, pasás a una base real como MySQL.</p>`)}
${f2Mini('¿Qué hace @Entity?', 'Le dice a JPA que esa clase es una tabla.')}
${f2Mini('¿Qué hace @Data de Lombok?', 'Genera los getters, los setters, toString y más, para no escribirlos.')}`,
  tutorial: () => `
<div class="ts"><h3>Una entidad</h3>
${cb('Producto.java', `@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private Double precio;
}`)}
<table class="sym-tbl"><thead><tr><th>Anotación</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>@Entity</code></td><td>Marca la clase como tabla</td></tr>
<tr><td><code>@Table</code></td><td>Elige el nombre de la tabla</td></tr>
<tr><td><code>@Id</code></td><td>Clave primaria</td></tr>
<tr><td><code>@GeneratedValue</code></td><td>El id lo genera la base</td></tr>
<tr><td><code>@Column</code></td><td>Reglas de la columna</td></tr>
<tr><td><code>@Data</code></td><td>Getters y setters de Lombok</td></tr>
</tbody></table>
${ann('warn', '⚠️', 'En <code>@Column</code>, <code>nullable = false</code> significa que el campo es obligatorio. Por defecto acepta nulos.')}
</div>
<div class="ts"><h3>Configurar H2</h3>
${cb('application.yml', `spring:
  datasource:
    url: jdbc:h2:mem:kiosco
    driver-class-name: org.h2.Driver
    username: sa
    password: ""
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true`)}
<table class="sym-tbl"><thead><tr><th><code>ddl-auto</code></th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>create-drop</code></td><td>Crea las tablas al arrancar y las borra al apagar</td></tr>
<tr><td><code>update</code></td><td>Actualiza las tablas sin borrar datos</td></tr>
<tr><td><code>validate</code></td><td>Solo controla que coincidan</td></tr>
<tr><td><code>none</code></td><td>No toca nada</td></tr>
</tbody></table>
${ann('tip', '💡', 'En YAML la sangría es la jerarquía: un espacio de más cambia el significado.')}
</div>
<div class="ts"><h3>Datos iniciales</h3>
<p>Un archivo <code>data.sql</code> en <code>resources</code> carga datos al arrancar.</p>
${cb('data.sql', `INSERT INTO productos (nombre, precio, stock, activo) VALUES ('Alfajor', 1200, 30, true);`)}
${ann('warn', '⚠️', 'Hibernate crea las tablas después del <code>data.sql</code>, salvo que agregues <code>defer-datasource-initialization: true</code>. Y en SQL los textos llevan comilla simple.')}
${f2Pc('ver tu tabla', [
    'Levantá la aplicación.',
    'Abrí <code>http://localhost:8080/h2-console</code>.',
    'En JDBC URL poné <code>jdbc:h2:mem:kiosco</code>, usuario <code>sa</code> y sin contraseña.',
    'Ejecutá <code>SELECT * FROM productos;</code>.'
  ])}
</div>`,
  quiz: {
    passing: 5,
    questions: [
      { question: '¿Qué anotación convierte una clase en una tabla?', options: ['@Entity', '@Service', '@Test', '@Data'], correct: 0 },
      { question: '¿Qué marca la clave primaria?', options: ['@Id', '@Column', '@Table', '@Key'], correct: 0 },
      { question: '¿Qué pasa con los datos de H2 en memoria al apagar la aplicación?', options: ['Se pierden', 'Quedan en un archivo', 'Pasan a MySQL', 'Se suben a la nube'], correct: 0 },
      { question: '¿Quién traduce los objetos a SQL?', options: ['Hibernate, implementando JPA', 'Tomcat', 'Maven', 'Lombok'], correct: 0 },
      { question: '¿Qué hace nullable = false?', options: ['Vuelve obligatorio el campo', 'Permite nulos', 'Borra la columna', 'La vuelve clave primaria'], correct: 0 },
      { question: '¿Dónde se configura la conexión a la base?', options: ['application.yml', 'pom.xml', 'Producto.java', 'README.md'], correct: 0 }
    ]
  }
});

PRACTICA[109] = {
  prev: 'clases y atributos, y haber visto Spring Boot.',
  objetivos: ['Mapear una clase a una tabla con JPA.', 'Configurar H2.', 'Cargar datos iniciales con <code>data.sql</code>.'],
  escalera: {
    vida: 'Un traductor permite que dos personas que hablan idiomas distintos se entiendan.',
    modelo: 'JPA traduce entre objetos de Java y filas de una tabla.',
    pseudo: 'Clase Producto → tabla productos. Atributo nombre → columna nombre.',
    java: '<code>@Entity</code>, <code>@Id</code> y <code>@Column</code>.',
    real: 'Con una entidad bien anotada, Hibernate escribe el SQL. Cambiar de motor no obliga a reescribir el código.'
  },
  items: [
    { t: 'match', q: 'Uní cada concepto de Java con el de la base.', pairs: [['Clase', 'Tabla'], ['Objeto', 'Fila'], ['Atributo', 'Columna'], ['@Id', 'Clave primaria']], why: 'Ese es el mapeo que hace un ORM.' },
    { t: 'fill', q: 'Completá la entidad.', code: '@___\nclass Cliente {\n    @___\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n    @___(nullable = false)\n    private String nombre;\n}', a: [['Entity'], ['Id'], ['Column']], spring: true, noRun: true, why: 'Entidad, clave primaria y columna: lo mínimo que necesita una tabla.' },
    { t: 'bug', q: 'Spring no puede crear esta tabla. ¿Qué línea falta corregir?', code: '@Entity\nclass Cliente {\n    @GeneratedValue\n    private Long id;\n}', line: 3, fix: '    @Id @GeneratedValue', noRun: true, why: 'Toda entidad necesita un <code>@Id</code>. Sin él, la aplicación no arranca.' },
    { t: 'mc', q: 'Querés practicar sin instalar una base de datos. ¿Qué usás?', o: ['H2', 'Docker', 'Swagger', 'Lombok'], a: 0, why: 'H2 corre dentro de la aplicación, en memoria.' },
    { t: 'tf', q: 'Con <code>ddl-auto: create-drop</code> los datos sobreviven al reinicio.', a: false, why: 'Las tablas se borran al apagar. Sirve para desarrollar, no para producción.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: el texto debe ir entre comillas simples.', code: "INSERT INTO productos (nombre, precio, stock, activo) VALUES ('Mate', 900, 5, true);\nINSERT INTO productos (nombre, precio, stock, activo) VALUES (\"Yerba\", 4500, 3, true);", line: 2, fix: "INSERT INTO productos (nombre, precio, stock, activo) VALUES ('Yerba', 4500, 3, true);", sql: true, noRun: true, why: 'Las comillas dobles nombran columnas. Es el error que apareció en clase al armar el <code>data.sql</code>.' },
    { t: 'short', q: '¿Qué ventaja tiene usar JPA en lugar de escribir todo el SQL a mano?', any: [['escrib', 'genera', 'automatic', 'menos', 'ahorra', 'motor', 'cambiar', 'traduce', 'solo']], model: 'Hibernate genera el SQL automáticamente: escribo menos y puedo cambiar de motor de base casi sin tocar el código.', why: 'Conectar, abrir y cerrar a mano sería toda una clase de Java.' }
  ]
};

LESSONS_F2.push({
  id: 110, level: 'spring', levelLabel: 'Spring Boot', stars: '⭐⭐⭐',
  title: 'Repositorios y consultas',
  desc: 'Consultá datos sin escribir SQL: JpaRepository, métodos por nombre y @Query.',
  simple: () => `
${f2Card('📚', 'El bibliotecario', `<p>Le decís "buscame los libros de Borges" y él sabe dónde mirar. <code>JpaRepository</code> es ese bibliotecario: extendés una interfaz vacía y ya sabe guardar, buscar y borrar. Si le pedís algo con un nombre claro, como <code>findByAutor</code>, entiende el pedido solo.</p>`)}
${f2Mini('¿Por qué un repository es una interfaz sin código?', 'Spring crea la implementación al arrancar la aplicación.')}
${f2Mini('¿Cuándo uso @Query?', 'Cuando la consulta es compleja o no se puede expresar con el nombre del método.')}`,
  tutorial: () => `
<div class="ts"><h3>JpaRepository</h3>
${cb('ProductoRepository.java', `@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
}`)}
<p>Sin escribir nada ya tenés:</p>
<table class="sym-tbl"><thead><tr><th>Método</th><th>SQL equivalente</th></tr></thead><tbody>
<tr><td><code>findAll()</code></td><td>SELECT *</td></tr>
<tr><td><code>findById(id)</code></td><td>SELECT con WHERE id</td></tr>
<tr><td><code>save(entidad)</code></td><td>INSERT o UPDATE</td></tr>
<tr><td><code>deleteById(id)</code></td><td>DELETE</td></tr>
<tr><td><code>existsById(id)</code></td><td>¿Existe?</td></tr>
<tr><td><code>count()</code></td><td>COUNT(*)</td></tr>
</tbody></table>
${ann('tip', '💡', '<code>findById</code> devuelve un <code>Optional</code>: la fila puede no existir.')}
</div>
<div class="ts"><h3>Consultas por el nombre del método</h3>
${cb('Query methods', `List<Producto> findByActivoTrue();
Optional<Producto> findByNombre(String nombre);
List<Producto> findByPrecioLessThan(Double maximo);
List<Producto> findByNombreContainingIgnoreCase(String texto);
boolean existsByNombre(String nombre);`)}
${ann('warn', '⚠️', 'La palabra después de <code>findBy</code> debe ser un <strong>atributo real</strong> de la entidad. Si escribís <code>findByNombrecito</code>, la aplicación no arranca.')}
</div>
<div class="ts"><h3>@Query</h3>
${cb('Consulta propia', `@Query("SELECT p FROM Producto p WHERE p.activo = true AND p.stock < :minimo ORDER BY p.stock")
List<Producto> buscarConPocoStock(@Param("minimo") Integer minimo);`)}
<p>Se escribe en <strong>JPQL</strong>: se parece a SQL, pero nombra la clase y sus atributos, no la tabla.</p>
</div>`,
  exercise: {
    desc: 'Simulá un repositorio. Creá la interfaz Repositorio con Optional&lt;String&gt; findById(int id) y int count(), e implementala en RepositorioMemoria con un HashMap. El main busca el id 1 y el 9.',
    expected: 'Yerba\nNo existe\nTotal: 2',
    need: [['\\binterface\\s+Repositorio', 'Definí la interfaz Repositorio.'], ['implements\\s+Repositorio', 'Implementala en RepositorioMemoria.'], ['Map<', 'Guardá los datos en un Map.'], ['Optional', 'findById debe devolver un Optional.']],
    starter: `import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

// Definí la interfaz y RepositorioMemoria

public class Main {
    public static void main(String[] args) {
        RepositorioMemoria repo = new RepositorioMemoria();
        repo.save(1, "Yerba");
        repo.save(2, "Mate");
        // Imprimí el id 1, el id 9 con orElse("No existe") y el total

    }
}`,
    hints: [
      'Para no devolver <code>null</code>: <code>Optional.ofNullable(datos.get(id))</code>.',
      `La solución:<br>${cb('Solución', `import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

interface Repositorio {
    Optional<String> findById(int id);
    int count();
}

class RepositorioMemoria implements Repositorio {
    private final Map<Integer, String> datos = new HashMap<>();

    void save(int id, String nombre) {
        datos.put(id, nombre);
    }

    public Optional<String> findById(int id) {
        return Optional.ofNullable(datos.get(id));
    }

    public int count() {
        return datos.size();
    }
}

public class Main {
    public static void main(String[] args) {
        RepositorioMemoria repo = new RepositorioMemoria();
        repo.save(1, "Yerba");
        repo.save(2, "Mate");
        System.out.println(repo.findById(1).orElse("No existe"));
        System.out.println(repo.findById(9).orElse("No existe"));
        System.out.println("Total: " + repo.count());
    }
}`)}`
    ]
  }
});

PRACTICA[110] = {
  prev: 'entidades, Optional e interfaces.',
  objetivos: ['Usar los métodos de <code>JpaRepository</code>.', 'Escribir consultas por nombre de método.', 'Escribir una consulta con <code>@Query</code>.'],
  escalera: {
    vida: 'Un bibliotecario entiende lo que le pedís si se lo decís claro.',
    modelo: 'Del nombre del método, Spring deduce la consulta.',
    pseudo: 'buscar + por + nombre → SELECT con WHERE nombre.',
    java: '<code>Optional&lt;Producto&gt; findByNombre(String nombre);</code>',
    real: 'La mayoría de las consultas de un sistema se resuelven así, y solo las complejas necesitan <code>@Query</code>.'
  },
  items: [
    { t: 'match', q: 'Uní cada método del repositorio con lo que hace.', pairs: [['findAll()', 'Trae todas las filas'], ['findById(id)', 'Busca una, y puede faltar'], ['save(entidad)', 'Inserta o actualiza'], ['deleteById(id)', 'Borra por clave']], why: 'Vienen listos con <code>JpaRepository</code>.' },
    { t: 'fill', q: 'Completá el repositorio.', code: '@Entity\nclass Cliente {\n    @Id\n    private Long id;\n    private String email;\n}\n\n@___\ninterface ClienteRepository extends ___<Cliente, Long> {\n    Optional<Cliente> findBy___(String email);\n}', a: [['Repository'], ['JpaRepository'], ['Email']], spring: true, noRun: true, why: 'Los parámetros de tipo son la entidad y el tipo de su clave primaria.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: en JPQL se nombra la clase, no la tabla.', code: '@Query("SELECT p FROM productos p WHERE p.stock < 5")\nList<Producto> pocos();', line: 1, fix: '@Query("SELECT p FROM Producto p WHERE p.stock < 5")', noRun: true, why: 'JPQL trabaja con la entidad <code>Producto</code>. El nombre de la tabla es <code>productos</code>, y eso sería SQL nativo.' },
    { t: 'bug', q: 'La aplicación no arranca: la entidad tiene el atributo <code>nombre</code>. ¿Qué línea falla?', code: 'List<Producto> findByActivoTrue();\nOptional<Producto> findByNom(String nombre);\nboolean existsByNombre(String nombre);', line: 2, fix: 'Optional<Producto> findByNombre(String nombre);', noRun: true, why: 'Lo que sigue a <code>findBy</code> debe ser un atributo real de la entidad.' },
    { t: 'mc', q: '¿Qué devuelve <code>findById</code>?', o: ['Un <code>Optional</code>', 'Siempre la entidad', 'Un <code>int</code>', 'Un <code>boolean</code>'], a: 0, why: 'Así te obliga a pensar qué pasa si no existe.' },
    { t: 'tf', q: 'Hay que escribir la clase que implementa <code>ProductoRepository</code>.', a: false, why: 'Spring la genera al arrancar.' },
    { t: 'short', q: '¿Cuándo usarías <code>@Query</code> en lugar de un nombre de método?', any: [['compleja', 'complicad', 'varias', 'larg', 'condiciones', 'join', 'no se puede', 'ilegible']], model: 'Cuando la consulta es compleja, con varias condiciones, y el nombre del método quedaría ilegible.', why: 'Un nombre de método de 80 caracteres ya no aclara nada.' }
  ]
};
