"use client";

import { useState } from "react";

const PRODUCTS = [
  { id: 1, name: "기계식 키보드", price: 89000 },
  { id: 2, name: "무선 마우스", price: 35000 },
  { id: 3, name: "USB-C 허브", price: 42000 },
  { id: 4, name: "노트북 거치대", price: 28000 },
];

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function ShopDemo() {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const change = (id: number, diff: number) => {
    setDone(false);
    setCart((c) => {
      const next = { ...c, [id]: (c[id] ?? 0) + diff };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  };

  const items = PRODUCTS.filter((p) => cart[p.id]);
  const total = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);

  const checkout = () => {
    setCart({});
    setDone(true);
  };

  return (
    <div className="demo">
      <p className="hint">체험판: 예시 상품이고 실제 결제는 일어나지 않아요.</p>

      <div className="shop-grid">
        {PRODUCTS.map((p) => (
          <div className="product" key={p.id}>
            <div className="product-img">{p.name.charAt(0)}</div>
            <b>{p.name}</b>
            <span className="hint">{won(p.price)}</span>
            <button
              type="button"
              className="btn"
              onClick={() => change(p.id, 1)}
            >
              담기
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <b>장바구니</b>
        {items.length === 0 && !done && <p className="hint">비어 있어요.</p>}
        {done && <p className="ok">주문이 완료됐어요 (체험판)</p>}
        {items.map((p) => (
          <div className="cart-row" key={p.id}>
            <span>{p.name}</span>
            <span className="qty">
              <button
                type="button"
                className="icon-btn"
                onClick={() => change(p.id, -1)}
              >
                −
              </button>
              {cart[p.id]}
              <button
                type="button"
                className="icon-btn"
                onClick={() => change(p.id, 1)}
              >
                +
              </button>
            </span>
            <span>{won(p.price * cart[p.id])}</span>
          </div>
        ))}
        {items.length > 0 && (
          <div className="cart-total">
            <b>합계 {won(total)}</b>
            <button type="button" className="btn primary" onClick={checkout}>
              결제하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
