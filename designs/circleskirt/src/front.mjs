import { panelMeasurements, panelOptions, draftPanel } from './shared.mjs'

export const front = {
  name: 'circleskirt.front',
  measurements: panelMeasurements,
  options: panelOptions,
  draft: (sh) => draftPanel(sh, 'cf', 2),
}
