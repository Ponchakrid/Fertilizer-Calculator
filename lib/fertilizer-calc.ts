// Core Fertilizer Calculation Engine
// Algorithm: Linear optimization to calculate mother fertilizer amounts

import { getCropById, type CropData } from './crop-data'
import { motherFertilizers, type MotherFertilizer } from './mother-fertilizer'

export interface CalcInput {
  cropId: string
  area: number // พื้นที่ (ไร่)
  soilPH: number // pH ดิน
  soilN: number // ไนโตรเจนในดิน (kg/ไร่)
  soilP: number // ฟอสฟอรัสในดิน (kg/ไร่)
  soilK: number // โพแทสเซียมในดิน (kg/ไร่)
  budget?: number // งบประมาณ (บาท) — optional
}

export interface FertilizerRecommendation {
  fertilizer: MotherFertilizer
  amountPerRai: number // kg ต่อไร่
  totalAmount: number // kg ทั้งหมด
  bags: number // จำนวนกระสอบ
  totalCost: number // บาท
}

export interface CalcResult {
  crop: CropData
  input: CalcInput
  targetNPK: { n: number; p: number; k: number }
  soilNPK: { n: number; p: number; k: number }
  neededNPK: { n: number; p: number; k: number }
  recommendations: FertilizerRecommendation[]
  totalCost: number
  applicationSchedule: CropData['schedule']
  warnings: string[]
  tips: string[]
}

// Factor adjustments based on soil pH
function getPHAdjustmentFactor(ph: number, nutrient: 'n' | 'p' | 'k'): number {
  // pH affects nutrient availability
  if (nutrient === 'p') {
    // Phosphorus is most available at pH 6.0-7.0
    if (ph < 5.5) return 1.3 // Need more due to fixation
    if (ph > 7.5) return 1.2
    return 1.0
  }
  if (nutrient === 'n') {
    // Nitrogen availability
    if (ph < 5.5) return 1.1
    if (ph > 8.0) return 1.15 // Ammonia loss
    return 1.0
  }
  if (nutrient === 'k') {
    // Potassium relatively stable
    if (ph < 5.0) return 1.1
    return 1.0
  }
  return 1.0
}

// Select best mother fertilizers for the NPK needs
function selectFertilizers(
  neededN: number,
  neededP: number,
  neededK: number
): { fertilizer: MotherFertilizer; amountPerRai: number }[] {
  const result: { fertilizer: MotherFertilizer; amountPerRai: number }[] = []

  let remainingN = Math.max(0, neededN)
  let remainingP = Math.max(0, neededP)
  let remainingK = Math.max(0, neededK)

  // Strategy: Use DAP for P (also provides some N), then Urea for remaining N, then MOP for K

  // 1. Use DAP for Phosphorus (also provides N)
  if (remainingP > 0) {
    const dap = motherFertilizers.find(f => f.id === 'dap')!
    const dapAmount = remainingP / (dap.composition.p / 100)
    result.push({ fertilizer: dap, amountPerRai: Math.round(dapAmount * 10) / 10 })
    
    // DAP also provides N
    const nFromDAP = dapAmount * (dap.composition.n / 100)
    remainingN = Math.max(0, remainingN - nFromDAP)
    remainingP = 0
  }

  // 2. Use Urea for remaining Nitrogen
  if (remainingN > 0) {
    const urea = motherFertilizers.find(f => f.id === 'urea')!
    const ureaAmount = remainingN / (urea.composition.n / 100)
    result.push({ fertilizer: urea, amountPerRai: Math.round(ureaAmount * 10) / 10 })
    remainingN = 0
  }

  // 3. Use MOP for Potassium
  if (remainingK > 0) {
    const mop = motherFertilizers.find(f => f.id === 'mop')!
    const mopAmount = remainingK / (mop.composition.k / 100)
    result.push({ fertilizer: mop, amountPerRai: Math.round(mopAmount * 10) / 10 })
    remainingK = 0
  }

  return result
}

export function calculateFertilizer(input: CalcInput): CalcResult | null {
  const crop = getCropById(input.cropId)
  if (!crop) return null

  // Get pH adjustment factors
  const nFactor = getPHAdjustmentFactor(input.soilPH, 'n')
  const pFactor = getPHAdjustmentFactor(input.soilPH, 'p')
  const kFactor = getPHAdjustmentFactor(input.soilPH, 'k')

  // Target NPK (adjusted for pH)
  const targetNPK = {
    n: crop.npkRequirement.n * nFactor,
    p: crop.npkRequirement.p * pFactor,
    k: crop.npkRequirement.k * kFactor,
  }

  // Soil NPK (what's already available)
  const soilNPK = {
    n: input.soilN,
    p: input.soilP,
    k: input.soilK,
  }

  // Needed NPK = Target - Soil (minimum 0)
  const neededNPK = {
    n: Math.max(0, targetNPK.n - soilNPK.n),
    p: Math.max(0, targetNPK.p - soilNPK.p),
    k: Math.max(0, targetNPK.k - soilNPK.k),
  }

  // Select and calculate fertilizers
  const selectedFertilizers = selectFertilizers(neededNPK.n, neededNPK.p, neededNPK.k)

  // Calculate total amounts and costs
  const recommendations: FertilizerRecommendation[] = selectedFertilizers.map(({ fertilizer, amountPerRai }) => {
    const totalAmount = amountPerRai * input.area
    const bags = Math.ceil(totalAmount / fertilizer.bagSize)
    const totalCost = bags * fertilizer.bagSize * fertilizer.pricePerKg

    return {
      fertilizer,
      amountPerRai,
      totalAmount: Math.round(totalAmount * 10) / 10,
      bags,
      totalCost,
    }
  })

  const totalCost = recommendations.reduce((sum, r) => sum + r.totalCost, 0)

  // Generate warnings
  const warnings: string[] = [...crop.warnings]

  if (input.soilPH < crop.optimalPH.min) {
    warnings.unshift(`ดิน pH ${input.soilPH} ต่ำกว่าที่เหมาะสม (${crop.optimalPH.min}-${crop.optimalPH.max}) ควรใส่ปูนขาวปรับสภาพดิน`)
  } else if (input.soilPH > crop.optimalPH.max) {
    warnings.unshift(`ดิน pH ${input.soilPH} สูงกว่าที่เหมาะสม (${crop.optimalPH.min}-${crop.optimalPH.max}) ควรใส่กำมะถันหรือปุ๋ยอินทรีย์`)
  }

  if (input.budget && totalCost > input.budget) {
    warnings.push(`ต้นทุนปุ๋ย (${totalCost.toLocaleString()} บาท) เกินงบประมาณที่ตั้งไว้ (${input.budget.toLocaleString()} บาท)`)
  }

  return {
    crop,
    input,
    targetNPK: {
      n: Math.round(targetNPK.n * 10) / 10,
      p: Math.round(targetNPK.p * 10) / 10,
      k: Math.round(targetNPK.k * 10) / 10,
    },
    soilNPK,
    neededNPK: {
      n: Math.round(neededNPK.n * 10) / 10,
      p: Math.round(neededNPK.p * 10) / 10,
      k: Math.round(neededNPK.k * 10) / 10,
    },
    recommendations,
    totalCost,
    applicationSchedule: crop.schedule,
    warnings,
    tips: crop.tips,
  }
}

// Helper to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Helper to format weight
export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} ตัน`
  }
  return `${kg.toFixed(1)} กก.`
}
