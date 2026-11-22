"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { PAGES, type PageId } from "@/lib/pages";
import type { Profile, Project } from "@/lib/types";
import Intro from "./pages/Intro";
import Projects from "./pages/Projects";
import Spec from "./pages/Spec";
import Contact from "./pages/Contact";

interface Props {
  profile: Profile;
  projects: Project[];
}

const HELP = [
  "next, prev       다음 / 이전 페이지 (← → 방향키도 가능)",
  "ls               페이지 목록",
  "cd <이름|번호>    해당 페이지로 이동",
  "clear            메시지 지우기",
].join("\n");

export default function Terminal({ profile, projects }: Props) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(PAGES.length - 1, i));
    setIndex(next);
    setMessage(null);
    window.history.replaceState(null, "", `#${PAGES[next].id}`);
  }, []);

  // 주소의 #projects 같은 해시로 바로 진입
  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    const i = PAGES.findIndex((p) => p.id === id);
    if (i >= 0) setIndex(i);
  }, []);

  // ← → 방향키로 페이지 이동 (입력창에 글자가 있을 땐 무시)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el.value !== "") return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const find = (q: string): number => {
    const n = Number(q);
    if (Number.isInteger(n) && n >= 1 && n <= PAGES.length) return n - 1;
    return PAGES.findIndex((p) => p.cmd === q || p.id === q);
  };

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const [head, ...rest] = text.split(/\s+/);
    const arg = rest.join(" ");

    switch (head) {
      case "next":
      case "n":
        go(index + 1);
        break;
      case "prev":
      case "p":
        go(index - 1);
        break;
      case "clear":
        setMessage(null);
        break;
      case "help":
        setMessage(HELP);
        break;
      case "ls":
        setMessage(PAGES.map((p, i) => `${i + 1}. ${p.cmd}`).join("\n"));
        break;
      case "cd": {
        const i = find(arg);
        if (i >= 0) go(i);
        else setMessage(`cd: 그런 페이지 없음: ${arg}`);
        break;
      }
      default: {
        const i = find(head);
        if (i >= 0) go(i);
        else setMessage(`command not found: ${head}  (help 입력)`);
      }
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(input);
    setInput("");
  };

  const renderPage = (id: PageId) => {
    switch (id) {
      case "intro":
        return <Intro profile={profile} projectCount={projects.length} />;
      case "projects":
        return <Projects projects={projects} />;
      case "spec":
        return <Spec profile={profile} />;
      case "contact":
        return <Contact profile={profile} />;
    }
  };

  const page = PAGES[index];

  return (
    <div className="term" onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <span className="dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="term-title">guest@portfolio: ~/{page.cmd}</span>
        <span className="page-no">
          {index + 1}/{PAGES.length}
        </span>
      </div>

      <nav className="term-tabs" aria-label="페이지 이동">
        {PAGES.map((p, i) => (
          <button
            key={p.id}
            type="button"
            className={i === index ? "tab active" : "tab"}
            onClick={() => go(i)}
          >
            {p.cmd}
          </button>
        ))}
      </nav>

      <div className="term-body" key={page.id}>
        <p className="cmd-line">
          <span className="ps1">$</span> cat {page.cmd}.txt
        </p>
        {renderPage(page.id)}
      </div>

      {message && <pre className="term-msg">{message}</pre>}

      <form className="term-prompt" onSubmit={onSubmit}>
        <label htmlFor="cmd" className="ps1">
          $
        </label>
        <input
          id="cmd"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="help"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </form>

      <div className="term-pager">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
        >
          ← prev
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === PAGES.length - 1}
        >
          next →
        </button>
      </div>
    </div>
  );
}
