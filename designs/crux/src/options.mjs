import { pctBasedOn } from '@freesewing/core'

export const curvedDarts = { bool: true, menu: 'style', order: '180' }
export const curvedDartControlAngle = 2
export const curvedDartTopControlOffset = 0.2
export const curvedDartBottomControlOffset = 0.4
export const dartPosition = 0.55

// Unused, but needed in cornelius:
export const bandBelowKnee = 0.25
export const ventLength = 0.7
export const waistbandBelowWaist = 0

// Tweaking parameters for the curves of the seams
export const pctZtoR = 0.35
export const pctRtoZin = 0.75
export const pctRtoZup = 0.25
export const pctRtoKin = 2 //{ pct: 200, min: 0, max: 200, menu: 'advanced' }
export const pctRtoKdown = 0.5 //{ pct: 50, min: 0, max: 50, menu: 'advanced' }
export const pctKtoRout = 0.08 //{ pct: 8, min: 0, max: 50, menu: 'advanced' }
export const pctKtoRup = 0.2 //{ pct: 20, min: 0, max: 50, menu: 'advanced' }
export const pctKtoH = 0.7
export const pctAtoT = 0.22

export const flyWidth = {
  pct: 3.8,
  min: 2,
  max: 6,
  ...pctBasedOn('waist'),
  menu: 'advanced',
  order: '902',
}

export const fullness = { pct: 0, min: 0, max: 25, menu: 'fit', order: '240' }

// Shifts the seam at the hips level to the front or back. Analogous to waist & waistBack
export const hipsShift = {
  pct: 0,
  min: -10,
  max: 10,
  ...pctBasedOn('hips'),
  menu: 'fit',
  order: '250',
}

export const waistbandType = {
  dflt: 'standard',
  list: ['standard', 'elastic', 'ribknit'],
  menu: 'style',
  order: '140',
}
export const waistbandLower = {
  pct: 80,
  min: 0,
  max: 100,
  ...pctBasedOn('waistToHips'),
  menu: 'style',
  order: '142',
}
export const waistBandWidth = {
  pct: 3.2,
  min: 1,
  max: 10,
  ...pctBasedOn('waistToFloor'),
  menu: 'style',
  order: '144',
}
export const waistReduction = {
  pct: 0,
  min: 0,
  max: 10,
  menu: 'fit',
  order: '202',
}

export const legLength = {
  dflt: 'long',
  list: ['long', 'capris', 'shorts', 'custom'],
  menu: 'style',
  order: '110',
}
export const legLengthCustom = {
  pct: 95,
  min: 40,
  max: 100,
  ...pctBasedOn('waistToFloor'),
  menu: (settings, mergedOptions) => (mergedOptions.legLength === 'custom' ? 'style' : false),
  order: '112',
}
export const hemType = {
  dflt: 'hem',
  // list: ['hem', 'elastic', 'ribknit'],
  list: ['hem', 'ribknit'],
  menu: (settings, mergedOptions) => (mergedOptions.legLength === 'long' ? 'style' : false),
  order: '160',
}
export const hemLength = {
  pct: 3,
  min: 1,
  max: 10,
  ...pctBasedOn('waistToFloor'),
  menu: (settings, mergedOptions) => (mergedOptions.legLength === 'capris' ? false : 'style'),
  order: '162',
}

export const articulatedKnee = {
  bool: true,
  menu: (settings, mergedOptions) =>
    mergedOptions.legLength === 'shorts'
      ? false
      : (mergedOptions.legLength === 'custom' &&
            settings.measurements.waistToKnee /
              (settings.measurements.waistToFloor * mergedOptions.legLengthCustom)) < 0.9
        ? 'style'
        : false,
  order: '150',
}
export const articulatedKneeSize = 0.15
export const articulatedKneeDartSize = 0.026
export const articulatedKneeAngle = 70

export const gussetExtraSpace = { pct: 0, min: 0, max: 100, menu: 'fit.gusset', order: '222' }
export const gussetDepth = { pct: 20, min: 5, max: 25, menu: 'fit.gusset', order: '224' }
export const gussetWidthFront = { pct: 25, min: 20, max: 50, menu: 'fit.gusset', order: '226' }
export const gussetWidthBack = { pct: 15, min: 5, max: 20, menu: 'fit.gusset', order: '228' }

export const backPocketType = {
  dflt: 'standard',
  list: ['standard', 'hole', 'square', 'diamond'],
  menu: 'style.pockets',
  order: '130',
}
export const backPocketInside = {
  bool: false,
  menu: (settings, mergedOptions) =>
    mergedOptions.backPocketType === 'square' ? false : 'style.pockets',
  order: '132',
}
export const backPocketCargo = {
  bool: false,
  menu: (settings, mergedOptions) => (mergedOptions.backPocketInside ? false : 'style.pockets'),
  order: '134',
}
export const backPocketCargoWidth = {
  pct: 2,
  min: 0.3,
  max: 5,
  ...pctBasedOn('waistToFloor'),
  menu: (settings, mergedOptions) => (mergedOptions.backPocketCargo ? 'style.pockets' : false),
  order: '136',
}

export const frontPocketType = {
  dflt: 'standard',
  // list: ['standard', 'hole', 'square', 'diamond', 'custom'],
  list: ['standard', 'hole', 'square', 'diamond'],
  menu: 'style.pockets',
  order: '120',
}
export const frontPocketInside = {
  bool: false,
  menu: 'style.pockets',
  order: '122',
}
export const frontPocketCargo = {
  bool: false,
  menu: (settings, mergedOptions) => (mergedOptions.frontPocketInside ? false : 'style.pockets'),
  order: '124',
}
export const frontPocketCargoWidth = {
  pct: 2,
  min: 0.3,
  max: 5,
  ...pctBasedOn('waistToFloor'),
  menu: (settings, mergedOptions) => (mergedOptions.frontPocketCargo ? 'style.pockets' : false),
  order: '126',
}
