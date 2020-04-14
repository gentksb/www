import React from "react"
import { Grid, List, ListItem, ListItemText } from "@material-ui/core"
import { Link } from "gatsby"
import styled from "@emotion/styled"
import { RecentPostQuery } from "../../../types/graphql-types"
// 同じデータ型だけど、名前が分かれてしまっているのでRecentPostQueryを代表で利用
interface PageProps {
  edges: RecentPostQuery["allMarkdownRemark"]["edges"]
}

const PostLink = styled(Link)`
  text-decoration: none;
`
const TextLinkItem = styled(ListItem)`
  width: 100%;
`

const postRoop = (edges: PageProps["edges"]) => {
  return edges.map((edge) => {
    const postTitle: string =
      edge.node.frontmatter?.title != null
        ? edge.node.frontmatter.title
        : "No POST!"

    const postSlug: string =
      edge.node.fields?.slug != null ? edge.node.fields.slug : ""

    const postDate: string =
      edge.node.frontmatter?.date != null ? edge.node.frontmatter?.date : ""

    return (
      <Grid item xs={12} key={edge.node.id}>
        <PostLink to={postSlug}>
          <TextLinkItem button>
            <ListItemText
              primaryTypographyProps={{ variant: "button" }}
              primary={`${postTitle}(${postDate})`}
            />
          </TextLinkItem>
        </PostLink>
      </Grid>
    )
  })
}

const PostList: React.FC<PageProps> = ({ edges }) => (
  <>
    <List component="nav">{postRoop(edges)}</List>
  </>
)

export default PostList
