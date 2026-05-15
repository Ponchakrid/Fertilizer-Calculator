'use client'

import { motion } from 'framer-motion'
import { useCalculatorStore } from '@/hooks/use-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { ArrowLeft, ArrowRight, Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function Step2SoilInput() {
  const {
    soilPH,
    soilN,
    soilP,
    soilK,
    setSoilPH,
    setSoilN,
    setSoilP,
    setSoilK,
    nextStep,
    prevStep,
  } = useCalculatorStore()

  const getPHColor = (ph: number) => {
    if (ph < 5.5) return 'text-orange-600'
    if (ph > 7.5) return 'text-blue-600'
    return 'text-primary'
  }

  const getPHLabel = (ph: number) => {
    if (ph < 5.5) return 'เป็นกรด'
    if (ph > 7.5) return 'เป็นด่าง'
    if (ph >= 6.0 && ph <= 7.0) return 'เหมาะสม'
    return 'ปกติ'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">ข้อมูลดิน</h2>
        <p className="text-muted-foreground mt-1">
          ระบุค่าดินจากผลวิเคราะห์ (หากไม่มี ใช้ค่าเริ่มต้นได้)
        </p>
      </div>

      {/* pH Slider */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Label className="text-base font-semibold">ค่า pH ดิน</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>pH ดินที่เหมาะสมสำหรับพืชส่วนใหญ่อยู่ที่ 6.0-7.0</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-mono font-bold ${getPHColor(soilPH)}`}>
              {soilPH.toFixed(1)}
            </span>
            <span className={`ml-2 text-sm ${getPHColor(soilPH)}`}>
              ({getPHLabel(soilPH)})
            </span>
          </div>
        </div>

        <div className="pt-2">
          <Slider
            value={[soilPH]}
            onValueChange={([value]) => setSoilPH(value)}
            min={4.0}
            max={9.0}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>4.0 (กรดจัด)</span>
            <span>7.0 (กลาง)</span>
            <span>9.0 (ด่างจัด)</span>
          </div>
        </div>
      </Card>

      {/* NPK in Soil */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Label className="text-base font-semibold">ธาตุอาหารในดิน (กก./ไร่)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>ใส่ค่าจากผลวิเคราะห์ดิน หากไม่มีให้ใช้ค่า 0</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="soil-n" className="text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-chart-1 text-white text-xs flex items-center justify-center font-bold">
                N
              </span>
              ไนโตรเจน
            </Label>
            <Input
              id="soil-n"
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={soilN}
              onChange={(e) => setSoilN(parseFloat(e.target.value) || 0)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil-p" className="text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-chart-2 text-white text-xs flex items-center justify-center font-bold">
                P
              </span>
              ฟอสฟอรัส
            </Label>
            <Input
              id="soil-p"
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={soilP}
              onChange={(e) => setSoilP(parseFloat(e.target.value) || 0)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soil-k" className="text-sm flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-chart-3 text-white text-xs flex items-center justify-center font-bold">
                K
              </span>
              โพแทสเซียม
            </Label>
            <Input
              id="soil-k"
              type="number"
              min={0}
              max={50}
              step={0.5}
              value={soilK}
              onChange={(e) => setSoilK(parseFloat(e.target.value) || 0)}
              className="font-mono"
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          * หากไม่ทราบค่า ใช้ 0 ระบบจะคำนวณจากความต้องการของพืชเต็มจำนวน
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={prevStep}>
          <ArrowLeft className="mr-2 w-4 h-4" />
          ย้อนกลับ
        </Button>
        <Button onClick={nextStep} size="lg">
          ถัดไป
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
