"use client";

import { FormEvent, useState } from "react";

interface Task {
  id: number;
  title: string;
  days: number; // 마감까지 남은 일수
  hours: number; // 예상 소요 시간
}

interface Step {
  name: string;
  days: number;
}

interface PlanItem {
  task: Task;
  perDay: number;
  steps: Step[];
}

const SAMPLE: Task[] = [
  { id: 1, title: "자료구조 과제 3 (트리 구현)", days: 3, hours: 6 },
  { id: 2, title: "컴퓨터 네트워크 레포트", days: 6, hours: 4 },
  { id: 3, title: "C 프로그래밍 퀴즈 준비", days: 1, hours: 2 },
];

// 실제 AI 호출 없이, 정해진 규칙으로 계산해서 "AI가 분석한 것처럼" 보여주는 체험판 로직
function makePlan(tasks: Task[]): PlanItem[] {
  return [...tasks]
    .sort((a, b) => a.days - b.days || b.hours - a.hours)
    .map((task) => {
      const d = Math.max(task.days, 1);
      const last = d >= 3 ? 1 : 0;
      const first = Math.ceil((d - last) / 2);
      const middle = d - last - first;
      const steps = [
        { name: "자료 조사", days: first },
        { name: "초안 작성", days: middle },
        { name: "검토·제출", days: last },
      ].filter((s) => s.days > 0);
      return { task, perDay: Math.round((task.hours / d) * 10) / 10, steps };
    });
}

function level(days: number): { label: string; cls: string } {
  if (days <= 1) return { label: "긴급", cls: "pill hot" };
  if (days <= 3) return { label: "주의", cls: "pill warn" };
  return { label: "여유", cls: "pill" };
}

export default function AssignmentDemo() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE);
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(3);
  const [hours, setHours] = useState(3);
  const [plan, setPlan] = useState<PlanItem[] | null>(null);
  const [loading, setLoading] = useState(false);

  const add = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks((t) => [
      ...t,
      { id: Date.now(), title: title.trim(), days, hours },
    ]);
    setTitle("");
    setPlan(null);
  };

  const remove = (id: number) => {
    setTasks((t) => t.filter((x) => x.id !== id));
    setPlan(null);
  };

  const analyze = () => {
    setLoading(true);
    setPlan(null);
    setTimeout(() => {
      setPlan(makePlan(tasks));
      setLoading(false);
    }, 900);
  };

  return (
    <div className="demo">
      <p className="hint">
        체험판: 실제 AI 호출 없이 미리 정한 규칙으로 계산한 예시예요.
      </p>

      <ul className="demo-list">
        {tasks.map((t) => (
          <li key={t.id}>
            <span>{t.title}</span>
            <span className="hint">
              D-{t.days} · {t.hours}시간
            </span>
            <button
              type="button"
              className="icon-btn"
              onClick={() => remove(t.id)}
              aria-label="삭제"
            >
              ✕
            </button>
          </li>
        ))}
        {tasks.length === 0 && <li className="hint">과제를 추가해 보세요.</li>}
      </ul>

      <form className="demo-form" onSubmit={add}>
        <input
          className="input grow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="과제 이름"
        />
        <label className="field">
          마감 D-
          <input
            className="input num"
            type="number"
            min={0}
            max={30}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
        </label>
        <label className="field">
          예상
          <input
            className="input num"
            type="number"
            min={1}
            max={40}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
          />
          시간
        </label>
        <button type="submit" className="btn">
          추가
        </button>
      </form>

      <button
        type="button"
        className="btn primary"
        onClick={analyze}
        disabled={loading || tasks.length === 0}
      >
        {loading ? "AI 분석 중..." : "AI 우선순위 분석"}
      </button>

      {plan && (
        <ol className="plan">
          {plan.map((p, i) => {
            const lv = level(p.task.days);
            return (
              <li key={p.task.id}>
                <div className="plan-head">
                  <b>
                    {i + 1}순위 · {p.task.title}
                  </b>
                  <span className={lv.cls}>{lv.label}</span>
                </div>
                <p className="hint">
                  하루 약 {p.perDay}시간씩 ·{" "}
                  {p.steps.map((s) => `${s.name} ${s.days}일`).join(" → ")}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
