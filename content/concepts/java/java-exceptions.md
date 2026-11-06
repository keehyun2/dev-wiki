---
title: Java 주요 예외 정리
---

Java 예외는 `Throwable`을 최상위로 하는 계층 구조이며, 컴파일러가 처리를 강제하는 **Checked Exception**과 런타임에 발생하는 **Unchecked Exception**(RuntimeException 계열)으로 나뉩니다. 실무에서 자주 만나는 예외들을 발생 상황·처리 방법과 함께 정리합니다.

## 예외 계층 구조

```
Throwable
├── Error                        // 시스템 레벨 — 잡지 말 것 (OutOfMemoryError, StackOverflowError)
└── Exception
    ├── RuntimeException         // Unchecked — throws 선언 불필요
    │   ├── NullPointerException
    │   ├── IllegalArgumentException
    │   │   └── NumberFormatException
    │   ├── IllegalStateException
    │   ├── ClassCastException
    │   ├── IndexOutOfBoundsException
    │   │   ├── ArrayIndexOutOfBoundsException
    │   │   └── StringIndexOutOfBoundsException
    │   ├── ArithmeticException
    │   ├── ConcurrentModificationException
    │   ├── UnsupportedOperationException
    │   └── NoSuchElementException
    └── 그 외 Exception (Checked) // try-catch 또는 throws 필수
        ├── IOException
        ├── SQLException
        ├── ClassNotFoundException
        ├── InterruptedException
        └── ParseException (java.text)
```

## Checked vs Unchecked

| 구분          | Checked Exception                                         | Unchecked Exception (RuntimeException)                             |
| ------------- | --------------------------------------------------------- | ------------------------------------------------------------------ |
| 처리 강제     | 컴파일러가 `try-catch` 또는 `throws` 강제                 | 선언 없이 전파, 필요시에만 catch                                   |
| 발생 시점     | 컴파일 후에도 외부 환경에 의존 (파일 없음, 네트워크 단절) | 주로 개발자 실수·논리 오류                                         |
| 롤백 (Spring) | 기본적으로 트랜잭션 롤백 안 함                            | 기본적으로 롤백                                                    |
| 대표 예       | `IOException`, `SQLException`                             | `NullPointerException`, `IllegalArgumentException`                 |
| 커스텀 예외   | 복구 가능한 도메인 로직에 사용                            | 비즈니스 예외에 권장 (ex. `BizException extends RuntimeException`) |

## 자주 만나는 RuntimeException

| 예외                              | 발생 상황                         | 예시                                             |
| --------------------------------- | --------------------------------- | ------------------------------------------------ |
| `NullPointerException`            | null 참조에 필드 접근·메서드 호출 | `String s = null; s.length();`                   |
| `ArrayIndexOutOfBoundsException`  | 배열 범위 밖 인덱스 접근          | `arr[arr.length]`                                |
| `StringIndexOutOfBoundsException` | 문자열 범위 밖 인덱스             | `str.charAt(str.length())`                       |
| `ClassCastException`              | 호환되지 않는 타입으로 캐스팅     | `(String) obj` (obj가 Integer)                   |
| `NumberFormatException`           | 문자열 → 숫자 변환 실패           | `Integer.parseInt("12a")`                        |
| `IllegalArgumentException`        | 메서드 인자가 부적합              | 파라미터 검증 실패                               |
| `IllegalStateException`           | 객체 상태가 요청 처리에 부적합    | 닫힌 stream에 다시 접근                          |
| `ArithmeticException`             | 산술 연산 오류                    | 정수 `10 / 0` (실수 나눗셈은 Infinity)           |
| `ConcurrentModificationException` | 순회 중 컬렉션 구조 변경          | for-each 중 `list.remove()`                      |
| `UnsupportedOperationException`   | 지원하지 않는 연산 호출           | `Arrays.asList()` 결과에 `add()`                 |
| `NoSuchElementException`          | 존재하지 않는 요소 조회           | 빈 `Optional.get()`, `Iterator.next()` 초과 호출 |

### NullPointerException — 가장 빈번

```java
// 발생: 참조 대상이 null
String name = map.get("key").trim();

// 예방 1: 사전 검사
String v = map.get("key");
if (v != null) System.out.println(v.trim());

// 예방 2: Objects 유틸
Objects.requireNonNull(value, "value는 필수입니다");

// 예방 3: Optional 사용
Optional.ofNullable(map.get("key")).map(String::trim).orElse("");
```

### NumberFormatException — 파싱 실패

```java
try {
    int num = Integer.parseInt(input.trim());
} catch (NumberFormatException e) {
    // input이 숫자가 아님 — 사용자 입력 검증은 사전에 정규식 권장
    if (!input.matches("-?\\d+")) { ... }
}
```

### ConcurrentModificationException — 순회 중 수정

```java
// 발생: for-each 순회 중 remove
for (String s : list) { if (...) list.remove(s); }

// 해결 1: Iterator의 remove 사용
Iterator<String> it = list.iterator();
while (it.hasNext()) { if (...) it.remove(); }

// 해결 2: removeIf (Java 8+)
list.removeIf(s -> 조건);
```

## 자주 만나는 Checked Exception

| 예외                     | 발생 상황                                  | 처리 포인트                                             |
| ------------------------ | ------------------------------------------ | ------------------------------------------------------- |
| `IOException`            | I/O 작업 실패 (최상위, 다양한 하위 클래스) | 자원 해제와 함께 처리                                   |
| `FileNotFoundException`  | 파일이 존재하지 않음 (`IOException` 하위)  | 경로·권한 확인                                          |
| `SQLException`           | DB 접근 오류 (SQL 문법, 제약조건 위반)     | errorCode로 원인 구분                                   |
| `ClassNotFoundException` | 런타임에 클래스 로드 실패                  | 리플렉션·드라이버 로딩 시                               |
| `InterruptedException`   | 대기 중인 스레드에 interrupt               | catch 후 `Thread.currentThread().interrupt()` 복원 권장 |
| `ParseException`         | 날짜 포맷 파싱 실패 (`SimpleDateFormat`)   | 포맷 문자열·로케일 확인                                 |
| `MalformedURLException`  | URL 형식 오류 (`IOException` 하위)         | URL 조립 로직 점검                                      |

파일·스트림 다룰 때는 `try-with-resources`로 자동 close를 함께 사용합니다.

```java
try (BufferedReader br = Files.newBufferedReader(Paths.get("data.txt"))) {
    br.lines().forEach(System.out::println);
} catch (IOException e) {
    log.error("파일 읽기 실패: {}", e.getMessage(), e);
}
```

## JSON 파싱 예외 (라이브러리별)

JSON 라이브러리마다 예외 클래스와 checked 여부가 다릅니다.

| 라이브러리          | 예외 클래스                                  | 상속 구조                 | Checked 여부 |
| ------------------- | -------------------------------------------- | ------------------------- | ------------ |
| gson                | `JsonParseException`                         | `RuntimeException`        | Unchecked    |
| Jackson             | `JsonProcessingException`                    | `IOException`             | Checked      |
| Jackson (하위)      | `JsonParseException`, `JsonMappingException` | `JsonProcessingException` | Checked      |
| org.json            | `JSONException`                              | `Exception`               | Checked      |
| Spring RestTemplate | `RestClientException`                        | `RuntimeException`        | Unchecked    |

```java
// gson — unchecked라 throws 없이도 컴파일 되지만, 실패 시 런타임에 터짐
Gson gson = new Gson();
try {
    Vo vo = gson.fromJson(jsonString, Vo.class);   // malformed JSON → JsonParseException
} catch (JsonParseException e) {
    log.error("JSON 파싱 실패", e);
}

// Jackson — checked이므로 반드시 처리 (JsonProcessingException extends IOException)
ObjectMapper mapper = new ObjectMapper();
try {
    Vo vo = mapper.readValue(json, Vo.class);
} catch (JsonProcessingException e) {
    log.error("JSON 직렬화/역직렬화 실패", e);
}
```

Jackson에서 `JsonParseException`은 "문법이 틀린 JSON"을, `JsonMappingException`은 "JSON 구조와 대상 클래스가 불일치"를 의미합니다. gson의 `fromJson`은 JSON이 아예 비어있으면(`""`) `null`을 반환하고, 잘못된 문법이면 `JsonParseException`을 던지므로 null 체크도 함께 필요합니다.

## 예외 처리 베스트 프랙티스

1. **예외를 삼키지 않는다** — 빈 `catch` 블록이나 `e.printStackTrace()`만 있는 코드 금지. 로거로 최소한 메시지·스택트레이스를 남긴다.
2. **구체적인 예외를 catch한다** — `catch (Exception e)` 남발 대신 예상되는 예외 타입을 명시하고, 예외별로 다르게 복구한다.
3. **catch 후 재던질 때는 원인을 유지한다** — `throw new ServiceException("처리 실패", e);` 처럼 cause를 넘겨야 스택트레이스가 이어진다 (`e` 누락 시 원인 추적 불가).
4. **반복 로깅-재던짐 금지** — 각 계층에서 같은 예외를 로깅하고 다시 던지면 로그가 중복·노이즈가 된다. 로깅은 최종 처리 지점 한 곳에서.
5. **커스텀 비즈니스 예외는 RuntimeException 상속** — 서비스 코드 곳곳에 `throws`를 도배하지 않고, Spring 트랜잭션 롤백 기본 동작과도 일치한다.
6. **흐름 제어에 예외를 사용하지 않는다** — 예외 생성은 스택트레이스 캡처 비용이 크다. 반복문 탈출 등은 조건문으로.

```java
// 커스텀 예외 예시
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) { super(message); }
}
```

## 관련 문서

- [[concepts/java/java-json-parsing]] — JSON 파싱 (gson + commons-io, RestTemplate)
- [[summaries/java-nio-file-operations]] — Java NIO 파일 작업 (IOException 계열 발생 지점)
- [[summaries/development/java-debugging]] — Java 디버깅 (jstack, JVM 옵션)
- [[concepts/java/java-8-stream-map]] — Stream map/flatMap (NoSuchElementException 발생 케이스)
