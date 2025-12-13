import { Design } from '@freesewing/core'
import { i18n } from '../i18n/index.mjs'

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
}
