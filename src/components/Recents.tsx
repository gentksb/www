import React from 'react'
// import styled from '@emotion/styled'
import { graphql, StaticQuery } from 'gatsby'

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
      image?: string
    }
    id: string
  }
}

const recentPost: React.FC = () => (
  <StaticQuery
    query={graphql`
      query RecentPostQuery {
        allMarkdownRemark(limit: 4, sort: { fields: frontmatter___date, order: DESC }) {
          edges {
            node {
              frontmatter {
                date(formatString: "YYYY/MM/DD")
                title
                image
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
