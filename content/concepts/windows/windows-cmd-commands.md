---
title: Windows CMD 명령어
---

# Windows CMD (명령 프롬프트)

**Windows CMD**는 윈도우의 기본 명령줄 인터페이스로, 파일 관리, 시스템 제어, 네트워크 작업 등을 수행합니다.

## 주요 명령어

> 아래 코드 블록의 `#` 주석은 설명을 위한 표기입니다. 실제 cmd에는 `#` 주석이 없으므로 스크립트에서는 `rem` 또는 `::`를 사용합니다 ([배치 파일 기본](#배치-파일-기본) 참고).

### 파일 및 디렉토리
```cmd
dir                  # 현재 디렉토리 내용 보기
cd <path>            # 디렉토리 변경
mkdir <name>         # 디렉토리 생성
rmdir <name>         # 디렉토리 삭제 (빈 디렉토리만)
del <file>           # 파일 삭제
copy <src> <dst>     # 파일 복사
move <src> <dst>     # 파일 이동
type <file>          # 파일 내용 표시
```

### 시스템 관리
```cmd
cls                  # 화면 지우기
tasklist             # 실행 중인 프로세스 목록
taskkill /F /PID <pid>     # 프로세스 강제 종료
ipconfig             # IP 설정 보기
ping <host>          # 네트워크 연결 테스트
shutdown /s /t 0     # 즉시 시스템 종료
```

### 환경 변수
```cmd
set                  # 모든 환경 변수 표시
set VAR=value        # 환경 변수 설정
echo %VAR%           # 변수 값 표시
path                 # PATH 변수 표시
```

## 유용한 패턴

### 파일 검색 및 필터링
```cmd
dir *.txt                    # .txt 파일만 보기
dir /s *.exe                 # 모든 하위 디렉토리에서 .exe 파일 검색
dir /a                       # 숨김 파일 포함 모든 파일 보기
```

### 명령 연결
```cmd
command1 & command2           # 순차 실행 (둘 다 실행)
command1 && command2          # 순차 실행 (첫 번째 성공 시 두 번째 실행)
command1 || command2          # 순차 실행 (첫 번째 실패 시 두 번째 실행)
command1 | command2           # 파이프 (출력을 입력으로 전달)
```

### 출력 리디렉션
```cmd
command > output.txt          # 출력을 파일로 저장 (덮어쓰기)
command >> output.txt         # 출력을 파일에 추가
command < input.txt           # 파일에서 입력 읽기
command 2> error.txt          # 에러 출력을 파일로 저장
```

## 배치 파일 기본

```cmd
@echo off                         # 명령 에코 끄기
echo 메시지                       # 메시지 표시
rem 주석                          # 주석
:: 주석                           # 대체 주석 형식
goto label                        # 레이블로 이동
:label                            # 레이블 정의
if condition command              # 조건부 실행
```

## 실전 예제

### 특정 프로세스 종료
```cmd
# Chrome 프로세스 찾아서 종료
tasklist | findstr "chrome"
taskkill /F /IM chrome.exe
```

### 시스템 정보 보기
```cmd
# 시스템 정보 요약
systeminfo | findstr /C:"OS Name" /C:"OS Version"
```

### 파일 백업
```cmd
# 현재 날짜로 백업 폴더 생성
mkdir backup_%date:~-10,4%%date:~-5,2%%date:~-2,2%
copy *.txt backup_%date:~-10,4%%date:~-5,2%%date:~-2,2%\
```

## 관련 페이지
- [[powershell-commands]] — 더 강력한 PowerShell 대안
- [[linux-commands]] — 리눅스 명령어 비교
