import React from 'react'
import { shortUuid } from '@freesewing/utils'
import { KeyVal } from '@freesewing/react/components/KeyVal'

/**
 * A component to display a short version of a (v4) UUID
 *
 * @component
 * @param {object} props - All component props
 * @param {React.FC} [props.Link = false] - An optional framework-specific Link component
 * @param {string} props.uuid - The UUID
 * @param {string} [props.href = false] - An optional href to make this into a link
 * @param {string} [props.label = false] - An optional label to pass to the CopyToClipboardButton
 * @returns {JSX.Element}
 */
export const Uuid = ({ uuid, href = false, label = 'UUID', Link = false }) => (
  <KeyVal
    k="#"
    val={shortUuid(uuid)}
    color="neutral"
    copyVal={uuid}
    copyKey="UUID"
    href={href}
    Link={Link}
  />
)
