// Fabricated team used ONLY by the organizer dashboard's team-view previews
// (portal banner + national-round page). Never written anywhere.

import { portal } from '../data/content'
import type { Team } from './types'

/** A submitted sample team. `qualified` sets the finalist flag; `withDocs`
 *  attaches a certificate URL (the invitation letter is deliberately left
 *  absent so the documents section previews both the ready and the
 *  "preparing" states at once). */
export function sampleTeam(qualified: boolean, { withDocs = true } = {}): Team {
  const email = 'sample-team@example.com'
  return {
    email,
    teamName: portal.organizer.resultPreview.sampleTeamName,
    schoolName: 'โรงเรียนตัวอย่างวิทยา',
    province: 'กรุงเทพมหานคร',
    leader: {
      prefix: 'นาย',
      nameTh: 'ภูมิ ตัวอย่าง',
      nameEn: 'Phum Tuayang',
      level: 'ม.5',
      email,
      phone: '0812345678',
      lineId: 'phum.dev',
      devices: ['iPad'],
    },
    members: [
      {
        prefix: 'นางสาว',
        nameTh: 'มายด์ ตัวอย่าง',
        nameEn: 'Mind Tuayang',
        level: 'ม.5',
        email: 'mind@example.com',
        phone: '0823456789',
      },
      {
        prefix: 'นาย',
        nameTh: 'เต้ ตัวอย่าง',
        nameEn: 'Tae Tuayang',
        level: 'ม.4',
        email: 'tae@example.com',
        phone: '0834567890',
      },
    ],
    advisor: {
      prefix: 'นางสาว',
      nameTh: 'อรทัย ตัวอย่าง',
      nameEn: 'Orathai Tuayang',
      email: 'advisor@example.com',
      phone: '0845678901',
    },
    survey: {
      hasProgrammed: true,
      programmingLanguages: 'Python, Swift',
      heardOfSwift: true,
      knowsSwiftPlaygrounds: true,
      referral: 'Swift Coding Club TH Facebook',
    },
    pdpaConsent: true,
    isQualifyingFinalRound: qualified,
    createdAt: null,
    lastLogin: null,
    submission: {
      essays: {},
      runEnvironment: portal.submission.runEnvironment.options[0],
      fileUrl: '#',
      fileName: 'SampleApp.swiftpm.zip',
      termsAccepted: true,
      submittedAt: null,
      locked: true,
    },
    certificateUrl: withDocs ? '#' : undefined,
  }
}
