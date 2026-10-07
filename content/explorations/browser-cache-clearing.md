---
title: 브라우저 캐시 초기화
---

브라우저는 화면을 빠르게 그리기 위해 이미지·CSS·JS를 메모리와 디스크에 저장해 두고(캐시), 다음 방문 때 서버 대신 이를 재사용한다. 덕분에 로딩이 빨라지지만, 서버의 최신 리소스가 화면까지 반영되지 않는 "예전 화면" 문제가 생긴다. Chrome과 Edge는 같은 Chromium 엔진 기반이라 캐시 초기화 방법과 단축키가 거의 동일하다.

**한 줄 결론**: 현재 페이지만 새로 보려면 `Ctrl+Shift+R`(강제 새로고침), 브라우저 전체 캐시를 지우려면 `Ctrl+Shift+Del`, 개발 중에는 DevTools의 "캐시 사용 안함" 옵션이 정답.

## 단축키 한눈에 보기

Chrome·Edge 공통 (Windows):

| 단축키                     | 동작                                                                      |
| -------------------------- | ------------------------------------------------------------------------- |
| `F5` / `Ctrl+R`            | 일반 새로고침 — 캐시를 그대로 재사용                                      |
| `Ctrl+F5` / `Ctrl+Shift+R` | 강제 새로고침 — 현재 페이지 리소스를 캐시 무시하고 서버에서 재다운로드    |
| `Ctrl+Shift+Del`           | 인터넷 사용기록·캐시 삭제 대화상자 열기                                   |
| `F12` / `Ctrl+Shift+I`     | DevTools 열기                                                             |
| `Ctrl+Shift+N`             | 시크릿/InPrivate 모드 — 캐시·쿠키 없는 깨끗한 상태로 열기(삭제 없이 우회) |

## 방법 1: 강제 새로고침 (Hard Reload)

가장 빠른 방법. 현재 페이지와 그 리소스만 캐시를 무시하고 서버에서 다시 받는다. 브라우저 설정은 건드리지 않는다.

- `Ctrl+Shift+R` 또는 `Ctrl+F5`
- DevTools(`F12`)가 열려 있을 때 새로고침 버튼을 **우클릭** → **캐시 비우기 및 강제 새로고침**(Empty Cache and Hard Reload)을 선택하면 브라우저 캐시 전체를 비운 뒤 새로고침한다.

일반 새로고침(`F5`)은 캐시의 유효기간(HTTP 응답 헤더)을 따르므로, 서버에 새 파일을 배포해도 캐시에 남은 예전 버전이 그려질 수 있다.

## 방법 2: 설정에서 전체 캐시 삭제

브라우저에 저장된 캐시 전체를 지운다.

1. `Ctrl+Shift+Del`로 삭제 대화상자를 연다(또는 주소창에 아래 주소 입력)
   - Chrome: `chrome://settings/clearBrowserData`
   - Edge: `edge://settings/clearBrowserData`
2. 기간을 **전체 기간**으로 선택
3. **캐시된 이미지 및 파일**만 체크 → 삭제

> [!warning] 주의
> **쿠키 및 기타 사이트 데이터**를 함께 체크하면 로그인 세션까지 모두 지워져 모든 사이트에서 로그아웃된다.

| 브라우저 | 설정 경로                                               |
| -------- | ------------------------------------------------------- |
| Chrome   | 설정 → 개인정보 및 보안 → 인터넷 사용기록 삭제          |
| Edge     | 설정 → 개인정보, 검색 및 서비스 → 인터넷 사용 기록 삭제 |

## 방법 3: DevTools 활용 (개발 중)

- **캐시 사용 안함**: DevTools(`F12`) → Network 탭 → **Disable cache(캐시 사용 안함)** 체크. DevTools가 열려 있는 동안 모든 요청이 캐시를 우회하므로 수정-확인을 반복하는 개발에 유용하다. DevTools를 닫으면 원래대로 돌아온다.
- **명령 팔레트**: DevTools에서 `Ctrl+Shift+P` → `clear` 입력 → **Network: Clear browser cache** 실행(쿠키만 지우는 **Network: Clear cookies**도 있음)
- **특정 사이트만 지우기**: DevTools → Application 탭 → Storage → **Clear site data(사이트 데이터 지우기)**. 현재 사이트의 캐시·쿠키·localStorage 등만 삭제된다.

## 언제 어떤 방법을 쓸까

| 상황                                  | 방법                                     |
| ------------------------------------- | ---------------------------------------- |
| 배포했는데 수정이 화면에 안 보인다    | `Ctrl+Shift+R` 강제 새로고침             |
| 개발 중 리소스를 항상 최신으로 받기   | DevTools Network → Disable cache         |
| 브라우저 전체가 이상하다(전체 초기화) | `Ctrl+Shift+Del` → 캐시된 이미지 및 파일 |
| 특정 사이트의 저장 상태만 초기화      | DevTools Application → Clear site data   |
| 로그인을 유지하며 캐시 문제 확인      | 시크릿 모드 `Ctrl+Shift+N`               |

## 참고

- 캐시의 유효기간은 서버가 내려주는 HTTP 응답 헤더(`Cache-Control`, `ETag` 등)가 결정한다. 강제 새로고침은 이 헤더를 무시하고 무조건 서버에 재요청하는 동작이다.
- 캐시는 메모리 캐시(빠름, 세션 동안 유지)와 디스크 캐시(느리지만 브라우저를 재시작해도 유지)로 나뉜다. 설정에서 삭제하면 둘 다 지워진다.

## 참고 자료

- Chrome DevTools — [Network 기능 참고자료 (Disable cache)](https://developer.chrome.com/docs/devtools/network/reference)
- Microsoft Learn — [Microsoft Edge DevTools Network 기능](https://learn.microsoft.com/microsoft-edge/devtools-guide-chromium/network/reference)
- Google 고객센터 — [캐시 및 쿠키 삭제](https://support.google.com/accounts/answer/32050)
