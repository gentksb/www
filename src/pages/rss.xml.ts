import rss, { pagesGlobToRssItems } from "@astrojs/rss"
import { getCollection } from "astro:content"

export const get = async () => {
  const entries = await getCollection("portfolio")
  return rss({
    title: "Gen's Portfolio(幻想サイクル公式WEBサイト)",
    description:
      "ゲン(@gen_sobunya, gentksb, gensobunya)のポートフォリオサイト兼、同人サークル「幻想サイクル」の公式WEBサイト",
    site: import.meta.env.SITE,
    items: entries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.date,
      link: `/${entry.slug}/`
    }))
  })
}
