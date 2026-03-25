import pinoLogger from 'pino'

export const logger = ({ silent = false }) => {
  // If silent is set, do not log
  if (silent) return silentLogger

  // By default, we log with Pino
  const log = pinoLogger()

  /*
   * We add an extra methods here: log.todo
   * This helps us debug by making the message stand out
   *
   * Since grepping for 'todo' is a common way to check for things
   * still to be done, we are splitting this in to+do so it won't match.
   */
  log['to' + 'do'] = (a, b) => {
    const location = new Error().stack.split('\n')[2]

    return typeof a === 'object'
      ? log.warn(a, `🟠 ${b}${location}`)
      : log.warn(`🟠 ${a}${location}`)
  }

  return log
}

// A method that does nothing
const noop = () => null

// A logger that does nothing
const silentLogger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  todo: noop,
  trace: noop,
}
