import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import styled from "@emotion/styled"
import { GitHub, Twitter, Instagram } from "@material-ui/icons"
import { Box } from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"

const Bio: React.FC = () => {
  const theme = useTheme()
  const bioQuery = useStaticQuery<GatsbyTypes.bioQuery>(
    graphql`
      query bio {
        file(relativePath: { eq: "icon.png" }) {
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED)
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

  const BioBox = styled(Box)`
    text-align: center;
  `
  const socialIconColor: string = theme.palette.secondary.main

  return (
    <BioBox>
      <Box>
        <StaticImage
          src="../../images/icon.png"
          alt="avatar"
          placeholder="blurred"
          imgStyle={{
            borderRadius: "100%",
            maxWidth: "15vw",
            margin: "auto",
            objectPosition: "center center"
          }}
        />
      </Box>
      <a
        href={`https://github.com/${bioQuery?.site?.siteMetadata?.social?.github}`}
      >
        <GitHub
          fontSize="large"
          style={{ color: socialIconColor }}
          alignmentBaseline="central"
        />
      </a>
      <a
        href={`https://twitter.com/${bioQuery?.site?.siteMetadata?.social?.twitter}`}
      >
        <Twitter
          fontSize="large"
          style={{ color: socialIconColor }}
          alignmentBaseline="central"
        />
      </a>
      <a
        href={`https://instagram.com/${bioQuery?.site?.siteMetadata?.social?.instagram}`}
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
