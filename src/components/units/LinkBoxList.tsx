import React from "react"
import { Card, CardHeader, CardContent } from "@material-ui/core"
import styled from "@emotion/styled"
import { Maybe, DataJsonBlog } from "../../../types/graphql-types"

interface PageProps {
  color?: string
  linkData: Maybe<Array<Maybe<Pick<DataJsonBlog, "name" | "url" | "rank">>>>
}

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const linkBoxRoop = (edges: PageProps["linkData"], color?: string) => {
  return edges?.map(linkdata => (
    <PostCard>
      <a href={linkdata?.url != null ? linkdata.url : "/"}>
        <CardHeader title={linkdata?.name} />
      </a>
      <CardContent>{color}</CardContent>
    </PostCard>
  ))
}

const LinkBoxList: React.FC<PageProps> = ({ color, linkData }) => (
  <div>{linkBoxRoop(linkData, color)}</div>
)

export default LinkBoxList
