// Dependencies
import { orderBy, imageCdnUrl, getSearchParam, formatMm } from '@freesewing/utils'
import { isDegreeMeasurement } from '@freesewing/config'
import { measurements as measurementTranslations } from '@freesewing/i18n'
// Hooks
import { useBackend } from '@freesewing/react/hooks/useBackend'
import React, { useState, useEffect } from 'react'
// Components
import { Link as WebLink } from '@freesewing/react/components/Link'
import { MiniWarning } from '@freesewing/react/components/Mini'
import { Spinner } from '@freesewing/react/components/Spinner'
import { Markdown } from '@freesewing/react/components/Markdown'
import { KeyVal } from '@freesewing/react/components/KeyVal'

/**
 * A component to render a lineup of curated measurements sets.
 *
 * You need to provide either a clickHandler or a method to resolve the URL to link to as the href prop.
 *
 * @component
 * @param {object} props - All component props
 * @param {React.Component} props.Link - A framework specific Link component for client-side routing
 * @param {function} [props.clickHandler = false] - An optional function to call when a set is clicked
 * @param {function} [props.href = false] - An optional function that should return the URL to be used for a given set
 * @returns {JSX.Element}
 */
export const CuratedSetLineup = ({ href = false, clickHandler = false, Link = false }) => {
  if (!Link) Link = WebLink
  // Hooks
  const backend = useBackend()

  // State (local)
  const [sets, setSets] = useState([])

  // Effects
  useEffect(() => {
    const getSets = async () => {
      const [status, body] = await backend.getCuratedSets()
      if (status === 200 && body.result === 'success') {
        setSets(orderBy(body.curatedSets, 'height', 'asc'))
      }
    }
    getSets()
  }, [])

  if (!href && !clickHandler)
    return (
      <MiniWarning>
        Please provide either a <code>href</code> or <code>clickHandler</code> prop to the{' '}
        <code>CuratedSetLineup</code> component.
      </MiniWarning>
    )

  return (
    <div
      className={`tw:w-full tw:flex tw:flex-row ${
        sets.length > 1 ? 'tw:justify-start tw:px-8' : 'tw:justify-center'
      } tw:overflow-x-scroll`}
      style={{
        backgroundImage: `url(/img/lineup-backdrop.svg)`,
        width: 'auto',
        backgroundSize: 'auto 100%',
        backgroundRepeat: 'repeat-x',
      }}
    >
      {sets.map((set) => {
        const props = {
          className:
            'tw:aspect-1/3 tw:w-auto tw:h-96 tw:bg-transparent tw:border-0 tw:hover:cursor-pointer tw:hover:bg-secondary/20',
          style: {
            backgroundImage: `url(${imageCdnUrl({
              id: set.uuid,
              type: 'cset',
            })})`,
            width: 'auto',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          },
          key: set.uuid,
        }

        return (
          <div className="tw:flex tw:flex-col tw:items-center" key={set.uuid}>
            {typeof clickHandler === 'function' ? (
              <button {...props} onClick={() => clickHandler(set)}></button>
            ) : null}
            {typeof href === 'function' ? <Link {...props} href={href(set)}></Link> : null}
            <b>{set.nameEn}</b>
          </div>
        )
      })}
    </div>
  )
}

/**
 * A component to render a curated measurements set
 *
 * @component
 * @param {object} props - All component props
 * @param {React.Component} props.Link - A framework specific Link component for client-side routing
 * @param {number} props.uuid - The UUID of the curated set
 * @returns {JSX.Element}
 */
export const CuratedSet = ({ Link = false, uuid = false }) => {
  if (!Link) Link = WebLink
  // Hooks
  const backend = useBackend()

  // State (local)
  const [set, setSet] = useState(false)
  const [setUuid, setSetUuid] = useState(false)

  // Effects
  useEffect(() => {
    if (uuid) setSetUuid(uuid)
    else setSetUuid(getSearchParam('uuid'))
    const getSet = async () => {
      const [status, body] = await backend.getCuratedSet(setUuid)
      if (status === 200 && body.result === 'success') {
        setSet({
          ...body.curatedSet,
          measies: {
            ...body.curatedSet.measies,
            height: body.curatedSet.height * 10,
          },
        })
      }
    }
    if (setUuid) getSet()
  }, [setUuid, uuid])

  if (!set) return <Spinner />

  return (
    <>
      <h2 className="tw:flex tw:flex-row tw:items-center tw:gap-2">
        {set.nameEn} <KeyVal k="uuid" val={set.uuid} />
      </h2>
      <Markdown>{set.notesEn}</Markdown>
      <h2>Image</h2>
      <img src={imageCdnUrl({ id: set.uuid, type: 'cset' })} />
      <h2>Measurements</h2>
      <table className="tw:table">
        <thead>
          <tr>
            <th>Measurement</th>
            <th>Metric</th>
            <th>Imperial</th>
          </tr>
        </thead>
        <tbody>
          {orderBy(
            Object.entries(set.measies || {}).map(([m, val]) => ({
              id: m,
              val,
              t: measurementTranslations[m],
            })),
            't',
            'asc'
          ).map((entry) => (
            <tr key={entry.id}>
              <td className="tw:text-right">{entry.t}</td>
              <td>{isDegreeMeasurement(entry.id) ? `${entry.val}°` : formatMm(entry.val)}</td>
              <td
                dangerouslySetInnerHTML={{
                  __html: isDegreeMeasurement(entry.id)
                    ? `${entry.val}°`
                    : formatMm(entry.val, true),
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
