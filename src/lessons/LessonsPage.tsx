import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { lessons as a } from '../data/content'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PortalButton from '../portal/PortalButton'
import { getLesson, type Lesson, type LessonResult, type LessonResource } from './api'
import {
  LESSONS_ALL_OPEN,
  LESSON_COUNT,
  lessonsNow,
  lessonUnlockAt,
  todayLesson,
  unlockedCount,
} from './lessons'

type DayState = LessonResult | { status: 'loading' } | { status: 'error' }

/**
 * Daily lessons (/explore), public: one lesson a day in the run-up to the
 * national round, each opening at midnight (Bangkok time). A lesson's
 * article and resources come from Firestore, which refuses a lesson before
 * its day; an open lesson shows its title on its tile. The opened lesson is a
 * sheet driven by `?day=N`, so the browser's Back button closes it and a
 * lesson can be linked to directly.
 */
export default function LessonsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // Reached from the home page's navbar, possibly scrolled far down: the
  // router keeps that scroll position, so start this page from the top.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // The clock: re-read when the next lesson is due and whenever the tab comes
  // back into view, so a page left open over midnight opens the new lesson.
  const [now, setNow] = useState(lessonsNow)
  useEffect(() => {
    const tick = () => setNow(lessonsNow())
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    const count = unlockedCount(now)
    const timer =
      count < LESSON_COUNT
        ? window.setTimeout(tick, Math.min(lessonUnlockAt(count + 1) - now + 1000, 2 ** 31 - 1))
        : undefined
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.clearTimeout(timer)
    }
  }, [now])

  const unlocked = unlockedCount(now)
  const available = LESSONS_ALL_OPEN ? LESSON_COUNT : unlocked
  const today = todayLesson(now)

  // Each open lesson is fetched once; `requested` keeps a re-render (or a
  // newly opened lesson) from re-fetching the ones already asked for.
  const [entries, setEntries] = useState<Record<number, DayState>>({})
  const requested = useRef(new Set<number>())
  const load = useCallback((n: number) => {
    setEntries((d) => ({ ...d, [n]: { status: 'loading' } }))
    getLesson(n).then(
      (result) => setEntries((d) => ({ ...d, [n]: result })),
      () => setEntries((d) => ({ ...d, [n]: { status: 'error' } })),
    )
  }, [])
  useEffect(() => {
    for (let n = 1; n <= available; n++) {
      if (requested.current.has(n)) continue
      requested.current.add(n)
      load(n)
    }
  }, [available, load])

  // ?day=N opens that lesson's sheet — once the lesson is open and loaded.
  const requestedDay = Number(new URLSearchParams(location.search).get('day'))
  const activeState =
    Number.isInteger(requestedDay) && requestedDay >= 1 && requestedDay <= available
      ? entries[requestedDay]
      : undefined
  const active = activeState?.status === 'ok' ? activeState.lesson : null

  const searchFor = (day: number | null) => {
    const params = new URLSearchParams(location.search)
    if (day === null) params.delete('day')
    else params.set('day', String(day))
    const s = params.toString()
    return s ? `?${s}` : ''
  }
  // Opening pushes a history entry (so Back closes the sheet); stepping to a
  // neighbouring lesson replaces it; closing pops it — unless the page was
  // loaded straight onto ?day=N, where there is nothing of ours to pop.
  const openLesson = (n: number) => navigate({ search: searchFor(n) }, { state: { sheet: true } })
  const stepTo = (n: number) =>
    navigate({ search: searchFor(n) }, { replace: true, state: location.state })
  const closeLesson = () => {
    if ((location.state as { sheet?: boolean } | null)?.sheet) navigate(-1)
    else navigate({ search: searchFor(null) }, { replace: true })
  }
  const canEnter = (n: number) => n >= 1 && n <= available && entries[n]?.status === 'ok'

  // Tapping a lesson whose day hasn't come shows a notice instead. It closes
  // by itself if the lesson opens (midnight passes) while it is showing.
  const [lockedDay, setLockedDay] = useState<number | null>(null)
  const lockedNotice = lockedDay !== null && lockedDay > available ? lockedDay : null

  return (
    <div className="relative min-h-screen bg-ink text-fg">
      {/* Same royal-blue → navy cover glow as the portal pages. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-60"
        style={{
          background:
            'radial-gradient(125% 95% at 50% 12%, var(--color-cover-blue) 0%, var(--color-cover-navy) 42%, transparent 78%)',
        }}
      />
      <Navbar />

      <main className="relative mx-auto max-w-3xl px-6 pt-28 pb-16 md:pt-36 md:pb-24">
        <header>
          {LESSONS_ALL_OPEN && (
            <p className="mb-3 flex">
              <span className="rounded-full border border-dashed border-swift-gold/60 px-3 py-1 text-xs text-swift-gold">
                {a.previewNotice}
              </span>
            </p>
          )}
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {a.name}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-muted [word-break:auto-phrase]">
            {a.lead}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {Array.from({ length: LESSON_COUNT }, (_, i) => i + 1).map((n) => (
            <DayTile
              key={n}
              n={n}
              future={n > available}
              state={entries[n]}
              isToday={n === today}
              onOpen={() => openLesson(n)}
              onLocked={() => setLockedDay(n)}
              onRetry={() => load(n)}
            />
          ))}
          <HackDayTile />
        </div>
      </main>

      <Footer />
      <Analytics />

      <LessonSheet
        lesson={active}
        onClose={closeLesson}
        onPrev={active && canEnter(active.day - 1) ? () => stepTo(active.day - 1) : undefined}
        onNext={active && canEnter(active.day + 1) ? () => stepTo(active.day + 1) : undefined}
      />
      <LockedNotice open={lockedNotice !== null} onClose={() => setLockedDay(null)} />
    </div>
  )
}

/* ---------- day tiles ---------- */

const tileBase =
  'relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200'
const lockedNumeral = 'block text-6xl font-bold leading-none tracking-tight sm:text-7xl'

function DayTile({
  n,
  future,
  state,
  isToday,
  onOpen,
  onLocked,
  onRetry,
}: {
  n: number
  // The lesson's day hasn't come (and the lessons aren't all forced open).
  future: boolean
  state: DayState | undefined
  isToday: boolean
  onOpen: () => void
  onLocked: () => void
  onRetry: () => void
}) {
  const t = a.tile

  // Not open yet: a tap says so.
  if (future) {
    return (
      <button
        type="button"
        onClick={onLocked}
        aria-label={t.lockedAria.replace('{n}', String(n))}
        className={`${tileBase} cursor-pointer border-line/70 bg-surface/50 hover:border-line`}
      >
        <span className="flex justify-end text-muted">
          <LockIcon />
        </span>
        <span className={`${lockedNumeral} text-fg/15`}>{n}</span>
      </button>
    )
  }

  if (!state || state.status === 'loading') {
    return (
      <div aria-busy className={`${tileBase} animate-pulse border-line bg-surface`}>
        <span />
        <span className={`${lockedNumeral} text-fg/25`}>{n}</span>
      </div>
    )
  }

  // Refused by the server, not seeded yet, or the request failed: tap retries.
  if (state.status !== 'ok') {
    const message =
      state.status === 'locked' ? t.notReady : state.status === 'missing' ? t.missing : t.error
    return (
      <button
        type="button"
        onClick={onRetry}
        className={`${tileBase} cursor-pointer border-dashed border-line bg-surface/50 hover:border-swift-orange/60`}
      >
        <span />
        <span>
          <span className="block text-5xl font-bold leading-none text-fg/30">{n}</span>
          <span className="mt-2 block text-xs leading-snug text-muted">{message}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={t.openAria.replace('{n}', String(n)).replace('{title}', state.lesson.title)}
      className={`${tileBase} cursor-pointer bg-surface hover:-translate-y-0.5 ${
        isToday
          ? 'lesson-today border-swift-orange/70'
          : 'border-line hover:border-swift-orange/60'
      }`}
    >
      {isToday && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 120% at 0% 0%, color-mix(in srgb, var(--color-swift-orange) 24%, transparent) 0%, transparent 62%)',
          }}
        />
      )}
      <TopicIcon icon={state.lesson.icon} />
      <span className="relative flex items-center gap-2">
        <span
          className={`text-4xl font-bold leading-none tracking-tight ${
            isToday
              ? 'bg-linear-to-br from-swift-orange to-swift-gold bg-clip-text text-transparent'
              : 'text-fg'
          }`}
        >
          {n}
        </span>
      </span>
      <span className="relative line-clamp-4 text-sm font-semibold leading-snug [word-break:auto-phrase]">
        {state.lesson.title}
      </span>
    </button>
  )
}

/** A lesson's topic icon, as a large faint mark sunk into the card's top-right
 *  corner (the same treatment as the big number behind an opened lesson). The
 *  stored PNG is used as a mask, so the mark takes the page's colour. Renders
 *  nothing for a lesson without one. */
function TopicIcon({ icon }: { icon?: string | null }) {
  // The value comes from Firestore and goes into a CSS url(): accept only a
  // plain base64 PNG data URL.
  if (!icon || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(icon)) return null
  const mask = `url("${icon}") center / contain no-repeat`
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-3 right-3 h-20 w-20 bg-fg/[0.07]"
      style={{ mask, WebkitMask: mask }}
    />
  )
}

/** The closing tile: where the lessons lead. Not a lesson. */
function HackDayTile() {
  const h = a.hackDay
  return (
    <div
      className="col-span-2 flex min-h-32 flex-col justify-between overflow-hidden rounded-2xl border border-line p-5"
      style={{
        background:
          'linear-gradient(135deg, var(--color-cover-blue) 0%, var(--color-cover-navy) 85%)',
      }}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-white/70">{h.date}</span>
      <span>
        <span className="block text-3xl font-bold leading-none tracking-tight sm:text-4xl">
          {h.title}
        </span>
        <span className="mt-2 block text-sm text-white/75">{h.note}</span>
      </span>
    </div>
  )
}

/* ---------- the "not open yet" notice ---------- */

/**
 * Shown when a lesson whose day hasn't come is tapped: a small native modal
 * <dialog>, like the lesson sheet (Escape and a backdrop click close it).
 */
function LockedNotice({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = a.locked
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) el.showModal()
    if (!open && el.open) el.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby="locked-notice-title"
      aria-describedby="locked-notice-body"
      // Escape closes the dialog natively; sync the state.
      onClose={() => {
        if (open) onClose()
      }}
      // A click that lands on the dialog element itself is on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="lesson-notice fixed inset-0 m-auto w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-line bg-surface p-0 text-fg"
    >
      {open && (
        <div className="p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-fg/80">
            <LockIcon className="h-4 w-4" />
          </span>
          <h2 id="locked-notice-title" className="mt-4 text-xl font-bold">
            {t.title}
          </h2>
          <p
            id="locked-notice-body"
            className="mt-2 text-pretty leading-relaxed text-muted [word-break:auto-phrase]"
          >
            {t.body}
          </p>
          <div className="mt-6 flex justify-end">
            <PortalButton variant="solid" size="sm" onClick={onClose}>
              {t.ok}
            </PortalButton>
          </div>
        </div>
      )}
    </dialog>
  )
}

/* ---------- the opened lesson ---------- */

// Lesson text carries **bold** and `code` (API names). Same odd-index trick as
// withBold (portal/HackathonDetailSection), one level deeper for code spans.
const rich = (text: string) =>
  text.split('**').map((part, i) => {
    const inner = part.split('`').map((piece, j) =>
      j % 2 === 1 ? (
        <code
          key={j}
          className="rounded-md border border-line bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] break-words text-fg"
        >
          {piece}
        </code>
      ) : (
        piece
      ),
    )
    return i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-fg">
        {inner}
      </strong>
    ) : (
      <Fragment key={i}>{inner}</Fragment>
    )
  })

/**
 * The opened lesson: a native modal <dialog> (Escape, focus trapping and focus
 * return come with it) — a bottom sheet on phones, a centred panel from `sm`.
 * `lesson` null means closed.
 */
function LessonSheet({
  lesson,
  onClose,
  onPrev,
  onNext,
}: {
  lesson: Lesson | null
  onClose: () => void
  // Absent when there is no enterable neighbour on that side.
  onPrev?: () => void
  onNext?: () => void
}) {
  const s = a.sheet
  const ref = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const open = lesson !== null
  const number = lesson?.day

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
      // Start on the title (read out by screen readers) rather than on the
      // close button, which showModal() would pick as the first control.
      titleRef.current?.focus()
    }
    if (!open && el.open) el.close()
  }, [open])

  // Stepping to another lesson starts it from the top.
  useEffect(() => {
    ref.current?.scrollTo(0, 0)
  }, [number])

  return (
    <dialog
      ref={ref}
      // Escape closes the dialog natively; sync the URL. (When we closed it
      // ourselves, `lesson` is already null and there is nothing to sync.)
      onClose={() => {
        if (lesson) onClose()
      }}
      // A click that lands on the dialog element itself is on the backdrop.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="lesson-sheet fixed inset-x-0 top-auto bottom-0 m-0 max-h-[92dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-3xl border border-line bg-surface p-0 text-fg sm:inset-0 sm:m-auto sm:max-h-[86dvh] sm:max-w-2xl sm:rounded-3xl"
    >
      {lesson && (
        <div className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute top-6 right-14 text-[11rem] font-bold leading-none tracking-tighter text-fg/[0.04] select-none"
          >
            {lesson.day}
          </span>
          {/* Stays in view while the lesson scrolls underneath. */}
          <div className="pointer-events-none sticky top-0 z-10 flex justify-end px-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              aria-label={s.close}
              className="pointer-events-auto flex h-9 w-9 flex-none cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-muted transition-colors hover:border-swift-orange hover:text-swift-orange"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="relative px-6 pt-1 pb-8 md:px-8">
            <div className="relative">
              {lesson.isNew && (
                <div className="mb-4 flex">
                  <SdkPill />
                </div>
              )}
              <h2
                ref={titleRef}
                tabIndex={-1}
                // Focused only by script; inline because the global focus
                // ring in index.css outranks utility classes.
                style={{ outline: 'none' }}
                className="text-pretty text-2xl font-bold leading-tight md:text-3xl [word-break:auto-phrase]"
              >
                {lesson.title}
              </h2>

              <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
                {lesson.blocks.map((block, i) =>
                  block.type === 'ul' ? (
                    <ul key={i} className="list-disc space-y-2 pl-5 marker:text-swift-orange">
                      {block.items.map((item, j) => (
                        <li key={j}>{rich(item)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i} className="text-pretty">
                      {rich(block.text)}
                    </p>
                  ),
                )}
              </div>

              <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-muted">
                {s.resources}
              </h3>
              <ul className="mt-4 space-y-3">
                {lesson.resources
                  // Links come from Firestore: render only real web links.
                  .filter((r) => r.url.startsWith('https://'))
                  // Videos first, otherwise in the stored order (sort is stable).
                  .sort((x, y) => Number(isVideoUrl(y.url)) - Number(isVideoUrl(x.url)))
                  .map((r) => (
                    <li key={r.url}>
                      <ResourceCard resource={r} />
                    </li>
                  ))}
              </ul>

              <div className="mt-10 flex items-center justify-between gap-3">
                {onPrev ? (
                  <PortalButton variant="outline" size="sm" onClick={onPrev}>
                    {s.prev}
                  </PortalButton>
                ) : (
                  <span />
                )}
                {onNext && (
                  <PortalButton variant="outline" size="sm" onClick={onNext}>
                    {s.next}
                  </PortalButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

function SdkPill() {
  return (
    <span className="rounded-full border border-swift-blue-light/40 px-2.5 py-0.5 text-xs font-semibold text-swift-blue-light">
      {a.sheet.sdk}
    </span>
  )
}

const isVideoUrl = (url: string) => url.includes('/videos/play/')

function ResourceCard({ resource }: { resource: LessonResource }) {
  const s = a.sheet
  const isVideo = isVideoUrl(resource.url)
  // A thumbnail that fails to load falls back to the plain icon.
  const [imageFailed, setImageFailed] = useState(false)
  const image =
    resource.image?.startsWith('https://') && !imageFailed ? resource.image : null
  let host = ''
  try {
    host = new URL(resource.url).hostname.replace(/^www\./, '')
  } catch {
    // Not a parseable URL — show the card without a host.
  }
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface-2 p-3 pr-4 transition-colors hover:border-white/35"
    >
      {image ? (
        <span className="relative block aspect-video w-28 flex-none overflow-hidden rounded-lg bg-ink sm:w-32">
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white">
              <PlayIcon className="h-3 w-3" />
            </span>
          </span>
        </span>
      ) : (
        <span className="ml-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10 text-fg/80">
          {isVideo ? <PlayIcon /> : <DocIcon />}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-medium leading-snug text-fg">{resource.title}</span>
        <span className="mt-1 block text-sm text-muted">
          {isVideo ? s.video : s.doc}
          {host && ` · ${host}`}
          <span className="sr-only"> {s.newTab}</span>
        </span>
      </span>
      <ArrowIcon />
    </a>
  )
}

/* ---------- tiny inline icons (no icon library in this project) ---------- */

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const

function LockIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg {...iconProps} className={className}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg {...iconProps} className="h-4 w-4">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function PlayIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg {...iconProps} className="h-4 w-4">
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg
      {...iconProps}
      className="h-4 w-4 flex-none text-muted transition-colors group-hover:text-fg"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
