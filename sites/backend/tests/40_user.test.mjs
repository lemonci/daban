import { api, auth, cat, store, loadStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe(`Check for available usernames`, () => {
  it(`Should find an available username (jwt)`, async () => {
    // Ensure we have an account to test with
    if (!store.account.confirmation) loadStore(store)
    const body = {
      username: 'heixiaomao (better add some text in case someone registers this username)',
    }
    const [status, data] = await api.post(`/available/username/jwt`, body, auth.jwt())
    assert.equal(status, 404)
  })

  it(`Should find an unavailable username (jwt)`, async () => {
    const body = { username: store.account.username }
    const [status, data] = await api.post(`/available/username/jwt`, body, auth.jwt())
    assert.equal(status, 200)
    assert.equal(data.available, false)
  })
})
