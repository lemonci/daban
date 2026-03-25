import axios from 'axios'
import path from 'node:path'
import { run } from 'node:test'
import { spec } from 'node:test/reporters'
import { api } from '../src/api.mjs'
import { addEmail } from './emailtrap.mjs'

// Mutate the config to mock email delivery and disable rate limits
const transformConfig = (config) => {
  config.email.handler = async (config, params) => await axios.post(`http://localhost:3002`, params)
  config.limits = { auth: 1000, all: 10000 }
  return config
}

// Do not log
const silent = false

// If an argument was pased, limit the tests
const globPatterns = process.argv[2]
  ? [`./tests/10_signup.test.mjs`, `./tests/*${process.argv[2]}*.test.mjs`]
  : [`./tests/*.test.mjs`]

// Start the API
const server = await api(transformConfig, silent)

// Keep track of connections so we can terminate them when tests are over
const connections = new Set()

// Track connections
server.on('connection', (socket) => {
  connections.add(socket)
  socket.on('close', () => connections.delete(socket))
})

// This is the stream of tests we'll run
const testStream = run({
  concurrency: 1,
  coverageExcludeGlobs: `*.test.mjs`,
  globPatterns,
})

// When it ends, terminate the server
testStream.on('end', async () => {
  for (const socket of connections) socket.destroy()
  await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())))
})

/*
 * When it fails, return non-zero (aka failure)
 * Note that we're using the spec reporter here
 */
testStream
  .on('test:fail', () => (process.exitCode = 1))
  .on('test:stderr', (data) => console.log(data))
  .compose(spec)
  .pipe(process.stdout)
