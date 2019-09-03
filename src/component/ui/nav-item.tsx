import styled from "@emotion/styled";
import * as React from "react";
import {
  NavItem as BaseNavItem,
  NavItemProps as BaseNavItemProps,
  NavLink,
} from "reactstrap";
import { Link } from "gatsby";

export interface NavItemProps extends BaseNavItemProps {
  children: React.ReactChild;
  to: string;
}

const StyledNavItem = styled(BaseNavItem)`
  margin: 0 0.5rem;
  padding: 0.1rem;
`;

export const NavItem: React.FC<NavItemProps> = ({
  children,
  to,
  ...otherProps
}) => (
  <StyledNavItem {...otherProps}>
    <Link to={to}>{children}</Link>
  </StyledNavItem>
);
