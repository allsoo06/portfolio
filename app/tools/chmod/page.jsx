"use client";

import { useState } from "react";
import { ToolPage, Panel, Row, Chips } from "../_components/ui";
import { c, mono, inputStyle } from "../_components/theme";
import {
  toOctal, toSymbolic, parseOctal, parseSymbolic, toUgo, SETUID, SETGID, STICKY,
} from "../_components/chmod";

const PRESETS = ["644", "755", "600", "700", "777", "4755", "1777"];
const WHO = [
  { label: "소유자 (u)", shift: 6 },
  { label: "그룹 (g)", shift: 3 },
  { label: "기타 (o)", shift: 0 },
];
const PERMS = [
  { label: "읽기 r", bit: 4 },
  { label: "쓰기 w", bit: 2 },
  { label: "실행 x", bit: 1 },
];
const SPECIALS = [
  { label: "setuid", bit: SETUID, desc: "실행 시 파일 소유자 권한으로 실행 (예: /usr/bin/passwd)" },
  { label: "setgid", bit: SETGID, desc: "실행 시 그룹 권한으로 실행 / 디렉터리면 새 파일이 그룹 상속" },
  { label: "sticky", bit: STICKY, desc: "디렉터리 안 파일을 소유자만 삭제 가능 (예: /tmp)" },
];

export default function ChmodPage() {
  const [mode, setMode] = useState(0o755);
  const [octText, setOctText] = useState("755");
  const [symText, setSymText] = useState("rwxr-xr-x");

  const apply = (m) => {
    setMode(m);
    setOctText(toOctal(m));
    setSymText(toSymbolic(m));
  };

  const onOctal = (v) => {
    setOctText(v);
    const m = parseOctal(v);
    if (m !== null) {
      setMode(m);
      setSymText(toSymbolic(m));
    }
  };

  const onSymbolic = (v) => {
    setSymText(v);
    const m = parseSymbolic(v);
    if (m !== null) {
      setMode(m);
      setOctText(toOctal(m));
    }
  };

  const octValid = parseOctal(octText) !== null;
  const symValid = parseSymbolic(symText) !== null;
  const hasSpecial = mode > 0o777;

  return (
    <ToolPage
      course="// 리눅스 시스템 관리"
      title="chmod 계산기"
      subtitle="숫자(755)와 문자(rwxr-xr-x) 표기를 서로 변환해. 체크박스로 권한을 직접 켜고 꺼도 돼."
    >
      <Panel title="입력 (어느 쪽이든 입력하면 반대쪽이 바뀜)">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ color: c.dim, fontSize: 13, marginBottom: 6 }}>숫자 표기</div>
            <input
              value={octText}
              onChange={(e) => onOctal(e.target.value)}
              maxLength={4}
              spellCheck={false}
              style={{ ...inputStyle, fontSize: 22, borderColor: octValid ? c.border : c.bad }}
            />
          </div>
          <div>
            <div style={{ color: c.dim, fontSize: 13, marginBottom: 6 }}>문자 표기</div>
            <input
              value={symText}
              onChange={(e) => onSymbolic(e.target.value)}
              maxLength={10}
              spellCheck={false}
              style={{ ...inputStyle, fontSize: 22, borderColor: symValid ? c.border : c.bad }}
            />
          </div>
        </div>
        <Chips items={PRESETS} onPick={(p) => apply(parseInt(p, 8))} />
      </Panel>

      <Panel title="권한 체크">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: c.dim, fontWeight: 400, padding: 8 }}></th>
              {PERMS.map((p) => (
                <th key={p.bit} style={{ color: c.dim, fontWeight: 400, padding: 8 }}>{p.label}</th>
              ))}
              <th style={{ color: c.dim, fontWeight: 400, padding: 8 }}>합계</th>
            </tr>
          </thead>
          <tbody>
            {WHO.map((w) => {
              const val = (mode >> w.shift) & 7;
              return (
                <tr key={w.shift} style={{ borderTop: `1px solid ${c.border}` }}>
                  <td style={{ padding: 8 }}>{w.label}</td>
                  {PERMS.map((p) => {
                    const flag = p.bit << w.shift;
                    return (
                      <td key={p.bit} style={{ textAlign: "center", padding: 8 }}>
                        <input
                          type="checkbox"
                          checked={(mode & flag) !== 0}
                          onChange={() => apply(mode ^ flag)}
                          style={{ width: 18, height: 18, accentColor: c.accent, cursor: "pointer" }}
                        />
                      </td>
                    );
                  })}
                  <td style={{ textAlign: "center", fontFamily: mono, color: c.accent, fontSize: 18 }}>{val}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${c.border}` }}>
          <div style={{ color: c.dim, fontSize: 13, marginBottom: 8 }}>특수 권한</div>
          {SPECIALS.map((s) => (
            <label key={s.bit} style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "8px 0", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={(mode & s.bit) !== 0}
                onChange={() => apply(mode ^ s.bit)}
                style={{ width: 16, height: 16, accentColor: c.warn, marginTop: 2 }}
              />
              <span>
                <span style={{ fontFamily: mono }}>{s.label}</span>
                <span style={{ color: c.dim, fontSize: 13 }}> — {s.desc}</span>
              </span>
            </label>
          ))}
        </div>
      </Panel>

      <Panel title="명령어">
        <Row label="숫자 방식" value={`chmod ${toOctal(mode)} file`} color={c.accent} />
        <Row
          label="기호 방식"
          value={hasSpecial ? "특수 권한은 숫자 방식 권장" : `chmod ${toUgo(mode)} file`}
          copy={!hasSpecial}
        />
        <Row label="ls -l 출력" value={`-${toSymbolic(mode)} 1 hisu hisu 4096 file`} copy={false} />
      </Panel>

      <p style={{ color: c.dim, fontSize: 13, lineHeight: 1.7 }}>
        r = 4, w = 2, x = 1을 더한 값이 각 자리 숫자야. 예: rwx = 4+2+1 = 7, r-x = 4+0+1 = 5 → 755.
        네 자리일 땐 맨 앞이 특수 권한 (setuid 4, setgid 2, sticky 1). 실행 권한 없이 특수 권한만 있으면 대문자 S/T로 표시돼.
      </p>
    </ToolPage>
  );
}
