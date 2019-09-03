import React from "react";
import { Link } from "gatsby";
import styled from "@emotion/styled";
import { titleToPath } from "../helper/slug";

const Article = styled.article`
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Excerpt = styled.main`
  font-style: italic;
`;

interface BlogPageProps {
  date: Date;
  excerpt: string;
  title: string;
  titleTag?: string;
}

export const BlogPostEntry: React.FC<BlogPageProps> = ({
  date,
  excerpt,
  title,
  titleTag = "h2",
}) => {
  return (
    <Article>
      <header>
        {React.createElement(
          titleTag,
          { className: "mb-2" },
          <Link to={titleToPath(title)}>{title}</Link>
        )}
      </header>
      <Excerpt>
        {excerpt}... - <small>{new Date(date).toLocaleDateString()}</small>
      </Excerpt>
    </Article>
  );
};
