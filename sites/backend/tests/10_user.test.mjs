import { api, auth, cat, store, startEmailTrap, stopEmailTrap, readEmail } from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

describe(`Signup flow and authentication`, async () => {
  it(`Should return 400 on signup without body`, async () => {
    const [status, data] = await api.post('/signup')
    assert.equal(status, 400)
    assert.equal(data.result, `error`)
    assert.equal(data.error, `postBodyMissing`)
  })

  it(`Should signup`, async () => {
    await startEmailTrap()
    const [status, data] = await api.post('/signup', { email: store.account.email })
    assert.equal(status, 201)
    assert.equal(data.result, 'created')
    assert.equal(data.email, store.account.email)
    const msg = readEmail()
    store.account.confirmation = msg.replacements
    store.account.confirmation.uuid = store.account.confirmation.actionUrl.split('id=').pop()
    await stopEmailTrap()
  })

  it(`Should pretend to signup an existing email address`, async () => {
    await startEmailTrap()
    const [status, data] = await api.post('/signup', { email: store.account.email })
    assert.equal(status, 201)
    assert.equal(data.result, 'created')
    assert.equal(data.email, store.account.email)
    await stopEmailTrap()
  })

  it(`Should not confirm the account without a post body`, async () => {
    const [status, data] = await api.post('/confirm/signup/whatever', {})
    assert.equal(data.result, 'error')
    assert.equal(data.error, 'postBodyMissing')
  })

  it(`Should not confirm the account with the wrong check`, async () => {
    const [status, data] = await api.post(`/confirm/signup/${store.account.confirmation.uuid}`, {
      consent: 1,
      check: 'yoself',
    })
    assert.equal(status, 404)
  })

  it(`Should confirm the account`, async () => {
    const [status, data] = await api.post(`/confirm/signup/${store.account.confirmation.uuid}`, {
      consent: 1,
      check: store.account.confirmation.check,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    assert.equal(typeof data.token, 'string')
    assert.equal(typeof data.account.uuid, 'string')
    assert.equal(data.account.bio, '')
    assert.equal(data.account.compare, true)
    assert.equal(data.account.consent, 1)
    assert.equal(data.account.control, 1)
    assert.equal(data.account.email, store.account.email)
    assert.equal(typeof data.account.data, 'object')
    assert.equal(data.account.imperial, false)
    assert.equal(data.account.mfaEnabled, false)
    assert.equal(data.account.newsletter, false)
    assert.equal(data.account.role, 'user')
    assert.equal(data.account.status, 1)
    assert.equal(typeof data.account.username, 'string')
    assert.equal(data.account.username, data.account.lusername)
    assert.equal(typeof data.account.id, 'undefined')
    // Store
    store.account = { ...store.account, ...data.account }
  })

  it(`Should not sign in with the wrong password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.username,
      password: store.account.username,
    })
    assert.equal(status, 401)
    console.log(data)
    assert.equal(data.result, 'error')
    assert.equal(data.error, 'signInFailed')
  })

  /*
  // Note that password was not set at account creation
  it(`Should set the password`, async () => {
    const [status, data] = await api.patch(
      '/account/jwt',
      { password: store.account.password },
      auth.jwt
    )
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should set the password (altaccount)`, async () => {
    const [status, data] = await api.patch(
      '/account/jwt',
      { password: store.altaccount.password },
      auth.altjwt
    )
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.altaccount[key])
    }
  })

  it(`Should sign in with username and password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.username,
      password: store.account.password,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should sign in with USERNAME and password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.username.toUpperCase(),
      password: store.account.password,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should sign in with email and password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.email,
      password: store.account.password,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should sign in with EMAIL and password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.email.toUpperCase(),
      password: store.account.password,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should sign in with ID and password`, async () => {
    const [status, data] = await api.post('/signin', {
      username: store.account.id,
      password: store.account.password,
    })
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should load the account data (jwt)`, async () => {
    const [status, data] = await api.get(`/account/jwt`, auth.jwt)
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })

  it(`Should load the account data via whoami (jwt)`, async () => {
    const [status, data] = await api.get(`/whoami/jwt`, auth.jwt)
    assert.equal(status, 200)
    assert.equal(data.result, 'success')
    for (const key of ['email', 'username', 'id']) {
      assert.equal(data.account[key], store.account[key])
    }
  })
*/
})
/*
describe(`Check for available usernames`, () => {
  it(`Should find an available username (jwt)`, async () => {
    const [status, data] = await api.post(
      `/available/username/jwt`,
      { username: 'haichi' },
      auth.jwt
    )
    assert.equal(status, 404)
  })

  it(`Should find a non-available username (jwt)`, async () => {
    const [status, data] = await api.post(
      `/available/username/jwt`,
      { username: store.account.username },
      auth.jwt
    )
    assert.equal(status, 200)
  })
})
*/
