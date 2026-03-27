import {
  api,
  auth,
  cat,
  store,
  loadStore,
  randomString,
  startEmailTrap,
  stopEmailTrap,
  readEmail,
} from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

const email = `${randomString()}@freesewing.dev`

describe(`Subscriber tests`, () => {
  it(`Do not subscribe without an email address`, async () => {
    const body = {}
    const [status, data] = await api.post(`/subscriber`, body)
    assert.equal(status, 400)
    assert.equal(data.result, 'error')
    assert.equal(data.error, 'emailMissing')
  })

  it(`Do not subscribe without a language`, async () => {
    const body = { email }
    const [status, data] = await api.post(`/subscriber`, body)
    assert.equal(status, 400)
    assert.equal(data.result, 'error')
    assert.equal(data.error, 'languageMissing')
  })

  it(`Do subscribe with a language`, async () => {
    await startEmailTrap()
    const body = { email, language: 'en' }
    const [status, data] = await api.post(`/subscriber`, body)
    try {
      const msg = readEmail()
      store.nlConfirmation = msg.replacements
      store.nlConfirmation.uuid = store.nlConfirmation.actionUrl.split('id=').pop()
    } catch (err) {
      console.log(err)
    }
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    assert.equal(data.data.email, email)
    assert.equal(Object.keys(data.data).length, 1)
    await stopEmailTrap()
  })

  it(`Confirm a subscription`, async () => {
    const [status, data] = await api.put(`/subscriber`, { uuid: store.nlConfirmation.uuid })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
  })

  it(`Unsubscribe a subscription`, async () => {
    const [status, data] = await api.delete(`/subscriber/${store.nlConfirmation.uuid}`)
    assert.equal(status, 204)
  })
})
