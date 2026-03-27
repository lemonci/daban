import { UsersController } from '../controllers/users.mjs'

const Users = new UsersController()
const jwt = ['jwt', { session: false }]
const guest = ['jwt-guest', { session: false }]
const bsc = ['basic', { session: false }]

export function usersRoutes(tools) {
  const { app, passport, limit } = tools

  // Sign Up
  app.post('/signup', limit.auth, (req, res) => Users.signup(req, res, tools))

  // Confirm account
  app.post('/confirm/signup/:uuid', limit.auth, (req, res) => Users.confirm(req, res, tools))

  // Sign In
  app.post('/signin', limit.auth, (req, res) => Users.signin(req, res, tools))

  // Send sign-in link (aka magic link)
  app.post('/signinlink', limit.auth, (req, res) => Users.signinlink(req, res, tools))

  // Login via sign-in link (aka magic link)
  app.post('/signinlink/:uuid', limit.auth, (req, res) => Users.signinvialink(req, res, tools))

  // Read current jwt This gets special treatment as it is a route that we allow
  // even when the account status or consent would normally prohibit access.
  // This way, we can return info to the frontend that allows us to better inform
  // the user then merely returning 401
  app.get('/whoami/jwt', passport.authenticate(...guest), (req, res) =>
    Users.whoami(req, res, tools)
  )

  // Read the account data
  app.get('/account/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.whoami(req, res, tools)
  )
  app.get('/account/key', passport.authenticate(...bsc), (req, res) =>
    Users.whoami(req, res, tools)
  )

  // Update account
  app.patch('/account/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.update(req, res, tools)
  )
  app.patch('/account/key', passport.authenticate(...bsc), (req, res) =>
    Users.update(req, res, tools)
  )

  // Update consent specifically (jwt-guest)
  app.patch('/consent/jwt', passport.authenticate(...guest), (req, res) =>
    Users.updateConsent(req, res, tools)
  )

  // Enable MFA (totp)
  app.post('/account/mfa/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.updateMfa(req, res, tools)
  )
  app.post('/account/mfa/key', passport.authenticate(...bsc), (req, res) =>
    Users.updateMfa(req, res, tools)
  )

  // Check whether a username is available
  app.post('/available/username/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.isUsernameAvailable(req, res, tools)
  )
  app.post('/available/username/key', passport.authenticate(...bsc), (req, res) =>
    Users.isUsernameAvailable(req, res, tools)
  )

  // Load full user data
  app.get('/users/:uuid/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.allData(req, res, tools)
  )
  app.get('/users/:uuid/key', passport.authenticate(...bsc), (req, res) =>
    Users.allData(req, res, tools)
  )

  // Load a user profile
  app.get('/users/:uuid', (req, res) => Users.profile(req, res, tools))

  // Export account data
  app.get('/account/export/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.exportAccount(req, res, tools)
  )
  app.get('/account/export/key', passport.authenticate(...bsc), (req, res) =>
    Users.exportAccount(req, res, tools)
  )

  // Restrict processing of account data (POST because this mutates state)
  app.post('/account/restrict/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.restrictAccount(req, res, tools)
  )
  app.post('/account/restrict/key', passport.authenticate(...bsc), (req, res) =>
    Users.restrictAccount(req, res, tools)
  )

  // Remove account
  app.delete('/account/jwt', passport.authenticate(...jwt), (req, res) =>
    Users.removeAccount(req, res, tools)
  )
  app.delete('/account/key', passport.authenticate(...bsc), (req, res) =>
    Users.removeAccount(req, res, tools)
  )
}
