import ProjectCard from "@/components/ProjectCard";
import { getProfile, getProjects } from "@/lib/data";

// 매 요청마다 DB 에서 최신 데이터를 읽는다
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const current = projects.filter((p) => p.current);
  const others = projects.filter((p) => !p.current);

  return (
    <main className="container">
      <header className="hero">
        <h1>{profile.name}</h1>
        <p className="subtitle">{profile.title}</p>
        <p className="intro">{profile.intro}</p>
        <div className="links">
          {profile.contact?.github && (
            <a
              href={profile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {profile.contact?.email && (
            <a href={`mailto:${profile.contact.email}`}>Email</a>
          )}
        </div>
      </header>

      <section>
        <h2>Skills</h2>
        <ul className="chips">
          {profile.skills?.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Courses</h2>
        <ul className="plain">
          {profile.courses?.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      {current.length > 0 && (
        <section>
          <h2>현재 강의 실습 프로젝트</h2>
          <div className="grid">
            {current.map((p) => (
              <ProjectCard key={p.slug} project={p} highlight />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Projects</h2>
        <div className="grid">
          {others.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <footer>
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </main>
  );
}
