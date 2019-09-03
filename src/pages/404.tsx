import React from "react";
import { Link } from "gatsby";

import { Layout } from "../component/layout";

export default () => (
  <Layout>
    <>
      <h1>Oups ! Il semblerait que vous vous soyez perdu</h1>
      <p>
        Cette page n'existe pas, pour retourner à l'accueil{" "}
        <Link to="/">cliquez ici</Link>.
      </p>
    </>
  </Layout>
);
