// Pure helpers for the organizer dashboard: timestamp formatting, client-side
// search/filter (used when the full team list is loaded), and CSV building.

import { portal } from '../data/content'
import type { Advisor, Leader, Person, Team } from './types'

export type SubmissionFilter =
  | 'all'
  | 'submitted'
  | 'notSubmitted'
  | 'confirmed'
  | 'notConfirmed'
  | 'infoSubmitted'
  | 'infoNotSubmitted'

export const PAGE_SIZE = 10

export const fullName = (p: Person | Leader | Advisor) => `${p.prefix} ${p.nameTh}`.trim()

export const hasSubmitted = (t: Team) => Boolean(t.submission?.locked)
export const isFinalist = (t: Team) => t.isQualifyingFinalRound === true
export const hasConfirmed = (t: Team) => Boolean(t.finalRound?.locked)
export const hasFinalistInfo = (t: Team) => Boolean(t.finalistInfo?.locked)

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
    // The confirmation filters only make sense over finalists.
    if (filter === 'confirmed' && !(isFinalist(t) && hasConfirmed(t))) return false
    if (filter === 'notConfirmed' && !(isFinalist(t) && !hasConfirmed(t))) return false
    // Finalist-info filters are likewise finalists only.
    if (filter === 'infoSubmitted' && !(isFinalist(t) && hasFinalistInfo(t))) return false
    if (filter === 'infoNotSubmitted' && !(isFinalist(t) && !hasFinalistInfo(t))) return false
    if (!q) return true
    return (
      t.teamName.toLowerCase().includes(q) ||
      t.schoolName.toLowerCase().includes(q) ||
      t.province.toLowerCase().includes(q)
    )
  })
}

// Lone CR inside an answer would confuse parsers that split on \r\n; the
// remaining newlines stay inside the quoted field (valid CSV).
const escape = (v: unknown) =>
  `"${String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/"/g, '""')}"`

/** Builds a CSV (columns from content.ts) for offline review. */
export function buildCsv(teams: Team[]): string {
  const { headers } = portal.organizer.csv
  const b = portal.organizer.badge
  const d = portal.organizer.detail
  // Essay columns follow the question order declared in content.ts, so the
  // headers there and the ids here stay aligned automatically.
  const questionIds = portal.submission.questions.map((q) => q.id)

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
      isFinalist(t) ? d.finalistYes : t.isQualifyingFinalRound === false ? d.finalistNo : d.finalistPending,
      hasConfirmed(t) ? formatTimestamp(t.finalRound?.confirmedAt) : '',
      t.submission?.fileName ?? '',
      t.submission?.fileUrl ?? '',
      t.submission?.runEnvironment ?? '',
      ...questionIds.map((id) => t.submission?.essays?.[id] ?? ''),
    ]
      .map(escape)
      .join(',')
  })

  return [headers.map(escape).join(','), ...rows].join('\r\n')
}

/** Per-person CSV of the finalist-info form: one row per student, the
 *  advisor, and the guardian (when attending), for every finalist team that
 *  submitted it. Team-level columns (trip, stay) repeat on each row so the
 *  sheet can be filtered/sorted freely. Column order = csv.finalistHeaders. */
export function buildFinalistCsv(teams: Team[]): string {
  const { finalistHeaders, roles } = portal.organizer.csv
  const fi = portal.finalistInfo
  const rows: unknown[][] = []

  for (const t of teams) {
    const info = t.finalistInfo
    if (!isFinalist(t) || !info) continue
    const teamCols = [t.teamName, t.schoolName, t.province]
    const tripCols = [
      info.travel.mode,
      info.travel.detail,
      info.stay.type,
      info.stay.detail,
      info.arrivalAt.replace('T', ' '),
      info.departureAt.replace('T', ' '),
      info.guardian.isAdvisor ? roles.advisor : info.guardian.attending ? roles.guardian : '',
      formatTimestamp(info.submittedAt),
    ]
    const people: Person[] = [t.leader, ...t.members]
    info.students.forEach((s, i) => {
      const p = people[i]
      rows.push([
        ...teamCols,
        i === 0 ? roles.leader : roles.student,
        p ? fullName(p) : '',
        p?.nameEn ?? '',
        s.nickname,
        s.dob,
        s.shirtSize,
        s.dietary || fi.summary.none,
        s.medical.hasCondition ? s.medical.detail : fi.summary.none,
        p?.phone ?? '',
        p?.email ?? '',
        i === 0 ? t.leader.lineId : '',
        s.emergency.name,
        s.emergency.relationship,
        s.emergency.phone,
        s.memojiMode === 'diy' ? fi.summary.memojiDiy : fi.summary.memojiStaff,
        s.memojiUrl,
        t.consentDocs?.students?.[i]?.docNo ?? '',
        '',
        '',
        '',
        ...tripCols,
      ])
    })
    const a = info.advisor
    rows.push([
      ...teamCols,
      roles.advisor,
      fullName(t.advisor),
      t.advisor.nameEn,
      '',
      '',
      a.shirtSize,
      a.dietary || fi.summary.none,
      '',
      t.advisor.phone,
      t.advisor.email,
      a.lineId,
      '',
      '',
      '',
      '',
      '',
      t.consentDocs?.advisor?.docNo ?? '',
      a.position,
      a.director.name,
      a.director.email,
      ...tripCols,
    ])
    // A guardian who is the advisor is already the advisor row.
    const g = info.guardian
    if (g.attending && !g.isAdvisor) {
      rows.push([
        ...teamCols,
        roles.guardian,
        g.name,
        '',
        '',
        '',
        '',
        g.dietary || fi.summary.none,
        '',
        g.phone,
        g.email,
        g.lineId,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ...tripCols,
      ])
    }
  }

  return [finalistHeaders, ...rows].map((r) => r.map(escape).join(',')).join('\r\n')
}

/** Shirt-size counts across submitted finalist teams: every student + the
 *  advisor (guardians get no shirt). Sizes come back in the content.ts option
 *  order; unknown values are appended. */
export function tallyShirtSizes(teams: Team[]): { size: string; count: number }[] {
  const counts = new Map<string, number>(
    portal.finalistInfo.options.shirtSizes.map((s) => [s, 0] as [string, number]),
  )
  const add = (size: string) => size && counts.set(size, (counts.get(size) ?? 0) + 1)
  for (const t of teams) {
    const info = t.finalistInfo
    if (!isFinalist(t) || !info) continue
    info.students.forEach((s) => add(s.shirtSize))
    add(info.advisor.shirtSize)
  }
  return [...counts].map(([size, count]) => ({ size, count }))
}

/** Triggers a browser download of the CSV text (UTF-8 BOM so Excel reads Thai). */
export function downloadCsv(csv: string, filename: string = portal.organizer.csv.filename): void {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
