/** French messages. Same key set as en.js plus `worksheets.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Fiches de maths à imprimer pour le CP, CE1 et CE2',
    description: 'MathSheets : fiches de mathématiques gratuites, imprimables et aléatoires pour les 6–9 ans (CP à CE2). Tables de multiplication, additions et soustractions, addition posée, multiplication posée, comparaison, arrondi, suites de nombres et un explorateur d’équations interactif.',
    brandAlt: 'Fiches de maths',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    developersTitle: 'Ressources pour développeurs · {brand}',
    worksheetTitle: 'Fiches {label} · {brand}',
    developersDescription: 'Ressources {brand} pour développeurs : dépôt open source, catalogue JSON des fiches, négociation de contenu Markdown, llms.txt et sitemap.',
    worksheetDescription: 'Fiches gratuites à imprimer « {labelLower} » pour les niveaux {grades}. {shortDesc}. Nouveaux exercices à chaque fois, tient sur une page.',
    gradeOne: 'Niveau {grades}',
    gradeRange: 'Niveaux {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Aperçu de la fiche {label} – {brand}',
    ogAltDevelopers: 'Ressources {brand} pour développeurs',
    worksheetHeading: 'Fiches {label}',
    worksheetName: '{brand} {label}',
    developersHeading: 'Ressources {brand} pour développeurs',
    developersCrumb: 'Ressources pour développeurs',
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
      howToUseWorksheet: 'Comment utiliser cette fiche',
      howToUseActivity: 'Comment utiliser cette activité',
      step1: 'Ouvrez {url} (JavaScript requis).',
      step2: 'Ajustez les réglages ci-dessus ; ils sont enregistrés dans votre navigateur.',
      step3Printable: 'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer.',
      step3Interactive: 'Tapez la réponse et cliquez sur Vérifier ; cliquez sur Suivant pour une nouvelle équation.',
      others: 'Autres fiches {brand}',
      partOf: 'Fait partie de {link}.',
      url: 'URL',
    },
    developers: {
      subtitle: 'Open source, lisible par les machines et accueillant pour les agents.',
      intro: '{brand} (aussi appelé « {brandAlt} ») est une application monopage React 19 + Vite. Il n’y a pas d’API serveur : les fiches sont générées côté client. Tout ce qui suit est statique et peut être mis en cache.',
      resources: 'Ressources',
      sourceLink: 'Code source sur GitHub',
      catalogDesc: 'catalogue lisible par les machines de toutes les fiches avec slugs, URL, niveaux, compétences et réglages',
      llmsDesc: 'index llmstxt.org et contenu complet pour les modèles de langage',
      indexMdDesc: 'ce site en Markdown ; chaque page HTML a un jumeau {code}',
      negotiationHeading: 'Négociation de contenu Markdown',
      negotiationText: 'Chaque URL de page répond à {accept} avec {contentType} et {vary}, selon la convention acceptmarkdown.com. Les réponses HTML portent un en-tête {link} qui pointe vers le jumeau. Les chemins inconnus renvoient un HTTP 404 avec un corps Markdown indiquant où chercher.',
      languagesHeading: 'Langues',
      languagesText: 'Les pages en anglais sont à la racine du site. Les mêmes pages existent en {languages} sous un préfixe de deux lettres (par exemple {example}) ; chaque page relie toutes ses traductions par hreflang et les liste dans le sitemap. llms.txt et llms-full.txt sont uniquement en anglais.',
      idsHeading: 'Identifiants et URL des fiches',
      addingHeading: 'Ajouter une fiche',
      adding1: 'Ajoutez une entrée dans {file} (id, slug, libellé, descriptions, niveaux, compétences, réglages) et ses traductions dans {messages}.',
      adding2: 'Créez le composant dans {dir} et enregistrez-le dans les tables {components} et {icons} de {app}.',
      adding3: 'Lancez {test} et {build} ; les pages statiques, les jumeaux Markdown, le sitemap, llms.txt et le catalogue JSON sont régénérés depuis le catalogue.',
    },
    agentLinks: {
      text: 'Chaque page existe aussi en Markdown : ajoutez {code} au chemin ou envoyez {accept}. Voir {llms}, le {catalog}, le {sitemap} et les {developers}. Le code source est sur {github} sous licence {license}.',
      llms: 'llms.txt',
      catalog: 'catalogue des fiches (JSON)',
      sitemap: 'sitemap',
      developers: 'ressources pour développeurs',
      github: 'GitHub',
    },
  },

  md: {
    agentIntro: 'Chaque page existe aussi en Markdown : ajoutez `.md` au chemin ou demandez-la avec `Accept: text/markdown`.',
    llmsNote: 'index pour les modèles de langage',
    catalogNote: 'catalogue des fiches lisible par les machines',
    developersLink: 'Ressources pour développeurs',
    sitemapLink: 'Sitemap',
    sourceLink: 'Code source sur GitHub',
    homeIntro: '{brand} est un générateur gratuit et open source de fiches de mathématiques à imprimer pour les 6–9 ans (CP à CE2). Chaque fiche est tirée au sort à chaque ouverture ou régénération. Choisissez une fiche, réglez la difficulté (plage de nombres, chiffres, disposition, colonnes) et imprimez-la depuis le navigateur ; les réglages sont mémorisés par appareil. Les fiches sont générées côté client : pas de compte, pas d’envoi, aucun coût.',
    worksheetItem: '{link} : {shortDesc} (niveaux {grades})',
    howItWorks: 'Comment ça marche',
    step1: 'Choisissez une fiche.',
    step2: 'Réglez la difficulté : limite des nombres, chiffres, colonnes ou niveau.',
    step3: 'Cliquez sur Régénérer pour un nouveau tirage, puis sur Imprimer. Les fiches tiennent sur une page A4 ou Letter.',
    forDevelopers: 'Pour les développeurs et les agents IA',
    howToUse: 'Mode d’emploi',
    wsStep1: 'Ouvrez {url} (JavaScript requis).',
    wsStep2: 'Ajustez les réglages ; ils sont enregistrés dans le navigateur.',
    developersIntro: '{brand} (aussi appelé « {brandAlt} ») est une application monopage open source React 19 + Vite qui génère des fiches de maths à imprimer côté client. Il n’y a pas d’API serveur ; chaque ressource ci-dessous est un fichier statique.',
    devCatalogNote: 'catalogue lisible par les machines de toutes les fiches (slug, URL, URL Markdown, niveaux, compétences, réglages)',
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
    developers: 'Ressources pour développeurs',
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
  },

  common: {
    regenerate: 'Régénérer',
    print: 'Imprimer',
    columns: 'Colonnes',
    limit: 'Limite',
    range: 'Plage',
    operation: 'Opération',
    layout: 'Disposition',
    difficulty: 'Difficulté',
    numberSize: 'Taille des nombres',
    within: 'Jusqu’à {n}',
    withinMeta: 'jusqu’à {n}',
  },

  multiply: {
    to: 'à',
    rangeStart: 'Début de la plage',
    rangeEnd: 'Fin de la plage',
    fillDiagonal: 'Remplir la diagonale',
    prefill: 'Pré-remplir {pct} %',
    tableAria: 'Table de multiplication',
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
    },
    patterns: {
      label: 'Suites',
      shortDesc: 'Suites et séries de nombres',
      longDesc: 'Des suites de nombres à compléter, sur trois niveaux de difficulté : pas constant (facile), pas multiplicatif ou alterné (moyen) et règles combinées (difficile). Les enfants trouvent la règle et remplissent les trous, ce qui développe une pensée algébrique précoce.',
      skills: ['suites de nombres', 'comptage par sauts', 'séquences', 'pensée algébrique'],
      settings: [
        'Niveau : facile, moyen ou difficile',
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
            'Le code source est sur {github} sous licence {license}. Vous pouvez utiliser, partager et adapter les fiches et le code à des fins non commerciales en citant la source. Les rapports de bugs et les idées de nouvelles fiches sont les bienvenus.',
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
