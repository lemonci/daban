import { leg } from '../leg/leg.mjs'

function draftPollyFoot({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store,
  sa,
}) {
  if (options.legType == 'cylinder') {
    points.center = new Point(0, 0)

    const circumference = store.get('legBottomLength')

    points.radius = new Point(circumference / (2 * 3.14), 0)

    points.mirroredRadius = new Point(-circumference / (2 * 3.14), 0)

    paths.circle = new Path().move(points.radius).circleSegment(360, points.center).close()

    if (sa) paths.sa = paths.circle.offset(sa).attr('class', 'fabric sa')

    store.cutlist.addCut({ identical: true })

    macro('title', { at: points.center, nr: 4, title: 'foot', scale: options.totalSize })

    macro('hd', {
      id: 'footWidth',
      from: points.mirroredRadius,
      to: points.radius,
      y: circumference / (2 * 3.14) + (sa + 15),
    })
  }

  return part
}

export const foot = {
  name: 'polly.foot',
  draft: draftPollyFoot,

  after: leg,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    // Enter your pattern options here. Example:
    /*
        extraLength: {
            pct: 10,
            min: 5,
            max: 20,
            label: 'Extra length',
            menu: 'fit',
            ...pctBasedOn('neck')
        }
        */
  },
}
