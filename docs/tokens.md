# デザイントークン リファレンス

## カラー

### セマンティックトークン（推奨）

実装ではプリミティブ値をハードコードせず、セマンティックトークンを使うこと。

| CSS変数 | Tailwindクラス例 | 用途 |
|---|---|---|
| `--bg-base` | `bg-bg-base` | ページ背景 |
| `--bg-elevated` | `bg-bg-elevated` | カード・モーダル背景 |
| `--bg-sunken` | `bg-bg-sunken` | 凹んだ領域・コードブロック |
| `--surface` | `bg-surface` | 基本サーフェス（白） |
| `--surface-subtle` | `bg-surface-subtle` | ほんのり背景のある領域 |
| `--surface-inset` | `bg-surface-inset` | インセット領域 |
| `--border` | `border-border` | デフォルト枠線 |
| `--border-strong` | `border-border-strong` | 強調枠線 |
| `--border-focus` | `border-border-focus` | フォーカスリング |
| `--text-primary` | `text-foreground` | 本文テキスト |
| `--text-secondary` | `text-foreground-secondary` | 補助テキスト |
| `--text-muted` | `text-foreground-muted` | 薄いテキスト・プレースホルダー |
| `--text-disabled` | `text-foreground-disabled` | 無効状態 |
| `--text-inverse` | `text-foreground-inverse` | 暗い背景上の白テキスト |
| `--accent` | `bg-accent` | ボタン・リンクのアクセントカラー |
| `--accent-hover` | `bg-accent-hover` | アクセントホバー状態 |
| `--accent-subtle` | `bg-accent-subtle` | 薄いアクセント背景 |

### ステータスカラー

| CSS変数 | Tailwindクラス例 | 用途 |
|---|---|---|
| `--status-success` | `bg-success` | 成功・正常 |
| `--status-success-bg` | `bg-success-subtle` | 成功の背景 |
| `--status-warning` | `bg-warning` | 警告 |
| `--status-warning-bg` | `bg-warning-subtle` | 警告の背景 |
| `--status-error` | `bg-error` | エラー |
| `--status-error-bg` | `bg-error-subtle` | エラーの背景 |
| `--status-info` | `bg-info` | 情報 |
| `--status-info-bg` | `bg-info-subtle` | 情報の背景 |

## タイポグラフィ

### フォントファミリー

| CSS変数 | Tailwindクラス | 説明 |
|---|---|---|
| `--font-sans` | `font-sans` | システムフォント（未確定時のデフォルト） |
| `--font-mono` | `font-mono` | 等幅フォント |

フォントを変更する場合は CSS変数のみ更新すれば全体に反映される。

### フォントサイズ

| CSS変数 | px | Tailwindクラス |
|---|---|---|
| `--text-xs` | 12 | `text-xs` |
| `--text-sm` | 14 | `text-sm` |
| `--text-base` | 16 | `text-base` |
| `--text-lg` | 18 | `text-lg` |
| `--text-xl` | 20 | `text-xl` |
| `--text-2xl` | 24 | `text-2xl` |
| `--text-3xl` | 30 | `text-3xl` |
| `--text-4xl` | 36 | `text-4xl` |
| `--text-5xl` | 48 | `text-5xl` |

### フォントウェイト・行間

| 変数 | 値 |
|---|---|
| `--font-normal` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |
| `--leading-tight` | 1.25 |
| `--leading-normal` | 1.5 |
| `--leading-relaxed` | 1.625 |

## スペーシング

4px ベースのスケール。Tailwindのデフォルトスペーシングと同一なので、`p-4`（=16px）のように普通に使える。

| スケール | 値 |
|---|---|
| 1 | 4px |
| 2 | 8px |
| 4 | 16px |
| 6 | 24px |
| 8 | 32px |
| 12 | 48px |

## 角丸

| CSS変数 | 値 | Tailwindクラス |
|---|---|---|
| `--radius-sm` | 2px | `rounded-sm` |
| `--radius` | 4px | `rounded` |
| `--radius-md` | 6px | `rounded-md` |
| `--radius-lg` | 8px | `rounded-lg` |
| `--radius-xl` | 12px | `rounded-xl` |
| `--radius-full` | 9999px | `rounded-full` |

## ダークモード

```html
<!-- クラスで切り替え -->
<html class="dark">

<!-- 属性で切り替え -->
<html data-theme="dark">
```

CSS変数はどちらの方法でも自動的に切り替わる。Tailwindの `dark:` プレフィックスは `.dark` クラスに対応。

## 別プロジェクトでの使い方

### Tailwind プロジェクト

```js
// tailwind.config.js
const baseConfig = require('../design-system/tailwind/tailwind.config')

module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{html,js,ts,jsx,tsx}'],
}
```

```css
/* globals.css */
@import '../design-system/css/variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### CSS変数のみ使う場合

```html
<link rel="stylesheet" href="../design-system/css/variables.css">
```

```css
.button {
  background-color: var(--accent);
  color: var(--text-inverse);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
}
```
