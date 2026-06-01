import js from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintPluginAstro from "eslint-plugin-astro"
import eslintConfigPrettier from "eslint-config-prettier"
import globals from "globals"

// ESLint 10 はフラットコンフィグ（eslint.config.js）のみをサポートする。
// 旧 `.eslintrc` から移行し、未インストールだった eslint-plugin-tailwindcss への
// 参照（Tailwind v4 非対応のため）を撤去した。
export default tseslint.config(
  // Lint 対象から除外（旧 .eslintignore 相当）。フラットコンフィグでは設定内で指定する。
  {
    ignores: ["dist/", ".astro/", "node_modules/", "public/"],
  },

  // eslint:recommended 相当
  js.configs.recommended,

  // plugin:@typescript-eslint/recommended 相当（パーサ設定込み）
  ...tseslint.configs.recommended,

  // plugin:astro/recommended 相当（.astro 用パーサ・グローバルを自動設定）
  ...eslintPluginAstro.configs["flat/recommended"],

  // ブラウザ/Node のグローバルを認識させる
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // .astro では Astro が生成する型参照のため triple-slash を許可（旧設定を踏襲）
  {
    files: ["**/*.astro"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },

  // Prettier と競合する整形系ルールを無効化（必ず最後に置く）
  eslintConfigPrettier,
)
