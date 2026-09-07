/** Spanish messages. Same key set as en.js plus `worksheets.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: 'Fichas de matemáticas para imprimir de 1.º a 3.º de primaria',
    description: 'Super Awesome Math: fichas de matemáticas gratuitas, imprimibles y aleatorias para 1.º a 3.º de primaria. Tablas de multiplicar, sumas y restas, suma en columna, multiplicación en columna, comparación, redondeo, series numéricas y un explorador de ecuaciones interactivo.',
    brandAlt: 'Fichas de matemáticas',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    worksheetTitle: 'Fichas de {label} · {brand}',
    worksheetDescription: 'Fichas gratuitas de {labelLower} para imprimir, cursos {grades}. {shortDesc}. Ejercicios nuevos cada vez, en una sola página.',
    gradeOne: 'Curso {grades}',
    gradeRange: 'Cursos {grades}',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: 'Vista previa de la ficha de {label} – {brand}',
    worksheetHeading: 'Fichas de {label}',
    worksheetName: '{brand} {label}',
    worksheetList: 'Fichas de {brand}',
    learningResourceWorksheet: 'Ficha de ejercicios',
    learningResourceInteractive: 'Ejercicio interactivo',
    featureItem: '{label}: {shortDesc}',
  },

  static: {
    breadcrumb: 'Ruta de navegación',
    worksheetTypes: 'Tipos de fichas',
    lastUpdated: 'Última actualización: {date}',
    footerSite: 'Sitio',
    home: {
      subtitle: 'Fichas de práctica gratuitas y aleatorias que imprimes con un clic.',
      intro1: '{brand} es un generador gratuito y de código abierto de fichas de matemáticas para imprimir, para niños de 6 a 9 años (1.º a 3.º de primaria). Cada ficha se genera al azar cada vez que la abres o la regeneras, así los niños practican con ejercicios nuevos en vez de memorizar una página. Elige una ficha, ajusta la dificultad (rango de números, cifras, disposición, columnas) e imprímela desde el navegador; tus ajustes se recuerdan en este dispositivo.',
      intro2: 'El catálogo incluye tablas de multiplicar, sumas y restas con huecos, suma en columna con llevadas, multiplicación en columna, comparación de números con >, < y =, redondeo a la decena, centena y millar más cercanos, y series numéricas. El explorador de ecuaciones es una actividad en pantalla en la que los niños mueven términos a través del signo igual y comprueban su respuesta en una recta numérica.',
      worksheets: 'Fichas',
      howItWorks: 'Cómo funciona',
      step1: 'Elige una ficha de la lista de arriba.',
      step2: 'Ajusta la dificultad: límite de números, cifras, columnas o nivel.',
      step3: 'Pulsa Regenerar para un nuevo conjunto aleatorio y luego Imprimir. Las fichas caben en una página A4 o Carta.',
      audienceHeading: 'Para docentes, familias y agentes de IA',
      audienceText: 'Las fichas se generan en el navegador: no se sube nada, no hay cuenta ni coste. {brand} lo creó un padre para complementar el currículo de matemáticas de 1.º a 3.º y es libre de usar y adaptar con fines no comerciales.',
    },
    worksheet: {
      skills: 'Habilidades',
      format: 'Formato',
      formatInteractive: 'interactivo, en pantalla',
      formatPrintable: 'imprimible, aleatorio en cada carga',
      settings: 'Ajustes',
      examples: 'Ejemplos de ejercicios',
      faq: 'Preguntas frecuentes',
      howToUseWorksheet: 'Cómo usar esta ficha',
      howToUseActivity: 'Cómo usar esta actividad',
      step1: 'Abre {url}.',
      step2: 'Ajusta las opciones de arriba; se guardan en tu navegador.',
      step3Printable: 'Pulsa Regenerar para un nuevo conjunto aleatorio y luego Imprimir.',
      step3Interactive: 'Escribe la respuesta y pulsa Comprobar; pulsa Siguiente para una nueva ecuación.',
      others: 'Otras fichas de {brand}',
      partOf: 'Parte de {link}.',
      url: 'URL',
    },
  },

  md: {
    agentIntro: 'Cada página también está disponible en Markdown: añade `.md` a la ruta o pídela con `Accept: text/markdown`.',
    llmsNote: 'índice para modelos de lenguaje',
    catalogNote: 'catálogo de fichas legible por máquinas',
    sitemapLink: 'Sitemap',
    homeIntro: '{brand} es un generador gratuito y de código abierto de fichas de matemáticas para imprimir, para niños de 6 a 9 años (1.º a 3.º de primaria). Cada ficha se genera al azar cada vez que se abre o se regenera. Elige una ficha, ajusta la dificultad (rango de números, cifras, disposición, columnas) e imprímela desde el navegador; los ajustes se recuerdan por dispositivo. Las fichas se generan en el cliente: sin cuenta, sin subidas, sin coste.',
    worksheetItem: '{link}: {shortDesc} (cursos {grades})',
    howItWorks: 'Cómo funciona',
    step1: 'Elige una ficha.',
    step2: 'Ajusta la dificultad: límite de números, cifras, columnas o nivel.',
    step3: 'Pulsa Regenerar para un nuevo conjunto aleatorio y luego Imprimir. Las fichas caben en una página A4 o Carta.',
    forDevelopers: 'Para desarrolladores y agentes de IA',
    howToUse: 'Cómo usarla',
    wsStep1: 'Abre {url}.',
    wsStep2: 'Ajusta las opciones; se guardan en el navegador.',
    devLlmsNote: 'índice llmstxt.org',
    devLlmsFullNote: 'el Markdown de todas las páginas en un solo archivo',
    devIndexNote: 'la página de inicio en Markdown',
    negotiationText: 'Cada URL de página responde a `Accept: text/markdown` con `Content-Type: text/markdown; charset=utf-8` y `Vary: Accept` (convención acceptmarkdown.com). Las respuestas HTML llevan `Link: <…md>; rel="alternate"; type="text/markdown"`. Las peticiones que no aceptan ni HTML ni Markdown reciben `406 Not Acceptable`. Las rutas desconocidas devuelven HTTP 404 con un cuerpo Markdown que indica dónde buscar.',
    languagesText: 'Las páginas en inglés están en la raíz del sitio; las mismas páginas están disponibles en {languages} bajo un prefijo de dos letras (por ejemplo {example}). Cada página enlaza sus traducciones con hreflang.',
    adding1: 'Añade una entrada en `src/worksheets.js` (id, slug, etiqueta, descripciones, cursos, habilidades, ajustes) y sus traducciones en `src/i18n/messages/<locale>.js`.',
    adding2: 'Crea el componente en `src/components/` y regístralo en los mapas `COMPONENTS` e `ICONS` de `src/App.jsx`.',
    adding3: 'Ejecuta `npm test` y `npm run build`; las páginas estáticas, los gemelos Markdown, el sitemap, llms.txt y el catálogo JSON se regeneran a partir del catálogo.',
    markdownLink: 'Markdown',
    lastUpdated: 'Última actualización',
    moreFrom: 'Más de {brand}',
    homeLink: 'Inicio de {brand}',
  },

  llms: {
    optionalLocale: 'Página de inicio en {language}',
  },

  notFound: {
    title: '404 – Página no encontrada',
    body: 'La ruta {path}no existe en {site}. Esta respuesta tiene el estado HTTP 404.',
    whereNext: 'Dónde buscar',
    home: 'Inicio de {brand}',
    worksheet: 'Fichas de {label}',
    sitemap: 'Sitemap',
    llms: 'llms.txt',
    catalog: 'Catálogo de fichas (JSON)',
    twinMd: 'Cada página HTML también tiene un gemelo Markdown (añade `.md` o envía `Accept: text/markdown`).',
    twinHtml: 'Cada página también tiene un gemelo Markdown: añade {code} o envía {accept}.',
  },

  app: {
    subtitle: 'Fichas de matemáticas para imprimir de 1.º a 3.º de primaria',
    allSheets: 'Todas las fichas',
    worksheetTypes: 'Tipos de fichas',
    sourceOnGitHub: 'Código fuente en GitHub',
    language: 'Idioma',
    resume: 'Continuar donde lo dejaste',
    skipToContent: 'Ir al contenido',
  },

  common: {
    regenerate: 'Regenerar',
    print: 'Imprimir',
    printWorksheet: 'Imprimir la hoja',
    printFooterTagline: 'Recursos de matemáticas gratuitos para imprimir',
    screenOnly: "El Explorador de ecuaciones está pensado para la pantalla, así que no hay nada que imprimir. Elige otra ficha para obtener una hoja imprimible.",
    answerKey: "Solucionario",
    answerKeyOption: "Imprimir el solucionario",
    columns: 'Columnas',
    limit: 'Límite',
    range: 'Rango',
    operation: 'Operación',
    layout: 'Disposición',
    difficulty: 'Dificultad',
    numberSize: 'Tamaño de los números',
    options: 'Opciones',
    within: 'Hasta {n}',
    withinMeta: 'hasta {n}',
    fieldName: 'Nombre',
    fieldDate: 'Fecha',
    fieldSet: 'Serie',
  },

  multiply: {
    to: 'a',
    rangeStart: 'Inicio del rango',
    rangeEnd: 'Fin del rango',
    fillDiagonal: 'Rellenar la diagonal',
    shuffleHeaders: 'Mezclar filas y columnas',
    emptyRange: "El rango está invertido, así que no hay nada que imprimir. Pon el segundo número más alto que el primero, por ejemplo de 1 a 10.",
    prefill: 'Prerrellenar {pct} %',
    tableAria: 'Tabla de multiplicar',
    title: "Multiplicación",
    meta: "{start} a {end}",
  },

  addsub: {
    inline: 'En línea',
    stacked: 'En columna',
    sixtySeven: 'Modo 67',
    title: 'Suma y resta',
  },

  coladd: {
    digitPreset: '{d} cifras',
    preferCarry: 'Priorizar las llevadas',
    title: 'Suma en columna',
    meta: 'números de {d} cifras',
  },

  colmul: {
    preset: '{a} × {b} cifras',
    title: 'Multiplicación en columna',
    meta: 'multiplicación en columna · {preset}',
    problemAria: '{a} por {b}',
  },

  coldiv: {
    preset: '{a} ÷ {b} cifras',
    title: 'División larga',
    meta: 'división larga · {preset}',
    notation: 'Notación',
    bracket: 'Corchete',
    corner: 'Caja',
    allowRemainder: 'Permitir restos',
    defaultNotation: 'corner',
    problemAria: '{dividend} dividido entre {divisor}',
    quotientAria: { one: 'cociente: {n} casilla vacía', other: 'cociente: {n} casillas vacías' },
  },

  compare: {
    title: 'Comparación',
  },

  rounding: {
    roundTo: 'Redondear a',
    nearest: 'A la {n} más cercana',
    title: 'Redondeo',
    meta: 'a la {n} más cercana',
  },

  patterns: {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    title: 'Series numéricas',
    instructions: 'Completa los números que faltan en cada serie.',
  },

  eq: {
    newProblem: 'Nueva',
    streak: { one: '{n} seguida', other: '{n} seguidas' },
    hint: 'Consejo: arrastra un número al otro lado del signo = para reorganizar',
    reset: 'Restablecer la ecuación',
    check: 'Comprobar',
    next: 'Siguiente',
    keypad: 'Teclado numérico',
    backspace: 'Borrar',
    clear: 'Limpiar',
    yourAnswer: 'Tu respuesta',
    drag: 'Arrastra {n} para reorganizar la ecuación',
    numberLineAria: 'Recta numérica que muestra {a} {op} {b} = {result}',
    correct: '¡Correcto!',
    wrong: 'No del todo: inténtalo de nuevo o mira cómo funciona abajo',
    numberLine: 'Recta numérica',
    tenFrame: 'Marco de diez',
    replay: 'Repetir',
    gotIt: 'Entendido',
  },

  error: {
    title: 'Algo ha salido mal',
    hint: 'Prueba a recargar la página.',
    reload: 'Recargar',
  },

  worksheets: {
    multiply: {
      label: 'Multiplicación',
      shortDesc: 'Tablas de multiplicar y cuadrícula',
      longDesc: 'Una cuadrícula de tabla de multiplicar para cualquier rango de factores, con celdas prerrellenadas opcionales para que los niños descubran patrones antes de completar el resto. Útil para aprender las tablas de memoria, comprobar la velocidad de recuerdo y practicar la propiedad conmutativa (3 × 4 = 4 × 3).',
      skills: ['tablas de multiplicar', 'hechos de multiplicación', 'series numéricas'],
      settings: [
        'Rango de la tabla: elige el primer y el último factor',
        'Prerrellenar la diagonal (1×1, 2×2, …)',
        'Porcentaje de celdas prerrellenadas al azar',
      ],
      faq: [
        { q: '¿A qué edad se aprenden las tablas de multiplicar?', a: 'Las tablas se introducen en 2.º de primaria, hacia los 7 años, y se espera un dominio de memoria al final de 3.º. Empieza con un rango pequeño, del 1 al 5, y amplíalo solo cuando la respuesta salga sin contar.' },
        { q: '¿Para qué sirven las casillas rellenadas de antemano?', a: 'Rellenar la diagonal (1×1, 2×2, 3×3…) o un porcentaje de casillas al azar convierte una cuadrícula vacía en un rompecabezas. Las respuestas visibles dan puntos de apoyo, así que una tabla medio llena es un paso más suave que una en blanco.' },
        { q: '¿En qué orden conviene aprenderlas?', a: 'Lo habitual es empezar por el 2, el 5 y el 10, cuyos patrones se ven a simple vista, seguir con el 3, el 4 y el 6, y dejar el 7, el 8 y el 9 para el final. Como 3 × 4 y 4 × 3 dan lo mismo, aprender una tabla reduce a la mitad el trabajo de otra.' },
      ],
    },
    addsub: {
      label: 'Suma y resta',
      shortDesc: 'Ejercicios de suma y resta',
      longDesc: 'Sumas y restas aleatorias hasta 10, 20, 100 o 1000, con el hueco en una posición al azar (a + □ = c, □ − b = c, a − b = □). Elige disposición en línea o en columna y de 2 a 4 columnas; el «modo 67» esconde exactamente un problema por columna cuya respuesta es 67, para una pequeña búsqueda del tesoro.',
      skills: ['suma', 'resta', 'sumando desconocido', 'cálculo mental'],
      settings: [
        'Operación: suma, resta o ambas',
        'Límite: hasta 10, 20, 100 o 1000',
        'Disposición: en línea o en columna (vertical)',
        'Columnas: 2, 3 o 4 (20–40 problemas)',
        'Modo 67: una respuesta oculta de 67 por columna',
      ],
      faq: [
        { q: '¿Qué se practica con el formato de número que falta?', a: 'Escribir la operación como a + □ = c o □ − b = c obliga a razonar hacia atrás en lugar de calcular de izquierda a derecha. Es el primer paso hacia el álgebra, y por eso el hueco cambia de posición de un ejercicio a otro.' },
        { q: '¿Qué límite de números elijo?', a: 'Hasta 10 y hasta 20 para 1.º, hasta 100 para 2.º y hasta 1000 para 3.º. Si el niño cuenta con los dedos en lugar de recordar, baja un límite en vez de añadir más ejercicios.' },
        { q: '¿Qué es el modo 67?', a: 'Esconde en cada columna exactamente un ejercicio cuyo resultado es 67, y convierte la ficha en una pequeña búsqueda del tesoro. Así el niño repasa sus propias respuestas, que es una forma de comprobación.' },
      ],
    },
    coladd: {
      label: 'Suma en columna',
      shortDesc: 'Suma vertical de varias cifras',
      longDesc: 'Suma vertical (en columna) de números de 2, 3 o 4 cifras sobre una cuadrícula de cuaderno, una cifra por celda, para practicar la alineación de los valores posicionales y las llevadas. La opción «priorizar las llevadas» genera problemas que necesitan al menos una llevada.',
      skills: ['suma en columna', 'llevadas', 'valor posicional'],
      settings: [
        'Cifras: números de 2, 3 o 4 cifras',
        'Columnas: número de columnas de problemas por página',
        'Priorizar los problemas que requieren llevadas',
      ],
      faq: [
        { q: '¿Para qué curso es la suma en columna?', a: 'La suma vertical con números de 2 cifras suele empezar en 2.º, y las de 3 y 4 cifras llegan en 3.º. La destreza de la que depende es el valor posicional: saber que el 4 de 348 vale cuatro decenas.' },
        { q: '¿Qué es llevar, o reagrupar?', a: 'Cuando una columna suma más de 9, la parte de las decenas pasa a la columna de la izquierda. 8 + 6 son 14: se escribe el 4 y se lleva 1. La opción «preferir ejercicios con llevada» hace que la mayoría de los ejercicios requieran ese paso.' },
        { q: '¿Por qué imprimir sobre cuadrícula?', a: 'Una cifra por casilla mantiene las unidades bajo las unidades y las decenas bajo las decenas. La mayoría de los errores iniciales son de alineación y no de cálculo, y la cuadrícula elimina esa fuente de error.' },
      ],
    },
    colmul: {
      label: 'Multiplicación en columna',
      shortDesc: 'Práctica de multiplicación en columna',
      longDesc: 'Multiplicación en columna (2 × 2, 3 × 2 o 4 × 2 cifras) con espacio para los productos parciales y sus desplazamientos posicionales, impresa sobre una cuadrícula de cuaderno. Pensada para alumnos de 3.º que ya saben las tablas y están aprendiendo el algoritmo escrito estándar.',
      skills: ['multiplicación en columna', 'productos parciales', 'valor posicional'],
      settings: [
        'Preajuste: 2 × 2, 3 × 2 o 4 × 2 cifras',
        'Columnas: número de columnas de problemas por página',
      ],
      faq: [
        { q: '¿Cuándo está listo un niño para la multiplicación en columna?', a: 'Normalmente en 3.º, y solo cuando las tablas se recuerdan en lugar de reconstruirse. Una multiplicación en columna es una serie de multiplicaciones pequeñas más una suma: si las tablas flaquean, cada paso se vuelve más lento y difícil de comprobar.' },
        { q: '¿Qué son los productos parciales?', a: 'Multiplicar 34 por 26 es multiplicar 34 por 6 y luego por 20, y sumar ambos resultados. Cada uno de esos resultados es un producto parcial y ocupa su propia fila en la ficha.' },
        { q: '¿Por qué la segunda fila se desplaza a la izquierda?', a: 'La segunda fila multiplica por decenas, no por unidades, así que su resultado es diez veces mayor y empieza una columna más a la izquierda. El desplazamiento hace visible el valor posicional; no es una norma de formato que haya que memorizar.' },
      ],
    },
    coldiv: {
      label: 'División larga',
      shortDesc: 'Práctica de división larga',
      longDesc: 'División larga de números de 3 y 4 cifras entre un divisor de 1 o 2 cifras, impresa sobre una cuadrícula de cuaderno con la caja ya dibujada y casillas vacías para hacer la operación. El marco puede escribirse a la manera inglesa (divisor a la izquierda del corchete y cociente sobre la raya) o a la continental (divisor arriba a la derecha y cociente debajo), y las divisiones pueden ser exactas o dejar resto.',
      skills: ['división larga', 'restos', 'valor posicional', 'estimación'],
      settings: [
        'Preajuste: 3 ÷ 1, 4 ÷ 1 o 4 ÷ 2 cifras',
        'Notación: corchete o caja',
        'Columnas: número de columnas de problemas por página',
        'Permitir restos en lugar de división exacta',
      ],
      faq: [
        { q: '¿Cuándo se aprende la división larga?', a: 'La división larga suele llegar al final de 3.º o en 4.º, cuando la multiplicación y la resta están consolidadas. Cada paso exige dividir, multiplicar, restar y bajar la cifra siguiente, así que cualquier debilidad se nota enseguida.' },
        { q: '¿Qué diferencia hay entre las dos notaciones?', a: 'La forma con corchete coloca el divisor a la izquierda del dividendo y el cociente sobre la línea superior; la forma en ángulo coloca el divisor arriba a la derecha y el cociente debajo. Es el mismo método escrito de otra manera, y la forma que ve un niño depende del país donde estudia.' },
        { q: '¿Conviene permitir restos?', a: 'Empieza con divisiones exactas, para que lo único nuevo sea el método. Activa los restos cuando los cuatro pasos sean automáticos: un resto obliga a comprobar que de verdad es menor que el divisor.' },
      ],
    },
    compare: {
      label: 'Comparación',
      shortDesc: 'Mayor que, menor que, igual',
      longDesc: 'Pares de números para comparar con >, < o =. El generador elige a propósito pares engañosos: cifras intercambiadas (43 y 34), cifras repetidas, vecinos consecutivos y alrededor de un 15 % de pares iguales, para que los niños lean todas las cifras en lugar de adivinar por la primera.',
      skills: ['comparar números', 'valor posicional', 'símbolos de desigualdad'],
      settings: [
        'Límite: hasta 10, 20, 100 o 1000',
        'Columnas: número de columnas de problemas por página',
      ],
      faq: [
        { q: '¿Cómo ayudo a recordar > y <?', a: 'El lado abierto siempre mira al número mayor: el símbolo se ensancha hacia «más». Leer la frase entera en voz alta —«cuarenta y tres es mayor que treinta y cuatro»— fija el sentido más rápido que repetir el símbolo aislado.' },
        { q: '¿Por qué las parejas son deliberadamente engañosas?', a: 'Parejas como 43 y 34, o 208 y 280, usan las mismas cifras en otro orden, y aproximadamente una de cada siete parejas es igual. Quien mira solo la primera cifra falla, y ese es justamente el hábito que la ficha quiere corregir.' },
        { q: '¿Qué límite corresponde a cada curso?', a: 'Hasta 10 y 20 para 1.º, hasta 100 para 2.º y hasta 1000 para 3.º. Comparar números largos es sobre todo un ejercicio de valor posicional: sube el límite solo cuando las parejas cortas salgan rápido.' },
      ],
    },
    rounding: {
      label: 'Redondeo',
      shortDesc: 'Redondear a la decena, centena y millar',
      longDesc: 'Práctica de redondeo a la decena, centena o millar más cercanos con 20–40 números aleatorios por ficha. Los números se eligen para que aparezcan tanto casos de «redondear hacia arriba» como «hacia abajo», incluido el difícil límite del 5.',
      skills: ['redondeo', 'estimación', 'valor posicional'],
      settings: [
        'Posición: decena, centena o millar más cercano',
        'Columnas: número de columnas de problemas por página',
      ],
      faq: [
        { q: '¿Cuál es la regla del redondeo?', a: 'Se mira la cifra situada una posición a la derecha de aquella a la que se redondea. Si es 5 o más, se redondea hacia arriba; si es 4 o menos, hacia abajo. Redondear 48 a la decena da 50, porque el 8 es 5 o más.' },
        { q: '¿Por qué aparecen tantos números acabados en 5?', a: 'El caso del 5 es el único que se resuelve por convenio y no por evidencia, y es donde se concentran los errores. El generador los incluye a propósito, junto con una mezcla de casos que redondean hacia arriba y hacia abajo.' },
        { q: '¿Cuándo se aprende a redondear?', a: 'El redondeo a la decena suele aparecer en 2.º, y la centena y el millar en 3.º. Es la base de la estimación, que es como un niño aprende a notar que un resultado es demasiado grande.' },
      ],
    },
    patterns: {
      label: 'Series',
      shortDesc: 'Series y sucesiones numéricas',
      longDesc: 'Series numéricas con términos que faltan en tres niveles de dificultad: paso constante (fácil), paso multiplicativo o alterno (medio) y reglas combinadas (difícil). Los niños descubren la regla y rellenan los huecos, lo que desarrolla un pensamiento algebraico temprano.',
      skills: ['series numéricas', 'contar a saltos', 'sucesiones', 'pensamiento algebraico'],
      settings: [
        'Nivel: fácil, medio o difícil',
      ],
      faq: [
        { q: '¿Qué enseñan las series numéricas?', a: 'Encontrar la regla detrás de 2, 4, 6, □, 10 es pensamiento algebraico temprano: el niño busca una relación en lugar de aplicar una operación dada. Además refuerza el conteo salteado, que sostiene las tablas de multiplicar.' },
        { q: '¿En qué se diferencian los tres niveles?', a: 'El nivel fácil usa un paso constante, por ejemplo sumar 3 cada vez. El medio multiplica o alterna dos pasos. El difícil combina reglas, así que hay que probar una hipótesis con varios términos antes de darla por buena.' },
        { q: 'Mi hijo se ha atascado en una serie. ¿Qué hago?', a: 'Pregúntale qué cambia de un número al siguiente y escribid las diferencias debajo. Con las diferencias a la vista la regla suele saltar sola, y la costumbre de anotarlas sirve luego para series más difíciles.' },
      ],
    },
    eqexplore: {
      label: 'Explorador de ecuaciones',
      shortDesc: 'Resuelve ecuaciones de forma interactiva',
      longDesc: 'Un resolutor de ecuaciones en pantalla (no imprimible): arrastra términos al otro lado del signo igual y observa cómo cambia el signo, sigue los saltos en una recta numérica y escribe la respuesta en el teclado integrado. Las respuestas correctas suman una racha y lanzan confeti; las incorrectas reproducen una explicación animada.',
      skills: ['ecuaciones', 'operaciones inversas', 'recta numérica', 'cálculo mental'],
      settings: [
        'Operación: suma, resta o ambas',
        'Rango: tamaño de los números usados',
      ],
      faq: [
        { q: '¿Se puede imprimir el explorador de ecuaciones?', a: 'No. Es la única actividad del sitio pensada para la pantalla: los términos se arrastran al otro lado del igual, la recta numérica se anima y la respuesta se comprueba al escribirla. Todas las demás fichas se imprimen en una página.' },
        { q: '¿Qué significa pasar un término al otro lado del igual?', a: 'Una ecuación sigue siendo cierta mientras ambos lados cambien igual. Pasar un término invierte su signo: x + 7 = 12 se convierte en x = 12 − 7. Ver cómo cambia el signo en el momento hace la regla concreta en lugar de memorizada.' },
        { q: '¿Para qué edad es?', a: 'Para 2.º y 3.º, entre los 7 y los 9 años aproximadamente, cuando la suma y la resta hasta 100 resultan cómodas. Suele ser la primera vez que un niño ve una letra representando un número desconocido.' },
      ],
    },
  },

  pages: {
    about: {
      title: 'Acerca de {brand}',
      navLabel: 'Acerca de',
      description: '{brand} es un generador gratuito y de código abierto de fichas de matemáticas para imprimir de 1.º a 3.º de primaria, creado por un padre para que cualquier niño pueda practicar de forma sencilla y sin coste.',
      sections: [
        {
          heading: 'Por qué existe este sitio',
          paragraphs: [
            '{brand} nació de la necesidad de un padre de imprimir práctica de matemáticas nueva para sus hijas sin rebuscar en sitios de fichas llenos de anuncios ni pagar una suscripción. El objetivo es simple: recursos de matemáticas gratuitos y sin complicaciones para todos, ya seas un padre en la mesa de la cocina, un docente preparando una clase o un tutor que necesita una página más de práctica.',
            'Cada ficha se genera al azar cada vez que la abres o la regeneras, así los niños reciben problemas nuevos en lugar de memorizar una sola página. Las fichas están diseñadas para imprimirse limpiamente en una página Carta o A4.',
          ],
        },
        {
          heading: 'Por qué papel en lugar de una app',
          paragraphs: [
            'No faltan aplicaciones de matemáticas para niños, y la mayoría premia cada toque con una respuesta inmediata: un sonido, una estrella, una animación. Según nuestra experiencia, eso convierte la práctica en entretenimiento. El niño aprende a adivinar rápido y a esperar que la app diga sí o no, en vez de quedarse con un problema y pensarlo. La respuesta inmediata mantiene muy bien ocupados a los niños; no estamos convencidos de que les enseñe.',
            'Una hoja impresa funciona de otra manera. El niño tiene que escribir la respuesta, no puede deshacerla con un toque y debe decidir por sí mismo si parece correcta. La corrección llega después, de un adulto que revisa la página. Esa pausa es lo importante: el pensamiento ocurre en la cabeza del niño, no en la app.',
            'Así usamos estas hojas con nuestros propios hijos, y es también lo que sugiere un cuerpo sólido de investigación. La práctica que se siente más difícil y que retrasa la respuesta tiende a producir un aprendizaje más duradero que la práctica que se siente fácil. La evidencia no es unánime, y la respuesta inmediata tiene su lugar para datos simples y para niños que apenas empiezan, pero para construir una comprensión real, el esfuerzo y la corrección diferida son una buena apuesta.',
          ],
        },
        {
          heading: 'Cómo corregir',
          paragraphs: [
            'Al revisar una hoja, el tono importa tanto como la corrección. La investigación sobre retroalimentación y elogios apunta en una misma dirección: comenta el trabajo y el método, no al niño, y trata un error como una invitación a pensar de nuevo, no como un veredicto.',
          ],
          items: [
            'Marca primero lo que está bien y luego señala un problema que merece otra mirada. Basta con algo como «Mira este otra vez, creo que algo se escapó».',
            'Evita las críticas duras y las etiquetas: ni «está mal, no prestaste atención» ni «eres tan listo». Elogia el esfuerzo y el método: «alineaste las columnas con cuidado».',
            'Si el niño se atasca, haz una pregunta en vez de dar la respuesta: «¿Cuánto es 7 + 5 por sí solo?», «¿Por qué columna empezamos?».',
            'Deja que el niño encuentre y corrija el error. La corrección que hace por sí mismo es la que se queda.',
            'Sé breve y sé amable. Diez minutos tranquilos con una página valen más que media hora tensa.',
          ],
        },
        {
          heading: 'Lo que dice la investigación',
          items: [
            '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273): la retroalimentación dada tras una demora produjo mejor retención a largo plazo que la inmediata.',
            '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448): los estudiantes preferían la retroalimentación inmediata y creían que ayudaba más, pero la retroalimentación diferida en sus tareas dio mejores resultados en los exámenes.',
            '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1): en un estudio en aula con 243 alumnos de segundo y tercer grado, la retroalimentación inmediata ayudó durante la práctica, pero practicar sin retroalimentación llevó a un mejor dominio una semana después.',
            '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/): las «dificultades deseables», condiciones que hacen que la práctica se sienta más difícil, como autoevaluarse o espaciar las sesiones, suelen producir un aprendizaje más duradero.',
            '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107): el «fracaso productivo»: los alumnos que lucharon con problemas de matemáticas antes de que se les enseñara el método lograron una comprensión más profunda que quienes recibieron primero la enseñanza.',
            '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254): un metaanálisis de 607 efectos halló que la retroalimentación ayuda en promedio, pero más de un tercio de las intervenciones empeoró el rendimiento, sobre todo las que dirigen la atención a la persona en vez de a la tarea.',
            '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487): la retroalimentación funciona mejor cuando trata de la tarea y del método y responde «¿y ahora qué?»; la dirigida a la persona es la menos eficaz.',
            '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) y [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556): los niños elogiados o criticados como personas («eres tan listo», «eres descuidado») respondieron con impotencia a los reveses posteriores; los que recibieron comentarios sobre el esfuerzo y el método siguieron adelante.',
            '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full): escribir a mano produjo una conectividad cerebral mucho más rica que teclear, con patrones vinculados a la formación de la memoria.',
          ],
          paragraphs: [
            'Ninguno de estos estudios es un argumento definitivo por sí solo, y los resultados varían. Pero la dirección es lo bastante constante como para que hayamos construido {brand} en torno a ella. Algunos de los trabajos en los que nos apoyamos:',
          ],
        },
        {
          heading: 'Qué obtienes',
          items: [
            'Fichas para imprimir de 1.º a 3.º: tablas de multiplicar, sumas y restas, suma en columna, multiplicación en columna, comparación de números, redondeo y series numéricas.',
            'Un explorador de ecuaciones en pantalla para jugar con ecuaciones y comprobar las respuestas en una recta numérica.',
            'Dificultad ajustable: rangos de números, cifras, columnas y disposición, recordados en tu dispositivo para la próxima vez.',
            'Sin cuenta, sin registro, sin anuncios, sin coste. No se sube nada: las fichas se generan en tu navegador.',
          ],
        },
        {
          heading: 'Cómo usarlo',
          items: [
            'Elige una ficha del catálogo.',
            'Ajusta las opciones a lo que tu hijo esté trabajando.',
            'Pulsa Regenerar para un nuevo conjunto aleatorio y luego Imprimir.',
          ],
        },
        {
          heading: 'Código abierto',
          paragraphs: [
            'Las fichas y el sitio se publican bajo la licencia {license}. Puedes usarlas, compartirlas y adaptarlas con fines no comerciales citando la fuente. Se agradecen los informes de errores y las ideas para nuevas fichas.',
          ],
        },
        {
          heading: 'Quién lo gestiona',
          paragraphs: [
            '{brand} está gestionado por {operator}. Consulta la [Política de privacidad](/privacy) y los [Términos del servicio](/terms). Preguntas y sugerencias: {contact}.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Política de privacidad',
      navLabel: 'Privacidad',
      description: 'Política de privacidad de {brand}: sin cuentas, no se sube nada, los ajustes se quedan en tu navegador, y Google Analytics sin cookies con el consentimiento denegado por defecto.',
      sections: [
        {
          heading: 'Resumen',
          paragraphs: [
            '{brand} está gestionado por {operator} («nosotros»). Este sitio no tiene cuentas, formularios de registro ni secciones de comentarios. Las fichas se generan íntegramente en tu navegador; nada de lo que escribes o imprimes se nos envía. El único servicio de terceros que recibe información de uso es Google Analytics, en la forma anonimizada y sin cookies que se describe a continuación.',
          ],
        },
        {
          heading: 'Lo que no recopilamos',
          items: [
            'Ningún nombre, dirección de correo ni otros datos personales: no hay nada a lo que registrarse.',
            'Ningún contenido de las fichas: los problemas de cada ficha se generan en tu dispositivo y nunca se suben.',
            'Ningún identificador publicitario, ninguna red publicitaria, ningún píxel de seguimiento.',
          ],
        },
        {
          heading: 'Ajustes guardados en tu navegador',
          paragraphs: [
            'Tus ajustes de fichas (por ejemplo el rango de números o la disposición que elegiste) y la última ficha que abriste se guardan en el almacenamiento local de tu navegador para que el sitio pueda retomar donde lo dejaste. Estos datos permanecen en tu dispositivo, nunca se nos transmiten y pueden eliminarse en cualquier momento borrando los datos de este sitio en tu navegador.',
          ],
        },
        {
          heading: 'Estadísticas',
          paragraphs: [
            'Usamos Google Analytics 4, un servicio de Google LLC, para entender qué fichas se usan y cómo se encuentra el sitio. El modo de consentimiento de Google está configurado con el almacenamiento para análisis y publicidad denegado por defecto, y no mostramos un aviso de consentimiento porque no se solicita ninguno: Google Analytics funciona en modo sin cookies y no establece cookies de análisis en tu dispositivo.',
            'En este modo Google recibe solo señales anonimizadas y agregadas: páginas vistas, qué ficha se abrió, cuándo se regeneró o imprimió una ficha y qué ajustes estaban activos, junto con detalles técnicos como el tipo de navegador, la región aproximada y el sitio de referencia. Las direcciones IP se anonimizan y Google Signals y las funciones publicitarias están desactivados. No usamos los datos estadísticos para identificar a nadie y nunca los compartimos con anunciantes.',
            'Puedes bloquear las estadísticas por completo con la protección antirrastreo de tu navegador, un bloqueador de contenido o el [complemento de inhabilitación de Google Analytics](https://tools.google.com/dlpage/gaoptout). Para saber cómo trata Google los datos, consulta la [Política de privacidad de Google](https://policies.google.com/privacy).',
          ],
        },
        {
          heading: 'Alojamiento y tipografías',
          paragraphs: [
            'El sitio está alojado en Vercel y sus tipografías se cargan desde Google Fonts. Como cualquier servidor web, estos proveedores ven los detalles técnicos de cada petición (como tu dirección IP y el tipo de navegador) para entregar la página. Nosotros no recibimos ni guardamos esos registros. Consulta la [Política de privacidad de Vercel](https://vercel.com/legal/privacy-policy) y la [información de privacidad de Google Fonts](https://developers.google.com/fonts/faq/privacy).',
          ],
        },
        {
          heading: 'Menores',
          paragraphs: [
            '{brand} crea fichas para niños de aproximadamente 6 a 9 años, pero el sitio está pensado para los adultos que las imprimen. No recopilamos a sabiendas información personal de nadie, niños incluidos, y el sitio no contiene cuentas, mensajería ni contenido generado por usuarios.',
          ],
        },
        {
          heading: 'Cambios en esta política',
          paragraphs: [
            'Si alguna vez añadimos una función que cambie cómo el sitio trata los datos, actualizaremos esta página y la fecha de arriba. Seguir usando el sitio tras un cambio implica aceptar la política actualizada.',
          ],
        },
        {
          heading: 'Contacto',
          paragraphs: [
            'Preguntas sobre privacidad: {contact}.',
          ],
        },
      ],
    },
    terms: {
      title: 'Términos del servicio',
      navLabel: 'Términos',
      description: 'Términos del servicio de {brand}: un servicio gratuito sin cuentas, fichas para uso personal y en el aula, contenido bajo {license}, ofrecido tal cual.',
      sections: [
        {
          heading: 'El servicio',
          paragraphs: [
            '{brand} es un sitio web gratuito gestionado por {operator} («nosotros») que genera fichas de matemáticas para imprimir en tu navegador. No hay cuenta que crear, ni suscripción, ni tarifa. Al usar el sitio aceptas estos términos; si no estás de acuerdo, por favor no uses el sitio.',
          ],
        },
        {
          heading: 'Uso de las fichas',
          paragraphs: [
            'Puedes generar, imprimir, copiar y compartir tantas fichas como quieras para uso personal, educación en casa, uso en el aula y cualquier otro fin no comercial.',
            'Las fichas, el contenido del sitio y el código fuente se ofrecen bajo la licencia {license}: puedes compartirlos y adaptarlos con fines no comerciales siempre que des crédito a {brand}. Vender las fichas, o incluirlas en un producto o servicio de pago, requiere nuestro permiso por escrito.',
          ],
        },
        {
          heading: 'Uso aceptable',
          items: [
            'No uses el sitio de forma que infrinja la ley o los derechos de nadie.',
            'No intentes interrumpir el sitio, sobrecargarlo con peticiones automatizadas ni interferir en el uso que hacen otras personas.',
            'No elimines la atribución de las copias o adaptaciones que distribuyas.',
          ],
        },
        {
          heading: 'Sin garantía',
          paragraphs: [
            'El sitio y las fichas se ofrecen «tal cual» y «según disponibilidad», sin garantías de ningún tipo. Los problemas se generan al azar y, aunque los probamos, una ficha puede contener un error o no ajustarse a un plan de estudios concreto. Comprueba las respuestas antes de confiar en ellas y usa tu propio criterio sobre lo que conviene a tu hijo o a tu clase.',
          ],
        },
        {
          heading: 'Limitación de responsabilidad',
          paragraphs: [
            'En la máxima medida permitida por la ley, {operator} no es responsable de ninguna pérdida indirecta, incidental o consecuente derivada del uso o de la imposibilidad de usar el sitio. Como el servicio es gratuito, nuestra responsabilidad total por cualquier reclamación relacionada se limita al importe que pagaste por él, que es nada.',
          ],
        },
        {
          heading: 'Servicios y enlaces de terceros',
          paragraphs: [
            'El sitio enlaza a servicios externos como {github} y usa Google Analytics tal como se describe en la [Política de privacidad](/privacy). No somos responsables del contenido ni de las prácticas de sitios de terceros.',
          ],
        },
        {
          heading: 'Cambios y disponibilidad',
          paragraphs: [
            'Podemos cambiar, pausar o retirar el sitio o cualquier ficha en cualquier momento, y podemos actualizar estos términos publicando una nueva versión en esta página. Seguir usando el sitio tras un cambio implica aceptar los términos actualizados.',
          ],
        },
        {
          heading: 'Contacto',
          paragraphs: [
            'Preguntas sobre estos términos: {contact}.',
          ],
        },
      ],
    },
  },
}
