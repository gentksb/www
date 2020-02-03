import React from "react"
import { Card, CardHeader, CardContent } from "@material-ui/core"
import styled from "@emotion/styled"
import { ExternalLinkQuery } from "../../../types/graphql-types"

interface PageProps {
  color?: string
  linkData: ExternalLinkQuery["allDataJson"]["edges"]
}

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const linkBoxRoop = (edges: PageProps["linkData"], color?: string) => {
  return edges?.map(linkdata => (
    <PostCard key={linkdata.node.id}>
      <a href={linkdata.node.url != null ? linkdata.node.url : "/"}>
        <CardHeader title={linkdata.node.name} />
      </a>
      <CardContent>{color}</CardContent>
    </PostCard>
  ))
}

const LinkBoxList: React.FC<PageProps> = ({ color, linkData }) => (
  <div>{linkBoxRoop(linkData, color)}</div>
)

export default LinkBoxList
