import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const emailchange = {
  subject: '[FreeSewing] Confirm your new E-mail address',
  html: wrap.html(
    [
      h2('Does this new E-mail address work?'),
      p('To confirm your email address change, click the link below:'),
      link({ link: '{{{ actionUrl }}}', text: 'Confirm E-mail change' }),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

To confirm your new email address, visit the link below:

{{{ actionUrl }}}

`),
}
