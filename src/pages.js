/**
 * Static, non-worksheet pages: About, Privacy Policy, Terms of Service.
 *
 * Pure data, like src/worksheets.js: the SEO renderer derives the crawlable
 * HTML, the Markdown twin, sitemap/llms.txt entries and the React view from
 * these entries. Paragraphs and list items are plain text; `[label](url)`
 * links are allowed (site-relative paths are absolutised for Markdown).
 */
import { BRAND, GITHUB_URL, LICENSE_NAME, LICENSE_URL, OPERATOR, CONTACT_EMAIL } from './seo/site.js'

const contact = `[${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})`
const license = `[${LICENSE_NAME}](${LICENSE_URL})`
const github = `[GitHub](${GITHUB_URL})`

export const PAGES = [
  {
    id: 'about',
    slug: 'about',
    title: `About ${BRAND}`,
    navLabel: 'About',
    description: `${BRAND} is a free, open-source generator of printable math worksheets for grades 1–3, built by a parent to give every child simple practice at no cost.`,
    updated: '2026-09-05',
    sections: [
      {
        heading: 'Why this site exists',
        paragraphs: [
          `${BRAND} started as a way for a parent to print fresh math practice for their daughters without hunting through ad-filled worksheet sites or paying for a subscription. The goal is simple: free, straightforward math resources for everyone, whether you are a parent at the kitchen table, a teacher preparing a lesson, or a tutor who needs one more page of practice.`,
          `Every worksheet is randomized each time you open or regenerate it, so children get new problems instead of memorising a single page. Sheets are designed to print cleanly on one Letter or A4 page.`,
        ],
      },
      {
        heading: 'Why paper instead of an app',
        paragraphs: [
          'There is no shortage of math apps for children, and most of them reward every tap with instant feedback: a chime, a star, a bouncing animation. In our experience that turns practice into entertainment. The child learns to guess quickly and wait for the app to say yes or no, rather than to sit with a problem and think it through. Instant feedback is very good at keeping children busy; we are not convinced it is good at teaching them.',
          'A printed worksheet works differently. The child has to write the answer down, cannot undo it with a tap, and has to decide for themselves whether it looks right. The feedback comes later, from a grown-up who looks over the page. That pause is the point: the thinking happens in the child’s head, not in the app.',
          'This is how we use these sheets with our own children, and it is also what a fair body of research suggests. Practice that feels harder and that delays the answer tends to produce more durable learning than practice that feels smooth. The evidence is not one-sided, and instant feedback has its place for simple facts and for children who are just starting out, but for building real understanding, effortful practice with delayed feedback is a good bet.',
        ],
      },
      {
        heading: 'How to give feedback',
        paragraphs: [
          'When you check a sheet, the tone matters as much as the correction. Research on feedback and praise points in one direction: comment on the work and the method, not on the child, and treat a mistake as an invitation to think again rather than a verdict.',
        ],
        items: [
          'Mark what is right first, then point to a problem that deserves another look. Something like “Have another look at this one, I think something slipped” is enough.',
          'Avoid harsh critique and avoid labels: neither “that’s wrong, you weren’t paying attention” nor “you’re so smart”. Praise the effort and the method instead: “you lined up the columns carefully”.',
          'If the child is stuck, ask a question rather than giving the answer: “What is 7 + 5 on its own?”, “Which column do we start with?”.',
          'Let the child find and fix the error. The correction they make themselves is the one that sticks.',
          'Keep it short and keep it kind. A relaxed ten minutes over one page beats a tense half hour.',
        ],
      },
      {
        heading: 'What the research says',
        items: [
          '[Butler, Karpicke & Roediger (2007)](https://doi.org/10.1037/1076-898X.13.4.273): feedback given after a delay produced better long-term retention than feedback given immediately.',
          '[Mullet, Butler, Verdin, von Borries & Marsh (2014)](https://www.sciencedirect.com/science/article/abs/pii/S2211368114000448): students preferred immediate feedback and believed it helped more, yet delayed feedback on their homework led to better exam results.',
          '[Fyfe & Rittle-Johnson (2017)](https://link.springer.com/article/10.1007/s11251-016-9401-1): in a classroom study with 243 second and third graders, immediate feedback helped during practice, but practising without feedback led to better mastery a week later.',
          '[Bjork & Bjork (2011)](https://bjorklab.psych.ucla.edu/publication/bjork-e-l-bjork-r-a-2014-making-things-hard-on-yourself-but-in-a-good-way-creating-desirable-difficulties-to-enhance-learning-in-m-a-gernsbacher-and-j-pomerantz-eds-psycholo/): “desirable difficulties”, conditions that make practice feel harder, such as testing yourself and spacing sessions out, tend to produce more durable learning.',
          '[Kapur (2014)](https://onlinelibrary.wiley.com/doi/abs/10.1111/cogs.12107): “productive failure”: students who wrestled with math problems before being taught the method gained deeper conceptual understanding than those who were taught first.',
          '[Kluger & DeNisi (1996)](https://doi.org/10.1037/0033-2909.119.2.254): a meta-analysis of 607 effects found that feedback helps on average, but more than a third of feedback interventions made performance worse, particularly feedback that turns attention to the person instead of the task.',
          '[Hattie & Timperley (2007)](https://doi.org/10.3102/003465430298487): feedback works best when it is about the task and the method and answers “where to next?”; feedback aimed at the person is the least effective kind.',
          '[Mueller & Dweck (1998)](https://pubmed.ncbi.nlm.nih.gov/9686450/) and [Kamins & Dweck (1999)](https://eric.ed.gov/?id=EJ586556): children praised or criticised as people (“you’re so smart”, “you’re careless”) responded helplessly to later setbacks; children given feedback about effort and method kept going.',
          '[Van der Weel & van der Meer (2024)](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1219945/full): writing by hand produced far more elaborate brain connectivity than typing, in patterns linked to memory formation.',
        ],
        paragraphs: [
          `None of these studies is a knock-down argument on its own, and results vary. But the direction is consistent enough that we built ${BRAND} around it. A few of the studies we lean on:`,
        ],
      },
      {
        heading: 'What you get',
        items: [
          'Printable worksheets for grades 1–3: multiplication tables, addition and subtraction, column addition, long multiplication, comparing numbers, rounding and number patterns.',
          'An on-screen Equation Explorer for playing with equations and checking answers on a number line.',
          'Adjustable difficulty: number ranges, digits, columns and layout, remembered on your device for next time.',
          'No account, no sign-up, no ads, no cost. Nothing is uploaded: worksheets are generated in your browser.',
        ],
      },
      {
        heading: 'How to use it',
        items: [
          'Pick a worksheet from the catalog.',
          'Adjust the settings to match what your child is working on.',
          'Press Regenerate for a new random set, then Print.',
        ],
      },
      {
        heading: 'Open source',
        paragraphs: [
          `The source code is on ${github} under the ${license} license. You are welcome to use, share and adapt the worksheets and the code for non-commercial purposes with attribution. Bug reports and ideas for new worksheets are appreciated.`,
        ],
      },
      {
        heading: 'Who runs it',
        paragraphs: [
          `${BRAND} is operated by ${OPERATOR}. See the [Privacy Policy](/privacy) and [Terms of Service](/terms). Questions and suggestions: ${contact}.`,
        ],
      },
    ],
  },
  {
    id: 'privacy',
    slug: 'privacy',
    title: 'Privacy Policy',
    navLabel: 'Privacy',
    description: `Privacy policy for ${BRAND}: no accounts, nothing uploaded, settings stay in your browser, and cookieless Google Analytics with consent denied by default.`,
    updated: '2026-09-04',
    sections: [
      {
        heading: 'Summary',
        paragraphs: [
          `${BRAND} is operated by ${OPERATOR} ("we", "us"). This site has no accounts, no sign-up forms and no comment sections. Worksheets are generated entirely in your browser; nothing you type or print is sent to us. The only third-party service that receives usage information is Google Analytics, in a cookieless, anonymized form described below.`,
        ],
      },
      {
        heading: 'What we do not collect',
        items: [
          'No names, email addresses or other personal details: there is nothing to sign up for.',
          'No worksheet content: the problems on each sheet are generated on your device and never uploaded.',
          'No advertising identifiers, no advertising networks, no tracking pixels.',
        ],
      },
      {
        heading: 'Settings stored in your browser',
        paragraphs: [
          'Your worksheet settings (for example the number range or layout you chose) and the last worksheet you opened are saved in your browser\'s local storage so the site can pick up where you left off. This data stays on your device, is never transmitted to us, and can be removed at any time by clearing your browser\'s site data for this website.',
        ],
      },
      {
        heading: 'Analytics',
        paragraphs: [
          'We use Google Analytics 4, a service of Google LLC, to understand which worksheets are used and how the site is found. Google Consent Mode is configured with analytics and advertising storage denied by default, and we do not show a consent banner because no consent is requested: Google Analytics runs in its cookieless mode and sets no analytics cookies on your device.',
          'In this mode Google receives anonymized, aggregated signals only: page views, which worksheet was opened, when a worksheet was regenerated or printed and which settings were active, together with technical details such as browser type, approximate region and the referring site. IP addresses are anonymized and Google Signals and advertising features are turned off. We do not use analytics data to identify anyone and we never share it with advertisers.',
          'You can block analytics entirely with your browser\'s tracking protection, a content blocker, or the [Google Analytics opt-out browser add-on](https://tools.google.com/dlpage/gaoptout). For details of how Google processes data see [Google\'s Privacy Policy](https://policies.google.com/privacy).',
        ],
      },
      {
        heading: 'Hosting and fonts',
        paragraphs: [
          'The site is hosted on Vercel and its typefaces are loaded from Google Fonts. Like any web server, these providers see the technical details of each request (such as your IP address and browser type) in order to deliver the page. We do not receive or store these request logs. See the [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy) and the [Google Fonts privacy information](https://developers.google.com/fonts/faq/privacy).',
        ],
      },
      {
        heading: 'Children',
        paragraphs: [
          `${BRAND} makes worksheets for children aged roughly 6 to 9, but the site is meant to be used by the adults who print them. We do not knowingly collect personal information from anyone, children included, and the site contains no accounts, messaging or user-generated content.`,
        ],
      },
      {
        heading: 'Changes to this policy',
        paragraphs: [
          'If we ever add a feature that changes how the site handles data, we will update this page and the date at the top. Continued use of the site after a change means you accept the updated policy.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Questions about privacy: ${contact}.`,
        ],
      },
    ],
  },
  {
    id: 'terms',
    slug: 'terms',
    title: 'Terms of Service',
    navLabel: 'Terms',
    description: `Terms of service for ${BRAND}: a free service with no accounts, worksheets for personal and classroom use, content under ${LICENSE_NAME}, provided as is.`,
    updated: '2026-09-04',
    sections: [
      {
        heading: 'The service',
        paragraphs: [
          `${BRAND} is a free website operated by ${OPERATOR} ("we", "us") that generates printable math worksheets in your browser. There is no account to create, no subscription and no fee. By using the site you agree to these terms; if you do not agree, please do not use the site.`,
        ],
      },
      {
        heading: 'Using the worksheets',
        paragraphs: [
          'You may generate, print, copy and share as many worksheets as you like for personal, home-schooling and classroom use, and for any other non-commercial purpose.',
          `The worksheets, the site content and the source code are licensed under ${license}: you may share and adapt them for non-commercial purposes as long as you give credit to ${BRAND}. Selling the worksheets, or bundling them into a paid product or service, requires our written permission.`,
        ],
      },
      {
        heading: 'Acceptable use',
        items: [
          'Do not use the site in a way that breaks the law or infringes anyone\'s rights.',
          'Do not attempt to disrupt the site, overload it with automated requests, or interfere with other people\'s use of it.',
          'Do not remove the attribution from copies or adaptations you distribute.',
        ],
      },
      {
        heading: 'No warranty',
        paragraphs: [
          'The site and the worksheets are provided "as is" and "as available", without warranties of any kind. Problems are generated randomly and, although we test them, a worksheet may contain an error or may not suit a particular curriculum. Please check answers before relying on them, and use your own judgement about what is right for your child or class.',
        ],
      },
      {
        heading: 'Limitation of liability',
        paragraphs: [
          `To the fullest extent permitted by law, ${OPERATOR} is not liable for any indirect, incidental or consequential loss arising from your use of, or inability to use, the site. Because the service is free, our total liability for any claim relating to it is limited to the amount you paid for it, which is nothing.`,
        ],
      },
      {
        heading: 'Third-party services and links',
        paragraphs: [
          `The site links to external services such as ${github} and uses Google Analytics as described in the [Privacy Policy](/privacy). We are not responsible for the content or practices of third-party websites.`,
        ],
      },
      {
        heading: 'Changes and availability',
        paragraphs: [
          'We may change, pause or discontinue the site or any worksheet at any time, and we may update these terms by posting a new version on this page. Continued use of the site after a change means you accept the updated terms.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Questions about these terms: ${contact}.`,
        ],
      },
    ],
  },
]

export function findPageBySlug(slug) {
  return PAGES.find(p => p.slug === slug) ?? null
}

export function findPageById(id) {
  return PAGES.find(p => p.id === id) ?? null
}
