import { frontSideDart as bellaFront } from '@freesewing/bella'
import { frontOutside } from './frontoutside.mjs'

function calculate({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  store,
  log,
  units,
  part,
}) {
  // NOTE: this part does not draw anything but calculates the length of the front armhole

  store.set(
    'frontArmholeLength',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .curve_(points.armholePitchCp2, points.shoulder)
      .length()
  )
  log.info(`front armhole length: ${units(store.get('frontArmholeLength'))}`)
  // 'frontArmholeToArmholePitch' determines notch placement
  store.set(
    'frontArmholeToArmholePitch',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .length()
  )

  return part.hide()
}

export const frontArmholeCalculation = {
  name: 'frontArmholeCalculation',
  from: bellaFront,
  after: frontOutside,
  draft: calculate,
  options: {
    brianFitSleeve: true,
    sleevecapEase: { pct: 0, min: 0, max: 10, menu: 'fit' }, // % TODO: check values
    bicepsEase: { pct: 0, min: 0, max: 10, menu: 'fit' }, // % TODO: check values
  },
}
