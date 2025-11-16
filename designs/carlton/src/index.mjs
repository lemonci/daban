import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { i18n as brianI18n, Brian, back as brianBack } from '@freesewing/brian'
import { i18n as carltonI18n } from '../i18n/index.mjs'
import { i18n as libraryI18n, topsleeve as libraryTopsleeve } from '@freesewing/library'
// Parts
import { front } from './front.mjs'
import { frontFacing } from './front-facing.mjs'
import { frontLining } from './front-lining.mjs'
import { back } from './back.mjs'
import { backStay } from './back-stay.mjs'
import { tail } from './tail.mjs'
import { topsleeve } from './topsleeve.mjs'
import { undersleeve } from './undersleeve.mjs'
import { belt } from './belt.mjs'
import { collarStand } from './collarstand.mjs'
import { collar } from './collar.mjs'
import { cuffFacing } from './cufffacing.mjs'
import { pocket } from './pocket.mjs'
import { pocketFlap } from './pocketflap.mjs'
import { pocketLining } from './pocketlining.mjs'
import { chestPocketWelt } from './chestpocketwelt.mjs'
import { chestPocketBag } from './chestpocketbag.mjs'
import { innerPocketWelt } from './innerpocketwelt.mjs'
import { innerPocketBag } from './innerpocketbag.mjs'
import { innerPocketTab } from './innerpockettab.mjs'

// Create design
const Carlton = new Design({
  data: about,
  parts: [
    front,
    frontFacing,
    frontLining,
    back,
    backStay,
    tail,
    topsleeve,
    undersleeve,
    belt,
    collarStand,
    collar,
    cuffFacing,
    pocket,
    pocketFlap,
    pocketLining,
    chestPocketWelt,
    chestPocketBag,
    innerPocketWelt,
    innerPocketBag,
    innerPocketTab,
  ],
})

// Merge translations
const i18n = mergeI18n([libraryI18n, brianI18n, carltonI18n], {
  o: {
    keep: [
      ...Object.keys(brianBack.options),
      ...Object.keys(Carlton.patternConfig.options),
      ...Object.keys(libraryTopsleeve.options),
    ],
  },
})

// Named exports
export {
  front,
  frontFacing,
  frontLining,
  back,
  backStay,
  tail,
  topsleeve,
  undersleeve,
  belt,
  collarStand,
  collar,
  cuffFacing,
  pocket,
  pocketFlap,
  pocketLining,
  chestPocketWelt,
  chestPocketBag,
  innerPocketWelt,
  innerPocketBag,
  innerPocketTab,
  Carlton,
  i18n,
  about,
}
