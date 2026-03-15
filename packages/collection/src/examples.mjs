import { urls } from '@freesewing/config'

export const designExampleHrefs = {}
for (const [design, id] of Object.entries(designExampleIds)) {
  designExampleHrefs[design] = `${urls.cdn}/designs/${design}.webp`
}
