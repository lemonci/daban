import cors from 'cors'
import rateLimit from 'express-rate-limit'
import http from 'passport-http'
import jwt from 'passport-jwt'
import { ApikeyModel } from './models/apikey.mjs'
import { UserModel } from './models/user.mjs'
import { api, instance, getLimits } from './config.mjs'

/*
 * In v2 we ended up with a bug where we did not properly track the last login
 * So in v3 we switch to `lastSeen` and every authenticated API call we update
 * this field. It's a bit of a perf hit to write to the database on ever API call
 * but it's worth it to actually know which accounts are used and which are not.
 */
async function checkAccess(payload, tools, type) {
  /*
   * Don't allow tokens/keys to be used on different instances,
   * even with the same encryption key
   */
  if (payload.aud !== `${api}/${instance}`) return false
  const User = new UserModel(tools)
  const uid = type === 'key' ? payload.userId : payload.id
  const [ok, err] = await User.papersPlease(uid, type, payload)

  return [ok, err]
}

function loadExpressMiddleware(app, tools) {
  // Save us some typing
  const config = tools.config

  /*
   * We set rate limits dynamically, so they don't bother us during unit tests
   */
  tools.limit = {
    /*
     * Rate limiter for authentication endpoints (signup, signin, magic link).
     * Tight window to slow brute-force and credential-stuffing attacks.
     */
    auth: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.limits.auth,
      standardHeaders: true,
      legacyHeaders: false,
      message: { result: 'error', error: 'tooManyRequests' },
    }),
    /*
     * Rate limiter for general unauthenticated public endpoints.
     */
    all: rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.limits.all,
      standardHeaders: true,
      legacyHeaders: false,
      message: { result: 'error', error: 'tooManyRequests' },
    }),
  }

  /*
   * Build the list of allowed CORS origins from configuration.
   * We always allow the configured website domain plus the known
   * forum domains (which act as OIDC clients).
   */
  const scheme = config?.website?.scheme || 'https'
  const domain = config?.website?.domain || 'freesewing.org'
  const allowedOrigins = new Set([
    `${scheme}://${domain}`,
    `${scheme}://www.${domain}`,
    // Forum OIDC clients
    'https://forum.freesewing.eu',
    'https://forum.freesewing.org',
    'http://localhost:3000',
  ])

  app.use(
    cors({
      origin: (origin, cb) => {
        /*
         * Allow requests with no Origin header (e.g. server-to-server, curl)
         * and any origin that is on the allow-list.
         */
        if (!origin || allowedOrigins.has(origin)) return cb(null, true)
        cb(new Error(`CORS: origin '${origin}' is not allowed`))
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  )
}

function loadPassportMiddleware(passport, tools) {
  passport.use(
    new http.BasicStrategy(async (key, secret, done) => {
      const Apikey = new ApikeyModel(tools)
      await Apikey.verify(key, secret)
      /*
       * We check more than merely the API key
       */
      const [ok] = Apikey.verified ? await checkAccess(Apikey.record, tools, 'key') : [false]

      return ok
        ? done(null, {
            ...Apikey.record,
            apikey: true,
            uid: Apikey.record.userId,
          })
        : done(false)
    })
  )
  passport.use(
    'jwt',
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ...tools.config.jwt,
      },
      async (jwt_payload, done) => {
        /*
         * We check more than merely the token
         */
        const [ok] = await checkAccess(jwt_payload, tools, 'jwt')

        return ok
          ? done(null, {
              ...jwt_payload,
              uuid: jwt_payload._id,
              level: tools.config.roles.levels[jwt_payload.role] || 0,
            })
          : done(false)
      }
    )
  )
  /*
   * This special strategy is only used for the whoami/jwt-guest route
   */
  passport.use(
    'jwt-guest',
    new jwt.Strategy(
      {
        jwtFromRequest: jwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
        ...tools.config.jwt,
      },
      async (jwt_payload, done) => {
        /*
         * We check more than merely the token
         */
        const [ok, err] = await checkAccess(jwt_payload, tools, 'jwt-guest')

        return ok
          ? done(null, {
              ...jwt_payload,
              uuid: jwt_payload._id,
              level: tools.config.roles.levels[jwt_payload.role] || 0,
              guestError: err ? err : false,
            })
          : done(false)
      }
    )
  )
}

export { loadExpressMiddleware, loadPassportMiddleware }
