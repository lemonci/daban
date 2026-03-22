import { api, auth, cat, store, loadStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

const input = {
  jwt: {
    type: 'doc',
    title: 'This is the title',
    url: '/docs/foo/bar',
  },
  key: {
    type: 'set',
    title: 'This is the set',
    url: '/sets/12',
  },
}

for (const a of ['jwt', 'key']) {
  describe(`Bookmark Tests (${a})`, () => {
    it(`Create a new bookmark (${a})`, async () => {
      // Ensure we have an account to test with
      if (!store.account.confirmation) loadStore(store)
      const [status, data] = await api.post(`/bookmarks/${a}`, input[a], auth[a]())
      assert.equal(status, 201)
      assert.equal(data.result, `created`)
      assert.equal(typeof data.bookmark.uuid, 'string')
      assert.equal(typeof data.bookmark.type, 'string')
      assert.equal(typeof data.bookmark.title, 'string')
      assert.equal(typeof data.bookmark.url, 'string')
      for (const [key, val] of Object.entries(input[a])) {
        assert.equal(data.bookmark[key], val)
      }
      if (typeof store.bookmark === 'undefined') store.bookmark = {}
      store.bookmark[a] = data.bookmark
    })
    for (const field of ['title', 'url']) {
      it(`Should update the ${field} of the bookmark (${a})`, async () => {
        const body = {}
        const val = store.bookmark[a][field] + '_updated'
        body[field] = val
        const [status, data] = await api.patch(
          `/bookmarks/${store.bookmark[a].uuid}/${a}`,
          body,
          auth[a]()
        )
        assert.equal(status, 200)
        assert.equal(data.bookmark[field], val)
        store.bookmark[a][field] = val
      })
    }
    it(`Read a bookmark record (${a})`, async () => {
      const [status, data] = await api.get(`/bookmarks/${store.bookmark[a].uuid}/${a}`, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      for (const [key, val] of Object.entries(store.bookmark[a])) {
        assert.equal(data.bookmark[key], val)
      }
    })

    it(`Disallow reading other user's bookmark (${a})`, async () => {
      const [status, data] = await api.get(
        `/bookmarks/${store.bookmark[a].uuid}/${a}`,
        auth[a]('alt')
      )
      if (a === 'jwt') {
        assert.equal(status, 403)
        assert.equal(data.result, `error`)
        assert.equal(data.error, `insufficientAccessLevel`)
      } else assert.equal(status, 401)
    })

    it(`Disallow updating other user's bookmark (${a})`, async () => {
      const [status, data] = await api.patch(
        `/bookmarks/${store.bookmark[a].uuid}/${a}`,
        auth[a]('alt')
      )
      assert.equal(status, 401)
    })
    it(`Disallow removing other user's bookmark (${a})`, async () => {
      const [status, data] = await api.delete(
        `/bookmarks/${store.bookmark[a].uuid}/${a}`,
        auth[a]('alt')
      )
      assert.equal(status, a === 'jwt' ? 403 : 401)
    })
  })
}
