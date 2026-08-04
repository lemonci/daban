import { back as bodiceBack } from '@freesewing/bodiceblock'
import { hidePresets } from '@freesewing/core'
import { dressMeasurements, dressOptions, extend } from './shared.mjs'

export const back = {
  name: 'dressblock.back',
  from: bodiceBack,
  hide: hidePresets.HIDE_TREE,
  measurements: dressMeasurements,
  options: dressOptions,
  draft: (sh) => {
    const { points, macro, part } = sh
    extend(sh, 'cb')
    macro('title', { at: points.title, nr: 1, title: 'back', align: 'center', scale: 0.6 })

    return part
  },
}
