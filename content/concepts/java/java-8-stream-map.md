---
title: Java 8 Stream map 사용법
---

# Java 8 Stream map 사용법

**Stream map()**은 Java 8에서 컬렉션 요소를 변환하는 핵심 메서드로, 함수형 프로그래밍 스타일의 데이터 처리를 제공합니다.

## 기본 map() 사용

### 요소 변환
```java
// 문자열 대문자 변환
List<String> names = Arrays.asList("john", "jane", "bob");
List<String> upperNames = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// 결과: ["JOHN", "JANE", "BOB"]

// 문자열 길이 추출
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
// 결과: [4, 4, 3]

// 숫자 변환
List<String> numbers = Arrays.asList("1", "2", "3");
List<Integer> ints = numbers.stream()
    .map(Integer::parseInt)
    .collect(Collectors.toList());
```

### 객체 속성 추출
```java
class User {
    String name;
    int age;
    // getters...
}

List<User> users = getUsers();
List<String> names = users.stream()
    .map(User::getName)
    .collect(Collectors.toList());
```

## flatMap() 사용

### 리스트 평탄화
```java
// 중첩 리스트를 단일 리스트로 변환
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4)
);

List<Integer> flattened = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
// 결과: [1, 2, 3, 4]
```

### 문자열 분리
```java
// 문장을 단어 단위로 분리
List<String> sentences = Arrays.asList("Hello world", "Java streams");

List<String> words = sentences.stream()
    .flatMap(sentence -> Arrays.stream(sentence.split(" ")))
    .collect(Collectors.toList());
// 결과: ["Hello", "world", "Java", "streams"]
```

## map() vs flatMap()

### 차이점
```java
// map(): 1:1 변환
Stream<X> → map(function) → Stream<Y>

// flatMap(): 1:N 변환 + 평탄화
Stream<X> → flatMap(function) → Stream<Y>

// 예시
List<String> words = Arrays.asList("hello", "world");

// map: Stream<String[]> 반환
words.stream().map(w -> w.split(""));  // [['h','e','l','l','o'], ['w','o','r','l','d']]

// flatMap: Stream<String> 반환 (평탄화됨)
words.stream().flatMap(w -> Arrays.stream(w.split("")));  // 'h','e','l','l','o','w','o','r','l','d'
```

## 실전 패턴

### 데이터 변환
```java
// DTO 변환
List<UserDTO> dtos = users.stream()
    .map(user -> new UserDTO(user.getId(), user.getName()))
    .collect(Collectors.toList());

// 맵 변환
Map<String, Integer> nameToAge = users.stream()
    .collect(Collectors.toMap(User::getName, User::getAge));
```

### 체이닝과 필터링
```java
// 변환 후 필터링
List<String> result = text.stream()
    .map(String::toUpperCase)         // 대문자 변환
    .filter(s -> s.length() > 5)     # 길이 5 초과 필터링
    .collect(Collectors.toList());

// 중복 제거
List<String> unique = users.stream()
    .map(User::getDepartment)
    .distinct()
    .collect(Collectors.toList());
```

## 성능 고려사항

### 프리미티브 스트림
```java
// boxing 오버헤드 방지
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

int sum = numbers.stream()
    .mapToInt(Integer::intValue)  // IntStream으로 변환
    .sum();
```

### 지연 연산
```java
// 스트림은 지연 연산
List<String> result = bigList.stream()
    .map(String::toUpperCase)      // 아직 실행되지 않음
    .filter(s -> s.startsWith("A"))  // 아직 실행되지 않음
    .limit(10)                       // 첫 10개만 처리
    .collect(Collectors.toList());   // 여기서 실행됨
```

## 주의사항

### 일반적인 실수
```java
// ❌ 소스 수정 시도
list.stream().forEach(s -> list.remove(s));  // ConcurrentModificationException

// ✅ 새 컬렉션 생성
List<String> result = list.stream()
    .filter(s -> !s.equals("target"))
    .collect(Collectors.toList());

// ❌ 사이드 이펙트
List<String> result = new ArrayList<>();
list.stream().map(s -> { result.add(s); return s; })  // 피해야 할 패턴

// ✅ 순수 함수 사용
List<String> result = list.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
```

## 관련 페이지
- [[java-debugging]] — Java 디버깅
- [[java-ehcache]] — Java 캐싱
