import React from 'react'
import mustache from 'mustache'
import { flattenFlags } from '../lib/index.mjs'
import {
  ChatIcon,
  ErrorIcon,
  ExpandIcon,
  DocsIcon,
  FixmeIcon,
  FlagIcon,
  OptionsIcon,
  TipIcon,
  WarningIcon,
  WrenchIcon,
  CompactIcon,
} from '@freesewing/react/components/Icon'
import { SubAccordion } from './Accordion.mjs'
import Markdown from 'react-markdown'

/*
 * Helper object to look up flag icons
 */
const flagIcons = {
  error: ErrorIcon,
  expand: ExpandIcon,
  compact: CompactIcon,
  fixme: WrenchIcon,
  info: DocsIcon,
  note: ChatIcon,
  options: OptionsIcon,
  tip: TipIcon,
  warning: WarningIcon,
  warn: WarningIcon,
}

export const FlagTypeIcon = ({ type, size = 'md' }) => {
  const Icon = flagIcons[type] || FixmeIcon

  if (size === 'sm') return <Icon className="tw:w-5 tw:h-6 tw:sm:w-6 tw:h-6" />
  if (size === 'lg') return <Icon className="tw:w-8 tw:h-8" />

  return <Icon className="tw:w-6 tw:h-6" />
}

export const FlagErrorIconHeader = () => (
  <div className="tw:no-shrink tw:text-error">
    <FlagTypeIcon type="error" />
  </div>
)
export const FlagWarningIconHeader = () => (
  <div className="tw:no-shrink tw:text-warning">
    <FlagTypeIcon type="warning" />
  </div>
)
export const FlagNoteIconHeader = () => (
  <div className="tw:no-shrink tw:text-secondary">
    <FlagTypeIcon type="note" />
  </div>
)
export const FlagTipIconHeader = () => (
  <div className="tw:no-shrink tw:text-success">
    <FlagTypeIcon type="tip" />
  </div>
)

export const FlagWrapper = (props) => (
  <div className="tw:flex tw:flex-col tw:gap-2 tw:items-start tw:bg-base-800 tw:px-4">
    <Flag {...props} />
  </div>
)

const flagIconHeaders = {
  error: FlagErrorIconHeader,
  fixme: FlagWarningIconHeader,
  warn: FlagWarningIconHeader,
  info: FlagNoteIconHeader,
  note: FlagNoteIconHeader,
  tip: FlagTipIconHeader,
}

export const Flag = ({ data, handleUpdate, strings }) => {
  const btnIcon = data.suggest?.icon ? <FlagTypeIcon type={data.suggest.icon} size="sm" /> : null

  const button =
    data.suggest?.text && data.suggest?.update ? (
      btnIcon ? (
        <button
          className="tw:daisy-btn tw:daisy-btn-secondary tw:daisy-btn-outline tw:flex tw:flex-row tw:items-center tw:gap-6"
          onClick={() => handleUpdate(data.suggest.update)}
        >
          {btnIcon}
          {translate(data.suggest.text, strings)}
        </button>
      ) : (
        <button
          className="tw:daisy-btn tw:daisy-btn-secondary tw:daisy-btn-outline tw:flex tw:flex-row tw:items-center"
          onClick={() => handleUpdate(data.suggest.update)}
        >
          {btnIcon}
          {translate(data.suggest.text, strings)}
        </button>
      )
    ) : null

  const desc = data.replace
    ? mustache.render(translate(data.desc, strings), data.replace)
    : translate(data.desc, strings)
  const notes = data.notes
    ? Array.isArray(data.notes)
      ? '\n\n' +
        data.notes
          .map((note) =>
            data.replace
              ? mustache.render(strings[note] || note, data.replace)
              : strings[note] || note
          )
          .join('\n\n')
      : '\n\n' +
        (data.replace
          ? mustache.render(strings[data.notes] || data.notes, data.replace)
          : strings[data.notes] || data.notes)
    : null

  return (
    <div className="tw:first:mt-0 tw:last:mb-0 tw:grow md flag tw:flex tw:flex-col tw:gap-2">
      {desc ? <Markdown>{strings[desc] || desc}</Markdown> : null}
      {notes ? <Markdown>{strings[notes] || notes}</Markdown> : null}
      {button ? (
        <div className="tw:mt-2 tw:w-full tw:flex tw:flex-row tw:justify-end">{button}</div>
      ) : null}
    </div>
  )
}

export const FlagsAccordionEntries = ({ flags, update, strings, Design }) => {
  const flagList = flattenFlags(flags)

  if (Object.keys(flagList).length < 1) return null

  const handleUpdate = (config) => {
    if (config.settings) update.settings(...config.settings)
    if (config.ui) update.ui(...config.settings)
  }

  return (
    <SubAccordion
      items={Object.entries(flagList).map(([key, flag], i) => {
        const title = flag.replace
          ? mustache.render(translate(flag.title, strings), flag.replace)
          : translate(flag.title, strings)
        const FlagIconHeader = flagIconHeaders[flag.type] || FlagTipIconHeader

        return [
          <div className="tw:w-full tw:flex tw:flex-row tw:gap2 tw:justify-between" key={i}>
            <div className="tw:flex tw:flex-row tw:items-center tw:gap-2">
              <FlagIconHeader />
              <span className="tw:font-medium tw:text-left">{title}</span>
            </div>
            <span className="tw:uppercase tw:font-bold">{flag.type}</span>
          </div>,
          <FlagWrapper
            key={key}
            data={flag}
            strings={strings}
            handleUpdate={handleUpdate}
            design={Design?.designConfig?.data?.id}
          />,
          key,
        ]
      })}
    />
  )
}

function translate(t, strings) {
  return strings[t] ? strings[t] : t
}
