"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Panel } from "./ui";
import { c, mono, buttonStyle, primaryButton } from "./theme";
import { ALGORITHMS } from "./sorts";

function randomArray(n) {
  return Array.from({ length: n }, () => 5 + Math.floor(Math.random() * 96));
}

const EMPTY_HL = { compare: [], swap: [] };

export default function SortTool() {
  const [algo, setAlgo] = useState("bubble");
  const [size, setSize] = useState(30);
  const [delay, setDelay] = useState(60);
  const [arr, setArr] = useState([]);
  const [hl, setHl] = useState(EMPTY_HL);
  const [sorted, setSorted] = useState(new Set());
  const [stats, setStats] = useState({ compare: 0, swap: 0 });
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const workRef = useRef([]);
  const genRef = useRef(null);

  const clearRun = () => {
    genRef.current = null;
    setHl(EMPTY_HL);
    setSorted(new Set());
    setStats({ compare: 0, swap: 0 });
    setRunning(false);
    setDone(false);
  };

  const shuffle = useCallback((n) => {
    const a = randomArray(n);
    workRef.current = a;
    setArr([...a]);
    clearRun();
  }, []);

  // 처음 마운트 시 랜덤 배열 생성 (SSR 하이드레이션 불일치 방지용으로 effect 안에서)
  useEffect(() => {
    shuffle(30);
  }, [shuffle]);

  const step = useCallback(() => {
    if (!genRef.current) {
      genRef.current = ALGORITHMS[algo].fn(workRef.current);
    }
    const { value, done: finished } = genRef.current.next();

    if (finished) {
      setRunning(false);
      setDone(true);
      setHl(EMPTY_HL);
      setSorted(new Set(workRef.current.map((_, i) => i)));
      return;
    }

    setArr([...workRef.current]);
    if (value.type === "compare") {
      setHl({ compare: value.idx, swap: [] });
      setStats((s) => ({ ...s, compare: s.compare + 1 }));
    } else if (value.type === "swap" || value.type === "write") {
      setHl({ compare: [], swap: value.idx });
      setStats((s) => ({ ...s, swap: s.swap + 1 }));
    } else if (value.type === "sorted") {
      setSorted((prev) => new Set([...prev, ...value.idx]));
    }
  }, [algo]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, delay);
    return () => clearInterval(id);
  }, [running, delay, step]);

  const changeAlgo = (key) => {
    setAlgo(key);
    clearRun();
  };

  const info = ALGORITHMS[algo];
  const max = Math.max(...arr, 1);
  const showLabels = arr.length <= 25;

  const barColor = (i) => {
    if (hl.swap.includes(i)) return c.bad;
    if (hl.compare.includes(i)) return c.warn;
    if (sorted.has(i)) return c.ok;
    return c.bar;
  };

  return (
    <>
      <Panel title="알고리즘">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Object.entries(ALGORITHMS).map(([key, a]) => (
            <button
              key={key}
              onClick={() => changeAlgo(key)}
              disabled={running}
              style={
                key === algo
                  ? primaryButton
                  : { ...buttonStyle, opacity: running ? 0.5 : 1 }
              }
            >
              {a.name}
            </button>
          ))}
        </div>
        <p
          style={{
            color: c.dim,
            fontSize: 14,
            lineHeight: 1.6,
            margin: "12px 0 0",
          }}
        >
          {info.desc}
        </p>
      </Panel>

      <Panel>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: arr.length > 50 ? 1 : 3,
            height: 320,
            padding: "0 4px",
          }}
        >
          {arr.map((v, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${(v / max) * 100}%`,
                background: barColor(i),
                borderRadius: "3px 3px 0 0",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                transition: "height 0.08s",
              }}
            >
              {showLabels && (
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    color: c.text,
                    marginTop: 3,
                  }}
                >
                  {v}
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginTop: 14,
            fontSize: 13,
            color: c.dim,
          }}
        >
          <span>
            <span style={{ color: c.warn }}>■</span> 비교 중
          </span>
          <span>
            <span style={{ color: c.bad }}>■</span> 교환/쓰기
          </span>
          <span>
            <span style={{ color: c.ok }}>■</span> 확정
          </span>
          <span style={{ marginLeft: "auto", fontFamily: mono }}>
            비교 <span style={{ color: c.text }}>{stats.compare}</span> ·
            교환/쓰기 <span style={{ color: c.text }}>{stats.swap}</span>
            {done && <span style={{ color: c.ok }}> · 완료</span>}
          </span>
        </div>
      </Panel>

      <Panel title="컨트롤">
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setRunning(!running)}
            disabled={done}
            style={{ ...primaryButton, opacity: done ? 0.5 : 1 }}
          >
            {running ? "일시정지" : "시작"}
          </button>
          <button
            onClick={step}
            disabled={running || done}
            style={{ ...buttonStyle, opacity: running || done ? 0.5 : 1 }}
          >
            한 단계
          </button>
          <button onClick={() => shuffle(size)} style={buttonStyle}>
            새 배열
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 16,
          }}
        >
          <label style={{ color: c.dim, fontSize: 14 }}>
            개수: {size}
            <input
              type="range"
              min={5}
              max={80}
              value={size}
              disabled={running}
              onChange={(e) => {
                const n = Number(e.target.value);
                setSize(n);
                shuffle(n);
              }}
              style={{ width: "100%", accentColor: c.accent }}
            />
          </label>
          <label style={{ color: c.dim, fontSize: 14 }}>
            속도: {delay}ms / 단계
            <input
              type="range"
              min={5}
              max={500}
              value={505 - delay}
              onChange={(e) => setDelay(505 - Number(e.target.value))}
              style={{ width: "100%", accentColor: c.accent }}
            />
          </label>
        </div>
      </Panel>

      <Panel title="복잡도 비교">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 13,
            fontFamily: mono,
          }}
        >
          <thead>
            <tr style={{ color: c.dim }}>
              {["알고리즘", "최선", "평균", "최악", "공간", "안정"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px 6px",
                    fontWeight: 400,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(ALGORITHMS).map(([key, a]) => (
              <tr
                key={key}
                style={{
                  borderTop: `1px solid ${c.border}`,
                  color: key === algo ? c.accent : c.text,
                }}
              >
                <td style={{ padding: "8px 6px" }}>{a.name}</td>
                <td style={{ padding: "8px 6px" }}>{a.best}</td>
                <td style={{ padding: "8px 6px" }}>{a.avg}</td>
                <td style={{ padding: "8px 6px" }}>{a.worst}</td>
                <td style={{ padding: "8px 6px" }}>{a.space}</td>
                <td style={{ padding: "8px 6px" }}>{a.stable ? "O" : "X"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
