import { expect } from 'chai'
import { Path, Point, beamIntersectsX } from '@freesewing/core'
import {
  blockOptions,
  structure,
  graded,
  BUST,
  BACK_UP_ADDEND,
  O_POINT,
  BACK_WIDTH_PCT,
  CHEST_WIDTH_PCT,
  BUST_DART_PCT,
} from '../src/shared.mjs'

/*
 * 表1-2 主要控制尺寸及比例表, printed p.12 (英国经典服装纸样设计基础篇), the grading table
 * for the whole volume. It is transcribed HERE, from `docs/patterns/bray-size-table.md`,
 * rather than imported from the design, so that a wrong column in `shared.mjs` fails this
 * test instead of agreeing with it. All lengths mm.
 *
 * Row IV (chest 92) is the block's own worked size, so the design must reproduce that row
 * exactly -- the numeric oracle depends on grading being a no-op there.
 */
const TABLE = {
  bust: /*         */ [800, 840, 880, 920, 960, 1000, 1040, 1080, 1120, 1160],
  backUpAddend: /* */ [50, 50, 50, 55, 60, 60, 65, 70, 70, 70], // 后窿门宽
  oPoint: /*       */ [20, 25, 30, 30, 35, 35, 40, 40, 45, 45], // O点
  backWidth: /*    */ [330, 340, 350, 360, 370, 380, 390, 400, 410, 420], // 后背宽 XB
  chestWidth: /*   */ [350, 360, 370, 380, 390, 400, 420, 430, 445, 460], // 胸宽 CH
  bustDart: /*     */ [60, 65, 70, 75, 80, 85, 90, 95, 100, 105], // 省道
  neckWidth: /*    */ [65, 65, 70, 70, 75, 75, 80, 80, 85, 85], // 后领宽, nominal
  bustDepth: /*    */ [205, 205, 210, 215, 220, 225, 230, 235, 240, 245], // 袖窿深
}

/*
 * The book writes `−` after a figure to mean "a little under". 后领宽 carries it on rows
 * I, III, V, VII and IX and on no others.
 */
const NECK_UNDER = [true, false, true, false, true, false, true, false, true, false]

const near = (actual, expected, tol = 1e-9) =>
  expect(Math.abs(actual - expected)).to.be.at.most(tol)

const options = Object.fromEntries(
  Object.entries(blockOptions).map(([k, o]) => [k, o.bool === undefined ? o.pct / 100 : o.bool])
)
const draft = (chest) =>
  structure({
    Point,
    Path,
    utils: { beamIntersectsX },
    options,
    measurements: {
      chest,
      seat: chest + 60,
      waist: chest - 220,
      hpsToWaistBack: 400,
      waistToSeat: 220,
      shoulderToShoulder: 400,
    },
  })

describe('Bodiceblock grading against Table 1-2', () => {
  it('agrees with the table on its own bust column', () => {
    expect(BUST).to.deep.equal(TABLE.bust)
  })

  describe('reproduces every tabulated size exactly', () => {
    const columns = [
      ['后窿门宽', BACK_UP_ADDEND, TABLE.backUpAddend, 1],
      ['O点', O_POINT, TABLE.oPoint, 1],
      ['后背宽 XB', BACK_WIDTH_PCT, TABLE.backWidth, 0],
      ['胸宽 CH', CHEST_WIDTH_PCT, TABLE.chestWidth, 0],
      ['省道', BUST_DART_PCT, TABLE.bustDart, 0],
    ]
    // the three width columns are carried as fractions of the bust, so scale them back up
    for (const [name, column, expected, isMm] of columns)
      it(`${name}`, () => {
        for (let i = 0; i < TABLE.bust.length; i++)
          near(graded(TABLE.bust[i], column) * (isMm ? 1 : TABLE.bust[i]), expected[i], 1e-9)
      })
  })

  describe('interpolates linearly between rows', () => {
    it('后窿门宽 halfway from row IV to row V is 57.5mm', () => {
      // 55 at chest 920, 60 at chest 960
      near(graded(940, BACK_UP_ADDEND), 57.5)
    })
    it('O点 a quarter of the way from row II to row III is 26.25mm', () => {
      // 25 at chest 840, 30 at chest 880
      near(graded(850, O_POINT), 26.25)
    })
    it('XB halfway from row VI to row VII is 38.5cm worth of fraction', () => {
      // 380/1000 and 390/1040; the fractions, not the millimetres, are what is interpolated
      near(graded(1020, BACK_WIDTH_PCT), (380 / 1000 + 390 / 1040) / 2)
    })
  })

  describe('clamps to the end rows outside the table', () => {
    it('holds row I below chest 80cm', () => {
      near(graded(600, BACK_UP_ADDEND), TABLE.backUpAddend[0])
      near(graded(799, O_POINT), TABLE.oPoint[0])
      near(graded(600, BACK_WIDTH_PCT), TABLE.backWidth[0] / TABLE.bust[0])
    })
    it('holds row X above chest 116cm', () => {
      near(graded(1400, BACK_UP_ADDEND), TABLE.backUpAddend[9])
      near(graded(1161, O_POINT), TABLE.oPoint[9])
      near(graded(1400, CHEST_WIDTH_PCT), TABLE.chestWidth[9] / TABLE.bust[9])
    })
    it('clamps the width columns as proportions, not as millimetres', () => {
      // a chest-132 body must not be handed chest-116's 42cm back width
      near(draft(1316).backWidth, 1316 * (TABLE.backWidth[9] / TABLE.bust[9]), 1e-9)
      expect(draft(1316).backWidth).to.be.above(TABLE.backWidth[9])
    })
  })

  /*
   * Where each graded column lands in the draft, checked at the smallest adult stock chest
   * (cisFemale 28, 762mm -- below the table, so clamped), the book's worked size (920mm,
   * row IV) and the largest (cisMale 50, 1316mm -- above the table, so clamped).
   */
  describe('lands in the draft', () => {
    const sizes = [762, 920, 1316]
    const at = (chest, column, mm) =>
      chest <= 800
        ? mm
          ? column[0]
          : (column[0] / TABLE.bust[0]) * chest
        : chest >= 1160
          ? mm
            ? column[9]
            : (column[9] / TABLE.bust[9]) * chest
          : null

    it('后窿门宽 is the back UP addend', () => {
      for (const chest of sizes) {
        const st = draft(chest)
        near(st.backUpX - st.backWidth / 2, at(chest, TABLE.backUpAddend, true) ?? 55)
      }
    })
    it('O点 is the back O depth', () => {
      for (const chest of sizes) near(draft(chest).yOBack, at(chest, TABLE.oPoint, true) ?? 30)
    })
    it('XB is the back width', () => {
      for (const chest of sizes) near(draft(chest).backWidth, at(chest, TABLE.backWidth) ?? 360)
    })
    it('CH is the chest width', () => {
      for (const chest of sizes) near(draft(chest).chestWidth, at(chest, TABLE.chestWidth) ?? 380)
    })
    it('省道 is the bust dart width', () => {
      for (const chest of sizes) near(draft(chest).dartWidth, at(chest, TABLE.bustDart) ?? 75)
    })
  })

  /*
   * The corroboration this work rests on: at row IV the table's figures ARE the numbers the
   * block was already pinned at, so grading changes nothing at the worked size.
   */
  it('row IV is the block worked size, unchanged', () => {
    const st = draft(920)
    near(st.backUpX - st.backWidth / 2, 55)
    near(st.yOBack, 30)
    near(st.backWidth, 360)
    near(st.chestWidth, 380)
    near(st.dartWidth, 75)
    near(st.neckWidth, 70)
    near(st.yBust, 215)
  })

  /*
   * Two columns are deliberately NOT read off the table: the formulas already in
   * `structure()` reproduce it, and reproduce more of it than the nominal column carries.
   */
  describe('the two columns that stay on their formulas', () => {
    it('后领宽: chest/16 + 12.5 hits all ten rows, and hits the `−` rows 2.5mm under', () => {
      for (let i = 0; i < TABLE.bust.length; i++)
        near(draft(TABLE.bust[i]).neckWidth, TABLE.neckWidth[i] - (NECK_UNDER[i] ? 2.5 : 0), 1e-9)
    })
    it('袖窿深: the formula is exact on rows II to X', () => {
      for (let i = 1; i < TABLE.bust.length; i++)
        near(draft(TABLE.bust[i]).yBust, TABLE.bustDepth[i])
    })
    it('袖窿深: and runs 5mm under on row I alone, where the table flattens', () => {
      near(draft(TABLE.bust[0]).yBust, TABLE.bustDepth[0] - 5)
    })
  })

  /*
   * The option ranges are departures from the grade, and their widths are the table's own:
   * XB prints a pair 1cm apart in every row, and 省道 steps 5mm per size.
   */
  describe('option bands are the table increments at the worked size', () => {
    // the bounds are published to two decimals, so they land within 0.05mm of the increment
    const spans = (key, mm) => {
      const o = blockOptions[key]
      near((o.max - o.pct) * 9.2, mm, 0.05)
      near((o.pct - o.min) * 9.2, mm, 0.05)
    }
    it('backWidthPct spans the 10mm the XB column prints as its own within-size pair', () => {
      spans('backWidthPct', 10)
    })
    it('chestWidthPct spans the same 10mm', () => {
      spans('chestWidthPct', 10)
    })
    it('bustDartWidth spans one 省道 grading step, 5mm', () => {
      spans('bustDartWidth', 5)
    })
    it('leaves the draft on the table when every option is at its default', () => {
      for (const chest of [800, 920, 1160]) {
        const i = TABLE.bust.indexOf(chest)
        near(draft(chest).backWidth, TABLE.backWidth[i], 1e-9)
        near(draft(chest).chestWidth, TABLE.chestWidth[i], 1e-9)
        near(draft(chest).dartWidth, TABLE.bustDart[i], 1e-9)
      }
    })
  })
})
