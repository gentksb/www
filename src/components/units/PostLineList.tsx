import React from "react"
import { Grid, List, ListItem, ListItemText } from "@material-ui/core"
import { Link } from "gatsby"
import { RecentPostQuery } from "../../../types/graphql-types"
// 同じデータ型だけど、名前が分かれてしまっているのでRecentPostQueryを代表で利用
interface PageProps {
  edges: RecentPostQuery["allMarkdownRemark"]["edges"]
}

const postRoop = (edges: PageProps["edges"]) => {
  return edges.map(edge => {
    const postTitle: string =
      edge.node.frontmatter?.title != null
        ? edge.node.frontmatter.title
        : "No POST!"
    const postSlug: string =
      edge.node.fields?.slug != null ? edge.node.fields.slug : ""
    return (
      <Grid item xs={12} key={edge.node.id}>
        <Link to={postSlug}>
          <ListItem button>
            <ListItemText primary={postTitle} />
          </ListItem>
        </Link>
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
