import { useState } from 'react'
import type { Submission, Team } from './types'
import { mockSubmission } from './mockData' // TEMP (Phase 1): preview-toggle sample
import PortalShell from './PortalShell'
import TeamInfoSection from './TeamInfoSection'
import HackathonDetailSection from './HackathonDetailSection'
import SubmissionSection from './SubmissionSection'

interface TeamPortalScreenProps {
  team: Team
}

/**
 * The team portal: team info + hackathon detail + submission, top to bottom.
 *
 * PHASE 1 (preview): submission is mocked in local state — clicking submit
 * flips to the locked view but nothing persists. In Phase 2 this is replaced by
 * api.submitProject (Storage upload + Firestore transaction) and the team's real
 * submission state from Firestore.
 */
export default function TeamPortalScreen({ team }: TeamPortalScreenProps) {
  const [submission, setSubmission] = useState<Submission | undefined>(team.submission)

  // PHASE 1 mock submit — builds a local Submission so the locked view renders.
  const handleSubmit = async ({
    essays,
    file,
  }: {
    essays: Record<string, string>
    file: File
  }) => {
    setSubmission({
      essays,
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      submittedAt: new Date().toISOString(),
      locked: true,
    })
  }

  return (
    <PortalShell email={team.email}>
      {/* TEMP (Phase 1 preview): toggle submitted/unsubmitted to preview both. */}
      <button
        type="button"
        onClick={() => setSubmission((cur) => (cur ? undefined : mockSubmission))}
        className="mb-6 rounded-full border border-dashed border-line px-3 py-1 text-xs text-muted hover:border-swift-orange hover:text-swift-orange"
      >
        (พรีวิว) สลับสถานะส่งผลงาน: {submission ? 'ส่งแล้ว' : 'ยังไม่ส่ง'}
      </button>

      <header>
        <h1 className="text-3xl font-bold md:text-4xl">{team.teamName}</h1>
        <p className="mt-2 text-muted">
          {team.schoolName} · {team.province}
        </p>
      </header>

      <div className="mt-10">
        <TeamInfoSection team={team} first />
        <HackathonDetailSection />
        <SubmissionSection submission={submission} onSubmit={handleSubmit} />
      </div>
    </PortalShell>
  )
}
