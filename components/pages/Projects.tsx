"use client";

import { useState } from "react";
import { DEMOS } from "@/components/demos";
import type { Project } from "@/lib/types";

// 배포된 실제 사이트를 포트폴리오 안에서 실행. 클릭하기 전엔 로드하지 않아서 페이지가 가벼움.
function LiveFrame({ url, title }: { url: string; title: string }) {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="frame-start">
        <p className="hint">
          배포된 실제 사이트를 이 창 안에서 그대로 실행해요.
        </p>
        <button
          type="button"
          className="btn primary"
          onClick={() => setStarted(true)}
        >
          ▶ 실제 사이트 실행
        </button>
      </div>
    );
  }

  return (
    <div>
      <iframe
        className="frame"
        src={url}
        title={title}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <p className="hint">
        화면이 비어 있으면 사이트가 임베드를 막은 거예요.{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          새 탭에서 열기 ↗
        </a>
      </p>
    </div>
  );
}

function ProjectView({ project }: { project: Project }) {
  const Mock = DEMOS[project.slug];
  const liveUrl = project.embed && project.deployUrl ? project.deployUrl : null;
  const [mode, setMode] = useState<"live" | "mock">(liveUrl ? "live" : "mock");

  return (
    <section className="explorer-view">
      <h3>{project.title}</h3>
      <p className="desc">{project.description}</p>
      <ul className="chips small">
        {project.tags?.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="links">
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            저장소 ↗
          </a>
        )}
        {project.deployUrl && (
          <a href={project.deployUrl} target="_blank" rel="noopener noreferrer">
            배포 사이트 ↗
          </a>
        )}
      </div>

      <div className="demo-window">
        <div className="demo-bar">
          <span>$ ./run {project.slug}</span>
          <span>{mode === "live" ? "LIVE" : "체험판"}</span>
        </div>
        <div className="demo-body">
          {liveUrl && Mock && (
            <div className="mode-toggle">
              <button
                type="button"
                className={mode === "live" ? "btn primary" : "btn"}
                onClick={() => setMode("live")}
              >
                실제 사이트
              </button>
              <button
                type="button"
                className={mode === "mock" ? "btn primary" : "btn"}
                onClick={() => setMode("mock")}
              >
                체험판
              </button>
            </div>
          )}

          {mode === "live" && liveUrl ? (
            <LiveFrame url={liveUrl} title={project.title} />
          ) : Mock ? (
            <Mock />
          ) : (
            <p className="hint">
              이 프로젝트의 체험판은 준비 중이에요. 위 링크에서 직접 확인해
              보세요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  // 현재 강의 실습 프로젝트를 맨 위에
  const sorted = [...projects].sort(
    (a, b) => Number(b.current) - Number(a.current) || a.order - b.order,
  );
  const [slug, setSlug] = useState(sorted[0]?.slug);
  const selected = sorted.find((p) => p.slug === slug) ?? sorted[0];

  if (!selected) return <p className="hint">등록된 프로젝트가 없어요.</p>;

  return (
    <div className="explorer">
      <aside className="explorer-list">
        <p className="hint">$ ls projects/</p>
        {sorted.map((p) => (
          <button
            key={p.slug}
            type="button"
            className={p.slug === selected.slug ? "pick active" : "pick"}
            onClick={() => setSlug(p.slug)}
          >
            <span>{p.title}</span>
            {p.current && <em className="badge">NOW</em>}
          </button>
        ))}
      </aside>

      <ProjectView key={selected.slug} project={selected} />
    </div>
  );
}
