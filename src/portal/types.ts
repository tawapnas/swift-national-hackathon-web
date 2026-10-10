// Data shapes for the Team Portal. In Phase 2 these are read from / written to
// Firestore; in Phase 1 they back the mock preview data.
//
// A team = 1 leader + 2 members (3 students total). The leader's email is the
// signed-in google account and is used as the Firestore document id.

// Stored as plain strings (values come from content.ts registration.options) so
// the option lists can change without a type migration.
export interface Person {
  prefix: string // คำนำหน้า — นาย / นางสาว
  nameTh: string // ชื่อ-นามสกุล ภาษาไทย
  nameEn: string // ชื่อ-นามสกุล ภาษาอังกฤษ
  level: string // ระดับชั้น — ม.4 … ปวช.3
  email: string
  phone: string // เบอร์โทร
}

export interface Leader extends Person {
  lineId: string
  devices: string[] // อุปกรณ์ Apple ที่มี — subset of iPad / Mac / iPhone / ไม่มี
}

// อาจารย์ที่ปรึกษา — no ระดับชั้น. Only the full name is shown in the portal.
export interface Advisor {
  prefix: string
  nameTh: string
  nameEn: string
  email: string
  phone: string
}

// Team-overall survey (answered once per team).
export interface TeamSurvey {
  hasProgrammed: boolean // เคยเขียนโปรแกรมมาก่อนไหม
  programmingLanguages: string // ภาษาที่เคยเขียน (when hasProgrammed)
  heardOfSwift: boolean // เคยได้ยินภาษา Swift มาก่อนไหม
  knowsSwiftPlaygrounds: boolean // รู้จัก/เคยลองใช้ Swift Playgrounds
  referral: string // ช่องทางที่ได้ยินกิจกรรม (chosen label, or custom text for "อื่น ๆ")
}

export interface Submission {
  // Keys match the question ids in content.ts portal.submission.questions.
  essays: Record<string, string>
  // Which environment the judges should run the app on — one of
  // content.ts portal.submission.runEnvironment.options.
  runEnvironment: string
  fileUrl: string
  fileName: string
  // Terms & conditions accepted at submit time (required true, like pdpaConsent).
  termsAccepted: boolean
  // Firestore serverTimestamp() is a FieldValue on write; on read it's a Timestamp.
  // Typed loosely here so the same shape works for both. Phase 1 uses an ISO string.
  submittedAt: unknown
  locked: true
}

// A finalist team's national-round participation confirmation. Written once,
// then locked (Phase 1: held in memory; Phase 2: stored on the team doc as
// `finalRound`). Logistics details and consents are collected separately.
export interface FinalRoundConfirmation {
  // serverTimestamp() on write / Timestamp on read; ISO string in Phase 1.
  confirmedAt: unknown
  locked: true
}

// ---------------------------------------------------------------------------
// Finalist info (ข้อมูลผู้เข้าแข่งขัน) — filled once by the leader for the whole
// team after confirming, then locked. Stored on the team doc as `finalistInfo`.
// Option values (travel mode, stay type, shirt size) are the plain strings from
// content.ts portal.finalistInfo.options, like the registration fields.
// ---------------------------------------------------------------------------

export type MemojiMode = 'diy' | 'staff' // ทำเอง (Memoji PNG) | ให้ทีมงานทำ (รูปถ่าย)

export interface StudentInfo {
  nickname: string
  dob: string // yyyy-mm-dd
  memojiMode: MemojiMode
  // Storage download URL (finalists/{email}/memoji-{i}.{ext}). DIY Memoji are
  // flattened onto a white background before upload (memojiImage.ts).
  memojiUrl: string
  medical: { hasCondition: boolean; detail: string } // โรคประจำตัว + ยาที่ใช้
  dietary: string // ข้อจำกัดด้านอาหาร / อาหารที่แพ้ ('' = none)
  shirtSize: string
  emergency: { name: string; relationship: string; phone: string }
}

export interface AdvisorInfo {
  lineId: string
  position: string // วิชาที่สอน / ตำแหน่ง
  shirtSize: string
  dietary: string
  // ผู้อำนวยการสถานศึกษา — receives the organizers' invitation by email
  // (the director's own address or the school's official one).
  director: { name: string; email: string }
}

// ผู้ดูแลที่เดินทางมาด้วย — the advisor, a parent, or no one.
//   attending: someone (the advisor or a parent) looks after the team, so the
//     students' parents sign the normal consent form; false = no one comes →
//     the liability-release form.
//   isAdvisor: that someone is the advisor (attending is true too).
//   The detail fields are the parent's; '' unless attending && !isAdvisor.
export interface GuardianInfo {
  attending: boolean
  isAdvisor: boolean
  name: string
  relationship: string // ความสัมพันธ์กับนักเรียน
  phone: string
  email: string
  lineId: string
  dietary: string // '' = none
}

export interface FinalistInfo {
  travel: { mode: string; detail: string }
  stay: { type: string; detail: string } // detail = hotel name / other details
  arrivalAt: string // datetime-local (yyyy-mm-ddThh:mm)
  departureAt: string
  guardian: GuardianInfo
  students: StudentInfo[] // [leader, member 1, member 2] — same order as the team
  advisor: AdvisorInfo
  codeOfConductAccepted: true
  // serverTimestamp() on write / Timestamp on read; ISO string in previews.
  submittedAt: unknown
  locked: true
}

// Personalised consent PDFs, generated per person from the Word masters by
// scripts/generate-consents.mjs (Admin SDK) — never written by the client.
export interface ConsentDoc {
  url: string // tokenised Storage URL (certificates/{email}/consent-advisor.pdf)
  docNo: string // e.g. SCCTH26217 — unique per person
  kind: 'advisor'
  name: string // the name filled in — lets the script spot stale PDFs
}

// A student's parent form exists in both versions up front, sharing one
// number: Parent_Consent_Normal (the advisor or a parent travels with the
// team) and Parent_Consent_Liability_Release (no one looks after the team).
// The portal offers the one
// matching the team's guardian answer (both until it's known).
export interface StudentConsent {
  docNo: string
  name: string
  normalUrl: string
  liabilityUrl: string
}

export type ParentFormKind = 'normal' | 'liability'

export interface ConsentDocs {
  advisor?: ConsentDoc | null
  students?: (StudentConsent | null)[] // [leader, member 1, member 2]
}

export interface Team {
  email: string // == Firestore doc id; the leader's (registered) email
  teamName: string
  schoolName: string
  province: string
  leader: Leader
  members: Person[] // exactly 2 (leader + 2 = 3 students)
  advisor: Advisor
  survey: TeamSurvey
  pdpaConsent: boolean // PDPA consent given at registration (required true)
  // ผ่านเข้ารอบชิงชนะเลิศระดับประเทศหรือไม่ — null until the organizers decide
  // (set to true/false/null from the organizer dashboard team detail).
  isQualifyingFinalRound: boolean | null
  createdAt: unknown
  // Updated to serverTimestamp() on every portal sign-in; null until the first
  // login (Timestamp on read). See scripts/add-lastlogin.mjs for backfill.
  lastLogin: unknown
  submission?: Submission
  // National round (set after RESULTS_ANNOUNCED). The URLs are uploaded per
  // team by organizers — a participation certificate and an advisor thank-you
  // letter for every submitted team (finalist certificate for finalists), an
  // invitation letter for finalists only. Absent until uploaded.
  finalRound?: FinalRoundConfirmation
  // Filled after confirming (FinalistInfoScreen); absent until submitted.
  finalistInfo?: FinalistInfo
  consentDocs?: ConsentDocs
  certificateUrl?: string
  invitationLetterUrl?: string
  thankYouLetterUrl?: string
}

// Students' national ID numbers for the venue's Wi-Fi, sent once by the leader
// from the top of the finalist-info screen. Kept OUT of the team doc, in
// wifiIdCards/{leaderEmail}, so team reads never carry them, and deleted as
// soon as the Wi-Fi accounts are set up (scripts/delete-wifi-id-cards.mjs).
export interface WifiIdCards {
  idCards: string[] // 13 digits each — [leader, member 1, member 2]
  // serverTimestamp() on write / Timestamp on read; ISO string in previews.
  submittedAt: unknown
  locked: true
}

// What the finalist-info form hands to its submit handler: memojiUrl is ''
// until the caller uploads the images; submittedAt/locked are stamped on save.
export type FinalistInfoInput = Omit<FinalistInfo, 'submittedAt' | 'locked'>
