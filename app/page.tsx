import Terminal from "@/components/Terminal";
import { getProfile, getProjects } from "@/lib/data";

// 매 요청마다 DB 에서 최신 데이터를 읽는다
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);

  return (
    <main className="container">
      <Terminal profile={profile} projects={projects} />
    </main>
  );
}
