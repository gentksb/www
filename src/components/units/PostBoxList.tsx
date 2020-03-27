import React from "react"
import { Card, CardHeader, CardMedia, Grid } from "@material-ui/core"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import { RecentPostQuery } from "../../../types/graphql-types"
import theme from "../../layouts/theme"
// 同じデータ型だけど、名前が分かれてしまっているのでRecentPostQueryを代表で利用
interface PageProps {
  edges: RecentPostQuery["allMarkdownRemark"]["edges"]
}

const PostCard = styled(Card)`
  margin-top: 16px;
  height: 80%;
`
const BoxLink = styled(Link)`
  text-decoration: none;
`

const postRoop = (edges: PageProps["edges"]) => {
  return edges.map((edge) => {
    const postTitle: string =
      edge.node.frontmatter?.title != null
        ? edge.node.frontmatter.title
        : "No POST!"
    const postCoverSrc: string =
      edge.node.frontmatter?.cover?.childImageSharp?.fluid?.src != null
        ? edge.node.frontmatter.cover.childImageSharp.fluid.src
        : "dummy.jpg"

    const postSlug: string =
      edge.node.fields?.slug != null ? edge.node.fields.slug : "/"

    const postDate: string =
      edge.node.frontmatter?.date != null ? edge.node.frontmatter?.date : ""

    return (
      <Grid item xs={12} sm={6} key={edge.node.id}>
        <PostCard variant="outlined">
          <BoxLink to={postSlug}>
            <CardHeader
              titleTypographyProps={{ variant: "subtitle2" }}
              title={postTitle}
              subheaderTypographyProps={{
                variant: "caption",
                color: "textSecondary",
              }}
              subheader={postDate}
            />
          </BoxLink>
          <CardMedia src={postCoverSrc} />
        </PostCard>
      </Grid>
    )
  })
}

const PostList: React.FC<PageProps> = ({ edges }) => <>{postRoop(edges)}</>

export default PostList
