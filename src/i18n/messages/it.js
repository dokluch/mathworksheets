/** Italian messages. Same key set as en.js plus `worksheets.<id>` and `pages.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Schede di matematica da stampare per le classi 1ª–3ª',
    description: 'MathSheets: schede di matematica gratuite, stampabili e casuali per le classi 1ª–3ª della primaria. Tabelline, addizioni e sottrazioni, addizione in colonna, moltiplicazione in colonna, confronto, arrotondamento, sequenze numeriche e un esploratore di equazioni interattivo.',
    brandAlt: 'Schede di matematica',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    developersTitle: 'Risorse per sviluppatori · {brand}',
    worksheetTitle: 'Schede {label} · {brand}',
    developersDescription: 'Risorse {brand} per sviluppatori: repository open source, catalogo JSON delle schede, negoziazione dei contenuti Markdown, llms.txt e sitemap.',
    worksheetDescription: 'Schede gratuite da stampare «{labelLower}» per le classi {grades}. {shortDesc}. Esercizi nuovi ogni volta, in una sola pagina.',
    gradeOne: 'Classe {grades}',
    gradeRange: 'Classi {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Anteprima della scheda {label} – {brand}',
    ogAltDevelopers: 'Risorse {brand} per sviluppatori',
    worksheetHeading: 'Schede {label}',
    worksheetName: '{brand} {label}',
    developersHeading: 'Risorse {brand} per sviluppatori',
    developersCrumb: 'Risorse per sviluppatori',
    worksheetList: 'Schede {brand}',
    learningResourceWorksheet: 'Scheda di esercizi',
    learningResourceInteractive: 'Esercizio interattivo',
    featureItem: '{label}: {shortDesc}',
  },

  static: {
    breadcrumb: 'Percorso di navigazione',
    worksheetTypes: 'Tipi di schede',
    lastUpdated: 'Ultimo aggiornamento: {date}',
    footerSite: 'Sito',
    home: {
      subtitle: 'Schede di esercizi gratuite e casuali, da stampare con un clic.',
      intro1: '{brand} è un generatore gratuito e open source di schede di matematica da stampare per bambini di 6–9 anni (classi 1ª–3ª). Ogni scheda viene generata a caso ogni volta che la apri o la rigeneri, così i bambini si esercitano su problemi nuovi invece di memorizzare una pagina. Scegli una scheda, regola la difficoltà (intervallo di numeri, cifre, disposizione, colonne) e stampala dal browser; le impostazioni vengono ricordate su questo dispositivo.',
      intro2: 'Il catalogo comprende tabelline, addizioni e sottrazioni con numeri mancanti, addizione in colonna con riporto, moltiplicazione in colonna, confronto di numeri con >, < e =, arrotondamento alla decina, al centinaio e al migliaio, e sequenze numeriche. L’esploratore di equazioni è un’attività a schermo in cui i bambini spostano i termini attraverso il segno di uguale e verificano la risposta su una linea dei numeri.',
      worksheets: 'Schede',
      howItWorks: 'Come funziona',
      step1: 'Scegli una scheda dall’elenco qui sopra.',
      step2: 'Imposta la difficoltà: limite dei numeri, cifre, colonne o livello.',
      step3: 'Premi Rigenera per un nuovo set casuale, poi Stampa. Le schede stanno in una pagina A4 o Letter.',
      audienceHeading: 'Per insegnanti, genitori e agenti IA',
      audienceText: 'Le schede vengono generate nel browser: nulla viene caricato, non c’è account né costo. {brand} è stato creato da un genitore per integrare il programma di matematica delle classi 1ª–3ª ed è libero da usare e adattare per scopi non commerciali.',
    },
    worksheet: {
      skills: 'Abilità',
      format: 'Formato',
      formatInteractive: 'interattivo, a schermo',
      formatPrintable: 'stampabile, casuale a ogni caricamento',
      settings: 'Impostazioni',
      howToUseWorksheet: 'Come usare questa scheda',
      howToUseActivity: 'Come usare questa attività',
      step1: 'Apri {url} (richiede JavaScript).',
      step2: 'Regola le impostazioni qui sopra; vengono salvate nel browser.',
      step3Printable: 'Premi Rigenera per un nuovo set casuale, poi Stampa.',
      step3Interactive: 'Scrivi la risposta e premi Verifica; premi Avanti per una nuova equazione.',
      others: 'Altre schede {brand}',
      partOf: 'Parte di {link}.',
      url: 'URL',
    },
    developers: {
      subtitle: 'Open source, leggibile dalle macchine e pensato per gli agenti.',
      intro: '{brand} (noto anche come «{brandAlt}») è un’applicazione a pagina singola React 19 + Vite. Non c’è un’API server: le schede vengono generate lato client. Tutto ciò che segue è statico e memorizzabile in cache.',
      resources: 'Risorse',
      sourceLink: 'Codice sorgente su GitHub',
      catalogDesc: 'catalogo leggibile dalle macchine di tutte le schede con slug, URL, classi, abilità e impostazioni',
      llmsDesc: 'indice llmstxt.org e contenuto completo per i modelli linguistici',
      indexMdDesc: 'questo sito in Markdown; ogni pagina HTML ha un gemello {code}',
      negotiationHeading: 'Negoziazione dei contenuti Markdown',
      negotiationText: 'Ogni URL di pagina risponde a {accept} con {contentType} e {vary}, secondo la convenzione acceptmarkdown.com. Le risposte HTML portano un’intestazione {link} che punta al gemello. I percorsi sconosciuti restituiscono HTTP 404 con un corpo Markdown che indica dove cercare.',
      languagesHeading: 'Lingue',
      languagesText: 'Le pagine in inglese si trovano alla radice del sito. Le stesse pagine sono disponibili in {languages} sotto un prefisso di due lettere (per esempio {example}); ogni pagina collega tutte le traduzioni con hreflang e le elenca nella sitemap. llms.txt e llms-full.txt sono solo in inglese.',
      idsHeading: 'Id e URL delle schede',
      addingHeading: 'Aggiungere una scheda',
      adding1: 'Aggiungi una voce in {file} (id, slug, etichetta, descrizioni, classi, abilità, impostazioni) e le sue traduzioni in {messages}.',
      adding2: 'Crea il componente in {dir} e registralo nelle mappe {components} e {icons} di {app}.',
      adding3: 'Esegui {test} e {build}; le pagine statiche, i gemelli Markdown, la sitemap, llms.txt e il catalogo JSON vengono rigenerati dal catalogo.',
    },
    agentLinks: {
      text: 'Ogni pagina è disponibile anche in Markdown: aggiungi {code} al percorso o invia {accept}. Vedi {llms}, il {catalog}, la {sitemap} e le {developers}. Il codice sorgente è su {github} con licenza {license}.',
      llms: 'llms.txt',
      catalog: 'catalogo delle schede (JSON)',
      sitemap: 'sitemap',
      developers: 'risorse per sviluppatori',
      github: 'GitHub',
    },
  },

  md: {
    agentIntro: 'Ogni pagina è disponibile anche in Markdown: aggiungi `.md` al percorso o richiedila con `Accept: text/markdown`.',
    llmsNote: 'indice per i modelli linguistici',
    catalogNote: 'catalogo delle schede leggibile dalle macchine',
    developersLink: 'Risorse per sviluppatori',
    sitemapLink: 'Sitemap',
    sourceLink: 'Codice sorgente su GitHub',
    homeIntro: '{brand} è un generatore gratuito e open source di schede di matematica da stampare per bambini di 6–9 anni (classi 1ª–3ª). Ogni scheda viene generata a caso ogni volta che viene aperta o rigenerata. Scegli una scheda, regola la difficoltà (intervallo di numeri, cifre, disposizione, colonne) e stampala dal browser; le impostazioni vengono ricordate per dispositivo. Le schede vengono generate lato client: nessun account, nessun caricamento, nessun costo.',
    worksheetItem: '{link}: {shortDesc} (classi {grades})',
    howItWorks: 'Come funziona',
    step1: 'Scegli una scheda.',
    step2: 'Imposta la difficoltà: limite dei numeri, cifre, colonne o livello.',
    step3: 'Premi Rigenera per un nuovo set casuale, poi Stampa. Le schede stanno in una pagina A4 o Letter.',
    forDevelopers: 'Per sviluppatori e agenti IA',
    howToUse: 'Come si usa',
    wsStep1: 'Apri {url} (richiede JavaScript).',
    wsStep2: 'Regola le impostazioni; vengono salvate nel browser.',
    developersIntro: '{brand} (noto anche come «{brandAlt}») è un’applicazione open source a pagina singola React 19 + Vite che genera schede di matematica da stampare lato client. Non c’è un’API server; ogni risorsa qui sotto è un file statico.',
    devCatalogNote: 'catalogo leggibile dalle macchine di tutte le schede (slug, URL, URL Markdown, classi, abilità, impostazioni)',
    devLlmsNote: 'indice llmstxt.org',
    devLlmsFullNote: 'il Markdown di tutte le pagine in un unico file',
    devIndexNote: 'la pagina iniziale in Markdown',
    negotiationText: 'Ogni URL di pagina risponde a `Accept: text/markdown` con `Content-Type: text/markdown; charset=utf-8` e `Vary: Accept` (convenzione acceptmarkdown.com). Le risposte HTML portano `Link: <…md>; rel="alternate"; type="text/markdown"`. Le richieste che non accettano né HTML né Markdown ricevono `406 Not Acceptable`. I percorsi sconosciuti restituiscono HTTP 404 con un corpo Markdown che indica dove cercare.',
    languagesText: 'Le pagine in inglese si trovano alla radice del sito; le stesse pagine sono disponibili in {languages} sotto un prefisso di due lettere (per esempio {example}). Ogni pagina collega le sue traduzioni con hreflang.',
    adding1: 'Aggiungi una voce in `src/worksheets.js` (id, slug, etichetta, descrizioni, classi, abilità, impostazioni) e le sue traduzioni in `src/i18n/messages/<locale>.js`.',
    adding2: 'Crea il componente in `src/components/` e registralo nelle mappe `COMPONENTS` e `ICONS` di `src/App.jsx`.',
    adding3: 'Esegui `npm test` e `npm run build`; le pagine statiche, i gemelli Markdown, la sitemap, llms.txt e il catalogo JSON vengono rigenerati dal catalogo.',
    markdownLink: 'Markdown',
    lastUpdated: 'Ultimo aggiornamento',
    moreFrom: 'Altro da {brand}',
    homeLink: 'Pagina iniziale di {brand}',
  },

  llms: {
    optionalLocale: 'Pagina iniziale in {language}',
  },

  notFound: {
    title: '404 – Pagina non trovata',
    body: 'Il percorso {path}non esiste su {site}. Questa risposta ha stato HTTP 404.',
    whereNext: 'Dove cercare',
    home: 'Pagina iniziale di {brand}',
    worksheet: 'Schede {label}',
    developers: 'Risorse per sviluppatori',
    sitemap: 'Sitemap',
    llms: 'llms.txt',
    catalog: 'Catalogo delle schede (JSON)',
    twinMd: 'Ogni pagina HTML ha anche un gemello Markdown (aggiungi `.md` o invia `Accept: text/markdown`).',
    twinHtml: 'Ogni pagina ha anche un gemello Markdown: aggiungi {code} o invia {accept}.',
  },

  app: {
    subtitle: 'Schede di matematica da stampare per le classi 1ª–3ª',
    allSheets: 'Tutte le schede',
    worksheetTypes: 'Tipi di schede',
    sourceOnGitHub: 'Codice sorgente su GitHub',
    language: 'Lingua',
  },

  common: {
    regenerate: 'Rigenera',
    print: 'Stampa',
    printCta: {
      title: 'Pronto per la stampa?',
      hint: 'La scheda sta in una pagina. Rigenera prima se vuoi una serie di esercizi diversa.',
      button: 'Stampa la scheda',
    },
    columns: 'Colonne',
    limit: 'Limite',
    range: 'Intervallo',
    operation: 'Operazione',
    layout: 'Disposizione',
    difficulty: 'Difficoltà',
    numberSize: 'Dimensione dei numeri',
    within: 'Entro {n}',
    withinMeta: 'entro {n}',
  },

  multiply: {
    to: 'a',
    rangeStart: 'Inizio intervallo',
    rangeEnd: 'Fine intervallo',
    fillDiagonal: 'Riempi la diagonale',
    prefill: 'Precompila {pct}%',
    tableAria: 'Tavola pitagorica',
  },

  addsub: {
    inline: 'In riga',
    stacked: 'In colonna',
    sixtySeven: 'Modalità 67',
    title: 'Addizione e sottrazione',
  },

  coladd: {
    digitPreset: '{d} cifre',
    preferCarry: 'Preferisci i riporti',
    title: 'Addizione in colonna',
    meta: 'numeri di {d} cifre',
  },

  colmul: {
    preset: '{a} × {b} cifre',
    title: 'Moltiplicazione in colonna',
    meta: 'moltiplicazione in colonna · {preset}',
    problemAria: '{a} per {b}',
  },

  compare: {
    title: 'Confronto',
  },

  rounding: {
    roundTo: 'Arrotonda a',
    nearest: 'Alla {n} più vicina',
    title: 'Arrotondamento',
    meta: 'alla {n} più vicina',
  },

  patterns: {
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    title: 'Sequenze numeriche',
    instructions: 'Completa i numeri mancanti in ogni sequenza.',
  },

  eq: {
    newProblem: 'Nuova',
    streak: { one: '{n} di fila', other: '{n} di fila' },
    hint: 'Suggerimento: trascina un numero oltre il segno = per riordinare',
    reset: 'Ripristina l’equazione',
    check: 'Verifica',
    next: 'Avanti',
    keypad: 'Tastierino numerico',
    backspace: 'Cancella',
    clear: 'Azzera',
    yourAnswer: 'La tua risposta',
    drag: 'Trascina {n} per riordinare l’equazione',
    numberLineAria: 'Linea dei numeri che mostra {a} {op} {b} = {result}',
    correct: 'Giusto!',
    wrong: 'Non proprio: riprova o guarda come funziona qui sotto',
    numberLine: 'Linea dei numeri',
    tenFrame: 'Griglia del dieci',
    replay: 'Ripeti',
    gotIt: 'Capito',
  },

  error: {
    title: 'Qualcosa è andato storto',
    hint: 'Prova a ricaricare la pagina.',
    reload: 'Ricarica',
  },

  worksheets: {
    multiply: {
      label: 'Moltiplicazione',
      shortDesc: 'Tabelline e tavola pitagorica',
      longDesc: 'Una tavola pitagorica per qualsiasi intervallo di fattori, con celle precompilate opzionali perché i bambini scoprano le regolarità prima di completare il resto. Utile per imparare le tabelline a memoria, controllare la velocità di richiamo ed esercitare la proprietà commutativa (3 × 4 = 4 × 3).',
      skills: ['tabelline', 'fatti moltiplicativi', 'sequenze numeriche'],
      settings: [
        'Intervallo della tavola: scegli il primo e l’ultimo fattore',
        'Precompila la diagonale (1×1, 2×2, …)',
        'Percentuale di celle precompilate a caso',
      ],
    },
    addsub: {
      label: 'Addizione e sottrazione',
      shortDesc: 'Esercizi di addizione e sottrazione',
      longDesc: 'Addizioni e sottrazioni casuali entro 10, 20, 100 o 1000, con lo spazio vuoto in una posizione casuale (a + □ = c, □ − b = c, a − b = □). Scegli la disposizione in riga o in colonna e da 2 a 4 colonne; la «modalità 67» nasconde esattamente un problema per colonna con risposta 67, per una piccola caccia al tesoro.',
      skills: ['addizione', 'sottrazione', 'addendo mancante', 'calcolo mentale'],
      settings: [
        'Operazione: addizione, sottrazione o entrambe',
        'Limite: entro 10, 20, 100 o 1000',
        'Disposizione: in riga o in colonna (verticale)',
        'Colonne: 2, 3 o 4 (20–40 problemi)',
        'Modalità 67: una risposta nascosta di 67 per colonna',
      ],
    },
    coladd: {
      label: 'Addizione in colonna',
      shortDesc: 'Addizione verticale a più cifre',
      longDesc: 'Addizione in colonna di numeri a 2, 3 o 4 cifre su una griglia a quadretti, una cifra per casella, perché i bambini si esercitino ad allineare i valori posizionali e a gestire i riporti. L’opzione «preferisci i riporti» genera problemi che richiedono almeno un riporto.',
      skills: ['addizione in colonna', 'riporto', 'valore posizionale'],
      settings: [
        'Cifre: numeri a 2, 3 o 4 cifre',
        'Colonne: numero di colonne di problemi per pagina',
        'Preferisci i problemi che richiedono il riporto',
      ],
    },
    colmul: {
      label: 'Moltiplicazione in colonna',
      shortDesc: 'Esercizi di moltiplicazione in colonna',
      longDesc: 'Moltiplicazione in colonna (2 × 2, 3 × 2 o 4 × 2 cifre) con spazio per i prodotti parziali e i loro spostamenti di posizione, stampata su una griglia a quadretti. Pensata per i bambini di terza che conoscono già le tabelline e stanno imparando l’algoritmo scritto standard.',
      skills: ['moltiplicazione in colonna', 'prodotti parziali', 'valore posizionale'],
      settings: [
        'Preimpostazione: 2 × 2, 3 × 2 o 4 × 2 cifre',
        'Colonne: numero di colonne di problemi per pagina',
      ],
    },
    compare: {
      label: 'Confronto',
      shortDesc: 'Maggiore, minore, uguale',
      longDesc: 'Coppie di numeri da confrontare con >, < o =. Il generatore sceglie di proposito coppie insidiose: cifre scambiate (43 e 34), cifre ripetute, numeri consecutivi e circa il 15% di coppie uguali, così i bambini leggono ogni cifra invece di indovinare dalla prima.',
      skills: ['confronto di numeri', 'valore posizionale', 'simboli di disuguaglianza'],
      settings: [
        'Limite: entro 10, 20, 100 o 1000',
        'Colonne: numero di colonne di problemi per pagina',
      ],
    },
    rounding: {
      label: 'Arrotondamento',
      shortDesc: 'Arrotonda a decine, centinaia, migliaia',
      longDesc: 'Esercizi di arrotondamento alla decina, al centinaio o al migliaio più vicini con 20–40 numeri casuali per scheda. I numeri sono scelti in modo che compaiano sia casi di «arrotondamento per eccesso» sia «per difetto», compreso il difficile confine del 5.',
      skills: ['arrotondamento', 'stima', 'valore posizionale'],
      settings: [
        'Posizione: decina, centinaio o migliaio più vicini',
        'Colonne: numero di colonne di problemi per pagina',
      ],
    },
    patterns: {
      label: 'Sequenze',
      shortDesc: 'Sequenze e serie numeriche',
      longDesc: 'Sequenze numeriche con termini mancanti su tre livelli di difficoltà: passo costante (facile), passo moltiplicativo o alternato (medio) e regole combinate (difficile). I bambini trovano la regola e riempiono gli spazi, sviluppando un pensiero algebrico precoce.',
      skills: ['sequenze numeriche', 'conteggio a salti', 'successioni', 'pensiero algebrico'],
      settings: [
        'Livello: facile, medio o difficile',
      ],
    },
    eqexplore: {
      label: 'Esploratore di equazioni',
      shortDesc: 'Risolvi equazioni in modo interattivo',
      longDesc: 'Un risolutore di equazioni a schermo (non stampabile): trascina i termini oltre il segno di uguale e guarda il segno cambiare, segui i salti su una linea dei numeri, poi scrivi la risposta sul tastierino integrato. Le risposte giuste allungano la serie e fanno partire i coriandoli; quelle sbagliate ripropongono una spiegazione animata.',
      skills: ['equazioni', 'operazioni inverse', 'linea dei numeri', 'calcolo mentale'],
      settings: [
        'Operazione: addizione, sottrazione o entrambe',
        'Intervallo: dimensione dei numeri usati',
      ],
    },
  },

  pages: {
    about: {
      title: 'Informazioni su {brand}',
      navLabel: 'Chi siamo',
      description: '{brand} è un generatore gratuito e open source di schede di matematica da stampare per le classi 1ª–3ª, creato da un genitore per offrire a ogni bambino esercizi semplici senza alcun costo.',
      sections: [
        {
          heading: 'Perché esiste questo sito',
          paragraphs: [
            '{brand} è nato dal bisogno di un genitore di stampare esercizi di matematica sempre nuovi per le sue figlie, senza cercare tra siti pieni di pubblicità o pagare un abbonamento. L’obiettivo è semplice: risorse di matematica gratuite e dirette per tutti, che tu sia un genitore al tavolo della cucina, un insegnante che prepara una lezione o un tutor a cui serve un’altra pagina di esercizi.',
            'Ogni scheda viene generata a caso ogni volta che la apri o la rigeneri, così i bambini ricevono problemi nuovi invece di memorizzare una singola pagina. Le schede sono pensate per stamparsi in modo pulito su una pagina Letter o A4.',
          ],
        },
        {
          heading: 'Cosa ottieni',
          items: [
            'Schede da stampare per le classi 1ª–3ª: tabelline, addizioni e sottrazioni, addizione in colonna, moltiplicazione in colonna, confronto di numeri, arrotondamento e sequenze numeriche.',
            'Un esploratore di equazioni a schermo per giocare con le equazioni e verificare le risposte su una linea dei numeri.',
            'Difficoltà regolabile: intervalli di numeri, cifre, colonne e disposizione, ricordati sul tuo dispositivo per la prossima volta.',
            'Nessun account, nessuna registrazione, nessuna pubblicità, nessun costo. Nulla viene caricato: le schede vengono generate nel tuo browser.',
          ],
        },
        {
          heading: 'Come si usa',
          items: [
            'Scegli una scheda dal catalogo.',
            'Regola le impostazioni in base a ciò su cui sta lavorando tuo figlio.',
            'Premi Rigenera per un nuovo set casuale, poi Stampa.',
          ],
        },
        {
          heading: 'Open source',
          paragraphs: [
            'Il codice sorgente è su {github} con licenza {license}. Puoi usare, condividere e adattare le schede e il codice per scopi non commerciali citando la fonte. Segnalazioni di errori e idee per nuove schede sono benvenute.',
          ],
        },
        {
          heading: 'Chi lo gestisce',
          paragraphs: [
            '{brand} è gestito da {operator}. Consulta l’[Informativa sulla privacy](/privacy) e i [Termini di servizio](/terms). Domande e suggerimenti: {contact}.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Informativa sulla privacy',
      navLabel: 'Privacy',
      description: 'Informativa sulla privacy di {brand}: nessun account, nulla viene caricato, le impostazioni restano nel tuo browser, e Google Analytics senza cookie con consenso negato per impostazione predefinita.',
      sections: [
        {
          heading: 'In sintesi',
          paragraphs: [
            '{brand} è gestito da {operator} («noi»). Questo sito non ha account, moduli di registrazione né sezioni di commenti. Le schede vengono generate interamente nel tuo browser; nulla di ciò che scrivi o stampi ci viene inviato. L’unico servizio di terzi che riceve informazioni sull’uso è Google Analytics, nella forma senza cookie e anonimizzata descritta qui sotto.',
          ],
        },
        {
          heading: 'Cosa non raccogliamo',
          items: [
            'Nessun nome, indirizzo e-mail o altro dato personale: non c’è nulla a cui iscriversi.',
            'Nessun contenuto delle schede: i problemi di ogni scheda vengono generati sul tuo dispositivo e non vengono mai caricati.',
            'Nessun identificatore pubblicitario, nessuna rete pubblicitaria, nessun pixel di tracciamento.',
          ],
        },
        {
          heading: 'Impostazioni salvate nel tuo browser',
          paragraphs: [
            'Le impostazioni delle schede (per esempio l’intervallo di numeri o la disposizione scelta) e l’ultima scheda aperta vengono salvate nella memoria locale del browser, così il sito può riprendere da dove avevi lasciato. Questi dati restano sul tuo dispositivo, non ci vengono mai trasmessi e possono essere rimossi in qualsiasi momento cancellando i dati del sito nel browser.',
          ],
        },
        {
          heading: 'Statistiche',
          paragraphs: [
            'Usiamo Google Analytics 4, un servizio di Google LLC, per capire quali schede vengono usate e come viene trovato il sito. Il Google Consent Mode è configurato con l’archiviazione per analisi e pubblicità negata per impostazione predefinita, e non mostriamo un banner di consenso perché nessun consenso viene richiesto: Google Analytics funziona in modalità senza cookie e non imposta cookie di analisi sul tuo dispositivo.',
            'In questa modalità Google riceve solo segnali anonimizzati e aggregati: visualizzazioni di pagina, quale scheda è stata aperta, quando una scheda è stata rigenerata o stampata e quali impostazioni erano attive, insieme a dettagli tecnici come il tipo di browser, la regione approssimativa e il sito di provenienza. Gli indirizzi IP sono anonimizzati e Google Signals e le funzioni pubblicitarie sono disattivati. Non usiamo i dati statistici per identificare nessuno e non li condividiamo mai con inserzionisti.',
            'Puoi bloccare del tutto le statistiche con la protezione anti-tracciamento del browser, un blocco dei contenuti o il [componente aggiuntivo per la disattivazione di Google Analytics](https://tools.google.com/dlpage/gaoptout). Per i dettagli su come Google tratta i dati consulta l’[Informativa sulla privacy di Google](https://policies.google.com/privacy).',
          ],
        },
        {
          heading: 'Hosting e caratteri',
          paragraphs: [
            'Il sito è ospitato su Vercel e i suoi caratteri vengono caricati da Google Fonts. Come qualsiasi server web, questi fornitori vedono i dettagli tecnici di ogni richiesta (come il tuo indirizzo IP e il tipo di browser) per consegnare la pagina. Noi non riceviamo né conserviamo questi log. Consulta l’[Informativa sulla privacy di Vercel](https://vercel.com/legal/privacy-policy) e le [informazioni sulla privacy di Google Fonts](https://developers.google.com/fonts/faq/privacy).',
          ],
        },
        {
          heading: 'Bambini',
          paragraphs: [
            '{brand} crea schede per bambini di circa 6–9 anni, ma il sito è pensato per gli adulti che le stampano. Non raccogliamo consapevolmente informazioni personali da nessuno, bambini compresi, e il sito non contiene account, messaggistica né contenuti generati dagli utenti.',
          ],
        },
        {
          heading: 'Modifiche a questa informativa',
          paragraphs: [
            'Se mai aggiungessimo una funzione che cambia il modo in cui il sito gestisce i dati, aggiorneremo questa pagina e la data in alto. L’uso continuato del sito dopo una modifica implica l’accettazione dell’informativa aggiornata.',
          ],
        },
        {
          heading: 'Contatti',
          paragraphs: [
            'Domande sulla privacy: {contact}.',
          ],
        },
      ],
    },
    terms: {
      title: 'Termini di servizio',
      navLabel: 'Termini',
      description: 'Termini di servizio di {brand}: un servizio gratuito senza account, schede per uso personale e in classe, contenuti con licenza {license}, forniti così come sono.',
      sections: [
        {
          heading: 'Il servizio',
          paragraphs: [
            '{brand} è un sito gratuito gestito da {operator} («noi») che genera schede di matematica da stampare nel tuo browser. Non c’è alcun account da creare, nessun abbonamento e nessun costo. Usando il sito accetti questi termini; se non li accetti, ti preghiamo di non usare il sito.',
          ],
        },
        {
          heading: 'Uso delle schede',
          paragraphs: [
            'Puoi generare, stampare, copiare e condividere tutte le schede che vuoi per uso personale, per l’istruzione domestica, in classe e per qualsiasi altro scopo non commerciale.',
            'Le schede, i contenuti del sito e il codice sorgente sono concessi in licenza {license}: puoi condividerli e adattarli per scopi non commerciali purché citi {brand}. Vendere le schede o includerle in un prodotto o servizio a pagamento richiede il nostro permesso scritto.',
          ],
        },
        {
          heading: 'Uso accettabile',
          items: [
            'Non usare il sito in modo da violare la legge o i diritti di qualcuno.',
            'Non tentare di interrompere il sito, sovraccaricarlo con richieste automatiche o interferire con l’uso da parte di altre persone.',
            'Non rimuovere l’attribuzione dalle copie o dagli adattamenti che distribuisci.',
          ],
        },
        {
          heading: 'Nessuna garanzia',
          paragraphs: [
            'Il sito e le schede sono forniti «così come sono» e «secondo disponibilità», senza garanzie di alcun tipo. I problemi vengono generati a caso e, sebbene li testiamo, una scheda potrebbe contenere un errore o non adattarsi a un particolare programma. Verifica le risposte prima di affidarti a esse e usa il tuo giudizio su ciò che è giusto per tuo figlio o la tua classe.',
          ],
        },
        {
          heading: 'Limitazione di responsabilità',
          paragraphs: [
            'Nella misura massima consentita dalla legge, {operator} non è responsabile di perdite indirette, incidentali o consequenziali derivanti dall’uso o dall’impossibilità di usare il sito. Poiché il servizio è gratuito, la nostra responsabilità totale per qualsiasi reclamo a esso relativo è limitata all’importo che hai pagato, cioè nulla.',
          ],
        },
        {
          heading: 'Servizi e link di terzi',
          paragraphs: [
            'Il sito rimanda a servizi esterni come {github} e usa Google Analytics come descritto nell’[Informativa sulla privacy](/privacy). Non siamo responsabili dei contenuti o delle pratiche dei siti di terzi.',
          ],
        },
        {
          heading: 'Modifiche e disponibilità',
          paragraphs: [
            'Possiamo modificare, sospendere o interrompere il sito o qualsiasi scheda in qualsiasi momento, e possiamo aggiornare questi termini pubblicando una nuova versione su questa pagina. L’uso continuato del sito dopo una modifica implica l’accettazione dei termini aggiornati.',
          ],
        },
        {
          heading: 'Contatti',
          paragraphs: [
            'Domande su questi termini: {contact}.',
          ],
        },
      ],
    },
  },
}
