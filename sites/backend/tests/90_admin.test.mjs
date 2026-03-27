import { api, auth, cat, store, loadStore, changeRole } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe(`Admin tests`, () => {
  for (const a of ['jwt']) {
    it(`Change role and re-authenticate (${a})`, async () => {
      // Ensure we have an account to test with
      if (!store.account.confirmation) loadStore(store)
      changeRole(store.account.uuid, 'admin')
      const [status, data] = await api.post('/signin', {
        username: store.account.username,
        password: store.account.password,
      })
      assert.equal(status, 200)
      assert.equal(data.result, 'success')
      // Store
      store.account = { ...store.account, ...data.account, token: data.token }
    })

    it(`Should search users by username (${a})`, async () => {
      const [status, data] = await api.post(`/admin/search/users/${a}`, { q: 'user' }, auth[a]())
      const hit = data.users.username[0]
      assert.equal(status, 200)
      assert.equal(store.account.uuid, hit.uuid)
      // We should find both account and altaccount
      assert.equal(data.users.username.length, 2)
    })

    it(`Should search users by email (${a})`, async () => {
      const [status, data] = await api.post(
        `/admin/search/users/${a}`,
        { q: store.account.email },
        auth[a]()
      )
      const hit = data.users.ehash[0]
      assert.equal(status, 200)
      assert.equal(store.account.uuid, hit.uuid)
    })

    it(`Should search users by uuid (${a})`, async () => {
      const [status, data] = await api.post(
        `/admin/search/users/${a}`,
        { q: store.account.uuid },
        auth[a]()
      )
      const hit = data.users.uuid[0]
      assert.equal(status, 200)
      assert.equal(store.account.username, hit.username)
    })

    it(`Should load a user (${a})`, async () => {
      const [status, data] = await api.get(`/admin/user/${store.altaccount.uuid}/${a}`, auth[a]())
      assert.equal(status, 200)
      assert.equal(store.altaccount.username, data.user.username)
    })

    it(`Should disable a user account (${a})`, async () => {
      const [status, data] = await api.patch(
        `/admin/user/${store.altaccount.uuid}/${a}`,
        { status: -2 },
        auth[a]()
      )
      assert.equal(status, 200)
      assert.equal(-2, data.user.status)
    })

    it(`Should load update a user (change username back to original) (${a})`, async () => {
      const [status, data] = await api.patch(
        `/admin/user/${store.altaccount.uuid}/${a}`,
        { status: 1 },
        auth[a]()
      )
      assert.equal(status, 200)
      assert.equal(1, data.user.status)
    })

    it(`Should load newsletter subscribers (${a})`, async () => {
      // Note that (only) the store.altaccount is subscribed to the newsletter
      const [status, data] = await api.get(`/admin/subscribers/${a}`, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.subscribers[0].uuid, store.altaccount.uuid)
      assert.equal(data.subscribers[0].email, store.altaccount.email)
    })

    if (a === 'jwt') {
      it(`Should impersonate a user (${a})`, async () => {
        const [status, data] = await api.get(
          `/admin/impersonate/${store.altaccount.uuid}/${a}`,
          auth[a]()
        )
        assert.equal(status, 200)
        assert.equal(store.altaccount.uuid, data.account.uuid)
        assert.equal(typeof data.token, 'string')
      })
    }
  }
})
