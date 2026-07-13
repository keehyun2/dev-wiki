# 개발자 치트시트

> 개발자라면 의외로 이해를 못해서 검색하는 게 아니라, 기억할 필요가 없는 것들을 반복 검색하는 경우가 많습니다. 매번 검색하는 것 위주로 정리한 치트시트입니다.

---

## 1. Linux 명령어 (가장 많이 검색)

### 파일/디렉토리

```bash
ls -al
pwd
cd
mkdir -p
cp -r
mv
rm -rf
find . -name "*.xml"
locate
tree
```

### find 예제

```bash
find . -name "*.cpp"
find . -type f
find . -mtime -1
find . -size +100M
```

### 파일 내용 검색

```bash
grep
grep -r
grep -rn
grep -v
grep -E
```

**예제**

```bash
grep "ZeroCurve" config.xml
grep -rn "DiscountCurve" .
grep -v "^#"
```

### 디스크

```bash
df -h
du -sh *
du -sh build
du -h --max-depth=1
```

### 프로세스

```bash
ps -ef
top
htop
kill
kill -9
```

**포트 사용 확인**

```bash
lsof -i :8080
netstat -tulpn
ss -tulpn
```

### 압축

```bash
tar -xvf
tar -czvf
unzip
zip -r
```

---

## 2. Git (엄청 자주 검색)

### 상태

```bash
git status
git diff
git log
git log --oneline
```

### 브랜치

```bash
git branch
git checkout
git switch
git merge
```

### 되돌리기

```bash
git restore
git reset
git revert
```

### Stash

```bash
git stash
git stash pop
git stash list
```

### Submodule

```bash
git clone --recursive
git submodule update --init --recursive
```

---

## 3. Docker

```bash
docker ps
docker images
docker exec -it
docker logs
docker build
docker run
```

### 컨테이너 삭제

```bash
docker rm
docker stop
docker system prune
```

---

## 4. CMake (C++ 개발)

### 설정

```bash
cmake ..
cmake -B build
cmake --build build
```

### Debug

```bash
cmake .. -DCMAKE_BUILD_TYPE=Debug
```

### Release

```bash
cmake .. -DCMAKE_BUILD_TYPE=Release
```

### 캐시 삭제

```bash
rm -rf build
cmake --fresh
```

---

## 5. GDB

```bash
gdb
run
bt
break
next
step
continue
print
info locals
```

---

## 6. SSH

### 접속

```bash
ssh user@host
```

### 파일 복사

```bash
scp file user@host:/tmp
```

### 폴더

```bash
scp -r
```

---

## 7. 네트워크

### 핑

```bash
ping
```

### DNS

```bash
nslookup
dig
```

### HTTP 확인

```bash
curl
wget
```

---

## 8. Java

### 환경변수

```bash
java -version
javac -version
echo $JAVA_HOME
```

### Jar 실행

```bash
java -jar app.jar
```

### 프로세스

```bash
jps
jstack
jmap
```

---

## 9. Maven / Gradle

```bash
mvn clean install
mvn dependency:tree
./gradlew build
./gradlew test
```

---

## 10. Oracle SQL

### DDL

```sql
CREATE TABLE
ALTER TABLE
DROP TABLE
```

### 조회

```sql
ROW_NUMBER()
MERGE
WITH
CONNECT BY
LISTAGG
```

### 날짜

```sql
SYSDATE
ADD_MONTHS
TRUNC
TO_DATE
TO_CHAR
```

---

## 11. Vim

```bash
i
ESC
:w
:q
:wq
:q!
dd
yy
p
u
/
```

---

## 12. Bash

### 변수

```bash
export
echo
source
```

### 권한

```bash
chmod
chown
```

### 실행

```bash
./script.sh
```

---

## 13. 시스템 확인

### CPU

```bash
lscpu
```

### 메모리

```bash
free -h
```

### OS

```bash
uname -a
cat /etc/os-release
```

---

## 14. 개발자가 정말 자주 검색하는 것

- 정규표현식(Regex)
- cron 표현식
- Markdown 문법
- sed / awk
- jq(JSON 처리)
- openssl
- base64 인코딩/디코딩
- UUID 생성
- SHA256, MD5 계산
- curl 옵션(`-X`, `-H`, `-d`, `-F`)
- tar 옵션(`-xvf`, `-czvf`)
- find 옵션(`-mtime`, `-size`, `-exec`)
- grep 옵션(`-r`, `-n`, `-E`, `-v`)
- chmod 권한(755, 644)
- crontab 작성법

---

## 금융/백엔드 개발자 추가 추천

Oracle, Java 8, Spring 4.3, Git, ORE(Open Source Risk Engine), WSL, CMake, Docker를 자주 다룬다면 다음 내용을 함께 정리해두면 활용도가 높습니다:

- Oracle SQL 문법 (`MERGE`, `WITH`, `ROW_NUMBER`, `LISTAGG`, 날짜 함수)
- Git 치트시트 (reset, restore, revert 차이)
- CMake 빌드 옵션 (`Debug`, `Release`, 캐시 삭제)
- WSL 관리 (`wsl --status`, `wsl -l -v`, 종료/재시작)
- Docker 자주 쓰는 명령어
- `curl`을 이용한 REST API 호출 예제
- Java 실행/디버깅 명령어 (`jps`, `jstack`, JVM 옵션)
- `grep`, `find`, `sed`, `awk`, `jq` 실전 예제
- `vi`/`vim` 기본 조작법
