import React from "react"

import * as Gatsby from "gatsby"
import renderer from "react-test-renderer"

import ArticleLink from "../ArticleLink"

const useStaticQuery = jest.spyOn(Gatsby, "useStaticQuery")
useStaticQuery.mockImplementation(() => ({
  cloudImage: {
    childImageSharp: {
      fluid: {
        aspectRatio: 0,
        src: "",
        srcSet: "",
        sizes: "",
      },
    },
  },
}))

it("renders correctly", () => {
  const tree = renderer
    .create(<ArticleLink tag="TAG" title="TITLE" date="DATE" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
