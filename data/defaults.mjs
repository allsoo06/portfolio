export const defaultProfile = {
  name: "김희수",
  title: "포트폴리오",
  intro: "중부대학교 정보보호학과 92513182 김희수",
  skills: [
    "C",
    "Linux",
    "Networking",
    "Data Structures & Algorithms",
    "Next.js",
    "MongoDB",
  ],
  courses: [
    "보안운영체제",
    "웹서버 보안 프로그래밍",
    "보안 알고리즘",
    "패킷분석 및 공격",
  ],
  toeic: { score: 910, max: 990, date: "2026-11" }, // TODO: 토익 점수/시험일
  certs: [
    { name: "리눅스 마스터 2급", status: "1차 합격" }, // TODO: 취득/준비중/목표
  ],
  contact: {
    email: "allsoo06@naver.com", // TODO: 본인 이메일
    github: "https://github.com/allsoo06", // TODO: 본인 GitHub
  },
};

export const defaultProjects = [
  {
    slug: "portfolio",
    title: "개인 포트폴리오 홈페이지",
    description:
      "Next.js + MongoDB로 만든 이 사이트. 프로필과 프로젝트 정보를 DB에서 불러와 보여줍니다.",
    tags: ["Next.js", "MongoDB", "Vercel"],
    repoUrl: "https://github.com/allsoo06/portfolio", // TODO: 이 프로젝트 저장소
    deployUrl: "https://portfolio-my-app-69b2.vercel.app", // TODO: 이 사이트 배포 주소
    embed: true,
    current: false,
    order: 2,
  },
  {
    slug: "lecture-project",
    title: "강의 실습 프로젝트 (진행 중)",
    description: "현재 강의에서 실습하고 있는 프로젝트입니다.", // TODO: 실제 프로젝트 설명
    tags: ["Lecture", "In Progress"], // TODO: 사용 기술로 변경
    repoUrl: "https://github.com/allsoo06/my-app", // TODO: 강의 실습 저장소 주소
    deployUrl: "https://my-app-my-app-69b2.vercel.app/", // TODO: 강의 실습 배포 주소
    embed: true,
    current: true,
    order: 1,
  },
  {
    slug: "team-project",
    title: "AI 기반 과제 관리 웹페이지",
    description: "웹서버 프로그래밍 팀 프로젝트", // TODO: 실제 프로젝트 설명
    tags: ["Lecture", "In Progress"], // TODO: 사용 기술로 변경
    repoUrl: "https://github.com/allsoo06/wss_teamproject", // TODO: 강의 실습 저장소 주소
    deployUrl: "https://wss-teamproject.vercel.app/", // TODO: 강의 실습 배포 주소
    embed: true,
    current: true,
    order: 3,
  },
  {
    slug: "tool-subnet",
    title: "서브넷 계산기",
    description:
      "IP/CIDR을 넣으면 네트워크 주소, 브로드캐스트, 호스트 범위를 계산해요.",
    tags: ["컴퓨터 네트워크", "Browser-only"],
    repoUrl: "https://github.com/allsoo06/portfolio/tree/main/app/tools/subnet",
    deployUrl: "/tools/subnet",
    current: false,
    order: 5,
  },
  {
    slug: "tool-chmod",
    title: "chmod 계산기",
    description: "권한 체크박스와 숫자 표기(755 등)를 서로 변환해요.",
    tags: ["운영체제", "Browser-only"],
    repoUrl: "https://github.com/allsoo06/portfolio/tree/main/app/tools/chmod",
    deployUrl: "/tools/chmod",
    current: false,
    order: 6,
  },
  {
    slug: "tool-password",
    title: "비밀번호 강도 검사기",
    description: "입력한 비밀번호의 강도를 실시간으로 평가해요.",
    tags: ["정보보안", "Browser-only"],
    repoUrl:
      "https://github.com/allsoo06/portfolio/tree/main/app/tools/password",
    deployUrl: "/tools/password",
    current: false,
    order: 7,
  },
  {
    slug: "tool-hash",
    title: "SHA-256 해시 생성기",
    description:
      "텍스트를 SHA-256 해시로 바꾸고 다른 해시와 일치하는지 비교해요.",
    tags: ["정보보안", "Browser-only"],
    repoUrl: "https://github.com/allsoo06/portfolio/tree/main/app/tools/hash",
    deployUrl: "/tools/hash",
    current: false,
    order: 8,
  },
  {
    slug: "tool-sort",
    title: "정렬 알고리즘 시각화",
    description: "정렬이 진행되는 과정을 막대 그래프로 단계별로 보여줘요.",
    tags: ["알고리즘", "Browser-only"],
    repoUrl: "https://github.com/allsoo06/portfolio/tree/main/app/tools/sort",
    deployUrl: "/tools/sort",
    current: false,
    order: 9,
  },
];
