import { hash } from '../utils/crypto.mjs'
import { clean, i18nUrl, websiteUrl } from '../utils/index.mjs'
import { decorateModel } from '../utils/model-decorator.mjs'

/*
 * This model handles all user updates
 */
export function SubscriberModel(tools) {
  return decorateModel(this, tools, {
    name: 'subscriber',
    encryptedFields: ['email'],
    models: ['user'],
  })
}

/*
 * Creates a new subscriber - Takes user input so we need to validate it
 * This is an unauthenticated route
 *
 * @param {body} object - The request body
 * @returns {SubscriberModal} object - The SubscriberModel
 */
SubscriberModel.prototype.guardedCreate = async function ({ body }) {
  /*
   * Is email set and a string?
   */
  if (!body.email || typeof body.email !== 'string') return this.setResponse(400, 'emailMissing')

  /*
   * Is language set and a known language?
   */
  if (!body.language || !this.config.languages.includes(body.language.toLowerCase()))
    return this.setResponse(400, 'languageMissing')

  /*
   * Clean (lowercase + trim) the email address and hash it
   */
  const email = clean(body.email)
  const ehash = hash(email)

  /*
   * Lowercase the language
   */
  const language = body.language.toLowerCase()

  /*
   * Attempt to read existing subscriber record for this email address
   */
  let newSubscriber = false
  await this.read({ ehash })

  /*
   * If no record can be found, create a new subscriber record.
   */
  if (!this.record) await this.createRecord({ ehash, email, language, active: false })

  /*
   * Construct the various URLs for the outgoing email
   */
  const actionUrl = i18nUrl(
    body.language,
    `/newsletter/${this.record.active ? 'un' : ''}subscribe?id=${this.record.id}`
  )

  /*
   * Send out confirmation email
   */
  const template = newSubscriber ? 'nlsub' : this.record.active ? 'nlsubact' : 'nlsub'
  await this.mailer.send({
    template,
    language,
    to: email,
    replacements: {
      email,
      actionUrl,
    },
  })

  /*
   * Prepare the return data
   */
  const returnData = { email }

  /*
   * Return 200 and the data
   */
  return this.setResponse200({ data: returnData })
}

/*
 * Confirms a pending subscription
 * This is an unauthenticated route
 *
 * @param {body} object - The request body
 * @returns {SubscriberModal} object - The SubscriberModel
 */
SubscriberModel.prototype.subscribeConfirm = async function ({ body }) {
  /*
   * Validate input and load subscription record
   */
  await this.verifySubscription(body)

  /*
   * If a status code is already set, do not continue
   */
  if (this.response?.status) return this

  /*
   * Update the status if the subscription is not active
   */
  if (this.record.active !== true) await this.update({ active: true })

  /*
   * Return 200
   */
  return this.setResponse200()
}

/*
 * Unsubscribe a user
 * This is an unauthenticated route (has to for newsletter subscribers might not be users)
 *
 * @param {body} object - The request body
 * @returns {SubscriberModal} object - The SubscriberModel
 */
SubscriberModel.prototype.unsubscribe = async function ({ params }) {
  /*
   * Is uuid set?
   */
  if (!params.uuid) return this.setResponse(400, 'uuidMissing')

  const { uuid } = params

  /*
   * Find the subscription record. Note that we use the UUID in the id field.
   */
  await this.read({ id: uuid })

  /*
   * If found, remove the record
   */
  if (this.record) {
    await this.delete({ id: this.record.id })

    return this.setResponse(204)
  } else {
    /*
     * If not, perhaps it's an account uuid rather than subscriber id
     */
    await this.User.read({ uuid })
    if (this.User.record) {
      await this.User.update({ newsletter: false })

      return this.setResponse(204)
    }
  }

  /*
   * Return 404
   */
  return this.setResponse(404)
}

/*
 * One-click unsubscribe a user
 * This is an unauthenticated route (has to for newsletter subscribers might not be users)
 *
 * @param {body} object - The request body
 * @returns {SubscriberModal} object - The SubscriberModel
 */
SubscriberModel.prototype.ocunsub = async function ({ params }) {
  const { ehash } = params

  /*
   * Find the subscription record
   */
  await this.read({ ehash })

  /*
   * If found, remove the record
   */
  if (this.record) {
    await this.delete({ id: this.record.id })

    return true
  } else {
    /*
     * If not, perhaps it's an account ehash rather than subscriber ehash
     */
    await this.User.read({ ehash })
    if (this.User.record) {
      await this.User.update({ newsletter: false })

      return true
    }
  }

  return false
}

/*
 * A helper method to validate input and load the subscription record
 *
 * @param {body} object - The request body
 * @returns {SubscriberModal} object - The SubscriberModel
 */
SubscriberModel.prototype.verifySubscription = async function (body) {
  /*
   * Get the uuid from the body
   */
  const { uuid } = body

  /*
   * Is id set?
   */
  if (!uuid) return this.setResponse(400, 'uuidMissing')

  /*
   * Find the subscription record
   */
  await this.read({ id: uuid })

  /*
   * If it is not found, return 404
   */
  if (!this.record) return this.setResponse(404)

  return this
}

/*
 * Searches for subscribers
 *
 * @param {body} object - The request body
 * @returns {UserModel} object - The UserModel
 */
SubscriberModel.prototype.search = async function (q = {}) {
  /*
   * Find subscribers based on passed query
   */
  let subscribers
  try {
    subscribers = await this.prisma.subscriber.findMany({
      where: q,
    })
  } catch (err) {
    this.log.error(`Error while searching subscriber: ${err.message}`)
    subscribers = []
  }

  return subscribers
}
