import { api, auth, cat, store, loadStore } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

const input = {
  jwt: {
    nameEn: 'Example measurements A',
    notesEn: 'These are the notes A',
    tags: ['tagA', 'tagB'],
    measies: {
      chest: 1000,
      neck: 420,
    },
  },
  key: {
    nameEn: 'Example measurements B',
    notesEn: 'These are the notes B',
    tags: ['tagA', 'tagB'],
    measies: {
      chest: 930,
      neck: 360,
    },
  },
}

const csets = []

describe(`Curated Set Tests (unauthenticated)`, () => {
  it(`Retrieve a list of curated sets`, async () => {
    const [status, data] = await api.get(`/curated-sets`)
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    assert.equal(Array.isArray(data.curatedSets), true)
    for (const cset of data.curatedSets) csets.push(cset)
  })

  it(`Read a curated set`, async () => {
    const cset = csets[0]
    const [status, data] = await api.get(`/curated-sets/${cset.uuid}`)
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    for (const [key, val] of Object.entries(cset)) {
      if (!['measies', 'test', 'tags'].includes(key)) assert.equal(cset[key], val)
    }
  })

  it(`Should return 404 for an invalid UUID`, async () => {
    const cset = csets[0]
    const [status, data] = await api.get(`/curated-sets/non-existing`)
    assert.equal(status, 404)
  })

  it(`Read a curated set as JSON`, async () => {
    const cset = csets[0]
    const [status, data] = await api.get(`/curated-sets/${cset.uuid}.json`)
    assert.equal(status, 200)
    for (const [key, val] of Object.entries(cset)) {
      if (!['measies', 'tags'].includes(key)) assert.deepStrictEqual(data[key], val)
    }
  })

  it(`Should return 404 when reading a non-existing curated set as JSON`, async () => {
    const cset = csets[0]
    const [status, data] = await api.get(`/curated-sets/non-existing.json`)
    assert.equal(status, 404)
  })

  it(`Read a curated set as YAML`, async () => {
    const cset = csets[0]
    const [status, data] = await api.get(`/curated-sets/${cset.uuid}.yaml`)
    assert.equal(status, 200)
    assert.equal(typeof data, 'string')
  })

  it(`Retrieve a list of curated sets as JSON`, async () => {
    const [status, data] = await api.get(`/curated-sets.json`)
    assert.equal(status, 200)
    assert.equal(Array.isArray(data), true)
  })

  it(`Retrieve a list of curated sets as YAML`, async () => {
    const [status, data] = await api.get(`/curated-sets.yaml`)
    assert.equal(status, 200)
    assert.equal(typeof data, 'string')
  })
})

for (const a of ['jwt', 'key']) {
  describe(`Curated Set Tests (${a})`, () => {
    it(`Should not create a new curated set (${a})`, async () => {
      // Ensure we have an account to test with
      if (!store.account.confirmation) loadStore(store)
      const [status, data] = await api.post(`/curated-sets/${a}`, input[a], auth[a]())
      assert.equal(status, 403)
      assert.equal(data.result, `error`)
      assert.equal(data.error, `insufficientAccessLevel`)
    })

    for (const field of ['nameEn', 'notesEn']) {
      it(`Should not update the ${field} field of the curated set (${a})`, async () => {
        const cset = csets[0]
        const body = {}
        const val = cset[field] + '_updated'
        body[field] = val
        const [status, data] = await api.patch(`/curated-sets/${cset.id}/${a}`, body, auth[a]())
        assert.equal(status, 403)
        assert.equal(data.result, `error`)
        assert.equal(data.error, `insufficientAccessLevel`)
      })
    }

    for (const field of ['chest', 'neck', 'ankle']) {
      it(`Should not update the ${field} measurement of the curated set (${a})`, async () => {
        const cset = csets[0]
        const body = { measies: {} }
        const val = Math.ceil(Math.random() * 1000)
        body.measies[field] = val
        const [status, data] = await api.patch(`/curated-sets/${cset.id}/${a}`, body, auth[a]())
        assert.equal(status, 403)
        assert.equal(data.result, `error`)
        assert.equal(data.error, `insufficientAccessLevel`)
      })

      it(`Should not set an image on a curated set (${a})`, async () => {
        const cset = csets[0]
        const body = { img: cat }
        const [status, data] = await api.patch(`/curated-sets/${cset.id}/${a}`, body, auth[a]())
        assert.equal(status, 403)
        assert.equal(data.result, `error`)
        assert.equal(data.error, `insufficientAccessLevel`)
      })
    }
  })
}

for (const a of ['jwt', 'key']) {
  describe(`Should suggest a curated set`, () => {
    it(`Should not suggest a curated set when data is missing (${a})`, async () => {
      const body = {}
      const [status, data] = await api.post(`/curated-sets/suggest/${a}`, body, auth[a]())
      assert.equal(status, 400)
      assert.equal(data.result, `error`)
      assert.equal(data.error, `setMissing`)
    })

    it(`Should suggest a curated set when some measurements are missing (${a})`, async () => {
      const body = {
        set: store.set[a].uuid,
        height: 200,
        name: store.set[a].name,
        img: cat,
      }
      const [status, data] = await api.post(`/curated-sets/suggest/${a}`, body, auth[a]())
      assert.equal(status, 400)
      assert.equal(data.result, `error`)
      assert.equal(data.error, `setMissing`)
    })
  })
}
