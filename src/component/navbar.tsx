import * as React from "react";
import {
  Navbar as BaseNavbar,
  Container,
  Collapse,
  Nav,
  NavbarToggler,
} from "reactstrap";
import { Link } from "gatsby";
import styled from "@emotion/styled";

import { FullNameLogo } from "./image/full-name-logo";
import { NavItem } from "./ui/nav-item";

const StyledNavbar = styled(BaseNavbar)`
  padding: 1rem 0;
  font-size: 18px;
  display: flex;
  align-items: center;

  & > .navbar-brand {
    flex: 1;
  }
`;

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <StyledNavbar expand="lg" light id="navbar" className="px-2 px-sm-0">
      <Container className="d-flex align-items-center">
        <Link className="navbar-brand d-flex" to="/">
          <FullNameLogo />
        </Link>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem to="/work">Travail</NavItem>
            <NavItem to="/blog">Blog</NavItem>
          </Nav>
        </Collapse>
      </Container>
    </StyledNavbar>
  );
};
