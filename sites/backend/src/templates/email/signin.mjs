import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const signin = {
  subject: '[FreeSewing] Your login code',
  html: wrap.html(
    [
      h2('Welcome back to FreeSewing'),
      p('Your login code is:'),
      check('{{{ check }}}'),
      link({ link: '{{{ actionUrl }}}', text: 'Sign in toy your FreeSewing account' }),
      p(
        `To sign in to your account, click the link above, and enter your login code (<b>{{{ check }}}</b>).`
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it.  Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

Your login code is: {{{ check }}}

To sign in to your account, visit the URL below, and enter your login code ({{{ check }}}) :

{{{ actionUrl }}}

PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}
