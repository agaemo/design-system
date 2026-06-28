# パーソナルデザインシステム

個人開発プロジェクト全体で共通して使うデザイン言語とトークンを管理するリポジトリ。

## 目的

- デザイントークン（色・タイポグラフィ・スペーシング等）を一元管理する
- 新規プロジェクト開始時にこのリポジトリを参照し、一貫したデザインを実現する
- AIがこのシステムを読み込み、各プロジェクトで正しいトークンを使ったコードを生成できるようにする

## 設計方針

- **コンポーネントはここで管理しない**。コンポーネント実装は各プロジェクトで行う
- **トークンとルールのみを共有する**
- Tailwind CSSをベースに、カスタムトークンをtailwind.config.tsで定義する
- CSS変数（カスタムプロパティ）も併用し、Tailwind非使用プロジェクトでも使えるようにする

## ディレクトリ構成

```
design-system/
├── CLAUDE.md              # このファイル（AIへの指示・概要）
├── .mise.toml             # ツールバージョン固定（bun）
├── package.json           # 依存・スクリプト定義
├── bunfig.toml            # bun設定（runはbunランタイムを強制）
├── vite.config.ts         # Viteビルド設定（マルチページ）
├── tsconfig.json          # TypeScript設定（エディタ・型チェック用）
├── sd.config.ts           # Style Dictionary ビルド設定・HTMLフォーマット定義
├── tokens/                # トークン定義（JSON・編集対象）
│   ├── color/
│   │   ├── primitive.json
│   │   └── semantic.json
│   ├── typography.json
│   ├── spacing.json
│   ├── radius.json
│   └── shadow.json
├── css/
│   ├── variables.css      # CSS変数（bun run build:tokens で自動生成）
│   └── components.css     # コンポーネントクラス定義（手動管理・配布対象）
├── tailwind/
│   └── tailwind.config.ts # 共有Tailwind設定（ローカル参照専用）
└── docs/                  # ホスティング公開用サイト一式
    ├── index.html          # トップページ（手動管理）
    ├── colors.html         # カラートークンプレビュー（bun run build:tokens で自動生成）
    ├── typography.html     # タイポグラフィプレビュー（自動生成）
    ├── spacing.html        # スペーシングプレビュー（自動生成）
    ├── radius.html         # 角丸プレビュー（自動生成）
    ├── shadow.html         # 影プレビュー（自動生成）
    ├── components.html     # コンポーネント例（手動管理）
    ├── components-forms.html
    ├── components-layout.html
    ├── shared.css          # プレビューサイト共通スタイル（手動管理）
    ├── _layout.js          # プレビューサイトレイアウトスクリプト
    ├── _sidebar.html       # サイドバーパーシャル（手動管理）
    ├── tokens.md           # トークンリファレンス
    ├── public/
    │   └── llms.txt        # AI参照用（curl可能・Viteが /llms.txt として配信）
    └── css/
        ├── variables.css   # bun run build:tokens でコピーされる生成CSS
        └── components.css  # bun run build:tokens で css/components.css からコピー
```

## スクリプト

| コマンド | 内容 |
|---|---|
| `bun run dev` | トークンビルド → Vite dev server 起動（localhost:5173） |
| `bun run build` | トークンビルド → Viteビルド → `dist/` に出力 |
| `bun run build:tokens` | CSS変数 + docs/*.html を生成（Viteビルドなし） |
| `bun run lint` | oxlint でlint |
| `bun run format` | oxfmt でフォーマット |

## ビルドフロー

```
tokens/ (JSON)
  ↓ bun sd.config.ts
css/variables.css                              # ローカル参照用（他プロジェクトが直接 import）
docs/{colors,typography,spacing,radius,shadow,animation}.html  # プレビューページ（自動生成）
docs/css/variables.css                         # プレビューサイト用（Viteがバンドル）

css/components.css（手動管理）
  ↓ cp（build:tokens / build スクリプト）
docs/css/components.css                        # プレビューサイト用（Viteがバンドル）

  ↓ vite build
dist/                      # デプロイ対象（ホスティングサービスに公開）
  ├── *.html
  ├── llms.txt             # /llms.txt でcurl可能
  └── assets/
```

トークンカテゴリのプレビューページ（colors.html 等）は `sd.config.ts` 内のフォーマット関数で生成。  
手動管理ファイル: `docs/index.html`・`docs/components*.html`・`docs/_sidebar.html`・`docs/shared.css`・`css/components.css`。

## 別プロジェクトでの使い方

### パターンA: ローカル参照（同一マシン上のプロジェクト）

`design-system/` と各プロジェクトが同じ親ディレクトリに存在する場合に使用する。

```ts
// tailwind.config.ts
import baseConfig from '../design-system/tailwind/tailwind.config'
export default { ...baseConfig, content: ['./src/**/*.{html,js,ts,jsx,tsx}'] }
```

```css
/* globals.css */
@import '../design-system/css/variables.css';
@import '../design-system/css/components.css'; /* コンポーネントクラスも使う場合 */
```

### パターンB: ホスティング経由（URL参照）

`docs/` をデプロイ済みの場合（Cloudflare Pages 等）、CSS ファイルを URL で参照できる。
**tailwind.config.ts はNode.jsモジュールのためURL経由では使用不可。**

```css
@import 'https://your-domain/css/variables.css';
@import 'https://your-domain/css/components.css'; /* コンポーネントクラスも使う場合 */
```

### CSS変数のみ使う場合（パターンA）

```html
<link rel="stylesheet" href="../design-system/css/variables.css">
```

## 変更時に合わせて更新が必要なファイル

トークン・コンポーネント・使い方に変更を加えた場合、以下を忘れずに更新すること：

- `README.md` — ディレクトリ構成・使い方・トークン早見表
- `docs/public/llms.txt` — AI 参照用のトークン・クラス一覧
- `CLAUDE.md` — ディレクトリ構成・ビルドフロー・トークン定義状況

## AIへの指示

このデザインシステムを読み込んだ上でコードを生成する場合：

- `tokens/` 配下のJSONに定義されたトークン名・値を使うこと
- Tailwindクラスを使う場合は `tailwind/tailwind.config.ts` に定義されたカスタムトークンを優先すること
- デザイントークンに存在しない色やサイズをハードコードしないこと
- 新しいトークンが必要な場合は、追加してよいか確認すること

## トークン定義状況

| カテゴリ | 状態 |
|---|---|
| カラー | 定義済み（ニュートラル + ブルーアクセント） |
| タイポグラフィ | 定義済み（システムフォント、サイズ・ウェイト・行間・字間） |
| スペーシング | 定義済み（4px ベーススケール） |
| 角丸 | 定義済み |
| 影 | 定義済み |
| アニメーション | 定義済み（duration / easing） |
