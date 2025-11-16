import { Design, mergeI18n } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { front, back, i18n as brianI18n } from '@freesewing/brian'
import { undersleeve, topsleeve, i18n as libraryI18n } from '@freesewing/library'
import { i18n as bentI18n } from '../i18n/index.mjs'

// Create new design
const Bent = new Design({
  data: about,
  parts: [front, back, topsleeve, undersleeve],
})

// Merge translations
const i18n = {
  ...bentI18n,
  ...mergeI18n([libraryI18n, brianI18n], {
    p: { keep: ['front', 'back', 'topsleeve', 'undersleeve'] },
    o: {
      keep: [
        ...Object.keys(back.options),
        ...Object.keys(undersleeve.options),
        ...Object.keys(topsleeve.options),
      ],
    },
    s: { drop: [] },
  }),
}

/*
 * Since the creation of @freesewing/library
 * Bent does not actually do anything
 * All it does is combine front & back from Brian with
 * the topsleeve & undersleeve from the library
 *
 * For now, we still export all parts, but we will
 * drop this design in FreeSewing 5 and we log a deprecation
 * warning for it.
 */
export { front, back, topsleeve, undersleeve, Bent, i18n, about }

console.log(`@freesewing/bent is deprecated and will be removed in FreeSewing v5.
To migrate, use front & back from @freesewing/brian
combined with topsleeve & undersleeve from @freesewing/library`)
