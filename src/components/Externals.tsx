import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import LinkBoxList from "./units/LinkBoxList"
import { ExternalLinkQuery } from "../../types/graphql-types"

const externalLinks: React.FC = () => {
  const data: ExternalLinkQuery = useStaticQuery(
    graphql`
      query ExternalLink {
        allDataJson {
          edges {
            node {
              blog {
                name
                url
                rank
              }
              shop {
                name
                url
                rank
              }
            }
          }
        }
      }
    `
  )

  return (
    <div>
      <LinkBoxList
        linkData={data.allDataJson.edges[0].node.blog}
        color="blue"
      />
      <LinkBoxList
        linkData={data.allDataJson.edges[0].node.shop}
        color="skyblue"
      />
    </div>
  )
}

export default externalLinks
