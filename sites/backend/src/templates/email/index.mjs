import { emailchange } from './emailchange.mjs'
import { goodbye } from './goodbye.mjs'
import { signin } from './signin.mjs'
import { signup, signupaea, signupaed } from './signup.mjs'
import { nlsub, nlsubact } from './newsletter.mjs'

/*
 * Everything is kept lowercase here because these key names are used in URLS
 */
export const templates = {
  emailchange,
  goodbye,
  signin,
  signup,
  'signup-aea': signupaea,
  'signup-aed': signupaed,
  nlsub,
  nlsubact,
}
