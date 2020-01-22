import * as React from "react"

import Page from "../components/Page"
import Container from "../components/Container"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Sports from "../components/Sports"
import Externals from "../components/Externals"

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>Hi people</h1>
        <h2>Recent posts.</h2>
        <Recents />
        <h2>Douijn top posts.</h2>
        <Doujin />
        <h2>hook test</h2>
        <Sports />
        <h2>JSON Data</h2>
        <Externals />
      </Container>
    </Page>
  </IndexLayout>
)

export default IndexPage
