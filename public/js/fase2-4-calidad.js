// Java INPRO — Fase 2, tramo Calidad (lecciones 114 a 117).
var LESSONS_F2 = typeof LESSONS_F2 === 'undefined' ? [] : LESSONS_F2;
var PRACTICA = typeof PRACTICA === 'undefined' ? {} : PRACTICA;

LESSONS_F2.push({
  id: 114, level: 'calidad', levelLabel: 'Calidad', stars: '⭐⭐⭐⭐',
  title: 'Testing unitario con JUnit',
  desc: 'Escribí programas que comprueban tus programas, y entregá sin miedo a romper algo.',
  simple: () => `
${f2Card('🚗', 'La revisión de la fábrica', `<p>Antes de armar el auto, cada pieza se prueba sola: los frenos en un banco, el motor en otro. Un <strong>test unitario</strong> hace eso: prueba una pieza chica de tu código, aislada, con un resultado esperado.</p>
<p>La ventaja llega después. Cuando cambiás algo, apretás un botón y en segundos sabés si rompiste otra cosa.</p>`)}
${f2Mini('¿Quién escribe los tests unitarios?', 'El mismo desarrollador. QA y testing son un mundo aparte, pero la primera red de seguridad es tuya.')}
${f2Mini('¿Qué es AAA?', 'Arrange, Act, Assert: preparar los datos, ejecutar y verificar.')}`,
  tutorial: () => `
<div class="ts"><h3>La pirámide de pruebas</h3>
<table class="sym-tbl"><thead><tr><th>Nivel</th><th>Qué prueba</th><th>Velocidad</th></tr></thead><tbody>
<tr><td>Unitarias</td><td>Un método o clase, aislados</td><td>Milisegundos</td></tr>
<tr><td>Integración</td><td>Varias capas juntas</td><td>Segundos</td></tr>
<tr><td>Sistema</td><td>La aplicación completa</td><td>Minutos</td></tr>
<tr><td>Aceptación</td><td>Lo que pidió el cliente</td><td>Horas</td></tr>
</tbody></table></div>
<div class="ts"><h3>Un test con JUnit 5</h3>
${cb('CalculadoraTest.java', `class CalculadoraTest {

    @Test
    @DisplayName("Un producto caro lleva 15% de recargo")
    void precioConRecargo() {
        // Arrange: preparo
        Calculadora calculadora = new Calculadora();

        // Act: ejecuto
        double resultado = calculadora.precioFinal(10000);

        // Assert: verifico
        assertEquals(11500, resultado, 0.001);
    }
}`)}
<table class="sym-tbl"><thead><tr><th>Anotación</th><th>Cuándo corre</th></tr></thead><tbody>
<tr><td><code>@BeforeAll</code></td><td>Una vez, antes de todo</td></tr>
<tr><td><code>@BeforeEach</code></td><td>Antes de cada test</td></tr>
<tr><td><code>@Test</code></td><td>Es el test</td></tr>
<tr><td><code>@AfterEach</code></td><td>Después de cada test</td></tr>
<tr><td><code>@AfterAll</code></td><td>Una vez, al final</td></tr>
</tbody></table>
<table class="sym-tbl"><thead><tr><th>Verificación</th><th>Comprueba que</th></tr></thead><tbody>
<tr><td><code>assertEquals(esperado, real)</code></td><td>Son iguales</td></tr>
<tr><td><code>assertTrue(condicion)</code></td><td>Es verdadero</td></tr>
<tr><td><code>assertNull(valor)</code></td><td>Es null</td></tr>
<tr><td><code>assertThrows(Tipo.class, () -&gt; ...)</code></td><td>Lanza esa excepción</td></tr>
</tbody></table>
${ann('warn', '⚠️', 'Con <code>double</code>, pasá una tolerancia: <code>assertEquals(0.3, 0.1 + 0.2, 0.001)</code>. Sin ella falla, porque 0.1 + 0.2 da 0.30000000000000004.')}
</div>
<div class="ts"><h3>Un buen test es FIRST</h3>
<table class="sym-tbl"><thead><tr><th>Letra</th><th>Significa</th></tr></thead><tbody>
<tr><td><strong>F</strong>ast</td><td>Rápido</td></tr>
<tr><td><strong>I</strong>ndependent</td><td>No depende de otro test</td></tr>
<tr><td><strong>R</strong>epeatable</td><td>Siempre da lo mismo</td></tr>
<tr><td><strong>S</strong>elf-validating</td><td>Pasa o falla, sin mirar a ojo</td></tr>
<tr><td><strong>T</strong>horough</td><td>Cubre los casos importantes</td></tr>
</tbody></table>
${ann('tip', '💡', 'Probá siempre los bordes. Si el recargo es desde 5000, probá 4999, 5000 y 5001: ahí viven los errores. La <strong>cobertura</strong> mide qué parte del código pasa por tus tests: abarcar los escenarios importantes vale más que llegar al 100%.')}
${ann('java', '☕', 'JUnit no corre en el navegador. En el ejercicio usás un <code>verificar</code> escrito a mano, que hace lo mismo que <code>assertEquals</code>. Los tests reales están en <code>ejemplos/kiosco-api</code>.')}
</div>`,
  exercise: {
    desc: 'Probá el método precioFinal, que suma 15% cuando el precio supera 5000. Escribí tres casos con verificar: "barato" (1000 da 1000), "limite" (5000 da 5000) y "caro" (10000 da 11500).',
    expected: 'OK barato\nOK limite\nOK caro',
    need: [['verificar\\s*\\([\\s\\S]*verificar\\s*\\([\\s\\S]*verificar\\s*\\([\\s\\S]*verificar\\s*\\(', 'Escribí tres llamadas a verificar.'], ['precioFinal\\s*\\(\\s*5000', 'Probá el borde: precioFinal(5000).']],
    starter: `public class Main {
    static double precioFinal(double precio) {
        return precio > 5000 ? precio * 1.15 : precio;
    }

    static void verificar(String caso, double esperado, double real) {
        if (Math.abs(esperado - real) < 0.001) {
            System.out.println("OK " + caso);
        } else {
            System.out.println("FALLA " + caso + ": esperaba " + esperado + " y dio " + real);
        }
    }

    public static void main(String[] args) {
        // Escribí tus tres casos

    }
}`,
    hints: [
      'Un caso: <code>verificar("barato", 1000, precioFinal(1000));</code>.',
      `La solución:<br>${cb('Solución', `public class Main {
    static double precioFinal(double precio) {
        return precio > 5000 ? precio * 1.15 : precio;
    }

    static void verificar(String caso, double esperado, double real) {
        if (Math.abs(esperado - real) < 0.001) {
            System.out.println("OK " + caso);
        } else {
            System.out.println("FALLA " + caso + ": esperaba " + esperado + " y dio " + real);
        }
    }

    public static void main(String[] args) {
        verificar("barato", 1000, precioFinal(1000));
        verificar("limite", 5000, precioFinal(5000));
        verificar("caro", 11500, precioFinal(10000));
    }
}`)}`
    ]
  }
});

PRACTICA[114] = {
  prev: 'métodos, excepciones y capas.',
  objetivos: ['Escribir tests con la estructura AAA.', 'Usar las verificaciones de JUnit.', 'Diseñar casos de borde.'],
  escalera: {
    vida: 'Cada pieza de un auto se prueba sola antes de armarlo.',
    modelo: 'Un test ejecuta un método con datos conocidos y compara el resultado.',
    pseudo: 'Preparar → ejecutar → verificar.',
    java: '<code>@Test</code> y <code>assertEquals(esperado, real)</code>.',
    real: 'Antes de publicar, el sistema corre miles de tests: si uno falla, la versión no sale.'
  },
  items: [
    { t: 'order', q: 'Ordená el ciclo de JUnit.', lines: ['@BeforeAll', '@BeforeEach', '@Test', '@AfterEach', '@AfterAll'], why: 'Lo global al principio y al final, y lo de cada test alrededor de cada test.' },
    { t: 'match', q: 'Uní cada letra de AAA con su parte.', pairs: [['Arrange', 'Preparar los datos'], ['Act', 'Ejecutar el método'], ['Assert', 'Verificar el resultado']], why: 'Esa estructura hace que cualquier test se lea igual.' },
    { t: 'tf', q: 'Un test puede depender de que otro haya corrido antes.', a: false, why: 'Debe ser independiente. Si no, falla según el orden y no se puede confiar en él.' },
    { t: 'mc', q: 'La regla dice "desde 18 años". ¿Qué valores conviene probar?', o: ['17, 18 y 19', 'Solo 18', 'Solo 50', '0 y 100'], a: 0, why: 'Los errores viven en los bordes.' },
    { t: 'fill', q: 'Completá el test.', code: 'class SumaTest {\n    @___\n    void sumaDosNumeros() {\n        int resultado = 2 + 3;\n        org.junit.jupiter.api.Assertions.___(5, resultado);\n    }\n}', a: [['Test'], ['assertEquals']], spring: true, noRun: true, why: 'El primer valor es el esperado, y el segundo, el real.' },
    { t: 'bug', q: 'Este método tiene un error de borde: con 5000 no debe cobrar recargo. ¿Qué línea corregís?', code: 'public class Main {\n    static double precioFinal(double p) {\n        return p >= 5000 ? p * 2 : p;\n    }\n    public static void main(String[] args) {\n        System.out.println(precioFinal(5000));\n    }\n}', line: 3, fix: '        return p > 5000 ? p * 2 : p;', why: 'Un test de borde lo detecta: era <code>&gt;</code>, no <code>&gt;=</code>.' },
    { t: 'output', q: 'El test falla por el redondeo. ¿Qué imprime?', code: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println(0.1 + 0.2 == 0.3);\n        System.out.println(Math.abs(0.1 + 0.2 - 0.3) < 0.001);\n    }\n}', a: 'false\ntrue', why: 'Los <code>double</code> no son exactos. Por eso se compara con una tolerancia.' },
    { t: 'short', q: '¿Qué significa que un test sea repetible?', any: [['mismo', 'igual', 'siempre', 'cualquier', 'cada vez']], model: 'Que siempre da el mismo resultado, sin importar cuántas veces ni dónde lo ejecutes.', why: 'Un test que falla a veces deja de ser confiable.' }
  ]
};

LESSONS_F2.push({
  id: 115, level: 'calidad', levelLabel: 'Calidad', stars: '⭐⭐⭐⭐',
  title: 'Mockito y MockMvc',
  desc: 'Probá cada capa aislada: reemplazá la base de datos por un doble y simulá pedidos HTTP.',
  simple: () => `
${f2Card('🎬', 'El doble de riesgo', `<p>En una película, el actor no salta del edificio: lo hace un doble. Un <strong>mock</strong> es el doble de tu base de datos. Se ve igual, responde lo que le indicás, y tu test no depende de una base real.</p>`)}
${f2Mini('¿Cuál es la diferencia entre mock y spy?', 'Un mock es un doble hueco: responde lo que le programás. Un spy envuelve el objeto real y lo observa.')}
${f2Mini('¿Qué es MockMvc?', 'Simula pedidos HTTP al controller sin levantar el servidor.')}`,
  tutorial: () => `
<div class="ts"><h3>Probar un service con Mockito</h3>
${cb('ProductoServiceImplTest.java', `@ExtendWith(MockitoExtension.class)
class ProductoServiceImplTest {

    @Mock
    private ProductoRepository repository;

    @InjectMocks
    private ProductoServiceImpl service;

    @Test
    void obtenerLanzaExcepcionSiNoExiste() {
        when(repository.findByIdAndActivoTrue(99L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> service.obtener(99L));
    }

    @Test
    void crearRechazaUnNombreRepetido() {
        when(repository.existsByNombre("Yerba")).thenReturn(true);

        assertThrows(ProductoDuplicadoException.class,
                () -> service.crear(new ProductoRequest("Yerba", 4500.0, 3)));
        verify(repository, never()).save(any());
    }
}`)}
<table class="sym-tbl"><thead><tr><th>Herramienta</th><th>Qué hace</th></tr></thead><tbody>
<tr><td><code>@Mock</code></td><td>Crea el doble</td></tr>
<tr><td><code>@InjectMocks</code></td><td>Crea la clase y le inyecta los dobles</td></tr>
<tr><td><code>when(...).thenReturn(...)</code></td><td>Programa una respuesta</td></tr>
<tr><td><code>verify(...)</code></td><td>Comprueba que se llamó a un método</td></tr>
<tr><td><code>never()</code></td><td>Comprueba que no se llamó</td></tr>
<tr><td><code>any()</code></td><td>Acepta cualquier argumento</td></tr>
</tbody></table></div>
<div class="ts"><h3>Probar un controller con MockMvc</h3>
${cb('ProductoControllerTest.java', `@WebMvcTest(ProductoController.class)
class ProductoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductoService service;

    @Test
    void obtenerInexistenteResponde404() throws Exception {
        when(service.obtener(99L)).thenThrow(new RecursoNoEncontradoException("Producto", 99L));

        mockMvc.perform(get("/api/productos/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.mensaje").value("Producto con id 99 no encontrado"));
    }
}`)}
${ann('warn', '⚠️', '<code>@MockBean</code> quedó obsoleta. Desde Spring Boot 3.4 se usa <code>@MockitoBean</code>.')}
</div>
<div class="ts"><h3>Qué tipo de test elegir</h3>
<table class="sym-tbl"><thead><tr><th>Anotación</th><th>Qué carga</th><th>Velocidad</th></tr></thead><tbody>
<tr><td><code>@ExtendWith(MockitoExtension.class)</code></td><td>Solo tu clase</td><td>Instantáneo</td></tr>
<tr><td><code>@WebMvcTest</code></td><td>La capa web</td><td>Segundos</td></tr>
<tr><td><code>@SpringBootTest</code></td><td>Toda la aplicación</td><td>Más lento</td></tr>
</tbody></table>
${ann('java', '☕', 'Para mirar métodos privados existe la API de <em>reflection</em> (<code>getDeclaredMethod</code> e <code>invoke</code>). Casi nunca hace falta: si necesitás probar un método privado, seguramente merece su propia clase.')}
${f2Pc('correr los tests', [
    'Entrá a la carpeta <code>ejemplos/kiosco-api</code>.',
    'Ejecutá <code>./mvnw test</code>.',
    'Cambiá el <code>1.15</code> de <code>ProductoServiceImpl</code> por <code>1.20</code> y volvé a correrlos.',
    'Leé cuál falla y por qué. Después dejalo como estaba.'
  ])}
</div>`,
  exercise: {
    desc: 'Probá el service sin base de datos: creá un doble a mano. RepoFalso implementa Repo: existe devuelve el valor que le pases por constructor, y cuenta cuántas veces se llamó a guardar. Comprobá que si el nombre ya existe no se guarda, y si es nuevo, sí.',
    expected: 'duplicado: guardados 0\nnuevo: guardados 1',
    need: [['class\\s+RepoFalso\\s+implements\\s+Repo', 'Creá RepoFalso, que implementa Repo.'], ['new\\s+RepoFalso\\s*\\(\\s*true', 'Probá con el caso en que ya existe.'], ['new\\s+RepoFalso\\s*\\(\\s*false', 'Probá con el caso en que no existe.']],
    starter: `interface Repo {
    boolean existe(String nombre);
    void guardar(String nombre);
}

class Servicio {
    private final Repo repo;

    Servicio(Repo repo) {
        this.repo = repo;
    }

    void crear(String nombre) {
        if (!repo.existe(nombre)) {
            repo.guardar(nombre);
        }
    }
}

// Creá RepoFalso

public class Main {
    public static void main(String[] args) {
        // Probá los dos casos

    }
}`,
    hints: [
      'El doble guarda dos atributos: <code>boolean existe</code> e <code>int guardados</code>.',
      'En <code>guardar</code> solo hacé <code>guardados++</code>.',
      `La solución:<br>${cb('Solución', `interface Repo {
    boolean existe(String nombre);
    void guardar(String nombre);
}

class Servicio {
    private final Repo repo;

    Servicio(Repo repo) {
        this.repo = repo;
    }

    void crear(String nombre) {
        if (!repo.existe(nombre)) {
            repo.guardar(nombre);
        }
    }
}

class RepoFalso implements Repo {
    private final boolean respuesta;
    int guardados = 0;

    RepoFalso(boolean respuesta) {
        this.respuesta = respuesta;
    }

    public boolean existe(String nombre) {
        return respuesta;
    }

    public void guardar(String nombre) {
        guardados++;
    }
}

public class Main {
    public static void main(String[] args) {
        RepoFalso duplicado = new RepoFalso(true);
        new Servicio(duplicado).crear("Yerba");
        System.out.println("duplicado: guardados " + duplicado.guardados);

        RepoFalso nuevo = new RepoFalso(false);
        new Servicio(nuevo).crear("Mate");
        System.out.println("nuevo: guardados " + nuevo.guardados);
    }
}`)}`
    ]
  }
});

PRACTICA[115] = {
  prev: 'JUnit e inyección de dependencias.',
  objetivos: ['Aislar una clase con mocks.', 'Programar respuestas con <code>when</code> y comprobar llamadas con <code>verify</code>.', 'Probar un controller con MockMvc.'],
  escalera: {
    vida: 'El doble de riesgo salta del edificio en lugar del actor.',
    modelo: 'Un mock reemplaza una dependencia para probar una sola clase.',
    pseudo: 'Crear el doble → programar qué responde → ejecutar → comprobar.',
    java: '<code>when(repository.existsByNombre("Yerba")).thenReturn(true);</code>',
    real: 'Los tests no pueden depender de una base externa ni de un servicio de pagos: se simulan.'
  },
  items: [
    { t: 'match', q: 'Uní cada herramienta con su función.', pairs: [['@Mock', 'Crea un doble'], ['@InjectMocks', 'Crea la clase con sus dobles'], ['when().thenReturn()', 'Programa una respuesta'], ['verify()', 'Comprueba una llamada']], why: 'Con estas cuatro se escribe casi cualquier test de service.' },
    { t: 'tf', q: 'Un test unitario de service necesita una base de datos real.', a: false, why: 'El repository se reemplaza por un mock: por eso corre en milisegundos.' },
    { t: 'mc', q: '¿Qué anotación usás para probar solo un controller?', o: ['<code>@WebMvcTest</code>', '<code>@Entity</code>', '<code>@Service</code>', '<code>@Column</code>'], a: 0, why: 'Levanta solo la capa web.' },
    { t: 'fill', q: 'Completá el test con Mockito.', code: 'interface Repo1 {\n    boolean existe(String n);\n}\n\n@ExtendWith(MockitoExtension.class)\nclass ServicioTest {\n    @___\n    private Repo1 repo;\n\n    @Test\n    void responde() {\n        org.mockito.Mockito.___(repo.existe("a")).thenReturn(true);\n    }\n}', a: [['Mock'], ['when']], spring: true, noRun: true, why: 'Se crea el doble y se le programa la respuesta.' },
    { t: 'fill', q: 'Completá la verificación de MockMvc.', code: 'class MvcTest {\n    MockMvc mockMvc;\n\n    void lista() throws Exception {\n        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.___("/api/productos"))\n                .___(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().isOk());\n    }\n}', a: [['get'], ['andExpect']], spring: true, noRun: true, why: '<code>perform</code> hace el pedido y <code>andExpect</code> verifica la respuesta.' },
    { t: 'bug', q: 'El test da verde, pero no prueba nada. ¿Qué línea cambiarías?', code: '@Test\nvoid crearGuarda() {\n    service.crear(new ProductoRequest("Mate", 900.0, 4));\n    assertTrue(true);\n}', line: 4, fix: '    verify(repository).save(any(Producto.class));', noRun: true, why: 'Un test sin una verificación real es peor que no tener test: da una falsa seguridad.' },
    { t: 'short', q: '¿Qué diferencia hay entre <code>@WebMvcTest</code> y <code>@SpringBootTest</code>?', any: [['web', 'controller', 'solo', 'capa'], ['toda', 'complet', 'lento', 'contexto', 'entera']], model: '@WebMvcTest carga solo la capa web; @SpringBootTest levanta toda la aplicación, y es más lento.', why: 'Se elige lo más liviano que alcance para probar lo que necesitás.' }
  ]
};

LESSONS_F2.push({
  id: 116, level: 'calidad', levelLabel: 'Calidad', stars: '⭐⭐⭐⭐',
  title: 'MySQL y SQL',
  desc: 'Pasá de H2 a una base real, escribí consultas SQL y conocé el borrado lógico.',
  simple: () => `
${f2Card('🔌', 'Desenchufar y enchufar', `<p>Cambiar de H2 a MySQL es como cambiar un electrodoméstico: el enchufe es el mismo. Agregás el <strong>driver</strong> en el <code>pom.xml</code>, cambiás la configuración y listo. Tu código Java no se entera.</p>`)}
${f2Card('🗑️', 'La papelera', `<p>Borrar de verdad es tirar el papel a la basura. El <strong>borrado lógico</strong> es marcarlo como "dado de baja": sigue en el archivo, pero ya no aparece. En sistemas reales casi nunca se borra una factura.</p>`)}
${f2Mini('¿Qué es el driver JDBC?', 'El conector que le permite a Java hablar con ese motor de base de datos.')}
${f2Mini('¿Cuándo se usa el borrado físico?', 'Con datos sin valor histórico. Si hay auditoría o relaciones, conviene el lógico.')}`,
  tutorial: () => `
<div class="ts"><h3>Cambiar de motor</h3>
<p>Son dos pasos: la dependencia y la configuración.</p>
${cb('pom.xml', `<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>`)}
${cb('application-mysql.yml', `spring:
  datasource:
    url: jdbc:mysql://localhost:3306/kiosco?createDatabaseIfNotExist=true
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update`)}
${ann('warn', '⚠️', 'Si falta el driver en el <code>pom.xml</code>, la aplicación falla al arrancar. Eso le pasó al profesor en vivo: leé el error, que suele decir exactamente qué falta.')}
<p>Con <strong>perfiles</strong> tenés las dos configuraciones: <code>SPRING_PROFILES_ACTIVE=mysql</code> activa ese archivo. Para mirar la base, usá un cliente gráfico como <strong>DBeaver</strong>.</p>
</div>
<div class="ts"><h3>SQL esencial</h3>
${cb('Consultas', `SELECT nombre, precio FROM productos WHERE activo = true ORDER BY precio DESC;
INSERT INTO productos (nombre, precio, stock, activo) VALUES ('Mate', 900, 4, true);
UPDATE productos SET stock = 10 WHERE id = 1;
DELETE FROM productos WHERE id = 1;
SELECT COUNT(*) FROM productos WHERE stock < 5;`)}
${ann('warn', '⚠️', 'Un <code>UPDATE</code> o <code>DELETE</code> sin <code>WHERE</code> afecta a <strong>todas</strong> las filas. Es el error más caro que se puede cometer en una base.')}
</div>
<div class="ts"><h3>Borrado lógico</h3>
${cb('En el service', `public void eliminar(Long id) {
    Producto producto = buscarActivo(id);
    producto.setActivo(false);       // no se borra: se desactiva
    repository.save(producto);
}`)}
<p>Después, todas las consultas filtran: <code>findByActivoTrue()</code>.</p>
<table class="sym-tbl"><thead><tr><th></th><th>Físico</th><th>Lógico</th></tr></thead><tbody>
<tr><td>Fila</td><td>Desaparece</td><td>Queda marcada</td></tr>
<tr><td>Historial</td><td>Se pierde</td><td>Se conserva</td></tr>
<tr><td>Tamaño de la base</td><td>No crece</td><td>Crece</td></tr>
<tr><td>Consultas</td><td>Simples</td><td>Hay que filtrar siempre</td></tr>
</tbody></table></div>`,
  quiz: {
    passing: 5,
    questions: [
      { question: 'Para pasar de H2 a MySQL, ¿qué hay que cambiar?', options: ['La dependencia y la configuración', 'Todas las clases', 'El lenguaje', 'Los controllers'], correct: 0 },
      { question: '¿Qué pasa con DELETE FROM productos; sin WHERE?', options: ['Borra todas las filas', 'Da error siempre', 'Borra solo la primera', 'No hace nada'], correct: 0 },
      { question: '¿Qué es el borrado lógico?', options: ['Marcar la fila como inactiva', 'Borrarla de la base', 'Borrar la tabla', 'Vaciar la memoria'], correct: 0 },
      { question: '¿Qué hace ddl-auto: update?', options: ['Ajusta las tablas sin borrar datos', 'Borra todo al apagar', 'Solo lee', 'Crea un backup'], correct: 0 },
      { question: '¿Qué instrucción SQL lee datos?', options: ['SELECT', 'INSERT', 'UPDATE', 'DROP'], correct: 0 },
      { question: '¿En qué puerto escucha MySQL por defecto?', options: ['3306', '8080', '443', '5432'], correct: 0 }
    ]
  }
});

PRACTICA[116] = {
  prev: 'JPA, repositorios y H2.',
  objetivos: ['Configurar MySQL en Spring Boot.', 'Escribir consultas SQL básicas.', 'Encontrar errores en consultas.', 'Aplicar borrado lógico.'],
  escalera: {
    vida: 'Cambiás el electrodoméstico y el enchufe sigue siendo el mismo.',
    modelo: 'JPA aísla tu código del motor: cambia la configuración, no la lógica.',
    pseudo: 'Agregar el driver → cambiar la conexión → levantar → comprobar.',
    java: '<code>jdbc:mysql://localhost:3306/kiosco</code> y <code>mysql-connector-j</code>.',
    real: 'Desarrollo en H2 y producción en MySQL: un perfil distinto para cada entorno.'
  },
  items: [
    { t: 'match', q: 'Uní cada verbo HTTP con su SQL.', pairs: [['GET', 'SELECT'], ['POST', 'INSERT'], ['PUT', 'UPDATE'], ['DELETE', 'DELETE']], why: 'El CRUD es el mismo, en dos idiomas.' },
    { t: 'bug', q: 'Encontrá el error en la consulta.', code: "SELECT nombre, precio\nFORM productos\nWHERE activo = true;", line: 2, fix: 'FROM productos', sql: true, noRun: true, why: 'Es <code>FROM</code>. Un error de tipeo así detiene la consulta.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: se quieren ver los productos con poco stock, del más barato al más caro.', code: "SELECT nombre, stock\nFROM productos\nWHERE stock < 5\nORDER precio;", line: 4, fix: 'ORDER BY precio;', sql: true, noRun: true, why: 'Se escribe <code>ORDER BY</code>.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: columnas y valores no coinciden.', code: "INSERT INTO productos (nombre, precio, stock, activo)\nVALUES ('Mate', 900, 4);", line: 2, fix: "VALUES ('Mate', 900, 4, true);", sql: true, noRun: true, why: 'Se declararon cuatro columnas y solo tres valores.' },
    { t: 'bug', q: 'Encontrá el error en la consulta: se busca por texto.', code: "SELECT * FROM productos\nWHERE nombre = Yerba;", line: 2, fix: "WHERE nombre = 'Yerba';", sql: true, noRun: true, why: 'Sin comillas simples, la base busca una columna llamada Yerba.' },
    { t: 'mc', q: 'Querés bajarle el stock a un solo producto. ¿Qué consulta es correcta?', o: ['<code>UPDATE productos SET stock = 2 WHERE id = 5;</code>', '<code>UPDATE productos SET stock = 2;</code>', '<code>SELECT stock = 2;</code>', '<code>DELETE stock WHERE id = 5;</code>'], a: 0, why: 'Sin <code>WHERE</code>, el cambio afectaría a todas las filas.' },
    { t: 'fill', q: 'Completá la consulta.', code: "___ nombre ___ productos ___ precio > 5000;", a: [['SELECT'], ['FROM'], ['WHERE']], noRun: true, why: 'Qué columnas, de qué tabla y con qué condición: siempre en ese orden.' },
    { t: 'order', q: 'Ordená las partes de una consulta.', lines: ['SELECT nombre', 'FROM productos', 'WHERE activo = true', 'ORDER BY nombre'], why: 'El orden de las cláusulas es fijo.' },
    { t: 'http', q: 'Borrado lógico', task: 'Borrá el producto 1 y después volvé a pedirlo para ver que ya no aparece: conseguí un <strong>404</strong>.', goal: { method: 'GET', path: '^/api/productos/1$', status: 404 }, demo: [['DELETE', '/api/productos/1'], ['GET', '/api/productos/1']], hint: 'Primero <code>DELETE /api/productos/1</code>, y después <code>GET</code> con la misma ruta.', why: 'La fila sigue en la base con <code>activo = false</code>, pero para la API ya no existe.' },
    { t: 'tf', q: 'Con borrado lógico, la base de datos no crece.', a: false, why: 'Las filas nunca se van: es el costo de conservar el historial.' },
    { t: 'short', q: '¿Por qué un sistema de facturación usa borrado lógico?', any: [['historial', 'auditor', 'registro', 'legal', 'recuper', 'conserv', 'trazabil']], model: 'Porque hay que conservar el historial para auditoría y por obligaciones legales: una factura no puede desaparecer.', why: 'Los datos transaccionales casi nunca se borran.' }
  ]
};

LESSONS_F2.push({
  id: 117, level: 'calidad', levelLabel: 'Calidad', stars: '⭐⭐⭐⭐',
  title: 'Logging y excepciones globales',
  desc: 'Dejá rastro de lo que pasa y respondé los errores de una sola forma, en un solo lugar.',
  simple: () => `
${f2Card('✈️', 'La caja negra', `<p>Cuando algo sale mal en un vuelo, se lee la caja negra. Los <strong>logs</strong> son la caja negra de tu sistema: lo que pasó, cuándo y dónde. En producción no podés poner un punto de interrupción: solo tenés los logs.</p>`)}
${f2Card('📞', 'La central de reclamos', `<p>En una empresa, cada empleado no resuelve las quejas a su manera: todas van a una central con un solo formato. <code>@RestControllerAdvice</code> es esa central: atrapa las excepciones de toda la aplicación y responde siempre igual.</p>`)}
${f2Mini('¿Por qué no usar System.out.println?', 'No tiene niveles, ni hora, ni clase de origen, y no se puede apagar en producción.')}
${f2Mini('¿Se puede loguear una contraseña?', 'Nunca. Los logs los lee mucha gente, y duran años.')}`,
  tutorial: () => `
<div class="ts"><h3>Niveles de log</h3>
<table class="sym-tbl"><thead><tr><th>Nivel</th><th>Para qué</th><th>Ejemplo</th></tr></thead><tbody>
<tr><td><code>DEBUG</code></td><td>Detalle para desarrollar</td><td>Valor de una variable</td></tr>
<tr><td><code>INFO</code></td><td>Eventos normales</td><td>Producto creado</td></tr>
<tr><td><code>WARN</code></td><td>Algo raro, pero sigue</td><td>Producto no encontrado</td></tr>
<tr><td><code>ERROR</code></td><td>Una falla real</td><td>No hay conexión a la base</td></tr>
</tbody></table>
${cb('Con Lombok', `@Slf4j
@Service
public class ProductoServiceImpl {

    public ProductoResponse crear(ProductoRequest request) {
        Producto guardado = repository.save(producto);
        log.info("Producto creado con id {}", guardado.getId());
        return aRespuesta(guardado);
    }
}`)}
${ann('tip', '💡', 'Usá <code>{}</code> en vez de concatenar con <code>+</code>: el texto solo se arma si ese nivel está activo.')}
${cb('application.yml', `logging:
  level:
    com.javainpro.kiosco: INFO`)}
</div>
<div class="ts"><h3>Excepciones de negocio</h3>
${cb('Excepción propia', `public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String recurso, Long id) {
        super(recurso + " con id " + id + " no encontrado");
    }
}

private Producto buscarActivo(Long id) {
    return repository.findByIdAndActivoTrue(id)
            .orElseThrow(() -> new RecursoNoEncontradoException("Producto", id));
}`)}
${ann('java', '☕', 'Hereda de <code>RuntimeException</code>: así no obliga a escribir <code>throws</code> en cada método.')}
</div>
<div class="ts"><h3>El manejador global</h3>
${cb('GlobalExceptionHandler.java', `@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> noEncontrado(RecursoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.de(404, e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> inesperado(Exception e) {
        log.error("Error inesperado", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.de(500, "Ocurrió un error inesperado"));
    }
}`)}
${ann('warn', '⚠️', 'Cuidado con <code>@ExceptionHandler(Exception.class)</code>: también atrapa errores propios de Spring. En el proyecto de ejemplo, un verbo no permitido daba 500 en lugar de 405 hasta que le agregamos su propio manejador.')}
${ann('warn', '⚠️', 'Nunca devuelvas al cliente el detalle técnico de un error. El mensaje amable va en la respuesta, y el detalle, en el log.')}
</div>`,
  exercise: {
    desc: 'Armá un manejador global sin Spring. RecursoNoEncontrado y DatoInvalido extienden RuntimeException. El método manejar recibe la excepción y devuelve el código y el mensaje. El main prueba los dos errores y uno inesperado.',
    expected: '404: Producto 9 no encontrado\n400: Precio negativo\n500: Error inesperado',
    need: [['extends\\s+RuntimeException[\\s\\S]*extends\\s+RuntimeException', 'Creá las dos excepciones extendiendo RuntimeException.'], ['instanceof', 'Distinguí cada excepción con instanceof.'], ['\\bcatch\\b', 'Atrapá las excepciones con catch.']],
    starter: `// Creá RecursoNoEncontrado y DatoInvalido

public class Main {
    static String manejar(RuntimeException e) {
        // Devolvé "404: mensaje", "400: mensaje" o "500: Error inesperado"
        return "";
    }

    static void ejecutar(int caso) {
        if (caso == 1) throw new RecursoNoEncontrado("Producto 9 no encontrado");
        if (caso == 2) throw new DatoInvalido("Precio negativo");
        throw new IllegalStateException("detalle interno");
    }

    public static void main(String[] args) {
        for (int caso = 1; caso <= 3; caso++) {
            // Ejecutá el caso, atrapá y mostrá lo que devuelve manejar

        }
    }
}`,
    hints: [
      'Cada excepción: <code>class DatoInvalido extends RuntimeException { DatoInvalido(String m) { super(m); } }</code>.',
      'En <code>manejar</code>: <code>if (e instanceof RecursoNoEncontrado) return "404: " + e.getMessage();</code>.',
      `La solución:<br>${cb('Solución', `class RecursoNoEncontrado extends RuntimeException {
    RecursoNoEncontrado(String mensaje) {
        super(mensaje);
    }
}

class DatoInvalido extends RuntimeException {
    DatoInvalido(String mensaje) {
        super(mensaje);
    }
}

public class Main {
    static String manejar(RuntimeException e) {
        if (e instanceof RecursoNoEncontrado) {
            return "404: " + e.getMessage();
        }
        if (e instanceof DatoInvalido) {
            return "400: " + e.getMessage();
        }
        return "500: Error inesperado";
    }

    static void ejecutar(int caso) {
        if (caso == 1) throw new RecursoNoEncontrado("Producto 9 no encontrado");
        if (caso == 2) throw new DatoInvalido("Precio negativo");
        throw new IllegalStateException("detalle interno");
    }

    public static void main(String[] args) {
        for (int caso = 1; caso <= 3; caso++) {
            try {
                ejecutar(caso);
            } catch (RuntimeException e) {
                System.out.println(manejar(e));
            }
        }
    }
}`)}`
    ]
  }
});

PRACTICA[117] = {
  prev: 'try-catch, excepciones propias y controllers.',
  objetivos: ['Elegir el nivel de log adecuado.', 'Crear excepciones de negocio.', 'Centralizar errores con <code>@RestControllerAdvice</code>.'],
  escalera: {
    vida: 'La caja negra de un avión y una central única de reclamos.',
    modelo: 'Los errores se lanzan donde ocurren y se traducen en un solo lugar.',
    pseudo: 'Si no existe → lanzar excepción → la central responde 404.',
    java: '<code>@RestControllerAdvice</code> y <code>@ExceptionHandler</code>.',
    real: 'A la madrugada, cuando algo falla en producción, los logs son lo único que tenés.'
  },
  items: [
    { t: 'match', q: 'Uní cada evento con su nivel.', pairs: [['Se creó un producto', 'INFO'], ['Pidieron un id inexistente', 'WARN'], ['Se cayó la base de datos', 'ERROR'], ['Valor de una variable al desarrollar', 'DEBUG']], why: 'Elegir bien el nivel permite filtrar el ruido.' },
    { t: 'tf', q: 'Conviene poner un try-catch en cada método del controller.', a: false, why: 'Se repite el mismo código. Con un manejador global, se resuelve una sola vez.' },
    { t: 'mc', q: 'Un cliente pide un dato y falla la conexión. ¿Qué le mostrás?', o: ['Un mensaje amable, y el detalle queda en el log', 'El stack trace completo', 'La contraseña de la base', 'Nada, y la conexión queda colgada'], a: 0, why: 'El detalle técnico ayuda a un atacante y confunde al usuario.' },
    { t: 'fill', q: 'Completá el manejador.', code: 'class NoHay extends RuntimeException {\n}\n\n@___\nclass Manejador {\n    @___(NoHay.class)\n    public ResponseEntity<String> noHay(NoHay e) {\n        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No existe");\n    }\n}', a: [['RestControllerAdvice'], ['ExceptionHandler']], spring: true, noRun: true, why: 'Una anotación marca la central, y la otra dice qué excepción atiende cada método.' },
    { t: 'bug', q: 'Este log expone un dato sensible. ¿Qué línea corregís?', code: 'void iniciarSesion(String email, String clave) {\n    log.info("Ingreso de {}", email);\n    log.info("Clave recibida {}", clave);\n}', line: 3, fix: '    log.info("Validando credenciales");', noRun: true, why: 'Nunca se loguean contraseñas ni datos sensibles.' },
    { t: 'output', q: 'El orden de los catch importa. ¿Qué imprime?', code: 'class NoExiste extends RuntimeException {\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            throw new NoExiste();\n        } catch (NoExiste e) {\n            System.out.println("404");\n        } catch (RuntimeException e) {\n            System.out.println("500");\n        }\n    }\n}', a: '404', why: 'Se ejecuta el primer <code>catch</code> compatible, y el más específico va primero.' },
    { t: 'short', q: '¿Qué ventaja tiene un manejador global de excepciones?', any: [['un solo', 'centraliz', 'mismo formato', 'repet', 'uniforme', 'unico lugar', 'consistente', 'evita']], model: 'Centraliza los errores en un solo lugar, evita repetir try-catch y da a todas las respuestas el mismo formato.', why: 'Es DRY aplicado a los errores.' }
  ]
};
