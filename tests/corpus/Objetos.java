import java.util.ArrayList;

interface Figura {
    double PI_APROX = 3.14;
    double area();
    default String describir() { return "Figura de area " + area(); }
    static String tipo() { return "geometria"; }
}

abstract class Base implements Figura {
    protected String nombre;
    private static int creadas = 0;
    Base(String nombre) { this.nombre = nombre; creadas++; }
    static int getCreadas() { return creadas; }
    abstract String unidad();
    @Override public String toString() { return nombre + " " + area() + " " + unidad(); }
}

class Cuadrado extends Base {
    private double lado;
    Cuadrado(double lado) { super("Cuadrado"); this.lado = lado; }
    public double area() { return lado * lado; }
    String unidad() { return "m2"; }
}

class Circulo extends Base {
    double r;
    Circulo(double r) { super("Circulo"); this.r = r; }
    public double area() { return PI_APROX * r * r; }
    String unidad() { return "cm2"; }
    @Override public String describir() { return "Redondo: " + super.describir(); }
}

class Animal {
    String nombre = "sin nombre";
    int patas;
    Animal() { this("anonimo", 4); }
    Animal(String nombre, int patas) { this.nombre = nombre; this.patas = patas; }
    String sonido() { return "..."; }
    String hablar() { return nombre + " dice " + sonido(); }
    @Override public boolean equals(Object o) {
        if (!(o instanceof Animal)) return false;
        Animal a = (Animal) o;
        return nombre.equals(a.nombre);
    }
}

class Perro extends Animal {
    Perro(String n) { super(n, 4); }
    @Override String sonido() { return "guau"; }
    void buscar() { System.out.println(nombre + " busca"); }
}

class Cachorro extends Perro {
    Cachorro(String n) { super(n); }
    @Override String sonido() { return super.sonido() + "ito"; }
}

class Cuenta {
    private double saldo;
    private final String titular;
    private static int total;
    { total++; }
    Cuenta(String titular) { this.titular = titular; }
    public double getSaldo() { return saldo; }
    public String getTitular() { return titular; }
    public void depositar(double m) {
        if (m <= 0) throw new IllegalArgumentException("Monto invalido: " + m);
        saldo += m;
    }
    public void retirar(double m) throws SaldoException {
        if (m > saldo) throw new SaldoException("Saldo insuficiente", m - saldo);
        saldo -= m;
    }
    static int getTotal() { return total; }
}

class SaldoException extends Exception {
    private double faltante;
    SaldoException(String msg, double faltante) { super(msg); this.faltante = faltante; }
    double getFaltante() { return faltante; }
}

class Nodo {
    int valor;
    Nodo siguiente;
    Nodo(int valor) { this.valor = valor; }
}

class Punto {
    int x, y;
    Punto(int x, int y) { this.x = x; this.y = y; }
    Punto mover(int dx) { x += dx; return this; }
    @Override public String toString() { return "(" + x + "," + y + ")"; }
}

public class Objetos {
    static class Interna {
        static String saludo = "hola interna";
        int n = 2;
    }

    static int probar(int a) {
        try {
            if (a == 0) throw new RuntimeException("cero");
            return 10 / a;
        } catch (RuntimeException e) {
            System.out.println("catch " + e.getMessage());
            return -1;
        } finally {
            System.out.println("finally " + a);
        }
    }

    public static void main(String[] args) {
        Figura[] figuras = { new Cuadrado(2), new Circulo(1) };
        for (Figura f : figuras) {
            System.out.println(f);
            System.out.println(f.describir());
        }
        System.out.println(Figura.tipo() + " " + Figura.PI_APROX);
        System.out.println(Base.getCreadas());
        Animal a = new Animal();
        System.out.println(a.hablar() + " " + a.patas);
        Animal p = new Perro("Rex");
        System.out.println(p.hablar());
        Animal c = new Cachorro("Tito");
        System.out.println(c.hablar());
        System.out.println(p instanceof Perro);
        System.out.println(p instanceof Cachorro);
        System.out.println(c instanceof Animal);
        if (p instanceof Perro) {
            Perro pp = (Perro) p;
            pp.buscar();
        }
        System.out.println(new Animal("Rex", 2).equals(p));
        System.out.println(p.equals("Rex"));
        System.out.println(p.getClass().getSimpleName());
        System.out.println(p.getClass().getName());

        Cuenta cu = new Cuenta("Ana");
        new Cuenta("Beto");
        System.out.println(Cuenta.getTotal());
        cu.depositar(100);
        try {
            cu.retirar(30);
            cu.retirar(100);
            System.out.println("no llega");
        } catch (SaldoException e) {
            System.out.println(e.getMessage() + " " + e.getFaltante());
        }
        System.out.println(cu.getSaldo() + " " + cu.getTitular());
        try {
            cu.depositar(-5);
        } catch (IllegalArgumentException e) {
            System.out.println(e);
        }
        System.out.println(probar(2));
        System.out.println(probar(0));
        try {
            int[] x = new int[2];
            x[2] = 1;
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
        try {
            System.out.println(10 / (args.length));
        } catch (ArithmeticException e) {
            System.out.println(e);
        }
        try {
            Integer.parseInt("12a");
        } catch (NumberFormatException e) {
            System.out.println(e.getMessage());
        }
        try {
            String s = null;
            s.length();
        } catch (NullPointerException e) {
            System.out.println("NPE");
        }
        try {
            Object o = new Animal();
            Perro q = (Perro) o;
        } catch (ClassCastException e) {
            System.out.println("CCE");
        }
        try {
            new ArrayList<String>().get(0);
        } catch (IndexOutOfBoundsException e) {
            System.out.println(e.getMessage());
        }
        try {
            "abc".charAt(9);
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("SIOOBE");
        }
        try {
            try {
                throw new IllegalStateException("adentro");
            } finally {
                System.out.println("limpieza");
            }
        } catch (IllegalArgumentException | IllegalStateException e) {
            System.out.println(e.getMessage());
        }
        Nodo cabeza = new Nodo(1);
        cabeza.siguiente = new Nodo(2);
        cabeza.siguiente.siguiente = new Nodo(3);
        int s = 0;
        for (Nodo n = cabeza; n != null; n = n.siguiente) s += n.valor;
        System.out.println(s);
        System.out.println(new Punto(1, 2).mover(3).mover(1));
        ArrayList<Punto> pts = new ArrayList<>();
        pts.add(new Punto(0, 0));
        pts.get(0).x = 9;
        System.out.println(pts);
        Punto u = new Punto(1, 1);
        Punto v = u;
        v.x = 5;
        System.out.println(u + " " + (u == v) + " " + (u == new Punto(5, 1)));
        System.out.println(Interna.saludo + new Interna().n);
        Object[] mezcla = { 1, "dos", 3.0, 'c', true, null };
        for (Object o : mezcla) System.out.print(o + " ");
        System.out.println();
        throw new IllegalStateException("fin del programa");
    }
}
