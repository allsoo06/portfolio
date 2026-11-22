"use client";

import Link from "next/link";
import { useState } from "react";
import { c, mono, sans, buttonStyle } from "./theme";

export function ToolPage({ course, title, subtitle, children }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: c.bg,
        color: c.text,
        padding: "40px 20px 80px",
        fontFamily: sans,
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 16, fontSize: 14 }}>
          <Link href="/tools" style={{ color: c.dim, textDecoration: "none" }}>
            ← 도구 목록
          </Link>
          <Link
            href="/#projects"
            style={{ color: c.dim, textDecoration: "none" }}
          >
            포트폴리오
          </Link>
        </div>
        <p
          style={{
            color: c.accent,
            fontFamily: mono,
            fontSize: 13,
            margin: "28px 0 6px",
          }}
        >
          {course}
        </p>
        <h1 style={{ fontSize: 32, margin: "0 0 8px" }}>{title}</h1>
        <p style={{ color: c.dim, margin: "0 0 28px", lineHeight: 1.6 }}>
          {subtitle}
        </p>
        {children}
      </div>
    </main>
  );
}

export function Panel({ title, children, style }) {
  return (
    <section
      style={{
        background: c.panel,
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        ...style,
      }}
    >
      {title && (
        <h2
          style={{
            fontSize: 14,
            color: c.dim,
            margin: "0 0 14px",
            fontWeight: 500,
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    } catch {
      /* 클립보드 권한 없으면 무시 */
    }
  };
  return (
    <button
      onClick={copy}
      style={{ ...buttonStyle, padding: "4px 10px", fontSize: 12 }}
    >
      {done ? "복사됨" : "복사"}
    </button>
  );
}

export function Row({ label, value, copy = true, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <span style={{ color: c.dim, fontSize: 14, flexShrink: 0 }}>{label}</span>
      <span
        style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}
      >
        <span
          style={{
            fontFamily: mono,
            color: color || c.text,
            wordBreak: "break-all",
            textAlign: "right",
          }}
        >
          {value}
        </span>
        {copy && <CopyButton text={String(value)} />}
      </span>
    </div>
  );
}

export function Chips({ items, onPick }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      {items.map((it) => (
        <button
          key={it}
          onClick={() => onPick(it)}
          style={{
            ...buttonStyle,
            padding: "4px 10px",
            fontSize: 12,
            color: c.dim,
          }}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
