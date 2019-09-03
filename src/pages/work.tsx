import React from "react";

import { Layout } from "../component/layout";

export const WorkPage: React.FC = () => (
  <Layout>
    <>
      <section>
        <h1>Mon Travail</h1>
        <p>
          Passionné des technologies web, de l'open-source et de l'innovation,
          je m'applique à proposer des applications répondant à la fois au
          besoin du client et aux standards du marché. J'y apporte une
          expérience permettant de proposer au plus rapidement un resultat
          orienté utilisateur final. Tous mes développements s'accompagnent
          d'une batterie de tests automatisés permettant d'aborder les
          évolutions futures et la correction de bugs sereinement. Les
          régressions étant ainsi immédiatement repérées et corrigées le cas
          échéant.
        </p>
        <p>
          Voici une liste non exhaustive de technologies / plateformes /
          librairies avec lesquelles je travaille :
          <ul>
            <li>NodeJS</li>
            <li>ReactJS</li>
            <li>VueJS</li>
            <li>RxJS</li>
            <li>GraphQL</li>
            <li>Terraform</li>
            <li>AWS</li>
            <li>Jest</li>
          </ul>
        </p>
      </section>
      <section>
        <h1>A propos de moi</h1>

        <p>
          M'intéressant au domaine du web depuis mon plus jeune âge, ce n'est
          qu'une fois mon <strong>diplôme d'ingénieur en informatique</strong> (
          <a href="http://telecomnancy.univ-lorraine.fr/" target="_blank">
            TELECOM Nancy
          </a>
          ) en poche que je décide de poursuivre dans cette voie.
        </p>
        <p>
          Après avoir fini mon stage de fin d'étude à l'<strong>INRIA</strong>{" "}
          afin de découvrir le monde de la recherche, je choisis avec envie le
          monde de l'entreprise et part chez{" "}
          <strong>
            <a href="https://marmelab.com" target="_blank">
              Marmelab
            </a>
          </strong>{" "}
          à Nancy. J'ai eu l'opportunité de travailler pour des entreprises
          telles que <strong>Canal+</strong>, <strong>Axa</strong>,{" "}
          <strong>La Fourchette</strong> ainsi que d'autres grands comptes ou
          startups.
        </p>
        <p>
          Aujourd'hui sur Besançon, j'ai décidé début 2017 de lancer mon
          activité de freelance afin de proposer des prestations de qualité
          aussi bien en Franche-Comté qu'ailleurs en France.
        </p>
        <p>
          Durant ces dernières années, j'ai également pris part au lancement
          d'un gros projet dans le domaine des énergies renouvables:{" "}
          <a href="https://ouisol.com" target="_blank">
            OuiSol
          </a>
          .
        </p>
        <p>
          En parallèle de mon activité professionnelle, je pratique le trail. Ce
          sport très complet, m'a appris à être résilient aussi bien dans
          l'effort que dans mon métier.
        </p>
      </section>
    </>
  </Layout>
);

export default WorkPage;
