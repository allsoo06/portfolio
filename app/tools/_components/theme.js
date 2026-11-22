export const c = {
  bg: "var(--page-bg)",
  panel: "var(--tool-panel, var(--panel))",
  field: "var(--tool-field, var(--card))",
  border: "var(--border)",
  text: "var(--fg)",
  dim: "var(--muted)",
  accent: "var(--accent)",
  blue: "var(--accent)",
  ok: "#2f9e44",
  warn: "#b35c00",
  bad: "#c92a2a",
  bar: "#a9b8ee",
  onAccent: "#ffffff",
};

export const mono = "var(--font)";
export const sans = "var(--font)";

export const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  background: c.field,
  color: c.text,
  border: `1px solid ${c.border}`,
  borderRadius: 8,
  fontFamily: mono,
  fontSize: 16,
  outline: "none",
};

export const buttonStyle = {
  padding: "8px 14px",
  background: c.panel,
  color: c.text,
  border: `1px solid ${c.border}`,
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  fontFamily: mono,
};

export const primaryButton = {
  ...buttonStyle,
  background: c.accent,
  color: c.onAccent,
  border: `1px solid ${c.accent}`,
  fontWeight: 600,
};
