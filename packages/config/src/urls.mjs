/*
 * This configuration file exports various URLs.
 */
export const urls = {
  // FreeSewing Backend
  backend: 'https://backend.freesewing.eu',
  // FreeSewing CDN (content delivery network)
  cdn: 'https://cdn.freesewing.eu',
  // Server that serves images directly without CDN
  static: 'https://static.freesewing.eu',
  // FreeSewing website
  website: 'https://freesewing.eu',
  // FreeSewing monorepo
  monorepo: 'https://codeberg.org/freesewing/freesewing',
  // FreeSewing codeberg organisation
  codeberg: 'https://codeberg.org/freesewing',
  // Social media and other account links for FreeSewing
  social: {
    YouTube: 'https://www.youtube.com/@freesewing',
    Discord: 'https://discord.freesewing.eu/',
    Forum: 'https://forum.freesewing.eu',
    Facebook: 'https://www.facebook.com/groups/627769821272714/',
    Codeberg: 'https://codeberg.org/freesewing',
    Reddit: 'https://www.reddit.com/r/freesewing/',
    Mastodon: 'https://freesewing.social/@freesewing',
    Bluesky: 'https://bsky.app/profile/freesewing.org',
  },
}

/**
 * A utility function to create an absolute URL from a relative path
 * using the FreeSewing website base URL.
 *
 * @param {string} path - The relative path (e.g., '/docs/measurements')
 * @returns {string} - The absolute URL
 */
export const relPath = (path = '') => {
  const base = urls.website
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${base}${cleanPath}`
}
