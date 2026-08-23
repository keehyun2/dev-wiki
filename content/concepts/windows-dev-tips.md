# Windows 개발 팁 (tail, 심볼릭 링크, 배치)

Windows에서 Linux 스타일 작업을 해야 할 때 유용한 기능들입니다.

## 로그 파일 실시간 모니터링 (tail)

Windows에서 Linux의 **tail** 명령어처럼 log를 모니터링하는 방법입니다. **powershell**에서 아래와 같은 명령어로 tail의 기능을 사용할 수 있습니다.

```powershell
Get-Content [로그파일] -Wait -Tail 1000
```

## 폴더 링크 (심볼릭 링크)

Linux의 **symbolic link** 기능을 Windows의 바로가기로 따라할 수는 있지만 개발할 때 경로 지정 등에는 사용할 수 없습니다. 아래와 같은 명령어로 link를 만들 수 있습니다.

```powershell
mklink /d "C:\WINDOWS\system32\config\systemprofile\.m2" "C:\Users\user\.m2"
```

## Batch 유용한 기능

### 파일 삭제

다음 명령어를 실행하면 현재 위치의 폴더 내부를 모두 검색하여 파일명에 2017, 2016을 포함하는 경우 삭제합니다. `/s`는 폴더 내부에 있는 파일까지 삭제하는 옵션입니다.

```vb
del /s "*2017*" "*2016*"
```

### 폴더의 tree 구조 확인

폴더의 트리 구조를 text 형태로 출력합니다. `/f` 옵션은 각 폴더에 있는 파일명까지 출력합니다.

```vb
tree /f
```

## 관련 페이지
- [[windows-cmd-commands]] — Windows CMD 필수 명령어
- [[powershell-commands]] — PowerShell 필수 명령어
- [[linux-commands]] — Linux 대응 명령어
