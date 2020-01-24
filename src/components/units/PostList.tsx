import React from "react"
import { Card, CardHeader, CardMedia, CardContent } from "@material-ui/core"
import styled from "@emotion/styled"

interface PageProps {
  color?: string
  edges: Edge[]
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

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const postRoop = (edges: Edge[], color?: string) => {
  return edges.map(edge => (
    <PostCard>
      <CardHeader title={edge.node.frontmatter.title} />
      <CardMedia src={edge.node.frontmatter.cover?.childImageSharp.fluid.src} />
      <CardContent>{color}</CardContent>
    </PostCard>
  ))
}

const PostList: React.FC<PageProps> = ({ color, edges }) => (
  <div>{postRoop(edges, color)}</div>
)

export default PostList
