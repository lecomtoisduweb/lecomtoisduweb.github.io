---
cover_credits: Photo by Moritz Schmidt on Unsplash
cover: blog/analyse-syntaxique.jpg
date: 2017-05-30
title: L'analyse syntaxique à la rescousse
meta_description: Utiliser le pattern lexeur/parseur pour comprendre le contenu d'un champs de recherche
---

Un de mes clients, [hiventy](http://www.hiventy.com/), a eu besoin d'ajouter sur une liste d'éléments un champ de recherche. Le but était simple : pouvoir filter les résultats affichés.

La liste étant affichée grâce à react-virtualized, le filtrage se réalise uniquement côté client car de ce fait la performance n'est pas un problème.

Afin d'obtenir une solution robuste et flexible, j'ai opté pour l'implémentation d'un couple lexeur/parseur afin de proposer une analyse syntaxique efficace.

Trouvant le sujet très intéressant, j'ai eu envie de vous le faire découvrir.

*Note: Malgré un article en français, j'ai gardé quelques mots en anglais que je trouve plus adaptés, notamment les mots token et term*

## Le besoin

La requête que l'utilisateur va saisir dans le champ de recherche doit répondre à plusieurs critères :

* Une recherche de texte libre doit être possible (ex: `foo`)
* Une recherche par champ doit être possible (ex: `field:bar`)
* Une recherche par champ et en texte libre doit être possible (ex: `foo field:bar`)
* L'identifiant d'un champ doit pouvoir être recherché en tant que texte libre, autrement dit nous devons pouvoir échapper les `:` (ex: `field\:`)
* Que ce soit pour le texte libre ou pour un champ, nous souhaitons supporter les expressions régulières

## Transformer la requête en un tableau de tokens

L'analyse syntaxique se base sur deux niveaux d'abstraction : le lexeur et le parseur.
C'est ce premier que nous allons d'abord implémenter. Son principe est simple, il prend en entrée une chaîne de caractère et retourne en sortie une suite de tokens. Prenons un exemple :

Consérons l'entrée suivante :

```md
foo bar:hello
```

La liste de tokens que nous nous attendons à recevoir est la suivante :

```md
T_STRING(foo) T_SPACE T_STRING(bar) T_SYMBOL(:) T_STRING(hello)
```

Cette étape est cruciale car c'est elle qui va abstraire le format de la donnée d'entrée, permettant ainsi à notre parseur de ne manipuler que des structures connues.

Nous avons maintenant notre entrée et notre sortie, il est temps de coder notre lexeur ! Nous avons premièrement besoin de quelques constantes et helpers afin de nous faciliter le boulot :

```js
export const T_STRING = 'T_STRING';
export const T_SYMBOL = 'T_SYMBOL';
export const T_BOOLEAN = 'T_BOOLEAN';
export const T_SPACE = 'T_SPACE';
export const T_UNKNOWN = 'T_UNKNOWN';

function isBoolean(input) {
  return input === 'true' || input === 'false';
}

function isSymbol(input) {
  return [':', '/', '\\'].indexOf(input) !== -1;
}

function createToken(type, value) {
  if (value === undefined) {
    return { type };
  }

  return {
    value,
    type,
  };
}
```

Nous définissons d'abord nos différents types de tokens, les autres fonctions sont quant à elles suffisament explicites. Comme vous l'avez remarqué nous aurons 3 caractères spéciaux (nommés symboles) : `:`, `/` et `\`.

Passons maintenant au coeur de notre lexeur :

```js
function createTokens(input) {
  let tokens = [];
  let buffer = '';

  function flush() {
      // will be introduced later
  }

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (isSymbol(char)) {
      flush();
      tokens.push(createToken(T_SYMBOL, char));
    } else if (char === ' ') {
      flush();
      tokens.push(createToken(T_SPACE));
    } else {
      buffer += char;
    }
  }

  flush();

  return tokens;
}
```

Comme vous avez dû le remarquer, la fonction `flush()` est vide dans cet exemple, nous verrons son implementation par la suite.

Essayons de comprendre ce bout de code :

* Notre fonction `createTokens()` reçoit notre requête en entrée.
* Elle initialise notre tableau de tokens et un buffer vide.
* Nous bouclons ensuite sur tous les caractères de notre requête et nous y appliquons le raisonnement suivant :

    * Si le caractère courant est un symbole, alors nous enregistrons le contenu actuel du buffer grâce à notre méthode `flush()` et ajoutons à notre tableau un nouveau token de type `T_SYMBOL` avec pour valeur notre caractère courant.
    * Si le caractère courant est un espace, alors nous enregistrons le contenu actuel du buffer grâce à notre méthode `flush()` et ajoutons à notre tableau un nouveau token de type `T_SPACE`.
    * Enfin dans tous les autres cas, nous ajoutons le caractère courant au buffer.

* Enfin nous enregistrons le contenu resté dans le buffer et non traité grâce à notre méthode `flush()`.
* Nous retournons notre tableau de tokens.

Cela est bien beau mais nous n'avons toujours pas pu voir ce que fait notre fameuse fonction `flush()` !

```js
function flush() {
  if (!buffer.length) {
    return;
  }

  if (isBoolean(buffer)) {
    tokens.push(createToken(T_BOOLEAN, JSON.parse(buffer)));
  } else {
    tokens.push(createToken(T_STRING, buffer));
  }

  buffer = '';
}
```

De nouveau, essayons de comprendre ce bout de code :

* Si le buffer est vide alors il n'y a rien à faire et nous sortons. Dans le cas contraire nous analysons le contenu du buffer :

    * Si le contenu est un booléen nous ajoutons à notre tableau un token de type `T_BOOLEAN` avec pour valeur la valeur booléenne de notre buffer.
    * Dans tous les autres cas nous créons un token de type `T_STRING` avec pour valeur le contenu de notre buffer.

* Pour finir, nous vidons notre buffer.

Nous avons donc une fonction `createTokens()` capable de transformer notre requête en tokens. Mais il nous manque toujours quelque chose, vous vous en souvenez ? Nous souhaitons pouvoir échapper nos `:` ou plus généralement nous souhaitons pouvoir échapper n'importe quel token de type `T_SYMBOL`.

Le principe de l'échappement est simple :

* Si nous rencontrons deux tokens de type `T_SYMBOL` et que le premier contient comme valeur `\` alors nous devons les fusionner en un seul token de type `T_STRING` ayant pour valeur la valeur de notre second token de type `T_SYMBOL`.
* Enfin nous repassons sur notre tableau de token et fusionnons tous les tokens de type `T_STRING` adjacents.

Pour commencer, nous pouvons déjà ajouter un bout de code tout simple à la fin de notre fonction `createTokens()`, juste avant le `return` :

```js
let escaped = false;

while (!escaped) {
  const escapedTokens = escape(tokens);

  if (escapedTokens.length < tokens.length) {
    tokens = escapedTokens;
  } else {
    escaped = true;
  }
}
```

Ce bout de code est tout simple, nous lançons une recherche d'échappement dans notre tableau de tokens. Si cela se produit, la taille de notre tableau va forcément diminuer. Tant que cela se reproduit nous continuons à lancer la recherche.

Notre tableau de tokens de sortie est donc conforme à l'échappement souhaité une fois cette boucle terminée. C'est là l'avantage du lexeur, le parseur n'aura pas à se soucier de ces cas particuliers. Il n'aura à sa charge qu'à trouver une signification dans des ensembles de blocs logiques, ici nos tokens.

Il nous reste donc une dernière étape concernant notre lexeur : notre fonction `escape()` :

```js
function escape(tokens) {
  let escaping = false;
  const escapedTokens = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token.type === T_SYMBOL && token.value === '\\' && !escaping) {
      escaping = true;
    } else if (token.type === T_SYMBOL && escaping) {
      escaping = false;
      escapedTokens.push(createToken(T_STRING, token.value));
    } else if (token.type === T_SPACE && escaping) {
      escaping = false;
      escapedTokens.push(createToken(T_STRING, ' '));
    } else {
      if (escaping) {
        escapedTokens.push(createToken(T_STRING, '\\'));
      }
      escapedTokens.push(token);
      escaping = false;
    }
  }

  return mergeStringTokens(escapedTokens);
}
```

Regardons de plus près ce bout de code :

* Notre fonction `escape()` reçoit en entrée notre liste de tokens, générée précédemment.
* Nous initialisons une variable `escaping` nous indiquant si nous sommes en train de traiter ou non un échappement, ainsi que le tableau de tokens dans lequel nous allons empiler nos tokens.
* Nous parcourons ensuite notre tableau, afin de prendre une décision pour chaque token :

    * Le token courant est de type `T_SYMBOL` et contient `\` comme valeur ! Nous venons de détecter le début d'un échappement, nous mettons donc notre variable `escaping` à `true`.
    * Le token courant est de type `T_SYMBOL` et nous sommes dans un échappement. Dans ce cas, nous réinitialisons notre variable `escaping` et nous ajoutons à notre tableau un token de type `T_STRING` avec comme valeur celle du token courant.
    * Le token courant est de type `T_SPACE` et nous sommes dans un échappement. Dans ce cas, nous réinitialisons notre variable `escaping` et nous ajoutons à notre tableau un token de type `T_STRING` avec comme valeur un espace.
    * Enfin, si aucun des cas précedents n'est rencontré, nous vérifions d'abord si nous sommes dans un échappement. Si c'est le cas, nous sommes dans le cas d'un faux positif (par exemple `\a` représente bien les deux caractères car `a` ne peut pas être échappé). Nous ajoutons dans ce cas à notre tableau un token de type `T_STRING` ayant pour valeur `\`. Pour finir, nous ajoutons le token courant à notre tableau et réinitialisons notre variable `escaping`.

* Nous retournons ensuite notre liste de tokens en prenant soin de réaliser la fusion des tokens de type `T_STRING` comme expliqué précédemment.

La fonction `mergeStringTokens()` consiste en un `reduce` trivial :

```js
function mergeStringTokens(tokens) {
  return tokens.reduce((result, token) => {
    if (!result.length) {
      result.push(token);
    } else if (result[result.length - 1].type === T_STRING
      && token.type === T_STRING) {
      const lastToken = result.pop();
      lastToken.value += token.value;

      result.push(lastToken);
    } else {
      result.push(token);
    }
    return result;
  }, []);
}
```

Voilà, nous avons un lexeur fonctionnel, il est temps maintenant de passer au parseur !

## Transformer un tableau de tokens en terms

Rappelez-vous le début de l'article, nous voulions pouvoir gérer du texte libre et des champs. C'est exactement le but de notre parseur. Il va recevoir en entrée notre tableau de tokens et va nous donner en sortie un tableau de terms. Prenons un exemple

Consérons l'entrée suivante :

```md
T_STRING(foo) T_SPACE T_STRING(bar) T_SYMBOL(:) T_STRING(hello)
```

La liste de terms que nous nous attendons à recevoir est la suivante :

```md
TYPE_PLAIN(foo) TYPE_FIELD(bar, hello)
```

Comme pour notre lexeur, nous avons besoin de quelques helpers avant de commencer :

```js
export const TYPE_FIELD = 'TYPE_FIELD';
export const TYPE_PLAIN = 'TYPE_PLAIN';

function createTerm(key, value) {
  return {
    type: key ? TYPE_FIELD : TYPE_PLAIN,
    key,
    value,
  };
}

function countOccurences(tokens, char) {
  return tokens
    .filter(token => typeof token.value === 'string')
    .reduce((count, token) => count + (
      token.value.split(char).length - 1 > 0 ? 1 : 0
    ), 0);
}

function isSymbolTerm(token, symbol) {
  return token.type === T_SYMBOL && token.value === symbol;
}
```

Nous définissons nos deux types de terms. Les autres fonctions sont explicites à l'exception de `countOccurences()` qui elle sert à compter le nombre d'apparitions d'un caractère dans un tableau de tokens.

Afin de rendre le code du parseur plus maintenable et lisible, j'ai également implementé un buffer de tokens amélioré dont voici le code :

```js
function createTokenBuffer() {
  let storage = [];

  const buffer = {
    clear() {
      storage = [];
    },
    flush() {
      const output = [...storage];
      buffer.clear();

      if (!output.length) {
        return null;
      }

      return output.reduce((result, token) => (
        result ? `${result}${token.value}` : token.value
      ), null);
    },
    get length() {
      return storage.length;
    },
    get storage() {
      return [...storage];
    },
    filter(...args) {
      return storage.filter(...args);
    },
    pipe(nextBuffer) {
      buffer.storage.map(token => nextBuffer.push(token));
      buffer.clear();

      return nextBuffer;
    },
    push(token) {
      storage.push(token);
    },
    reduce(...args) {
      return storage.reduce(...args);
    },
  };

  return buffer;
}
```

Ses fonctions sont assez explicites mis à part deux :

* `flush()` va vider le buffer et retourner une chaine de caractère correspondant à la valeur de ses tokens.
* `pipe()` va transférer le contenu du buffer dans un autre buffer.

Ces bases mises en place, nous pouvons maintenant passer à l'implementation de notre parseur :

```js
function createTerms(tokens) {
  const bufferValue = createTokenBuffer();
  const bufferKey = createTokenBuffer();

  const terms = [];

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];

    if (token.type === T_SPACE && (bufferValue.length || bufferKey.length)) {
      // we found a space xxxxx xxxx
      //                  -----|----
      //                       ^
      //                   we are here

      terms.push(createTerm(
        bufferKey.flush(),
        bufferValue.flush(),
      ));
    } else if (isSymbolTerm(token, ':')
    && countOccurences(bufferValue, ':') === 0
    && !bufferKey.length
    && bufferValue.length) {
      // we found a colon xxxxx:xxxx
      //                  -----|----
      //                       ^
      //                   we are here
      // to be valid, the current bufferValue can not contain any other colon
      // and the bufferKey must be empty
      bufferValue.pipe(bufferKey);
    } else if (token.type !== T_SPACE) {
      // the current token has no effect, we just buffer it
      bufferValue.push(token);
    }
  }

  if (bufferValue.length || bufferKey.length) {
    // if some data are buffered we must flush them
    terms.push(createTerm(
      bufferKey.flush(),
      bufferValue.flush(),
    ));
  }

  return terms;
}
```

Etudions de plus près le code de notre parseur :

* Notre fonction `createTerms()` reçoit donc en entrée notre tableau de tokens, généré grâce à notre lexeur.
* Nous initialisons ensuite, deux buffers :

    * `bufferValue` sera le buffer principal dans lequel les tokens seront ajoutés.
    * `bufferKey` servira à stocker la clé d'un champ.

* Nous parcourons donc notre tableau de tokens, et pour chaque token appliquons le raisonnement suivant :

    * Si le token courant est de type `T_SPACE` et que l'un de nos buffers contient de la donnée alors nous créons un term avec le contenu de nos deux buffers. La condition sur la taille des buffers permet d'éviter de prendre en compte des espaces en double ou en début de requête.
    * Si le token est de type `T_SYMBOL` et contient comme valeur `:` alors nous sommes peut être en présence d'un champ.
    Pour en être sûr nous devons d'abord nous assurer que nous n'avons aucun `:` présent dans notre `bufferValue` (quelque soit son type afin de ne pas considérer `foo\:bar:test` comme un champ ayant pour clé `foo:bar`).
    Bien évidemment `bufferKey` doit être vide et enfin nous devons avoir de la donnée dans notre `bufferValue` afin de ne pas considérer un ensemble commençant par un `:` pour un champ.
    Si toutes ces conditions sont remplies nous transférons tout le contenu de `bufferValue` dans `bufferKey`.
    * Dans tous les autres cas nous ajoutons le token courant à `bufferValue` si celui-ci n'est pas un espace.

* Pour finir, si jamais nos buffers contiennent de la donnée, nous créons le dernier term.

Notre parseur est maintenant complet à un détail près, nous avons oublié la gestion des expressions régulières. Comme cela ne concerne que la valeur de nos terms, il suffit de rajouter un `map` avant de retourner le résultat :

```js
return terms.map((term) => {
    const { value } = term;

    if (typeof value !== 'string' || value[0] !== '/') {
      return term;
    }

    const fragments = value.split('/');
    fragments.shift(); // we remove the first empty fragment as the string starts with /

    if (fragments.length < 2) {
      return term; // regex pattern not found
    }

    const flags = fragments.pop();

    try {
      return {
        ...term,
        value: new RegExp(fragments.join('/'), flags),
      };
    } catch (error) {
      return term;
    }
  });
```

Le code étant explicite je ne m'attarderai pas dessus.

Notre couple lexeur/parseur en place, nous sommes maintenant en mesure d'analyser notre requête !

L'entrée suivante :

```md
foo bar:test hello:/([0-9]+)/g : :world:test good:bad:worse planet\:earth
````

Produira les terms suivants :

```md
TYPE_PLAIN(foo)
TYPE_FIELD(bar, test)
TYPE_FIELD(hello, RegExp(([0-9]+)), 'g'))
TYPE_PLAIN(:)
TYPE_PLAIN(:world:test)
TYPE_FIELD(good, bad:worse)
TYPE_PLAIN(planet:earth)
```

Dans le cadre de notre projet, nous avons ensuite créer un filtre configurable se servant de cette liste de terms afin de réaliser un filtrage pertinent.

## Conclusion

L'analyse syntaxique, même dans un périmètre très restreint permet de réaliser des solutions robustes et fiables. Le calcul est extrêmement rapide et les tests unitaires du lexeur et du parseur sont de surcroit très simples à implementer étant donné que les entrées sorties sont simples.
Comme nous avons pu le voir, des cas si simples ne nécessitent pas toujours l'utilisation d'une grammaire et d'un AST.
