/** German messages. Same key set as en.js plus `worksheets.<id>` and `pages.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3',
    description: 'Super Awesome Math: kostenlose, zufällig erzeugte Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3. Einmaleins, Addition und Subtraktion, schriftliche Addition, schriftliche Multiplikation, Zahlenvergleich, Runden, Zahlenfolgen und ein interaktiver Gleichungs-Explorer.',
    brandAlt: 'Mathe-Arbeitsblätter',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    worksheetTitle: 'Arbeitsblätter {label} · {brand}',
    worksheetDescription: 'Kostenlose {label}-Arbeitsblätter zum Ausdrucken für die Klassen {grades}. {shortDesc}. Jedes Mal neu gemischt, passt auf eine Seite.',
    gradeOne: 'Klasse {grades}',
    gradeRange: 'Klassen {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Vorschau des Arbeitsblatts {label} – {brand}',
    worksheetHeading: 'Arbeitsblätter {label}',
    worksheetName: '{brand} {label}',
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
      intro2: 'Der Katalog umfasst Einmaleins-Tabellen, Additions- und Subtraktionsaufgaben mit Lücken, schriftliche Addition mit Übertrag, schriftliche Multiplikation, Zahlenvergleich mit >, < und =, Runden auf Zehner, Hunderter und Tausender Zahlenfolgen sowie mehrschrittige Terme, bei denen die Rechenreihenfolge das Ergebnis entscheidet. Der Gleichungs-Explorer ist eine Bildschirmübung, bei der Kinder Terme über das Gleichheitszeichen schieben und ihre Antwort am Zahlenstrahl überprüfen.',
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
      examples: 'Beispielaufgaben',
      faq: 'Häufige Fragen',
      step3Printable: 'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken.',
      step3Interactive: 'Gib die Antwort ein und klicke auf Prüfen; klicke auf Weiter für eine neue Gleichung.',
      others: 'Weitere {brand}-Arbeitsblätter',
      partOf: 'Teil von {link}.',
      url: 'URL',
    },
  },

  md: {
    agentIntro: 'Jede Seite gibt es auch als Markdown: Hänge `.md` an den Pfad an oder fordere sie mit `Accept: text/markdown` an.',
    llmsNote: 'Index für Sprachmodelle',
    catalogNote: 'maschinenlesbarer Arbeitsblatt-Katalog',
    sitemapLink: 'Sitemap',
    homeIntro: '{brand} ist ein kostenloser Open-Source-Generator für Mathe-Arbeitsblätter zum Ausdrucken für die Klassen 1–3 (6–9 Jahre). Jedes Blatt wird bei jedem Öffnen oder Neu-Erzeugen zufällig zusammengestellt. Wähle ein Arbeitsblatt, stelle den Schwierigkeitsgrad ein (Zahlenraum, Stellen, Layout, Spalten) und drucke es aus dem Browser; die Einstellungen werden pro Gerät gespeichert. Die Arbeitsblätter entstehen clientseitig: kein Konto, kein Upload, keine Kosten.',
    worksheetItem: '{link}: {shortDesc} (Klassen {grades})',
    howItWorks: 'So funktioniert es',
    step1: 'Wähle ein Arbeitsblatt.',
    step2: 'Stelle den Schwierigkeitsgrad ein: Zahlenraum, Stellen, Spalten oder Stufe.',
    step3: 'Klicke auf Neu erzeugen für einen neuen Zufallssatz und dann auf Drucken. Die Blätter passen auf eine A4- oder Letter-Seite.',
    forDevelopers: 'Für Entwickler und KI-Agenten',
    howToUse: 'Anleitung',
    wsStep1: 'Öffne {url}.',
    wsStep2: 'Passe die Einstellungen an; sie werden im Browser gespeichert.',
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
    resume: 'Dort weitermachen, wo Sie aufgehört haben',
    skipToContent: 'Zum Inhalt springen',
    gradeFilter: 'Klasse',
    allGrades: 'Alle',
    ages: '{ages} Jahre',
    sheetCount: { one: '{n} Blatt', other: '{n} Blätter' },
  },

  common: {
    regenerate: 'Neu erzeugen',
    print: 'Drucken',
    printWorksheet: 'Arbeitsblatt drucken',
    printFooterTagline: 'Kostenlose Mathe-Materialien zum Ausdrucken',
    screenOnly: "Der Gleichungs-Explorer ist für den Bildschirm gemacht, es gibt nichts zu drucken. Wählen Sie ein anderes Arbeitsblatt für eine druckbare Seite.",
    answerKey: "Lösungsblatt",
    answerKeyOption: "Lösungsblatt drucken",
    columns: 'Spalten',
    limit: 'Zahlenraum',
    range: 'Bereich',
    operation: 'Rechenart',
    layout: 'Layout',
    difficulty: 'Schwierigkeit',
    numberSize: 'Zahlengröße',
    options: 'Optionen',
    within: 'Bis {n}',
    withinMeta: 'bis {n}',
    fieldName: 'Name',
    fieldDate: 'Datum',
    fieldSet: 'Satz',
  },

  multiply: {
    to: 'bis',
    rangeStart: 'Anfang des Bereichs',
    rangeEnd: 'Ende des Bereichs',
    fillDiagonal: 'Diagonale ausfüllen',
    shuffleHeaders: 'Zeilen und Spalten mischen',
    emptyRange: "Der Bereich läuft rückwärts, es gibt nichts zu drucken. Setzen Sie die zweite Zahl höher als die erste, zum Beispiel 1 bis 10.",
    tooWide: "Dieser Bereich ergibt eine Tabelle, die nicht auf eine Seite passt. Halten Sie die beiden Zahlen höchstens 15 auseinander, zum Beispiel 1 bis 12.",
    prefill: 'Vorausfüllen {pct} %',
    tableAria: 'Einmaleins-Tabelle',
    title: "Multiplikation",
    meta: "{start} bis {end}",
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

  coldiv: {
    preset: '{a} ÷ {b} Stellen',
    title: 'Schriftliche Division',
    meta: 'schriftliche Division · {preset}',
    notation: 'Schreibweise',
    bracket: 'Klammer',
    corner: 'Winkel',
    allowRemainder: 'Reste zulassen',
    defaultNotation: 'corner',
    problemAria: '{dividend} geteilt durch {divisor}',
    quotientAria: { one: 'Ergebnis: {n} leeres Kästchen', other: 'Ergebnis: {n} leere Kästchen' },
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
  bongard: {
    title: 'Bongard-Probleme',
    instructions: 'Die sechs Kästchen links folgen alle einer Regel, die keines der sechs Kästchen rechts erfüllt. Wie lautet die Regel?',
    perPage: 'Aufgaben pro Seite',
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    all: 'Gemischt',
    figureLabel: 'Bongard-Problem {n}: sechs Kästchen links, sechs rechts',
    rules: {
      bp001: 'Links: leere Kästchen. Rechts: im Kästchen ist etwas gezeichnet.',
      bp002: 'Links: große Figuren. Rechts: kleine Figuren.',
      bp003: 'Links: Figuren nur als Umriss. Rechts: ausgefüllte Figuren.',
      bp004: 'Links: konvexe Figuren ohne Delle. Rechts: Figuren mit einer Delle oder Einbuchtung.',
      bp005: 'Links: Figuren mit geraden Seiten. Rechts: Figuren mit gebogenen Linien.',
      bp006: 'Links: Dreiecke. Rechts: Vierecke.',
      bp007: 'Links: Figuren, die nach oben und unten lang gezogen sind. Rechts: Figuren, die in die Breite gezogen sind.',
      bp008: 'Links: Die Figur liegt auf der rechten Seite des Kästchens. Rechts: Die Figur liegt auf der linken Seite.',
      bp009: 'Links: glatte Umrisse. Rechts: Zickzack-Umrisse.',
      bp010: 'Links: Dreiecke. Rechts: Vierecke, egal ob der Umriss glatt oder zickzackförmig ist.',
    },
  },

  order: {
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    notation: 'Zeichen',
    useBrackets: 'Klammern verwenden',
    defaultNotation: 'dot',
    title: 'Rechenreihenfolge',
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
    bongard: {
      label: 'Bongard-Probleme',
      shortDesc: 'Die Regel finden, die die Kästchen trennt',
      longDesc: 'Visuelle Logikrätsel nach Michail Bongard: Die sechs Kästchen links folgen alle einer Regel, die sechs rechts verstoßen alle dagegen, und das Kind soll sagen, wie die Regel lautet. Jede Aufgabe wird jedes Mal neu gezeichnet, sodass die Regel gleich bleibt, während sich die Figuren ändern. Zwei, vier oder sechs Aufgaben pro Seite, mit den Antworten auf einem getrennten Lösungsblatt.',
      skills: ['visuelles Denken', 'Sortieren und Ordnen', 'Formen', 'eine Regel erklären'],
      settings: [
        'Aufgaben pro Seite: 2, 4 oder 6',
        'Stufe: leicht, mittel, schwer oder gemischt',
        'Ein Lösungsblatt drucken',
      ],
      faq: [
        { q: 'Was ist ein Bongard-Problem?', a: 'Ein Rätsel, das der sowjetische Wissenschaftler Michail Bongard 1967 erfunden hat. Zwölf Kästchen sind in zwei Sechsergruppen aufgeteilt: Die linken haben eine Eigenschaft gemeinsam (zum Beispiel sind alle Figuren Dreiecke), die rechten haben sie nicht. Es gibt nichts zu rechnen; man muss hinsehen, vergleichen und benennen, worin sich die beiden Gruppen unterscheiden.' },
        { q: 'Wie soll das Kind die Regel aufschreiben?', a: 'In einem kurzen Satz, der die linke Seite beschreibt, etwa „ausgefüllte Figuren“ oder „die Figur ist oben“. Eine Regel, die auf alle sechs linken und auf kein rechtes Kästchen zutrifft, ist richtig, auch wenn die Wörter vom Lösungsblatt abweichen. Zögert das Kind, fragen Sie, was sich ändern müsste, damit ein rechtes Kästchen nach links passt.' },
        { q: 'Warum ändern sich die Bilder jedes Mal?', a: 'Jede Aufgabe wird aus ihrer Regel erzeugt und nicht von einem Bild abgemalt: Figuren, Größen und Positionen werden bei jedem Druck neu ausgewürfelt und anschließend gegen die Regel geprüft. Ein Kind, das „Dreiecke gegen Vierecke“ schon gelöst hat, trifft dieselbe Idee in neuen Zeichnungen wieder, und genau so zeigt sich, ob es die Regel verstanden oder die Seite auswendig gelernt hat.' },
      ],
    },
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
      faq: [
        { q: 'Ab welchem Alter lernt man das Einmaleins?', a: 'Das Einmaleins kommt in der 2. Klasse dran, etwa mit 7 Jahren, und soll bis zum Ende der 3. Klasse sicher abrufbar sein. Beginne mit einem kleinen Bereich von 1 bis 5 und erweitere ihn erst, wenn die Antwort ohne Nachzählen kommt.' },
        { q: 'Wozu dienen die vorausgefüllten Felder?', a: 'Wenn die Diagonale (1×1, 2×2, 3×3 …) oder ein Teil der Felder zufällig vorausgefüllt ist, wird aus dem leeren Gitter ein Rätsel. Die sichtbaren Ergebnisse geben Anhaltspunkte, deshalb ist eine halb gefüllte Tabelle ein sanfterer Einstieg als eine leere.' },
        { q: 'In welcher Reihenfolge lernt man die Reihen?', a: 'Üblich ist zuerst die 2er-, 5er- und 10er-Reihe, deren Muster gut sichtbar sind, dann 3, 4 und 6 und zuletzt 7, 8 und 9. Da 3 × 4 und 4 × 3 dasselbe ergeben, halbiert eine gelernte Reihe die Arbeit an einer anderen.' },
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
      faq: [
        { q: 'Was übt die Form mit der Lücke?', a: 'Eine Aufgabe als a + □ = c oder □ − b = c zu schreiben verlangt Rückwärtsdenken statt bloßem Rechnen von links nach rechts. Das ist der erste Schritt zur Algebra, und deshalb wandert die Lücke von Aufgabe zu Aufgabe.' },
        { q: 'Welchen Zahlenraum soll ich wählen?', a: 'Bis 10 und bis 20 passen zur 1. Klasse, bis 100 zur 2. und bis 1000 zur 3. Zählt ein Kind an den Fingern, statt sich zu erinnern, geh einen Zahlenraum zurück, statt mehr Aufgaben zu geben.' },
        { q: 'Was ist der 67-Modus?', a: 'Er versteckt in jeder Spalte genau eine Aufgabe mit dem Ergebnis 67 und macht aus dem Blatt eine kleine Schatzsuche. So liest das Kind seine eigenen Ergebnisse noch einmal durch — eine Form der Kontrolle.' },
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
      faq: [
        { q: 'Für welche Klasse ist die schriftliche Addition?', a: 'Die schriftliche Addition mit zweistelligen Zahlen beginnt meist in der 2. Klasse, drei- und vierstellige folgen in der 3. Die Grundlage dafür ist das Stellenwertverständnis: zu wissen, dass die 4 in 348 vier Zehner bedeutet.' },
        { q: 'Was ist der Übertrag?', a: 'Ergibt eine Spalte mehr als 9, wandert der Zehnerteil in die Spalte links daneben. 8 + 6 ist 14, also wird die 4 geschrieben und die 1 übertragen. Mit „Aufgaben mit Übertrag bevorzugen“ brauchen die meisten Aufgaben diesen Schritt.' },
        { q: 'Warum auf kariertem Papier?', a: 'Eine Ziffer pro Kästchen hält die Einer unter den Einern und die Zehner unter den Zehnern. Die meisten Fehler am Anfang entstehen durch falsches Untereinanderschreiben und nicht durch Rechnen, und das Karo beseitigt diese Fehlerquelle.' },
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
      faq: [
        { q: 'Wann ist ein Kind bereit für die schriftliche Multiplikation?', a: 'Meist in der 3. Klasse und erst dann, wenn das Einmaleins abgerufen und nicht hergeleitet wird. Eine schriftliche Multiplikation besteht aus mehreren kleinen Multiplikationen plus einer Addition — bei unsicherem Einmaleins wird jeder Schritt langsamer und schwerer zu prüfen.' },
        { q: 'Was sind Teilprodukte?', a: '34 mal 26 heißt: 34 mal 6 und dann 34 mal 20, und beide Ergebnisse addieren. Jedes dieser Ergebnisse ist ein Teilprodukt und bekommt auf dem Blatt eine eigene Zeile.' },
        { q: 'Warum ist die zweite Zeile nach links versetzt?', a: 'Die zweite Zeile multipliziert mit Zehnern statt mit Einern, ihr Ergebnis ist also zehnmal so groß und beginnt eine Spalte weiter links. Der Versatz macht den Stellenwert sichtbar; er ist keine Formregel zum Auswendiglernen.' },
      ],
    },
    coldiv: {
      label: 'Schriftliche Division',
      shortDesc: 'Schriftliches Dividieren üben',
      longDesc: 'Schriftliche Division von 3- und 4-stelligen Zahlen durch einen ein- oder zweistelligen Divisor, gedruckt auf einem Rechenkaro-Raster mit fertig gezeichnetem Rahmen und leeren Kästchen für den Rechenweg. Der Rahmen lässt sich in der englischen Schreibweise (Divisor links der Klammer, Ergebnis über dem Strich) oder in der kontinentalen (Divisor rechts oben, Ergebnis darunter) setzen, und die Aufgaben gehen wahlweise glatt auf oder lassen einen Rest.',
      skills: ['schriftliche Division', 'Reste', 'Stellenwert', 'Überschlag'],
      settings: [
        'Voreinstellung: 3 ÷ 1, 4 ÷ 1 oder 4 ÷ 2 Stellen',
        'Schreibweise: Klammer oder Winkel',
        'Spalten: Anzahl der Aufgabenspalten pro Seite',
        'Reste statt glatt aufgehender Division zulassen',
      ],
      faq: [
        { q: 'Wann lernt man die schriftliche Division?', a: 'Die schriftliche Division kommt meist am Ende der 3. oder in der 4. Klasse, wenn Multiplikation und Subtraktion sitzen. Jeder Schritt verlangt Teilen, Multiplizieren, Subtrahieren und Herunterholen — jede Schwäche zeigt sich sofort.' },
        { q: 'Was unterscheidet die beiden Schreibweisen?', a: 'Bei der Klammerform steht der Divisor links vom Dividenden und der Quotient über dem Strich; bei der Winkelform steht der Divisor rechts oben und der Quotient darunter. Es ist dieselbe Methode, nur anders notiert, und welche ein Kind kennt, hängt vom Land ab, in dem es zur Schule geht.' },
        { q: 'Soll ich Reste zulassen?', a: 'Beginne mit Aufgaben, die glatt aufgehen, damit nur die Methode neu ist. Schalte Reste dazu, sobald die vier Schritte automatisch laufen: ein Rest zwingt zur Kontrolle, ob er wirklich kleiner als der Divisor ist.' },
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
      faq: [
        { q: 'Wie merkt sich ein Kind > und <?', a: 'Die offene Seite zeigt immer zur größeren Zahl — das Zeichen wird zum „Mehr“ hin breiter. Den ganzen Satz laut zu lesen — „dreiundvierzig ist größer als vierunddreißig“ — prägt sich schneller ein als das Zeichen allein.' },
        { q: 'Warum sind die Zahlenpaare absichtlich tückisch?', a: 'Paare wie 43 und 34 oder 208 und 280 verwenden dieselben Ziffern in anderer Reihenfolge, und etwa jedes siebte Paar ist gleich. Wer nur auf die erste Ziffer schaut, liegt falsch — genau diese Gewohnheit soll das Blatt abtrainieren.' },
        { q: 'Welcher Zahlenraum passt zu welcher Klasse?', a: 'Bis 10 und 20 für die 1. Klasse, bis 100 für die 2. und bis 1000 für die 3. Längere Zahlen zu vergleichen ist vor allem eine Stellenwertübung: erhöhe den Zahlenraum erst, wenn kurze Paare schnell gehen.' },
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
      faq: [
        { q: 'Wie lautet die Rundungsregel?', a: 'Man schaut auf die Ziffer eine Stelle rechts von der Stelle, auf die gerundet wird. Ist sie 5 oder größer, wird aufgerundet; ist sie 4 oder kleiner, abgerundet. 48 auf Zehner gerundet ergibt 50, weil die 8 mindestens 5 ist.' },
        { q: 'Warum enden so viele Zahlen auf 5?', a: 'Der Fall mit der 5 beruht als einziger auf einer Vereinbarung statt auf einer offensichtlichen Antwort, und dort passieren die meisten Fehler. Der Generator nimmt sie bewusst auf, gemischt mit Fällen zum Auf- und Abrunden.' },
        { q: 'Wann lernt man Runden?', a: 'Das Runden auf Zehner erscheint meist in der 2. Klasse, Hunderter und Tausender folgen in der 3. Es ist die Grundlage des Schätzens, und darüber merkt ein Kind, dass ein Ergebnis viel zu groß ist.' },
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
      faq: [
        { q: 'Was üben Zahlenfolgen?', a: 'Die Regel hinter 2, 4, 6, □, 10 zu finden ist frühes algebraisches Denken: Das Kind sucht eine Beziehung, statt eine vorgegebene Rechnung auszuführen. Nebenbei festigt es das Zählen in Schritten, das dem Einmaleins zugutekommt.' },
        { q: 'Worin unterscheiden sich die drei Stufen?', a: 'Leicht arbeitet mit gleichbleibendem Schritt, etwa immer plus 3. Mittel multipliziert oder wechselt zwischen zwei Schritten. Schwer kombiniert Regeln, sodass eine Vermutung erst an mehreren Gliedern geprüft werden muss.' },
        { q: 'Mein Kind kommt bei einer Folge nicht weiter. Was tun?', a: 'Frag, was sich von einer Zahl zur nächsten ändert, und schreibt die Abstände darunter. Sind die Abstände sichtbar, zeigt sich die Regel meist von selbst — und die Gewohnheit, sie aufzuschreiben, hilft auch bei schwereren Folgen.' },
      ],
    },
    order: {
      label: 'Rechenreihenfolge',
      shortDesc: 'Welche Rechnung kommt zuerst',
      longDesc: 'Mehrschrittige Terme, bei denen das Ergebnis davon abhängt, die Rechenarten in der richtigen Reihenfolge auszuführen: Punktrechnung vor Strichrechnung, und Klammern vor allem anderen. Drei Stufen führen von Ketten einer einzigen Rechenart (25 − 14 + 43) über gemischte Rangfolge (70 − 7 · 9) bis zu viergliedrigen Termen mit Klammern (38 − (80 − 76) · 7). Jeder Zwischenschritt landet auf einer ganzen Zahl zwischen 2 und 100, geteilt wird immer ohne Rest, und die Kästchen zeigen, wie viele Ziffern zu erwarten sind.',
      skills: [
        'Rechenreihenfolge',
        'Klammern',
        'Kopfrechnen',
        'mehrschrittige Aufgaben',
      ],
      settings: [
        'Stufe: leicht, mittel oder schwer',
        'Zeichen: × ÷ oder · :',
        'Spalten: 1 oder 2 pro Seite',
        'Klammern verwenden oder weglassen',
        'Lösungsblatt drucken',
      ],
      faq: [
        { q: 'Was bedeutet Punktrechnung vor Strichrechnung?', a: 'Zuerst wird alles in Klammern gerechnet, dann alle Mal- und Geteiltaufgaben von links nach rechts, danach Plus und Minus von links nach rechts. Das ist eine Vereinbarung und keine Entdeckung: alle lesen 70 − 7 · 9 auf dieselbe Weise, damit der Term ein einziges Ergebnis hat und nicht zwei.' },
        { q: 'Warum rechnet mein Kind bei 70 − 7 · 9 das Ergebnis 567 aus?', a: 'Weil es streng von links nach rechts gerechnet hat: 70 − 7 ergibt 63, und 63 · 9 ergibt 567. Richtig wird zuerst multipliziert, also 70 − 63 = 7. Das ist der häufigste Fehler auf diesen Blättern, und am schnellsten hilft es, das Kind die Malaufgabe unterstreichen zu lassen, bevor es etwas aufschreibt.' },
        { q: 'Was ändern die Klammern?', a: 'Klammern setzen das, was in ihnen steht, an den Anfang der Reihe. 30 − 17 + 9 ergibt 22, aber 30 − (17 + 9) ergibt 4, weil die Klammer die Addition zuerst erzwingt. Jede Klammer auf diesen Blättern verändert das Ergebnis, keine davon lässt sich folgenlos übergehen.' },
        { q: 'Wozu die Kästchenreihe hinter dem Gleichheitszeichen?', a: 'Es gibt ein Kästchen je Ziffer des Ergebnisses, damit ein Kind sieht, ob es eine einzelne Ziffer, eine Zahl im Zehnerbereich oder eine im Hunderterbereich sucht. Das ist eine Kontrollhilfe und kein Hinweis auf den Wert: ein Ergebnis, das nicht in die Kästchen passt, ist ein Zeichen, die Reihenfolge noch einmal anzusehen.' },
      ],
    },
    eqexplore: {
      label: 'Gleichungs-Explorer',
      shortDesc: 'Gleichungen interaktiv lösen',
      longDesc: 'Ein Gleichungslöser am Bildschirm (nicht druckbar): Ziehe Terme über das Gleichheitszeichen und sieh zu, wie das Vorzeichen wechselt, folge den Sprüngen am Zahlenstrahl und tippe die Antwort auf der eingebauten Tastatur ein. Richtige Antworten verlängern die Serie; falsche spielen eine animierte Erklärung ab.',
      skills: ['Gleichungen', 'Umkehroperationen', 'Zahlenstrahl', 'Kopfrechnen'],
      settings: [
        'Rechenart: Addition, Subtraktion oder beides',
        'Bereich: Größe der verwendeten Zahlen',
      ],
      faq: [
        { q: 'Kann man den Gleichungs-Explorer ausdrucken?', a: 'Nein. Er ist die einzige Aktivität der Seite, die für den Bildschirm gedacht ist: Terme werden über das Gleichheitszeichen gezogen, der Zahlenstrahl bewegt sich, und die Antwort wird beim Tippen geprüft. Alle anderen Blätter passen gedruckt auf eine Seite.' },
        { q: 'Was bedeutet es, einen Term über das Gleichheitszeichen zu bringen?', a: 'Eine Gleichung bleibt wahr, solange sich beide Seiten gleich verändern. Wandert ein Term hinüber, dreht sich sein Vorzeichen um: aus x + 7 = 12 wird x = 12 − 7. Den Vorzeichenwechsel im Moment zu sehen macht die Regel anschaulich statt auswendig gelernt.' },
        { q: 'Für welches Alter ist er gedacht?', a: 'Für die 2. und 3. Klasse, etwa 7 bis 9 Jahre, sobald Addition und Subtraktion bis 100 sicher sitzen. Meist ist es das erste Mal, dass ein Kind einen Buchstaben für eine unbekannte Zahl sieht.' },
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
          heading: 'Warum Papier statt einer App',
          paragraphs: [
            'An Mathe-Apps für Kinder mangelt es nicht, und die meisten belohnen jedes Tippen mit sofortiger Rückmeldung: ein Klang, ein Stern, eine Animation. Nach unserer Erfahrung wird Üben so zur Unterhaltung. Das Kind lernt, schnell zu raten und darauf zu warten, dass die App Ja oder Nein sagt, statt bei einer Aufgabe zu bleiben und sie zu durchdenken. Sofortige Rückmeldung beschäftigt Kinder sehr gut; dass sie ihnen etwas beibringt, bezweifeln wir.',
            'Ein gedrucktes Arbeitsblatt funktioniert anders. Das Kind muss die Antwort aufschreiben, kann sie nicht mit einem Tipp rückgängig machen und muss selbst entscheiden, ob sie richtig aussieht. Die Rückmeldung kommt später, von einem Erwachsenen, der sich das Blatt ansieht. Diese Pause ist der Punkt: Das Denken findet im Kopf des Kindes statt, nicht in der App.',
            'So nutzen wir diese Blätter mit unseren eigenen Kindern, und so legt es auch ein solider Forschungsstand nahe. Üben, das sich schwerer anfühlt und die Antwort hinauszögert, führt meist zu dauerhafterem Lernen als Üben, das glatt läuft. Die Belege sind nicht einseitig, und sofortige Rückmeldung hat ihren Platz bei einfachen Fakten und bei Kindern, die gerade erst anfangen. Um echtes Verständnis aufzubauen, sind anstrengendes Üben und verzögerte Rückmeldung aber eine gute Wette.',
          ],
        },
        {
          heading: 'Wie man Rückmeldung gibt',
          paragraphs: [
            'Wenn Sie ein Blatt durchsehen, zählt der Ton so viel wie die Korrektur. Die Forschung zu Feedback und Lob zeigt in eine Richtung: Kommentieren Sie die Arbeit und den Weg, nicht das Kind, und behandeln Sie einen Fehler als Einladung, noch einmal nachzudenken, nicht als Urteil.',
          ],
          items: [
            'Markieren Sie zuerst, was richtig ist, und zeigen Sie dann auf eine Aufgabe, die einen zweiten Blick verdient. Ein „Schau dir diese noch einmal an, ich glaube, da ist etwas verrutscht“ reicht.',
            'Vermeiden Sie harte Kritik und Etiketten: weder „das ist falsch, du hast nicht aufgepasst“ noch „du bist so klug“. Loben Sie stattdessen Anstrengung und Methode: „du hast die Spalten sorgfältig untereinander geschrieben“.',
            'Wenn das Kind feststeckt, stellen Sie eine Frage, statt die Antwort zu geben: „Was ist 7 + 5 für sich allein?“, „Mit welcher Spalte fangen wir an?“.',
            'Lassen Sie das Kind den Fehler selbst finden und verbessern. Die Korrektur, die es selbst macht, bleibt hängen.',
            'Fassen Sie sich kurz und bleiben Sie freundlich. Zehn entspannte Minuten über einem Blatt sind besser als eine angespannte halbe Stunde.',
          ],
        },
        {
          heading: 'Was die Forschung sagt',
          items: [
            '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273): Verzögerte Rückmeldung führte zu besserem langfristigem Behalten als sofortige Rückmeldung.',
            '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448): Studierende bevorzugten sofortige Rückmeldung und hielten sie für hilfreicher, doch verzögerte Rückmeldung zu ihren Hausaufgaben brachte bessere Prüfungsergebnisse.',
            '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1): In einer Klassenstudie mit 243 Zweit- und Drittklässlern half sofortige Rückmeldung während des Übens, doch Üben ohne Rückmeldung führte eine Woche später zu besserer Beherrschung.',
            '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/): „Wünschenswerte Schwierigkeiten“, also Bedingungen, die das Üben schwerer erscheinen lassen, etwa sich selbst abzufragen oder Sitzungen zu verteilen, führen meist zu dauerhafterem Lernen.',
            '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107): „Produktives Scheitern“: Schüler, die mit Matheaufgaben rangen, bevor ihnen die Methode gezeigt wurde, entwickelten ein tieferes Verständnis als Schüler, die zuerst unterrichtet wurden.',
            '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254): Eine Metaanalyse von 607 Effekten ergab, dass Feedback im Schnitt hilft, aber mehr als ein Drittel der Feedback-Interventionen die Leistung verschlechterte, vor allem solche, die die Aufmerksamkeit auf die Person statt auf die Aufgabe lenken.',
            '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487): Feedback wirkt am besten, wenn es sich auf Aufgabe und Vorgehen bezieht und die Frage „Wohin als Nächstes?“ beantwortet; auf die Person gerichtetes Feedback ist die am wenigsten wirksame Art.',
            '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) und [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556): Kinder, die als Person gelobt oder kritisiert wurden („du bist so klug“, „du bist schlampig“), reagierten auf spätere Rückschläge hilflos; Kinder mit Rückmeldung zu Anstrengung und Methode machten weiter.',
            '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full): Handschrift erzeugte weit ausgeprägtere Vernetzung im Gehirn als Tippen, in Mustern, die mit Gedächtnisbildung verbunden sind.',
          ],
          paragraphs: [
            'Keine dieser Studien ist für sich ein endgültiges Argument, und die Ergebnisse unterscheiden sich. Aber die Richtung ist beständig genug, dass wir {brand} darum herum gebaut haben. Einige der Arbeiten, auf die wir uns stützen:',
          ],
        },
        {
          heading: 'Was du bekommst',
          items: [
            'Arbeitsblätter zum Ausdrucken für die Klassen 1–3: Einmaleins, Addition und Subtraktion, schriftliche Addition, schriftliche Multiplikation, Zahlenvergleich, Runden, Zahlenfolgen und Rechenreihenfolge.',
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
            'Die Arbeitsblätter und die Website stehen unter der Lizenz {license}. Du darfst sie für nicht-kommerzielle Zwecke mit Namensnennung nutzen, teilen und anpassen. Fehlermeldungen und Ideen für neue Arbeitsblätter sind willkommen.',
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
