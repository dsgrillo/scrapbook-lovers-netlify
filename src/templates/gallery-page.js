import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Gallery from '@browniebroke/gatsby-image-gallery'

export const pageQuery = graphql`
  query ImagesForGallery($id: String!) {
    images: allFile(
      filter: { relativeDirectory: { eq: "gallery" } }
      sort: { fields: name }
    ) {
      edges {
        node {
          childImageSharp {
            thumb: gatsbyImageData(
              width: 270
              height: 270
              placeholder: BLURRED
            )
            full: gatsbyImageData(layout: FULL_WIDTH)
            meta: fixed {
              originalName
            }
          }
        }
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
  }
`
const GalleryPage = ({ data }) => {
  const images = data.images.edges.map(({ node }) => ({
    ...node.childImageSharp,
    // Use original name as caption.
    // The `originalName` is queried in a nested field,
    // but the `Gallery` component expects `caption` at the top level.
    caption: node.childImageSharp.meta.originalName,
  }))

  const {markdownRemark} = data
  const { frontmatter, html, excerpt } = markdownRemark

  return (
    <Layout className="page">
        <Seo title={frontmatter.title} description={excerpt} />
        <div className="wrapper">
            <h1>{frontmatter.title}</h1>
            <article dangerouslySetInnerHTML={{ __html: html }} />
            <Gallery images={images}/>
        </div>
    </Layout>
  )
}

export default GalleryPage
