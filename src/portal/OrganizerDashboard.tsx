import { useEffect, useMemo, useRef, useState } from 'react'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { portal } from '../data/content'
import type { Team } from './types'
import {
  fetchAllTeams,
  getSignedInCount,
  getSubmittedCount,
  getTeamsCount,
  listTeamsPage,
} from './api'
import {
  buildCsv,
  downloadCsv,
  filterTeams,
  hasSubmitted,
  PAGE_SIZE,
  type SubmissionFilter,
} from './organizerUtils'
import PortalShell from './PortalShell'
import PortalButton from './PortalButton'
import FullScreenLoader from './FullScreenLoader'
import OrganizerTeamDetail from './OrganizerTeamDetail'

const o = portal.organizer

/**
 * Organizer dashboard: team count + submitted count, a paged team list (10 per
 * page via Firestore cursors for the default browse), and search / filter / CSV
 * that lazily fall back to a one-time full fetch (Firestore can't substring-
 * search or query for an absent field). Read-only.
 */
export default function OrganizerDashboard({ onSignOut }: { onSignOut: () => void }) {
  // Header stats.
  const [totalTeams, setTotalTeams] = useState<number | null>(null)
  const [signedInCount, setSignedInCount] = useState<number | null>(null)
  const [submittedCount, setSubmittedCount] = useState<number | null>(null)

  // Search / filter (active when either is set → client-side over the full list).
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<SubmissionFilter>('all')
  const isFiltering = search.trim() !== '' || filter !== 'all'

  // Default browse: server cursor pagination, pages cached so Prev is free.
  const [pages, setPages] = useState<Team[][]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const lastDocRef = useRef<QueryDocumentSnapshot | null>(null)

  // Full team list — loaded on demand for search / filter / CSV, then cached.
  const [allTeams, setAllTeams] = useState<Team[] | null>(null)
  const [allLoading, setAllLoading] = useState(false)

  const [filterPage, setFilterPage] = useState(0)
  const [selected, setSelected] = useState<Team | null>(null)
  const [busy, setBusy] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState(false)

  // Initial load: counts + first browse page.
  useEffect(() => {
    let cancelled = false
    Promise.all([
      getTeamsCount(),
      getSignedInCount(),
      getSubmittedCount(),
      listTeamsPage(null),
    ])
      .then(([total, signedIn, submitted, first]) => {
        if (cancelled) return
        setTotalTeams(total)
        setSignedInCount(signedIn)
        setSubmittedCount(submitted)
        setPages([first.teams])
        lastDocRef.current = first.lastDoc
        setHasMore(first.hasMore)
      })
      .catch(() => !cancelled && setError(true))
      .finally(() => !cancelled && setInitialLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  // Lazily load the full list the first time search/filter is used.
  useEffect(() => {
    if (!isFiltering || allTeams !== null || allLoading) return
    setAllLoading(true)
    fetchAllTeams()
      .then(setAllTeams)
      .catch(() => setError(true))
      .finally(() => setAllLoading(false))
  }, [isFiltering, allTeams, allLoading])

  // Reset to the first result page whenever the query changes.
  useEffect(() => setFilterPage(0), [search, filter])

  const filtered = useMemo(
    () => (allTeams ? filterTeams(allTeams, search, filter) : []),
    [allTeams, search, filter],
  )

  // ---- browse pagination -------------------------------------------------
  const goNext = async () => {
    if (pageIndex + 1 < pages.length) {
      setPageIndex(pageIndex + 1)
      return
    }
    if (!hasMore || busy) return
    setBusy(true)
    try {
      const next = await listTeamsPage(lastDocRef.current)
      setPages((p) => [...p, next.teams])
      lastDocRef.current = next.lastDoc
      setHasMore(next.hasMore)
      setPageIndex(pages.length)
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }
  const goPrev = () => pageIndex > 0 && setPageIndex(pageIndex - 1)

  // ---- CSV ---------------------------------------------------------------
  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const data = allTeams ?? (await fetchAllTeams())
      if (!allTeams) setAllTeams(data)
      downloadCsv(buildCsv(data))
    } catch {
      setError(true)
    } finally {
      setExporting(false)
    }
  }

  if (initialLoading) return <FullScreenLoader />

  if (error) {
    return (
      <PortalShell onSignOut={onSignOut}>
        <p className="leading-relaxed text-muted">{o.error}</p>
        <div className="mt-6">
          <PortalButton onClick={() => window.location.reload()}>{o.retry}</PortalButton>
        </div>
      </PortalShell>
    )
  }

  if (selected) {
    return (
      <PortalShell onSignOut={onSignOut}>
        <OrganizerTeamDetail team={selected} onBack={() => setSelected(null)} />
      </PortalShell>
    )
  }

  // Displayed page + pagination state depend on the mode.
  const filterTotalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const list = isFiltering
    ? filtered.slice(filterPage * PAGE_SIZE, filterPage * PAGE_SIZE + PAGE_SIZE)
    : (pages[pageIndex] ?? [])
  const canPrev = isFiltering ? filterPage > 0 : pageIndex > 0
  const canNext = isFiltering
    ? filterPage + 1 < filterTotalPages
    : pageIndex + 1 < pages.length || hasMore
  const currentPage = isFiltering ? filterPage + 1 : pageIndex + 1
  const listLoading = isFiltering ? allLoading : busy

  return (
    <PortalShell onSignOut={onSignOut}>
      <h1 className="text-3xl font-bold md:text-4xl">{o.heading}</h1>
      <p className="mt-2 text-muted">{o.lead}</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label={o.stats.totalTeams} value={fmt(totalTeams)} unit={o.stats.unit} />
        <Stat
          label={o.stats.signedIn}
          value={`${fmt(signedInCount)}/${fmt(totalTeams)}`}
          unit={o.stats.unit}
        />
        <Stat
          label={o.stats.submitted}
          value={`${fmt(submittedCount)}/${fmt(totalTeams)}`}
          unit={o.stats.unit}
        />
      </div>

      {/* Toolbar */}
      <div className="mt-10 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={o.searchPlaceholder}
          className="w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-white"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(['all', 'submitted', 'notSubmitted'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                  filter === f
                    ? 'border-swift-orange bg-swift-orange/15 text-swift-orange'
                    : 'border-line text-muted hover:border-swift-orange'
                }`}
              >
                {o.filters[f]}
              </button>
            ))}
          </div>
          <PortalButton variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
            {exporting ? o.csv.exporting : o.csv.export}
          </PortalButton>
        </div>
      </div>

      {/* List */}
      <div className="mt-6">
        {listLoading && list.length === 0 ? (
          <p className="py-10 text-center text-muted">{o.list.loading}</p>
        ) : list.length === 0 ? (
          <p className="py-10 text-center text-muted">{o.list.empty}</p>
        ) : (
          <ul className="space-y-3">
            {list.map((team) => (
              <li key={team.email}>
                <button
                  type="button"
                  onClick={() => setSelected(team)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-swift-orange"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{team.teamName}</p>
                    <p className="truncate text-sm text-muted">
                      {team.schoolName} · {team.province}
                    </p>
                  </div>
                  <SubmissionBadge submitted={hasSubmitted(team)} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pagination */}
      {(canPrev || canNext) && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <PortalButton variant="outline" size="sm" onClick={goPrev} disabled={!canPrev || listLoading}>
            {o.pagination.prev}
          </PortalButton>
          <span className="text-sm text-muted">
            {o.pagination.page} {currentPage}
            {isFiltering && ` / ${filterTotalPages}`}
          </span>
          <PortalButton variant="outline" size="sm" onClick={goNext} disabled={!canNext || listLoading}>
            {o.pagination.next}
          </PortalButton>
        </div>
      )}
    </PortalShell>
  )
}

const fmt = (n: number | null) => (n === null ? '—' : n.toLocaleString('th-TH'))

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold">
        {value} <span className="text-base font-normal text-muted">{unit}</span>
      </p>
    </div>
  )
}

function SubmissionBadge({ submitted }: { submitted: boolean }) {
  return submitted ? (
    <span className="flex-none rounded-full border border-swift-orange bg-swift-orange/15 px-3 py-1 text-xs font-medium text-swift-orange">
      {o.badge.submitted}
    </span>
  ) : (
    <span className="flex-none rounded-full border border-line px-3 py-1 text-xs text-muted">
      {o.badge.notSubmitted}
    </span>
  )
}
