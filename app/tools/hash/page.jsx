"use client";

import { useEffect, useState } from "react";
import { ToolPage, Panel, Row } from "../_components/ui";
import { c, mono, inputStyle, buttonStyle, primaryButton } from "../_components/theme";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function toBase64(buf) {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s);
}

function diffBits(hexA, hexB) {
  let count = 0;
  for (let i = 0; i < hexA.length; i++) {
    let x = parseInt(hexA[i], 16) ^ parseInt(hexB[i], 16);
    while (x) {
      count += x & 1;
      x >>= 1;
    }
  }
  return count;
}

async function digest(algo, data) {
  return crypto.subtle.digest(algo, data);
}

export default function HashPage() {
  const [algo, setAlgo] = useState("SHA-256");
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("hello");
  const [file, setFile] = useState(null);
  const [hex, setHex] = useState("");
  const [b64, setB64] = useState("");
  const [avalanche, setAvalanche] = useState(null);
  const [expected, setExpected] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (typeof crypto === "undefined" || !crypto.subtle) {
        setError("crypto.subtle은 HTTPS 또는 localhost에서만 사용 가능해.");
        return;
      }
      setError("");

      let data;
      if (mode === "text") {
        data = new TextEncoder().encode(text);
      } else {
        if (!file) {
          setHex("");
          setB64("");
          return;
        }
        data = await file.arrayBuffer();
      }

      const buf = await digest(algo, data);
      if (cancelled) return;
      const h = toHex(buf);
      setHex(h);
      setB64(toBase64(buf));

      // 눈사태 효과: 마지막 글자의 비트 하나만 뒤집은 입력과 비교
      if (mode === "text" && text.length > 0) {
        const chars = [...text];
        const last = chars[chars.length - 1];
        chars[chars.length - 1] = String.fromCodePoint(last.codePointAt(0) ^ 1);
        const changed = chars.join("");
        const h2 = toHex(await digest(algo, new TextEncoder().encode(changed)));
        if (cancelled) return;
        setAvalanche({ changed, hash: h2, diff: diffBits(h, h2), total: h.length * 4 });
      } else {
        setAvalanche(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [algo, mode, text, file]);

  const exp = expected.trim().toLowerCase();
  const match = exp && hex ? exp === hex : null;

  return (
    <ToolPage
      course="// 암호학 기초"
      title="SHA-256 해시 생성기"
      subtitle="브라우저 내장 Web Crypto API(crypto.subtle.digest)로 해시를 계산해. 파일도 서버에 올라가지 않아."
    >
      <Panel title="알고리즘">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ALGOS.map((a) => (
            <button key={a} onClick={() => setAlgo(a)} style={a === algo ? primaryButton : buttonStyle}>
              {a}
            </button>
          ))}
        </div>
        {algo === "SHA-1" && (
          <p style={{ color: c.warn, fontSize: 13, margin: "10px 0 0" }}>
            SHA-1은 2017년 충돌이 실증돼서(SHAttered) 보안 용도로는 쓰면 안 돼. 비교용으로만.
          </p>
        )}
      </Panel>

      <Panel title="입력">
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={() => setMode("text")} style={mode === "text" ? primaryButton : buttonStyle}>텍스트</button>
          <button onClick={() => setMode("file")} style={mode === "file" ? primaryButton : buttonStyle}>파일</button>
        </div>
        {mode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            spellCheck={false}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        ) : (
          <div>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              style={{ color: c.dim, fontSize: 14 }}
            />
            {file && (
              <p style={{ color: c.dim, fontSize: 13, margin: "8px 0 0" }}>
                {file.name} · {file.size.toLocaleString()} bytes
              </p>
            )}
          </div>
        )}
        {error && <p style={{ color: c.bad, fontSize: 14, margin: "10px 0 0" }}>{error}</p>}
      </Panel>

      {hex && (
        <Panel title="결과">
          <Row label={`${algo} (hex)`} value={hex} color={c.accent} />
          <Row label="Base64" value={b64} />
          <Row label="길이" value={`${hex.length * 4} bits / ${hex.length / 2} bytes`} copy={false} />
        </Panel>
      )}

      <Panel title="해시 검증 (다운로드 파일 무결성 확인용)">
        <input
          value={expected}
          onChange={(e) => setExpected(e.target.value)}
          placeholder="공식 사이트에 적힌 해시값 붙여넣기"
          spellCheck={false}
          style={{
            ...inputStyle,
            fontSize: 13,
            borderColor: match === null ? c.border : match ? c.accent : c.bad,
          }}
        />
        {match !== null && (
          <p style={{ color: match ? c.accent : c.bad, fontSize: 15, margin: "10px 0 0" }}>
            {match ? "✓ 일치 — 변조되지 않음" : "✗ 불일치 — 파일이 다르거나 변조됨"}
          </p>
        )}
      </Panel>

      {avalanche && (
        <Panel title="눈사태 효과 (Avalanche Effect)">
          <p style={{ color: c.dim, fontSize: 14, margin: "0 0 12px", lineHeight: 1.6 }}>
            입력의 마지막 글자에서 비트 하나만 바꾸면 해시는 이렇게 바뀌어:
          </p>
          <div style={{ fontFamily: mono, fontSize: 13, lineHeight: 1.8, wordBreak: "break-all" }}>
            <div><span style={{ color: c.dim }}>원본 입력 </span>{JSON.stringify(text)}</div>
            <div><span style={{ color: c.dim }}>변경 입력 </span>{JSON.stringify(avalanche.changed)}</div>
            <div style={{ marginTop: 8 }}>
              {hex.split("").map((ch, i) => (
                <span key={i} style={{ color: ch === avalanche.hash[i] ? c.dim : c.text }}>{ch}</span>
              ))}
            </div>
            <div>
              {avalanche.hash.split("").map((ch, i) => (
                <span key={i} style={{ color: ch === hex[i] ? c.dim : c.warn }}>{ch}</span>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 15, margin: "12px 0 0" }}>
            <span style={{ color: c.warn, fontFamily: mono }}>{avalanche.diff}</span>
            <span style={{ color: c.dim }}> / {avalanche.total} 비트 변경 ({((avalanche.diff / avalanche.total) * 100).toFixed(1)}%, 이상적인 값은 약 50%)</span>
          </p>
        </Panel>
      )}
    </ToolPage>
  );
}
