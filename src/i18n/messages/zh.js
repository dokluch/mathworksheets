/** Simplified Chinese messages. Same key set as en.js plus `worksheets.<id>` and `pages.<id>` (see i18n.test.js). */
export default {
  site: {
    tagline: '适合 1–3 年级的可打印数学练习题',
    description: 'MathSheets：免费、可打印、每次随机生成的 1–3 年级数学练习题。包括乘法表、加减法、竖式加法、竖式乘法、比较大小、四舍五入、数列规律，以及一个互动方程探索器。',
    brandAlt: '数学练习题',
  },

  seo: {
    homeTitle: '{brand} – {tagline}',
    developersTitle: '开发者资源 · {brand}',
    worksheetTitle: '{label}练习题 · {brand}',
    developersDescription: '{brand} 开发者资源：开源代码仓库、练习题 JSON 目录、Markdown 内容协商、llms.txt 和站点地图。',
    worksheetDescription: '免费可打印的{label}练习题，适合 {grades} 年级。{shortDesc}。每次题目都不同，一页打印。',
    gradeOne: '{grades} 年级',
    gradeRange: '{grades} 年级',
    ogAltHome: '{brand} – {tagline}',
    ogAltWorksheet: '{label}练习题预览 – {brand}',
    ogAltDevelopers: '{brand} 开发者资源',
    worksheetHeading: '{label}练习题',
    worksheetName: '{brand} {label}',
    developersHeading: '{brand} 开发者资源',
    developersCrumb: '开发者资源',
    worksheetList: '{brand} 练习题',
    learningResourceWorksheet: '练习题',
    learningResourceInteractive: '互动练习',
    featureItem: '{label}：{shortDesc}',
  },

  static: {
    breadcrumb: '面包屑导航',
    worksheetTypes: '练习题类型',
    lastUpdated: '最后更新：{date}',
    footerSite: '网站',
    home: {
      subtitle: '免费、随机生成的练习题，一键打印。',
      intro1: '{brand} 是一个免费、开源的可打印数学练习题生成器，适合 1–3 年级（6–9 岁）的孩子。每次打开或重新生成时题目都会随机变化，孩子练的是新题，而不是把一页题背下来。选一份练习题，调整难度（数字范围、位数、排版、列数），然后从浏览器打印；你的设置会保存在这台设备上，下次自动恢复。',
      intro2: '目录包括乘法表、带空格的加减法练习、带进位的竖式加法、竖式乘法、用 >、< 和 = 比较大小、四舍五入到十位、百位和千位，以及数列规律。方程探索器是一个屏幕上的互动活动：孩子把项移到等号另一边，再在数轴上检查答案。',
      worksheets: '练习题',
      howItWorks: '使用方法',
      step1: '从上面的列表中选择一份练习题。',
      step2: '设置难度：数字上限、位数、列数或级别。',
      step3: '点击“重新生成”得到一组新的随机题目，然后点击“打印”。练习题排版适合 A4 或 Letter 纸张。',
      audienceHeading: '致老师、家长和 AI 代理',
      audienceText: '练习题在浏览器中生成：不上传任何内容，无需账号，完全免费。{brand} 由一位家长为补充 1–3 年级数学课程而开发，可免费用于非商业目的并自由改编。',
    },
    worksheet: {
      skills: '技能',
      format: '形式',
      formatInteractive: '互动，在屏幕上完成',
      formatPrintable: '可打印，每次加载随机生成',
      settings: '设置',
      howToUseWorksheet: '如何使用这份练习题',
      howToUseActivity: '如何使用这个活动',
      step1: '打开 {url}（需要 JavaScript）。',
      step2: '调整上面的设置；它们会保存在你的浏览器中。',
      step3Printable: '点击“重新生成”得到一组新的随机题目，然后点击“打印”。',
      step3Interactive: '输入答案并点击“检查”；点击“下一题”得到新的方程。',
      others: '{brand} 的其他练习题',
      partOf: '属于 {link}。',
      url: '网址',
    },
    developers: {
      subtitle: '开源、机器可读、对代理友好。',
      intro: '{brand}（又称“{brandAlt}”）是一个 React 19 + Vite 单页应用。没有服务器 API：练习题在客户端生成。下面的所有内容都是静态且可缓存的。',
      resources: '资源',
      sourceLink: 'GitHub 上的源代码',
      catalogDesc: '机器可读的练习题目录，包含 slug、网址、年级、技能和设置',
      llmsDesc: 'llmstxt.org 索引以及供语言模型使用的完整内容',
      indexMdDesc: '本站的 Markdown 版本；每个 HTML 页面都有对应的 {code} 副本',
      negotiationHeading: 'Markdown 内容协商',
      negotiationText: '每个页面网址都会按照 acceptmarkdown.com 的约定，用 {contentType} 和 {vary} 响应 {accept}。HTML 响应带有指向 Markdown 副本的 {link} 头。未知路径返回 HTTP 404，并附带一段说明去哪里查找的 Markdown 正文。',
      languagesHeading: '语言',
      languagesText: '英文页面位于站点根目录。同样的页面还提供 {languages} 版本，使用两个字母的路径前缀（例如 {example}）；每个页面都通过 hreflang 链接到全部翻译，并在站点地图中列出。llms.txt 和 llms-full.txt 仅提供英文版。',
      idsHeading: '练习题 ID 和网址',
      addingHeading: '添加一份练习题',
      adding1: '在 {file} 中添加一条记录（id、slug、名称、描述、年级、技能、设置），并在 {messages} 中添加翻译。',
      adding2: '在 {dir} 中创建组件，并在 {app} 的 {components} 和 {icons} 映射中注册。',
      adding3: '运行 {test} 和 {build}；静态页面、Markdown 副本、站点地图、llms.txt 和 JSON 目录会根据目录自动重新生成。',
    },
    agentLinks: {
      text: '每个页面也提供 Markdown 版本：在路径后加上 {code}，或发送 {accept}。参见 {llms}、{catalog}、{sitemap} 和 {developers}。源代码托管在 {github}，许可协议为 {license}。',
      llms: 'llms.txt',
      catalog: '练习题目录（JSON）',
      sitemap: '站点地图',
      developers: '开发者资源',
      github: 'GitHub',
    },
  },

  md: {
    agentIntro: '每个页面也提供 Markdown 版本：在路径后加上 `.md`，或使用 `Accept: text/markdown` 请求。',
    llmsNote: '供语言模型使用的索引',
    catalogNote: '机器可读的练习题目录',
    developersLink: '开发者资源',
    sitemapLink: '站点地图',
    sourceLink: 'GitHub 上的源代码',
    homeIntro: '{brand} 是一个免费、开源的可打印数学练习题生成器，适合 1–3 年级（6–9 岁）的孩子。每次打开或重新生成时题目都会随机变化。选一份练习题，调整难度（数字范围、位数、排版、列数），然后从浏览器打印；设置按设备保存。练习题在客户端生成：无需账号，不上传，完全免费。',
    worksheetItem: '{link}：{shortDesc}（{grades} 年级）',
    howItWorks: '使用方法',
    step1: '选择一份练习题。',
    step2: '设置难度：数字上限、位数、列数或级别。',
    step3: '点击“重新生成”得到一组新的随机题目，然后点击“打印”。练习题适合 A4 或 Letter 纸张。',
    forDevelopers: '致开发者和 AI 代理',
    howToUse: '使用方法',
    wsStep1: '打开 {url}（需要 JavaScript）。',
    wsStep2: '调整设置；它们会保存在浏览器中。',
    developersIntro: '{brand}（又称“{brandAlt}”）是一个开源的 React 19 + Vite 单页应用，在客户端生成可打印的数学练习题。没有服务器 API；下面的每个资源都是静态文件。',
    devCatalogNote: '机器可读的练习题目录（slug、网址、Markdown 网址、年级、技能、设置）',
    devLlmsNote: 'llmstxt.org 索引',
    devLlmsFullNote: '所有页面的 Markdown 合并成一个文件',
    devIndexNote: '首页的 Markdown 版本',
    negotiationText: '每个页面网址都会用 `Content-Type: text/markdown; charset=utf-8` 和 `Vary: Accept` 响应 `Accept: text/markdown`（acceptmarkdown.com 约定）。HTML 响应带有 `Link: <…md>; rel="alternate"; type="text/markdown"`。既不接受 HTML 也不接受 Markdown 的请求会收到 `406 Not Acceptable`。未知路径返回 HTTP 404，并附带一段说明去哪里查找的 Markdown 正文。',
    languagesText: '英文页面位于站点根目录；同样的页面还提供 {languages} 版本，使用两个字母的前缀（例如 {example}）。每个页面都通过 hreflang 链接到它的翻译。',
    adding1: '在 `src/worksheets.js` 中添加一条记录（id、slug、名称、描述、年级、技能、设置），并在 `src/i18n/messages/<locale>.js` 中添加翻译。',
    adding2: '在 `src/components/` 中创建组件，并在 `src/App.jsx` 的 `COMPONENTS` 和 `ICONS` 映射中注册。',
    adding3: '运行 `npm test` 和 `npm run build`；静态页面、Markdown 副本、站点地图、llms.txt 和 JSON 目录会根据目录自动重新生成。',
    markdownLink: 'Markdown',
    lastUpdated: '最后更新',
    moreFrom: '{brand} 的更多内容',
    homeLink: '{brand} 首页',
  },

  llms: {
    optionalLocale: '首页（{language}）',
  },

  notFound: {
    title: '404 – 页面不存在',
    body: '路径 {path}在 {site} 上不存在。此响应的 HTTP 状态为 404。',
    whereNext: '可以去哪里看看',
    home: '{brand} 首页',
    worksheet: '{label}练习题',
    developers: '开发者资源',
    sitemap: '站点地图',
    llms: 'llms.txt',
    catalog: '练习题目录（JSON）',
    twinMd: '每个 HTML 页面也都有 Markdown 副本（加上 `.md` 或发送 `Accept: text/markdown`）。',
    twinHtml: '每个页面也都有 Markdown 副本：加上 {code} 或发送 {accept}。',
  },

  app: {
    subtitle: '适合 1–3 年级的可打印数学练习题',
    allSheets: '全部练习题',
    worksheetTypes: '练习题类型',
    sourceOnGitHub: 'GitHub 上的源代码',
    language: '语言',
  },

  common: {
    regenerate: '重新生成',
    print: '打印',
    printWorksheet: '打印练习页',
    columns: '列数',
    limit: '范围',
    range: '范围',
    operation: '运算',
    layout: '排版',
    difficulty: '难度',
    numberSize: '数字位数',
    within: '{n} 以内',
    withinMeta: '{n} 以内',
  },

  multiply: {
    to: '到',
    rangeStart: '范围起点',
    rangeEnd: '范围终点',
    fillDiagonal: '填满对角线',
    prefill: '预填 {pct}%',
    tableAria: '乘法表',
  },

  addsub: {
    inline: '横式',
    stacked: '竖式',
    sixtySeven: '67 模式',
    title: '加法与减法',
  },

  coladd: {
    digitPreset: '{d} 位数',
    preferCarry: '优先出进位题',
    title: '竖式加法',
    meta: '{d} 位数',
  },

  colmul: {
    preset: '{a} 位 × {b} 位',
    title: '竖式乘法',
    meta: '竖式乘法 · {preset}',
    problemAria: '{a} 乘以 {b}',
  },

  compare: {
    title: '比较大小',
  },

  rounding: {
    roundTo: '四舍五入到',
    nearest: '{n} 位',
    title: '四舍五入',
    meta: '四舍五入到最接近的 {n}',
  },

  patterns: {
    easy: '简单',
    medium: '中等',
    hard: '困难',
    title: '数列规律',
    instructions: '填出每个数列中缺少的数。',
  },

  eq: {
    newProblem: '新题',
    streak: { other: '连续答对 {n} 题' },
    hint: '提示：把数字拖过等号 = 可以移项',
    reset: '重置方程',
    check: '检查',
    next: '下一题',
    keypad: '数字键盘',
    backspace: '退格',
    clear: '清空',
    yourAnswer: '你的答案',
    drag: '拖动 {n} 来移项',
    numberLineAria: '数轴显示 {a} {op} {b} = {result}',
    correct: '答对了！',
    wrong: '还不对——再试一次，或看看下面的讲解',
    numberLine: '数轴',
    tenFrame: '十格阵',
    replay: '重播',
    gotIt: '明白了',
  },

  error: {
    title: '出了点问题',
    hint: '请尝试刷新页面。',
    reload: '重新加载',
  },

  worksheets: {
    multiply: {
      label: '乘法',
      shortDesc: '乘法表与表格练习',
      longDesc: '任意因数范围的乘法表格，可选择预先填入部分格子，让孩子在填完其余格子之前先发现规律。适合背诵乘法口诀、检查记忆速度，以及练习交换律（3 × 4 = 4 × 3）。',
      skills: ['乘法表', '乘法口诀', '数字规律'],
      settings: [
        '表格范围：选择第一个和最后一个因数',
        '预填对角线上的格子（1×1、2×2……）',
        '随机预填格子的百分比',
      ],
    },
    addsub: {
      label: '加法与减法',
      shortDesc: '加减法练习',
      longDesc: '10、20、100 或 1000 以内的随机加减法题目，空格出现在随机位置（a + □ = c、□ − b = c、a − b = □）。可选择横式或竖式排版以及 2 到 4 列；“67 模式”会在每一列中恰好藏一道答案为 67 的题，像一场小小的寻宝游戏。',
      skills: ['加法', '减法', '求未知加数', '心算'],
      settings: [
        '运算：加法、减法或两者',
        '范围：10、20、100 或 1000 以内',
        '排版：横式或竖式',
        '列数：2、3 或 4（20–40 道题）',
        '67 模式：每列藏一个答案为 67 的题',
      ],
    },
    coladd: {
      label: '竖式加法',
      shortDesc: '多位数竖式加法',
      longDesc: '在方格纸上进行 2 位、3 位或 4 位数的竖式加法，每格一个数字，让孩子练习对齐数位和进位。“优先出进位题”选项会生成至少需要一次进位的题目。',
      skills: ['竖式加法', '进位', '数位'],
      settings: [
        '位数：2 位、3 位或 4 位数',
        '列数：每页题目的列数',
        '优先出需要进位的题目',
      ],
    },
    colmul: {
      label: '竖式乘法',
      shortDesc: '竖式乘法练习',
      longDesc: '竖式乘法（2 位 × 2 位、3 位 × 2 位或 4 位 × 2 位），在方格纸上留出写部分积和错位的空间。适合已经掌握乘法口诀、正在学习标准竖式算法的三年级学生。',
      skills: ['竖式乘法', '部分积', '数位'],
      settings: [
        '预设：2 位 × 2 位、3 位 × 2 位或 4 位 × 2 位',
        '列数：每页题目的列数',
      ],
    },
    compare: {
      label: '比较大小',
      shortDesc: '大于、小于、等于',
      longDesc: '用 >、< 或 = 比较成对的数。生成器会故意选择容易混淆的数对：交换数字（43 和 34）、重复数字、相邻的数，以及大约 15% 的相等数对，让孩子读完每一位数字，而不是看第一位就猜。',
      skills: ['比较数的大小', '数位', '不等号'],
      settings: [
        '范围：10、20、100 或 1000 以内',
        '列数：每页题目的列数',
      ],
    },
    rounding: {
      label: '四舍五入',
      shortDesc: '四舍五入到十位、百位、千位',
      longDesc: '四舍五入到十位、百位或千位的练习，每页 20–40 个随机数。所选的数既有“进位”也有“舍去”的情况，包括最容易出错的 5 的边界。',
      skills: ['四舍五入', '估算', '数位'],
      settings: [
        '数位：十位、百位或千位',
        '列数：每页题目的列数',
      ],
    },
    patterns: {
      label: '数列规律',
      shortDesc: '数列与序列',
      longDesc: '三个难度级别的数列填空：固定步长（简单）、倍数或交替步长（中等）以及组合规则（困难）。孩子找出规律并填空，培养早期的代数思维。',
      skills: ['数字规律', '跳数', '数列', '代数思维'],
      settings: [
        '级别：简单、中等或困难',
      ],
    },
    eqexplore: {
      label: '方程探索器',
      shortDesc: '互动解方程',
      longDesc: '屏幕上的方程求解器（不可打印）：把项拖过等号并观察符号变化，在数轴上跟随跳跃，然后用内置键盘输入答案。答对可以累计连胜并撒花庆祝；答错会播放动画讲解。',
      skills: ['方程', '逆运算', '数轴', '心算'],
      settings: [
        '运算：加法、减法或两者',
        '范围：所用数字的大小',
      ],
    },
  },

  pages: {
    about: {
      title: '关于 {brand}',
      navLabel: '关于',
      description: '{brand} 是一个免费、开源的 1–3 年级可打印数学练习题生成器，由一位家长开发，让每个孩子都能免费获得简单的练习。',
      sections: [
        {
          heading: '为什么有这个网站',
          paragraphs: [
            '{brand} 最初是一位家长为了给女儿们打印新的数学练习而做的，不想再在满是广告的练习题网站里翻找，也不想付订阅费。目标很简单：为所有人提供免费、直接的数学资源——无论你是餐桌旁的家长、备课的老师，还是需要再来一页练习的辅导老师。',
            '每份练习题在每次打开或重新生成时都会随机变化，孩子拿到的是新题，而不是把一页题背下来。练习题的排版能整齐地打印在一张 Letter 或 A4 纸上。',
          ],
        },
        {
          heading: '为什么用纸而不是应用',
          paragraphs: [
            '面向孩子的数学应用并不少，而且大多数都会在每次点击后立刻给出反馈：一声提示音、一颗星星、一段动画。按我们的经验，这会把练习变成娱乐。孩子学会的是快速猜测，然后等应用说对或错，而不是停在一道题上认真思考。即时反馈很擅长让孩子忙起来；我们并不认为它擅长教会孩子。',
            '打印出来的练习纸不一样。孩子必须把答案写下来，无法一键撤销，还要自己判断答案看起来对不对。反馈来得更晚，来自一位翻看这页纸的大人。这段停顿正是关键：思考发生在孩子的脑子里，而不是在应用里。',
            '我们就是这样和自己的孩子一起使用这些练习纸的，这也是一批扎实的研究所指向的方向。感觉更费力、答案来得更晚的练习，往往比顺畅的练习带来更持久的学习。证据并非一边倒，对简单的知识点和刚起步的孩子来说，即时反馈也有其用处；但要建立真正的理解，费力的练习加上延迟的反馈是更稳妥的选择。',
          ],
        },
        {
          heading: '如何给反馈',
          paragraphs: [
            '检查练习纸时，语气和批改本身一样重要。关于反馈和表扬的研究指向同一个方向：评价的是作业和方法，而不是孩子本人；把错误当作再想一想的邀请，而不是一个判决。',
          ],
          items: [
            '先标出做对的地方，再指出一道值得再看一眼的题。一句“再看看这道题，我觉得有个地方滑掉了”就足够了。',
            '避免严厉的批评和贴标签：既不说“错了，你没认真”，也不说“你真聪明”。改为表扬努力和方法：“你把各列对得很整齐”。',
            '孩子卡住时，提问而不是直接给答案：“7 + 5 本身等于多少？”“我们从哪一列开始？”',
            '让孩子自己找出并改正错误。自己改的那一处才记得住。',
            '简短而温和。轻松地花十分钟看一页，胜过紧张的半小时。',
          ],
        },
        {
          heading: '研究怎么说',
          items: [
            '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273)：延迟给出的反馈比即时反馈带来更好的长期记忆。',
            '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448)：学生更喜欢即时反馈并认为它更有效，但对作业的延迟反馈带来了更好的考试成绩。',
            '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1)：在一项有 243 名二、三年级学生参加的课堂研究中，即时反馈在练习时有帮助，但无反馈的练习在一周后带来了更好的掌握程度。',
            '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/)：“合意困难”，即让练习感觉更难的条件，例如自我测试和分散练习，往往带来更持久的学习。',
            '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107)：“有效失败”：在被教授方法之前先与数学题较劲的学生，比先接受讲授的学生获得了更深的概念理解。',
            '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254)：一项涵盖 607 个效应的元分析发现，反馈平均而言有帮助，但超过三分之一的反馈干预反而降低了表现，尤其是把注意力引向个人而非任务的反馈。',
            '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487)：反馈在针对任务和方法、并回答“接下来往哪走”时效果最好；针对个人的反馈效果最差。',
            '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) 与 [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556)：被当作“人”来表扬或批评的孩子（“你真聪明”“你真粗心”）在之后遇到挫折时表现出无助；得到关于努力和方法的反馈的孩子则会继续坚持。',
            '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full)：手写比打字产生了更丰富的大脑连接，其模式与记忆形成有关。',
          ],
          paragraphs: [
            '这些研究单独来看都不是一锤定音的论据，结果也各有差异。但方向足够一致，所以我们围绕它构建了 {brand}。我们所依据的部分研究：',
          ],
        },
        {
          heading: '你能得到什么',
          items: [
            '适合 1–3 年级的可打印练习题：乘法表、加减法、竖式加法、竖式乘法、比较大小、四舍五入和数列规律。',
            '一个屏幕上的方程探索器，可以摆弄方程并在数轴上检查答案。',
            '可调节的难度：数字范围、位数、列数和排版，会保存在你的设备上供下次使用。',
            '无需账号、无需注册、没有广告、完全免费。不上传任何内容：练习题在你的浏览器中生成。',
          ],
        },
        {
          heading: '使用方法',
          items: [
            '从目录中选择一份练习题。',
            '根据孩子正在学的内容调整设置。',
            '点击“重新生成”得到一组新的随机题目，然后点击“打印”。',
          ],
        },
        {
          heading: '开源',
          paragraphs: [
            '源代码托管在 {github}，许可协议为 {license}。你可以在注明出处的前提下，将练习题和代码用于非商业目的并自由使用、分享和改编。欢迎提交错误报告和新练习题的想法。',
          ],
        },
        {
          heading: '运营方',
          paragraphs: [
            '{brand} 由 {operator} 运营。请参阅[隐私政策](/privacy)和[服务条款](/terms)。问题和建议请联系：{contact}。',
          ],
        },
      ],
    },
    privacy: {
      title: '隐私政策',
      navLabel: '隐私',
      description: '{brand} 的隐私政策：没有账号，不上传任何内容，设置只保存在你的浏览器中，Google Analytics 以无 Cookie 模式运行且默认拒绝同意。',
      sections: [
        {
          heading: '概要',
          paragraphs: [
            '{brand} 由 {operator}（“我们”）运营。本网站没有账号、注册表单或评论区。练习题完全在你的浏览器中生成；你输入或打印的任何内容都不会发送给我们。唯一会收到使用信息的第三方服务是 Google Analytics，并且是以下文所述的无 Cookie、匿名化的形式。',
          ],
        },
        {
          heading: '我们不收集什么',
          items: [
            '不收集姓名、电子邮件地址或其他个人信息：没有任何需要注册的地方。',
            '不收集练习题内容：每页题目都在你的设备上生成，绝不会上传。',
            '没有广告标识符、没有广告网络、没有跟踪像素。',
          ],
        },
        {
          heading: '保存在浏览器中的设置',
          paragraphs: [
            '你的练习题设置（例如所选的数字范围或排版）以及最后打开的练习题会保存在浏览器的本地存储中，以便网站能从你上次离开的地方继续。这些数据只保存在你的设备上，绝不会传输给我们，你随时可以通过清除浏览器中本网站的站点数据来删除它们。',
          ],
        },
        {
          heading: '统计分析',
          paragraphs: [
            '我们使用 Google LLC 提供的 Google Analytics 4 来了解哪些练习题被使用以及网站是如何被找到的。Google 同意模式配置为默认拒绝分析和广告存储，我们也不显示同意横幅，因为不会请求任何同意：Google Analytics 以无 Cookie 模式运行，不会在你的设备上设置任何分析 Cookie。',
            '在这种模式下，Google 只会收到匿名化、汇总的信号：页面浏览、打开了哪份练习题、何时重新生成或打印了练习题以及当时的设置，还有浏览器类型、大致地区和来源网站等技术信息。IP 地址会被匿名化，Google 信号和广告功能均已关闭。我们不会用分析数据识别任何人，也绝不会与广告商共享。',
            '你可以通过浏览器的跟踪保护、内容拦截器或 [Google Analytics 停用浏览器插件](https://tools.google.com/dlpage/gaoptout) 完全屏蔽统计分析。关于 Google 如何处理数据，请参阅 [Google 隐私权政策](https://policies.google.com/privacy)。',
          ],
        },
        {
          heading: '托管与字体',
          paragraphs: [
            '网站托管在 Vercel 上，字体从 Google Fonts 加载。与任何网络服务器一样，这些服务商为了传送页面会看到每个请求的技术细节（例如你的 IP 地址和浏览器类型）。我们不会收到或保存这些请求日志。请参阅 [Vercel 隐私政策](https://vercel.com/legal/privacy-policy) 和 [Google Fonts 隐私信息](https://developers.google.com/fonts/faq/privacy)。',
          ],
        },
        {
          heading: '儿童',
          paragraphs: [
            '{brand} 制作的练习题面向大约 6 到 9 岁的儿童，但网站是供打印这些练习题的成年人使用的。我们不会有意收集任何人（包括儿童）的个人信息，网站也没有账号、消息或用户生成的内容。',
          ],
        },
        {
          heading: '本政策的变更',
          paragraphs: [
            '如果我们将来添加了会改变网站处理数据方式的功能，我们会更新此页面和顶部的日期。变更后继续使用本网站即表示你接受更新后的政策。',
          ],
        },
        {
          heading: '联系方式',
          paragraphs: [
            '关于隐私的问题请联系：{contact}。',
          ],
        },
      ],
    },
    terms: {
      title: '服务条款',
      navLabel: '条款',
      description: '{brand} 的服务条款：一项没有账号的免费服务，练习题可用于个人和课堂，内容采用 {license} 许可，按“现状”提供。',
      sections: [
        {
          heading: '本服务',
          paragraphs: [
            '{brand} 是由 {operator}（“我们”）运营的免费网站，在你的浏览器中生成可打印的数学练习题。无需创建账号，没有订阅，也不收费。使用本网站即表示你同意这些条款；如果你不同意，请不要使用本网站。',
          ],
        },
        {
          heading: '练习题的使用',
          paragraphs: [
            '你可以随意生成、打印、复制和分享任意数量的练习题，用于个人、家庭教育、课堂以及任何其他非商业用途。',
            '练习题、网站内容和源代码均采用 {license} 许可：只要注明出处为 {brand}，你就可以出于非商业目的分享和改编它们。出售练习题，或将其打包进付费产品或服务，需要获得我们的书面许可。',
          ],
        },
        {
          heading: '可接受的使用',
          items: [
            '不得以违法或侵犯他人权利的方式使用本网站。',
            '不得试图干扰本网站、用自动化请求使其过载，或妨碍他人使用。',
            '不得从你分发的副本或改编作品中删除出处说明。',
          ],
        },
        {
          heading: '无担保',
          paragraphs: [
            '本网站和练习题按“现状”和“可用状态”提供，不附带任何形式的担保。题目是随机生成的，尽管我们会测试，但某份练习题仍可能含有错误或不适合某个特定的课程。请在依赖答案之前先核对，并自行判断什么适合你的孩子或班级。',
          ],
        },
        {
          heading: '责任限制',
          paragraphs: [
            '在法律允许的最大范围内，{operator} 不对因使用或无法使用本网站而产生的任何间接、附带或后果性损失承担责任。由于本服务是免费的，我们对与之相关的任何索赔的全部责任以你为此支付的金额为限，即零。',
          ],
        },
        {
          heading: '第三方服务和链接',
          paragraphs: [
            '本网站链接到 {github} 等外部服务，并按[隐私政策](/privacy)所述使用 Google Analytics。我们不对第三方网站的内容或做法负责。',
          ],
        },
        {
          heading: '变更与可用性',
          paragraphs: [
            '我们可以随时更改、暂停或停止本网站或任何练习题，也可以通过在此页面发布新版本来更新这些条款。变更后继续使用本网站即表示你接受更新后的条款。',
          ],
        },
        {
          heading: '联系方式',
          paragraphs: [
            '关于这些条款的问题请联系：{contact}。',
          ],
        },
      ],
    },
  },
}
