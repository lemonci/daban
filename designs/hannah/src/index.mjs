import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { hood } from './hood.mjs'
import { front, back, sleeve, cuff, waistband } from '@freesewing/toni'
import { i18n as hannahI18n } from '../i18n/index.mjs'
import { i18n as toniI18n } from '@freesewing/toni'
import { i18n as libraryI18n } from '@freesewing/library'
import { hoodCenter } from '@freesewing/library'
import { mergeI18n } from '@freesewing/core'
// Setup our new design
const Hannah = new Design({
  data: about,
  parts: [hood, hoodCenter, front, back, sleeve, cuff, waistband],
})

const i18n = mergeI18n([libraryI18n, toniI18n, hannahI18n], {})

// Named exports
export { hood, front, back, Hannah, i18n, about }
