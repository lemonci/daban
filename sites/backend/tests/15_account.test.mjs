import {
  api,
  auth,
  cat,
  store,
  loadStore,
  startEmailTrap,
  stopEmailTrap,
  readEmail,
  readEmails,
} from './utils.mjs'
import { strict as assert } from 'node:assert'
import { describe, it } from 'node:test'

const input = {
  jwt: {
    bio: "I know it sounds funny but I just can't stand the pain",
    consent: 1,
    control: 4,
    imperial: true,
    newsletter: true,
  },
  key: {
    bio: "It's a long way to the top, if you wanna rock & roll",
    consent: 2,
    control: 3,
    imperial: true,
    newsletter: true,
  },
}

for (const a of ['jwt', 'key']) {
  describe(`Update account field (${a})`, () => {
    // Ensure we have an account to test with
    if (!store.account.confirmation) loadStore(store)
    for (const [field, val] of Object.entries(input[a])) {
      it(`Should update ${field} (${a})`, async () => {
        const body = {}
        body[field] = val
        const [status, data] = await api.patch(`/account/${a}`, body, auth[a]())
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
        assert.deepStrictEqual(data.account[field], val)
      })
    }
  })

  describe(`Update account data (${a})`, () => {
    it(`Should update data (${a})`, async () => {
      const body = {
        data: {
          githubEmail: 'github-is-a-garbage-fire-these-days@freesewing.dev',
          githubUsername: 'github-is-a-garbage-fire-these-days',
        },
      }
      const [status, data] = await api.patch(`/account/${a}`, body, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      assert.equal(data.account.data.githubUsername, body.data.githubUsername)
      assert.equal(data.account.data.githubEmail, body.data.githubEmail)
    })

    it(`Should update the password (${a})`, async () => {
      const [status, data] = await api.patch(`/account/${a}`, { password: 'password' }, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
    })

    if (a === 'jwt') {
      it(`Should be able to sign in with the updated password`, async () => {
        const [status, data] = await api.post(`/signin`, {
          // Using username here
          username: store.account.username,
          password: 'password',
        })
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })
      it(`Restore the original password (${a})`, async () => {
        const [status, data] = await api.patch(
          `/account/${a}`,
          { password: store.account.password },
          auth[a]()
        )
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })

      it(`Should be able to sign in with the original password & uuid`, async () => {
        const [status, data] = await api.post(`/signin`, {
          // Using uuid here
          username: store.account.uuid,
          password: store.account.password,
        })
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })
      it(`Should be able to sign in with the original password & username`, async () => {
        const [status, data] = await api.post(`/signin`, {
          // Using uuid here
          username: store.account.username,
          password: store.account.password,
        })
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })

      const username = store.randomString().toUpperCase()
      it(`Should update username (and lusername) (${a})`, async () => {
        const [status, data] = await api.patch(`/account/${a}`, { username }, auth[a]())
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
        assert.deepStrictEqual(data.account.username, username)
        assert.deepStrictEqual(data.account.lusername, username.toLowerCase())
      })

      it(`Should be able to sign in with the updated username`, async () => {
        const [status, data] = await api.post(`/signin`, {
          // Using the new username here
          username: username,
          password: store.account.password,
        })
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })

      it(`Should update username (restore original) (${a})`, async () => {
        const [status, data] = await api.patch(
          `/account/${a}`,
          { username: store.account.username },
          auth[a]()
        )
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
        assert.deepStrictEqual(data.account.username, store.account.username)
        assert.deepStrictEqual(data.account.lusername, store.account.username.toLowerCase())
      })

      it(`Should be able to sign in with the original username`, async () => {
        const [status, data] = await api.post(`/signin`, {
          // Using the new username here
          username: store.account.username,
          password: store.account.password,
        })
        assert.equal(status, 200)
        assert.equal(data.result, `success`)
      })
    }

    it(`Should update the account image (${a})`, async () => {
      const [status, data] = await api.patch(`/account/${a}`, { img: cat }, auth[a]())
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
    })

    it(`Should update the account email address (${a}))`, async () => {
      await startEmailTrap()
      const [status, data] = await api.patch(
        `/account/${a}`,
        {
          email: `updated_${store.account.email}`,
        },
        auth[a]()
      )
      const msg = readEmail()
      store.account.emailChangeConfirmation = msg.replacements
      store.account.emailChangeConfirmation.uuid = store.account.emailChangeConfirmation.actionUrl
        .split('id=')
        .pop()
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      await stopEmailTrap()
    })
    it(`Should confirm the email change (${a})`, async () => {
      const [status, data] = await api.patch(
        `/account/${a}`,
        {
          confirm: 'emailchange',
          confirmation: store.account.emailChangeConfirmation.uuid,
          check: store.account.emailChangeConfirmation.check,
        },
        auth[a]()
      )
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
    })
    it(`Should restore the account email address (${a})`, async () => {
      await startEmailTrap()
      const [status, data] = await api.patch(
        `/account/${a}`,
        {
          email: store.account.email,
        },
        auth[a]()
      )
      const msg = readEmail()
      store.account.emailChangeConfirmation = msg.replacements
      store.account.emailChangeConfirmation.uuid = store.account.emailChangeConfirmation.actionUrl
        .split('id=')
        .pop()
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
      await stopEmailTrap()
    })
    it(`Should confirm the restore email change (${a})`, async () => {
      const [status, data] = await api.patch(
        `/account/${a}`,
        {
          confirm: 'emailchange',
          confirmation: store.account.emailChangeConfirmation.uuid,
          check: store.account.emailChangeConfirmation.check,
        },
        auth[a]()
      )
      assert.equal(status, 200)
      assert.equal(data.result, `success`)
    })
  })
}
