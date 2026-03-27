import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const goodbye = {
  subject: '[FreeSewing] Farewell',
  html: wrap.html(
    [h2('Poof, gone'), p('We have removed your FreeSewing account.'), p('Farewell.')].join('\n')
  ),
  text: wrap.text(`
Hello,

This is a confirmation that we have removed your FreeSewing account.

Farewell.
`),
}
