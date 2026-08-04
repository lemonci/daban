import { expect } from 'chai'
import { Path } from '@freesewing/core'
import { Skirtblock } from '../src/index.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/skirtblock.md §Worked example (英国经典服装纸样设计基础篇, pp.145-150)
 * Book values: hip 98cm, waist 70cm, waist-to-hip 22cm, knee 52cm, length 65cm.
 * All values mm. Tolerance ±2mm (spec success criterion #2).
 *
 * Rows 15 and 16 state the half pattern's widths, and until 2026-08-04 this file only
 * ever asserted the per-part geometry -- which is how the block came to be drafted half a
 * spread wedge narrow per panel without anything failing. They are asserted directly now,
 * as well as halved onto each part, so the two can never drift apart again. See step 5 in
 * the spec for why the side seam is a fold of the four-strip fan rather than a re-draft.
 */

const measurements = {
  seat: 980,
  waist: 700,
  waistToSeat: 220,
  waistToKnee: 520,
}

const TOL = 2 // mm

// Derived book arithmetic (skirtblock.md worked example table)
const expected = {
  depth: 220, // row 4: waist->hip on center edge
  length: 650, // row 3: CB/CF waist->hem (waistToKnee * 1.25)
  hipWidth: 260, // row 2: hip width per part
  sideWaistRaw: { x: 241.1, y: -6.6 }, // rotated side-waist corner (row 6/7 geometry)
  sideKnee: { x: 285.5, y: 511.6 }, // row 15 halved onto one part; drafted 285.2
  sideHem: { x: 296.55, y: 641.1 }, // row 16 halved onto one part; drafted 296.2
  kneeHalfWidth: 571, // row 15: both parts (520 + 3 x 17)
  hemHalfWidth: 593.1, // row 16: both parts (520 + 3 x 430 x 17 / 300)
  tracedWaist: 241.3, // row 7: per part, and step 4's own 482.6 halved
  waistReduction: 132.6, // row 8: WR = 2 x 241.3 - 350
  sideRemoval: 33.12, // row 9: per part (WR/4)
  dartIntake: 22.1, // rows 10-11: each back dart and the front dart (WR/6)
  yokeLine: 150, // row 13: dart tip depth
  backDartGuide1: 80, // row 14
  backDartGuide2: 145, // row 14
}

describe('Skirtblock numeric oracle (book worked example)', () => {
  const pattern = new Skirtblock({ measurements })
  pattern.draft()

  it('drafts without errors', () => {
    expect(pattern.setStores[0].logs.error.length).to.equal(0)
  })

  const parts = pattern.parts[0]
  const back = () => parts['skirtblock.back'].points
  const front = () => parts['skirtblock.front'].points

  describe('back part', () => {
    it('waist-to-hip depth on CB matches the book', () => {
      expect(Math.abs(back().cbWaist.dist(back().cbSeat) - expected.depth)).to.be.at.most(TOL)
    })
    it('CB length matches the book', () => {
      expect(Math.abs(back().cbWaist.dist(back().cbHem) - expected.length)).to.be.at.most(TOL)
    })
    it('hip width matches the book', () => {
      expect(Math.abs(back().cbSeat.dist(back().sideSeat) - expected.hipWidth)).to.be.at.most(TOL)
    })
    it('rotated side-waist corner matches the strip geometry', () => {
      expect(Math.abs(back().sideWaistRaw.x - expected.sideWaistRaw.x)).to.be.at.most(TOL)
      expect(Math.abs(back().sideWaistRaw.y - expected.sideWaistRaw.y)).to.be.at.most(TOL)
    })
    it('side knee point matches the strip geometry (17mm gap)', () => {
      expect(Math.abs(back().sideKnee.x - expected.sideKnee.x)).to.be.at.most(TOL)
      expect(Math.abs(back().sideKnee.y - expected.sideKnee.y)).to.be.at.most(TOL)
    })
    it('side hem point matches the strip geometry', () => {
      expect(Math.abs(back().sideHem.x - expected.sideHem.x)).to.be.at.most(TOL)
      expect(Math.abs(back().sideHem.y - expected.sideHem.y)).to.be.at.most(TOL)
    })
    it('side-seam waist removal matches the book (WR/4)', () => {
      expect(
        Math.abs(back().sideWaistRaw.dist(back().sideWaist) - expected.sideRemoval)
      ).to.be.at.most(TOL)
    })
    it('both back dart intakes match the book', () => {
      expect(
        Math.abs(back().dart1Left.dist(back().dart1Right) - expected.dartIntake)
      ).to.be.at.most(TOL)
      expect(
        Math.abs(back().dart2Left.dist(back().dart2Right) - expected.dartIntake)
      ).to.be.at.most(TOL)
    })
    it('back dart tips sit on the yoke line at the guide positions', () => {
      expect(Math.abs(back().dart1Tip.y - expected.yokeLine)).to.be.at.most(TOL)
      expect(Math.abs(back().dart2Tip.y - expected.yokeLine)).to.be.at.most(TOL)
      expect(Math.abs(back().dart1Tip.x - expected.backDartGuide1)).to.be.at.most(TOL)
      expect(Math.abs(back().dart2Tip.x - expected.backDartGuide2)).to.be.at.most(TOL)
    })
  })

  describe('front part', () => {
    it('waist-to-hip depth on CF matches the book', () => {
      expect(Math.abs(front().cfWaist.dist(front().cfSeat) - expected.depth)).to.be.at.most(TOL)
    })
    it('CF length matches the book', () => {
      expect(Math.abs(front().cfWaist.dist(front().cfHem) - expected.length)).to.be.at.most(TOL)
    })
    it('hip width matches the book', () => {
      expect(Math.abs(front().cfSeat.dist(front().sideSeat) - expected.hipWidth)).to.be.at.most(TOL)
    })
    it('outline is congruent with the back (side hem)', () => {
      expect(Math.abs(front().sideHem.x - expected.sideHem.x)).to.be.at.most(TOL)
      expect(Math.abs(front().sideHem.y - expected.sideHem.y)).to.be.at.most(TOL)
    })
    it('side-seam waist removal matches the book (WR/4)', () => {
      expect(
        Math.abs(front().sideWaistRaw.dist(front().sideWaist) - expected.sideRemoval)
      ).to.be.at.most(TOL)
    })
    it('front dart intake matches the book', () => {
      expect(
        Math.abs(front().dart1Left.dist(front().dart1Right) - expected.dartIntake)
      ).to.be.at.most(TOL)
    })
    it('front dart tip sits on the yoke line at 2/3 of side-waist x', () => {
      expect(Math.abs(front().dart1Tip.y - expected.yokeLine)).to.be.at.most(TOL)
      expect(Math.abs(front().dart1Tip.x - (front().sideWaist.x * 2) / 3)).to.be.at.most(TOL)
    })
  })

  /*
   * The half pattern the two parts are folded out of. These are the rows the spec derives
   * in step 4, and they are what the per-part geometry above has to add back up to.
   */
  describe('half pattern', () => {
    it('row 15: the knee measures 571mm across both parts', () => {
      expect(
        Math.abs(back().sideKnee.x + front().sideKnee.x - expected.kneeHalfWidth)
      ).to.be.at.most(TOL)
    })
    it('row 16: the hem measures 593.1mm across both parts', () => {
      const hem = (points, c) =>
        new Path()
          .move(points[`${c}Hem`])
          .curve(points.hemCp2, points.hemCp1, points.sideHem)
          .length()
      expect(
        Math.abs(hem(back(), 'cb') + hem(front(), 'cf') - expected.hemHalfWidth)
      ).to.be.at.most(TOL)
    })
    it('row 7: the traced waist edge is 241.3mm per part', () => {
      const traced = back().waistCross.x + back().waistCross.dist(back().sideWaistRaw)
      expect(Math.abs(traced - expected.tracedWaist)).to.be.at.most(TOL)
    })
    it('row 8: which leaves 132.6mm of waist reduction', () => {
      const traced = back().waistCross.x + back().waistCross.dist(back().sideWaistRaw)
      expect(Math.abs(2 * traced - measurements.waist / 2 - expected.waistReduction)).to.be.at.most(
        TOL
      )
    })
  })

  describe('fit sanity (smoothing latitude ±6mm, see skirtblock.md model note)', () => {
    it('net waist of both parts sums to waist/2', () => {
      const backNet =
        back().cbWaist.dist(back().sideWaist) -
        back().dart1Left.dist(back().dart1Right) -
        back().dart2Left.dist(back().dart2Right)
      const frontNet =
        front().cfWaist.dist(front().sideWaist) - front().dart1Left.dist(front().dart1Right)
      expect(Math.abs(backNet + frontNet - 350)).to.be.at.most(6)
    })
  })
})
