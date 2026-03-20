// Dependencies
import express from 'express'
import helmet from 'helmet'
import chalk from 'chalk'
import { createDb } from './utils/db.mjs'
import passport from 'passport'
// Routes
import { routes } from './routes/index.mjs'
// Config
import { verifyConfig } from './config.mjs'
// Middleware
import { loadExpressMiddleware, loadPassportMiddleware } from './middleware.mjs'
// Encryption
import { encryption } from './utils/crypto.mjs'
// Multi-Factor Authentication (MFA)
import { mfa } from './utils/mfa.mjs'
// OIDC Provider
import { loadOidcProvider } from './utils/oidc-provider.mjs'
// Role-Based Access Control (RBAC)
import { rbac } from './utils/rbac.mjs'
// Email
import { mailer } from './utils/email.mjs'
// Swagger
import swaggerUi from 'swagger-ui-express'
import { openapi } from '../openapi/index.mjs'
// Catch-all page
import { html as catchAll } from './html/catch-all.mjs'

/**
 * This is the main entrypoint. Call this to start the API.
 *
 * @param {function|boolean} [transformConfig] - An optional config transformer function
 * @param {boolean} [silent] - Set this to true to silence startup logs (non-JSON logs)
 */
export const api = (transformConfig = false, silent = false) => {
  // Bootstrap
  const config = verifyConfig(transformConfig, silent)
  const dbPath = config.db.path
  const prisma = createDb(dbPath)
  const app = express()
  app.set('trust proxy', 1)
  app.use(
    helmet({
      // The Swagger UI uses inline scripts, so we relax CSP only for /docs
      contentSecurityPolicy: false,
    })
  )
  app.use(express.json({ limit: '12mb' })) // Required for img upload
  app.use(express.urlencoded({ extended: false })) // Form submission for OIDC
  app.use(express.static('public'))
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi))

  const tools = {
    app,
    passport,
    prisma,
    ...encryption(config.encryption.key),
    ...mfa(config.mfa),
    ...mailer(config),
    ...rbac(config.roles),
    config,
  }

  // Load middleware
  loadExpressMiddleware(app, tools)
  loadPassportMiddleware(passport, tools)

  // Load routes
  for (const type in routes) routes[type](tools)

  // Load OIDC provider
  loadOidcProvider(tools)

  app.get('/', async (req, res) => res.set('Content-Type', 'text/html').status(200).send(catchAll))

  // Start listening for requests
  return app.listen(config.port, (err) => {
    if (err) console.error(chalk.red('Error occured'), err)
    if (process.env.NODE_ENV === 'development') console.log(chalk.yellow('> in development'))
    console.log(chalk.green(`🚀  REST API ready, listening on ${config.api}`))
  })
}
