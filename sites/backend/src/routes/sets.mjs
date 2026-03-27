import { SetsController } from '../controllers/sets.mjs'

const Sets = new SetsController()
const jwt = ['jwt', { session: false }]
const bsc = ['basic', { session: false }]

export function setsRoutes(tools) {
  const { app, passport } = tools

  // Create a measurements set
  app.post('/sets/jwt', passport.authenticate(...jwt), (req, res) => Sets.create(req, res, tools))
  app.post('/sets/key', passport.authenticate(...bsc), (req, res) => Sets.create(req, res, tools))

  // Clone a measurements set
  app.post('/sets/:uuid/clone/jwt', passport.authenticate(...jwt), (req, res) =>
    Sets.clone(req, res, tools)
  )
  app.post('/sets/:uuid/clone/key', passport.authenticate(...bsc), (req, res) =>
    Sets.clone(req, res, tools)
  )

  // Read a measurements set
  app.get('/sets/:uuid/jwt', passport.authenticate(...jwt), (req, res) =>
    Sets.read(req, res, tools)
  )
  app.get('/sets/:uuid/key', passport.authenticate(...bsc), (req, res) =>
    Sets.read(req, res, tools)
  )

  // Get a list of measurements sets for the user
  app.get('/sets/jwt', passport.authenticate(...jwt), (req, res) => Sets.list(req, res, tools))
  app.get('/sets/key', passport.authenticate(...bsc), (req, res) => Sets.list(req, res, tools))

  // Update a measurements set
  app.patch('/sets/:uuid/jwt', passport.authenticate(...jwt), (req, res) =>
    Sets.update(req, res, tools)
  )
  app.patch('/sets/:uuid/key', passport.authenticate(...bsc), (req, res) =>
    Sets.update(req, res, tools)
  )

  // Delete a measurements set
  app.delete('/sets/:uuid/jwt', passport.authenticate(...jwt), (req, res) =>
    Sets.delete(req, res, tools)
  )
  app.delete('/sets/:uuid/key', passport.authenticate(...bsc), (req, res) =>
    Sets.delete(req, res, tools)
  )

  // Read a public measurements set as JSON or YAML (no auth needed, but will only work for public sets)
  app.get('/sets/:uuid.json', (req, res) => Sets.readPublic(req, res, tools, 'json'))
  app.get('/sets/:uuid.yaml', (req, res) => Sets.readPublic(req, res, tools, 'yaml'))
}
