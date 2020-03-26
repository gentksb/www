import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import { Grid, Typography } from "@material-ui/core"

import Bio from "./units/Bio"
import Externals from "./Externals"
import theme from "../layouts/theme"

const StyledSidebar = styled.header`
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: ${theme.palette.primary.main};
  color: white;
  text-decoration: none;
`

const SidebarInnerGrid = styled(Grid)`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
`
const BioGrid = styled(Grid)`
  margin: 8px auto auto auto;
`

const HomepageLink = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
  }
`

interface HeaderProps {
  title: string
}

const Sidebar: React.FC<HeaderProps> = ({ title }) => (
  <StyledSidebar>
    <SidebarInnerGrid container>
      <Grid item xs={12}>
        <Typography variant="h5" component="span">
          <HomepageLink to="/">{title}</HomepageLink>
        </Typography>
      </Grid>
      <BioGrid item xs={6} spacing={2}>
        <Bio />
      </BioGrid>
      <Grid item xs={12}>
        <Externals />
      </Grid>
    </SidebarInnerGrid>
  </StyledSidebar>
)

export default Sidebar
