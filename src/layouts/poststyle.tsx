import React from "react"
import { Global, css } from "@emotion/react"
import { useTheme } from "@material-ui/core/styles"

const PostStyle = () => {
  const theme = useTheme()

  return (
    <Global
      styles={css`
        h2 {
          padding: 0.25em 0 0.25em 0.75em;
          border-left: 6px solid ${theme.palette.primary.main};
          border-bottom: 1px solid ${theme.palette.primary.main};
        }
        h3 {
          padding: 0.25em 0 0.5em 0.75em;
          border-left: 6px solid ${theme.palette.primary.main};
        }
        p {
          margin-bottom: 2em;
          line-height: 1.7;
        }
        /* Quote */
        blockquote {
          position: relative;
          padding: 8px 16px;
          background: #f5f5f5;
          color: #555;
          border-left: 4px solid ${theme.palette.secondary.main};
          width: 90%;
          margin: 16px auto;
        }

        blockquote:before {
          display: inline-block;
          position: absolute;
          top: 16px;
          left: 16px;
          vertical-align: middle;
          /* content: "\f10d";
        font-family: FontAwesome; */
          color: ${theme.palette.secondary.main};
          font-size: 25px;
          line-height: 1;
        }

        blockquote p {
          padding: 0;
          margin: 16px 0 8px;
          font-size: 15px;
          line-height: 1.5;
        }
      `}
    />
  )
}
export default PostStyle
