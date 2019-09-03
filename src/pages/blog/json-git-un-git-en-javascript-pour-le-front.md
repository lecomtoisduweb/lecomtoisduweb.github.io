---
date: 2017-02-13
cover_credits: Photo by Robbin Huang on Unsplash
cover: blog/introduce-json-git.jpg
title: JSON-Git, un Git en javascript pour les applications frontend
meta_description: N'avez-vous jamais eu besoin de faire du Git sur une application frontend (comme une application ReactJS par exemple) ?
---

Je viens de sortir mon dernier projet open-source: **JSON-Git**. N'avez-vous jamais eu besoin de faire du Git sur une application frontend (comme une application ReactJS par exemple) ?

N'en dites pas plus, je me doute que la réponse est sûrement non. Je vous l'accorde les use-cases sont assez spécifiques. Mais où alors d'où peut bien venir cette idée ?

## Un peu de contexte

Resituons le contexte si vous le voulez bien : un de mes clients a du inventer un format JSON lui permettant de versionner de la donnée sur son application ReactJS afin de proposer une édition de sous-titres avec un historique complet des modifications. Cela implique donc une gestion de commits. Cependant, il n'y a pas de gestion de branche et donc encore moins de merge.

L'idée part donc de là. Ce n'est pas la première fois que je recontre cette problématique de versionnement sur du frontend. Git étant l'outil parfait pour ça, le défi est on ne peut plus explicite :

**Est-il possible de coder un Git uniquement en Javascript qui puisse fonctionner dans un navigateur ?**

## La structure interne

La première étape s'est d'abord concentrée sur le modèle de données d'un dépôt Git. Après quelques essais infructueux, c'est la lecture de deux pages sur la documentation officielle qui m'a aiguillé dans la bonne direction :

* [Git Internals - Git Objects](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)
* [Git Internals - Git References](https://git-scm.com/book/en/v2/Git-Internals-Git-References)

Un dépôt **JSON-Git** contient **deux stores** :

* Un **commit store** dans lequel nous allons stocker nos commits, indexés par leur hash.
* un **tree store** dans lequel nous allons stocker les différentes version du JSON que nous souhaitons versionner.

La structure d'un commit est assez simple à comprendre :

```json
{
    "hash": "ddfa215a540b0a43e6ae67b0b3893e355b8c06f7",
    "author": "robin",
    "date": "2017-02-07T11:58:15.623Z",
    "message": "first commit",
    "treeHash": "3420a96c38d2a469cf4b029a8a39edd927976d86",
    "parent": "0000000000000000000000000000000000000000"
}
```

Ce commit sera stocké dans le **commit store** sous la clé `ddfa215a540b0a43e6ae67b0b3893e355b8c06f7`.

L'attribute `treeHash` correspond à l'entrée correspondante du **tree store**, afin de pouvoir récupérer les données associées au commit.
Enfin, l'attribut `parent` correspond au commit qui le précède. Dans notre cas, celui-ci possède une valeur par défaut car il s'agit du premier commit.

Si vous vous demandez pourquoi uniquement le hash du commit parent est stocké, réfléchissons à la notion de branche :

![Branches](../../images/blog/commit-flow.png)

Pour modéliser une branche, nous devons stocker son **head**. Cela correspond à la référence de son dernier commit. Créer une deuxième branche (dev dans le cas de notre diagramme), revient simplement à créer un deuxième pointeur. Déroulons maintenant les opérations ammenant au dépôt Git du diagramme :

* Il n'y a aucun commit pour le moment, et nous possédons une seule branche à savoir `master`.
* Nous créons notre premier commit : `commit #1`. Il ne possède pas de commit parent car il est le premier.
* Nous commitons de nouveau : `commit #2`. Le commit parent est donc notre `commit #1.`
* Le **head** de `master` pointe donc sur `commit #2`.
* Nous créons une branche `dev`, son **head** pointe donc également sur `commit #2`.
* Nous commitons de nouveau sur `master` : `commit #3`. Son commit parent est donc notre `commit #2`. Le **head** de master est désormais le `commit #3`.
* Nous commitons de nouveau mais cette fois-ci sur notre nouvelle branche `dev` : `commit #4`. Son commit parent est donc également notre `commit #2`. Le **head** de dev est maintenant le `commit #4`.

Nous remarquons donc immédiatement, que c'est cette notion de parent qui nous permet de modéliser facilement notre modèle de branche.

Le stockage de nos données dans le **tree store** est le plus simple possible. Nous fournissons à notre store, le JSON à enregistrer. Celui-ci nous retourne le hash permettant de le retrouver.

## Optimisation

Nous sommes donc capable de commiter de la données. Cependant cela peut prendre rapidement de la place. Comment pouvons-nous compresser notre donnée tout en gardant une exécution rapide et possible sur un navigateur ?

Prenons un exemple simple, nous commitons notre première version :

```json
{
    "_id": "58958e893f38821fac62d687",
    "index": 0,
    "guid": "249422dd-de63-4d61-9dda-88c709656c97",
    "isActive": false,
    "balance": "$1,839.51",
    "picture": "http://placehold.it/32x32",
    "age": 34,
    "eyeColor": "green",
    "name": "Debora Kelly",
    "gender": "female",
    "company": "PANZENT",
    "email": "deborakelly@panzent.com",
    "phone": "+1 (829) 563-2686",
    "address": "502 Burnett Street, Jennings, Massachusetts, 7487",
    "about": "Nulla dolor dolor cillum veniam dolore aliqua nulla anim id deserunt in excepteur non. Laboris est ea eu non nulla ipsum ex enim voluptate qui quis elit aute. Tempor aute id et sunt labore velit officia fugiat cillum cupidatat nisi in. Irure velit et id laborum ipsum ullamco id anim reprehenderit incididunt elit quis eu qui. Dolore dolore velit in sit irure eiusmod ea velit consequat ea excepteur. Laborum consectetur adipisicing sit commodo aute enim quis officia eiusmod nulla. Dolor deserunt ipsum culpa velit ipsum laborum labore incididunt mollit nulla.\r\n",
    "registered": "2014-12-13T07:41:45 -01:00",
    "latitude": 58.253465,
    "longitude": -71.97323,
    "tags": [
        "proident",
        "in",
        "eu",
        "laborum",
        "et",
        "id",
        "culpa"
    ],
    "friends": [
        {
            "id": 0,
            "name": "Ada Burgess",
            "metadata": {
                "link": "_ref",
                "list": [
                    { "label": "item1" },
                    { "label": "item2" }
                ]
            }
        },
        {
            "id": 1,
            "name": "Barrera White"
        },
        {
            "id": 2,
            "name": "Tammi Brown"
        }
    ],
    "greeting": "Hello, Debora Kelly! You have 8 unread messages.",
    "favoriteFruit": "strawberry"
}
```

Mettons maintenant que nous commitions une seconde version dans laquelle nous modifions uniquement le nom de la première entrée de `friends` :

```diff
- "name": "Ada Burgess",
+ "name": "Ada",
```

Afin de ne pas enregistrer tout de nouveau, le **tree store** va remplacer toute les parties communes avec le précédent commit par une référence. Notre JSON, une fois enregistré ressemblera donc à cela :

```json
{
    "_id": "$$ref:xxxxx",
    "index": "$$ref:xxxxx",
    "guid": "$$ref:xxxxx",
    "isActive": "$$ref:xxxxx",
    "balance": "$$ref:xxxxx",
    "picture": "$$ref:xxxxx",
    "age": "$$ref:xxxxx",
    "eyeColor": "$$ref:xxxxx",
    "name": "$$ref:xxxxx",
    "gender": "$$ref:xxxxx",
    "company": "$$ref:xxxxx",
    "email": "$$ref:xxxxx",
    "phone": "$$ref:xxxxx",
    "address": "$$ref:xxxxx",
    "about": "$$ref:xxxxx",
    "registered": "$$ref:xxxxx",
    "latitude": "$$ref:xxxxx",
    "longitude": "$$ref:xxxxx",
    "tags": "$$ref:xxxxx",
    "friends": [
        {
            "id": "$$ref:xxxxx",
            "name": "Ada",
            "metadata": "$$ref:xxxxx"
        },
        "$$ref:xxxxx",
        "$$ref:xxxxx"
    ],
    "greeting": "$$ref:xxxxx",
    "favoriteFruit": "$$ref:xxxxx"
}
```

Le résultat est évidement nettement moins lourd à stocker. La donnée sera résolue à la lecture.

Si vous souhaitez en savoir plus, ou même l'utiliser, le code est disponible sur [le dépôt Github](https://github.com/RobinBressan/json-git).
Le projet est sous licence MIT, et les contributions sont les bienvenues !

Je vous invite également à regarder [json-git-redux](https://github.com/RobinBressan/json-git-redux) si vous souhaitez vous en servir dans une application [Redux](https://github.com/reactjs/redux).
