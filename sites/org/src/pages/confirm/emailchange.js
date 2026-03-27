import DocusaurusPageWrapper from '@site/src/components/page.mjs'
import { EmailChangeConfirmation } from '@freesewing/react/components/Account'

/*
 * This is the email change in confirmation page (via email).
 * Each page MUST be wrapped in the DocusaurusPage component.
 * You also MUST pass in the DocusaurusLayout compoment.
 */
export default function EmailChangeConfirmationPage() {
  return (
    <DocusaurusPageWrapper
      title="Confirm your new E-mail address"
      description="This should only take a second"
    >
      <div className="tw:flex tw:flex-col tw:items-center tw:text-base-content tw:px-4">
        <div className="tw:max-w-lg tw:w-full">
          <EmailChangeConfirmation onSuccess={() => (window.location.href = '/account')} silent />
        </div>
      </div>
    </DocusaurusPageWrapper>
  )
}
