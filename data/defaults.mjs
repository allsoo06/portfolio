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
    current: true,
    order: 3,
  },
];
