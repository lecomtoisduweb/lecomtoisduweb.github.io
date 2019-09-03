import React from "react";
import { graphql, Link } from "gatsby";
import { get } from "lodash";
import { DiscussionEmbed } from "disqus-react";

import { Layout } from "../component/layout";
import { BlogPost } from "../component/blog-post";
import { Helmet } from "react-helmet";
import { titleToPath, titleToSlug } from "../helper/slug";
import { FluidObject } from "gatsby-image";

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { file, markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark;
  const url = `https://lecomtoisduweb.com${titleToPath(frontmatter.title)}`;
  return (
    <Layout>
      <>
        <Helmet title={frontmatter.title} defer={false}>
          <meta name="description" content={frontmatter.meta_description} />
          <meta name="og:description" content={frontmatter.meta_description} />
          <meta name="og:url" content={url} />
          <meta name="og:title" content={frontmatter.title} />
          <meta property="og:type" content="article" />
          <meta
            name="twitter:description"
            content={frontmatter.meta_description}
          />
          <meta name="twitter:image" content={(file as FluidObject).src} />
          <meta name="twitter:image" content={(file as FluidObject).src} />
        </Helmet>
        <Link to="/blog" className="d-inline-block mb-3">
          {"<"} Revenir au blog
        </Link>
        <BlogPost
          title={frontmatter.title}
          fluidCover={get(file, "childImageSharp.fluid", null)}
          html={html}
        />
        <div className="mt-3">
          <DiscussionEmbed
            shortname="lecomtoisduweb"
            config={{
              identifier: titleToSlug(frontmatter.title),
              title: frontmatter.title,
              url,
            }}
          />
        </div>
      </>
    </Layout>
  );
}
export const pageQuery = graphql`
  query($title: String!, $cover: String!) {
    file(relativePath: { eq: $cover }) {
      childImageSharp {
        fluid(maxWidth: 560) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    markdownRemark(frontmatter: { title: { eq: $title } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        cover
        title
        meta_description
      }
    }
  }
`;
