export interface Contact {
  email?: string;
  github?: string;
}

export interface Toeic {
  score: number;
  max?: number; // 기본 990
  date?: string; // 예: "2026-10"
}

export interface Cert {
  name: string;
  status: string; // 예: "취득", "준비중", "목표"
  date?: string;
}

export interface Profile {
  name: string;
  title: string;
  intro: string;
  skills: string[];
  courses: string[];
  contact?: Contact;
  toeic?: Toeic;
  certs?: Cert[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  deployUrl?: string;
  embed?: boolean; // true 면 deployUrl 의 실제 사이트를 포트폴리오 안에 iframe 으로 띄움
  current: boolean;
  order: number;
}
