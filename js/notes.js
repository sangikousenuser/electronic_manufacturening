/* =========================================================
   まとめノート（授業ノート＋プリントの要点）
   ========================================================= */
const NOTES = [
  {
    id: 'tr', title: '① トランジスタの接地方式', topic: 'tr', html: () => `
<p>どの端子を入力・出力の<b>共通端子（接地）</b>にするかで3種類。見分け方は「<b>入力にも出力にも使っていない端子</b>」が接地。</p>
<div class="fig-row">
  <figure>${FIG.emitterGrounded()}<figcaption><b>エミッタ接地</b><br>入力 B ／ 出力 C（R<sub>L</sub> がコレクタ側）</figcaption></figure>
  <figure>${FIG.baseGrounded()}<figcaption><b>ベース接地</b><br>入力 E ／ 出力 C（B が下で共通）</figcaption></figure>
  <figure>${FIG.collectorGrounded()}<figcaption><b>コレクタ接地（エミッタフォロワ）</b><br>入力 B ／ 出力 E（R<sub>L</sub> がエミッタ側）</figcaption></figure>
</div>
<table class="tbl"><tr><th></th><th>エミッタ接地</th><th>ベース接地</th><th>コレクタ接地</th></tr>
<tr><td>電流増幅</td><td>大（h<sub>fe</sub>）</td><td>約1</td><td>大</td></tr>
<tr><td>電圧増幅</td><td>大</td><td>大</td><td>約1</td></tr>
<tr><td>特徴</td><td>最もよく使う</td><td>高周波向き</td><td>入力Z高・出力Z低（バッファ）</td></tr></table>`,
  },
  {
    id: 'h', title: '② h パラメータ（4象限の特性図）', topic: 'tr', html: () => `
<p>エミッタ接地回路の I<sub>B</sub>・V<sub>BE</sub>・I<sub>C</sub>・V<sub>CE</sub> の関係を 4 象限で表した図。各点の<b>傾き</b>が h パラメータ。</p>
<div class="fig-center">${FIG.hQuadrant(true)}</div>
<table class="tbl">
<tr><th>点</th><th>象限（縦/横）</th><th>記号</th><th>名前</th><th>定義</th><th>単位</th></tr>
<tr><td>Pc</td><td>第1：I<sub>C</sub>–V<sub>CE</sub></td><td>h<sub>oe</sub></td><td>出力アドミタンス</td><td>ΔI<sub>C</sub>/ΔV<sub>CE</sub>（I<sub>B</sub>一定）</td><td>S</td></tr>
<tr><td>Pa</td><td>第2：I<sub>C</sub>–I<sub>B</sub></td><td>h<sub>fe</sub></td><td>電流増幅率</td><td>ΔI<sub>C</sub>/ΔI<sub>B</sub>（V<sub>CE</sub>一定）</td><td>なし</td></tr>
<tr><td>Pb</td><td>第3：V<sub>BE</sub>–I<sub>B</sub></td><td>h<sub>ie</sub></td><td>入力インピーダンス</td><td>ΔV<sub>BE</sub>/ΔI<sub>B</sub>（V<sub>CE</sub>一定）</td><td>Ω</td></tr>
<tr><td>Pd</td><td>第4：V<sub>BE</sub>–V<sub>CE</sub></td><td>h<sub>re</sub></td><td>電圧帰還率</td><td>ΔV<sub>BE</sub>/ΔV<sub>CE</sub>（I<sub>B</sub>一定）</td><td>なし</td></tr></table>
<div class="tip"><b>覚え方：</b>添字 i＝input（入力）、o＝output（出力）、f＝forward（順方向＝増幅）、r＝reverse（逆方向＝帰還）、e＝エミッタ接地。<br>単位は「分子÷分母」で決まる：V/A＝Ω、A/V＝S、同じ量どうし＝単位なし。</div>
<h4>簡易等価回路と増幅度（ノートの例題）</h4>
<p>入力側＝h<sub>ie</sub>（抵抗）、出力側＝h<sub>fe</sub>i<sub>b</sub>（電流源）で考える。</p>
<ul class="formula">
<li>電流増幅度 A<sub>i</sub> = i<sub>c</sub>/i<sub>b</sub> = <b>h<sub>fe</sub></b></li>
<li>電圧増幅度 A<sub>v</sub> = <b>h<sub>fe</sub>R<sub>C</sub> / h<sub>ie</sub></b></li>
<li>電力増幅度 A<sub>p</sub> = <b>A<sub>i</sub> × A<sub>v</sub></b></li>
<li>入力インピーダンス Z<sub>i</sub> = <b>h<sub>ie</sub></b></li>
</ul>
<div class="ex">例：h<sub>ie</sub>=2kΩ、h<sub>fe</sub>=100、R<sub>C</sub>=4kΩ、v<sub>i</sub>=10mV<br>
i<sub>b</sub>=10mV/2kΩ=5μA → i<sub>c</sub>=100×5μA=0.5mA → v<sub>o</sub>=0.5mA×4kΩ=2V<br>
A<sub>i</sub>=100、A<sub>v</sub>=100×4/2=200、A<sub>p</sub>=20000、Z<sub>i</sub>=2kΩ</div>`,
  },
  {
    id: 'ic', title: '③ IC（集積回路）', topic: 'ic', html: () => `
<ul>
<li>IC＝<b>Integrated Circuit</b>（集積回路）。高性能・小型・低価格・高信頼性 → 現在の電子回路の多くは IC 化。</li>
<li>ほとんどが<b>モノリシック IC</b>（1枚のシリコン基板に全素子）。</li>
<li>数十 mm² のケイ素（シリコン）チップの中に、ダイオード・トランジスタ・抵抗・コンデンサが入っている。</li>
<li><b>苦手なもの：</b>大きなインダクタ（コイル）。</li>
<li>材料はウェハ（単結晶シリコン）。純度だけでなく<b>表面の鏡面加工やたわみ</b>などの機械的要素も重要。</li>
</ul>
<table class="tbl"><tr><th>集積度</th><th>素子数</th></tr>
<tr><td>SSI</td><td>100 以下</td></tr><tr><td>MSI</td><td>100～1,000</td></tr><tr><td>LSI</td><td>1,000 以上</td></tr><tr><td>VLSI</td><td>100万 以上（※10万以上とする本もある）</td></tr><tr><td>ULSI</td><td>1,000万 以上</td></tr></table>
<table class="tbl"><tr><th>機能による分類</th><th>中身</th><th>型番の例</th></tr>
<tr><td>アナログ IC（＝リニア IC）</td><td>オペアンプなどの増幅回路</td><td><b>LM</b>～（LM339 など）</td></tr>
<tr><td>デジタル IC</td><td>論理回路・メモリ</td><td><b>74</b>～（7400 など）</td></tr></table>
<h4>パッケージ</h4>
<div class="pkg-grid">
<figure>${FIG.pkg('DIP')}<figcaption><b>DIP</b> Dual Inline Package<br>挿入形・2列</figcaption></figure>
<figure>${FIG.pkg('SIP')}<figcaption><b>SIP</b> Single Inline Package<br>挿入形・1列</figcaption></figure>
<figure>${FIG.pkg('PGA')}<figcaption><b>PGA</b> Pin Grid Array<br>挿入形・底面に格子状ピン</figcaption></figure>
<figure>${FIG.pkg('SOP')}<figcaption><b>SOP</b> Small Outline Package<br>表面実装・2辺</figcaption></figure>
<figure>${FIG.pkg('QFP')}<figcaption><b>QFP</b> Quad Flat Package<br>表面実装・4辺</figcaption></figure>
</div>`,
  },
  {
    id: 'fet', title: '④ FET の分類・図記号・端子', topic: 'fetsym', html: () => `
<p>FET＝<b>Field-Effect Transistor</b>（電界効果トランジスタ）。<b>電圧</b>で動作する<b>ユニポーラ</b>トランジスタ（キャリアが1種類）。<br>
ふつうのトランジスタ（npn・pnp）は<b>電流</b>で動作する<b>バイポーラ</b>トランジスタ（I<sub>B</sub> に比例した I<sub>C</sub> が流れる）。</p>
<ul class="tree"><li><b>FET</b>
  <ul><li><b>接合形 FET（J-FET）</b><ul><li>デプレション形<ul><li>pチャネル</li><li>nチャネル</li></ul></li></ul></li>
  <li><b>MOS 形 FET</b><ul><li>デプレション形<ul><li>pチャネル</li><li>nチャネル</li></ul></li><li>エンハンスメント形<ul><li>pチャネル</li><li>nチャネル</li></ul></li></ul></li></ul>
</li></ul>
<h4>図記号の見分け方</h4>
<div class="sym-grid">
<figure>${FIG.symbol('jfet-n')}<figcaption>nチャネル 接合形</figcaption></figure>
<figure>${FIG.symbol('jfet-p')}<figcaption>pチャネル 接合形</figcaption></figure>
<figure>${FIG.symbol('mos-n-d')}<figcaption>nチャネル デプレション形 MOS</figcaption></figure>
<figure>${FIG.symbol('mos-p-d')}<figcaption>pチャネル デプレション形 MOS</figcaption></figure>
<figure>${FIG.symbol('mos-n-e')}<figcaption>nチャネル エンハンスメント形 MOS</figcaption></figure>
<figure>${FIG.symbol('mos-p-e')}<figcaption>pチャネル エンハンスメント形 MOS</figcaption></figure>
<figure>${FIG.symbol('npn')}<figcaption>npn 形トランジスタ</figcaption></figure>
<figure>${FIG.symbol('pnp')}<figcaption>pnp 形トランジスタ</figcaption></figure>
</div>
<div class="tip"><b>判定の3ステップ</b><br>
①ゲートがチャネルに<b>直接つながる</b> → 接合形 ／ ゲートが<b>離れている</b>（絶縁） → MOS 形<br>
②（MOSのみ）チャネル線が<b>実線</b> → デプレション形 ／ <b>破線（3分割）</b> → エンハンスメント形<br>
③矢印が<b>内向き（チャネルへ）</b> → nチャネル ／ <b>外向き</b> → pチャネル<br>
トランジスタ：エミッタの矢印が<b>外向き → npn</b>、<b>内向き → pnp</b></div>
<table class="tbl"><tr><th>FET の端子</th><th>はたらき</th><th>対応するトランジスタ端子</th></tr>
<tr><td>G：ゲート（gate）</td><td>キャリアの流れ（電流）を制御</td><td>B：ベース（base）</td></tr>
<tr><td>S：ソース（source）</td><td>キャリアを注入</td><td>E：エミッタ（emitter）</td></tr>
<tr><td>D：ドレーン（drain）</td><td>キャリアを収集</td><td>C：コレクタ（collector）</td></tr></table>
<p>MOS＝<b>M</b>etal（金属）・<b>O</b>xide（酸化物）・<b>S</b>emiconductor（半導体）。エミッタ接地に対応するのは<b>ソース接地</b>。</p>`,
  },
  {
    id: 'jfet', title: '⑤ 接合形 FET（J-FET）の構造と動作', topic: 'fetst', html: () => `
<div class="fig-center">${FIG.jfetSection(true)}</div>
<p>n 形領域にドレーンとソースの電極が接続され、この電極間を<b>電流</b>が流れる。この電流の通路を<b>チャネル</b>と呼ぶ。チャネルが <b>n 形半導体 → nチャネル</b>、<b>p 形半導体 → pチャネル</b>。表面は<b>酸化膜（SiO₂、絶縁性）</b>で覆われ、端子は<b>電極（アルミ）</b>。</p>
<div class="fig-row">${FIG.jfetOperation(0)}${FIG.jfetOperation(1)}${FIG.jfetOperation(2)}</div>
<ol>
<li>(a) ゲートに電圧を加えず D–S 間に V<sub>DS</sub> → n 形領域の電子はドレーンの正電圧に引き寄せられ I<sub>D</sub> が流れる。</li>
<li>(b) G–S 間に<b>逆電圧</b> V<sub>GS</sub> → p-n 接合面付近に<b>空乏層</b>が広がり、電子の流れるチャネルが狭まり I<sub>D</sub> 減少。</li>
<li>(c) さらに V<sub>GS</sub> を大きく → 空乏層がチャネルを<b>完全にふさぎ</b> I<sub>D</sub> は流れない。このときの電圧＝<b>ピンチオフ電圧 V<sub>P</sub></b>。</li>
</ol>
<div class="tip">ゲートに逆電圧を加えるので<b>ゲート電流が流れない</b>。ゲート電圧でドレーン電流を制御する<b>電圧制御形</b>素子。</div>
<h4>特性</h4>
<div class="fig-row"><figure>${FIG.gmGraph('jfet')}<figcaption>V<sub>GS</sub>–I<sub>D</sub> 特性（傾き＝g<sub>m</sub>）</figcaption></figure><figure>${FIG.vdsCurves()}<figcaption>V<sub>DS</sub>–I<sub>D</sub> 特性</figcaption></figure></div>
<ul class="formula"><li>相互コンダクタンス <b>g<sub>m</sub> = ΔI<sub>D</sub> / ΔV<sub>GS</sub></b> [S]（例：2mA/0.1V = 20mS）</li>
<li>V<sub>DS</sub> の増加とともに I<sub>D</sub> はほぼ<b>比例</b>して増加 → ある値以上で<b>ほぼ一定</b>＝<b>飽和領域</b></li>
<li>抵抗 Ω = V/A（流れにくさ）、コンダクタンス S = A/V = 1/Ω（流れやすさ）</li></ul>`,
  },
  {
    id: 'mos', title: '⑥ MOSFET（エンハンスメント形・デプレション形）', topic: 'fetop', html: () => `
<div class="fig-center">${FIG.mosSection(true)}</div>
<p>MOSFET のゲートは、ゲート電極と半導体の間が非常に<b>薄い酸化膜</b>で隔てられている。サブストレート（基板）は通常<b>ソース</b>に接続。図は <b>pチャネル</b>（n 形基板に p 形のソース・ドレーン）。nチャネルは p 形基板に n 形。現在、MOSFET がトランジスタの主力。</p>
<div class="fig-row"><figure>${FIG.mosOperation('enh')}</figure><figure>${FIG.mosOperation('dep')}</figure></div>
<h4>エンハンスメント形（例：2SK1062、3SK38A 型の特性）</h4>
<ul><li>V<sub>GS</sub>=0 では D–S 間に電圧を加えても<b>I<sub>D</sub>=0</b>。</li>
<li>V<sub>GS</sub> を大きくすると、酸化膜の下の <b>p 形</b>領域に<b>少数キャリア</b>である電子が集まり、<b>電子の通路（nチャネル）</b>ができて I<sub>D</sub> が流れる。</li>
<li>I<sub>D</sub> が流れ始める電圧＝<b>しきい値電圧 V<sub>th</sub></b>。</li></ul>
<h4>デプレション形（例：2SK882）</h4>
<ul><li>あらかじめチャネルを<b>形成</b>しておく（最初から薄い n チャネル）。</li>
<li>ゲートに<b>電圧</b>を加えなくても I<sub>D</sub> が<b>流れる</b>。負の V<sub>GS</sub> を大きくすると I<sub>D</sub> 減少。</li></ul>
<div class="fig-row"><figure>${FIG.gmGraph('jfet')}<figcaption>接合形（負側のみ）</figcaption></figure><figure>${FIG.gmGraph('dep')}<figcaption>デプレション形（正負両方）</figcaption></figure><figure>${FIG.gmGraph('enh')}<figcaption>エンハンスメント形（正側のみ）</figcaption></figure></div>
<div class="tip"><b>V<sub>GS</sub>–I<sub>D</sub> グラフから形を見分ける</b><br>V<sub>GS</sub>=0 で I<sub>D</sub> 最大・負側だけ → <b>接合形</b> ／ V<sub>GS</sub>=0 でも流れ正負両側 → <b>デプレション形</b> ／ V<sub>GS</sub>=0 で流れない → <b>エンハンスメント形</b></div>
<p>V<sub>GS</sub>：G→S に加える電圧（<b>制御電圧</b>）、V<sub>DS</sub>：D→S に加える電圧（動作させるための電圧）。</p>`,
  },
  {
    id: 'cmos', title: '⑦ MOS IC と CMOS', topic: 'cmos', html: () => `
<div class="fig-center">${FIG.cmos()}</div>
<ul><li>MOS IC＝MOS 形の集積回路。論理素子 IC（AND・OR・NOT のロジック IC）に使われる。</li>
<li><b>CMOS</b>：C＝<b>Complementary（相補形）</b>。nチャネルと pチャネルの MOSFET を<b>相補的</b>に用いる。</li></ul>
<div class="tip"><b>CMOS IC の特徴</b><br>(1) <b>消費電力が小さい</b>（バイポーラトランジスタ構成の TTL IC と比べて）<br>(2) <b>雑音余裕がある</b>（ノイズに強い）<br>(3) <b>集積度が高い</b><br>(4) 電源を加えていないとき<b>静電気に弱く</b>こわれる</div>`,
  },
  {
    id: 'diff', title: '⑧ 差動増幅回路', topic: 'diff', html: () => `
<div class="fig-center">${FIG.diffBlock()}</div>
<p>2 個の<b>入力端子</b>①②の間に加えられた信号の<b>差</b> v<sub>i</sub>（= v<sub>i1</sub> − v<sub>i2</sub>）を<b>増幅</b>して、2 個の<b>出力端子</b>③④に差の<b>出力電圧</b> v<sub>o</sub>（= v<sub>o1</sub> − v<sub>o2</sub>）として出力する回路。</p>
<ul><li>v<sub>i1</sub> と v<sub>i2</sub> に共通に含まれる成分は出力に現れない → <b>温度ドリフト</b>の影響を受けにくい。</li>
<li>ベースの入力<b>結合コンデンサ</b>を用いない → <b>直流から増幅</b>できる。</li>
<li><b>IC 化</b>されて<b>演算増幅器（オペアンプ）</b>の入力段に利用。</li>
<li>npn 形バイポーラトランジスタの代わりに nチャネル エンハンスメント形 MOSFET でも動作する。</li></ul>
<div class="fig-center">${FIG.diffCircuit()}</div>
<h4>同相入力（v<sub>i1</sub> と v<sub>i2</sub> が同じ）</h4>${FIG.diffWaves('same')}
<p>v<sub>o1</sub>（c–GND）と v<sub>o2</sub>（d–GND）は同じ波形（入力と逆位相） → <b>v<sub>o</sub> = v<sub>o1</sub> − v<sub>o2</sub> = 0</b></p>
<h4>逆相入力（v<sub>i1</sub> と v<sub>i2</sub> が逆向き）</h4>${FIG.diffWaves('anti')}
<p>v<sub>o1</sub> と v<sub>o2</sub> は互いに逆相 → <b>v<sub>o</sub>（c–d 間）は 2 倍の大きさ</b>で出てくる。</p>`,
  },
  {
    id: 'op', title: '⑨ 演算増幅器（OPアンプ）', topic: 'op', html: () => `
<p>演算増幅器＝<b>オペアンプ（OPアンプ, Operational Amplifier）</b>。<b>反転入力端子（−、逆相入力）</b>と<b>非反転入力端子（+、正相入力）</b>の 2 個の入力端子と 1 個の出力端子。正負 2 個の<b>電源</b>（+V、−V）が必要。</p>
<div class="fig-center">${FIG.opampSymbol(true)}</div>
<div class="tip">テストでは「電源系統を含み全ての端子名を示せ」→ <b>反転入力端子・非反転入力端子・出力端子・+V 電源端子・−V 電源端子</b>の5つを書く（電源端子は普段は省略されることが多い）。</div>
<table class="tbl"><tr><th>特性</th><th>記号</th><th>代表値の例</th><th>理想</th><th>良いのは</th></tr>
<tr><td>入力インピーダンス</td><td>Z<sub>i</sub></td><td>5×10⁶ Ω</td><td><b>∞</b></td><td>大きい方</td></tr>
<tr><td>出力インピーダンス</td><td>Z<sub>o</sub></td><td>数 Ω</td><td><b>0</b></td><td>小さい方</td></tr>
<tr><td>電圧利得</td><td>G<sub>v</sub></td><td>100 dB（A<sub>v</sub>=10⁵倍）</td><td><b>∞</b></td><td>非常に大きい</td></tr></table>
<p>G<sub>v</sub> = 20 log<sub>10</sub> A<sub>v</sub> [dB]（100dB → 10⁵ 倍）</p>
<h4>理想演算増幅器の4つの仮定</h4>
<ol><li>入力インピーダンス Z<sub>i</sub> = ∞</li><li>出力インピーダンス Z<sub>o</sub> = 0 Ω</li><li>増幅度（電圧利得）A<sub>v</sub> = ∞</li><li>周波数特性の帯域幅 = ∞</li></ol>
<div class="fig-row"><figure>${FIG.opampEquivalent()}<figcaption>OPアンプの等価回路</figcaption></figure><figure>${FIG.bandwidth()}<figcaption>帯域幅 B：f<sub>CL</sub>（低域遮断周波数）～f<sub>CH</sub>（高域遮断周波数）、最大から −3dB の点。人間の可聴域は 20Hz～20kHz</figcaption></figure></div>
<p><b>内部構造：</b>入力側に<b>差動増幅回路</b>があり、その出力を他の増幅回路でさらに増幅する<b>多段増幅回路</b>。</p>`,
  },
  {
    id: 'noninv', title: '⑩ 正相増幅回路と仮想短絡', topic: 'op', html: () => `
<div class="fig-center">${FIG.nonInverting()}</div>
<p>OPアンプは増幅度が非常に大きいので<b>負帰還（ネガティブフィードバック）</b>をかけて使う。出力端子から<b>反転入力端子</b>へ抵抗を通じて電圧を戻す。入力と出力が<b>同相</b>なので<b>正相増幅回路（同相増幅回路）</b>。</p>
<div class="ex">
差動入力電圧は (v<sub>I</sub> − v<sub>F</sub>) なので　v<sub>o</sub> = A<sub>v</sub>(v<sub>I</sub> − v<sub>F</sub>)<br>
帰還電圧（分圧）　v<sub>F</sub> = R<sub>S</sub>/(R<sub>S</sub>+R<sub>F</sub>) · v<sub>o</sub>　…※1<br>
代入して整理：v<sub>o</sub> = A<sub>v</sub> / (1 + A<sub>v</sub>R<sub>S</sub>/(R<sub>S</sub>+R<sub>F</sub>)) · v<sub>I</sub><br>
分母分子を A<sub>v</sub> で割り A<sub>v</sub>→∞：v<sub>o</sub> = (R<sub>S</sub>+R<sub>F</sub>)/R<sub>S</sub> · v<sub>I</sub>　…※2<br>
<b>A<sub>vf</sub> = v<sub>o</sub>/v<sub>I</sub> = (R<sub>S</sub>+R<sub>F</sub>)/R<sub>S</sub> = 1 + R<sub>F</sub>/R<sub>S</sub></b><br>
※1 に ※2 を代入すると v<sub>F</sub> = v<sub>I</sub> → 非反転入力端子と反転入力端子の電圧が等しい＝<b>仮想短絡（イマジナリショート）</b></div>
<p>例：R<sub>S</sub>=10kΩ、R<sub>F</sub>=30kΩ → A<sub>vf</sub> = 1 + 30/10 = <b>4 倍</b></p>`,
  },
];

const FORMULAS = [
  ['h<sub>fe</sub>（電流増幅率）', 'ΔI<sub>C</sub>/ΔI<sub>B</sub>', '単位なし'],
  ['h<sub>ie</sub>（入力インピーダンス）', 'ΔV<sub>BE</sub>/ΔI<sub>B</sub>', 'Ω'],
  ['h<sub>oe</sub>（出力アドミタンス）', 'ΔI<sub>C</sub>/ΔV<sub>CE</sub>', 'S'],
  ['h<sub>re</sub>（電圧帰還率）', 'ΔV<sub>BE</sub>/ΔV<sub>CE</sub>', '単位なし'],
  ['電流増幅度 A<sub>i</sub>', 'h<sub>fe</sub>', ''],
  ['電圧増幅度 A<sub>v</sub>（エミッタ接地）', 'h<sub>fe</sub>R<sub>C</sub>/h<sub>ie</sub>', ''],
  ['電力増幅度 A<sub>p</sub>', 'A<sub>i</sub>×A<sub>v</sub>', ''],
  ['相互コンダクタンス g<sub>m</sub>', 'ΔI<sub>D</sub>/ΔV<sub>GS</sub>', 'S'],
  ['電圧利得 G<sub>v</sub>', '20 log<sub>10</sub>A<sub>v</sub>', 'dB'],
  ['差動増幅の入力・出力', 'v<sub>i</sub>=v<sub>i1</sub>−v<sub>i2</sub>、v<sub>o</sub>=v<sub>o1</sub>−v<sub>o2</sub>', 'V'],
  ['正相増幅回路の増幅度', '1 + R<sub>F</sub>/R<sub>S</sub>', ''],
  ['帰還電圧 v<sub>F</sub>', 'R<sub>S</sub>/(R<sub>S</sub>+R<sub>F</sub>)·v<sub>o</sub>', 'V'],
];
