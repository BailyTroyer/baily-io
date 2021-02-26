import React, { FC } from "react"

import { graphql } from "gatsby"

import { Layout, SEO } from "../../components"

interface QueryData {
  markdownRemark: {
    html: string
    excerpt: string
    frontmatter: {
      title: string
      date: string
    }
  }
}

interface Props {
  data: QueryData
}

const BlogPost: FC<Props> = (props: Props) => {
  const { data } = props

  const post = data.markdownRemark
  return (
    <Layout>
      <SEO title={post.frontmatter.title} description={post.excerpt} />
      <div className="bg-white">
        <div className="mx-auto sm:max-w-4xl max-w-screen-2xl  my-12 px-6">
          <h1 className="font-black text-4xl text-gray-900">
            {post.frontmatter.title}
          </h1>
          <p className="pt-1 text-gray-900 text-sm mb-12">
            {post.frontmatter.date}
          </p>
          <div
            className="markdown"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "DD MMMM, YYYY")
      }
      excerpt
    }
  }
`

export default BlogPost
