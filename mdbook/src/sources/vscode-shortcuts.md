# VSCode 단축키 가이드

## 태그 선택 단축키

### HTML/XML 태그 쌍 선택

#### 더블 클릭
- 태그 이름을 더블 클릭하면 해당 태그 쌍 선택
- `<div>`를 더블 클릭하면 여는 `<div>`와 닫는 `</div>` 모두 선택
- 가장 직관적인 방법

#### Alt+Shift+→
- Emmet 기능과 함께 사용 가능
- 커서 위치에서 태그 쌍 확장 선택
- 반복 누르면 상위 태그로 선택 영역 확장

#### 확장 프로그램
- **Auto Rename Tag**: 여는 태그 수정 시 닫는 태그 자동 수정
- **Tag Auto Close**: 자동으로 닫는 태그 생성

## 코드 정렬 단축키

### Shift+Alt+F
- 코드 자동 정렬 (Format Document)
- 현재 파일 전체를 자동으로 정렬
- 다양한 프로그래밍 언어 지원
- Prettier, ESLint 등 포맷터와 연동

### Ctrl+K, Ctrl+F
- 선택된 영역만 정렬 (Format Selection)
- 특정 부분만 정렬하고 싶을 때 사용

## 선택 확장 단축키

### 기본 선택
- **Ctrl+Shift+→**: 다음 단어 선택
- **Ctrl+Shift+←**: 이전 단어 선택
- **Ctrl+Shift+Home**: 문서 시작까지 선택
- **Ctrl+Shift+End**: 문서 끝까지 선택

### 멀티 커서
- **Alt+Click**: 여러 위치에 커서 생성
- **Ctrl+Alt+↑/↓**: 위/아래에 커서 추가
- **Ctrl+D**: 다음 동일 단어 선택 및 커서 추가

### 코드 편집
- **Ctrl+Enter**: 현재 줄 아래에 새 줄 삽입
- **Ctrl+Shift+Enter**: 현재 줄 위에 새 줄 삽입
- **Alt+↑/↓**: 현재 줄 이동
- **Shift+Alt+↑/↓**: 현재 줄 복사
- **Ctrl+/**: 주석 토글

## 탐색 단축키

### 파일 탐색
- **Ctrl+P**: 파일 빠른 열기
- **Ctrl+Shift+F**: 전체 파일 검색
- **Ctrl+G**: 줄 번호로 이동

### 심볼 탐색
- **Ctrl+Shift+O**: 심볼로 이동 (함수, 클래스 등)
- **F12**: 정의로 이동
- **Shift+F12**: 참고 찾기

### 에디터 기능
- **Ctrl+Tab**: 최근 파일 전환
- **Ctrl+B**: 사이드바 토글
- **Ctrl+`**: 터미널 토글

## 기능 단축키

### 자동 완성
- **Ctrl+Space**: 자동 완성 제안
- **Tab**: Emmet 약어 확장
- **Ctrl+Shift+Space**: 매개변수 힌트

### 코드 접기
- **Ctrl+Shift+[]**: 코드 폴드 토글
- **Ctrl+K, Ctrl+0**: 모든 폴드 닫기
- **Ctrl+K, Ctrl+J**: 모든 폴드 펼치기

### 리팩토링
- **F2**: 심볼 이름 변경
- **Ctrl+Shift+R**: 모든 참고에서 이름 변경

## 사용자 정의

### 단축키 설정
- **Ctrl+K, Ctrl+S**: 키보드 단축키 설정 열기
- settings.json에서 직접 설정 가능
- 확장 프로그램별 단축키 설정 가능

### 자주 사용하는 커스텀
```json
{
  "key": "ctrl+shift+d",
  "command": "editor.action.formatDocument"
}
```

## 참고사항

- VSCode는 운영체제마다 기본 단축키가 다를 수 있음
- Windows/Linux: Ctrl 기반
- macOS: Cmd 기반 (대부분 Ctrl → Cmd로 대체)
- 확장 프로그램 설치 시 단축키 충돌 확인 필요
