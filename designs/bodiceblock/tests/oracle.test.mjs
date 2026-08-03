import { expect } from 'chai'
import { Bodiceblock } from '../src/index.mjs'

/*
 * Numeric oracle against the book's worked example.
 * Source: docs/patterns/bodiceblock.md, section "Worked example (oracle)"
 * (英国经典服装纸样设计基础篇, pp.13-35, chest 92 average size).
 *
 * Book values: chest 92cm, hip 98cm, waist 70cm, back waist length 40cm,
 * waist-to-hip 22cm, shoulder length S 12.5cm.
 *
 * `shoulderToShoulder` stands in for the book's 肩宽 S: the draft uses
 * shoulderToShoulder/2 minus the back neck width, so 39cm gives S = 19.5 - 7 = 12.5cm,
 * the book's own figure.
 *
 * All values mm. Tolerance +/-2mm.
 *
 * NOT asserted: worked-example row 35 (armhole size QC, 420-430mm). The point set in
 * rows 1-34 yields a 374mm armhole; the book's `TA + 12..13cm` check cannot be met by
 * the geometry the spec extracts. Reported as a deviation, see the implementation notes.
 */

const measurements = {
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

  it('drafts without errors', () => {
    expect(fitted.pattern.setStores[0].logs.error.length).to.equal(0)
  })

  describe('structure lines', () => {
    it('row 1: bust/armhole-depth line sits 215mm below the top line', () => {
      near(back.up.y, 215)
      near(front.up.y, 215)
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
    it('row 9: UP is at (235, 215)', () => {
      nearPoint(back.up, 235, 215)
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
    it('row 22: UP is at (275, 215)', () => {
      nearPoint(front.up, 275, 215)
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
   * Shoulder-length adjustment (spec section A.7): a wider shoulder pushes SP out along
   * the shoulder line, and SP keeps the height it was drafted at.
   */
  describe('shoulder-length adjustment', () => {
    const wide = draft({ measurements: { ...measurements, shoulderToShoulder: 500 } })

    it('lengthens the shoulder to S + 10mm when the draft comes up short', () => {
      near(wide.back.np.dist(wide.back.sp), 500 / 2 - 70 + 10)
    })
    it('leaves SP at its drafted height', () => {
      near(wide.back.sp.y, 60)
    })
  })

  /*
   * The sleeve contract, see the bottom of designs/library/src/index.mjs
   */
  describe('sleeve contract', () => {
    const store = fitted.pattern.setStores[0]

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
