import { log } from '../utils/log.mjs'
import { decorateModel } from '../utils/model-decorator.mjs'

/*
 * This model handles all set updates (typically that involves sending out emails)
 */
export function SetModel(tools) {
  return decorateModel(this, tools, {
    name: 'set',
    encryptedFields: ['measies', 'name', 'notes'],
    jsonFields: ['measies'],
  })
}

/*
 * Creates a set - Uses user input so we need to validate it
 *
 * @params {body} object - The request body
 * @params {user} object - The user as provided by the auth middleware
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.guardedCreate = async function ({ body, user }) {
  /*
   * Enforce RBAC
   */
  if (!this.rbac.writeSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Do we have a POST body?
   */
  if (Object.keys(body).length < 1) return this.setResponse(400, 'postBodyMissing')

  /*
   * Is name set?
   */
  if (!body.name || typeof body.name !== 'string') return this.setResponse(400, 'nameMissing')

  /*
   * Create the initial record
   */
  await this.createRecord({
    name: body.name.length > 0 ? body.name : '--',
    notes: typeof body.notes === 'string' && body.notes.length > 0 ? body.notes : '--',
    public: body.public === true ? true : false,
    measies: typeof body.measies === 'object' ? this.sanitizeMeasurements(body.measies) : {},
    imperial: body.imperial === true ? true : false,
    userId: user.apikey ? user.userId : user.id,
    img: this.config.avatars.set,
  })

  /*
   * Re-read the record to pick up the UUID set by the database trigger
   */
  try {
    await this.read({ id: this.record.id })
  } catch (err) {
    log.warn(err.message)
    return this.setResponse(500, {})
  }

  /*
   * If an image was provided, save it to disk using the UUID
   */
  if (typeof body.img === 'string') {
    let imgResult = false
    try {
      imgResult = await this.img.save(this.record.uuid, body.img)
    } catch (err) {
      log.warn(`Failed to save set avatar: ${err.message}`)
    }
    if (!imgResult) return this.setResponse(500)
  }

  /*
   * Now return 201 and the data
   */
  return this.setResponse201({ set: this.asSet() })
}

/*
 * Loads a measurements set from the database based on the where clause you pass it
 * In addition prepares it for returning the set data
 *
 * @params {params} object - The request (URL) parameters
 * @params {user} object - The user as provided by the auth middleware
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.guardedRead = async function ({ params, user }) {
  /*
   * If the set is public, we do not need to enforce RBAC
   * So let's load it first
   */
  await this.read({ uuid: params.uuid })

  /*
   * If it does not exist, send a 404
   */
  if (!this.record) return this.setResponse(404)

  /*
   * If it's public, return early
   */
  if (this.record?.public)
    return this.setResponse(200, false, {
      result: 'success',
      set: this.asSet(),
    })

  /*
   * If it's not public, enforce RBAC
   */
  if (!this.rbac.readSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * You need to have at least the bughunter role to read other user's sets
   */
  if (
    // For an API key, we need to match record.userId to user.userId
    ((user.apikey && this.record.userId !== user.userId) ||
      // For a JWT, we need to match record.userId to user.id
      (!user.apikey && this.record.userId !== user.id)) &&
    !this.rbac.bughunter(user)
  )
    return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Return 200 and send the pattern data
   */
  return this.setResponse(200, false, {
    result: 'success',
    set: this.asSet(),
  })
}

/*
 * Loads a measurements set from the database but only if it's public
 * This is a public route (no authentication)
 *
 * @params {params} object - The request (URL) parameters
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.publicRead = async function ({ params }) {
  /*
   * Attemp to read the record from the database
   */
  await this.read({ uuid: params.uuid })

  /*
   * If it is not public, return 404 rather than
   * reveal that a non-public set exists
   */
  if (this.record.public !== true) return this.setResponse(404)

  /*
   * Return 200 and the set data
   */
  return this.setResponse200(this.asPublicSet())
}

/*
 * Clones a measurements set
 * In addition prepares it for returning the set data
 *
 * @params {params} object - The request (URL) parameters
 * @params {user} object - The user as provided by the auth middleware
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.guardedClone = async function ({ params, user }) {
  /*
   * Enforce RBAC
   */
  if (!this.rbac.writeSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Attempt to read the record from the database
   */
  await this.read({ uuid: params.uuid })

  /*
   * If it does not exist, send a 404
   */
  if (!this.record) return this.setResponse(404)

  /*
   * You need at least the support role to clone another user's (non-public) set
   */
  if (
    !this.record.public &&
    // For an API key, we need to match record.userId to user.userId
    ((user.apikey && this.record.userId !== user.userId) ||
      // For a JWT, we need to match record.userId to user.id
      (!user.apikey && this.record.userId !== user.id)) &&
    !this.rbac.support(user)
  )
    return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Now clone the set
   */
  const data = this.asSet()
  delete data.id
  delete data.uuid
  data.name += ` (cloned from #${this.record.uuid})`
  data.notes += ` (Note: This measurements set was cloned from set ${this.record.uuid})`
  data.userId = user.apikey ? user.userId : user.id
  await this.createRecord(data)

  /*
   * Return 200 and the cloned data
   */
  return this.setResponse201({ set: this.asSet() })
}

/*
 * Helper method to decrypt data from a non-instantiated set
 *
 * @param {mset} object - The set data
 * @returns {mset} object - The unencrypted data
 */
SetModel.prototype.revealSet = function (mset) {
  const clear = {}
  for (const field of this.encryptedFields) {
    try {
      clear[field] = this.decrypt(mset[field])
    } catch (err) {
      //console.log(err)
    }
  }
  for (const field of this.jsonFields) {
    try {
      clear[field] = JSON.parse(clear[field])
    } catch (err) {
      //console.log(err)
    }
  }

  return { ...mset, ...clear }
}

/*
 * Updates the set data - Used when we pass through user-provided data
 * so we can't be certain it's safe
 *
 * @params {params} object - The request (URL) parameters
 * @params {body} object - The request body
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.guardedUpdate = async function ({ params, body, user }) {
  /*
   * Enforce RBAC
   */
  if (!this.rbac.writeSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Attempt to read record from database
   */
  await this.read({ uuid: params.uuid })

  /*
   * If it does not exist, send a 404
   */
  if (!this.record) return this.setResponse(404)

  /*
   * Only admins can update other user's sets
   */
  if (
    // For an API key, we need to match record.userId to user.userId
    ((user.apikey && this.record.userId !== user.userId) ||
      // For a JWT, we need to match record.userId to user.id
      (!user.apikey && this.record.userId !== user.id)) &&
    !this.rbac.admin(user)
  )
    return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Prepare data to update the record
   */
  const data = {}

  /*
   * imperial
   */
  if (body.imperial === true || body.imperial === false) data.imperial = body.imperial

  /*
   * name
   */
  if (typeof body.name === 'string') data.name = body.name

  /*
   * notes
   */
  if (typeof body.notes === 'string') data.notes = body.notes

  /*
   * public
   */
  if (body.public === true || body.public === false) data.public = body.public

  /*
   * measurements
   */
  if (typeof body.measies === 'object')
    data.measies = this.sanitizeMeasurements({
      ...this.clear.measies,
      ...body.measies,
    })

  /*
   * Image (img)
   */
  if (typeof body.img === 'string') {
    let imgResult = false
    try {
      imgResult = await this.img.save(this.record.uuid, body.img)
    } catch (err) {
      log.warn(`Failed to save set avatar: ${err.message}`)
    }
    if (!imgResult) return this.setResponse(500)
  }

  /*
   * Now update the database record
   */
  await this.update(data)

  /*
   * Return 200 and the record data
   */
  return this.setResponse200({ set: this.asSet() })
}

/*
 * Removes the set - Checks permissions
 *
 * @params {params} object - The request (URL) parameters
 * @params {user} object - The user as provided by the auth middleware
 * @returns {SetModel} object - The SetModel
 */
SetModel.prototype.guardedDelete = async function ({ params, user }) {
  /*
   * Enforce RBAC
   */
  if (!this.rbac.writeSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Attempt to read the record from the database
   */
  await this.read({ uuid: params.uuid })

  /*
   * You need to be admin to remove another user's data
   */
  if (
    // For an API key, we need to match record.userId to user.userId
    ((user.apikey && this.record.userId !== user.userId) ||
      // For a JWT, we need to match record.userId to user.id
      (!user.apikey && this.record.userId !== user.id)) &&
    !this.rbac.admin(user)
  )
    return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Delete the record
   */
  await this.delete()

  /*
   * Return 204
   */
  return this.setResponse(204, false)
}

/*
 * Returns a list of sets for the user making the API call
 */
SetModel.prototype.userSets = async function (user) {
  if (!user.id) return false
  let sets
  try {
    sets = await this.prisma.set.findMany({ where: { userId: user.id } })
  } catch (err) {
    log.warn(`Failed to search sets for user ${user.id}: ${err}`)
  }

  return sets.map((set) => {
    const val = this.revealSet(set)
    delete val.id
    delete val.userId
    val.userUuid = user.uuid

    return val
  })
}

/*
 * Returns record data
 */
SetModel.prototype.asSet = function () {
  const data = {
    ...this.record,
    ...this.clear,
  }
  delete data.id
  delete data.userId

  return data
}

/*
 * Returns record data fit for public publishing
 */
SetModel.prototype.asPublicSet = function () {
  const data = {
    author: 'FreeSewing.org',
    type: 'measurementsSet',
    about: 'Contains measurements in mm as well as metadata',
    ...this.asSet(),
  }
  data.measurements = data.measies
  delete data.measies
  data.units = data.imperial ? 'imperial' : 'metric'
  delete data.imperial
  delete data.public

  return data
}
