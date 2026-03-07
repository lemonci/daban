import { backPocketPoints } from './backpocketpoints.mjs'
import { dim, pointOnPath } from './shared.mjs'

export const backPocket = {
  name: 'crux.backpocket',
  from: backPocketPoints,
  options: {},
  draft: ({ options, points, Path, paths, Snippet, snippets, sa, store, macro, log, part }) => {
    const backAngle = store.get('backAngle')

    macro('transform', {
      transform: 'rotate',
      c: points.backPocketTopMiddle,
      angle: 180 - backAngle,
      clone: false,
      paths: [
        'backPocketSeamOutline',
        'backPocketOpening',
        'backPocketSeam',
        'backPocketLeftBottomCurve',
        'backPocketRightBottomCurve',
        'waistSeamPocketPartLeft',
        'waistSeamPocketPartRight',
        'curveLeftOfDart',
        'curveRightOfDart',
        'curveDart',
        'curveDartSA',
        'waistSeamPocketPart',
        'opening',
      ],
      points: [
        'bpT2L',
        'bpL2T',
        'bpL',
        'bpL2B',
        'bpB2L',
        'bpB',
        'bpB2R',
        'bpR2B',
        'bpR',
        'bpR2T',
        'bpT2R',
        'bpT',
        'backPocketTopRight',
        'backPocketTopLeft',
        'backPocketBottomRight',
        'backPocketBottomLeft',
        'backPocketBottomLeftUp',
        'backPocketBottomRightUp',
        'backPocketBottomLeftRight',
        'backPocketBottomRightLeft',
        'backPocketBottomMiddle',
        'backPocketBottomLeftToRightCp',
        'backPocketBottomRightToLeftCp',
        'backPocketBottomLeftToUpCp',
        'backPocketBottomRightToUpCp',
      ],
    })

    paths.backPocketOpening.hide()
    paths.backPocketLeftBottomCurve.hide()
    paths.backPocketRightBottomCurve.hide()
    paths.curveRightOfDart.hide()
    paths.curveDart.hide()
    paths.curveDartSA.hide()
    paths.curveLeftOfDart.hide()
    paths.backPocketSeamOutline.hide()
    paths.waistSeamPocketPart.hide()

    if (options.backPocketType !== 'square') paths.opening.hide()

    if (options.backPocketInside && options.backPocketType !== 'square') {
      paths.backPocketSeam = paths.curveRightOfDart
        .clone()
        .join(paths.curveDart)
        .join(paths.curveLeftOfDart)
        .split(points.backPocketTopLeft)[0]
        .split(points.backPocketTopRight)[1]
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .close()

      paths.backPocketSeamSA = paths.curveRightOfDart
        .clone()
        .join(paths.curveDartSA)
        .join(paths.curveLeftOfDart)
        .split(points.backPocketTopLeft)[0]
        .split(points.backPocketTopRight)[1]
        .line(points.backPocketBottomLeftUp)
        .join(paths.backPocketLeftBottomCurve)
        .line(points.backPocketBottomRightLeft)
        .join(paths.backPocketRightBottomCurve)
        .line(points.backPocketTopRight)
        .close()
        .hide()
    } else {
      if (options.backPocketType === 'hole' || options.backPocketType === 'diamond') {
        paths.opening.unhide()
      } else {
        if (options.backPocketType === 'square') {
          points.backPocketTopLeftHem = points.backPocketTopLeft.shift(
            90,
            store.get('backPocketHeight') * 0.1
          )
          points.backPocketTopRightHem = points.backPocketTopRight.shift(
            90,
            store.get('backPocketHeight') * 0.1
          )

          paths.backPocketSeam = new Path()
            .move(points.backPocketTopLeftHem)
            .line(points.backPocketBottomLeft)
            .line(points.backPocketBottomRight)
            .line(points.backPocketTopRightHem)
            .line(points.backPocketTopLeftHem)
            .close()
            .hide()
          paths.backPocketFold = new Path()
            .move(points.backPocketTopLeft)
            .line(points.backPocketTopRight)
            .attr('class', 'fabric dashed')
            .setText('fold', 'text-s center')
        }
      }
      paths.backPocketSeamSA = paths.backPocketSeam.clone().hide()
    }

    paths.backPocketSeam.unhide()
    if (paths.backPocketSeam === undefined) {
      log.error('Pocket seam is missing!')

      return part.hide()
    }

    points.gridAnchor = points.backPocketTopLeft.clone()

    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    snippets.backPocketTopLeft = new Snippet(
      'notch',
      pointOnPath(part, paths.backPocketSeam, points.backPocketTopLeft)
        ? points.backPocketTopLeft
        : points.waistSeamBackStart
    )
    snippets.backPocketTopRight = new Snippet(
      'notch',
      pointOnPath(part, paths.backPocketSeam, points.backPocketTopRight)
        ? points.backPocketTopRight
        : points.backPocketBackOpeningSeam
    )
    snippets.backPocketBottomMiddle = new Snippet('notch', points.backPocketBottomMiddle)

    points.logo = points.backPocketTopMiddle.shiftFractionTowards(
      points.backPocketBottomMiddle,
      0.7
    )
    points.title = points.logo.clone()
    macro('title', {
      nr: 7,
      at: points.title,
      title: 'pocketback',
      align: 'center',
      scale: 0.5,
    })

    macro('grainline', {
      from: points.backPocketBottomLeftUp.shift(0, 10),
      to: points.backPocketTopLeft.shift(0, 10),
    })

    if (sa) {
      paths.sa = paths.backPocketSeamSA.offset(sa).attr('class', 'fabric sa')
      if (paths.backPocketOpening !== undefined && paths.backPocketOpeningFront !== undefined) {
        paths.backPocketOpeningSA = paths.backPocketOpening
          .reverse()
          .offset(sa)
          .attr('class', 'fabric sa')
      }
    }

    if (options.backPocketType !== 'square') {
      points.bpOstart = paths.opening.start()
      points.bpOstop = paths.opening.end()

      dim(part, [
        ['h', 'backPocketTopLeft', 'backPocketTopRight', 'backPocketTopRight', -25],
        ['h', 'bpOstop', 'bpOstart', 'bpOstop', -15],
        [
          'h',
          'backPocketBottomLeftRight',
          'backPocketBottomRightLeft',
          'backPocketBottomRight',
          15,
        ],
        ['v', 'backPocketBottomRightUp', 'backPocketTopRight', 'backPocketTopRight', 15],
        ['v', 'backPocketBottomRightLeft', 'backPocketTopRight', 'backPocketTopRight', 25],
      ])
      if (options.backPocketInside === false) {
        dim(part, [
          ['h', 'bpL', 'bpR', 'bpB', 15],
          ['v', 'backPocketBottomMiddle', 'bpB', 'bpB', 20],
        ])
      }
    } else {
      dim(part, [
        ['h', 'backPocketTopLeftHem', 'backPocketTopRightHem', 'backPocketTopRightHem', -15],
        ['v', 'backPocketBottomRightLeft', 'backPocketTopRightHem', 'backPocketTopRightHem', 25],
        ['v', 'backPocketBottomRightUp', 'backPocketTopRight', 'backPocketTopRight', 15],
      ])
    }

    return part
  },
}
