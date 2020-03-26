import React from "react"
import styled from "@emotion/styled"

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
  padding: 1rem;
`

interface PageProps {
  className?: string
}

const Page: React.FC<PageProps> = ({ children, className }) => (
  <>
    <StyledPage className={className}>{children}</StyledPage>
  </>
)

export default Page
