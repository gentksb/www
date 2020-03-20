import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import { Grid, Typography } from "@material-ui/core"
import LinkBoxList from "./units/LinkBoxList"
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

  return (
    <Grid container>
      <Typography variant="h6" component="h3">
        Links
      </Typography>
      <LinkBoxList linkData={tagLinks("blog")} />
      <LinkBoxList linkData={tagLinks("shop")} />
    </Grid>
  )
}

export default externalLinks
