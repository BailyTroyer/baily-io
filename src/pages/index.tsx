import React, { FC } from "react"

import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useStaticQuery, graphql, Link } from "gatsby"
import Img from "gatsby-image"

import { SEO, Layout, FAQ, ArticleLink } from "../components"

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
      {/* Splash */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 border-b border-gray-200 border-solid">
        {/* Hero */}
        <div className="max-w-screen-lg mx-auto">
          {/* Icon/Title/Desc */}
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

      {/* FAQs */}
      <div className="bg-white">
        <div className="max-w-screen-lg mx-auto sm:max-w-2xl my-12 px-6">
          <div className="flex flex-col mb-2">
            <h1 className="font-bold text-3xl mb-2">About me</h1>
            <p className="">
              I&apos;m a software engineer from Buffalo, NY with a passion for
              moving fast and breaking things.
            </p>
          </div>
          <FAQ
            question="How did you make this site?"
            answer="Designed in figma, written in Gatsby/TS and running in Cloudfront"
          />
          <FAQ
            question="Are you on the job market?"
            answer="Designed in figma, written in Gatsby/TS and running in Cloudfront"
          />
          <FAQ
            question="What do you do besides code?"
            answer="Designed in figma, written in Gatsby/TS and running in Cloudfront"
          />
          <FAQ
            question="Favorite food, color, website, app?"
            answer="Designed in figma, written in Gatsby/TS and running in Cloudfront"
          />
          <FAQ
            question="Tell me a joke."
            answer="Designed in figma, written in Gatsby/TS and running in Cloudfront"
          />
        </div>
      </div>

      {/* Blog */}
      <div className="max-w-screen-lg mx-auto sm:max-w-2xl my-12 px-6">
        <div className="flex flex-col mb-2 border-b border-gray-200 border-solid">
          <h1 className="font-bold text-3xl mb-2">Recent Articles</h1>
          <p className="mb-4">
            I find it very theraputic to write things down. From helpful posts
            getting personal tech, to random thoughts that pop in my head before
            bed.
          </p>
        </div>
        <Link to="/">
          <ArticleLink
            tag="dev"
            title="Deploying a Gatsby app on Cloudfront"
            date="Dec 10 2020"
          />
        </Link>
        <Link to="/">
          <ArticleLink
            tag="dev"
            title="Deploying a Gatsby app on Cloudfront"
            date="Dec 10 2020"
          />
        </Link>
        <Link to="/">
          <ArticleLink
            tag="dev"
            title="Deploying a Gatsby app on Cloudfront"
            date="Dec 10 2020"
          />
        </Link>

        <button className="focus:outline-none flex flex-row items-center bg-white border border-gray-300 border-solid py-3 px-6 rounded-lg mt-4">
          <p className="text-gray-900 font-medium text-xl">Read More</p>
          <FontAwesomeIcon icon={faArrowRight} className="ml-2 text-gray-900" />
        </button>
      </div>
    </Layout>
  )
}

export default IndexPage
