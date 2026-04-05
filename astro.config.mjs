import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import mdx from "@astrojs/mdx"
import sitemap from "@astrojs/sitemap"
import icon from "astro-icon"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://www.gensobunya.net",
  trailingSlash: "always",
  integrations: [react(), mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()]
  }
})
