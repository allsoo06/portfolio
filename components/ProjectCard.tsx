import type { Project } from "@/lib/types";

interface Props {
  project: Project;
  highlight?: boolean;
}

export default function ProjectCard({ project, highlight = false }: Props) {
  return (
    <article className={highlight ? "card highlight" : "card"}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <ul className="chips small">
        {project.tags?.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="links">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            저장소
          </a>
        )}
        {project.deployUrl && (
          <a href={project.deployUrl} target="_blank" rel="noopener noreferrer">
            배포 사이트
          </a>
        )}
      </div>
    </article>
  );
}
