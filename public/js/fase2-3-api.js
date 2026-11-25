// Java INPRO — Fase 2, tramo API REST (lecciones 111 a 113).
var LESSONS_F2 = typeof LESSONS_F2 === 'undefined' ? [] : LESSONS_F2;
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

LESSONS_F2.push({
  id: 111, level: 'api', levelLabel: 'API REST', stars: '⭐⭐⭐',
  title: 'Inyección de dependencias',
  desc: 'Desacoplá las clases: en lugar de crear lo que necesitan, se lo entregan.',
  simple: () => `
${f2Card('🎮', 'La consola y el joystick', `<p>Si el joystick viniera soldado a la consola, no podrías cambiarlo. Con un conector, enchufás cualquiera. <strong>Inyectar una dependencia</strong> es eso: la clase no fabrica lo que necesita, se lo <strong>entregan</strong> desde afuera.</p>`)}
${f2Card('🧑‍🍳', 'Spring es el encargado del local', `<p>Ninguna clase sale a contratar a nadie: el encargado (el contenedor de Spring) crea a cada empleado y le presenta a quien necesita. A esas piezas administradas se las llama <strong>beans</strong>.</p>`)}
${f2Mini('¿Por qué no escribir new dentro de la clase?', 'Porque quedaría soldada a esa implementación, y no podrías reemplazarla ni probarla con un doble.')}
${f2Mini('¿Qué hace @RequiredArgsConstructor?', 'Lombok genera el constructor con los atributos final, y Spring lo usa para inyectar.')}`,
  tutorial: () => `
<div class="ts"><h3>Del acoplamiento a la inyección</h3>
${cb('Antes y después', `// Acoplado: crea su propia dependencia
class ProductoService {
    private ProductoRepository repository = new ProductoRepositoryMySql();
}

// Desacoplado: la recibe por constructor
class ProductoService {
    private final ProductoRepository repository;

    ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }
}`)}
</div>
<div class="ts"><h3>Con Spring y Lombok</h3>
${cb('ProductoServiceImpl.java', `@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository repository;
}`)}
<table class="sym-tbl"><thead><tr><th>Forma</th><th>Cómo es</th><th>¿Conviene?</th></tr></thead><tbody>
<tr><td>Por constructor</td><td>Atributo <code>final</code> y constructor</td><td>Sí: es la recomendada</td></tr>
<tr><td>Por atributo</td><td><code>@Autowired</code> sobre el atributo</td><td>Evitala: oculta dependencias y complica las pruebas</td></tr>
</tbody></table>
${ann('tip', '💡', 'Desde Spring 4.3, si hay un solo constructor, no hace falta poner <code>@Autowired</code>.')}
</div>
<div class="ts"><h3>Interfaz e implementación</h3>
${cb('Separar el qué del cómo', `public interface ProductoService {      // el contrato
    List<ProductoResponse> listar();
}

@Service
public class ProductoServiceImpl implements ProductoService {   // la implementación
    public List<ProductoResponse> listar() { ... }
}`)}
<p>El controller pide la interfaz, y Spring le entrega la implementación que encuentre.</p>
${ann('warn', '⚠️', 'Si una clase no lleva <code>@Service</code> o similar, Spring no la conoce y falla con <code>No qualifying bean</code>.')}
</div>`,
  exercise: {
    desc: 'Desacoplá la clase Pedido: tiene que recibir un Notificador por constructor. Creá Mail y Sms, que implementan Notificador, y usá las dos desde el main.',
    expected: 'Mail: Pedido 7 confirmado\nSMS: Pedido 8 confirmado',
    need: [['\\binterface\\s+Notificador', 'Definí la interfaz Notificador.'], ['Pedido\\s*\\(\\s*Notificador', 'Pedido debe recibir el Notificador por constructor.'], ['^(?![\\s\\S]*class\\s+Pedido[^}]*new\\s+(Mail|Sms))', 'Pedido no debe crear su dependencia con new.']],
    starter: `class Mail {
    void enviar(String mensaje) {
        System.out.println("Mail: " + mensaje);
    }
}

class Pedido {
    private Mail mail = new Mail();

    void confirmar(int numero) {
        mail.enviar("Pedido " + numero + " confirmado");
    }
}

public class Main {
    public static void main(String[] args) {
        new Pedido().confirmar(7);
    }
}`,
    hints: [
      'Creá <code>interface Notificador { void enviar(String mensaje); }</code>.',
      'En <code>Pedido</code>: <code>private final Notificador notificador;</code> y un constructor que lo reciba.',
      `La solución:<br>${cb('Solución', `interface Notificador {
    void enviar(String mensaje);
}

class Mail implements Notificador {
    public void enviar(String mensaje) {
        System.out.println("Mail: " + mensaje);
    }
}

class Sms implements Notificador {
    public void enviar(String mensaje) {
        System.out.println("SMS: " + mensaje);
    }
}

class Pedido {
    private final Notificador notificador;

    Pedido(Notificador notificador) {
        this.notificador = notificador;
    }

    void confirmar(int numero) {
        notificador.enviar("Pedido " + numero + " confirmado");
    }
}

public class Main {
    public static void main(String[] args) {
        new Pedido(new Mail()).confirmar(7);
        new Pedido(new Sms()).confirmar(8);
    }
}`)}`
    ]
  }
});

PRACTICA[111] = {
  prev: 'interfaces, constructores y capas.',
  objetivos: ['Explicar qué problema resuelve la inyección de dependencias.', 'Inyectar por constructor.', 'Diferenciar interfaz e implementación de un service.'],
  escalera: {
    vida: 'Un joystick con conector se cambia. Uno soldado, no.',
    modelo: 'La clase declara lo que necesita, y alguien de afuera se lo entrega.',
    pseudo: 'Crear el repository → pasárselo al service → pasárselo al controller.',
    java: '<code>private final ProductoRepository repository;</code> con <code>@RequiredArgsConstructor</code>.',
    real: 'En una prueba se entrega un repositorio falso: sin inyección, habría que levantar una base de datos real.'
  },
  items: [
    { t: 'mc', q: '¿Cuál es la forma recomendada de inyectar?', o: ['Por constructor, con atributos <code>final</code>', '<code>@Autowired</code> sobre un atributo público', 'Con <code>new</code> dentro de la clase', 'Con variables <code>static</code>'], a: 0, why: 'Deja explícito qué necesita la clase y facilita las pruebas.' },
    { t: 'match', q: 'Uní cada anotación con su función.', pairs: [['@Service', 'Registra la clase como bean'], ['@RequiredArgsConstructor', 'Genera el constructor'], ['@Autowired', 'Pide una inyección'], ['final', 'Obliga a recibirlo al crear']], why: 'Juntas arman la inyección por constructor.' },
    { t: 'tf', q: 'Para inyectar, Spring necesita que la clase esté registrada como bean.', a: true, why: 'Solo administra lo que conoce, por ejemplo por llevar <code>@Service</code> o <code>@Repository</code>.' },
    { t: 'output', q: 'Dos implementaciones, un contrato. ¿Qué imprime?', code: 'interface Saludo {\n    String decir();\n}\n\nclass Hola implements Saludo {\n    public String decir() { return "Hola"; }\n}\n\nclass Chau implements Saludo {\n    public String decir() { return "Chau"; }\n}\n\nclass Portero {\n    private final Saludo saludo;\n    Portero(Saludo saludo) { this.saludo = saludo; }\n    void recibir() { System.out.println(saludo.decir()); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        new Portero(new Hola()).recibir();\n        new Portero(new Chau()).recibir();\n    }\n}', a: 'Hola\nChau', why: '<code>Portero</code> nunca cambió: solo cambió lo que le entregaron.' },
    { t: 'fill', q: 'Completá la inyección.', code: 'interface ProductoRepo {\n}\n\n@Service\n@___\nclass ProductoSrv {\n    private ___ ProductoRepo repo;\n}', a: [['RequiredArgsConstructor'], ['final']], spring: true, noRun: true, why: 'Lombok genera el constructor con los atributos <code>final</code>.' },
    { t: 'bug', q: 'Esta clase está soldada a una implementación. ¿Qué línea corregís?', code: 'interface Repo {\n    String buscar();\n}\n\nclass RepoMysql implements Repo {\n    public String buscar() { return "mysql"; }\n}\n\nclass Servicio {\n    private final Repo repo = new RepoMysql();\n    String leer() { return repo.buscar(); }\n}', line: 10, fix: '    private final Repo repo; Servicio(Repo repo) { this.repo = repo; }', noRun: true, why: 'Con <code>new</code> adentro no se puede reemplazar. Recibiéndolo por constructor, sí.' },
    { t: 'short', q: '¿Por qué la inyección de dependencias facilita las pruebas?', any: [['falso', 'simulad', 'doble', 'mock', 'reemplaz', 'fake', 'cambiar'], ['sin', 'base', 'dependencia', 'real', 'aislad', 'prueba']], model: 'Porque puedo pasarle un repositorio falso en lugar del real y probar la clase aislada, sin base de datos.', why: 'Lo vas a usar en la lección de Mockito.' }
  ]
};

LESSONS_F2.push({
  id: 112, level: 'api', levelLabel: 'API REST', stars: '⭐⭐⭐',
  title: 'Controllers y DTO',
  desc: 'Exponé tu API: rutas, parámetros, respuestas y la diferencia entre entidad y DTO.',
  simple: () => `
${f2Card('🪪', 'El DNI y tu historia clínica', `<p>En la puerta de un boliche mostrás el DNI, no tu historia clínica. Un <strong>DTO</strong> es lo mismo: del objeto completo, solo mostrás lo que hace falta. La entidad se queda adentro, y a la API sale una versión justa.</p>`)}
${f2Mini('¿Por qué no devolver la entidad directo?', 'Expondrías datos internos, como una contraseña, y cada cambio en la tabla rompería a los clientes.')}
${f2Mini('¿Qué diferencia hay entre @PathVariable y @RequestParam?', '@PathVariable toma el valor de la ruta (/productos/3). @RequestParam, de la parte después del ? (?minimo=5).')}`,
  tutorial: () => `
<div class="ts"><h3>Un controller completo</h3>
${cb('ProductoController.java', `@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    public List<ProductoResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ProductoResponse obtener(@PathVariable Long id) {
        return service.obtener(id);
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}`)}
<table class="sym-tbl"><thead><tr><th>Anotación</th><th>De dónde saca el dato</th></tr></thead><tbody>
<tr><td><code>@PathVariable</code></td><td>De la ruta: <code>/productos/3</code></td></tr>
<tr><td><code>@RequestParam</code></td><td>De la consulta: <code>?minimo=5</code></td></tr>
<tr><td><code>@RequestBody</code></td><td>Del JSON del cuerpo</td></tr>
</tbody></table></div>
<div class="ts"><h3>DTO con record</h3>
${cb('Lo que entra y lo que sale', `// Lo que el cliente puede enviar: nunca el id
public record ProductoRequest(String nombre, Double precio, Integer stock) {
}

// Lo que la API devuelve
public record ProductoResponse(Long id, String nombre, Double precio, Double precioFinal, Integer stock) {
}`)}
<p>El service hace la conversión:</p>
${cb('De entidad a DTO', `private ProductoResponse aRespuesta(Producto p) {
    return new ProductoResponse(p.getId(), p.getNombre(), p.getPrecio(),
            calcularPrecioFinal(p.getPrecio()), p.getStock());
}

public List<ProductoResponse> listar() {
    return repository.findByActivoTrue().stream().map(this::aRespuesta).toList();
}`)}
${ann('warn', '⚠️', 'Si el método usa <code>@RequestBody</code> y mandás JSON, el verbo tiene que ser POST o PUT, y el encabezado <code>Content-Type: application/json</code>.')}
</div>
<div class="ts"><h3>ResponseEntity</h3>
<p>Permite elegir el código de estado. Sin él, Spring responde 200.</p>
${cb('Códigos', `ResponseEntity.ok(dato);                                // 200
ResponseEntity.status(HttpStatus.CREATED).body(dato);   // 201
ResponseEntity.noContent().build();                     // 204`)}
</div>`,
  exercise: {
    desc: 'Convertí entidades en DTO. Tenés la clase Usuario con una contraseña. Creá el record UsuarioResponse(String nombre, String email), que no expone la contraseña, y un método aRespuesta. Mapeá la lista con stream.',
    expected: '[UsuarioResponse[nombre=Ana, email=ana@mail.com], UsuarioResponse[nombre=Luis, email=luis@mail.com]]',
    need: [['\\brecord\\s+UsuarioResponse', 'Definí el record UsuarioResponse.'], ['\\.stream\\(\\)', 'Convertí la lista con stream().'], ['\\.map\\(', 'Usá map para transformar.']],
    starter: `import java.util.List;

class Usuario {
    String nombre;
    String email;
    String contrasena;

    Usuario(String nombre, String email, String contrasena) {
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
    }
}

// Creá el record UsuarioResponse

public class Main {
    // Creá static UsuarioResponse aRespuesta(Usuario u)

    public static void main(String[] args) {
        List<Usuario> usuarios = List.of(new Usuario("Ana", "ana@mail.com", "1234"), new Usuario("Luis", "luis@mail.com", "abcd"));
        // Convertí la lista e imprimila

    }
}`,
    hints: [
      'El record: <code>record UsuarioResponse(String nombre, String email) { }</code>.',
      'La lista: <code>usuarios.stream().map(Main::aRespuesta).toList()</code>.',
      `La solución:<br>${cb('Solución', `import java.util.List;

class Usuario {
    String nombre;
    String email;
    String contrasena;

    Usuario(String nombre, String email, String contrasena) {
        this.nombre = nombre;
        this.email = email;
        this.contrasena = contrasena;
    }
}

record UsuarioResponse(String nombre, String email) {
}

public class Main {
    static UsuarioResponse aRespuesta(Usuario u) {
        return new UsuarioResponse(u.nombre, u.email);
    }

    public static void main(String[] args) {
        List<Usuario> usuarios = List.of(new Usuario("Ana", "ana@mail.com", "1234"), new Usuario("Luis", "luis@mail.com", "abcd"));
        System.out.println(usuarios.stream().map(Main::aRespuesta).toList());
    }
}`)}`
    ]
  }
});

PRACTICA[112] = {
  prev: 'HTTP, capas e inyección de dependencias.',
  objetivos: ['Escribir los cinco endpoints de un ABM.', 'Leer datos de la ruta, la consulta y el cuerpo.', 'Separar entidad y DTO.'],
  escalera: {
    vida: 'Mostrás el DNI en la puerta, no tu historia clínica.',
    modelo: 'Un DTO lleva solo lo necesario. La entidad queda adentro del sistema.',
    pseudo: 'Recibir el pedido → pasarlo al service → convertir → responder con su código.',
    java: '<code>@GetMapping</code>, <code>@PathVariable</code>, <code>@RequestBody</code> y <code>ResponseEntity</code>.',
    real: 'Devolver la entidad con la contraseña, aunque esté cifrada, es un problema de seguridad real.'
  },
  items: [
    { t: 'match', q: 'Uní cada anotación con de dónde lee.', pairs: [['@PathVariable', '/api/productos/3'], ['@RequestParam', '/api/productos?minimo=5'], ['@RequestBody', 'El JSON del cuerpo']], why: 'Son las tres formas de recibir datos.' },
    { t: 'fill', q: 'Completá el endpoint de alta.', code: 'class CrearController {\n    @___\n    public ResponseEntity<String> crear(@___ String cuerpo) {\n        return ResponseEntity.status(HttpStatus.___).body(cuerpo);\n    }\n}', a: [['PostMapping'], ['RequestBody'], ['CREATED']], spring: true, noRun: true, why: 'Alta con POST, datos del cuerpo y código 201.' },
    { t: 'bug', q: 'Este endpoint responde con un error: la ruta declara un id. ¿Qué línea corregís?', code: 'class BuscarController {\n    @GetMapping("/{id}")\n    public String obtener(Long id) {\n        return "producto " + id;\n    }\n}', line: 3, fix: '    public String obtener(@PathVariable Long id) {', noRun: true, why: 'Falta <code>@PathVariable</code>: sin ella, Spring no une el <code>{id}</code> de la ruta con el parámetro.' },
    { t: 'http', q: 'Dar de alta', task: 'Creá un producto con <code>POST</code>. Mandá nombre, precio y stock en el cuerpo JSON, y conseguí un <strong>201</strong>.', goal: { method: 'POST', path: '^/api/productos$', status: 201 }, demo: [['POST', '/api/productos', '{"nombre":"Mate","precio":900,"stock":4}']], hint: 'Cuerpo: <code>{"nombre":"Mate","precio":900,"stock":4}</code>', why: '201 significa creado, y la respuesta trae el id que asignó el servidor.' },
    { t: 'http', q: 'Datos inválidos', task: 'Provocá un <strong>400</strong>: mandá un producto con el nombre vacío y leé el mensaje.', goal: { method: 'POST', path: '^/api/productos$', status: 400, contains: 'nombre' }, demo: [['POST', '/api/productos', '{"nombre":"","precio":900,"stock":4}']], hint: '<code>{"nombre":"","precio":900,"stock":4}</code>', why: 'La API valida antes de guardar y explica qué falta.' },
    { t: 'http', q: 'Producto duplicado', task: 'Intentá crear otro producto llamado <code>Yerba</code>, que ya existe, y conseguí un <strong>409</strong>.', goal: { method: 'POST', path: '^/api/productos$', status: 409 }, demo: [['POST', '/api/productos', '{"nombre":"Yerba","precio":100,"stock":1}']], hint: '<code>{"nombre":"Yerba","precio":100,"stock":1}</code>', why: '409 significa que el pedido choca con el estado actual.' },
    { t: 'http', q: 'Modificar', task: 'Reemplazá los datos del producto 1 con <code>PUT</code>.', goal: { method: 'PUT', path: '^/api/productos/1$', status: 200 }, demo: [['PUT', '/api/productos/1', '{"nombre":"Alfajor triple","precio":1500,"stock":20}']], hint: 'PUT necesita todos los campos: <code>{"nombre":"Alfajor triple","precio":1500,"stock":20}</code>', why: 'PUT reemplaza todos los campos.' },
    { t: 'http', q: 'Dar de baja', task: 'Eliminá el producto 2 y conseguí un <strong>204</strong>.', goal: { method: 'DELETE', path: '^/api/productos/2$', status: 204 }, demo: [['DELETE', '/api/productos/2']], hint: 'DELETE no lleva cuerpo.', why: '204 significa que salió bien y no hay nada que devolver.' },
    { t: 'tf', q: 'Conviene exponer la entidad directamente en la API.', a: false, why: 'Se filtran datos internos y la API queda atada a la tabla.' },
    { t: 'short', q: '¿Para qué sirve un DTO? Respondé como en una entrevista.', any: [['datos', 'exponer', 'entidad', 'campos', 'mostrar', 'transferir'], ['separ', 'ocult', 'solo', 'necesari', 'segur', 'proteg', 'desacopl', 'no expon']], model: 'Para transferir solo los datos necesarios: separa la API de la entidad y evita exponer información interna.', why: 'Definición y motivo: así se responde en una entrevista.' }
  ]
};

LESSONS_F2.push({
  id: 113, level: 'api', levelLabel: 'API REST', stars: '⭐⭐⭐',
  title: 'Probar la API',
  desc: 'Usá Swagger, Postman y curl para hablarle a tu aplicación y entender cada respuesta.',
  simple: () => `
${f2Card('🔦', 'Probar la linterna antes del corte', `<p>No esperás al apagón para ver si anda. Con una API pasa igual: antes de que exista una pantalla, le hacés pedidos con una herramienta y mirás si responde lo correcto.</p>`)}
${f2Mini('¿Swagger y Postman son lo mismo?', 'No. Swagger se genera desde tu código y documenta la API. Postman es una herramienta aparte para hacer pedidos.')}
${f2Mini('¿Por qué los ids a veces saltan un número?', 'Si un INSERT falla, la base puede haber consumido ese id. No es un error del programa.')}`,
  tutorial: () => `
<div class="ts"><h3>Las herramientas</h3>
<table class="sym-tbl"><thead><tr><th>Herramienta</th><th>Qué es</th><th>Cuándo usarla</th></tr></thead><tbody>
<tr><td>Swagger UI</td><td>Página web generada por tu API</td><td>Probar rápido, ve las estructuras</td></tr>
<tr><td>Postman o Insomnia</td><td>Aplicación de escritorio</td><td>Guardar colecciones de pedidos</td></tr>
<tr><td>Thunder Client</td><td>Plugin de VS Code</td><td>Sin salir del editor</td></tr>
<tr><td>curl</td><td>Línea de comandos</td><td>Scripts y servidores</td></tr>
</tbody></table>
${cb('curl', `curl http://localhost:8080/api/productos

curl -X POST http://localhost:8080/api/productos \\
  -H "Content-Type: application/json" \\
  -d '{"nombre":"Mate","precio":900,"stock":4}'`)}
</div>
<div class="ts"><h3>Datos iniciales y auditoría</h3>
<p>Con un <code>data.sql</code> la base arranca con ejemplos. Con auditoría, JPA completa solo la fecha de creación:</p>
${cb('Auditoría', `@Configuration
@EnableJpaAuditing
public class JpaConfig {
}

// En la entidad
@EntityListeners(AuditingEntityListener.class)
public class Producto {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime creadoEn;
}`)}
${ann('warn', '⚠️', 'Poné <code>@EnableJpaAuditing</code> en su propia clase. En la clase principal rompe los tests de controller: aprendimos esto probando el proyecto de ejemplo.')}
</div>
<div class="ts"><h3>Qué probar siempre</h3>
<ol><li>El camino feliz: ¿responde lo correcto?</li><li>Lo que no existe: ¿da 404?</li><li>Datos inválidos: ¿da 400 y explica?</li><li>Duplicados y borrados: ¿se comporta como debe?</li></ol>
${f2Pc('tu propia prueba', [
    'Levantá <code>ejemplos/kiosco-api</code> con <code>mvnw spring-boot:run</code>.',
    'Abrí <code>http://localhost:8080/swagger-ui.html</code>.',
    'Desplegá un endpoint y apretá <strong>Try it out</strong>.',
    'Probá crear un producto sin nombre y leé la respuesta.'
  ])}
</div>`,
  quiz: {
    passing: 4,
    questions: [
      { question: '¿Qué genera Swagger?', options: ['Documentación interactiva de tu API', 'El esquema completo de la base SQL', 'El archivo ejecutable empaquetado .jar', 'Todas las pruebas unitarias con JUnit'], correct: 0 },
      { question: 'Enviás JSON con POST y falla. ¿Qué encabezado revisás?', options: ['Content-Type: application/json', 'User-Agent: Mozilla/5.0 (Windows)', 'Cookie: session_id=123456789', 'Accept-Language: es-AR,es;q=0.9'], correct: 0 },
      { question: '¿Qué hace @CreatedDate?', options: ['Completa sola la fecha de creación', 'Elimina los registros históricos viejos', 'Crea la tabla relacional en MySQL', 'Valida que un campo texto no sea nulo'], correct: 0 },
      { question: 'Además del camino feliz, ¿qué más hay que probar?', options: ['Datos inválidos y recursos que no existen', 'Solo verificar que la app compile en Maven', 'Únicamente los estilos y colores de la vista', 'Únicamente peticiones GET sin parámetros'], correct: 0 },
      { question: '¿Qué herramienta corre desde la línea de comandos?', options: ['curl', 'Swagger UI web', 'Postman Desktop', 'IntelliJ IDEA'], correct: 0 }
    ]
  }
});

PRACTICA[113] = {
  prev: 'controllers y códigos HTTP.',
  objetivos: ['Probar una API con Swagger, Postman y curl.', 'Diseñar casos felices y de error.', 'Cargar datos iniciales.'],
  escalera: {
    vida: 'Probás la linterna antes del corte de luz, no durante.',
    modelo: 'Una API se prueba haciéndole pedidos y comparando la respuesta con lo esperado.',
    pseudo: 'Enviar pedido → mirar el código → mirar el cuerpo → comparar.',
    java: 'Swagger se genera solo con la dependencia <code>springdoc-openapi</code>.',
    real: 'El equipo de frontend usa tu Swagger para saber cómo hablarle a tu API.'
  },
  items: [
    { t: 'order', q: 'Ordená cómo probar un endpoint.', lines: ['Levantar la aplicación', 'Elegir verbo y ruta', 'Armar el cuerpo si hace falta', 'Enviar el pedido', 'Comparar código y respuesta con lo esperado'], why: 'Saber qué esperás antes de enviar es lo que convierte un pedido en una prueba.' },
    { t: 'http', q: 'Consulta con parámetro', task: 'Pedí los productos con stock menor a 5, usando el parámetro <code>minimo</code>.', goal: { method: 'GET', path: '^/api/productos/poco-stock\\?minimo=5$', status: 200, contains: 'Yerba' }, demo: [['GET', '/api/productos/poco-stock?minimo=5']], hint: 'Ruta: <code>/api/productos/poco-stock?minimo=5</code>', why: 'Lo que va después del <code>?</code> llega como <code>@RequestParam</code>.' },
    { t: 'http', q: 'Verbo equivocado', task: 'Usá un verbo que esta ruta no acepta y conseguí un <strong>405</strong>.', goal: { method: 'PATCH', path: '^/api/productos/\\d+$', status: 405 }, demo: [['PATCH', '/api/productos/1']], hint: 'Probá con PATCH sobre <code>/api/productos/1</code>.', why: 'Este caso destapó un error real del proyecto de ejemplo: un manejador demasiado genérico devolvía 500.' },
    { t: 'bug', q: 'Encontrá el error en el comando: el JSON no llega como JSON.', code: 'curl -X POST http://localhost:8080/api/productos \\\n  -d \'{"nombre":"Mate","precio":900,"stock":4}\'', line: 2, fix: '  -H "Content-Type: application/json" -d \'{"nombre":"Mate","precio":900,"stock":4}\'', noRun: true, why: 'Sin ese encabezado, Spring rechaza el pedido con 415 Unsupported Media Type.' },
    { t: 'tf', q: 'Probar solo el camino feliz alcanza para entregar.', a: false, why: 'Los errores aparecen justo en los casos raros: inexistentes, inválidos y duplicados.' },
    { t: 'short', q: '¿Por qué conviene probar la API antes de tener una pantalla?', any: [['indepen', 'antes', 'sin', 'separ', 'detect', 'errores', 'rapido', 'frontend']], model: 'Porque se detectan errores antes, sin depender del frontend, y se confirma que el backend funciona solo.', why: 'Cada parte se valida por separado.' }
  ]
};
