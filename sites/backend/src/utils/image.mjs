import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, unlinkSync, openSync, readSync, closeSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'
import { log } from './log.mjs'

const MEDIA_ROOT = '/media'

/*
 * Maximum allowed size for a decoded image: 10 MB
 */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024

/*
 * Known image magic-byte signatures.
 * We read only the first 12 bytes of the file to identify it.
 */
const IMAGE_SIGNATURES = [
  // JPEG: FF D8 FF
  { bytes: [0xff, 0xd8, 0xff], offset: 0 },
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  { bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], offset: 0 },
  // GIF87a / GIF89a: 47 49 46 38
  { bytes: [0x47, 0x49, 0x46, 0x38], offset: 0 },
  // WebP: RIFF....WEBP — check 'RIFF' at 0 and 'WEBP' at 8
  {
    bytes: [0x52, 0x49, 0x46, 0x46],
    offset: 0,
    also: { bytes: [0x57, 0x45, 0x42, 0x50], offset: 8 },
  },
  // AVIF/HEIF: ftyp box — bytes 4-7 are 'ftyp' (66 74 79 70)
  { bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
]

/*
 * Checks the magic bytes of a buffer to confirm it is a known image format.
 *
 * @param {Buffer} buf - At least 12 bytes from the start of the file
 * @return {boolean}
 */
function hasImageMagicBytes(buf) {
  for (const sig of IMAGE_SIGNATURES) {
    if (buf.length < sig.offset + sig.bytes.length) continue
    const main = sig.bytes.every((b, i) => buf[sig.offset + i] === b)
    if (!main) continue
    if (sig.also) {
      if (buf.length < sig.also.offset + sig.also.bytes.length) continue
      const also = sig.also.bytes.every((b, i) => buf[sig.also.offset + i] === b)
      if (!also) continue
    }
    return true
  }
  return false
}

/*
 * Returns the on-disk path for an image given type and uuid
 *
 * @param {string} type - 'user', 'set', or 'pattern'
 * @param {string} uuid - The UUID of the record
 * @return {string} path - The absolute path to the webp file
 */
export function imagePath(type, uuid) {
  const dir1 = uuid[0]
  const dir2 = uuid.slice(0, 2)
  return join(MEDIA_ROOT, type, dir1, dir2, `${uuid}.webp`)
}

/*
 * Saves an image to disk, converting to webp via ffmpeg at quality 85.
 * Only accepts base64-encoded data: base64 data URIs or raw base64 strings.
 *
 * Validates:
 * - Data URI image type (must be image/*)
 * - Decoded size (max 10 MB)
 * - Magic bytes (must be a recognised image format)
 *
 * @param {string} type - 'user', 'set', or 'pattern'
 * @param {string} uuid - The UUID of the record
 * @param {string} data - Base64 data URI or raw base64 string
 * @return {string|false} - The output path on success, false on failure
 */
export async function saveImage(type, uuid, data) {
  if (!uuid || !data || typeof data !== 'string') return false

  /*
   * Reject URLs — we only accept base64-encoded image data
   */
  if (data.startsWith('http://') || data.startsWith('https://')) {
    log.warn(`saveImage: rejected URL input for ${type}/${uuid}`)
    return false
  }

  /*
   * Validate the data URI type prefix if present
   */
  if (data.startsWith('data:')) {
    const mime = data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9+.-]+);base64,/)
    if (!mime || !mime[1].startsWith('image/')) {
      log.warn(`saveImage: rejected non-image data URI type for ${type}/${uuid}`)
      return false
    }
  }

  /*
   * Decode base64 to binary and check size
   */
  const b64 = data.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '')
  const buf = Buffer.from(b64, 'base64')

  if (buf.length > MAX_IMAGE_BYTES) {
    log.warn(`saveImage: image too large (${buf.length} bytes) for ${type}/${uuid}`)
    return false
  }

  /*
   * Check magic bytes before touching the filesystem
   */
  if (!hasImageMagicBytes(buf)) {
    log.warn(`saveImage: rejected file with unrecognised magic bytes for ${type}/${uuid}`)
    return false
  }

  const inputPath = join(tmpdir(), `fs-img-${randomBytes(8).toString('hex')}`)

  try {
    writeFileSync(inputPath, buf)

    /*
     * Build the output path and ensure the directory exists
     */
    const outPath = imagePath(type, uuid)
    mkdirSync(join(MEDIA_ROOT, type, uuid[0], uuid.slice(0, 2)), { recursive: true })

    /*
     * Convert to webp via ffmpeg at quality 85
     */
    const ff = spawnSync('ffmpeg', ['-y', '-i', inputPath, '-quality', '85', outPath], {
      stdio: 'pipe',
    })
    if (ff.status !== 0) {
      log.warn(`saveImage: ffmpeg conversion failed for ${type}/${uuid}`)
      return false
    }

    return outPath
  } catch (err) {
    log.warn(`saveImage: unexpected error for ${type}/${uuid}: ${err.message}`)
    return false
  } finally {
    try {
      unlinkSync(inputPath)
    } catch {
      // Ignore cleanup errors
    }
  }
}
