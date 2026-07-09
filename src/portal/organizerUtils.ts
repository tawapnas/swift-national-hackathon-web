// Pure helpers for the organizer dashboard: timestamp formatting, client-side
// search/filter (used when the full team list is loaded), and CSV building.

import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'

export type SubmissionFilter = 'all' | 'submitted' | 'notSubmitted'

export const PAGE_SIZE = 10

export const fullName = (p: Person | Leader | Advisor) => `${p.prefix} ${p.nameTh}`.trim()

export const hasSubmitted = (t: Team) => Boolean(t.submission?.locked)

/** Formats a Firestore Timestamp (typed `unknown` on our models) to a Thai
 *  date-time string. Returns '—' for missing/unstamped values. */
export function formatTimestamp(value: unknown): string {
  const ts = value as { toDate?: () => Date } | null
  if (!ts || typeof ts.toDate !== 'function') return '—'
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(ts.toDate())
}

/** Client-side search + submission filter over an already-fetched team list.
 *  Search matches team name / school / province (substring, case-insensitive). */
export function filterTeams(teams: Team[], search: string, filter: SubmissionFilter): Team[] {
  const q = search.trim().toLowerCase()
  return teams.filter((t) => {
    const submitted = hasSubmitted(t)
    if (filter === 'submitted' && !submitted) return false
    if (filter === 'notSubmitted' && submitted) return false
    if (!q) return true
    return (
      t.teamName.toLowerCase().includes(q) ||
      t.schoolName.toLowerCase().includes(q) ||
      t.province.toLowerCase().includes(q)
    )
  })
}

/** Builds a CSV (columns from content.ts) for offline review. */
export function buildCsv(teams: Team[]): string {
  const { headers } = portal.organizer.csv
  const b = portal.organizer.badge
  const escape = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

  const rows = teams.map((t) => {
    const submitted = hasSubmitted(t)
    return [
      t.teamName,
      t.schoolName,
      t.province,
      fullName(t.leader),
      t.leader.email,
      t.leader.phone,
      t.members.map(fullName).join(' / '),
      fullName(t.advisor),
      t.advisor.email,
      submitted ? b.submitted : b.notSubmitted,
      submitted ? formatTimestamp(t.submission?.submittedAt) : '',
      t.submission?.fileName ?? '',
      t.submission?.fileUrl ?? '',
    ]
      .map(escape)
      .join(',')
  })

  return [headers.map(escape).join(','), ...rows].join('\r\n')
}

/** Triggers a browser download of the CSV text (UTF-8 BOM so Excel reads Thai). */
export function downloadCsv(csv: string): void {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = portal.organizer.csv.filename
  a.click()
  URL.revokeObjectURL(url)
}
