---
title: Java 제네릭
---

**제네릭(Generics)**은 컴파일 타임에 타입을 파라미터화해 타입 안전성을 보장하는 기법으로, 컬렉션(`List<T>`)과 [[concepts/java/java-functional-interface|함수형 인터페이스]](`Function<T,R>`)의 기반이 됩니다.

## 기본 문법

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

## bounded type parameter (타입 한정)

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

## 와일드카드와 PECS

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

## 타입 소거 (Type Erasure)

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

## 런타임에 타입 정보가 필요할 때

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

- [[concepts/java/java-functional-interface]] — 함수형 인터페이스와 람다 (`Function<T,R>`가 제네릭 기반)
- [[concepts/java/java-8-stream-map]] — Stream map/flatMap (`Stream<T>` 제네릭 활용)
