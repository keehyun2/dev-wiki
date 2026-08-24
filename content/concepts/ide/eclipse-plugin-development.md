---
title: 이클립스 플러그인 개발 기초
---

# 이클립스 플러그인 개발 기초

**이클립스 플러그인(Plug-in)**은 이클립스 IDE와 RCP 애플리케이션의 기능 확장 단위로, OSGi 번들 형태의 JAR입니다. 이클립스 자체도 수백 개의 플러그인 조합으로 구성되어 있습니다.

## 핵심 개념

### 플러그인의 구성 요소
| 파일 | 역할 |
|------|------|
| `MANIFEST.MF` | OSGi 번들 메타데이터 (ID, 버전, 의존성, 내보내는 패키지) |
| `plugin.xml` | 확장(Extension) 선언 — 어떤 확장 포인트에 기여할지 |
| `plugin.properties` | 국제화(i18N) 문자열 |
| `Activator` 클래스 | 번들 생명주기 콜백 (start/stop) |

### 플러그인 vs 피처 vs 프로덕트
- **Plug-in**: 기능의 최소 단위 (번들)
- **Feature**: 배포 단위. 여러 플러그인을 그룹화
- **Product**: 완성된 애플리케이션. 피처들 + 런처 + 브랜딩 정보

### Extension Point 메커니즘
이클립스 확장의 핵심. 기존 코드 수정 없이 `plugin.xml`로 기여(contribute)하는 선언적 방식입니다.

```text
확장 포인트 정의 측 (호스트 플러그인)
  org.eclipse.ui.views ← 확장 포인트
확장 측 (내 플러그인)
  plugin.xml에서 point="org.eclipse.ui.views"로 뷰 기여
```

## 개발 환경

### PDE (Plug-in Development Environment)
- 이클립스에 기본 내장된 플러그인 개발 도구
- "Eclipse IDE for RCP and RAP Developers" 패키지 권장 (뷰/에디터 템플릿 포함)

### Target Platform
- 컴파일/실행 시 참조할 플러그인 집합 (기본: 실행 중인 이클립스 자신)
- `Window → Preferences → Plug-in Development → Target Platform`에서 관리
- 특정 버전 타깃(`*.target` 파일)을 지정하면 버전별 호환성 검증 가능

## 첫 플러그인 만들기

### 프로젝트 생성
1. `File → New → Other → Plug-in Project`
2. ID/버전/Activator 이름 지정 (예: `com.example.helloworld`)
3. 템플릿 선택: **"Hello, World Command"** — 메뉴 + 핸들러 기본 구조 자동 생성

### MANIFEST.MF 예시
```manifest
Manifest-Version: 1.0
Bundle-SymbolicName: com.example.helloworld;singleton:=true
Bundle-Version: 1.0.0.qualifier
Bundle-Activator: com.example.helloworld.Activator
Bundle-RequiredExecutionEnvironment: JavaSE-17
Require-Bundle: org.eclipse.ui,
 org.eclipse.core.runtime
Bundle-ActivationPolicy: lazy
```

- `singleton:=true`: UI 리소스(plugin.xml)를 가진 플러그인에 필수
- `lazy`: 다른 번들이 참조할 때까지 시작을 지연 (성능)

### plugin.xml 예시 — 뷰 등록
```xml
<?xml version="1.0" encoding="UTF-8"?>
<?eclipse version="3.4"?>
<plugin>
   <extension point="org.eclipse.ui.views">
      <view
            id="com.example.helloworld.SampleView"
            name="샘플 뷰"
            class="com.example.helloworld.SampleView"
            icon="icons/sample.gif">
      </view>
   </extension>
</plugin>
```

## 주요 확장 포인트

| 확장 포인트 | 용도 |
|------------|------|
| `org.eclipse.ui.views` | 뷰 추가 (Outline, Problems 같은 창) |
| `org.eclipse.ui.editors` | 에디터 추가 |
| `org.eclipse.ui.commands` | 커맨드(명령) 정의 |
| `org.eclipse.ui.handlers` | 커맨드의 실행 로직 연결 |
| `org.eclipse.ui.menus` | 메뉴/툴바/컨텍스트 메뉴에 커맨드 배치 |
| `org.eclipse.ui.preferencePages` | 설정(Preferences) 페이지 추가 |
| `org.eclipse.ui.perspectives` | 퍼스펙티브 정의 |
| `org.eclipse.core.runtime.products` | RCP 제품 정의 |

## UI 구성 기술

### 3계층
- **SWT**: 네이티브 위젯 래퍼 (Composite, Button, Table...)
- **JFace**: SWT 위의 추상 계층 (TableViewer, LabelProvider, Actions)
- **Workbench**: 이클립스 UI 프레임 (IWorkbenchWindow, IViewPart...)

### View 예제
```java
public class SampleView extends ViewPart {
    public static final String ID = "com.example.helloworld.SampleView";

    @Override
    public void createPartControl(Composite parent) {
        parent.setLayout(new FillLayout());
        TableViewer viewer = new TableViewer(parent, SWT.BORDER | SWT.FULL_SELECTION);
        viewer.setContentProvider(new ArrayContentProvider());
        viewer.setLabelProvider(new LabelProvider());
        viewer.setInput(java.util.List.of("항목1", "항목2"));
    }

    @Override
    public void setFocus() { /* 포커스 처리 */ }
}
```

### Handler 예제
```java
public class SampleHandler extends AbstractHandler {

    @Override
    public Object execute(ExecutionEvent event) throws ExecutionException {
        Shell shell = HandlerUtil.getActiveShell(event);
        MessageDialog.openInformation(shell, "Hello", "Hello, Eclipse Plug-in!");
        return null;
    }
}
```

## 3.x vs e4

| 구분 | 3.x (Compatibility Layer) | e4 (Eclipse 4) |
|------|--------------------------|----------------|
| 구성 방식 | 확장 포인트 + plugin.xml | 애플리케이션 모델 (Application.e4xmi) |
| 결합 방식 | 싱글톤/서비스 조회 | 의존성 주입 (`@Inject`, `@Execute`) |
| 스타일링 | 없음 | CSS 지원 |

- 현재 이클립스는 e4 기반이지만 3.x API를 호환 계층으로 지원
- 신규 개발은 커맨드/핸들러 기반(위 예제)으로 시작하는 것이 무난

## 실행과 디버깅

### 런치
- `Run As → Eclipse Application`: 내 플러그인이 포함된 새 이클립스 인스턴스 실행
- `Debug As → Eclipse Application`: 디버거 연결, 브레이크포인트 사용 가능

### 디버깅 도구
```text
Plug-in Spy      Alt+Shift+F1  — 커서 위치 UI가 어떤 뷰/클래스로 구성됐는지 조회
Menu Spy         Alt+Shift+F2  — 메뉴 항목의 커맨드 ID 조회
OSGi 콘솔        ss, bundles   — 설치/시작 상태 확인 (Console 뷰에서 host: OSGi 선택)
```

## 배포

### 배포 단계
1. **Feature 프로젝트** 생성 — 배포할 플러그인 그룹화
2. **Update Site 프로젝트** 생성 (`category.xml`) — p2 저장소 구성
3. `Export → Deployable features` 또는 p2 Publisher로 저장소 빌드
4. 사용자는 `Help → Install New Software`로 저장소 URL 지정해 설치

### RCP 애플리케이션인 경우
- **Product Configuration** (`*.product`) 파일로 피처 집합 + 런처 + 브랜딩 정의
- `Export → Eclipse Product`로 각 OS용 실행 파일 생성

## 시작할 때 알아둘 점

- 버전 관리: `Require-Bundle` 대신 가능하면 `Import-Package` 사용 권장 (결합도 낮춤)
- 스레드 규칙: UI 갱신은 반드시 UI 스레드에서 (`Display.getDefault().asyncExec(...)`)
- 이클립스 버전별 요구 Java: 최근 버전은 Java 17 이상 필요
- API Tools 활성화: `@since` 태그 기반으로 API 호환성 자동 검증
- 참조 문서: [Eclipse Platform Developer Guide](https://help.eclipse.org/latest/index.jsp)

## 관련 페이지
- [[summaries/ide/eclipse-shortcut]] — 이클립스 단축키
- [[concepts/ide/ide-shortcut-common-patterns]] — IDE 단축키 공통 패턴
- [[summaries/development/java-debugging]] — Java 실행 및 디버깅
