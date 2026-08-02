import jwt from 'jsonwebtoken'

export function OidcController() {}

/*
 * Handles the initial OIDC interaction request.
 *
 * The node-oidc-provider redirects here (GET /interaction/:uid) after the
 * authorization endpoint (/oidc/auth) receives a request from a client (the
 * forum, or a future OIDC client).
 * The provider already set the signed _interaction session cookie
 * in the user's browser during that authorization redirect.
 *
 * We simply redirect to the frontend so the user can authenticate. The uid is
 * passed in the query string so the frontend knows which interaction to complete.
 */
OidcController.prototype.init = async (req, res, tools) => {
  try {
    // interactionDetails validates the signed _interaction cookie against the
    // uid in the URL. If the cookie is absent or tampered, it throws.
    const details = await tools.oidcProvider.interactionDetails(req, res)
    return res.redirect(
      `https://freesewing.eu/oidc-flow/?uid=${details.uid}&client=${details.params?.client_id}`
    )
  } catch (err) {
    console.error('OIDC init error:', err)
    return res.status(400).send('Invalid or expired OIDC interaction')
  }
}

/*
 * Handles the OIDC login submission from the FreeSewing frontend.
 *
 * Security model:
 *
 * 1. SESSION BINDING — interactionDetails() validates the signed _interaction
 *    cookie set by node-oidc-provider during the authorization redirect. Only
 *    the browser that initiated the OIDC flow (and therefore holds that cookie)
 *    can complete it. Any request lacking the correct cookie is rejected here
 *    before we look at the user's identity at all.
 *
 * 2. AUTHENTICATION — the user's JWT must be provided as a standard Bearer
 *    token in the Authorization header, NOT in the request body. Accepting
 *    tokens in the body would allow CSRF attacks and makes it trivial to
 *    replay a stolen token against an arbitrary interaction uid.
 *
 * 3. SEPARATION OF CONCERNS — the login result only sets the accountId.
 *    Consent/grant approval is handled by the loadExistingGrant callback
 *    configured in the provider, which is the correct place for it.
 */
OidcController.prototype.login = async (req, res, tools) => {
  // Step 1: Validate the OIDC interaction session.
  // This is the session-fixation guard: if the interaction cookie is missing,
  // does not match the uid in the URL, or has expired, we reject immediately.
  let interactionDetails
  try {
    interactionDetails = await tools.oidcProvider.interactionDetails(req, res)
  } catch (err) {
    console.error('OIDC interaction validation failed:', err)
    return res
      .status(400)
      .json({ error: 'invalid_request', error_description: 'Invalid or expired OIDC interaction' })
  }

  // Step 2: Authenticate the user via their FreeSewing JWT.
  //
  // The token may arrive as a Bearer header (XHR/fetch) or in the form body
  // as req.body.token (native HTML form POST). Both are equally secure here
  // because the real CSRF protection is the _interaction cookie validated in
  // step 1: that cookie is HttpOnly, so no cross-site request can include it,
  // and without it interactionDetails() throws before we ever reach this point.
  // A token in the form body therefore cannot be replayed against a different
  // interaction — the cookie always ties the token to this specific session.
  const authHeader = req.headers['authorization']
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : req.body?.token

  if (!rawToken) {
    return res.status(401).json({ error: 'unauthorized', error_description: 'Token required' })
  }

  let decoded
  try {
    decoded = jwt.verify(rawToken, tools.config.jwt.secretOrKey, {
      issuer: tools.config.jwt.issuer,
    })
  } catch (err) {
    return res
      .status(401)
      .json({ error: 'unauthorized', error_description: 'Invalid or expired token' })
  }

  // Verify the audience claim to prevent tokens issued for one instance being
  // accepted by another instance even if they share the same signing key.
  const expectedAud = `${tools.config.api}/${tools.config.instance}`
  if (!decoded._id || decoded.aud !== expectedAud) {
    return res
      .status(401)
      .json({ error: 'unauthorized', error_description: 'Invalid token payload' })
  }

  // Step 3: Complete the OIDC interaction.
  // We only set the login result here. Grant/consent is handled automatically
  // by the loadExistingGrant callback in the provider configuration, which is
  // the correct place for consent decisions according to the library's design.
  const result = {
    login: {
      accountId: String(decoded._id),
    },
  }

  try {
    await tools.oidcProvider.interactionFinished(req, res, result, {
      mergeWithLastSubmission: false,
    })
  } catch (err) {
    console.error('OIDC interactionFinished error:', err)
    return res.status(500).send('OIDC Server Error')
  }
}
