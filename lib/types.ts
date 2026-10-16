export interface Contact {
  email?: string;
  github?: string;
}

export interface Profile {
  name: string;
  title: string;
  intro: string;
  skills: string[];
  courses: string[];
  contact?: Contact;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  deployUrl?: string;
  current: boolean;
  order: number;
}
