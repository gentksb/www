import React, { useEffect } from "react"
import Helmet from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { Grid, Container, CssBaseline } from "@material-ui/core"
import { ThemeProvider, StylesProvider } from "@material-ui/styles"
import styled from "@emotion/styled"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import theme from "./theme"

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string
      description: string
      keywords: string
    }
  }
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iframely: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    twitter: any
  }
}

const RootContainer = styled(Container)`
  background-color: ${theme.palette.background.paper};
  width: 100vw;
`

const TopGrid = styled(Grid)``
const MainGrid = styled(Grid)`
  min-height: 100vh;
`

const IndexLayout: React.FC = ({ children }) => {
  useEffect(() => {
    if (window.iframely) {
      window.iframely.load()
    }
    // ツイート内容を埋め込みたい場合
    if (window.twitter) {
      window.twitter.widgets.load()
    }
  })

  const data: StaticQueryProps = useStaticQuery(
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

  return (
    <>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          {
            name: "description",
            content: data.site.siteMetadata.description,
          },
          { name: "keywords", content: data.site.siteMetadata.keywords },
        ]}
      >
        <script
          async
          type="text/javascript"
          src="https://cdn.iframe.ly/embed.js"
        />
        <script async src="https://platform.twitter.com/widgets.js" />
      </Helmet>
      <CssBaseline>
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <RootContainer disableGutters fixed>
              <TopGrid container>
                <Grid item sm={4} xs="auto">
                  <Sidebar title={data.site.siteMetadata.title} />
                </Grid>
                <MainGrid item sm={8} xs={12}>
                  {children}
                </MainGrid>
                <Grid item sm={12} xs={12}>
                  <Footer />
                </Grid>
              </TopGrid>
            </RootContainer>
          </ThemeProvider>
        </StylesProvider>
      </CssBaseline>
    </>
  )
}

export default IndexLayout
