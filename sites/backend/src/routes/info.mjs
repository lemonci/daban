import { InfoController } from '../controllers/info.mjs'

const Info = new InfoController()

export function infoRoutes(tools) {
  const { app, limit } = tools

  // List statistics
  app.get('/info/stats', limit.auth, (req, res) => Info.getStats(req, res, tools))

  // List user count
  app.get('/info/users', limit.auth, (req, res) => Info.getUserCount(req, res, tools))
}
