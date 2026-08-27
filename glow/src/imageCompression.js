// Images are stored inline in Firestore as Base64 data URLs, and a Firestore
// document can hold at most 1,048,487 bytes. A fixed encoder quality therefore
// is not enough: a single photo can come out at 220 KB and a handful of those
// fills a whole document. Every image is instead encoded to a *byte budget* —
// quality steps down, then the canvas shrinks, until the string fits.

// Firestore's hard per-document ceiling, in bytes.
export const FIRESTORE_DOC_LIMIT = 1048487

// Budget per image. ~12 images fit in one document with room to spare.
export const TARGET_IMAGE_BYTES = 70 * 1024

// Degrade resolution before quality: a 720px image at q0.56 reads far better in
// the hero carousel than a 1000px one crushed to q0.36 to hit the same budget.
const SIZE_STEPS = [1000, 850, 720, 600, 500, 420, 360]
const QUALITY_STEPS = [0.8, 0.68, 0.56]

let webpSupported = null

// WebP encodes roughly 30% smaller than JPEG at the same perceived quality, and
// every browser that can run this admin panel supports it — but Safari only
// gained canvas WebP *encoding* in 14, so probe instead of assuming.
function supportsWebp() {
  if (webpSupported === null) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1
    webpSupported = canvas.toDataURL('image/webp').startsWith('data:image/webp')
  }
  return webpSupported
}

function fitWithin(width, height, max) {
  if (width <= max && height <= max) return { width, height }
  return width >= height
    ? { width: max, height: Math.max(1, Math.round((height * max) / width)) }
    : { width: Math.max(1, Math.round((width * max) / height)), height: max }
}

// Encode at one canvas size, stepping quality down. Returns the first result
// inside the budget, or the smallest one it managed.
function encodeAtSize(img, maxPx) {
  const { width, height } = fitWithin(img.naturalWidth || img.width, img.naturalHeight || img.height, maxPx)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, 0, 0, width, height)

  const type = supportsWebp() ? 'image/webp' : 'image/jpeg'
  let smallest = null
  for (const quality of QUALITY_STEPS) {
    const url = canvas.toDataURL(type, quality)
    if (!smallest || url.length < smallest.length) smallest = url
    if (url.length <= TARGET_IMAGE_BYTES) return { url, withinBudget: true }
  }
  return { url: smallest, withinBudget: false }
}

// Data URLs are pure ASCII, so string length is the byte count.
function encodeToBudget(img) {
  let smallest = null
  for (const maxPx of SIZE_STEPS) {
    const attempt = encodeAtSize(img, maxPx)
    if (attempt.withinBudget) return attempt.url
    if (!smallest || attempt.url.length < smallest.length) smallest = attempt.url
  }
  return smallest
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode image'))
    img.src = src
  })
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = (e) => resolve(e.target.result)
    reader.readAsDataURL(file)
  })
}

/** Compress a picked/dropped File into a Base64 data URL inside the byte budget. */
export async function compressFile(file) {
  const img = await loadImage(await readAsDataUrl(file))
  return encodeToBudget(img)
}

/**
 * Re-encode an image that is already stored as a Base64 data URL. Plain paths
 * ('/hero.png'), remote URLs and images already inside the budget come back
 * untouched, so re-running the optimizer is idempotent and cheap.
 */
export async function compressDataUrl(value) {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return value
  if (value.length <= TARGET_IMAGE_BYTES) return value
  const compressed = encodeToBudget(await loadImage(value))
  return compressed.length < value.length ? compressed : value
}

/** Approximate the stored size of a Firestore document body, in bytes. */
export function approxDocBytes(data) {
  try {
    return new Blob([JSON.stringify(data ?? null)]).size
  } catch {
    return 0
  }
}
