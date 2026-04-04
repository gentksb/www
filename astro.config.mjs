import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import tailwind from "@astrojs/tailwind"
import sitemap from "@astrojs/sitemap"
import icon from "astro-icon"

export default defineConfig({
  site: "https://www.gensobunya.net",
  trailingSlash: "always",
  integrations: [react(), mdx(), tailwind(), sitemap(), icon()]
})
