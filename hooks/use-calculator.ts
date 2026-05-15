// Calculator State Store using Zustand
import { create } from 'zustand'
import { calculateFertilizer, type CalcInput, type CalcResult } from '@/lib/fertilizer-calc'

export type CalculatorStep = 1 | 2 | 3 | 4

interface CalculatorState {
  // Current step
  step: CalculatorStep
  
  // Form data
  cropId: string | null
  area: number
  soilPH: number
  soilN: number
  soilP: number
  soilK: number
  budget: number | null
  
  // Result
  result: CalcResult | null
  
  // Actions
  setStep: (step: CalculatorStep) => void
  nextStep: () => void
  prevStep: () => void
  setCropId: (cropId: string) => void
  setArea: (area: number) => void
  setSoilPH: (ph: number) => void
  setSoilN: (n: number) => void
  setSoilP: (p: number) => void
  setSoilK: (k: number) => void
  setBudget: (budget: number | null) => void
  calculate: () => void
  reset: () => void
}

const initialState = {
  step: 1 as CalculatorStep,
  cropId: null,
  area: 1,
  soilPH: 6.5,
  soilN: 0,
  soilP: 0,
  soilK: 0,
  budget: null,
  result: null,
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  
  nextStep: () => {
    const { step } = get()
    if (step < 4) {
      set({ step: (step + 1) as CalculatorStep })
    }
  },
  
  prevStep: () => {
    const { step } = get()
    if (step > 1) {
      set({ step: (step - 1) as CalculatorStep })
    }
  },
  
  setCropId: (cropId) => set({ cropId }),
  setArea: (area) => set({ area }),
  setSoilPH: (soilPH) => set({ soilPH }),
  setSoilN: (soilN) => set({ soilN }),
  setSoilP: (soilP) => set({ soilP }),
  setSoilK: (soilK) => set({ soilK }),
  setBudget: (budget) => set({ budget }),
  
  calculate: () => {
    const state = get()
    if (!state.cropId) return
    
    const input: CalcInput = {
      cropId: state.cropId,
      area: state.area,
      soilPH: state.soilPH,
      soilN: state.soilN,
      soilP: state.soilP,
      soilK: state.soilK,
      budget: state.budget ?? undefined,
    }
    
    const result = calculateFertilizer(input)
    set({ result, step: 4 })
  },
  
  reset: () => set(initialState),
}))
