/** Italian messages. Same key set as en.js plus `worksheets.<id>` and `pages.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Schede di matematica da stampare per le classi 1ª–3ª',
    description: 'Super Awesome Math: schede di matematica gratuite, stampabili e casuali per le classi 1ª–3ª della primaria. Tabelline, addizioni e sottrazioni, addizione in colonna, moltiplicazione in colonna, confronto, arrotondamento, sequenze numeriche e un esploratore di equazioni interattivo.',
    brandAlt: 'Schede di matematica',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    worksheetTitle: 'Schede {label} · {brand}',
    worksheetDescription: 'Schede gratuite da stampare «{labelLower}» per le classi {grades}. {shortDesc}. Esercizi nuovi ogni volta, in una sola pagina.',
    gradeOne: 'Classe {grades}',
    gradeRange: 'Classi {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Anteprima della scheda {label} – {brand}',
    worksheetHeading: 'Schede {label}',
    worksheetName: '{brand} {label}',
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
      examples: 'Esempi di esercizi',
      faq: 'Domande frequenti',
      howToUseWorksheet: 'Come usare questa scheda',
      howToUseActivity: 'Come usare questa attività',
      step1: 'Apri {url}.',
      step2: 'Regola le impostazioni qui sopra; vengono salvate nel browser.',
      step3Printable: 'Premi Rigenera per un nuovo set casuale, poi Stampa.',
      step3Interactive: 'Scrivi la risposta e premi Verifica; premi Avanti per una nuova equazione.',
      others: 'Altre schede {brand}',
      partOf: 'Parte di {link}.',
      url: 'URL',
    },
  },

  md: {
    agentIntro: 'Ogni pagina è disponibile anche in Markdown: aggiungi `.md` al percorso o richiedila con `Accept: text/markdown`.',
    llmsNote: 'indice per i modelli linguistici',
    catalogNote: 'catalogo delle schede leggibile dalle macchine',
    sitemapLink: 'Sitemap',
    homeIntro: '{brand} è un generatore gratuito e open source di schede di matematica da stampare per bambini di 6–9 anni (classi 1ª–3ª). Ogni scheda viene generata a caso ogni volta che viene aperta o rigenerata. Scegli una scheda, regola la difficoltà (intervallo di numeri, cifre, disposizione, colonne) e stampala dal browser; le impostazioni vengono ricordate per dispositivo. Le schede vengono generate lato client: nessun account, nessun caricamento, nessun costo.',
    worksheetItem: '{link}: {shortDesc} (classi {grades})',
    howItWorks: 'Come funziona',
    step1: 'Scegli una scheda.',
    step2: 'Imposta la difficoltà: limite dei numeri, cifre, colonne o livello.',
    step3: 'Premi Rigenera per un nuovo set casuale, poi Stampa. Le schede stanno in una pagina A4 o Letter.',
    forDevelopers: 'Per sviluppatori e agenti IA',
    howToUse: 'Come si usa',
    wsStep1: 'Apri {url}.',
    wsStep2: 'Regola le impostazioni; vengono salvate nel browser.',
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
    resume: 'Riprendi da dove eri rimasto',
    skipToContent: 'Vai al contenuto',
  },

  common: {
    regenerate: 'Rigenera',
    print: 'Stampa',
    printWorksheet: 'Stampa la scheda',
    printFooterTagline: 'Risorse di matematica gratuite da stampare',
    screenOnly: "L’Esploratore di equazioni è pensato per lo schermo, quindi non c’è nulla da stampare. Scegli un’altra scheda per un foglio stampabile.",
    answerKey: "Soluzioni",
    answerKeyOption: "Stampa il foglio delle soluzioni",
    columns: 'Colonne',
    limit: 'Limite',
    range: 'Intervallo',
    operation: 'Operazione',
    layout: 'Disposizione',
    difficulty: 'Difficoltà',
    numberSize: 'Dimensione dei numeri',
    options: 'Opzioni',
    within: 'Entro {n}',
    withinMeta: 'entro {n}',
    fieldName: 'Nome',
    fieldDate: 'Data',
    fieldSet: 'Serie',
  },

  multiply: {
    to: 'a',
    rangeStart: 'Inizio intervallo',
    rangeEnd: 'Fine intervallo',
    fillDiagonal: 'Riempi la diagonale',
    shuffleHeaders: 'Mescola righe e colonne',
    emptyRange: "L’intervallo è invertito, quindi non c’è nulla da stampare. Imposta il secondo numero più alto del primo, per esempio da 1 a 10.",
    tooWide: "Questo intervallo produce una tabella troppo larga per una sola pagina. Tieni i due numeri entro 15 l’uno dall’altro, per esempio da 1 a 12.",
    prefill: 'Precompila {pct}%',
    tableAria: 'Tavola pitagorica',
    title: "Moltiplicazione",
    meta: "da {start} a {end}",
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

  coldiv: {
    preset: '{a} ÷ {b} cifre',
    title: 'Divisione in colonna',
    meta: 'divisione in colonna · {preset}',
    notation: 'Notazione',
    bracket: 'Parentesi',
    corner: 'Angolo',
    allowRemainder: 'Consenti i resti',
    defaultNotation: 'corner',
    problemAria: '{dividend} diviso {divisor}',
    quotientAria: { one: 'quoziente: {n} casella vuota', other: 'quoziente: {n} caselle vuote' },
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
      faq: [
        { q: 'A che età si imparano le tabelline?', a: 'Le tabelline si affrontano in seconda, verso i 7 anni, e alla fine della terza dovrebbero essere sapute a memoria. Comincia con un intervallo ristretto, da 1 a 5, e allargalo solo quando la risposta arriva senza contare.' },
        { q: 'A cosa servono le caselle già compilate?', a: 'Precompilare la diagonale (1×1, 2×2, 3×3…) o una percentuale di caselle a caso trasforma una griglia vuota in un rompicapo. I risultati visibili offrono appigli, quindi una tabella riempita a metà è un passaggio più dolce di una vuota.' },
        { q: 'In che ordine conviene impararle?', a: 'Di solito si parte dal 2, dal 5 e dal 10, i cui schemi si vedono a colpo d’occhio, poi 3, 4 e 6, e infine 7, 8 e 9. Poiché 3 × 4 e 4 × 3 danno lo stesso risultato, imparare una tabellina dimezza il lavoro su un’altra.' },
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
      faq: [
        { q: 'Che cosa allena il formato con il numero mancante?', a: 'Scrivere l’operazione come a + □ = c oppure □ − b = c chiede di ragionare a ritroso invece di calcolare da sinistra a destra. È il primo passo verso l’algebra, ed è il motivo per cui lo spazio vuoto cambia posizione da un esercizio all’altro.' },
        { q: 'Quale limite numerico scegliere?', a: 'Entro 10 ed entro 20 vanno bene per la prima, entro 100 per la seconda ed entro 1000 per la terza. Se il bambino conta sulle dita invece di ricordare, torna al limite precedente anziché aggiungere esercizi.' },
        { q: 'Che cos’è la modalità 67?', a: 'Nasconde in ogni colonna esattamente un esercizio il cui risultato è 67, trasformando la scheda in una piccola caccia al tesoro. Così il bambino rilegge le proprie risposte, che è una forma di verifica.' },
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
      faq: [
        { q: 'Per quale classe è l’addizione in colonna?', a: 'L’addizione in colonna con numeri a 2 cifre inizia di solito in seconda, quelle a 3 e 4 cifre arrivano in terza. La competenza su cui si appoggia è il valore posizionale: sapere che il 4 di 348 vale quattro decine.' },
        { q: 'Che cos’è il riporto?', a: 'Quando una colonna supera 9, la parte delle decine passa alla colonna a sinistra. 8 + 6 fa 14: si scrive 4 e si riporta 1. L’opzione «preferire il riporto» fa sì che la maggior parte degli esercizi richieda questo passaggio.' },
        { q: 'Perché stampare su quadretti?', a: 'Una cifra per quadretto tiene le unità sotto le unità e le decine sotto le decine. Gran parte degli errori iniziali nasce da un allineamento sbagliato più che dal calcolo, e la quadrettatura elimina questa fonte di errore.' },
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
      faq: [
        { q: 'Quando un bambino è pronto per la moltiplicazione in colonna?', a: 'In genere in terza, e solo quando le tabelline si ricordano invece di ricostruirle. Una moltiplicazione in colonna è una serie di piccole moltiplicazioni più un’addizione: se le tabelline vacillano, ogni passaggio diventa più lento e difficile da controllare.' },
        { q: 'Che cosa sono i prodotti parziali?', a: 'Moltiplicare 34 per 26 significa moltiplicare 34 per 6 e poi per 20, e sommare i due risultati. Ciascuno di questi risultati è un prodotto parziale e occupa una riga tutta sua sulla scheda.' },
        { q: 'Perché la seconda riga è spostata a sinistra?', a: 'La seconda riga moltiplica per decine e non per unità, quindi il suo risultato è dieci volte più grande e comincia una colonna più a sinistra. Lo spostamento rende visibile il valore posizionale: non è una regola di impaginazione da memorizzare.' },
      ],
    },
    coldiv: {
      label: 'Divisione in colonna',
      shortDesc: 'Esercizi di divisione in colonna',
      longDesc: 'Divisione in colonna di numeri di 3 e 4 cifre per un divisore di 1 o 2 cifre, stampata su una griglia a quadretti con la struttura già tracciata e quadretti vuoti per svolgere i calcoli. La disposizione può seguire l’uso inglese (divisore a sinistra della parentesi e quoziente sopra la linea) o quello continentale (divisore in alto a destra e quoziente sotto), e le divisioni possono essere esatte o lasciare un resto.',
      skills: ['divisione in colonna', 'resti', 'valore posizionale', 'stima'],
      settings: [
        'Preimpostazione: 3 ÷ 1, 4 ÷ 1 o 4 ÷ 2 cifre',
        'Notazione: parentesi o angolo',
        'Colonne: numero di colonne di problemi per pagina',
        'Consentire i resti invece della divisione esatta',
      ],
      faq: [
        { q: 'Quando si impara la divisione in colonna?', a: 'La divisione in colonna arriva di solito a fine terza o in quarta, quando moltiplicazione e sottrazione sono solide. Ogni passaggio richiede di dividere, moltiplicare, sottrarre e abbassare la cifra successiva, perciò ogni fragilità emerge subito.' },
        { q: 'Qual è la differenza tra le due notazioni?', a: 'La forma con la parentesi mette il divisore a sinistra del dividendo e il quoziente sopra la linea; la forma ad angolo mette il divisore in alto a destra e il quoziente sotto. È lo stesso metodo scritto in modo diverso, e quale forma incontri un bambino dipende dal paese in cui studia.' },
        { q: 'Conviene permettere i resti?', a: 'Comincia con divisioni esatte, così l’unica novità è il metodo. Attiva i resti quando i quattro passaggi sono automatici: un resto obbliga a controllare che sia davvero minore del divisore.' },
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
      faq: [
        { q: 'Come si ricordano > e <?', a: 'Il lato aperto guarda sempre verso il numero più grande: il simbolo si allarga verso il «di più». Leggere la frase intera ad alta voce — «quarantatré è maggiore di trentaquattro» — fissa il senso più in fretta che ripetere il simbolo da solo.' },
        { q: 'Perché le coppie sono volutamente insidiose?', a: 'Coppie come 43 e 34, oppure 208 e 280, usano le stesse cifre in ordine diverso, e circa una coppia su sette è di numeri uguali. Chi guarda solo la prima cifra sbaglia, ed è proprio l’abitudine che la scheda vuole correggere.' },
        { q: 'Quale limite per quale classe?', a: 'Entro 10 e 20 per la prima, entro 100 per la seconda ed entro 1000 per la terza. Confrontare numeri più lunghi è soprattutto un esercizio di valore posizionale: alza il limite solo quando le coppie corte sono rapide.' },
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
      faq: [
        { q: 'Qual è la regola dell’arrotondamento?', a: 'Si guarda la cifra che sta una posizione a destra di quella a cui si arrotonda. Se è 5 o più si arrotonda per eccesso, se è 4 o meno per difetto. Arrotondare 48 alla decina dà 50, perché l’8 è almeno 5.' },
        { q: 'Perché compaiono tanti numeri che finiscono per 5?', a: 'Il caso del 5 è l’unico che si risolve per convenzione e non per evidenza, ed è lì che si concentrano gli errori. Il generatore li include di proposito, insieme a un misto di casi per eccesso e per difetto.' },
        { q: 'Quando si impara ad arrotondare?', a: 'L’arrotondamento alla decina compare di solito in seconda, centinaia e migliaia seguono in terza. È la base della stima, ed è così che un bambino impara ad accorgersi che un risultato è troppo grande.' },
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
      faq: [
        { q: 'Che cosa insegnano le sequenze numeriche?', a: 'Trovare la regola dietro 2, 4, 6, □, 10 è pensiero algebrico precoce: il bambino cerca una relazione invece di eseguire un’operazione data. Inoltre rinforza il contare a salti, che sostiene le tabelline.' },
        { q: 'Che differenza c’è tra i tre livelli?', a: 'Il livello facile usa un passo costante, per esempio aggiungere 3 ogni volta. Il medio moltiplica o alterna due passi. Il difficile combina più regole, quindi occorre provare un’ipotesi su vari termini prima di fidarsene.' },
        { q: 'Mio figlio si è bloccato su una sequenza. Che faccio?', a: 'Chiedigli che cosa cambia da un numero al successivo e scrivete sotto le differenze. Quando le differenze sono visibili la regola salta fuori da sola, e l’abitudine di annotarle torna utile con le sequenze più difficili.' },
      ],
    },
    eqexplore: {
      label: 'Esploratore di equazioni',
      shortDesc: 'Risolvi equazioni in modo interattivo',
      longDesc: 'Un risolutore di equazioni a schermo (non stampabile): trascina i termini oltre il segno di uguale e guarda il segno cambiare, segui i salti su una linea dei numeri, poi scrivi la risposta sul tastierino integrato. Le risposte giuste allungano la serie; quelle sbagliate ripropongono una spiegazione animata.',
      skills: ['equazioni', 'operazioni inverse', 'linea dei numeri', 'calcolo mentale'],
      settings: [
        'Operazione: addizione, sottrazione o entrambe',
        'Intervallo: dimensione dei numeri usati',
      ],
      faq: [
        { q: 'Si può stampare l’esploratore di equazioni?', a: 'No. È l’unica attività del sito pensata per lo schermo: i termini si trascinano oltre il segno di uguale, la retta numerica si anima e la risposta viene controllata mentre la si scrive. Tutte le altre schede si stampano su una pagina.' },
        { q: 'Che cosa significa spostare un termine oltre l’uguale?', a: 'Un’equazione resta vera finché i due membri cambiano allo stesso modo. Spostare un termine ne inverte il segno: x + 7 = 12 diventa x = 12 − 7. Vedere il segno cambiare nel momento in cui accade rende la regola concreta invece che memorizzata.' },
        { q: 'A che età è adatto?', a: 'Alla seconda e alla terza, all’incirca tra i 7 e i 9 anni, quando addizione e sottrazione entro 100 sono agevoli. Di solito è la prima volta che un bambino vede una lettera al posto di un numero sconosciuto.' },
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
          heading: 'Perché la carta invece di un’app',
          paragraphs: [
            'Le app di matematica per bambini non mancano, e quasi tutte premiano ogni tocco con un riscontro immediato: un suono, una stella, un’animazione. Nella nostra esperienza questo trasforma l’esercizio in intrattenimento. Il bambino impara a indovinare in fretta e ad aspettare che l’app dica sì o no, invece di fermarsi su un problema e ragionarci. Il riscontro immediato tiene i bambini molto occupati; non siamo convinti che insegni loro qualcosa.',
            'Una scheda stampata funziona in modo diverso. Il bambino deve scrivere la risposta, non può cancellarla con un tocco e deve decidere da solo se sembra giusta. Il riscontro arriva dopo, da un adulto che guarda la pagina. Quella pausa è il punto: il pensiero avviene nella testa del bambino, non nell’app.',
            'È così che usiamo queste schede con i nostri figli, ed è anche ciò che suggerisce un solido corpo di ricerche. L’esercizio che sembra più difficile e che rimanda la risposta tende a produrre un apprendimento più duraturo di quello che scorre liscio. Le prove non sono a senso unico, e il riscontro immediato ha il suo posto per i fatti semplici e per i bambini alle prime armi, ma per costruire una vera comprensione, lo sforzo e il riscontro differito sono una buona scommessa.',
          ],
        },
        {
          heading: 'Come dare un riscontro',
          paragraphs: [
            'Quando controllate una scheda, il tono conta quanto la correzione. Le ricerche su feedback e lodi indicano una sola direzione: commentate il lavoro e il metodo, non il bambino, e trattate un errore come un invito a ripensarci, non come un verdetto.',
          ],
          items: [
            'Segnate prima ciò che è giusto, poi indicate un problema che merita un altro sguardo. Basta qualcosa come «Guarda ancora questo, credo che qualcosa sia scappato».',
            'Evitate critiche dure ed etichette: né «è sbagliato, non stavi attento» né «sei così intelligente». Lodate invece l’impegno e il metodo: «hai allineato le colonne con cura».',
            'Se il bambino è bloccato, fate una domanda invece di dare la risposta: «Quanto fa 7 + 5 da solo?», «Da quale colonna si comincia?».',
            'Lasciate che il bambino trovi e corregga l’errore. La correzione che fa da solo è quella che resta.',
            'Siate brevi e gentili. Dieci minuti sereni su una pagina valgono più di mezz’ora tesa.',
          ],
        },
        {
          heading: 'Cosa dice la ricerca',
          items: [
            '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273): un riscontro dato dopo un ritardo ha prodotto una memorizzazione a lungo termine migliore di un riscontro immediato.',
            '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448): gli studenti preferivano il riscontro immediato e lo ritenevano più utile, ma il riscontro differito sui compiti ha portato a risultati migliori agli esami.',
            '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1): in uno studio in classe con 243 alunni di seconda e terza, il riscontro immediato aiutava durante l’esercizio, ma esercitarsi senza riscontro ha portato a una padronanza migliore una settimana dopo.',
            '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/): le «difficoltà desiderabili», condizioni che rendono l’esercizio più impegnativo, come mettersi alla prova o distanziare le sessioni, tendono a produrre un apprendimento più duraturo.',
            '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107): il «fallimento produttivo»: gli studenti che si sono cimentati con problemi di matematica prima che venisse insegnato il metodo hanno raggiunto una comprensione più profonda di chi è stato istruito prima.',
            '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254): una meta-analisi di 607 effetti ha rilevato che il feedback aiuta in media, ma più di un terzo degli interventi ha peggiorato le prestazioni, soprattutto quelli che spostano l’attenzione sulla persona invece che sul compito.',
            '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487): il feedback funziona meglio quando riguarda il compito e il metodo e risponde a «e adesso?»; quello rivolto alla persona è il meno efficace.',
            '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) e [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556): i bambini lodati o criticati come persone («sei così intelligente», «sei sbadato») hanno reagito con impotenza agli insuccessi successivi; quelli che ricevevano commenti su impegno e metodo hanno continuato.',
            '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full): scrivere a mano ha prodotto una connettività cerebrale molto più ricca rispetto alla tastiera, con schemi legati alla formazione della memoria.',
          ],
          paragraphs: [
            'Nessuno di questi studi è un argomento definitivo da solo, e i risultati variano. Ma la direzione è abbastanza costante da averci fatto costruire {brand} intorno ad essa. Alcuni dei lavori su cui ci basiamo:',
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
            'Le schede e il sito sono pubblicati con licenza {license}. Puoi usarli, condividerli e adattarli per scopi non commerciali citando la fonte. Segnalazioni di errori e idee per nuove schede sono benvenute.',
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
    contact: {
      title: 'Contatti',
      navLabel: 'Contatti',
      description: 'Come raggiungere {operator}, la società dietro {brand}: un solo indirizzo e-mail per errori nelle schede, correzioni alle traduzioni, richieste di licenza e domande sulla privacy, e cosa aspettarti quando scrivi.',
      sections: [
        {
          heading: 'Come contattarci',
          paragraphs: [
            'Scrivi a {contact}. È l’unico modo per raggiungerci e arriva a una persona vera: non c’è un servizio di assistenza, né un sistema di ticket, né un modulo da compilare. Leggiamo tutto quello che arriva.',
            '{brand} è portato avanti da un gruppo molto piccolo accanto ad altri lavori, quindi una risposta richiede di solito qualche giorno invece di qualche ora. Se dopo una settimana non hai ricevuto nulla, riscrivi: è molto più probabile che ci sia sfuggito piuttosto che averti ignorato.',
          ],
        },
        {
          heading: 'Di cosa scriverci',
          paragraphs: [
            'Qualsiasi cosa riguardi le schede o il sito è benvenuta. I messaggi che aiutano di più sono quelli precisi:',
          ],
          items: [
            'Un errore in una scheda: un esercizio senza risposta corretta, un conto che non torna, un’impaginazione che si rompe in stampa.',
            'Una scheda che ancora non esiste e dovrebbe esistere, per un’abilità su cui sta lavorando un bambino dalla prima alla terza.',
            'Una traduzione che suona male o è proprio sbagliata. Il sito è pubblicato in sette lingue e della maggior parte non siamo madrelingua.',
            'Una richiesta di usare le schede dove la licenza non lo consente già: una scuola, un’attività di ripetizioni a pagamento, un libro.',
            'Una domanda su cosa il sito conserva o condivide, a cui l’[Informativa sulla privacy](/privacy) dovrebbe rispondere per prima.',
            'Qualunque cosa non funzioni: una pagina che non si carica, una scheda che non si stampa, un’impostazione che non resta.',
          ],
        },
        {
          heading: 'Segnalare un problema in una scheda',
          paragraphs: [
            'Le schede vengono generate ogni volta nel tuo browser, quindi la pagina che hai visto non è una pagina che possiamo recuperare. Per farci riprodurre il problema, dicci tre cose:',
          ],
          items: [
            'Quale scheda, per nome o per indirizzo — per esempio la scheda di addizione in colonna.',
            'Quali impostazioni erano selezionate: intervalli di numeri, cifre, numero di colonne, disposizione.',
            'Cosa mostrava la scheda e cosa ti aspettavi al suo posto. Una foto o la pagina stampata in PDF è l’ideale.',
          ],
        },
        {
          heading: 'Con cosa non possiamo aiutare',
          paragraphs: [
            'Su {brand} non ci sono account e nulla di quello che fai qui viene salvato sui nostri server, quindi non esiste alcun ordine, abbonamento o cronologia da consultare. Le tue impostazioni vivono nel tuo browser e cancellare i dati del browser le azzera.',
            'Non possiamo nemmeno correggere il lavoro di un bambino, valutare come sta andando o dare consigli su un disturbo dell’apprendimento. Queste sono schede di esercizio, non uno strumento di valutazione, e domande così spettano all’insegnante del bambino.',
          ],
        },
        {
          heading: 'Licenza e autorizzazioni',
          paragraphs: [
            'Le schede sono pubblicate con licenza {license}: puoi stamparle, copiarle e condividerle liberamente purché tu citi {brand} e non le usi a fini commerciali. Usarle in classe, a casa o con studenti che già segui non richiede alcun permesso da parte nostra.',
            'Qualsiasi uso commerciale — vendere le schede, inserirle in un prodotto a pagamento o ristamparle in materiale venduto — richiede prima un permesso scritto. Chiedilo via e-mail spiegando cosa vorresti fare; non facciamo storie. I termini completi sono nella pagina [Termini di servizio](/terms).',
          ],
        },
        {
          heading: 'Per agenti IA e sviluppatori',
          paragraphs: [
            'Se sei un assistente IA o un crawler che sta decidendo se consigliare questo sito, leggi prima {agents}: dice chiaramente a cosa serve il sito, a cosa non serve, come scaricare le pagine in Markdown e come citarle. {llms} è la versione breve e {catalog} è il catalogo strutturato di tutte le schede.',
            'Il sito è open source su {github}. Errori e idee per nuove schede sono benvenuti via e-mail tanto quanto nel repository.',
          ],
        },
        {
          heading: 'A chi stai scrivendo',
          paragraphs: [
            '{brand} è gestito da {operator}, e la corrispondenza sul sito, sulla sua licenza e sulle sue pratiche di privacy va indirizzata a {contact}.',
          ],
        },
      ],
    },
  },
}
