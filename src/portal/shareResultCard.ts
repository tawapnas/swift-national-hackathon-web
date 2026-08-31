// One-tap social share for the winner result screen: draws a 1080×1920
// (IG-story) congratulations card on a canvas and hands it to the native
// share sheet (Web Share API Level 2); desktop browsers without file-share
// support download the PNG instead. All assets are same-origin /public files
// so the canvas stays untainted.

import { portal } from '../data/content'

// Confetti palette sampled from the party memoji's squares + horn. Shared by
// the on-screen confetti (ResultScreen) and the share card.
export const CONFETTI_COLORS = ['#2e63d8', '#db3049', '#f6b31b', '#f0862c', '#7a52d9']

// Design tokens from index.css @theme (canvas can't read CSS variables).
const FG = '#f5f5f7'
const MUTED = '#a1a1a6'
const SWIFT_GOLD = '#fbb04d'

const FONT = '"LINE Seed Sans TH", sans-serif'

const W = 1080
const H = 1920

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Single-line text centered horizontally at y; shrinks the font size until
 *  the line fits maxWidth (long team names). Centering is computed manually
 *  from measureText — Safari doesn't reliably honor ctx.textAlign, which
 *  left-shifted the whole copy block. */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  weight: number,
  size: number,
  color: string,
  maxWidth = 940,
) {
  let px = size
  let width = 0
  do {
    ctx.font = `${weight} ${px}px ${FONT}`
    width = ctx.measureText(text).width
    if (width <= maxWidth) break
    px -= 4
  } while (px > 28)
  ctx.fillStyle = color
  ctx.fillText(text, (W - width) / 2, y)
}

export async function shareResultCard(teamName: string): Promise<void> {
  const s = portal.result.share

  // Make sure the Thai webfont is ready before drawing (canvas won't wait).
  await Promise.all(
    ['400', '700', '800'].map((w) =>
      document.fonts.load(`${w} 64px "LINE Seed Sans TH"`, 'ขอแสดงความยินดี'),
    ),
  ).catch(() => {}) // fall back to system font rather than failing the share
  const [background, memoji, memojiLeft, memojiRight] = await Promise.all([
    loadImage(s.card.background),
    loadImage(portal.result.qualified.memoji),
    loadImage(s.card.sideMemojis[0]),
    loadImage(s.card.sideMemojis[1]),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  // Branded 1080×1920 backdrop — carries the logo, event title, and footer
  // contacts, so the card only adds the memojis, confetti, and copy.
  ctx.drawImage(background, 0, 0, W, H)

  // Confetti squares scattered AROUND the memoji trio (a loose elliptical
  // halo, like the sticker's own confetti ring): golden-angle steps spread
  // the pieces evenly around the cluster, with a deterministic radius jitter
  // so the ring stays organic. Centered on the trio, clear of the backdrop's
  // header title above and the copy block below.
  const ringCx = W / 2
  const ringCy = 790
  for (let i = 0; i < 26; i++) {
    const angle = i * 2.3999632297286533 // golden angle (rad)
    const jitter = (0.5 + i * 0.7548776662466927) % 1
    const x = ringCx + Math.cos(angle) * (330 + jitter * 170)
    const y = ringCy + Math.sin(angle) * (240 + jitter * 140)
    const size = 16 + ((i * 7) % 22)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(((i * 47) % 360) * (Math.PI / 180))
    ctx.globalAlpha = i % 3 === 0 ? 0.45 : 0.85
    ctx.fillStyle = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.62)
    ctx.restore()
  }
  ctx.globalAlpha = 1

  // Memoji trio in the upper third: two smaller, tilted flankers tucked
  // behind the party memoji in the center (hero-section cluster style).
  const sideSize = 320
  const drawSide = (img: HTMLImageElement, cx: number, tilt: number) => {
    ctx.save()
    ctx.translate(cx, 690 + sideSize / 2)
    ctx.rotate(tilt * (Math.PI / 180))
    ctx.drawImage(img, -sideSize / 2, -sideSize / 2, sideSize, sideSize)
    ctx.restore()
  }
  drawSide(memojiRight, 260, -12)
  drawSide(memojiLeft, W - 260, 12)
  const memojiSize = 460
  ctx.drawImage(memoji, (W - memojiSize) / 2, 560, memojiSize, memojiSize)

  // Copy block, in the backdrop's empty middle band (fitText centers each
  // line manually — see its note on Safari).
  ctx.textBaseline = 'alphabetic'
  fitText(ctx, s.card.title, 1250, 700, 72, FG)
  fitText(ctx, teamName, 1400, 800, 104, SWIFT_GOLD)
  fitText(ctx, s.card.subtitle, 1510, 400, 54, MUTED)

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  )
  const file = new File([blob], s.filename, { type: 'image/png' })

  // Native share sheet where supported (iOS/Android); download elsewhere.
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      // Image only — including `text` alongside `files` makes WebKit's share
      // sheet treat the payload as two items (e.g. Copy yields two images).
      await navigator.share({ files: [file] })
    } catch (err) {
      // Closing the sheet without sharing is not an error.
      if (err instanceof DOMException && err.name === 'AbortError') return
      throw err
    }
    return
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = s.filename
  a.click()
  URL.revokeObjectURL(url)
}
