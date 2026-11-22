// TCP 3-way handshake 를 CSS 로만 그린 반복 애니메이션 (네트워크 수업 컨셉)
export default function HandshakeViz() {
  return (
    <div className="hs" role="img" aria-label="TCP 3-way handshake 애니메이션">
      <div className="hs-node">
        <span>💻</span>
        <small>Client</small>
      </div>
      <div className="hs-lines">
        <div className="hs-row r1">
          <em>SYN</em>
          <i />
        </div>
        <div className="hs-row r2 back">
          <em>SYN-ACK</em>
          <i />
        </div>
        <div className="hs-row r3">
          <em>ACK</em>
          <i />
        </div>
      </div>
      <div className="hs-node">
        <span>🖥️</span>
        <small>Server</small>
      </div>
    </div>
  );
}
