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
  { id: 'themes', label: 'หัวข้อ' },
  { id: 'timeline', label: 'กำหนดการ' },
]

export const hero = {
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
  lead: 'การแข่งขันพัฒนาแอปพลิเคชัน iOS ระดับประเทศ สำหรับนักเรียนมัธยมศึกษาตอนปลายและอาชีวศึกษา ที่อยากลงมือสร้างผลงานจริงด้วยภาษา Swift',
  points: [
    {
      icon: '/swift-logo.png',
      title: 'สร้างแอปจริงด้วย Swift',
      body: 'พัฒนา App Playground บน iPad ด้วย Swift Playgrounds เปลี่ยนความคิดสร้างสรรค์ให้กลายเป็นแอปที่ใช้งานได้จริง',
    },
    {
      icon: '🎓',
      title: 'เริ่มจากศูนย์ก็ทำได้',
      body: 'ผู้จัดเตรียมสื่อการเรียนรู้แบบวิดีโอและสัมมนาออนไลน์เตรียมความพร้อมก่อนเริ่มแข่ง ไม่ต้องมีประสบการณ์มาก่อน',
    },
    {
      icon: '🤝',
      title: 'ทำงานเป็นทีม',
      body: 'รวมทีมกับเพื่อนในสถานศึกษาเดียวกัน ฝึกการคิด วิเคราะห์ และนำเสนอผลงานต่อสาธารณชน',
    },
    {
      icon: '🌏',
      title: 'เชื่อมสู่เครือข่ายนักพัฒนา',
      body: 'ก้าวเข้าสู่ชุมชนนักพัฒนา iOS รุ่นใหม่ของประเทศไทย และต่อยอดสู่ Apple Developer Community',
    },
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
        'เลือกพัฒนาตามหัวข้อที่กำหนด 1 จาก 5 หัวข้อ',
      ],
    },
    {
      tag: 'รอบที่ 2',
      title: 'รอบชิงชนะเลิศระดับประเทศ',
      mode: 'วิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ กรุงเทพฯ',
      points: [
        'ทีมที่ผ่านเข้ารอบได้รับเครื่อง M-series iPad ทีมละ 1 เครื่อง (เครื่องยืมระหว่างกิจกรรม)',
        'พัฒนาแอปสด ๆ ภายใต้ “หัวข้อพิเศษ” ที่จะประกาศในวันงาน',
        'มี Coaching Clinic คอยให้คำปรึกษาตลอดการแข่งขัน',
        'นำเสนอผลงานต่อคณะกรรมการในวันสุดท้าย',
      ],
    },
  ],
  eligibility: {
    title: 'ใครสมัครได้บ้าง',
    items: [
      'นักเรียนระดับมัธยมศึกษาตอนปลาย (ม.4 – ม.6)',
      'นักศึกษาอาชีวศึกษา (ปวช. 1 – 3)',
      'รวมทีมขนาด 3 คน จากสถานศึกษาเดียวกัน',
      'มีอาจารย์ที่ปรึกษาประจำทีม 1 ท่าน',
    ],
  },
}

export const themes = {
  heading: 'หัวข้อการแข่งขัน',
  lead: 'เลือกหัวข้อที่จุดประกายคุณ แล้วออกแบบแอปที่ตอบโจทย์ปัญหาจริง',
  items: [
    {
      en: 'Personal Wellness Companion',
      th: 'สุขภาพดีเริ่มที่ตัวคุณ',
      desc: 'ส่งเสริมหรือติดตามสุขภาพกายและสุขภาพจิตในด้านใดด้านหนึ่ง',
      icon: '💚',
    },
    {
      en: 'Reinvent How We Learn',
      th: 'เรียนรู้ไม่มีเบื่อ',
      desc: 'ถ่ายทอดความรู้ในรูปแบบที่ตำราเรียนทำไม่ได้',
      icon: '📚',
    },
    {
      en: 'Connecting My Community',
      th: 'เชื่อมคนในชุมชน',
      desc: 'แก้ไขปัญหาในชุมชนท้องถิ่นของผู้เข้าแข่งขัน',
      icon: '🏘️',
    },
    {
      en: 'Thai Culture Reimagined',
      th: 'ของเก่าเล่าใหม่',
      desc: 'อนุรักษ์หรือนำเสนอวัฒนธรรมไทยผ่านเทคโนโลยีในมุมมองใหม่',
      icon: '🪷',
    },
    {
      en: 'Everyday Life, Made Smarter',
      th: 'ชีวิตง่ายขึ้น',
      desc: 'แก้ไขจุดติดขัดเล็ก ๆ ในชีวิตประจำวัน',
      icon: '✨',
    },
  ],
}

export const criteria = {
  heading: 'เกณฑ์การตัดสิน',
  round1: {
    title: 'รอบคัดเลือกระดับภูมิภาค',
    items: [
      { label: 'การพัฒนาทางเทคนิค', value: 30 },
      { label: 'ความคิดสร้างสรรค์', value: 30 },
      { label: 'การออกแบบและประสบการณ์ใช้งาน', value: 20 },
      { label: 'ความสอดคล้องกับหัวข้อ', value: 20 },
    ],
  },
  round2: {
    title: 'รอบชิงชนะเลิศระดับประเทศ',
    note: 'ตัดสินจากความคิดสร้างสรรค์เชิงนวัตกรรม การออกแบบและประสบการณ์ใช้งาน คุณภาพการพัฒนา และการนำเสนอผลงาน — รายละเอียดเพิ่มเติมจะประกาศพร้อมหัวข้อพิเศษของรอบระดับประเทศ',
    items: ['Innovation', 'Design / UX', 'Technical Implementation', 'Presentation'],
  },
}

export const timeline = {
  heading: 'กำหนดการ',
  milestones: [
    { date: '3 - 30 มิ.ย. 2569', title: 'เปิดรับสมัครรอบภูมิภาค' },
    { date: '4 ก.ค. 2569', title: 'ปฐมนิเทศและสัมมนาออนไลน์เตรียมความพร้อม' },
    { date: '16 ส.ค. 2569', title: 'ปิดรับส่งผลงานรอบภูมิภาค' },
    { date: '31 ส.ค. 2569', title: 'ประกาศผลทีมที่ผ่านเข้ารอบระดับประเทศ' },
    { date: '16 – 18 ต.ค. 2569', title: 'การแข่งขันรอบระดับประเทศ ณ กรุงเทพมหานคร' },
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
  body: 'รวมทีม เลือกหัวข้อ และลงมือสร้างแอปแรกของคุณ\nเปิดรับสมัคร 3 – 30 มิถุนายน 2569',
  button: 'สมัครเข้าร่วม',
}

export const footer = {
  org: 'Swift Coding Club Thailand',
  blurb: 'ชุมชนการเรียนรู้ภาษา Swift ของประเทศไทย',
  copyright: '© 2026 Swift Coding Club Thailand. All rights reserved.',
  links: [
    { label: 'Instagram', href: '#' },
    { label: 'Facebook', href: '#' },
    { label: 'อีเมล', href: '#' },
  ],
}
