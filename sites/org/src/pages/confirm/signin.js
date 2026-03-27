import DocusaurusPageWrapper from '@site/src/components/page.mjs'
import { SignInConfirmation } from '@freesewing/react/components/SignIn'

/*
 * This is the sign in confirmation page (via email).
 * Each page that is not a DocItem MUST be wrapped in the (local) DocusaurusLayout component.
 */
export default function SignInPage() {
  return (
    <DocusaurusPageWrapper
      title="Sign In"
      description="Sign In to your FreeSewing account to unlock all features"
    >
      <div className="tw:flex tw:flex-col tw:items-center tw:text-base-content tw:px-4">
        <div className="tw:max-w-lg tw:w-full">
          <SignInConfirmation onSuccess={() => (window.location.href = '/account')} silent />
        </div>
      </div>
    </DocusaurusPageWrapper>
  )
}
