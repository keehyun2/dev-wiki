# Java 실행 및 디버깅

## 환경 확인

```bash
java -version               # Java 버전
javac -version              # 컴파일러 버전
echo $JAVA_HOME             # JAVA_HOME 경로
which java                  # Java 설치 위치
```

## 실행

### JAR 실행

```bash
java -jar app.jar                    # 기본 실행
java -jar app.jar --server.port=8080  # 인자 전달
```

### JVM 옵션

```bash
# 메모리 설정
java -Xms512m -Xmx2g -jar app.jar

# GC 설정
java -XX:+UseG1GC -jar app.jar

# 디버깅 모드
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 -jar app.jar
```

## 프로세스 관리

### Java 프로세스 확인

```bash
jps                  # Java 프로세스 목록
jps -l              # 메인 클래스와 인자 포함
jps -v              # JVM 인자 포함
```

### 스레드 덤프

```bash
jstack <pid>                    # 스레드 덤프
jstack -l <pid>                 # Lock 정보 포함
jstack <pid> > thread_dump.txt  # 파일로 저장
```

### 힘프 덤프

```bash
jmap -dump:format=b,file=heap.hprof <pid>
jmap -histo:live <pid>          # 라이브 객체 히스토그램
```

## Maven/Gradle

### Maven

```bash
mvn clean install              # 빌드 및 로컬 저장소에 설치
mvn clean package              # JAR 생성
mvn dependency:tree           # 의존성 트리
mvn spring-boot:run           # Spring Boot 실행
```

### Gradle

```bash
./gradlew build               # 빌드
./gradlew test                # 테스트 실행
./gradlew bootRun             # Spring Boot 실행
./gradlew dependencies        # 의존성 확인
```

## 문제 해결

### 포트 충돌 확인

```bash
lsof -i :8080                 # 포트 사용 프로세스
netstat -tulpn | grep 8080    # Linux
```

### 메모리 부족

```bash
# 힙 메모리 증가
java -Xmx4g -jar app.jar

# PermGen/Metaspace 증가
java -XX:MaxMetaspaceSize=512m -jar app.jar
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
- [[development/linux-commands.md]] - Linux 명령어
- [[development/docker-commands.md]] - Docker 명령어
