import React from 'react'
import { StatichostLogo } from '@site/src/components/brands.mjs'
import { FreeSewingLogo } from '@freesewing/react/components/Logo'

export default function FooterCopyright({ copyright }) {
  return (
    <>
      <div className="tw:flex tw:flex-col tw:items-center tw:mt-12 tw:text-sm">
        <FreeSewingLogo />
      </div>
      <div
        className="footer__copyright tw:py-4"
        // Developer provided the HTML, so assume it's safe.
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: copyright }}
      />
      <div className="tw:flex tw:flex-col tw:items-center tw:mt-12">
        <StatichostLogo />
        <div className="tw:pt-2 tw:text-xs">
          Hosting by{' '}
          <a href="https://www.statichost.eu/" target="_blank">
            statichost.eu
          </a>
        </div>
      </div>
    </>
  )
}
