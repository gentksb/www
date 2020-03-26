import React from "react"
import { Box, Typography } from "@material-ui/core"
import styled from "@emotion/styled"
import theme from "../layouts/theme"

const FooterBox = styled(Box)`
  width: 100%;
  height: 10vh;
  text-align: center;
  color: ${theme.palette.text.secondary};
  background-color: ${theme.palette.primary.main};
`
const FooterLink = styled.a`
  color: ${theme.palette.text.secondary};
`

const Footer: React.FC = () => (
  <FooterBox>
    <Typography variant="caption">
      {" "}
      © {new Date().getFullYear()}, Built with
      {` `}
      <FooterLink href="https://www.gatsbyjs.org">Gatsby.js</FooterLink>
      <p>
        This website uses Cookie to ensure you get the best experience on this
        website.
      </p>
    </Typography>
  </FooterBox>
)
export default Footer
