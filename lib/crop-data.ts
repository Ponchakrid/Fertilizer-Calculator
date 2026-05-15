// ฐานข้อมูลพืช 15 ชนิด (อ้างอิงจาก PSU + LDD)
// แต่ละพืชมีข้อมูล: สูตรปุ๋ยที่แนะนำต่อไร่, ช่วงการใส่ปุ๋ย, ข้อควรระวัง

export interface CropData {
  id: string
  name: string
  nameEn: string
  category: 'grain' | 'vegetable' | 'fruit' | 'economic' | 'field'
  icon: string
  description: string
  // NPK requirement per rai (kg/rai)
  npkRequirement: {
    n: number // Nitrogen
    p: number // Phosphorus (P2O5)
    k: number // Potassium (K2O)
  }
  // Optimal soil conditions
  optimalPH: {
    min: number
    max: number
  }
  // Application schedule
  schedule: {
    stage: string
    timing: string
    ratio: string // N-P-K ratio for this stage
  }[]
  // Warnings and notes
  warnings: string[]
  tips: string[]
}

export const cropCategories = {
  grain: { name: 'ธัญพืช', icon: '🌾' },
  vegetable: { name: 'ผัก', icon: '🥬' },
  fruit: { name: 'ผลไม้', icon: '🍎' },
  economic: { name: 'ไม้เศรษฐกิจ', icon: '🌳' },
  field: { name: 'พืชไร่', icon: '🌱' },
} as const

export const crops: CropData[] = [
  // ธัญพืช
  {
    id: 'rice',
    name: 'ข้าว',
    nameEn: 'Rice',
    category: 'grain',
    icon: '🌾',
    description: 'ข้าวนาปี/นาปรัง พันธุ์ทั่วไป',
    npkRequirement: { n: 12, p: 6, k: 6 },
    optimalPH: { min: 5.5, max: 7.0 },
    schedule: [
      { stage: 'รองพื้น', timing: 'ก่อนปลูก 7 วัน', ratio: '16-20-0' },
      { stage: 'แตกกอ', timing: '20-25 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ตั้งท้อง', timing: '45-50 วันหลังปลูก', ratio: '0-0-60' },
    ],
    warnings: ['ห้ามใส่ไนโตรเจนมากเกินช่วงออกรวง จะทำให้ต้นล้ม'],
    tips: ['ใส่ปุ๋ยตอนดินชื้น น้ำไม่ขัง', 'แบ่งใส่หลายครั้งดีกว่าใส่ทีเดียว'],
  },
  {
    id: 'corn',
    name: 'ข้าวโพด',
    nameEn: 'Corn',
    category: 'grain',
    icon: '🌽',
    description: 'ข้าวโพดเลี้ยงสัตว์/หวาน',
    npkRequirement: { n: 20, p: 10, k: 10 },
    optimalPH: { min: 5.8, max: 7.0 },
    schedule: [
      { stage: 'รองพื้น', timing: 'พร้อมปลูก', ratio: '15-15-15' },
      { stage: 'แตกใบ 4-5 ใบ', timing: '15-20 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ก่อนออกดอก', timing: '35-40 วันหลังปลูก', ratio: '46-0-0' },
    ],
    warnings: ['ขาดไนโตรเจนใบจะเหลืองจากปลายใบ'],
    tips: ['ใส่ปุ๋ยไนโตรเจนแล้วกลบดินเพื่อลดการสูญเสีย'],
  },
  // ผัก
  {
    id: 'tomato',
    name: 'มะเขือเทศ',
    nameEn: 'Tomato',
    category: 'vegetable',
    icon: '🍅',
    description: 'มะเขือเทศสีแดง/เชอรี่',
    npkRequirement: { n: 15, p: 12, k: 18 },
    optimalPH: { min: 6.0, max: 6.8 },
    schedule: [
      { stage: 'รองพื้น', timing: 'ก่อนปลูก 7 วัน', ratio: '15-15-15' },
      { stage: 'เจริญเติบโต', timing: '15 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ติดผล', timing: '30 วันหลังปลูก', ratio: '13-13-21' },
      { stage: 'ขยายผล', timing: '45 วันหลังปลูก', ratio: '0-0-60' },
    ],
    warnings: ['ขาดแคลเซียมจะเกิดก้นเน่า', 'ไม่ควรใส่ไนโตรเจนมากช่วงติดผล'],
    tips: ['รดน้ำสม่ำเสมอ หลีกเลี่ยงน้ำขัง'],
  },
  {
    id: 'chili',
    name: 'พริก',
    nameEn: 'Chili',
    category: 'vegetable',
    icon: '🌶️',
    description: 'พริกขี้หนู/พริกชี้ฟ้า',
    npkRequirement: { n: 18, p: 10, k: 15 },
    optimalPH: { min: 5.5, max: 6.8 },
    schedule: [
      { stage: 'รองพื้น', timing: 'ก่อนปลูก', ratio: '15-15-15' },
      { stage: 'เจริญเติบโต', timing: '20 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ออกดอก', timing: '40 วันหลังปลูก', ratio: '12-24-12' },
      { stage: 'ติดผล', timing: '60 วันหลังปลูก', ratio: '13-13-21' },
    ],
    warnings: ['ดินเปียกแฉะทำให้รากเน่า'],
    tips: ['คลุมโคนต้นเพื่อรักษาความชื้น', 'เก็บผลสุกเพื่อกระตุ้นการออกดอกใหม่'],
  },
  {
    id: 'cabbage',
    name: 'กะหล่ำปลี',
    nameEn: 'Cabbage',
    category: 'vegetable',
    icon: '🥬',
    description: 'กะหล่ำปลีเขียว/ม่วง',
    npkRequirement: { n: 20, p: 8, k: 16 },
    optimalPH: { min: 6.0, max: 7.0 },
    schedule: [
      { stage: 'รองพื้น', timing: 'ก่อนปลูก', ratio: '15-15-15' },
      { stage: 'หลังย้ายกล้า', timing: '7-10 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ห่อหัว', timing: '30 วันหลังปลูก', ratio: '46-0-0' },
    ],
    warnings: ['ขาดโบรอนทำให้ก้านกลวง'],
    tips: ['ปลูกในฤดูหนาวจะได้ผลดี'],
  },
  {
    id: 'cucumber',
    name: 'แตงกวา',
    nameEn: 'Cucumber',
    category: 'vegetable',
    icon: '🥒',
    description: 'แตงกวา/แตงร้าน',
    npkRequirement: { n: 16, p: 10, k: 20 },
    optimalPH: { min: 5.5, max: 6.8 },
    schedule: [
      { stage: 'รองพื้น', timing: 'ก่อนปลูก', ratio: '15-15-15' },
      { stage: 'เลื้อย', timing: '15 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ออกดอก', timing: '25 วันหลังปลูก', ratio: '13-13-21' },
      { stage: 'ติดผล', timing: '35 วันหลังปลูก', ratio: '0-0-60' },
    ],
    warnings: ['น้ำขังทำให้รากเน่า'],
    tips: ['เก็บผลทุกวันเพื่อกระตุ้นการออกผลใหม่'],
  },
  // ผลไม้
  {
    id: 'mango',
    name: 'มะม่วง',
    nameEn: 'Mango',
    category: 'fruit',
    icon: '🥭',
    description: 'มะม่วงน้ำดอกไม้/เขียวเสวย',
    npkRequirement: { n: 8, p: 4, k: 12 },
    optimalPH: { min: 5.5, max: 7.0 },
    schedule: [
      { stage: 'หลังเก็บเกี่ยว', timing: 'หลังเก็บผล 1 เดือน', ratio: '15-15-15' },
      { stage: 'ก่อนออกดอก', timing: '2 เดือนก่อนออกดอก', ratio: '8-24-24' },
      { stage: 'ติดผล', timing: 'หลังติดผล 1 เดือน', ratio: '13-13-21' },
    ],
    warnings: ['ไนโตรเจนมากจะแตกใบแทนออกดอก'],
    tips: ['งดน้ำก่อนออกดอก 2-3 สัปดาห์'],
  },
  {
    id: 'durian',
    name: 'ทุเรียน',
    nameEn: 'Durian',
    category: 'fruit',
    icon: '🍈',
    description: 'ทุเรียนหมอนทอง/ชะนี',
    npkRequirement: { n: 12, p: 8, k: 24 },
    optimalPH: { min: 5.5, max: 6.5 },
    schedule: [
      { stage: 'หลังเก็บเกี่ยว', timing: 'หลังเก็บผล', ratio: '15-15-15' },
      { stage: 'ก่อนออกดอก', timing: '1-2 เดือนก่อนออกดอก', ratio: '8-24-24' },
      { stage: 'พัฒนาผล', timing: 'ผลอายุ 6 สัปดาห์', ratio: '13-13-21' },
      { stage: 'บำรุงผล', timing: 'ผลอายุ 10 สัปดาห์', ratio: '0-0-50' },
    ],
    warnings: ['ระวังน้ำขัง ทุเรียนไม่ทนน้ำท่วม', 'โพแทสเซียมต่ำทำให้เนื้อไม่หวาน'],
    tips: ['ใส่ปูนขาวปรับ pH หากดินเป็นกรด'],
  },
  {
    id: 'banana',
    name: 'กล้วย',
    nameEn: 'Banana',
    category: 'fruit',
    icon: '🍌',
    description: 'กล้วยน้ำว้า/หอม',
    npkRequirement: { n: 10, p: 4, k: 16 },
    optimalPH: { min: 5.5, max: 7.0 },
    schedule: [
      { stage: 'ปลูกใหม่', timing: 'หลังปลูก 1 เดือน', ratio: '15-15-15' },
      { stage: 'เจริญเติบโต', timing: 'ทุก 2 เดือน', ratio: '46-0-0' },
      { stage: 'ออกปลี', timing: 'เมื่อออกปลี', ratio: '0-0-60' },
    ],
    warnings: ['น้ำท่วมขังทำให้ต้นเหี่ยว'],
    tips: ['ตัดใบแก่ออกเพื่อให้โปร่ง ลดโรค'],
  },
  {
    id: 'lime',
    name: 'มะนาว',
    nameEn: 'Lime',
    category: 'fruit',
    icon: '🍋',
    description: 'มะนาวแป้น/พันธุ์ตาฮิติ',
    npkRequirement: { n: 8, p: 4, k: 10 },
    optimalPH: { min: 5.5, max: 6.5 },
    schedule: [
      { stage: 'หลังเก็บเกี่ยว', timing: 'หลังเก็บผล', ratio: '15-15-15' },
      { stage: 'บำรุงต้น', timing: 'ทุก 2-3 เดือน', ratio: '46-0-0' },
      { stage: 'ก่อนออกดอก', timing: 'ก่อนออกดอก 1 เดือน', ratio: '8-24-24' },
    ],
    warnings: ['ดินด่างทำให้ใบเหลือง ขาดธาตุเหล็ก'],
    tips: ['พรางแดดช่วยให้ติดผลดีในหน้าร้อน'],
  },
  // ไม้เศรษฐกิจ
  {
    id: 'rubber',
    name: 'ยางพารา',
    nameEn: 'Rubber',
    category: 'economic',
    icon: '🌲',
    description: 'ยางพาราสายพันธุ์ RRIM',
    npkRequirement: { n: 10, p: 6, k: 8 },
    optimalPH: { min: 4.5, max: 6.0 },
    schedule: [
      { stage: 'ปีที่ 1-3', timing: 'ปีละ 2 ครั้ง', ratio: '20-10-12' },
      { stage: 'เปิดกรีด', timing: 'ต้นฤดูฝน', ratio: '30-5-18' },
      { stage: 'ระหว่างกรีด', timing: 'ทุก 4 เดือน', ratio: '30-5-18' },
    ],
    warnings: ['ขาดแมกนีเซียมใบจะเหลืองระหว่างเส้นใบ'],
    tips: ['ใส่ปุ๋ยรอบทรงพุ่ม ห่างโคน 1 เมตร'],
  },
  {
    id: 'palm',
    name: 'ปาล์มน้ำมัน',
    nameEn: 'Oil Palm',
    category: 'economic',
    icon: '🌴',
    description: 'ปาล์มน้ำมันสายพันธุ์ดี',
    npkRequirement: { n: 8, p: 4, k: 16 },
    optimalPH: { min: 4.0, max: 6.0 },
    schedule: [
      { stage: 'ปีที่ 1-3', timing: 'ปีละ 2-3 ครั้ง', ratio: '15-15-15' },
      { stage: 'ให้ผลผลิต', timing: 'ต้นฤดูฝน', ratio: '14-7-21' },
      { stage: 'บำรุงทะลาย', timing: 'ทุก 4 เดือน', ratio: '0-0-60' },
    ],
    warnings: ['ขาดโบรอนทำให้ใบหงิก', 'ขาดโพแทสเซียมผลผลิตลด'],
    tips: ['ใส่ทะลายเปล่าคลุมโคนเป็นปุ๋ยอินทรีย์'],
  },
  {
    id: 'cassava',
    name: 'มันสำปะหลัง',
    nameEn: 'Cassava',
    category: 'economic',
    icon: '🥔',
    description: 'มันสำปะหลังพันธุ์ระยอง',
    npkRequirement: { n: 10, p: 5, k: 15 },
    optimalPH: { min: 5.5, max: 7.0 },
    schedule: [
      { stage: 'ปลูก', timing: 'พร้อมปลูกหรือหลังปลูก 1 เดือน', ratio: '15-15-15' },
      { stage: 'เจริญเติบโต', timing: '3 เดือนหลังปลูก', ratio: '46-0-0' },
    ],
    warnings: ['ไนโตรเจนมากต้นโตแต่หัวเล็ก'],
    tips: ['ปลูกต้นฤดูฝน เก็บเกี่ยวหน้าแล้ง'],
  },
  // พืชไร่
  {
    id: 'sugarcane',
    name: 'อ้อย',
    nameEn: 'Sugarcane',
    category: 'field',
    icon: '🎋',
    description: 'อ้อยโรงงาน',
    npkRequirement: { n: 15, p: 6, k: 12 },
    optimalPH: { min: 5.5, max: 7.5 },
    schedule: [
      { stage: 'รองพื้น', timing: 'พร้อมปลูก', ratio: '16-16-8' },
      { stage: 'แตกกอ', timing: '45-60 วันหลังปลูก', ratio: '46-0-0' },
      { stage: 'ย่างปล้อง', timing: '90-120 วันหลังปลูก', ratio: '0-0-60' },
    ],
    warnings: ['ไนโตรเจนมากเกินทำให้ค่า CCS ต่ำ'],
    tips: ['ใส่ปุ๋ยแล้วกลบดินทันที'],
  },
  {
    id: 'soybean',
    name: 'ถั่วเหลือง',
    nameEn: 'Soybean',
    category: 'field',
    icon: '🫘',
    description: 'ถั่วเหลืองฝักสด/แห้ง',
    npkRequirement: { n: 3, p: 8, k: 8 },
    optimalPH: { min: 6.0, max: 7.0 },
    schedule: [
      { stage: 'รองพื้น', timing: 'พร้อมปลูก', ratio: '12-24-12' },
      { stage: 'ออกดอก', timing: '30 วันหลังปลูก', ratio: '0-0-60' },
    ],
    warnings: ['ไนโตรเจนมากยับยั้งการตรึงไนโตรเจน'],
    tips: ['คลุกเมล็ดกับไรโซเบียมก่อนปลูก'],
  },
]

export function getCropById(id: string): CropData | undefined {
  return crops.find(crop => crop.id === id)
}

export function getCropsByCategory(category: CropData['category']): CropData[] {
  return crops.filter(crop => crop.category === category)
}
