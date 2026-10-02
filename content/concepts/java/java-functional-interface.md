---
title: Java 함수형 인터페이스
---

**함수형 인터페이스**는 "추상 메서드가 하나뿐인 인터페이스"로, 람다 표현식과 메서드 레퍼런스의 타입 대상이 됩니다. Java 8의 람다·스트림 API의 기반이며, 표준 패키지 `java.util.function`의 인터페이스는 전부 [[concepts/java/java-generics|제네릭]]으로 구성되어 있습니다.

## 정의와 조건

- **추상 메서드가 정확히 하나**인 인터페이스
- `default`, `static` 메서드와 `Object`의 public 메서드 재정의는 개수에서 제외
- 람다 표현식이나 메서드 레퍼런스로 직접 인스턴스화 가능

```java
@FunctionalInterface
interface Calculator {
    int calculate(int a, int b);  // 추상 메서드 1개

    // 아래는 개수 제외 — 선언 가능
    default int twice(int a, int b) {
        return calculate(a, b) * 2;
    }
    static Calculator addition() {
        return (a, b) -> a + b;
    }
    @Override
    String toString();  // Object 메서드 재정의도 제외
}
```

`@FunctionalInterface` 애노테이션은 선택이지만, 붙이면 추상 메서드가 2개 이상 되거나 0개일 때 **컴파일 오류**로 잡아주므로 항상 붙이는 것이 안전합니다.

## 람다 표현식

```java
// 기본 문법
Calculator add = (a, b) -> a + b;              // 매개변수 타입 생략 (추론)
Calculator sub = (int a, int b) -> a - b;      // 타입 명시
Runnable r = () -> System.out.println("run");  // 매개변수 없음
Calculator multi = (a, b) -> {                 // 블록 본문은 return 필요
    int result = a * b;
    return result;
};
```

## 메서드 레퍼런스 4가지 형태

```java
// 1. 정적 메서드: ClassName::staticMethod
Function<String, Integer> parse = Integer::parseInt;

// 2. 특정 객체의 인스턴스 메서드: instance::method
String prefix = "Hello, ";
Supplier<String> greeting = prefix::trim;

// 3. 임의 객체의 인스턴스 메서드: ClassName::instanceMethod
//    첫 번째 매개변수가 수신자(receiver)가 됨
Function<String, Integer> length = String::length;   // s -> s.length()
BiFunction<String, String, Boolean> equals = String::equals;  // (a, b) -> a.equals(b)

// 4. 생성자: ClassName::new
Supplier<List<String>> listMaker = ArrayList::new;
Function<Integer, List<String>> sizedList = ArrayList::new;  // new ArrayList<>(capacity)
```

## java.util.function 핵심 인터페이스

| 인터페이스          | 추상 메서드           | 의미                                       | 예시                         |
| ------------------- | --------------------- | ------------------------------------------ | ---------------------------- |
| `Function<T,R>`     | `R apply(T t)`        | T를 받아 R로 변환                          | `s -> s.length()`            |
| `BiFunction<T,U,R>` | `R apply(T t, U u)`   | 두 값을 받아 변환                          | `(a, b) -> a + b`            |
| `Consumer<T>`       | `void accept(T t)`    | 값을 소비 (부수 효과)                      | `s -> System.out.println(s)` |
| `Supplier<T>`       | `T get()`             | 값을 공급 (지연 생성)                      | `() -> new ArrayList<>()`    |
| `Predicate<T>`      | `boolean test(T t)`   | 조건 판별                                  | `s -> s.isEmpty()`           |
| `UnaryOperator<T>`  | `T apply(T t)`        | 같은 타입 변환 (`Function<T,T>`)           | `s -> s.toUpperCase()`       |
| `BinaryOperator<T>` | `T apply(T t1, T t2)` | 같은 타입 두 개 결합 (`BiFunction<T,T,T>`) | `(a, b) -> a + b`            |
| `Runnable`          | `void run()`          | 인자·반환 없음                             | `() -> doWork()`             |

인자 2개까지는 `BiConsumer`·`BiPredicate` 등 변형이 준비되어 있지만, **3개 이상을 받는 표준 인터페이스는 없으므로** 필요하면 직접 정의해야 합니다.

```java
@FunctionalInterface
interface TriFunction<T, U, V, R> {
    R apply(T t, U u, V v);
}

TriFunction<String, Integer, Boolean, String> f =
    (s, n, b) -> s + n + b;
```

## 기본형 특화 변형

제네릭은 참조형만 다룰 수 있어 `Integer` 박싱 비용이 발생합니다. 이를 피하는 기본형 특화 버전이 존재합니다.

```java
// 박싱 발생
Function<Integer, Integer> square = n -> n * n;

// 기본형 특화 — 박싱 없음
IntUnaryOperator squarePrim = n -> n * n;      // int -> int
IntPredicate isEven = n -> n % 2 == 0;         // int -> boolean
ToIntFunction<String> strLen = String::length; // T -> int
IntSupplier random = () -> 42;                 // () -> int
```

스트림에서 `mapToInt`·`IntStream`을 쓰는 이유가 이 박싱 회피에 있습니다. → [[concepts/java/java-8-stream-map]]

## 커스텀 함수형 인터페이스 만들기

표준 인터페이스로 표현할 수 없는 시그니처(checked exception, 3개 이상 인자, 의미 있는 이름이 필요할 때)에만 직접 정의합니다.

```java
@FunctionalInterface
public interface SqlExecutor<T> {
    T execute(Connection conn) throws SQLException;  // checked exception 허용
}

// 사용 — 람다가 SQLException을 던질 수 있음
sqlExecutor.execute(conn -> conn.createStatement().execute(sql));
```

제네릭을 조합하면 재사용 가능한 변환 규격을 만들 수도 있습니다.

```java
@FunctionalInterface
interface Transformer<T, R> {
    R transform(T input);

    // default 메서드로 조합 가능 (Function.compose와 같은 패턴)
    default <V> Transformer<T, V> andThen(Transformer<R, V> next) {
        return input -> next.transform(transform(input));
    }
}

Transformer<String, Integer> toLen = String::length;
Transformer<String, String> pipeline = toLen.andThen(n -> "len=" + n);
pipeline.transform("hello");  // "len=5"
```

## 람다 캡처 규칙

- 지역 변수는 `final` 또는 **effectively final**(재할당 없음)만 캡처 가능
- 필드는 제약 없음 (람다가 필드를 읽는 시점의 값 사용)

```java
int base = 10;
Function<Integer, Integer> addBase = n -> n + base;  // OK — effectively final

// int count = 0;
// list.forEach(s -> count++);  // ❌ 컴파일 오류 — 캡처 변수 수정 불가
```

- 람다 본문에서 **checked exception을 던지려면** 함수형 인터페이스의 추상 메서드가 `throws`로 선언해야 함. 표준 인터페이스는 하나도 선언하지 않으므로, 람다 내부에서 try-catch로 감싸거나 커스텀 인터페이스를 정의해야 합니다.

```java
// ❌ Function은 예외를 선언하지 않아 컴파일 오류
// Function<String, String> read = path -> Files.readString(Path.of(path));

// ✅ 내부에서 처리
Function<String, String> read = path -> {
    try {
        return Files.readString(Path.of(path));
    } catch (IOException e) {
        throw new UncheckedIOException(e);
    }
};
```

## target typing — 같은 람다가 여러 타입으로

람다의 타입은 람다 자체가 아니라 **대상 타입(할당되는 변수·매개변수의 타입)**이 결정합니다.

```java
// 같은 모양의 람다가 상황에 따라 다른 함수형 인터페이스로 해석됨
Callable<String> c = () -> "result";   // call() throws Exception
Supplier<String> s = () -> "result";   // get()

// 제네릭 타입 인자도 대상 타입에서 추론
Function<String, Integer> f = String::length;         // T=String, R=Integer
Comparator<String> cmp = Comparator.comparing(String::length);
```

## 실전 패턴

```java
// 조건 필터 (Predicate) + 제네릭 메서드
public static <T> List<T> filter(List<T> list, Predicate<T> cond) {
    List<T> result = new ArrayList<>();
    for (T item : list) {
        if (cond.test(item)) result.add(item);
    }
    return result;
}

List<Integer> evens = filter(List.of(1, 2, 3, 4), n -> n % 2 == 0);

// 기본값 제공 (Supplier) — 와일드카드로 유연하게
public static <T> T getOrDefault(T value, Supplier<? extends T> fallback) {
    return value != null ? value : fallback.get();
}
```

## 관련 페이지

- [[concepts/java/java-generics]] — 제네릭 문법, 와일드카드, 타입 소거
- [[concepts/java/java-8-stream-map]] — Stream map/flatMap (함수형 인터페이스의 대표 활용처)
- [[summaries/development/java-debugging]] — Java 실행 및 디버깅
