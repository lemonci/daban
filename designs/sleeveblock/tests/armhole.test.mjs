import { expect } from 'chai'
import { Sleeveblock } from '../src/index.mjs'
import { Bodiceblock } from '../../bodiceblock/src/index.mjs'

/*
 * The cross-design closure check of docs/patterns/sleeveblock.md, "Armhole dependency".
 *
 * The book never drafts the sleeve from the armhole -- it drafts both from the same
 * `biceps`-linked targets and then measures one against the other (p.95, p.99). This test
 * does the same: it drafts the bodice block and the sleeve block at the book's worked
 * measurements and checks that the cap arc comes out 2 to 2.5cm longer than the bodice's
 * total armhole, which is the sleevecap ease the book asks for.
 *
 * The import of the bodice is test-only and deliberate. Neither design reads the other at
 * draft time, and this file is the only place they meet.
 */

const sleeveMeasurements = {
  biceps: 300,
  shoulderToWrist: 600,
  shoulderToElbow: 320,
}

/*
 * The bodice's own worked size, from docs/patterns/bodiceblock.md. `shoulderToShoulder`
 * is the synthetic value that reproduces the book's shoulder length; see the note at the
 * top of designs/bodiceblock/tests/oracle.test.mjs.
 */
const bodiceMeasurements = {
  biceps: 300,
  chest: 920,
  seat: 980,
  waist: 700,
  hpsToWaistBack: 400,
  waistToSeat: 220,
  shoulderToShoulder: 390,
}

describe('Sleeveblock cap against the Bodiceblock armhole', () => {
  const sleeve = new Sleeveblock({ measurements: sleeveMeasurements })
  sleeve.draft()
  const cap = sleeve.parts[0]['sleeveblock.sleeve'].paths.cap.length()

  const bodice = new Bodiceblock({ measurements: bodiceMeasurements })
  bodice.draft()
  const store = bodice.setStores[0]
  const armhole =
    store.get('library.sleeve.backArmholeLength') + store.get('library.sleeve.frontArmholeLength')

  const ease = cap - armhole

  it('both designs draft without errors', () => {
    expect(sleeve.setStores[0].logs.error.length).to.equal(0)
    expect(store.logs.error.length).to.equal(0)
  })

  it('row 18: the bodice total armhole is 420-430mm at biceps 300', () => {
    expect(armhole).to.be.at.least(420)
    expect(armhole).to.be.at.most(430)
  })

  it('row 19: the cap arc is 445-455mm', () => {
    expect(cap).to.be.at.least(445)
    expect(cap).to.be.at.most(455)
  })

  /*
   * p.99: "袖山弧线长度应比衣身袖窿弧线略长(平均长2~2.5cm)". The two designs reach this
   * band independently -- the bodice by calibrating its armhole to biceps + 12.5cm, the
   * sleeve by drawing the cap off the sleeve root -- so this assertion is a genuine
   * closure check on both geometries at once, not a tautology. Measured at 22.7mm.
   */
  it('leaves 20-25mm of sleevecap ease, the band the book asks for', () => {
    expect(ease).to.be.at.least(20)
    expect(ease).to.be.at.most(25)
  })
})
