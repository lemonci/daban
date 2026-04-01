import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import axios from 'axios'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import remarkFrontmatter from 'remark-frontmatter'
import mustache from 'mustache'
import { fileURLToPath } from 'url'
import allSubscribers from '../local/subs.json' with { type: 'json' }

const testSubscribers = [
  {
    email: 'joost@joost.at',
    uuid: 'testuuidhere',
  },
]

// Current working directory
const cwd = path.dirname(fileURLToPath(import.meta.url))

const backend = 'https://backend.freesewing.eu/'

const i18n = {
  en: {
    title: 'FreeSewing newsletter',
    support: 'Support FreeSewing: Become a patron',
    unsub1: 'You can unsubscribe at any time',
    unsub2: 'Or reply and tell us you want out',
  },
}

const asHtml = async (text) => {
  const content = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(text)

  return content.value
}

const getSubscribers = async (test = true) => (test ? testSubscribers : allSubscribers)

const send = async (test = true) => {
  const us = 'FreeSewing <no-reply@newsletter.freesewing.eu>'
  const template = fs.readFileSync(`${cwd}/../config/templates/newsletter.html`, 'utf8')
  const edition = fs.readFileSync(
    `${cwd}/../sites/org/newsletter/${process.env.NL_EDITION}/index.mdx`,
    'utf8'
  )
  const subscribers = test ? testSubscribers : allSubscribers
  subscribers.sort()

  let i = 1
  const start = 0
  const content = await asHtml(edition)
  const count = subscribers.length

  for (let sub of subscribers) {
    if (i > start) {
      if (i % 100 === 0) fs.writeFileSync('./local/subsdone', `${i}`)
      const unsubGet = `https://freesewing.eu/newsletter/unsubscribe?x=${sub.uuid}`
      const unsubPost = `https://backend.freesewing.eu/ocunsub/${sub.uuid}`
      const body = mustache.render(template, {
        ...i18n.en,
        unsubscribe: unsubGet,
        content,
      })

      console.log(`${i}/${count} - ${sub.email}`)
      let result
      try {
        result = await axios.post(
          `https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails`,
          {
            from: {
              name: 'FreeSewing',
              email: `no-reply@newsletter.freesewing.eu`,
            },
            to: [{ name: sub.email, email: sub.email }],
            subject: i18n.en.title,
            text: edition,
            html: body,
            project_id: process.env.BACKEND_SCALEWAY_PROJECT_ID,
            domain_name: 'newsletter.freesewing.eu',
            additional_headers: [
              {
                key: 'Reply-To',
                value: 'support@freesewing.eu',
              },
              {
                key: 'Message-ID',
                value: `<${crypto.randomUUID()}@newsletter.freesewing.eu>`,
              },
            ],
          },
          {
            headers: {
              'X-Auth-Token': process.env.BACKEND_SCALEWAY_EMAIL_TOKEN,
            },
          }
        )
      } catch (err) {
        console.log(`Failed to POST email data to Scaleway: ${err.message}`)
      }
      i++
    }
  }
}

const sendTest = () => send(true)
const sendReal = () => send(false)

export { sendTest, sendReal }
