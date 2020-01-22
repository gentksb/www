import * as React from "react"
import { Link } from "gatsby"

import Page from "../components/Page"
import Container from "../components/Container"
import IndexLayout from "../layouts"
import Recents from "../components/Recents"
import Doujin from "../components/Doujin"
import Sports from "../components/Sports"

const IndexPage = () => (
  <IndexLayout>
    <Page>
      <Container>
        <h1>Hi people</h1>
        <p>Recent posts.</p>
        <Recents />
        <p>Douijn top posts.</p>
        <Doujin />
        <p>Now go build something great.</p>
        <Link to="/page-2/">Go to page 2</Link>
        <p>hook test</p>
        <Sports />
      </Container>
    </Page>
  </IndexLayout>
)

export default IndexPage
