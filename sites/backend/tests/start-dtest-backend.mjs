import axios from 'axios'
import { api } from '../src/api.mjs'
import { addEmail } from './emailtrap.mjs'

/*
 * Transform the config to inject our custom email handler
 *
 * @param {object} config - The original config
 * @return {object} config - The mutated config object
 */
const transformConfig = (config) => {
  config.email.handler = async (config, params) => await axios.post(`http://localhost:3002`, params)
  config.limits = { auth: 1000, all: 10000 }

  return config
}

// Keep it silent for tests
const silent = true

//Start the backend with our custom email handler
api(transformConfig, silent)
