import React, { useContext } from 'react'
import Layout from '@theme-original/DocItem/Layout'
import { ModalContext, ModalContextProvider } from '@freesewing/react/context/Modal'

function LayoutInnerWrapper(props) {
  const { modalContent } = useContext(ModalContext)

  return (
    <>
      <Layout {...props} />
      {modalContent}
      <p>WHEREAMI</p>
    </>
  )
}

export default function LayoutWrapper(props) {
  return (
    <ModalContextProvider>
      <LayoutInnerWrapper {...props} />
    </ModalContextProvider>
  )
}
