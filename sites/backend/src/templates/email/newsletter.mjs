import { link, p, small, h2, check, wrap } from './shared/blocks.mjs'

export const nlsub = {
  subject: '[FreeSewing] Confirm your FreeSewing newsletter subscription',
  html: wrap.html(
    [
      h2('Please confirm your newsletter subscription'),
      p(
        'To subscribe <b>{{ email }}</b> to the FreeSewing newsletter, please click the link below:'
      ),
      link({ link: '{{{ actionUrl }}}', text: 'Confirm newsletter subscription' }),
      p(
        `Reminder: The FreeSewing newsletter goes out once every 3 months. So 4 times per year. You can unsubscribe at any moment.`
      ),
      small(
        `PS: If you did not expect this email, you can safely ignore it.  Nothing will happen if you take no action.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

Please confirm your subscription to the FreeSewing newsletter by clicking the link below:

{{{ actionUrl }}}

Reminder: The FreeSewing newsletter goes out once every 3 months. So 4 times per year. You can unsubscribe at any moment.


PS: If you did not expect this email, you can safely ignore it. Nothing will happen if you take no action.
`),
}

export const nlsubact = {
  subject: '[FreeSewing] Your are already subscribed to the FreeSewing',
  html: wrap.html(
    [
      h2('Nothing needs to be done'),
      p('Since you are already subscribed to the FreeSewing newsletter, there is nothing to do.'),
      p(
        `Reminder: The FreeSewing newsletter goes out once every 3 months. So 4 times per year. You can unsubscribe at any moment.`
      ),
    ].join('\n')
  ),
  text: wrap.text(`
Hello,

Since you are already subscribed to the FreeSewing newsletter, there is nothing to do.

Reminder: The FreeSewing newsletter goes out once every 3 months. So 4 times per year. You can unsubscribe at any moment.
`),
}
