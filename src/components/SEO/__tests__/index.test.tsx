import React from "react"

import * as Gatsby from "gatsby"
import renderer from "react-test-renderer"

import SEO from "../SEO"

const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery")
useStaticQuery.mockImplementation(() => ({
  site: {
    siteMetadata: {
      title: "TITLE",
      description: "DESCRIPTION",
    },
  },
}))

it("renders correctly", () => {
  const tree = renderer.create(<SEO title="TITLE" />).toJSON()
  expect(tree).toMatchSnapshot()
})
