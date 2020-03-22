import React from "react"

import { Typography } from "@material-ui/core"
import Page from "../components/Page"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Achivements from "../components/Achivements"

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Typography variant="h5" component="h2">
        RECENTS
      </Typography>
      <Recents />
      <Typography variant="h5" component="h2">
        DOUJIN
      </Typography>
      <Doujin />
      <Typography variant="h5" component="h2">
        ACHEVEMENTS
      </Typography>
      <Achivements />
    </Page>
  </IndexLayout>
)

export default IndexPage
