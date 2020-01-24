import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"
import LinkBoxList from "./units/LinkBoxList"

interface StaticQueryProps {
  allDataJson: {
    edges: Edge[]
  }
}

interface Edge {
  node: {
    blog: ExternalLinkData[]
    shop: ExternalLinkData[]
  }
}

interface ExternalLinkData {
  name: string
  url: string
  rank: number
}

const externalLinks: React.FC = () => {
  const data: StaticQueryProps = useStaticQuery(
    graphql`
      query ExternalLinkQuery {
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
