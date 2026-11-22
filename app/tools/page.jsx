import Link from "next/link";
import { c, mono, sans } from "./_components/theme";

const tools = [
  {
    href: "/tools/subnet",
    course: "컴퓨터 네트워크",
    title: "서브넷 계산기",
    desc: "IP/CIDR → 네트워크 주소, 브로드캐스트, 호스트 수",
    tag: "$ ipcalc",
  },
  {
    href: "/tools/chmod",
    course: "리눅스 시스템 관리",
    title: "chmod 계산기",
    desc: "755 ↔ rwxr-xr-x 양방향 변환",
    tag: "$ chmod",
  },
  {
    href: "/tools/password",
    course: "정보보안",
    title: "비밀번호 강도 검사기",
    desc: "엔트로피 기반 강도 추정, 서버 전송 없음",
    tag: "$ pwcheck",
  },
  {
    href: "/tools/hash",
    course: "암호학 기초",
    title: "SHA-256 해시 생성기",
    desc: "Web Crypto API로 텍스트·파일 해시 계산",
    tag: "$ sha256sum",
  },
  {
    href: "/tools/sort",
    course: "자료구조와 알고리즘",
    title: "정렬 알고리즘 시각화",
    desc: "버블·선택·삽입·퀵·병합 정렬 단계별 애니메이션",
    tag: "$ sort",
  },
];

export default function ToolsIndex() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: c.bg,
        color: c.text,
        padding: "48px 20px 80px",
        fontFamily: sans,
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <p style={{ color: c.accent, fontFamily: mono, fontSize: 13, margin: "0 0 6px" }}>
          ~/tools
        </p>
        <h1 style={{ fontSize: 34, margin: "0 0 8px" }}>수업에서 배운 걸 도구로</h1>
        <p style={{ color: c.dim, margin: "0 0 32px", lineHeight: 1.6 }}>
          전부 브라우저 안에서만 동작해. 입력값은 어디에도 전송되지 않아.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={{
                display: "block",
                background: c.panel,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: 20,
                color: c.text,
                textDecoration: "none",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 12, color: c.accent }}>{t.tag}</div>
              <div style={{ fontSize: 20, fontWeight: 600, margin: "10px 0 6px" }}>{t.title}</div>
              <div style={{ color: c.dim, fontSize: 14, lineHeight: 1.5 }}>{t.desc}</div>
              <div style={{ color: c.dim, fontSize: 12, marginTop: 14 }}>{t.course}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
