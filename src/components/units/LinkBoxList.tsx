import React from "react"
import { Card, CardHeader, CardContent, Grid } from "@material-ui/core"
import { OpenInNew } from "@material-ui/icons"
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
    <Grid item xs={12} key={linkdata.node.id}>
      <PostCard>
        <a href={linkdata.node.url != null ? linkdata.node.url : "/"}>
          <CardHeader title={linkdata.node.name} />
          <OpenInNew color="primary" />
        </a>
        <CardContent>{color}</CardContent>
      </PostCard>
    </Grid>
  ))
}

const LinkBoxList: React.FC<PageProps> = ({ color, linkData }) => (
  <>{linkBoxRoop(linkData, color)}</>
)

export default LinkBoxList
