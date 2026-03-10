import { InfoController } from '../controllers/info.mjs'
import { publicRateLimit } from '../middleware.mjs'

const Info = new InfoController()

export function infoRoutes(tools) {
  const { app } = tools

  // List statistics
  app.get('/info/stats', publicRateLimit, (req, res) => Info.getStats(req, res, tools))

  // List user count
  app.get('/info/users', publicRateLimit, (req, res) => Info.getUserCount(req, res, tools))
}
