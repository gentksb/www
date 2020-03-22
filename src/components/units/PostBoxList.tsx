import React from "react"
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core"
import styled from "@emotion/styled"
import { RecentPostQuery } from "../../../types/graphql-types"
// 同じデータ型だけど、名前が分かれてしまっているのでRecentPostQueryを代表で利用
interface PageProps {
  color?: string
  edges: RecentPostQuery["allMarkdownRemark"]["edges"]
}

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const postRoop = (edges: PageProps["edges"], color?: PageProps["color"]) => {
  return edges.map(edge => {
    const postTitle: string =
      edge.node.frontmatter?.title != null
        ? edge.node.frontmatter.title
        : "No POST!"
    const postCoverSrc: string =
      edge.node.frontmatter?.cover?.childImageSharp?.fluid?.src != null
        ? edge.node.frontmatter.cover.childImageSharp.fluid.src
        : "dummy.jpg"

    return (
      <Grid item xs={12} sm={6} key={edge.node.id}>
        <PostCard>
          <CardHeader title={postTitle} />
          <CardMedia src={postCoverSrc} />
          <CardContent>{color}</CardContent>
        </PostCard>
      </Grid>
    )
  })
}

const PostList: React.FC<PageProps> = ({ color, edges }) => (
  <>{postRoop(edges, color)}</>
)

export default PostList
