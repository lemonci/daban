import clsx from 'clsx'
import { useBlogPost } from '@docusaurus/plugin-content-blog/client'
import BlogPostItemContainer from '@theme/BlogPostItem/Container'
import BlogPostItemContent from '@theme/BlogPostItem/Content'
import BlogPostItemFooter from '@theme/BlogPostItem/Footer'
import { useLocation } from '@docusaurus/router'
import BlogPostItemHeaderInfo from '@theme/BlogPostItem/Header/Info'
import BlogPostItemHeaderAuthors from '@theme/BlogPostItem/Header/Authors'
import { Breadcrumbs } from '../BlogPostItems/index.js'
import { imageCdnUrl, capitalize } from '@freesewing/utils'
import { ModalContext, ModalContextProvider } from '@freesewing/react/context/Modal'
import { Markdown } from '@freesewing/react/components/Markdown'

// apply a bottom margin in list view
function useContainerClassName() {
  const { isBlogPostPage } = useBlogPost()
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined
}

const BlogPostHeader = ({ type }) => {
  const { metadata } = useBlogPost()

  // FIXME: We have disabled author info for now since the backend endpoint is gone

  return (
    <>
      <header>
        <Breadcrumbs
          breadcrumbs={[
            {
              href: '/',
              label: 'Home',
            },
            {
              href: `/${type}/`,
              label: capitalize(type),
            },
            {
              href: metadata.permalink,
              label: metadata.title,
            },
          ]}
        />
        <h1>
          <span className="tw:block tw:text-sm tw:capitalize">{type}:</span>
          {metadata.title}
        </h1>
        <BlogPostItemHeaderInfo />
        {false ? <BlogPostItemHeaderAuthors /> : null}
      </header>
      {type === 'newsletter' ? null : (
        <figure>
          <img src={imageCdnUrl({ type, id: metadata.permalink.split('/').pop() })} />
          <figcaption
            style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '0.25rem',
              marginBottom: '2rem',
            }}
          >
            <Markdown>{metadata.frontMatter?.caption || ''}</Markdown>
          </figcaption>
        </figure>
      )}
    </>
  )
}

export default function BlogPostItem(props) {
  const { children, className } = props
  const containerClassName = useContainerClassName()
  const location = useLocation()
  /*
   * This code is shared between all blog instances
   * which means: blog, showcase, and newsletter
   * so we need to figure out which it is
   */
  const type = location.pathname.split('/')[1]

  /*
   * The newsletter unsubscribe page gets special treatment
   */
  if (location.pathname === '/newsletter/unsubscribe')
    return (
      <BlogPostItemContainer className={clsx(containerClassName, className)}>
        <PostWrapper>{children}</PostWrapper>
      </BlogPostItemContainer>
    )

  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <PostWrapper>
        <BlogPostHeader type={type} />
        <BlogPostItemContent>
          <div className="mdx">{children}</div>
        </BlogPostItemContent>
        <BlogPostItemFooter />
      </PostWrapper>
    </BlogPostItemContainer>
  )
}

function PostWrapper({ children }) {
  return <ModalContextProvider>{children}</ModalContextProvider>
}
