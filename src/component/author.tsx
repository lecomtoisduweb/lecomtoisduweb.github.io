import React from "react";
import Gravatar from "react-gravatar";

export interface AuthorProps {
  email: string;
  name: string;
  children: React.ReactChild;
}

export const Author: React.FC<AuthorProps> = ({ email, children, name }) => (
  <div className="media d-flex align-items-center flex-column flex-md-row justify-content-center justify-content-md-start">
    <Gravatar
      email={email}
      className="rounded-circle mb-3 mb-md-0"
      size={100}
    />
    <div className="media-body ml-md-5 text-center text-md-left">
      <p className="lead">{name}</p>
      {children}
    </div>
  </div>
);
