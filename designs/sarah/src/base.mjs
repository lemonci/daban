import { Point, pctBasedOn, cbqc } from '@freesewing/core'

export function pctWaistline() {
  return {
    toAbs: (val, { measurements }, mergeOptions) => {
      return (
        val *
        (measurements.waist + mergeOptions.waistDrop * (measurements.hips - measurements.waist))
      )
    },
    fromAbs: (val, { measurements }, mergeOptions) => {
      return (
        Math.round(
          (10000 * val) /
            (measurements.waist + mergeOptions.waistDrop * (measurements.hips - measurements.waist))
        ) / 10000
      )
    },
  }
}

export function pctWaistlineSeatDiff() {
  return {
    toAbs: (val, { measurements }, mergeOptions) => {
      return (
        val *
        (measurements.waist +
          mergeOptions.waistDrop * (measurements.hips - measurements.waist) -
          measurements.seat)
      )
    },
    fromAbs: (val, { measurements }, mergeOptions) => {
      return (
        Math.round(
          (10000 * val) /
            (measurements.waist +
              mergeOptions.waistDrop * (measurements.hips - measurements.waist) -
              measurements.seat)
        ) / 10000
      )
    },
  }
}

export function pctWaistlineToSeat() {
  return {
    toAbs: (val, { measurements }, mergeOptions) => {
      return val * (measurements.waistToSeat - mergeOptions.waistDrop * measurements.waistToHips)
    },
    fromAbs: (val, { measurements }, mergeOptions) => {
      return (
        Math.round(
          (10000 * val) /
            (measurements.waistToSeat - mergeOptions.waistDrop * measurements.waistToHips)
        ) / 10000
      )
    },
  }
}

export function pctWaistlineToFloor() {
  return {
    toAbs: (val, { measurements }, mergeOptions) => {
      return val * (measurements.waistToFloor - mergeOptions.waistDrop * measurements.waistToHips)
    },
    fromAbs: (val, { measurements }, mergeOptions) => {
      return (
        Math.round(
          (10000 * val) /
            (measurements.waistToFloor - mergeOptions.waistDrop * measurements.waistToHips)
        ) / 10000
      )
    },
  }
}

function draftBase({ Path, Point, paths, points, measurements, options, part, store, sa, expand }) {
  // since this is a block, only notify about expand if this is the current part
  if (options.showExpandNotification && !(options.centerFrontSeam && options.centerBackSeam)) {
    if (expand) {
      store.flag.preset('expandIsOn')
    } else {
      store.flag.preset('expandIsOff')
    }
  }

  const waistline =
    measurements.waist - options.waistDrop * (measurements.hips - measurements.waist)
  store.set('sarah.waistline', waistline)
  const waist = (1 + options.extraWaistEase) * waistline
  store.set('sarah.waistlineEased', waist)
  const seat = (1 + options.extraSeatEase) * measurements.seat
  store.set('sarah.seatEased', seat)
  const seatWaistDiff = measurements.seat - waistline
  store.set('sarah.seatWaistDiff', seatWaistDiff)
  const seatEase = seatWaistDiff * options.seatEase
  store.set('sarah.seatEase', seatEase)
  const waistEaseFront = options.waistEaseFront * seatWaistDiff
  store.set('sarah.waistEaseFront', waistEaseFront)
  const waistToSeat = measurements.waistToSeat - options.waistDrop * measurements.waistToHips
  store.set('sarah.waistToSeat', waistToSeat)
  const frontDartWidth = waistEaseFront
  store.set('sarah.frontDartWidth', frontDartWidth)
  const frontDartHalf = frontDartWidth / 2
  const waistEaseBack = options.waistEaseBack * seatWaistDiff
  store.set('sarah.waistEaseBack', waistEaseBack)
  const waistRise = options.waistRise * seatWaistDiff
  store.set('sarah.waistRise', waistRise)
  const backDartHalf = waistEaseBack / 4
  const backOutsideDartLength = options.backOutsideDartLength * waistToSeat
  store.set('sarah.backOutsideDartLength', backOutsideDartLength)
  const backInsideDartLength = options.backInsideDartLength * waistToSeat
  store.set('sarah.backInsideDartLength', backInsideDartLength)
  const frontDartLength = options.frontDartLength * waistToSeat
  store.set('sarah.frontDartLength', frontDartLength)
  const sLength =
    options.length * (measurements.waistToFloor - -options.waistDrop * measurements.waistToHips)
  store.set('sarah.length', sLength)
  const sideSeamCurveOffset = options.sideSeamCurveOffset * seatWaistDiff
  const hem = options.hem * (sa ? sa : 10)

  store.set('sarah.hem', hem)
  const qWaistBack = waist / 4 + waistEaseBack
  const qWaistFront = waist / 4 + waistEaseFront

  points.cbTop = new Point(0, 0)
  points.cbSeat = points.cbTop.shift(270, waistToSeat)
  points.cbBottom = points.cbTop.shift(270, sLength)

  points.sideBottom = points.cbBottom.shift(0, seat / 4 + seatEase)
  points.sideSeat = points.cbSeat.shift(0, seat / 4 + seatEase)

  points.sbWaist = new Point(qWaistBack, 0)
  points.sbTop = points.sbWaist.shift(90, waistRise)

  points.backInsideDartCenter = points.cbTop.shiftFractionTowards(points.sbTop, 1 / 3)
  points.backInsideDartBottom = points.backInsideDartCenter.shift(
    points.backInsideDartCenter.angle(points.cbTop) + 90,
    backInsideDartLength
  )

  points.backOutsideDartCenter = points.cbTop.shiftFractionTowards(points.sbTop, 2 / 3)
  points.backOutsideDartBottom = points.backOutsideDartCenter.shift(
    points.backOutsideDartCenter.angle(points.cbTop) + 90,
    backOutsideDartLength
  )

  points.backInsideDartLeft = points.backInsideDartCenter.shiftTowards(points.cbTop, backDartHalf)
  points.backInsideDartRight = points.backInsideDartCenter.shiftTowards(points.sbTop, backDartHalf)
  points.backOutsideDartLeft = points.backOutsideDartCenter.shiftTowards(points.cbTop, backDartHalf)
  points.backOutsideDartRight = points.backOutsideDartCenter.shiftTowards(
    points.sbTop,
    backDartHalf
  )

  const cbt2bidl = points.cbTop.dist(points.backInsideDartLeft)
  const bidr2bodl = points.backInsideDartRight.dist(points.backOutsideDartLeft)
  const bodr2sbt = points.backOutsideDartRight.dist(points.sbTop)

  points.cbTopCp = points.cbTop.shiftTowards(points.sbWaist, cbt2bidl * 0.5 * cbqc)
  points.bidLCp = points.backInsideDartLeft.shift(
    points.backInsideDartLeft.angle(points.backInsideDartBottom) + -90,
    cbt2bidl * 0.5 * cbqc
  )
  points.bidRCp = points.backInsideDartRight.shift(
    points.backInsideDartRight.angle(points.backInsideDartBottom) + 90,
    bidr2bodl * 0.5 * cbqc
  )
  points.bodLCp = points.backOutsideDartLeft.shift(
    points.backOutsideDartLeft.angle(points.backOutsideDartBottom) + -90,
    bidr2bodl * 0.5 * cbqc
  )
  points.bodRCp = points.backOutsideDartRight.shift(
    points.backOutsideDartRight.angle(points.backOutsideDartBottom) + 90,
    bodr2sbt * 0.5 * cbqc
  )
  points.sbtCp = points.sbTop.shift(
    points.sbTop.angle(points.sideSeat) + -90,
    bodr2sbt * 0.5 * cbqc
  )

  points.ssh = points.sbTop.shiftFractionTowards(points.sideSeat, 0.5)
  const sbt2ssh = points.sbTop.dist(points.ssh)
  points.sshCpC = points.ssh.shift(points.ssh.angle(points.sbTop) + 270, sideSeamCurveOffset)
  points.sshTCp = points.sshCpC.shift(
    points.sshCpC.angle(points.ssh) + 270,
    points.sbTop.dist(points.ssh) * 0.5 * cbqc
  )
  points.sshBCp = points.sshCpC.shift(
    points.sshCpC.angle(points.ssh) + 90,
    points.ssh.dist(points.sideSeat) * 0.5 * cbqc
  )

  points.cfTop = points.cbTop.shift(0, measurements.seat / 2 + seatEase)
  points.cfSeat = points.cfTop.shift(-90, waistToSeat)
  points.cfBottom = points.cfTop.shift(-90, sLength)
  points.sfWaist = points.cfTop.shiftTowards(points.cbTop, qWaistFront)
  points.sfTop = points.sfWaist.shift(90, waistRise)

  points.frontDartCenter = points.sfTop.shiftFractionTowards(points.cfTop, 1 / 3)
  points.frontDartBottom = points.frontDartCenter.shift(
    points.frontDartCenter.angle(points.cfTop) + -90,
    frontDartLength
  )

  points.frontDartRight = points.frontDartCenter.shiftTowards(points.cfTop, frontDartHalf)
  points.frontDartLeft = points.frontDartCenter.shiftTowards(points.sfTop, frontDartHalf)

  const sft2fdl = points.sfTop.dist(points.frontDartLeft)
  const cft2fdr = points.cfTop.dist(points.frontDartRight)

  points.fdrCp = points.frontDartRight.shift(
    points.frontDartRight.angle(points.frontDartBottom) + 90,
    cft2fdr * 0.5 * cbqc
  )
  points.sftCp = points.sfTop.shift(points.sfTop.angle(points.sideSeat) + 90, sft2fdl * 0.5 * cbqc)
  points.fdlCp = points.frontDartLeft.shift(
    points.frontDartLeft.angle(points.frontDartBottom) + -90,
    sft2fdl * 0.5 * cbqc
  )
  points.cftCp = points.cfTop.shiftTowards(points.sfWaist, cft2fdr * 0.5 * cbqc)

  points.sfh = points.sideSeat.shiftFractionTowards(points.sfTop, 0.5)
  points.sfhCpC = points.sfh.shift(points.sfh.angle(points.sideSeat) + -90, sideSeamCurveOffset)
  points.sfhTCp = points.sfhCpC.shift(
    points.sfhCpC.angle(points.sfh) + 90,
    points.sfh.dist(points.sfTop) * 0.5 * cbqc
  )
  points.sfhBCp = points.sfhCpC.shift(
    points.sfhCpC.angle(points.sfh) + -90,
    points.sfh.dist(points.sideSeat) * 0.5 * cbqc
  )
  return part
}

export const base = {
  name: 'sarah.base',
  draft: draftBase,
  hide: { self: true },
  measurements: ['waist', 'seat', 'waistToSeat', 'waistToFloor', 'hips', 'waistToHips'],
  options: {
    paperlessOffset: 15,
    showExpandNotification: true,
    centerFrontSeam: {
      bool: false,
      menu: 'style',
    },
    centerBackSeam: {
      bool: false,
      menu: 'style',
    },
    waistDrop: {
      pct: 0,
      min: 0,
      max: 100,
      menu: 'style',
    },
    seatEase: {
      pct: 6.25,
      min: 0,
      max: 20,
      ...pctWaistlineSeatDiff(),
      menu: 'advanced',
    },
    waistEaseFront: {
      pct: 10,
      min: 0,
      max: 20,
      ...pctWaistlineSeatDiff(),
      menu: 'advanced',
    },
    waistEaseBack: {
      pct: 17,
      min: 0,
      max: 30,
      ...pctWaistlineSeatDiff(),
      menu: 'advanced',
    },
    extraSeatEase: {
      pct: 0,
      min: -20,
      max: 20,
      ...pctBasedOn('seat'),
      menu: 'fit',
    },
    extraWaistEase: {
      pct: 0,
      min: -20,
      max: 20,
      ...pctWaistline(),
      menu: 'fit',
    },
    waistRise: {
      pct: 6,
      min: 0,
      max: 10,
      ...pctWaistlineSeatDiff(),
      menu: 'advanced',
    },
    sideSeamCurveOffset: {
      pct: 2.5,
      min: 0,
      max: 5,
      ...pctWaistlineSeatDiff(),
      menu: 'advanced',
    },
    backOutsideDartLength: {
      pct: 63,
      min: 50,
      max: 75,
      ...pctWaistlineToSeat(),
      menu: 'advanced',
    },
    backInsideDartLength: {
      pct: 68,
      min: 50,
      max: 75,
      ...pctWaistlineToSeat(),
      menu: 'advanced',
    },
    frontDartLength: { pct: 58, min: 40, max: 80, ...pctWaistlineToSeat(), menu: 'advanced' },
    length: { pct: 100, min: 25, max: 100, ...pctWaistlineToFloor(), menu: 'style' },
    hem: {
      pct: 300,
      min: 100,
      max: 900,
      fromAbs: function (mm, settings) {
        return mm / (settings.sa ? settings.sa : 10)
      },
      toAbs: function (pct, settings) {
        return pct * (settings.sa ? settings.sa : 10)
      },
      menu: (sa) => (sa ? 'style' : null),
    },
  },
}
