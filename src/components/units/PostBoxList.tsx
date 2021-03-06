import React from "react"
import { Card, CardHeader, Grid } from "@material-ui/core"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import { useTheme } from "@material-ui/core/styles"
// import { RecentPostQuery } from "../../../types/graphql-types"

// 同じデータ型だけど、名前が分かれてしまっているのでRecentPostQueryを代表で利用
interface PageProps {
  edges: any
  // edges: RecentPostQuery["allMarkdownRemark"]["edges"]
}

const postRoop = (edges: PageProps["edges"]) => {
  const theme = useTheme()

  const PostCard = styled(Card)`
    margin-top: 16px;
    height: 80%;
    background-color: ${theme.palette.common.white};
  `
  const BoxLink = styled(Link)`
    text-decoration: none;
  `

  return edges.map((edge: any) => {
    const postTitle: string =
      edge.node.frontmatter?.title != null
        ? edge.node.frontmatter.title
        : "No POST!"

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
                color: "textSecondary"
              }}
              subheader={postDate}
            />
          </BoxLink>
        </PostCard>
      </Grid>
    )
  })
}

const PostList: React.FC<PageProps> = ({ edges }) => <>{postRoop(edges)}</>

export default PostList
