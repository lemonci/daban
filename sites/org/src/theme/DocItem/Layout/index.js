import React, { useContext } from 'react'
import Layout from '@theme-original/DocItem/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { ModalContext, ModalContextProvider } from '@freesewing/react/context/Modal'
import { BackendContextProvider } from '@freesewing/react/context/Backend'

function LayoutInnerWrapper(props) {
  const { modalContent } = useContext(ModalContext)

  return (
    <>
      <Layout {...props} />
      {modalContent}
    </>
  )
}

export default function LayoutWrapper(props) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext()

  return (
    <BackendContextProvider url={customFields.backendUrl}>
      <ModalContextProvider>
        <LayoutInnerWrapper {...props} />
      </ModalContextProvider>
    </BackendContextProvider>
  )
}
