// 페이지 목록. 새 페이지(체험판)를 추가하려면 여기에 한 줄 + Terminal.tsx 의 renderPage 에 case 추가.
export const PAGES = [
  { id: "intro", cmd: "about" },
  { id: "projects", cmd: "projects" },
  { id: "spec", cmd: "spec" },
  { id: "contact", cmd: "contact" },
] as const;

export type PageId = (typeof PAGES)[number]["id"];
