import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import { Grid, Typography } from "@material-ui/core"
import styled from "@emotion/styled"
import LinkList from "./units/LinkList"
import { ExternalLinkQuery } from "../../types/graphql-types"

const externalLinks: React.FC = () => {
  const data: ExternalLinkQuery = useStaticQuery(
    graphql`
      query ExternalLink {
        allDataJson {
          edges {
            node {
              id
              name
              rank
              tag
              url
            }
          }
        }
      }
    `
  )

  const tagLinks = (tagString: string) => {
    return data.allDataJson.edges.filter(obj => {
      return obj.node.tag === tagString
    })
  }

  const RootGrid = styled(Grid)`
    text-align: center;
    margin-top: 16px;
  `

  return (
    <RootGrid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="overline">Links</Typography>
      </Grid>
      <LinkList linkData={tagLinks("blog")} />
      <LinkList linkData={tagLinks("shop")} />
    </RootGrid>
  )
}

export default externalLinks
