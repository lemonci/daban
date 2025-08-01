import { sleeve } from './index.mjs'
import { draftRibbing } from './utils.mjs'

function draftToniCuff({ points, options, macro, store, part }) {
  if (options.construction !== 'raglan' && options.construction !== 'set-in') {
    return part.hide()
  }

  draftRibbing(part, store.get('sleeveHemLength') * (1 - options.ribbingStretch))

  /*
   * Annotations
   */
  // Cutlist
  store.cutlist.setCut({ cut: 2, from: 'ribbing' })

  // Title
  macro('title', {
    at: points.title,
    nr: 4,
    rotation: 90,
    title: 'cuff',
  })

  return part
}

export const cuff = {
  name: 'toni.cuff',
  after: [sleeve],
  options: {},
  draft: draftToniCuff,
}
