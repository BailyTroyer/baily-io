import React, { FC } from "react"

import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

interface Props {
  tag: string
  title: string
  date: string
}

const ArticleLink: FC<Props> = (props: Props) => {
  const { tag, title, date } = props

  const data = useStaticQuery(graphql`
    query {
      cloudImage: file(relativePath: { eq: "cloud.png" }) {
        childImageSharp {
          fluid(maxWidth: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return (
    <div className="my-6 flex flex-row items-center cursor-pointer">
      <Img
        fluid={data.cloudImage.childImageSharp.fluid}
        className="hidden md:flex rounded-lg object-contain w-20 h-20 mr-4"
      />
      <div>
        <p className="font-bold text-purple-700 text-xs">{tag.toUpperCase()}</p>
        <h2 className="font-extrabold text-gray-900 text-xl">{title}</h2>
        <p className="font-medium text-gray-900 text-xs">{date}</p>
      </div>
    </div>
  )
}

export default ArticleLink
