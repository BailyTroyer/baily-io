import React, { FC, ReactNode } from "react"

import { useStaticQuery, graphql } from "gatsby"

import { Header, Footer } from "../"

interface Props {
  children: ReactNode
}
const Layout: FC<Props> = (props: Props) => {
  const { children } = props

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const title = data.site.siteMetadata?.title || `Title`

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header siteTitle={title} />
      <div className="flex flex-col flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
