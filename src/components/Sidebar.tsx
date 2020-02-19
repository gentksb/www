import * as React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import { Grid } from "@material-ui/core"

import Container from "./Container"
import Externals from "./Externals"

const StyledHeader = styled.header`
  height: 100%;
  padding: 0 1rem;
  background-color: red;
  color: white;
`

const HeaderInnerGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const HomepageLink = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;

  &:hover,
  &:focus {
    text-decoration: none;
  }
`

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => (
  <StyledHeader>
    <HeaderInnerGrid container>
      <Grid item xs={12}>
        <HomepageLink to="/">{title}</HomepageLink>
      </Grid>
      <Grid item>
        <Externals />
      </Grid>
    </HeaderInnerGrid>
  </StyledHeader>
)

export default Header
