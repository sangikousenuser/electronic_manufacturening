/* =========================================================
   アプリ本体（ルーティング・採点・クイズ・模擬テスト）
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  let app = $('#app');
  const SECTIONS = [...PRINT.map(s => ({ ...s, src: 'print' })), ...PREDICT.map(s => ({ ...s, src: 'predict' }))];

  /* ---------------- 保存（学習記録） ---------------- */
  const KEY = 'denshi-kouki-chukan-v1';
  const Store = {
    data: (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })(),
    save() { try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* ignore */ } },
    record(id, ok) {
      const r = this.data[id] || { c: 0, w: 0 };
      ok ? r.c++ : r.w++;
      r.last = ok ? 'c' : 'w'; r.t = Date.now();
      this.data[id] = r; this.save();
    },
    fix(id) { // 自己判定で正解に変更
      const r = this.data[id]; if (!r) return;
      if (r.w > 0) r.w--; r.c++; r.last = 'c'; this.save();
    },
    get(id) { return this.data[id]; },
    reset() { this.data = {}; this.save(); },
  };

  /* ---------------- 正規化・採点 ---------------- */
  const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-' };
  const stripTags = s => String(s).replace(/<[^>]+>/g, '');
  function norm(s) {
    s = stripTags(s).normalize('NFKC').toLowerCase();
    s = s.replace(/ドレイン/g, 'ドレーン').replace(/デプレッション|デプレーション|ディプレッション/g, 'デプレション')
      .replace(/エンハンスメント|エンハンスメン卜/g, 'エンハンスメント').replace(/チャンネル/g, 'チャネル')
      .replace(/型/g, '形').replace(/エミッター/g, 'エミッタ').replace(/コレクター/g, 'コレクタ')
      .replace(/アドミッタンス/g, 'アドミタンス').replace(/ホロワ/g, 'フォロワ').replace(/フォロワー/g, 'フォロワ')
      .replace(/モノリック/g, 'モノリシック').replace(/[ｰ−―‐]/g, '-');
    s = s.replace(/[\s　・、。,.\(\)（）「」『』\[\]【】:：;；'"“”’]/g, '');
    s = s.replace(/[ぁ-ゖ]+$/u, m => (['い', 'く', 'る', 'げる', 'がる', 'れる', 'ぐ', 'じる'].includes(m) ? m : m)); // 送り仮名はそのまま
    return s;
  }
  function judgeText(input, acc) {
    const n = norm(input);
    if (!n) return false;
    return acc.some(a => norm(a) === n);
  }
  const PREFIX = { k: 1e3, K: 1e3, M: 1e6, m: 1e-3, 'μ': 1e-6, 'µ': 1e-6, u: 1e-6, n: 1e-9 };
  function showFactor(show) {
    if (!show || show === 'dB' || show === 'V' || show === 'S' || show === 'Ω' || show === 'A') return 1;
    return PREFIX[show[0]] || 1;
  }
  function parseNum(raw, item) {
    let s = String(raw).trim();
    if (!s) return NaN;
    s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, m => '^' + [...m].map(c => SUP[c]).join(''));
    s = s.normalize('NFKC').replace(/[\s,，]/g, '').replace(/[−–―]/g, '-').replace(/[×x\*]10\^?/i, 'e').replace(/^10\^/, '1e');
    s = s.replace(/^約|^≒|^=/, '');
    const m = s.match(/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?/i);
    if (!m) return NaN;
    let v = parseFloat(m[0]);
    const rest = s.slice(m[0].length);
    if (item.show === 'dB' || !item.unit) return v;
    if (!rest) return v * showFactor(item.show);
    const p = rest[0];
    const unitChars = ['s', 'S', 'Ω', 'v', 'V', 'a', 'A', 'オ', 'ジ'];
    if (unitChars.includes(p)) return v; // 接頭語なし（基本単位）
    if (PREFIX[p] !== undefined) return v * PREFIX[p];
    return v * showFactor(item.show);
  }
  function judgeNum(input, item) {
    const v = parseNum(input, item);
    if (Number.isNaN(v)) return false;
    const tol = Math.max(Math.abs(item.val) * 0.02, item.val === 0 ? 0.01 : 1e-15);
    return Math.abs(v - item.val) <= tol;
  }
  function judge(q, val) {
    if (q.kind === 'self') return val === '1';
    if (q.kind === 'tf') return val === q.a;
    if (q.kind === 'choice') return String(val) === String(q.a);
    if (q.kind === 'num') return judgeNum(val, q);
    return judgeText(val, q.acc || [stripTags(q.a)]);
  }
  const answerText = q => q.kind === 'choice' ? q.choices[q.a] : q.kind === 'num' ? q.a : q.a;

  /* ---------------- 問題プールの作成 ---------------- */
  function buildPool() {
    const pool = [];
    for (const sec of SECTIONS) {
      for (const part of sec.parts) {
        if (part.type === 'items') {
          for (const it of part.items) pool.push({ ...it, kind: it.kind || 'text', sec, partFig: part.fig, partTitle: part.title, topic: sec.topic, src: sec.src });
        } else if (part.type === 'cloze') {
          for (const k of Object.keys(part.blanks)) {
            const b = part.blanks[k];
            pool.push({ id: `${part.id}-${k}`, kind: b.self ? 'self' : 'text', cloze: part, key: k, a: b.a, acc: b.acc, exp: b.exp || '', sec, topic: sec.topic, src: sec.src, partTitle: part.title });
          }
        } else if (part.type === 'draw') {
          pool.push({ id: part.id, kind: 'draw', q: part.title, fig: part.fig, ans: part.ans, exp: part.exp, sec, topic: sec.topic, src: sec.src });
        }
      }
    }
    return pool;
  }
  const POOL = buildPool();
  const byId = Object.fromEntries(POOL.map(q => [q.id, q]));
  const markLabel = k => (/^\d+$/.test(k) ? '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚'[+k - 1] : `(${k})`);

  /* ---------------- 入力 UI ---------------- */
  // opts.mock: 模擬テスト用（答えを見るボタンを出さない）
  function inputHTML(q, opts = {}) {
    const id = q.id;
    if (q.kind === 'tf') return `<div class="tf" data-qid="${id}"><button type="button" class="tfb" data-v="○">○</button><button type="button" class="tfb" data-v="×">×</button></div>`;
    if (q.kind === 'choice') return `<div class="choices" data-qid="${id}">${q.choices.map((c, i) => `<button type="button" class="chb" data-v="${i}"><span class="chn">${'アイウエオ'[i]}</span>${c}</button>`).join('')}</div>`;
    if (q.kind === 'num') return `<div class="numwrap"><input class="ans num" data-qid="${id}" inputmode="decimal" autocomplete="off" placeholder="数値${q.show ? '（' + q.show + '）' : ''}"><span class="unit">${q.show || ''}</span>${opts.mock ? '' : `<button type="button" class="link small" data-reveal="${id}">入力せずに答えを見て自己採点</button>`}</div>`;
    if (q.kind === 'self') return selfHTML(id, opts.mock);
    if (q.kind === 'draw') return '';
    return `<input class="ans" data-qid="${id}" autocomplete="off" placeholder="${opts.ph || '答えを入力'}">`;
  }
  // 自己採点形式（数式・記号など手入力が大変なもの）
  const selfHTML = (id, mock, inline = false) => `<span class="selfq${inline ? ' inline' : ''}" data-qid="${id}">${mock
    ? '<span class="muted small">提出後に答えを見て自己採点</span>'
    : `<button type="button" class="btn sm reveal" data-reveal="${id}">答えを見る</button>`}</span>`;
  const selfDecideHTML = (id, q) => `<span class="selfans"><span class="sa-label">答え：</span><b>${answerText(q)}</b><span class="sgwrap"><button type="button" class="sgb ok" data-sg="1" data-for="${id}">○ 合ってた</button><button type="button" class="sgb ng" data-sg="0" data-for="${id}">× 違った</button></span></span>`;
  // 答えを表示して ○× ボタンを出す
  function revealSelf(root, id, q) {
    const el = root.querySelector(`[data-qid="${CSS.escape(id)}"]`);
    if (!el) return;
    if (el.classList.contains('selfq')) { el.innerHTML = selfDecideHTML(id, q); return; }
    // 数値問題：入力欄はロックして、ボタンの位置に答えを出す
    el.readOnly = true;
    const btn = root.querySelector(`[data-reveal="${CSS.escape(id)}"]`);
    if (btn) btn.outerHTML = selfDecideHTML(id, q);
  }
  // resolver(id) -> 問題, onDecide(id, ok) 自己採点が決まったとき
  function bindSelf(root, resolver, onDecide) {
    root.addEventListener('click', e => {
      const r = e.target.closest('[data-reveal]');
      if (r) { const id = r.dataset.reveal; revealSelf(root, id, resolver(id)); return; }
      const b = e.target.closest('[data-sg][data-for]');
      if (!b) return;
      const id = b.dataset.for, ok = b.dataset.sg === '1';
      const wrap = b.closest('.selfans');
      wrap.querySelector('.sgwrap').innerHTML = `<b class="${ok ? 'good' : 'bad'}">${ok ? '○' : '×'}</b>`;
      const el = root.querySelector(`[data-qid="${CSS.escape(id)}"]`);
      if (el) { el.dataset.val = ok ? '1' : '0'; el.dataset.self = '1'; }
      onDecide && onDecide(id, ok);
    });
  }
  // onPick(id, val)：○×・選択肢を押した瞬間に呼ぶ（即採点用）
  function bindPick(root, onPick) {
    root.addEventListener('click', e => {
      const b = e.target.closest('.tfb, .chb');
      if (!b || b.closest('.locked')) return;
      const g = b.parentElement;
      $$('button', g).forEach(x => x.classList.toggle('sel', x === b));
      g.dataset.val = b.dataset.v;
      onPick && onPick(g.dataset.qid, b.dataset.v);
    });
  }
  function getVal(root, id) {
    const el = root.querySelector(`[data-qid="${CSS.escape(id)}"]`);
    if (!el) return '';
    return el.tagName === 'INPUT' ? el.value : (el.dataset.val || '');
  }
  function lock(root, id, ok) {
    const el = root.querySelector(`[data-qid="${CSS.escape(id)}"]`);
    if (!el) return;
    el.classList.remove('ok', 'ng'); el.classList.add(ok ? 'ok' : 'ng');
    if (el.tagName === 'INPUT') el.readOnly = true; else el.classList.add('locked');
  }
  function clozeHTML(part, mode = 'inputs', target = null) {
    // mode: inputs = 全空欄を入力欄に / single = target 以外を答えで埋める
    return part.text.replace(/\[\[(\w+)\]\]/g, (_, k) => {
      const lab = markLabel(k);
      if (mode === 'single' && k !== target) return `<span class="filled">${lab}${part.blanks[k].a}</span>`;
      if (mode === 'single') return `<span class="blank-target">${lab}</span>`;
      if (part.blanks[k].self) return `<span class="blank"><span class="bl">${lab}</span>${selfHTML(`${part.id}-${k}`, false, true)}</span>`;
      return `<span class="blank"><span class="bl">${lab}</span><input class="ans inline" data-qid="${part.id}-${k}" autocomplete="off"></span>`;
    });
  }

  /* ---------------- 表示：共通 ---------------- */
  const statBadge = id => { const r = Store.get(id); if (!r) return ''; return `<span class="mini ${r.last === 'c' ? 'good' : 'bad'}" title="正解${r.c} / 不正解${r.w}">${r.last === 'c' ? '✓' : '✗'}</span>`; };
  // selfJudged: 自己採点で決まった結果
  function resultHTML(q, ok, given, selfJudged = false) {
    const typed = !selfJudged && (q.kind === 'text' || q.kind === 'num') && String(given).trim() !== '';
    return `<div class="result ${ok ? 'ok' : 'ng'}">
      <div class="rhead">${ok ? '⭕ 正解' : '❌ 不正解'}${selfJudged ? '<span class="given">（自己採点）</span>' : ''}${!ok && typed ? `<span class="given">あなたの答え：${escapeHTML(String(given))}</span>` : ''}</div>
      ${selfJudged ? '' : `<div class="rans">正答：<b>${answerText(q)}</b></div>`}
      ${q.exp ? `<div class="rexp">${q.exp}</div>` : ''}
      ${!ok && typed ? `<button type="button" class="link fixbtn" data-fix="${q.id}">自分の答えも正しいので○にする</button>` : ''}
    </div>`;
  }
  const escapeHTML = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function bindFix(root, onFix) {
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-fix]'); if (!b) return;
      Store.fix(b.dataset.fix);
      const r = b.closest('.result'); r.classList.replace('ng', 'ok'); r.querySelector('.rhead').firstChild.textContent = '⭕ 正解（自己判定）';
      const inp = root.querySelector(`[data-qid="${CSS.escape(b.dataset.fix)}"]`); if (inp) { inp.classList.replace('ng', 'ok'); }
      b.remove(); onFix && onFix(b.dataset.fix);
    });
  }

  /* ---------------- ページ：ホーム ---------------- */
  function topicStats(filter = () => true) {
    const res = {};
    for (const t of Object.keys(TOPICS)) res[t] = { n: 0, done: 0, ok: 0 };
    for (const q of POOL.filter(filter)) {
      const r = Store.get(q.id), s = res[q.topic]; s.n++;
      if (r) { s.done++; if (r.last === 'c') s.ok++; }
    }
    return res;
  }
  function pageHome() {
    const st = topicStats();
    const tot = Object.values(st).reduce((a, s) => ({ n: a.n + s.n, done: a.done + s.done, ok: a.ok + s.ok }), { n: 0, done: 0, ok: 0 });
    const weak = POOL.filter(q => Store.get(q.id)?.last === 'w').length;
    app.innerHTML = `
    <section class="hero">
      <h1>電子工学 後期中間テスト対策</h1>
      <p>演習プリント（問題Ⅰ～Ⅶ）と授業ノート（5.4 hパラメータ ～ 7.3 OPアンプの使い方）の範囲をすべて網羅。関数電卓持ち込み可。</p>
      <div class="kpis">
        <div class="kpi"><span>${POOL.length}</span>問題数</div>
        <div class="kpi"><span>${tot.done}</span>解いた</div>
        <div class="kpi"><span>${tot.done ? Math.round((tot.ok / tot.done) * 100) : 0}%</span>直近正答率</div>
        <div class="kpi ${weak ? 'warn' : ''}"><span>${weak}</span>苦手（直近×）</div>
      </div>
    </section>
    <h2>おすすめの使い方</h2>
    <ol class="steps">
      <li><a href="#/notes">まとめノート</a>で範囲全体を確認する</li>
      <li><a href="#/print">演習プリント</a>を本番と同じ形式で解いて「採点」する</li>
      <li><a href="#/predict">予想問題</a>でノートだけに載っている内容もおさえる</li>
      <li><a href="#/calc">計算ドリル</a>で g<sub>m</sub>・増幅度・dB 計算を数値を変えて練習</li>
      <li><a href="#/quiz">一問一答</a>・<a href="#/weak">苦手復習</a>で穴をつぶし、最後に<a href="#/mock">模擬テスト</a></li>
    </ol>
    <h2>分野別の進み具合</h2>
    <div class="topic-grid">${Object.entries(TOPICS).map(([k, name]) => {
      const s = st[k]; const pct = s.n ? Math.round((s.ok / s.n) * 100) : 0;
      return `<a class="topic-card" href="#/quiz?topic=${k}"><div class="tname">${name}</div><div class="bar"><i style="width:${pct}%"></i></div><div class="tmeta">${s.ok}/${s.n} 問 正解済み</div></a>`;
    }).join('')}</div>
    <h2>出題範囲（演習プリント）</h2>
    <div class="sec-list">${PRINT.map(s => `<a href="#/sec/${s.id}" class="sec-link"><b>${s.no}</b> ${s.title}</a>`).join('')}</div>
    <p class="muted small">学習記録はこのブラウザにだけ保存されます。<button type="button" class="link" id="resetAll">記録をリセット</button></p>`;
    $('#resetAll').onclick = () => { if (confirm('学習記録をすべて消去しますか？')) { Store.reset(); pageHome(); } };
  }

  /* ---------------- ページ：まとめ ---------------- */
  function pageNotes() {
    app.innerHTML = `<h1>まとめノート</h1>
    <nav class="toc">${NOTES.map(n => `<a href="#/notes" data-jump="${n.id}">${n.title}</a>`).join('')}<a href="#/notes" data-jump="formulas">公式一覧</a></nav>
    ${NOTES.map(n => `<article class="note" id="note-${n.id}"><h2>${n.title}</h2>${n.html()}<p class="note-act"><a class="btn sm" href="#/quiz?topic=${n.topic}">この分野を一問一答で確認 →</a></p></article>`).join('')}
    <article class="note" id="note-formulas"><h2>公式一覧（関数電卓 OK）</h2>
    <table class="tbl"><tr><th>項目</th><th>式</th><th>単位</th></tr>${FORMULAS.map(f => `<tr><td>${f[0]}</td><td><b>${f[1]}</b></td><td>${f[2]}</td></tr>`).join('')}</table></article>`;
    app.addEventListener('click', jumpHandler);
  }
  function jumpHandler(e) {
    const a = e.target.closest('[data-jump]'); if (!a) return;
    e.preventDefault();
    document.getElementById('note-' + a.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------------- ページ：セクション一覧 ---------------- */
  function pageSecList(src) {
    const list = src === 'print' ? PRINT : PREDICT;
    const title = src === 'print' ? '演習プリント（本番形式）' : '予想問題（ノートから）';
    const desc = src === 'print'
      ? '後期中間プリントの問題Ⅰ～Ⅶを再現。テスト本番と同じ形式で解いて、まとめて採点できます。'
      : 'プリントには無いけれど授業ノートに書かれている内容（hパラメータの計算、J-FET特性、MOSFET、CMOS、OPアンプの特性、正相増幅回路など）から作った問題です。';
    app.innerHTML = `<h1>${title}</h1><p>${desc}</p>
    <div class="sec-cards">${list.map(s => {
      const ids = POOL.filter(q => q.sec.id === s.id).map(q => q.id);
      const ok = ids.filter(id => Store.get(id)?.last === 'c').length;
      return `<a class="sec-card" href="#/sec/${s.id}"><div class="sno">${s.no}</div><div class="stitle">${s.title}</div><div class="bar"><i style="width:${Math.round(ok / ids.length * 100)}%"></i></div><div class="tmeta">${ok}/${ids.length} 正解済み · ${TOPICS[s.topic]}</div></a>`;
    }).join('')}</div>`;
  }

  /* ---------------- ページ：セクション（プリント形式で解く） ---------------- */
  function pageSection(id) {
    const sec = SECTIONS.find(s => s.id === id);
    if (!sec) return pageHome();
    const list = sec.src === 'print' ? PRINT : PREDICT;
    const idx = list.indexOf(list.find(s => s.id === id));
    const prev = list[idx - 1], next = list[idx + 1];
    let h = `<div class="crumb"><a href="#/${sec.src}">${sec.src === 'print' ? '演習プリント' : '予想問題'}</a> › ${sec.no}</div>
    <h1><span class="sno">${sec.no}</span> ${sec.title}</h1>
    <div class="sec-tools"><label class="sw"><input type="checkbox" id="hideFig"> 図のラベル答えを隠す</label></div>`;
    sec.parts.forEach((part, pi) => {
      h += `<section class="part" data-pi="${pi}"><h3>${part.title}</h3>`;
      if (part.fig) h += `<div class="fig-center">${part.fig()}</div>`;
      if (part.type === 'items') {
        h += part.items.map((it, i) => {
          const q = byId[it.id];
          return `<div class="qcard" data-card="${it.id}">
            <div class="qhead"><span class="qn">${i + 1}</span><div class="qtext">${it.q}</div>${statBadge(it.id)}</div>
            ${it.fig ? `<div class="qfig">${it.fig()}</div>` : ''}
            <div class="qin">${inputHTML(q)}</div><div class="rslot" data-rs="${it.id}"></div></div>`;
        }).join('');
      } else if (part.type === 'cloze') {
        h += `<div class="cloze">${clozeHTML(part)}</div><div class="cloze-res">${Object.keys(part.blanks).map(k => `<div data-rs="${part.id}-${k}"></div>`).join('')}</div>`;
        if (part.ansFig) h += `<div class="ansfig hidden" data-ansfig="${part.id}"><p class="muted small">▼ 正解の図</p>${part.ansFig()}</div>`;
      } else if (part.type === 'draw') {
        h += `<div class="qcard draw" data-card="${part.id}"><p class="muted small">紙に描いてから「解答例を見る」を押し、自分で○×をつけよう。</p>
          <button type="button" class="btn ghost" data-showdraw="${part.id}">解答例を見る</button>
          <div class="drawans hidden" data-drawans="${part.id}">${part.ans()}<div class="rexp">${part.exp}</div>
          <div class="selfgrade"><span>描けた？</span><button type="button" class="btn sm ok" data-self="${part.id}" data-ok="1">○ できた</button><button type="button" class="btn sm ng" data-self="${part.id}" data-ok="0">× できなかった</button></div></div></div>`;
      }
      h += `</section>`;
    });
    h += `<div class="actions sticky"><button type="button" class="btn primary" id="grade">採点する</button><button type="button" class="btn ghost" id="showAll">答えを全部見る</button><button type="button" class="btn ghost" id="resetSec">リセット</button><span id="score" class="score"></span></div>
    <div class="pager">${prev ? `<a class="btn ghost" href="#/sec/${prev.id}">← ${prev.no}</a>` : '<span></span>'}${next ? `<a class="btn" href="#/sec/${next.id}">${next.no} →</a>` : `<a class="btn" href="#/${sec.src === 'print' ? 'predict' : 'mock'}">${sec.src === 'print' ? '予想問題へ →' : '模擬テストへ →'}</a>`}</div>`;
    app.innerHTML = h;
    const qids = POOL.filter(q => q.sec.id === id && q.kind !== 'draw').map(q => q.id);
    const results = {}; // qid -> true/false（採点済み）
    let graded = false;
    function updateScore() {
      const n = Object.keys(results).length, ok = Object.values(results).filter(Boolean).length;
      $('#score').textContent = n ? `${ok} / ${n} 正解（全${qids.length}問）` : '';
    }
    // 1問だけ採点して結果を表示（○×・選択・自己採点は押した瞬間に呼ぶ）
    function gradeOne(qid, opt = {}) {
      if (qid in results) return;
      const q = byId[qid];
      const v = getVal(app, qid);
      const selfJudged = opt.self || q.kind === 'self';
      const ok = opt.reveal ? false : opt.self ? opt.ok : judge(q, v);
      if (!opt.reveal) { Store.record(qid, ok); results[qid] = ok; }
      lock(app, qid, ok);
      const html = resultHTML(q, ok, v, selfJudged);
      const slot = app.querySelector(`[data-rs="${CSS.escape(qid)}"]`);
      slot.innerHTML = q.cloze ? `<div class="cres-row ${ok ? 'ok' : 'ng'}"><span class="cl">${markLabel(q.key)}</span>${html}</div>` : html;
      if (q.kind === 'tf' || q.kind === 'choice') {
        const g = app.querySelector(`[data-qid="${CSS.escape(qid)}"]`);
        $$('button', g).forEach(b => b.classList.toggle('correct', b.dataset.v === String(q.a)));
      }
      updateScore();
    }
    bindPick(app, qid => gradeOne(qid));
    bindSelf(app, qid => byId[qid], (qid, ok) => gradeOne(qid, { self: true, ok }));
    bindFix(app, qid => { results[qid] = true; updateScore(); });
    function gradeAll(reveal = false) {
      for (const qid of qids) {
        if (qid in results) continue;
        const q = byId[qid];
        // 自己採点の問題は答えを開いて ○× を押してもらう
        if (q.kind === 'self') { revealSelf(app, qid, q); continue; }
        if (q.kind === 'num' && reveal) { revealSelf(app, qid, q); continue; }
        gradeOne(qid, { reveal });
      }
      $$('[data-ansfig]', app).forEach(el => el.classList.remove('hidden'));
      graded = true;
      if (reveal) $('#score').textContent = '解答を表示中';
    }
    $('#grade').onclick = () => { if (graded) return; gradeAll(false); };
    $('#showAll').onclick = () => { if (graded) return; gradeAll(true); $$('[data-drawans]', app).forEach(el => el.classList.remove('hidden')); };
    $('#resetSec').onclick = () => pageSection(id);
    app.addEventListener('click', e => {
      const sd = e.target.closest('[data-showdraw]');
      if (sd) { app.querySelector(`[data-drawans="${sd.dataset.showdraw}"]`).classList.remove('hidden'); sd.remove(); }
      const sg = e.target.closest('[data-self]');
      if (sg) { Store.record(sg.dataset.self, sg.dataset.ok === '1'); sg.parentElement.innerHTML = sg.dataset.ok === '1' ? '<b class="good">○ 記録しました</b>' : '<b class="bad">× 苦手リストに追加しました</b>'; }
    });
    $('#hideFig').onchange = e => app.classList.toggle('hide-anslabel', e.target.checked);
    app.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.target.matches('input.ans')) {
        e.preventDefault();
        const ins = $$('input.ans:not([readonly])', app); const i = ins.indexOf(e.target);
        if (ins[i + 1]) ins[i + 1].focus();
      }
    });
  }

  /* ---------------- 1問表示（クイズ・苦手・模試共通） ---------------- */
  function qBody(q, num) {
    let h = `<div class="qmeta"><span class="tag">${q.sec.no}</span><span class="tag t2">${TOPICS[q.topic]}</span>${statBadge(q.id)}</div>`;
    if (q.cloze) {
      h += `<div class="qtitle">${q.partTitle}</div>`;
      if (q.cloze.fig) h += `<div class="fig-center">${q.cloze.fig()}</div>`;
      h += `<div class="cloze single">${clozeHTML(q.cloze, 'single', q.key)}</div>`;
      h += `<div class="qtext">${markLabel(q.key)} に入る語句は？</div>`;
    } else if (q.kind === 'draw') {
      h += `<div class="qtext">${q.q}</div>${q.fig ? `<div class="fig-center">${q.fig()}</div>` : ''}`;
    } else {
      if (q.partFig && !q.fig) h += `<div class="fig-center">${q.partFig()}</div>`;
      h += `<div class="qtext">${num ? `<span class="qn">${num}</span>` : ''}${q.q}</div>`;
      if (q.fig) h += `<div class="fig-center">${q.fig()}</div>`;
    }
    return h;
  }

  /* ---------------- ページ：一問一答 ---------------- */
  function parseQuery() { const q = location.hash.split('?')[1] || ''; return Object.fromEntries(new URLSearchParams(q)); }
  function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function pageQuizSetup(preset = {}) {
    const weakMode = preset.weak;
    app.innerHTML = `<h1>${weakMode ? '苦手復習' : '一問一答'}</h1>
    ${weakMode ? `<p>直近で間違えた問題だけを出題します。正解すると苦手リストから外れます。</p>` : `<p>プリントと予想問題のすべての問題（穴埋めは1空欄ずつ）から出題します。</p>`}
    <form class="setup" id="setup">
      <fieldset><legend>出典</legend>
        <label><input type="radio" name="src" value="all" checked> すべて</label>
        <label><input type="radio" name="src" value="print"> 演習プリントのみ</label>
        <label><input type="radio" name="src" value="predict"> 予想問題のみ</label></fieldset>
      <fieldset><legend>分野 <button type="button" class="link" id="allT">全選択</button> / <button type="button" class="link" id="noneT">全解除</button></legend>
        <div class="checks">${Object.entries(TOPICS).map(([k, n]) => `<label><input type="checkbox" name="topic" value="${k}" ${!preset.topic || preset.topic === k ? 'checked' : ''}> ${n}</label>`).join('')}</div></fieldset>
      <fieldset><legend>形式</legend>
        <label><input type="checkbox" name="kind" value="text" checked> 記述・穴埋め</label>
        <label><input type="checkbox" name="kind" value="tf" checked> ○×</label>
        <label><input type="checkbox" name="kind" value="choice" checked> 選択</label>
        <label><input type="checkbox" name="kind" value="num" checked> 計算</label>
        <label><input type="checkbox" name="kind" value="self" checked> 記号・数式（答えを見て自己採点）</label>
        <label><input type="checkbox" name="kind" value="draw" checked> 作図（自己採点）</label></fieldset>
      <fieldset><legend>出題数・順番</legend>
        <select name="count"><option value="10">10問</option><option value="20" selected>20問</option><option value="40">40問</option><option value="9999">全部</option></select>
        <label><input type="radio" name="order" value="rand" checked> ランダム</label>
        <label><input type="radio" name="order" value="seq"> 順番どおり</label>
        ${weakMode ? '' : `<label><input type="checkbox" name="unsolved"> まだ正解していない問題を優先</label>`}</fieldset>
      <div class="actions"><button class="btn primary" type="submit">スタート</button><span id="cnt" class="muted"></span></div>
    </form>`;
    const f = $('#setup');
    const pick = () => {
      const fd = new FormData(f);
      const src = fd.get('src'), topics = fd.getAll('topic'), kinds = fd.getAll('kind');
      let list = POOL.filter(q => (src === 'all' || q.src === src) && topics.includes(q.topic) && kinds.includes(q.kind));
      if (weakMode) list = list.filter(q => Store.get(q.id)?.last === 'w');
      return { list, fd };
    };
    const upd = () => { $('#cnt').textContent = `対象 ${pick().list.length} 問`; };
    f.addEventListener('change', upd); upd();
    $('#allT').onclick = () => { $$('input[name=topic]', f).forEach(c => (c.checked = true)); upd(); };
    $('#noneT').onclick = () => { $$('input[name=topic]', f).forEach(c => (c.checked = false)); upd(); };
    f.onsubmit = e => {
      e.preventDefault();
      let { list, fd } = pick();
      if (!list.length) { alert(weakMode ? '苦手な問題はありません 🎉' : '条件に合う問題がありません'); return; }
      if (fd.get('order') === 'rand') list = shuffle(list);
      if (fd.get('unsolved')) list = [...list.filter(q => Store.get(q.id)?.last !== 'c'), ...list.filter(q => Store.get(q.id)?.last === 'c')];
      runQuiz(list.slice(0, +fd.get('count')), weakMode ? '苦手復習' : '一問一答');
    };
  }

  function runQuiz(list, title) {
    let i = 0; const log = [];
    const show = () => {
      if (i >= list.length) return finish();
      const q = list[i];
      app.innerHTML = `<div class="quiz-top"><h1>${title}</h1><span class="prog">${i + 1} / ${list.length}</span></div>
      <div class="bar big"><i style="width:${(i / list.length) * 100}%"></i></div>
      <div class="qcard solo">${qBody(q)}<div class="qin">${inputHTML(q)}</div>
      ${q.kind === 'draw' ? `<button type="button" class="btn ghost" id="seeDraw">解答例を見る</button><div id="drawAns" class="hidden">${q.ans()}<div class="rexp">${q.exp}</div><div class="selfgrade"><button type="button" class="btn ok" data-sg="1">○ できた</button><button type="button" class="btn ng" data-sg="0">× できなかった</button></div></div>` : ''}
      <div class="rslot" id="rs"></div></div>
      <div class="actions">${q.kind === 'text' || q.kind === 'num' ? '<button type="button" class="btn primary" id="check">答え合わせ（Enter）</button>' : ''}<button type="button" class="btn ghost" id="skip">わからない</button><button type="button" class="btn" id="next" hidden>次へ（Enter）</button><a class="link" href="#/quiz">やめる</a></div>`;
      const card = $('.qcard.solo');
      let done = false;
      // ○×・選択肢は押した瞬間に採点、自己採点は ○× ボタンで確定
      bindPick(card, () => check());
      bindSelf(card, () => q, (_, ok) => check(false, ok));
      bindFix(card, id => { const l = log.find(x => x.q.id === id); if (l) l.ok = true; });
      const inp = $('input.ans', card); inp && inp.focus();
      const check = (giveUp = false, selfOk = null) => {
        if (done) return; done = true;
        const v = getVal(card, q.id);
        const selfJudged = selfOk !== null;
        const ok = selfJudged ? selfOk : !giveUp && judge(q, v);
        Store.record(q.id, ok); log.push({ q, ok, v });
        lock(card, q.id, ok);
        if (q.kind === 'tf' || q.kind === 'choice') $$(`[data-qid="${q.id}"] button`, card).forEach(b => b.classList.toggle('correct', b.dataset.v === String(q.a)));
        $$('[data-reveal]', card).forEach(b => b.remove());
        $('#rs').innerHTML = resultHTML(q, ok, v, selfJudged);
        $('#check') && ($('#check').hidden = true); $('#skip').hidden = true; $('#next').hidden = false; $('#next').focus();
      };
      $('#check') && ($('#check').onclick = () => check());
      $('#skip').onclick = () => { if (q.kind === 'draw') { $('#drawAns').classList.remove('hidden'); $('#seeDraw')?.remove(); } else check(true); };
      $('#next').onclick = () => { i++; show(); };
      if (q.kind === 'draw') {
        $('#seeDraw').onclick = () => { $('#drawAns').classList.remove('hidden'); $('#seeDraw').remove(); };
        card.addEventListener('click', e => { const b = e.target.closest('[data-sg]'); if (!b || done) return; done = true; const ok = b.dataset.sg === '1'; Store.record(q.id, ok); log.push({ q, ok }); $('#skip').hidden = true; $('#next').hidden = false; b.parentElement.innerHTML = ok ? '<b class="good">○</b>' : '<b class="bad">×</b>'; });
      }
      card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('input')) { e.preventDefault(); done ? $('#next').click() : check(); } });
    };
    const keyNext = e => { if (e.key === 'Enter' && !e.target.matches('input') && $('#next') && !$('#next').hidden && document.activeElement !== $('#next')) $('#next').click(); };
    document.addEventListener('keydown', keyNext);
    const finish = () => {
      document.removeEventListener('keydown', keyNext);
      const ok = log.filter(l => l.ok).length;
      app.innerHTML = `<h1>${title} 結果</h1><div class="big-score">${ok} <small>/ ${log.length}</small></div>
      <p class="center">${ok === log.length ? '全問正解！🎉' : ok / log.length >= 0.8 ? 'あと少し！間違えた問題を見直そう。' : '間違えた問題は「苦手復習」で繰り返そう。'}</p>
      <h2>間違えた問題</h2>${log.filter(l => !l.ok).map(l => `<div class="review"><div class="qmeta"><span class="tag">${l.q.sec.no}</span></div><div>${l.q.cloze ? `${l.q.partTitle} ${markLabel(l.q.key)}` : stripTags(l.q.q || '').slice(0, 80)}</div><div class="rans">正答：<b>${answerText(l.q)}</b></div>${l.q.exp ? `<div class="rexp">${l.q.exp}</div>` : ''}</div>`).join('') || '<p>なし</p>'}
      <div class="actions"><a class="btn primary" href="#/quiz">もう一度</a><a class="btn" href="#/weak">苦手復習へ</a><a class="btn ghost" href="#/">ホーム</a></div>`;
    };
    show();
  }

  /* ---------------- ページ：計算ドリル ---------------- */
  function pageCalc() {
    let cur = null, gen = null, cnt = 0, okc = 0;
    app.innerHTML = `<h1>計算ドリル</h1><p>数値が毎回変わります。関数電卓を使って OK。単位の接頭語（m, k, μ）を付けて入力しても、指定単位の数値だけでも採点できます。（誤差 ±2% まで正解）</p>
    <div class="chips">${CALC.map(c => `<button type="button" class="chip" data-g="${c.id}">${c.name}</button>`).join('')}<button type="button" class="chip" data-g="all">ミックス</button></div>
    <div id="calcArea" class="qcard solo"><p class="muted">上から種類を選んでスタート</p></div>
    <div class="score" id="cscore"></div>
    <h2>確認用：基本の式</h2><table class="tbl">${FORMULAS.map(f => `<tr><td>${f[0]}</td><td><b>${f[1]}</b></td><td>${f[2]}</td></tr>`).join('')}</table>`;
    const area = $('#calcArea');
    const next = () => {
      const g = gen === 'all' ? CALC[Math.floor(Math.random() * CALC.length)] : CALC.find(c => c.id === gen);
      cur = { ...g.gen(), kind: 'num', id: 'calc-' + g.id }; cur.name = g.name;
      area.innerHTML = `<div class="qmeta"><span class="tag">${g.name}</span></div><div class="qtext">${cur.q}</div><div class="qin">${inputHTML(cur)}</div><div class="rslot" id="crs"></div>
      <div class="actions"><button type="button" class="btn primary" id="cchk">答え合わせ（Enter）</button><button type="button" class="btn" id="cnext" hidden>次の問題（Enter）</button></div>`;
      const inp = $('input.ans', area); inp.focus();
      let done = false;
      const chk = (selfOk = null) => {
        if (done) return; done = true; cnt++;
        const v = inp.value, selfJudged = selfOk !== null, ok = selfJudged ? selfOk : judgeNum(v, cur); if (ok) okc++;
        Store.record(cur.id, ok); lock(area, cur.id, ok);
        $$('[data-reveal]', area).forEach(b => b.remove());
        $('#crs').innerHTML = resultHTML({ ...cur, a: cur.a }, ok, v, selfJudged).replace(/<button[^>]*data-fix[^>]*>.*?<\/button>/, '');
        $('#cchk').hidden = true; $('#cnext').hidden = false; $('#cnext').focus();
        $('#cscore').textContent = `${okc} / ${cnt} 正解`;
      };
      curChk = chk;
      $('#cchk').onclick = () => chk(); $('#cnext').onclick = next;
      area.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); done ? next() : chk(); } };
    };
    let curChk = null;
    bindSelf(area, () => cur, (_, ok) => curChk && curChk(ok));
    $$('.chip', app).forEach(b => b.onclick = () => { $$('.chip', app).forEach(x => x.classList.toggle('sel', x === b)); gen = b.dataset.g; next(); });
  }

  /* ---------------- ページ：模擬テスト ---------------- */
  function pageMockSetup() {
    app.innerHTML = `<h1>模擬テスト</h1>
    <p>プリントと予想問題からランダムに出題し、計算問題（数値ランダム）も混ぜた本番形式のテストです。全問解いてから最後にまとめて採点します。</p>
    <form class="setup" id="ms">
      <fieldset><legend>問題数・時間</legend>
        <label><input type="radio" name="n" value="25"> 25問（25分）</label>
        <label><input type="radio" name="n" value="40" checked> 40問（40分）</label>
        <label><input type="radio" name="n" value="60"> 60問（50分）</label></fieldset>
      <fieldset><legend>出題比率</legend>
        <label><input type="radio" name="mix" value="print" checked> プリント中心（7割）</label>
        <label><input type="radio" name="mix" value="even"> 半々</label></fieldset>
      <div class="actions"><button class="btn primary">開始</button></div></form>`;
    $('#ms').onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(e.target); const n = +fd.get('n'); const mins = { 25: 25, 40: 40, 60: 50 }[n];
      const nCalc = Math.round(n * 0.12), rest = n - nCalc, nPrint = Math.round(rest * (fd.get('mix') === 'print' ? 0.7 : 0.5));
      // 分野が偏らないように、分野ごとに順番に取り出す
      const pickBalanced = (src, k) => {
        const by = {}; shuffle(POOL.filter(q => q.src === src && q.kind !== 'draw')).forEach(q => (by[q.topic] = by[q.topic] || []).push(q));
        const out = []; const keys = shuffle(Object.keys(by));
        while (out.length < k && keys.some(t => by[t].length)) for (const t of keys) { if (by[t].length && out.length < k) out.push(by[t].pop()); }
        return out;
      };
      const qs = [...pickBalanced('print', nPrint), ...pickBalanced('predict', rest - nPrint)];
      const calcs = Array.from({ length: nCalc }, (_, i) => { const g = CALC[i % CALC.length]; return { ...g.gen(), kind: 'num', id: `mock-calc-${i}`, calcId: 'calc-' + g.id, sec: { no: '計算' }, topic: g.topic, src: 'calc' }; });
      runMock(shuffle([...qs, ...calcs]), mins);
    };
  }
  function runMock(list, mins) {
    const end = Date.now() + mins * 60000;
    app.innerHTML = `<div class="quiz-top"><h1>模擬テスト</h1><span class="timer" id="timer"></span></div>
    <p class="muted small">全${list.length}問。穴埋めは1問につき1空欄。答えを入力して最後に「提出して採点」。</p>
    ${list.map((q, i) => `<div class="qcard" data-card="${q.id}">${qBody(q, i + 1)}<div class="qin">${inputHTML(q, { mock: true })}</div><div class="rslot" data-rs="${q.id}"></div></div>`).join('')}
    <div class="actions sticky"><button type="button" class="btn primary" id="submit">提出して採点</button><span id="mscore" class="score"></span></div>`;
    const res = {}; // id -> true/false/null(自己採点待ち)
    bindPick(app); bindFix(app);
    bindSelf(app, id => list.find(q => q.id === id), (id, ok) => {
      const q = list.find(x => x.id === id);
      res[id] = ok; Store.record(id, ok); lock(app, id, ok);
      app.querySelector(`[data-rs="${CSS.escape(id)}"]`).innerHTML = resultHTML(q, ok, '', true);
      renderResult();
    });
    const tick = setInterval(() => {
      const left = Math.max(0, end - Date.now()); const el = $('#timer');
      if (!el) return clearInterval(tick);
      el.textContent = `残り ${Math.floor(left / 60000)}:${String(Math.floor(left / 1000) % 60).padStart(2, '0')}`;
      el.classList.toggle('warn', left < 5 * 60000);
      if (!left) { clearInterval(tick); alert('時間終了！採点します'); submit(); }
    }, 500);
    let done = false;
    const submit = () => {
      if (done) return; done = true; clearInterval(tick);
      for (const q of list) {
        if (q.kind === 'self') {
          // 数式・記号の問題は提出後に答えを見て自己採点
          res[q.id] = null;
          app.querySelector(`[data-qid="${CSS.escape(q.id)}"]`).innerHTML = `<button type="button" class="btn sm reveal" data-reveal="${q.id}">答えを見て自己採点</button>`;
          continue;
        }
        const v = getVal(app, q.id), r = judge(q, v); res[q.id] = r;
        Store.record(q.calcId || q.id, r);
        lock(app, q.id, r);
        if (q.kind === 'tf' || q.kind === 'choice') $$(`[data-qid="${q.id}"] button`, app).forEach(b => b.classList.toggle('correct', b.dataset.v === String(q.a)));
        app.querySelector(`[data-rs="${CSS.escape(q.id)}"]`).innerHTML = resultHTML(q, r, v).replace(/<button[^>]*data-fix[^>]*>.*?<\/button>/, '');
      }
      $('#timer').textContent = '';
      $('#submit').remove();
      renderResult();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    function renderResult() {
      if (!done) return;
      const per = {}; let ok = 0;
      const pending = list.filter(q => res[q.id] === null).length;
      for (const q of list) {
        if (res[q.id] === null) continue;
        const p = per[q.topic] = per[q.topic] || { n: 0, ok: 0 }; p.n++; if (res[q.id]) { p.ok++; ok++; }
      }
      const score = Math.round((ok / list.length) * 100);
      $('.mock-result')?.remove();
      app.insertAdjacentHTML('afterbegin', `<div class="mock-result"><div class="big-score">${score}<small> 点</small></div><p class="center">${ok} / ${list.length} 問正解</p>
        ${pending ? `<p class="center bad">自己採点がまだの問題が ${pending} 問あります（下の「答えを見て自己採点」を押してください）</p>` : ''}
        <table class="tbl"><tr><th>分野</th><th>正解</th><th>正答率</th></tr>${Object.entries(per).map(([t, p]) => `<tr><td>${TOPICS[t]}</td><td>${p.ok}/${p.n}</td><td><div class="bar"><i style="width:${Math.round(p.ok / p.n * 100)}%"></i></div></td></tr>`).join('')}</table>
        <div class="actions"><a class="btn primary" href="#/weak">間違えた問題を復習</a><a class="btn" href="#/mock">もう一度</a></div><p class="muted small">↓ 各問の解説は下に表示されています</p></div>`);
    }
    $('#submit').onclick = () => { const blank = list.filter(q => q.kind !== 'self' && !getVal(app, q.id)).length; if (blank && !confirm(`未回答が ${blank} 問あります。提出しますか？`)) return; submit(); };
  }

  /* ---------------- ルーター ---------------- */
  function route() {
    app.removeEventListener('click', jumpHandler);
    const h = location.hash.replace(/^#\/?/, '').split('?')[0];
    const [p, a] = h.split('/');
    // app を差し替えてイベントリスナーをリセット
    const fresh = app.cloneNode(false); app.replaceWith(fresh); app = fresh;
    $$('.nav a').forEach(x => x.classList.toggle('active', x.getAttribute('href') === '#/' + (p || '')));
    switch (p) {
      case 'notes': pageNotes(); break;
      case 'print': pageSecList('print'); break;
      case 'predict': pageSecList('predict'); break;
      case 'sec': pageSection(a); break;
      case 'quiz': pageQuizSetup(parseQuery()); break;
      case 'weak': pageQuizSetup({ weak: true }); break;
      case 'calc': pageCalc(); break;
      case 'mock': pageMockSetup(); break;
      default: pageHome();
    }
    window.scrollTo(0, 0);
    document.body.classList.remove('menu-open');
  }
  // ---- テーマ切替 ----
  const root = document.documentElement;
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; } catch { }
  $('#themeBtn').onclick = () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch { }
  };
  $('#menuBtn').onclick = () => document.body.classList.toggle('menu-open');

  window.addEventListener('hashchange', route);
  route();
})();
