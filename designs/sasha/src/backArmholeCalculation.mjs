import { back as bellaBack } from '@freesewing/bella'
import { frontArmholeCalculation } from './frontArmholeCalculation.mjs'

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
  // NOTE: this part does not draw anything but calculates the length of the back armhole

  store.set(
    'backArmholeLength',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .curve_(points.armholePitchCp2, points.shoulder)
      .length()
  )
  log.info(`back armhole length: ${units(store.get('backArmholeLength'))}`)
  log.info(
    `total armhole length: ${units(store.get('backArmholeLength') + store.get('frontArmholeLength'))}`
  ) // 'backArmholeToArmholePitch' determines notch placement
  store.set(
    'backArmholeToArmholePitch',
    new Path()
      .move(points.armhole)
      .curve(points.armholeCp2, points.armholePitchCp1, points.armholePitch)
      .length()
  )

  return part.hide()
}

export const backArmholeCalculation = {
  name: 'backArmholeCalculation',
  from: bellaBack,
  after: frontArmholeCalculation,
  draft: calculate,
}
