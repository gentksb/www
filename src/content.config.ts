import { z, defineCollection } from "astro:content"
import { glob } from "astro/loaders"

const purchaseLink = z.object({
  label: z.string(),
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
      category: z.enum(["doujin", "writing", "achievement", "product"]).optional(),
      outlet: z.string().optional(),
      externalUrl: z.string().optional(),
      highlight: z.boolean().optional(),
      purchase: z.array(purchaseLink).optional(),
      price: z.number().optional(),
      pages: z.number().optional(),
      availability: z.enum(["available", "soldout", "upcoming", "digital-only"]).optional(),
    }),
})

export const collections = { portfolio: portfolioCollection }
