import React from "react"
import { Card, CardHeader, CardMedia, CardContent } from "@material-ui/core"
import styled from "@emotion/styled"

interface PageProps {
  color?: string
  linkData: ExternalLinkData[]
}

interface ExternalLinkData {
  name: string
  url: string
  rank: number
}

const PostCard = styled(Card)`
  margin-top: 16px;
  /* max-width: 360px; */
`

const linkBoxRoop = (edges: ExternalLinkData[], color?: string) => {
  return edges.map(linkdatas => (
    <PostCard>
      <a href={linkdatas.url}>
        <CardHeader title={linkdatas.name} />
      </a>
      <CardContent>{color}</CardContent>
    </PostCard>
  ))
}

const LinkBoxList: React.FC<PageProps> = ({ color, linkData }) => (
  <div>{linkBoxRoop(linkData, color)}</div>
)

export default LinkBoxList
