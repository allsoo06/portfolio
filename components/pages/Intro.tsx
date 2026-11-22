"use client";

import HandshakeViz from "@/components/HandshakeViz";
import { useTypewriter } from "@/lib/useTypewriter";
import type { Profile } from "@/lib/types";

const BOOT = "booting portfolio...\nloading profile ... ok";

interface Props {
  profile: Profile;
  projectCount: number;
}

export default function Intro({ profile, projectCount }: Props) {
  const boot = useTypewriter(BOOT);
  const done = boot.length >= BOOT.length;

  return (
    <div>
      <pre className="boot">{boot}</pre>
      {done && (
        <div className="fade-in">
          <div className="hero">
            <div className="avatar">{profile.name.charAt(0)}</div>
            <div>
              <h1>{profile.name}</h1>
              <p className="subtitle">{profile.title}</p>
            </div>
          </div>
          <p className="intro">{profile.intro}</p>

          <div className="stats">
            <div className="stat">
              <b>{projectCount}</b>
              <span>Projects</span>
            </div>
            <div className="stat">
              <b>{profile.courses?.length ?? 0}</b>
              <span>Courses</span>
            </div>
            <div className="stat">
              <b>{profile.skills?.length ?? 0}</b>
              <span>Skills</span>
            </div>
            <div className="stat">
              <b>{profile.toeic ? profile.toeic.score : "—"}</b>
              <span>TOEIC</span>
            </div>
          </div>

          <HandshakeViz />

          <ul className="chips">
            {profile.skills?.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>

          <p className="hint">
            → 키 또는 <code>next</code> 입력으로 다음 페이지
          </p>
        </div>
      )}
    </div>
  );
}
