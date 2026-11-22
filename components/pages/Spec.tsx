"use client";

import { useEffect, useState } from "react";
import { courseIcon } from "@/lib/icons";
import type { Profile } from "@/lib/types";

const R = 54;
const CIRC = 2 * Math.PI * R;

export default function Spec({ profile }: { profile: Profile }) {
  const { toeic, certs } = profile;
  const max = toeic?.max ?? 990;
  const pct = toeic ? Math.min(100, Math.round((toeic.score / max) * 100)) : 0;

  // 원형 게이지가 0 → 목표값으로 차오르는 애니메이션
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div>
      {toeic && (
        <section>
          <h2># toeic</h2>
          <div className="toeic">
            <svg
              viewBox="0 0 140 140"
              className="ring"
              role="img"
              aria-label={`TOEIC ${toeic.score}점`}
            >
              <circle cx="70" cy="70" r={R} className="ring-bg" />
              <circle
                cx="70"
                cy="70"
                r={R}
                className="ring-fg"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - width / 100)}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="78" textAnchor="middle" className="ring-text">
                {toeic.score}
              </text>
            </svg>
            <div>
              <p className="score">
                {pct}% <span>/ {max}점 만점</span>
              </p>
              {toeic.date && <p className="hint">시험일 {toeic.date}</p>}
            </div>
          </div>
        </section>
      )}

      {certs && certs.length > 0 && (
        <section>
          <h2># certificates</h2>
          <div className="tiles">
            {certs.map((c) => (
              <div className="tile" key={c.name}>
                <span className="tile-icon">🏅</span>
                <b>{c.name}</b>
                <span className="tag">{c.status}</span>
                {c.date && <small>{c.date}</small>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2># courses</h2>
        <div className="tiles">
          {profile.courses?.map((c) => (
            <div className="tile" key={c}>
              <span className="tile-icon">{courseIcon(c)}</span>
              <b>{c}</b>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2># skills</h2>
        <ul className="chips">
          {profile.skills?.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
