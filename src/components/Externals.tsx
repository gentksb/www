import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import { Grid } from "@material-ui/core"
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
      <LinkBoxList linkData={tagLinks("blog")} color="blue" />
      <LinkBoxList linkData={tagLinks("shop")} color="skyblue" />
    </Grid>
  )
}

export default externalLinks
