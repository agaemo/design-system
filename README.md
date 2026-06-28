# パーソナルデザインシステム

個人開発プロジェクト全体で共通して使うデザイントークンと CSS 変数を管理するリポジトリ。

コンポーネント実装は各プロジェクトで行う。このリポジトリはトークンとスタイルルールのみを管理する。

## ディレクトリ構成

```
design-system/
├── tokens/                    # トークンの正典（W3C Design Token Format）
│   ├── color/
│   │   ├── primitive.json     # プリミティブカラー（neutral / blue / green / yellow / red）
│   │   └── semantic.json      # セマンティックカラー（bg / text / accent / status）
│   ├── typography.json        # フォント・サイズ・ウェイト・行間・字間
│   ├── spacing.json           # 4px ベーススケール
│   ├── radius.json            # 角丸
│   └── shadow.json            # 影
├── css/
│   ├── variables.css          # CSS カスタムプロパティ（ビルド生成）
│   └── components.css         # コンポーネントクラス定義（手動管理・配布対象）
├── tailwind/
│   └── tailwind.config.ts     # 共有 Tailwind 設定（ローカル参照専用）
├── docs/                      # トークンビジュアルドキュメント（Vite dev/build 対象）
│   ├── index.html             # トップページ（手動管理）
│   ├── colors.html            # カラートークンプレビュー（ビルド生成）
│   ├── typography.html        # タイポグラフィプレビュー（ビルド生成）
│   ├── spacing.html           # スペーシングプレビュー（ビルド生成）
│   ├── radius.html            # 角丸プレビュー（ビルド生成）
│   ├── shadow.html            # 影プレビュー（ビルド生成）
│   ├── components*.html       # コンポーネント例（手動管理）
│   └── public/
│       └── llms.txt           # AI 参照用（/llms.txt でアクセス可能）
├── dist/                      # Vite ビルド出力（デプロイ対象）
├── sd.config.ts               # Style Dictionary ビルド設定・HTML 生成フォーマット
└── package.json
```

## セットアップ

```bash
mise install    # bun をインストール
bun install
bun run dev     # トークンビルド → ドキュメントサーバー起動（http://localhost:5173）
```

## ビルドフロー

```
tokens/*.json
  ↓ bun run build:tokens（sd.config.ts）
css/variables.css          # CSS 変数
docs/{colors,typography,spacing,radius,shadow}.html  # プレビューページ（自動生成）
  ↓ vite build
dist/                      # デプロイ対象
```

`tokens/` を編集して `bun run build:tokens` を実行すると、CSS 変数とドキュメントページが同時に更新される。

## トークン変更の手順

```bash
# 1. tokens/ 内の JSON を編集
# 2. ビルド
bun run build:tokens
# 3. ブラウザが自動リロードされ反映を確認（dev server 起動中の場合）
```

## 別プロジェクトでの使い方

### パターンA: ローカル参照



```ts
// tailwind.config.ts
import baseConfig from '../design-system/tailwind/tailwind.config'

export default {
  ...baseConfig,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
}
```

```css
/* globals.css */
@import '../design-system/css/variables.css';
```

### コンポーネントクラスも使う場合

```html
<link rel="stylesheet" href="../design-system/css/variables.css">
<link rel="stylesheet" href="../design-system/css/components.css">
```

```css
/* または CSS の @import */
@import '../design-system/css/variables.css';
@import '../design-system/css/components.css';
```

`css/components.css` は `variables.css` の CSS 変数を前提とするため、必ず両方を読み込む。

### パターンB: ホスティング経由（URL参照）

`docs/` をデプロイ済みの場合（Cloudflare Pages 等）、CSS ファイルを URL で参照できる。
パスを気にせずどのプロジェクトからでも使える。

```css
@import 'https://your-domain/css/variables.css';
@import 'https://your-domain/css/components.css'; /* コンポーネントクラスも使う場合 */
```

### CSS 変数のみ使う場合（Tailwind など既存の CSS フレームワークがある場合）

```html
<link rel="stylesheet" href="../design-system/css/variables.css">
```

## トークン早見表

| カテゴリ | CSS 変数プレフィックス | 例 |
|---|---|---|
| 背景 | `--bg-*` | `--bg-base`, `--bg-elevated`, `--bg-sunken` |
| サーフェス | `--surface*` | `--surface`, `--surface-subtle` |
| テキスト | `--text-*` | `--text-primary`, `--text-secondary`, `--text-muted` |
| ボーダー | `--border*` | `--border`, `--border-strong`, `--border-focus` |
| アクセント | `--accent*` | `--accent`, `--accent-hover`, `--accent-subtle` |
| ステータス | `--status-*` | `--status-success`, `--status-error`, `--status-warning`, `--status-*-bg` |
| アニメーション | `--duration-*` / `--easing-*` | `--duration-fast`(100ms), `--easing-out` |
| スペーシング | `--space-*` | `--space-1`(4px) 〜 `--space-32`(128px) |
| 角丸 | `--radius-*` | `--radius-sm`〜`--radius-full` |
| 影 | `--shadow-*` | `--shadow-sm`〜`--shadow-xl` |
| フォント | `--font-*` | `--font-size-sm`, `--font-weight-medium` |

詳細は `tokens/` 配下の JSON、または `docs/public/llms.txt` を参照。
