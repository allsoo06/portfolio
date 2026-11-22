// chmod 권한 변환 로직. mode는 0 ~ 0o7777 정수

export const SETUID = 0o4000;
export const SETGID = 0o2000;
export const STICKY = 0o1000;

export function toOctal(mode) {
  const s = mode.toString(8);
  return mode > 0o777 ? s.padStart(4, "0") : s.padStart(3, "0");
}

export function toSymbolic(mode) {
  const out = [];
  const who = [
    { shift: 6, special: SETUID, on: "s", off: "S" },
    { shift: 3, special: SETGID, on: "s", off: "S" },
    { shift: 0, special: STICKY, on: "t", off: "T" },
  ];
  for (const w of who) {
    const bits = (mode >> w.shift) & 7;
    out.push(bits & 4 ? "r" : "-");
    out.push(bits & 2 ? "w" : "-");
    const x = bits & 1;
    if (mode & w.special) out.push(x ? w.on : w.off);
    else out.push(x ? "x" : "-");
  }
  return out.join("");
}

export function parseOctal(s) {
  const t = s.trim();
  if (!/^[0-7]{3,4}$/.test(t)) return null;
  return parseInt(t, 8);
}

// rwxr-xr-x, -rwxr-xr-x, drwsr-xr-t 등 허용
export function parseSymbolic(s) {
  let t = s.trim();
  if (t.length === 10 && /^[-dlcbps]/.test(t)) t = t.slice(1);
  if (t.length !== 9) return null;

  const specials = [
    { special: SETUID, on: "s", off: "S" },
    { special: SETGID, on: "s", off: "S" },
    { special: STICKY, on: "t", off: "T" },
  ];
  let mode = 0;
  for (let i = 0; i < 3; i++) {
    const [r, w, x] = t.slice(i * 3, i * 3 + 3);
    const shift = 6 - i * 3;
    const sp = specials[i];
    if (r === "r") mode |= 4 << shift;
    else if (r !== "-") return null;
    if (w === "w") mode |= 2 << shift;
    else if (w !== "-") return null;
    if (x === "x") mode |= 1 << shift;
    else if (x === sp.on) mode |= (1 << shift) | sp.special;
    else if (x === sp.off) mode |= sp.special;
    else if (x !== "-") return null;
  }
  return mode;
}

// u=rwx,g=rx,o=rx 형태 (특수 비트는 숫자 표기로 안내)
export function toUgo(mode) {
  const names = ["u", "g", "o"];
  return names
    .map((n, i) => {
      const bits = (mode >> (6 - i * 3)) & 7;
      return `${n}=${bits & 4 ? "r" : ""}${bits & 2 ? "w" : ""}${bits & 1 ? "x" : ""}`;
    })
    .join(",");
}
