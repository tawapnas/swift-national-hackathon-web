// Single source of truth for all Thai copy on the site.
// NOTE: Intentionally contains NO mention of AI / On-device AI / Apple
// Intelligence / Local LLM / Foundation Models — that is a reveal-later theme.

export const site = {
  title: 'Swift Coding Club Thailand National Hackathon 2026',
  shortTitle: 'National Hackathon 2026',
  org: 'Swift Coding Club Thailand',
  orgShort: 'SCCTH',
  tagline: 'การแข่งขันพัฒนาแอปพลิเคชัน iOS ระดับประเทศ ด้วยภาษา Swift',
}

export const nav = [
  { id: 'about', label: 'รู้จักการแข่งขัน' },
  { id: 'format', label: 'รูปแบบ' },
  { id: 'timeline', label: 'กำหนดการ' },
]

export const hero = {
  // Memoji shown above the title.
  memojis: ['/memojis.001.png', '/memojis.002.png', '/memojis.003.png'],
  heading: 'Swift Coding Club Thailand\nNational Hackathon 2026',
  subheading:
    'เวทีระดับประเทศที่เปิดโอกาสให้นักเรียนได้เปลี่ยนไอเดียให้กลายเป็นแอป iOS จริง ด้วยภาษา Swift',
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
  ],
}

export const about = {
  heading: 'รู้จักการแข่งขัน',
  body: [
    'การแข่งขันพัฒนาแอป iOS ระดับประเทศ สำหรับนักเรียนมัธยมปลายและอาชีวศึกษาที่อยากลงมือสร้างผลงานจริงด้วยภาษา Swift',
    'ผู้เข้าแข่งขันจะได้พัฒนา App Playground บน iPad ด้วย Swift Playgrounds เปลี่ยนไอเดียให้กลายเป็นแอปที่ใช้งานได้จริง',
    'ไม่จำเป็นต้องมีประสบการณ์มาก่อน เพราะมีสื่อการเรียนรู้และสัมมนาเตรียมความพร้อมให้ พร้อมฝึกทักษะการทำงานเป็นทีมและการนำเสนอผลงาน',
  ],
}

export const format = {
  heading: 'รูปแบบการแข่งขัน',
  lead: 'การแข่งขันแบ่งออกเป็น 2 รอบ — รอบคัดเลือกระดับภูมิภาคแบบออนไลน์ และรอบชิงชนะเลิศระดับประเทศแบบ Onsite ต่อเนื่อง 3 วัน',
  rounds: [
    {
      tag: 'รอบที่ 1',
      title: 'รอบคัดเลือกระดับภูมิภาค',
      mode: 'ออนไลน์ทั่วประเทศ',
      points: [
        'พัฒนา App Playground (.swiftpm) ด้วย Swift Playgrounds 4.6 ขึ้นไป บน iPad หรือ MacBook',
        'แอปต้องสาธิตได้ภายใน 3 นาที ใช้งานแบบออฟไลน์ และไม่เคยส่งประกวดที่ใดมาก่อน',
        'ส่งผลงานเป็นไฟล์ .swiftpm (ZIP ไม่เกิน 25 MB) พร้อมเอกสารข้อเสนอผลงาน',
      ],
    },
    {
      tag: 'รอบที่ 2',
      title: 'รอบชิงชนะเลิศระดับประเทศ',
      mode: 'วิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ กรุงเทพฯ',
      points: [
        'ทีมที่ผ่านเข้ารอบได้รับเครื่อง M-series iPad ทีมละ 1 เครื่อง (เครื่องยืมระหว่างกิจกรรม)',
        'มี Coaching Clinic คอยให้คำปรึกษาตลอดการแข่งขัน',
        'นำเสนอผลงานต่อคณะกรรมการในวันสุดท้าย',
      ],
    },
  ],
}

export const eligibility = {
  heading: 'คุณสมบัติผู้สมัคร',
  body: 'การแข่งขันเปิดรับนักเรียนระดับมัธยมศึกษาตอนปลาย (ม.4 – ม.6) และอาชีวศึกษา (ปวช. 1 – 3) โดยรวมทีมขนาด 3 คนจากสถานศึกษาเดียวกัน พร้อมอาจารย์ที่ปรึกษาประจำทีม 1 ท่าน',
}

export const timeline = {
  heading: 'กำหนดการ',
  // Set `current: true` on the milestone to highlight as the current event.
  milestones: [
    { date: '3 – 30 มิถุนายน', title: 'เปิดรับสมัครรอบภูมิภาค', current: true },
    { date: '4 กรกฎาคม', title: 'ปฐมนิเทศและสัมมนาออนไลน์เตรียมความพร้อม' },
    { date: '16 สิงหาคม', title: 'ปิดรับส่งผลงานรอบภูมิภาค' },
    { date: '31 สิงหาคม', title: 'ประกาศผลทีมที่ผ่านเข้ารอบระดับประเทศ' },
    { date: '16 – 18 ตุลาคม', title: 'การแข่งขันรอบระดับประเทศ ณ กรุงเทพมหานคร' },
  ],
}

export const organizers = {
  heading: 'ผู้จัดการแข่งขัน',
  body: 'ดำเนินโครงการโดย Swift Coding Club Thailand (SCCTH) ร่วมกับวิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ (COSCI SWU) ในฐานะสถานที่จัดงานและนิสิตผู้ช่วยสอน',
  judges:
    'คณะกรรมการตัดสินประกอบด้วยสมาชิกของ Swift Coding Club TH, Apple Certified Trainer, คณาจารย์จากสถาบันอุดมศึกษา และกรรมการรับเชิญ',
}

export const cta = {
  heading: 'พร้อมเริ่มต้นการเดินทางของคุณแล้วหรือยัง?',
  body: 'เปิดรับสมัคร 3 – 30 มิถุนายน 2569',
  button: 'สมัครเข้าร่วม',
}

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
