import React from "react";
import { Row, Col, Container } from "reactstrap";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet";
import { graphql, useStaticQuery, Link } from "gatsby";
import { OutboundLink } from "gatsby-plugin-google-analytics";

import { Navbar } from "./navbar";
import { Footer } from "./ui/footer";
import { LetterLogo } from "./image/letter-logo";

export const query = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
`;

const Main = styled.main`
  margin-top: 3rem;
  padding-bottom: calc(200px + 2rem);
  position: relative;
`;

export interface LayoutProps {
  container?: boolean;
  children: React.ReactChild;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  container = true,
}) => {
  const {
    site: {
      siteMetadata: { title },
    },
  } = useStaticQuery(query);

  return (
    <Wrapper>
      <Helmet title={title} defer={false}>
        <html lang="fr" />
        <meta
          name="description"
          content="Concrétisez vos projets d’innovation web et mobile"
        />
        <meta
          name="og:description"
          content="Concrétisez vos projets d’innovation web et mobile"
        />
        <meta name="og:url" content="https://lecomtoisduweb.com" />
        <meta name="og:title" content={title} />
      </Helmet>
      <header>
        <Navbar />
      </header>
      <Main id="main">
        {container && <Container>{children}</Container>}
        {!container && <>{children}</>}
      </Main>
      <Footer className="footer mt-auto py-5 position-relative position-md-absolute">
        <div className="container">
          <Row>
            <Col
              md={2}
              className="d-flex flex-column align-items-center align-items-md-start justify-content-center"
            >
              <Link to="/">
                <LetterLogo />
              </Link>
            </Col>
            <Col
              md={4}
              className="d-flex flex-column align-items-center align-items-md-start justify-content-center"
            >
              <p>Robin Bressan</p>
              <ul className="list-unstyled text-center text-md-left">
                <li>contact&#64;lecomtoisduweb.com</li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="h-100 list-unstyled d-flex flex-row align-items-center justify-content-md-end justify-content-center">
                <li className="mr-3">
                  <OutboundLink
                    href="https://www.linkedin.com/in/robin-bressan-99854141"
                    target="_blank"
                  >
                    LinkedIn
                  </OutboundLink>
                </li>
                <li className="mr-3">
                  <OutboundLink
                    href="https://www.twitter.com/RobinBressan"
                    target="_blank"
                  >
                    Twitter
                  </OutboundLink>
                </li>
                <li>
                  <OutboundLink
                    href="https://github.com/RobinBressan"
                    target="_blank"
                  >
                    GitHub
                  </OutboundLink>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
      </Footer>
    </Wrapper>
  );
};
