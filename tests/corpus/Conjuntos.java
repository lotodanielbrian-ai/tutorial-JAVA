// HashSet tiene que recorrer en el mismo orden que Java, también al crecer.
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

public class Conjuntos {
    public static void main(String[] args) {
        Set<String> nombres = new HashSet<>();
        System.out.println(nombres.add("Ana"));
        System.out.println(nombres.add("Luz"));
        System.out.println(nombres.add("Ana"));
        nombres.add("Pedro");
        nombres.add("María");
        System.out.println(nombres + " " + nombres.size() + " " + nombres.contains("Luz"));

        Set<Integer> numeros = new HashSet<>();
        for (int i = 0; i < 40; i += 3) {
            numeros.add(i * 7);
        }
        System.out.println(numeros);
        numeros.remove(21);
        System.out.println(numeros.remove(999) + " " + numeros.size() + " " + numeros.contains(21));

        for (String nombre : nombres) {
            System.out.println(nombre.length());
        }

        Set<String> ordenAlta = new LinkedHashSet<>();
        ordenAlta.add("zeta");
        ordenAlta.add("alfa");
        ordenAlta.add("zeta");
        System.out.println(ordenAlta);

        TreeSet<String> ordenados = new TreeSet<>();
        ordenados.add("zeta");
        ordenados.add("alfa");
        ordenados.add("beta");
        System.out.println(ordenados + " " + ordenados.first() + " " + ordenados.last());

        List<Integer> conRepetidos = new ArrayList<>(Arrays.asList(5, 1, 5, 3, 1));
        Set<Integer> sinRepetidos = new HashSet<>(conRepetidos);
        System.out.println(sinRepetidos);
        List<Integer> deVuelta = new ArrayList<>(sinRepetidos);
        System.out.println(deVuelta.get(0));

        Set<Integer> a = new TreeSet<>(Arrays.asList(1, 2, 3, 4));
        Set<Integer> b = new TreeSet<>(Arrays.asList(3, 4, 5));
        Set<Integer> union = new TreeSet<>(a);
        System.out.println(union.addAll(b) + " " + union);
        Set<Integer> comun = new TreeSet<>(a);
        comun.retainAll(b);
        System.out.println(comun);
        Set<Integer> resta = new TreeSet<>(a);
        resta.removeAll(b);
        System.out.println(resta + " " + resta.isEmpty());
        resta.clear();
        System.out.println(resta + " " + resta.isEmpty());
    }
}
