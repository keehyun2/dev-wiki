# CMake 빌드 가이드

## 기본 빌드

### 최신 방식 (권장)

```bash
cmake -B build              # build 디렉토리에 설정 생성
cmake --build build         # 빌드 실행
```

### 전통적 방식

```bash
mkdir build && cd build
cmake ..
make
```

## 빌드 타입

### Debug 빌드

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Debug
```

- 디버깅 정보 포함
- 최적화 없음
- 개발 단계에서 사용

### Release 빌드

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
```

- 최적화된 코드
- 디버깅 정보 최소화
- 배포용

## 캐시 관리

### 빌드 캐시 삭제

```bash
rm -rf build                 # build 디렉토리 전체 삭제
```

### CMake 캐시 삭제

```bash
cmake --fresh                # 최신 CMake (3.24+)
rm CMakeCache.txt            # 전통적 방식
```

## 자주 쓰는 옵션

```bash
-DCMAKE_BUILD_TYPE=Debug
-DCMAKE_INSTALL_PREFIX=/usr/local
-DCMAKE_CXX_STANDARD=17
-DBUILD_TESTING=ON
```

## 자주 쓰는 패턴

### clean 후 재빌드

```bash
rm -rf build && cmake -B build && cmake --build build
```

### verbose 출력

```bash
cmake --build build --verbose
```

### 병렬 빌드

```bash
cmake --build build -j4
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
- [[development/linux-commands.md]] - Linux 명령어
