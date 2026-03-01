import chalk from 'chalk'
// Load environment variables
import dotenv from 'dotenv'
import { asJson } from './utils/index.mjs'
import { randomString } from './utils/crypto.mjs'
import get from 'lodash.get'
import { readFileSync, writeFileSync } from 'node:fs'
import { postConfig } from '../local-config.mjs'
import { measurements, roles } from '@freesewing/config'
dotenv.config()

/*
 * Make this easy to update
 */
const languages = ['en']

/*
 * Allow these 2 to be imported
 */
export const port = process.env.BACKEND_PORT || 3000
export const api = process.env.BACKEND_URL || `http://localhost:${port}`

/*
 * Generate/Check keys only once
 */
const encryptionKey = process.env.BACKEND_ENC_KEY || ensureKey('encryption', 64)
const cookie1Key = process.env.BACKEND_ENC_KEY || ensureKey('cookie1', 32)
const cookie2Key = process.env.BACKEND_ENC_KEY || ensureKey('cookie2', 32)

/*
 * All environment variables are strings
 * This is a helper method to turn them into a boolean
 */
const envToBool = (input = 'no') => {
  if (['yes', '1', 'true'].includes(input.toLowerCase())) return true
  return false
}

/*
 * Save ourselves some typing
 */
const crowdinProject = 'https://translate.freesewing.org/project/freesewing/'

/*
 * Construct config object
 */
const baseConfig = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  // Maintainer contact
  maintainer: 'joost@freesewing.org',
  // Instance
  instance: process.env.BACKEND_INSTANCE || Date.now(),
  // Feature flags
  use: {
    codeberg: envToBool(process.env.BACKEND_ENABLE_CODEBERG),
    cloudflareImages: envToBool(process.env.BACKEND_ENABLE_CLOUDFLARE_IMAGES),
    forwardmx: envToBool(process.env.BACKEND_ENABLE_FORWARDMX),
    ses: envToBool(process.env.BACKEND_ENABLE_AWS_SES),
    oidc: {
      provider: envToBool(process.env.BACKEND_ENABLE_OIDC_PROVIDER),
      clients: {
        forum: envToBool(process.env.BACKEND_ENABLE_OIDC_CLIENT_FORUM),
      },
    },
    tests: {
      base: envToBool(process.env.BACKEND_ENABLE_TESTS),
      email: envToBool(process.env.BACKEND_ENABLE_TESTS_EMAIL),
      cloudflareImages: envToBool(process.env.BACKEND_ENABLE_TESTS_CLOUDFLARE_IMAGES),
      forwardmx: envToBool(process.env.BACKEND_ENABLE_TESTS_FORWARDMX),
    },
    import: envToBool(process.env.BACKEND_ENABLE_IMPORT),
  },
  // Config
  api,
  apikeys: {
    levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    expiryMaxSeconds: 365 * 24 * 3600,
  },
  avatars: {
    user: process.env.BACKEND_AVATAR_USER || 'default-avatar',
    set: process.env.BACKEND_AVATAR_SET || 'default-avatar',
    cset: process.env.BACKEND_AVATAR_CSET || 'default-avatar',
    pattern: process.env.BACKEND_AVATAR_PATTERN || 'default-avatar',
    opack: process.env.BACKEND_AVATAR_OPACK || 'default-avatar',
  },
  db: {
    path: process.env.BACKEND_DB_PATH || './db.sqlite',
  },
  bookmarks: {
    types: ['set', 'cset', 'pattern', 'design', 'doc', 'custom'],
  },
  encryption: {
    key: encryptionKey,
  },
  enums: {
    user: {
      consent: [0, 1, 2, 3],
      control: [1, 2, 3, 4, 5],
      language: languages,
      compare: [true, false],
      imperial: [true, false],
      newsletter: [true, false],
    },
  },
  exports: {
    dir: process.env.BACKEND_EXPORTS_DIR || '/tmp',
    url: process.env.BACKEND_EXPORTS_URL || 'https://static3.freesewing.org/export/',
  },
  crowdin: {
    invites: {
      nl: crowdinProject + 'invite?h=' + process.env.BACKEND_CROWDIN_INVITE_NL,
      fr: crowdinProject + 'invite?h=' + process.env.BACKEND_CROWDIN_INVITE_FR,
      de: crowdinProject + 'invite?h=' + process.env.BACKEND_CROWDIN_INVITE_DE,
      es: crowdinProject + 'invite?h=' + process.env.BACKEND_CROWDIN_INVITE_ES,
      uk: crowdinProject + 'invite?h=' + process.env.BACKEND_CROWDIN_INVITE_UK,
    },
  },
  img: {
    sites: ['org', 'dev', 'social'],
    templates: {
      folder: ['..', '..', 'artwork', 'img'],
      sizes: {
        square: 2000,
        tall: 1080,
        wide: 2400,
      },
      chars: {
        wide: {
          title_1: 24,
          title_2: 26,
          title_3: 26,
          intro: 58,
        },
        square: {
          title_1: 20,
          title_2: 20,
          title_3: 20,
          intro: 52,
        },
        tall: {
          title_1: 20,
          title_2: 20,
          title_3: 20,
          title_4: 20,
          title_5: 20,
          intro: 52,
        },
      },
    },
  },
  jwt: {
    secretOrKey: encryptionKey,
    issuer: api,
    expiresIn: process.env.BACKEND_JWT_EXPIRY || '7d',
  },
  languages,
  translations: languages.filter((lang) => lang !== 'en'),
  measies: measurements,
  mfa: {
    service: process.env.BACKEND_MFA_SERVICE || 'FreeSewing',
  },
  port,
  roles,
  tests: {
    domain: process.env.BACKEND_TEST_DOMAIN || 'freesewing.dev',
    production: envToBool(process.env.BACKEND_ALLOW_TESTS_IN_PRODUCTION),
  },
  website: {
    domain: process.env.BACKEND_WEBSITE_DOMAIN || 'freesewing.org',
    scheme: process.env.BACKEND_WEBSITE_SCHEME || 'https',
  },
}

/*
 * Config behind feature flags
 */

// Codeberg config
if (baseConfig.use.codeberg)
  baseConfig.codeberg = {
    token: process.env.BACKEND_CODEBERG_TOKEN,
    api: 'https://codeberg.org/api/v1',
    owner: 'freesewing',
    repo: 'freesewing',
    bot: {
      user: process.env.BACKEND_CODEBERG_USER || 'skully',
      name: process.env.BACKEND_CODEBERG_USER_NAME || 'Freesewing bot',
      email: process.env.BACKEND_CODEBERG_USER_EMAIL || 'skully@freesewing.eu',
    },
  }

// Cloudflare Images config
if (baseConfig.use.cloudflareImages) {
  const account = process.env.BACKEND_CLOUDFLARE_ACCOUNT || 'fixmeSetCloudflareAccountId'
  baseConfig.cloudflareImages = {
    account,
    api: `https://api.cloudflare.com/client/v4/accounts/${account}/images/v1`,
    token: process.env.BACKEND_CLOUDFLARE_IMAGES_TOKEN || 'fixmeSetCloudflareToken',
    import: envToBool(process.env.BACKEND_IMPORT_CLOUDFLARE_IMAGES),
    useInTests: baseConfig.use.tests.cloudflareImages,
    url: 'https://imagedelivery.net/ouSuR9yY1bHt-fuAokSA5Q/',
    variants: ['public', 'sq100', 'sq200', 'sq500', 'w200', 'w500', 'w1000', 'w2000'],
  }
}

// FowardMx config
if (baseConfig.use.fowardmx)
  baseConfig.forwardmx = {
    key: process.env.BACKEND_FORWARDMX_KEY || 'fixmeSetFowardMxApiKey',
    useInTests: baseConfig.use.tests.fowardmx,
  }

// AWS SES config (for sending out emails)
if (baseConfig.use.ses)
  baseConfig.aws = {
    ses: {
      region: process.env.BACKEND_AWS_SES_REGION || 'us-east-1',
      from: process.env.BACKEND_AWS_SES_FROM || 'FreeSewing <info@freesewing.org>',
      replyTo: process.env.BACKEND_AWS_SES_REPLY_TO
        ? JSON.parse(process.env.BACKEND_AWS_SES_REPLY_TO)
        : ['FreeSewing <info@freesewing.org>'],
      feedback: process.env.BACKEND_AWS_SES_FEEDBACK,
      cc: process.env.BACKEND_AWS_SES_CC ? JSON.parse(process.env.BACKEND_AWS_SES_CC) : [],
      bcc: process.env.BACKEND_AWS_SES_BCC
        ? JSON.parse(process.env.BACKEND_AWS_SES_BCC)
        : ['FreeSewing records <records@freesewing.org>'],
    },
  }

// OIDC Provider config
if (baseConfig.use.oidc.provider) {
  baseConfig.oidc = {
    provider: {
      proxy: true,
      clients: [],
      pkce: {
        required: false,
      },
      features: {
        devInteractions: { enabled: false },
        encryption: { enabled: true },
        introspection: { enabled: true },
        revocation: { enabled: true },
      },
      cookies: {
        keys: [cookie1Key, cookie2Key],
      },
      routes: {
        authorization: '/oidc/auth',
        backchannel_authentication: '/oidc/backchannel',
        code_verification: '/oidc/device',
        device_authorization: '/oidc/device/auth',
        end_session: '/oidc/session/end',
        introspection: '/oidc/token/introspection',
        jwks: '/jwks',
        pushed_authorization_request: '/oidc/request',
        registration: '/oidc/reg',
        revocation: '/oidc/token/revocation',
        token: '/oidc/token',
        userinfo: '/oidc/me',
      },
      ttl: {
        Interaction: 3600,
        Session: 24 * 60 * 60,
        Grant: 14 * 24 * 60 * 60,
        AccessToken: 60 * 60,
        IdToken: 60 * 60,
        RefreshToken: 14 * 24 * 60 * 60,
        ClientCredentials: 10 * 60,
      },
      scopes: ['openid', 'email', 'profile'],
      claims: {
        openid: ['sub'],
        email: ['email', 'email_verified'],
        profile: ['name', 'preferred_username', 'picture', 'updated_at', 'bio', 'moderator'],
      },
    },
    clients: [],
  }
  if (baseConfig.use.oidc.clients.forum)
    baseConfig.oidc.provider.clients.push({
      client_id: 'forum',
      client_secret: process.env['BACKEND_OIDC_CLIENT_FORUM_SECRET'],
      redirect_uris: [
        'https://forum.freesewing.eu/auth/oidc/callback',
        'https://forum.freesewing.org/auth/oidc/callback',
      ],
      grant_types: ['authorization_code'],
      response_types: ['code'],
      scope: 'openid email profile',
    })
}

// Load local config
const config = postConfig(baseConfig)

// Exporting this stand-alone config
export const cloudflareImages = config.cloudflareImages || {}
export const forwardmx = config.forwardmx || {}
export const website = config.website
export const codeberg = config.codeberg
export const instance = config.instance
export const exports = config.exports
export const imgConfig = config.img

const vars = {
  BACKEND_DB_PATH: ['required', 'db.path'],
  BACKEND_PORT: 'optional',
  BACKEND_WEBSITE_DOMAIN: 'optional',
  BACKEND_WEBSITE_SCHEME: 'optional',
  BACKEND_ENC_KEY: ['requiredSecret', 'encryption.key'],
  BACKEND_JWT_ISSUER: 'optional',
  BACKEND_JWT_EXPIRY: 'optional',
  // Feature flags
  BACKEND_ENABLE_AWS_SES: 'optional',
  BACKEND_ENABLE_CLOUDFLARE_IMAGES: 'optional',
  BACKEND_ENABLE_CODEBERG: 'optional',
  BACKEND_ENABLE_PAYMENTS: 'optional',
  BACKEND_ENABLE_TESTS: 'optional',
  BACKEND_ALLOW_TESTS_IN_PRODUCTION: 'optional',
  BACKEND_ENABLE_DUMP_CONFIG_AT_STARTUP: 'optional',
}

// Vars for AWS SES integration
if (envToBool(process.env.BACKEND_ENABLE_AWS_SES)) {
  vars.AWS_ACCESS_KEY_ID = 'required'
  vars.AWS_SECRET_ACCESS_KEY = 'requiredSecret'
  vars.BACKEND_AWS_SES_REGION = 'optional'
  vars.BACKEND_AWS_SES_FROM = 'optional'
  vars.BACKEND_AWS_SES_REPLY_TO = 'optional'
  vars.BACKEND_AWS_SES_FEEDBACK = 'optional'
  vars.BACKEND_AWS_SES_CC = 'optional'
  vars.BACKEND_AWS_SES_BCC = 'optional'
}
// Vars for Cloudflare Images integration
if (envToBool(process.env.BACKEND_USE_CLOUDFLARE_IMAGES)) {
  vars.BACKEND_CLOUDFLARE_IMAGES_TOKEN = 'requiredSecret'
  vars.BACKEND_TEST_CLOUDFLARE_IMAGES = 'optional'
}
// Vars for Codeberg integration
if (envToBool(process.env.BACKEND_ENABLE_CODEBERG)) {
  vars.BACKEND_CODEBERG_TOKEN = 'requiredSecret'
  vars.BACKEND_CODEBERG_USER = 'optional'
  vars.BACKEND_CODEBERG_USER_NAME = 'optional'
  vars.BACKEND_CODEBERG_USER_EMAIL = 'optional'
}

// Vars for OIDC Provider
if (envToBool(process.env.BACKEND_OIDC_PROVIDER)) {
  vars.BACKEND_OIDC_PROVIDER_CLOUDFLARE_IMAGES_TOKEN = 'requiredSecret'
  vars.BACKEND_TEST_CLOUDFLARE_IMAGES = 'optional'
}

// Vars for (unit) tests
if (envToBool(process.env.BACKEND_ENABLE_TESTS)) {
  vars.BACKEND_TEST_DOMAIN = 'optional'
  vars.BACKEND_ENABLE_TESTS_EMAIL = 'optional'
}

/*
 * This method is how you load the config.
 *
 * It will verify whether whether everyting is setup correctly
 * which is not a given since there's a number of environment
 * variables that need to be set for this backend to function.
 */
export function verifyConfig(silent = false) {
  const emptyString = (input) => {
    if (typeof input === 'string' && input.length > 0) return false
    return true
  }
  const errors = []
  const ok = []

  for (let [key, type] of Object.entries(vars)) {
    let configPath = false
    let val
    if (Array.isArray(type)) [type, configPath] = type
    if (['required', 'requiredSecret'].includes(type)) {
      if (typeof process.env[key] === 'undefined' || emptyString(process.env[key])) {
        // Allow falling back to defaults for required config
        if (configPath) val = get(config, configPath)
        if (typeof val === 'undefined') errors.push(key)
      } else {
        if (configPath) val = get(config, configPath)
        else val = process.env[key]
      }
      if (type === 'requiredSecret')
        ok.push(`🔒 ${chalk.yellow(key)}: ` + chalk.grey('***redacted***'))
      else ok.push(`✅ ${chalk.green(key)}: ${chalk.grey(val)}`)
    } else {
      if (typeof process.env[key] !== 'undefined' && !emptyString(process.env[key])) {
        ok.push(`✅ ${chalk.green(key)}: ${chalk.grey(process.env[key])}`)
      }
    }
  }

  if (!silent) {
    for (const o of ok) console.log(o)
    for (const e of errors) {
      console.log(
        chalk.redBright('Error:'),
        'Required environment variable',
        chalk.redBright(e),
        "is missing. The backend won't start without it.",
        '\n',
        chalk.yellow('See: '),
        chalk.yellow.bold('https://freesewing.dev/reference/backend'),
        '\n'
      )
    }
  }

  if (errors.length > 0) {
    console.log(chalk.redBright('Invalid configuration. Stopping here...'))
    return process.exit(1)
  }

  if (envToBool(process.env.BACKEND_ENABLE_DUMP_CONFIG_AT_STARTUP)) {
    const dump = {
      ...config,
      encryption: {
        ...config.encryption,
        key: config.encryption.key.slice(0, 4) + '**redacted**' + config.encryption.key.slice(-4),
      },
      jwt: {
        secretOrKey:
          config.jwt.secretOrKey.slice(0, 4) + '**redacted**' + config.jwt.secretOrKey.slice(-4),
      },
    }
    if (config.cloudflareImages)
      dump.cloudflareImages = {
        ...config.cloudflareImages,
        token:
          config.cloudflareImages.token.slice(0, 4) +
          '**redacted**' +
          config.cloudflareImages.token.slice(-4),
      }
    console.log(chalk.cyan.bold('Dumping configuration:\n'), asJson(dump, null, 2))
  }

  return config
}

/*
 * Generates a random key
 *
 * This is a convenience method, typically used in a scenario where people want
 * to kick the tires by spinning up a Docker container running this backend.
 * The backend won't start without a valid encryption key. So rather than add
 * this roadblock to such users, it will auto-generate an encryption key and
 * write it to disk.
 */
function ensureKey(id = 'encryption', bytes = 64) {
  const filename = `${id}.key`
  console.log(chalk.yellow(`⚠️  No e${id} key provided`))
  let key = false
  try {
    console.log(chalk.dim(`Checking for prior auto-generated ${id} key`))
    key = readFileSync(filename, 'utf-8').trim()
  } catch (err) {
    console.log(chalk.dim(`No prior auto-generated ${id} key found.`))
  }
  if (key) {
    console.log(chalk.green(`✅ Prior ${id} key found.`))
  } else {
    console.log(chalk.green(`✅ Generating new random ${id} key`))
    key = randomString(bytes)
    writeFileSync(filename, key)
  }

  return key
}
