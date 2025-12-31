import en from './en.json' with { type: 'json' }
import rectangle from './rectangle/en.json' with { type: 'json' }
import sleeve from './sleeve/en.json' with { type: 'json' }
import twoPartSleeve from './two-part-sleeve/en.json' with { type: 'json' }

export const i18n = {
  en: {
    ...en,
    p: {
      ...rectangle.p,
      ...sleeve.p,
      ...twoPartSleeve.p,
    },
    s: {
      ...rectangle.s,
      ...sleeve.s,
      ...twoPartSleeve.s,
    },
    o: {
      ...rectangle.o,
      ...sleeve.o,
      ...twoPartSleeve.o,
    },
  },
}
