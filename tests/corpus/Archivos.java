import java.io.*;

public class Archivos {
    public static void main(String[] args) {
        try (BufferedWriter w = new BufferedWriter(new FileWriter("tests_corpus_salida.txt"))) {
            w.write("linea uno");
            w.newLine();
            w.write("linea dos");
            w.newLine();
        } catch (IOException e) {
            System.out.println("Error: " + e.getMessage());
        }
        try (BufferedReader r = new BufferedReader(new FileReader("tests_corpus_salida.txt"))) {
            String linea;
            while ((linea = r.readLine()) != null) {
                System.out.println(linea.toUpperCase());
            }
        } catch (IOException e) {
            System.out.println("Error");
        }
        try {
            FileWriter f = new FileWriter("tests_corpus_salida.txt", true);
            f.write("tres\n");
            f.close();
            BufferedReader r = new BufferedReader(new FileReader(new File("tests_corpus_salida.txt")));
            int n = 0;
            while (r.readLine() != null) n++;
            r.close();
            System.out.println(n);
        } catch (IOException e) {
            System.out.println("Error");
        }
        File borrar = new File("tests_corpus_salida.txt");
        System.out.println(borrar.exists());
        System.out.println(borrar.delete());
        try {
            new FileReader("no_existe.txt");
            System.out.println("no llega");
        } catch (FileNotFoundException e) {
            System.out.println("no encontrado");
        }
    }
}
