import rss, { pagesGlobToRssItems } from "@astrojs/rss"

export async function get() {
  return rss({
    items: await pagesGlobToRssItems(
      import.meta.glob("./content/**/*.{md,mdx}")
    )
  })
}
