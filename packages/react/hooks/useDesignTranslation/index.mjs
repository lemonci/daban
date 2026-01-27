import { i18n as aaron } from '@freesewing/aaron'
import { i18n as albert } from '@freesewing/albert'
import { i18n as bee } from '@freesewing/bee'
import { i18n as bella } from '@freesewing/bella'
import { i18n as benjamin } from '@freesewing/benjamin'
import { i18n as bent } from '@freesewing/bent'
import { i18n as bibi } from '@freesewing/bibi'
import { i18n as bob } from '@freesewing/bob'
import { i18n as breanna } from '@freesewing/breanna'
import { i18n as brian } from '@freesewing/brian'
import { i18n as bruce } from '@freesewing/bruce'
import { i18n as carlita } from '@freesewing/carlita'
import { i18n as carlton } from '@freesewing/carlton'
import { i18n as cathrin } from '@freesewing/cathrin'
import { i18n as charlie } from '@freesewing/charlie'
import { i18n as cornelius } from '@freesewing/cornelius'
import { i18n as diana } from '@freesewing/diana'
import { i18n as florence } from '@freesewing/florence'
import { i18n as florent } from '@freesewing/florent'
import { i18n as gozer } from '@freesewing/gozer'
import { i18n as hi } from '@freesewing/hi'
import { i18n as holmes } from '@freesewing/holmes'
import { i18n as hortensia } from '@freesewing/hortensia'
import { i18n as huey } from '@freesewing/huey'
import { i18n as hugo } from '@freesewing/hugo'
import { i18n as jaeger } from '@freesewing/jaeger'
import { i18n as jane } from '@freesewing/jane'
import { i18n as lucy } from '@freesewing/lucy'
import { i18n as lumina } from '@freesewing/lumina'
import { i18n as lumira } from '@freesewing/lumira'
import { i18n as lunetius } from '@freesewing/lunetius'
import { i18n as noble } from '@freesewing/noble'
import { i18n as octoplushy } from '@freesewing/octoplushy'
import { i18n as onyx } from '@freesewing/onyx'
import { i18n as opal } from '@freesewing/opal'
import { i18n as otis } from '@freesewing/otis'
import { i18n as paco } from '@freesewing/paco'
import { i18n as penelope } from '@freesewing/penelope'
import { i18n as sandy } from '@freesewing/sandy'
import { i18n as shelly } from '@freesewing/shelly'
import { i18n as shin } from '@freesewing/shin'
import { i18n as simon } from '@freesewing/simon'
import { i18n as simone } from '@freesewing/simone'
import { i18n as skully } from '@freesewing/skully'
import { i18n as sven } from '@freesewing/sven'
import { i18n as tamiko } from '@freesewing/tamiko'
import { i18n as teagan } from '@freesewing/teagan'
import { i18n as tiberius } from '@freesewing/tiberius'
import { i18n as titan } from '@freesewing/titan'
import { i18n as trayvon } from '@freesewing/trayvon'
import { i18n as tristan } from '@freesewing/tristan'
import { i18n as uma } from '@freesewing/uma'
import { i18n as umbra } from '@freesewing/umbra'
import { i18n as wahid } from '@freesewing/wahid'
import { i18n as walburga } from '@freesewing/walburga'
import { i18n as waralee } from '@freesewing/waralee'
import { i18n as yuri } from '@freesewing/yuri'
import { i18n as lily } from '@freesewing/lily'

import { i18n as pluginI18n } from '@freesewing/plugin-annotations'
import { flags as flagTranslations } from '@freesewing/i18n'

export const designTranslations = {
  aaron,
  albert,
  bee,
  bella,
  benjamin,
  bent,
  bibi,
  bob,
  breanna,
  brian,
  bruce,
  carlita,
  carlton,
  cathrin,
  charlie,
  cornelius,
  diana,
  florence,
  florent,
  gozer,
  hi,
  holmes,
  hortensia,
  huey,
  hugo,
  jaeger,
  jane,
  lucy,
  lumina,
  lumira,
  lunetius,
  noble,
  octoplushy,
  onyx,
  opal,
  otis,
  paco,
  penelope,
  sandy,
  shelly,
  shin,
  simon,
  simone,
  skully,
  sven,
  tamiko,
  teagan,
  tiberius,
  titan,
  trayvon,
  tristan,
  uma,
  umbra,
  wahid,
  walburga,
  waralee,
  yuri,
  lily,
}

/*
 * design strings (under the "s" key) should be design prefixed
 */
const designPrefixedStrings = {}
for (const [key, val] of Object.entries(flagTranslations || {}))
  designPrefixedStrings[`flag:${key}`] = val
for (const [design, { s }] of Object.entries(designTranslations || {}))
  for (const [key, val] of Object.entries(s || {})) designPrefixedStrings[`${design}:${key}`] = val

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
  if (designTranslations[design]?.en) {
    const en = designTranslations[design].en
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
  if (designTranslations[design]?.en) {
    const en = designTranslations[design].en
    return en.o ?? {}
  }
  return {}
}
