# Portfolio Redesign Implementation Plan

## Overview

gensobunya.net のポートフォリオサイトをゼロベースでリデザインする。技術スタック（Astro + Cloudflare Workers Pages）は維持し、デザインとコンポーネント構成を全面刷新する。

デザインの参照実装: `docs/design/portfolio-v5.jsx`（React単体のプロトタイプ）

## Goals

- 成果物（Products, Publications, Writing）を一覧でき、詳細を辿れるポートフォリオ
- SNSアカウントへの導線
- ダーク/ライトテーマ対応（prefers-color-scheme + 手動トグル）
- WCAG AA準拠のカラーパレット
- モバイルファースト

## Non-Goals

- ブログ機能（blog.gensobunya.net が担当）
- CMS統合
- i18n（日本語のみ）

---

## 1. Astro 4 → 6 アップグレード + 技術スタック更新

現行サイトは Astro 4.x / Node 16 で構成されている。Astro 6.0（2026年3月安定版リリース）まで一気にアップグレードする。
v5を経由せずv6へ直接上げることは非推奨のため、v4→v5→v6の2段階で進める。
各段階でビルドが通ることを確認してからコミットする。

参照ドキュメント:
- https://docs.astro.build/en/guides/upgrade-to/v5/
- https://docs.astro.build/en/guides/upgrade-to/v6/

### Step 0: Node.js バージョン更新

Astro 6 は Node 22.12.0 以上を要求する（Node 18, 20 はサポート外）。Node24を使用する。

```
# .nvmrc
24
```

Cloudflare Workers のデプロイ環境側でもNode 24を指定すること。

### Step 1: Astro 4 → 5 アップグレード

```bash
npx @astrojs/upgrade
```

このコマンドで Astro 本体と公式インテグレーション（`@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap` など）をまとめてv5互換バージョンへ更新できる。

#### 1-1. Content Layer API 移行（最大の変更点）

v5で Content Collections API が Content Layer API に移行された。v6ではレガシー互換が完全に削除されるため、この段階で確実に移行する。

コンフィグファイルの移動:

```
src/content/config.ts → src/content.config.ts
```

コレクション定義の変更:

```typescript
// Before (Astro 4)
import { z, defineCollection } from "astro:content"
const portfolioCollection = defineCollection({
  schema: ({ image }) => z.object({ ... })
})

// After (Astro 5+)
import { z, defineCollection } from "astro:content"
import { glob } from "astro/loaders"
const portfolioCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/portfolio" }),
  schema: ({ image }) => z.object({ ... })
})
```

#### 1-2. slug → id 変更

Content Layer API ではエントリに `slug` フィールドが存在しない。代わりに `id` を使う。
プロジェクト内の全箇所で `entry.slug` → `entry.id` に置換する。

影響するファイル:
- `src/pages/[slug].astro` — ファイル名自体は `[slug].astro` のままで可（params名の問題）。`getStaticPaths` 内で `entry.slug` → `entry.id` に変更。
- `src/pages/index.astro` — `newBookPage.slug` → `newBookPage.id`
- `src/pages/activities.astro` — `pageInfo.slug` → `pageInfo.id`
- `src/components/units/BookList.astro` — `newBookPage.slug` → `newBookPage.id`
- `src/components/units/RecentCards.astro` — `articleData.slug` → `articleData.id`

```typescript
// Before
return entries.map((entry) => ({
  params: { slug: entry.slug },
  props: { entry }
}))

// After
return entries.map((entry) => ({
  params: { slug: entry.id },
  props: { entry }
}))
```

#### 1-3. render() の変更

```typescript
// Before (Astro 4)
const { Content } = await entry.render()

// After (Astro 5+)
import { render } from "astro:content"
const { Content } = await render(entry)
```

#### 1-4. その他の v5 破壊的変更

- `Astro.glob()` は非推奨。`getCollection()` に統一（本プロジェクトでは既に使用していない可能性が高いが確認すること）
- `@astrojs/prefetch` は削除。Astro 3以降は組み込みの prefetch を使う（`astro.config.mjs` から `prefetch()` を削除）
- `@astrojs/mdx` を最新版（v4+）に更新必須。JSX処理がMDXパッケージ側に移動している
- `src/env.d.ts` は必須ではなくなったが、カスタム型定義がある場合は維持

#### 1-5. v5 ビルド確認

```bash
npm run build
```

ここでビルドが通ることを確認してコミット。

### Step 2: Astro 5 → 6 アップグレード

```bash
npx @astrojs/upgrade
```

#### 2-1. v6 の破壊的変更

Node 22 必須:
- Step 0 で対応済みのはず

Vite 7 アップグレード:
- Vite 固有のプラグインや設定を使っている場合は Vite 7 マイグレーションガイドを確認
- 本プロジェクトではカスタム Vite 設定はないため影響は小さい

Zod 3 → Zod 4:
- Content Collections のスキーマで `z` を使用している。Zod 4 で一部 API が変更されている
- `import { z } from "astro/zod"` を使うことで Astro 内部と同じバージョンの Zod を保証できる
- `z.object()`, `z.string()`, `z.array()`, `z.date()`, `z.boolean()` 等の基本的なスキーマは互換性があるためそのまま動く可能性が高い。ビルドエラーが出た場合は Zod 4 changelog を参照

Content Collections レガシー互換の完全削除:
- Step 1 で Content Layer API に移行済みであれば影響なし
- `legacy.collections` フラグが残っていたら削除する

`import.meta.env` の挙動変更:
- v6 では `import.meta.env` の値がビルド時にインライン化される
- ランタイムで環境変数を読む場合は `process.env` を使用する
- 本プロジェクトはSSGのため影響は小さいが、デプロイ時の秘匿値に注意

Shiki v4 アップグレード:
- シンタックスハイライトのカスタマイズがある場合は Shiki v4 マイグレーションガイドを参照

#### 2-2. v6 ビルド確認

```bash
npm run build
```

### Step 3: 不要な依存の削除と追加

v6 へのアップグレードが完了した後、リデザインに不要なパッケージを整理する。

削除対象:
- `@astrojs/prefetch` — Astro 3以降で組み込み済み。v5/v6では存在自体が不要
- `daisyui` — カスタムデザインシステムに置き換え
- `@splidejs/react-splide` — カルーセル不要
- `html-rewriter-wasm` — SampleSlide.astro 用だが不要に
- `astro-seo` — `<head>` で直接記述に移行

継続:
- `astro` (v6), `@astrojs/mdx`, `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/rss`
- `tailwindcss`, `@tailwindcss/typography`
- `astro-icon`, `@iconify-json/mdi`
- textlint, eslint, prettier（開発ツール群）

Tailwind統合について:
- `@astrojs/tailwind` はAstro 5以降でも動作するが、Tailwind v4 を使う場合は `@tailwindcss/vite` プラグイン経由の統合が推奨される
- 現行が Tailwind v3 系であれば `@astrojs/tailwind` をそのまま使ってもよい。Tailwind v4 移行は別作業として切り出すことを推奨

SSG デプロイ:
- 完全なSSGビルド（`output: "static"`、デフォルト）を維持する場合、`@astrojs/cloudflare` アダプターは不要
- Cloudflare Pages へ静的ファイルをデプロイする構成を継続

### Step 4: rss.xml.ts の修正

```typescript
// Before (Astro 4)
export const get = async () => { ... }

// After (Astro 5+)
export const GET = async () => { ... }
```

関数名を大文字にリネーム。また `getCollection` で取得したエントリの `.slug` → `.id` も修正。

### astro.config.mjs（最終形）

```typescript
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import icon from "astro-icon"

export default defineConfig({
  site: "https://www.gensobunya.net",
  trailingSlash: "always",
  integrations: [react(), mdx(), tailwind(), sitemap(), icon()],
  // SSG (output: "static") がデフォルト。adapter 不要。
})
```

---

## 2. デザインシステム

### カラーパレット

CSS Custom Properties で管理する。Tailwindのテーマではなく `:root` / `[data-theme="light"]` で切り替える。

```
Level         Dark (#0A0A0A)    Light (#FAFAF7)    最低コントラスト比  用途
────────────────────────────────────────────────────────────────────────
text-primary  #E8E8E8 (16:1)    #1A1A1A (17:1)     ≥7:1              見出し, タイトル
text-body     #B0B0B0 ( 9:1)    #3D3D3D (10:1)     ≥7:1              本文
text-muted    #8A8A8A ( 6:1)    #6E6E6E ( 5:1)     ≥4.5:1 (AA)       メタ情報, ナビ, ラベル
text-subtle   #6B6B6B ( 4:1)    #8F8F8F ( 3:1)     ≥3:1 (AA Large)   カウンタ, 装飾テキスト (≥18px or 14px bold)
border        #2A2A2A           #E0DED8                               ボーダーのみ (テキスト不可)
border-hover  #3D3D3D           #C8C6BE                               ホバー時ボーダー
surface       #141414           #FFFFFF                               カード背景
surface-hover #1E1E1E           #F5F4F0                               カードホバー
```

アクセントカラー（テーマ別）:

```
            Dark        Light       用途
accent      #FF6B4A     #B8301F     プライマリアクセント (NEW badge, タグ, 強調)
accent-teal #4ECDC4     #1E7A72     プロダクトカードのアクセント
```

同人誌カードの個別カラーもダーク/ライトの2値を持つ:

```
Work      Dark       Light
c106      #FF6B4A    #B8301F
c103      #4ECDC4    #1E7A72
c102      #95E77E    #2D7A1E
c101      #FFD93D    #8A6D00
c100      #6C5CE7    #4A3BBF
c99       #A8E6CF    #1A8A70
c97       #FD79A8    #C4306A
c95       #FDCB6E    #8A6D00
```

### タイポグラフィ

- Display / Body: `Noto Sans JP` (300, 400, 600, 900)
- Mono: `JetBrains Mono` (400, 500, 600)
- Google Fonts 経由でロード

### テーマ切り替え

- デフォルト: `prefers-color-scheme` に追従
- 手動トグル: `data-theme` 属性を `<html>` に設定
- Astroではサーバー側でOSテーマを判定できないため、初期表示のちらつきを防ぐ `<script is:inline>` をheadに配置

```html
<script is:inline>
  const theme = localStorage.getItem("theme") ??
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
  document.documentElement.setAttribute("data-theme", theme)
</script>
```

---

## 3. ページ構成

### 全体構造

単一ページ（`/`）にすべてのセクションを配置。スクロールジャンプで移動。

```
[Hero + Latest Activity]
  ├── 名前, 肩書き, SNSリンク
  ├── Latest Activity (最新2件)
  └── セクションジャンプボタン

[Products]  ← id="products"
  ├── Active products (横長カード: ステータス, 説明, 技術スタック, CTAリンク)
  └── Retired products (簡易行表示)

[Publications]  ← id="publications"
  └── 同人誌グリッド (3列 → モバイル2列, 表紙サムネイル付きカード)
      各カードに AvailabilityBadge を表示 ("Kindle" / "委託中" / "頒布終了")

[Writing]  ← id="writing"
  └── 東方同人音楽ライター活動 (時系列リスト, AWARD badge)

[About]  ← id="about"
  ├── Professional (Observability, テクニカルライティング)
  ├── Skills (タグ一覧)
  ├── Cycling (シクロクロス, サークル活動)
  ├── Touhou Music (ライター活動の説明文)
  ├── Interests (タグ一覧)
  └── Contact (連絡先の案内 — X DM / その他)

[Links]  ← id="links"
  ├── Blog (幻想サイクル, Life Blog)
  ├── Technical (Zenn)
  ├── Touhou (東方我楽多叢誌)
  └── Doujinshi (Kindle, メロンブックス)

[Footer]
```

### WorkCard の入手可否ラベル

フロントマターの `availability` と `purchase` からラベルを自動生成する。
カードのサムネイル下部にオーバーレイとして小さく表示する。

```
availability: "available"  + purchase に Kindle あり → "Kindle"
availability: "available"  + purchase にメロンブックスあり → "委託中"
availability: "available"  + purchase 複数 → "Kindle / 委託中"
availability: "soldout"    → "頒布終了"
availability: "upcoming"   → "準備中"
availability: 未設定       → ラベルなし
```

### About セクションの連絡先

About セクションの最後に CONTACT ブロックを追加する。
寄稿依頼・仕事の問い合わせなどの窓口として X の DM を案内する。

```
CONTACT
寄稿依頼・お仕事のご相談は X(@gen_sobunya) の DM へお気軽にどうぞ。
```

メールアドレスの直接掲載はスパム対策の観点から避ける。

### フローティングナビゲーション

- スクロールが hero 高さの60%を超えたら出現
- `IntersectionObserver` で現在セクションをハイライト
- テーマトグルボタンを右端に配置

### 詳細ページ (`/[slug]/`)

既存の Content Collections + MDX レンダリングを維持。レイアウトのみ新デザインに合わせる。

---

## 4. データモデル

### Content Collections

既存の `portfolio` コレクションのスキーマを拡張する。

```typescript
// src/content.config.ts  ← v5+ の配置場所
import { z, defineCollection } from "astro:content"
import { glob } from "astro/loaders"

const purchaseLink = z.object({
  label: z.string(),            // "Kindle", "メロンブックス" など
  url: z.string().url(),
})

const portfolioCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/portfolio" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      draft: z.boolean(),
      tags: z.array(z.string()),
      cover: image().optional(),
      // カテゴリ・ライター活動用
      category: z.enum(["doujin", "writing", "achievement", "product"]).optional(),
      outlet: z.string().optional(),       // Writing用: 掲載媒体
      externalUrl: z.string().optional(),  // 外部リンク先
      highlight: z.boolean().optional(),   // AWARD表示用
      // 同人誌の入手情報
      purchase: z.array(purchaseLink).optional(),  // 購入リンク一覧
      price: z.number().optional(),                // 頒布価格（円）
      pages: z.number().optional(),                // ページ数
      availability: z.enum(["available", "soldout", "upcoming"]).optional(),
    }),
})

export const collections = { portfolio: portfolioCollection }
```

フロントマターの記述例:

```yaml
---
title: "C106: ロードバイクお買い物論"
date: 2025-08-14
draft: false
tags: ["comicmarket", "C106", "Doujin", "New"]
cover: "./c106-cover.png"
category: "doujin"
price: 1000
pages: 60
availability: "available"
purchase:
  - label: "Kindle"
    url: "https://amzn.to/3JgexXJ"
  - label: "メロンブックス"
    url: "https://www.melonbooks.co.jp/detail/detail.php?product_id=3163402"
---
```

MDX 本文から購入リンクの散在を解消し、レイアウト側で構造的に表示できるようになる。

### 静的データ

Products, Links, Socials, About の内容はコンテンツ更新頻度が低いため、
TypeScript ファイルで管理する。

```
src/
  data/
    products.ts    — PRODUCTS, RETIRED_PRODUCTS
    links.ts       — LINKS_DATA
    socials.ts     — SOCIALS (name, url, icon名)
    about.ts       — SKILLS, INTERESTS, プロフィール文
```

---

## 5. コンポーネント構成

```
src/
  layouts/
    Layout.astro           — <html>, <head>, テーマ初期化script, フォント読み込み, JSON-LD
  components/
    Hero.astro             — ヒーローセクション + Latest Activity + ジャンプボタン
    FloatingNav.astro      — フローティングナビ (client:load の Island)
    ThemeToggle.tsx         — テーマ切り替えボタン (React, client:load)
    sections/
      Products.astro       — Products セクション
      Publications.astro   — 同人誌グリッド
      Writing.astro        — 東方音楽ライター活動リスト
      About.astro          — プロフィール2カラム + 連絡先
      Links.astro          — 外部リンク集
    cards/
      ProductCard.astro    — プロダクトカード (横長, アクセントバー付き)
      WorkCard.astro       — 同人誌カード (サムネイル + タイトル + 入手ラベル)
      WritingRow.astro     — Writing リストの1行
      LinkItem.astro       — Linkリストの1行
    detail/
      PurchaseBar.astro    — 購入CTAバー (フロントマターの purchase から生成)
      RelatedWorks.astro   — 関連作品カード (同カテゴリから2-3件)
    ui/
      SectionHeading.astro — セクション見出し (ラベル + カウント + サブテキスト)
      SkillTag.astro       — タグバッジ
      LatestItem.astro     — Latest Activity の1行
      AvailabilityBadge.astro — 入手可否ラベル ("Kindle" / "委託中" / "頒布終了" / "準備中")
    mdx/
      Gallery.astro        — サンプルページギャラリー (CSS scroll-snap)
  pages/
    index.astro            — トップページ (全セクションを組み立て)
    [slug].astro           — 詳細ページ (MDXレンダリング)
    activities.astro       — 全活動一覧 (テーブル表示, 維持 or リデザイン)
    404.astro              — 404ページ (新デザイン適用, トップへの導線)
    rss.xml.ts             — RSSフィード
  styles/
    global.css             — CSS Custom Properties, テーマ定義, Google Fonts import
```

### Astro Islands 方針

- ほとんどのコンポーネントは `.astro` で静的レンダリング
- `client:load` が必要なもの:
  - `ThemeToggle.tsx` — クリックイベント
  - `FloatingNav` 内のセクションハイライト — IntersectionObserver
- スクロールアニメーション（fadeIn, slideIn）は CSS `@keyframes` + IntersectionObserver の `<script>` で実装し、React を使わない
- hover エフェクトは CSS `:hover` で実装

### CSS アニメーション

v5 JSX では inline style + React state でホバーを制御しているが、Astro実装ではCSSに移行:

```css
.work-card img {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.work-card:hover img {
  transform: scale(1.04);
}

/* IntersectionObserver で .visible クラスを付与 */
.fade-in {
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

---

## 6. 詳細ページ (`/[slug]/`)

### 設計方針

新デザインのテーマ（カラーパレット、タイポグラフィ、ダーク/ライト対応）を適用しつつ、
MDXの記述体験をシンプルに保つ。

### ページレイアウト

```
┌─────────────────────────────────────┐
│  ← トップへ戻る                       │
├─────────────────────────────────────┤
│  [カバー画像]（幅いっぱい or 中央配置）    │
│                                     │
│  タイトル (h1)                        │
│  タグ一覧    日付                     │
│  60ページ / ¥1,000                   │  ← price, pages（あれば表示）
├─────────────────────────────────────┤
│  [購入CTAバー]                       │  ← PurchaseBar (purchase[] から生成)
│   Kindle ↗   メロンブックス ↗          │
├─────────────────────────────────────┤
│  MDX本文 (prose スタイリング)           │
│  ├── テキスト                        │
│  ├── 画像                           │
│  ├── Gallery (サンプルページ)          │
│  └── 埋め込み (iframely, tweet)      │
├─────────────────────────────────────┤
│  [関連作品]                           │  ← RelatedWorks (同カテゴリから2-3件)
│   カード  カード  カード               │
├─────────────────────────────────────┤
│  ← トップへ戻る                       │
└─────────────────────────────────────┘
```

ヘッダー部分にカバー画像を大きく表示し、その下にタイトル・メタ情報を配置する。
トップページと同様のフローティングナビは不要。代わりにシンプルな戻るリンクを上下に置く。

### PurchaseBar コンポーネント

フロントマターの `purchase` 配列から購入リンクを横並びのボタンとして生成する。
`availability` が `"soldout"` の場合はボタンを無効化、`"upcoming"` の場合は「準備中」と表示。
`purchase` が未定義のエントリ（Writing カテゴリなど）ではレンダリングしない。

```astro
---
import type { CollectionEntry } from "astro:content"
type Props = {
  purchase?: CollectionEntry<"portfolio">["data"]["purchase"]
  availability?: CollectionEntry<"portfolio">["data"]["availability"]
}
const { purchase, availability } = Astro.props
---

{purchase && purchase.length > 0 && (
  <div class="purchase-bar">
    {purchase.map(link => (
      <a
        href={availability === "soldout" ? undefined : link.url}
        target="_blank"
        rel="noopener noreferrer"
        class:list={["purchase-link", { disabled: availability === "soldout" }]}
      >
        {link.label}
        <span class="arrow">↗</span>
      </a>
    ))}
    {availability === "upcoming" && (
      <span class="status-note">準備中</span>
    )}
  </div>
)}
```

### RelatedWorks コンポーネント

同じ `category` を持つエントリから現在のエントリを除外し、日付降順で2〜3件を表示する。
WorkCard と同じ見た目だが、より小さいサイズで横並びにする。

```astro
---
import { getCollection } from "astro:content"
import WorkCardSmall from "../cards/WorkCardSmall.astro"

type Props = {
  currentId: string
  category: string
}
const { currentId, category } = Astro.props

const allWorks = await getCollection("portfolio", ({ data }) =>
  !data.draft && data.category === category
)
const related = allWorks
  .filter(w => w.id !== currentId)
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3)
---

{related.length > 0 && (
  <section class="related-works">
    <h2>他の作品</h2>
    <div class="related-grid">
      {related.map(work => (
        <WorkCardSmall work={work} />
      ))}
    </div>
  </section>
)}
```

### prose スタイリング

Tailwind Typography (`@tailwindcss/typography`) でベースを作り、
テーマの CSS Custom Properties でカラーを上書きする。

```css
/* global.css */
[data-theme="dark"] .prose {
  --tw-prose-body: #B0B0B0;         /* text-body */
  --tw-prose-headings: #E8E8E8;     /* text-primary */
  --tw-prose-links: #4ECDC4;        /* accent-teal */
  --tw-prose-bold: #E8E8E8;
  --tw-prose-counters: #8A8A8A;
  --tw-prose-bullets: #6B6B6B;
  --tw-prose-hr: #2A2A2A;
  --tw-prose-quotes: #8A8A8A;
  --tw-prose-quote-borders: #2A2A2A;
  --tw-prose-code: #E8E8E8;
  --tw-prose-pre-bg: #141414;
}

[data-theme="light"] .prose {
  --tw-prose-body: #3D3D3D;
  --tw-prose-headings: #1A1A1A;
  --tw-prose-links: #1E7A72;
  --tw-prose-bold: #1A1A1A;
  --tw-prose-counters: #6E6E6E;
  --tw-prose-bullets: #8F8F8F;
  --tw-prose-hr: #E0DED8;
  --tw-prose-quotes: #6E6E6E;
  --tw-prose-quote-borders: #E0DED8;
  --tw-prose-code: #1A1A1A;
  --tw-prose-pre-bg: #F5F4F0;
}
```

### Gallery コンポーネント（SampleSlide 置き換え）

現行の `SampleSlide.astro` は `html-rewriter-wasm` でスロット内の `<figure>` を
DaisyUI カルーセルアイテムに変換している。以下の問題がある:

- `html-rewriter-wasm` と `daisyui` の2つの依存が必要
- MDX執筆者が3階層の相対パスで import する必要がある
- HTMLの構造変換をランタイムで行う脆さ

代替として CSS scroll-snap ベースの `Gallery.astro` を作成する。

設計方針:
- 依存パッケージ: なし（CSS scroll-snap + 最小限のインライン `<script>`）
- MDX側の記法は既存と同じスロットパターンを維持
- モバイル: 横スワイプで1枚ずつ閲覧。画面幅いっぱいに表示
- デスクトップ: 横スクロール or 矢印キーで1枚ずつ。最大幅を制限

#### MDX での使い方

```mdx
import Gallery from "@/components/mdx/Gallery.astro"

<Gallery>

![cover](./c106-cover.png)

![sample01](./c106-sample1.jpg)

![sample02](./c106-sample2.jpg)

</Gallery>
```

import パスは `@/` エイリアス（tsconfig.json の paths で `src/*` に解決）を使い、
相対パス3階層を解消する。既存の MDX ファイルで `../../../components/` と書いている箇所を一括置換できる。

#### Gallery.astro 実装方針

```astro
---
// props なし。スロットで子要素を受け取る
---

<div class="gallery" role="region" aria-label="サンプルページ" tabindex="0">
  <div class="gallery-track">
    <slot />
  </div>
  <div class="gallery-indicator" aria-hidden="true"></div>
</div>

<style>
  .gallery {
    position: relative;
    margin: 2rem calc(-1 * var(--content-padding, 0px));
    /* コンテンツ領域の外まで広げてモバイルで幅いっぱいに */
  }

  .gallery-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    gap: 0;
  }
  .gallery-track::-webkit-scrollbar { display: none; }

  /* スロット内の各 figure を1枚分の幅にする */
  .gallery-track > :global(*) {
    flex: 0 0 100%;
    scroll-snap-align: start;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--surface);
  }

  .gallery-track > :global(*) :global(img) {
    max-height: 70vh;
    width: auto;
    max-width: 100%;
    object-fit: contain;
  }

  .gallery-indicator {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 12px 0;
  }
  .gallery-indicator :global(.dot) {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-subtle);
    transition: background 0.2s;
  }
  .gallery-indicator :global(.dot.active) {
    background: var(--text-primary);
  }
</style>

<script>
  // ページインジケーターの生成とスクロール追従
  document.querySelectorAll('.gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track')
    const indicator = gallery.querySelector('.gallery-indicator')
    const items = track.children
    if (items.length <= 1) return

    // ドットを生成
    for (let i = 0; i < items.length; i++) {
      const dot = document.createElement('span')
      dot.className = i === 0 ? 'dot active' : 'dot'
      indicator.appendChild(dot)
    }
    const dots = indicator.querySelectorAll('.dot')

    // スクロール位置からアクティブなドットを更新
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Array.from(items).indexOf(entry.target)
            dots.forEach((d, i) => d.classList.toggle('active', i === idx))
          }
        })
      },
      { root: track, threshold: 0.5 }
    )
    Array.from(items).forEach(item => observer.observe(item))
  })
</script>
```

ポイント:
- `scroll-snap-type: x mandatory` でスワイプ時に1枚ずつスナップ
- `:global(*)` セレクタでスロット内のどんな要素（`<figure>`, `<p>`, `<div>`）でも対応
- `max-height: 70vh` で縦長のサンプルページが画面を占有しすぎないよう制限
- インジケーターは IntersectionObserver で追従。軽量でスクロール方向に依存しない
- `margin` のネガティブ値でモバイル時にコンテンツ領域を突き抜けて画面幅いっぱいに表示

#### モバイルとデスクトップの違い

モバイル (≤640px):
- ギャラリーが画面幅いっぱいに広がる（ネガティブマージン）
- 横スワイプで自然に操作可能
- 1枚あたり画面幅 100%
- インジケータードットで現在位置を表示

デスクトップ (641px+):
- ギャラリーの最大幅をコンテンツ幅（prose幅）に制限
- ホバーで左右に半透明の矢印ボタンを表示（任意、CSSのみで実装可能）
- キーボード矢印キーでも移動可能（`tabindex="0"` + scroll-snap が対応）

#### mdxpicture コンポーネントの扱い

現行の `mdxpicture.astro` は MDX 内の `img` タグを `<Picture>` に変換している。
Gallery 内でも同様に動作するため、`[slug].astro` の `Content` レンダリング時に引き続き
`components={{ img: Mdxpicture }}` を渡す。

### 外部埋め込み (iframely, Twitter) の扱い

現行の MDX ではページ末尾に `<script>` で iframely と Twitter widgets を読み込んでいる。
新デザインでもこのパターンを維持するが、`[slug].astro` のレイアウト側に移動して
MDX 本文から `<script>` タグを除去することを推奨する。

```astro
<!-- [slug].astro の末尾 -->
<script async src="https://cdn.iframe.ly/embed.js" is:inline></script>
<script async src="https://platform.twitter.com/widgets.js" is:inline></script>
```

### tsconfig.json パスエイリアス

MDX の import を簡素化するため `@/` エイリアスを追加する。

```json
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strictNullChecks": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

これにより MDX での import が以下のように変わる:

```diff
- import SampleSlide from "../../../components/mdx/SampleSlide.astro"
+ import Gallery from "@/components/mdx/Gallery.astro"
```

### 既存 MDX の移行チェックリスト

各 MDX ファイルに対して:

1. `import SampleSlide` → `import Gallery from "@/components/mdx/Gallery.astro"` に置換
2. `<SampleSlide>` → `<Gallery>` に置換
3. `</SampleSlide>` → `</Gallery>` に置換
4. ページ末尾の `<script>` タグを削除（レイアウト側に移動済みなら）
5. フロントマターに `category` フィールドを追加
6. 同人誌エントリには `purchase`, `price`, `pages`, `availability` を追加
7. MDX 本文中の購入リンク案内は残してもよいが、PurchaseBar と重複する記述は整理を推奨

1〜3 はプロジェクト全体で機械的に一括置換可能。
6 は各エントリで Kindle/メロンブックスのURLを確認して記入する必要がある。

### JSON-LD 構造化データ

`[slug].astro` のレイアウトで、フロントマターから JSON-LD を自動生成して `<head>` に挿入する。
Google検索でのリッチリザルト表示（タイトル・著者・画像）に効く可能性がある。

同人誌 (`category: "doujin"`):

```json
{
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "ロードバイクお買い物論",
  "author": { "@type": "Person", "name": "Gen" },
  "datePublished": "2025-08-14",
  "image": "https://www.gensobunya.net/...",
  "numberOfPages": 60,
  "offers": {
    "@type": "Offer",
    "price": "1000",
    "priceCurrency": "JPY",
    "availability": "https://schema.org/InStock"
  }
}
```

ライター記事 (`category: "writing"`):

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Person", "name": "Gen" },
  "datePublished": "...",
  "publisher": { "@type": "Organization", "name": "東方我楽多叢誌" }
}
```

`Layout.astro` にオプショナルな `jsonLd` prop を追加し、
`[slug].astro` 側でカテゴリに応じたオブジェクトを組み立てて渡す。
実装の優先度は低い（Phase 6 の仕上げで対応）。

### 404 ページ

`src/pages/404.astro` を新デザインのテーマで作成する。

```astro
---
import Layout from "../layouts/Layout.astro"
---

<Layout title="ページが見つかりません — Gen's Portfolio">
  <div class="not-found">
    <h1>404</h1>
    <p>お探しのページは見つかりませんでした。</p>
    <a href="/">← トップページへ</a>
  </div>
</Layout>
```

旧URLからのリダイレクト漏れで着地する可能性があるため、
`public/_redirects` の既存ルールが正しく機能しているかデプロイ後に確認する。

---

## 7. レスポンシブ

ブレークポイント:

```
≤640px   モバイル   Works 2列, About/Links 1列, padding 20px
641-960  タブレット  Works 3列, About/Links 2列, padding 48px
961+     デスクトップ  最大幅960px中央寄せ
```

---

## 8. Tailwind CSS 設定

DaisyUIを削除し、カスタムテーマに移行。

```javascript
// tailwind.config.cjs
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    container: { center: true },
    extend: {
      fontFamily: {
        display: ["'Noto Sans JP'", "sans-serif"],
        body: ["'Noto Sans JP'", "sans-serif"],
        mono: ["'JetBrains Mono'", "'SF Mono'", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
```

Tailwindユーティリティは主にレイアウト（grid, flex, padding, margin）に使い、
色やテーマ依存のスタイルはCSS Custom Propertiesを直接参照する。

---

## 9. 実装手順

### Phase 1: Astro アップグレード

1. 更改ブランチを作成
2. `.nvmrc` を `22` に更新
3. Astro 4 → 5 アップグレード（セクション1の Step 1 に従う）
   - `npx @astrojs/upgrade` 実行
   - `src/content/config.ts` → `src/content.config.ts` 移動
   - Content Layer API 移行（loader, slug→id, render）
   - `@astrojs/prefetch` 削除
   - `rss.xml.ts` の `get` → `GET` リネーム
   - ビルド確認・コミット
4. Astro 5 → 6 アップグレード（セクション1の Step 2 に従う）
   - `npx @astrojs/upgrade` 実行
   - `legacy.collections` フラグがあれば削除
   - Zod 4 互換確認
   - ビルド確認・コミット

### Phase 2: 基盤整備

1. 不要な依存を削除（daisyui, @splidejs/react-splide, html-rewriter-wasm, astro-seo）
2. `src/styles/global.css` にカラーパレットとテーマ定義を記述
3. `tailwind.config.cjs` を更新（DaisyUI削除）
4. `Layout.astro` を新デザイン用に書き換え（テーマ初期化script含む）

### Phase 3: データ層

1. `src/data/` に静的データファイルを作成
2. Content Collections のスキーマを拡張（category, outlet, externalUrl, highlight, purchase, price, pages, availability）
3. 既存の MDX フロントマターに category フィールドを追加（既存は `"doujin"` をデフォルト）
4. 同人誌エントリに purchase, price, pages, availability を追加
5. Writing 用の MDX エントリを追加（または externalUrl のみのエントリ）

### Phase 4: コンポーネント実装

1. `SectionHeading`, `SkillTag`, `LatestItem`, `AvailabilityBadge` など小さい UI コンポーネントから着手
2. `Hero.astro` — Latest Activity 統合
3. `ProductCard`, `WorkCard`（AvailabilityBadge付き）, `WritingRow`, `LinkItem`
4. 各セクションコンポーネント（About に CONTACT ブロック追加）
5. `FloatingNav` + `ThemeToggle`
6. `Gallery.astro` — SampleSlide の置き換え（CSS scroll-snap）
7. `PurchaseBar.astro` — 詳細ページ用の購入CTAバー
8. `RelatedWorks.astro` — 詳細ページ下部の関連作品

### Phase 5: ページ組み立て

1. `index.astro` で全セクションを組み立て
2. `[slug].astro` の詳細ページレイアウトを新デザインに更新（セクション6に従う）
   - PurchaseBar をタイトル下に配置
   - RelatedWorks をフッター前に配置
3. 既存MDXファイルの一括移行（SampleSlide→Gallery, パスエイリアス化, purchaseフィールド追加）
4. `activities.astro` の一覧ページをリデザイン（任意）
5. `404.astro` の作成

### Phase 6: アニメーション・仕上げ

1. IntersectionObserver による fade-in スクリプトを追加
2. ホバーエフェクトをCSSで実装
3. レスポンシブの検証・調整
4. OGP / meta タグの更新
5. JSON-LD 構造化データの出力（Book / Article スキーマ）
6. Lighthouse アクセシビリティ監査

### Phase 7: デプロイ

1. Cloudflare Pages へのSSGビルド・デプロイ確認
2. `_redirects` の維持・動作確認（404着地パスの確認含む）
3. 本番マージ

---

## 10. 削除対象ファイル

以下は新デザインで不要になるファイル:

```
src/components/Books.astro
src/components/Recent.astro
src/components/Services.astro
src/components/Footer.astro  (空ファイル)
src/components/mdx/SampleSlide.astro  → Gallery.astro に置き換え
src/components/units/BookList.astro
src/components/units/Card.astro
src/components/units/RecentCards.astro
src/components/units/tagBadges.tsx
src/theme.ts
```

維持するファイル:

```
src/components/units/mdx/mdxpicture.astro  → Gallery 内でも img 変換に使用（移動先: src/components/mdx/MdxPicture.astro）
```

---

## 11. 注意事項

- Astro 4→5→6 のアップグレード手順はセクション1に詳述。v5を飛ばしてv6に直接上げることは非推奨。各段階でビルド確認すること
- `public/_redirects` はCloudflare Pages用。Cloudflare Workers の場合はルーティング方法が異なる可能性がある
- Google Fonts の読み込みは `<link rel="preconnect">` + `<link rel="stylesheet">` を Layout.astro の head に配置。`@import` はレンダリングブロッキングのため避ける
- 画像最適化: `astro:assets` の `<Image>` / `<Picture>` を引き続き使用
- Astro 6 は Cloudflare との統合が強化されている（Cloudflare が Astro を買収）。SSGデプロイであれば既存のワークフローに大きな影響はないが、将来的にCloudflare固有機能（KV, D1 等）を使う場合は `@astrojs/cloudflare` アダプターの採用を検討
- v6 の experimental 機能（Rust compiler, route caching 等）は安定するまで有効化しない
