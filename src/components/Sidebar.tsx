import React from "react"
import styled from "@emotion/styled"
import { Link } from "gatsby"
import {
  Grid,
  Typography,
  Hidden,
  Drawer,
  IconButton,
  Box,
  AppBar
} from "@material-ui/core"
import { useTheme } from "@material-ui/core/styles"
import { MenuOpen } from "@material-ui/icons"
import Bio from "./units/Bio"
import Externals from "./Externals"

interface HeaderProps {
  title: string
}

const Sidebar: React.FC<HeaderProps> = ({ title }) => {
  const [drawerState, setDrawerState] = React.useState(false)
  const theme = useTheme()

  const StyledSidebar = styled(AppBar)`
    min-height: 100%;
    background-color: ${theme.palette.primary.main};
    color: white;
    text-decoration: none;
  `

  const SidebarInnerGrid = styled(Grid)`
    align-items: center;
    text-align: center;
  `
  const BioGrid = styled(Grid)`
    margin: 8px auto auto auto;
  `

  const TitleGrid = styled(Grid)`
    min-height: 5vh;
    margin: 8px;
    width: 100vw;
  `

  const MenuButtonBox = styled(Box)`
    float: left;
    margin-left: 8px;
    position: absolute;
  `

  const HomepageLink = styled(Link)`
    color: white;
    font-size: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    line-height: 100%;
    vertical-align: bottom;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  `
  const DrawerGrid = styled(Grid)`
    height: 100%;
    width: 50vw;
    margin: 0;
    padding: 0;
    background-color: ${theme.palette.primary.main};
    color: white;
    text-decoration: none;
  `
  const DrawerInnerGrid = styled(Grid)`
    margin: 8px auto auto auto;
  `

  const toggleDrawer = () => {
    setDrawerState(!drawerState)
  }

  return (
    <StyledSidebar position="relative" component="header">
      <SidebarInnerGrid container spacing={2}>
        <TitleGrid item sm={12} xs={12}>
          {/* モバイルドロワー部分開始 */}
          <Hidden smUp>
            <MenuButtonBox>
              <IconButton
                edge="start"
                color="inherit"
                style={{ padding: 0 }}
                aria-label="open drawer"
                onClick={toggleDrawer}
              >
                <MenuOpen fontSize="large" />
              </IconButton>
            </MenuButtonBox>
            <Drawer
              anchor="left"
              open={drawerState}
              onClose={toggleDrawer}
              elevation={16}
            >
              <DrawerGrid
                container
                onClick={toggleDrawer}
                onKeyDown={toggleDrawer}
              >
                <DrawerInnerGrid item xs={12}>
                  <Externals />
                </DrawerInnerGrid>
                <DrawerInnerGrid item xs={12}>
                  <Bio />
                </DrawerInnerGrid>
              </DrawerGrid>
            </Drawer>
          </Hidden>
          {/* モバイルドロワーここまで */}
          <Typography variant="h5">
            <HomepageLink to="/">{title}</HomepageLink>
          </Typography>
        </TitleGrid>
        <Hidden xsDown>
          <BioGrid item sm={6} xs={6}>
            <Bio />
          </BioGrid>
          <Grid item sm={12} xs={6}>
            <Externals />
          </Grid>
        </Hidden>
      </SidebarInnerGrid>
    </StyledSidebar>
  )
}

export default Sidebar
