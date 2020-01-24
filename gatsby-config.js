module.exports = {
  siteMetadata: {
    title: "幻想サイクル Circle site & Portfolio",
    description:
      "同人サイクル「幻想サイクル」公式WEBサイト兼、代表ゲンのポートフォリオ",
    keywords: "シクロクロス, 自転車同人誌, プログラミング, フロントエンド",
    siteUrl: "https://www.gensobunya.net/",
    author: {
      name: "gensobunya",
      url: "https://www.gensobunya.net/",
      email: "gen@gensobunya.net",
    },
    social: {
      twitter: `gen_sobunya`,
      github: `gentksb`,
      instagram: `gen_sobunya`,
    },
  },
  plugins: [
    "gatsby-plugin-lodash",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/content/portfolio`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "linkdata",
        path: `${__dirname}/content/data`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 960,
            },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1rem",
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-canonical-urls",
      options: {
        siteUrl: "https://gatsby-starter-typescript-plus.netlify.com",
      },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "YGTM-5R7P93N",
      },
    },
    "gatsby-plugin-emotion",
    "gatsby-plugin-typescript",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-material-ui",
  ],
}
