import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";

import { RoundedImg } from "../ui/rounded-img";

export const query = graphql`
  query {
    file(relativePath: { eq: "idea.jpg" }) {
      childImageSharp {
        fluid(maxWidth: 800) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;

export interface IdeaImageProps {
  alt: string;
}

export const IdeaImage: React.FC<IdeaImageProps> = ({ alt }) => {
  const data = useStaticQuery(query);
  return (
    <RoundedImg
      fluid={data.file.childImageSharp.fluid}
      alt={alt}
      title="Photo by Diego PH on Unsplash"
    />
  );
};
