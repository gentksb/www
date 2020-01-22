import React from "react"
// import styled from "@emotion/styled"
import { graphql, StaticQuery } from "gatsby"

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

const recentPost: React.FC = () => (
  <StaticQuery
    query={graphql`
      query RecentPostQuery {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
          limit: 4
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
    `}
    render={(data: StaticQueryProps) =>
      data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>{node.frontmatter.title}</div>
        //  component
      ))
    }
  />
)

export default recentPost
