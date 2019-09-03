import React from "react";
import { Row, Col, Container } from "reactstrap";
import { graphql, useStaticQuery, Link } from "gatsby";
import styled from "@emotion/styled";
import { hsla } from "polished";

import { IdeaImage } from "../component/image/idea";
import { Layout } from "../component/layout";
import { BlogPostEntry } from "../component/blog-post-entry";
import { ClientShowcase } from "../component/client-showcase";

const ContactButton = styled.a`
  border-radius: 10px;
  box-shadow: 0 5px 15px ${hsla(0, 0, 0, 0.2)};
  display: flex;
  font-size: 18px;
  padding: 0.7rem 1rem;

  &:hover {
    color: #fff !important;
  }
`;

const SkewBackground = styled.div`
  flex-shrink: 0;
  margin-top: 3rem;
  position: relative;

  &:before {
    content: "";
    background-color: hsla(232, 42%, 67%, 0.1);
    position: absolute;
    top: 460px;
    left: 0;
    width: 100%;
    height: 450px;
    transform: skewY(-8deg);
    z-index: -1;
  }
`;

export const lastBlogPostquery = graphql`
  query {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/" } }
      sort: { order: DESC, fields: frontmatter___date }
      limit: 1
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

export const Homepage: React.FC = () => {
  const {
    allMarkdownRemark: {
      nodes: [lastBlogPost],
    },
  } = useStaticQuery(lastBlogPostquery);
  return (
    <Layout container={false}>
      <SkewBackground>
        <Container>
          <section className="mb-5">
            <Row>
              <Col md={7} className="d-flex flex-column justify-content-center">
                <h1>Concrétisez vos projets d’innovation web et mobile</h1>
                <p className="lead">
                  Vous avez une idée que vous souhaitez concrétiser ?
                  Contactez-moi et construisons la ensemble !
                </p>
                <p className="text-secondary">
                  Je m'appelle <strong>Robin Bressan</strong>. Je suis
                  développeur web freelance. <br />
                  Je crée des applications web modernes avec le meilleur de
                  l'open-source.
                </p>

                <div className="d-flex align-items-center justify-content-center justify-content-md-start flex-column flex-md-row mb-3 mb-md-0">
                  <ContactButton
                    className="btn btn-primary d-flex mw-100 mb-3 mb-md-0"
                    href="mailto:contact&#64;lecomtoisduweb.com?subject=Demande de contact"
                    target="_blank"
                  >
                    Me contacter
                  </ContactButton>
                  <Link to="/work" className="d-inline-block ml-sm-4">
                    En savoir plus sur mon travail
                  </Link>
                </div>
              </Col>
              <Col md={5}>
                <IdeaImage alt="Illustration page d'accueil" />
              </Col>
            </Row>
          </section>
          <section className="mb-5">
            <h2>À la Une sur le blog</h2>
            <BlogPostEntry
              date={lastBlogPost.frontmatter.date}
              excerpt={lastBlogPost.excerpt}
              title={lastBlogPost.frontmatter.title}
              titleTag="h3"
            />
            <Link to="/blog">Voir le reste des articles</Link>
          </section>
          <section>
            <h2>Qui sont mes clients ?</h2>
            <ClientShowcase />
          </section>
        </Container>
      </SkewBackground>
    </Layout>
  );
};

export default Homepage;
