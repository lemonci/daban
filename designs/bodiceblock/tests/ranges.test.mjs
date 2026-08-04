import { expect } from 'chai'
import { Path, Point, beamIntersectsX } from '@freesewing/core'
import { adult, doll, giant } from '@freesewing/models'
import {
  blockOptions,
  structure,
  solveUpDrop,
  ADULT_CHEST_MIN,
  ADULT_CHEST_MAX,
  ARMHOLE_EASE_MIN,
  ARMHOLE_EASE_MAX,
  FRONT_BISECTOR,
  UPDROP_MIN,
  UPDROP_MAX,
} from '../src/shared.mjs'

/*
 * The option ranges are not the book's -- Bray states none of them -- so nothing but a
 * sweep can say whether they are safe. This is that sweep, and it is why the ranges in
 * `shared.mjs` are what they are: every adult stock model, at every combination of
 * {min, default, max} of the four options that move an underarm or a pitch point.
 *
 * Three things are checked per cell, none of them read off the implementation:
 *
 *  - the section D.0 solver must not clamp, i.e. the answer lies strictly inside the
 *    underarm-drop bracket. A clamped block is not the block the solver was asked for and
 *    its sleeve will not set in.
 *  - the armhole must land inside p.29's accepted band, biceps + 10 to 13cm.
 *  - the front pitch point must sit inboard of the front underarm point by at least the
 *    section B.12 hollow's own outboard offset. That offset is `FRONT_BISECTOR * cos45`,
 *    because B.12 places the hollow at `armholeCorner.shift(45, FRONT_BISECTOR)`; it is
 *    recomputed here from the bisector rather than imported, so that a wrong constant in
 *    `shared.mjs` fails this test rather than agreeing with it. Any less clearance and the
 *    front armhole is wider at the underarm than at the pitch -- it opens as it descends
 *    -- and its lower stretch runs outside the panel's own side-seam line.
 */

const HOLLOW_OUTBOARD = FRONT_BISECTOR * Math.cos(Math.PI / 4)

const defaults = Object.fromEntries(
  Object.entries(blockOptions).map(([key, o]) => [key, o.bool === undefined ? o.pct / 100 : o.bool])
)

/*
 * Everything under test lives in the pre-pass, so it is driven directly rather than
 * through 1080 full drafts.
 */
const run = (measurements, options = {}) => {
  const logs = { info: [], warn: [], error: [] }
  const data = {}
  const sh = {
    Point,
    Path,
    utils: { beamIntersectsX },
    measurements,
    options: { ...defaults, ...options },
    store: {
      get: (key, dflt) => (key in data ? data[key] : dflt),
      set: (key, value) => (data[key] = value),
      log: {
        info: (msg) => logs.info.push(msg),
        warn: (msg) => logs.warn.push(msg),
        error: (msg) => logs.error.push(msg),
      },
    },
  }
  const st = structure(sh)
  const upDrop = solveUpDrop(sh, st)

  return { logs, st, upDrop, armhole: data['bodiceblock.armholeCalibrated'] }
}

const swept = ['chestEase', 'backWidthPct', 'chestWidthPct', 'bustDartWidth']
const cells = swept.reduce(
  (acc, key) => {
    const { min, pct, max } = blockOptions[key]
    return acc.flatMap((cell) =>
      [...new Set([min, pct, max])].map((v) => ({ ...cell, [key]: v / 100 }))
    )
  },
  [{}]
)

const models = []
for (const gender of ['cisFemale', 'cisMale'])
  for (const [size, measurements] of Object.entries(adult[gender]))
    models.push({ name: `${gender}/${size}`, measurements })

const results = []
for (const { name, measurements } of models)
  for (const cell of cells) results.push({ name, cell, measurements, ...run(measurements, cell) })

const label = (r, what) => `${r.name} ${JSON.stringify(r.cell)}: ${what}`

describe('Bodiceblock option ranges', () => {
  it(`sweeps all 20 adult stock models over ${cells.length} option cells`, () => {
    expect(models.length).to.equal(20)
    expect(results.length).to.equal(20 * cells.length)
  })

  it('never clamps the underarm-drop solver', () => {
    const bad = results
      .filter((r) => r.upDrop <= UPDROP_MIN || r.upDrop >= UPDROP_MAX)
      .map((r) => label(r, `upDrop clamped at ${r.upDrop.toFixed(1)}mm`))
    expect(bad).to.deep.equal([])
  })

  it("lands every armhole inside p.29's biceps + 100 to 130mm band", () => {
    const bad = results
      .filter(
        (r) =>
          r.armhole < r.measurements.biceps + ARMHOLE_EASE_MIN ||
          r.armhole > r.measurements.biceps + ARMHOLE_EASE_MAX
      )
      .map((r) =>
        label(r, `armhole ${r.armhole.toFixed(1)}mm against biceps ${r.measurements.biceps}mm`)
      )
    expect(bad).to.deep.equal([])
  })

  it('keeps the front pitch point inboard of the front underarm point', () => {
    const bad = results
      .map((r) => ({ r, clearance: r.st.frontUpX - (r.st.chestWidth / 2 + 20) }))
      .filter(({ clearance }) => clearance < HOLLOW_OUTBOARD)
      .map(({ r, clearance }) =>
        label(r, `clearance ${clearance.toFixed(2)}mm, needs ${HOLLOW_OUTBOARD.toFixed(2)}mm`)
      )
    expect(bad).to.deep.equal([])
  })

  it('reports no error on any cell', () => {
    const bad = results.filter((r) => r.logs.error.length > 0).map((r) => label(r, r.logs.error[0]))
    expect(bad).to.deep.equal([])
  })

  /*
   * Ch.3 section 7, pp.45-47: enlarging a block at the side seam is limited to 0.5-1cm for
   * shirts and tailored garments and 2-2.5cm for workwear and loose tops; past 3-5cm the
   * book enlarges at the shoulder instead, which this design does not draft. `chestEase`
   * is the only option that enlarges at the side seam -- it moves the front underarm point
   * and nothing else -- so its ceiling is that 2.5cm, measured against the same model's own
   * default draft. The largest chest binds.
   */
  it("keeps chestEase's ceiling inside the 25mm side-seam limit of Ch.3 section 7", () => {
    const bad = []
    for (const { name, measurements } of models) {
      const at = (pct) => run(measurements, { chestEase: pct / 100 }).st.frontUpX
      const moved = at(blockOptions.chestEase.max) - at(blockOptions.chestEase.pct)
      if (moved > 25) bad.push(`${name}: front UP moves ${moved.toFixed(2)}mm`)
    }
    expect(bad).to.deep.equal([])
  })
})

/*
 * The adult window decides whether a block the calibration cannot close is an error or a
 * note. Both bounds are chosen rather than sourced, so what they are worth is exactly this:
 * they have to hold all twenty adult stock models and no doll or giant.
 */
describe('Bodiceblock adult-size window', () => {
  it('holds every adult stock model', () => {
    const out = models
      .filter(
        ({ measurements }) =>
          measurements.chest < ADULT_CHEST_MIN || measurements.chest > ADULT_CHEST_MAX
      )
      .map(({ name, measurements }) => `${name} chest ${measurements.chest}mm`)
    expect(out).to.deep.equal([])
  })

  it('holds no doll and no giant', () => {
    const inside = []
    for (const [group, sizes] of Object.entries({ doll, giant }))
      for (const gender of ['cisFemale', 'cisMale'])
        for (const [size, m] of Object.entries(sizes[gender]))
          if (m.chest >= ADULT_CHEST_MIN && m.chest <= ADULT_CHEST_MAX)
            inside.push(`${group}/${gender}/${size} chest ${m.chest}mm`)
    expect(inside).to.deep.equal([])
  })

  /*
   * A biceps no armhole this block can draw will ever reach: the solver runs out of
   * bracket, clamps, and the sleeve cannot set in. Inside the window that is a broken
   * pattern; outside it the millimetre constants were never going to hold anyway.
   */
  const unreachable = { ...adult.cisFemale['34'], biceps: 600 }

  it('errors when an adult-sized draft clamps', () => {
    const { logs, upDrop } = run(unreachable)
    expect(upDrop).to.equal(UPDROP_MAX)
    expect(logs.error.length).to.equal(1)
    expect(logs.warn.length).to.equal(0)
    expect(`${logs.error[0]}`).to.include('accepted band')
  })

  it('only warns when the same draft is off adult size', () => {
    const { logs, upDrop } = run({ ...unreachable, chest: ADULT_CHEST_MAX + 1 })
    expect(upDrop).to.equal(UPDROP_MAX)
    expect(logs.error.length).to.equal(0)
    expect(logs.warn.length).to.equal(1)
  })

  it('errors when an adult-sized draft loses the B.12 clearance', () => {
    // out of range on purpose: the guard has to hold for hand-set options too
    const { logs, st } = run(adult.cisFemale['28'], { chestWidthPct: 0.55 })
    expect(st.frontUpX - (st.chestWidth / 2 + 20)).to.be.below(HOLLOW_OUTBOARD)
    expect(logs.error.filter((l) => `${l}`.includes('front pitch point')).length).to.equal(1)
  })

  it('only warns about the clearance on a doll', () => {
    const { logs } = run(doll.cisFemale['10'])
    expect(logs.error.length).to.equal(0)
    expect(logs.warn.filter((l) => `${l}`.includes('front pitch point')).length).to.equal(1)
  })
})
