import * as React from "react"
import Helmet from "react-helmet"
import { StaticQuery, graphql } from "gatsby"
import { Grid } from "@material-ui/core"

import Sidebar from "../components/Sidebar"
import LayoutRoot from "../components/LayoutRoot"
import LayoutMain from "../components/LayoutMain"

interface StaticQueryProps {
  site: {
    siteMetadata: {
      title: string
      description: string
      keywords: string
    }
  }
}

const IndexLayout: React.FC = ({ children }) => (
  <StaticQuery
    query={graphql`
      query IndexLayoutQuery {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `}
    render={(data: StaticQueryProps) => (
      <LayoutRoot>
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
        <Grid container spacing={0}>
          <Grid item sm={4} xs="auto">
            <Sidebar title={data.site.siteMetadata.title} />
          </Grid>
          <Grid item sm={8} xs={12}>
            <LayoutMain>{children}</LayoutMain>
          </Grid>
        </Grid>
      </LayoutRoot>
    )}
  />
)

export default IndexLayout
