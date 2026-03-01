import { hash } from '../utils/crypto.mjs'
import { codeberg as config } from '../config.mjs'

/*
 * Sometimes we'd like to cache responses.
 * This is a poor man's cache
 */
const cache = {}
const fresh = 1800000 // 30 minutes

/*
 * Helper method to run a requests against the Codeberg API
 * with built-in caching
 */
const cachedApiRequest = async (method, url, body = false, success = 200) => {
  const id = hash(JSON.stringify({ method, url, body, success }))
  const now = Date.now()

  /*
   * Is this reponse cached?
   */
  if (cache[id]) {
    /*
     * It is. But Is it fresh?
     */
    if (cache[id].timestamp && now - cache[id].timestamp < fresh) return cache[id].data
    /*
     * It is in the cache, but stale. Remove cache entry
     */ else delete cache[id]
  } else {
    const data = apiRequest(method, url, body, success)
    cache[id] = { timestamp: now, data }

    return data
  }
}

/*
 * Helper method to run requests against the GitHub API
 */
const apiRequest = async (method, url, body = false, success = 200) => {
  const data = {
    method: method,
    headers: {
      Authorization: `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    },
  }
  if (body) data.body = JSON.stringify(body)

  let response
  try {
    response = await fetch(config.api + url, data)
    if (true || response.status === success) response = await response.json()
    else response = false
  } catch (error) {
    console.error('An error occurred while talking to the Codeberg API:', error.message)
    response = false
  }

  return response
}

/*
 * Creates an issue
 */
//export const createIssue = async (body) => await apiRequest('POST', `${api}/issues`, body, 201)

/*
 * Creates a file in the respository
 */
export const createFile = async ({ path, body }) =>
  await apiRequest(
    'POST',
    `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(path)}`,
    body,
    201
  )

/*
 * Gets a branch. Defaults to the default branch ('develop')
 */
export const getBranch = async (branch = 'develop') =>
  await apiRequest('GET', `/branches/${branch}`)

/*
 * Creates a new branch. Defaults to the default source branch ('develop')
 */
export const createBranch = async ({ name, from = 'develop' }) =>
  await apiRequest(
    'POST',
    `/repos/${config.owner}/${config.repo}/branches`,
    {
      new_branch_name: name,
      old_ref_name: from,
    },
    201
  )

/*
 * Creates a pull request.
 */
export const createPullRequest = async ({ title, body, head, base = 'develop' }) =>
  await apiRequest(
    'POST',
    `/repos/${config.owner}/${config.repo}/pulls`,
    {
      assignee: 'joostdecock',
      base,
      head,
      title,
      body,
    },
    201
  )

/*
 * Retrieves a list of files for a folder
 */
export const getFileList = async (path) => await cachedApiRequest('GET', `${api}/contents/${path}`)
