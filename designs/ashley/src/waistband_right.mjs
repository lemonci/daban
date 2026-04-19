import { waistband_left } from './waistband_left.mjs'

function draftAshleyWaistbandRight({
  points,
  Point,
  paths,
  Path,
  units,
  options,
  complete,
  store,
  macro,
  expand,
  snippets,
  Snippet,
  sa,
  absoluteOptions,
  part,
}) {
  if (expand) {
    store.flag.preset('expandIsOn')
  } else {
    // Expand is off, do not draw the part but flag this to the user
    const extraSa = sa ? 2 * sa : 0
    store.flag.note({
      msg: `ashley:cutWaistbandRight`,
      notes: [sa ? 'flag:saIncluded' : 'flag:saExcluded', 'flag:partHiddenByExpand'],
      replace: {
        width: units(2 * absoluteOptions.waistbandWidth + extraSa * 1.5),
        length: units(store.get('waistbandFront') + store.get('waistbandFly') + extraSa),
      },
      suggest: {
        text: 'flag:show',
        icon: 'expand',
        update: {
          settings: ['expand', 1],
        },
      },
    })
    // Also hint about expand
    store.flag.preset('expandIsOff')

    return part.hide()
  }

  const length = store.get('waistbandFront') + store.get('waistbandFly')
  const width = absoluteOptions.waistbandWidth

  points.topLeft = new Point(0, 0)
  points.top = new Point(width, 0)
  points.topRight = new Point(width * 2, 0)

  points.bottomLeft = new Point(0, length)
  points.bottom = new Point(width, length)
  points.bottomRight = new Point(width * 2, length)

  points.cfRight = points.topRight.shift(-90, store.get('waistbandFly'))
  points.cfLeft = new Point(0, points.cfRight.y)

  //Additional annotation paths
  if (complete) {
    paths.cf = new Path()
      .move(points.cfLeft)
      .line(points.cfRight)
      .attr('class', 'dashed')
      .attr('data-text', 'centerFront')
      .attr('data-text-class', 'center')
    paths.fold = new Path().move(points.top).line(points.bottom).attr('class', 'fabric help')
  }
  paths.saBase = new Path()
    .move(points.topRight)
    .line(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .close()
    .hide()
  paths.seam = paths.saBase.clone().attr('class', 'fabric').unhide()

  if (sa) {
    paths.sa = paths.saBase.offset(sa).setClass('fabric sa')
  }

  let buttonScale = points.top.x / 14
  points.button = new Point((width * 3) / 2, store.get('waistbandFly') / 2)
  snippets.button = new Snippet('button', points.button).attr('data-scale', buttonScale)

  // Cutlist
  store.cutlist.setCut({ cut: 1, from: 'fabric' })
  store.cutlist.setCut({ cut: 1, from: 'interfacing' })

  // Title
  points.titleAnchor = points.top.shiftFractionTowards(points.bottom, 0.4)
  macro('title', {
    at: points.titleAnchor,
    nr: 7,
    title: 'waistband_right',
    rotation: 90,
    scale: 0.6,
  })

  macro('hd', {
    id: 'width',
    from: points.bottomLeft,
    to: points.bottomRight,
    y: points.bottomRight.y + sa + 15,
  })

  macro('vd', {
    id: 'length',
    from: points.topLeft,
    to: points.bottomLeft,
    x: points.bottomLeft.x - 15 - sa,
  })

  return part
}

export const waistband_right = {
  name: 'ashley.waistband_right',
  after: [waistband_left],
  options: {},
  draft: draftAshleyWaistbandRight,
}
