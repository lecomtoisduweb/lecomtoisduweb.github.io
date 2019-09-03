import React from "react";
import { FluidObject } from "gatsby-image";

import { RoundedImg } from "./ui/rounded-img";
import styled from "@emotion/styled";
import { Author } from "./author";

const Content = styled.main`
  text-align: justify;
`;

const Cover = styled(RoundedImg)`
  float: right;
  margin-left: 2rem;
  margin-bottom: 2rem;
  width: 40vw;
`;

export interface BlogPostProps {
  title: string;
  fluidCover?: FluidObject;
  html: string;
}

export const BlogPost: React.FC<BlogPostProps> = ({
  title,
  html,
  fluidCover,
}) => (
  <article className="container">
    <header>
      <h1>{title}</h1>
    </header>
    {fluidCover && (
      <Cover
        fluid={fluidCover}
        alt="Illustration"
        className="d-none d-md-block"
      />
    )}
    <Content dangerouslySetInnerHTML={{ __html: html }} />
    <footer className="mt-5">
      <h4>A propos de l'auteur</h4>
      <Author email="robin@lecomtoisduweb.com" name="Robin Bressan">
        Passionné de technologies web, je teste de nouvelles technologies
        régulièrement et fais beaucoup de veille. Entre deux trails, il m'arrive
        d'écrire de partager mes dernière trouvaille via un article ou Twitter.
      </Author>
    </footer>
  </article>
);
