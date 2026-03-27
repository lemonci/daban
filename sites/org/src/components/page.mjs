import React from 'react'
import DocusaurusLayout from '@theme/Layout'
import { DocusaurusPage as InnerDocusaurusPage } from '@freesewing/react/components/Docusaurus'
import { NoTitleLayout } from '@freesewing/react/components/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { BackendContextProvider } from '@freesewing/react/context/Backend'

/*
 * This is required for pages that do not extend the DocItem theme component
 * Specifically, the adds the BackendContextProvider which is required.
 */
export default function DocusaurusPageWrapper({
  Layout = NoTitleLayout,
  title = '',
  description = '',
  children = [],
}) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext()

  return (
    <BackendContextProvider url={customFields.backendUrl}>
      <InnerDocusaurusPage DocusaurusLayout={DocusaurusLayout} {...{ Layout, title, description }}>
        {children}
      </InnerDocusaurusPage>
    </BackendContextProvider>
  )
}
