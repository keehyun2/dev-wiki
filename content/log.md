# 위키 작업 로그

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
