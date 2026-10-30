public class Flujo {
    static int contador = 0;
    static final int LIMITE = 3;

    static int fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }
    static int fib(int n) { if (n < 2) return n; return fib(n - 1) + fib(n - 2); }
    static void inc() { contador++; }
    static int suma(int a, int b) { return a + b; }
    static double suma(double a, double b) { return a + b; }
    static String suma(String a, String b) { return a + b; }
    static long suma(long a, long b) { return a + b + 1000; }
    static void cambia(int x) { x = 99; }
    static void cambia(int[] x) { x[0] = 99; }

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            if (i == 2) continue;
            if (i == 5) break;
            System.out.print(i + " ");
        }
        System.out.println();
        for (int i = 0, j = 10; i < j; i += 3, j -= 3) System.out.print(i + ":" + j + " ");
        System.out.println();
        int k = 0;
        while (true) {
            if (++k > 3) break;
        }
        System.out.println(k);
        do { k--; } while (k > 0);
        System.out.println(k);
        for (int i = 1; i <= 3; i++) {
            for (int j = 1; j <= i; j++) System.out.print("*");
            System.out.println();
        }
        int d = 2;
        switch (d) {
            case 1: System.out.println("uno");
            case 2: System.out.println("dos");
            case 3: System.out.println("tres"); break;
            default: System.out.println("otro");
        }
        String op = "sumar";
        switch (op) {
            case "restar": System.out.println("-"); break;
            case "sumar": System.out.println("+"); break;
            default: System.out.println("?");
        }
        char letra = 'b';
        switch (letra) {
            case 'a': case 'b': System.out.println("ab"); break;
            default: System.out.println("no");
        }
        switch (9) {
            case 1: System.out.println("x"); break;
        }
        int dia = 6;
        String tipo = switch (dia) {
            case 6, 7 -> "finde";
            default -> {
                String t = "semana";
                yield t + "l";
            }
        };
        System.out.println(tipo);
        switch (dia) {
            case 1 -> System.out.println("lunes");
            case 6 -> { System.out.println("sabado"); }
            default -> System.out.println("otro");
        }
        System.out.println(fact(10));
        System.out.println(fib(15));
        inc(); inc();
        System.out.println(contador + " " + LIMITE);
        System.out.println(suma(1, 2));
        System.out.println(suma(1.5, 2));
        System.out.println(suma("a", "b"));
        System.out.println(suma(1L, 2));
        int v = 1;
        cambia(v);
        int[] arr = {1};
        cambia(arr);
        System.out.println(v + " " + arr[0]);
        int edad = 20;
        String r = edad >= 18 ? (edad >= 65 ? "jubilado" : "adulto") : "menor";
        System.out.println(r);
        var nombre = "var";
        var n = 3;
        System.out.println(nombre + n);
        final int K = 4;
        System.out.println(K * 2);
        int[] datos = {3, 8, 2};
        int mayor = datos[0];
        for (int x : datos) if (x > mayor) mayor = x;
        System.out.println(mayor);
        {
            int local = 1;
            System.out.println(local);
        }
        int local = 2;
        System.out.println(local);
        int i = 0;
        for (; i < 3; ) i++;
        System.out.println(i);
    }
}
