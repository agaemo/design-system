import StyleDictionary from 'style-dictionary'
import type { TransformedToken } from 'style-dictionary'

// ── Transforms ────────────────────────────────────────────────────────────────

StyleDictionary.registerTransform({
  name: 'name/ds-kebab',
  type: 'name',
  transform: ({ path }) =>
    path
      .join('-')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/-+/g, '-')
      .toLowerCase(),
})

StyleDictionary.registerTransformGroup({
  name: 'css/ds',
  transforms: ['name/ds-kebab', 'color/css'],
})

// ── HTML helpers ──────────────────────────────────────────────────────────────

/** SD v4 では DTCG 予約型名（color / duration 等）に一致するパスを持つトークンが
 *  value に正規化されず $value のままになることがある。両方を fallback する。 */
const tokenVal = (t: TransformedToken) => String(t.value ?? (t as any).$value ?? '')

function page(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Design System</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="shared.css">
</head>
<body>

<aside class="sidebar" id="sidebar-mount"></aside>

<main class="main">
${body}
</main>

<script type="module" src="_layout.js"></script>
</body>
</html>`
}

function swatchCard(t: TransformedToken, label?: string): string {
  return `      <div class="swatch">
        <div class="swatch-color" style="background:var(--${t.name})"></div>
        <div class="swatch-info">
          <div class="swatch-name">${label ?? t.name}</div>
          <div class="swatch-hex">${tokenVal(t)}</div>
        </div>
      </div>`
}

// ── Format: colors.html ───────────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/colors',
  format: ({ dictionary }) => {
    const all = dictionary.allTokens

    // Semantic color groups
    const semanticGroups: Array<[string, (t: TransformedToken) => boolean]> = [
      ['Background', t => t.name.startsWith('bg-')],
      ['Surface',    t => t.name === 'surface' || t.name.startsWith('surface-')],
      ['Text',       t => t.name.startsWith('text-')],
      ['Accent',     t => t.name === 'accent' || t.name.startsWith('accent-')],
      ['Border',     t => t.name === 'border' || t.name.startsWith('border-')],
      ['Status',     t => t.name.startsWith('status-')],
    ]

    const semanticSection = semanticGroups
      .map(([label, filter]) => {
        const tokens = all.filter(filter)
        if (!tokens.length) return ''
        return `    <h3>${label}</h3>
    <div class="swatch-grid">
${tokens.map(t => swatchCard(t)).join('\n')}
    </div>`
      })
      .filter(Boolean)
      .join('\n\n')

    // Primitive colors grouped by color family
    const primitives = all.filter(t => t.path[0] === 'color')
    const families = [...new Set(primitives.map(t => t.path[1]))]
    const familyLabel: Record<string, string> = {
      neutral: 'Neutral',
      blue: 'Blue (Accent)',
      green: 'Green',
      yellow: 'Yellow',
      red: 'Red',
    }

    const primitiveSection = families
      .map(family => {
        const tokens = primitives.filter(t => t.path[1] === family)
        return `    <h3>${familyLabel[family] ?? family}</h3>
    <div class="swatch-grid">
${tokens.map(t => swatchCard(t, t.name.replace('color-', ''))).join('\n')}
    </div>`
      })
      .join('\n\n')

    return page('Colors', `  <section id="semantic-colors" class="section-anchor">
    <h2>Semantic Colors</h2>
    <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-relaxed);margin-bottom:var(--space-5)">
      「何に使うか」を名前にしたカラートークン。コンポーネントに HEX 値を直接書くのではなく、このトークンを参照する。<br>
      <code>tokens/color/semantic.json</code> を編集して <code>bun run build</code> するだけで全体に反映される。
    </p>
    <div class="rule">
      <strong>コードでは必ずセマンティックトークンを使う。</strong>プリミティブカラー（<code>--color-blue-500</code> 等）をコードに直接書いてはいけない。
    </div>

    <h3>Tailwind クラス対応</h3>
    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">ページ背景</td><td class="tt-tw">bg-bg-base</td><td class="tt-css">var(--bg-base)</td></tr>
        <tr><td class="tt-purpose">カード・モーダル背景</td><td class="tt-tw">bg-bg-elevated</td><td class="tt-css">var(--bg-elevated)</td></tr>
        <tr><td class="tt-purpose">凹み領域</td><td class="tt-tw">bg-bg-sunken</td><td class="tt-css">var(--bg-sunken)</td></tr>
        <tr><td class="tt-purpose">サーフェス</td><td class="tt-tw">bg-surface</td><td class="tt-css">var(--surface)</td></tr>
        <tr><td class="tt-purpose">本文テキスト</td><td class="tt-tw">text-foreground</td><td class="tt-css">var(--text-primary)</td></tr>
        <tr><td class="tt-purpose">補助テキスト</td><td class="tt-tw">text-foreground-secondary</td><td class="tt-css">var(--text-secondary)</td></tr>
        <tr><td class="tt-purpose">薄いテキスト</td><td class="tt-tw">text-foreground-muted</td><td class="tt-css">var(--text-muted)</td></tr>
        <tr><td class="tt-purpose">無効テキスト</td><td class="tt-tw">text-foreground-disabled</td><td class="tt-css">var(--text-disabled)</td></tr>
        <tr><td class="tt-purpose">反転テキスト</td><td class="tt-tw">text-foreground-inverse</td><td class="tt-css">var(--text-inverse)</td></tr>
        <tr><td class="tt-purpose">ボタン・インタラクティブ背景</td><td class="tt-tw">bg-accent</td><td class="tt-css">var(--accent)</td></tr>
        <tr><td class="tt-purpose">ホバー時</td><td class="tt-tw">hover:bg-accent-hover</td><td class="tt-css">var(--accent-hover)</td></tr>
        <tr><td class="tt-purpose">薄いアクセント背景</td><td class="tt-tw">bg-accent-subtle</td><td class="tt-css">var(--accent-subtle)</td></tr>
        <tr><td class="tt-purpose">枠線（通常）</td><td class="tt-tw">border-border</td><td class="tt-css">var(--border)</td></tr>
        <tr><td class="tt-purpose">枠線（強調）</td><td class="tt-tw">border-border-strong</td><td class="tt-css">var(--border-strong)</td></tr>
        <tr><td class="tt-purpose">フォーカスリング</td><td class="tt-tw">ring-1 ring-border-focus</td><td class="tt-css">var(--border-focus)</td></tr>
        <tr><td class="tt-purpose">成功</td><td class="tt-tw">text-success / bg-success-subtle</td><td class="tt-css">var(--status-success)</td></tr>
        <tr><td class="tt-purpose">警告</td><td class="tt-tw">text-warning / bg-warning-subtle</td><td class="tt-css">var(--status-warning)</td></tr>
        <tr><td class="tt-purpose">エラー</td><td class="tt-tw">text-error / bg-error-subtle</td><td class="tt-css">var(--status-error)</td></tr>
      </tbody>
    </table>

${semanticSection}
  </section>

  <section id="primitive-colors" class="section-anchor">
    <h2>Primitive Colors</h2>
    <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-relaxed);margin-bottom:var(--space-5)">
      色を階調で網羅したカラーパレット。Semantic Colors の参照元であり、<strong>プロジェクトのコードからは直接使わない</strong>。
    </p>
    <div class="rule">
      <strong>アプリのコードでは使わない。</strong>ブランドカラーを変えるときは <code>tokens/color/primitive.json</code> を編集して <code>bun run build</code> を実行する。
    </div>

${primitiveSection}
  </section>`)
  },
})

// ── Format: typography.html ───────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/typography',
  format: ({ dictionary }) => {
    const all = dictionary.allTokens

    const fontSizes = all
      .filter(t => t.path[0] === 'fontSize')
      .sort((a, b) => parseFloat(tokenVal(b)) - parseFloat(tokenVal(a)))

    const fontSizeRows = fontSizes
      .map(t => {
        const key = t.path[1]
        const px = Math.round(parseFloat(tokenVal(t)) * 16)
        return `      <tr><td class="type-meta">${key} · ${px}px</td><td style="font-size:var(--${t.name});line-height:var(--line-height-tight)">Design System</td></tr>`
      })
      .join('\n')

    const fontWeights = all
      .filter(t => t.path[0] === 'fontWeight')
      .sort((a, b) => parseInt(tokenVal(a)) - parseInt(tokenVal(b)))

    const fontWeightRows = fontWeights
      .map(t => {
        const key = t.path[1]
        return `      <tr><td class="type-meta">${key} · ${tokenVal(t)}</td><td style="font-size:var(--font-size-lg);font-weight:var(--${t.name})">The quick brown fox jumps over the lazy dog</td></tr>`
      })
      .join('\n')

    return page('Typography', `  <section id="typography" class="section-anchor">
    <h2>Typography</h2>
    <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-relaxed);margin-bottom:var(--space-5)">
      フォントファミリー・サイズ・ウェイト・行間・字間のトークンをまとめたもの。<br>
      サイズや行間は相互に連動しており、<strong>バラバラに使うのではなく用途に応じた組み合わせを選ぶ</strong>こと（下の対応表参照）。
    </p>
    <div class="rule">
      <strong>フォントファミリー:</strong> 現在はシステムフォント（<code>font-sans</code> / <code>--font-family-sans</code>）。日本語プロジェクトでは <code>tokens/typography.json</code> の <code>fontFamily.sans</code> を変更して <code>bun run build</code> を実行する。等幅フォントは <code>font-mono</code> / <code>--font-family-mono</code>。
    </div>

    <h3>Tailwind クラス対応</h3>
    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">サンセリフ体</td><td class="tt-tw">font-sans</td><td class="tt-css">var(--font-family-sans)</td></tr>
        <tr><td class="tt-purpose">等幅（コード）</td><td class="tt-tw">font-mono</td><td class="tt-css">var(--font-family-mono)</td></tr>
        <tr><td class="tt-purpose">本文</td><td class="tt-tw">text-base</td><td class="tt-css">var(--font-size-base) · 16px</td></tr>
        <tr><td class="tt-purpose">キャプション・ラベル</td><td class="tt-tw">text-sm</td><td class="tt-css">var(--font-size-sm) · 14px</td></tr>
        <tr><td class="tt-purpose">小さなラベル</td><td class="tt-tw">text-xs</td><td class="tt-css">var(--font-size-xs) · 12px</td></tr>
        <tr><td class="tt-purpose">小見出し</td><td class="tt-tw">text-lg / text-xl</td><td class="tt-css">18px / 20px</td></tr>
        <tr><td class="tt-purpose">セクション見出し</td><td class="tt-tw">text-2xl / text-3xl</td><td class="tt-css">24px / 30px</td></tr>
        <tr><td class="tt-purpose">ページタイトル</td><td class="tt-tw">text-4xl / text-5xl</td><td class="tt-css">36px / 48px</td></tr>
        <tr><td class="tt-purpose">本文ウェイト</td><td class="tt-tw">font-normal</td><td class="tt-css">var(--font-weight-normal) · 400</td></tr>
        <tr><td class="tt-purpose">UI 要素（ボタン等）</td><td class="tt-tw">font-medium</td><td class="tt-css">var(--font-weight-medium) · 500</td></tr>
        <tr><td class="tt-purpose">見出し</td><td class="tt-tw">font-bold</td><td class="tt-css">var(--font-weight-bold) · 700</td></tr>
      </tbody>
    </table>

    <h3>Font Size</h3>
    <table class="type-table">
${fontSizeRows}
    </table>

    <h3>Font Weight</h3>
    <table class="type-table">
${fontWeightRows}
    </table>

    <h3>Monospace</h3>
    <div style="font-family:var(--font-family-mono);font-size:var(--font-size-sm);background:var(--surface-inset);color:var(--text-primary);padding:var(--space-4);border-radius:var(--radius-lg);border:1px solid var(--border)">
      <div style="color:var(--text-muted)">/* CSS変数の使い方 */</div>
      <div style="margin-top:var(--space-2)">.button {</div>
      <div style="padding-left:var(--space-4)">background: <span style="color:var(--accent)">var(--accent)</span>;</div>
      <div style="padding-left:var(--space-4)">color: <span style="color:var(--accent)">var(--text-inverse)</span>;</div>
      <div style="padding-left:var(--space-4)">border-radius: <span style="color:var(--accent)">var(--radius-md)</span>;</div>
      <div style="padding-left:var(--space-4)">padding: <span style="color:var(--accent)">var(--space-2) var(--space-4)</span>;</div>
      <div>}</div>
    </div>
  </section>`)
  },
})

// ── Format: spacing.html ──────────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/spacing',
  format: ({ dictionary }) => {
    const spaces = dictionary.allTokens
      .filter(t => t.path[0] === 'space')
      .sort((a, b) => parseFloat(tokenVal(a)) - parseFloat(tokenVal(b)))

    const spaceRows = spaces
      .map(t => {
        const key = t.path[1]
        return `      <tr><td class="space-key">${key}</td><td class="space-val">${tokenVal(t)}</td><td class="space-bar-wrap"><div class="space-bar" style="width:var(--${t.name})"></div></td></tr>`
      })
      .join('\n')

    return page('Spacing', `  <section id="spacing" class="section-anchor">
    <h2>Spacing</h2>
    <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-relaxed);margin-bottom:var(--space-5)">
      4px を基本単位としたスペーシングスケール。Tailwind のデフォルト数値スケール（<code>p-4</code> = 16px）と値が一致しており、Tailwind クラスをそのまま使える。CSS 変数（<code>var(--space-4)</code>）は Tailwind を使わないプロジェクトや、CSS で直接計算が必要な場面で使う。<strong>スケール外の任意 px 値はハードコードしない。</strong>
    </p>

    <h3>Padding（内側の余白）</h3>
    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">小さなボタン・バッジ</td><td class="tt-tw">px-2 py-1</td><td class="tt-css">var(--space-2) / var(--space-1)</td><td class="tt-css">8px / 4px</td></tr>
        <tr><td class="tt-purpose">ボタン・タグ（標準）</td><td class="tt-tw">px-4 py-2</td><td class="tt-css">var(--space-4) / var(--space-2)</td><td class="tt-css">16px / 8px</td></tr>
        <tr><td class="tt-purpose">入力欄・セレクト</td><td class="tt-tw">px-3 py-2</td><td class="tt-css">var(--space-3) / var(--space-2)</td><td class="tt-css">12px / 8px</td></tr>
        <tr><td class="tt-purpose">カード・パネル内部</td><td class="tt-tw">p-4 / p-6</td><td class="tt-css">var(--space-4) / var(--space-6)</td><td class="tt-css">16px / 24px</td></tr>
        <tr><td class="tt-purpose">ページ外枠（モバイル）</td><td class="tt-tw">px-4</td><td class="tt-css">var(--space-4)</td><td class="tt-css">16px</td></tr>
        <tr><td class="tt-purpose">ページ外枠（デスクトップ）</td><td class="tt-tw">px-10</td><td class="tt-css">var(--space-10)</td><td class="tt-css">40px</td></tr>
      </tbody>
    </table>

    <h3>Margin（外側の余白）</h3>
    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">ラベル → 入力欄</td><td class="tt-tw">mb-1</td><td class="tt-css">var(--space-1)</td><td class="tt-css">4px</td></tr>
        <tr><td class="tt-purpose">フォームフィールド間</td><td class="tt-tw">mb-4</td><td class="tt-css">var(--space-4)</td><td class="tt-css">16px</td></tr>
        <tr><td class="tt-purpose">小見出し → 本文</td><td class="tt-tw">mb-2</td><td class="tt-css">var(--space-2)</td><td class="tt-css">8px</td></tr>
        <tr><td class="tt-purpose">セクション見出し → 内容</td><td class="tt-tw">mb-6</td><td class="tt-css">var(--space-6)</td><td class="tt-css">24px</td></tr>
        <tr><td class="tt-purpose">セクション間</td><td class="tt-tw">mb-12 / mb-16</td><td class="tt-css">var(--space-12) / var(--space-16)</td><td class="tt-css">48px / 64px</td></tr>
      </tbody>
    </table>

    <h3>Gap（Flex / Grid の隙間）</h3>
    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">アイコン ＋ テキスト</td><td class="tt-tw">gap-1.5</td><td class="tt-css">var(--space-1-5)</td><td class="tt-css">6px</td></tr>
        <tr><td class="tt-purpose">インラインチップ・タグ列</td><td class="tt-tw">gap-2</td><td class="tt-css">var(--space-2)</td><td class="tt-css">8px</td></tr>
        <tr><td class="tt-purpose">カード列・ボタン列</td><td class="tt-tw">gap-3 / gap-4</td><td class="tt-css">var(--space-3) / var(--space-4)</td><td class="tt-css">12px / 16px</td></tr>
        <tr><td class="tt-purpose">カードグリッド</td><td class="tt-tw">gap-6</td><td class="tt-css">var(--space-6)</td><td class="tt-css">24px</td></tr>
        <tr><td class="tt-purpose">ページレイアウト列</td><td class="tt-tw">gap-8 / gap-12</td><td class="tt-css">var(--space-8) / var(--space-12)</td><td class="tt-css">32px / 48px</td></tr>
      </tbody>
    </table>

    <h3>スケール</h3>
    <table class="space-table">
${spaceRows}
    </table>
  </section>`)
  },
})

// ── Format: radius.html ───────────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/radius',
  format: ({ dictionary }) => {
    const radii = dictionary.allTokens
      .filter(t => t.name.startsWith('radius'))
      .sort((a, b) => parseInt(tokenVal(a)) - parseInt(tokenVal(b)))

    function radiusLabel(name: string): string {
      if (name === 'radius') return 'base'
      return name.replace('radius-', '')
    }

    const radiusBoxes = radii
      .map(t => {
        const label = radiusLabel(t.name)
        return `      <div class="radius-item">
        <div class="radius-box" style="border-radius:var(--${t.name})"></div>
        <div class="radius-label">${label} · ${tokenVal(t)}</div>
      </div>`
      })
      .join('\n')

    return page('Border Radius', `  <section id="radius" class="section-anchor">
    <h2>Border Radius</h2>
    <div class="rule">
      <strong>コンポーネントの種類に応じて使い分ける。</strong>一段階ずれると印象が大きく変わるため、下の対応表を守る。
    </div>

    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th><th>値</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">ボタン・入力欄</td><td class="tt-tw">rounded-md</td><td class="tt-css">var(--radius-md)</td><td class="tt-css">6px</td></tr>
        <tr><td class="tt-purpose">カード・パネル</td><td class="tt-tw">rounded-lg</td><td class="tt-css">var(--radius-lg)</td><td class="tt-css">8px</td></tr>
        <tr><td class="tt-purpose">ダイアログ・ポップオーバー</td><td class="tt-tw">rounded-xl</td><td class="tt-css">var(--radius-xl)</td><td class="tt-css">12px</td></tr>
        <tr><td class="tt-purpose">モーダル・大きなコンテナ</td><td class="tt-tw">rounded-2xl</td><td class="tt-css">var(--radius-2xl)</td><td class="tt-css">16px</td></tr>
        <tr><td class="tt-purpose">バッジ・ピル・タグ</td><td class="tt-tw">rounded-full</td><td class="tt-css">var(--radius-full)</td><td class="tt-css">9999px</td></tr>
        <tr><td class="tt-purpose">テーブルセル・隣接要素</td><td class="tt-tw">rounded-none</td><td class="tt-css">var(--radius-none)</td><td class="tt-css">0px</td></tr>
      </tbody>
    </table>

    <div class="radius-grid">
${radiusBoxes}
    </div>
  </section>`)
  },
})

// ── Format: animation.html ───────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/animation',
  format: ({ dictionary }) => {
    const durations = dictionary.allTokens
      .filter(t => t.path[0] === 'duration')
    const easings = dictionary.allTokens
      .filter(t => t.path[0] === 'easing')

    const durationRows = durations
      .map(t => `      <tr>
        <td class="tt-purpose">${t.path[1]}</td>
        <td class="tt-css">var(--${t.name})</td>
        <td class="tt-css">${tokenVal(t)}</td>
        <td>
          <div class="anim-demo-wrap">
            <div class="anim-demo-bar" style="--demo-dur:var(--${t.name});--demo-ease:ease"></div>
          </div>
        </td>
      </tr>`)
      .join('\n')

    const easingRows = easings
      .map(t => `      <tr>
        <td class="tt-purpose">${t.path[1]}</td>
        <td class="tt-css">var(--${t.name})</td>
        <td class="tt-css" style="font-size:var(--font-size-xs)">${tokenVal(t)}</td>
        <td>
          <div class="anim-demo-wrap">
            <div class="anim-demo-bar" style="--demo-dur:var(--duration-slow);--demo-ease:var(--${t.name})"></div>
          </div>
        </td>
      </tr>`)
      .join('\n')

    return page('Animation', `  <style>
    .anim-demo-wrap {
      width: 180px; height: 28px;
      background: var(--surface-inset);
      border-radius: var(--radius-md);
      position: relative; overflow: hidden; cursor: pointer;
    }
    .anim-demo-bar {
      width: 40px; height: 100%;
      background: var(--accent);
      border-radius: var(--radius-md);
      transform: translateX(0);
      transition: transform var(--demo-dur, 200ms) var(--demo-ease, ease);
    }
    .anim-demo-wrap:hover .anim-demo-bar { transform: translateX(140px); }
  </style>

  <section id="animation" class="section-anchor">
    <h2>Animation</h2>
    <p style="font-size:var(--font-size-sm);color:var(--text-secondary);line-height:var(--line-height-relaxed);margin-bottom:var(--space-5)">
      トランジション・アニメーションに使う duration（時間）と easing（加速曲線）のトークン。<br>
      <code>transition: color var(--duration-normal) var(--easing-out)</code> のように組み合わせて使う。デモ列はホバーで動作確認できる。
    </p>
    <div class="rule">
      <strong>duration と easing は必ずこのトークンから選ぶ。</strong>任意の ms 値・cubic-bezier をハードコードしない。
    </div>

    <h3>Duration</h3>
    <table class="token-table">
      <thead>
        <tr><th>名前</th><th>CSS 変数</th><th>値</th><th>デモ（ホバー）</th></tr>
      </thead>
      <tbody>
${durationRows}
      </tbody>
    </table>

    <h3>Easing</h3>
    <table class="token-table">
      <thead>
        <tr><th>名前</th><th>CSS 変数</th><th>値</th><th>デモ（ホバー・300ms）</th></tr>
      </thead>
      <tbody>
${easingRows}
      </tbody>
    </table>
  </section>`)
  },
})

// ── Format: shadow.html ───────────────────────────────────────────────────────

StyleDictionary.registerFormat({
  name: 'html/shadow',
  format: ({ dictionary }) => {
    const shadows = dictionary.allTokens
      .filter(t => t.name.startsWith('shadow'))

    const shadowOrder = ['shadow-none', 'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl']
    const sorted = [...shadows].sort(
      (a, b) => shadowOrder.indexOf(a.name) - shadowOrder.indexOf(b.name),
    )

    const shadowBoxes = sorted
      .map(t => `      <div class="shadow-item">
        <div class="shadow-box" style="box-shadow:var(--${t.name})"></div>
        <div class="shadow-label">${t.name}</div>
      </div>`)
      .join('\n')

    return page('Shadow', `  <section id="shadow" class="section-anchor">
    <h2>Shadow</h2>
    <div class="rule">
      <strong>エレベーション（重なり）を表現するためだけに使う。装飾目的では使わない。</strong>影とボーダーを同時に使う場合は shadow-sm + border の組み合わせが自然。
    </div>

    <table class="token-table">
      <thead>
        <tr><th>用途</th><th>Tailwind クラス</th><th>CSS 変数</th></tr>
      </thead>
      <tbody>
        <tr><td class="tt-purpose">カード・インラインウィジェット</td><td class="tt-tw">shadow-sm</td><td class="tt-css">var(--shadow-sm)</td></tr>
        <tr><td class="tt-purpose">インタラクティブなカード</td><td class="tt-tw">shadow</td><td class="tt-css">var(--shadow)</td></tr>
        <tr><td class="tt-purpose">ドロップダウン・ポップオーバー</td><td class="tt-tw">shadow-md</td><td class="tt-css">var(--shadow-md)</td></tr>
        <tr><td class="tt-purpose">トースト・フローティングUI</td><td class="tt-tw">shadow-lg</td><td class="tt-css">var(--shadow-lg)</td></tr>
        <tr><td class="tt-purpose">モーダル・ダイアログ</td><td class="tt-tw">shadow-xl</td><td class="tt-css">var(--shadow-xl)</td></tr>
        <tr><td class="tt-purpose">フラット（影なし）</td><td class="tt-tw">shadow-none</td><td class="tt-css">var(--shadow-none)</td></tr>
      </tbody>
    </table>

    <div class="shadow-grid">
${shadowBoxes}
    </div>
  </section>`)
  },
})

// ── Build ─────────────────────────────────────────────────────────────────────

const sd = new StyleDictionary({
  source: [
    'tokens/color/primitive.json',
    'tokens/color/semantic.json',
    'tokens/shadow.json',
    'tokens/typography.json',
    'tokens/spacing.json',
    'tokens/radius.json',
    'tokens/animation.json',
  ],
  platforms: {
    css: {
      transformGroup: 'css/ds',
      buildPath: 'css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            selector: ':root',
            outputReferences: true,
            fileHeader: () => [
              'Design System — CSS Custom Properties',
              'Generated by Style Dictionary. Do not edit manually.',
              'Source: tokens/   Build: bun run build',
            ],
          },
        },
      ],
    },
    html: {
      transformGroup: 'css/ds',
      buildPath: 'docs/',
      files: [
        { destination: 'colors.html',     format: 'html/colors' },
        { destination: 'typography.html', format: 'html/typography' },
        { destination: 'spacing.html',    format: 'html/spacing' },
        { destination: 'radius.html',     format: 'html/radius' },
        { destination: 'shadow.html',     format: 'html/shadow' },
        { destination: 'animation.html', format: 'html/animation' },
      ],
    },
  },
})

await sd.buildAllPlatforms()
console.log('css/variables.css + docs/*.html generated')
