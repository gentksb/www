import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import { Grid, Typography } from "@material-ui/core"

import Bio from "./units/Bio"
import Externals from "./Externals"

const StyledHeader = styled.header`
  height: 100%;
  padding: 0 1rem;
  background-color: #1e2022;
  color: white;
  text-decoration: none;
`

const HeaderInnerGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const BioGrid = styled(Grid)`
  margin: auto;
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

const Sidebar: React.FC<HeaderProps> = ({ title }) => (
  <StyledHeader>
    <HeaderInnerGrid container>
      <Grid item xs={12}>
        <Typography variant="h5" component="span">
          <HomepageLink to="/">{title}</HomepageLink>
        </Typography>
      </Grid>
      <BioGrid item xs={6}>
        <Bio />
      </BioGrid>
      <Grid item xs={12}>
        <Externals />
      </Grid>
    </HeaderInnerGrid>
  </StyledHeader>
)

export default Sidebar
