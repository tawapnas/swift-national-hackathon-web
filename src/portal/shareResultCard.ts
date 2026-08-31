// One-tap social share for the winner result screen: draws a 1080×1920
// (IG-story) congratulations card on a canvas and hands it to the native
// share sheet (Web Share API Level 2); desktop browsers without file-share
// support download the PNG instead. All assets are same-origin /public files
// so the canvas stays untainted.

import { portal, site } from '../data/content'

// Confetti palette sampled from the party memoji's squares + horn. Shared by
// the on-screen confetti (ResultScreen) and the share card.
export const CONFETTI_COLORS = ['#2e63d8', '#db3049', '#f6b31b', '#f0862c', '#7a52d9']

// Design tokens from index.css @theme (canvas can't read CSS variables).
const INK = '#0b0b0c'
const FG = '#f5f5f7'
const MUTED = '#a1a1a6'
const SWIFT_ORANGE = '#f05138'
const SWIFT_GOLD = '#fbb04d'
const COVER_BLUE = '#2c5fc9'

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

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'transparent')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

/** Single-line text centered at (W/2, y); shrinks the font size until the
 *  line fits maxWidth (long team names). Returns the size actually used. */
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
  do {
    ctx.font = `${weight} ${px}px ${FONT}`
    if (ctx.measureText(text).width <= maxWidth) break
    px -= 4
  } while (px > 28)
  ctx.fillStyle = color
  ctx.fillText(text, W / 2, y)
}

export async function shareResultCard(teamName: string): Promise<void> {
  const s = portal.result.share

  // Make sure the Thai webfont is ready before drawing (canvas won't wait).
  await Promise.all(
    ['400', '700', '800'].map((w) =>
      document.fonts.load(`${w} 64px "LINE Seed Sans TH"`, 'ขอแสดงความยินดี'),
    ),
  ).catch(() => {}) // fall back to system font rather than failing the share
  const [memoji, memojiLeft, memojiRight, logo] = await Promise.all([
    loadImage(portal.result.qualified.memoji),
    loadImage(s.card.sideMemojis[0]),
    loadImage(s.card.sideMemojis[1]),
    loadImage('/logo.svg'),
  ])

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas 2d context unavailable')

  // Background + the portal's warm/cool cover glows.
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, W, H)
  glow(ctx, W / 2, 430, 720, `${SWIFT_ORANGE}2e`)
  glow(ctx, W / 2, 1560, 820, `${COVER_BLUE}30`)

  // Scattered confetti squares, same palette as the screen animation. The R2
  // low-discrepancy sequence spreads the points evenly over the whole card
  // (a plain modulo scatter clumps into diagonal trails) while staying
  // deterministic.
  for (let i = 0; i < 26; i++) {
    const x = 40 + ((0.5 + i * 0.7548776662466927) % 1) * (W - 80)
    const y = 60 + ((0.5 + i * 0.5698402909980532) % 1) * (H - 120)
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
    ctx.translate(cx, 430 + sideSize / 2)
    ctx.rotate(tilt * (Math.PI / 180))
    ctx.drawImage(img, -sideSize / 2, -sideSize / 2, sideSize, sideSize)
    ctx.restore()
  }
  drawSide(memojiRight, 260, -12)
  drawSide(memojiLeft, W - 260, 12)
  const memojiSize = 460
  ctx.drawImage(memoji, (W - memojiSize) / 2, 300, memojiSize, memojiSize)

  // Copy block.
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  fitText(ctx, s.card.title, 990, 700, 72, FG)
  fitText(ctx, teamName, 1140, 800, 104, SWIFT_GOLD)
  fitText(ctx, s.card.subtitle, 1250, 400, 54, MUTED)
  fitText(ctx, site.title, 1420, 700, 46, SWIFT_ORANGE)

  // Org logo, bottom-center (intrinsic 155×24, drawn at 2.2×).
  const logoW = 341
  const logoH = logoW * (logo.naturalHeight / logo.naturalWidth)
  ctx.drawImage(logo, (W - logoW) / 2, 1760, logoW, logoH)

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
  )
  const file = new File([blob], s.filename, { type: 'image/png' })

  // Native share sheet where supported (iOS/Android); download elsewhere.
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: s.text })
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
