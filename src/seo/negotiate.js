/**
 * RFC 9110 style Accept-header negotiation.
 *
 * Implements the acceptmarkdown.com convention: for each candidate media type
 * find the *most specific* matching Accept range, honour its q-value, break
 * ties by the client's stated order and finally by the server's candidate
 * order. Returns null when nothing acceptable remains (caller answers 406).
 */

const ANY = '*/*'

export function parseAccept(header) {
  if (header == null || String(header).trim() === '') {
    // No Accept header means the client accepts anything.
    return [{ type: ANY, q: 1, specificity: 0, order: 0 }]
  }
  return String(header)
    .split(',')
    .map((part, order) => {
      const [range, ...params] = part.split(';').map(s => s.trim())
      if (!range) return null
      let q = 1
      for (const param of params) {
        const eq = param.indexOf('=')
        if (eq === -1) continue
        const key = param.slice(0, eq).trim().toLowerCase()
        if (key !== 'q') continue
        const value = parseFloat(param.slice(eq + 1).trim().replace(/^"|"$/g, ''))
        q = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0
      }
      const [type = '*', subtype = '*'] = range.toLowerCase().split('/')
      const specificity = type === '*' ? 0 : subtype === '*' ? 1 : 2
      return { type: `${type}/${subtype}`, q, specificity, order }
    })
    .filter(Boolean)
}

function rangeMatches(range, candidate) {
  if (range === ANY) return true
  const [rt, rs] = range.split('/')
  const [ct, cs] = candidate.toLowerCase().split('/')
  return rt === ct && (rs === '*' || rs === cs)
}

/**
 * @param {string|null|undefined} header  raw Accept header
 * @param {string[]} candidates  media types the server can produce, in server preference order
 * @returns {string|null} chosen media type or null (406)
 */
export function negotiate(header, candidates = ['text/html', 'text/markdown']) {
  const ranges = parseAccept(header)
  let best = null

  candidates.forEach((candidate, serverOrder) => {
    const matched = ranges.filter(r => rangeMatches(r.type, candidate))
    if (matched.length === 0) return
    const maxSpecificity = Math.max(...matched.map(r => r.specificity))
    const mostSpecific = matched.filter(r => r.specificity === maxSpecificity)
    const range = mostSpecific.reduce((a, b) => (b.q > a.q || (b.q === a.q && b.order < a.order) ? b : a))
    if (range.q <= 0) return

    const score = { candidate, q: range.q, order: range.order, serverOrder }
    const better =
      !best ||
      score.q > best.q ||
      (score.q === best.q && (score.order < best.order || (score.order === best.order && score.serverOrder < best.serverOrder)))
    if (better) best = score
  })

  return best ? best.candidate : null
}

export function prefersMarkdown(header) {
  return negotiate(header) === 'text/markdown'
}
