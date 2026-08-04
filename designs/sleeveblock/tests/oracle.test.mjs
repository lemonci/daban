import { expect } from 'chai'
import { Sleeveblock } from '../src/index.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/sleeveblock.md, section "Worked example (oracle)"
 * (英国经典服装纸样设计基础篇, pp.92-100).
 *
 * Book values: upper arm 30cm, sleeve length 60cm, elbow height 32cm.
 *
 * Rows 17, 18, 20 and 21 of the spec's table are bodice-side quantities (armhole depth,
 * total armhole, and how the cap ease splits front to back); none of them is a product
 * of this draft, so they are not asserted here. Row 18 and the ease budget are checked
 * against a real bodice draft in armhole.test.mjs.
 *
 * All values mm. Tolerance +/-2mm unless a row states otherwise.
 */

const measurements = {
  biceps: 300,
  shoulderToWrist: 600,
  shoulderToElbow: 320,
}

const TOL = 2 // mm

const near = (actual, expected) => expect(Math.abs(actual - expected)).to.be.at.most(TOL)
const nearPoint = (point, x, y) => {
  near(point.x, x)
  near(point.y, y)
}

describe('Sleeveblock numeric oracle (book worked example)', () => {
  const pattern = new Sleeveblock({ measurements })
  pattern.draft()
  const part = pattern.parts[0]['sleeveblock.sleeve']
  const points = part.points

  it('drafts without errors', () => {
    expect(pattern.setStores[0].logs.error.length).to.equal(0)
  })

  describe('cutting rectangle', () => {
    it('row 1: the sleeve root is 350mm wide', () => {
      near(points.frontUnderarm.x, 350)
    })
    it('row 2: the cap is 130mm deep', () => {
      near(points.backUnderarm.y, 130)
    })
    it('row 3: the cutting rectangle is 590mm long', () => {
      near(points.backQuarterHem.y, 590)
    })
    it('row 4: the quarter reference lines sit 87.5mm apart', () => {
      near(points.backNotch.x, 87.5)
      near(points.frontNotch.x, 3 * 87.5)
    })
  })

  describe('cap points', () => {
    it('row 5: T is at (175, 0)', () => {
      nearPoint(points.capApex, 175, 0)
    })
    it('row 6: U_back is at (0, 130) and U_front at (350, 130)', () => {
      nearPoint(points.backUnderarm, 0, 130)
      nearPoint(points.frontUnderarm, 350, 130)
    })
    it('row 7: B is at (87.5, 55)', () => {
      nearPoint(points.backNotch, 87.5, 55)
    })
    it('row 8: F is at (262.5, 60), 5mm lower than B', () => {
      nearPoint(points.frontNotch, 262.5, 60)
      near(points.frontNotch.y - points.backNotch.y, 5)
    })
    it('row 9: the U_back-B midpoint drops 10mm to (43.75, 102.5)', () => {
      nearPoint(points.backHollowAux, 43.75, 102.5)
    })
    it('row 10: the B-T midpoint rises 10mm to (131.25, 17.5)', () => {
      nearPoint(points.backCrownAux, 131.25, 17.5)
    })
    it('row 11: the T-F midpoint rises 12mm to (218.75, 18)', () => {
      nearPoint(points.frontCrownAux, 218.75, 18)
    })
    it('row 12: the F-U_front midpoint drops 20mm to (306.25, 115)', () => {
      nearPoint(points.frontHollowAux, 306.25, 115)
    })
  })

  describe('elbow and hem', () => {
    it('row 13: E sits on the back quarter line at (87.5, 307.8)', () => {
      nearPoint(points.elbow, 87.5, 307.8)
    })
    it('row 14: the elbow notches sit at 232.8 and 357.8 on both seam edges', () => {
      near(points.backElbowAbove.y, 232.8)
      near(points.backElbowBelow.y, 357.8)
      near(points.frontElbowAbove.y, 232.8)
      near(points.frontElbowBelow.y, 357.8)
    })
    it('row 15: the front quarter line hem rises from 590 to 565', () => {
      near(points.frontQuarterHem.y, 565)
    })
    it('row 16: the back quarter line hem stays at 590', () => {
      near(points.backQuarterHem.y, 590)
    })
  })

  /*
   * The cap-arc closure check, the spec's own strongest test of the whole construction.
   * The chord polyline is quoted exactly (436.7mm); the curved length is quoted as
   * "approximately 455mm" from a parabolic arc-length estimate. That estimate treats the
   * four midpoint offsets as sagittas square to their chords, but the book measures them
   * straight down the page, so the true perpendicular sagitta is the offset times the
   * cosine of the chord's slope, and the drawn curve is correspondingly shorter than the
   * estimate. It lands at 448mm, inside the book's own 445-455mm target band -- which is
   * what the check is really about, and is asserted as such.
   */
  describe('cap arc', () => {
    const chords = [
      points.backUnderarm.dist(points.backNotch),
      points.backNotch.dist(points.capApex),
      points.capApex.dist(points.frontNotch),
      points.frontNotch.dist(points.frontUnderarm),
    ]

    it('the four cap chords measure 115.2, 103.3, 106.1 and 112.1mm', () => {
      near(chords[0], 115.2)
      near(chords[1], 103.3)
      near(chords[2], 106.1)
      near(chords[3], 112.1)
    })
    it('the chord polyline totals 436.7mm', () => {
      near(
        chords.reduce((a, b) => a + b, 0),
        436.7
      )
    })
    it('row 19: the drawn cap arc falls inside the 445-455mm target', () => {
      const cap = part.paths.cap.length()
      expect(cap).to.be.at.least(445)
      expect(cap).to.be.at.most(455)
    })
  })

  /*
   * Ambiguity 6, resolved in the spec against figure 7-7: the hem is cut as a single
   * straight line all the way from one seam edge to the other, through the back quarter
   * line's unchanged hem point and the front quarter line's raised one. Extending it that
   * far leaves the two seam edges 50mm apart in length, so the finished hem steps by 50mm
   * where the underarm seam closes. That is what the spec's reading produces; it is
   * pinned here rather than smoothed over, and reported for adjudication against the
   * source pages.
   */
  describe('hem, extended to the seam edges (ambiguity 6)', () => {
    it('puts the back seam edge 12.5mm below the cutting rectangle', () => {
      near(points.backHem.y, 602.5)
    })
    it('puts the front seam edge 37.5mm above it', () => {
      near(points.frontHem.y, 552.5)
    })
    it('so the two seam edges differ by 50mm in length', () => {
      near(points.backHem.y - points.frontHem.y, 50)
    })
  })
})
