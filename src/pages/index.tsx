import React from "react"
import { Typography, Grid } from "@material-ui/core"
import styled from "@emotion/styled"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Achivements from "../components/Achivements"

const MainContentsGrid = styled(Grid)`
  margin-top: 16px;
  width: 100%;
`

const IndexPage = () => (
  <IndexLayout>
    <Grid container>
      <MainContentsGrid item>
        <Typography variant="h5" component="h2">
          RECENTS
        </Typography>
        <Recents />
      </MainContentsGrid>
      <MainContentsGrid item>
        <Typography variant="h5" component="h2">
          DOUJIN
        </Typography>
        <Doujin />
      </MainContentsGrid>
      <MainContentsGrid item>
        <Typography variant="h5" component="h2">
          ACHEVEMENTS
        </Typography>
        <Achivements />
      </MainContentsGrid>
    </Grid>
  </IndexLayout>
)

export default IndexPage
