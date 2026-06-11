import React from 'react'
import { LineDrawingWrapper, thin, dashed } from './shared.mjs'

/*
 * This strokeScale factor is used to normalize the stroke across
 * designs so we have a consistent look when showing our collection
 */
const strokeScale = 1

/**
 * A linedrawing component for Shale
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const Shale = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="0 0 380 180" {...{ className, stroke: stroke * strokeScale }}>
    <Front stroke={strokeScale * stroke} />
    <Back stroke={strokeScale * stroke} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the front of Shale
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const ShaleFront = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="0 0 190 180" {...{ className, stroke: stroke * strokeScale }}>
    <Front stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for the back of Shale
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const ShaleBack = ({
  className, // CSS classes to apply
  stroke = 1, // Stroke width to use
}) => {
  // Normalize stroke across designs
  return (
    <LineDrawingWrapper viewBox="190 0 190 180" {...{ className, stroke: stroke * strokeScale }}>
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
      d="m 133.66,22.94 c -12.35,-1.73 -26.34,-2.81 -38.42,-2.8 m 51.73,0.62 c -14.62,-2.99 -35.01,-5.07 -51.73,-5.05 m 58.72,3.22 C 139.49,15.11 114.84,12.24 95.24,12.27 M 157.42,17.6 C 146.57,13.59 115.96,9.78 95.24,9.81 m 64.83,20.32 -5.41,2.25 m 3.95,-11.05 -5.55,2.41 m 6.28,1.96 -5.47,2.41 m 30.15,121.49 c -31.97,12.97 -61.34,16.8 -85.88,14.3 m 74.15,-49.71 c -15.16,6.29 -47.39,7.98 -47.39,7.98 L 116.2,43.75 M 56.83,22.94 c 12.35,-1.73 26.34,-2.81 38.42,-2.8 m -51.73,0.62 c 14.62,-2.99 35.01,-5.07 51.73,-5.05 M 36.52,18.94 C 51,15.11 75.64,12.24 95.24,12.27 M 33.06,17.6 C 43.91,13.59 74.53,9.78 95.24,9.81 m -64.83,20.32 5.41,2.25 m -3.95,-11.05 5.55,2.41 m -6.28,1.96 5.47,2.41 M 6.46,149.6 c 31.97,12.97 61.34,16.8 85.88,14.3 M 18.19,114.19 c 15.16,6.29 47.39,7.98 47.39,7.98 l 8.71,-78.43"
    />
    <path
      key="outline"
      d="M 116.19,25.46 C 109.02,24.89 101.85,24.57 95.24,24.58 m -20.94,0.89 c 7.17,-0.57 14.34,-0.89 20.94,-0.89 m 0,102.71 V 44.96 m 89.75,110.25 c 0.6,2.41 -20.06,8.81 -41.34,12.56 -22.1,3.9 -44.86,5.02 -45.11,1.14 l -3.3,-41.62 M 166.3,81.22 c -7,2.08 -18.85,-15.4 -24.14,-41.31 m 18.63,-5.54 c 17.06,50.71 17.26,81.86 24.21,120.84 M 155.49,36.82 c 13.29,45.73 16.77,82.15 24.63,121.54 m -68.01,-114.23 9.53,82.13 c 26.35,-1.76 39.02,-3.21 51.25,-8.51 M 157.89,17.03 160.78,34.37 c 0,2.65 -38.5,10.59 -65.54,10.59 m 57.01,-25.56 3.24,17.42 M 95.24,8.68 c 30.14,0 62.1,6.17 62.65,8.35 0.55,2.18 -36.2,9.61 -62.65,9.61 M 5.5,155.2 c -0.6,2.41 20.06,8.81 41.34,12.56 22.1,3.9 44.86,5.02 45.11,1.14 l 3.3,-41.62 M 24.19,81.22 C 31.19,83.3 43.04,65.82 48.33,39.91 M 29.7,34.37 C 12.64,85.07 12.44,116.23 5.5,155.2 M 35,36.82 C 21.71,82.55 18.23,118.97 10.37,158.37 M 78.37,44.14 68.85,126.27 C 42.5,124.51 29.83,123.06 17.6,117.76 M 32.59,17.03 29.7,34.37 c 0,2.65 38.5,10.59 65.54,10.59 m -57.01,-25.56 -3.24,17.42 M 95.24,8.68 c -30.14,0 -62.1,6.17 -62.65,8.35 -0.55,2.18 36.2,9.61 62.65,9.61"
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
      d="m 219.92,30.15 129.68,-0 M 221.44,21.03 c 42.01,-1.23 84.22,-1.23 126.63,-0 m -127.42,4.69 c 42.53,-0.82 85.26,-0.82 128.2,-0"
    />
    <path
      key="outline"
      d="M 284.76,34.37 V 127.29 M 219.22,34.37 c 43.69,0 87.39,0 131.08,0 m -128.19,-17.33 -0.01,0.04 -2.88,17.3 c -17.06,50.71 -17.26,81.86 -24.21,120.84 -0.19,0.74 1.64,1.86 4.87,3.16 7.29,2.93 21.73,6.81 36.46,9.4 22.1,3.9 44.86,5.02 45.11,1.14 l 3.3,-41.62 3.3,41.62 c 0.25,3.88 23.01,2.75 45.11,-1.14 14.74,-2.6 29.18,-6.47 36.46,-9.4 3.23,-1.3 5.06,-2.42 4.87,-3.16 -6.95,-38.98 -7.15,-70.13 -24.21,-120.84 l -2.88,-17.3 -0.01,-0.03 c -0.55,-2.18 -32.51,-1.46 -62.65,-1.46 -30.14,0 -62.1,-0.72 -62.65,1.46 z"
    />
  </>
)
