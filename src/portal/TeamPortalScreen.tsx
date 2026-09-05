import { useState } from 'react'
import { portal } from '../data/content'
import type { Submission, Team } from './types'
import { submitProject } from './api'
import PortalShell from './PortalShell'
import TeamInfoSection from './TeamInfoSection'
import HackathonDetailSection from './HackathonDetailSection'
import SubmissionSection from './SubmissionSection'
import ResultBanner from './ResultBanner'

interface TeamPortalScreenProps {
  team: Team
  onSignOut: () => void
  // Organizer preview only: a way back to the dashboard (rendered as a
  // dashed pill above the page). Absent for real teams.
  previewExit?: { label: string; onClick: () => void }
}

/**
 * The team portal: result banner (once announced) + team info + hackathon
 * detail + submission, top to bottom.
 * Submitting uploads the ZIP to Storage and locks the submission onto the
 * team's Firestore doc; the local state flips to the locked view immediately.
 */
export default function TeamPortalScreen({ team, onSignOut, previewExit }: TeamPortalScreenProps) {
  const [submission, setSubmission] = useState<Submission | undefined>(team.submission)

  const handleSubmit = async ({
    essays,
    runEnvironment,
    file,
  }: {
    essays: Record<string, string>
    runEnvironment: string
    file: File
  }) => {
    setSubmission(await submitProject(team.email, essays, runEnvironment, file))
  }

  return (
    <PortalShell onSignOut={onSignOut}>
      {previewExit && (
        <button
          type="button"
          onClick={previewExit.onClick}
          className="mb-6 cursor-pointer rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted transition-colors hover:border-swift-orange hover:text-swift-orange"
        >
          ← {previewExit.label}
        </button>
      )}
      <ResultBanner team={team} />
      <header>
        <h1 className="text-3xl font-bold md:text-4xl">
          {portal.welcome.heading} {team.teamName}
        </h1>
        <div className="mt-4 space-y-4 text-pretty text-lg leading-relaxed text-fg">
          {portal.welcome.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </header>

      <div className="mt-10">
        <TeamInfoSection team={team} />
        <HackathonDetailSection />
        <SubmissionSection submission={submission} onSubmit={handleSubmit} />
      </div>
    </PortalShell>
  )
}
