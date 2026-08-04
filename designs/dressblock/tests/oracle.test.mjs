import { expect } from 'chai'
import { Path } from '@freesewing/core'
import { Dressblock } from '../src/index.mjs'

/*
 * Numeric oracle against the spec's worked example.
 * Source: docs/patterns/dressblock.md, section "Worked example (oracle)"
 * (英国经典服装纸样设计基础篇, pp.157-162, chest 92 / hip 98 average size).
 *
 * ⚠ Chapter 12 prints no worked table of its own. Every row below is the spec's own
 * arithmetic over the bodice block's and the skirt block's already-verified oracles, so
 * this file is regression protection, not verification against the book.
 *
 * ⚠⚠ Seven of the fourteen rows do not come out at the number the spec predicted, and
 * they all trace back to one thing: what "the skirt block's hem width" is. The spec's
 * rows 4 and 5 take it from skirtblock.md's *step 4*, which measures the half pattern as
 * one spread fan -- 520 + 3 x 24.37 = 593.1mm, halved to 296.55 per panel. But
 * skirtblock.md's *step 5*, which is what `@freesewing/skirtblock` actually drafts, builds
 * each panel as two strips with one spread between them, which gives 284.4mm per panel
 * and 568.8mm for the pair. The two readings differ by half a hem spread (12.2mm per
 * panel) because step 5 gives neither panel a share of the spread at the side seam.
 *
 * That disagreement is inside the skirt block's own spec, and dressblock.md inherited it
 * by citing "= skirtblock row 16". This design follows the drafted skirt block, because
 * p.158 does not compute a hem: it tells you to measure one off the standard skirt block.
 * Taking the number from anywhere else would give a dress whose hem does not match the
 * skirt block it was supposedly read from -- here, 4.9cm wider all round. Every affected
 * row below carries the spec's prediction next to what the construction gives.
 *
 * All values mm. Tolerance +/-2mm unless a row states otherwise.
 */

const measurements = {
  biceps: 300,
  chest: 920,
  seat: 980,
  waist: 700,
  hpsToWaistBack: 400,
  waistToSeat: 220,
  waistToKnee: 520,
  shoulderToShoulder: 390,
}

const TOL = 2 // mm
const DEG_TOL = 0.5

const near = (actual, expected) => expect(Math.abs(actual - expected)).to.be.at.most(TOL)
const nearPoint = (point, x, y) => {
  near(point.x, x)
  near(point.y, y)
}

const draft = (settings = {}) => {
  const pattern = new Dressblock({ measurements, ...settings })
  pattern.draft()

  return {
    pattern,
    back: pattern.parts[0]['dressblock.back'].points,
    front: pattern.parts[0]['dressblock.front'].points,
  }
}

// The two curves this chapter adds, on either panel
const sideSeam = (p) => new Path().move(p.hp).curve(p.sideHemCp1, p.sideHemCp2, p.sideHem)
const hemLine = (p) => new Path().move(p.centerHem).curve(p.hemCp1, p.hemCp2, p.sideHem)
const flare = (p) => ({
  dx: p.sideHem.x - p.hp.x,
  deg: (Math.atan2(p.sideHem.x - p.hp.x, p.sideHem.y - p.hp.y) * 180) / Math.PI,
})

describe('Dressblock numeric oracle (spec worked example)', () => {
  const { pattern, back, front } = draft()
  const store = pattern.setStores[0]

  it('drafts without errors', () => {
    expect(store.logs.error.length).to.equal(0)
  })

  describe('inherited from the bodice block, unchanged', () => {
    it('row 1: back HP is at (245, 620)', () => {
      nearPoint(back.hp, 245, 620)
    })
    it('row 2: front HP is at (275, 620)', () => {
      nearPoint(front.hp, 275, 620)
    })
  })

  describe('the skirt this chapter adds', () => {
    it('row 3: the skirt is 650mm long, measured down from the waist line', () => {
      near(back.centerHem.y - measurements.hpsToWaistBack, 650)
      near(front.centerHem.y - measurements.hpsToWaistBack, 650)
    })
    it('row 4: the skirt block gives 568.8mm of hem for the pair (spec predicted 593.1)', () => {
      near(hemLine(back).length() + hemLine(front).length(), 568.81)
    })
    it('row 5: which is 284.4mm per panel (spec predicted 296.55)', () => {
      near(hemLine(back).length(), 284.4)
      near(hemLine(front).length(), 284.4)
    })
    it('row 6: the hem baseline sits 1050mm below the top line', () => {
      near(back.centerHem.y, 1050)
      near(front.centerHem.y, 1050)
    })
    it('row 7: the back hem point is at (284.29, 1042.5) (spec predicted (296.55, 1050))', () => {
      nearPoint(back.sideHem, 284.29, 1042.5)
    })
    it('row 8: the front hem point is at (284.29, 1042.5) (spec predicted (296.55, 1050))', () => {
      nearPoint(front.sideHem, 284.29, 1042.5)
    })
    it('row 9: the back flares 39.3mm over 5.31 degrees (spec predicted 51.55mm / 6.85)', () => {
      near(flare(back).dx, 39.29)
      expect(Math.abs(flare(back).deg - 5.31)).to.be.at.most(DEG_TOL)
    })
    it('row 10: the front flares 9.3mm over 1.26 degrees (spec predicted 21.55mm / 2.87)', () => {
      near(flare(front).dx, 9.3)
      expect(Math.abs(flare(front).deg - 1.26)).to.be.at.most(DEG_TOL)
    })
    it('row 11: the hem baseline curls up 7.5mm at its outer end', () => {
      near(back.centerHem.y - back.sideHem.y, 7.5)
      near(front.centerHem.y - front.sideHem.y, 7.5)
    })
    it('row 12: the finished hem measures 1137.6mm round (spec predicted 1186.2)', () => {
      near(2 * (hemLine(back).length() + hemLine(front).length()), 1137.61)
    })
    it('row 13: the front is 1050mm from NP to hem and the back 1040mm', () => {
      near(front.centerHem.y - front.np.y, 1050)
      near(back.centerHem.y - back.np.y, 1040)
    })
  })

  /*
   * Row 14 is chapter 11 section 7's check, run between the two blocks this design joins.
   * It is not a target to hit: it exists to show that method (2) never needs the bodice
   * block's hip line and the skirt block's hip line to agree, because they do not.
   */
  describe('chapter 11 section 7 cross-check', () => {
    it('row 14: the two blocks disagree at the hip line by 15mm, back and front', () => {
      // The skirt block puts both panels at seat/4 + half the seat ease
      const skirtHip = measurements.seat / 4 + (measurements.seat * 0.0612) / 4
      near(skirtHip - back.hp.x, 15)
      near(skirtHip - front.hp.x, -15)
    })
  })

  /*
   * The spec's own well-behavedness checks (docs/patterns/dressblock.md, Review). These
   * are what catch a side seam that has stopped being a side seam.
   */
  describe('well-behavedness', () => {
    for (const [name, points] of [
      ['back', back],
      ['front', front],
    ]) {
      it(`the ${name} HP-to-hem curve is monotonic in x and never crosses the center line`, () => {
        const path = sideSeam(points)
        let previous = -Infinity
        for (let i = 0; i <= 200; i++) {
          const at = path.shiftFractionAlong(i / 200)
          expect(at.x).to.be.at.least(previous - 0.001)
          expect(at.x).to.be.above(0)
          previous = at.x
        }
      })
    }

    it('the back and front side seams stay within easing distance of each other', () => {
      // 2.06mm apart here; the spec predicted 2.6mm off its own wider hem
      const gap = Math.abs(sideSeam(back).length() - sideSeam(front).length())
      expect(gap).to.be.at.most(6)
      near(gap, 2.06)
    })

    it('the finished hem is wider than the finished hip line', () => {
      const hem = 2 * (hemLine(back).length() + hemLine(front).length())
      expect(hem).to.be.above(measurements.seat * 1.0612)
    })
  })

  /*
   * `hemTighten` is the one option this chapter adds. It is a percentage of the panel's
   * own hem width rather than the book's 2 to 4 cm, because FreeSewing rejects mm options.
   */
  describe('hem tightening', () => {
    const tight = draft({ options: { hemTighten: 0.15 } })

    it('takes its percentage off each panel’s own marked hem width', () => {
      near(tight.back.sideHem.x, back.sideHem.x * 0.85)
      near(tight.front.sideHem.x, front.sideHem.x * 0.85)
    })
    it('leaves the mark inside the original, as the book asks', () => {
      expect(tight.back.sideHem.x).to.be.below(back.sideHem.x)
      expect(tight.front.sideHem.x).to.be.below(front.sideHem.x)
    })
  })
})
