/* =========================================================
   図（SVG）生成モジュール
   すべて currentColor ベースで描くのでダーク/ライト両対応
   ========================================================= */
const FIG = (() => {
  const NS = 'stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const svg = (w, h, body, cls = '') =>
    `<svg class="fig ${cls}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;
  const line = (x1, y1, x2, y2, extra = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${NS} ${extra}/>`;
  const poly = (pts, extra = '') => `<polyline points="${pts}" ${NS} ${extra}/>`;
  const txt = (x, y, s, extra = '') =>
    `<text x="${x}" y="${y}" fill="currentColor" font-size="13" ${extra}>${s}</text>`;
  const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="currentColor"/>`;

  // 矢じり：(x1,y1)->(x2,y2) の向きで先端が (x2,y2)
  function arrow(x1, y1, x2, y2, size = 7, color = 'currentColor') {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const p1 = [x2 - size * Math.cos(a - 0.4), y2 - size * Math.sin(a - 0.4)];
    const p2 = [x2 - size * Math.cos(a + 0.4), y2 - size * Math.sin(a + 0.4)];
    return `<polygon points="${x2},${y2} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}" fill="${color}" stroke="none"/>`;
  }
  // 抵抗（ジグザグ） 縦 or 横
  function resV(x, y1, y2, label) {
    const n = 6, len = y2 - y1, seg = (len * 0.6) / n, st = y1 + len * 0.2;
    let p = `${x},${y1} ${x},${st}`;
    for (let i = 0; i < n; i++) p += ` ${x + (i % 2 ? -7 : 7)},${st + seg * (i + 0.5)}`;
    p += ` ${x},${st + seg * n} ${x},${y2}`;
    return poly(p) + (label ? txt(x + 12, (y1 + y2) / 2 + 4, label, 'font-style="italic"') : '');
  }
  function resH(x1, x2, y, label) {
    const n = 6, len = x2 - x1, seg = (len * 0.6) / n, st = x1 + len * 0.2;
    let p = `${x1},${y} ${st},${y}`;
    for (let i = 0; i < n; i++) p += ` ${st + seg * (i + 0.5)},${y + (i % 2 ? -7 : 7)}`;
    p += ` ${st + seg * n},${y} ${x2},${y}`;
    return poly(p) + (label ? txt((x1 + x2) / 2 - 10, y - 12, label, 'font-style="italic"') : '');
  }
  // 電池（縦）：上が+（長い線）
  function batV(x, y1, y2, label, plusTop = true) {
    const m = (y1 + y2) / 2;
    const long = line(x - 14, plusTop ? m - 4 : m + 4, x + 14, plusTop ? m - 4 : m + 4);
    const short = `<line x1="${x - 7}" y1="${plusTop ? m + 4 : m - 4}" x2="${x + 7}" y2="${plusTop ? m + 4 : m - 4}" ${NS} stroke-width="4"/>`;
    return line(x, y1, x, m - 4) + line(x, m + 4, x, y2) + long + short +
      (label ? txt(x + 18, m + 5, label, 'font-style="italic"') : '');
  }
  // 交流電源（縦）
  function acV(x, y1, y2, label) {
    const m = (y1 + y2) / 2;
    return line(x, y1, x, m - 13) + line(x, m + 13, x, y2) +
      `<circle cx="${x}" cy="${m}" r="13" ${NS}/>` +
      `<path d="M${x - 7},${m} q3.5,-8 7,0 t7,0" ${NS}/>` +
      (label ? txt(x - 50, m + 5, label, 'font-style="italic"') : '');
  }
  const gnd = (x, y) => line(x, y, x, y + 8) + line(x - 10, y + 8, x + 10, y + 8) + line(x - 6, y + 12, x + 6, y + 12) + line(x - 2, y + 16, x + 2, y + 16);

  // バイポーラトランジスタ（中心 0,0 のローカル座標）。端子 B(-32,0) C(14,-32) E(14,32)
  function bjtLocal(type = 'npn') {
    let s = `<circle cx="0" cy="0" r="24" ${NS}/>`;
    s += line(-32, 0, -7, 0) + line(-7, -13, -7, 13, 'stroke-width="3"');
    s += line(-7, -6, 14, -20) + line(14, -20, 14, -32);
    s += line(-7, 6, 14, 20) + line(14, 20, 14, 32);
    s += type === 'npn' ? arrow(-7, 6, 12, 19, 9) : arrow(14, 20, -5, 7, 9);
    return s;
  }
  function bjt(x, y, type = 'npn', labels = true, tf = '') {
    const g = `<g transform="translate(${x},${y}) ${tf}">${bjtLocal(type)}</g>`;
    if (!labels || tf) return g;
    return g + txt(x - 34, y - 6, 'B') + txt(x + 18, y - 26, 'C') + txt(x + 18, y + 34, 'E');
  }

  /* ---------- 問題Ⅰ：接地方式 3 回路 ---------- */
  function collectorGrounded() {
    let s = bjt(120, 70, 'npn');
    s += line(88, 70, 50, 70) + acV(50, 70, 135) + batV(50, 135, 190, '');
    s += line(50, 190, 280, 190);
    s += line(134, 38, 134, 25) + line(134, 25, 270, 25) + batV(270, 25, 190, '');
    s += line(134, 102, 134, 120) + resV(134, 120, 175, 'R<tspan font-size="9">L</tspan>') + line(134, 175, 134, 190) + dot(134, 190);
    return svg(300, 210, s);
  }
  function baseGrounded() {
    // B 下向き、E 左、C 右
    let s = `<g transform="translate(150,60) scale(-1,1) rotate(-90)">${bjtLocal('npn')}</g>`;
    s += txt(108, 38, 'E') + txt(180, 38, 'C') + txt(156, 104, 'B');
    s += line(118, 46, 50, 46) + acV(50, 46, 120) + batV(50, 120, 180, '');
    s += line(182, 46, 250, 46) + resV(250, 46, 110, 'R<tspan font-size="9">L</tspan>') + batV(250, 110, 180, '');
    s += line(150, 92, 150, 190) + line(50, 180, 50, 190) + line(250, 180, 250, 190) + line(50, 190, 250, 190) + dot(150, 190);
    return svg(300, 210, s);
  }
  function emitterGrounded() {
    let s = bjt(120, 80, 'npn');
    s += line(88, 80, 50, 80) + acV(50, 80, 135) + batV(50, 135, 190, 'V<tspan font-size="9">BB</tspan>');
    s += line(134, 48, 134, 30) + line(134, 30, 240, 30) + resV(240, 30, 100, 'R<tspan font-size="9">L</tspan>') + batV(240, 100, 190, '');
    s += txt(190, 160, 'V<tspan font-size="9">CC</tspan>', 'font-style="italic"');
    s += line(134, 112, 134, 190) + line(50, 190, 240, 190) + dot(134, 190);
    return svg(300, 210, s);
  }

  /* ---------- hパラメータ 4象限 ---------- */
  function hQuadrant(showAns = false) {
    const cx = 200, cy = 140;
    let s = line(30, cy, 370, cy) + line(cx, 20, cx, 270);
    s += arrow(cx, 30, cx, 18) + arrow(360, cy, 372, cy);
    s += txt(cx + 6, 22, 'I<tspan font-size="9">C</tspan>') + txt(355, cy + 18, 'V<tspan font-size="9">CE</tspan>');
    s += txt(34, cy - 6, 'I<tspan font-size="9">B</tspan>') + txt(cx + 6, 268, 'V<tspan font-size="9">BE</tspan>');
    s += txt(cx + 4, cy + 16, '0');
    // Q1: Ic-Vce
    s += `<path d="M${cx},${cy} C${cx + 15},${cy - 70} ${cx + 30},${cy - 80} ${cx + 60},${cy - 85} L${cx + 160},${cy - 98}" ${NS}/>`;
    s += txt(cx + 110, cy - 108, 'I<tspan font-size="9">B</tspan>=一定');
    // Q2: Ic-Ib 直線
    s += line(cx, cy, cx - 150, cy - 100);
    s += txt(cx - 175, cy - 108, 'V<tspan font-size="9">CE</tspan>=一定');
    // Q3: Vbe-Ib
    s += `<path d="M${cx},${cy} C${cx - 4},${cy + 60} ${cx - 25},${cy + 80} ${cx - 160},${cy + 85}" ${NS}/>`;
    s += txt(cx - 175, cy + 108, 'V<tspan font-size="9">CE</tspan>=一定');
    // Q4: Vbe-Vce ほぼ水平
    s += `<path d="M${cx},${cy} C${cx + 3},${cy + 60} ${cx + 20},${cy + 82} ${cx + 60},${cy + 84} L${cx + 160},${cy + 86}" ${NS}/>`;
    s += txt(cx + 110, cy + 108, 'I<tspan font-size="9">B</tspan>=一定');
    // 点
    const pts = [['Pc', cx + 80, cy - 88, 'h<tspan font-size="9">oe</tspan>'], ['Pa', cx - 75, cy - 50, 'h<tspan font-size="9">fe</tspan>'],
      ['Pb', cx - 80, cy + 83, 'h<tspan font-size="9">ie</tspan>'], ['Pd', cx + 80, cy + 85, 'h<tspan font-size="9">re</tspan>']];
    for (const [n, x, y, a] of pts) {
      s += `<circle cx="${x}" cy="${y}" r="4.5" fill="var(--bg)" stroke="currentColor" stroke-width="2"/>`;
      s += txt(x - 8, y + (y < cy ? -10 : 20), n, 'font-weight="bold"');
      if (showAns) s += txt(x + 10, y + (y < cy ? 18 : -8), a, 'class="ans-label"');
    }
    return svg(400, 280, s);
  }

  /* ---------- IC パッケージ（簡略イラスト） ---------- */
  function pkg(kind) {
    let s = '';
    if (kind === 'DIP') {
      s += `<rect x="20" y="30" width="120" height="34" rx="3" ${NS}/>` + `<circle cx="32" cy="40" r="3" ${NS}/>`;
      for (let i = 0; i < 7; i++) s += line(30 + i * 16, 64, 30 + i * 16, 92);
      s += txt(40, 22, '2列の足（挿入）', 'font-size="11"');
    } else if (kind === 'SIP') {
      s += `<rect x="20" y="20" width="120" height="44" rx="3" ${NS}/>`;
      for (let i = 0; i < 8; i++) s += line(30 + i * 14, 64, 30 + i * 14, 92);
      s += txt(32, 14, '1列の足（挿入）', 'font-size="11"');
    } else if (kind === 'PGA') {
      s += `<rect x="30" y="14" width="100" height="56" rx="3" ${NS}/>`;
      for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) s += line(42 + i * 15 + j * 6, 70, 42 + i * 15 + j * 6, 92 - j * 6);
      s += txt(22, 106, '底面に剣山状のピン', 'font-size="11"');
    } else if (kind === 'SOP') {
      s += `<rect x="40" y="36" width="80" height="26" rx="2" ${NS}/>`;
      for (let i = 0; i < 6; i++) { const x = 48 + i * 13; s += poly(`${x},36 ${x},28 ${x},24`) + poly(`${x},62 ${x},70 ${x},74`); }
      s += txt(26, 96, '2辺から足（表面実装）', 'font-size="11"');
    } else if (kind === 'QFP') {
      s += `<rect x="50" y="22" width="60" height="60" rx="2" ${NS}/>`;
      for (let i = 0; i < 6; i++) {
        const t = 30 + i * 9;
        s += line(50, t, 40, t) + line(110, t, 120, t) + line(50 + (t - 22), 22, 50 + (t - 22), 12) + line(50 + (t - 22), 82, 50 + (t - 22), 92);
      }
      s += txt(26, 108, '4辺から足（表面実装）', 'font-size="11"');
    }
    return svg(160, 112, s, 'small');
  }

  /* ---------- トランジスタ・FET 図記号 ---------- */
  // kind: 'jfet-n','jfet-p','mos-n-e','mos-n-d','mos-p-e','mos-p-d','npn','pnp'
  function symbol(kind) {
    let s = '';
    if (kind === 'npn' || kind === 'pnp') {
      s += bjt(70, 55, kind, false);
      s += txt(26, 50, 'B') + txt(90, 22, 'C') + txt(90, 96, 'E');
      return svg(130, 110, s, 'sym');
    }
    s += `<circle cx="66" cy="55" r="30" ${NS}/>`;
    if (kind.startsWith('jfet')) {
      s += line(60, 30, 60, 80, 'stroke-width="3"');
      s += line(60, 38, 110, 38) + line(60, 72, 110, 72);
      s += line(10, 72, 60, 72);
      s += kind === 'jfet-n' ? arrow(20, 72, 50, 72, 10) : arrow(55, 72, 30, 72, 10);
      s += txt(10, 66, 'G') + txt(112, 42, 'D') + txt(112, 76, 'S');
      return svg(130, 110, s, 'sym');
    }
    // MOSFET
    const enh = kind.endsWith('-e'), n = kind.includes('-n-');
    s += line(15, 78, 48, 78) + line(48, 34, 48, 78, 'stroke-width="2.5"');
    if (enh) {
      s += line(58, 30, 58, 42, 'stroke-width="3"') + line(58, 49, 58, 61, 'stroke-width="3"') + line(58, 68, 58, 80, 'stroke-width="3"');
    } else {
      s += line(58, 30, 58, 80, 'stroke-width="3"');
    }
    s += line(58, 36, 84, 36) + line(84, 36, 84, 16) + txt(90, 22, 'D');
    s += line(58, 74, 84, 74) + line(84, 74, 84, 96) + txt(90, 98, 'S');
    s += line(58, 55, 84, 55) + line(84, 55, 84, 74);
    s += n ? arrow(84, 55, 61, 55, 9) : arrow(60, 55, 82, 55, 9);
    s += txt(10, 96, 'G');
    return svg(130, 110, s, 'sym');
  }

  /* ---------- FET 断面図 ---------- */
  // 図1(a) n チャネル接合形 FET
  function jfetSection(showAns = false) {
    const A = showAns ? { 10: '酸化膜(SiO₂)', 11: 'S ソース', 12: 'G ゲート', 13: 'D ドレーン', 14: '電極(アルミ)', 15: 'p形', 16: 'n形' } : {};
    let s = `<rect x="40" y="80" width="300" height="110" class="semi-n" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="150" y="80" width="80" height="40" class="semi-p" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="40" y="70" width="300" height="10" class="oxide" stroke="currentColor" stroke-width="1.5"/>`;
    for (const x of [70, 175, 290]) s += `<rect x="${x}" y="60" width="${x === 175 ? 30 : 20}" height="22" class="metal"/>` + line(x + (x === 175 ? 15 : 10), 60, x + (x === 175 ? 15 : 10), 40) + `<circle cx="${x + (x === 175 ? 15 : 10)}" cy="36" r="4" ${NS}/>`;
    const tag = (n, x, y, tx, ty) => line(x, y, tx, ty, 'stroke-width="1" stroke-dasharray="3 2"') + `<g class="tag"><rect x="${tx - 26}" y="${ty - 13}" width="${showAns ? 100 : 30}" height="20" rx="4"/>${txt(tx - 22, ty + 2, `${'⑩⑪⑫⑬⑭⑮⑯'[n - 10]}${A[n] ? ' ' + A[n] : ''}`, 'font-size="12"')}</g>`;
    s += tag(10, 50, 75, 20, 30);
    s += tag(11, 80, 36, 80, 14) + tag(12, 190, 36, 190, 14) + tag(13, 300, 36, 300, 14);
    s += tag(14, 305, 62, 360, 50);
    s += `<g class="tag"><rect x="164" y="88" width="${showAns ? 60 : 30}" height="20" rx="4"/>${txt(168, 103, '⑮' + (A[15] ? ' ' + A[15] : ''), 'font-size="12"')}</g>`;
    s += `<g class="tag"><rect x="164" y="148" width="${showAns ? 60 : 30}" height="20" rx="4"/>${txt(168, 163, '⑯' + (A[16] ? ' ' + A[16] : ''), 'font-size="12"')}</g>`;
    return svg(500, 205, `<g transform="translate(30,0)">${s}</g>`, 'wide');
  }
  // 図2(a) p チャネル MOSFET
  function mosSection(showAns = false) {
    const A = showAns ? { 22: '酸化膜(SiO₂)', 23: 'S ソース', 24: 'G ゲート', 25: 'D ドレーン', 26: '電極(アルミ)', 27: 'p形', 28: 'p形', 29: 'n形', 30: 'サブストレート(基板)' } : {};
    const L = n => '㉒㉓㉔㉕㉖㉗㉘㉙㉚'[n - 22];
    let s = `<rect x="40" y="80" width="300" height="110" class="semi-n" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="62" y="80" width="46" height="32" class="semi-p" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="272" y="80" width="46" height="32" class="semi-p" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="40" y="70" width="300" height="10" class="oxide" stroke="currentColor" stroke-width="1.5"/>`;
    s += `<rect x="72" y="58" width="20" height="24" class="metal"/><rect x="288" y="58" width="20" height="24" class="metal"/>`;
    s += `<rect x="116" y="60" width="148" height="10" class="metal"/>`;
    s += line(82, 58, 82, 40) + `<circle cx="82" cy="36" r="4" ${NS}/>` + line(190, 60, 190, 40) + `<circle cx="190" cy="36" r="4" ${NS}/>` + line(298, 58, 298, 40) + `<circle cx="298" cy="36" r="4" ${NS}/>`;
    s += line(190, 190, 190, 205) + `<circle cx="190" cy="209" r="4" ${NS}/>`;
    const box = (n, x, y, w = 30) => `<g class="tag"><rect x="${x}" y="${y}" width="${showAns ? Math.max(w, 26 + A[n].length * 12) : 30}" height="20" rx="4"/>${txt(x + 4, y + 15, L(n) + (A[n] ? ' ' + A[n] : ''), 'font-size="12"')}</g>`;
    s += line(48, 75, 20, 40, 'stroke-width="1" stroke-dasharray="3 2"') + box(22, 0, 22);
    s += box(23, 60, 6) + box(24, 170, 6) + box(25, 280, 6);
    s += line(310, 62, 360, 52, 'stroke-width="1" stroke-dasharray="3 2"') + box(26, 350, 40);
    s += box(27, 66, 88) + box(28, 276, 88) + box(29, 170, 138) + box(30, 210, 200);
    return svg(500, 228, `<g transform="translate(10,0)">${s}</g>`, 'wide');
  }

  /* ---------- J-FET の動作 3 段階 ---------- */
  function jfetOperation(stage) {
    // stage 0: VGS=0, 1: 小さい逆電圧, 2: ピンチオフ
    const w = [0, 34, 62][stage];
    let s = `<rect x="70" y="30" width="80" height="150" class="semi-n" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="70" y="80" width="18" height="50" class="semi-p" stroke="currentColor" stroke-width="2"/>`;
    if (w) s += `<path d="M88,${80 - w * 0.6} Q${88 + w},105 88,${130 + w * 0.6} Z" class="depletion" stroke="currentColor" stroke-dasharray="4 3" stroke-width="1.5"/>`;
    s += txt(72, 110, 'p', 'font-size="11"') + txt(118, 172, 'n形', 'font-size="11"');
    s += line(110, 30, 110, 12) + line(110, 12, 190, 12) + batV(190, 12, 200, 'V<tspan font-size="9">DS</tspan>') + txt(116, 26, 'D');
    s += line(110, 180, 110, 200) + line(110, 200, 190, 200) + txt(116, 196, 'S');
    s += line(70, 105, 40, 105) + txt(42, 98, 'G');
    if (stage === 0) s += line(40, 105, 40, 200) + line(40, 200, 110, 200);
    else s += batV(40, 105, 200, '', false) + line(40, 200, 110, 200) + txt(4, 160, 'V<tspan font-size="9">GS</tspan>', 'font-style="italic"');
    if (stage < 2) s += line(125, 170, 125, 45, 'stroke-width="1.5"') + arrow(125, 60, 125, 42) + txt(130, 60, 'e⁻', 'font-size="11"');
    else s += txt(122, 60, '×', 'font-size="18"');
    s += txt(60, 225, ['(a) V<tspan font-size="9">GS</tspan>=0：I<tspan font-size="9">D</tspan>が流れる', '(b) 逆電圧小：空乏層が広がる', '(c) ピンチオフ：I<tspan font-size="9">D</tspan>=0'][stage], 'font-size="12"');
    return svg(240, 235, s);
  }

  /* ---------- MOSFET 動作（エンハンスメント / デプレション） ---------- */
  function mosOperation(type) {
    const enh = type === 'enh';
    let s = `<rect x="80" y="30" width="90" height="150" class="semi-p" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="110" y="30" width="60" height="26" class="semi-n" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="110" y="154" width="60" height="26" class="semi-n" stroke="currentColor" stroke-width="2"/>`;
    s += `<rect x="72" y="56" width="8" height="98" class="oxide" stroke="currentColor" stroke-width="1"/>`;
    s += `<rect x="64" y="60" width="8" height="90" class="metal"/>`;
    s += `<rect x="81" y="56" width="10" height="98" class="${enh ? 'induced' : 'semi-n'}" stroke="currentColor" stroke-dasharray="3 2" stroke-width="1"/>`;
    s += txt(124, 48, 'n形', 'font-size="11"') + txt(124, 172, 'n形', 'font-size="11"') + txt(118, 110, 'p形', 'font-size="12"');
    s += line(140, 30, 140, 12) + line(140, 12, 220, 12) + batV(220, 12, 200, 'V<tspan font-size="9">DS</tspan>') + txt(146, 26, 'D');
    s += line(140, 180, 140, 200) + line(140, 200, 220, 200) + txt(146, 196, 'S');
    s += line(64, 105, 30, 105) + batV(30, 105, 200, '', enh) + line(30, 200, 140, 200) + txt(46, 98, 'G');
    s += txt(0, 160, 'V<tspan font-size="9">GS</tspan>', 'font-style="italic" font-size="12"');
    s += txt(20, 228, enh ? 'エンハンスメント形：正のV<tspan font-size="9">GS</tspan>でチャネル発生' : 'デプレション形：最初からチャネルあり', 'font-size="12"');
    return svg(270, 236, s);
  }

  /* ---------- 差動増幅回路 ---------- */
  function diffBlock() {
    let s = `<rect x="150" y="30" width="140" height="44" rx="4" class="metal-soft" stroke="currentColor" stroke-width="2"/>`;
    s += txt(176, 57, '差動増幅回路');
    s += `<circle cx="40" cy="20" r="5" ${NS}/>` + txt(28, 12, '①') + line(45, 20, 150, 40);
    s += `<circle cx="80" cy="70" r="5" ${NS}/>` + txt(60, 66, '②') + line(85, 70, 150, 64);
    s += `<circle cx="400" cy="20" r="5" ${NS}/>` + txt(408, 14, '③') + line(290, 40, 395, 20);
    s += `<circle cx="360" cy="70" r="5" ${NS}/>` + txt(368, 66, '④') + line(290, 64, 355, 70);
    s += line(40, 25, 40, 140) + gnd(40, 140) + line(80, 75, 80, 140) + gnd(80, 140);
    s += line(360, 75, 360, 140) + gnd(360, 140) + line(400, 25, 400, 140) + gnd(400, 140);
    s += txt(10, 100, 'v<tspan font-size="9">i1</tspan>', 'font-style="italic"') + txt(86, 110, 'v<tspan font-size="9">i2</tspan>', 'font-style="italic"');
    s += txt(366, 110, 'v<tspan font-size="9">o2</tspan>', 'font-style="italic"') + txt(406, 100, 'v<tspan font-size="9">o1</tspan>', 'font-style="italic"');
    s += line(58, 24, 58, 66, 'stroke-dasharray="3 2"') + txt(62, 48, 'v<tspan font-size="9">i</tspan>', 'font-style="italic" font-size="12"');
    s += line(380, 24, 380, 66, 'stroke-dasharray="3 2"') + txt(384, 48, 'v<tspan font-size="9">o</tspan>', 'font-style="italic" font-size="12"');
    return svg(440, 165, s);
  }
  function diffCircuit() {
    let s = '';
    s += bjt(110, 140, 'npn', false) + txt(70, 120, 'Tr<tspan font-size="9">1</tspan>');
    s += `<g transform="translate(290,140) scale(-1,1)">${bjtLocal('npn')}</g>` + txt(318, 120, 'Tr<tspan font-size="9">2</tspan>');
    s += line(78, 140, 30, 140) + `<circle cx="26" cy="140" r="4" ${NS}/>` + txt(20, 128, 'a') + txt(10, 180, 'v<tspan font-size="9">i1</tspan>', 'font-style="italic"');
    s += line(322, 140, 370, 140) + `<circle cx="374" cy="140" r="4" ${NS}/>` + txt(370, 128, 'b') + txt(370, 180, 'v<tspan font-size="9">i2</tspan>', 'font-style="italic"');
    // コレクタ
    s += line(124, 108, 124, 90) + resV(124, 30, 90, 'R<tspan font-size="9">C</tspan>') + line(276, 108, 276, 90) + resV(276, 30, 90, '');
    s += txt(240, 64, 'R<tspan font-size="9">C</tspan>', 'font-style="italic"');
    s += line(124, 30, 276, 30) + line(200, 30, 200, 12) + line(200, 12, 430, 12) + batV(430, 12, 150, 'V<tspan font-size="9">CC</tspan>');
    s += dot(124, 96) + dot(276, 96) + line(124, 96, 170, 96) + line(276, 96, 230, 96);
    s += `<circle cx="170" cy="96" r="3.5" ${NS}/><circle cx="230" cy="96" r="3.5" ${NS}/>` + txt(165, 88, 'c') + txt(228, 88, 'd');
    s += txt(186, 92, 'v<tspan font-size="9">o</tspan>', 'font-style="italic" font-size="12"');
    s += txt(140, 116, 'v<tspan font-size="9">o1</tspan>', 'font-style="italic" font-size="11"') + txt(236, 116, 'v<tspan font-size="9">o2</tspan>', 'font-style="italic" font-size="11"');
    // エミッタ共通
    s += line(124, 172, 124, 190) + line(276, 172, 276, 190) + line(124, 190, 276, 190) + dot(200, 190);
    s += resV(200, 190, 250, 'R<tspan font-size="9">E</tspan>') + line(200, 250, 430, 250) + batV(430, 150, 250, 'V<tspan font-size="9">EE</tspan>');
    s += gnd(430, 150).replace(/^/, '') ;
    return svg(480, 270, s);
  }

  /* ---------- 波形 ---------- */
  function wave(title, fn, color = 'currentColor', w = 200, h = 90, amp = 1) {
    const ox = 20, oy = h / 2, L = w - 40;
    let s = line(ox, oy, ox + L + 10, oy, 'stroke-width="1.2"') + line(ox, 8, ox, h - 8, 'stroke-width="1.2"');
    s += arrow(ox + L, oy, ox + L + 12, oy, 6) + txt(ox + L + 4, oy + 16, 't', 'font-size="11" font-style="italic"');
    s += txt(ox + 4, 18, title, 'font-size="12" font-style="italic"');
    const fns = Array.isArray(fn) ? fn : [[fn, color, '']];
    for (const [f, c, dash] of fns) {
      let p = '';
      for (let i = 0; i <= 80; i++) { const t = i / 80; p += `${ox + t * L},${oy - f(t) * (oy - 12) * amp} `; }
      const st = dash === 'thick' ? 'stroke-width="6" stroke-opacity=".4"' : `stroke-width="2.2" ${dash ? 'stroke-dasharray="5 4"' : ''}`;
      s += `<polyline points="${p}" fill="none" stroke="${c}" ${st}/>`;
    }
    return svg(w, h, s, 'wave');
  }
  const S = t => Math.sin(2 * Math.PI * t);
  function diffWaves(mode) {
    const same = mode === 'same';
    const vi1 = wave('v<tspan font-size="9">i1</tspan>', t => 0.5 * S(t));
    const vi2 = wave('v<tspan font-size="9">i2</tspan>', t => (same ? 0.5 : -0.5) * S(t));
    const out = wave('v<tspan font-size="9">o1</tspan>, v<tspan font-size="9">o2</tspan>, v<tspan font-size="9">o</tspan>', [
      [t => -0.45 * S(t), 'var(--c1)', 'thick'],
      [t => (same ? -0.45 : 0.45) * S(t), 'var(--c2)', 'd'],
      [t => (same ? 0 : -0.9 * S(t)), 'var(--accent)', ''],
    ], 'currentColor', 260, 110);
    return `<div class="wave-row">${vi1}${vi2}</div><div class="wave-row">${out}<div class="legend"><span style="color:var(--c1)">▬ v<sub>o1</sub>（c–GND）</span><span style="color:var(--c2)">┅ v<sub>o2</sub>（d–GND）</span><span style="color:var(--accent)">━ v<sub>o</sub>＝v<sub>o1</sub>−v<sub>o2</sub>${same ? '＝0' : '（大きく増幅）'}</span></div></div>`;
  }
  function inputWaves(mode) {
    return `<div class="wave-row">${wave('v<tspan font-size="9">i1</tspan>', t => 0.5 * S(t))}${wave('v<tspan font-size="9">i2</tspan>', t => (mode === 'same' ? 0.5 : -0.5) * S(t))}</div>`;
  }

  /* ---------- オペアンプ ---------- */
  function opampSymbol(withLabels = true) {
    let s = `<polygon points="120,30 120,150 220,90" ${NS}/>`;
    s += line(60, 60, 120, 60) + line(60, 120, 120, 120) + line(220, 90, 290, 90);
    s += `<circle cx="56" cy="60" r="4" ${NS}/><circle cx="56" cy="120" r="4" ${NS}/><circle cx="294" cy="90" r="4" ${NS}/>`;
    s += txt(126, 66, '−', 'font-size="18"') + txt(126, 126, '+', 'font-size="18"');
    s += line(170, 58, 170, 20) + line(170, 122, 170, 160);
    s += txt(176, 26, '+V（正電源）', 'font-size="12"') + txt(176, 162, '−V（負電源）', 'font-size="12"');
    if (withLabels) {
      s += txt(0, 50, '反転入力端子（−）', 'font-size="11"') + txt(0, 140, '非反転入力端子（+）', 'font-size="11"');
      s += txt(250, 80, '出力端子', 'font-size="11"');
    }
    return svg(320, 175, s);
  }
  function opampEquivalent() {
    let s = `<polygon points="60,20 60,200 300,110" ${NS}/>`;
    s += line(10, 60, 60, 60) + line(10, 160, 60, 160) + txt(0, 52, '反転入力', 'font-size="11"') + txt(0, 180, '非反転入力', 'font-size="11"');
    s += line(80, 60, 80, 90) + `<rect x="72" y="90" width="16" height="40" ${NS}/>` + line(80, 130, 80, 160) + line(60, 60, 80, 60) + line(60, 160, 80, 160);
    s += txt(92, 115, 'Z<tspan font-size="9">i</tspan>=∞', 'font-size="12"');
    s += `<circle cx="160" cy="110" r="13" ${NS}/>` + `<path d="M153,110 q3.5,-8 7,0 t7,0" ${NS}/>` + line(160, 123, 160, 150) + gnd(160, 150);
    s += txt(128, 84, 'A<tspan font-size="9">v</tspan>v<tspan font-size="9">i</tspan>', 'font-size="12" font-style="italic"');
    s += line(173, 110, 190, 110) + `<rect x="190" y="103" width="36" height="14" ${NS}/>` + txt(192, 98, 'Z<tspan font-size="9">o</tspan>=0', 'font-size="11"') + line(226, 110, 330, 110);
    s += `<circle cx="334" cy="110" r="4" ${NS}/>` + txt(318, 98, '出力', 'font-size="11"');
    return svg(360, 220, s);
  }
  function nonInverting() {
    let s = `<polygon points="160,50 160,150 240,100" ${NS}/>`;
    s += txt(166, 80, '−', 'font-size="16"') + txt(166, 140, '+', 'font-size="16"');
    s += line(240, 100, 330, 100) + `<circle cx="334" cy="100" r="4" ${NS}/>` + txt(326, 88, 'v<tspan font-size="9">o</tspan>', 'font-style="italic"');
    s += line(160, 75, 120, 75) + line(120, 75, 120, 30) + resH(120, 290, 30, 'R<tspan font-size="9">F</tspan>') + line(290, 30, 290, 100) + dot(290, 100);
    s += resH(30, 120, 75, 'R<tspan font-size="9">S</tspan>') + dot(120, 75) + line(30, 75, 30, 190) + gnd(30, 190);
    s += line(160, 125, 90, 125) + `<circle cx="86" cy="125" r="4" ${NS}/>` + txt(70, 150, 'v<tspan font-size="9">I</tspan>', 'font-style="italic"');
    s += line(86, 129, 86, 190) + gnd(86, 190) + line(334, 104, 334, 190) + gnd(334, 190);
    s += txt(124, 96, 'v<tspan font-size="9">F</tspan>', 'font-style="italic" font-size="12"');
    return svg(380, 215, s);
  }
  function bandwidth() {
    let s = line(40, 160, 360, 160) + line(40, 160, 40, 20) + arrow(40, 30, 40, 16) + arrow(350, 160, 364, 160);
    s += `<path d="M60,140 C90,60 100,50 120,50 L280,50 C300,50 310,60 340,140" ${NS}/>`;
    s += line(40, 50, 360, 50, 'stroke-width="1" stroke-dasharray="4 3"') + line(40, 68, 360, 68, 'stroke-width="1" stroke-dasharray="4 3"');
    s += txt(4, 54, '最大', 'font-size="11"') + txt(4, 74, '−3dB', 'font-size="11"');
    s += line(92, 68, 92, 160, 'stroke-width="1" stroke-dasharray="4 3"') + line(308, 68, 308, 160, 'stroke-width="1" stroke-dasharray="4 3"');
    s += txt(80, 178, 'f<tspan font-size="9">CL</tspan>', 'font-style="italic"') + txt(298, 178, 'f<tspan font-size="9">CH</tspan>', 'font-style="italic"');
    s += line(96, 100, 304, 100) + arrow(200, 100, 96, 100) + arrow(200, 100, 304, 100) + txt(170, 94, '帯域幅 B', 'font-size="12"');
    s += txt(46, 22, '利得[dB]', 'font-size="11"') + txt(344, 178, 'f', 'font-style="italic"');
    return svg(380, 190, s);
  }
  // J-FET / MOSFET の VGS-ID 特性（gm の求め方）
  function gmGraph(kind = 'jfet') {
    let s = line(30, 170, 300, 170) + line(kind === 'jfet' ? 260 : (kind === 'dep' ? 160 : 60), 20, kind === 'jfet' ? 260 : (kind === 'dep' ? 160 : 60), 180);
    const yx = kind === 'jfet' ? 260 : (kind === 'dep' ? 160 : 60);
    s += txt(yx + 6, 30, 'I<tspan font-size="9">D</tspan>', 'font-style="italic"') + txt(282, 190, 'V<tspan font-size="9">GS</tspan>', 'font-style="italic"');
    let p;
    if (kind === 'jfet') p = 'M60,170 C120,160 200,110 260,50';
    else if (kind === 'dep') p = 'M60,168 C100,160 140,120 170,80 L210,24';
    else p = 'M60,170 L100,170 C140,165 180,110 230,30';
    s += `<path d="${p}" ${NS}/>`;
    // ΔVGS, ΔID の三角形
    const [x1, y1, x2, y2] = kind === 'jfet' ? [185, 122, 232, 84] : kind === 'dep' ? [140, 124, 175, 74] : [160, 135, 200, 82];
    s += line(x1, y1, x2, y1, 'stroke="var(--accent)" stroke-width="2"') + line(x2, y1, x2, y2, 'stroke="var(--accent)" stroke-width="2"');
    s += txt(x1, y1 + 16, 'ΔV<tspan font-size="9">GS</tspan>', 'font-size="11" fill="var(--accent)"') + txt(x2 + 4, (y1 + y2) / 2 + 4, 'ΔI<tspan font-size="9">D</tspan>', 'font-size="11" fill="var(--accent)"');
    if (kind === 'jfet') s += txt(44, 162, 'V<tspan font-size="9">P</tspan>', 'font-size="11"') + txt(30, 188, '負', 'font-size="11"');
    if (kind === 'enh') s += txt(88, 188, 'V<tspan font-size="9">th</tspan>', 'font-size="11"');
    s += txt(250, 186, kind === 'jfet' ? '0' : '', 'font-size="11"');
    return svg(320, 200, s);
  }
  function vdsCurves() {
    let s = line(40, 170, 320, 170) + line(40, 170, 40, 20);
    s += txt(46, 28, 'I<tspan font-size="9">D</tspan>', 'font-style="italic"') + txt(290, 188, 'V<tspan font-size="9">DS</tspan>', 'font-style="italic"');
    [[60, 'V<tspan font-size="9">GS</tspan>=0V'], [95, '−0.1V'], [125, '−0.2V']].forEach(([y, l]) => {
      s += `<path d="M40,170 C60,${y + 10} 80,${y} 120,${y - 2} L300,${y - 8}" ${NS}/>` + txt(250, y - 12, l, 'font-size="11"');
    });
    s += line(110, 20, 110, 170, 'stroke-dasharray="4 3" stroke-width="1"');
    s += txt(48, 186, '比例して増加', 'font-size="10"') + txt(150, 186, '飽和領域（ほぼ一定）', 'font-size="10"');
    return svg(330, 195, s);
  }
  function cmos() {
    // 上：pチャネル、下：nチャネル（どちらもエンハンスメント形）。ゲート共通＝入力、ドレーン共通＝出力
    const mos = (y0, n) => {
      let s = line(100, y0, 100, y0 + 50, 'stroke-width="2.5"'); // ゲート板
      s += line(110, y0, 110, y0 + 12, 'stroke-width="3"') + line(110, y0 + 19, 110, y0 + 31, 'stroke-width="3"') + line(110, y0 + 38, 110, y0 + 50, 'stroke-width="3"');
      s += line(110, y0 + 6, 150, y0 + 6) + line(110, y0 + 44, 150, y0 + 44) + line(110, y0 + 25, 150, y0 + 25);
      s += n ? arrow(150, y0 + 25, 113, y0 + 25, 9) + line(150, y0 + 25, 150, y0 + 44) : arrow(112, y0 + 25, 146, y0 + 25, 9) + line(150, y0 + 25, 150, y0 + 6);
      return s;
    };
    let s = mos(30, false) + mos(150, true);
    s += line(150, 36, 150, 14) + line(130, 14, 170, 14) + txt(176, 18, '+V<tspan font-size="9">DD</tspan>', 'font-size="12"');
    s += line(150, 74, 150, 156) + dot(150, 115) + line(150, 115, 230, 115) + `<circle cx="234" cy="115" r="4" ${NS}/>` + txt(222, 104, '出力', 'font-size="12"');
    s += line(150, 194, 150, 214) + gnd(150, 214);
    s += line(100, 55, 70, 55) + line(100, 175, 70, 175) + line(70, 55, 70, 175) + dot(70, 115) + line(30, 115, 70, 115) + `<circle cx="26" cy="115" r="4" ${NS}/>` + txt(14, 104, '入力', 'font-size="12"');
    s += txt(160, 62, 'pチャネル', 'font-size="12"') + txt(160, 182, 'nチャネル', 'font-size="12"');
    return svg(280, 236, s);
  }

  return {
    collectorGrounded, baseGrounded, emitterGrounded, hQuadrant, pkg, symbol,
    jfetSection, mosSection, jfetOperation, mosOperation, diffBlock, diffCircuit,
    diffWaves, inputWaves, opampSymbol, opampEquivalent, nonInverting, bandwidth, gmGraph, vdsCurves, cmos,
  };
})();
