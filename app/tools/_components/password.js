// 비밀번호 강도 추정 로직 (엔트로피 + 패턴 감점)

const COMMON = new Set([
  "password",
  "password1",
  "passw0rd",
  "123456",
  "1234567",
  "12345678",
  "123456789",
  "1234567890",
  "1234",
  "12345",
  "111111",
  "000000",
  "123123",
  "654321",
  "qwerty",
  "qwerty123",
  "qwer1234",
  "asdf1234",
  "1q2w3e4r",
  "1q2w3e4r5t",
  "zaq12wsx",
  "abc123",
  "abcd1234",
  "iloveyou",
  "admin",
  "admin123",
  "root",
  "toor",
  "letmein",
  "welcome",
  "monkey",
  "dragon",
  "football",
  "baseball",
  "sunshine",
  "princess",
  "master",
  "superman",
  "starwars",
  "whatever",
  "trustno1",
  "hello",
  "hello123",
  "test",
  "test123",
  "guest",
  "login",
  "changeme",
  "secret",
  "q1w2e3r4",
  "asdfgh",
  "zxcvbnm",
  "qazwsx",
]);

const SEQUENCES = [
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

function hasSequence(pw) {
  const s = pw.toLowerCase();
  for (let i = 0; i + 3 <= s.length; i++) {
    const chunk = s.slice(i, i + 3);
    const rev = [...chunk].reverse().join("");
    if (SEQUENCES.some((seq) => seq.includes(chunk) || seq.includes(rev)))
      return true;
  }
  return false;
}

export function poolSize(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[!-/:-@[-`{-~ ]/.test(pw)) pool += 33;
  if (/[^\x00-\x7f]/.test(pw)) pool += 100; // 한글 등 비ASCII
  return pool;
}

export function analyze(pw) {
  const length = [...pw].length;
  const lower = pw.toLowerCase();
  const base = lower.replace(/[^a-z]+$/, "").replace(/^[^a-z]+/, "");
  const isCommon = COMMON.has(lower) || (base.length >= 4 && COMMON.has(base));
  const repeated = /(.)\1{2,}/.test(pw);
  const sequence = hasSequence(pw);

  const pool = poolSize(pw);
  let entropy = length && pool ? length * Math.log2(pool) : 0;
  if (repeated) entropy -= 10;
  if (sequence) entropy -= 10;
  if (isCommon) entropy = Math.min(entropy, 8);
  entropy = Math.max(0, entropy);

  const checks = [
    { label: "12자 이상", ok: length >= 12 },
    { label: "소문자 포함", ok: /[a-z]/.test(pw) },
    { label: "대문자 포함", ok: /[A-Z]/.test(pw) },
    { label: "숫자 포함", ok: /[0-9]/.test(pw) },
    { label: "특수문자 포함", ok: /[^a-zA-Z0-9]/.test(pw) },
    { label: "흔한 비밀번호 아님", ok: !isCommon },
    { label: "같은 문자 3번 반복 없음", ok: !repeated },
    { label: "abc / 123 / qwe 같은 연속 없음", ok: !sequence },
  ];

  let level;
  if (entropy < 28) level = 0;
  else if (entropy < 36) level = 1;
  else if (entropy < 60) level = 2;
  else if (entropy < 80) level = 3;
  else level = 4;

  return { length, pool, entropy, level, checks };
}

export const LEVELS = ["매우 약함", "약함", "보통", "강함", "매우 강함"];

// 평균적으로 전체 경우의 수 절반을 시도하면 맞춘다고 가정
export function crackSeconds(entropy, guessesPerSec) {
  return 2 ** Math.max(0, entropy - 1) / guessesPerSec;
}

export function formatDuration(sec) {
  if (sec < 1) return "1초 미만";
  const units = [
    ["년", 31536000],
    ["일", 86400],
    ["시간", 3600],
    ["분", 60],
    ["초", 1],
  ];
  const years = sec / 31536000;
  if (years >= 1e12) return "사실상 불가능";
  if (years >= 1e6) return `약 ${(years / 1e6).toFixed(0)}백만 년`;
  if (years >= 1e4) return `약 ${(years / 1e4).toFixed(0)}만 년`;
  for (const [name, s] of units) {
    if (sec >= s) return `약 ${Math.floor(sec / s).toLocaleString()}${name}`;
  }
  return "1초 미만";
}

// crypto.getRandomValues + 거부 샘플링으로 편향 없는 랜덤 비밀번호
export function generatePassword(length = 16) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*()-_=+[]{};:,.?";
  const limit = 256 - (256 % chars.length);
  const out = [];
  const buf = new Uint8Array(1);
  while (out.length < length) {
    crypto.getRandomValues(buf);
    if (buf[0] < limit) out.push(chars[buf[0] % chars.length]);
  }
  return out.join("");
}
