import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";

export const query = graphql`
  query {
    file(relativePath: { eq: "client/hiventy.png" }) {
      childImageSharp {
        fixed(width: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

export const HiventyImage: React.FC = () => {
  const data = useStaticQuery(query);
  return <Img fixed={data.file.childImageSharp.fixed} alt="Logo hiventy" />;
};
