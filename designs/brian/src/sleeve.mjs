import { sleeve1 } from '@freesewing/partlib'
import { front } from './front.mjs'
import { back } from './back.mjs'

export const sleeve = {
  ...sleeve1,
  from: sleeve1,
  name: 'brian.sleeve',
  after: [front, back],
  hide: { from: true },
  options: {
    ...sleeve1.options,
    sleeveLengthBonus: { pct: 0, min: -40, max: 10, menu: 'style' },
    partlibFitSleeve1: true,
  },
  measurements: ['shoulderToWrist', 'wrist'],
}
