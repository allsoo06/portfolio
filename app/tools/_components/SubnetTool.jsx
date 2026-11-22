"use client";

import { useMemo, useState } from "react";
import { Panel, Row, Chips } from "./ui";
import { c, mono, inputStyle } from "./theme";
import { parseInput, calc } from "./subnet";

const PRESETS = [
  "192.168.1.10/24",
  "10.0.0.5/8",
  "172.16.5.4/20",
  "203.0.113.77/27",
  "192.168.0.1/30",
];

function BitRow({ label, bits, prefix }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "6px 0",
        flexWrap: "wrap",
      }}
    >
      <span style={{ width: 70, color: c.dim, fontSize: 13 }}>{label}</span>
      <span style={{ fontFamily: mono, fontSize: 14, letterSpacing: 1 }}>
        {bits.split("").map((b, i) => (
          <span key={i}>
            <span style={{ color: i < prefix ? c.blue : c.warn }}>{b}</span>
            {i % 8 === 7 && i !== 31 && <span style={{ color: c.dim }}>.</span>}
          </span>
        ))}
      </span>
    </div>
  );
}

export default function SubnetTool() {
  const [input, setInput] = useState("192.168.1.10/24");

  const { result, error, prefix } = useMemo(() => {
    const parsed = parseInput(input);
    if (parsed.error) return { error: parsed.error };
    return { result: calc(parsed.ip, parsed.prefix), prefix: parsed.prefix };
  }, [input]);

  return (
    <>
      <Panel title="입력">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="192.168.1.10/24 또는 192.168.1.10 255.255.255.0"
          spellCheck={false}
          style={{ ...inputStyle, borderColor: error ? c.bad : c.border }}
        />
        {error && (
          <p style={{ color: c.bad, fontSize: 14, margin: "10px 0 0" }}>
            {error}
          </p>
        )}
        <Chips items={PRESETS} onPick={setInput} />
      </Panel>

      {result && (
        <>
          <Panel title="결과">
            <Row label="네트워크 (CIDR)" value={result.cidr} color={c.accent} />
            <Row label="네트워크 주소" value={result.network} />
            <Row label="브로드캐스트 주소" value={result.broadcast} />
            <Row label="서브넷 마스크" value={result.mask} />
            <Row label="와일드카드 마스크" value={result.wildcard} />
            <Row label="첫 번째 호스트" value={result.first} />
            <Row label="마지막 호스트" value={result.last} />
            <Row
              label="전체 주소 수"
              value={result.total.toLocaleString()}
              copy={false}
            />
            <Row
              label="사용 가능 호스트 수"
              value={result.usable.toLocaleString()}
              copy={false}
              color={c.accent}
            />
            <Row label="클래스" value={result.ipClass} copy={false} />
            <Row label="주소 유형" value={result.type} copy={false} />
          </Panel>

          <Panel title="2진수로 보기">
            <BitRow label="IP" bits={result.ipBin} prefix={prefix} />
            <BitRow label="마스크" bits={result.maskBin} prefix={prefix} />
            <BitRow label="네트워크" bits={result.networkBin} prefix={prefix} />
            <p
              style={{
                color: c.dim,
                fontSize: 13,
                lineHeight: 1.6,
                margin: "14px 0 0",
              }}
            >
              <span style={{ color: c.blue }}>파란색</span>은 네트워크 부분(
              {prefix}비트), <span style={{ color: c.warn }}>주황색</span>은
              호스트 부분({32 - prefix}비트). 네트워크 주소 = IP AND 마스크,
              브로드캐스트 = 네트워크 주소 OR 와일드카드. 호스트 수 = 2^
              {32 - prefix} − 2 (네트워크·브로드캐스트 주소 제외, /31·/32는
              예외).
            </p>
          </Panel>
        </>
      )}
    </>
  );
}
