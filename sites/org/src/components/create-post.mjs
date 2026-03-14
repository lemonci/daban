// Dependencies
import { capitalize, linkClasses, slugifyTitle, slugifyNoTrim, yyyymmdd } from '@freesewing/utils'
import { relPath } from '@freesewing/config'
// Hooks
import React, { useState, useContext, Fragment } from 'react'
import { useAccount } from '@freesewing/react/hooks/useAccount'
import { useBackend } from '@freesewing/react/hooks/useBackend'
// Context
import { LoadingStatusContext } from '@freesewing/react/context/LoadingStatus'
// Components
import Markdown from 'react-markdown'
import { Popout } from '@freesewing/react/components/Popout'
import { Highlight } from '@freesewing/react/components/Highlight'
import { Tabs, Tab } from '@freesewing/react/components/Tab'
import {
  BoolYesIcon,
  BoolNoIcon,
  OkIcon,
  NoIcon,
  PlusIcon,
  TrashIcon,
} from '@freesewing/react/components/Icon'
import {
  DesignInput,
  PassiveImageInput,
  MarkdownInput,
  StringInput,
  TextInput,
  UserInput,
} from '@freesewing/react/components/Input'

// Using style here to override docusaurus classes
const Tip = ({ children }) => (
  <p style={{ margin: '-0.5rem 0 -0.5rem 0' }} className="tw:italic tw:opacity-70">
    {children}
  </p>
)

// Using style here to override docusaurus classes
const Item = ({ title, ok, children }) => (
  <>
    <h3
      className="tw:flex tw:flex-row tw:gap-2 tw:items-center tw:p-0"
      style={{ marginTop: '1rem' }}
    >
      {ok ? <BoolYesIcon /> : <BoolNoIcon />}
      {title}
    </h3>
    {children}
  </>
)

const dataAsMd = ({ title, author, caption, intro, designs, body }, type) => {
  let md = `---
title: "${title}"
caption: "${caption}"
date: ${yyyymmdd(false, '-')}
intro: "${intro}"
authors: [ "${author}" ]`
  if (type === 'showcase')
    md += `
tags: [${designs.map((design) => `"${design}"`).join(', ')}]`
  md += `
---

<!-- truncate -->

${body}
`

  return md
}

export const CreatePost = ({ type = 'showcase' }) => {
  // Hooks
  const backend = useBackend()
  const { account } = useAccount()
  const { loading, setLoadingStatus } = useContext(LoadingStatusContext)

  // State
  const [author, setAuthor] = useState(null)
  const [designs, setDesigns] = useState([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(true)
  const [img, setImg] = useState(false)
  const [caption, setCaption] = useState('')
  const [intro, setIntro] = useState('')
  const [body, setBody] = useState('')
  const [extraImages, setExtraImages] = useState({})
  const [activeTab, setActiveTab] = useState('create')
  const [pr, setPr] = useState(false)
  const [error, setError] = useState(false)
  const [preview, setPreview] = useState(false)

  // Method that submits the post to the backend
  const submitPost = async () => {
    setLoadingStatus([true, `One moment please (processing images can take a while)`])
    const result = await backend.createPostPr(type, {
      markdown: dataAsMd(
        {
          title,
          author,
          caption,
          intro,
          designs,
          body,
        },
        type
      ),
      slug,
      img,
      extraImages,
    })
    if (Array.isArray(result) && result[0] === 201 && result[1]?.result === 'created') {
      setPr(result[1])
      setLoadingStatus([true, `All done`, true, true])
    } else {
      setError(result)
      setLoadingStatus([true, `Something went wrong`, true, true])
    }
  }

  // Shared props for tabs
  const tabProps = { activeTab, setActiveTab }

  const addImage = () => {
    const key = Date.now()
    const newImages = { ...extraImages }
    newImages[key] = null
    setExtraImages(newImages)
  }
  const removeImage = (key) => {
    const newImages = { ...extraImages }
    delete newImages[key]
    setExtraImages(newImages)
  }

  const verifySlug = async (newSlug = false) => {
    if (newSlug) {
      setSlug(newSlug)
      const available = await backend.isSlugAvailable({ slug: newSlug, type })
      setSlugAvailable(available)
    }
  }

  const setExtraImage = (key, img) => {
    const newImages = { ...extraImages }
    newImages[key] = img
    setExtraImages(newImages)
  }

  const updateDesigns = (design, type = 'add') => {
    if (type === 'add') {
      // Keep things unique
      setDesigns([...new Set([...designs, design])])
    } else {
      const newDesigns = new Set([...designs])
      newDesigns.delete(design)
      setDesigns([...newDesigns])
    }
  }

  const childProps = {
    type,
    author,
    setAuthor,
    designs,
    setDesigns,
    title,
    setTitle,
    slug,
    img,
    setImg,
    caption,
    setCaption,
    intro,
    setIntro,
    body,
    setBody,
    extraImages,
    setExtraImages,
    addImage,
    setExtraImage,
    account,
    verifySlug,
    slugAvailable,
    updateDesigns,
    removeImage,
  }

  if (pr)
    return (
      <div className="tw:w-full tw:m-auto tw:p-4">
        <h2>Thank you for submitting this {type} post</h2>
        <p className="tw:text-base">
          We have{' '}
          <a className={linkClasses} href={pr.url}>
            Created a new pull request
          </a>{' '}
          to add this post to our website. It will be reviewed, and if all is OK, merged after which
          your post will appear on the website next time we deploy the latest updates.
        </p>
        <p className="tw:text-base">
          It is not too late to add comments, additional images, and anything you want to add. To do
          so, you can comment on{' '}
          <a className={linkClasses} href={pr.url}>
            the pull request
          </a>
          . You need a Codeberg account to do so, but they are free.
        </p>
        <p className="tw:text-xl tw:font-bold tw:mt-6">
          To summarize: You did great <span role="img">💜</span> and we&apos;ll take it from here{' '}
          <span role="img">🙌</span>
        </p>
        <button
          className="tw:daisy-btn tw:daisy-btn-primary tw:daisy-btn-outline tw:mt-4"
          onClick={() => setPr(false)}
        >
          Back
        </button>
      </div>
    )

  return (
    <>
      <div className="tw:px-4">
        <Tabs tabs={['edit', 'preview']}>
          <Tab key="edit">
            <PostEditor {...childProps} />
          </Tab>
          <Tab key="preview">
            <PostPreview {...childProps} />
          </Tab>
        </Tabs>
      </div>
      <div className="tw:px-4 tw:max-w-lg tw:m-auto tw:my-8 tw:text-center">
        {!(title && slug && img && (type === 'blog' || designs.length > 0)) && (
          <Popout note>
            <h5 className="tw:text-left">You are missing the following:</h5>
            <ul className="tw:text-left tw:list tw:list-inside tw:list-disc ml-4">
              {type === 'showcase' && !author && <li>Maker</li>}
              {type === 'blog' && !author && <li>Author</li>}
              {type === 'showcase' && designs.length < 1 && <li>Design</li>}
              {!title && <li>Post Title</li>}
              {!slug && <li>Slug</li>}
              {!img && <li>Main Image</li>}
              {!intro && <li>Intro</li>}
            </ul>
          </Popout>
        )}
        <button
          className="tw:daisy-btn tw:daisy-btn-lg tw:daisy-btn-primary tw:capitalize"
          disabled={
            loading || !(title && slug && img && intro && (type === 'blog' || designs.length > 0))
          }
          onClick={submitPost}
        >
          Submit {type} Post
        </button>
      </div>
    </>
  )
}

const PostPreview = ({ title, img, caption, body, extraImages }) => (
  <>
    <h1>{title}</h1>
    <img src={img} />
    <div className="tw:text-sm tw:text-center tw:mb-4">{caption}</div>
    <Markdown
      markdownOptions={{
        urlTransform: (url) => url,
      }}
    >
      {imgPreviewMarkdown(body, extraImages)}
    </Markdown>
  </>
)

const PostEditor = ({
  type,
  author,
  setAuthor,
  designs,
  setDesigns,
  title,
  setTitle,
  slug,
  verifySlug,
  slugAvailable,
  img,
  setImg,
  caption,
  setCaption,
  intro,
  setIntro,
  body,
  setBody,
  extraImages,
  addImage,
  setExtraImage,
  updateDesigns,
  removeImage,
}) => (
  <>
    {type === 'showcase' && (
      <Item title="Maker / Author" ok={author}>
        <Tip>Enter the Username or User ID of the person who made this (if you know it).</Tip>
        <UserInput
          legend="Maker / Author"
          labelBL={author ? `Author is user #${author}` : undefined}
          update={setAuthor}
          current={author}
          valid={(val) => val !== ''}
        />
      </Item>
    )}
    {type === 'showcase' && (
      <Item title="Featured Designs" ok={designs.length > 0}>
        {designs.length > 0 ? (
          <div className="tw:text-base tw:flex tw:flex-row tw:flex-wrap tw:items-center tw:gap-2">
            {designs.map((d) => (
              <button
                className="tw:daisy-btn tw:daisy-btn-secondary tw:daisy-btn-sm tw:hover:daisy-btn-error"
                key={d}
                onClick={() => updateDesigns(d, 'del')}
              >
                {capitalize(d)}
              </button>
            ))}
          </div>
        ) : (
          <Tip>Select one or more designs that are featured in this post.</Tip>
        )}
        <DesignInput
          legend="Available Designs"
          update={(val) => updateDesigns(val, 'add')}
          firstOption="Please choose a design"
          buttons
        />
      </Item>
    )}
    <Item title="Post Title" ok={title.length > 10}>
      <Tip>Give your post a title. A good title is more than just a few words.</Tip>
      <StringInput
        update={setTitle}
        legend="Post Title"
        placeholder="A Simon shirt in watermelon print by Jaco"
      />
    </Item>
    <Item title="Post Slug" ok={slugAvailable && slug.length > 3}>
      <Tip>
        The slug is the part of the URL that uniquely identifies the post.
        <br />
        <small>
          We can{' '}
          <button className={linkClasses} onClick={() => verifySlug(slugifyTitle(title))}>
            generate a slug based on your title
          </button>
          , but a hand-crafted one can yield a prettier URL.
        </small>
      </Tip>
      <StringInput
        legend="Slug"
        placeholder="watermelon-simon"
        update={(val) => verifySlug(slugifyNoTrim(val))}
        current={slug || ''}
        valid={() => slugAvailable}
        labelBL={
          !slug ? (
            'Please enter a slug'
          ) : slug.length < 4 ? (
            'Please use a longer slug'
          ) : slugAvailable ? (
            'Looks good'
          ) : (
            <>
              Sorry, but slug <b>{slug}</b> is already taken by{' '}
              <a href={relPath(`${type}/${slug}/`)} target="_BLANK">
                this post
              </a>
            </>
          )
        }
      />
    </Item>
    <Item title="Main Image" ok={img?.length > 3}>
      <Tip>
        The main image will be shown at the top of the post, and as the only image on the {type}{' '}
        index page.
      </Tip>
      {img ? (
        <div className="tw:my-2 tw:relative">
          <img src={img} className="tw:rounded-lg tw:shadow" style={{ maxHeight: '220px' }} />
          <button
            onClick={() => setImg(undefined)}
            className="tw:daisy-btn tw:daisy-btn-error tw:absolute tw:bottom-4 tw:left-4"
            title="Remove this image"
          >
            <TrashIcon />
          </button>
        </div>
      ) : (
        <PassiveImageInput imgType={type} imgSlug={slug} legend="image" update={setImg} />
      )}
    </Item>
    <Item title="Main Image Caption" ok={caption.length > 3}>
      <Tip>
        The caption is the text that goes under the main image. Can include copyrights/credits.
        Markdown is allowed.
      </Tip>
      <MarkdownInput current={caption} update={setCaption} />
    </Item>
    <Item title="Intro" ok={intro.length > 3}>
      <Tip>A brief paragraph that will be shown on post previews on social media and so on.</Tip>
      <StringInput current={intro} update={setIntro} />
    </Item>
    <Item title="Additional Images" ok={1}>
      <Tip>Here you can optionally add additional images to include in the post body.</Tip>
      {Object.keys(extraImages).map((key) => {
        const markup = `![The image alt goes here](__EXTRA_IMAGE_${key}__ "The image caption/title goes here")`
        return (
          <Fragment key={key}>
            {extraImages[key] ? (
              <div className="tw:my-2 tw:relative">
                <img
                  src={extraImages[key]}
                  className="tw:rounded-lg tw:shadow"
                  style={{ maxHeight: '220px' }}
                />
                <button
                  onClick={() => removeImage(key)}
                  className="tw:daisy-btn tw:daisy-btn-error tw:absolute tw:bottom-4 tw:left-4"
                  title="Remove this image"
                >
                  <TrashIcon />
                </button>
              </div>
            ) : (
              <PassiveImageInput
                imgType={type}
                imgSlug={slug}
                legend="image"
                update={(img) => setExtraImage(key, img)}
              />
            )}
            {extraImages[key] && (
              <>
                <p className="tw:text-sm">
                  To include this image in your post, use this markdown snippet below:
                  <br />
                  <small>
                    (the <code>__EXTRA_IMAGE_{key}__</code> part will automatically be replaced)
                  </small>
                </p>
                <Highlight language="md" title="MarkDown">
                  {markup}
                </Highlight>
                <p className="tw:text-right tw:-mt-5">
                  <button
                    className="tw:daisy-btn tw:daisy-btn-sm tw:daisy-btn-secondary tw:daisy-btn-outline"
                    onClick={() => setBody(body + '\n\n' + markup)}
                  >
                    Add to post body
                  </button>
                </p>
              </>
            )}
          </Fragment>
        )
      })}
      <button className="tw:daisy-btn tw:daisy-btn-secondary tw:mt-2" onClick={addImage}>
        <PlusIcon /> Add Image
      </button>
    </Item>
    <Item title="Post Body" ok={body.length > 3}>
      <Tip>The actual post body. Supports Markdown.</Tip>
      <MarkdownInput
        current={body}
        previewCurrent={imgPreviewMarkdown(body, extraImages)}
        update={setBody}
        markdownOptions={{
          urlTransform: (url) => url,
        }}
      />
    </Item>
  </>
)

const imgPreviewMarkdown = (markdown, imgs) => {
  let md = markdown
  for (const [key, img] of Object.entries(imgs)) {
    md = md.replaceAll(`__EXTRA_IMAGE_${key}__`, img)
  }

  return md
}
