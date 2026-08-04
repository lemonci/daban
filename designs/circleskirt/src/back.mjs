import { panelMeasurements, panelOptions, draftPanel } from './shared.mjs'

export const back = {
  name: 'circleskirt.back',
  measurements: panelMeasurements,
  options: panelOptions,
  draft: (sh) => draftPanel(sh, 'cb', 1),
}
