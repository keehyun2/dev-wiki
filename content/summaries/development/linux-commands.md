# Linux 필수 명령어

## 파일/디렉토리

### 기본 명령어

```bash
ls -al              # 상세 목록 보기
pwd                 # 현재 경로
cd                  # 디렉토리 이동
mkdir -p            # 하위 디렉토리까지 생성
cp -r               # 디렉토리 복사
mv                  # 이동/이름 변경
rm -rf              # 강제 삭제
tree                # 디렉토리 구조 보기
```

### 심볼릭 링크 (ln)

```bash
ln -s /path/to/original /path/to/link      # 심볼릭 링크 생성
ln -s /absolute/path ./relative-link      # 상대 경로로 링크 생성
ln -sf /new/target existing-link          # 기존 링크 강제 업데이트
ln -s /path/to/original .                  # 현재 디렉토리에 링크 생성
```

**심볼릭 링크 vs 하드링크:**
- 심볼릭 링크 (`ln -s`): 원본 파일을 가리키는 포인터, 원본 삭제시 링크는 깨짐
- 하드링크 (`ln`): 원본과 동일한 데이터를 가리킴, 원본 삭제해도 데이터 유지

### find 명령어

```bash
find . -name "*.cpp"           # 파일 이름 검색
find . -type f                # 파일만 검색
find . -mtime -1              # 1일 이내 수정된 파일
find . -size +100M            # 100MB 이상 파일
```

## 파일 내용 검색 (grep)

### 주요 옵션

```bash
grep              # 기본 검색
grep -r           # 재귀 검색
grep -rn          # 줄 번호 포함 재귀 검색
grep -v           # 제외 검색
grep -E           # 정규표현식 사용
```

### 실전 예제

```bash
grep "ZeroCurve" config.xml           # 파일에서 검색
grep -rn "DiscountCurve" .            # 현재 디렉토리에서 검색
grep -v "^#" config.txt               # 주석 제외
grep -E "error|warning" log.txt       # OR 검색
```

## 디스크 관리

```bash
df -h                    # 디스크 사용량 (human-readable)
du -sh *                 # 현재 디렉토리 사용량
du -sh build             # 특정 디렉토리 사용량
du -h --max-depth=1      # 1단계 깊이로 사용량 확인
```

## 프로세스/포트

### 프로세스 관리

```bash
ps -ef          # 전체 프로세스 보기
top             # 실시간 프로세스 모니터링
htop            # 개선된 top (색상, 마우스 지원)
kill            # 프로세스 종료
kill -9         # 강제 종료
```

### 포트 사용 확인

```bash
lsof -i :8080       # 특정 포트 사용 프로세스
netstat -tulpn      # 모든 포트와 프로세스
ss -tulpn          # 현대적인 netstat 대체
```

## 압축

```bash
tar -xvf file.tar        # tar 압축 해제
tar -czvf dir.tar.gz     # tar.gz 압축
unzip file.zip          # zip 압축 해제
zip -r archive.zip dir   # zip 압축
```

## 시스템 정보

```bash
lscpu                   # CPU 정보
free -h                 # 메모리 정보
uname -a                # OS 정보
cat /etc/os-release     # OS 상세 정보
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
- [[development/git-commands.md]] - Git 명령어
- [[development/docker-commands.md]] - Docker 명령어
