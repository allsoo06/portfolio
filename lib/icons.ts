// 이름에 맞는 이모지/그라데이션을 골라주는 도우미 (이미지 파일 없이 시각 요소를 만들기 위해 사용)

const SKILL_ICONS: [RegExp, string][] = [
  [/next/i, "▲"],
  [/mongo/i, "🍃"],
  [/react/i, "⚛️"],
  [/typescript/i, "🔷"],
  [/^javascript$|^js$/i, "🟨"],
  [/python/i, "🐍"],
  [/linux/i, "🐧"],
  [/network/i, "🌐"],
  [/algorithm|data struct/i, "🧩"],
  [/^c(\+\+)?$/i, "⚙️"],
  [/git/i, "🔀"],
  [/vercel/i, "▲"],
  [/security|보안/i, "🔐"],
];

export function skillIcon(name: string): string | null {
  for (const [re, icon] of SKILL_ICONS) if (re.test(name)) return icon;
  return null;
}

const COURSE_ICONS: [RegExp, string][] = [
  [/자료구조|알고리즘/, "🧩"],
  [/네트워크/, "🌐"],
  [/리눅스/, "🐧"],
  [/^c(\s|$)|c 프로그래밍/i, "⚙️"],
  [/보안|암호/, "🔐"],
  [/데이터베이스|db/i, "🗄️"],
];

export function courseIcon(name: string): string {
  for (const [re, icon] of COURSE_ICONS) if (re.test(name)) return icon;
  return "📚";
}

export function projectIcon(title: string, tags: string[]): string {
  for (const t of tags) {
    const icon = skillIcon(t);
    if (icon) return icon;
  }
  return skillIcon(title) ?? "🚀";
}

// 문자열 → 항상 같은 그라데이션 (프로젝트마다 다른 썸네일 색)
export function gradientFor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `linear-gradient(135deg, hsl(${h} 85% 62%), hsl(${(h + 55) % 360} 90% 58%))`;
}
