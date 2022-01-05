import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Grid } from "@material-ui/core"
import PostBoxList from "./units/PostBoxList"

const sportsPost: React.FC = () => {
  const data = useStaticQuery<GatsbyTypes.RecentPostQuery>(
    graphql`
      query RecentPost {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
          limit: 4
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
    <Grid container spacing={1}>
      <PostBoxList edges={data.allMarkdownRemark.edges} />
    </Grid>
  )
}

export default sportsPost
