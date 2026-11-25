/* =========================================================
   問題データ
   - PRINT : 演習プリント（後期中間プリント）の再現
   - PREDICT : ノートから作った予想問題
   part.type: items | cloze | draw
   item.kind: text | tf | choice | num
   ========================================================= */

const TOPICS = {
  tr: 'トランジスタ接地・hパラメータ',
  ic: 'IC（集積回路）',
  fetsym: 'FETの種類・図記号',
  fetst: 'FETの構造',
  fetop: 'FETの動作・特性',
  cmos: 'MOS IC・CMOS',
  diff: '差動増幅回路',
  op: '演算増幅器（OPアンプ）',
};

const TERMS3 = ['ゲート', 'ソース', 'ドレーン', 'g', 's', 'd', 'gate', 'source', 'drain'];
const INF = ['∞', '無限大', '無限', 'むげんだい', 'infinity', 'inf'];

const PRINT = [
  /* ---------------- 問題Ⅰ ---------------- */
  {
    id: 'p1', no: '問題Ⅰ', title: 'トランジスタの接地方式と h パラメータ', topic: 'tr',
    parts: [
      {
        type: 'items', title: '（1）以下の回路の名前を答えよ。',
        items: [
          { id: 'p1-1a', fig: () => FIG.collectorGrounded(), q: '左の回路の名前は？', a: 'コレクタ接地（エミッタフォロワ）', acc: ['コレクタ接地', 'コレクタ接地回路', 'コレクタ接地増幅回路', 'エミッタフォロワ', 'エミッタホロワ', 'コレクタ接地エミッタフォロワ'], exp: 'コレクタが入力・出力の共通端子（交流的に接地）。負荷 R<sub>L</sub> がエミッタ側にあるのが目印。電圧増幅度は約1倍、入力インピーダンスが高く出力インピーダンスが低い。' },
          { id: 'p1-1b', fig: () => FIG.baseGrounded(), q: '中央の回路の名前は？', a: 'ベース接地', acc: ['ベース接地', 'ベース接地回路', 'ベース接地増幅回路'], exp: 'ベースが入力と出力の共通端子。入力はエミッタ、出力はコレクタ。電流増幅率は約1（α）。' },
          { id: 'p1-1c', fig: () => FIG.emitterGrounded(), q: '右の回路の名前は？', a: 'エミッタ接地', acc: ['エミッタ接地', 'エミッタ接地回路', 'エミッタ接地増幅回路'], exp: 'エミッタが共通端子。電圧・電流ともに増幅でき、最もよく使われる増幅回路。' },
        ],
      },
      {
        type: 'items', title: '（4）エミッタ接地増幅回路の 4 象限特性図について答えよ。', fig: () => FIG.hQuadrant(false),
        items: [
          { id: 'p1-4-1', kind: 'self', q: '(1) 点 Pc（第1象限：I<sub>C</sub>–V<sub>CE</sub>）におけるパラメータ（単位があれば記入）', a: 'h<sub>oe</sub> [S]', acc: ['hoe', 'hoes', 'hoeジーメンス', 'hoe[s]'], exp: 'h<sub>oe</sub> = ΔI<sub>C</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）。電流÷電圧なので単位は S（ジーメンス）。' },
          { id: 'p1-4-2', q: '(2) (1)のパラメータ名（日本語）', a: '出力アドミタンス', acc: ['出力アドミタンス', '出力アドミッタンス'], exp: '出力側の「電流の流れやすさ」＝アドミタンス。' },
          { id: 'p1-4-3', kind: 'self', q: '(3) 点 Pa（第2象限：I<sub>C</sub>–I<sub>B</sub>）におけるパラメータ', a: 'h<sub>fe</sub>（単位なし）', acc: ['hfe', 'hfe単位なし', 'hfeなし'], exp: 'h<sub>fe</sub> = ΔI<sub>C</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）。電流÷電流なので単位なし。' },
          { id: 'p1-4-4', q: '(4) (3)のパラメータ名（日本語）', a: '電流増幅率', acc: ['電流増幅率', '小信号電流増幅率'], exp: 'ベース電流の変化に対してコレクタ電流が何倍変化するか。' },
          { id: 'p1-4-5', kind: 'self', q: '(5) 点 Pb（第3象限：V<sub>BE</sub>–I<sub>B</sub>）におけるパラメータ', a: 'h<sub>ie</sub> [Ω]', acc: ['hie', 'hieω', 'hieオーム', 'hie[ω]'], exp: 'h<sub>ie</sub> = ΔV<sub>BE</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）。電圧÷電流なので単位は Ω。' },
          { id: 'p1-4-6', q: '(6) (5)のパラメータ名（日本語）', a: '入力インピーダンス', acc: ['入力インピーダンス'], exp: '入力側（ベース–エミッタ間）の抵抗のようなもの。' },
          { id: 'p1-4-7', kind: 'self', q: '(7) 点 Pd（第4象限：V<sub>BE</sub>–V<sub>CE</sub>）におけるパラメータ', a: 'h<sub>re</sub>（単位なし）', acc: ['hre', 'hre単位なし', 'hrc', 'hvc'], exp: 'h<sub>re</sub> = ΔV<sub>BE</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）。電圧÷電圧なので単位なし。値は非常に小さく、ほぼ水平な線になる。' },
          { id: 'p1-4-8', q: '(8) (7)のパラメータ名（日本語）', a: '電圧帰還率', acc: ['電圧帰還率'], exp: '出力電圧の変化が入力側にどれだけ戻る（帰還する）か。' },
        ],
      },
    ],
  },
  /* ---------------- 問題Ⅱ ---------------- */
  {
    id: 'p2', no: '問題Ⅱ', title: 'IC（集積回路）', topic: 'ic',
    parts: [
      {
        type: 'items', title: '（1）正しいものに○、間違っているものに×をつけよ。',
        items: [
          { id: 'p2-1', kind: 'tf', q: 'IC とは Intelligent Circuit の略であり、高い知能を持つ回路のことを示す。', a: '×', exp: 'IC は <b>Integrated Circuit</b>（集積回路）の略。' },
          { id: 'p2-2', kind: 'tf', q: 'IC は高性能・小型・低価格、信頼性が高いなどの特徴を持っているため、現在、電子回路の多くは IC 化されている。IC のほとんどがモノリシック IC である。', a: '○', exp: '1枚のシリコン基板上に全素子を作り込むモノリシック IC が大部分。（プリントの「低下買う」は「低価格」の誤変換）' },
          { id: 'p2-3', kind: 'tf', q: 'IC の集積度による分類で、SSI（100素子以下）、MSI（100～1,000素子）、LSI（1,000素子以上）、VLSI（100万素子以上）、ULSI（1,000万素子以上）とされている。', a: '○', exp: '集積度が上がるほど SSI → MSI → LSI → VLSI → ULSI。※参考書によっては VLSI を「10万素子以上」とするものもあるので、授業で扱った境界の数字をそのまま覚えておくこと。' },
          { id: 'p2-4', kind: 'tf', q: 'IC の機能による分類で、アナログ IC はリニア IC とも呼ばれ、オペアンプなどの増幅回路が構成される。', a: '○', exp: 'アナログ IC＝リニア IC。オペアンプ、電源 IC など。' },
          { id: 'p2-5', kind: 'tf', q: 'IC の機能による分類で、デジタル IC は論理回路、メモリなどの回路が構成される。', a: '○', exp: 'デジタル IC：論理回路（AND/OR/NOT など）、メモリ、マイコンなど。' },
          { id: 'p2-6', kind: 'tf', q: 'IC の型式番号で、LM で始まるものはアナログ IC である。', a: '○', exp: 'LM（Linear Monolithic）＝アナログ IC。例：LM339（コンパレータ）、LM358（オペアンプ）。' },
          { id: 'p2-7', kind: 'tf', q: 'IC の型式番号で、74 で始まるものはデジタル IC である。', a: '○', exp: '74 シリーズ（7400 など）は代表的なデジタル（ロジック）IC。' },
          { id: 'p2-8', kind: 'tf', q: 'IC は数十 mm² の面積のケイ素基板（チップ）で作られ、この中に非常に多くのダイオード、トランジスタ、抵抗、コンデンサなどの素子が入っている。', a: '○', exp: 'ケイ素＝シリコン（Si）。小さなチップに多数の素子を集積。' },
          { id: 'p2-9', kind: 'tf', q: 'IC 内部においてインダクタの構成においては、大きなものは苦手である。', a: '○', exp: 'IC の中ではコイル（インダクタ）や大容量コンデンサは作りにくい。' },
          { id: 'p2-10', kind: 'tf', q: 'IC を作る材料で重要なのはウェハであり、単結晶シリコンの純度も大事であるが、ウェハの表面の鏡面加工やたわみなどの機械的要素も重要となる。', a: '○', exp: '純度（99.999999999%＝イレブンナイン）だけでなく、表面の平坦さ・たわみも重要。' },
        ],
      },
      {
        type: 'items', title: '（2）IC のパッケージ①～⑤の名称を答えよ。（ヒント：Dual Inline Package / Single Inline Package / Pin grid array / Small Outline Package / Quad Flat Package）',
        items: [
          { id: 'p2-pk1', fig: () => FIG.pkg('DIP'), q: '① 両側2列にリードが出ている挿入形', a: 'Dual Inline Package（DIP）', acc: ['dualinlinepackage', 'dip', 'デュアルインラインパッケージ'], exp: 'リード挿入形。2列（Dual）に足が並ぶ。' },
          { id: 'p2-pk2', fig: () => FIG.pkg('SIP'), q: '② 片側1列にリードが出ている挿入形', a: 'Single Inline Package（SIP）', acc: ['singleinlinepackage', 'sip', 'シングルインラインパッケージ'], exp: 'リード挿入形。1列（Single）に足が並ぶ。' },
          { id: 'p2-pk3', fig: () => FIG.pkg('PGA'), q: '③ 底面に剣山のようにピンが並ぶ挿入形', a: 'Pin grid array（PGA）', acc: ['pingridarray', 'pga', 'ピングリッドアレイ'], exp: 'リード挿入形。底面に格子（grid）状にピン。CPU などで使用。' },
          { id: 'p2-pk4', fig: () => FIG.pkg('SOP'), q: '④ 2辺からガルウィング状のリードが出ている小型の表面実装形', a: 'Small Outline Package（SOP）', acc: ['smalloutlinepackage', 'sop', 'スモールアウトラインパッケージ'], exp: '表面実装形。DIP を小さく平たくしたもの。' },
          { id: 'p2-pk5', fig: () => FIG.pkg('QFP'), q: '⑤ 4辺すべてからリードが出ている表面実装形', a: 'Quad Flat Package（QFP）', acc: ['quadflatpackage', 'qfp', 'クアッドフラットパッケージ'], exp: '表面実装形。Quad＝4方向。' },
        ],
      },
    ],
  },
  /* ---------------- 問題Ⅲ ---------------- */
  {
    id: 'p3', no: '問題Ⅲ', title: 'トランジスタ・FET の図記号と端子', topic: 'fetsym',
    parts: [
      {
        type: 'items', title: '（1）各トランジスタの名称（必要な場合は形やチャネル）を答えよ。',
        items: [
          { id: 'p3-s1', fig: () => FIG.symbol('mos-n-d'), q: '図記号① の名称は？', a: 'nチャネル デプレション形 MOSFET', acc: ['nチャネルデプレション形mosfet', 'nチャネルデプレション形', 'デプレション形nチャネルmosfet', 'デプレション形nチャネル', 'nチャネルデプレションmosfet'], exp: 'ゲートが離れている → MOSFET。チャネル線が<b>つながっている（実線）</b> → 最初からチャネルがある＝デプレション形。矢印が<b>内向き</b> → nチャネル。' },
          { id: 'p3-s2', fig: () => FIG.symbol('mos-n-e'), q: '図記号② の名称は？', a: 'nチャネル エンハンスメント形 MOSFET', acc: ['nチャネルエンハンスメント形mosfet', 'nチャネルエンハンスメント形', 'エンハンスメント形nチャネルmosfet', 'エンハンスメント形nチャネル'], exp: 'チャネル線が<b>途切れている</b> → 電圧をかけて初めてチャネルができる＝エンハンスメント形。矢印内向き → nチャネル。' },
          { id: 'p3-s3', fig: () => FIG.symbol('jfet-n'), q: '図記号③ の名称は？', a: 'nチャネル 接合形 FET', acc: ['nチャネル接合形fet', 'nチャネル接合形', 'nチャネルjfet', 'nチャネルj-fet', '接合形nチャネル', '接合形fetnチャネル'], exp: 'ゲートが直接チャネルに接している → 接合形 FET（J-FET）。矢印がチャネルに向かう（内向き）→ nチャネル。' },
          { id: 'p3-s4', fig: () => FIG.symbol('mos-p-d'), q: '図記号④ の名称は？', a: 'pチャネル デプレション形 MOSFET', acc: ['pチャネルデプレション形mosfet', 'pチャネルデプレション形', 'デプレション形pチャネルmosfet', 'デプレション形pチャネル'], exp: 'チャネル実線 → デプレション形。矢印が<b>外向き</b> → pチャネル。' },
          { id: 'p3-s5', fig: () => FIG.symbol('npn'), q: '図記号⑤ の名称は？', a: 'npn 形トランジスタ', acc: ['npn形トランジスタ', 'npn形', 'npn', 'npnトランジスタ', 'npn形バイポーラトランジスタ'], exp: 'エミッタの矢印が外向き（Not Pointing iN）→ npn 形。' },
          { id: 'p3-s6', fig: () => FIG.symbol('jfet-p'), q: '図記号⑥ の名称は？', a: 'pチャネル 接合形 FET', acc: ['pチャネル接合形fet', 'pチャネル接合形', 'pチャネルjfet', 'pチャネルj-fet', '接合形pチャネル', '接合形fetpチャネル'], exp: '接合形で矢印が外向き → pチャネル J-FET。' },
          { id: 'p3-s7', fig: () => FIG.symbol('pnp'), q: '図記号⑦ の名称は？', a: 'pnp 形トランジスタ', acc: ['pnp形トランジスタ', 'pnp形', 'pnp', 'pnpトランジスタ', 'pnp形バイポーラトランジスタ'], exp: 'エミッタの矢印が内向き → pnp 形。' },
          { id: 'p3-s8', fig: () => FIG.symbol('mos-p-e'), q: '図記号⑧ の名称は？', a: 'pチャネル エンハンスメント形 MOSFET', acc: ['pチャネルエンハンスメント形mosfet', 'pチャネルエンハンスメント形', 'エンハンスメント形pチャネルmosfet', 'エンハンスメント形pチャネル'], exp: 'チャネル破線 → エンハンスメント形。矢印外向き → pチャネル。' },
        ],
      },
      {
        type: 'items', title: '（2）正しいものには○、誤りがあるものには×をつけよ。（×の場合は誤りの場所も確認しよう）',
        items: [
          { id: 'p3-t1', kind: 'tf', q: 'FET の端子 D とは drain のことである。', a: '○', exp: 'D＝drain（ドレーン）：キャリアを収集する端子。' },
          { id: 'p3-t2', kind: 'tf', q: 'FET の端子 G とは <u>gole</u> のことである。', a: '×', exp: '誤り：gole → 正しくは <b>gate</b>（ゲート）。' },
          { id: 'p3-t3', kind: 'tf', q: 'FET の端子 S とは <u>sauce</u> のことである。', a: '×', exp: '誤り：sauce → 正しくは <b>source</b>（ソース）。' },
          { id: 'p3-t4', kind: 'tf', q: 'FET はユニポーラトランジスタに分類され、電圧によって動作する。', a: '○', exp: 'FET はキャリアが1種類 → ユニポーラ。ゲート電圧でドレーン電流を制御する電圧制御形。' },
          { id: 'p3-t5', kind: 'tf', q: 'FET は<u>バイポーラ</u>トランジスタに分類され、<u>電流</u>によって動作する。', a: '×', exp: '誤り：バイポーラ → <b>ユニポーラ</b>、電流 → <b>電圧</b>。（電流で動作するバイポーラはふつうのトランジスタ）' },
          { id: 'p3-t6', kind: 'tf', q: 'トランジスタの端子 E とは emitter のことである。', a: '○', exp: 'E＝emitter（エミッタ）。' },
          { id: 'p3-t7', kind: 'tf', q: 'トランジスタの端子 B とは <u>boss</u> のことである。', a: '×', exp: '誤り：boss → 正しくは <b>base</b>（ベース）。' },
          { id: 'p3-t8', kind: 'tf', q: 'トランジスタの端子 C とは <u>collectin</u> のことである。', a: '×', exp: '誤り：collectin → 正しくは <b>collector</b>（コレクタ）。' },
          { id: 'p3-t9', kind: 'tf', q: 'FET とは電界効果トランジスタのことであり、field-effect transistor の略称である。', a: '○', exp: 'FET＝Field-Effect Transistor（電界効果トランジスタ）。' },
          { id: 'p3-t10', kind: 'tf', q: 'MOSFET の M は <u>mountain</u>、O は <u>ocean</u>、S は <u>sun</u> のことであり地球の恵みを示す。', a: '×', exp: '誤り：M＝<b>Metal</b>（金属）、O＝<b>Oxide</b>（酸化物）、S＝<b>Semiconductor</b>（半導体）。' },
        ],
      },
      {
        type: 'items', title: '（3）FET（2SK30A・2SK882・3SK38A）の V<sub>GS</sub>–I<sub>D</sub> 特性について答えよ。', fig: () => `<div class="fig-row"><div>${FIG.gmGraph('jfet')}<p class="cap">2SK30A 型（V<sub>GS</sub> 負側で I<sub>D</sub> 変化）</p></div><div>${FIG.gmGraph('dep')}<p class="cap">2SK882 型（V<sub>GS</sub> 正負両側）</p></div><div>${FIG.gmGraph('enh')}<p class="cap">3SK38A 型（V<sub>GS</sub>=0 では I<sub>D</sub>≈0）</p></div></div>`,
        items: [
          { id: 'p3-g1', kind: 'num', q: '① 2SK30A において動作点の V<sub>GS</sub> が 0.23V～0.58V に変化し、このとき I<sub>D</sub> は 2.0mA～4.4mA であった。相互コンダクタンス g<sub>m</sub> は？（単位 mS）', val: 6.857e-3, unit: 'S', show: 'mS', a: 'g<sub>m</sub> ≒ 6.86 mS', exp: 'g<sub>m</sub> = ΔI<sub>D</sub> / ΔV<sub>GS</sub> = (4.4−2.0)mA / (0.58−0.23)V = 2.4mA / 0.35V ≒ <b>6.86 mS</b>' },
          { id: 'p3-g2', kind: 'num', q: '② 2SK882 において動作点の V<sub>GS</sub> が −0.5V～0.5V に変化し、このとき I<sub>D</sub> は 3.5mA～14.0mA であった。相互コンダクタンス g<sub>m</sub> は？（単位 mS）', val: 10.5e-3, unit: 'S', show: 'mS', a: 'g<sub>m</sub> = 10.5 mS', exp: 'g<sub>m</sub> = (14.0−3.5)mA / (0.5−(−0.5))V = 10.5mA / 1.0V = <b>10.5 mS</b>' },
          { id: 'p3-g3', q: '③ 2SK30A の形は？', a: '接合形（nチャネル J-FET）', acc: ['接合形', '接合形fet', 'nチャネル接合形', 'nチャネル接合形fet', 'jfet', 'j-fet'], exp: 'V<sub>GS</sub> が<b>負（逆電圧）の範囲だけ</b>で I<sub>D</sub> が変化し、V<sub>GS</sub>=0 で I<sub>D</sub> 最大 → 接合形。' },
          { id: 'p3-g4', q: '③ 2SK882 の形は？', a: 'デプレション形（MOSFET）', acc: ['デプレション形', 'デプレション形mosfet', 'nチャネルデプレション形', 'nチャネルデプレション形mosfet'], exp: 'V<sub>GS</sub>=0 でも I<sub>D</sub> が流れ、負でも正でも動作 → デプレション形。' },
          { id: 'p3-g5', q: '③ 3SK38A の形は？', a: 'エンハンスメント形（MOSFET）', acc: ['エンハンスメント形', 'エンハンスメント形mosfet', 'nチャネルエンハンスメント形', 'nチャネルエンハンスメント形mosfet'], exp: 'V<sub>GS</sub>=0 では I<sub>D</sub>≈0、正の V<sub>GS</sub> を大きくすると I<sub>D</sub> が流れ始める → エンハンスメント形。' },
        ],
      },
    ],
  },
  /* ---------------- 問題Ⅳ ---------------- */
  {
    id: 'p4', no: '問題Ⅳ', title: 'FET の構造', topic: 'fetst',
    parts: [
      {
        type: 'cloze', title: '（1）下線部を埋めよ。', id: 'p4a',
        text: '接合形 FET の断面図を図1(a)に示す。3本の端子を、[[1]]、[[2]]、[[3]]と呼ぶ。図のように、n形領域にドレーンとソースの電極が接続され、この電極間を[[4]]が流れる。この電流の通路を[[5]]と呼ぶ。⑤が[[6]]でできている場合を[[7]]と呼び、[[8]]でできている場合を[[9]]という。',
        blanks: {
          1: { a: 'ゲート（順不同）', acc: TERMS3, exp: '①②③は ゲート・ソース・ドレーン（順不同）。' },
          2: { a: 'ソース（順不同）', acc: TERMS3 },
          3: { a: 'ドレーン（順不同）', acc: TERMS3 },
          4: { a: '電流（ドレーン電流）', acc: ['電流', 'ドレーン電流', 'id', 'ドレーン電流id'] },
          5: { a: 'チャネル', acc: ['チャネル'] },
          6: { a: 'n形半導体', acc: ['n形半導体', 'n形', 'n'] },
          7: { a: 'nチャネル', acc: ['nチャネル', 'nチャネルfet', 'nチャネル接合形fet'] },
          8: { a: 'p形半導体', acc: ['p形半導体', 'p形', 'p'] },
          9: { a: 'pチャネル', acc: ['pチャネル', 'pチャネルfet', 'pチャネル接合形fet'] },
        },
      },
      {
        type: 'cloze', title: '（2）図1(a)（nチャネル接合形 FET）の ⑩～⑯ を埋めよ。', id: 'p4b', fig: () => FIG.jfetSection(false), ansFig: () => FIG.jfetSection(true),
        text: '⑩ [[10]]　⑪ [[11]]　⑫ [[12]]　⑬ [[13]]　⑭ [[14]]　⑮ [[15]]　⑯ [[16]]',
        blanks: {
          10: { a: '酸化膜（SiO₂・絶縁膜）', acc: ['酸化膜', '酸化膜sio2', 'sio2', '絶縁膜', '酸化膜絶縁層', '二酸化ケイ素', '二酸化シリコン', '酸化膜(sio2)'], exp: '表面を覆う SiO₂ の膜（絶縁性がある）。' },
          11: { a: 'S（ソース）', acc: ['s', 'ソース', 'sソース', 'source'] },
          12: { a: 'G（ゲート）', acc: ['g', 'ゲート', 'gゲート', 'gate'] },
          13: { a: 'D（ドレーン）', acc: ['d', 'ドレーン', 'dドレーン', 'drain'] },
          14: { a: '電極（アルミ）', acc: ['電極', 'アルミ', 'アルミ電極', '電極アルミ', '金属電極', 'アルミニウム', '電極(アルミ)'], exp: '端子を取り出す金属（アルミなど）の電極。' },
          15: { a: 'p形', acc: ['p形', 'p', 'p形半導体', 'p形領域'], exp: 'ゲートにつながる p 形領域。' },
          16: { a: 'n形', acc: ['n形', 'n', 'n形半導体', 'n形領域'], exp: 'nチャネルなので本体（チャネル）は n 形。' },
        },
      },
      {
        type: 'cloze', title: '（3）下線部を埋めよ。', id: 'p4c',
        text: '図2(a)は MOSFET の断面構造である。MOSFET のゲートは、ゲート電極と半導体の間が非常に[[17]]い[[18]]で隔てられている。また、サブストレートは通常[[19]]に接続されている。MOSFET には[[20]]形と[[21]]形がある。また接合形と同様に n チャネルと p チャネルがある。',
        blanks: {
          17: { a: '薄', acc: ['薄', '薄い', 'うす', 'うすい'] },
          18: { a: '酸化膜（SiO₂ の絶縁膜）', acc: ['酸化膜', 'sio2', '絶縁膜', '酸化膜絶縁層', '酸化膜sio2', '絶縁層', '酸化膜(sio2)'] },
          19: { a: 'ソース', acc: ['ソース', 's', 'ソース端子'] },
          20: { a: 'エンハンスメント（順不同）', acc: ['エンハンスメント', 'デプレション'] },
          21: { a: 'デプレション（順不同）', acc: ['デプレション', 'エンハンスメント'] },
        },
      },
      {
        type: 'cloze', title: '（4）図2(a)（pチャネル MOSFET）の ㉒～㉚ を埋めよ。', id: 'p4d', fig: () => FIG.mosSection(false), ansFig: () => FIG.mosSection(true),
        text: '㉒ [[22]]　㉓ [[23]]　㉔ [[24]]　㉕ [[25]]　㉖ [[26]]　㉗ [[27]]　㉘ [[28]]　㉙ [[29]]　㉚ [[30]]',
        blanks: {
          22: { a: '酸化膜（SiO₂）', acc: ['酸化膜', 'sio2', '絶縁膜', '酸化膜絶縁層', '酸化膜sio2', '二酸化ケイ素', '酸化膜(sio2)'] },
          23: { a: 'S（ソース）', acc: ['s', 'ソース', 'sソース', 'source'] },
          24: { a: 'G（ゲート）', acc: ['g', 'ゲート', 'gゲート', 'gate'] },
          25: { a: 'D（ドレーン）', acc: ['d', 'ドレーン', 'dドレーン', 'drain'] },
          26: { a: '電極（アルミ）', acc: ['電極', 'アルミ', 'アルミ電極', '電極アルミ', '金属電極', 'アルミニウム', '電極(アルミ)'] },
          27: { a: 'p形', acc: ['p形', 'p', 'p形半導体', 'p形領域'], exp: 'pチャネルなのでソース・ドレーン部分は p 形。' },
          28: { a: 'p形', acc: ['p形', 'p', 'p形半導体', 'p形領域'] },
          29: { a: 'n形', acc: ['n形', 'n', 'n形半導体', 'n形基板', 'n形領域'], exp: 'pチャネル MOSFET の基板は n 形（nチャネルなら逆で p 形基板に n 形）。' },
          30: { a: 'サブストレート（基板）', acc: ['サブストレート', '基板', 'sub', 'サブストレート端子', 'サブストレート基板', 'substrate', 'サブ'], exp: '基板端子（Sub）。通常ソースに接続する。' },
        },
      },
    ],
  },
  /* ---------------- 問題Ⅴ ---------------- */
  {
    id: 'p5', no: '問題Ⅴ', title: 'FET の動作', topic: 'fetop',
    parts: [
      {
        type: 'cloze', title: '（1）接合形 FET の動作。下線部を埋めよ。', id: 'p5a',
        fig: () => `<div class="fig-row">${FIG.jfetOperation(0)}${FIG.jfetOperation(1)}${FIG.jfetOperation(2)}</div>`,
        text: '図3(a)のように、ゲートに電圧を加えず、[[1]]と[[2]]の間に電圧[[3]]を加えると、[[4]]形領域の電子は[[5]]の[[6]]の電圧に引き寄せられ、ドレーン電流 I<sub>D</sub> が[[7]]に[[8]]。<br>図3(b)のように、[[9]]と[[10]]の間に[[11]]電圧 V<sub>GS</sub> を加えると、p-n 接合面付近に[[12]]が広がり、[[13]]の流れるチャネルが狭められ、[[14]]は減少する。<br>図3(c)のように、さらに[[15]]を大きくしていくと、[[16]]がチャネルを[[17]]に[[18]]ようになり、[[19]]は流れない。このときの電圧をピンチオフ電圧 V<sub>P</sub> という。<br>FET は、ゲートに逆電圧を加えるため、ゲート電流が流れないことと、ゲートに加える電圧でドレーン電流を制御する電圧制御形の素子である。',
        blanks: {
          1: { a: 'ドレーン', acc: ['ドレーン', 'd', 'ソース', 's'], exp: 'ドレーンとソースの間（D–S 間）に V<sub>DS</sub>。' },
          2: { a: 'ソース', acc: ['ソース', 's', 'ドレーン', 'd'] },
          3: { self: true, a: 'V<sub>DS</sub>', acc: ['vds', 'ドレーンソース間電圧'] },
          4: { a: 'n', acc: ['n', 'n形'] },
          5: { a: 'ドレーン', acc: ['ドレーン', 'd'] },
          6: { a: '正（＋）', acc: ['正', '+', 'プラス', '正の'] },
          7: { a: 'ドレーンからソース（の向き）', acc: ['ドレーンからソース', 'dからs', 'dからsの向き', 'ドレーンからソースの向き', 'ソースからドレーン', '十分', 'よく', '多く', '最大'], exp: '電子は S→D へ移動するので、電流 I<sub>D</sub> は D→S の向きに流れる。（「十分に流れる」のような答え方も可）' },
          8: { a: '流れる', acc: ['流れる', 'ながれる'] },
          9: { a: 'ゲート', acc: ['ゲート', 'g'] },
          10: { a: 'ソース', acc: ['ソース', 's'] },
          11: { a: '逆（逆方向）', acc: ['逆', '逆方向', '負', 'マイナス', '逆バイアス'] },
          12: { a: '空乏層', acc: ['空乏層'] },
          13: { a: '電子', acc: ['電子', 'キャリア', 'ドレーン電流', 'id'] },
          14: { a: 'ドレーン電流 I<sub>D</sub>', acc: ['ドレーン電流', 'id', 'ドレーン電流id'] },
          15: { self: true, a: 'V<sub>GS</sub>（逆電圧）', acc: ['vgs', '逆電圧', 'ゲートソース間電圧', 'ゲート電圧'] },
          16: { a: '空乏層', acc: ['空乏層'] },
          17: { a: '完全', acc: ['完全', '完全に', '全部', '全て', 'すべて'] },
          18: { a: 'ふさぐ（閉じる）', acc: ['ふさぐ', '塞ぐ', '閉じる', 'とじる', 'ふさがれる', '塞がれる', '遮断する'] },
          19: { a: 'ドレーン電流 I<sub>D</sub>', acc: ['ドレーン電流', 'id', 'ドレーン電流id', '電流'] },
        },
      },
      {
        type: 'cloze', title: '（2）エンハンスメント形 MOSFET。下線部を埋めよ。', id: 'p5b', fig: () => FIG.mosOperation('enh'),
        text: 'エンハンスメント形 MOSFET は、ゲートに電圧を加えず、ドレーン・ソース間に電圧を加えてもドレーン電流は流れない。[[20]]を大きくすると、酸化膜絶縁層の下の[[21]]半導体領域に[[22]]である電子が集まってくる。すると、その電子により[[23]]の通路ができるので、[[24]]が流れるようになる。',
        blanks: {
          20: { self: true, a: 'V<sub>GS</sub>（正のゲート電圧）', acc: ['vgs', 'ゲート電圧', 'ゲートソース間電圧', '正のゲート電圧', '正の電圧', 'ゲートの電圧'] },
          21: { a: 'p形', acc: ['p形', 'p'] },
          22: { a: '少数キャリア', acc: ['少数キャリア', 'キャリア'], exp: 'p 形半導体の中では電子は少数キャリア。' },
          23: { a: '電子', acc: ['電子', 'nチャネル', 'チャネル', 'キャリア'] },
          24: { a: 'ドレーン電流 I<sub>D</sub>', acc: ['ドレーン電流', 'id', 'ドレーン電流id', '電流'] },
        },
      },
      {
        type: 'cloze', title: '（3）デプレション形 MOSFET。下線部を埋めよ。', id: 'p5c', fig: () => FIG.mosOperation('dep'),
        text: 'デプレション形 MOSFET はあらかじめチャネルを[[25]]しておく。すると、ゲートに[[26]]を加えなくてもドレーン電流が[[27]]。V<sub>GS</sub>=0V の時もドレーン電流 I<sub>D</sub> が流れ、負の電圧である V<sub>GS</sub> を大きくすると I<sub>D</sub> が減少する特性となる。',
        blanks: {
          25: { a: '形成', acc: ['形成', '作成', 'つくって', '作って', '作る'] },
          26: { a: '電圧', acc: ['電圧', 'vgs', 'ゲート電圧'] },
          27: { a: '流れる', acc: ['流れる', 'ながれる'] },
        },
      },
    ],
  },
  /* ---------------- 問題Ⅵ ---------------- */
  {
    id: 'p6', no: '問題Ⅵ', title: '差動増幅回路', topic: 'diff',
    parts: [
      {
        type: 'cloze', title: '（1）差動増幅回路。下線部を埋めよ。', id: 'p6a', fig: () => FIG.diffBlock(),
        text: '差動増幅回路は、図1に示すように、2個の[[a]]①、②の間に加えられた信号の[[b]] v<sub>i</sub> を[[c]]して、2個の[[d]]③、④に[[e]]の[[f]] v<sub>o</sub> として出力する回路である。このように[[g]]では、入力信号の差 v<sub>i</sub> を[[h]]しているので、[[i]]と[[j]]に共通に含まれる成分は出力に現れない。従って、温度変化などによって生じる[[k]]の影響を受けにくい回路となっている。また、差動増幅回路は、ベースの入力[[l]]を用いない回路構成となるので、直流から[[m]]することが可能である。差動増幅回路は[[n]]化されて、[[o]]にも利用されている。',
        blanks: {
          a: { a: '入力端子', acc: ['入力端子', '入力'] },
          b: { a: '差', acc: ['差', '差電圧', '差の電圧'] },
          c: { a: '増幅', acc: ['増幅'] },
          d: { a: '出力端子', acc: ['出力端子', '出力'] },
          e: { a: '差', acc: ['差', '増幅された差', '差動'] },
          f: { a: '出力電圧', acc: ['出力電圧', '電圧', '出力'] },
          g: { a: '差動増幅回路', acc: ['差動増幅回路', '差動増幅'] },
          h: { a: '増幅', acc: ['増幅'] },
          i: { self: true, a: 'v<sub>i1</sub>', acc: ['vi1', 'vi2'] },
          j: { self: true, a: 'v<sub>i2</sub>', acc: ['vi2', 'vi1'] },
          k: { a: '温度ドリフト（ドリフト）', acc: ['温度ドリフト', 'ドリフト', 'ドリフト電圧'], exp: '温度変化による出力のずれ＝ドリフト。2つの入力に共通に現れるので打ち消される。' },
          l: { a: '結合コンデンサ（コンデンサ）', acc: ['コンデンサ', '結合コンデンサ', 'カップリングコンデンサ'], exp: 'コンデンサは直流を通さないので、それを使わない差動増幅は直流から増幅できる（直結増幅）。' },
          m: { a: '増幅', acc: ['増幅'] },
          n: { a: 'IC', acc: ['ic', '集積回路', 'ic集積回路'] },
          o: { a: '演算増幅器（オペアンプ）', acc: ['演算増幅器', 'オペアンプ', 'opアンプ', '演算増幅回路', 'オペアンプ演算増幅器'] },
        },
      },
      {
        type: 'items', title: '（2）次の増幅回路（図2）について答えよ。', fig: () => FIG.diffCircuit(),
        items: [
          { id: 'p6-2-1', q: '① この回路（図2）の名称を答えよ。', a: '差動増幅回路', acc: ['差動増幅回路', '差動増幅器', '差動増幅'], exp: '2つのトランジスタのエミッタを共通の R<sub>E</sub> につないだ対称な回路。' },
        ],
      },
      {
        type: 'draw', id: 'p6-2-2', title: '② 図3のように v<sub>i1</sub> と v<sub>i2</sub> に<b>同相</b>の入力信号を与えたとき、v<sub>o</sub> と v<sub>o1</sub>、v<sub>o2</sub> を図示せよ。',
        fig: () => FIG.inputWaves('same'), ans: () => FIG.diffWaves('same'),
        exp: 'v<sub>o1</sub>、v<sub>o2</sub> はどちらも入力と<b>逆位相</b>で同じ大きさ → v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub> = <b>0</b>（同相成分は出力に現れない）。',
      },
      {
        type: 'draw', id: 'p6-2-3', title: '③ 図4のように v<sub>i1</sub> と v<sub>i2</sub> に互いに<b>逆相</b>の入力信号を与えたとき、v<sub>o</sub> と v<sub>o1</sub>、v<sub>o2</sub> を図示せよ。',
        fig: () => FIG.inputWaves('anti'), ans: () => FIG.diffWaves('anti'),
        exp: 'v<sub>o1</sub>（c–GND）は v<sub>i1</sub> の逆位相、v<sub>o2</sub>（d–GND）は v<sub>i2</sub> の逆位相 → 互いに逆相。v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub>（c–d 間）は<b>2倍の大きさ</b>になる（差が増幅される）。',
      },
    ],
  },
  /* ---------------- 問題Ⅶ ---------------- */
  {
    id: 'p7', no: '問題Ⅶ', title: '演算増幅器（OPアンプ）', topic: 'op',
    parts: [
      {
        type: 'cloze', title: '（1）演算増幅器。下線部を埋めよ。', id: 'p7a',
        text: '演算増幅器は[[1]]ともいう。[[2]]（逆相入力）と[[3]]（正相入力）の2個の[[4]]と1個の出力端子を持っている。また、基本的に正負の2個の[[5]]を必要とする。<br>演算増幅回路の入力インピーダンスは非常に[[6]]、出力インピーダンスは[[7]]。また、開放電圧利得は非常に[[8]]。そこで、入力インピーダンス Z<sub>i</sub>=[[9]]、出力インピーダンス Z<sub>o</sub>=[[10]]、開放電圧利得 A<sub>v</sub>=[[11]]と仮定して考えることが一般的である。<br>演算増幅回路の内部は、[[12]]の後に、何段かの増幅回路を重ねて、電圧増幅度を大きくしたものと考えて良い。',
        blanks: {
          1: { a: 'オペアンプ（OPアンプ）', acc: ['オペアンプ', 'opアンプ', 'オペレーショナルアンプ', 'operationalamplifier', 'op amp', 'opamp'] },
          2: { a: '反転入力端子', acc: ['反転入力端子', '反転入力', '−入力端子', '-入力端子', 'マイナス入力端子'] },
          3: { a: '非反転入力端子', acc: ['非反転入力端子', '非反転入力', '+入力端子', 'プラス入力端子'] },
          4: { a: '入力端子', acc: ['入力端子', '入力'] },
          5: { a: '電源', acc: ['電源', '直流電源', '電源電圧'] },
          6: { a: '大きく（高く）', acc: ['大きく', '高く', '大きい', '高い'] },
          7: { a: '小さい（低い）', acc: ['小さい', '低い', '小さく', '低く'] },
          8: { a: '大きい', acc: ['大きい', '高い', '大きく'] },
          9: { self: true, a: '∞', acc: INF },
          10: { self: true, a: '0', acc: ['0', 'ゼロ', '0ω', 'れい'] },
          11: { self: true, a: '∞', acc: INF },
          12: { a: '差動増幅回路', acc: ['差動増幅回路', '差動増幅器', '差動増幅'] },
        },
      },
      {
        type: 'draw', id: 'p7-2', title: '（2）演算増幅回路の慣用されている図記号を図示し、電源系統を含み全ての端子名を示せ。',
        ans: () => FIG.opampSymbol(true),
        exp: '三角形の左に <b>−（反転入力端子）</b> と <b>+（非反転入力端子）</b>、右の頂点に<b>出力端子</b>、上下に <b>+V（正電源端子）</b> と <b>−V（負電源端子）</b>。※電源端子は省略して描くことも多いが、この問題では必ず描く。',
      },
    ],
  },
];

/* =========================================================
   予想問題（ノートの内容から）
   ========================================================= */
const PREDICT = [
  {
    id: 'n1', no: '予想A', title: 'h パラメータと小信号等価回路', topic: 'tr',
    parts: [
      {
        type: 'items', title: 'h パラメータの定義',
        items: [
          { id: 'n1-1', kind: 'choice', q: 'h<sub>fe</sub>（小信号電流増幅率）の定義式は？', choices: ['ΔI<sub>C</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔV<sub>BE</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔI<sub>C</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）', 'ΔV<sub>BE</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）'], a: 0, exp: '出力電流 ÷ 入力電流。' },
          { id: 'n1-2', kind: 'choice', q: 'h<sub>ie</sub>（入力インピーダンス）の定義式は？', choices: ['ΔI<sub>C</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔV<sub>BE</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔI<sub>C</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）', 'ΔV<sub>BE</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）'], a: 1, exp: '入力電圧 ÷ 入力電流 → 単位 Ω。' },
          { id: 'n1-3', kind: 'choice', q: 'h<sub>oe</sub>（出力アドミタンス）の定義式は？', choices: ['ΔI<sub>C</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔV<sub>BE</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔI<sub>C</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）', 'ΔV<sub>BE</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）'], a: 2, exp: '出力電流 ÷ 出力電圧 → 単位 S。' },
          { id: 'n1-4', kind: 'choice', q: 'h<sub>re</sub>（電圧帰還率）の定義式は？', choices: ['ΔI<sub>C</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔV<sub>BE</sub> / ΔI<sub>B</sub>（V<sub>CE</sub> 一定）', 'ΔI<sub>C</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）', 'ΔV<sub>BE</sub> / ΔV<sub>CE</sub>（I<sub>B</sub> 一定）'], a: 3, exp: '入力電圧 ÷ 出力電圧 → 単位なし。' },
          { id: 'n1-5', kind: 'self', q: '単位が S（ジーメンス）になる h パラメータは？', a: 'h<sub>oe</sub>', acc: ['hoe'], exp: 'A/V＝S。' },
          { id: 'n1-6', kind: 'self', q: '単位が Ω になる h パラメータは？', a: 'h<sub>ie</sub>', acc: ['hie'], exp: 'V/A＝Ω。' },
          { id: 'n1-7', q: '簡易等価回路で、出力側の h<sub>fe</sub>·i<sub>b</sub> は何として表される？', a: '電流源（定電流源）', acc: ['電流源', '定電流源', '理想電流源'], exp: 'ノートの等価回路：入力側は h<sub>ie</sub>（抵抗）、出力側は h<sub>fe</sub>i<sub>b</sub> の電流源。' },
        ],
      },
      {
        type: 'items', title: '計算（ノートの例題）：エミッタ接地回路で h<sub>ie</sub>=2kΩ、h<sub>fe</sub>=100、R<sub>C</sub>=4kΩ、v<sub>i</sub>=10mV',
        items: [
          { id: 'n1-c1', kind: 'num', q: '電流増幅度 A<sub>i</sub> は？', val: 100, unit: '', show: '', a: 'A<sub>i</sub> = h<sub>fe</sub> = 100', exp: 'A<sub>i</sub> = i<sub>c</sub>/i<sub>b</sub> = h<sub>fe</sub> = 100' },
          { id: 'n1-c2', kind: 'num', q: '電圧増幅度 A<sub>v</sub> は？', val: 200, unit: '', show: '', a: 'A<sub>v</sub> = 200', exp: 'A<sub>v</sub> = h<sub>fe</sub>R<sub>C</sub> / h<sub>ie</sub> = 100×4k / 2k = 200' },
          { id: 'n1-c3', kind: 'num', q: '電力増幅度 A<sub>p</sub> は？', val: 20000, unit: '', show: '', a: 'A<sub>p</sub> = 20000', exp: 'A<sub>p</sub> = A<sub>i</sub>×A<sub>v</sub> = 100×200 = 20000' },
          { id: 'n1-c4', kind: 'num', q: '入力インピーダンス Z<sub>i</sub> は？（kΩ）', val: 2000, unit: 'Ω', show: 'kΩ', a: 'Z<sub>i</sub> = h<sub>ie</sub> = 2 kΩ', exp: '等価回路で入力側から見えるのは h<sub>ie</sub> だけ。' },
          { id: 'n1-c5', kind: 'num', q: 'ベース電流 i<sub>b</sub> は？（μA）', val: 5e-6, unit: 'A', show: 'μA', a: 'i<sub>b</sub> = 5 μA', exp: 'i<sub>b</sub> = v<sub>i</sub>/h<sub>ie</sub> = 10mV / 2kΩ = 5μA' },
          { id: 'n1-c6', kind: 'num', q: '出力電圧 v<sub>o</sub> の大きさは？（V）', val: 2, unit: 'V', show: 'V', a: 'v<sub>o</sub> = 2 V', exp: 'i<sub>c</sub> = h<sub>fe</sub>i<sub>b</sub> = 0.5mA、v<sub>o</sub> = i<sub>c</sub>R<sub>C</sub> = 0.5mA×4kΩ = 2V（= A<sub>v</sub>×v<sub>i</sub> = 200×10mV）' },
        ],
      },
    ],
  },
  {
    id: 'n2', no: '予想B', title: 'FET の基礎・分類・端子', topic: 'fetsym',
    parts: [
      {
        type: 'cloze', title: 'FET の分類（ノートの分類図）', id: 'n2a',
        text: 'FET（電界効果トランジスタ）は[[1]]形 FET と[[2]]形 FET に分けられる。[[1]]形 FET は[[3]]形のみで、p チャネルと n チャネルがある。[[2]]形 FET には[[3]]形と[[4]]形があり、それぞれ p チャネルと n チャネルがある。FET は電圧動作素子であり、キャリアが1種類なので[[5]]トランジスタとも呼ばれる。',
        blanks: {
          1: { a: '接合', acc: ['接合', '接合形'] },
          2: { a: 'MOS', acc: ['mos', 'mos形'] },
          3: { a: 'デプレション', acc: ['デプレション'] },
          4: { a: 'エンハンスメント', acc: ['エンハンスメント'] },
          5: { a: 'ユニポーラ', acc: ['ユニポーラ'] },
        },
      },
      {
        type: 'items', title: '端子とはたらき',
        items: [
          { id: 'n2-1', kind: 'choice', q: 'FET の G（ゲート）のはたらきは？', choices: ['キャリアの流れ（電流）を制御する', 'キャリアを注入する', 'キャリアを収集する', '基板を接地する'], a: 0, exp: 'G：キャリアの流れを制御、S：キャリアを注入、D：キャリアを収集。' },
          { id: 'n2-2', kind: 'choice', q: 'FET の S（ソース）のはたらきは？', choices: ['キャリアの流れ（電流）を制御する', 'キャリアを注入する', 'キャリアを収集する', '電圧を増幅する'], a: 1, exp: 'Source＝源。キャリアの出どころ。' },
          { id: 'n2-3', kind: 'choice', q: 'FET の D（ドレーン）のはたらきは？', choices: ['キャリアの流れ（電流）を制御する', 'キャリアを注入する', 'キャリアを収集する', '電圧を増幅する'], a: 2, exp: 'Drain＝排水口。キャリアを集めて出す。' },
          { id: 'n2-4', kind: 'self', q: 'FET のゲート・ソース・ドレーンは、バイポーラトランジスタのどの端子にそれぞれ対応する？（例：B・E・C）', a: 'G→B（ベース）、S→E（エミッタ）、D→C（コレクタ）', acc: ['bec', 'ベースエミッタコレクタ', 'g→bs→ed→c', 'gbsedc', 'gbseddc'], exp: '働きが対応：制御する端子 G↔B、注入する S↔E、収集する D↔C。ベース接地に対応して「ソース接地」回路がある。' },
          { id: 'n2-5', kind: 'tf', q: 'バイポーラトランジスタは B–E 間に電流 I<sub>B</sub> が流れると、それに比例した電流 I<sub>C</sub> が流れる。', a: '○', exp: 'I<sub>C</sub> = h<sub>FE</sub>·I<sub>B</sub>。電流で電流を制御（電流制御形）。' },
          { id: 'n2-6', kind: 'tf', q: 'J-FET（nチャネル）は G に電流を流すと D–S 間に電流が流れる。', a: '×', exp: 'G には<b>電圧</b>を加える（電流はほぼ流れない）。G に電圧を加えると D–S 間に電流が流れる。' },
          { id: 'n2-7', q: 'エミッタ接地に相当する FET の接地方式は？', a: 'ソース接地', acc: ['ソース接地', 'ソース接地回路', 'ソース接地増幅回路'], exp: 'E ↔ S が対応。' },
        ],
      },
    ],
  },
  {
    id: 'n3', no: '予想C', title: 'J-FET の構造と特性', topic: 'fetop',
    parts: [
      {
        type: 'cloze', title: 'J-FET の動作のまとめ', id: 'n3a', fig: () => FIG.jfetOperation(1),
        text: 'G–S 間に加える[[1]] V<sub>GS</sub> の大きさで、p-n 接合面付近に生じる[[2]]の大きさが決まる。これにより、[[3]]の大きさが決まり、流れる[[4]] I<sub>D</sub> の大きさを制御することができる。V<sub>GS</sub> を大きくして I<sub>D</sub> が流れなくなる電圧のことを[[5]]と呼ぶ。',
        blanks: {
          1: { a: '逆電圧', acc: ['逆電圧', '逆方向電圧', '逆バイアス'] },
          2: { a: '空乏層', acc: ['空乏層'] },
          3: { a: 'チャネル', acc: ['チャネル'] },
          4: { a: 'ドレーン電流', acc: ['ドレーン電流'] },
          5: { a: 'ピンチオフ電圧（V<sub>P</sub>）', acc: ['ピンチオフ電圧', 'ピンチオフ', 'vp'] },
        },
      },
      {
        type: 'cloze', title: 'V<sub>DS</sub>–I<sub>D</sub> 特性', id: 'n3b', fig: () => FIG.vdsCurves(),
        text: 'V<sub>DS</sub>–I<sub>D</sub> 特性において、V<sub>DS</sub> が小さいうちは V<sub>DS</sub> の増加とともに I<sub>D</sub> はほぼ[[1]]して大きくなる。V<sub>DS</sub> がある一定以上になると I<sub>D</sub> は上昇せず、ほぼ[[2]]となる。この領域を[[3]]という。',
        blanks: {
          1: { a: '比例', acc: ['比例'] },
          2: { a: '一定', acc: ['一定'] },
          3: { a: '飽和領域', acc: ['飽和領域', '飽和'] },
        },
      },
      {
        type: 'items', title: '相互コンダクタンス',
        items: [
          { id: 'n3-1', kind: 'choice', q: '相互コンダクタンス g<sub>m</sub> の式は？', choices: ['ΔI<sub>D</sub> / ΔV<sub>GS</sub>', 'ΔV<sub>GS</sub> / ΔI<sub>D</sub>', 'ΔI<sub>D</sub> / ΔV<sub>DS</sub>', 'ΔV<sub>DS</sub> / ΔI<sub>D</sub>'], a: 0, exp: 'ゲート電圧の変化に対するドレーン電流の変化。単位は S。' },
          { id: 'n3-2', kind: 'num', q: '2SK170 の例：V<sub>GS</sub> が 0.1V 変化したとき I<sub>D</sub> が 2mA 変化した。g<sub>m</sub> は？（mS）', val: 0.02, unit: 'S', show: 'mS', a: 'g<sub>m</sub> = 20 mS（=0.02 S）', exp: 'g<sub>m</sub> = 2mA / 0.1V = 2×10⁻³/0.1 = 0.02 S = 20 mS' },
          { id: 'n3-3', kind: 'choice', q: 'コンダクタンスの単位 S を基本単位で表すと？', choices: ['A/V（=1/Ω）', 'V/A', 'V·A', 'Ω·A'], a: 0, exp: '抵抗 Ω = V/A（電流の流れにくさ）、コンダクタンス S = A/V（電流の流れやすさ）。' },
          { id: 'n3-4', q: 'J-FET の V<sub>GS</sub>–I<sub>D</sub> 特性で、I<sub>D</sub>=0 になるときの V<sub>GS</sub> を何という？', a: 'ピンチオフ電圧 V<sub>P</sub>', acc: ['ピンチオフ電圧', 'ピンチオフ', 'vp'], exp: '' },
        ],
      },
    ],
  },
  {
    id: 'n4', no: '予想D', title: 'MOSFET（エンハンスメント形・デプレション形）', topic: 'fetop',
    parts: [
      {
        type: 'items', title: 'MOSFET の基本',
        items: [
          { id: 'n4-1', q: 'MOS は何の略？（英語）', a: 'Metal Oxide Semiconductor', acc: ['metaloxidesemiconductor'], exp: '金属・酸化物・半導体の3層構造。' },
          { id: 'n4-2', q: 'MOS の日本語（3つ）は？', a: '金属・酸化物・半導体', acc: ['金属酸化物半導体'], exp: '' },
          { id: 'n4-3', kind: 'tf', q: '現在、MOSFET がトランジスタの主力である。', a: '○', exp: 'ノートより。集積しやすく消費電力が小さい。' },
          { id: 'n4-4', kind: 'tf', q: 'nチャネル エンハンスメント形 MOSFET では、V<sub>GS</sub>=0 のとき I<sub>D</sub>=0 である。', a: '○', exp: 'チャネルがまだ無いので流れない。' },
          { id: 'n4-5', q: 'エンハンスメント形で I<sub>D</sub> が流れ始めるときの V<sub>GS</sub> を何という？', a: 'しきい値電圧（V<sub>th</sub>）', acc: ['しきい値電圧', '閾値電圧', 'しきい値', 'スレッショルド電圧', 'vth', 'vgsth'], exp: '' },
          { id: 'n4-6', kind: 'choice', q: 'nチャネル エンハンスメント形 MOSFET の動作で正しいのは？', choices: ['小さな V<sub>GS</sub> では少数キャリアの電子が少し集まるだけ、大きな V<sub>GS</sub> で n チャネル（電子の通路）ができ I<sub>D</sub> が流れる', 'V<sub>GS</sub>=0 で最も大きな I<sub>D</sub> が流れる', '負の V<sub>GS</sub> を加えると空乏層が広がり I<sub>D</sub> が増える', 'ゲート電流によって I<sub>D</sub> を制御する'], a: 0, exp: 'ノートの (a)V<sub>GS</sub>=0,I<sub>D</sub>=0 → (b)小さな V<sub>GS</sub> → (c)大きな V<sub>GS</sub> でチャネル形成。' },
          { id: 'n4-7', kind: 'tf', q: 'デプレション形 MOSFET は、最初から薄い n チャネルが形成されているため、V<sub>GS</sub>=0V でも I<sub>D</sub> が流れる。', a: '○', exp: '負の V<sub>GS</sub> で I<sub>D</sub> 減少、正の V<sub>GS</sub> で I<sub>D</sub> 増加。' },
          { id: 'n4-8', kind: 'choice', q: 'V<sub>GS</sub> は何と何の間の電圧？', choices: ['ゲート–ソース間（制御電圧）', 'ドレーン–ソース間（動作電圧）', 'ゲート–ドレーン間', 'ソース–基板間'], a: 0, exp: 'V<sub>GS</sub>：G→S に加える電圧（制御電圧）。V<sub>DS</sub>：D→S に加える電圧（動作させるための電圧）。' },
          { id: 'n4-9', kind: 'choice', q: 'nチャネル MOSFET の基板（本体）は何形？', choices: ['p形', 'n形', '真性半導体', '金属'], a: 0, exp: 'p 形基板に n 形のソース・ドレーンを作る。pチャネルはその逆（n 形基板）。' },
        ],
      },
    ],
  },
  {
    id: 'n5', no: '予想E', title: 'MOS IC と CMOS', topic: 'cmos',
    parts: [
      {
        type: 'cloze', title: 'CMOS IC', id: 'n5a', fig: () => FIG.cmos(),
        text: 'MOS IC は MOS 形の[[1]]回路である。CMOS の C は Complementary（[[2]]）という意味であり、[[3]]チャネルと[[4]]チャネルの MOSFET を相補的に用いている。CMOS IC には、(1) [[5]]が小さい（バイポーラトランジスタ構成の TTL IC と比較して）、(2) [[6]]がある（ノイズに強い）、(3) [[7]]が高い、という特徴がある。ただし、電源を加えていないとき[[8]]に弱くこわれる。',
        blanks: {
          1: { a: '集積', acc: ['集積'] },
          2: { a: '相補形', acc: ['相補形', '相補', '相補的'] },
          3: { a: 'n（順不同）', acc: ['n', 'p'] },
          4: { a: 'p（順不同）', acc: ['p', 'n'] },
          5: { a: '消費電力', acc: ['消費電力'] },
          6: { a: '雑音余裕', acc: ['雑音余裕', 'ノイズマージン'] },
          7: { a: '集積度', acc: ['集積度'] },
          8: { a: '静電気', acc: ['静電気'] },
        },
      },
      {
        type: 'items', title: 'CMOS 確認',
        items: [
          { id: 'n5-1', q: 'TTL IC は何で構成された IC？', a: 'バイポーラトランジスタ', acc: ['バイポーラトランジスタ', 'バイポーラ', 'トランジスタ'], exp: 'TTL＝Transistor-Transistor Logic。' },
          { id: 'n5-2', kind: 'choice', q: 'MOS IC の代表的な用途は？', choices: ['論理素子 IC（AND・OR・NOT などのロジック IC）', '大電力スピーカー駆動', '高周波コイル', '電解コンデンサ'], a: 0, exp: '' },
        ],
      },
    ],
  },
  {
    id: 'n6', no: '予想F', title: '差動増幅回路（ノート）', topic: 'diff',
    parts: [
      {
        type: 'items', title: '差動増幅回路の性質',
        items: [
          { id: 'n6-1', kind: 'self', q: '差動増幅回路の入力電圧 v<sub>i</sub> を v<sub>i1</sub>、v<sub>i2</sub> で表すと？', a: 'v<sub>i</sub> = v<sub>i1</sub> − v<sub>i2</sub>', acc: ['vi1-vi2', 'vi1−vi2', 'vi=vi1-vi2', 'vi=vi1−vi2'], exp: '' },
          { id: 'n6-2', kind: 'self', q: '出力電圧 v<sub>o</sub> を v<sub>o1</sub>、v<sub>o2</sub> で表すと？', a: 'v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub>', acc: ['vo1-vo2', 'vo1−vo2', 'vo=vo1-vo2', 'vo=vo1−vo2'], exp: '' },
          { id: 'n6-3', kind: 'tf', q: '入力信号が同相のとき、出力 v<sub>o</sub> はほぼ 0 になる。', a: '○', exp: 'v<sub>o1</sub> と v<sub>o2</sub> が同じなので差は 0。' },
          { id: 'n6-4', kind: 'tf', q: '入力信号が逆相のとき、出力 v<sub>o</sub> は 0 になる。', a: '×', exp: '逆相のとき v<sub>o1</sub> と v<sub>o2</sub> は逆向き → 差は大きく（2倍）なる。' },
          { id: 'n6-5', kind: 'tf', q: '差動増幅回路は npn 形バイポーラトランジスタだけでなく、nチャネル エンハンスメント形 MOSFET を用いても動作する（互換する）。', a: '○', exp: 'ノートより。' },
          { id: 'n6-6', q: '差動増幅回路が影響を受けにくいのは、温度変化などによって生じる何？', a: '温度ドリフト', acc: ['温度ドリフト', 'ドリフト'], exp: '' },
          { id: 'n6-7', kind: 'num', q: 'v<sub>o1</sub>=+3V、v<sub>o2</sub>=−3V のとき出力 v<sub>o</sub>（c–d 間）は？（V）', val: 6, unit: 'V', show: 'V', a: '6 V', exp: 'v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub> = 3 − (−3) = 6V' },
        ],
      },
    ],
  },
  {
    id: 'n7', no: '予想G', title: 'OPアンプの特性と理想演算増幅器', topic: 'op',
    parts: [
      {
        type: 'items', title: 'OPアンプの特性',
        items: [
          { id: 'n7-1', q: 'OPアンプは何の略？（英語）', a: 'Operational Amplifier', acc: ['operationalamplifier'], exp: '演算増幅器。' },
          { id: 'n7-2', kind: 'tf', q: 'OPアンプの入力インピーダンス Z<sub>i</sub> は小さい方が良い。', a: '×', exp: '入力インピーダンスは<b>大きい</b>方が良い（信号源から電流を取らない）。' },
          { id: 'n7-3', kind: 'tf', q: 'OPアンプの出力インピーダンス Z<sub>o</sub> は小さい方が良い。', a: '○', exp: '負荷をつないでも出力電圧が下がりにくい。' },
          { id: 'n7-4', kind: 'num', q: '電圧利得 G<sub>v</sub> = 100 dB のとき、電圧増幅度 A<sub>v</sub> は何倍？', val: 1e5, unit: '', show: '', a: '10⁵ 倍（100000倍）', exp: 'G<sub>v</sub> = 20 log<sub>10</sub> A<sub>v</sub> → A<sub>v</sub> = 10<sup>100/20</sup> = 10<sup>5</sup>' },
          { id: 'n7-5', kind: 'choice', q: '理想演算増幅器の仮定として<b>誤っている</b>ものは？', choices: ['入力インピーダンスが ∞', '出力インピーダンスが ∞', '増幅度（電圧利得）が ∞', '周波数特性の帯域幅が ∞'], a: 1, exp: '出力インピーダンスは <b>0 Ω</b>。4つの仮定：Z<sub>i</sub>=∞、Z<sub>o</sub>=0、A<sub>v</sub>=∞、帯域幅=∞。' },
          { id: 'n7-6', q: '周波数特性で、利得が最大値から 3dB 下がる低い方の周波数を何という？', a: '低域遮断周波数 f<sub>CL</sub>', acc: ['低域遮断周波数', 'fcl', '低域しゃ断周波数'], exp: '高い方は高域遮断周波数 f<sub>CH</sub>。f<sub>CL</sub>～f<sub>CH</sub> が帯域幅 B。' },
          { id: 'n7-7', q: '周波数特性で、利得が最大値から 3dB 下がる高い方の周波数を何という？', a: '高域遮断周波数 f<sub>CH</sub>', acc: ['高域遮断周波数', 'fch', '高域しゃ断周波数'], exp: '' },
          { id: 'n7-8', kind: 'self', q: '人間の耳に聞こえる周波数の範囲は？', a: '20 Hz ～ 20 kHz', acc: ['20hz~20khz', '20hz～20khz', '20hzから20khz', '20~20000hz', '20hz-20khz', '20～20000hz'], exp: 'オーディオアンプの帯域の目安。' },
          { id: 'n7-9', kind: 'choice', q: 'OPアンプの内部構造として正しいものは？', choices: ['入力側に差動増幅回路があり、その出力を他の増幅回路でさらに増幅する多段増幅回路', '入力側にエミッタフォロワ1段のみ', 'コイルとコンデンサの共振回路', '入力側に整流回路がある'], a: 0, exp: '' },
        ],
      },
    ],
  },
  {
    id: 'n8', no: '予想H', title: '正相増幅回路と仮想短絡', topic: 'op',
    parts: [
      {
        type: 'cloze', title: '負帰還と正相増幅回路', id: 'n8a', fig: () => FIG.nonInverting(),
        text: 'OPアンプは電圧増幅度が非常に大きいので、[[1]]をかけて使用するのが一般的である。出力端子から[[2]]入力端子へ抵抗を通じて電圧を戻すことによって[[1]]をかけることができる。入力電圧 v<sub>I</sub> と出力電圧 v<sub>o</sub> の位相が同じになるので、[[3]]増幅回路（同相増幅回路）という。このとき非反転入力端子の電圧と反転入力端子の電圧が等しくなっている（v<sub>F</sub>=v<sub>I</sub>）ことを[[4]]（イマジナリショート）という。',
        blanks: {
          1: { a: '負帰還（ネガティブフィードバック）', acc: ['負帰還', 'ネガティブフィードバック'] },
          2: { a: '反転', acc: ['反転', '−', 'マイナス'] },
          3: { a: '正相', acc: ['正相', '同相', '非反転'] },
          4: { a: '仮想短絡', acc: ['仮想短絡', 'イマジナリショート', 'バーチャルショート'] },
        },
      },
      {
        type: 'items', title: '式と計算',
        items: [
          { id: 'n8-1', kind: 'choice', q: '帰還電圧 v<sub>F</sub> を表す式は？', choices: ['v<sub>F</sub> = R<sub>S</sub>/(R<sub>S</sub>+R<sub>F</sub>) · v<sub>o</sub>', 'v<sub>F</sub> = R<sub>F</sub>/(R<sub>S</sub>+R<sub>F</sub>) · v<sub>o</sub>', 'v<sub>F</sub> = (R<sub>S</sub>+R<sub>F</sub>)/R<sub>S</sub> · v<sub>o</sub>', 'v<sub>F</sub> = R<sub>F</sub>/R<sub>S</sub> · v<sub>o</sub>'], a: 0, exp: 'v<sub>o</sub> を R<sub>F</sub> と R<sub>S</sub> で分圧した R<sub>S</sub> 側の電圧。' },
          { id: 'n8-2', kind: 'choice', q: '正相増幅回路の電圧増幅度 A<sub>vf</sub> は？', choices: ['1 + R<sub>F</sub>/R<sub>S</sub>', '−R<sub>F</sub>/R<sub>S</sub>', 'R<sub>S</sub>/(R<sub>S</sub>+R<sub>F</sub>)', '1 − R<sub>F</sub>/R<sub>S</sub>'], a: 0, exp: 'v<sub>o</sub> = A<sub>v</sub>(v<sub>I</sub> − v<sub>F</sub>) を変形し A<sub>v</sub>→∞ とすると A<sub>vf</sub> = (R<sub>S</sub>+R<sub>F</sub>)/R<sub>S</sub> = 1 + R<sub>F</sub>/R<sub>S</sub>。' },
          { id: 'n8-3', kind: 'num', q: 'R<sub>S</sub>=10kΩ、R<sub>F</sub>=30kΩ の正相増幅回路の電圧増幅度は？（倍）', val: 4, unit: '', show: '', a: '4 倍', exp: 'A<sub>vf</sub> = 1 + 30k/10k = 4' },
          { id: 'n8-4', kind: 'num', q: '上の回路に v<sub>I</sub> = 0.5V を入力したときの出力 v<sub>o</sub> は？（V）', val: 2, unit: 'V', show: 'V', a: '2 V', exp: 'v<sub>o</sub> = 4 × 0.5 = 2V（入力と同相）' },
          { id: 'n8-5', kind: 'self', q: '差動入力電圧 (v<sub>I</sub> − v<sub>F</sub>) を使うと出力電圧 v<sub>o</sub> はどう書ける？', a: 'v<sub>o</sub> = A<sub>v</sub>(v<sub>I</sub> − v<sub>F</sub>)', acc: ['av(vi-vf)', 'vo=av(vi-vf)', 'av(vi−vf)', 'vo=av(vi−vf)'], exp: '' },
          { id: 'n8-6', kind: 'tf', q: 'LM339 のように LM で始まる IC はアナログ IC であり、LM339 は 1 つのパッケージに 4 回路が入っている。', a: '○', exp: 'ノートの LM339 ピン配置（コンパレータ ×4）。' },
        ],
      },
    ],
  },
];

/* =========================================================
   計算ドリル（数値ランダム生成）
   ========================================================= */
const rnd = (a, b, step = 1) => { const n = Math.round((b - a) / step); return +(a + step * Math.floor(Math.random() * (n + 1))).toFixed(6); };
const r3 = x => +(+x).toPrecision(4);

const CALC = [
  {
    id: 'gm', name: '相互コンダクタンス g<sub>m</sub>', topic: 'fetop', gen() {
      const v1 = rnd(-1, 0.5, 0.05), dv = rnd(0.1, 1.0, 0.05), i1 = rnd(0.5, 6, 0.1), di = rnd(0.5, 10, 0.1);
      const gm = (di * 1e-3) / dv;
      return { q: `FET の動作点で V<sub>GS</sub> が ${v1.toFixed(2)}V → ${(v1 + dv).toFixed(2)}V に変化したとき、I<sub>D</sub> は ${i1.toFixed(1)}mA → ${(i1 + di).toFixed(1)}mA に変化した。相互コンダクタンス g<sub>m</sub> は？（mS）`, val: gm, unit: 'S', show: 'mS', a: `${r3(gm * 1e3)} mS`, exp: `g<sub>m</sub> = ΔI<sub>D</sub>/ΔV<sub>GS</sub> = ${di.toFixed(1)}mA / ${dv.toFixed(2)}V = ${r3(gm * 1e3)} mS` };
    },
  },
  {
    id: 'hamp', name: 'h パラメータで増幅度', topic: 'tr', gen() {
      const hie = rnd(1, 5, 0.5), hfe = rnd(50, 250, 10), rc = rnd(1, 10, 0.5);
      const t = Math.floor(Math.random() * 3);
      const av = hfe * rc / hie;
      if (t === 0) return { q: `エミッタ接地回路で h<sub>ie</sub>=${hie}kΩ、h<sub>fe</sub>=${hfe}、R<sub>C</sub>=${rc}kΩ。電圧増幅度 A<sub>v</sub> は？`, val: av, unit: '', show: '', a: `${r3(av)}`, exp: `A<sub>v</sub> = h<sub>fe</sub>R<sub>C</sub>/h<sub>ie</sub> = ${hfe}×${rc}/${hie} = ${r3(av)}` };
      if (t === 1) return { q: `エミッタ接地回路で h<sub>ie</sub>=${hie}kΩ、h<sub>fe</sub>=${hfe}、R<sub>C</sub>=${rc}kΩ。電力増幅度 A<sub>p</sub> は？`, val: av * hfe, unit: '', show: '', a: `${r3(av * hfe)}`, exp: `A<sub>i</sub>=h<sub>fe</sub>=${hfe}、A<sub>v</sub>=${r3(av)} → A<sub>p</sub>=A<sub>i</sub>A<sub>v</sub>=${r3(av * hfe)}` };
      const vi = rnd(5, 20, 1);
      return { q: `エミッタ接地回路で h<sub>ie</sub>=${hie}kΩ、h<sub>fe</sub>=${hfe}、R<sub>C</sub>=${rc}kΩ、入力 v<sub>i</sub>=${vi}mV。出力電圧 v<sub>o</sub> の大きさは？（V）`, val: av * vi * 1e-3, unit: 'V', show: 'V', a: `${r3(av * vi * 1e-3)} V`, exp: `i<sub>b</sub>=v<sub>i</sub>/h<sub>ie</sub>=${r3(vi / hie)}μA、i<sub>c</sub>=h<sub>fe</sub>i<sub>b</sub>、v<sub>o</sub>=i<sub>c</sub>R<sub>C</sub>=A<sub>v</sub>v<sub>i</sub>=${r3(av)}×${vi}mV=${r3(av * vi * 1e-3)}V` };
    },
  },
  {
    id: 'hdef', name: 'h パラメータを特性から計算', topic: 'tr', gen() {
      const t = Math.floor(Math.random() * 2);
      if (t === 0) {
        const dib = rnd(10, 50, 5), hfe = rnd(80, 200, 10);
        const dic = dib * hfe / 1000;
        return { q: `V<sub>CE</sub> 一定で I<sub>B</sub> を ${dib}μA 変化させたら I<sub>C</sub> が ${r3(dic)}mA 変化した。h<sub>fe</sub> は？`, val: hfe, unit: '', show: '', a: `${hfe}`, exp: `h<sub>fe</sub> = ΔI<sub>C</sub>/ΔI<sub>B</sub> = ${r3(dic)}mA / ${dib}μA = ${hfe}` };
      }
      const dib = rnd(10, 40, 5), dvbe = rnd(10, 60, 5);
      const hie = dvbe * 1e-3 / (dib * 1e-6);
      return { q: `V<sub>CE</sub> 一定で I<sub>B</sub> を ${dib}μA 変化させたら V<sub>BE</sub> が ${dvbe}mV 変化した。h<sub>ie</sub> は？（kΩ）`, val: hie, unit: 'Ω', show: 'kΩ', a: `${r3(hie / 1000)} kΩ`, exp: `h<sub>ie</sub> = ΔV<sub>BE</sub>/ΔI<sub>B</sub> = ${dvbe}mV / ${dib}μA = ${r3(hie / 1000)} kΩ` };
    },
  },
  {
    id: 'noninv', name: '正相増幅回路の増幅度', topic: 'op', gen() {
      const rs = [1, 2, 5, 10, 20][Math.floor(Math.random() * 5)], k = rnd(1, 20, 1), rf = rs * k;
      const t = Math.floor(Math.random() * 3);
      if (t === 0) return { q: `正相増幅回路で R<sub>S</sub>=${rs}kΩ、R<sub>F</sub>=${rf}kΩ。電圧増幅度 A<sub>vf</sub> は？`, val: 1 + k, unit: '', show: '', a: `${1 + k}`, exp: `A<sub>vf</sub> = 1 + R<sub>F</sub>/R<sub>S</sub> = 1 + ${rf}/${rs} = ${1 + k}` };
      if (t === 1) { const vi = rnd(0.1, 1, 0.1); return { q: `正相増幅回路で R<sub>S</sub>=${rs}kΩ、R<sub>F</sub>=${rf}kΩ、入力 v<sub>I</sub>=${vi}V。出力 v<sub>o</sub> は？（V）`, val: (1 + k) * vi, unit: 'V', show: 'V', a: `${r3((1 + k) * vi)} V`, exp: `v<sub>o</sub> = (1 + ${rf}/${rs})×${vi} = ${r3((1 + k) * vi)} V` }; }
      return { q: `正相増幅回路で R<sub>S</sub>=${rs}kΩ のとき、電圧増幅度を ${1 + k} 倍にしたい。R<sub>F</sub> は？（kΩ）`, val: rf * 1000, unit: 'Ω', show: 'kΩ', a: `${rf} kΩ`, exp: `${1 + k} = 1 + R<sub>F</sub>/${rs}k → R<sub>F</sub> = ${k}×${rs}k = ${rf} kΩ` };
    },
  },
  {
    id: 'db', name: 'デシベル（dB）変換', topic: 'op', gen() {
      const t = Math.floor(Math.random() * 2);
      if (t === 0) { const e = rnd(1, 6, 1); return { q: `電圧利得 G<sub>v</sub> = ${20 * e} dB のとき、電圧増幅度 A<sub>v</sub> は何倍？`, val: 10 ** e, unit: '', show: '', a: `10<sup>${e}</sup> = ${(10 ** e).toLocaleString()} 倍`, exp: `G<sub>v</sub> = 20log<sub>10</sub>A<sub>v</sub> → A<sub>v</sub> = 10<sup>${20 * e}/20</sup> = 10<sup>${e}</sup>` }; }
      const av = [10, 20, 50, 100, 200, 1000, 2, 5][Math.floor(Math.random() * 8)];
      const g = 20 * Math.log10(av);
      return { q: `電圧増幅度 A<sub>v</sub> = ${av} 倍を電圧利得 G<sub>v</sub>[dB] で表すと？`, val: g, unit: '', show: 'dB', a: `${r3(g)} dB`, exp: `G<sub>v</sub> = 20log<sub>10</sub>${av} ≒ ${r3(g)} dB（log2≒0.301）` };
    },
  },
  {
    id: 'diffout', name: '差動増幅の出力', topic: 'diff', gen() {
      const a = rnd(-5, 5, 0.5), b = rnd(-5, 5, 0.5);
      return { q: `差動増幅回路で v<sub>o1</sub>=${a}V、v<sub>o2</sub>=${b}V のとき、出力 v<sub>o</sub>（c–d 間）は？（V）`, val: a - b, unit: 'V', show: 'V', a: `${r3(a - b)} V`, exp: `v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub> = ${a} − (${b}) = ${r3(a - b)} V`, zeroOK: true };
    },
  },
];
