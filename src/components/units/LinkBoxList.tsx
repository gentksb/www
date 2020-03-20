import React from "react"
import { Grid } from "@material-ui/core"
import { OpenInNew } from "@material-ui/icons"
import styled from "@emotion/styled"
import { ExternalLinkQuery } from "../../../types/graphql-types"
import theme from "../../layouts/theme"

interface PageProps {
  color?: string
  linkData: ExternalLinkQuery["allDataJson"]["edges"]
}

const ExternalLinkText = styled.a`
  margin-top: ${theme.spacing(2)};
  color: ${theme.palette.text.secondary};
`

const linkBoxRoop = (edges: PageProps["linkData"]) => {
  return edges?.map(linkdata => (
    <Grid item xs={12} key={linkdata.node.id}>
      <ExternalLinkText
        href={linkdata.node.url != null ? linkdata.node.url : "/"}
      >
        {linkdata.node.name}
        <OpenInNew color="inherit" fontSize="small" />
      </ExternalLinkText>
    </Grid>
  ))
}

const LinkBoxList: React.FC<PageProps> = ({ linkData }) => (
  <>{linkBoxRoop(linkData)}</>
)

export default LinkBoxList
