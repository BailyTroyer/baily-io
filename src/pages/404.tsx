import React, { FC } from "react"

import { Layout, SEO } from "../components"

const NotFoundPage: FC = () => (
  <Layout>
    <SEO title="404: Not found" />
    <div className="flex flex-1 items-center justify-center flex-col">
      <h1 className="font-extrabold text-gray-900 text-5xl">404</h1>
      <h2 className="text-center font-light text-2xl my-3">
        That doesn&apos;t exist 🤯
      </h2>
    </div>
  </Layout>
)

export default NotFoundPage
