import React from "react"

import * as Gatsby from "gatsby"
import renderer from "react-test-renderer"

import Layout from "../Layout"

const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery")
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      title: "TITLE",
    },
  },
}))

it("renders correctly", () => {
  const tree = renderer
    .create(
      <Layout>
        <p>child</p>
      </Layout>
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
