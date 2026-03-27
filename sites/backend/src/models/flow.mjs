import { i18nUrl } from '../utils/index.mjs'
import { decorateModel } from '../utils/model-decorator.mjs'
import { codeberg } from '../config.mjs'
import { createFile, createBranch, createPullRequest } from '../utils/codeberg.mjs'
import { sluglist } from '../../sluglist.mjs'

/*
 * This model handles all flows (typically that involves sending out emails)
 */
export function FlowModel(tools) {
  return decorateModel(this, tools, {
    name: 'flow',
    models: ['user'],
  })
}

/*
 * Upload an image
 *
 * @param {body} object - The request body
 * @param {user} object - The user as loaded by auth middleware
 * @returns {FlowModel} object - The FlowModel
 */
FlowModel.prototype.uploadImage = async function ({ body, user }) {
  // TODO: Migrate to the new image hosting
  // TODO: Sanitize input
  /*
   * Enforce RBAC
   */
  if (!this.rbac.readSome(user)) return this.setResponse(403, 'insufficientAccessLevel')

  /*
   * Do we have a POST body?
   */
  if (Object.keys(body).length < 1) return this.setResponse(400, 'postBodyMissing')

  /*
   * Is img or url set?
   */
  if (!body.img && !body.url) return this.setResponse(400, 'imgOrUrlMissing')

  /*
   * Is type set and valid?
   */
  if (!body.type) return this.setResponse(400, 'typeMissing')
  if (!['blog', 'showcase'].includes(body.type)) return this.setResponse(400, 'typeInvalid')

  /*
   * Is subId set and valid?
   */
  if (!body.subId) return this.setResponse(400, 'subIdMissing')
  if (body.subId !== 'main' && ![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(Number(body.subId)))
    return this.setResponse(400, 'subIdInvalid')

  /*
   * Is slug set?
   */
  if (!body.slug) return this.setResponse(400, 'slugMissing')

  /*
   * Prepare data for uploading the image
   */
  const data = {
    id: `${body.type}-${body.slug}${body.subId !== 'main' ? '-' + body.subId : ''}`,
    metadata: { uploadedBy: user.uuid },
  }
  if (body.img) data.b64 = body.img
  else if (body.url) data.url = body.url

  /*
   * You need to be a curator to overwrite (replace) an image.
   * Regular users can only update new images, not overwrite images.
   * If not, any user could overwrite any showcase image.
   * FIXME: To be migrated
   */
  //if (this.rbac.curator(user)) await replaceImage(data)
  //else await ensureImage(data)

  /*
   * Return 200 and the image ID
   */
  return this.setResponse200({ imgId: data.id })
}

const nonEnWarning = `

**Warning:** This was submitted by a non-English user.
Due to the way out translation software works, the original content
must alway be English. So it is possible this needs to be translated
to English prior to merging.
`

/*
 * Create a (GitHub) pull request for a new blog or showcase post
 *
 * @param {body} object - The request body
 * @param {user} object - The user as loaded by auth middleware
 * @param {type} string - One of blog or showcase
 * @returns {FlowModel} object - The FlowModel
 */
FlowModel.prototype.createPostPr = async function ({ body, user }, type) {
  /*
   * Check for required data
   */
  for (const field of ['markdown', 'slug', 'img']) {
    if (!body[field]) return this.setResponse(400, `${field}Missing`)
  }

  /*
   * Load user from the database
   */
  await this.User.read({ id: user.id })

  /*
   * First upload the main image
   */
  const imgs = {
    main: {
      id: `${type}-${body.slug}`,
      metadata: { uploadedBy: user.uuid },
      data: body.img,
    },
    extra: {},
  }
  await ensureImage(imgs.main)

  /*
   * Now handle any extra images
   */
  for (const [key, data] of Object.entries(body.extraImages || {})) {
    imgs.extra[key] = {
      id: `${type}-${body.slug}-${key}`,
      metadata: { uploadedBy: user.uuid },
      data,
    }
    await ensureImage(imgs.extra[key])
    body.markdown = body.markdown.replaceAll(
      `__EXTRA_IMAGE_${key}__`,
      cloudflareImageUrl(imgs.extra[key].id)
    )
  }

  /*
   * Create a new feature branch for this
   */
  const branchName = `${type}-${body.slug}`
  const branch = await createBranch({ name: branchName })

  /*
   * Create the file
   */
  const content = new Buffer.from(body.markdown).toString('base64')
  const data = {
    author: {
      email: codeberg.bot.email,
      name: this.User.record.username,
    },
    branch: branchName,
    committer: {
      email: codeberg.bot.email,
      name: codeberg.bot.name,
    },
    content: new Buffer.from(body.markdown).toString('base64'),
    message: `[org] feat: New ${type} post ${body.slug} by ${this.User.record.username}`,
  }
  const file = await createFile({
    body: data,
    path: `sites/org/${type}/${body.slug}/index.mdx`,
  })

  /*
   * New create the pull request
   */
  const pr = await createPullRequest({
    title: `feat: New ${type} post ${body.slug} by ${this.User.record.username}`,
    body: `Paging @joostdecock to check out this proposed ${type} post.`,
    head: branchName,
    base: 'develop',
  })

  /*
   * Return 201
   */
  return pr ? this.setResponse201(pr) : this.setResponse(400)
}

/*
 * Checks to see whether a slug is available
 *
 * @param {params} object - The request (URL) parameters
 * @param {user} object - The user as loaded by auth middleware
 * @param {type} object - The type to check (either 'blog' or 'showcase')
 * @returns {FlowModel} object - The FlowModel
 */
FlowModel.prototype.isSlugAvailable = async function ({ params }, type) {
  /*
   * Is slug set?
   */
  if (!params.slug) return this.setResponse(400, `slugMissing`)

  /*
   * Is the slug available
   */
  return sluglist[type] && sluglist[type].includes(params.slug) ? false : true
}
