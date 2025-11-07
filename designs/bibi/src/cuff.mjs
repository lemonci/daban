import { sleeve1 } from '@freesewing/partlib'
import { front, back } from '@freesewing/brian'
import { hidePresets, pctBasedOn } from '@freesewing/core'
import { draftRibbing } from './shared.mjs'

export const cuff = {
  name: 'bibi.cuff',
  from: sleeve1,
  after: [front, back],
  hide: {
    from: true,
    inherited: true,
    after: true,
  },

  options: {
    // Brian overrides, placed here as this is the first loaded part that inherits from brian base
    s3Collar: 0,
    s3Armhole: 0,
    brianFitSleeve: true,
    brianFitCollar: false,
    bicepsEase: { pct: 5, min: 0, max: 50, ...pctBasedOn('biceps'), menu: 'fit' },
    collarEase: 0,
    shoulderSlopeReduction: 0,
    sleeveWidthGuarantee: 0.85,
    frontArmholeDeeper: 0.01,
    legacyArmholeDepth: false,
    // Unused as legacyArmholeDepth is disabled, hide option in documentation
    armholeDepthFactor: 0.5,
    shoulderEase: { pct: 0, min: -2, max: 6, ...pctBasedOn('shoulderToShoulder'), menu: 'fit' },
    // Note: we reuse Brian's cuff ease as "armhole fullness"
    cuffEase: {
      pct: 20,
      min: 0,
      max: 200,
      ...pctBasedOn('wrist'),
      menu: (settings, mergedOptions) =>
        mergedOptions.sleeves === false ? false : 'style.sleeves',
    },
    armholeDepth: {
      pct: 2,
      min: -10,
      max: 50,
      menu: (settings, mergedOptions) =>
        mergedOptions?.legacyArmholeDepth ? false : 'style.sleeves',
    },
    armholeCurveBack: {
      pct: 30,
      min: -10,
      max: 120,
      menu: (settings, mergedOptions) => (mergedOptions.sleeves ? false : 'style.sleeves'),
    },
    armholeDropBack: {
      pct: 20,
      min: -50,
      max: 50,
      menu: (settings, mergedOptions) => (mergedOptions.sleeves ? false : 'style.sleeves'),
    },
    // cuff specific settings
    useCuffRibbing: {
      bool: false,
      menu: (settings, mergedOptions) =>
        mergedOptions.sleeves && mergedOptions.sleeveLength >= 0.05 ? 'style' : false,
    },
    ribbingStretch: { pct: 15, min: 0, max: 30, menu: 'fit' },
    ribbingHeight: {
      pct: 10,
      min: 5,
      max: 15,
      menu: (settings, mergedOptions) =>
        mergedOptions.useWaistRibbing || mergedOptions.useCuffRibbing ? 'style' : false,
      toAbs: (val, { measurements }) =>
        (measurements.hpsToWaistBack + measurements.waistToHips) * val,
    },
  },
  draft: bibiCuff,
}

function bibiCuff({ part, store, measurements, options, paths, points, snippets, Point, macro }) {
  macro('rmtitle')
  macro('rmscalebox')
  for (const path of Object.keys(paths)) {
    paths[path].hide()
  }
  for (const key of Object.keys(snippets)) {
    delete snippets[key]
  }

  store.set(
    'ribbingHeight',
    (measurements.hpsToWaistBack + measurements.waistToHips) * options.ribbingHeight
  )

  if (!options.useCuffRibbing || !options.sleeves || options.sleeveLength < 0.05) {
    store.set('cuffSize', 0)
    return part.hide()
  }

  points.sleeveTip = paths.sleevecap.edge('top')
  points.sleeveTop = new Point(0, points.sleeveTip.y) // Always in center

  // Wrist
  points.centerWrist = points.sleeveTop.shift(-90, measurements.shoulderToWrist)
  points.wristRight = points.centerWrist.shift(0, (measurements.wrist * (1 + options.cuffEase)) / 2)
  points.wristLeft = points.wristRight.rotate(180, points.centerWrist)

  points.cuffRight = points.bicepsRight.shiftFractionTowards(
    points.wristRight,
    options.sleeveLength
  )
  points.cuffLeft = points.bicepsLeft.shiftFractionTowards(points.wristLeft, options.sleeveLength)
  points.centerCuff = points.cuffRight.shiftFractionTowards(points.cuffLeft, 0.5)

  store.set('cuffSize', points.cuffLeft.dist(points.cuffRight))

  // clean up temporary stuff
  paths.sleevecap.hide()

  draftRibbing(part, store.cuffSize * (1 - options.ribbingStretch))

  /*
   * Annotations
   */
  // Cutlist
  store.cutlist.setCut({ cut: 2, from: 'ribbing', identical: true })

  // Title
  macro('title', {
    at: points.title,
    nr: 6,
    scale: 0.5,
    rotation: 90,
    title: 'cuff',
  })

  return part
}
