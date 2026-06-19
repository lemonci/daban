import { backPoints } from '@freesewing/noble'
import { frontArmholeCalculation } from './frontarmholecalculation.mjs'

function calculate({ paths, store, part }) {
  // NOTE: this part does not draw anything but calculates the length of the back armhole

  store.set('library.sleeve.backArmholeLength', paths.armhole.length())
  // 'backArmholeToArmholePitch' determines notch placement
  store.set(
    'library.sleeve.backArmholeToArmholePitch',
    paths.armhole.length() * (1 - store.get('backArmholeDartPosition'))
  )

  return part.hide()
}

export const backArmholeCalculation = {
  name: 'backArmholeCalculation',
  from: backPoints,
  after: frontArmholeCalculation,
  draft: calculate,
}
