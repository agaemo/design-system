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
│   └── variables.css          # CSS カスタムプロパティ（ビルド生成）
├── tailwind/
│   └── tailwind.config.ts     # 共有 Tailwind 設定（ローカル参照専用）
├── docs/                      # トークンビジュアルドキュメント（Vite dev/build 対象）
│   └── public/
│       └── llms.txt           # AI 参照用（/llms.txt でアクセス可能）
├── dist/                      # Vite ビルド出力（デプロイ対象）
├── sd.config.ts               # Style Dictionary ビルド設定
└── package.json
```

## セットアップ

```bash
mise install    # bun をインストール
bun install
bun run build   # tokens/ → css/variables.css 生成 + Vite ビルド
bun run dev     # ドキュメントサーバーを起動（http://localhost:5173）
```

## 別プロジェクトでの使い方

### Tailwind CSS プロジェクト（ローカル参照）

```ts
// tailwind.config.ts
import baseConfig from '../design-system/tailwind/tailwind.config'

export default {
  ...baseConfig,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
}
```

`css/variables.css` もプロジェクト側で読み込む。

```css
@import '../design-system/css/variables.css';
```

### CSS 変数のみ使う場合

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
| ステータス | `--status-*` | `--status-success`, `--status-error`, `--status-warning` |
| スペーシング | `--space-*` | `--space-1`(4px) 〜 `--space-32`(128px) |
| 角丸 | `--radius-*` | `--radius-sm`〜`--radius-full` |
| 影 | `--shadow-*` | `--shadow-sm`〜`--shadow-xl` |
| フォント | `--font-*` | `--font-size-sm`, `--font-weight-medium` |

詳細は `tokens/` 配下の JSON、または `docs/public/llms.txt` を参照。
