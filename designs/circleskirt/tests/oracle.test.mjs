import { expect } from 'chai'
import { Path } from '@freesewing/core'
import { Circleskirt } from '../src/index.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/circleskirt.md §Worked example, table B
 * (英国经典服装纸样设计基础篇, 第十六章 圆裙纸样, pp.189-198)
 * Book values: waist 70cm, knee 52cm, length bonus 35%, hip safety margin 4.5cm.
 * All values mm. Tolerance ±2mm.
 *
 * The rows below are per-panel figures, and a radial construction fails just as easily in
 * how the panels add up: get the radius wrong and every panel still looks like a sector.
 * So the last two blocks assert the whole pattern -- the waist and hem it comes to at each
 * `fullness` -- which is what the radius formula is for. (skirtblock's oracle only ever
 * checked per-panel numbers, and that is how it came to be drafted a wedge narrow.)
 */

const measurements = {
  waist: 700,
  waistToKnee: 520,
}

const TOL = 2 // mm

// Book arithmetic (circleskirt.md worked example, table B)
const expected = {
  waistEff: 745, // row 1: waist + hip safety margin
  quarterArc: 186.25, // row 2: Aa = waistEff / 4
  waistRadius: 118.57, // row 3: r = (2/pi) x Aa
  length: 702, // row 4: waistToKnee x 1.35
  hemRadius: 820.57, // row 5: r + length
  hemArc: 1289.0, // row 8: (pi/2) x hem radius
  dartTotal: 45, // row 10: the whole hip safety margin
  dartPerSeam: 22.5, // row 10: half of it at each of the 2 side seams
  finishedWaist: 700, // row 11: which brings the waist back to the body measurement
  hemCircumference: 5156, // row 12: 4 x row 8
}

/*
 * Every fullness draws the same 4 quarter arcs' worth of waist, on a radius that grows as
 * the sector narrows. Radii are the spec's own step 2 table; the hem circumference follows
 * from them at length 702 over the garment's 90n degree sweep.
 */
const fullnesses = {
  full: { radius: 118.57, hem: 5155.8 }, // 2pi x 820.57
  threeQuarter: { radius: 158.09, hem: 4053.1 }, // 1.5pi x 860.09
  half: { radius: 237.13, hem: 2950.4 }, // pi x 939.13
  quarter: { radius: 474.27, hem: 1847.6 }, // 0.5pi x 1176.27
}

const draft = (options = {}) => {
  const pattern = new Circleskirt({ measurements, options })
  pattern.draft()

  return pattern
}

// The panel's arcs, as drafted. `waistRaw` is the waist before the hip safety dart.
const arc = (points, name, from, to) =>
  new Path()
    .move(points[from])
    .curve(points[`${name}Cp1`], points[`${name}Cp2`], points[to])
    .length()

const panels = (pattern) => [
  pattern.parts[0]['circleskirt.back'].points,
  pattern.parts[0]['circleskirt.front'].points,
]

const rawWaist = (p, c) => arc(p, 'waistRaw', `${c}Waist`, 'sideWaistRaw')
const netWaist = (p, c) => arc(p, 'waist', `${c}Waist`, 'sideWaist')
const hem = (p, c) => arc(p, 'hem', `${c}Hem`, 'sideHem')

describe('Circleskirt numeric oracle (book worked example)', () => {
  const pattern = draft()
  const [back, front] = panels(pattern)

  it('drafts without errors', () => {
    expect(pattern.setStores[0].logs.error.length).to.equal(0)
  })

  it('row 1: the drafted waist circle measures waistEff, 745mm', () => {
    expect(
      Math.abs(2 * Math.PI * front.center.dist(front.cfWaist) - expected.waistEff)
    ).to.be.at.most(TOL)
  })

  it('row 2: the quarter arc Aa is 186.25mm', () => {
    expect(
      Math.abs((Math.PI / 2) * front.center.dist(front.cfWaist) - expected.quarterArc)
    ).to.be.at.most(TOL)
  })

  it('row 3: the waist radius OA = Oa is 118.57mm', () => {
    expect(Math.abs(front.center.dist(front.cfWaist) - expected.waistRadius)).to.be.at.most(TOL)
    expect(Math.abs(front.center.dist(front.sideWaistRaw) - expected.waistRadius)).to.be.at.most(
      TOL
    )
  })

  it('row 4: the length AB on the fold edge is 702mm', () => {
    expect(Math.abs(front.cfWaist.dist(front.cfHem) - expected.length)).to.be.at.most(TOL)
  })

  it('row 5: the hem radius OB = Ob is 820.57mm', () => {
    expect(Math.abs(front.center.dist(front.cfHem) - expected.hemRadius)).to.be.at.most(TOL)
    expect(Math.abs(front.center.dist(front.sideHem) - expected.hemRadius)).to.be.at.most(TOL)
  })

  it('row 6: the length ab on the side edge is 702mm too', () => {
    expect(Math.abs(front.sideWaistRaw.dist(front.sideHem) - expected.length)).to.be.at.most(TOL)
  })

  it('row 7: the drafted waist arc per quarter is 186.25mm', () => {
    expect(Math.abs(rawWaist(front, 'cf') - expected.quarterArc)).to.be.at.most(TOL)
    expect(Math.abs(rawWaist(back, 'cb') - expected.quarterArc)).to.be.at.most(TOL)
  })

  it('row 8: the drafted hem arc per quarter is 1289mm', () => {
    expect(Math.abs(hem(front, 'cf') - expected.hemArc)).to.be.at.most(TOL)
    expect(Math.abs(hem(back, 'cb') - expected.hemArc)).to.be.at.most(TOL)
  })

  it('row 9: the full waist before the dart is 745mm', () => {
    expect(
      Math.abs(2 * (rawWaist(front, 'cf') + rawWaist(back, 'cb')) - expected.waistEff)
    ).to.be.at.most(TOL)
  })

  it('row 10: the hip safety dart is 45mm in total, 22.5mm at each side seam', () => {
    const perEdge = rawWaist(front, 'cf') - netWaist(front, 'cf')
    expect(Math.abs(2 * perEdge - expected.dartPerSeam)).to.be.at.most(TOL)
    expect(Math.abs(4 * perEdge - expected.dartTotal)).to.be.at.most(TOL)
  })

  it('row 11: which leaves a finished waist of 700mm, the body measurement', () => {
    expect(
      Math.abs(2 * (netWaist(front, 'cf') + netWaist(back, 'cb')) - expected.finishedWaist)
    ).to.be.at.most(TOL)
  })

  it('row 12: the full hem circumference is 5156mm', () => {
    expect(
      Math.abs(2 * (hem(front, 'cf') + hem(back, 'cb')) - expected.hemCircumference)
    ).to.be.at.most(TOL)
  })

  /*
   * The two properties a radial construction lives or dies by, at every fullness.
   */
  describe('radial properties', () => {
    for (const [fullness, want] of Object.entries(fullnesses)) {
      const p = draft({ fullness })
      const [b, f] = panels(p)

      it(`${fullness}: the waist radius is ${want.radius}mm`, () => {
        expect(Math.abs(f.center.dist(f.cfWaist) - want.radius)).to.be.at.most(TOL)
      })

      it(`${fullness}: the hem arc is concentric, r_hem - r = length at both edges`, () => {
        expect(Math.abs(f.cfWaist.dist(f.cfHem) - expected.length)).to.be.at.most(TOL)
        expect(Math.abs(f.sideWaistRaw.dist(f.sideHem) - expected.length)).to.be.at.most(TOL)
        expect(
          Math.abs(f.center.dist(f.cfHem) - f.center.dist(f.cfWaist) - expected.length)
        ).to.be.at.most(TOL)
      })

      it(`${fullness}: the whole pattern's waist arc measures waistEff, 745mm`, () => {
        expect(
          Math.abs(2 * (rawWaist(f, 'cf') + rawWaist(b, 'cb')) - expected.waistEff)
        ).to.be.at.most(TOL)
      })

      it(`${fullness}: the whole pattern's hem measures ${want.hem}mm`, () => {
        expect(Math.abs(2 * (hem(f, 'cf') + hem(b, 'cb')) - want.hem)).to.be.at.most(TOL)
      })

      it(`${fullness}: the finished waist is the body measurement, 700mm`, () => {
        expect(
          Math.abs(2 * (netWaist(f, 'cf') + netWaist(b, 'cb')) - expected.finishedWaist)
        ).to.be.at.most(TOL)
      })
    }
  })

  describe('hip safety margin', () => {
    it('at 0 the waist is the bare body measurement, with no dart', () => {
      const [b, f] = panels(draft({ hipSafetyMargin: 0 }))
      expect(Math.abs(2 * (rawWaist(f, 'cf') + rawWaist(b, 'cb')) - 700)).to.be.at.most(TOL)
      expect(Math.abs(rawWaist(f, 'cf') - netWaist(f, 'cf'))).to.be.at.most(0.001)
    })
  })
})
