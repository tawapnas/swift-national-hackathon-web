// Single source of truth for all Thai copy on the site.
// NOTE: Intentionally contains NO mention of AI / On-device AI / Apple
// Intelligence / Local LLM / Foundation Models — that is a reveal-later theme.

export const site = {
  title: 'Young iOS Developer Hackathon 2026',
  shortTitle: 'YiDH26',
  org: 'Swift Coding Club Thailand',
  orgShort: 'SCCTH',
  tagline: 'การแข่งขันพัฒนาแอปพลิเคชันระดับประเทศด้วยภาษา Swift',
}

export const nav = [
  { id: 'about', label: 'รู้จักการแข่งขัน' },
  { id: 'format', label: 'รูปแบบ' },
  { id: 'timeline', label: 'กำหนดการ' },
  { id: 'learn', label: 'สื่อการเรียนรู้' },
]

export const hero = {
  // Memoji shown above the title.
  memojis: ['/memojis.001.png', '/memojis.002.png', '/memojis.003.png'],
  heading: 'Young iOS Developer\nHackathon 2026',
  subheading:
    'เวทีแข่งขันพัฒนาแอปบนระบบ iOS ระดับประเทศ',
  primaryCta: 'สมัครเข้าร่วม',
  secondaryCta: 'ดูรายละเอียด',
  facts: [] as { icon: string; label: string }[],
}

export const gallery = {
  heading: 'ช่วงเวลาดี ๆ จากเวทีปีก่อน',
  // Photos live in /public — referenced by absolute path.
  images: [
    '/493831636_713904610983022_2116470787306490738_n.jpg',
    '/493866362_713920794314737_6623516236940450582_n.jpg',
    '/493940409_713904614316355_8869879900390651710_n.jpg',
    '/493941449_713904624316354_4139991152302725544_n.jpg',
    '/494090761_713920717648078_2236584647831228718_n.jpg',
    '/260468_HACKATHON-Young-iOS-Developer-2025.jpg',
    '/270468_HACKATHON-Young-iOS-Developer-1008.jpg',
    '/270468_HACKATHON-Young-iOS-Developer-1024.jpg',
    '/270468_HACKATHON-Young-iOS-Developer-1065.jpg',
  ],
}

export const about = {
  heading: 'รู้จักการแข่งขัน',
  body: [
    'การแข่งขันพัฒนาแอป iOS ระดับประเทศ สำหรับนักเรียนมัธยมปลายและอาชีวศึกษาที่อยากลงมือสร้างผลงานจริงด้วยภาษา Swift และเทคโนโลยีต่าง ๆ ของ Apple',
    'ผู้เข้าแข่งขันจะได้ลงมือสร้างสรรค์แอปพลิเคชัน พร้อมเปลี่ยนไอเดียสุดล้ำให้กลายเป็นจริง',
    'ไม่จำเป็นต้องมีประสบการณ์มาก่อน เพราะมีสื่อการเรียนรู้และสัมมนาเตรียมความพร้อมให้ พร้อมฝึกทักษะการทำงานเป็นทีมและการนำเสนอผลงาน',
  ],
}

export const format = {
  heading: 'รูปแบบการแข่งขัน',
  lead: 'การแข่งขันแบ่งออกเป็น 2 รอบ คือ รอบคัดเลือกระดับภูมิภาคแบบออนไลน์ และรอบชิงชนะเลิศระดับประเทศ',
  rounds: [
    {
      tag: 'รอบที่ 1',
      title: 'รอบคัดเลือกระดับภูมิภาค',
      mode: 'ออนไลน์ทั่วประเทศ',
      points: [
        'สร้างสรรค์ผลงานในรูปแบบไฟล์ .swiftpm โดยสามารถเลือกพัฒนาได้ทั้งบน iPad และ Mac',
        'ติดตามกฎกติกาและรายละเอียดเพิ่มเติมได้ในช่วงสัมมนาออนไลน์เตรียมความพร้อม',
      ],
    },
    {
      tag: 'รอบที่ 2',
      title: 'รอบชิงชนะเลิศระดับประเทศ',
      mode: 'วิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ กรุงเทพฯ',
      points: [
        'Workshop เจาะลึกการพัฒนาแอป พร้อมแชร์ Use Case จากประสบการณ์ทำงานจริง',
        'มี Coaching Clinic คอยให้คำปรึกษาตลอดการแข่งขัน',
        'นำเสนอผลงานต่อคณะกรรมการในวันสุดท้าย',
      ],
    },
  ],
}

export const learn = {
  heading: 'สื่อการเรียนรู้',
  lead: 'ไม่เคยเขียนโค้ดมาก่อนก็เริ่มได้ เรารวบรวมสื่อเตรียมความพร้อมให้เริ่มต้นพัฒนาแอป iOS ด้วย Swift บน iPad ได้ตั้งแต่วันนี้',
  video: {
    // 20-hour course: build iOS apps on iPad with Swift Playgrounds.
    id: 'jdaO885330I',
    playlistId: 'PLtIctfLI7-d4-X7ZHaiu6NGEBjaFhaIj5',
    title: 'คอร์สพัฒนาแอป iOS บน iPad',
    description:
      'คอร์สวิดีโอกว่า 20 ชั่วโมง สอนพัฒนาแอป iOS ด้วย Swift บน iPad ตั้งแต่พื้นฐานจนสร้างแอปได้จริง เรียนตามไปทีละขั้นได้ด้วยตัวเอง',
  },
  tool: {
    icon: '/swift-playgrounds-icon.001.png',
    name: 'Swift Playgrounds',
    description:
      'แอปฟรีจาก Apple สำหรับสร้างแอป iOS ด้วยภาษา Swift ดาวน์โหลดเพื่อเริ่มลงมือทำตามคอร์สได้เลย',
    downloads: [
      {
        label: 'ดาวน์โหลดบน iPad',
        href: 'https://apps.apple.com/us/app/swift-playgrounds/id908519492',
      },
      {
        label: 'ดาวน์โหลดบน Mac',
        href: 'https://apps.apple.com/us/app/swift-playgrounds/id1496833156?mt=12',
      },
    ],
  },
}

export const eligibility = {
  heading: 'คุณสมบัติผู้สมัคร',
  body: 'เปิดรับสมัครผู้เข้าแข่งขันระดับมัธยมศึกษาตอนปลาย (ม.4 – ม.6) และอาชีวศึกษา (ปวช. 1 – 3) โดยรวมทีมสมาชิก 3 คนจากสถาบันเดียวกัน และต้องมีอาจารย์ที่ปรึกษาดูแลทีม 1 ท่าน',
}

export const timeline = {
  heading: 'กำหนดการ',
  // Set `current: true` on the milestone to highlight as the current event.
  milestones: [
    { date: '4 – 30 มิถุนายน', title: 'เปิดรับสมัครรอบภูมิภาค', current: true },
    { date: '4 กรกฎาคม', title: 'ปฐมนิเทศและสัมมนาออนไลน์เตรียมความพร้อม' },
    { date: '16 สิงหาคม', title: 'ปิดรับส่งผลงานรอบภูมิภาค' },
    { date: '31 สิงหาคม', title: 'ประกาศผลทีมที่ผ่านเข้ารอบระดับประเทศ' },
    { date: '16 – 18 ตุลาคม', title: 'การแข่งขันรอบระดับประเทศ ณ กรุงเทพมหานคร' },
  ],
}

export const organizers = {
  heading: 'ผู้จัดการแข่งขัน',
  body: 'ดำเนินโครงการโดย Swift Coding Club Thailand ร่วมกับวิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ ในฐานะสถานที่จัดงานและนิสิตผู้ช่วยสอน',
  judges:
    'คณะกรรมการตัดสินประกอบด้วยสมาชิกของ Swift Coding Club TH, Apple Certified Trainer, คณาจารย์จากสถาบันอุดมศึกษา และกรรมการรับเชิญ',
}

// Team Portal copy. Hackathon-detail and submission-essay text are placeholders
// until the organizers finalize them (marked with "(รอเนื้อหา)").
export const portal = {
  // Shared page chrome (top bar).
  shell: {
    brand: 'Team Portal',
    backToSite: 'กลับสู่หน้าหลัก',
    signOut: 'ออกจากระบบ',
  },

  // Sign-in screen (Phase 2 — Google sign-in).
  signIn: {
    heading: 'เข้าสู่ระบบทีม',
    body: 'เข้าสู่ระบบด้วยบัญชี Google ที่ใช้สมัครเข้าร่วมการแข่งขัน เพื่อจัดการข้อมูลทีมและส่งผลงาน',
    cta: 'เข้าสู่ระบบด้วย Google',
  },

  // Temporary preview landing (Phase 1 only — removed once auth is wired).
  preview: {
    heading: 'ตัวอย่างหน้าจอ (พรีวิว)',
    body: 'หน้านี้ใช้สำหรับดูตัวอย่างหน้าจอระหว่างพัฒนา โดยยังไม่ต้องเข้าสู่ระบบ',
    toRegister: 'ดูฟอร์มลงทะเบียนทีม',
    toTeam: 'ดูหน้าพอร์ทัลทีม',
  },

  // Registration form. A team = 1 leader + 2 members (3 students total).
  registration: {
    heading: 'ลงทะเบียนทีม',
    lead: 'กรอกข้อมูลทีมให้ครบถ้วนเพื่อเริ่มเข้าร่วมการแข่งขัน',
    selectPlaceholder: 'เลือก',
    // Choice options reused across selects/checkboxes/radios.
    options: {
      prefix: ['นาย', 'นางสาว'],
      level: ['ม.4', 'ม.5', 'ม.6', 'ปวช.1', 'ปวช.2', 'ปวช.3'],
      devices: ['iPad', 'Mac', 'iPhone', 'ไม่มี'],
      yesNo: ['เคย', 'ไม่เคย'],
      playgrounds: ['รู้จัก', 'ไม่รู้จัก'],
      referral: [
        'Swift Coding Club TH Facebook',
        'Swift Coding Club TH Instagram',
        'แพลตฟอร์ม NDLP',
        'อื่น ๆ',
      ],
      referralOther: 'อื่น ๆ',
    },
    team: {
      heading: 'ข้อมูลทีม',
      teamName: 'ชื่อทีม',
      schoolName: 'ชื่อสถานศึกษา',
      province: 'จังหวัดของสถานศึกษา',
      provinceHint: 'กรอกชื่อจังหวัดเต็ม ไม่ต้องย่อ',
    },
    // Per-person field labels (leader + members share these).
    person: {
      prefix: 'คำนำหน้า',
      nameTh: 'ชื่อ-นามสกุล (ภาษาไทย)',
      nameEn: 'ชื่อ-นามสกุล (ภาษาอังกฤษ)',
      level: 'ระดับชั้น',
      email: 'อีเมล',
      phone: 'เบอร์โทร',
      lineId: 'LINE ID',
      devices: 'อุปกรณ์ Apple ที่มี',
    },
    leaderHeading: 'ข้อมูลหัวหน้าทีม',
    memberHeading: 'สมาชิกคนที่', // followed by the member number
    advisorHeading: 'ข้อมูลอาจารย์ที่ปรึกษา',
    // PDPA consent (required to submit).
    pdpa: {
      heading: 'การเก็บรวบรวมและใช้ข้อมูลส่วนบุคคล',
      body: [
        'ในการสมัครเข้าร่วมกิจกรรม ข้าพเจ้ายินยอมให้ผู้จัดงานเก็บรวบรวมและใช้ข้อมูลส่วนบุคคลที่ให้ไว้ในแบบฟอร์มนี้ เพื่อวัตถุประสงค์ในการดำเนินการรับสมัคร การจัดการแข่งขัน และการติดต่อสื่อสารที่เกี่ยวข้องกับกิจกรรม Young iOS Developer Hackathon 2026 (YiDH 26)',
        'ในบางกรณี ผู้จัดงานอาจมีความจำเป็นต้องเปิดเผยหรือส่งต่อข้อมูลของท่านให้แก่หน่วยงานหรือพันธมิตรที่เกี่ยวข้องกับการจัดกิจกรรม (เช่น ผู้ร่วมจัดงาน คณะกรรมการตัดสิน หรือผู้สนับสนุน) เท่าที่จำเป็นเพื่อการดำเนินการรับสมัครและการแข่งขันเท่านั้น โดยจะไม่นำข้อมูลไปจำหน่าย หรือใช้เพื่อวัตถุประสงค์อื่นใดนอกเหนือจากกิจกรรมนี้)',
      ],
      consent: 'ข้าพเจ้าได้อ่านและยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตามเงื่อนไขข้างต้น',
    },
    // Team-overall survey (answered once per team).
    survey: {
      heading: 'ข้อมูลเพิ่มเติม',
      note: 'ให้ตอบในภาพรวมของทีม ไม่จำเป็นต้องมีทุกคนก็ได้',
      hasProgrammed: 'เคยเขียนโปรแกรมมาก่อนหรือไม่',
      programmingLanguages: 'หากเคย ให้ระบุภาษาที่เคยเขียน',
      heardOfSwift: 'เคยได้ยินภาษา Swift มาก่อนหรือไม่',
      knowsSwiftPlaygrounds: 'รู้จักและเคยลองใช้งานโปรแกรม Swift Playgrounds หรือไม่',
      referral: 'ได้ยินกิจกรรมนี้มาจากช่องทางใด',
      referralOtherLabel: 'โปรดระบุช่องทาง',
    },
    submit: 'บันทึกข้อมูลทีม',
    requiredNote: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
  },

  // Portal section 1 — team info (read-only, from Firestore).
  teamInfo: {
    heading: 'ข้อมูลทีม',
    teamNameLabel: 'ชื่อทีม',
    schoolLabel: 'สถานศึกษา',
    provinceLabel: 'จังหวัด',
    leaderHeading: 'หัวหน้าทีม',
    membersHeading: 'สมาชิก',
    advisorHeading: 'อาจารย์ที่ปรึกษา',
    levelLabel: 'ระดับชั้น',
  },

  // Portal section 2 — hackathon detail. Project brief (โจทย์) is still a
  // placeholder; the submission requirements below are final.
  detail: {
    heading: 'รายละเอียดโจทย์',
    body: ['(รอเนื้อหา — รายละเอียดโจทย์จะประกาศให้ทราบในภายหลัง)'],
    rulesHeading: 'ข้อกำหนดการส่งผลงาน',
    rules: [
      'พัฒนาแอปด้วย Swift Playgrounds 4.6 ขึ้นไป บน iPad หรือ MacBook',
      'แอปพลิเคชันต้องสามารถสาธิตได้ภายใน 3 นาที ใช้งานแบบออฟไลน์ และไม่เคยส่งเข้าแข่งขันหรือนำเสนอที่ใดมาก่อน',
      'ส่งผลงานเป็นไฟล์ .swiftpm บีบอัดเป็น ZIP (ไม่เกิน 25 MB) พร้อมเอกสารข้อเสนอ (Written Proposal) ตามรูปแบบที่ผู้จัดเตรียมไว้',
    ],
  },

  // Portal section 3 — submission form.
  submission: {
    heading: 'ส่งผลงาน',
    lead: 'ตอบคำถามข้อเสนอ (Written Proposal) และแนบไฟล์ผลงานของทีม เมื่อส่งแล้วจะไม่สามารถแก้ไขหรือส่งใหม่ได้',
    // Written Proposal questions (SSC-style). `id` keys map to Firestore.
    questions: [
      {
        id: 'inspiration',
        label:
          'เล่าเกี่ยวกับผลงานของทีม อะไรคือแรงบันดาลใจในการสร้าง และแอปต้องการแก้ปัญหาหรือมอบประสบการณ์แบบใดให้ผู้ใช้',
        placeholder: 'พิมพ์คำตอบของคุณที่นี่',
        maxLength: 1500,
      },
      {
        id: 'technical',
        label:
          'อธิบายแง่มุมทางเทคนิคของผลงาน แนวทางการพัฒนา ภาษา Swift รวมถึงเฟรมเวิร์กและฟีเจอร์ของ Apple ที่นำมาใช้ และความท้าทายที่พบพร้อมวิธีแก้',
        placeholder: 'พิมพ์คำตอบของคุณที่นี่',
        maxLength: 1500,
      },
      {
        id: 'toolsDisclosure',
        label:
          'ในการพัฒนาผลงาน ทีมได้ใช้เครื่องมือหรือแหล่งช่วยเหลือภายนอกใดบ้าง (เช่น ไลบรารี โค้ดสำเร็จรูป หรือผู้ช่วยพัฒนา) โปรดระบุและอธิบายการใช้งาน',
        placeholder: 'พิมพ์คำตอบของคุณที่นี่',
        maxLength: 800,
      },
    ],
    fileLabel: 'แนบไฟล์ผลงาน .swiftpm (บีบอัดเป็น ZIP ขนาดไม่เกิน 25 MB)',
    fileChoose: 'เลือกไฟล์',
    fileNone: 'ยังไม่ได้เลือกไฟล์',
    submit: 'ส่งผลงาน',
    submitting: 'กำลังส่ง...',
    confirm: {
      title: 'ยืนยันการส่งผลงาน',
      body: 'เมื่อส่งผลงานแล้วจะไม่สามารถแก้ไขหรือส่งใหม่ได้ ต้องการดำเนินการต่อหรือไม่?',
      confirm: 'ยืนยันส่งผลงาน',
      cancel: 'ยกเลิก',
    },
    locked: {
      notice: 'ทีมของคุณส่งผลงานเรียบร้อยแล้ว',
      submittedFileLabel: 'ไฟล์ที่ส่ง',
      answersHeading: 'คำตอบของคุณ',
    },
  },
} as const

export const footer = {
  org: 'Swift Coding Club Thailand',
  copyright: '© 2026 Swift Coding Club Thailand. All rights reserved.',
  links: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/swiftcodingclub',
      icon: '/Facebook_Logo_Secondary.png',
    },
    {
      label: 'อีเมล',
      href: 'mailto:staff@swiftcodingclubth.com',
      icon: '/envelope.fill.svg',
    },
  ],
}
