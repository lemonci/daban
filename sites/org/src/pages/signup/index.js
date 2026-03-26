import DocusaurusPageWrapper from '@site/src/components/page.mjs'
import { SignUp } from '@freesewing/react/components/SignUp'
import { MiniTip } from '@freesewing/react/components/Mini'

/*
 * This is the sign in page. Each page MUST be wrapped in the DocusaurusPage component.
 * You also MUST pass in the DocusaurusLayout compoment.
 */
export default function SignUpPage() {
  return (
    <DocusaurusPageWrapper
      title="Sign Up"
      description="Sign Up for a FreeSewing account to unlock all features"
    >
      <div className="flex flex-col items-center h-screen justify-center text-base-content px-4">
        <div className="max-w-xl w-full">
          <SignUp />
          <MiniTip>We do not share or sell your data. We are a community, not a business.</MiniTip>
        </div>
      </div>
    </DocusaurusPageWrapper>
  )
}
