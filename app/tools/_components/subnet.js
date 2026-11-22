// IPv4 서브넷 계산 로직

export function ipToInt(s) {
  const parts = s.trim().split(".");
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p)) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function intToIp(n) {
  return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}

export function toBin(n) {
  return (n >>> 0).toString(2).padStart(32, "0");
}

export function prefixToMask(p) {
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

function popcount(n) {
  let count = 0;
  while (n) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}

// 255.255.255.0 같은 마스크 → 24. 연속된 1이 아니면 null
export function maskToPrefix(m) {
  const inv = ~m >>> 0;
  if ((inv & (inv + 1)) !== 0) return null;
  return popcount(m);
}

function ipClass(ip) {
  const o = ip >>> 24;
  if (o < 128) return "A";
  if (o < 192) return "B";
  if (o < 224) return "C";
  if (o < 240) return "D (멀티캐스트)";
  return "E (예약)";
}

function inRange(ip, base, prefix) {
  const m = prefixToMask(prefix);
  return (ip & m) >>> 0 === (ipToInt(base) & m) >>> 0;
}

function ipType(ip) {
  if (
    inRange(ip, "10.0.0.0", 8) ||
    inRange(ip, "172.16.0.0", 12) ||
    inRange(ip, "192.168.0.0", 16)
  )
    return "사설 (RFC 1918)";
  if (inRange(ip, "127.0.0.0", 8)) return "루프백";
  if (inRange(ip, "169.254.0.0", 16)) return "링크 로컬";
  if (inRange(ip, "100.64.0.0", 10)) return "CGNAT (RFC 6598)";
  if (inRange(ip, "224.0.0.0", 4)) return "멀티캐스트";
  if (inRange(ip, "0.0.0.0", 8)) return "현재 네트워크";
  return "공인";
}

// "192.168.1.10/24" 또는 "192.168.1.10/255.255.255.0" 또는 "192.168.1.10 255.255.255.0"
export function parseInput(input) {
  const s = input.trim();
  if (!s) return { error: "IP/CIDR를 입력해줘. 예: 192.168.1.10/24" };
  const m = s.split(/\s*\/\s*|\s+/);
  if (m.length !== 2) return { error: "형식: IP/CIDR (예: 192.168.1.10/24)" };

  const ip = ipToInt(m[0]);
  if (ip === null) return { error: "IP 주소가 올바르지 않아 (각 옥텟 0~255)" };

  let prefix;
  if (/^\d{1,2}$/.test(m[1])) {
    prefix = Number(m[1]);
    if (prefix > 32) return { error: "CIDR는 0~32 사이여야 해" };
  } else {
    const mask = ipToInt(m[1]);
    if (mask === null) return { error: "서브넷 마스크가 올바르지 않아" };
    prefix = maskToPrefix(mask);
    if (prefix === null)
      return {
        error: "마스크의 1 비트가 연속되지 않아 (예: 255.255.0.255 불가)",
      };
  }
  return { ip, prefix };
}

export function calc(ip, prefix) {
  const mask = prefixToMask(prefix);
  const wildcard = ~mask >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = 2 ** (32 - prefix);

  let usable, first, last;
  if (prefix === 32) {
    usable = 1;
    first = last = network;
  } else if (prefix === 31) {
    // RFC 3021: 점대점 링크는 2개 모두 사용
    usable = 2;
    first = network;
    last = broadcast;
  } else {
    usable = total - 2;
    first = network + 1;
    last = broadcast - 1;
  }

  return {
    ip: intToIp(ip),
    cidr: `${intToIp(network)}/${prefix}`,
    mask: intToIp(mask),
    wildcard: intToIp(wildcard),
    network: intToIp(network),
    broadcast: prefix >= 31 ? "없음" : intToIp(broadcast),
    first: intToIp(first),
    last: intToIp(last),
    total,
    usable,
    ipClass: ipClass(ip),
    type: ipType(ip),
    ipBin: toBin(ip),
    maskBin: toBin(mask),
    networkBin: toBin(network),
  };
}
