import { Design, mergeI18n } from '@freesewing/core'
import { i18n as nobleI18n } from '@freesewing/noble'
import { i18n as tristanI18n } from '../i18n/index.mjs'
import about from '../about.json' with { type: 'json' }
// Parts
import { frontPoints } from './frontpoints.mjs'
import { frontInside } from './frontinside.mjs'
import { frontOutside } from './frontoutside.mjs'
import { backPoints } from './backpoints.mjs'
import { backInside } from './backinside.mjs'
import { backOutside } from './backoutside.mjs'
import { peplumFront } from './peplumfront.mjs'
import { peplumBack } from './peplumback.mjs'

// Create new design
const Tristan = new Design({
  data: about,
  parts: [
    frontPoints,
    frontInside,
    frontOutside,
    backPoints,
    backInside,
    backOutside,
    peplumFront,
    peplumBack,
  ],
})

// Merge translations
const i18n = mergeI18n([nobleI18n, tristanI18n], {
  p: { drop: ['back', 'front'] },
  o: {
    keep: [
      ...Object.keys(frontPoints.options),
      ...Object.keys(peplumFront.options),
      'armholeDartCurved',
      'armholeDartCurvePoint',
      'armholeDartCurveWidth',
      'chestEase',
      'frontShoulderWidth',
      'fullChestEaseReduction',
      'highBustWidth',
      'shoulderDartCurvature',
      'shoulderToShoulderEase',
      'waistdartposition',
      'waistEase',
    ],
  },
  s: { drop: [] },
})

// Named exports
export {
  frontPoints,
  frontInside,
  frontOutside,
  backPoints,
  backInside,
  backOutside,
  peplumFront,
  peplumBack,
  i18n,
  Tristan,
  about,
}
