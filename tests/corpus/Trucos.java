import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Base {
    private String nombre = "base";
    protected int n = 1;
    static int creados;
    static { creados = 10; }
    { n = 2; }
    Base() { n += 1; creados++; }
    String leer() { return nombre; }
    public String toString() { return "Base:" + nombre; }
}

class Hija extends Base {
    private String nombre = "hija";
    Hija() { super(); n *= 2; }
    String propio() { return nombre + "/" + leer(); }
    @Override public String toString() { return super.toString() + "+Hija"; }
}

class Alumno implements Comparable<Alumno> {
    String nombre;
    int nota;
    Alumno(String nombre, int nota) { this.nombre = nombre; this.nota = nota; }
    public int compareTo(Alumno o) { return nota - o.nota; }
    public String toString() { return nombre + ":" + nota; }
    @Override public boolean equals(Object o) { return o instanceof Alumno a && a.nombre.equals(nombre); }
    @Override public int hashCode() { return nombre.hashCode(); }
}

class Par<A, B> {
    final A a;
    final B b;
    Par(A a, B b) { this.a = a; this.b = b; }
    <C> Par<A, C> conB(C c) { return new Par<>(a, c); }
    static <T> T primero(List<T> l) { return l.get(0); }
}

class Externa {
    static class Ayuda {
        static int uno() { return 1; }
    }
}

public class Trucos {
    static int contador;
    static int siguiente() { return ++contador; }
    static boolean falso() { System.out.print("F "); return false; }
    static boolean cierto() { System.out.print("V "); return true; }

    public static void main(String[] args) {
        Hija h = new Hija();
        System.out.println(h.propio() + " " + h.n + " " + Base.creados + " " + h);

        int[] a = {1, 2, 3}, b = new int[2];
        int c = 0;
        a[c++] += 10;
        a[c] *= 3;
        System.out.println(Arrays.toString(a) + c + Arrays.toString(b));
        int[][] irregular = new int[2][];
        irregular[0] = new int[]{1};
        irregular[1] = new int[3];
        System.out.println(irregular[1].length + " " + irregular.length);

        byte by = 10;
        by += 120;
        short sh = 1000;
        sh *= 100;
        char ch = 'a' + 1;
        ch++;
        float fl = 1;
        long lo = 5;
        double du = 'a';
        int in = 'a' + 1;
        System.out.println(by + " " + sh + " " + ch + " " + fl + " " + lo + " " + du + " " + in);
        System.out.println((int) Math.round(2.5) + " " + Math.round(2.5f));
        System.out.println(5 / 2 * 2.0 + " " + 5 / 2.0 * 2);
        System.out.println(1 + 2 + "3" + 4 + 5);
        System.out.println('a' + 1 + "b");
        System.out.println((char) ('a' + 1) + "b");
        String nada = null;
        System.out.println("x" + nada + null);
        System.out.println("a".equals(null));
        String s = "ab";
        s += 'c';
        s += 1;
        s += 2.5;
        s += true;
        System.out.println(s);
        for (char x : "hey".toCharArray()) System.out.print((int) x + " ");
        System.out.println();
        System.out.println(String.valueOf(new char[]{'o', 'k'}));

        System.out.println(falso() && cierto());
        System.out.println(cierto() || falso());
        System.out.println(falso() & cierto());
        int i = 5;
        i = i++ + i--;
        System.out.println(i);
        int t = siguiente() + siguiente() * siguiente();
        System.out.println(t);
        boolean flag = false;
        if (flag = true) System.out.println("asignado");
        System.out.println(10 == 10.0);
        System.out.println('a' == 97);
        Integer caja = 7;
        int suelto = caja + 1;
        System.out.println(suelto);
        Integer c1 = 127, c2 = 127;
        System.out.println(c1 == c2);
        System.out.println(c1.equals(c2));

        List<Alumno> l = new ArrayList<>();
        l.add(new Alumno("Ana", 7));
        l.add(new Alumno("Luis", 3));
        l.add(new Alumno("Eva", 9));
        Collections.sort(l);
        System.out.println(l);
        System.out.println(l.contains(new Alumno("Eva", 0)) + " " + l.indexOf(new Alumno("Ana", 1)));
        Par<String, Integer> p = new Par<>("x", 1);
        System.out.println(p.conB(2.5).b);
        System.out.println(Par.primero(List.of("uno", "dos")));
        System.out.println(Externa.Ayuda.uno());

        StringBuilder sb = new StringBuilder("ab");
        sb.append(1).append('c').append(2.5).append(true);
        System.out.println(sb);
        System.out.printf("%5.2f|%-6s|%6s|%03d|%+d%n", 3.14159, "ab", "cd", 7, 5);
        System.out.println(String.format("%d%%", 50));
        Object o = "texto";
        if (o instanceof String str && str.length() > 2) System.out.println(str.toUpperCase());
        Object[] varios = {1, 2.5, 'c', "s", 3L, 1.5f};
        for (Object v : varios) System.out.print(v.getClass().getSimpleName() + " ");
        System.out.println();
    }
}
