import { front } from './front.mjs'
import { back } from './back.mjs'
import { draftRibbing } from './utils.mjs'

function draftToniWaistband({ points, options, macro, store, part }) {
  draftRibbing(
    part,
    (store.get('frontHemLength') + store.get('backHemLength')) * 2 * (1 - options.ribbingStretch)
  )

  /*
   * Annotations
   */
  // Cutlist
  store.cutlist.setCut({ cut: 1, from: 'ribbing' })

  // Title
  macro('title', {
    at: points.title,
    nr: 5,
    rotation: 90,
    title: 'waistband',
  })

  return part
}

export const waistband = {
  name: 'toni.waistband',
  after: [front, back],
  draft: draftToniWaistband,
}
