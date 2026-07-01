// TEMPORARY (Phase 1 preview only). Sample team used to preview the portal
// screens without Firebase. Remove when auth/Firestore is wired in Phase 2.

import type { Submission, Team } from './types'

export const mockTeam: Team = {
  email: 'team.lead@example.com',
  teamName: 'Swift Pioneers',
  schoolName: 'โรงเรียนสาธิตตัวอย่าง',
  province: 'กรุงเทพมหานคร',
  leader: {
    prefix: 'นาย',
    nameTh: 'สมชาย ใจดี',
    nameEn: 'Somchai Jaidee',
    level: 'ม.5',
    email: 'team.lead@example.com',
    phone: '0812345678',
    lineId: 'somchai_jd',
    devices: ['iPad', 'iPhone'],
  },
  members: [
    {
      prefix: 'นางสาว',
      nameTh: 'สมหญิง รักเรียน',
      nameEn: 'Somying Rakrian',
      level: 'ม.6',
      email: 'somying@example.com',
      phone: '0823456789',
    },
    {
      prefix: 'นาย',
      nameTh: 'ปิติ ขยันยิ่ง',
      nameEn: 'Piti Khayanying',
      level: 'ม.5',
      email: 'piti@example.com',
      phone: '0834567890',
    },
  ],
  advisor: {
    prefix: 'นาย',
    nameTh: 'มานะ ตั้งใจสอน',
    nameEn: 'Mana Tangjaisorn',
    email: 'mana@example.com',
    phone: '0845678901',
  },
  survey: {
    hasProgrammed: true,
    programmingLanguages: 'Python, JavaScript',
    heardOfSwift: true,
    knowsSwiftPlaygrounds: false,
    referral: 'Swift Coding Club TH Facebook',
  },
  pdpaConsent: true,
  createdAt: '2026-06-15T09:00:00.000Z',
}

// Sample submitted state, used by the preview toggle to show the locked view.
// Essay keys must match content.ts portal.submission.questions ids.
export const mockSubmission: Submission = {
  essays: {
    inspiration: 'พวกเราได้แรงบันดาลใจจากปัญหาการจัดตารางเรียนของเพื่อน ๆ ในโรงเรียน...',
    technical: 'พัฒนาด้วย Swift และ SwiftUI ใช้ Swift Playgrounds บน iPad จัดการข้อมูลด้วย...',
    toolsDisclosure: 'ใช้ไลบรารีมาตรฐานของ Apple เป็นหลัก และศึกษาแนวทางจากเอกสารทางการ...',
  },
  fileUrl: '#',
  fileName: 'swift-pioneers.swiftpm.zip',
  submittedAt: '2026-08-10T10:00:00.000Z',
  locked: true,
}
