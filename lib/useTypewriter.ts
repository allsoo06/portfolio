import { useEffect, useState } from "react";

// 글자가 한 글자씩 타이핑되는 효과. 모션 줄이기 설정이면 바로 전체 표시.
export function useTypewriter(text: string, speed = 22): string {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(text.length);
      return;
    }
    setN(0);
    const timer = setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          clearInterval(timer);
          return v;
        }
        return v + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return text.slice(0, n);
}
