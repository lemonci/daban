import React from 'react'
import { LineDrawingWrapper, regular, thin, dashed } from './shared.mjs'

/*
 * This strokeScale factor is used to normalize the stroke across
 * designs so we have a consistent look when showing our collection
 */
const strokeScale = 0.7

/**
 * A linedrawing component for Titan
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const Titan = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="-15 0 70 93.175" {...{ className }}>
    <Front stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the front of Titan
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const TitanFront = Titan

/*
 * SVG elements for the front
 */
const Front = ({ stroke }) => (
  <>
    <path
      key="folds"
      opacity={0.3}
      {...regular(stroke)}
      d="M14.605 28.848c.23-.046.892-.184 1.1-.2.587-.045 1.21 0 1.8 0 1.545 0 3.119-.07 4.6.3.073.018.127.085.2.1.131.026.274-.042.4 0 1.196.399-.63.043.4.3.058.014.45-.05.5 0 .024.024 0 .067 0 .1m-10.3 1.4c.2-.1.39-.223.6-.3.16-.058.342-.037.5-.1.18-.072.324-.218.5-.3.69-.322 1.38-.594 2.1-.8.402-.115.048-.1.3-.1m5.9 1.9c-.327-.315-1.745-1.5-2.1-1.5"
    />
    <path
      key="outline"
      {...regular(stroke)}
      d="M14.13 11.357c-6.573 13.286-5.734 34.59-5.638 46.774.117 14.969-.343 41.016-.343 41.016s2.142 2.166 7.467 2.132c5.325-.035 8.305-2.2 8.305-2.2l3.23-61.73m13.257-25.992c6.572 13.286 5.733 34.59 5.637 46.774-.117 14.969.343 41.016.343 41.016s-2.142 2.166-7.467 2.132c-5.325-.035-8.305-2.2-8.305-2.2l-3.23-61.73"
      transform="translate(-7.797 -8.454)"
    />
    <path
      key="seam"
      {...thin(stroke)}
      opacity={0.3}
      d="m28.555 59.932 4.059 40.165m-18.791-88.27s-3.01 10.29-3.616 15.59c-1.574 13.75-.146 27.68.002 41.519.111 10.383-.747 20.757-.34 31.142m16.13-40.146-4.059 40.165m18.79-88.27s3.01 10.29 3.617 15.59c1.574 13.75.146 27.68-.002 41.519-.111 10.383.747 20.757.34 31.142"
      transform="translate(-7.797 -8.454)"
    />
    <path key="crossseam" {...thin(stroke)} opacity={0.3} d="M19.414 29.044V5.2" />
    <path
      key="hem"
      {...thin(stroke)}
      {...dashed(stroke)}
      d="M.516 88.213s2.142 2.166 7.467 2.132c5.325-.035 8.305-2.2 8.305-2.2m22.184.068s-2.142 2.166-7.467 2.132c-5.325-.035-8.305-2.2-8.305-2.2"
    />
    <ellipse {...regular(stroke)} cx="19.342" cy="2.846" rx="12.934" ry="2.496" />
  </>
)
