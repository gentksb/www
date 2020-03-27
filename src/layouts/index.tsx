import React from "react"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"
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

const RootContainer = styled(Container)`
  background-color: ${theme.palette.background.paper};
  width: 100vw;
`

const TopGrid = styled(Grid)`
  height: 100vh;
`

const IndexLayout: React.FC = ({ children }) => (
  <StaticQuery
    query={graphql`
      query IndexLayout {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={(data: StaticQueryProps) => (
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
          <script type="text/javascript" src="https://cdn.iframe.ly/embed.js" />
        </Helmet>
        <CssBaseline>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <RootContainer disableGutters fixed>
                <TopGrid container>
                  <Grid item sm={4} xs="auto">
                    <Sidebar title={data.site.siteMetadata.title} />
                  </Grid>
                  <Grid item sm={8} xs={12}>
                    {children}
                  </Grid>
                  <Grid item sm={12} xs={12}>
                    <Footer />
                  </Grid>
                </TopGrid>
              </RootContainer>
            </ThemeProvider>
          </StylesProvider>
        </CssBaseline>
      </>
    )}
  />
)

export default IndexLayout
