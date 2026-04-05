# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Gen（@gen_sobunya）のポートフォリオサイト兼、同人サークル「幻想サイクル」の公式WEBサイト。
**URL**: https://www.gensobunya.net  
**デプロイ**: Cloudflare Pages（GitHub連携のGitOps）

技術スタック: Astro 6 + TypeScript + Tailwind CSS + MDX

## 開発コマンド

```bash
npm run dev       # 開発サーバー起動（localhost:4321）
npm run build     # 本番ビルド（dist/）
npm run preview   # ビルド後プレビュー
```

Lint/Format ツール（設定済みだが package.json にスクリプト未定義のため直接実行）:
```bash
npx eslint src/
npx prettier --write src/
npx textlint src/content/   # 日本語テキスト検証（jtf-style）
```

## アーキテクチャと構造

### ルーティング

- `/` → `src/pages/index.astro` — トップページ（全セクションを1ページに統合）
- `/:slug/` → `src/pages/[slug].astro` — portfolio 詳細ページ（動的ルート）
- `/activities/` → `src/pages/activities.astro` — 全アクティビティ一覧（テーブル形式）
- `/rss.xml` → `src/pages/rss.xml.ts` — RSS フィード

`trailingSlash: "always"` が設定されているため、URL末尾に `/` が必要。

### コンテンツ管理（Astro Content Collections）

コンテンツは `src/content/portfolio/` 以下にディレクトリ単位で管理。

```
src/content/portfolio/
  c106/
    index.mdx         # Frontmatter + 本文（MDXまたはMarkdown）
    cover.png         # カバー画像（相対パスで参照）
    sample1.jpg       # その他の画像
```

スキーマは `src/content.config.ts` で Zod により定義・検証される。

**重要な Frontmatter フィールド**:
| フィールド | 型 | 備考 |
|---|---|---|
| `title` | string | 必須 |
| `date` | Date | 必須 |
| `draft` | boolean | `true` = ビルドから除外 |
| `tags` | string[] | `New` タグでトップページ Latest Activity に表示 |
| `category` | `"doujin"` \| `"writing"` \| `"achievement"` \| `"product"` | セクション振り分け |
| `availability` | `"available"` \| `"soldout"` \| `"upcoming"` \| `"digital-only"` | 購入ボタン表示制御 |
| `purchase` | `PurchaseLink[]` | `{ label, url }` の配列。`availability: "soldout"` でボタン無効化 |

`category: "doujin"` の詳細ページでは JSON-LD（Schema.org Book型）が自動出力される。

### 静的データ

コンテンツ以外のサイトデータは `src/data/` で TypeScript ファイルとして管理:

- `about.ts` — SKILLS, INTERESTS, WRITING_WORKS, LATEST_ACTIVITIES
- `links.ts` — リンクグループ（型: `LinkGroup[]`）
- `products.ts` — プロダクト情報
- `socials.ts` — SNS リンク

### コンポーネント構成

- `src/components/sections/` — トップページの各セクション（About, Publications など）
- `src/components/cards/` — コンテンツ一覧用カード（WorkCard, WritingRow など）
- `src/components/detail/` — 詳細ページ専用（PurchaseBar, RelatedWorks）
- `src/components/mdx/` — MDX 内で `import` して使用するコンポーネント（Gallery）
- `src/components/ui/` — 汎用UI（AvailabilityBadge, SectionHeading, ThemeToggle）
- `src/components/units/` — 小粒度の共通部品

**`ThemeToggle.tsx` のみ React コンポーネント**（クライアントサイドのインタラクション）。その他は Astro コンポーネント。

### パスエイリアス

```typescript
import Foo from "@/components/Foo.astro"  // src/ を @ でエイリアス
```

### テーマとスタイリング

CSS Custom Properties は `src/styles/global.css` に定義。ダーク（デフォルト）/ ライト切り替えは `data-theme="light"` 属性で制御。

主要カスタムプロパティ: `--bg`, `--surface`, `--accent`（オレンジ系）, `--accent-teal`, `--text`, `--text-muted`, `--border`

フォント:
- 本文/見出し: Noto Sans JP（Google Fonts）
- コード: JetBrains Mono

### MDX でのコンポーネント利用

```mdx
import Gallery from "@/components/mdx/Gallery.astro"

<Gallery>
  ![キャプション](./sample1.jpg)
  ![キャプション](./sample2.jpg)
</Gallery>
```

`Gallery` は CSS scroll-snap ベースのスライドショー。モバイルは横スワイプ、デスクトップはスクロール操作。

## アクセシビリティ（WCAG 2.1 AA 準拠）

このプロジェクトは **WCAG 2.1 AA** への準拠を目指して開発する。

- **コントラスト比**: テキストと背景のコントラスト比を AA 基準（通常テキスト 4.5:1、大きなテキスト 3:1）以上に保つ。テーマ変更時も両モードで確認する
- **フォーカス管理**: インタラクティブ要素（リンク、ボタン）には視認性の高いフォーカスインジケータを必ず設ける（`outline` を `none` に設定しない）
- **代替テキスト**: 情報を伝える画像には `alt` 属性を必ず設定する。装飾目的の画像は `alt=""` とする
- **セマンティクス**: ページ構造には適切な見出し階層（`h1` → `h2` → `h3`）と landmark 要素（`<main>`, `<nav>`, `<section aria-label>`）を使用する
- **キーボード操作**: マウスなしで全ての主要機能を操作できること。カスタムインタラクティブコンポーネントには ARIA ロールと `tabindex` を適切に付与する
- **モーション**: `prefers-reduced-motion` メディアクエリを尊重し、アニメーションを無効化できるようにする
- **フォームラベル**: フォーム要素（存在する場合）には関連付けられた `<label>` を設ける
