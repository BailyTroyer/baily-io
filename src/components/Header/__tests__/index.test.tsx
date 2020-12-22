import React from "react"

import renderer from "react-test-renderer"

import Header from "../Header"

it("renders correctly", () => {
  const tree = renderer.create(<Header siteTitle="TITE" />).toJSON()
  expect(tree).toMatchSnapshot()
})
