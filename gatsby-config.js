module.exports = {
  siteMetadata: {
    title: "幻想サイクル サークル公式Web",
    description:
      "同人サークル「幻想サイクル」公式WEBサイト兼、代表ゲンのポートフォリオ",
    keywords: "シクロクロス, 自転車同人誌, プログラミング, フロントエンド",
    siteUrl: "https://www.gensobunya.net/",
    image: "/image/logo.jpg",
    author: "gen",
    social: {
      twitter: `gen_sobunya`,
      github: `gentksb`,
      instagram: `gen_sobunya`
    }
  },
  plugins: [
    `gatsby-plugin-gatsby-cloud`,
    "gatsby-plugin-typegen",
    "gatsby-plugin-image",
    "gatsby-plugin-twitter",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/content/portfolio`
      }
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "linkdata",
        path: `${__dirname}/content/data`
      }
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 960
            }
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1rem"
            }
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants"
        ]
      }
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: "GTM-5R7P93N"
      }
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true
        }
      }
    },
    "gatsby-plugin-emotion",
    "gatsby-plugin-robots-txt"
  ]
}
