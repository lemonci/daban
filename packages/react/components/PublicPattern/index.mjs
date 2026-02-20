// Dependencies
import { cloudflareImageUrl, horFlexClasses, patternUrlFromState } from '@freesewing/utils'
import { urls, control as controlConfig } from '@freesewing/config'
// Context
import { LoadingStatusContext } from '@freesewing/react/context/LoadingStatus'
import { ModalContext } from '@freesewing/react/context/Modal'
// Hooks
import React, { useState, useEffect, useContext } from 'react'
import { useAccount } from '@freesewing/react/hooks/useAccount'
import { useBackend } from '@freesewing/react/hooks/useBackend'
// Components
import Markdown from 'react-markdown'
import { Link as WebLink } from '@freesewing/react/components/Link'
import { CloneIcon, FreeSewingIcon, ShowcaseIcon } from '@freesewing/react/components/Icon'
import { TimeAgo } from '@freesewing/react/components/Time'
import { ModalWrapper } from '@freesewing/react/components/Modal'
import { KeyVal } from '@freesewing/react/components/KeyVal'
import { BadgeLink, PatternCard } from '@freesewing/react/components/Account'

/**
 * A component to view a public pattern
 *
 * @component
 * @param {object} props - All component props
 * @param {number} props.id - The pattern ID to load
 * @param {React.Component} props.Link - A framework specific Link component for client-side routing
 * @returns {JSX.Element}
 */
export const PublicPattern = ({ id, Link }) => {
  if (!Link) Link = WebLink
  // Hooks
  const { account, control } = useAccount()
  const { setLoadingStatus } = useContext(LoadingStatusContext)
  const backend = useBackend()

  // Context
  const { setModal } = useContext(ModalContext)

  const [pattern, setPattern] = useState()
  const [notFound, setNotFound] = useState(false)

  // Effect
  useEffect(() => {
    const getPattern = async () => {
      setLoadingStatus([true, 'Loading pattern from backend'])
      const [status, body] = await backend.getPublicPattern(id)
      if (status === 200) {
        setPattern(body)
        setLoadingStatus([true, 'Loaded pattern', true, true])
      } else if (status === 404) {
        setNotFound(true)
        setLoadingStatus([true, 'Not Found', true, false])
      } else {
        setLoadingStatus([true, 'An error occured. Please report this', true, false])
      }
    }
    if (id) getPattern()
  }, [id])

  const clone = async () => {
    setLoadingStatus([true, 'Cloning pattern'])
    // Compile data
    const data = { ...pattern }
    delete data.id
    delete data.createdAt
    delete data.data
    delete data.userId
    delete data.img
    data.name += ' (clone)'
    const [status, body] = await backend.createPattern(data)
    if (status === 201 && body.result === 'created') {
      setLoadingStatus([true, 'Loading newly created pattern', true, true])
      window.location = `/account/data/patterns/pattern?id=${body.pattern.id}`
    } else setLoadingStatus([true, 'We failed to create this pattern', true, false])
  }

  if (notFound) return <div>Pattern not found</div>

  if (!pattern) return null

  const header = <PatternHeader {...{ pattern, Link, account, setModal, clone }} />

  return (
    <div className="tw:w-full">
      {header}
      {control >= controlConfig.account.patterns.notes && (
        <>
          <h3>Notes</h3>
          <Markdown>{pattern.notes}</Markdown>
        </>
      )}
    </div>
  )
}

/**
 * Helper component to show the pattern title, image, and various buttons
 */
const PatternHeader = ({ pattern, Link, account, setModal, clone }) => (
  <>
    <h2>{pattern.name}</h2>
    <div className="tw:flex tw:flex-row tw:flex-wrap tw:gap-2 tw:text-sm tw:items-center tw:mb-2">
      <KeyVal k="ID" val={pattern.id} color="secondary" />
      <KeyVal k="Created" val={<TimeAgo iso={pattern.createdAt} />} color="secondary" />
      <KeyVal k="Updated" val={<TimeAgo iso={pattern.updatedAt} />} color="secondary" />
    </div>
    <div className="tw:flex tw:flex-wrap tw:md:flex-nowrap tw:flex-row tw:gap-2 tw:w-full">
      <div className="tw:w-full tw:md:w-96 tw:shrink-0">
        <PatternCard pattern={pattern} size="md" Link={Link} />
      </div>
      <div className="tw:flex tw:flex-col tw:justify-end tw:gap-2 tw:mb-2 tw:grow">
        {account.control > 3 ? (
          <div className="tw:flex tw:flex-row tw:gap-2 tw:items-center">
            <BadgeLink label="JSON" href={`${urls.backend}/patterns/${pattern.id}.json`} />
            <BadgeLink label="YAML" href={`${urls.backend}/patterns/${pattern.id}.yaml`} />
          </div>
        ) : (
          <span></span>
        )}
        <button
          onClick={() =>
            setModal(
              <ModalWrapper flex="col" justify="top tw:lg:justify-center" slideFrom="right">
                <img src={cloudflareImageUrl({ type: 'public', id: pattern.img })} />
              </ModalWrapper>
            )
          }
          className={`tw:daisy-btn tw:daisy-btn-secondary tw:daisy-btn-outline ${horFlexClasses}`}
        >
          <ShowcaseIcon />
          Show Image
        </button>
        <button
          onClick={() => (window.location = patternUrlFromState(pattern, true))}
          className={`tw:daisy-btn tw:daisy-btn-primary ${horFlexClasses}`}
        >
          <FreeSewingIcon /> View Pattern
        </button>
        {account.control > 3 && account.username ? (
          <button
            className={`tw:daisy-btn tw:daisy-btn-primary tw:daisy-btn-outline ${horFlexClasses}`}
            onClick={clone}
          >
            <CloneIcon /> Clone Pattern
          </button>
        ) : null}
      </div>
    </div>
  </>
)
