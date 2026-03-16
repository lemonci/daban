// Dependencies
import { domains } from '@freesewing/config'
import { validateEmail, validateTld, getSearchParam } from '@freesewing/utils'

// Hooks
import React, { useState, useContext, useEffect } from 'react'
import { useBackend } from '@freesewing/react/hooks/useBackend'

// Context
import { LoadingStatusContext } from '@freesewing/react/context/LoadingStatus'
import { ModalContext } from '@freesewing/react/context/Modal'

// Components
import { Link } from '@freesewing/react/components/Link'
import { LeftIcon, HelpIcon, KeyIcon, EmailIcon } from '@freesewing/react/components/Icon'
import { ModalWrapper } from '@freesewing/react/components/Modal'
import { EmailInput, OtpInput } from '@freesewing/react/components/Input'
import { IconButton } from '@freesewing/react/components/Button'
import { Spinner } from '@freesewing/react/components/Spinner'
import { Consent } from '@freesewing/react/components/Account'
import { Popout } from '@freesewing/react/components/Popout'

/**
 * The SignUp component holds the entire sign-up form
 *
 * @component
 * @param {object} props - All component props
 * @param {boolean} [props.embed = false] - Set this tot rue to use a H2 level heading instead of H1 so the form can be embedded in an existing page
 * @returns {JSX.Element}
 */
export const SignUp = ({ embed = false }) => {
  // State
  const [email, setEmail] = useState('')
  const [emailValid, setEmailValid] = useState(false)
  const [result, setResult] = useState(false)

  // Hooks
  const backend = useBackend()

  // Context
  const { setModal } = useContext(ModalContext)
  const { setLoadingStatus } = useContext(LoadingStatusContext)

  const updateEmail = (value) => {
    setEmail(value)
    const valid = (validateEmail(value) && validateTld(value)) || false
    setEmailValid(valid === true ? true : false)
  }

  const signupHandler = async (evt) => {
    evt.preventDefault()
    if (!emailValid) {
      setLoadingStatus([true, 'Please provide a valid email address', true, false])
      return
    }
    const [status, body] = await backend.signUp({ email })
    if (status === 201 && body.result === 'created') setResult('success')
    else if (status === 429) {
      setModal(
        <ModalWrapper bg="tw:base-100 tw:lg:bg-base-300">
          <div className="tw:bg-base-100 tw:rounded-lg tw:p-4 tw:lg:px-8 tw:max-w-xl">
            <h3>Your sign up request was rate limited</h3>
            <p className="tw:text-lg">
              The backend returned status code 429 <b>Too Many Requests</b>
            </p>
            <p className="tw:text-lg">
              This indicates that your request was <em>rate limited</em>. In other words, you have
              sent too many sign up requests in a short period of time.
            </p>
            <p>
              Your rate limits will be reset after a cooldown period, then you can try again. Note
              that this is not an error, but a deliberate throttling of sign up requests to fight
              bots and abuse.
            </p>
            <div className="tw:flex tw:flex-row tw:gap-4 tw:items-center tw:justify-center tw:p-8 tw:flex-wrap">
              <IconButton onClick={() => setResult(false)}>
                <LeftIcon />
                Back
              </IconButton>
            </div>
          </div>
        </ModalWrapper>
      )
    } else {
      setModal(
        <ModalWrapper bg="tw:base-100 tw:lg:bg-base-300">
          <div className="tw:bg-base-100 tw:rounded-lg tw:p-4 tw:lg:px-8 tw:max-w-xl tw:lg:shadow-lg">
            <h3>An error occured while trying to process your request</h3>
            <p className="tw:text-lg">
              Unfortunately, we cannot recover from this error, we need a human being to look into
              this.
            </p>
            <p className="tw:text-lg">
              Feel free to try again, or reach out to support so we can assist you.
            </p>
            <div className="tw:flex tw:flex-row tw:gap-4 tw:items-center tw:justify-center tw:p-8 tw:flex-wrap">
              <IconButton onClick={() => setResult(false)}>
                <LeftIcon />
                Back
              </IconButton>
              <IconButton href="/support" className="tw:daisy-btn-outline">
                <HelpIcon />
                Contact support
              </IconButton>
            </div>
          </div>
        </ModalWrapper>
      )
    }
  }

  const Heading = embed
    ? ({ children }) => <h2 className="tw:text-inherit">{children}</h2>
    : ({ children }) => <h1 className="tw:text-inherit">{children}</h1>

  return (
    <div className="tw:w-full">
      <Heading className="tw:text-inherit">
        {result ? (
          result === 'success' ? (
            <span>Now check your inbox</span>
          ) : (
            <span>An error occured while trying to process your request</span>
          )
        ) : (
          <span>Create a FreeSewing account</span>
        )}
      </Heading>

      {result ? (
        result === 'success' ? (
          <>
            <p className="tw:text-inherit tw:text-lg">
              Go check your inbox for an email from <b>no-reply@{domains.email.transaction}</b>
            </p>
            <p className="tw:text-inherit tw:text-lg">
              Click your personal signup link in that email to create your FreeSewing account. The
              email will include a personal signup links as well as a confirmation code.
            </p>
            <img src="https://cdn.freesewing.eu/ui/screen-signup.webp" />
            <p>
              Click the signup link in that email, then enter the confirmation code code to create
              your account.
            </p>
            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-2">
              <IconButton onClick={() => setResult(false)}>
                <LeftIcon />
                Back
              </IconButton>
              <IconButton href="/support" className="tw:daisy-btn-outline">
                <HelpIcon />
                Contact support
              </IconButton>
            </div>
          </>
        ) : (
          <>
            robot here
            <p className="tw:text-inherit tw:text-lg">
              Unfortunately, we cannot recover from this error, we need a human being to look into
              this.
            </p>
            <p className="tw:text-inherit tw:text-lg">
              Feel free to try again, or reach out to support so we can assist you.
            </p>
            <div className="tw:flex tw:flex-row tw:gap-4 tw:items-center tw:justify-center tw:p-8">
              <button className="tw:daisy-btn tw:daisy-btn-ghost" onClick={() => setResult(false)}>
                Back
              </button>
              <Link href="/support" className="tw:daisy-btn tw:daisy-btn-ghost">
                Contact support
              </Link>
            </div>
          </>
        )
      ) : (
        <>
          <fieldset className="tw:daisy-fieldset tw:border-base-300 tw:border tw:rounded-box tw:p-4 tw:mb-4">
            <legend className="tw:daisy-fieldset-legend">Sign up for FreeSewing</legend>
            <form onSubmit={signupHandler}>
              <EmailInput
                id="signup-email"
                label="Email address"
                current={email}
                original={''}
                valid={() => emailValid}
                placeholder="Email address"
                update={updateEmail}
              />
              <IconButton
                onClick={signupHandler}
                btnProps={{ type: 'submit' }}
                className="tw:lg:w-full tw:grow tw:mt-2"
              >
                <EmailIcon />
                Email me a sign-up link
              </IconButton>
            </form>
          </fieldset>
          <IconButton color="neutral" href="/signin" className="tw:daisy-btn-lg tw:mt-4">
            <span className="tw:hidden tw:md:block tw:text-neutral-content">
              <KeyIcon className="tw:h-8 tw:w-8" />
            </span>
            <span className="tw:text-neutral-content">Sign in here</span>
          </IconButton>
        </>
      )}
    </div>
  )
}

/**
 * A component to handle the confirmation URL for a passwordless signup link (aka magic link).
 *
 * @component
 * @param {object} props - All component props
 * @returns {JSX.Element}
 */
export const SignUpConfirmation = () => {
  // State
  const [id, setId] = useState()
  const [error, setError] = useState(false)
  const [check, setCheck] = useState()
  const [checkConfirmed, setCheckConfirmed] = useState()

  // Hooks
  const backend = useBackend()

  // Effects
  useEffect(() => {
    const newId = getSearchParam('id')
    if (!newId) setError('noId')
    if (newId !== id) setId(newId)
  }, [id])

  const checkOtp = (val) => {
    setCheck(val)
    confirmCheck(backend, id, val, setCheckConfirmed)
    console.log(val)
  }

  // Short-circuit errors
  if (error === 'noId')
    return (
      <Popout type="error" title="Invalid Sign Up URL">
        You seem to have arrived on this page in a way that is not supported
      </Popout>
    )

  // Prompt for the check
  if (!check || !checkConfirmed)
    return (
      <>
        <h1 className="tw:mt-24">Enter your confirmation code</h1>
        <OtpInput onComplete={checkOtp} valid={checkConfirmed} />
        {check && check.length === 4 ? (
          <p>Do something</p>
        ) : (
          <p>Enter the 4-digit confirmation code that was included in your FreeSewing invite.</p>
        )}
      </>
    )

  // Show consent content
  if (check && checkConfirmed)
    return (
      <>
        <h1>One more thing</h1>
        <Consent signUp={id} check={check} />
      </>
    )

  // Show loader
  return (
    <>
      <h1>One moment please</h1>
      <Spinner className="tw:w-8 tw:h-8 tw:m-auto tw:animate-spin" />
    </>
  )
}

async function confirmCheck(backend, id, check, setResult) {
  console.log({ id, check })
  let result
  try {
    result = await backend.getConfirmation({ id, check })
  } catch (err) {
    console.log(err)
    return false
  }

  if (result[0] === 200 && result[1]?.result === 'success') return setResult(true)
  setResult(false)
}
