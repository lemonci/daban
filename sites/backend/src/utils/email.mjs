import axios from 'axios'
import mustache from 'mustache'
import { templates } from '../templates/email/index.mjs'

/*
 * Exporting this closure that makes sure we have access to the
 * instantiated config
 */
export const mailer = (config, log) => ({
  email: {
    send: (params) => {
      // Make sure we have what it takes
      if (!params.template || !params.to || typeof templates[params.template] === 'undefined') {
        if (!params.to) log.warn(`A To: address is mandatory when sending email`)
        else log.warn(`Tried to email invalid template: ${params.template}`)
        return false
      }

      /*
       * We allow overriding this in settings to load a different email provider
       * We also use this same mechanism to mock this in unit tests
       */
      return typeof config.email.handler === 'function'
        ? config.email.handler(config, params, log)
        : sendEmailViaScaleway(config, params, log)
    },
  },
})

/*
 * This sends an email via the Scaleway Transactional Email API
 *
 * If you want to use another way to send email, change the mailer
 * assignment above to point to another method to deliver email
 */
async function sendEmailViaScaleway(config, { template, to, replacements = {} }, log) {
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
    result = await axios.post(
      `https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails`,
      {
        from: {
          name: 'FreeSewing',
          email: `no-reply@${config.email.domain}`,
        },
        to: [{ name: to, email: to }],
        subject,
        text: mustache.render(text, replace),
        html: mustache.render(html, replace),
        project_id: config.email.project,
        domain_name: config.email.domain,
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
    log.error(`Failed to POST email data to Scaleway: ${err.message}`)
  }

  return result.status === 200
}
