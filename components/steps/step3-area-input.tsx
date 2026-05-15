'use client'

import { motion } from 'framer-motion'
import { useCalculatorStore } from '@/hooks/use-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Calculator, Info, Wallet } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { crops } from '@/lib/crop-data'

export function Step3AreaInput() {
  const {
    cropId,
    area,
    budget,
    setArea,
    setBudget,
    calculate,
    prevStep,
  } = useCalculatorStore()

  const selectedCrop = crops.find((c) => c.id === cropId)

  const handleCalculate = () => {
    calculate()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">พื้นที่และงบประมาณ</h2>
        <p className="text-muted-foreground mt-1">ระบุพื้นที่ปลูกและงบประมาณ (ถ้ามี)</p>
      </div>

      {/* Selected Crop Summary */}
      {selectedCrop && (
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedCrop.icon}</span>
            <div>
              <p className="font-semibold">{selectedCrop.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCrop.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Area Input */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold">พื้นที่ปลูก (ไร่)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>1 ไร่ = 1,600 ตารางเมตร</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={0.25}
            max={1000}
            step={0.25}
            value={area}
            onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
            className="font-mono text-xl h-14 max-w-[200px]"
          />
          <span className="text-lg text-muted-foreground">ไร่</span>
        </div>

        {/* Quick Select */}
        <div className="flex flex-wrap gap-2">
          {[1, 5, 10, 25, 50, 100].map((val) => (
            <Button
              key={val}
              variant={area === val ? 'default' : 'outline'}
              size="sm"
              onClick={() => setArea(val)}
            >
              {val} ไร่
            </Button>
          ))}
        </div>
      </Card>

      {/* Budget Input (Optional) */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-muted-foreground" />
          <Label className="text-base font-semibold">งบประมาณ (ไม่จำเป็น)</Label>
        </div>

        <div className="flex items-center gap-4">
          <Input
            type="number"
            min={0}
            step={100}
            value={budget ?? ''}
            onChange={(e) => {
              const val = e.target.value
              setBudget(val === '' ? null : parseFloat(val))
            }}
            placeholder="ระบุงบประมาณ"
            className="font-mono h-12 max-w-[200px]"
          />
          <span className="text-lg text-muted-foreground">บาท</span>
        </div>

        <p className="text-xs text-muted-foreground">
          * หากระบุงบประมาณ ระบบจะแจ้งเตือนหากต้นทุนปุ๋ยเกินงบที่ตั้งไว้
        </p>
      </Card>

      {/* Summary */}
      {selectedCrop && (
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-2">สรุปข้อมูล</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              พืช: <span className="text-foreground font-medium">{selectedCrop.name}</span>
            </li>
            <li>
              พื้นที่: <span className="text-foreground font-medium">{area} ไร่</span>
            </li>
            {budget && (
              <li>
                งบประมาณ:{' '}
                <span className="text-foreground font-medium">
                  {budget.toLocaleString()} บาท
                </span>
              </li>
            )}
          </ul>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          ย้อนกลับ
        </Button>
        <Button onClick={handleCalculate} size="lg" className="bg-primary hover:bg-primary/90">
          <Calculator className="mr-2 w-4 h-4" />
          คำนวณปุ๋ย
        </Button>
      </div>
    </motion.div>
  )
}
