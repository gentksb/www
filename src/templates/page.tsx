import React from "react"
import { graphql, PageProps } from "gatsby"
import { getSrc } from "gatsby-plugin-image"
import IndexLayout from "../layouts"
import PostStyle from "../layouts/poststyle"
import SEO from "../components/units/Seo"

const PageTemplate: React.FunctionComponent<
  PageProps<GatsbyTypes.PageTemplateQuery>
> = (props) => {
  const { data, location } = props
  const title = data.markdownRemark?.frontmatter?.title ?? "no title"
  const seoImage =
    data.markdownRemark?.frontmatter?.cover?.childImageSharp?.gatsbyImageData !=
    undefined
      ? getSrc(
          data.markdownRemark.frontmatter.cover.childImageSharp?.gatsbyImageData
        )
      : "/image/dummy.jpg"

  return (
    <IndexLayout>
      <SEO
        title={title}
        description={data.markdownRemark?.excerpt}
        image={seoImage}
        location={location}
        datePublished={data.markdownRemark?.frontmatter?.date}
      />
      <PostStyle />
      <h1>{data.markdownRemark?.frontmatter?.title}</h1>
      <div
        /* eslint-disable-next-line react/no-danger */
        dangerouslySetInnerHTML={{
          __html: data.markdownRemark?.html ?? "no data"
        }}
      />
    </IndexLayout>
  )
}

export default PageTemplate

export const query = graphql`
  query PageTemplate($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
      frontmatter {
        title
        date
        cover {
          childImageSharp {
            gatsbyImageData(
              quality: 40
              width: 1200
              formats: [AUTO]
              breakpoints: 1200
            )
          }
        }
      }
    }
  }
`
