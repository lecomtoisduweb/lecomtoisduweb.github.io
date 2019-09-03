import styled from "@emotion/styled";
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardBody as BaseCardBody,
  CardTitle as BaseCardTitle,
} from "reactstrap";
import { hsla } from "polished";

export const Card = styled(BaseCard)`
  border-color: ${hsla(0, 0, 0, 0.1)};
  border-radius: 10px;
  padding: 1rem;
  &:hover {
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }
`;

export const CardHeader = styled(BaseCardHeader)`
  background-color: transparent;
  border: 0;
  padding: 0;
  margin-bottom: 1.5rem;
`;

export const CardBody = styled(BaseCardBody)`
  padding: 0;
`;

export const CardTitle = styled(BaseCardTitle)`
  font-weight: bold;
`;
