import React from 'react'
import { LineDrawingWrapper, thin, dashed } from './shared.mjs'

/*
 * This strokeScale factor is used to normalize the stroke across
 * designs so we have a consistent look when showing our collection
 */
const strokeScale = 0.5

/**
 * A linedrawing component for Toni
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const Toni = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="0 0 100 60" {...{ className, stroke: stroke * strokeScale }}>
    <Front stroke={strokeScale * stroke} />
    <Back stroke={strokeScale * stroke} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the front of Toni
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const ToniFront = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="0 0 50 60" {...{ className, stroke: stroke * strokeScale }}>
    <Front stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the back of Toni
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const ToniBack = ({
  className = 'tw:w-full', // CSS classes to apply
  stroke = 1, // Stroke width to use
}) => {
  // Normalize stroke across designs
  return (
    <LineDrawingWrapper viewBox="50 0 50 60" {...{ className, stroke: stroke * strokeScale }}>
      <Back stroke={stroke * strokeScale} />
    </LineDrawingWrapper>
  )
}

/*
 * SVG elements for the front
 */
const Front = ({ stroke }) => (
  <>
    <path
      key="stitches"
      {...dashed(stroke)}
      {...thin(stroke)}
      d="m 40.24,26.28 8.61,-2.91 m -8.49,30.89 c 0,0 -8.49,0.71 -15.36,0.71 -6.87,0 -15.36,-0.71 -15.36,-0.71 M 1.15,23.37 9.76,26.28"
    />
    <path
      key="folds"
      opacity={0.3}
      d="M 25,5.01 V 4.06 m -5.97,0.1 c 0.42,-0.42 2.99,0.84 5.97,0.84 2.98,0 5.55,-1.26 5.97,-0.84 M 18.02,3.65 c -0.69,0.4 0.59,6.85 6.98,6.85 6.39,0 7.67,-6.46 6.98,-6.85 m 10.57,3.02 c 0,0 -3.78,5.75 -3.88,15.55 m -27.33,0 C 11.23,12.42 7.45,6.67 7.45,6.67"
    />
    <path
      key="outline"
      d="m 19.22,3.51 c -0.99,1.74 1.86,5.7 5.78,5.7 3.92,0 6.77,-3.95 5.78,-5.7 -0.36,-0.64 -3.03,0.55 -5.78,0.55 -2.74,0 -5.42,-1.18 -5.78,-0.55 z m 0.16,-0.11 c 0,0 -10.03,1.72 -11.94,3.27 C 5.54,8.22 0.74,24.97 0.74,24.97 l 8.48,2.69 2.12,-5.45 c 1.36,19.99 -1.07,23.22 -1.84,33.79 0,0 4.93,0.66 15.5,0.66 10.58,0 15.5,-0.66 15.5,-0.66 C 39.73,45.44 37.3,42.21 38.66,22.22 l 2.12,5.45 8.48,-2.69 c 0,0 -4.81,-16.75 -6.72,-18.3 C 40.64,5.13 30.61,3.4 30.61,3.4"
    />
  </>
)

/*
 * SVG elements for the back
 */
const Back = ({ stroke }) => (
  <>
    <path
      key="stitches"
      {...dashed(stroke)}
      {...thin(stroke)}
      d="m 90.26,26.27 8.61,-2.92 m -8.5,31 c 0,0 -8.49,0.72 -15.37,0.72 -6.88,0 -15.37,-0.72 -15.37,-0.72 m -8.5,-31 8.61,2.92"
    />
    <path
      key="folds"
      opacity={0.3}
      d="m 69.09,3.36 c 0.92,0.82 2.93,1.56 5.91,1.56 m 0,0 V 3.98 m 0,0.95 c 2.98,0 5,-0.74 5.91,-1.56 m 11.65,3.24 c 0,0 -3.79,5.77 -3.89,15.6 m -27.35,0 C 61.22,12.37 57.44,6.6 57.44,6.6"
    />
    <path
      key="outline"
      d="m 69.84,3.24 c -0.23,-0.01 -0.41,0.01 -0.53,0.09 -0.89,0.16 -10.06,1.79 -11.88,3.27 -1.91,1.55 -6.72,18.36 -6.72,18.36 l 8.49,2.7 2.12,-5.46 c 1.36,20.06 -1.07,23.29 -1.84,33.9 0,0 4.93,0.67 15.52,0.67 10.58,0 15.52,-0.67 15.52,-0.67 -0.77,-10.61 -3.2,-13.85 -1.84,-33.9 l 2.12,5.46 8.49,-2.7 c 0,0 -4.81,-16.81 -6.72,-18.36 -1.82,-1.48 -10.99,-3.11 -11.88,-3.27 -0.6,-0.39 -3.11,0.65 -5.69,0.65 -2.09,0 -4.14,-0.69 -5.16,-0.74 z"
    />
  </>
)
