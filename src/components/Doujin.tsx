import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Grid } from "@material-ui/core"
import PostLineList from "./units/PostLineList"
// import { DoujinPostQuery } from "../../types/graphql-types"

const sportsPost: React.FC = () => {
  const data = useStaticQuery(
    graphql`
      query DoujinPost {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
          filter: { frontmatter: { tags: { eq: "Doujin" } } }
        ) {
          edges {
            node {
              frontmatter {
                date(formatString: "YYYY/MM/DD")
                title
              }
              id
              fields {
                slug
              }
            }
          }
        }
      }
    `
  )

  return (
    <Grid container>
      <PostLineList edges={data.allMarkdownRemark.edges} />
    </Grid>
  )
}

export default sportsPost
