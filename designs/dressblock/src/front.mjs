import { front as bodiceFront } from '@freesewing/bodiceblock'
import { hidePresets } from '@freesewing/core'
import { dressMeasurements, dressOptions, extend } from './shared.mjs'

export const front = {
  name: 'dressblock.front',
  from: bodiceFront,
  hide: hidePresets.HIDE_TREE,
  measurements: dressMeasurements,
  options: dressOptions,
  draft: (sh) => {
    const { points, macro, part } = sh
    extend(sh, 'cf')
    macro('title', { at: points.title, nr: 2, title: 'front', align: 'center', scale: 0.6 })

    return part
  },
}
