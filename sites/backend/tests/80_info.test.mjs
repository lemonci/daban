import { api, auth, cat, store, loadStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe(`Info tests`, () => {
  it(`Should get the stats endpoint)`, async () => {
    const [status, data] = await api.get('/info/stats')
    assert.equal(status, 200)
    assert.equal(typeof data.activity.jwt, 'number')
    assert.equal(typeof data.activity.key, 'number')
    assert.equal(typeof data.user, 'number')
    assert.equal(typeof data.pattern, 'number')
    assert.equal(typeof data.set, 'number')
    assert.equal(typeof data.curatedSet, 'number')
  })
  it(`Should get the users endpoint)`, async () => {
    const [status, data] = await api.get('/info/users')
    assert.equal(status, 200)
    assert.equal(typeof data.users, 'number')
  })
  it(`Should get the authors endpoint)`, async () => {
    const [status, data] = await api.get('/info/authors')
    console.log({ status, data })
    assert.equal(status, 200)
    assert.equal(typeof data.users, 'number')
  })
})
