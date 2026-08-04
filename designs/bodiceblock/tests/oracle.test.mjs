import { expect } from 'chai'
import { Path, Point, beamIntersectsX } from '@freesewing/core'
import { cisFemaleAdult34 } from '@freesewing/models'
import { Bodiceblock } from '../src/index.mjs'
import {
  structure,
  frontArmholeRegion,
  armholePath,
  ARMHOLE_EASE_MIN,
  ARMHOLE_EASE_MAX,
} from '../src/shared.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/bodiceblock.md, section "Worked example (oracle)"
 * (英国经典服装纸样设计基础篇, pp.13-35, chest 92 average size).
 *
 * Book values: chest 92cm, hip 98cm, waist 70cm, back waist length 40cm,
 * waist-to-hip 22cm, shoulder length S 12.5cm, upper arm TA 30cm.
 *
 * `shoulderToShoulder` stands in for the book's 肩宽 S: the draft uses
 * shoulderToShoulder/2 minus the back neck width, so 39cm gives S = 19.5 - 7 = 12.5cm,
 * the book's own figure. Note that 39cm is a synthetic value, back-solved to reproduce
 * the book's S -- it is not a FreeSewing measurement. The stock model nearest this
 * chest carries 41.5cm, which gives S = 13.7cm. See ambiguity 14 in
 * docs/patterns/bodiceblock.md, and the real-model case at the bottom of this file.
 *
 * Section D.0's remedy 2 is not a knob -- widening the bridge means re-allocating chest
 * ease or width, which only the wearer can grant -- so the worked example exercises
 * remedy 3 alone, exactly as the book does.
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
  shoulderToShoulder: 390,
}

const TOL = 2 // mm

const near = (actual, expected) => expect(Math.abs(actual - expected)).to.be.at.most(TOL)
const nearPoint = (point, x, y) => {
  near(point.x, x)
  near(point.y, y)
}

const draft = (settings = {}) => {
  const pattern = new Bodiceblock({ measurements, ...settings })
  pattern.draft()

  return {
    pattern,
    back: pattern.parts[0]['bodiceblock.back'].points,
    front: pattern.parts[0]['bodiceblock.front'].points,
  }
}

describe('Bodiceblock numeric oracle (book worked example)', () => {
  const fitted = draft()
  const plain = draft({ options: { waistFit: false } })
  const back = fitted.back
  const front = fitted.front
  const store = fitted.pattern.setStores[0]
  // Section D.0 drops UP below the bust line; rows 1, 9 and 22 are pre-calibration
  const upDrop = store.get('bodiceblock.upDrop')

  it('drafts without errors', () => {
    expect(store.logs.error.length).to.equal(0)
  })

  describe('structure lines', () => {
    it('row 1: bust/armhole-depth line sits 215mm below the top line', () => {
      near(back.up.y - upDrop, 215)
      near(front.up.y - upDrop, 215)
    })
    it('row 2: waist line sits 400mm below the top line', () => {
      near(back.sideWaist.y, 400)
      near(front.sideWaist.y, 400)
    })
    it('row 3: hip line sits 620mm below the top line', () => {
      near(back.hp.y, 620)
      near(front.hp.y, 620)
    })
    it('row 4: back O sits 30mm below the top line', () => {
      near(back.o.y, 30)
    })
    it('row 5: back-width line sits 110mm below the top line', () => {
      near(back.armholePitch.y, 110)
    })
    it('row 5a: back shoulder line sits 60mm below the top line', () => {
      near(back.sp.y, 60)
    })
    it('row 5b: back shoulder seam is 139.3mm long at a 21.0 degree slope', () => {
      near(back.np.dist(back.sp), 139.3)
      expect(Math.abs(360 - back.np.angle(back.sp) - 21.0)).to.be.at.most(0.5)
    })
    it('row 6: neck width is 70mm on both panels', () => {
      near(back.np.x, 70)
      near(front.np.x, 70)
    })
    it('row 13: front O sits level with the top line', () => {
      near(front.o.y, 0)
    })
    it('row 14: front shoulder guide line sits 45mm below the top line', () => {
      near(front.shoulderGuide.y, 45)
    })
    it('row 15: front neck-depth line sits 75mm below the top line', () => {
      near(front.cfNeck.y, 75)
    })
    it('row 16: chest-width line sits 175mm below the top line', () => {
      near(front.chestWidthPoint.y, 175)
    })
  })

  describe('back panel', () => {
    it('row 7: NP is at (70, 10)', () => {
      nearPoint(back.np, 70, 10)
    })
    it('row 8: the back-width point is 180mm from the center back', () => {
      near(back.armholePitch.x, 180)
    })
    it('row 9: UP is at (235, 215) before calibration', () => {
      near(back.up.x, 235)
      near(back.up.y - upDrop, 215)
    })
    it('row 10: SP is at (200, 60)', () => {
      nearPoint(back.sp, 200, 60)
    })
    it('row 11: HP is at (245, 620)', () => {
      nearPoint(back.hp, 245, 620)
    })
    it('row 12: the plain block takes the side seam in to 219.6mm at the waist', () => {
      near(plain.back.sideWaist.x, 219.6)
    })
  })

  describe('front panel', () => {
    it('row 17: the chest-width point is 190mm from the center front', () => {
      near(front.chestWidthPoint.x, 190)
    })
    it('row 18: the bust-dart apex is at (95, 235)', () => {
      nearPoint(front.bustApex, 95, 235)
    })
    it('row 19: the bust dart is 75mm wide on the shoulder', () => {
      near(front.dartInner.dist(front.dartOuter), 75)
    })
    it('row 20: SP sits 200mm from NP along the shoulder ray', () => {
      near(front.np.dist(front.sp), 200)
    })
    it('row 21: CHP is 210mm from the center front', () => {
      near(front.armholePitch.x, 210)
    })
    it('row 22: UP is at (275, 215) before calibration', () => {
      near(front.up.x, 275)
      near(front.up.y - upDrop, 215)
    })
    it('row 23: HP is at (275, 620)', () => {
      nearPoint(front.hp, 275, 620)
    })
    it('row 24: the plain block takes the side seam in to 260.0mm at the waist', () => {
      near(plain.front.sideWaist.x, 260)
    })
  })

  describe('waist shaping', () => {
    const natural = plain.back.sideWaist.x + plain.front.sideWaist.x
    const backSideExtra = plain.back.sideWaist.x - back.sideWaist.x
    const frontSideExtra = plain.front.sideWaist.x - front.sideWaist.x
    const backDart = back.dartRight.x - back.dartLeft.x
    const frontDart = front.dartRight.x - front.dartLeft.x

    it('row 25: the target half-pattern waist is 370mm', () => {
      near(measurements.waist / 2 + measurements.waist * 0.0286, 370)
    })
    it('row 26: the plain block gives a 479.6mm half-pattern waist', () => {
      near(natural, 479.6)
    })
    it('row 27: 110mm has to come out of the waist', () => {
      near(natural - 370, 110)
    })
    it('row 28: the back takes 50mm of that and the front 60mm', () => {
      near(back.cbWaist.x + backSideExtra + backDart, 50)
      near(front.cfWaist.x + frontSideExtra + frontDart, 60)
    })
    it('row 29: the back spends it as 20mm center slant, 10mm side, 20mm dart', () => {
      near(back.cbWaist.x, 20)
      near(backSideExtra, 10)
      near(backDart, 20)
    })
    it('row 30: the front spends it as 10mm center slant, 10mm side, 40mm dart', () => {
      near(front.cfWaist.x, 10)
      near(frontSideExtra, 10)
      near(frontDart, 40)
    })
    it('row 31: the back dart is centered 90mm from the center back, legs at 80 and 100', () => {
      near(back.dartTop.x, 90)
      near(back.dartLeft.x, 80)
      near(back.dartRight.x, 100)
    })
    it('row 32: the front dart is centered 95mm from the center front, legs at 75 and 115', () => {
      near(front.dartTop.x, 95)
      near(front.dartLeft.x, 75)
      near(front.dartRight.x, 115)
    })
    it('row 33: the back side seam ends up 209.6mm from the center back at the waist', () => {
      near(back.sideWaist.x, 209.6)
    })
    it('row 34: the front side seam ends up 250.0mm from the center front at the waist', () => {
      near(front.sideWaist.x, 250)
    })
  })

  /*
   * The book's own balance and shoulder-closure checks (spec section D)
   */
  describe('book quality checks', () => {
    it('the front neck point sits 10mm above the back neck point', () => {
      near(back.np.y - front.np.y, 10)
    })
    it('the back shoulder carries 14.3mm more than the closed front shoulder', () => {
      near(back.np.dist(back.sp) - (front.np.dist(front.sp) - 75), 14.3)
    })
    it('the shoulder-length check does not fire at the worked size', () => {
      // drafted 139.3mm against a minimum of S + 10 = 135mm
      nearPoint(back.sp, 200, 60)
    })
  })

  /*
   * Shoulder-length adjustment (spec section A.7, ambiguity 14): a short drafted
   * shoulder is pushed out along the shoulder line to the middle of the book's ideal
   * band, not onto its floor, and SP keeps the height it was drafted at.
   */
  describe('shoulder-length adjustment', () => {
    const wide = draft({ measurements: { ...measurements, shoulderToShoulder: 500 } })

    it('lengthens the shoulder to S + 17.5mm when the draft comes up short', () => {
      near(wide.back.np.dist(wide.back.sp), 500 / 2 - 70 + 17.5)
    })
    it('leaves SP at its drafted height', () => {
      near(wide.back.sp.y, 60)
    })
  })

  /*
   * Ambiguity 14: on real stock models the `shoulderToShoulder` proxy over-reads the
   * book's S, so the adjustment above is the normal case rather than the exception.
   * Pinned here so the divergence shows up in CI, not only in the spec.
   */
  describe('real stock model (cisFemaleAdult34)', () => {
    const model = { ...cisFemaleAdult34 }
    const pattern = new Bodiceblock({ measurements: model })
    pattern.draft()
    const stock = pattern.parts[0]['bodiceblock.back'].points
    const neckWidth = model.chest / 16 + 12.5
    const S = model.shoulderToShoulder / 2 - neckWidth

    it('over-reads the book S of 125mm', () => {
      expect(S).to.be.above(133)
      expect(S).to.be.below(142)
    })
    it('fires the shoulder check and lands on the ideal 17.5mm surplus', () => {
      const drafted = Math.sqrt(((model.chest * 0.3913) / 2 + 20 - neckWidth) ** 2 + (60 - 10) ** 2)
      expect(drafted).to.be.below(S + 10)
      near(stock.np.dist(stock.sp) - S, 17.5)
    })
    it('says so in the log rather than failing', () => {
      const store = pattern.setStores[0]
      expect(store.logs.error.length).to.equal(0)
      // the calibration note names `backWidthPct` too, so match on the shoulder note itself
      expect(
        store.logs.info.filter((l) => `${l}`.includes('shoulder seam drafted from backWidthPct'))
          .length
      ).to.equal(1)
    })
  })

  /*
   * Section D.0 armhole calibration. Row 35 is the book's own check, now satisfied by
   * construction. Rows 36 and 37 are bracket assertions on the measured consequence of
   * the section A and B geometry -- row 36 in particular is what tells a working
   * solver apart from a solver quietly papering over a geometry bug, so it has to fail
   * loudly if anyone changes a point.
   */
  describe('armhole calibration', () => {
    it('row 35: the calibrated armhole measures biceps + 125mm', () => {
      const drafted =
        store.get('library.sleeve.backArmholeLength') +
        store.get('library.sleeve.frontArmholeLength')
      expect(Math.abs(drafted - (measurements.biceps + 125))).to.be.at.most(1)
      expect(Math.abs(store.get('bodiceblock.armholeCalibrated') - drafted)).to.be.at.most(0.001)
    })
    it('lands inside the accepted band of biceps + 100 to 130mm (p.29)', () => {
      const drafted = store.get('bodiceblock.armholeCalibrated')
      expect(drafted).to.be.at.least(measurements.biceps + ARMHOLE_EASE_MIN)
      expect(drafted).to.be.at.most(measurements.biceps + ARMHOLE_EASE_MAX)
    })
    it('reports the cascade once, and names who can widen the bridge', () => {
      const notes = store.logs.info.filter((l) => `${l}`.includes("Bray's three remedies"))
      expect(notes.length).to.equal(1)
      // the book's own bridge at this size: 510 - 180 - 190 (spec section D.0)
      expect(`${notes[0]}`).to.include('[2] widen the armhole bridge, 140mm here')
      for (const option of ['chestEase', 'backWidthPct', 'chestWidthPct'])
        expect(`${notes[0]}`).to.include(option)
      expect(`${notes[0]}`).to.not.include('spends chest ease')
      expect(`${notes[0]}`).to.include(`[3] lower UP, +${Math.round(425 - 375)}mm`)
    })
    it('still names remedy 1, which only the wearer can apply', () => {
      // the block cannot detect posture, but a wearer who knows they are square can act
      const note = store.logs.info.filter((l) => `${l}`.includes("Bray's three remedies"))[0]
      expect(`${note}`).to.include('[1] raise SP')
      expect(`${note}`).to.include('square-shouldered')
    })
    it('accounts for the whole gain across the remedies', () => {
      const base = store.get('bodiceblock.armholeUncalibrated')
      const calibrated = store.get('bodiceblock.armholeCalibrated')
      // remedies 1 and 2 are the wearer's, so 3 does all of it
      expect(calibrated - base).to.be.above(40)
    })
    it('row 36: the uncalibrated armhole is 375-385mm, the shortfall the loop closes', () => {
      const uncalibrated = store.get('bodiceblock.armholeUncalibrated')
      expect(uncalibrated).to.be.at.least(375)
      expect(uncalibrated).to.be.at.most(385)
    })
    it('row 37: the solved underarm drop is 20-30mm', () => {
      expect(upDrop).to.be.at.least(20)
      expect(upDrop).to.be.at.most(30)
    })
    it('the calibration leaves the bust girth and chest ease alone', () => {
      // UP's x is never touched, so half the finished bust is still chest + ease over 2
      near(back.up.x + front.up.x, (measurements.chest * (1 + 0.1087)) / 2)
      near(back.up.x, 235)
      near(front.up.x, 275)
    })
    it('both panels drop UP by the same amount', () => {
      expect(Math.abs(back.up.y - front.up.y)).to.be.at.most(0.001)
    })
    it('the front armhole digs below the bust line before UP, uncalibrated', () => {
      const sh = {
        Point,
        Path,
        utils: { beamIntersectsX },
        measurements,
        options: fitted.pattern.settings[0].options,
      }
      const st = structure(sh)
      const region = frontArmholeRegion(sh, st, 0)
      const path = armholePath(region, Path)
      let deepest = -Infinity
      for (let i = 0; i <= 100; i++) {
        const at = path.shiftFractionAlong(i / 100)
        if (at.x > region.armholeHollow.x && at.y > deepest) deepest = at.y
      }
      expect(deepest).to.be.above(st.yBust + 1)
      // and it still arrives at UP tangent to the bust line
      expect(region.upCp.y).to.equal(region.up.y)
    })
  })

  /*
   * The sleeve contract, see the bottom of designs/library/src/index.mjs
   */
  describe('sleeve contract', () => {
    it('stores measured armhole lengths for every library sleeve', () => {
      for (const type of ['sleeve', 'twoPartSleeve', 'topsleeve', 'undersleeve']) {
        for (const side of ['back', 'front']) {
          expect(store.get(`library.${type}.${side}ArmholeLength`)).to.be.a('number')
          expect(store.get(`library.${type}.${side}ArmholeToArmholePitch`)).to.be.a('number')
        }
      }
    })
    it('measures the armhole up to the pitch point as part of the whole armhole', () => {
      for (const side of ['back', 'front']) {
        const whole = store.get(`library.sleeve.${side}ArmholeLength`)
        const toPitch = store.get(`library.sleeve.${side}ArmholeToArmholePitch`)
        expect(toPitch).to.be.above(0)
        expect(toPitch).to.be.below(whole)
      }
    })
  })
})
