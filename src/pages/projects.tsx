import React, { FC } from "react"

import { Layout, SEO } from "../components"

const Projects: FC = () => (
  <Layout>
    <SEO title="Contact Me" />
    <div className="flex flex-1 items-center justify-center flex-col">
      <h1 className="font-extrabold text-gray-900 text-5xl">Projects</h1>
      <h2 className="text-center font-light text-2xl my-3">...</h2>
    </div>
  </Layout>
)

export default Projects
