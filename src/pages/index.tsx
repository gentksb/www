import React from "react"

import Page from "../components/Page"
import Container from "../components/Container"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Achivements from "../components/Achivements"

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>Hi people</h1>
        <h2>Recent posts.</h2>
        <Recents />
        <h2>Douijn top posts.</h2>
        <Doujin />
        <h2>Achivements</h2>
        <Achivements />
      </Container>
    </Page>
  </IndexLayout>
)

export default IndexPage
