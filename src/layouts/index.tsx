import React, { useEffect } from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { Grid, Container, CssBaseline } from "@material-ui/core"
import {
  ThemeProvider,
  StylesProvider,
  useTheme
} from "@material-ui/core/styles"
import styled from "@emotion/styled"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import theme from "./theme"

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iframely: any
  }
}

const IndexLayout: React.FunctionComponent = ({ children }) => {
  useEffect(() => {
    if (window.iframely) {
      window.iframely.load()
    }
  })

  const data: GatsbyTypes.IndexLayoutQuery =
    useStaticQuery<GatsbyTypes.IndexLayoutQuery>(
      graphql`
        query IndexLayout {
          site {
            siteMetadata {
              title
              description
            }
          }
        }
      `
    )

  const sitemetadata = data?.site?.siteMetadata

  const blogTheme = useTheme()

  const RootContainer = styled(Container)`
    background-color: ${blogTheme.palette.background.paper};
    width: 100vw;
  `

  const MainGrid = styled(Grid)`
    background-color: ${blogTheme.palette.grey[100]};
    min-height: 100vh;
  `

  return (
    <>
      <Helmet
        title={sitemetadata?.title}
        meta={[
          {
            name: "description",
            content: sitemetadata?.description
          }
        ]}
      >
        <script
          async
          defer
          type="text/javascript"
          src="https://cdn.iframe.ly/embed.js"
        />
      </Helmet>
      <CssBaseline>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RootContainer disableGutters fixed>
              <Grid container>
                <Grid item sm={4} xs={12}>
                  <Sidebar title={sitemetadata?.title ?? "幻想サイクル"} />
                </Grid>
                <MainGrid item sm={8} xs={12}>
                  <Container>{children ?? "no data"}</Container>
                </MainGrid>
                <Grid item sm={12} xs={12}>
                  <Footer />
                </Grid>
              </Grid>
            </RootContainer>
          </ThemeProvider>
        </StylesProvider>
      </CssBaseline>
    </>
  )
}

export default IndexLayout
