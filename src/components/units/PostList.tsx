import React from "react"
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core"
import styled from "@emotion/styled"
import {
  Maybe,
  ImageSharpFluid,
  MarkdownRemark,
  MarkdownRemarkFrontmatter,
  MarkdownRemarkFields,
} from "../../../types/graphql-types"

interface PageProps {
  color?: string
  edges: Edge[]
}

// recentPost, SportsPost, DoujinPostなどのクエリを共通化できれば、何処かから型定義を持ってこれる？
interface Edge {
  node: Pick<MarkdownRemark, "id"> & {
    frontmatter: Maybe<
      Pick<MarkdownRemarkFrontmatter, "date" | "title"> & {
        cover: Maybe<{
          childImageSharp: Maybe<{ fluid: Maybe<Pick<ImageSharpFluid, "src">> }>
        }>
      }
    >
    fields: Maybe<Pick<MarkdownRemarkFields, "slug">>
  }
}

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const postRoop = (edges: Edge[], color?: string) => {
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
