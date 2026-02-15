import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { rectangleI18n } from '@freesewing/library'
import { i18n as examplesI18n } from '../i18n/index.mjs'

// Library
import { rectBase, rect1, rect2, rect3 } from './library.mjs'

// Stacks
import {
  stacks_top,
  stacks_left,
  stacks_right,
  stacks_bottom,
  stacks_leftEye,
  stacks_rightEye,
  stacks_mouth,
} from './stacks.mjs'

// Setup our new design
const Examples = new Design({
  data: about,
  parts: [
    // Library
    rectBase,
    rect1,
    rect2,
    rect3,

    // Stacks
    stacks_top,
    stacks_left,
    stacks_right,
    stacks_bottom,
    stacks_leftEye,
    stacks_rightEye,
    stacks_mouth,
  ],
})

// Merge i18n
const i18n = mergeI18n([rectangleI18n, examplesI18n])

// Named exports
export {
  // Design
  Examples,

  // Library
  rectBase,
  rect1,
  rect2,
  rect3,

  // Stacks
  stacks_top,
  stacks_left,
  stacks_right,
  stacks_bottom,
  stacks_leftEye,
  stacks_rightEye,
  stacks_mouth,

  // Translation
  i18n,
  about,
}
