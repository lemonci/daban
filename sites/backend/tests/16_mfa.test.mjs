import { authenticator } from '@otplib/preset-default'
import {
  api,
  auth,
  cat,
  store,
  loadStore,
  saveStore,
  startEmailTrap,
  stopEmailTrap,
  readEmail,
} from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

const secret = {
  jwt: store.account,
  key: store.altaccount,
}

describe(`Setup Multi-Factor Authentication (MFA)`, () => {
  // Ensure we have an account to test with
  if (!store.account.confirmation) loadStore(store)
  it(`Should return 400 on MFA enable without proper value, unless it's already enabled`, async () => {
    const body = { mfa: 'test' }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 400)
    assert.equal(data.result, 'error')
    assert.equal(['invalidMfaSetting', 'mfaActive'].includes(data.error), true)
  })

  it(`Should return MFA secret and QR code`, async () => {
    const body = { mfa: true, test: true }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    assert.equal(typeof data.mfa.secret, 'string')
    assert.equal(typeof data.mfa.otpauth, 'string')
    assert.equal(typeof data.mfa.qrcode, 'string')
    store.account.mfaSecret = data.mfa.secret
    store.account.mfaActive = true
  })

  it(`Should enable MFA after validating the token`, async () => {
    const body = {
      mfa: true,
      test: true,
      secret: store.account.mfaSecret,
      token: authenticator.generate(store.account.mfaSecret),
    }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    assert.equal(data.account.id, store.account.id)
    assert.equal(Array.isArray(data.scratchCodes), true)
    store.account.scratchCodes = data.scratchCodes
    store.account.mfaEnabled = true
  })

  it(`Should not request MFA when it is already active`, async () => {
    const body = { mfa: true }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 400)
    assert.equal(data.result, `error`)
  })

  it(`Should not enable MFA when it is already active`, async () => {
    const body = {
      mfa: true,
      test: true,
      secret: store.account.mfaSecret,
      token: authenticator.generate(store.account.mfaSecret),
    }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 400)
    assert.equal(data.result, `error`)
  })

  it(`Should not sign in with username/password only`, async () => {
    const body = {
      username: store.account.uuid,
      password: store.account.password,
    }
    const [status, data] = await api.post(`/signin`, body)
    assert.equal(status, 403)
    assert.equal(data.result, `error`)
    assert.equal(data.error, `mfaTokenRequired`)
  })

  it(`Should sign in with username/password/token`, async () => {
    const body = {
      username: store.account.uuid,
      password: store.account.password,
      token: authenticator.generate(store.account.mfaSecret),
    }
    const [status, data] = await api.post(`/signin`, body)
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    for (const key of ['email', 'username', 'uuid']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should not sign in with the wrong token`, async () => {
    const body = {
      username: store.account.uuid,
      password: store.account.password,
      token: 'wrong',
    }
    const [status, data] = await api.post(`/signin`, body)
    assert.equal(status, 401)
    assert.equal(data.result, `error`)
    assert.equal(data.error, `signInFailed`)
  })

  it(`Should sign in with a scratch code`, async () => {
    const body = {
      username: store.account.uuid,
      password: store.account.password,
      token: store.account.scratchCodes[0],
    }
    const [status, data] = await api.post(`/signin`, body)
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should disable MFA (with scratch code)`, async () => {
    const body = {
      mfa: false,
      password: store.account.password,
      token: store.account.scratchCodes[1],
    }
    const [status, data] = await api.post(`/account/mfa/jwt`, body, auth.jwt())
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should sign in with username/password only again`, async () => {
    const body = {
      username: store.account.uuid,
      password: store.account.password,
    }
    const [status, data] = await api.post(`/signin`, body)
    assert.equal(status, 200)
    assert.equal(data.result, `success`)
    for (const key of ['email', 'username', 'uuid']) {
      assert.equal(data.account[key], store.account[key])
    }
  })
})
