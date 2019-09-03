import styled from "@emotion/styled";
import { Button as BaseButton } from "reactstrap";
import { hsla } from "polished";

function boxShadow(color: string) {
  switch (color) {
    case "primary":
      return `0 5px 15px ${hsla(0, 0, 0, 0.2)}`;

    default:
      return "none";
  }
}

export const Button = styled(BaseButton)`
  border-radius: 10px;
  padding: 0.7rem 1rem;
  box-shadow: ${props => boxShadow(props.color)};
`;
