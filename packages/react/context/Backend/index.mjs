import React, { createContext } from 'react'

/*
 * The actual context
 */
export const BackendContext = createContext({ url: 'https://backend.freesewing.eu' })

/**
 * The BackendUrl context provider
 *
 * @component
 * @param {object} props - All component props
 * @param {JSX.Element} props.url - The URL of the backend to use
 * @param {JSX.Element} props.children - The component children, will be rendered if props.js is not set
 * @returns {JSX.Element}
 */
export function BackendContextProvider({ url, children }) {
  return <BackendContext.Provider value={{ url }}>{children}</BackendContext.Provider>
}
