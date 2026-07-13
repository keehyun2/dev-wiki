# Git 필수 명령어

## 상태 확인

```bash
git status          # 작업 디렉토리 상태
git diff            # 변경 사항 보기
git diff staged     # 스테이징된 변경 사항
git log             # 커밋 히스토리
git log --oneline   # 한 줄씩 히스토리
```

## 브랜치 관리

```bash
git branch          # 브랜치 목록
git branch new      # 새 브랜치 생성
git checkout dev    # 브랜치 전환
git switch dev      # 브랜치 전환 (최신 방식)
git merge feature   # 브랜치 병합
```

## 되돌리기 (중요!)

### restore vs reset vs revert

```bash
git restore file.txt        # 작업 디렉토리 변경 되돌리기
git restore --staged file   # 스테이징 취소

git reset --soft HEAD~1     # 커밋만 취소 (변경 유지)
git reset --mixed HEAD~1    # 커밋+스테이징 취소
git reset --hard HEAD~1     # 커밋+스테이징+변경 취소

git revert HEAD     # 새 커밋으로 되돌리기
```

## Stash (임시 저장)

```bash
git stash                  # 현재 변경 임시 저장
git stash pop              # 마지막 stash 적용 후 삭제
git stash list             # stash 목록
git stash drop             # 마지막 stash 삭제
```

## Submodule

```bash
git clone --recursive          # 서브모듈 포함 클론
git submodule update --init --recursive  # 서브모듈 초기화/업데이트
```

## 자주 쓰는 패턴

### 마지막 커밋 메시지 수정

```bash
git commit --amend
```

### 커밋 합치기

```bash
git rebase -i HEAD~3
```

### 원격 동기화

```bash
git fetch origin          # 원격 정보 가져오기
git pull origin main      # 가져오기+병합
git push origin feature   # 원격에 푸시
```

## 관련 페이지

- [[sources/developers-cheatsheet.md]] - 전체 개발자 치트시트
- [[development/linux-commands.md]] - Linux 명령어
