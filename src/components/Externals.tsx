import React from "react"
// import styled from "@emotion/styled"
import { graphql, useStaticQuery } from "gatsby"

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

  const blogLinkList: Function = (externalLinkData: StaticQueryProps) => {
    const blogData: ExternalLinkData[] =
      externalLinkData.allDataJson.edges[0].node.blog
    return blogData.map((blogLinkData: ExternalLinkData) => (
      <div>{JSON.stringify(blogLinkData)}</div>
    ))
  }
  const shopLinkList: Function = (externalLinkData: StaticQueryProps) => {
    const shopData: ExternalLinkData[] =
      externalLinkData.allDataJson.edges[0].node.shop
    return shopData.map((blogLinkData: ExternalLinkData) => (
      <div>{JSON.stringify(blogLinkData)}</div>
    ))
  }

  return (
    <div>
      {blogLinkList(data)}
      {shopLinkList(data)}
    </div>
  )
}

export default externalLinks
