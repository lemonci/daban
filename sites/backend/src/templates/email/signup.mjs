import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const signup = {
  subject: '[FreeSewing] Your FreeSewing invite',
  html: wrap.html(
    [
      h2('This is your FreeSewing invite'),
      p('Someone (you?) requested a FreeSewing invite for <b>{{ email }}</b>.'),
      p('This invite allows you to create a FreeSewing account.'),
      p('Your login code is:'),
      check('{{{ check }}}'),
      link({ link: '{{{ actionUrl }}}', text: 'Create a FreeSewing account' }),
      p(
        `To use this invite, click the link above, and enter your login code (<b>{{{ check }}}</b>).`
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it.  Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

This invite allows you to create a FreeSewing account.

Your login code is: {{{ check }}}

To use this invite, visit the URL below, and enter your login code ({{{ check }}}) :

{{{ actionUrl }}}

PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}

// Signup request for an AEA (Account Exists and is Aactive)
export const signupaea = {
  subject: `[FreeSewing] No need to sign up, you're already in`,
  html: wrap.html(
    [
      h2('Welcome back to FreeSewing'),
      p('Someone (you?) requested a FreeSewing invite for <b>{{ email }}</b>.'),
      p('However, we already have an active account registered for {{ email }}.'),
      p('To sign in to your existing account, you can click the link below. Your login code is:'),
      check('{{{ check }}}'),
      link({ link: '{{{ actionUrl }}}', text: 'Sign in to your FreeSewing account' }),
      p(
        `To sign in to your account, click the link above, and enter your login code (<b>{{{ check }}}</b>).`
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

Someone (you?) requested an invite for FreeSewing, but we alread have an active account registered for {{ email }}.

To sign in to your existing account, you can click the link below and enter this login code: {{ check }}

{{{ actionUrl }}}

PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}

// Signup request for an AED (Account Exists and is Disabled)
export const signupaed = {
  subject: `[FreeSewing] You cannot sign up, your account is disabled`,
  html: wrap.html(
    [
      h2('You first need to let us know you want to come back to FreeSewing'),
      p(
        'Someone (you?) requested an invite for FreeSewing, but we already have an account registered for {{ email }}.'
      ),
      p(
        'Furthermore, <b>this account is disabled</b>. Something that can happen when people revoke their consent to process their data.'
      ),
      p('If you want back in, <b>please reply to this email</b> to confirm that:'),
      small('- You want your account to be enabled'),
      small('- You grant us your consent to process your data'),
      small('- You lift any restrictions you may have imposed on the processing of your data'),
      p(
        'Without this, we have no legal basis to process your data, and thus cannot restore your account.'
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

Someone (you?) requested an invite for FreeSewing, but we alread have an account registered for {{ email }}.

Furthermore, this account is disabled.
Something that can happen when people revoke their consent to process their data.

If you want back in, please reply to this email and confirm that:
  - You want your account to be disabled'),
  - You grant us your consent to process your data'),
  - You lift any restrictions you may have imposed no the processing of your data'),

Without this, we have no legal basis to process your data, and thus cannot restore your account.

PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}
