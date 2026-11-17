// Programas que javac rechaza aunque el error esté en código que nunca se ejecuta.
// tests/run.js confirma cada uno con javac y exige que JavaRun también los rechace.
const M = body => 'public class Main {\n  public static void main(String[] args) {\n' + body + '\n  }\n}\n';

module.exports = {
  variable_en_rama_muerta: M('int x = 1;\nif (x > 5) { System.out.println(y); }\nSystem.out.println(x);'),
  metodo_en_rama_muerta: M('int x = 1;\nif (x > 5) { noExiste(); }'),
  metodo_de_string_en_rama_muerta: M('String s = "a";\nif (s.length() > 5) { s.tamanio(); }'),
  tipo_en_rama_muerta: M('int x = 1;\nif (x > 5) { int z = "hola"; }'),
  double_a_int_en_rama_muerta: M('double d = 2.5;\nif (d > 5) { int i = d; }'),
  metodo_de_clase_propia: 'class A { void f() { } }\npublic class Main {\n  public static void main(String[] args) {\n    A a = new A();\n    if (args.length > 5) { a.g(); }\n  }\n}\n',
  argumentos_en_rama_muerta: 'public class Main {\n  static void f(int a) { }\n  public static void main(String[] args) {\n    if (args.length > 5) { f(1, 2); }\n  }\n}\n',
  retorno_en_rama_muerta: 'public class Main {\n  static int f(int a) {\n    if (a > 100) { return "grande"; }\n    return a;\n  }\n  public static void main(String[] args) { System.out.println(f(1)); }\n}\n',
  final_en_rama_muerta: M('final int x = 1;\nif (args.length > 5) { x = 2; }'),
  duplicada_en_rama_muerta: M('int x = 1;\nif (args.length > 5) { int x = 2; }'),
  condicion_en_rama_muerta: M('int x = 1;\nif (args.length > 5) { if (x) { } }'),
  inalcanzable_tras_break: M('while (true) {\n  break;\n  System.out.println(1);\n}'),
  inalcanzable_tras_continue: M('for (int i = 0; i < 2; i++) {\n  continue;\n  System.out.println(i);\n}'),
  inalcanzable_tras_return: 'public class Main {\n  static void f() {\n    return;\n    System.out.println(2);\n  }\n  public static void main(String[] args) { f(); }\n}\n',
  inalcanzable_tras_while_infinito: M('while (true) { }\nSystem.out.println(1);'),
  generico_incompatible: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    List<String> l = new ArrayList<>();\n    l.add(5);\n  }\n}\n',
  generico_entero_con_texto: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    List<Integer> l = new ArrayList<>();\n    l.add("hola");\n  }\n}\n',
  primitivo_en_generico: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    List<int> l = new ArrayList<>();\n  }\n}\n',
  primitivo_en_map: 'import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Map<String, int> m = new HashMap<>();\n  }\n}\n',
  break_fuera_de_bucle: M('break;'),
  continue_fuera_de_bucle: M('continue;'),
  case_duplicado: M('int x = 1;\nswitch (x) {\n  case 1: break;\n  case 1: break;\n}'),
  case_duplicado_texto: M('String x = "a";\nswitch (x) {\n  case "a": break;\n  case "a": break;\n}'),
  default_duplicado: M('int x = 1;\nswitch (x) {\n  default: break;\n  default: break;\n}'),
  herencia_de_final: 'final class A { }\nclass B extends A { }\npublic class Main { public static void main(String[] a) { } }\n',
  metodo_final_sobrescrito: 'class A { final void f() { } }\nclass B extends A { void f() { } }\npublic class Main { public static void main(String[] a) { } }\n',
  override_reduce_visibilidad: 'class A { public void f() { } }\nclass B extends A { void f() { } }\npublic class Main { public static void main(String[] a) { } }\n',
  interfaz_sin_public: 'interface I { void f(); }\nclass B implements I { void f() { } }\npublic class Main { public static void main(String[] a) { } }\n',
  cambia_tipo_de_retorno: 'class A { int f() { return 1; } }\nclass B extends A { String f() { return ""; } }\npublic class Main { public static void main(String[] a) { } }\n',
  ternario_de_tipo_erroneo: M('int x = true ? 1 : "a";'),
  metodo_duplicado: 'public class Main {\n  static void f() { }\n  static void f() { }\n  public static void main(String[] a) { }\n}\n'
};
