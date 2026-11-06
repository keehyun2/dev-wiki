#!/usr/bin/env node
// content/ 마크다운을 mdbook 형식(mdbook/src/)으로 변환한다.
// - frontmatter 제거 후 한국어 title을 최상단 헤딩으로 삽입
// - [[위키링크]]를 일반 마크다운 상대 링크로 변환 (깨진 링크는 평문 처리)
// - content/index.md의 카테고리 구조를 따라 SUMMARY.md 생성
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "mdbook", "src");
const EXCLUDE = new Set(["AGENTS.md", "log.md", "index.md"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(path.relative(CONTENT, full).replaceAll("\\", "/"));
    }
  }
  return out;
}

function parseMd(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  let title = "";
  let body = raw;
  if (m) {
    const tm = m[1].match(/^title:\s*(.+)$/m);
    if (tm) title = tm[1].trim();
    body = raw.slice(m[0].length).replace(/^\r?\n/, "");
  }
  return { title, body };
}

const files = walk(CONTENT).filter((f) => !EXCLUDE.has(f));

const meta = new Map(); // relPath -> { title, slug }
for (const f of files) {
  const { title } = parseMd(fs.readFileSync(path.join(CONTENT, f), "utf8"));
  meta.set(f, { title, slug: path.basename(f, ".md") });
}

// bare slug ([[java-exceptions]]) 용 슬러그 → 경로 매핑 (요약 > 개념 > 탐색 > 소스 우선)
const slugMap = new Map();
const prio = (p) =>
  p.startsWith("summaries/") ? 0 : p.startsWith("concepts/") ? 1 : p.startsWith("explorations/") ? 2 : 3;
for (const [f, m] of meta) {
  const cur = slugMap.get(m.slug);
  if (!cur || prio(f) < prio(cur)) slugMap.set(m.slug, f);
}

function resolveTarget(target, fromDir) {
  let t = target.trim();
  const candidates = [
    t.endsWith(".md") ? t : `${t}.md`, // content 루트 기준
    fromDir === "." ? `${t}.md` : `${fromDir}/${t.endsWith(".md") ? t : `${t}.md`}`, // 파일 기준 상대
  ];
  for (const c of candidates) if (meta.has(c)) return c;
  const slug = t.replace(/\.md$/, "");
  if (slugMap.has(slug)) return slugMap.get(slug);
  return null;
}

function convertLinks(body, fromRel) {
  const fromDir = path.posix.dirname(fromRel);
  return body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
    const resolved = resolveTarget(target, fromDir);
    if (!resolved) return (alias ?? target).trim();
    const rel = path.posix.relative(fromDir, resolved);
    const label = alias?.trim() || meta.get(resolved).title || meta.get(resolved).slug;
    return `[${label}](${rel})`;
  });
}

const normalized = new Map(); // relPath -> 최종 변환 본문
for (const f of files) {
  const { title, body } = parseMd(fs.readFileSync(path.join(CONTENT, f), "utf8"));
  const converted = convertLinks(body, f);
  const hasTopHeading = /^#\s/.test(converted.trimStart());
  const header = !hasTopHeading && title ? `# ${title}\n\n` : "";
  normalized.set(f, header + converted);
}

// SUMMARY.md: index.md의 ## 섹션과 [[링크]] 항목 구조 사용
const indexRaw = fs.readFileSync(path.join(CONTENT, "index.md"), "utf8");
const sections = [];
let current = null;
for (const line of indexRaw.split("\n")) {
  const h = line.match(/^## (.+)$/);
  if (h) {
    current = { name: h[1].trim(), items: [] };
    sections.push(current);
    continue;
  }
  const item = line.match(/^- \[\[([^\]|]+)(?:\|[^\]]+)?\]\]/);
  if (item && current) current.items.push(item[1].trim());
}

const summaryLines = ["# Summary", "", "[개요](index.md)", ""];
let missing = [];
for (const section of sections) {
  const resolved = section.items.map((t) => ({ target: t, file: resolveTarget(t, ".") })).filter((x) => x.file);
  missing.push(...section.items.filter((t) => !resolveTarget(t, ".")));
  if (resolved.length === 0) continue; // 작업 로그(log.md) 등 제외 항목만 있는 섹션 생략
  summaryLines.push(`# ${section.name}`, "");
  for (const { target, file } of resolved) {
    const title = meta.get(file).title || meta.get(file).slug;
    summaryLines.push(`- [${title}](${file})`);
  }
  summaryLines.push("");
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
for (const [f, body] of normalized) {
  const dest = path.join(OUT, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, body);
}
// 개요 페이지: content/index.md의 위키링크만 변환해 책의 첫 페이지로 사용
fs.writeFileSync(path.join(OUT, "index.md"), convertLinks(parseMd(indexRaw).body, "index.md"));
fs.writeFileSync(path.join(OUT, "SUMMARY.md"), summaryLines.join("\n"));

console.log(`변환: ${normalized.size + 1}개 페이지 → mdbook/src/`);
console.log(`SUMMARY.md: ${summaryLines.filter((l) => l.startsWith("- [")).length}개 챕터`);
if (missing.length) console.log(`미해결 링크: ${[...new Set(missing)].join(", ")}`);
