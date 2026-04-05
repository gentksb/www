export type Product = {
  name: string
  tagline: string
  desc: string
  url: string
  cta: string
  stack: string[]
  status: "Active" | "Beta"
}

export type RetiredProduct = {
  name: string
  period: string
}

export const PRODUCTS: Product[] = [
  {
    name: "AJOCC Toys",
    tagline: "シクロクロスレース情報を拡張するChrome Extension",
    desc: "AJOCCのレース結果ページに便利な機能を追加するChrome拡張機能。レース結果の閲覧体験を向上させます。",
    url: "https://chromewebstore.google.com/detail/ajocctoys/amaehgcenbhjoacemfgiljkfmjlglabi",
    cta: "Chrome Web Store",
    stack: ["Chrome Extension", "JavaScript"],
    status: "Active",
  },
]

export const RETIRED_PRODUCTS: RetiredProduct[] = [
  {
    name: "AJOCCランクカードジェネレーター",
    period: "2019–2024",
  },
]
