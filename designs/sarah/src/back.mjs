import { base } from './base.mjs'
import { pathUtilsPlugin } from '@freesewing/plugin-path-utils'

export const back = {
  name: 'sarah.back',
  plugins: [pathUtilsPlugin],
  from: base,
  draft: ({
    points,
    Point,
    Path,
    paths,
    options,
    sa,
    macro,
    part,
    store,
    snippets,
    Snippet,
    complete,
    paperless,
    expand,
  }) => {
    const paperlessOffset = options.paperlessOffset

    paths.centerBack = new Path().move(points.cbTop).line(points.cbBottom)
    paths.backBottom = new Path().move(points.cbBottom).line(points.sideBottom)

    paths.sideBack = new Path()
      .move(points.sideBottom)
      .line(points.sideSeat)
      .curve(points.sshBCp, points.sshBCp, points.sshCpC)
      .curve(points.sshTCp, points.sshTCp, points.sbTop)

    paths.backTopNoDarts = new Path()
      .move(points.sbTop)
      .curve(points.sbtCp, points.bodRCp, points.backOutsideDartRight)
      .noop('backOutsideDart')
      .curve(points.bodLCp, points.bidRCp, points.backInsideDartRight)
      .noop('backInsideDart')
      .curve(points.bidLCp, points.cbTopCp, points.cbTop)
      .hide()

    if (complete) {
      paths.backTop = paths.backTopNoDarts
        .insop(
          'backOutsideDart',
          new Path().line(points.backOutsideDartBottom).line(points.backOutsideDartLeft)
        )
        .insop(
          'backInsideDart',
          new Path().line(points.backInsideDartBottom).line(points.backInsideDartLeft)
        )
        .unhide()
      paths.helpers = new Path()
        .move(points.backOutsideDartRight)
        .line(points.backOutsideDartLeft)
        .move(points.backInsideDartRight)
        .line(points.backInsideDartLeft)
        .setClass('mark dashed')
    } else {
      paths.backTop = paths.backTopNoDarts
        .insop(
          'backOutsideDart',
          new Path().move(points.backOutsideDartRight).line(points.backOutsideDartLeft)
        )
        .insop(
          'backInsideDart',
          new Path().move(points.backInsideDartRight).line(points.backInsideDartLeft)
        )
        .unhide()
    }

    if (expand && !options.centerBackSeam) {
      macro('mirror', {
        mirror: [paths.centerBack.start(), paths.centerBack.end()],
        clone: true,
        paths: ['helpers', 'backBottom', 'backTop', 'sideBack', 'backTopNoDarts'],
      })
      paths.centerBack.hide()
      paths.backBottom = paths.mirroredBackBottom.reverse().join(paths.backBottom)
      paths.backTop = paths.backTop.join(paths.mirroredBackTop.reverse())
      paths.backTopNoDarts = paths.backTopNoDarts
        .join(paths.mirroredBackTopNoDarts.reverse())
        .hide()
      paths.mirroredSideBack = paths.mirroredSideBack.reverse()
    } else {
      paths.backTop.unhide()
    }

    if (sa) {
      const hem = store.get('sarah.hem')
      if (options.centerBackSeam) {
        paths.backHem = macro('hem', {
          class: 'fabric',
          path1: 'centerBack',
          path2: 'sideBack',
          hemWidth: hem,
        })

        paths.backSa = macro('sa', {
          paths: ['centerBack', { p: 'backHem', offset: 0 }, 'sideBack', 'backTopNoDarts'],
        })
      } else {
        paths.backHem = macro('hem', {
          class: 'fabric',
          path1: expand ? 'mirroredSideBack' : 'centerBack',
          path2: 'sideBack',
          hemWidth: hem,
          offset1: expand ? null : 0,
        })

        paths.backSa = macro('sa', {
          paths: [
            { p: 'backHem', offset: 0 },
            'sideBack',
            'backTopNoDarts',
            expand ? 'mirroredSideBack' : null,
          ],
        })
      }
    }

    if (options.centerBackSeam) {
      store.cutlist.addCut({ cut: 2, onFold: false })
      points.gtop = points.cbTop.shift(0, options.paperlessOffset)
      points.gbottom = points.cbBottom.shift(0, options.paperlessOffset)
      macro('grainline', {
        from: points.gtop,
        to: points.gbottom,
        grainline: true,
      })
    } else {
      store.cutlist.addCut({ cut: 1, onFold: !expand })
      macro(expand ? 'grainline' : 'cutOnFold', {
        from: points.cbTop,
        to: points.cbBottom,
        grainline: true,
      })
    }

    macro('vd', {
      id: 'centerBack',
      from: points.cbTop,
      to: points.cbBottom,
      x: -paperlessOffset - sa,
    })

    macro('vd', {
      id: 'waistRise',
      to: points.sbTop,
      from: points.sbWaist,
      x: points.sbTop.x + paperlessOffset + sa,
    })

    macro('ld', {
      id: 'cb2insideDart',
      from: points.cbTop,
      to: points.backInsideDartLeft,
      d: sa + paperlessOffset,
    })

    macro('ld', {
      id: 'insideDart2outsideDart',
      from: points.backInsideDartRight,
      to: points.backOutsideDartLeft,
      d: sa + paperlessOffset,
    })

    macro('ld', {
      id: 'outsideDart2side',
      from: points.backOutsideDartRight,
      to: points.sbTop,
      d: sa + paperlessOffset,
    })

    macro('ld', {
      id: 'insideDartLength',
      from: points.backInsideDartCenter,
      to: points.backInsideDartBottom,
      d: paperlessOffset,
    })

    macro('ld', {
      id: 'insideDart',
      to: points.backInsideDartRight,
      from: points.backInsideDartLeft,
      d: sa + paperlessOffset * 2,
      noStartMarker: true,
      noEndMarker: true,
    })

    macro('ld', {
      id: 'outsideDart',
      to: points.backOutsideDartRight,
      from: points.backOutsideDartLeft,
      d: sa + paperlessOffset * 2,
      noStartMarker: true,
      noEndMarker: true,
    })

    macro('ld', {
      id: 'outsideDartLength',
      from: points.backOutsideDartCenter,
      to: points.backOutsideDartBottom,
      d: paperlessOffset,
    })

    macro('hd', {
      id: 'waist',
      from: points.cbTop,
      to: points.sbWaist,
      y: points.sbWaist.y + paperlessOffset,
    })

    macro('hd', {
      id: 'hem',
      from: points.cbBottom,
      to: points.sideBottom,
      y: points.sideBottom.y + paperlessOffset,
    })

    points.title = points.cbSeat
      .shiftFractionTowards(points.sideSeat, 0.5)
      .shift(270, points.cbSeat.dist(points.cbBottom) / 2)

    points.logo = points.title.shift(90, 100)
    snippets.logo = new Snippet('logo', points.logo)

    /*
     * Add the title
     */
    macro('title', {
      at: points.title,
      nr: 1,
      title: 'back',
      align: 'center',
      scale: 0.8,
    })

    if (!paperless && complete) {
      points.miniscale = points.__macro_title_title_notes.shift(-90, options.paperlessOffset)

      macro('miniscale', { at: points.miniscale })
    }

    return part
  },
}
