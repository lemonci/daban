import { expect } from 'chai'
import { SkirtBlock } from '../src/index.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/skirtblock.md §Worked example (英国经典服装纸样设计基础篇, pp.145-150)
 * Book values: hip 98cm, waist 70cm, waist-to-hip 22cm, knee 52cm, length 65cm.
 * All values mm. Tolerance ±2mm (spec success criterion #2).
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
  sideWaistRaw: { x: 247.3, y: -7.0 }, // rotated side-waist corner (row 6/7 geometry)
  sideKnee: { x: 276.8, y: 512.2 }, // row 15 geometry (gap 17 at knee line)
  sideHem: { x: 284.1, y: 642.0 }, // row 16 geometry
  sideRemoval: 36.27, // row 9: per part (WR/4, procedural WR = 145.1)
  dartIntake: 24.18, // rows 10-11: each back dart and the front dart (WR/6)
  yokeLine: 150, // row 13: dart tip depth
  backDartGuide1: 80, // row 14
  backDartGuide2: 145, // row 14
}

describe('SkirtBlock numeric oracle (book worked example)', () => {
  const pattern = new SkirtBlock({ measurements })
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
