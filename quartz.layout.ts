import { PageLayout, SharedLayout } from "./quartz/cfg";
import * as Component from "./quartz/components";

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
};

// 좌측 탐색기 메뉴: 제목은 각 페이지의 frontmatter title을 따르되,
// 한글 12글자(반각 24자)를 넘어 메뉴가 2줄로 wrapping되는 제목만 짧게 줄여 매핑.
// 새 페이지 추가 시 제목이 길면 이 목록에도 항목을 추가할 것.
const explorer = Component.Explorer({
  mapFn: (node) => {
    const displayNames: Record<string, string> = {
      "concepts/algorithm/coding-test-language-basics": "코딩테스트 기본 문법",
      "concepts/algorithm/gcd-lcm-euclidean": "최대공약수·최소공배수",
      "concepts/ide/eclipse-plugin-development": "이클립스 플러그인 개발",
      "concepts/security/totp-google-otp": "Google OTP 인증",
      "sources/eclipse-shortcuts": "이클립스 단축키",
      "sources/java-nio-file-operations": "Java NIO 파일",
      "sources/vscode-shortcuts": "VSCode 단축키",
      "summaries/database/mysql-query-log": "MySQL 쿼리 로그",
      "summaries/ide/eclipse-shortcut": "이클립스 태그 선택",
      "summaries/ide/vscode-shortcuts": "VSCode 태그·정렬",
    };
    const displayName = displayNames[node.slug];
    if (displayName) {
      node.displayName = displayName;
    }
  },
});

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    explorer,
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
};

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    explorer,
  ],
  right: [],
};
