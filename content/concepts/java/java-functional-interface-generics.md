---
title: Java 함수형 인터페이스·제네릭
---
**함수형 인터페이스**는 "추상 메서드가 하나뿐인 인터페이스"로 람다식의 타입 대상이 되고, **제네릭**은 컴파일 타임에 타입을 파라미터화해 타입 안전성을 보장합니다. Java 8의 `java.util.function` 패키지가 전부 제네릭으로 구성되어 있듯 두 개념은 함께 동작합니다.

## 함수형 인터페이스

### 정의와 조건

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

### 람다 표현식

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

### 메서드 레퍼런스 4가지 형태

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

### java.util.function 핵심 인터페이스

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

### 기본형 특화 변형

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

스트림에서 `mapToInt`·`IntStream`을 쓰는 이유가 이 박싱 회수에 있습니다. → [[concepts/java/java-8-stream-map]]

### 커스텀 함수형 인터페이스 만들기

표준 인터페이스로 표현할 수 없는 시그니처(checked exception, 3개 이상 인자, 의미 있는 이름이 필요할 때)에만 직접 정의합니다.

```java
@FunctionalInterface
public interface SqlExecutor<T> {
    T execute(Connection conn) throws SQLException;  // checked exception 허용
}

// 사용 — 람다가 SQLException을 던질 수 있음
sqlExecutor.execute(conn -> conn.createStatement().execute(sql));
```

### 람다 캡처 규칙

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

## 제네릭 (Generics)

### 기본 문법

```java
// 제네릭 클래스
public class Box<T> {
    private T value;
    public void set(T value) { this.value = value; }
    public T get() { return value; }
}

// 제네릭 메서드 — 반환 타입 앞에 <T> 선언
public static <T> void swap(T[] arr, int i, int j) {
    T tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}

// 생성 시 diamond 연산자로 타입 생략 (Java 7+)
Map<String, List<Integer>> map = new HashMap<>();
```

타입 파라미터 컨벤션: `T`(Type), `E`(Element), `K`/`V`(Key/Value), `R`(Result), `U`·`V`(두 번째·세 번째 타입).

### bounded type parameter (타입 한정)

```java
// 상한 한정 — Comparable을 구현한 타입만 허용
public static <T extends Comparable<T>> T max(List<T> list) {
    T result = list.get(0);
    for (T item : list) {
        if (item.compareTo(result) > 0) result = item;
    }
    return result;
}

max(Arrays.asList(3, 1, 2));        // Integer는 Comparable 구현 → OK
// max(Arrays.asList(new Object())); // ❌ Comparable 미구현

// 다중 한정 — 클래스 1개 + 인터페이스 여러 개 (&로 연결)
<T extends Number & Comparable<T> & Serializable>
```

`extends`만 가능하고 `super` 한정은 타입 파라미터에 사용할 수 없습니다(와일드카드에서만).

### 와일드카드와 PECS

| 표기                     | 이름                     | 읽기         | 쓰기           |
| ------------------------ | ------------------------ | ------------ | -------------- |
| `List<?>`                | 비한정 와일드카드        | `Object`로만 | 불가           |
| `List<? extends Number>` | 상한 와일드카드 (공변)   | `Number`로   | 불가           |
| `List<? super Integer>`  | 하한 와일드카드 (반공변) | `Object`로   | `Integer` 가능 |

**PECS (Producer Extends, Consumer Super)** — 값이 들어오면(생산하면) `extends`, 값이 나가면(소비하면) `super`:

```java
// src에서 값을 생산 → extends / dst가 값을 소비 → super
public static <T> void copy(List<? extends T> src, List<? super T> dst) {
    for (T item : src) dst.add(item);
}

// 실전 예: Integer 목록을 Number 목록에 복사
List<Integer> ints = List.of(1, 2, 3);
List<Number> nums = new ArrayList<>();
copy(ints, nums);
```

와일드카드를 쓰지 않고 `List<Number>`에 `List<Integer>`를 대입할 수는 없습니다 — 제네릭은 **불공변(invariant)**이라 `List<Integer>`는 `List<Number>`의 하위 타입이 아니기 때문입니다. 배열은 공변이라 런타임에 `ArrayStoreException`이 날 수 있지만, 리스트는 컴파일 타임에 막힙니다.

### 타입 소거 (Type Erasure)

제네릭 타입 정보는 **컴파일 타임에만 존재**하고, 컴파일 후 바이트코드에서는 소거됩니다(한정 없으면 `Object`, 한정이 있으면 그 상한 타입으로 교체). 이것이 제네릭의 여러 제약의 원인입니다.

| 제약                                                                     | 이유                                           |
| ------------------------------------------------------------------------ | ---------------------------------------------- |
| `new T()` 불가                                                           | 런타임에 T가 뭔지 알 수 없음                   |
| `new T[]` 불가 (제네릭 배열 생성 금지)                                   | 배열은 런타임 타입 검사를 하는데 T 정보가 없음 |
| `instanceof List<String>` 불가                                           | 런타임에 소거됨 (`List` 자체는 가능)           |
| `static` 필드/메서드에 타입 파라미터 사용 불가                           | 인스턴스별 타입인데 static은 공유              |
| 타입 파라미터에 primitive 불가 (`List<int>` ❌)                          | 소거 시 `Object`로 바뀌므로 — `Integer` 사용   |
| 같은 소거 형태의 오버로드 불가 (`f(List<String>)` vs `f(List<Integer>)`) | 바이트코드 시그니처가 동일                     |

```java
// ❌ 제네릭 배열 생성
// List<String>[] arrays = new List<String>[10];

// ✅ 우회: raw 타입 배열 + 억지 캐스팅 (비검사 경고)
@SuppressWarnings("unchecked")
List<String>[] arrays = new List[10];
```

### 런타임에 타입 정보가 필요할 때

```java
// 1. Class 객체를 함께 전달
public static <T> T newInstance(Class<T> clazz) throws Exception {
    return clazz.getDeclaredConstructor().newInstance();
}

// 2. Supplier로 팩토리 전달 (함수형 인터페이스 활용)
public static <T> List<T> fill(int n, Supplier<T> maker) {
    List<T> result = new ArrayList<>();
    for (int i = 0; i < n; i++) result.add(maker.get());
    return result;
}

List<StringBuilder> builders = fill(3, StringBuilder::new);
```

## 두 개념의 결합

### target typing — 같은 람다가 여러 타입으로

람다의 타입은 람다 자체가 아니라 **대상 타입(할당되는 변수·매개변수의 타입)**이 결정합니다.

```java
// 같은 모양의 람다가 상황에 따라 다른 함수형 인터페이스로 해석됨
Callable<String> c = () -> "result";   // call() throws Exception
Supplier<String> s = () -> "result";   // get()

// 제네릭 타입 인자도 대상 타입에서 추론
Function<String, Integer> f = String::length;         // T=String, R=Integer
Comparator<String> cmp = Comparator.comparing(String::length);
```

### 제네릭 함수형 인터페이스 직접 정의

재사용 가능한 변환 규격을 타입 파라미터로 일반화합니다.

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

### 실전 패턴: 제네릭 유틸 + 함수형 인터페이스

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

## 주의사항

```java
// ❌ raw 타입 사용 — 타입 안전성 상실
List list = new ArrayList();
list.add("hello");
list.add(42);

// ✅ 제네릭 명시 또는 <?> (모르는 타입은 비한정 와일드카드)
List<String> names = new ArrayList<>();
List<?> unknown = names;

// ❌ 힙 오염 — varargs에 제네릭을 섞으면 컴파일러 경고
// @SafeVarargs + final/static 메서드에서만 경고 억제 가능
@SafeVarargs
static <T> void safeVarargs(List<T>... lists) { }

// ❌ 매개변수에 매번 제네릭 타입을 강제하는 API
void process(Function<String, String> f) { }

// ✅ 필요 범위만 제네릭화 — 와일드카드로 호출자 유연성 확보
void processAll(Function<? super String, ? extends CharSequence> f) { }
```

## 관련 페이지

- [[concepts/java/java-8-stream-map]] — Stream map/flatMap (함수형 인터페이스의 대표 활용처)
- [[summaries/development/java-debugging]] — Java 실행 및 디버깅
- [[concepts/java/java-ehcache]] — Java 캐싱
