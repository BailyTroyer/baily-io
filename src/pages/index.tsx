import React, { FC } from "react"

import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

import { SEO, Layout } from "../components"

const IndexPage: FC = () => {
  const data = useStaticQuery(graphql`
    query {
      placeholderImage: file(relativePath: { eq: "memoji.png" }) {
        childImageSharp {
          fluid(maxWidth: 300) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <Layout>
      <SEO title="Home" />
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 border-b border-gray-200 border-solid">
        <div className="max-w-screen-lg mx-auto">
          <div className="flex flex-col justify-center items-center py-12">
            <div className="min-w-full">
              <Img fluid={data.placeholderImage.childImageSharp.fluid} />
            </div>
            <h1 className="font-extrabold text-3xl text-gray-900 pt-5">
              Hey, I&apos;m Baily
            </h1>
            <h3 className="pt-1 text-gray-900">Sometimes I build things</h3>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
