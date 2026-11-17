// Código correcto que una revisión estática torpe rechazaría. javac lo acepta y JavaRun también debe hacerlo.
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

interface Figura {
    int LADOS = 4;

    double area();

    default String nombre() {
        return "figura";
    }
}

abstract class Base implements Figura {
    protected int medida = 2;
    static int creadas = 0;

    Base() {
        creadas++;
    }

    protected Object valor() {
        return "base";
    }

    public abstract double area();
}

class Cuadrado extends Base {
    // Una hija puede ampliar el acceso y devolver un tipo más específico
    @Override
    public String valor() {
        return "cuadrado";
    }

    @Override
    public double area() {
        return medida * medida * LADOS / 4.0;
    }
}

enum Color {
    ROJO, VERDE;

    String minuscula() {
        return name().toLowerCase();
    }
}

record Punto(int x, int y) {
    int suma() {
        return x + y;
    }
}

class Pila<T> {
    private final List<T> datos = new ArrayList<>();

    void poner(T valor) {
        datos.add(valor);
    }

    T sacar() {
        return datos.remove(datos.size() - 1);
    }
}

class SinSaldo extends RuntimeException {
    SinSaldo(String mensaje) {
        super(mensaje);
    }

    String detalle() {
        return getMessage().toUpperCase();
    }
}

public class Valido {
    static int total = 0;
    int campo = 7;

    static int doble(int n) {
        return n * 2;
    }

    static double doble(double n) {
        return n * 2;
    }

    static String doble(String n) {
        return n + n;
    }

    int leerCampo() {
        int total = 3;
        return total + this.campo + campo;
    }

    static class Interna {
        int leer() {
            return total + 1;
        }
    }

    static int signo(int n) {
        if (n > 0) {
            return 1;
        } else if (n < 0) {
            return -1;
        }
        return 0;
    }

    static int buscar(int[] datos, int objetivo) {
        for (int i = 0; ; i++) {
            if (datos[i] == objetivo) {
                return i;
            }
        }
    }

    static int esperar() {
        int vueltas = 0;
        while (true) {
            vueltas++;
            if (vueltas == 3) {
                return vueltas;
            }
        }
    }

    public static void main(String[] args) {
        // Conversiones que javac permite
        byte b = 10;
        short s = 300;
        char c = 65;
        int desdeChar = 'a';
        long largo = 5;
        float flotante = 3;
        double real = 1;
        double delLong = largo;
        final int constante = 100;
        byte chico = constante;
        int entero = 2;
        entero += 1.5;
        entero <<= 1;
        char sumado = 'a';
        sumado += 1;
        System.out.println(b + " " + s + " " + c + " " + desdeChar + " " + largo + " " + flotante + " " + real + " " + delLong + " " + chico + " " + entero + " " + sumado);

        // La misma variable en bloques hermanos
        for (int i = 0; i < 1; i++) {
            int repetida = 1;
            System.out.println(repetida);
        }
        for (int i = 0; i < 1; i++) {
            String repetida = "dos";
            System.out.println(repetida);
        }
        if (args.length == 0) {
            int bloque = 1;
            System.out.println(bloque);
        } else {
            int bloque = 2;
            System.out.println(bloque);
        }

        // final sin valor inicial
        final int unaVez;
        unaVez = 5;
        System.out.println(unaVez);

        // Sobrecarga y resultados
        System.out.println(doble(2) + " " + doble(1.5) + " " + doble("ab"));
        String texto = args.length > 3 ? "muchos" : "pocos";
        int numero = args.length > 3 ? 1 : 2;
        Object cualquiera = args.length > 3 ? "texto" : 5;
        System.out.println(texto + " " + numero + " " + cualquiera);
        Integer caja = 5;
        Double decimal = 2.5;
        int sacado = caja;
        double sacadoD = decimal;
        System.out.println(sacado + sacadoD);
        String nulo = null;
        System.out.println(nulo == null);

        // Colecciones y funciones
        List<String> nombres = new ArrayList<>();
        nombres.add("Ana");
        nombres.add(0, "Luz");
        List<Integer> edades = new ArrayList<>();
        edades.add(30);
        edades.add(Integer.parseInt("20"));
        List<Double> precios = new ArrayList<>();
        precios.add(1.5);
        List<int[]> pares = new ArrayList<>();
        pares.add(new int[] { 1, 2 });
        Map<String, Integer> stock = new HashMap<>();
        stock.put("yerba", 3);
        for (String nombre : nombres) {
            System.out.println(nombre.toUpperCase());
        }
        System.out.println(edades + " " + precios + " " + pares.size() + " " + stock);
        Function<Integer, Integer> sumarUno = n -> n + 1;
        Runnable accion = () -> {
            int local = 1;
            System.out.println("corre " + local);
        };
        accion.run();
        System.out.println(sumarUno.apply(1));
        nombres.forEach(nombre -> System.out.println(nombre.length()));

        // Variables en switch: la declarada en un case sigue en el siguiente
        int opcion = 2;
        switch (opcion) {
            case 1:
                int enCase = 1;
                System.out.println(enCase);
                break;
            case 2:
                enCase = 2;
                System.out.println(enCase);
                break;
            default:
                break;
        }
        for (int i = 0; i < 3; i++) {
            switch (i) {
                case 1:
                    continue;
                default:
                    System.out.println(i);
            }
        }
        String tipo = switch (opcion) {
            case 1 -> "uno";
            case 2 -> {
                String armado = "do";
                yield armado + "s";
            }
            default -> "otro";
        };
        System.out.println(tipo);
        Color color = Color.VERDE;
        switch (color) {
            case ROJO:
                System.out.println("r");
                break;
            case VERDE:
                System.out.println(color.minuscula());
                break;
        }

        // Excepciones, herencia y patrones
        try {
            throw new SinSaldo("sin saldo");
        } catch (SinSaldo e) {
            System.out.println(e.detalle());
        }
        try {
            int cero = 0;
            System.out.println(1 / cero);
        } catch (ArithmeticException e) {
            System.out.println(e.getMessage());
        }
        Object forma = new Cuadrado();
        if (forma instanceof Cuadrado cu) {
            System.out.println(cu.area() + " " + cu.nombre() + " " + cu.valor());
        }
        if (forma instanceof Base cu) {
            System.out.println(cu.medida);
        }
        System.out.println(Base.creadas + " " + Figura.LADOS);
        Punto p = new Punto(1, 2);
        System.out.println(p.x() + " " + p.suma() + " " + p);
        Pila<String> pila = new Pila<>();
        pila.poner("a");
        System.out.println(pila.sacar());
        System.out.println(new Interna().leer() + " " + new Valido().leerCampo());
        System.out.println(signo(-3) + " " + buscar(new int[] { 1, 2 }, 2) + " " + esperar());
        var inferido = "texto";
        System.out.println(inferido.length());
        boolean bandera = true;
        if (bandera) {
            System.out.println("si");
        }
        int[] numeros = { 1, 2 };
        numeros[0] = 'a';
        System.out.println(numeros[0] + " " + numeros.length);
    }
}
