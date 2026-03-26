// Context
import { LoadingStatusContext } from '@freesewing/react/context/LoadingStatus'

// Hooks
import React, { useState, useContext } from 'react'
import { useAccount } from '@freesewing/react/hooks/useAccount'
import { useBackend } from '@freesewing/react/hooks/useBackend'

// Components
import { SaveIcon } from '@freesewing/react/components/Icon'
import { StringInput } from '@freesewing/react/components/Input'

/**
 * A component to manage the user's Codeberg handle in their account data
 *
 * @component
 * @returns {JSX.Element}
 */
export const Codeberg = () => {
  // Hooks
  const { account, setAccount } = useAccount()
  const backend = useBackend()
  const { setLoadingStatus } = useContext(LoadingStatusContext)

  // State
  const [codebergUsername, setCodebergUsername] = useState(account.data.codebergUsername || '')
  const [codebergEmail, setCodebergEmail] = useState(account.data.codebergEmail || '')

  // Helper method to save changes
  const save = async () => {
    setLoadingStatus([true, 'Saving Codeberg data'])
    const [status, body] = await backend.updateAccount({
      data: { codebergUsername, codebergEmail },
    })
    if (status === 200 && body.result === 'success') {
      setAccount(body.account)
      setLoadingStatus([true, 'Codeberg info updated', true, true])
    } else setLoadingStatus([true, 'Something went wrong. Please report this', true, true])
  }

  return (
    <div className="tw:w-full">
      <StringInput
        id="account-codeberg-email"
        label="Codeberg Email Address"
        current={codebergEmail}
        update={setCodebergEmail}
        valid={(val) => val.length > 0}
        placeholder={'scritchies@cat.co'}
      />
      <StringInput
        id="account-codeberg-username"
        label="Codeberg Username"
        current={codebergUsername}
        update={setCodebergUsername}
        valid={(val) => val.length > 0}
        placeholder={'scritchies'}
      />
      <p className="tw:text-right">
        <button
          className="tw:daisy-btn tw:daisy-btn-primary tw:w-full tw:lg:w-auto tw:mt-8"
          onClick={save}
        >
          <SaveIcon /> Save
        </button>
      </p>
    </div>
  )
}
