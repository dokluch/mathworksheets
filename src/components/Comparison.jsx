import { usePersistedState } from '../hooks/usePersistedState'
import { useT } from '../i18n/context'
import { SettingsPanel, SettingRow, SegmentedControl, CheckboxOption, PanelActions } from './controls/SettingsPanel'
import './Comparison.css'
import WorksheetHeader from './WorksheetHeader'
import { useSheetSet } from '../hooks/useSheetSet'
import SheetCopies from './SheetCopies'
import AnswerKey from './AnswerKey'
import { asHelpers } from '../lib/rng'
import { usePreviewScale } from '../hooks/usePreviewScale'

/**
 * Generate tricky comparison pairs where digits are swapped, repeated,
 * or otherwise easy to confuse.
 */
function generateTrickyPair(maxVal, r) {
  const strategies = []

  // Strategy: swap digits (78 vs 87, 13 vs 31, 123 vs 132)
  strategies.push(() => {
    if (maxVal < 12) return null
    const digits = maxVal <= 99 ? 2 : maxVal <= 999 ? r.int(2, 3) : r.int(2, 4)
    let a
    do {
      a = r.int(10 ** (digits - 1), Math.min(10 ** digits - 1, maxVal))
    } while (a < 10)
    const chars = String(a).split('')
    // find pairs of positions with different digits
    const diffPairs = []
    for (let x = 0; x < chars.length; x++)
      for (let y = x + 1; y < chars.length; y++)
        if (chars[x] !== chars[y]) diffPairs.push([x, y])
    if (diffPairs.length === 0) return null // all digits same (e.g. 11, 333)
    const [pi, pj] = r.pick(diffPairs)
    const bChars = [...chars];
    [bChars[pi], bChars[pj]] = [bChars[pj], bChars[pi]]
    const b = Number(bChars.join(''))
    if (b === 0 || b > maxVal || b === a || String(b).length !== String(a).length) return null
    return [a, b]
  })

  // Strategy: same digits, different counts (13 vs 33, 12 vs 22, 155 vs 555)
  strategies.push(() => {
    if (maxVal < 11) return null
    const digits = maxVal <= 99 ? 2 : r.int(2, 3)
    const a = r.int(10 ** (digits - 1), Math.min(10 ** digits - 1, maxVal))
    const chars = String(a).split('')
    const pos = r.int(0, chars.length - 1)
    const otherPos = pos === 0 ? 1 : 0
    const bChars = [...chars]
    bChars[pos] = chars[otherPos]
    const b = Number(bChars.join(''))
    if (b === 0 || b > maxVal || b === a || String(b).length !== String(a).length) return null
    return [a, b]
  })

  // Strategy: off-by-one (50 vs 51, 99 vs 100)
  strategies.push(() => {
    const a = r.int(1, maxVal - 1)
    const b = a + 1
    if (b > maxVal) return null
    return [a, b]
  })

  // Strategy: same digit, shifted place value (13 vs 31, 5 vs 50)
  strategies.push(() => {
    if (maxVal < 10) return null
    const a = r.int(1, Math.min(9, Math.floor(maxVal / 10)))
    const b = a * 10 + r.int(0, Math.min(9, maxVal - a * 10))
    if (b > maxVal || b === a) return null
    return [a, b]
  })

  // Strategy: close numbers with repeated digit (33 vs 34, 111 vs 112)
  strategies.push(() => {
    const digit = r.int(1, 9)
    const rep = maxVal >= 100 ? r.int(2, 3) : 2
    const a = Number(String(digit).repeat(rep))
    if (a > maxVal) return null
    const b = a + r.int(1, 3)
    if (b > maxVal) return null
    return [a, b]
  })

  // Try strategies in random order, fall back to plain random. A proper
  // shuffle, not a random sort comparator: that gives engine-dependent
  // orders, and a set number must deal the same page in every browser.
  for (const fn of r.shuffle(strategies)) {
    const pair = fn()
    if (pair) {
      // randomly swap order so answer isn't always the same
      return r.chance(0.5) ? pair : [pair[1], pair[0]]
    }
  }

  // fallback: plain random
  const a = r.int(1, maxVal)
  let b
  do { b = r.int(1, maxVal) } while (b === a)
  return [a, b]
}

function generateEqualPair(maxVal, r) {
  const a = r.int(1, maxVal)
  return [a, a]
}

function generateSheet(count, maxVal, rng) {
  const r = asHelpers(rng)
  const items = []
  for (let i = 0; i < count; i++) {
    // ~15% chance of equal pair to keep kids on their toes
    if (r.int(1, 100) <= 15) {
      const [a, b] = generateEqualPair(maxVal, r)
      items.push({ a, b, answer: '=' })
    } else {
      const [a, b] = generateTrickyPair(maxVal, r)
      items.push({ a, b, answer: a > b ? '>' : a < b ? '<' : '=' })
    }
  }
  return items
}

const PRESETS = [10, 20, 100, 1000]

export default function Comparison() {
  const t = useT()
  const [maxVal, setMaxVal] = usePersistedState('compare', 'maxVal', 100)
  const [columns, setColumns] = usePersistedState('compare', 'columns', 3)
  const [answerKey, setAnswerKey] = usePersistedState('compare', 'answerKey', false)
  const [fitRef, fitStyle] = usePreviewScale()

  const problemCount = columns === 2 ? 20 : columns === 3 ? 30 : 40

  const { sheets, setSet, regenerate } = useSheetSet(
    rng => generateSheet(problemCount, maxVal, rng),
    [maxVal, problemCount],
  )

  return (
    <div className="tool-panel">
      <SettingsPanel actions={<PanelActions worksheetId="compare" onRegenerate={regenerate} />}>
        <SettingRow label={t('common.range')}>
          <SegmentedControl
            value={maxVal}
            onChange={setMaxVal}
            options={PRESETS.map(max => ({ value: max, label: t('common.within', { n: max }) }))}
          />
        </SettingRow>
        <SettingRow label={t('common.columns')}>
          <SegmentedControl value={columns} onChange={setColumns} options={[2, 3, 4].map(c => ({ value: c, label: c }))} />
        </SettingRow>
        <SettingRow label={t('common.options')}>
          <CheckboxOption checked={answerKey} onChange={setAnswerKey}>
            {t('common.answerKeyOption')}
          </CheckboxOption>
        </SettingRow>
      </SettingsPanel>

      <SheetCopies sheets={sheets}>
        {({ set, data: problems }, primary) => (
          <div className="sheet-fit" ref={primary ? fitRef : undefined} style={primary ? fitStyle : undefined}>
            <div className={`worksheet print-area cols-${columns}`}>
              <WorksheetHeader
                title={t('compare.title')}
                meta={`<  >  = · ${t('common.withinMeta', { n: maxVal })}`}
                stamp={String(set)}
                onStampChange={primary ? setSet : undefined}
              />

              <div
                className="compare-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
              >
                {problems.map((p, i) => (
                  <div key={i} className="compare-item">
                    <span className="compare-val">{p.a}</span>
                    <span className="blank-slot" />
                    <span className="compare-val">{p.b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SheetCopies>

      {answerKey && sheets.map(({ set, data: problems }, i) => (
        <AnswerKey
          key={i}
          title={t('compare.title')}
          stamp={String(set)}
          answers={problems.map(p => p.answer)}
        />
      ))}
    </div>
  )
}
