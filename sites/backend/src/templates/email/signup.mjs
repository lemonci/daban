import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const signup = {
  subject: '[FreeSewing] You are invited to join FreeSewing',
  html: wrap.html(
    [
      h2('This is your personal FreeSewing invite'),
      p('This is an invite to create a FreeSewing account.'),
      p('Your personal confirmation code is:'),
      check('{{{ check }}}'),
      link({ link: '{{{ actionUrl }}}', text: 'Create a FreeSewing account' }),
      p(
        `To accept this invite, click the link above, and enter your confirmation code (<b>{{{ check }}}</b>).`
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it.  Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

This is an invite to create a FreeSewing account.

Your personal confirmation code is: {{{ check }}}

To accept this invite, visit the URL below, and enter your confirmation code ({{{ check }}}) :

{{{ actionUrl }}}

love,
joost

PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}
