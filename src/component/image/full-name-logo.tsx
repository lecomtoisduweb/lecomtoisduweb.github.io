import * as React from "react";
import { graphql, useStaticQuery } from "gatsby";
import Img from "gatsby-image";

export const query = graphql`
  query {
    file(relativePath: { eq: "logo-couleur.png" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fixed(height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`;

export const FullNameLogo: React.FC = () => {
  const data = useStaticQuery(query);
  return (
    <Img
      fixed={data.file.childImageSharp.fixed}
      alt="Logo le comtois du web"
      fadeIn={false}
    />
  );
};
