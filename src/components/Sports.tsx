import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"

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
            }
          }
        }
      }
    `
  )

  const postList = data.allMarkdownRemark.edges.map(edge => (
    <div key={edge.node.id}>{edge.node.frontmatter.title}</div>
  ))
  //ここは共通化する

  return <div>{postList}</div>
}

export default sportsPost
