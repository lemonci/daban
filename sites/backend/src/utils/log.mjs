import logger from 'pino'

export const log = logger()

/*
 * We add an extra methods here: log.todo
 * This helps us debug by making the message stand out
 *
 * Since grepping for 'todo' is a common way to check for things
 * still to be done, we are splitting this in to+do so it won't match.
 */
log['to' + 'do'] = (a, b) => {
  const location = new Error().stack.split('\n')[2]

  return typeof a === 'object' ? log.warn(a, `🟠 ${b}${location}`) : log.warn(`🟠 ${a}${location}`)
}
