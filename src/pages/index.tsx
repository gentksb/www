import React from "react"

import Page from "../components/Page"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Achivements from "../components/Achivements"

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <h2>Recent</h2>
      <Recents />
      <h2>Douijn</h2>
      <Doujin />
      <h2>Achivements</h2>
      <Achivements />
    </Page>
  </IndexLayout>
)

export default IndexPage
