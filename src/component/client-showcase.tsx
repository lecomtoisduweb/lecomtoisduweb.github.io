import React from "react";
import styled from "@emotion/styled";

import { HiventyImage } from "./image/client/hiventy";
import { OuiSolImage } from "./image/client/ouisol";

const Link = styled.a`
  border: 0;
  &:hover {
    border: 0;
  }
`;

export const ClientShowcase: React.FC = () => (
  <div className="d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-around">
    <Link
      href="https://www.hiventy.com"
      target="_blank"
      className="mb-3 mb-md-0"
    >
      <HiventyImage />
    </Link>
    <Link href="https://ouisol.com" target="_blank">
      <OuiSolImage />
    </Link>
  </div>
);
