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
  fileUrl: string
  fileName: string
  // Firestore serverTimestamp() is a FieldValue on write; on read it's a Timestamp.
  // Typed loosely here so the same shape works for both. Phase 1 uses an ISO string.
  submittedAt: unknown
  locked: true
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
  // (set to true/false via the Firebase console / Admin SDK, never by the app).
  isQualifyingFinalRound: boolean | null
  createdAt: unknown
  submission?: Submission
}
