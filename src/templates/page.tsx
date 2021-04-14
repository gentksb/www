import React from "react"
import { graphql } from "gatsby"
import IndexLayout from "../layouts"
import PostStyle from "../layouts/poststyle"

interface Props {
  data: GatsbyTypes.PageTemplateQuery
}

const PageTemplate: React.FunctionComponent<Props> = (props) => {
  const { data } = props
  return (
    <IndexLayout>
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
      }
    }
  }
`
