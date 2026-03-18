import axios from 'axios'
import mustache from 'mustache'
import { templates } from '../templates/email/index.mjs'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { log } from './log.mjs'

/*
 * Exporting this closure that makes sure we have access to the
 * instantiated config
 */
export const mailer = (config) => ({
  email: {
    //send: (params) => sendEmailViaAwsSes(config, params),
    send: (params) => sendEmailViaScaleway(config, params),
  },
})

/*
 * The code below handles delivery via AWS SES
 *
 * If you want to use another way to send email, change the mailer
 * assignment above to point to another method to deliver email
 */
async function sendEmailViaAwsSes(
  config,
  { template, to, cc = false, replacements = {}, subject = false }
) {
  // Make sure we have what it takes
  if (!template || !to || typeof templates[template] === 'undefined') {
    if (!to) log.warn(`A To: address is mandatory when sending email`)
    else log.warn(`Tried to email invalid template: ${template}`)
    return false
  }

  if (!cc) cc = []
  if (typeof cc === 'string') cc = [cc]
  if (Array.isArray(config.aws.ses.cc) && config.aws.ses.cc.length > 0)
    cc = [...new Set([...cc, ...config.aws.ses.cc])]

  log.info(`Emailing template ${template} to ${to}`)

  // Load template
  const { html, text } = templates[template]
  const replace = {
    website: `FreeSewing.eu`,
    email: to,
    ...templates[template].replacements,
    ...replacements,
  }

  // IMHO the AWS apis are a complete clusterfuck
  const client = new SESv2Client({ region: config.aws.ses.region })
  const command = new SendEmailCommand({
    ConfigurationSetName: 'backend',
    Content: {
      Simple: {
        Body: {
          Text: {
            Charset: 'utf-8',
            Data: mustache.render(text, replace),
          },
          Html: {
            Charset: 'utf-8',
            Data: mustache.render(html, replace),
          },
        },
        Subject: {
          Charset: 'utf-8',
          Data: subject || replace.subject,
        },
      },
    },
    Destination: {
      ToAddresses: [to],
      CcAddresses: cc,
      BccAddresses: config.aws.ses.bcc || [],
    },
    FeedbackForwardingEmailAddress: config.aws.ses.feedback,
    FromEmailAddress: config.aws.ses.from,
    ReplyToAddresses: config.aws.ses.replyTo || [],
  })
  let result
  try {
    result = await client.send(command)
  } catch (err) {
    console.log(err)
    return false
  }

  return result['$metadata']?.httpStatusCode === 200
}

/*
 * This sends an email via the Scaleway Transactional Email API
 *
 * If you want to use another way to send email, change the mailer
 * assignment above to point to another method to deliver email
 */
async function sendEmailViaScaleway(config, { template, to, replacements = {} }) {
  log.info(`Emailing template ${template} to ${to}`)

  // Load template
  const { html, text, subject } = templates[template]
  const replace = {
    website: `FreeSewing.eu`,
    email: to,
    ...templates[template].replacements,
    ...replacements,
  }

  let result
  try {
    result = axios.post(
      `https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails`,
      {
        from: {
          name: 'FreeSewing',
          email: 'no-reply@notifications.freesewing.eu',
        },
        to: [{ name: to, email: to }],
        subject,
        text: mustache.render(text, replace),
        html: mustache.render(html, replace),
        project_id: config.email.project,
        domain_name: 'notifications.freesewing.eu',
        additional_headers: [
          {
            key: 'Reply-To',
            value: 'support@freesewing.eu',
          },
        ],
      },
      {
        headers: {
          'X-Auth-Token': config.email.token,
        },
      }
    )
  } catch (err) {
    console.log(err)
  }

  return result.status === 200
}
