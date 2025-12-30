import { frontDimensions } from './shared.mjs'
import { draftFrontRightClassicSeparate } from './frontright-classic-separate.mjs'
import { draftFrontRightClassicCuton } from './frontright-classic-cuton.mjs'
import { draftFrontRightSeamless } from './frontright-seamless.mjs'
import { front } from './front.mjs'
import { buttonPlacketStyle } from './options.mjs'

function simonFrontRight(params) {
  const { complete, sa, options, points, macro, part, paths } = params
  macro('flip')

  /*
   * Chest & Waist line
   * we redo this because text is upside-down after the flip
   * Note that we wrap this in a complete check since paths.chest
   * won't exist if complete is falsy
   */
  if (complete) {
    macro('banner', {
      id: 'chestLine',
      classes: 'center contrast help',
      path: paths.chest.reverse(),
      text: 'simon:chestLine',
    })
    macro('banner', {
      id: 'waistLine',
      classes: 'center contrast help',
      path: paths.waist.reverse(),
      text: 'simon:waistLine',
    })
  }

  /*
   * Annotations
   */
  // Scalebox
  points.scalebox = points.waist.shiftFractionTowards(points.cfWaist, 0.5)
  macro('scalebox', { at: points.scalebox })

  // Dimensions
  frontDimensions(part, 'right')
  macro('ld', {
    id: 'lShoulderSeam',
    from: points.s3ArmholeSplit,
    to: points.s3CollarSplit,
    d: 15 + sa,
  })

  if (options.separateButtonPlacket) {
    return draftFrontRightClassicSeparate(params)
  } else if (options.buttonPlacketStyle === 'seamless') {
    return draftFrontRightSeamless(params)
  } else if (options.buttonPlacketStyle === 'classic') {
    return draftFrontRightClassicCuton(params)
  } else {
    throw `Unexpected buttonPlacketStyle: ${options.buttonPlacketStyle}`
  }
}

export const frontRight = {
  name: 'simon.frontRight',
  from: front,
  options: {
    buttonPlacketStyle,
  },
  draft: simonFrontRight,
}
