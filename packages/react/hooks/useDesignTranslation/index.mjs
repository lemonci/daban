import { i18n as pluginI18n } from '@freesewing/plugin-annotations'
import { i18n as collectionI18n } from '@freesewing/collection'
import { flags as flagTranslations } from '@freesewing/i18n'

/*
 * design strings (under the "s" key) should be design prefixed
 */
const designPrefixedStrings = {}
for (const [key, val] of Object.entries(flagTranslations || {}))
  designPrefixedStrings[`flag:${key}`] = val
for (const [design, i18n] of Object.entries(collectionI18n || {}))
  for (const [key, val] of Object.entries(i18n?.en?.s || {}))
    designPrefixedStrings[`${design}:${key}`] = val

/**
 * Returns translation strings for a design.
 *
 * Note: Currently, this method includes prefixed strings for _all_ known designs, so that every
 * design can access e.g. `{'brian:waistLine': 'Waist Line'}`. In the future this could be restricted
 * to design inheritance, so only Designs that inherit from a base design get these prefixed strings.
 *
 * This method does not include option translations in the return value, use useDesignOptionTranslation instead.
 *
 * @param {string} design Design to get translations for
 * @return {{}} Object with translation strings for that design.
 * The keys in the object are plain for parts of the design:
 * e.g. `{'front': 'Front', 'back': 'Back', ...}` and design-prefixed for generic strings defined under the "s" key
 * that used for flags, or custom texts on the pattern, e.g. `{'brian:waistLine': 'Waist Line'}`.
 */
export const useDesignTranslation = (design) => {
  const strings = { ...designPrefixedStrings }
  if (collectionI18n[design]?.en) {
    const en = collectionI18n[design].en
    // Parts have no prefix
    Object.assign(strings, en.p || {})
  }

  Object.assign(strings, pluginI18n.en)

  return strings
}

/**
 * Returns translation strings for a design's options.
 * @param design
 * @return {{}} the `o` value of the designs options.
 */
export const useDesignOptionTranslation = (design) => {
  if (collectionI18n[design]?.en) {
    const en = collectionI18n[design].en
    return en.o ?? {}
  }
  return {}
}
