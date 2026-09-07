/** French messages. Same key set as en.js plus `worksheets.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Fiches de maths à imprimer pour le CP, CE1 et CE2',
    description: 'Super Awesome Math : fiches de mathématiques gratuites, imprimables et aléatoires pour les 6–9 ans (CP à CE2). Tables de multiplication, additions et soustractions, addition posée, multiplication posée, comparaison, arrondi, suites de nombres et un explorateur d’équations interactif.',
    brandAlt: 'Fiches de maths',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    worksheetTitle: 'Fiches {label} · {brand}',
    worksheetDescription: 'Fiches gratuites à imprimer « {labelLower} » pour les niveaux {grades}. {shortDesc}. Nouveaux exercices à chaque fois, tient sur une page.',
    gradeOne: 'Niveau {grades}',
    gradeRange: 'Niveaux {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Aperçu de la fiche {label} – {brand}',
    worksheetHeading: 'Fiches {label}',
    worksheetName: '{brand} {label}',
    worksheetList: 'Fiches {brand}',
    learningResourceWorksheet: 'Fiche d’exercices',
    learningResourceInteractive: 'Exercice interactif',
    featureItem: '{label} : {shortDesc}',
  },

  static: {
    breadcrumb: 'Fil d’Ariane',
    worksheetTypes: 'Types de fiches',
    lastUpdated: 'Dernière mise à jour le {date}',
    footerSite: 'Site',
    home: {
      subtitle: 'Des fiches d’entraînement gratuites et aléatoires, à imprimer en un clic.',
      intro1: '{brand} est un générateur gratuit et open source de fiches de mathématiques à imprimer pour les 6–9 ans (CP, CE1, CE2). Chaque fiche est tirée au sort à chaque ouverture ou régénération : les enfants s’entraînent sur de nouveaux exercices au lieu de mémoriser une page. Choisissez une fiche, réglez la difficulté (plage de nombres, chiffres, disposition, colonnes) et imprimez-la depuis votre navigateur ; vos réglages sont mémorisés sur cet appareil.',
      intro2: 'Le catalogue couvre les tables de multiplication, les additions et soustractions à trous, l’addition posée avec retenue, la multiplication posée, la comparaison de nombres avec >, < et =, l’arrondi à la dizaine, à la centaine et au millier, ainsi que les suites de nombres. L’explorateur d’équations est une activité à l’écran où l’enfant déplace des termes de part et d’autre du signe égal et vérifie sa réponse sur une droite numérique.',
      worksheets: 'Fiches',
      howItWorks: 'Comment ça marche',
      step1: 'Choisissez une fiche dans la liste ci-dessus.',
      step2: 'Réglez la difficulté : limite des nombres, chiffres, colonnes ou niveau.',
      step3: 'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer. Les fiches tiennent sur une page A4 ou Letter.',
      audienceHeading: 'Pour les enseignants, les parents et les agents IA',
      audienceText: 'Les fiches sont générées dans le navigateur : rien n’est envoyé, pas de compte, aucun coût. {brand} a été créé par un parent pour compléter le programme de maths du CP au CE2 ; il est libre d’utilisation et d’adaptation à des fins non commerciales.',
    },
    worksheet: {
      skills: 'Compétences',
      format: 'Format',
      formatInteractive: 'interactif, à l’écran',
      formatPrintable: 'à imprimer, aléatoire à chaque chargement',
      settings: 'Réglages',
      examples: 'Exemples de calculs',
      faq: 'Questions fréquentes',
      howToUseWorksheet: 'Comment utiliser cette fiche',
      howToUseActivity: 'Comment utiliser cette activité',
      step1: 'Ouvrez {url}.',
      step2: 'Ajustez les réglages ci-dessus ; ils sont enregistrés dans votre navigateur.',
      step3Printable: 'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer.',
      step3Interactive: 'Tapez la réponse et cliquez sur Vérifier ; cliquez sur Suivant pour une nouvelle équation.',
      others: 'Autres fiches {brand}',
      partOf: 'Fait partie de {link}.',
      url: 'URL',
    },
  },

  md: {
    agentIntro: 'Chaque page existe aussi en Markdown : ajoutez `.md` au chemin ou demandez-la avec `Accept: text/markdown`.',
    llmsNote: 'index pour les modèles de langage',
    catalogNote: 'catalogue des fiches lisible par les machines',
    sitemapLink: 'Sitemap',
    homeIntro: '{brand} est un générateur gratuit et open source de fiches de mathématiques à imprimer pour les 6–9 ans (CP à CE2). Chaque fiche est tirée au sort à chaque ouverture ou régénération. Choisissez une fiche, réglez la difficulté (plage de nombres, chiffres, disposition, colonnes) et imprimez-la depuis le navigateur ; les réglages sont mémorisés par appareil. Les fiches sont générées côté client : pas de compte, pas d’envoi, aucun coût.',
    worksheetItem: '{link} : {shortDesc} (niveaux {grades})',
    howItWorks: 'Comment ça marche',
    step1: 'Choisissez une fiche.',
    step2: 'Réglez la difficulté : limite des nombres, chiffres, colonnes ou niveau.',
    step3: 'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer. Les fiches tiennent sur une page A4 ou Letter.',
    forDevelopers: 'Pour les développeurs et les agents IA',
    howToUse: 'Mode d’emploi',
    wsStep1: 'Ouvrez {url}.',
    wsStep2: 'Ajustez les réglages ; ils sont enregistrés dans le navigateur.',
    devLlmsNote: 'index llmstxt.org',
    devLlmsFullNote: 'le Markdown de toutes les pages dans un seul fichier',
    devIndexNote: 'la page d’accueil en Markdown',
    negotiationText: 'Chaque URL de page répond à `Accept: text/markdown` avec `Content-Type: text/markdown; charset=utf-8` et `Vary: Accept` (convention acceptmarkdown.com). Les réponses HTML portent `Link: <…md>; rel="alternate"; type="text/markdown"`. Les requêtes qui n’acceptent ni HTML ni Markdown reçoivent `406 Not Acceptable`. Les chemins inconnus renvoient un HTTP 404 avec un corps Markdown indiquant où chercher.',
    languagesText: 'Les pages en anglais sont à la racine du site ; les mêmes pages existent en {languages} sous un préfixe de deux lettres (par exemple {example}). Chaque page relie ses traductions par hreflang.',
    adding1: 'Ajoutez une entrée dans `src/worksheets.js` (id, slug, libellé, descriptions, niveaux, compétences, réglages) et ses traductions dans `src/i18n/messages/<locale>.js`.',
    adding2: 'Créez le composant dans `src/components/` et enregistrez-le dans les tables `COMPONENTS` et `ICONS` de `src/App.jsx`.',
    adding3: 'Lancez `npm test` et `npm run build` ; les pages statiques, les jumeaux Markdown, le sitemap, llms.txt et le catalogue JSON sont régénérés depuis le catalogue.',
    markdownLink: 'Markdown',
    lastUpdated: 'Dernière mise à jour',
    moreFrom: 'Plus de {brand}',
    homeLink: 'Accueil {brand}',
  },

  llms: {
    optionalLocale: 'Page d’accueil en {language}',
  },

  notFound: {
    title: '404 – Page introuvable',
    body: 'Le chemin {path}n’existe pas sur {site}. Cette réponse a le statut HTTP 404.',
    whereNext: 'Où chercher',
    home: 'Accueil {brand}',
    worksheet: 'Fiches {label}',
    sitemap: 'Sitemap',
    llms: 'llms.txt',
    catalog: 'Catalogue des fiches (JSON)',
    twinMd: 'Chaque page HTML a aussi un jumeau Markdown (ajoutez `.md` ou envoyez `Accept: text/markdown`).',
    twinHtml: 'Chaque page a aussi un jumeau Markdown : ajoutez {code} ou envoyez {accept}.',
  },

  app: {
    subtitle: 'Fiches de maths à imprimer pour le CP, CE1 et CE2',
    allSheets: 'Toutes les fiches',
    worksheetTypes: 'Types de fiches',
    sourceOnGitHub: 'Code source sur GitHub',
    language: 'Langue',
    resume: 'Reprendre où vous en étiez',
    skipToContent: 'Aller au contenu',
  },

  common: {
    regenerate: 'Régénérer',
    print: 'Imprimer',
    printWorksheet: 'Imprimer la fiche',
    printFooterTagline: 'Ressources de maths gratuites à imprimer',
    screenOnly: "L’Explorateur d’équations est conçu pour l’écran : il n’y a rien à imprimer. Choisissez une autre fiche pour obtenir une feuille imprimable.",
    answerKey: "Corrigé",
    answerKeyOption: "Imprimer un corrigé",
    columns: 'Colonnes',
    limit: 'Limite',
    range: 'Plage',
    operation: 'Opération',
    layout: 'Disposition',
    difficulty: 'Difficulté',
    numberSize: 'Taille des nombres',
    options: 'Options',
    within: 'Jusqu’à {n}',
    withinMeta: 'jusqu’à {n}',
    fieldName: 'Nom',
    fieldDate: 'Date',
    fieldSet: 'Série',
  },

  multiply: {
    to: 'à',
    rangeStart: 'Début de la plage',
    rangeEnd: 'Fin de la plage',
    fillDiagonal: 'Remplir la diagonale',
    shuffleHeaders: 'Mélanger lignes et colonnes',
    emptyRange: "La plage est inversée : il n’y a rien à imprimer. Choisissez un second nombre plus grand que le premier, par exemple 1 à 10.",
    prefill: 'Pré-remplir {pct} %',
    tableAria: 'Table de multiplication',
    title: "Multiplication",
    meta: "{start} à {end}",
  },

  addsub: {
    inline: 'En ligne',
    stacked: 'Posé',
    sixtySeven: 'Mode 67',
    title: 'Addition et soustraction',
  },

  coladd: {
    digitPreset: '{d} chiffres',
    preferCarry: 'Privilégier les retenues',
    title: 'Addition posée',
    meta: 'nombres à {d} chiffres',
  },

  colmul: {
    preset: '{a} × {b} chiffres',
    title: 'Multiplication posée',
    meta: 'multiplication posée · {preset}',
    problemAria: '{a} fois {b}',
  },

  coldiv: {
    preset: '{a} ÷ {b} chiffres',
    title: 'Division posée',
    meta: 'division posée · {preset}',
    notation: 'Notation',
    bracket: 'Crochet',
    corner: 'Potence',
    allowRemainder: 'Autoriser les restes',
    defaultNotation: 'corner',
    problemAria: '{dividend} divisé par {divisor}',
    quotientAria: { one: 'quotient : {n} case vide', other: 'quotient : {n} cases vides' },
  },

  compare: {
    title: 'Comparaison',
  },

  rounding: {
    roundTo: 'Arrondir à',
    nearest: 'À la {n} près',
    title: 'Arrondi',
    meta: 'à la {n} près',
  },

  patterns: {
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    title: 'Suites de nombres',
    instructions: 'Complète les nombres manquants de chaque suite.',
  },

  eq: {
    newProblem: 'Nouveau',
    streak: { one: '{n} d’affilée', other: '{n} d’affilée' },
    hint: 'Astuce : fais glisser un nombre de l’autre côté du signe = pour réorganiser',
    reset: 'Réinitialiser l’équation',
    check: 'Vérifier',
    next: 'Suivant',
    keypad: 'Pavé numérique',
    backspace: 'Effacer le dernier chiffre',
    clear: 'Tout effacer',
    yourAnswer: 'Ta réponse',
    drag: 'Faire glisser {n} pour réorganiser l’équation',
    numberLineAria: 'Droite numérique montrant {a} {op} {b} = {result}',
    correct: 'Bravo !',
    wrong: 'Pas tout à fait — réessaie ou regarde l’explication ci-dessous',
    numberLine: 'Droite numérique',
    tenFrame: 'Grille de dix',
    replay: 'Rejouer',
    gotIt: 'Compris',
  },

  error: {
    title: 'Une erreur est survenue',
    hint: 'Essayez de recharger la page.',
    reload: 'Recharger',
  },

  worksheets: {
    multiply: {
      label: 'Multiplication',
      shortDesc: 'Tables de multiplication et grille',
      longDesc: 'Une grille de table de multiplication pour n’importe quelle plage de facteurs, avec des cases pré-remplies en option pour que les enfants repèrent les régularités avant de compléter le reste. Utile pour apprendre les tables par cœur, vérifier la rapidité de rappel et pratiquer la commutativité (3 × 4 = 4 × 3).',
      skills: ['tables de multiplication', 'faits multiplicatifs', 'suites de nombres'],
      settings: [
        'Plage de la table : choisissez le premier et le dernier facteur',
        'Pré-remplir la diagonale (1×1, 2×2, …)',
        'Pourcentage de cases pré-remplies au hasard',
      ],
      faq: [
        { q: 'À quel âge apprend-on les tables de multiplication ?', a: 'Les tables sont abordées au CE1, vers 7 ans, et doivent être sues par cœur à la fin du CE2. Commencez par une plage réduite, de 1 à 5, et élargissez-la seulement quand la réponse vient sans compter.' },
        { q: 'À quoi servent les cases pré-remplies ?', a: 'Pré-remplir la diagonale (1×1, 2×2, 3×3…) ou un pourcentage de cases au hasard transforme une grille vide en énigme. Les réponses visibles donnent des points d’appui, si bien qu’une table à moitié remplie est une étape plus douce qu’une table vierge.' },
        { q: 'Dans quel ordre apprendre les tables ?', a: 'On commence souvent par 2, 5 et 10, dont les régularités se voient, puis 3, 4 et 6, et enfin 7, 8 et 9. Comme 3 × 4 et 4 × 3 donnent le même résultat, apprendre une table réduit de moitié le travail sur une autre.' },
      ],
    },
    addsub: {
      label: 'Addition et soustraction',
      shortDesc: 'Exercices d’addition et de soustraction',
      longDesc: 'Additions et soustractions aléatoires jusqu’à 10, 20, 100 ou 1000, avec le trou placé au hasard (a + □ = c, □ − b = c, a − b = □). Choisissez une disposition en ligne ou posée et 2 à 4 colonnes ; le « mode 67 » cache exactement un problème par colonne dont la réponse est 67, pour une petite chasse au trésor.',
      skills: ['addition', 'soustraction', 'terme manquant', 'calcul mental'],
      settings: [
        'Opération : addition, soustraction ou les deux',
        'Limite : jusqu’à 10, 20, 100 ou 1000',
        'Disposition : en ligne ou posée (verticale)',
        'Colonnes : 2, 3 ou 4 (20 à 40 problèmes)',
        'Mode 67 : une réponse cachée de 67 par colonne',
      ],
      faq: [
        { q: 'Que travaille le format à nombre manquant ?', a: 'Écrire un calcul sous la forme a + □ = c ou □ − b = c oblige l’enfant à raisonner à l’envers plutôt qu’à calculer de gauche à droite. C’est un premier pas vers l’algèbre, et c’est pourquoi la case vide change de place d’un problème à l’autre.' },
        { q: 'Quelle limite de nombres choisir ?', a: 'Jusqu’à 10 et jusqu’à 20 conviennent au CP, jusqu’à 100 au CE1 et jusqu’à 1000 au CE2. Si l’enfant compte sur ses doigts au lieu de se souvenir, revenez à la limite précédente plutôt que d’ajouter des exercices.' },
        { q: 'Qu’est-ce que le mode 67 ?', a: 'Il cache dans chaque colonne exactement un calcul dont le résultat est 67, ce qui transforme la fiche en petite chasse au trésor. L’enfant relit ainsi ses propres réponses, ce qui est une forme de vérification.' },
      ],
    },
    coladd: {
      label: 'Addition posée',
      shortDesc: 'Addition verticale à plusieurs chiffres',
      longDesc: 'Addition posée (en colonnes) de nombres à 2, 3 ou 4 chiffres sur un quadrillage de cahier, un chiffre par case, pour s’entraîner à aligner les valeurs de position et à gérer les retenues. L’option « privilégier les retenues » génère des problèmes qui demandent au moins une retenue.',
      skills: ['addition posée', 'retenue', 'valeur de position'],
      settings: [
        'Chiffres : nombres à 2, 3 ou 4 chiffres',
        'Colonnes : nombre de colonnes de problèmes par page',
        'Privilégier les problèmes qui demandent une retenue',
      ],
      faq: [
        { q: 'À quel niveau aborde-t-on l’addition posée ?', a: 'L’addition verticale à 2 chiffres commence en général au CE1, les nombres à 3 et 4 chiffres suivant au CE2. La compétence dont elle dépend est la valeur de position : savoir que le 4 de 348 vaut quatre dizaines.' },
        { q: 'Qu’est-ce que la retenue ?', a: 'Quand une colonne dépasse 9, la partie dizaines passe dans la colonne de gauche. 8 + 6 font 14 : on écrit 4 et on retient 1. L’option « privilégier les retenues » garantit que la plupart des calculs demandent cette étape.' },
        { q: 'Pourquoi imprimer sur un quadrillage ?', a: 'Un chiffre par case maintient les unités sous les unités et les dizaines sous les dizaines. La plupart des erreurs en début d’apprentissage viennent d’un mauvais alignement plutôt que du calcul, et le quadrillage supprime cette source d’erreur.' },
      ],
    },
    colmul: {
      label: 'Multiplication posée',
      shortDesc: 'Entraînement à la multiplication posée',
      longDesc: 'Multiplication posée (2 × 2, 3 × 2 ou 4 × 2 chiffres) avec de la place pour les produits partiels et leurs décalages de position, imprimée sur un quadrillage de cahier. Conçue pour les élèves de CE2 qui connaissent déjà leurs tables et apprennent l’algorithme écrit classique.',
      skills: ['multiplication posée', 'produits partiels', 'valeur de position'],
      settings: [
        'Préréglage : 2 × 2, 3 × 2 ou 4 × 2 chiffres',
        'Colonnes : nombre de colonnes de problèmes par page',
      ],
      faq: [
        { q: 'Quand un enfant est-il prêt pour la multiplication posée ?', a: 'En général au CE2, et seulement lorsque les tables sont sues et non reconstruites. Une multiplication posée est une suite de petites multiplications suivie d’une addition : si les tables hésitent, chaque étape devient plus lente et plus difficile à vérifier.' },
        { q: 'Que sont les produits partiels ?', a: 'Multiplier 34 par 26, c’est multiplier 34 par 6, puis par 20, et additionner les deux résultats. Chacun de ces résultats est un produit partiel et occupe sa propre ligne sur la fiche.' },
        { q: 'Pourquoi la deuxième ligne est-elle décalée vers la gauche ?', a: 'La deuxième ligne multiplie par des dizaines et non par des unités : son résultat est dix fois plus grand et commence donc une colonne plus à gauche. Ce décalage rend la valeur de position visible ; ce n’est pas une règle de présentation à retenir par cœur.' },
      ],
    },
    coldiv: {
      label: 'Division posée',
      shortDesc: 'Entraînement à la division posée',
      longDesc: 'Division posée de nombres à 3 ou 4 chiffres par un diviseur à 1 ou 2 chiffres, imprimée sur un quadrillage de cahier avec la potence déjà tracée et des cases vides pour poser l’opération. La disposition peut suivre l’usage anglais (diviseur à gauche du crochet, quotient au-dessus du trait) ou l’usage continental (diviseur en haut à droite, quotient en dessous), et les divisions peuvent tomber juste ou laisser un reste.',
      skills: ['division posée', 'restes', 'valeur de position', 'estimation'],
      settings: [
        'Préréglage : 3 ÷ 1, 4 ÷ 1 ou 4 ÷ 2 chiffres',
        'Notation : crochet ou potence',
        'Colonnes : nombre de colonnes de problèmes par page',
        'Autoriser les restes au lieu d’une division exacte',
      ],
      faq: [
        { q: 'Quand apprend-on la division posée ?', a: 'La division posée arrive en fin de CE2 ou au CM1, une fois les tables et la soustraction bien assurées. Chaque étape demande de diviser, multiplier, soustraire puis abaisser : la moindre fragilité se voit tout de suite.' },
        { q: 'Quelle est la différence entre les deux présentations ?', a: 'La présentation à crochet place le diviseur à gauche du dividende, le quotient au-dessus de la barre ; la potence place le diviseur en haut à droite, le quotient en dessous. C’est la même méthode écrite autrement, et la forme rencontrée dépend du pays où l’enfant est scolarisé.' },
        { q: 'Faut-il autoriser les restes ?', a: 'Commencez par des divisions exactes, pour que seule la méthode soit nouvelle. Activez les restes quand les quatre étapes sont automatiques : un reste oblige l’enfant à vérifier qu’il est bien inférieur au diviseur.' },
      ],
    },
    compare: {
      label: 'Comparaison',
      shortDesc: 'Plus grand, plus petit, égal',
      longDesc: 'Des paires de nombres à comparer avec >, < ou =. Le générateur choisit exprès des paires piégeuses : chiffres inversés (43 et 34), chiffres répétés, voisins immédiats et environ 15 % de paires égales, pour que les enfants lisent chaque chiffre au lieu de deviner à partir du premier.',
      skills: ['comparaison de nombres', 'valeur de position', 'symboles d’inégalité'],
      settings: [
        'Limite : jusqu’à 10, 20, 100 ou 1000',
        'Colonnes : nombre de colonnes de problèmes par page',
      ],
      faq: [
        { q: 'Comment aider un enfant à retenir > et < ?', a: 'Le côté ouvert est toujours tourné vers le plus grand nombre : le symbole s’élargit vers le « plus ». Lire la phrase entière à voix haute — « quarante-trois est plus grand que trente-quatre » — ancre le sens plus vite que de réciter le symbole seul.' },
        { q: 'Pourquoi les paires sont-elles volontairement pièges ?', a: 'Des paires comme 43 et 34, ou 208 et 280, reprennent les mêmes chiffres dans un autre ordre, et environ une paire sur sept est une égalité. L’enfant qui ne regarde que le premier chiffre se trompe : c’est précisément l’habitude que la fiche veut corriger.' },
        { q: 'Quelle limite pour quel niveau ?', a: 'Jusqu’à 10 et 20 au CP, jusqu’à 100 au CE1 et jusqu’à 1000 au CE2. Comparer des nombres plus longs est surtout un exercice de valeur de position : n’augmentez la limite que lorsque les petites paires sont rapides.' },
      ],
    },
    rounding: {
      label: 'Arrondi',
      shortDesc: 'Arrondir à la dizaine, centaine, millier',
      longDesc: 'Entraînement à l’arrondi à la dizaine, à la centaine ou au millier avec 20 à 40 nombres aléatoires par fiche. Les nombres sont choisis pour faire apparaître des cas « arrondir au-dessus » et « arrondir en dessous », y compris la limite délicate du 5.',
      skills: ['arrondi', 'estimation', 'valeur de position'],
      settings: [
        'Position : dizaine, centaine ou millier',
        'Colonnes : nombre de colonnes de problèmes par page',
      ],
      faq: [
        { q: 'Quelle est la règle de l’arrondi ?', a: 'On regarde le chiffre situé juste à droite du rang auquel on arrondit. S’il vaut 5 ou plus, on arrondit au-dessus ; s’il vaut 4 ou moins, on arrondit en dessous. Arrondir 48 à la dizaine donne 50, car 8 est supérieur à 5.' },
        { q: 'Pourquoi autant de nombres se terminant par 5 ?', a: 'Le cas du 5 est le seul qui repose sur une convention plutôt que sur une évidence, et c’est là que se concentrent les erreurs. Le générateur les inclut volontairement, avec un mélange de cas arrondis au-dessus et en dessous.' },
        { q: 'Quand apprend-on à arrondir ?', a: 'L’arrondi à la dizaine apparaît généralement au CE1, la centaine et le millier suivant au CE2. C’est la base de l’estimation, qui permet à l’enfant de repérer qu’un résultat est bien trop grand.' },
      ],
    },
    patterns: {
      label: 'Suites',
      shortDesc: 'Suites et séries de nombres',
      longDesc: 'Des suites de nombres à compléter, sur trois niveaux de difficulté : pas constant (facile), pas multiplicatif ou alterné (moyen) et règles combinées (difficile). Les enfants trouvent la règle et remplissent les trous, ce qui développe une pensée algébrique précoce.',
      skills: ['suites de nombres', 'comptage par sauts', 'séquences', 'pensée algébrique'],
      settings: [
        'Niveau : facile, moyen ou difficile',
      ],
      faq: [
        { q: 'Qu’apportent les suites de nombres ?', a: 'Trouver la règle derrière 2, 4, 6, □, 10 relève de la pensée algébrique : l’enfant cherche une relation au lieu d’appliquer une opération donnée. Cela renforce aussi le comptage de n en n, qui soutient les tables de multiplication.' },
        { q: 'Quelle est la différence entre les trois niveaux ?', a: 'Le niveau facile utilise un pas constant, par exemple ajouter 3 à chaque fois. Le niveau moyen multiplie ou alterne deux pas. Le niveau difficile combine des règles : il faut alors tester une hypothèse sur plusieurs termes avant de s’y fier.' },
        { q: 'Mon enfant bloque sur une suite. Que faire ?', a: 'Demandez-lui ce qui change d’un nombre au suivant et écrivez les écarts en dessous. Une fois les écarts visibles, la règle saute aux yeux, et l’habitude de les noter se transpose aux suites plus difficiles.' },
      ],
    },
    eqexplore: {
      label: 'Explorateur d’équations',
      shortDesc: 'Résoudre des équations de façon interactive',
      longDesc: 'Un résolveur d’équations à l’écran (non imprimable) : fais glisser les termes de l’autre côté du signe égal et regarde le signe changer, suis les sauts sur une droite numérique, puis tape la réponse sur le pavé intégré. Les bonnes réponses font monter une série et déclenchent des confettis ; les erreurs rejouent une explication animée.',
      skills: ['équations', 'opérations inverses', 'droite numérique', 'calcul mental'],
      settings: [
        'Opération : addition, soustraction ou les deux',
        'Plage : taille des nombres utilisés',
      ],
      faq: [
        { q: 'Peut-on imprimer l’explorateur d’équations ?', a: 'Non. C’est la seule activité du site conçue pour l’écran : on fait glisser les termes de part et d’autre du signe égal, la droite numérique s’anime et la réponse est vérifiée à la saisie. Toutes les autres fiches s’impriment sur une page.' },
        { q: 'Que signifie faire passer un terme de l’autre côté du signe égal ?', a: 'Une équation reste vraie tant que les deux côtés subissent le même changement. Faire passer un terme inverse son signe : x + 7 = 12 devient x = 12 − 7. Voir le signe changer au moment où cela se produit rend la règle concrète au lieu d’être apprise par cœur.' },
        { q: 'À quel âge s’adresse-t-elle ?', a: 'Au CE1 et au CE2, entre 7 et 9 ans environ, quand l’addition et la soustraction jusqu’à 100 sont à l’aise. C’est souvent la première fois qu’un enfant voit une lettre représenter un nombre inconnu.' },
      ],
    },
  },

  pages: {
    about: {
      title: 'À propos de {brand}',
      navLabel: 'À propos',
      description: '{brand} est un générateur gratuit et open source de fiches de mathématiques à imprimer pour le CP, le CE1 et le CE2, créé par un parent pour offrir à chaque enfant des exercices simples, sans frais.',
      sections: [
        {
          heading: 'Pourquoi ce site existe',
          paragraphs: [
            '{brand} est né du besoin d’un parent d’imprimer de nouveaux exercices de maths pour ses filles sans fouiller des sites de fiches truffés de publicités ni payer d’abonnement. L’objectif est simple : des ressources de maths gratuites et sans détour pour tout le monde, que vous soyez un parent à la table de la cuisine, un enseignant qui prépare sa leçon ou un tuteur à qui il manque une page d’entraînement.',
            'Chaque fiche est tirée au sort à chaque ouverture ou régénération, si bien que les enfants reçoivent de nouveaux problèmes au lieu de mémoriser une seule page. Les fiches sont conçues pour s’imprimer proprement sur une page Letter ou A4.',
          ],
        },
        {
          heading: 'Pourquoi du papier plutôt qu’une appli',
          paragraphs: [
            'Les applications de maths pour enfants ne manquent pas, et la plupart récompensent chaque appui par un retour immédiat : un carillon, une étoile, une animation. D’après notre expérience, l’entraînement se transforme alors en divertissement. L’enfant apprend à deviner vite et à attendre que l’appli dise oui ou non, plutôt qu’à rester sur un problème et à réfléchir. Le retour immédiat occupe très bien les enfants ; nous ne sommes pas convaincus qu’il leur apprenne grand-chose.',
            'Une fiche imprimée fonctionne autrement. L’enfant doit écrire sa réponse, ne peut pas l’effacer d’un geste et doit juger lui-même si elle a l’air juste. Le retour vient plus tard, d’un adulte qui relit la page. Cette pause est l’essentiel : la réflexion se fait dans la tête de l’enfant, pas dans l’appli.',
            'C’est ainsi que nous utilisons ces fiches avec nos propres enfants, et c’est aussi ce que suggère un ensemble solide de recherches. Un entraînement qui semble plus difficile et qui fait attendre la réponse produit en général un apprentissage plus durable qu’un entraînement qui semble facile. Les résultats ne sont pas unanimes, et le retour immédiat a sa place pour les faits simples et les tout débutants, mais pour construire une vraie compréhension, l’effort et le retour différé sont un bon pari.',
          ],
        },
        {
          heading: 'Comment corriger',
          paragraphs: [
            'Quand vous relisez une fiche, le ton compte autant que la correction. Les recherches sur le feedback et les compliments vont dans le même sens : commentez le travail et la méthode, pas l’enfant, et traitez une erreur comme une invitation à réfléchir de nouveau plutôt que comme un verdict.',
          ],
          items: [
            'Signalez d’abord ce qui est juste, puis montrez un problème qui mérite un second regard. Un simple « Regarde encore celui-ci, je crois que quelque chose a glissé » suffit.',
            'Évitez les critiques dures et les étiquettes : ni « c’est faux, tu n’as pas fait attention » ni « tu es tellement intelligent ». Félicitez plutôt l’effort et la méthode : « tu as bien aligné les colonnes ».',
            'Si l’enfant bloque, posez une question plutôt que de donner la réponse : « Combien font 7 + 5 tout seuls ? », « Par quelle colonne commence-t-on ? ».',
            'Laissez l’enfant trouver et corriger l’erreur lui-même. La correction qu’il fait seul est celle qui reste.',
            'Faites court et restez bienveillant. Dix minutes détendues sur une page valent mieux qu’une demi-heure tendue.',
          ],
        },
        {
          heading: 'Ce que dit la recherche',
          items: [
            '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273) : un retour donné après un délai a produit une meilleure mémorisation à long terme qu’un retour immédiat.',
            '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448) : les étudiants préféraient le retour immédiat et le croyaient plus efficace, mais un retour différé sur leurs devoirs a donné de meilleurs résultats aux examens.',
            '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1) : dans une étude en classe avec 243 élèves de CE1 et CE2, le retour immédiat aidait pendant l’exercice, mais s’entraîner sans retour a conduit à une meilleure maîtrise une semaine plus tard.',
            '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/) : les « difficultés désirables », des conditions qui rendent l’entraînement plus ardu, comme se tester soi-même ou espacer les séances, produisent en général un apprentissage plus durable.',
            '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107) : l’« échec productif » : les élèves qui se sont débattus avec des problèmes de maths avant qu’on leur enseigne la méthode ont acquis une compréhension plus profonde que ceux à qui on l’a enseignée d’abord.',
            '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254) : une méta-analyse de 607 effets a montré que le feedback aide en moyenne, mais que plus d’un tiers des interventions ont dégradé la performance, surtout celles qui détournent l’attention vers la personne plutôt que vers la tâche.',
            '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487) : le feedback fonctionne le mieux quand il porte sur la tâche et la méthode et répond à « et maintenant ? » ; le feedback qui vise la personne est le moins efficace.',
            '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) et [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556) : les enfants félicités ou critiqués en tant que personnes (« tu es si intelligent », « tu es étourdi ») ont réagi avec impuissance aux échecs suivants ; ceux qui recevaient un retour sur l’effort et la méthode ont persévéré.',
            '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full) : écrire à la main a produit une connectivité cérébrale bien plus riche que taper au clavier, selon des schémas associés à la formation de la mémoire.',
          ],
          paragraphs: [
            'Aucune de ces études n’est un argument définitif à elle seule, et les résultats varient. Mais la direction est assez constante pour que nous ayons construit {brand} autour d’elle. Quelques travaux sur lesquels nous nous appuyons :',
          ],
        },
        {
          heading: 'Ce que vous obtenez',
          items: [
            'Des fiches à imprimer du CP au CE2 : tables de multiplication, additions et soustractions, addition posée, multiplication posée, comparaison de nombres, arrondi et suites de nombres.',
            'Un explorateur d’équations à l’écran pour manipuler des équations et vérifier les réponses sur une droite numérique.',
            'Une difficulté réglable : plages de nombres, chiffres, colonnes et disposition, mémorisés sur votre appareil pour la prochaine fois.',
            'Pas de compte, pas d’inscription, pas de publicité, aucun coût. Rien n’est envoyé : les fiches sont générées dans votre navigateur.',
          ],
        },
        {
          heading: 'Comment l’utiliser',
          items: [
            'Choisissez une fiche dans le catalogue.',
            'Ajustez les réglages selon ce que votre enfant travaille.',
            'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer.',
          ],
        },
        {
          heading: 'Open source',
          paragraphs: [
            'Les fiches et le site sont publiés sous licence {license}. Vous pouvez les utiliser, les partager et les adapter à des fins non commerciales en citant la source. Les rapports de bugs et les idées de nouvelles fiches sont les bienvenus.',
          ],
        },
        {
          heading: 'Qui gère le site',
          paragraphs: [
            '{brand} est exploité par {operator}. Consultez la [Politique de confidentialité](/privacy) et les [Conditions d’utilisation](/terms). Questions et suggestions : {contact}.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Politique de confidentialité',
      navLabel: 'Confidentialité',
      description: 'Politique de confidentialité de {brand} : pas de compte, rien n’est envoyé, les réglages restent dans votre navigateur, et Google Analytics sans cookies avec consentement refusé par défaut.',
      sections: [
        {
          heading: 'En résumé',
          paragraphs: [
            '{brand} est exploité par {operator} (« nous »). Ce site n’a ni comptes, ni formulaires d’inscription, ni espaces de commentaires. Les fiches sont entièrement générées dans votre navigateur ; rien de ce que vous saisissez ou imprimez ne nous est envoyé. Le seul service tiers qui reçoit des informations d’utilisation est Google Analytics, sous la forme anonymisée et sans cookies décrite ci-dessous.',
          ],
        },
        {
          heading: 'Ce que nous ne collectons pas',
          items: [
            'Aucun nom, adresse e-mail ou autre donnée personnelle : il n’y a rien à quoi s’inscrire.',
            'Aucun contenu de fiche : les problèmes de chaque fiche sont générés sur votre appareil et ne sont jamais envoyés.',
            'Aucun identifiant publicitaire, aucun réseau publicitaire, aucun pixel de suivi.',
          ],
        },
        {
          heading: 'Réglages enregistrés dans votre navigateur',
          paragraphs: [
            'Vos réglages de fiches (par exemple la plage de nombres ou la disposition choisie) et la dernière fiche ouverte sont enregistrés dans le stockage local de votre navigateur pour que le site reprenne là où vous vous étiez arrêté. Ces données restent sur votre appareil, ne nous sont jamais transmises et peuvent être supprimées à tout moment en effaçant les données de site de ce site web dans votre navigateur.',
          ],
        },
        {
          heading: 'Statistiques',
          paragraphs: [
            'Nous utilisons Google Analytics 4, un service de Google LLC, pour comprendre quelles fiches sont utilisées et comment le site est trouvé. Le mode de consentement de Google est configuré avec le stockage à des fins d’analyse et de publicité refusé par défaut, et nous n’affichons pas de bandeau de consentement puisqu’aucun consentement n’est demandé : Google Analytics fonctionne en mode sans cookies et ne dépose aucun cookie d’analyse sur votre appareil.',
            'Dans ce mode, Google ne reçoit que des signaux anonymisés et agrégés : pages vues, fiche ouverte, moment où une fiche a été régénérée ou imprimée et réglages actifs, ainsi que des détails techniques comme le type de navigateur, la région approximative et le site référent. Les adresses IP sont anonymisées, et Google Signals ainsi que les fonctions publicitaires sont désactivés. Nous n’utilisons pas les données statistiques pour identifier qui que ce soit et ne les partageons jamais avec des annonceurs.',
            'Vous pouvez bloquer entièrement les statistiques avec la protection contre le pistage de votre navigateur, un bloqueur de contenu ou le [module complémentaire de désactivation de Google Analytics](https://tools.google.com/dlpage/gaoptout). Pour savoir comment Google traite les données, consultez les [Règles de confidentialité de Google](https://policies.google.com/privacy).',
          ],
        },
        {
          heading: 'Hébergement et polices',
          paragraphs: [
            'Le site est hébergé sur Vercel et ses polices sont chargées depuis Google Fonts. Comme tout serveur web, ces prestataires voient les détails techniques de chaque requête (comme votre adresse IP et votre type de navigateur) pour livrer la page. Nous ne recevons ni ne conservons ces journaux. Consultez la [Politique de confidentialité de Vercel](https://vercel.com/legal/privacy-policy) et les [informations de confidentialité de Google Fonts](https://developers.google.com/fonts/faq/privacy).',
          ],
        },
        {
          heading: 'Enfants',
          paragraphs: [
            '{brand} crée des fiches pour des enfants d’environ 6 à 9 ans, mais le site s’adresse aux adultes qui les impriment. Nous ne collectons sciemment aucune information personnelle, y compris auprès d’enfants, et le site ne contient ni comptes, ni messagerie, ni contenu généré par les utilisateurs.',
          ],
        },
        {
          heading: 'Modifications de cette politique',
          paragraphs: [
            'Si nous ajoutons un jour une fonctionnalité qui change la façon dont le site traite les données, nous mettrons à jour cette page et la date en haut. Continuer à utiliser le site après une modification vaut acceptation de la politique mise à jour.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions sur la confidentialité : {contact}.',
          ],
        },
      ],
    },
    terms: {
      title: 'Conditions d’utilisation',
      navLabel: 'Conditions',
      description: 'Conditions d’utilisation de {brand} : un service gratuit sans compte, des fiches pour un usage personnel et en classe, un contenu sous licence {license}, fourni en l’état.',
      sections: [
        {
          heading: 'Le service',
          paragraphs: [
            '{brand} est un site web gratuit exploité par {operator} (« nous ») qui génère des fiches de mathématiques à imprimer dans votre navigateur. Il n’y a ni compte à créer, ni abonnement, ni frais. En utilisant le site, vous acceptez ces conditions ; si vous ne les acceptez pas, merci de ne pas utiliser le site.',
          ],
        },
        {
          heading: 'Utilisation des fiches',
          paragraphs: [
            'Vous pouvez générer, imprimer, copier et partager autant de fiches que vous le souhaitez pour un usage personnel, l’instruction en famille, la classe et tout autre usage non commercial.',
            'Les fiches, le contenu du site et le code source sont sous licence {license} : vous pouvez les partager et les adapter à des fins non commerciales à condition de créditer {brand}. La vente des fiches, ou leur inclusion dans un produit ou service payant, nécessite notre autorisation écrite.',
          ],
        },
        {
          heading: 'Usage acceptable',
          items: [
            'N’utilisez pas le site d’une manière qui enfreint la loi ou porte atteinte aux droits d’autrui.',
            'Ne tentez pas de perturber le site, de le surcharger de requêtes automatisées ou de gêner son utilisation par d’autres personnes.',
            'Ne retirez pas l’attribution des copies ou adaptations que vous distribuez.',
          ],
        },
        {
          heading: 'Absence de garantie',
          paragraphs: [
            'Le site et les fiches sont fournis « en l’état » et « selon disponibilité », sans garantie d’aucune sorte. Les problèmes sont générés aléatoirement et, bien que nous les testions, une fiche peut contenir une erreur ou ne pas convenir à un programme particulier. Vérifiez les réponses avant de vous y fier, et jugez par vous-même de ce qui convient à votre enfant ou à votre classe.',
          ],
        },
        {
          heading: 'Limitation de responsabilité',
          paragraphs: [
            'Dans toute la mesure permise par la loi, {operator} n’est pas responsable des pertes indirectes, accessoires ou consécutives découlant de votre utilisation du site ou de votre impossibilité de l’utiliser. Le service étant gratuit, notre responsabilité totale pour toute réclamation le concernant est limitée au montant que vous avez payé, c’est-à-dire rien.',
          ],
        },
        {
          heading: 'Services et liens tiers',
          paragraphs: [
            'Le site renvoie vers des services externes comme {github} et utilise Google Analytics comme décrit dans la [Politique de confidentialité](/privacy). Nous ne sommes pas responsables du contenu ni des pratiques des sites tiers.',
          ],
        },
        {
          heading: 'Modifications et disponibilité',
          paragraphs: [
            'Nous pouvons modifier, suspendre ou arrêter le site ou n’importe quelle fiche à tout moment, et mettre à jour ces conditions en publiant une nouvelle version sur cette page. Continuer à utiliser le site après une modification vaut acceptation des conditions mises à jour.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [
            'Questions sur ces conditions : {contact}.',
          ],
        },
      ],
    },
  },
}
