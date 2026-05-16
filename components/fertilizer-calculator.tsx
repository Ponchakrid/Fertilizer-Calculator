'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '@/hooks/use-calculator'
import { StepProgress } from '@/components/step-progress'
import { Step1CropPicker } from '@/components/steps/step1-crop-picker'
import { Step2SoilInput } from '@/components/steps/step2-soil-input'
import { Step3AreaInput } from '@/components/steps/step3-area-input'
import { Step4Results } from '@/components/steps/step4-results'
import { BentoCard, BentoGrid } from '@/components/bento-grid'
import { Leaf } from 'lucide-react'

const steps = [
  { number: 1, label: 'เลือกพืช' },
  { number: 2, label: 'ข้อมูลดิน' },
  { number: 3, label: 'พื้นที่' },
  { number: 4, label: 'ผลลัพธ์' },
]



function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1CropPicker />
    case 2:
      return <Step2SoilInput />
    case 3:
      return <Step3AreaInput />
    case 4:
      return <Step4Results />
    default:
      return <Step1CropPicker />
  }
}

export function FertilizerCalculator() {
  const { step, cropId } = useCalculatorStore()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">คำนวณปุ๋ย NPK ออนไลน์ - ผสมปุ๋ยใช้เอง</h1>
              <p className="text-xs text-muted-foreground">ลดต้นทุน เพิ่มผลผลิต สำหรับเกษตรกรไทย</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {step === 1 && (
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-b from-primary/5 to-background py-8 md:py-12"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl font-bold text-foreground text-balance"
            >
              คำนวณปุ๋ยถูกต้อง ลดต้นทุน เพิ่มผลผลิต
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty"
            >
              เครื่องมือคำนวณสูตรปุ๋ย NPK ฟรี เลือกได้ 15 ชนิดพืช
              คำนวณปริมาณแม่ปุ๋ย ต้นทุน และตารางการใส่ปุ๋ย
            </motion.p>
          </div>
        </motion.section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Step Progress */}
          <aside className="lg:w-48 shrink-0">
            <div className="lg:sticky lg:top-24">
              <StepProgress currentStep={step} steps={steps} />
            </div>
          </aside>

          {/* Main Calculator Area */}
          <div className="flex-1 min-w-0 max-w-4xl mx-auto w-full">
            <BentoGrid className="md:grid-cols-1">
              {/* Calculator Form */}
              <BentoCard className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <StepContent step={step} />
                </AnimatePresence>
              </BentoCard>


            </BentoGrid>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h3 className="font-bold mb-2">ปุ๋ย NPK คืออะไร?</h3>
              <p className="text-xs">NPK คือ ธาตุอาหารหลักของพืช ได้แก่ ไนโตรเจน (N), ฟอสฟอรัส (P) และ โพแทสเซียม (K) ซึ่งมีความจำเป็นต่อการเจริญเติบโตในแต่ละระยะ</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">ทำไมต้องคำนวณปุ๋ย?</h3>
              <p className="text-xs">การคำนวณปุ๋ยช่วยให้พืชได้รับธาตุอาหารที่เหมาะสม ไม่มากหรือน้อยเกินไป ช่วยลดต้นทุนจากการใช้ปุ๋ยเกินความจำเป็น</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">แม่ปุ๋ยที่นิยมใช้</h3>
              <p className="text-xs">แม่ปุ๋ยหลักที่นิยมนำมาผสมเอง ได้แก่ ยูเรีย (46-0-0), แดป (18-46-0) และ ม็อป (0-0-60)</p>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground space-y-2 border-t pt-8">
            <p className="text-xs">
              ข้อจำกัดความรับผิดชอบ: ผลการคำนวณเป็นเพียงค่าแนะนำ
              ควรตรวจวิเคราะห์ดินก่อนใส่ปุ๋ยจริง
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
