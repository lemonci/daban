import { SubscribersController } from '../controllers/subscribers.mjs'

const Subscriber = new SubscribersController()

export function subscribersRoutes(tools) {
  const { app, limit } = tools

  /*
   * None of these require authentication
   */

  // Subscribe to the newsletter
  app.post('/subscriber', limit.all, (req, res) => Subscriber.subscribe(req, res, tools))

  // Confirm subscription to the newsletter
  app.put('/subscriber', (req, res) => Subscriber.subscribeConfirm(req, res, tools))

  // Unsubscribe from newsletter
  app.delete('/subscriber/:uuid', (req, res) => Subscriber.unsubscribe(req, res, tools))

  // One-Click unsubscribe (ocunsub) from newsletter needs to be a POST request.
  // See https://datatracker.ietf.org/doc/html/rfc8058
  app.post('/ocunsub/:uuid', (req, res) => Subscriber.ocunsub(req, res, tools))

  // Just in case somebody lands here with a GET request
  app.get('/ocunsub/:uuid', (req, res) =>
    res.redirect(`https://freesewing.eu/newsletter/unsubscribe?i=${req.params.uuid}`)
  )
}
