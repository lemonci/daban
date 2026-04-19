import { sleeve } from './sleeve.mjs'
import { dim } from './shared.mjs'
import { backYoke } from './backyoke.mjs'
import { frontYoke } from './frontyoke.mjs'

export const underSleeve = {
  name: 'devon.underSleeve',
  from: sleeve,
  after: [backYoke, frontYoke],

  draft: ({ macro, points, paths, Path, snippets, Snippet, sa, store, complete, part }) => {
    // Extract seamline from sleeve
    delete paths.ts
    delete paths.topSleeve
    paths.seam = paths.underSleeve.clone().attr('class', 'fabric', true)
    delete paths.us
    delete paths.underSleeve

    points.anchor = points.usTip.clone()

    // Seam allowance
    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
    }

    /*
     * Annotatinos
     */

    // Cutlist
    store.cutlist.addCut({ cut: 2, from: 'fabric' })

    // Logo
    snippets.logo = new Snippet('logo', points.elbowCenter)

    // Title
    macro('title', {
      at: points.armCenter,
      nr: 9,
      title: 'underSleeve',
      rotation: 90,
    })

    points.usGrainFrom = points.usTipCpBottom.copy()
    points.usGrainTo = points.usGrainFrom.copy()
    points.usGrainTo.y = points.usSlitRight.y

    macro('grainline', {
      from: points.usGrainFrom,
      to: points.usGrainTo,
    })

    if (complete) {
      paths.undersleeveArmhole = new Path()
        .move(points.usTip)
        .curve(points.usTipCpBottom, points.usLeftEdgeCpRight, points.usLeftEdgeRight)
        .line(points.usLeftEdge)
        .hide()
      paths.topSleeveTemp = new Path()
        .move(points.top)
        .curve(points.topCpRight, points.backPitchPoint, points.backPitchPoint)
        .hide()

      if (
        store.get('backYokeArmhole') - store.get('sss') - paths.topSleeveTemp.length() <
        paths.undersleeveArmhole.length()
      ) {
        points.backYokeSnippet = paths.undersleeveArmhole.shiftAlong(
          store.get('backYokeArmhole') - store.get('sss') - paths.topSleeveTemp.length()
        )
        snippets.backYokeSnippet = new Snippet('notch', points.backYokeSnippet)
      }
      if (
        store.get('backYokeArmhole') -
          store.get('sss') -
          paths.topSleeveTemp.length() +
          store.get('armholeYokeBack') <
        paths.undersleeveArmhole.length()
      ) {
        points.bottomSnippet = paths.undersleeveArmhole.shiftAlong(
          store.get('backYokeArmhole') -
            store.get('sss') -
            paths.topSleeveTemp.length() +
            store.get('armholeYokeBack')
        )
        snippets.bottomSnippet = new Snippet('notch', points.bottomSnippet)
      }
    }

    dim(part, [
      ['h', 'usLeftEdge', 'backPitchPoint', 'usTip', -30],
      ['h', 'usLeftEdge', 'elbowRight', 'usCuffRight', 60],
      ['h', 'usLeftEdge', 'usTip', 'usTip', -15],
      ['h', 'usLeftEdge', 'usCuffLeft', 'usCuffRight', 30],
      ['h', 'usLeftEdge', 'usCuffRight', 'usCuffRight', 45],
      ['h', 'usLeftEdge', 'usElbowLeft', 'usCuffRight', 15],
      ['h', 'usLeftEdge', 'usRightEdge', 'usTip', -45],
      ['v', 'usCuffLeft', 'usLeftEdge', 'usLeftEdge', -30],
      ['v', 'usCuffRight', 'usLeftEdge', 'usLeftEdge', -45],
      ['v', 'usElbowLeft', 'usLeftEdge', 'usLeftEdge', -15],
      ['v', 'usLeftEdge', 'usTip', 'usLeftEdge', -15],
      ['v', 'usRightEdge', 'backPitchPoint', 'usRightEdge', 15],
      ['l', 'usCuffLeft', 'usCuffRight', 'usCuffRight', 15],
      ['l', 'usElbowLeft', 'elbowRight', 'elbowRight', 0],
      ['l', 'usLeftEdge', 'usRightEdge', 'usRightEdge', 0],
    ])
    if (sa) {
      dim(part, [
        ['l', 'usSlit', 'usSlitRight', 'usSlitRight', -15],
        ['l', 'usCuffRight', 'usSlitRight', 'usSlitRight', -15],
      ])
    }

    return part
  },
}
