import { api, auth, cat, store, loadStore, saveStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'
import { cisMaleAdult40, cisFemaleAdult40 } from '@freesewing/models'

const input = {
  jwt: {
    name: 'Joost',
    notes: 'These are them notes',
    measies: cisMaleAdult40,
    public: true,
    imperial: true,
  },
  key: {
    name: 'Sorcha',
    notes: 'These are also notes',
    measies: cisFemaleAdult40,
    public: true,
    img: cat,
    imperial: false,
  },
}

for (const a of ['jwt', 'key']) {
  describe(`Set Tests (${a})`, () => {
    it(`Create a new set (${a})`, async () => {
      // Ensure we have an account to test with
      if (!store.account.confirmation) loadStore(store)
      const [status, data] = await api.post(`/sets/${a}`, input[a], auth[a]())
      assert.equal(status, 201)
      assert.equal(data.result, `created`)
      for (const [key, val] of Object.entries(input[a])) {
        if (!['measies', 'img', 'test'].includes(key)) assert.equal(data.set[key], val)
      }
      if (typeof store.set === 'undefined') store.set = {}
      store.set[a] = data.set
    })
    for (const field of ['name', 'notes']) {
      it(`Update field ${field} of the set (${a})`, async () => {
        const body = {}
        const val = store.set[a][field] + '_updated'
        body[field] = val
        const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
        assert.equal(status, 200)
        assert.equal(data.set[field], val)
        store.set[a] = data.set
        await saveStore(store)
      })
    }

    for (const field of ['imperial', 'public']) {
      it(`Update field ${field} of the set (${a})`, async () => {
        const body = {}
        const val = !store.set[a][field]
        body[field] = val
        const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
        assert.equal(status, 200)
        assert.equal(data.set[field], val)
        store.set[a] = data.set
      })
    }

    const rand = () => Math.ceil(Math.random() * 1000)
    const testMeasies = {
      chest: rand(),
      neck: rand(),
      ankle: rand(),
    }

    it(`Update the ankle measurement (${a})`, async () => {
      const body = { measies: { ankle: testMeasies.ankle } }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.set.measies.ankle, testMeasies.ankle)
    })

    it(`Update several set measurements at once (${a})`, async () => {
      const body = { measies: testMeasies }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      for (const m in testMeasies) assert.equal(data.set.measies[m], testMeasies[m])
      store.set[a] = data.set
    })

    it(`Do not set a non-existing measurement (${a})`, async () => {
      const body = { measies: { potatoe: 14 } }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.set.measies.potatoe, undefined)
    })

    it(`Clear a measurement (${a})`, async () => {
      const body = { measies: { ankle: null } }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.set.measies.ankle, undefined)
    })

    it(`Read a set (${a})`, async () => {
      const [status, data] = await api.get(`/sets/${store.set[a].uuid}/${a}`, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.set.measies.chest, testMeasies.chest)
    })

    it(`Do not allow reading another user's non-public set (${a})`, async () => {
      const body = { measies: { ankle: null } }
      const [status, data] = await api.get(`/sets/${store.set[a].uuid}/${a}`, auth[a]('alt'))
      assert.equal(status, 403)
      assert.equal(data.result, `error`)
    })

    it(`Make a set public (${a})`, async () => {
      const body = { public: true }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.set.public, true)
      store.set[a] = data.set
    })

    it(`Do allow reading a public set as JSON (${a})`, async () => {
      const [status, data] = await api.get(`/sets/${store.set[a].uuid}.json`)
      assert.equal(status, 200)
      assert.equal(data.uuid, store.set[a].uuid)
    })

    it(`Do allow reading a public set as YAML (${a})`, async () => {
      const [status, data] = await api.get(`/sets/${store.set[a].uuid}.yaml`)
      assert.equal(status, 200)
      assert.equal(typeof data, 'string')
    })

    it(`Do not allow updating another user's set (${a})`, async () => {
      const body = { measies: { ankle: 123 } }
      const [status, data] = await api.patch(
        `/sets/${store.set[a].uuid}/${a}`,
        body,
        auth[a]('alt')
      )
      assert.equal(status, 403)
    })
    it(`Do not allow removing another user's set (${a})`, async () => {
      const [status, data] = await api.delete(`/sets/${store.set[a].uuid}/${a}`, auth[a]('alt'))
      assert.equal(status, 403)
    })

    it(`Clone a set (${a})`, async () => {
      const [status, data] = await api.post(
        `/sets/${store.set[a].uuid}/clone/${a}`,
        null,
        auth[a]()
      )
      assert.equal(status, 201)
      assert.equal(data.result, `created`)
    })

    it(`Clone a public set across accounts (${a})`, async () => {
      const [status, data] = await api.post(
        `/sets/${store.set[a].uuid}/clone/${a}`,
        null,
        auth[a]('alt')
      )
      assert.equal(status, 201)
      assert.equal(data.result, `created`)
    })

    it(`Make a set private (${a})`, async () => {
      const body = { public: false }
      const [status, data] = await api.patch(`/sets/${store.set[a].uuid}/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.set.public, false)
      store.set[a] = data.set
    })

    it(`Do not allow cloning a non-public set across accounts (${a})`, async () => {
      const [status, data] = await api.post(
        `/sets/${store.set[a].uuid}/clone/${a}`,
        null,
        auth[a]('alt')
      )
      assert.equal(status, 403)
      assert.equal(data.result, `error`)
    })

    it(`List the current user's sets (${a})`, async () => {
      const [status, data] = await api.get(`/sets/${a}`, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.sets.length, a === 'jwt' ? 2 : 4)
    })
  })
}
