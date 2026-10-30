import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Textos {
    public static void main(String[] args) {
        String s = "  Hola Mundo  ";
        System.out.println("[" + s.trim() + "]");
        System.out.println(s.length());
        String t = s.trim();
        System.out.println(t.toUpperCase() + t.toLowerCase());
        System.out.println(t.charAt(5));
        System.out.println(t.substring(5));
        System.out.println(t.substring(0, 4));
        System.out.println(t.indexOf("Mundo"));
        System.out.println(t.indexOf('o'));
        System.out.println(t.lastIndexOf('o'));
        System.out.println(t.indexOf("zzz"));
        System.out.println(t.contains("ola"));
        System.out.println(t.startsWith("Ho") + " " + t.endsWith("do"));
        System.out.println(t.replace('o', '0'));
        System.out.println(t.replace("Mundo", "Java"));
        System.out.println("a,b,,c,,".split(",").length);
        System.out.println(Arrays.toString("uno dos  tres".split(" ")));
        System.out.println(Arrays.toString("uno dos  tres".split("\\s+")));
        System.out.println("abc".compareTo("abd"));
        System.out.println("abc".compareTo("ab"));
        System.out.println("Ana".equalsIgnoreCase("ANA"));
        System.out.println("".isEmpty());
        System.out.println("ab".repeat(3));
        System.out.println("Hola".concat(" che"));
        System.out.println("hola".hashCode());
        System.out.println(String.join("-", "a", "b", "c"));

        String a = "hola";
        String b = "hola";
        String c = new String("hola");
        String d = "ho" + "la";
        String e = "ho";
        String f = e + "la";
        System.out.println(a == b);
        System.out.println(a == c);
        System.out.println(a == d);
        System.out.println(a == f);
        System.out.println(a.equals(c));
        System.out.println(a.equals(f));
        System.out.println(a == c.intern());

        char[] cs = t.toCharArray();
        int vocales = 0;
        for (char ch : cs) {
            if ("aeiouAEIOU".indexOf(ch) >= 0) vocales++;
        }
        System.out.println(vocales);

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 3; i++) sb.append(i).append(',');
        sb.deleteCharAt(sb.length() - 1);
        System.out.println(sb);
        System.out.println(sb.reverse().toString());
        System.out.println(sb.length());
        System.out.println(new StringBuilder("hola").insert(2, "XX"));

        int[] nums = {5, 3, 9};
        System.out.println(nums.length);
        Arrays.sort(nums);
        System.out.println(Arrays.toString(nums));
        double[] ds = new double[2];
        boolean[] bs = new boolean[2];
        String[] ss = new String[2];
        char[] chs = {'a', 'b'};
        System.out.println(Arrays.toString(ds) + Arrays.toString(bs) + Arrays.toString(ss));
        System.out.println(chs);
        int[][] m = {{1, 2, 3}, {4, 5, 6}};
        System.out.println(m[1][2] + " " + m.length + " " + m[0].length);
        int[][] n = new int[2][3];
        n[1][1] = 7;
        System.out.println(Arrays.deepToString(n));
        int suma = 0;
        for (int[] fila : m) for (int v : fila) suma += v;
        System.out.println(suma);
        int[] copia = nums.clone();
        copia[0] = 100;
        System.out.println(nums[0] + " " + copia[0]);
        int[] alias = nums;
        alias[1] = 50;
        System.out.println(nums[1]);

        ArrayList<String> l = new ArrayList<>();
        l.add("b");
        l.add("a");
        l.add(1, "c");
        System.out.println(l);
        System.out.println(l.size() + " " + l.get(0) + " " + l.contains("a") + " " + l.indexOf("a"));
        l.set(0, "z");
        l.remove("c");
        System.out.println(l);
        l.remove(0);
        System.out.println(l + " " + l.isEmpty());
        ArrayList<Integer> li = new ArrayList<>();
        for (int i = 5; i > 0; i--) li.add(i * i);
        Collections.sort(li);
        System.out.println(li);
        System.out.println(Collections.max(li));
        int total = 0;
        for (int v : li) total += v;
        System.out.println(total);
        li.remove(0);
        System.out.println(li);
        li.remove(Integer.valueOf(25));
        System.out.println(li);
        List<Double> ld = new ArrayList<>();
        ld.add(1.5);
        System.out.println(ld.get(0) * 2);
        l.clear();
        System.out.println(l.size());
    }
}
