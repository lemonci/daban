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
 * The hem width is not computed here. p.158 does not compute one either: it sends you to
 * the standard skirt block and has you measure, separately, from its back centre and from
 * its front centre to its side seam. So `skirtHemLength()` drafts the skirt block and
 * measures the hem edge it draws, once per panel, and rows 4/5/7/8/9/10/12 below are
 * whatever that gives. They land on the spec's published figures because the skirt block
 * draws its side seam on the fold of its four-strip fan, so each panel carries one and a
 * half spread wedges (skirtblock.md step 5). If that ever changes, these rows move with
 * it -- which is the point: the dress follows the skirt block rather than restating it.
 *
 * Row 7/8's y is the one place this file departs from the spec's table. The spec puts the
 * hem point at y=1050 while also curling the hem baseline's tail up 7.5mm (step 2.3, row
 * 11); both cannot hold. 1050 is read here as the baseline depth (row 6) and the point
 * sits 7.5mm above it, at 1042.5.
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
    it('row 4: the skirt block gives 593.1mm of hem for the pair', () => {
      near(hemLine(back).length() + hemLine(front).length(), 593.1)
    })
    it('row 5: which is 296.55mm per panel', () => {
      near(hemLine(back).length(), 296.55)
      near(hemLine(front).length(), 296.55)
    })
    it('row 6: the hem baseline sits 1050mm below the top line', () => {
      near(back.centerHem.y, 1050)
      near(front.centerHem.y, 1050)
    })
    it('row 7: the back hem point is at (296.55, 1042.5), 7.5mm above the baseline', () => {
      nearPoint(back.sideHem, 296.55, 1042.5)
    })
    it('row 8: the front hem point is at (296.55, 1042.5), 7.5mm above the baseline', () => {
      nearPoint(front.sideHem, 296.55, 1042.5)
    })
    it('row 9: the back flares 51.55mm over 6.85 degrees', () => {
      near(flare(back).dx, 51.55)
      expect(Math.abs(flare(back).deg - 6.85)).to.be.at.most(DEG_TOL)
    })
    it('row 10: the front flares 21.55mm over 2.87 degrees', () => {
      near(flare(front).dx, 21.55)
      expect(Math.abs(flare(front).deg - 2.87)).to.be.at.most(DEG_TOL)
    })
    it('row 11: the hem baseline curls up 7.5mm at its outer end', () => {
      near(back.centerHem.y - back.sideHem.y, 7.5)
      near(front.centerHem.y - front.sideHem.y, 7.5)
    })
    it('row 12: the finished hem measures 1186.2mm round', () => {
      near(2 * (hemLine(back).length() + hemLine(front).length()), 1186.2)
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
      const gap = Math.abs(sideSeam(back).length() - sideSeam(front).length())
      expect(gap).to.be.at.most(6)
      near(gap, 2.6) // the spec's own figure
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
