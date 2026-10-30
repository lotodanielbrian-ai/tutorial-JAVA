import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

enum Estado { PENDIENTE, ENVIADO, ENTREGADO }

enum Moneda {
    PESO("ARS", 1), DOLAR("USD", 1000);

    private final String codigo;
    private final int cotizacion;

    Moneda(String codigo, int cotizacion) {
        this.codigo = codigo;
        this.cotizacion = cotizacion;
    }

    int aPesos(int monto) { return monto * cotizacion; }
    String getCodigo() { return codigo; }
}

record Punto(int x, int y) {
    int suma() { return x + y; }
    static Punto origen() { return new Punto(0, 0); }
}

record Producto(String nombre, double precio) {
    Producto {
        if (precio < 0) throw new IllegalArgumentException("Precio negativo");
    }
    double conIva() { return precio * 1.21; }
}

interface Operacion {
    double aplicar(double a, double b);
}

interface Repositorio<T> {
    Optional<T> buscar(int id);
    List<T> todos();
}

class Memoria implements Repositorio<Producto> {
    private final Map<Integer, Producto> datos = new HashMap<>();
    void guardar(int id, Producto p) { datos.put(id, p); }
    public Optional<Producto> buscar(int id) { return Optional.ofNullable(datos.get(id)); }
    public List<Producto> todos() { return new ArrayList<>(datos.values()); }
}

class Caja<T> {
    private T valor;
    Caja(T valor) { this.valor = valor; }
    T get() { return valor; }
}

class NoEncontrado extends RuntimeException {
    NoEncontrado(String m) { super(m); }
}

public class Funcional {
    static String describir(Estado e) {
        switch (e) {
            case PENDIENTE: return "espera";
            case ENVIADO: return "viaja";
            default: return "llegó";
        }
    }

    static int doble(int x) { return x * 2; }

    public static void main(String[] args) {
        System.out.println(Estado.ENVIADO);
        System.out.println(Estado.ENVIADO.ordinal() + " " + Estado.ENVIADO.name());
        System.out.println(Arrays.toString(Estado.values()));
        System.out.println(Estado.valueOf("ENTREGADO") == Estado.ENTREGADO);
        System.out.println(describir(Estado.PENDIENTE) + describir(Estado.ENTREGADO));
        System.out.println(Moneda.DOLAR.aPesos(5) + " " + Moneda.DOLAR.getCodigo());
        for (Estado e : Estado.values()) System.out.print(e + " ");
        System.out.println();
        try {
            Estado.valueOf("X");
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }

        Punto p = new Punto(2, 3);
        System.out.println(p);
        System.out.println(p.x() + " " + p.y() + " " + p.suma());
        System.out.println(p.equals(new Punto(2, 3)) + " " + (p == new Punto(2, 3)));
        System.out.println(p.hashCode() == new Punto(2, 3).hashCode());
        System.out.println(Punto.origen());
        Producto yerba = new Producto("Yerba", 100.0);
        System.out.println(yerba + " " + yerba.conIva());
        try {
            new Producto("Malo", -1);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }

        Map<String, Integer> stock = new HashMap<>();
        stock.put("yerba", 3);
        stock.put("mate", 7);
        stock.put("termo", 1);
        stock.put("alfajor", 40);
        stock.put("azucar", 12);
        System.out.println(stock);
        System.out.println(stock.get("mate") + " " + stock.get("nada"));
        System.out.println(stock.getOrDefault("nada", 0) + " " + stock.containsKey("termo") + " " + stock.size());
        System.out.println(stock.put("mate", 8) + " " + stock.remove("termo") + " " + stock.containsValue(8));
        for (String k : stock.keySet()) System.out.print(k + " ");
        System.out.println();
        for (Map.Entry<String, Integer> en : stock.entrySet()) System.out.print(en.getKey() + "=" + en.getValue() + ";");
        System.out.println();
        Map<Integer, String> nums = new HashMap<>();
        for (int i = 30; i > 0; i -= 3) nums.put(i * 7, "v" + i);
        System.out.println(nums);
        Map<String, Integer> enOrden = new LinkedHashMap<>();
        enOrden.put("z", 1);
        enOrden.put("a", 2);
        System.out.println(enOrden);
        Map<String, Integer> ordenado = new TreeMap<>(enOrden);
        ordenado.putAll(enOrden);
        System.out.println(ordenado);
        Map<String, Integer> conteo = new HashMap<>();
        for (String w : "a b a c b a".split(" ")) conteo.put(w, conteo.getOrDefault(w, 0) + 1);
        System.out.println(conteo);
        conteo.forEach((k, v) -> System.out.print(k + v + " "));
        System.out.println();

        Optional<String> lleno = Optional.of("hola");
        Optional<String> vacio = Optional.empty();
        System.out.println(lleno + " " + vacio);
        System.out.println(lleno.isPresent() + " " + vacio.isEmpty());
        System.out.println(lleno.get() + " " + vacio.orElse("nada"));
        System.out.println(lleno.map(String::toUpperCase).orElse("x"));
        System.out.println(vacio.map(String::length).orElse(-1));
        lleno.ifPresent(s -> System.out.println("tiene " + s));
        try {
            vacio.get();
        } catch (java.util.NoSuchElementException e) {
            System.out.println(e.getMessage());
        }
        try {
            vacio.orElseThrow(() -> new NoEncontrado("no está"));
        } catch (NoEncontrado e) {
            System.out.println(e.getMessage());
        }

        Operacion suma = (a, b) -> a + b;
        Operacion division = (a, b) -> {
            if (b == 0) return 0;
            return a / b;
        };
        System.out.println(suma.aplicar(2, 3) + " " + division.aplicar(7, 2) + " " + division.aplicar(1, 0));
        Function<Integer, Integer> triple = x -> x * 3;
        Predicate<String> corto = s -> s.length() < 4;
        Supplier<String> saludo = () -> "hola";
        System.out.println(triple.apply(4) + " " + corto.test("mate") + " " + saludo.get());
        int base = 10;
        Function<Integer, Integer> sumaBase = x -> x + base;
        System.out.println(sumaBase.apply(1));

        List<Integer> n = new ArrayList<>(List.of(5, 2, 8, 1, 9, 3, 4));
        System.out.println(n.stream().filter(x -> x % 2 == 0).toList());
        System.out.println(n.stream().map(x -> x * x).filter(x -> x > 10).collect(Collectors.toList()));
        System.out.println(n.stream().mapToInt(x -> x).sum());
        System.out.println(n.stream().count());
        System.out.println(n.stream().sorted().limit(3).toList());
        System.out.println(n.stream().sorted(Comparator.reverseOrder()).skip(5).toList());
        System.out.println(n.stream().anyMatch(x -> x > 8) + " " + n.stream().allMatch(x -> x > 8) + " " + n.stream().noneMatch(x -> x > 100));
        System.out.println(n.stream().reduce(0, (a, b) -> a + b));
        System.out.println(n.stream().filter(x -> x > 100).findFirst().isPresent());
        System.out.println(n.stream().filter(x -> x > 4).findFirst().get());
        System.out.println(n.stream().map(String::valueOf).collect(Collectors.joining(", ")));
        System.out.println(Stream.of("a", "b", "a").distinct().toList());
        System.out.println(IntStream.rangeClosed(1, 5).sum() + " " + IntStream.range(0, 3).boxed().toList());
        System.out.println(Arrays.stream(new int[]{1, 2, 3}).map(x -> x * 2).sum());
        System.out.println(n.stream().mapToInt(Funcional::doble).max().getAsInt());
        System.out.println(n.stream().mapToDouble(x -> x).average().orElse(0));
        n.forEach(x -> System.out.print(x + ","));
        System.out.println();
        n.removeIf(x -> x > 5);
        n.sort(Comparator.naturalOrder());
        System.out.println(n);

        List<Producto> ps = new ArrayList<>();
        ps.add(new Producto("Yerba", 300));
        ps.add(new Producto("Mate", 100));
        ps.add(new Producto("Termo", 900));
        ps.sort(Comparator.comparing(Producto::precio));
        System.out.println(ps.stream().map(Producto::nombre).toList());
        ps.sort(Comparator.comparing(Producto::precio).reversed());
        System.out.println(ps.get(0).nombre());
        System.out.println(ps.stream().filter(x -> x.precio() > 200).mapToDouble(Producto::precio).sum());
        System.out.println(ps.stream().max(Comparator.comparing(Producto::precio)).get().nombre());
        ps.forEach(System.out::println);

        Memoria mem = new Memoria();
        mem.guardar(1, new Producto("Yerba", 300));
        System.out.println(mem.buscar(1).map(Producto::nombre).orElse("no"));
        System.out.println(mem.buscar(2).isPresent());
        System.out.println(mem.todos().size());
        Caja<String> caja = new Caja<>("texto");
        System.out.println(caja.get().length());
        try {
            List.of(1).add(2);
        } catch (UnsupportedOperationException e) {
            System.out.println("inmutable");
        }
    }
}
