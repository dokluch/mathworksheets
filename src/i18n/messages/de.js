/** German messages. Same key set as en.js plus `worksheets.<id>` and `pages.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3',
    description: 'MathSheets: kostenlose, zufällig erzeugte Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3. Einmaleins, Addition und Subtraktion, schriftliche Addition, schriftliche Multiplikation, Zahlenvergleich, Runden, Zahlenfolgen und ein interaktiver Gleichungs-Explorer.',
    brandAlt: 'Mathe-Arbeitsblätter',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    developersTitle: 'Ressourcen für Entwickler · {brand}',
    worksheetTitle: 'Arbeitsblätter {label} · {brand}',
    developersDescription: '{brand}-Ressourcen für Entwickler: Open-Source-Repository, JSON-Katalog der Arbeitsblätter, Markdown-Inhaltsaushandlung, llms.txt und Sitemap.',
    worksheetDescription: 'Kostenlose {label}-Arbeitsblätter zum Ausdrucken für die Klassen {grades}. {shortDesc}. Jedes Mal neu gemischt, passt auf eine Seite.',
    gradeOne: 'Klasse {grades}',
    gradeRange: 'Klassen {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Vorschau des Arbeitsblatts {label} – {brand}',
    ogAltDevelopers: '{brand}-Ressourcen für Entwickler',
    worksheetHeading: 'Arbeitsblätter {label}',
    worksheetName: '{brand} {label}',
    developersHeading: '{brand} – Ressourcen für Entwickler',
    developersCrumb: 'Ressourcen für Entwickler',
    worksheetList: '{brand}-Arbeitsblätter',
    learningResourceWorksheet: 'Arbeitsblatt',
    learningResourceInteractive: 'Interaktive Übung',
    featureItem: '{label}: {shortDesc}',
  },

  static: {
    breadcrumb: 'Brotkrumennavigation',
    worksheetTypes: 'Arten von Arbeitsblättern',
    lastUpdated: 'Zuletzt aktualisiert am {date}',
    footerSite: 'Website',
    home: {
      subtitle: 'Kostenlose, zufällig erzeugte Übungsblätter, die du mit einem Klick ausdruckst.',
      intro1: '{brand} ist ein kostenloser Open-Source-Generator für Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3 (6–9 Jahre). Jedes Blatt wird bei jedem Öffnen oder Neu-Erzeugen zufällig zusammengestellt, sodass Kinder frische Aufgaben üben, statt eine Seite auswendig zu lernen. Wähle ein Arbeitsblatt, stelle den Schwierigkeitsgrad ein (Zahlenraum, Stellen, Layout, Spalten) und drucke es aus dem Browser; deine Einstellungen werden auf diesem Gerät gespeichert.',
      intro2: 'Der Katalog umfasst Einmaleins-Tabellen, Additions- und Subtraktionsaufgaben mit Lücken, schriftliche Addition mit Übertrag, schriftliche Multiplikation, Zahlenvergleich mit >, < und =, Runden auf Zehner, Hunderter und Tausender sowie Zahlenfolgen. Der Gleichungs-Explorer ist eine Bildschirmübung, bei der Kinder Terme über das Gleichheitszeichen schieben und ihre Antwort am Zahlenstrahl überprüfen.',
      worksheets: 'Arbeitsblätter',
      howItWorks: 'So funktioniert es',
      step1: 'Wähle ein Arbeitsblatt aus der Liste oben.',
      step2: 'Stelle den Schwierigkeitsgrad ein: Zahlenraum, Stellen, Spalten oder Stufe.',
      step3: 'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken. Die Blätter passen auf eine A4- oder Letter-Seite.',
      audienceHeading: 'Für Lehrkräfte, Eltern und KI-Agenten',
      audienceText: 'Die Arbeitsblätter werden im Browser erzeugt: Nichts wird hochgeladen, es gibt kein Konto und keine Kosten. {brand} wurde von einem Elternteil als Ergänzung zum Mathe-Lehrplan der Klassen 1–3 entwickelt und darf für nicht-kommerzielle Zwecke frei genutzt und angepasst werden.',
    },
    worksheet: {
      skills: 'Fähigkeiten',
      format: 'Format',
      formatInteractive: 'interaktiv, am Bildschirm',
      formatPrintable: 'zum Ausdrucken, bei jedem Laden neu gemischt',
      settings: 'Einstellungen',
      howToUseWorksheet: 'So verwendest du dieses Arbeitsblatt',
      howToUseActivity: 'So verwendest du diese Übung',
      step1: 'Öffne {url} (JavaScript erforderlich).',
      step2: 'Passe die Einstellungen oben an; sie werden in deinem Browser gespeichert.',
      step3Printable: 'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken.',
      step3Interactive: 'Gib die Antwort ein und klicke auf Prüfen; klicke auf Weiter für eine neue Gleichung.',
      others: 'Weitere {brand}-Arbeitsblätter',
      partOf: 'Teil von {link}.',
      url: 'URL',
    },
    developers: {
      subtitle: 'Open Source, maschinenlesbar und agentenfreundlich.',
      intro: '{brand} (auch „{brandAlt}“) ist eine Single-Page-App mit React 19 + Vite. Es gibt keine Server-API: Die Arbeitsblätter werden clientseitig erzeugt. Alles Folgende ist statisch und cachebar.',
      resources: 'Ressourcen',
      sourceLink: 'Quellcode auf GitHub',
      catalogDesc: 'maschinenlesbarer Katalog aller Arbeitsblätter mit Slugs, URLs, Klassen, Fähigkeiten und Einstellungen',
      llmsDesc: 'llmstxt.org-Index und vollständiger Inhalt für Sprachmodelle',
      indexMdDesc: 'diese Website als Markdown; jede HTML-Seite hat einen {code}-Zwilling',
      negotiationHeading: 'Markdown-Inhaltsaushandlung',
      negotiationText: 'Jede Seiten-URL beantwortet {accept} mit {contentType} und {vary} nach der Konvention von acceptmarkdown.com. HTML-Antworten tragen einen {link}-Header, der auf den Zwilling zeigt. Unbekannte Pfade liefern HTTP 404 mit einem Markdown-Text, der zeigt, wo man weitersuchen kann.',
      languagesHeading: 'Sprachen',
      languagesText: 'Englische Seiten liegen im Stammverzeichnis der Website. Dieselben Seiten gibt es auf {languages} unter einem zweibuchstabigen Pfadpräfix (zum Beispiel {example}); jede Seite verlinkt alle Übersetzungen per hreflang und führt sie in der Sitemap auf. llms.txt und llms-full.txt gibt es nur auf Englisch.',
      idsHeading: 'IDs und URLs der Arbeitsblätter',
      addingHeading: 'Ein Arbeitsblatt hinzufügen',
      adding1: 'Füge einen Eintrag in {file} hinzu (id, slug, label, Beschreibungen, Klassen, Fähigkeiten, Einstellungen) und seine Übersetzungen in {messages}.',
      adding2: 'Erstelle die Komponente in {dir} und registriere sie in den Maps {components} und {icons} in {app}.',
      adding3: 'Führe {test} und {build} aus; die statischen Seiten, Markdown-Zwillinge, Sitemap, llms.txt und der JSON-Katalog werden aus dem Katalog neu erzeugt.',
    },
    agentLinks: {
      text: 'Jede Seite gibt es auch als Markdown: Hänge {code} an den Pfad an oder sende {accept}. Siehe {llms}, den {catalog}, die {sitemap} und die {developers}. Der Quellcode liegt auf {github} unter {license}.',
      llms: 'llms.txt',
      catalog: 'Arbeitsblatt-Katalog (JSON)',
      sitemap: 'Sitemap',
      developers: 'Ressourcen für Entwickler',
      github: 'GitHub',
    },
  },

  md: {
    agentIntro: 'Jede Seite gibt es auch als Markdown: Hänge `.md` an den Pfad an oder fordere sie mit `Accept: text/markdown` an.',
    llmsNote: 'Index für Sprachmodelle',
    catalogNote: 'maschinenlesbarer Arbeitsblatt-Katalog',
    developersLink: 'Ressourcen für Entwickler',
    sitemapLink: 'Sitemap',
    sourceLink: 'Quellcode auf GitHub',
    homeIntro: '{brand} ist ein kostenloser Open-Source-Generator für Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3 (6–9 Jahre). Jedes Blatt wird bei jedem Öffnen oder Neu-Erzeugen zufällig zusammengestellt. Wähle ein Arbeitsblatt, stelle den Schwierigkeitsgrad ein (Zahlenraum, Stellen, Layout, Spalten) und drucke es aus dem Browser; die Einstellungen werden pro Gerät gespeichert. Die Arbeitsblätter entstehen clientseitig: kein Konto, kein Upload, keine Kosten.',
    worksheetItem: '{link}: {shortDesc} (Klassen {grades})',
    howItWorks: 'So funktioniert es',
    step1: 'Wähle ein Arbeitsblatt.',
    step2: 'Stelle den Schwierigkeitsgrad ein: Zahlenraum, Stellen, Spalten oder Stufe.',
    step3: 'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken. Die Blätter passen auf eine A4- oder Letter-Seite.',
    forDevelopers: 'Für Entwickler und KI-Agenten',
    howToUse: 'Anleitung',
    wsStep1: 'Öffne {url} (JavaScript erforderlich).',
    wsStep2: 'Passe die Einstellungen an; sie werden im Browser gespeichert.',
    developersIntro: '{brand} (auch „{brandAlt}“) ist eine Open-Source-Single-Page-App mit React 19 + Vite, die Mathe-Arbeitsblätter zum Ausdrucken clientseitig erzeugt. Es gibt keine Server-API; jede Ressource unten ist eine statische Datei.',
    devCatalogNote: 'maschinenlesbarer Katalog aller Arbeitsblätter (Slug, URL, Markdown-URL, Klassen, Fähigkeiten, Einstellungen)',
    devLlmsNote: 'llmstxt.org-Index',
    devLlmsFullNote: 'das Markdown aller Seiten in einer Datei',
    devIndexNote: 'die Startseite als Markdown',
    negotiationText: 'Jede Seiten-URL beantwortet `Accept: text/markdown` mit `Content-Type: text/markdown; charset=utf-8` und `Vary: Accept` (Konvention von acceptmarkdown.com). HTML-Antworten tragen `Link: <…md>; rel="alternate"; type="text/markdown"`. Anfragen, die weder HTML noch Markdown akzeptieren, erhalten `406 Not Acceptable`. Unbekannte Pfade liefern HTTP 404 mit einem Markdown-Text, der zeigt, wo man weitersuchen kann.',
    languagesText: 'Englische Seiten liegen im Stammverzeichnis der Website; dieselben Seiten gibt es auf {languages} unter einem zweibuchstabigen Präfix (zum Beispiel {example}). Jede Seite verlinkt ihre Übersetzungen per hreflang.',
    adding1: 'Füge einen Eintrag in `src/worksheets.js` hinzu (id, slug, label, Beschreibungen, Klassen, Fähigkeiten, Einstellungen) und seine Übersetzungen in `src/i18n/messages/<locale>.js`.',
    adding2: 'Erstelle die Komponente in `src/components/` und registriere sie in den Maps `COMPONENTS` und `ICONS` in `src/App.jsx`.',
    adding3: 'Führe `npm test` und `npm run build` aus; statische Seiten, Markdown-Zwillinge, Sitemap, llms.txt und der JSON-Katalog werden aus dem Katalog neu erzeugt.',
    markdownLink: 'Markdown',
    lastUpdated: 'Zuletzt aktualisiert',
    moreFrom: 'Mehr von {brand}',
    homeLink: '{brand}-Startseite',
  },

  llms: {
    optionalLocale: 'Startseite auf {language}',
  },

  notFound: {
    title: '404 – Seite nicht gefunden',
    body: 'Der Pfad {path}existiert auf {site} nicht. Diese Antwort hat den HTTP-Status 404.',
    whereNext: 'Wo du weitersuchen kannst',
    home: '{brand}-Startseite',
    worksheet: 'Arbeitsblätter {label}',
    developers: 'Ressourcen für Entwickler',
    sitemap: 'Sitemap',
    llms: 'llms.txt',
    catalog: 'Arbeitsblatt-Katalog (JSON)',
    twinMd: 'Jede HTML-Seite hat auch einen Markdown-Zwilling (hänge `.md` an oder sende `Accept: text/markdown`).',
    twinHtml: 'Jede Seite hat auch einen Markdown-Zwilling: Hänge {code} an oder sende {accept}.',
  },

  app: {
    subtitle: 'Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3',
    allSheets: 'Alle Blätter',
    worksheetTypes: 'Arten von Arbeitsblättern',
    sourceOnGitHub: 'Quellcode auf GitHub',
    language: 'Sprache',
  },

  common: {
    regenerate: 'Neu erzeugen',
    print: 'Drucken',
    printWorksheet: 'Arbeitsblatt drucken',
    columns: 'Spalten',
    limit: 'Zahlenraum',
    range: 'Bereich',
    operation: 'Rechenart',
    layout: 'Layout',
    difficulty: 'Schwierigkeit',
    numberSize: 'Zahlengröße',
    within: 'Bis {n}',
    withinMeta: 'bis {n}',
  },

  multiply: {
    to: 'bis',
    rangeStart: 'Anfang des Bereichs',
    rangeEnd: 'Ende des Bereichs',
    fillDiagonal: 'Diagonale ausfüllen',
    prefill: 'Vorausfüllen {pct} %',
    tableAria: 'Einmaleins-Tabelle',
  },

  addsub: {
    inline: 'In einer Zeile',
    stacked: 'Untereinander',
    sixtySeven: '67-Modus',
    title: 'Addition und Subtraktion',
  },

  coladd: {
    digitPreset: '{d}-stellig',
    preferCarry: 'Übertrag bevorzugen',
    title: 'Schriftliche Addition',
    meta: '{d}-stellige Zahlen',
  },

  colmul: {
    preset: '{a} × {b} Stellen',
    title: 'Schriftliche Multiplikation',
    meta: 'schriftliche Multiplikation · {preset}',
    problemAria: '{a} mal {b}',
  },

  compare: {
    title: 'Zahlenvergleich',
  },

  rounding: {
    roundTo: 'Runden auf',
    nearest: 'Auf {n}',
    title: 'Runden',
    meta: 'auf {n} runden',
  },

  patterns: {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    title: 'Zahlenfolgen',
    instructions: 'Trage die fehlenden Zahlen in jeder Folge ein.',
  },

  eq: {
    newProblem: 'Neu',
    streak: { one: '{n} in Folge', other: '{n} in Folge' },
    hint: 'Tipp: Ziehe eine Zahl über das =-Zeichen, um umzustellen',
    reset: 'Gleichung zurücksetzen',
    check: 'Prüfen',
    next: 'Weiter',
    keypad: 'Zifferntastatur',
    backspace: 'Letzte Ziffer löschen',
    clear: 'Alles löschen',
    yourAnswer: 'Deine Antwort',
    drag: '{n} ziehen, um die Gleichung umzustellen',
    numberLineAria: 'Zahlenstrahl mit {a} {op} {b} = {result}',
    correct: 'Richtig!',
    wrong: 'Nicht ganz – versuch es noch einmal oder schau dir unten die Erklärung an',
    numberLine: 'Zahlenstrahl',
    tenFrame: 'Zehnerfeld',
    replay: 'Wiederholen',
    gotIt: 'Verstanden',
  },

  error: {
    title: 'Etwas ist schiefgelaufen',
    hint: 'Lade die Seite neu.',
    reload: 'Neu laden',
  },

  worksheets: {
    multiply: {
      label: 'Multiplikation',
      shortDesc: 'Einmaleins und Tabellen üben',
      longDesc: 'Eine Einmaleins-Tabelle für einen beliebigen Bereich von Faktoren, mit optional vorausgefüllten Feldern, damit Kinder Muster erkennen, bevor sie den Rest ausfüllen. Nützlich, um das Einmaleins auswendig zu lernen, das Abruftempo zu prüfen und das Kommutativgesetz zu üben (3 × 4 = 4 × 3).',
      skills: ['Einmaleins', 'Multiplikationsaufgaben', 'Zahlenmuster'],
      settings: [
        'Bereich der Tabelle: ersten und letzten Faktor wählen',
        'Diagonale vorausfüllen (1×1, 2×2, …)',
        'Anteil zufällig vorausgefüllter Felder',
      ],
    },
    addsub: {
      label: 'Plus und Minus',
      shortDesc: 'Additions- und Subtraktionsübungen',
      longDesc: 'Zufällige Additions- und Subtraktionsaufgaben bis 10, 20, 100 oder 1000, bei denen die Lücke an einer zufälligen Stelle steht (a + □ = c, □ − b = c, a − b = □). Wähle das Layout in einer Zeile oder untereinander und 2 bis 4 Spalten; der „67-Modus“ versteckt in jeder Spalte genau eine Aufgabe mit dem Ergebnis 67 – eine kleine Schatzsuche.',
      skills: ['Addition', 'Subtraktion', 'fehlender Summand', 'Kopfrechnen'],
      settings: [
        'Rechenart: Addition, Subtraktion oder beides',
        'Zahlenraum: bis 10, 20, 100 oder 1000',
        'Layout: in einer Zeile oder untereinander (senkrecht)',
        'Spalten: 2, 3 oder 4 (20–40 Aufgaben)',
        '67-Modus: ein verstecktes Ergebnis 67 pro Spalte',
      ],
    },
    coladd: {
      label: 'Schriftliche Addition',
      shortDesc: 'Mehrstellige Zahlen untereinander addieren',
      longDesc: 'Schriftliche Addition von 2-, 3- oder 4-stelligen Zahlen auf einem Rechenkaro-Raster, eine Ziffer pro Kästchen, damit Kinder das Ausrichten der Stellenwerte und den Übertrag üben. Die Option „Übertrag bevorzugen“ erzeugt Aufgaben, die mindestens einen Übertrag brauchen.',
      skills: ['schriftliche Addition', 'Übertrag', 'Stellenwert'],
      settings: [
        'Stellen: 2-, 3- oder 4-stellige Zahlen',
        'Spalten: Anzahl der Aufgabenspalten pro Seite',
        'Aufgaben mit Übertrag bevorzugen',
      ],
    },
    colmul: {
      label: 'Schriftliche Multiplikation',
      shortDesc: 'Schriftliches Multiplizieren üben',
      longDesc: 'Schriftliche Multiplikation (2 × 2, 3 × 2 oder 4 × 2 Stellen) mit Platz für die Teilprodukte und ihre Stellenverschiebung, gedruckt auf einem Rechenkaro-Raster. Gedacht für Kinder der 3. Klasse, die das Einmaleins bereits beherrschen und das schriftliche Verfahren lernen.',
      skills: ['schriftliche Multiplikation', 'Teilprodukte', 'Stellenwert'],
      settings: [
        'Voreinstellung: 2 × 2, 3 × 2 oder 4 × 2 Stellen',
        'Spalten: Anzahl der Aufgabenspalten pro Seite',
      ],
    },
    compare: {
      label: 'Zahlenvergleich',
      shortDesc: 'Größer als, kleiner als, gleich',
      longDesc: 'Zahlenpaare, die mit >, < oder = verglichen werden. Der Generator wählt absichtlich knifflige Paare: vertauschte Ziffern (43 und 34), wiederholte Ziffern, direkte Nachbarn und etwa 15 % gleiche Paare, damit Kinder jede Ziffer lesen, statt nach der ersten zu raten.',
      skills: ['Zahlen vergleichen', 'Stellenwert', 'Vergleichszeichen'],
      settings: [
        'Zahlenraum: bis 10, 20, 100 oder 1000',
        'Spalten: Anzahl der Aufgabenspalten pro Seite',
      ],
    },
    rounding: {
      label: 'Runden',
      shortDesc: 'Rundung auf Zehner, Hunderter, Tausender',
      longDesc: 'Rundungsübungen auf Zehner, Hunderter oder Tausender mit 20–40 zufälligen Zahlen pro Blatt. Die Zahlen sind so gewählt, dass sowohl „aufrunden“ als auch „abrunden“ vorkommt, einschließlich der kniffligen 5-Grenze.',
      skills: ['Rundung', 'Schätzen', 'Stellenwert'],
      settings: [
        'Stelle: Zehner, Hunderter oder Tausender',
        'Spalten: Anzahl der Aufgabenspalten pro Seite',
      ],
    },
    patterns: {
      label: 'Zahlenfolgen',
      shortDesc: 'Zahlenfolgen und Reihen',
      longDesc: 'Zahlenfolgen mit fehlenden Gliedern auf drei Schwierigkeitsstufen: konstanter Schritt (leicht), multiplikativer oder wechselnder Schritt (mittel) und kombinierte Regeln (schwer). Die Kinder finden die Regel und füllen die Lücken – das fördert frühes algebraisches Denken.',
      skills: ['Zahlenmuster', 'Zählen in Schritten', 'Folgen', 'algebraisches Denken'],
      settings: [
        'Stufe: leicht, mittel oder schwer',
      ],
    },
    eqexplore: {
      label: 'Gleichungs-Explorer',
      shortDesc: 'Gleichungen interaktiv lösen',
      longDesc: 'Ein Gleichungslöser am Bildschirm (nicht druckbar): Ziehe Terme über das Gleichheitszeichen und sieh zu, wie das Vorzeichen wechselt, folge den Sprüngen am Zahlenstrahl und tippe die Antwort auf der eingebauten Tastatur ein. Richtige Antworten verlängern die Serie und lösen Konfetti aus; falsche spielen eine animierte Erklärung ab.',
      skills: ['Gleichungen', 'Umkehroperationen', 'Zahlenstrahl', 'Kopfrechnen'],
      settings: [
        'Rechenart: Addition, Subtraktion oder beides',
        'Bereich: Größe der verwendeten Zahlen',
      ],
    },
  },

  pages: {
    about: {
      title: 'Über {brand}',
      navLabel: 'Über uns',
      description: '{brand} ist ein kostenloser Open-Source-Generator für Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3, von einem Elternteil entwickelt, damit jedes Kind kostenlos einfach üben kann.',
      sections: [
        {
          heading: 'Warum es diese Website gibt',
          paragraphs: [
            '{brand} entstand, weil ein Vater für seine Töchter immer wieder frische Mathe-Übungen ausdrucken wollte, ohne sich durch werbeüberladene Arbeitsblatt-Seiten zu klicken oder ein Abo zu bezahlen. Das Ziel ist einfach: kostenlose, unkomplizierte Mathe-Materialien für alle – ob Eltern am Küchentisch, Lehrkräfte bei der Unterrichtsvorbereitung oder Nachhilfe, die noch eine Seite zum Üben braucht.',
            'Jedes Arbeitsblatt wird bei jedem Öffnen oder Neu-Erzeugen zufällig zusammengestellt, sodass Kinder neue Aufgaben bekommen, statt eine einzelne Seite auswendig zu lernen. Die Blätter sind so gestaltet, dass sie sauber auf eine Letter- oder A4-Seite passen.',
          ],
        },
        {
          heading: 'Was du bekommst',
          items: [
            'Arbeitsblätter zum Ausdrucken für die Klassen 1–3: Einmaleins, Addition und Subtraktion, schriftliche Addition, schriftliche Multiplikation, Zahlenvergleich, Runden und Zahlenfolgen.',
            'Einen Gleichungs-Explorer am Bildschirm, um mit Gleichungen zu spielen und Antworten am Zahlenstrahl zu prüfen.',
            'Einstellbare Schwierigkeit: Zahlenräume, Stellen, Spalten und Layout, auf deinem Gerät für das nächste Mal gespeichert.',
            'Kein Konto, keine Anmeldung, keine Werbung, keine Kosten. Nichts wird hochgeladen: Die Arbeitsblätter entstehen in deinem Browser.',
          ],
        },
        {
          heading: 'So geht es',
          items: [
            'Wähle ein Arbeitsblatt aus dem Katalog.',
            'Passe die Einstellungen an das an, was dein Kind gerade übt.',
            'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken.',
          ],
        },
        {
          heading: 'Open Source',
          paragraphs: [
            'Der Quellcode liegt auf {github} unter der Lizenz {license}. Du darfst die Arbeitsblätter und den Code für nicht-kommerzielle Zwecke mit Namensnennung nutzen, teilen und anpassen. Fehlermeldungen und Ideen für neue Arbeitsblätter sind willkommen.',
          ],
        },
        {
          heading: 'Wer dahintersteht',
          paragraphs: [
            '{brand} wird von {operator} betrieben. Siehe die [Datenschutzerklärung](/privacy) und die [Nutzungsbedingungen](/terms). Fragen und Vorschläge: {contact}.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Datenschutzerklärung',
      navLabel: 'Datenschutz',
      description: 'Datenschutzerklärung für {brand}: keine Konten, nichts wird hochgeladen, Einstellungen bleiben in deinem Browser, und cookieloses Google Analytics mit standardmäßig verweigerter Einwilligung.',
      sections: [
        {
          heading: 'Zusammenfassung',
          paragraphs: [
            '{brand} wird von {operator} („wir“, „uns“) betrieben. Diese Website hat keine Konten, keine Anmeldeformulare und keine Kommentarbereiche. Die Arbeitsblätter werden vollständig in deinem Browser erzeugt; nichts, was du eingibst oder druckst, wird an uns gesendet. Der einzige Drittanbieter, der Nutzungsinformationen erhält, ist Google Analytics – in der unten beschriebenen cookielosen, anonymisierten Form.',
          ],
        },
        {
          heading: 'Was wir nicht erheben',
          items: [
            'Keine Namen, E-Mail-Adressen oder sonstigen persönlichen Angaben: Es gibt nichts, wofür man sich anmelden müsste.',
            'Keine Inhalte der Arbeitsblätter: Die Aufgaben auf jedem Blatt werden auf deinem Gerät erzeugt und nie hochgeladen.',
            'Keine Werbe-IDs, keine Werbenetzwerke, keine Tracking-Pixel.',
          ],
        },
        {
          heading: 'In deinem Browser gespeicherte Einstellungen',
          paragraphs: [
            'Deine Arbeitsblatt-Einstellungen (zum Beispiel der gewählte Zahlenraum oder das Layout) und das zuletzt geöffnete Arbeitsblatt werden im lokalen Speicher deines Browsers abgelegt, damit die Website dort weitermachen kann, wo du aufgehört hast. Diese Daten bleiben auf deinem Gerät, werden nie an uns übertragen und können jederzeit entfernt werden, indem du die Website-Daten dieser Seite in deinem Browser löschst.',
          ],
        },
        {
          heading: 'Analyse',
          paragraphs: [
            'Wir verwenden Google Analytics 4, einen Dienst von Google LLC, um zu verstehen, welche Arbeitsblätter genutzt werden und wie die Website gefunden wird. Der Google Consent Mode ist so konfiguriert, dass Analyse- und Werbespeicherung standardmäßig verweigert werden, und wir zeigen kein Einwilligungsbanner, weil keine Einwilligung angefragt wird: Google Analytics läuft im cookielosen Modus und setzt keine Analyse-Cookies auf deinem Gerät.',
            'In diesem Modus erhält Google nur anonymisierte, aggregierte Signale: Seitenaufrufe, welches Arbeitsblatt geöffnet wurde, wann ein Arbeitsblatt neu erzeugt oder gedruckt wurde und welche Einstellungen aktiv waren, sowie technische Angaben wie Browsertyp, ungefähre Region und die verweisende Website. IP-Adressen werden anonymisiert, Google-Signale und Werbefunktionen sind ausgeschaltet. Wir nutzen Analysedaten nicht, um jemanden zu identifizieren, und geben sie nie an Werbetreibende weiter.',
            'Du kannst die Analyse vollständig blockieren – mit dem Tracking-Schutz deines Browsers, einem Content-Blocker oder dem [Browser-Add-on zur Deaktivierung von Google Analytics](https://tools.google.com/dlpage/gaoptout). Wie Google Daten verarbeitet, steht in der [Datenschutzerklärung von Google](https://policies.google.com/privacy).',
          ],
        },
        {
          heading: 'Hosting und Schriften',
          paragraphs: [
            'Die Website wird auf Vercel gehostet, ihre Schriften werden von Google Fonts geladen. Wie jeder Webserver sehen diese Anbieter die technischen Details jeder Anfrage (etwa deine IP-Adresse und deinen Browsertyp), um die Seite auszuliefern. Wir erhalten oder speichern diese Anfrageprotokolle nicht. Siehe die [Datenschutzerklärung von Vercel](https://vercel.com/legal/privacy-policy) und die [Datenschutzhinweise zu Google Fonts](https://developers.google.com/fonts/faq/privacy).',
          ],
        },
        {
          heading: 'Kinder',
          paragraphs: [
            '{brand} erstellt Arbeitsblätter für Kinder von etwa 6 bis 9 Jahren, die Website richtet sich aber an die Erwachsenen, die sie ausdrucken. Wir erheben wissentlich keine personenbezogenen Daten – auch nicht von Kindern –, und die Website enthält keine Konten, keine Nachrichtenfunktion und keine nutzergenerierten Inhalte.',
          ],
        },
        {
          heading: 'Änderungen dieser Erklärung',
          paragraphs: [
            'Sollten wir jemals eine Funktion hinzufügen, die den Umgang der Website mit Daten verändert, aktualisieren wir diese Seite und das Datum oben. Wer die Website nach einer Änderung weiter nutzt, akzeptiert die aktualisierte Erklärung.',
          ],
        },
        {
          heading: 'Kontakt',
          paragraphs: [
            'Fragen zum Datenschutz: {contact}.',
          ],
        },
      ],
    },
    terms: {
      title: 'Nutzungsbedingungen',
      navLabel: 'Nutzungsbedingungen',
      description: 'Nutzungsbedingungen für {brand}: ein kostenloser Dienst ohne Konten, Arbeitsblätter für den privaten Gebrauch und den Unterricht, Inhalte unter {license}, bereitgestellt wie besehen.',
      sections: [
        {
          heading: 'Der Dienst',
          paragraphs: [
            '{brand} ist eine kostenlose Website von {operator} („wir“, „uns“), die Mathe-Arbeitsblätter zum Ausdrucken in deinem Browser erzeugt. Es gibt kein Konto, kein Abonnement und keine Gebühr. Mit der Nutzung der Website akzeptierst du diese Bedingungen; wenn du nicht einverstanden bist, nutze die Website bitte nicht.',
          ],
        },
        {
          heading: 'Nutzung der Arbeitsblätter',
          paragraphs: [
            'Du darfst so viele Arbeitsblätter erzeugen, drucken, kopieren und teilen, wie du möchtest – für den privaten Gebrauch, den Heimunterricht, den Unterricht in der Schule und jeden anderen nicht-kommerziellen Zweck.',
            'Die Arbeitsblätter, die Inhalte der Website und der Quellcode stehen unter {license}: Du darfst sie für nicht-kommerzielle Zwecke teilen und anpassen, solange du {brand} als Quelle nennst. Der Verkauf der Arbeitsblätter oder ihre Bündelung in ein kostenpflichtiges Produkt oder eine kostenpflichtige Dienstleistung erfordert unsere schriftliche Zustimmung.',
          ],
        },
        {
          heading: 'Zulässige Nutzung',
          items: [
            'Nutze die Website nicht auf eine Weise, die gegen Gesetze verstößt oder die Rechte anderer verletzt.',
            'Versuche nicht, die Website zu stören, sie mit automatisierten Anfragen zu überlasten oder die Nutzung durch andere zu beeinträchtigen.',
            'Entferne die Quellenangabe nicht aus Kopien oder Bearbeitungen, die du weitergibst.',
          ],
        },
        {
          heading: 'Keine Gewährleistung',
          paragraphs: [
            'Die Website und die Arbeitsblätter werden „wie besehen“ und „wie verfügbar“ ohne jegliche Gewährleistung bereitgestellt. Die Aufgaben werden zufällig erzeugt und können – obwohl wir sie testen – einen Fehler enthalten oder nicht zu einem bestimmten Lehrplan passen. Bitte prüfe Lösungen, bevor du dich auf sie verlässt, und entscheide selbst, was für dein Kind oder deine Klasse richtig ist.',
          ],
        },
        {
          heading: 'Haftungsbeschränkung',
          paragraphs: [
            'Soweit gesetzlich zulässig, haftet {operator} nicht für indirekte, zufällige oder Folgeschäden, die aus der Nutzung oder der Unmöglichkeit der Nutzung der Website entstehen. Da der Dienst kostenlos ist, beschränkt sich unsere Gesamthaftung für jeden Anspruch im Zusammenhang mit ihm auf den Betrag, den du dafür bezahlt hast – also nichts.',
          ],
        },
        {
          heading: 'Dienste und Links Dritter',
          paragraphs: [
            'Die Website verlinkt auf externe Dienste wie {github} und nutzt Google Analytics wie in der [Datenschutzerklärung](/privacy) beschrieben. Für Inhalte und Praktiken fremder Websites sind wir nicht verantwortlich.',
          ],
        },
        {
          heading: 'Änderungen und Verfügbarkeit',
          paragraphs: [
            'Wir können die Website oder einzelne Arbeitsblätter jederzeit ändern, pausieren oder einstellen und diese Bedingungen aktualisieren, indem wir eine neue Fassung auf dieser Seite veröffentlichen. Wer die Website nach einer Änderung weiter nutzt, akzeptiert die aktualisierten Bedingungen.',
          ],
        },
        {
          heading: 'Kontakt',
          paragraphs: [
            'Fragen zu diesen Bedingungen: {contact}.',
          ],
        },
      ],
    },
  },
}
