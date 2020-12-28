import React from "react"

import renderer from "react-test-renderer"

import FAQ from "../FAQ"

it("renders correctly", () => {
  const tree = renderer
    .create(<FAQ question="QUETION" answer="ANSWER" />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
