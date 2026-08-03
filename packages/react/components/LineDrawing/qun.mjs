import React from 'react'
import { LineDrawingWrapper, thin } from './shared.mjs'

/*
 * This strokeScale factor is used to normalize the stroke across
 * designs so we have a consistent look when showing our collection
 */
const strokeScale = 1.6

/*
 * The viewBox holds the drafted geometry (in mm) mirrored across the center fold
 */
const viewBox = '-305 -25 610 700'

/*
 * The waist, side seam, and hem of the drafted half-block
 */
const outline =
  'M 0,0 C 70.39,0 140.82,-0.97 211.1,-4.96 C 215.31,69.25 255.53,138.44 259.74,212.64 L 284.09,641.95 C 189.51,647.31 94.73,650 0,650'

/**
 * A linedrawing component for Qun
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const Qun = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper {...{ viewBox, className, stroke: stroke * strokeScale }}>
    <Front stroke={stroke * strokeScale} />
    <Back stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the front of Qun
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const QunFront = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper {...{ viewBox, className, stroke: stroke * strokeScale }}>
    <Front stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the back of Qun
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const QunBack = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper {...{ viewBox, className, stroke: stroke * strokeScale }}>
    <Back stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/*
 * SVG elements for one (drafted) half of the front
 */
const FrontHalf = ({ stroke }) => (
  <>
    <path key="outline" d={outline} />
    <path key="dart1" {...thin(stroke)} d="M 140.79,-1.9 L 140.73,150" />
  </>
)

/*
 * SVG elements for one (drafted) half of the back
 */
const BackHalf = ({ stroke }) => (
  <>
    <path key="outline" d={outline} />
    <path key="dart1" {...thin(stroke)} d="M 80.2,-0.53 L 79.98,150" />
    <path key="dart2" {...thin(stroke)} d="M 145.09,-2.04 L 144.97,150" />
  </>
)

/*
 * SVG elements for the front
 *
 * The block is a half pattern cut on the fold, so each view draws its half
 * twice: once as drafted, once mirrored across the center fold at x=0
 */
const Front = ({ stroke }) => (
  <>
    <FrontHalf stroke={stroke} />
    <g transform="scale(-1,1)">
      <FrontHalf stroke={stroke} />
    </g>
  </>
)

/*
 * SVG elements for the back
 */
const Back = ({ stroke }) => (
  <>
    <BackHalf stroke={stroke} />
    <g transform="scale(-1,1)">
      <BackHalf stroke={stroke} />
    </g>
  </>
)
