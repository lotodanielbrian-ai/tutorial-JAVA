// Programas incorrectos que el validador no debe aprobar: la auditoría encontró que varios pasaban.
module.exports = function (wrap) {
  return [
    { id: 3, why: 'resultado escrito a mano', code: wrap('int a = 15; int b = 4;\nSystem.out.println("Suma: 19");\nSystem.out.println("Resta: 11");\nSystem.out.println("Producto: 60");\nSystem.out.println("División entera: 3");\nSystem.out.println("Resto: 3");') },
    { id: 7, why: 'categoría impresa sin if', code: wrap('System.out.println("Nota: 75");\nSystem.out.println("Categoría: Bueno");') },
    { id: 7, why: 'condiciones en orden incorrecto', code: wrap('int nota = 75;\nSystem.out.println("Nota: " + nota);\nif (nota >= 60) { System.out.println("Categoría: Regular"); }\nelse if (nota >= 75) { System.out.println("Categoría: Bueno"); }\nelse { System.out.println("Categoría: Insuficiente"); }') },
    { id: 8, why: 'sin break se ejecuta todo', code: wrap('int dia = 3;\nswitch (dia) {\ncase 3: System.out.println("Día 3: Miércoles");\ncase 4: System.out.println("Día 4: Jueves");\ndefault: System.out.println("Día inválido");\n}') },
    { id: 9, why: 'usa && pero imprime false', code: wrap('int edad = 20; boolean t = true;\nboolean x = edad < 18 && t;\nSystem.out.println("Puede manejar: " + x);') },
    { id: 11, why: 'seis println sin while', code: wrap('System.out.println("Contando: 1");\nSystem.out.println("Contando: 2");\nSystem.out.println("Contando: 3");\nSystem.out.println("Contando: 4");\nSystem.out.println("Contando: 5");\nSystem.out.println("¡Listo!");') },
    { id: 11, why: 'bucle infinito', code: wrap('int i = 1;\nwhile (i <= 5) {\n  System.out.println("Contando: " + i);\n}\nSystem.out.println("¡Listo!");') },
    { id: 12, why: 'for que imprime otra cosa', code: wrap('for (int i = 1; i <= 5; i++) { System.out.println("nada " + i * 9); }') },
    { id: 13, why: 'se sale del array', code: wrap('int[] numeros = {5, 2, 8, 1, 9, 3};\nint suma = 0;\nfor (int i = 0; i <= numeros.length; i++) { suma += numeros[i]; }\nSystem.out.println("Suma: " + suma);') },
    { id: 15, why: 'cuenta también los de 200', code: wrap('int[] ventas = {150, 300, 50, 400, 200};\nint total = 0, c = 0;\nfor (int i = 0; i < ventas.length; i++) { total += ventas[i]; if (ventas[i] >= 200) c++; }\nSystem.out.println("Total vendido: " + total);\nSystem.out.println("Ventas exitosas: " + c);') },
    { id: 17, why: 'multiplica mal', code: 'public class Main {\n  static int calcularArea(int a, int b) { return a * b * 100; }\n  public static void main(String[] x) { System.out.println("Área del rectángulo: " + calcularArea(6, 4)); }\n}' },
    { id: 20, why: 'accede a un atributo private desde afuera', code: 'class Persona { private String nombre = "Ana"; private int edad = 25; public String getNombre() { return nombre; } public void setEdad(int e) { edad = e; } }\npublic class Main {\n  public static void main(String[] x) {\n    Persona p = new Persona();\n    System.out.println("Nombre: " + p.nombre);\n    System.out.println("Edad: " + p.edad);\n  }\n}' },
    { id: 23, why: 'no implementa el método de la interfaz', code: 'interface Imprimible { void imprimir(); }\nclass Foto implements Imprimible { }\npublic class Main {\n  public static void main(String[] x) {\n    System.out.println("Imprimiendo documento...");\n    System.out.println("Imprimiendo foto...");\n  }\n}' },
    { id: 27, why: 'no atrapa la excepción', code: wrap('System.out.println("Intentando convertir...");\nint n = Integer.parseInt("abc");\nSystem.out.println("Programa finalizado");') },
    { id: 31, why: 'commit sin add', code: 'git init\ngit commit -m "uno"\ngit add Main.java\ngit commit -m "dos"\ngit log --oneline\ngit checkout abc123 -- Main.java' },
    { id: 31, why: 'no hace git init', code: 'git add Main.java\ngit commit -m "uno"\ngit add Main.java\ngit commit -m "dos"\ngit log --oneline\ngit checkout abc123 -- Main.java' },
    { id: 34, why: 'código inicial sin tocar', code: null }
  ].map(function (w) {
    if (w.code === null) w.code = 'public class Main {\n    public static void main(String[] args) {\n    }\n}';
    return w;
  });
};
