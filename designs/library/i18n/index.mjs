import en from './en.json' with { type: 'json' }
import rectangle from './rectangle/en.json' with { type: 'json' }
import sleeve from './sleeve/en.json' with { type: 'json' }
import twoPartSleeve from './two-part-sleeve/en.json' with { type: 'json' }
import hood from './hood/en.json' with { type: 'json' }

export const i18n = {
  en: {
    ...en,
    p: {
      ...rectangle.p,
      ...sleeve.p,
      ...twoPartSleeve.p,
      ...hood.p,
    },
    s: {
      ...rectangle.s,
      ...sleeve.s,
      ...twoPartSleeve.s,
      ...hood.s,
    },
    o: {
      ...rectangle.o,
      ...sleeve.o,
      ...twoPartSleeve.o,
      ...hood.o,
    },
  },
}
