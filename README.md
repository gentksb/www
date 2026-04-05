# README

This is repository for gensobunya's portfolio website w/o blog.

[Go to website](https://www.gensobunya.net)

## Build & Deploy Pipeline

GitOps by Cloudflare Pages.

---

## コンテンツ管理

### ディレクトリ構成

記事・作品データは `src/content/portfolio/` 以下にエントリごとのディレクトリで管理します。

```
src/content/portfolio/
  c106/
    index.mdx        ← 本文（MDX）
    c106-cover.png   ← カバー画像
    c106-sample1.jpg ← 本文で参照する画像
  c103/
    index.mdx
    ...
```

ファイル名は `index.md` または `index.mdx` を使います。
MDXは `import` や JSX コンポーネントを使いたい場合に選択します（例: `<Gallery>`）。

---

### Frontmatter リファレンス

各エントリの先頭に YAML フロントマターを記述します。

```yaml
---
title: "C106: ロードバイクお買い物論" # 必須: 記事タイトル
date: 2025-08-14 # 必須: 公開日 (YYYY-MM-DD)
draft: false # 必須: true にするとビルドから除外
tags: ["comicmarket", "C106", "Doujin", "New"] # 必須: タグ配列
cover: "./c106-cover.png" # 任意: カバー画像（相対パス）

# ── カテゴリ ──────────────────────────────────────
category:
  "doujin" # 任意: "doujin" | "writing" | "achievement" | "product"
  # Publications セクションへの表示は category: "doujin" が必須

# ── 同人誌向けフィールド ───────────────────────────
price: 1000 # 任意: 頒布価格（円）
pages: 60 # 任意: ページ数
availability: "available" # 任意: "available" | "soldout" | "upcoming"
purchase: # 任意: 購入リンク（PurchaseBar で表示）
  - label: "Kindle"
    url: "https://amzn.to/xxxxx"
  - label: "メロンブックス"
    url: "https://www.melonbooks.co.jp/..."

# ── ライター活動向けフィールド ─────────────────────
outlet: "東方我楽多叢誌" # 任意: 掲載媒体名（Writing セクションで使用予定）
externalUrl: "https://..." # 任意: 外部記事へのリンク
highlight: true # 任意: true で AWARD バッジを表示
---
```

#### `availability` の挙動

| 値             | 表示                                                                            |
| -------------- | ------------------------------------------------------------------------------- |
| `available`    | `purchase` の内容に応じて "Kindle" / "委託中" などを表示                        |
| `soldout`      | "頒布終了" と表示。購入ボタンは無効化                                           |
| `upcoming`     | "準備中" と表示                                                                 |
| `digital-only` | "電子版のみ" と表示。購入ボタンは有効のまま（物理版頒布終了・電子版は販売継続） |
| 未設定         | ラベルなし                                                                      |

#### `tags` の凡例

| タグ          | 用途                                                                |
| ------------- | ------------------------------------------------------------------- |
| `New`         | **重要**: トップページの Latest Activity に表示するエントリに付ける |
| `Doujin`      | 同人誌エントリ                                                      |
| `comicmarket` | コミックマーケット頒布作品                                          |
| `Writing`     | ライター活動                                                        |

---

### 新規エントリの追加手順

#### 1. ディレクトリを作成する

```bash
mkdir src/content/portfolio/c107
```

#### 2. カバー画像を配置する

`src/content/portfolio/c107/` に画像ファイルをコピーします。
Astro の画像最適化が自動で適用されます。

#### 3. `index.mdx` を作成する

```mdx
---
title: "C107: タイトル"
date: 2026-08-01
draft: false
tags: ["comicmarket", "C107", "Doujin", "New"]
cover: "./c107-cover.png"
category: "doujin"
price: 1000
pages: 60
availability: "available"
purchase:
  - label: "Kindle"
    url: "https://amzn.to/..."
---

import Gallery from "@/components/mdx/Gallery.astro"

本文をここに書きます。

<Gallery>

![表紙](./c107-cover.png)

![サンプル1](./c107-sample1.jpg)

</Gallery>
```

#### 4. ビルド確認

```bash
npm run build
```

エラーがなければ `dist/` に静的ファイルが生成されます。

---

### `<Gallery>` コンポーネント

MDX 内でサンプルページなどをスライドショー表示するコンポーネントです。
CSS scroll-snap ベースで、依存パッケージなしで動作します。

```mdx
import Gallery from "@/components/mdx/Gallery.astro"

<Gallery>

![キャプション](./sample1.jpg)

![キャプション](./sample2.jpg)

</Gallery>
```

- 各画像をスロットの直接子要素として並べるだけで使えます
- モバイルでは横スワイプ、デスクトップではスクロールで操作します
- 2枚以上の場合、下部にページインジケーター（ドット）が表示されます

---

### テーマ・デザイン

カラーパレットは `src/styles/global.css` の CSS Custom Properties で管理しています。
`:root` がダーク、`[data-theme="light"]` がライトです。
ユーザーの `prefers-color-scheme` を初期値とし、右上のボタンで手動切り替えできます。
