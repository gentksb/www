/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    container: {
      center: true
    },
    extend: {}
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("flowbite/plugin")
  ]
}
