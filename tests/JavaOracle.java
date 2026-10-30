import java.io.*;
import java.lang.reflect.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import javax.tools.*;

/**
 * Oráculo de pruebas: compila y ejecuta cada caso con el JDK real, en una sola JVM.
 * Cada subcarpeta de args[0] tiene Main.java (o la clase pública) y, opcional, stdin.txt.
 * Escribe status.txt (ok | compile | exception | timeout), stdout.txt y error.txt.
 */
public class JavaOracle {
    public static void main(String[] args) throws Exception {
        Locale.setDefault(Locale.ROOT);
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        PrintStream realOut = System.out;
        InputStream realIn = System.in;
        File[] cases = new File(args[0]).listFiles(File::isDirectory);
        Arrays.sort(cases);
        ExecutorService pool = Executors.newCachedThreadPool(r -> { Thread t = new Thread(r); t.setDaemon(true); return t; });
        for (File dir : cases) {
            File src = Arrays.stream(dir.listFiles((d, n) -> n.endsWith(".java"))).findFirst().orElse(null);
            if (src == null) continue;
            File classes = new File(dir, "classes");
            classes.mkdirs();
            DiagnosticCollector<JavaFileObject> diags = new DiagnosticCollector<>();
            StandardJavaFileManager fm = compiler.getStandardFileManager(diags, null, StandardCharsets.UTF_8);
            boolean ok = compiler.getTask(null, fm,
                diags, Arrays.asList("-d", classes.getPath(), "-encoding", "UTF-8", "-Xlint:none", "-nowarn"), null, fm.getJavaFileObjects(src)).call();
            fm.close();
            if (!ok) {
                StringBuilder sb = new StringBuilder();
                for (Diagnostic<?> d : diags.getDiagnostics()) {
                    if (d.getKind() == Diagnostic.Kind.ERROR) sb.append(d.getLineNumber()).append(": ").append(d.getMessage(Locale.ENGLISH).split("\n")[0]).append("\n");
                }
                write(dir, "status.txt", "compile");
                write(dir, "error.txt", sb.toString());
                write(dir, "stdout.txt", "");
                continue;
            }
            String mainClass = findMain(classes);
            if (mainClass == null) { write(dir, "status.txt", "nomain"); write(dir, "stdout.txt", ""); continue; }
            ByteArrayOutputStream captured = new ByteArrayOutputStream();
            File stdin = new File(dir, "stdin.txt");
            System.setIn(stdin.exists() ? new FileInputStream(stdin) : new ByteArrayInputStream(new byte[0]));
            System.setOut(new PrintStream(captured, true, "UTF-8"));
            URLClassLoader loader = new URLClassLoader(new URL[]{classes.toURI().toURL()}, null);
            Future<Throwable> run = pool.submit(() -> {
                try {
                    Class<?> c = Class.forName(mainClass, true, loader);
                    Method m = c.getMethod("main", String[].class);
                    m.setAccessible(true);
                    m.invoke(null, (Object) new String[0]);
                    return null;
                } catch (InvocationTargetException e) {
                    return e.getCause();
                } catch (Throwable t) {
                    return t;
                }
            });
            String status;
            String error = "";
            try {
                Throwable thrown = run.get(5, TimeUnit.SECONDS);
                if (thrown == null) status = "ok";
                else { status = "exception"; error = thrown.toString(); }
            } catch (TimeoutException e) {
                run.cancel(true);
                status = "timeout";
            }
            System.setOut(realOut);
            System.setIn(realIn);
            loader.close();
            write(dir, "status.txt", status);
            write(dir, "error.txt", error);
            write(dir, "stdout.txt", captured.toString("UTF-8"));
        }
        realOut.println("oraculo: " + cases.length + " casos");
        System.exit(0);
    }

    static String findMain(File classes) throws Exception {
        String[] names = classes.list((d, n) -> n.endsWith(".class") && !n.contains("$"));
        if (names == null) return null;
        Arrays.sort(names);
        URLClassLoader probe = new URLClassLoader(new URL[]{classes.toURI().toURL()}, null);
        String found = null;
        for (String n : names) {
            String c = n.replace(".class", "");
            try {
                Class<?> k = Class.forName(c, false, probe);
                Method m = k.getMethod("main", String[].class);
                if (Modifier.isStatic(m.getModifiers())) { found = c; if (c.equals("Main")) break; }
            } catch (NoSuchMethodException | NoClassDefFoundError e) { /* no es la clase principal */ }
        }
        probe.close();
        return found;
    }

    static void write(File dir, String name, String text) throws IOException {
        Files.write(new File(dir, name).toPath(), text.getBytes(StandardCharsets.UTF_8));
    }
}
