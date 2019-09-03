import React from "react";
import { graphql } from "gatsby";

import { Layout } from "../../component/layout";
import { titleToSlug } from "../../helper/slug";
import { BlogPostEntry } from "../../component/blog-post-entry";

export const query = graphql`
  query {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/" } }
      sort: { order: DESC, fields: frontmatter___date }
    ) {
      nodes {
        excerpt(format: PLAIN, truncate: true, pruneLength: 500)
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
        }
      }
    }
  }
`;

interface Frontmatter {
  date: Date;
  path: string;
  rawMarkdownBody: string;
  title: string;
}

interface BlogPageProps {
  data: {
    allMarkdownRemark: {
      nodes: Array<{
        excerpt: string;
        frontmatter: Frontmatter;
      }>;
    };
  };
}

const BlogPage: React.FC<BlogPageProps> = ({ data }) => {
  const blogPosts = data.allMarkdownRemark.nodes;

  return (
    <Layout>
      <>
        <h1>Blog</h1>
        {blogPosts.map(post => (
          <BlogPostEntry
            date={post.frontmatter.date}
            excerpt={post.excerpt}
            title={post.frontmatter.title}
            key={titleToSlug(post.frontmatter.title)}
          />
        ))}
      </>
    </Layout>
  );
};

export default BlogPage;
