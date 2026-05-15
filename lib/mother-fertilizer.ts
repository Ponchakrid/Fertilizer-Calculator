// ข้อมูลแม่ปุ๋ย (Mother Fertilizers)
// อ้างอิงจากกรมวิชาการเกษตร

export interface MotherFertilizer {
  id: string
  name: string
  nameEn: string
  formula: string // เช่น 46-0-0
  composition: {
    n: number // % N
    p: number // % P2O5
    k: number // % K2O
  }
  pricePerKg: number // บาท/กก.
  bagSize: number // กก./กระสอบ
  description: string
}

export const motherFertilizers: MotherFertilizer[] = [
  {
    id: 'urea',
    name: 'ยูเรีย',
    nameEn: 'Urea',
    formula: '46-0-0',
    composition: { n: 46, p: 0, k: 0 },
    pricePerKg: 22,
    bagSize: 50,
    description: 'แม่ปุ๋ยไนโตรเจน ละลายน้ำได้ดี ใช้บำรุงใบ',
  },
  {
    id: 'ammonium-sulfate',
    name: 'แอมโมเนียมซัลเฟต',
    nameEn: 'Ammonium Sulfate',
    formula: '21-0-0',
    composition: { n: 21, p: 0, k: 0 },
    pricePerKg: 15,
    bagSize: 50,
    description: 'แม่ปุ๋ยไนโตรเจน มีกำมะถัน เหมาะกับดินด่าง',
  },
  {
    id: 'dap',
    name: 'ไดแอมโมเนียมฟอสเฟต (DAP)',
    nameEn: 'Diammonium Phosphate',
    formula: '18-46-0',
    composition: { n: 18, p: 46, k: 0 },
    pricePerKg: 28,
    bagSize: 50,
    description: 'แม่ปุ๋ยฟอสฟอรัสสูง มีไนโตรเจน เหมาะรองพื้น',
  },
  {
    id: 'tsp',
    name: 'ทริปเปิลซูเปอร์ฟอสเฟต (TSP)',
    nameEn: 'Triple Superphosphate',
    formula: '0-46-0',
    composition: { n: 0, p: 46, k: 0 },
    pricePerKg: 25,
    bagSize: 50,
    description: 'แม่ปุ๋ยฟอสฟอรัสบริสุทธิ์ เหมาะดินขาดฟอสฟอรัส',
  },
  {
    id: 'mop',
    name: 'โพแทสเซียมคลอไรด์ (MOP)',
    nameEn: 'Muriate of Potash',
    formula: '0-0-60',
    composition: { n: 0, p: 0, k: 60 },
    pricePerKg: 20,
    bagSize: 50,
    description: 'แม่ปุ๋ยโพแทสเซียม บำรุงผล เพิ่มความหวาน',
  },
  {
    id: 'sop',
    name: 'โพแทสเซียมซัลเฟต (SOP)',
    nameEn: 'Sulfate of Potash',
    formula: '0-0-50',
    composition: { n: 0, p: 0, k: 50 },
    pricePerKg: 35,
    bagSize: 50,
    description: 'แม่ปุ๋ยโพแทสเซียมไม่มีคลอรีน เหมาะผลไม้คุณภาพ',
  },
]

export function getFertilizerById(id: string): MotherFertilizer | undefined {
  return motherFertilizers.find(f => f.id === id)
}

// คำนวณราคาต่อกระสอบ
export function getPricePerBag(fertilizer: MotherFertilizer): number {
  return fertilizer.pricePerKg * fertilizer.bagSize
}
