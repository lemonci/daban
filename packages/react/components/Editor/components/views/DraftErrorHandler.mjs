// Dependencies
import React, { useState } from 'react'
import { relPath, urls } from '@freesewing/config'
import { Popout } from '../../../Popout/index.mjs'
import { CloseIcon, ExpandIcon } from '../../../Icon/index.mjs'
import { Link } from '../../../Link/index.mjs'
import { LogEntry } from './LogEntry.mjs'

export const DraftErrorHandler = ({ failure, errors }) => {
  const [expanded, setExpanded] = useState(false)
  const [hidden, setHidden] = useState(false)

  if (hidden || (!failure && errors.length === 0)) {
    return null
  }

  return (
    <Popout type="error">
      <p>
        Sorry, there were problems drafting your pattern with the given measurements and options.
      </p>
      <p>
        Please double check your measurements according to{' '}
        <Link href={relPath('docs/measurements/')}>our documentation</Link>. Also check{' '}
        <Link href={relPath('docs/about/faq/measurements-issues/')}>
          our common measurement issues FAQ entry
        </Link>
        .
      </p>
      <p>
        If you believe your measurements are correct and/or if you&apos;d like further assistance,
        you can ask for help <Link href={urls.social.Forum}>on our forum</Link>,{' '}
        <Link href={urls.social.Discord}>our Discord server</Link>, or{' '}
        <Link href={`${urls.monorepo}/issues`}>report an issue</Link>.
      </p>

      <div className={'tw:mt-4'}>
        <button
          className={`tw:daisy-btn tw:daisy-btn-primary`}
          onClick={() => setExpanded(!expanded)}
        >
          <ExpandIcon />
          Show error details
        </button>
        <button className={`tw:daisy-btn tw:ml-4`} onClick={() => setHidden(true)}>
          <CloseIcon />
          Hide
        </button>
      </div>
      {expanded ? (
        <div className={'tw:mt-8'}>
          {failure ? <LogEntry key="failure" logEntry={failure} /> : null}
          {errors.map((line, i) => (
            <LogEntry key={i} logEntry={line} />
          ))}
        </div>
      ) : null}
    </Popout>
  )
}
