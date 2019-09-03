import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";

export const query = graphql`
  query {
    file(relativePath: { eq: "client/ouisol.png" }) {
      childImageSharp {
        fixed(width: 150) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

export const OuiSolImage: React.FC = () => {
  const data = useStaticQuery(query);
  return <Img fixed={data.file.childImageSharp.fixed} alt="Logo OuiSol" />;
};
