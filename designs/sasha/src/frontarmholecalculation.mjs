import { frontPoints } from '@freesewing/noble'
import { frontOutside } from './frontoutside.mjs'
import { pctBasedOn } from '@freesewing/core'

function calculate({ paths, store, measurements, options, units, part }) {
  // NOTE: this part does not draw anything but calculates the length of the front armhole
  // and warns in case the cuff is expected to be too small

  store.set(
    'library.sleeve.frontArmholeLength',
    paths.armholeInside.length() + paths.armholeOutside.length()
  )
  // 'frontArmholeToArmholePitch' determines notch placement
  store.set('library.sleeve.frontArmholeToArmholePitch', paths.armholeInside.length())

  store.set('library.sleeve.title', { nr: 5 })

  // predict ease at the cuff

  if (options.sleeveLengthBonus < 0) {
    // linear model: upper half of the arm has biceps circumference,
    // lower half linearly increases between wrist and biceps
    const circAtCuff =
      options.sleeveLengthBonus < -0.5
        ? measurements.biceps
        : measurements.wrist +
          -2 * options.sleeveLengthBonus * (measurements.biceps - measurements.wrist)

    console.log('sleeve width might be an issue')

    if (((1 + options.cuffEase) * measurements.wrist) / circAtCuff < 1) {
      const recommendedCuffEase = (circAtCuff * (1 + options.cuffEase)) / measurements.wrist - 1
      store.flag.note({
        msg: `sasha:adjustCuffEase`,
        replace: {
          ease: Math.round(100 * recommendedCuffEase),
          circ: units(circAtCuff),
        },
        suggest: {
          text: 'adjustEase',
          icon: 'options',
          update: {
            settings: [
              'options',
              {
                ...options,
                cuffEase: recommendedCuffEase,
              },
            ],
          },
        },
      })
    } else {
      console.log('no sleeve width issues expected')
    }
  }

  return part.hide()
}

export const frontArmholeCalculation = {
  name: 'frontArmholeCalculation',
  from: frontPoints,
  after: frontOutside,
  draft: calculate,
  measurements: ['wrist', 'biceps'],
  options: {
    libraryFitSleeve: true,
    legacyArmholeDepth: false,
    cuffEase: { pct: 20, min: 0, max: 200, ...pctBasedOn('wrist'), menu: 'fit' },
    sleevecapEase: { pct: 0, min: 0, max: 10, menu: 'fit' }, // % TODO: check values
    bicepsEase: { pct: 0, min: 0, max: 10, menu: 'fit' }, // % TODO: check values
  },
}
