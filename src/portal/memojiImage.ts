// Memoji images are printed on name badges and event media on white. A Memoji
// sticker saved from iOS is a transparent PNG, so the picked image is
// flattened onto a white background in the browser before upload. The
// background itself isn't validated — any image is accepted.

const MAX_SIDE = 2048 // downscale very large images

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('unreadable'))
    }
    img.src = url
  })
}

/** Returns a PNG of `file` drawn over a solid white background. Throws when
 *  the image can't be decoded. */
export async function toWhiteBackgroundPng(file: File): Promise<File> {
  const img = await loadImage(file)
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('unreadable')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) throw new Error('unreadable')
  const base = file.name.replace(/\.[^.]+$/, '') || 'memoji'
  return new File([blob], `${base}.png`, { type: 'image/png' })
}
