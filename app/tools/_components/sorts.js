// 정렬 알고리즘 제너레이터. 배열 a를 직접 바꾸면서 단계마다 이벤트를 yield
// 이벤트: { type: "compare" | "swap" | "write" | "sorted", idx: number[] }

function swap(a, i, j) {
  [a[i], a[j]] = [a[j], a[i]];
}

export function* bubbleSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield { type: "compare", idx: [j, j + 1] };
      if (a[j] > a[j + 1]) {
        swap(a, j, j + 1);
        swapped = true;
        yield { type: "swap", idx: [j, j + 1] };
      }
    }
    yield { type: "sorted", idx: [n - 1 - i] };
    if (!swapped) return;
  }
}

export function* selectionSort(a) {
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: "compare", idx: [min, j] };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      swap(a, i, min);
      yield { type: "swap", idx: [i, min] };
    }
    yield { type: "sorted", idx: [i] };
  }
}

export function* insertionSort(a) {
  for (let i = 1; i < a.length; i++) {
    let j = i;
    while (j > 0) {
      yield { type: "compare", idx: [j - 1, j] };
      if (a[j - 1] > a[j]) {
        swap(a, j - 1, j);
        yield { type: "swap", idx: [j - 1, j] };
        j--;
      } else break;
    }
  }
}

export function* quickSort(a, lo = 0, hi = a.length - 1) {
  if (lo > hi) return;
  if (lo === hi) {
    yield { type: "sorted", idx: [lo] };
    return;
  }
  const pivot = a[hi]; // Lomuto: 마지막 원소를 피벗으로
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield { type: "compare", idx: [j, hi] };
    if (a[j] < pivot) {
      if (i !== j) {
        swap(a, i, j);
        yield { type: "swap", idx: [i, j] };
      }
      i++;
    }
  }
  if (i !== hi) {
    swap(a, i, hi);
    yield { type: "swap", idx: [i, hi] };
  }
  yield { type: "sorted", idx: [i] };
  yield* quickSort(a, lo, i - 1);
  yield* quickSort(a, i + 1, hi);
}

export function* mergeSort(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const mid = (lo + hi) >> 1;
  yield* mergeSort(a, lo, mid);
  yield* mergeSort(a, mid + 1, hi);

  const left = a.slice(lo, mid + 1);
  const right = a.slice(mid + 1, hi + 1);
  let i = 0;
  let j = 0;
  let k = lo;
  while (i < left.length && j < right.length) {
    yield { type: "compare", idx: [k, mid + 1 + j] };
    a[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    yield { type: "write", idx: [k - 1] };
  }
  while (i < left.length) {
    a[k++] = left[i++];
    yield { type: "write", idx: [k - 1] };
  }
  while (j < right.length) {
    a[k++] = right[j++];
    yield { type: "write", idx: [k - 1] };
  }
}

export const ALGORITHMS = {
  bubble: {
    name: "버블 정렬",
    fn: bubbleSort,
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    desc: "인접한 두 원소를 비교해 큰 값을 뒤로 보낸다. 한 바퀴 돌 때마다 가장 큰 값이 맨 뒤에 확정된다.",
  },
  selection: {
    name: "선택 정렬",
    fn: selectionSort,
    best: "O(n²)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: false,
    desc: "남은 구간에서 최솟값을 찾아 맨 앞과 교환한다. 교환 횟수는 적지만 비교는 항상 n²/2번.",
  },
  insertion: {
    name: "삽입 정렬",
    fn: insertionSort,
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
    stable: true,
    desc: "앞쪽 정렬된 구간에 새 원소를 알맞은 위치까지 밀어 넣는다. 거의 정렬된 데이터에 빠르다.",
  },
  quick: {
    name: "퀵 정렬",
    fn: quickSort,
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
    stable: false,
    desc: "피벗보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 나눈 뒤 양쪽을 재귀로 정렬한다.",
  },
  merge: {
    name: "병합 정렬",
    fn: mergeSort,
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
    stable: true,
    desc: "배열을 반으로 계속 쪼갠 뒤, 정렬된 두 조각을 하나로 합치며 올라온다.",
  },
};
