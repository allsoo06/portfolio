"use client";

import { useState } from "react";

// 이 사이트가 실제로 DB에서 데이터를 읽어오는 걸 직접 확인하는 데모 (진짜로 동작함)
export default function PortfolioDemo() {
  const [json, setJson] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setJson(JSON.stringify(await res.json(), null, 2));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="demo">
      <p className="hint">
        진짜 동작하는 데모: 버튼을 누르면 이 사이트의 API를 실제로 호출해요.
      </p>

      <div className="flow">
        <span>Browser</span>
        <i>→</i>
        <span>Next.js API</span>
        <i>→</i>
        <span>MongoDB</span>
      </div>

      <button
        type="button"
        className="btn primary"
        onClick={load}
        disabled={loading}
      >
        {loading ? "불러오는 중..." : "GET /api/projects"}
      </button>

      {error && <p className="err">에러: {error}</p>}
      {json && <pre className="json">{json}</pre>}
    </div>
  );
}
