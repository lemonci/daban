function calculateSleeveCapTarget({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  part,
}) {
  // NOTE: this part does not draw anything and is called 'front' only because brian.sleevecap requires (imports) a part called front
  switch (options.sleeveFor) {
    case 'Noble':
    // derived from bella, so use those values
    case 'Bella':
      store.set(
        'sleeveCapTarget',
        store.get('sleeveCapTargetFront') + store.get('sleeveCapTargetBack')
      )
    case 'Teagan':
      // no need to do anything, 'sleevecapTarget' already added to store by brian.base
      break
    default:
      error('not supported')
  }

  return part
}

export const fakeFront = {
  name: 'front',
  after: ['backArmholeCalculation', 'brian.front'],
  options: {
    sleeveFor: {
      dflt: 'Noble',
      list: ['Noble', 'Bella', 'Teagan'],
    },
  },
  draft: calculateSleeveCapTarget,
}
