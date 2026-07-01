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
    { date: '4 มิถุนายน', title: 'เปิดรับสมัครรอบภูมิภาค', current: true },
    { date: '11 กรกฎาคม', title: 'ปฐมนิเทศและสัมมนาออนไลน์เตรียมความพร้อม' },
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
  // Organizer + venue-partner logos (white/light lockups for the dark theme).
  logos: [
    {
      src: '/logo.svg',
      name: 'Swift Coding Club Thailand',
      className: 'h-10 w-auto md:h-12',
    },
    {
      src: '/SWU_College_Social_Communication_Innovation_TH_White.png',
      name: 'วิทยาลัยนวัตกรรมสื่อสารสังคม มหาวิทยาลัยศรีนครินทรวิโรฒ',
      className: 'h-16 w-auto md:h-20',
    },
  ],
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

// Teams registered for the regional qualifying round, grouped by Thai region.
// `items` order is render/legend order; the component derives the total and the
// max for choropleth intensity, so just keep the counts up to date here.
export const regions = {
  heading: 'ทีมที่ลงทะเบียนแล้วทั่วประเทศ',
  lead: 'ภาพรวมจำนวนทีมที่สมัครเข้าร่วมการแข่งขันในแต่ละภูมิภาค',
  totalLabel: 'ทีมจากทั่วประเทศ',
  reach: '159 สถานศึกษา จาก 63 จังหวัด',
  updatedAt: 'ข้อมูล ณ วันที่ 30 มิถุนายน 2569',
  unit: 'ทีม',
  items: [
    { id: 'north', name: 'ภาคเหนือ', teams: 19 },
    { id: 'isan', name: 'ภาคอีสาน', teams: 29 },
    { id: 'central', name: 'ภาคกลาง', teams: 93 },
    { id: 'east', name: 'ภาคตะวันออก', teams: 45 },
    { id: 'south', name: 'ภาคใต้', teams: 19 },
  ],
}
