"use client";

import { useMemo, useState } from "react";
import { Panel, Row, CopyButton } from "./ui";
import { c, inputStyle, buttonStyle } from "./theme";
import {
  analyze,
  LEVELS,
  crackSeconds,
  formatDuration,
  generatePassword,
} from "./password";

const LEVEL_COLORS = [c.bad, c.bad, c.warn, c.ok, c.ok];

export default function PasswordTool() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [genLen, setGenLen] = useState(16);

  const r = useMemo(() => analyze(pw), [pw]);
  const color = LEVEL_COLORS[r.level];

  return (
    <>
      <Panel title="비밀번호">
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="검사할 비밀번호 입력"
            autoComplete="off"
            spellCheck={false}
            style={inputStyle}
          />
          <button
            onClick={() => setShow(!show)}
            style={{ ...buttonStyle, flexShrink: 0 }}
          >
            {show ? "숨기기" : "보기"}
          </button>
        </div>

        {pw && (
          <>
            <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    background: i <= r.level ? color : c.border,
                    transition: "background 0.2s",
                  }}
                />
              ))}
            </div>
            <p
              style={{
                color,
                fontSize: 20,
                fontWeight: 600,
                margin: "12px 0 0",
              }}
            >
              {LEVELS[r.level]}
            </p>
          </>
        )}
      </Panel>

      {pw && (
        <>
          <Panel title="체크리스트">
            {r.checks.map((ch) => (
              <div
                key={ch.label}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "6px 0",
                  fontSize: 15,
                }}
              >
                <span style={{ color: ch.ok ? c.ok : c.bad, width: 16 }}>
                  {ch.ok ? "✓" : "✗"}
                </span>
                <span style={{ color: ch.ok ? c.text : c.dim }}>
                  {ch.label}
                </span>
              </div>
            ))}
          </Panel>

          <Panel title="분석">
            <Row label="길이" value={`${r.length}자`} copy={false} />
            <Row label="문자 집합 크기" value={r.pool} copy={false} />
            <Row
              label="추정 엔트로피"
              value={`${r.entropy.toFixed(1)} bits`}
              copy={false}
              color={color}
            />
            <Row
              label="온라인 공격 (초당 1천 회)"
              value={formatDuration(crackSeconds(r.entropy, 1e3))}
              copy={false}
            />
            <Row
              label="오프라인 GPU 공격 (초당 100억 회)"
              value={formatDuration(crackSeconds(r.entropy, 1e10))}
              copy={false}
            />
            <p
              style={{
                color: c.dim,
                fontSize: 13,
                lineHeight: 1.6,
                margin: "14px 0 0",
              }}
            >
              엔트로피 = 길이 × log₂(문자 집합 크기). 반복·연속 패턴은 감점하고,
              흔한 비밀번호 목록에 있으면 거의 0으로 본다. 실제 공격은 사전·규칙
              기반이라 이 값은 대략적인 추정이야.
            </p>
          </Panel>
        </>
      )}

      <Panel title="안전한 비밀번호 생성">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <label style={{ color: c.dim, fontSize: 14 }}>
            길이 {genLen}
            <input
              type="range"
              min={8}
              max={40}
              value={genLen}
              onChange={(e) => setGenLen(Number(e.target.value))}
              style={{
                marginLeft: 10,
                accentColor: c.accent,
                verticalAlign: "middle",
              }}
            />
          </label>
          <button
            onClick={() => {
              setPw(generatePassword(genLen));
              setShow(true);
            }}
            style={buttonStyle}
          >
            생성해서 검사하기
          </button>
          {pw && <CopyButton text={pw} />}
        </div>
        <p
          style={{
            color: c.dim,
            fontSize: 13,
            lineHeight: 1.6,
            margin: "12px 0 0",
          }}
        >
          Math.random() 대신 암호학적으로 안전한 crypto.getRandomValues()를
          쓰고, 모듈로 편향을 막으려고 거부 샘플링을 적용했어. 헷갈리는
          문자(0/O, 1/l/I)는 제외.
        </p>
      </Panel>
    </>
  );
}
