import { back as toniBack } from '@freesewing/toni'

function tinaBack({ part }) {
  // TODO: Eliminate this part?
  return part
}

export const back = {
  name: 'tina.back',
  from: toniBack,
  hide: { from: true },
  options: {},
  draft: tinaBack,
}
