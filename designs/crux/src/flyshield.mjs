import { basepoints } from './basepoints.mjs'
import { dim } from './shared.mjs'

export const flyShield = {
  name: 'crux.flyshield',
  from: basepoints,
  draft: ({ points, Path, paths, sa, store, macro, part }) => {
    for (const i in paths) {
      delete paths[i]
    }
    for (const i in points) {
      if (['pZ', 'flyTop', 'flyBottom', 'flyTopCenter', 'pFBcpZ', 'pZcpFB'].indexOf(i) === -1)
        delete points[i]
    }

    const angle = points.flyTopCenter.angle(points.pZ)
    macro('transform', {
      transform: 'rotate',
      angle: 270 - angle,
      c: points.flyTopCenter,
      clone: false,
      points: ['pZ', 'flyTop', 'flyBottom', 'pFBcpZ', 'pZcpFB'],
    })
    points.flyTop.y = points.flyTopCenter.y

    if (sa) {
      points.flyTopCenter = points.flyTopCenter.shift(90, sa).shift(0, sa)
      points.flyTop = points.flyTop.shift(90, sa)
      points.pZextra = points.pZ.shift(0, sa)
    } else {
      points.pZextra = points.pZ.clone()
    }
    paths.seam = new Path()
      .move(points.flyTopCenter)
      .line(points.flyTop)
      .line(points.flyBottom)
      .curve(points.pFBcpZ, points.pZcpFB, points.pZ)
      .line(points.pZextra)
      .close()
      .attr('class', 'fabric')
      .unhide()

    points.gridAnchor = points.pZ.clone()

    store.cutlist.addCut({ cut: 1, onFold: true, from: 'fabric' })

    points.title = points.pZ.shiftFractionTowards(
      points.flyTop.shiftFractionTowards(points.flyTopCenter, 0.6),
      0.5
    )
    macro('title', {
      nr: 11,
      at: points.title,
      title: 'flyshield',
      align: 'center',
      scale: 0.5,
      rotation: 90,
      classes: { nr: 'text-xl note font-bold' },
    })
    macro('cutonfold', { from: points.flyTop, to: points.flyBottom, offset: 7 })

    if (sa) {
      paths.sa = paths.seam.offset(sa)
      const intersects = paths.sa.intersectsBeam(points.flyTop, points.flyBottom)
      paths.sa = new Path()
        .move(points.flyBottom)
        .join(paths.sa.split(intersects[1])[1].join(paths.sa.split(intersects[0])[0]))
        .line(points.flyTop)
        .attr('class', 'fabric sa')
    }

    dim(part, [
      ['h', 'flyTop', 'flyTopCenter', 'flyTopCenter', -15],
      ['h', 'flyBottom', 'pZ', 'pZ', 15],
      ['v', 'pZextra', 'flyTopCenter', 'flyTopCenter', 15],
      ['v', 'pZ', 'flyBottom', 'flyBottom', -15],
    ])

    return part
  },
}
