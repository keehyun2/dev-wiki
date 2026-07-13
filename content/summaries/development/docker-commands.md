# Docker 필수 명령어

## 기본 명령어

### 컨테이너/이미지 관리

```bash
docker ps              # 실행 중인 컨테이너
docker ps -a           # 모든 컨테이너
docker images          # 이미지 목록
docker build -t app .  # 이미지 빌드
docker run app         # 컨테이너 실행
```

### 컨테이너 조작

```bash
docker exec -it container bash   # 컨테이너 접속
docker logs container            # 로그 보기
docker logs -f container         # 실시간 로그
docker stop container            # 컨테이너 중지
docker start container           # 컨테이너 시작
```

## 정리

```bash
docker rm container              # 컨테이너 삭제
docker rmi image                 # 이미지 삭제
docker system prune              # 미사용 리소스 정리
docker system prune -a          # 모든 미사용 리소스 정리
docker volume prune             # 미사용 볼륨 정리
```

## 자주 쓰는 패턴

### 백그라운드 실행

```bash
docker run -d -p 8080:8080 app
```

### 환경변수 전달

```bash
docker run -e NODE_ENV=production app
```

### 볼륨 마운트

```bash
docker run -v /host/path:/container/path app
```

### 네트워크

```bash
docker network create mynet
docker run --network mynet app
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
- [[development/linux-commands.md]] - Linux 명령어
