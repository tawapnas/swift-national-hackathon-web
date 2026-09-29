// Fabricated team used ONLY by the organizer dashboard's team-view previews
// (portal banner + national-round page + finalist-info form). Never written
// anywhere.

import { portal } from '../data/content'
import type { ConsentDocs, FinalistInfo, StudentInfo, Team } from './types'

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
    consentDocs: withDocs ? sampleConsentDocs() : undefined,
    thankYouLetterUrl: withDocs ? '#' : undefined,
  }
}

/** A submitted finalist-info form for the sample team (its locked-summary
 *  preview). One student has a medical condition so the highlighted state
 *  shows up. */
export function sampleFinalistInfo(): FinalistInfo {
  const o = portal.finalistInfo.options
  const student = (patch: Partial<StudentInfo>): StudentInfo => ({
    nickname: 'ภูมิ',
    dob: '2009-05-14',
    memojiMode: 'diy',
    memojiUrl: '/memoji-qualified.001.png',
    medical: { hasCondition: false, detail: '' },
    dietary: 'ไม่มี',
    shirtSize: 'M',
    emergency: { name: 'สมชาย ตัวอย่าง', relationship: 'บิดา', phone: '0811111111' },
    ...patch,
  })
  return {
    travel: { mode: o.travelModes[4], detail: 'เที่ยวบิน FD3001 ถึงดอนเมือง 16 ต.ค. 10:30' },
    stay: { type: o.stayTypes[1], detail: 'โรงแรมตัวอย่าง สุขุมวิท' },
    arrivalAt: '2026-10-16T10:30',
    departureAt: '2026-10-19T18:00',
    guardian: {
      attending: true,
      name: 'นางสมศรี ตัวอย่าง',
      phone: '0856789012',
      email: 'parent@example.com',
      lineId: 'somsri.t',
      dietary: 'ไม่มี',
    },
    students: [
      student({}),
      student({
        nickname: 'มายด์',
        dob: '2009-11-02',
        memojiMode: 'staff',
        medical: { hasCondition: true, detail: 'หอบหืด — พกยาพ่นติดตัว' },
        dietary: 'แพ้กุ้ง',
        shirtSize: 'S',
      }),
      student({ nickname: 'เต้', dob: '2010-02-20', shirtSize: 'L' }),
    ],
    advisor: {
      lineId: 'orathai.t',
      position: 'ครูวิชาวิทยาการคำนวณ',
      shirtSize: 'L',
      dietary: 'ไม่มี',
      director: { name: 'นายวิชัย ตัวอย่าง', email: 'saraban@example.ac.th' },
    },
    codeOfConductAccepted: true,
    submittedAt: new Date().toISOString(),
    locked: true,
  }
}

/** Sample generated consent PDFs (numbers from SCCTH26217): the advisor's
 *  form plus both parent-form versions for each student. */
export function sampleConsentDocs(): ConsentDocs {
  const student = (docNo: string, name: string) => ({ docNo, name, normalUrl: '#n', liabilityUrl: '#l' })
  return {
    advisor: { url: '#', docNo: 'SCCTH26217', kind: 'advisor', name: 'อรทัย ตัวอย่าง' },
    students: [
      student('SCCTH26218', 'นายภูมิ ตัวอย่าง'),
      student('SCCTH26219', 'นางสาวมายด์ ตัวอย่าง'),
      student('SCCTH26220', 'นายเต้ ตัวอย่าง'),
    ],
  }
}
