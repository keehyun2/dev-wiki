# PowerShell 명령어

**PowerShell**은 윈도우용 강력한 명령줄 셸과 스크립팅 언어로, 객체 파이프라인과 .NET 통합이 특징입니다.

## 기본 명령 (Cmdlets)

### 파일 작업
```powershell
Get-ChildItem              # 디렉토리 내용 보기 (ls, dir, gci)
Get-Item <path>            # 항목 정보 보기 (gi)
New-Item -Type File <name> # 파일 생성
Remove-Item <file>         # 파일 삭제 (rm, del, ri)
Copy-Item <src> <dst>      # 파일 복사 (cp, copy)
Move-Item <src> <dst>      # 파일 이동 (mv, move)
Get-Content <file>         # 파일 내용 읽기 (cat, gc)
Set-Content <file>         # 파일에 쓰기 (sc)
```

### 프로세스 관리
```powershell
Get-Process                # 프로세스 목록 (ps, gps)
Get-Process <name>         # 특정 프로세스 정보
Stop-Process -Name <name>  # 프로세스 종료 (kill)
Start-Process <app>        # 프로그램 시작
```

### 시스템 정보
```powershell
Get-Service                # 서비스 목록
Start-Service <name>       # 서비스 시작
Stop-Service <name>        # 서비스 중지
Get-EventLog -Log Application  # 이벤트 로그
Get-ComputerInfo           # 시스템 전체 정보
```

### 네트워크
```powershell
Get-NetIPAddress           # IP 주소 보기
Test-Connection <host>     # 핑 테스트
Resolve-DnsName <host>     # DNS 조회
```

## 파이프라인 (Pipeline)

### 필터링 및 변환
```powershell
# 프로세스 필터링
Get-Process | Where-Object {$_.CPU -gt 10}     # CPU 10 이상
Get-Service | Where-Object {$_.Status -eq "Running"}  # 실행 중인 서비스

# 파일 조작
Get-ChildItem | Where-Object {$_.Length -gt 1MB}      # 1MB 이상 파일
Get-ChildItem | Select-Object Name, Length           # 속성 선택
Get-ChildItem | Sort-Object Length -Descending       # 크기순 정렬

# 프로세스 관리
Get-Process | Stop-Process                          # 모든 프로세스 종료
Get-Process chrome | Stop-Process                   # Chrome 종료
```

## 변수 및 데이터 타입

### 기본 변수
```powershell
$var = "value"              # 변수 할당
${var-with-dash} = "test"   # 특수 문자 포함 변수
$null                       # 널 값
$true, $false               # 불리언
```

### 문자열
```powershell
$name = "World"
"Hello $name"               # 문자열 보간 (출력: Hello World)
'Hello $name'               # 리터럴 (출력: Hello $name)
$string.ToUpper()           # 대문자 변환
$string.Split(',')          # 문자열 분리
$string.Replace('old', 'new')  # 문자열 치환
$string.Length              # 문자열 길이
```

### 배열 및 해시테이블
```powershell
$arr = 1, 2, 3, 4           # 배열
$arr[0]                      # 첫 번째 요소
$arr[-1]                     # 마지막 요소

$hash = @{Name = "John"; Age = 30}  # 해시테이블
$hash["Name"]                # 키로 접근
$hash.Name                   # 속성으로 접근
```

## 제어 흐름

### 조건문
```powershell
if ($condition) {
    # 코드
} elseif ($condition2) {
    # 코드
} else {
    # 코드
}

switch ($var) {
    "value1" { "Action 1" }
    "value2" { "Action 2" }
    default { "Default" }
}
```

### 반복문
```powershell
for ($i = 0; $i -lt 10; $i++) { }      # for 루프
foreach ($item in $collection) { }     # foreach 루프
while ($condition) { }                  # while 루프
```

## 유용한 패턴

### 파일 시스템
```powershell
# 모든 .txt 파일 찾기
Get-ChildItem -Recurse -Filter "*.txt"

# 파일 크기 합계
Get-ChildItem | Measure-Object -Property Length -Sum

# 7일 이상된 파일 삭제
Get-ChildItem | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-7)} | Remove-Item
```

### 레지스트리
```powershell
cd HKLM:\                    # 레지스트리로 이동
Get-ChildItem                # 레지스트리 키 목록
Get-ItemProperty             # 레지스트리 값 읽기
Set-ItemProperty             # 레지스트리 값 설정
```

## 관련 페이지
- [[windows-cmd-commands]] — 기본 CMD 명령어
- [[linux-commands]] — 리눅스 명령어
