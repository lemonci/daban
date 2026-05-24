import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }

import { head_back } from './parts/head_back/head_back.mjs'
import { face } from './parts/face/face.mjs'
import { body_back } from './parts/body_back/body_back.mjs'
import { body_front } from './parts/body_front/body_front.mjs'
import { arm_bottom } from './parts/arm_bottom/arm_bottom.mjs'
import { arm_top } from './parts/arm_top/arm_top.mjs'
import { leg } from './parts/leg/leg.mjs'
import { foot } from './parts/foot/foot.mjs'
import { snout_forehead } from './parts/snouted_head/snout_forehead.mjs'
import { snout_nose_top } from './parts/snouted_head/snout_nose_top.mjs'
import { snout_head_side } from './parts/snouted_head/snout_head_side.mjs'
import { anthro_leg_inner } from './parts/anthro_legs/anthro_leg_inner.mjs'
import { anthro_leg_outer } from './parts/anthro_legs/anthro_leg_outer.mjs'
import { anthro_foot_upper } from './parts/anthro_legs/anthro_foot_upper.mjs'
import { anthro_foot_sole } from './parts/anthro_legs/anthro_foot_sole.mjs'
import { preview } from './parts/preview/preview.mjs'

import { i18n } from '../i18n/index.mjs'
import { faceForelock } from './parts/hairline_head/faceForelock/faceForelock.mjs'
import { hairBack } from './parts/hairline_head/hairBack/hairBack.mjs'
import { hairForelockTriangle } from './parts/hairline_head/hairForelockTriangle/hairForelockTriangle.mjs'
import { neckBack } from './parts/hairline_head/neckBack/neckBack.mjs'

// Setup our new design
const Polly = new Design({
  data: about,
  parts: [
    head_back,
    face,
    body_back,
    body_front,
    arm_bottom,
    arm_top,
    leg,
    foot,
    snout_forehead,
    snout_nose_top,
    snout_head_side,
    anthro_leg_inner,
    anthro_leg_outer,
    anthro_foot_upper,
    anthro_foot_sole,

    faceForelock,
    hairBack,
    hairForelockTriangle,
    neckBack,

    preview,
  ],
})

// Named exports
export {
  head_back,
  face,
  body_back,
  body_front,
  arm_bottom,
  arm_top,
  leg,
  foot,
  snout_forehead,
  snout_nose_top,
  snout_head_side,
  anthro_leg_inner,
  anthro_leg_outer,
  anthro_foot_upper,
  anthro_foot_sole,
  faceForelock,
  hairBack,
  hairForelockTriangle,
  neckBack,
  preview,
  Polly,
  i18n,
  about,
}
