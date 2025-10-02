// Ejected Docusaurus components
import React, { useContext } from 'react'
import Head from '@docusaurus/Head'
import MDXCode from '@theme/MDXComponents/Code'
import MDXA from '@theme/MDXComponents/A'
import MDXPre from '@theme/MDXComponents/Pre'
import MDXDetails from '@theme/MDXComponents/Details'
import MDXHeading from '@theme/MDXComponents/Heading'
import MDXLi from '@theme/MDXComponents/Li'
import MDXImg from '@theme/MDXComponents/Img'
import Admonition from '@theme/Admonition'
import Mermaid from '@theme/Mermaid'
// Other Docusaurus components
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
// Custom FreeSewing components
import { Example } from './example.mjs'
import { ReadMore } from './readmore.js'
//import { Term } from './term.js'
// Components
import { SearchIcon } from '@freesewing/react/components/Icon'
// Context
import { ModalContext } from '@freesewing/react/context/Modal'
import { ModalWrapper } from '@freesewing/react/components/Modal'
// Dependencies
import jargon from '@site/prebuild/jargon.js'
import terminology from '@site/prebuild/terminology.js'
import { linkClasses } from '@freesewing/utils'
import { MDXProvider } from '@mdx-js/react'

export const PropsTable = ({ props, params = false, returns = false }) => (
  <table className="tw:table">
    <thead>
      <tr>
        <th>{params ? 'Parameter' : 'Prop'}</th>
        <th>Type</th>
        <th>Default</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(props).map(([name, obj]) => (
        <PropRow {...{ name, ...obj }} />
      ))}
    </tbody>
    {returns ? (
      <>
        <thead>
          <tr>
            <th>Return Type</th>
            <th colspan="3">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{returns.type}</td>
            <td colspan="3">{returns.desc}</td>
          </tr>
        </tbody>
      </>
    ) : null}
  </table>
)
export const ParamsTable = ({ params, returns }) => (
  <PropsTable props={params} params={true} returns={returns} />
)

export const PropRow = ({ name, type, dflt, desc }) => (
  <tr>
    <td>{name}</td>
    <td>{type}</td>
    <td>
      <code>{dflt}</code>
    </td>
    <td>{desc}</td>
  </tr>
)

/*
 * Helper to intersperse an array
 */
const intersperse = (arr, sep) => arr.reduce((a, v) => [...a, v, sep], []).slice(0, -1)

/*
 * This is used for <em> tags.
 * If it's a term, if it wraps a term in our terminology, it will make it clickable.
 * If not, it will merely return the em tag.
 */
const Term = ({ children }) => {
  // Modal Context
  const { setModal } = useContext(ModalContext)

  // Figure out what we're dealing with
  const term = asTerm(children)

  // Often, it's just en em tag
  if (term === false) return <em>{children}</em>

  // Shared CSS classes
  const className = `${linkClasses} tw:underline tw:decoration-dashed tw:hover:decoration-3 tw:hover:decoration-solid tw:hover:pointer-help`

  // Jargon has a content prop, whereas terminology does not
  const modalContent = term.content ? (
    <ModalWrapper wide keepOpenOnClick={true}>
      <JargonInfo term={term} />
    </ModalWrapper>
  ) : null

  return term.content ? (
    <button onClick={() => setModal(modalContent)} className={className}>
      {children}{' '}
      <span className="tw:inline-block tw:-translate-y-2 tw:-translate-x-0.5 tw:font-bold tw:text-sm">
        ?
      </span>
    </button>
  ) : (
    <a href={term.url} title={term.title} className={className}>
      {term.title}
    </a>
  )
}

/*
 * Lowercase and strip dots, then check if we have a definition for the term
 * If not, return false
 */
const asTerm = (term) => {
  if (typeof term !== 'string') return false
  term = term.toLowerCase() //.split('.').join('')

  // Check jargon
  if (jargon[term]) return jargon[term]
  // Check terminology
  if (terminology[term]) return terminology[term]

  // Check jargon aliases
  for (const [key, val] of Object.entries(jargon)) {
    if (val.aliases && val.aliases.includes(term)) return val
  }
  // Check terminology aliases
  for (const [key, val] of Object.entries(terminology)) {
    if (val.aliases && val.aliases.includes(term)) return val
  }

  return false
}

/*
 * React component to display the term info inside the modal wrapper
 */
const JargonInfo = ({ term }) => {
  const Content = term.content
  return (
    <div>
      <h2>{term.title}</h2>
      <MDXProvider components={MDXComponents}>
        <Content />
      </MDXProvider>
    </div>
  )
}

export const JargonTerms = () => (
  <table>
    <thead>
      <tr>
        <th>Use As</th>
        <th>Info</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(jargon)
        .sort()
        .map((term) => {
          const Component = jargon[term].content
          const aliases = [
            jargon[term].term ? jargon[term].term : term,
            ...(jargon[term].aliases || []),
          ]

          return (
            <tr key={term}>
              <td style={{ minWidth: '12ch' }}>
                {intersperse(aliases, 'or').map((alias, i) =>
                  alias === 'or' ? <b key={i}> or </b> : <span key={i}>_{alias}_</span>
                )}
              </td>
              <td>
                <h6>{jargon[term].title}</h6>
                <div style={{ fontSize: '85%' }}>
                  <Component />
                </div>
              </td>
            </tr>
          )
        })}
    </tbody>
  </table>
)

export const JargonList = () => (
  <>
    {Object.keys(jargon)
      .sort()
      .map((term) => {
        const Component = jargon[term].content
        const aliases = [
          jargon[term].term ? jargon[term].term : term,
          ,
          ...(jargon[term].aliases || []),
        ]

        return (
          <div key="term">
            <h2
              id={term}
              className="anchor anchorWithStickyNavbar_---node_modules-@docusaurus-theme-classic-lib-theme-Heading-styles-module"
            >
              <div style={{ opacity: '0.5', fontSize: '65%' }}>
                Use as:
                {intersperse(aliases, 'or').map((alias) =>
                  alias === 'or' ? (
                    <b> or </b>
                  ) : (
                    <code style={{ padding: '0 0.25rem', fontWeight: 'normal' }} key={alias}>
                      _{alias}_
                    </code>
                  )
                )}
              </div>
              {jargon[term].title}
              <a
                href={`#${term.split(' ').join('-')}`}
                class="hash-link"
                ariaLabel={`Direct link to ${jargon[term].title}`}
                title={`Direct link to ${jargon[term].title}`}
              >
                {' '}
              </a>
            </h2>
            <div>
              <Component />
            </div>
          </div>
        )
      })}
  </>
)

export const TerminologyTerms = () => (
  <table>
    <thead>
      <tr>
        <th>Use as</th>
        <th>Links to</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(terminology).map((term) => {
        const aliases = [
          terminology[term].term ? terminology[term].term : term,
          ,
          ...(terminology[term].aliases || []),
        ]

        return (
          <tr key="term">
            <td style={{ minWidth: '12ch' }}>
              {intersperse(aliases, 'or').map((alias, i) =>
                alias === 'or' ? <b key={i}> or </b> : <span key={i}>_{alias}_</span>
              )}
            </td>
            <td>
              <a href={terminology[term].url}>{terminology[term].url}</a>
            </td>
          </tr>
        )
      })}
    </tbody>
  </table>
)

const MDXComponents = {
  // Ejected Docusaurus components
  Head,
  details: MDXDetails,
  Details: MDXDetails,
  code: MDXCode,
  a: MDXA,
  pre: MDXPre,
  li: MDXLi,
  img: MDXImg,
  h1: (props) => <MDXHeading as="h1" {...props} />,
  h2: (props) => <MDXHeading as="h2" {...props} />,
  h3: (props) => <MDXHeading as="h3" {...props} />,
  h4: (props) => <MDXHeading as="h4" {...props} />,
  h5: (props) => <MDXHeading as="h5" {...props} />,
  h6: (props) => <MDXHeading as="h6" {...props} />,
  admonition: Admonition,
  mermaid: Mermaid,
  Tabs,
  TabItem,
  PropsTable,
  ParamsTable,
  // Custom FreeSewing components
  em: Term,
  Example,
  ReadMore,
  ConsoleButton: ({ data }) => (
    <button
      className="tw:hidden tw:md:flex tw:daisy-btn tw:daisy-btn-secondary tw:flex-row tw:gap-2"
      onClick={() => console.log(data)}
    >
      <SearchIcon /> Show in browser console
    </button>
  ),
  // Prose styles
  ul: (props) => <ul className="tw:list tw:list-inside tw:list-disc tw:ml-2">{props.children}</ul>,
  ol: (props) => (
    <ul className="tw:list tw:list-inside tw:list-decimal tw:ml-2">{props.children}</ul>
  ),
}

export default MDXComponents
