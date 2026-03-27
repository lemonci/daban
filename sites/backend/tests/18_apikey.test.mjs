import { api, auth, cat, store, loadStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe(`API Key create/read/delete`, () => {
  for (const a of ['jwt', 'key']) {
    it(`Create API Key (${a} key)`, async () => {
      // Ensure we have an account to test with
      if (!store.account.confirmation) loadStore(store)
      const input = {
        name: 'Test API key :)',
        level: 4,
        expiresIn: 60,
      }
      const [status, data] = await api.post(`/apikeys/jwt`, input, auth.jwt())
      assert.equal(status, 201)
      assert.equal(data.result, `created`)
      assert.equal(typeof data.apikey.key, `string`)
      assert.equal(typeof data.apikey.secret, `string`)
      assert.equal(typeof data.apikey.expiresAt, `string`)
      assert.equal(data.apikey.level, input.level)
      assert.equal(data.apikey.name, input.name)
      if (typeof store.apikeys === 'undefined') store.apikeys = {}
      store.apikeys[a] = data.apikey
    })
    it(`Read API Key via whoami (${a} key)`, async () => {
      const [status, data] = await api.get(`/whoami/key`, auth.basic(store.apikeys[a]))
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      const checks = ['key', 'level', 'expiresAt', 'name', 'userId']
      checks.forEach((i) => assert.equal(data.apikey[i], store.apikeys[a][i]))
    })
    it(`Read API Key explictitly (${a} key)`, async () => {
      const [status, data] = await api.get(
        `/apikeys/${store.apikeys[a].key}/key`,
        auth.basic(store.apikeys[a])
      )
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      const checks = ['key', 'level', 'expiresAt', 'name', 'userId']
      checks.forEach((i) => assert.equal(data.apikey[i], store.apikeys[a][i]))
    })
    if (a === 'key')
      it(`Remove API Key (via ${a} auth)`, async () => {
        const [status, data] = await api.delete(
          `/apikeys/${store.apikeys[a].key}/key`,
          auth.basic(store.apikeys[a])
        )
        assert.equal(status, 204)
      })
    if (a === 'jwt')
      it(`Remove API Key (via ${a} auth)`, async () => {
        const [status, data] = await api.delete(`/apikeys/${store.apikeys[a].key}/${a}`, auth[a]())
        assert.equal(status, 204)
      })
  }
})
