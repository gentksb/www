import React from "react"
import { WindowLocation } from "@reach/router"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

interface LocationState {
  title: string
  image?: string
  location: WindowLocation
}

interface MetaObject {
  name: string
  content: any
  property?: undefined
}

interface SeoDefaultProps {
  lang?: string
  meta?: MetaObject[]
  description?: string
  datePublished?: string
}

interface Props extends LocationState, SeoDefaultProps {}

const SEO: React.FunctionComponent<Props> = (props) => {
  const { description, lang, meta, title, image, location, datePublished } =
    props
  const { site } = useStaticQuery<GatsbyTypes.SeoComponentQuery>(
    graphql`
      query SeoComponent {
        site {
          siteMetadata {
            title
            siteUrl
            keywords
            description
            image
            author
            social {
              twitter
            }
          }
        }
      }
    `
  )

  const siteUrl = site?.siteMetadata?.siteUrl
  const currentHost =
    process.env.NODE_ENV === "production" ? siteUrl : location.origin
  const metaDescription = description ?? site?.siteMetadata?.description
  const metaImage = currentHost + (image ?? site?.siteMetadata?.image)
  const canonicalUrl = currentHost + location.pathname
  const metaRobotsContent =
    process.env.NODE_ENV === "production" ? "all" : "none"
  const siteTitle =
    location.key === "initial"
      ? site?.siteMetadata?.title
      : `%s | ${site?.siteMetadata?.title}`
  const jsonLdType = location.key === "initial" ? "Article" : "website"
  const ogType = location.key === "initial" ? "article" : "website"

  const jsonLd = {
    "@context": "http://schema.org",
    "@type": jsonLdType,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    headline: title,
    image: {
      "@type": "ImageObject",
      url: metaImage
    },
    author: {
      "@type": "Person",
      name: site?.siteMetadata?.author,
      url: site?.siteMetadata?.siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "幻想サイクル",
      logo: {
        "@type": "ImageObject",
        url: "https://www.gensobunya.net/image/logo.jpg"
      }
    },
    url: location.href,
    description: metaDescription,
    datePublished
  }

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={siteTitle}
      link={[{ rel: "canonical", href: canonicalUrl }]}
      meta={[
        {
          name: `robots`,
          content: `max-image-preview:large`
        },
        {
          name: "robots",
          content: metaRobotsContent
        },
        {
          name: `description`,
          content: metaDescription
        },
        {
          property: `og:site_name`,
          content: site?.siteMetadata?.title
        },
        {
          property: `og:type`,
          content: ogType
        },
        {
          property: `og:url`,
          content: location.href
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:description`,
          content: metaDescription
        },
        {
          property: `og:image`,
          content: metaImage
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`
        },
        {
          property: `twitter:url`,
          content: location.href
        },

        {
          name: `twitter:title`,
          content: title
        },
        {
          name: `twitter:description`,
          content: metaDescription
        },
        {
          property: `twitter:image`,
          content: metaImage
        },
        {
          name: `twitter:site`,
          content: `@${site?.siteMetadata?.social.twitter}`
        },
        {
          name: `twitter:domain`,
          content: location.host
        }
      ].concat(meta)}
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  description: ``
}

export default SEO
