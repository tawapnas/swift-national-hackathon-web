import { useState } from 'react'
import { portal } from '../data/content'
import type { Submission, Team } from './types'
import { submitProject } from './api'
import PortalShell from './PortalShell'
import TeamInfoSection from './TeamInfoSection'
import HackathonDetailSection from './HackathonDetailSection'
import SubmissionSection from './SubmissionSection'

interface TeamPortalScreenProps {
  team: Team
  onSignOut: () => void
}

/**
 * The team portal: team info + hackathon detail + submission, top to bottom.
 * Submitting uploads the ZIP to Storage and locks the submission onto the
 * team's Firestore doc; the local state flips to the locked view immediately.
 */
export default function TeamPortalScreen({ team, onSignOut }: TeamPortalScreenProps) {
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
      <header>
        <h1 className="text-3xl font-bold md:text-4xl">
          {portal.welcome.heading} {team.teamName}
        </h1>
        <div className="mt-4 space-y-4 text-pretty text-lg leading-relaxed text-muted">
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
