# Java NIO 파일 작업

Java NIO 파일 I/O 작업을 위한 `java.nio.file.Path`와 `java.nio.file.Files` API 사용 가이드

## 핵심 개념

### Path 생성과 해결

**Path 생성 메서드:**
- `Paths.get("path/to/file")` — Java 7+
- `Path.of("path/to/file")` — Java 11+ (Paths.get()의 축약형)

**일반적인 Path 작업:**
```java
Path p1 = Paths.get("some/folder/file.txt");
Path resolved = p1.resolve("child.txt");   // 경로에 추가
Path parent = p1.getParent();              // 상위 디렉토리 가져오기
Path fileName = p1.getFileName();          // 파일명만 가져오기
Path abs = p1.toAbsolutePath();            // 절대 경로로 변환
Path normalized = p1.normalize();          // "."과 ".." 세그먼트 정리
```

### 파일 존재 여부와 유형 확인

```java
Files.exists(path)           // 파일 존재
Files.notExists(path)        // 파일 없음
Files.isDirectory(path)      // 디렉토리 확인
Files.isRegularFile(path)    // 일반 파일 확인
```

## 파일 생성

### 디렉토리 생성
```java
Files.createDirectory(path)    // 단일 레벨, 상위 없으면 예외
Files.createDirectories(path)  // 필요한 상위 디렉토리 생성, 가장 안전한 옵션
```

### 파일 생성
```java
Files.createFile(path)  // 빈 파일 생성, 존재하면 FileAlreadyExistsException 발생
```

**모범 사례:** 먼저 존재 여부를 확인하거나 예외를 적절히 처리

## 파일 읽기

### Java 11+ (가장 간단)
```java
String content = Files.readString(path);  // 전체 파일을 String으로 읽기
```

### Java 8+ (호환성)
```java
String content = new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
List<String> lines = Files.readAllLines(path);  // List<String>로 읽기
```

### 대용량 파일 (스트림 기반)
```java
try (Stream<String> lines = Files.lines(path)) {
    lines.forEach(System.out::println);
}
```

## 파일 쓰기

### Java 11+
```java
Files.writeString(path, "content");  // 기존 파일 덮어쓰기

// 추가 모드
Files.writeString(path, "content", 
    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
```

### Java 8+
```java
Files.write(path, content.getBytes(StandardCharsets.UTF_8));
Files.write(path, linesList, StandardOpenOption.CREATE);
```

## 파일 작업

### 복사/이동/삭제
```java
Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING);
Files.move(src, dest, StandardCopyOption.REPLACE_EXISTING);
Files.delete(path);           // 파일 없으면 예외 발생
Files.deleteIfExists(path);   // 없으면 false 반환, 더 안전
```

## 디렉토리 순회

### 디렉토리 목록 (단일 레벨)
```java
try (Stream<Path> stream = Files.list(dir)) {
    stream.forEach(System.out::println);
}
```

### 재귀적 탐색
```java
try (Stream<Path> stream = Files.walk(dir)) {
    stream.filter(Files::isRegularFile)
          .forEach(System.out::println);
}
```

### 패턴으로 검색
```java
try (Stream<Path> stream = Files.find(dir, Integer.MAX_VALUE,
        (p, attr) -> p.toString().endsWith(".txt"))) {
    stream.forEach(System.out::println);
}
```

## 파일 정보

```java
long size = Files.size(path);                    // 파일 크기 (바이트)
FileTime modified = Files.getLastModifiedTime(path);  // 마지막 수정 타임스탬프
```

## Java 버전 차이

### Java 11+ 주요 추가 기능
- `Path.of()` — `Paths.get()`의 축약형
- `Files.readString()` — 직접 문자열 읽기
- `Files.writeString()` — 직접 문자열 쓰기

### Java 8 호환성
- `Path.of()` 대신 `Paths.get()` 사용
- 텍스트 읽기에 `Files.readAllBytes()` + `new String()` 사용
- 텍스트 쓰기에 `Files.write()`와 바이트 배열 사용

## 모범 사례

1. **리소스 관리:** 스트림은 항상 try-with-resources 사용
   ```java
   try (Stream<String> lines = Files.lines(path)) {
       // 라인 처리
   }
   ```

2. **예외 처리:** 예외 발생 메서드 vs 안전한 메서드 선택
   - `Files.createFile()`은 존재하면 예외 → 먼저 `Files.exists()` 확인
   - `Files.delete()`는 없으면 예외 → `Files.deleteIfExists()` 사용

3. **인코딩:** 텍스트 파일은 항상 문자 인코딩 지정
   ```java
   Files.readString(path, StandardCharsets.UTF_8)
   ```

4. **옵션:** 쓰기 동작 제어를 위해 `StandardOpenOption` 사용
   - `CREATE` — 없으면 생성
   - `APPEND` — 기존 파일에 추가
   - `TRUNCATE_EXISTING` — 기존 내용 덮어쓰기

## 참고 자료

- [[summaries/ide/eclipse-shortcut]] — 이클립스 단축키
- [[summaries/development/java-debugging]] — Java 디버깅
