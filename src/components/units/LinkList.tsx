import React from "react"
import { Grid } from "@material-ui/core"
import { OpenInNew } from "@material-ui/icons"
import styled from "@emotion/styled"
import { useTheme } from "@material-ui/core/styles"

interface PageProps {
  color?: string
  linkData: GatsbyTypes.ExternalLinkQuery["allDataJson"]["edges"]
}

const linkBoxRoop = (edges: PageProps["linkData"]) => {
  const theme = useTheme()

  const ExternalLinkText = styled.a`
    margin-top: ${theme.spacing(2)};
    color: ${theme.palette.secondary.main};
  `

  return edges?.map((linkdata) => (
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
