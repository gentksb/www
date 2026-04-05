export type LinkItem = {
  title: string
  url: string
  desc: string
}

export type LinkGroup = {
  cat: string
  items: LinkItem[]
}

export const LINKS_DATA: LinkGroup[] = [
  {
    cat: "Blog",
    items: [
      {
        title: "幻想サイクルBlog",
        url: "https://blog.gensobunya.net/",
        desc: "シクロクロス・グラベルライド中心の自転車ブログ"
      },
      {
        title: "gensobunya Life Blog",
        url: "https://gensobunya-tech.hatenablog.com/",
        desc: "資産運用・スマートホームなど生活の備忘録"
      }
    ]
  },
  {
    cat: "Technical",
    items: [
      {
        title: "Zenn",
        url: "https://zenn.dev/gen_sobunya",
        desc: "技術記事"
      }
    ]
  },
  {
    cat: "Touhou",
    items: [
      {
        title: "東方我楽多叢誌",
        url: "https://touhougarakuta.com/",
        desc: "東方Project総合ファンサイト（ライター参加中）"
      }
    ]
  },
  {
    cat: "Doujinshi",
    items: [
      {
        title: "Kindle著者ページ",
        url: "https://amzn.to/2Ls8KPj",
        desc: "同人誌のKindle電子版"
      },
      {
        title: "メロンブックス",
        url: "https://www.melonbooks.co.jp/circle/index.php?circle_id=45540",
        desc: "同人誌の委託通販"
      }
    ]
  }
]
