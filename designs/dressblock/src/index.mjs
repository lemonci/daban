import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { i18n as skirtblockI18n } from '@freesewing/skirtblock'
import { i18n as bodiceblockI18n } from '@freesewing/bodiceblock'
import { i18n as dressblockI18n } from '../i18n/index.mjs'
import { back } from './back.mjs'
import { front } from './front.mjs'

// Setup our new design
const Dressblock = new Design({
  data: about,
  parts: [back, front],
})

/*
 * Merge translations. Every option but `hemTighten` comes from one of the two blocks this
 * design joins, so their translations come along with them. The bodice block is merged
 * after the skirt block so that its account of `seatEase` -- the one this design's hip
 * line actually follows -- is the one that survives.
 */
const i18n = mergeI18n([skirtblockI18n, bodiceblockI18n, dressblockI18n])

// Named exports
export { back, front, Dressblock, i18n, about }
