# 위키 작업 로그

## 2026-08-24

### [13:50:00] lint | 전체 문서 검토·수정 — 잘못된 내용·가독성·통일성 보완
- **대상**: summaries/·concepts/ 전체 33개 문서 전수 검토
- **기술적 오류 수정**:
  - sorting-algorithms.md — 셸 정렬 customInsertionSort의 잘못된 for 루프 제거·gap 간격 이동으로 수정, gap 서로소 오역 교정("근사적으로 소수"→"서로소"), ISBN 자릿수 d=1→10, Java 7+ Arrays.sort(Dual-Pivot Quicksort/TimSort) 주석 추가
  - binary-tree.md — 레벨 공식 (d^l-1)(d-1) → (d^l-1)/(d-1), 자식 인덱스 주석 left→right, 루트 경로 예시 12→5→2→1 → →0
  - binary-search-tree.md — "B tree로 균형" 서술을 자가 균형 트리(AVL·레드블랙) 기준으로 교정, 구글 검색 URL 정리
  - heap-priority-queue.md — "first-int"→"first-in", PriorityQueue 인터페이스→클래스, comparTo→compareTo, 회전→교환(sift-up), 한 파일 public class 2개 컴파일 오류 수정, raw type 제네릭 명시
  - bitmask.md — Integer.numberOfTrainingZeros→numberOfTrailingZeros, 2^k-1→2^(N-1), NOT 비트표기·시프트 예시(12→13) 수정, 잘못된 set -= (1<<p) 삭제, 괄호 정리
  - linked-list-stack-queue.md — 큐 "선입선출(LIFO)"→FIFO, toString() 오버라이드 public 누락(컴파일 에러) 수정, 스택 java.util.Deque/ArrayDeque 권장으로 보완
  - coding-test-language-basics.md — nodejs 두 정수 합이 문자열 연결되는 버그(Number 변환 추가), str 변수명 섀도잉 제거
  - java-json-parsing.md — String result 중복 선언 컴파일 오류 수정, RestfulTemplate→RestTemplate
  - java-8-stream-map.md — Java 코드의 `#` 주석 → `//`
  - oracle-sql.md — TOP-N 쿼리 ROWNUM·ORDER BY 순서 버그 → ROW_NUMBER() OVER 방식으로 수정
  - oracle-19c-time-format.md — EXTRACT(HOUR FROM SYSDATE) ORA-30076 오류(TIMESTAMP 캐스팅), TRUNC 'HH24'→'HH', FF3 밀리초 SYSDATE→SYSTIMESTAMP, "반올림"→"버림" 제목 정정
  - totp-google-otp.md — 종료된 chart.googleapis.com QR API 경고 추가, 깨진 이미지 URL 제거
  - nfs-samba-server.md — NFC→NFS 표기 오류 3건
  - docker-usage.md — docker exec가 "컨테이너 생성"이라는 오류 수정
  - eclipse-shortcut.md / ide-shortcut-common-patterns.md — 이클립스 줄 복사 Alt+Shift+↑/↓ → Ctrl+Alt+↑/↓, 줄 이동 Alt+↑/↓로 정정, "동일 키, 다른 순서" 오류 패턴 재분석
- **가독성·통일성**:
  - ide-shortcut-common-patterns.md — "macOS에서는大部分"(중국어 혼입) → "대부분"
  - windows-dev-tips.md — mklink를 powershell→cmd 블록으로 수정(내장 명령·관리자 권한 명시)
  - windows-cmd-commands.md — cmd에 # 주석 없음을 명시하는 노트 추가
  - java-debugging.md "힘프"→"힙", gcd-lcm lcm 오버플로 주의 추가, 다수 오타·조사 교정(std:begin→std::begin, 예방습니다→예방합니다, 온셥→옵션 등)
  - totp·java-nio 등 문서 말미 링크 형식 통일, "참고 자료"→"관련 페이지" 섹션 통일, 제목 앞 빈 줄 9개 파일 정리

## 2026-07-13

### [08:40:00] create | Created summary page: eclipse-tag-selection-shortcut
- **타입**: Summary Page
- **위치**: content/summaries/eclipse-tag-selection-shortcut.md
- **내용**: 이클립스에서 여는태그와 닫는태그를 한번에 선택하는 단축키 (Alt+Shift+A)에 대한 요약
- **소스**: content/sources/eclipse-shortcuts.md

### [08:40:00] create | Created source document: eclipse-shortcuts
- **타입**: Source Document
- **위치**: content/sources/eclipse-shortcuts.md
- **내용**: 이클립스 단축키 전체 가이드 including 태그 선택 관련 단축키

### [08:40:00] create | Initialized wiki structure
- **작업**: content/ 하위 디렉토리 구조 생성 (summaries/, concepts/, explorations/, sources/)
- **업데이트**: index.md, log.md 생성

### [08:42:00] update | Added code formatting shortcut
- **작업**: 자동정렬 단축키 (Ctrl+Shift+F) 추가
- **업데이트 파일**:
  - content/sources/eclipse-shortcuts.md (코드 정렬 섹션 추가)
  - content/summaries/eclipse-tag-selection-shortcut.md (관련 단축키 섹션에 추가)

### [08:45:00] create | Created VSCode shortcuts pages
- **타입**: Summary Page & Source Document
- **생성 파일**:
  - content/summaries/vscode-shortcuts.md
  - content/sources/vscode-shortcuts.md
- **내용**: VSCode 태그 선택(더블 클릭, Alt+Shift+→) 및 자동 정렬(Shift+Alt+F) 단축키
- **업데이트**: index.md에 VSCode 페이지 추가

### [08:50:00] create | Created developer cheat sheet pages from temp.md
- **타입**: Summary Pages & Source Document
- **생성 파일**:
  - content/sources/developers-cheatsheet.md (전체 치트시트)
  - content/summaries/linux-commands.md (Linux 명령어)
  - content/summaries/git-commands.md (Git 명령어)
  - content/summaries/docker-commands.md (Docker 명령어)
  - content/summaries/oracle-sql.md (Oracle SQL 문법)
  - content/summaries/cmake-guide.md (CMake 빌드 가이드)
  - content/summaries/java-debugging.md ( Java 실행/디버깅)
- **내용**: 개발자가 자주 검색하는 명령어와 문법 정리
- **업데이트**: index.md에 7개 페이지 추가

### [08:55:00] reorganize | Reorganized wiki into category folders
- **작업**: summaries/ 하위에 카테고리별 폴더 구조 생성
- **생성된 폴더**:
  - content/summaries/development/ (개발 도구)
  - content/summaries/database/ (데이터베이스)
  - content/summaries/ide/ (IDE 도구)
  - content/summaries/frontend/ (프론트엔드 - 예정)
- **파일 이동**:
  - linux-commands.md, git-commands.md, docker-commands.md, cmake-guide.md, java-debugging.md → development/
  - oracle-sql.md → database/
  - vscode-shortcuts.md, eclipse-tag-selection-shortcut.md → ide/
- **업데이트 파일**:
  - 모든 요약 페이지의 wikilink 경로 업데이트
  - index.md를 카테고리별 구조로 재구성
  - log.md에 재구성 기록 추가

### [09:20:00] create | Created concept page: ide-shortcut-common-patterns
- **타입**: Concept Page
- **위치**: content/concepts/ide-shortcut-common-patterns.md
- **내용**: 이클립스와 VSCode 단축키 공통 패턴 분석 (선택 확장, 수정자 조합, 탐색 패턴)
- **소스**: content/sources/eclipse-shortcuts.md, content/sources/vscode-shortcuts.md
- **업데이트**: index.md에 컨셉 카테고리 및 페이지 추가

## 2026-07-15

### [12:30:00] create | Created summary page: java-nio-file-operations
- **타입**: Summary Page (한국어)
- **위치**: content/summaries/java-nio-file-operations.md
- **내용**: Java NIO 파일 작업 가이드 (Path, Files API, 읽기/쓰기, 디렉토리 순회, Java 버전 차이)
- **소스**: content/sources/java-nio-file-operations.md
- **작업**: 원본 문서를 sources/로 이동하고 한국어 요약본 생성
- **업데이트**: index.md에 Java 카테고리 및 페이지 추가

## 2026-08-04

### [09:15:00] create | Created concept pages from momo.md topics
- **타입**: Concept Pages (Quick Reference/Cheatsheets)
- **생성 파일**:
  - content/concepts/windows-cmd-commands.md (Windows CMD 필수 명령어)
  - content/concepts/powershell-commands.md (PowerShell 필수 명령어)
  - content/concepts/nfs-samba-server.md (NFS 및 Samba 서버 설정)
  - content/concepts/java-8-stream-map.md (Java 8 Stream map 사용법)
  - content/concepts/oracle-19c-time-format.md (Oracle 19c 시간 포맷팅)
  - content/concepts/java-ehcache.md (Java Ehcache 가이드)
- **내용**: 개발 관련 주제들에 대한 빠른 참조용 페이지 생성 (명령어, 설정, 문법)
- **업데이트**: index.md에 Concepts 섹션에 6개 페이지 추가

### [09:45:00] simplify | Simplified concept pages for better readability
- **작업**: 6개 컨셉 페이지를 간결하게 재작성 (정의, 쓰임새, 간단한 예시 중심)
- **수정 파일**:
  - content/concepts/windows-cmd-commands.md (주요 명령어 + 유용한 패턴)
  - content/concepts/powershell-commands.md (핵심 Cmdlets + 파이프라인)
  - content/concepts/nfs-samba-server.md (정의 + 선택 가이드 + 기본 명령어)
  - content/concepts/java-8-stream-map.md (기본 사용법 + 실전 패턴)
  - content/concepts/oracle-19c-time-format.md (기본 포맷 + 실전 패턴)
  - content/concepts/java-ehcache.md (기본 사용법 + 설정 가이드라인)
- **변경사항**: 장황한 내용 제거, 핵심 개념과 예시 중심, 한글과 영어 적절히 혼합

## 2026-08-21

### [10:00:00] create | Created concept page: eclipse-plugin-development
- **타입**: Concept Page
- **위치**: content/concepts/eclipse-plugin-development.md
- **내용**: 이클립스 플러그인 개발 기초 (OSGi 번들 구조, Extension Point, PDE/Target Platform, 주요 확장 포인트, View/Handler 예제, 3.x vs e4, 실행/디버깅, 배포)
- **업데이트**: index.md Concepts 섹션에 페이지 추가

## 2026-08-23

### [11:50:00] ingest | Google Keep 마크다운 백업에서 유용한 문서 15개 위키로 이관
- **소스**: ~/Downloads/markdown-20260823T001406Z-1-001/markdown (2017~2019년 학습 노트)
- **선별 기준**: 미완성(작성중/빈 파일) 제외, 오래된 기술(bower, AngularJS, bintray/jCenter, Selenium 3+IE, Rinkeby) 제외, 민감 정보 포함 문서(사내 시스템, 계정/비밀번호) 제외
- **생성 파일**:
  - content/concepts/sorting-algorithms.md (기본정렬알고리즘 — typo 수정: 기수 정열→정렬, Buket→Bucket)
  - content/concepts/binary-tree.md (Binary Tree)
  - content/concepts/binary-search-tree.md (Binary Search Tree)
  - content/concepts/heap-priority-queue.md (Heap, Priority Queue)
  - content/concepts/linked-list-stack-queue.md (Linked List)
  - content/concepts/bitmask.md (BitMask)
  - content/concepts/algorithm-coding-mistakes.md (알고리즘 문제 해결 전략 정리)
  - content/concepts/gcd-lcm-euclidean.md (gcd/lcm 유클리드 호제법 — 헤딩 구조 조정)
  - content/concepts/coding-test-language-basics.md (입출력 + 반복문/조건문 두 문서를 언어별 비교 형태로 통합)
  - content/concepts/docker-usage.md (Docker 사용법 — boot2docker/docker toolbox 오래된 섹션 제거, 작성 시점 주석 추가)
  - content/concepts/redis-java-client.md (Redis — 사내 관련 문구·URL 제거, khphub.com→127.0.0.1, Windows 설치 안내 WSL2 기준으로 수정)
  - content/concepts/java-json-parsing.md (Json Data Parse in java)
  - content/concepts/totp-google-otp.md (PHP Google OTP — 제목 일반화, 원리 언어 무관 주석 추가)
  - content/concepts/windows-dev-tips.md (Windows Vista 유용한 기능 — 기존 windows-cmd/powershell 페이지와 중복 없는 부분만)
  - content/summaries/database/mysql-query-log.md (Mysql Query log — DB명 일반화)
- **공통 작업**: 각 페이지 말미에 [[wikilink]] 관련 페이지 섹션 추가
- **업데이트**: index.md에 '알고리즘 · 자료구조' 카테고리 신설(9페이지), 데이터베이스·컨셉 섹션에 6페이지 추가

### [12:30:00] restructure | concepts/ 폴더 주제별 분할 + 전체 페이지 한글 제목 부여
- **폴더 분할**: content/concepts/ 하위 22개 파일을 7개 주제 폴더로 이동 (git mv)
  - algorithm/ (9): sorting-algorithms, binary-tree, binary-search-tree, heap-priority-queue, linked-list-stack-queue, bitmask, gcd-lcm-euclidean, algorithm-coding-mistakes, coding-test-language-basics
  - java/ (4): java-8-stream-map, java-ehcache, java-json-parsing, redis-java-client
  - database/ (1): oracle-19c-time-format
  - windows/ (3): windows-cmd-commands, powershell-commands, windows-dev-tips
  - devops/ (2): docker-usage, nfs-samba-server
  - ide/ (2): eclipse-plugin-development, ide-shortcut-common-patterns
  - security/ (1): totp-google-otp
- **한글 제목**: 빌드되는 모든 페이지(38개)에 `title` frontmatter 추가 — 탐색기/검색/브라우저 탭에 한글 표시, 폴더명·파일명은 영문 kebab-case 유지
- **링크 정리**: index.md 카탈로그를 새 폴더 구조에 맞게 재구성(Windows·DevOps·보안 섹션 신설), eclipse-plugin-development.md 내 wikilink 경로 수정
- **가이드라인**: AGENTS.md·CLAUDE.md·wiki-page-creator 스킬의 프론트매터 규칙을 "한글 title 허용"으로 업데이트
