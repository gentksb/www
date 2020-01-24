import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import PostList from "./units/PostList"

interface StaticQueryProps {
  allMarkdownRemark: {
    edges: Edge[]
  }
}

interface Edge {
  node: {
    frontmatter: {
      date: string
      title: string
      cover?: {
        childImageSharp: {
          fluid: {
            src: string
          }
        }
      }
    }
    id: string
    fields: {
      slug: string
    }
  }
}

const sportsPost: React.FC = () => {
  const data: StaticQueryProps = useStaticQuery(
    graphql`
      query SportsPostQuery {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
          limit: 4
          filter: { frontmatter: { tags: { eq: "Sports" } } }
        ) {
          edges {
            node {
              frontmatter {
                date(formatString: "YYYY/MM/DD")
                title
                cover {
                  childImageSharp {
                    fluid {
                      src
                    }
                  }
                }
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

  return <PostList edges={data.allMarkdownRemark.edges} color="black" />
}

export default sportsPost
