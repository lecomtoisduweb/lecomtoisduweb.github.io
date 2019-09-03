import React from "react";
import { CardTitle } from "reactstrap";

import { Card, CardBody, CardHeader } from "./ui/card";

export interface ProjectCardProps {
  children: React.ReactChild;
  title: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  children,
  title,
}) => (
  <Card>
    <CardHeader>
      <CardTitle tag="h4">{title}</CardTitle>
    </CardHeader>
    <CardBody>{children}</CardBody>
  </Card>
);
