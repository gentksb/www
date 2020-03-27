import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import styled from "@emotion/styled"
import { GitHub, Twitter, Instagram } from "@material-ui/icons"
import { Box } from "@material-ui/core"
import theme from "../../layouts/theme"
// import { IconImageQuery } from "../../../types/graphql-types"
// 型を入れるとundefined可能性でコケるためコメントアウト

const Bio: React.FC = () => {
  const bioQuery = useStaticQuery(
    graphql`
      query bio {
        file(relativePath: { eq: "icon.png" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
        site {
          siteMetadata {
            social {
              github
              instagram
              twitter
            }
          }
        }
      }
    `
  )

  const IconImage = styled(Img)`
    border-radius: 100%;
    max-width: 15vw;
    margin: auto;
  `
  const BioBox = styled(Box)`
    text-align: center;
  `
  const socialIconColor: string = theme.palette.secondary.main

  return (
    <BioBox>
      <IconImage fluid={bioQuery.file.childImageSharp.fluid} />
      <a
        href={`https://github.com/${bioQuery.site.siteMetadata.social.github}`}
      >
        <GitHub
          fontSize="large"
          style={{ color: socialIconColor }}
          alignmentBaseline="central"
        />
      </a>
      <a
        href={`https://twitter.com/${bioQuery.site.siteMetadata.social.twitter}`}
      >
        <Twitter
          fontSize="large"
          style={{ color: socialIconColor }}
          alignmentBaseline="central"
        />
      </a>
      <a
        href={`https://instagram.com/${bioQuery.site.siteMetadata.social.instagram}`}
      >
        <Instagram
          fontSize="large"
          style={{ color: socialIconColor }}
          alignmentBaseline="central"
        />
      </a>
    </BioBox>
  )
}

export default Bio
