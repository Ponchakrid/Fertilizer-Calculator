'use client'

import { motion } from 'framer-motion'
import { useCalculatorStore } from '@/hooks/use-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatWeight } from '@/lib/fertilizer-calc'
import { NPKBarChart, CostBreakdown } from '@/components/charts/npk-bar-chart'
import {
  AlertTriangle,
  Calendar,
  Lightbulb,
  Package,
  Printer,
  RefreshCcw,
  Share2,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1000
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <span className="font-mono">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}

export function Step4Results() {
  const { result, reset } = useCalculatorStore()

  if (!result) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">ไม่มีผลลัพธ์</p>
        <Button onClick={reset} className="mt-4">
          เริ่มใหม่
        </Button>
      </div>
    )
  }

  const costData = result.recommendations.map((rec) => ({
    name: rec.fertilizer.name,
    value: rec.totalCost,
    fill: '',
  }))

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const text = `ผลคำนวณปุ๋ย ${result.crop.name}
พื้นที่: ${result.input.area} ไร่
ต้นทุนรวม: ${formatCurrency(result.totalCost)}

แม่ปุ๋ยที่ต้องใช้:
${result.recommendations.map((r) => `- ${r.fertilizer.name} (${r.fertilizer.formula}): ${formatWeight(r.totalAmount)} (${r.bags} กระสอบ)`).join('\n')}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ผลคำนวณปุ๋ย',
          text,
        })
      } catch (err) {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(text)
      alert('คัดลอกผลลัพธ์แล้ว')
    }
  }

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
          }
        }
      `}</style>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 print:hidden"
      >
        {/* Header */}
        <motion.div variants={item}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{result.crop.icon}</span>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                ผลคำนวณปุ๋ย{result.crop.name}
              </h2>
              <p className="text-muted-foreground">
                พื้นที่ {result.input.area} ไร่
              </p>
            </div>
          </div>
        </motion.div>

        {/* Total Cost Banner */}
        <motion.div variants={item}>
          <Card className="p-6 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">ต้นทุนปุ๋ยโดยประมาณ</p>
                  <p className="text-3xl font-bold">
                    <AnimatedNumber value={result.totalCost} suffix=" บาท" />
                  </p>
                </div>
              </div>
              <div className="text-right text-sm opacity-90">
                <p>{formatCurrency(result.totalCost / result.input.area)} / ไร่</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Fertilizer Recommendations */}
        <motion.div variants={item}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Package className="w-5 h-5" />
            แม่ปุ๋ยที่ต้องใช้
          </h3>
          <div className="grid gap-3">
            {result.recommendations.map((rec, index) => (
              <motion.div
                key={rec.fertilizer.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{rec.fertilizer.name}</h4>
                        <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {rec.fertilizer.formula}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.fertilizer.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-lg">
                        {rec.bags} กระสอบ
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatWeight(rec.totalAmount)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {formatCurrency(rec.totalCost)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                    {rec.amountPerRai} กก./ไร่ × {result.input.area} ไร่ ={' '}
                    {formatWeight(rec.totalAmount)} | กระสอบละ {rec.fertilizer.bagSize} กก.
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* NPK Chart */}
        <motion.div variants={item}>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">สัดส่วน NPK (กก./ไร่)</h3>
            <NPKBarChart
              target={result.targetNPK}
              soil={result.soilNPK}
              needed={result.neededNPK}
            />
          </Card>
        </motion.div>

        {/* Cost Breakdown */}
        <motion.div variants={item}>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">สัดส่วนต้นทุน</h3>
            <CostBreakdown data={costData} />
          </Card>
        </motion.div>

        {/* Application Schedule */}
        <motion.div variants={item}>
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              ตารางการใส่ปุ๋ย
            </h3>
            <div className="space-y-3">
              {result.applicationSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{schedule.stage}</p>
                    <p className="text-sm text-muted-foreground">{schedule.timing}</p>
                    <p className="text-xs mt-1">
                      สูตร: <span className="font-mono">{schedule.ratio}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <motion.div variants={item}>
            <Card className="p-4 border-orange-200 bg-orange-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-orange-700">
                <AlertTriangle className="w-5 h-5" />
                คำเตือน
              </h3>
              <ul className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-orange-800 flex items-start gap-2">
                    <span className="text-orange-500">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Tips */}
        {result.tips.length > 0 && (
          <motion.div variants={item}>
            <Card className="p-4 border-sky-200 bg-sky-50">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-sky-700">
                <Lightbulb className="w-5 h-5" />
                เคล็ดลับ
              </h3>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-sky-800 flex items-start gap-2">
                    <span className="text-sky-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div variants={item} className="flex flex-wrap gap-3 pt-4">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 w-4 h-4" />
            พิมพ์
          </Button>
          <Button onClick={handleShare} variant="outline">
            <Share2 className="mr-2 w-4 h-4" />
            แชร์
          </Button>
          <Button onClick={reset} className="ml-auto">
            <RefreshCcw className="mr-2 w-4 h-4" />
            คำนวณใหม่
          </Button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div variants={item}>
          <p className="text-xs text-muted-foreground text-center mt-6">
            * ผลการคำนวณเป็นเพียงค่าแนะนำ ควรตรวจวิเคราะห์ดินจากกรมพัฒนาที่ดินก่อนใส่ปุ๋ยจริง
          </p>
        </motion.div>
      </motion.div>

      {/* Simplified Print View */}
      <div className="hidden print:block bg-white text-black text-sm print-container">
        <div className="text-center border-b-2 border-black pb-1 mb-3">
          <h1 className="text-xl font-bold">รายงานสรุปการคำนวณปุ๋ย NPK</h1>
          <p className="text-[10px]">เกษตรกรไทยยุคใหม่ ลดต้นทุน เพิ่มผลผลิต</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-base mb-4">
          <div>
            <p><strong>ชนิดพืช:</strong> {result.crop.name}</p>
            <p><strong>พื้นที่ปลูก:</strong> {result.input.area} ไร่</p>
          </div>
          <div className="text-right font-bold">
            <p>ต้นทุนรวม: {formatCurrency(result.totalCost)}</p>
            <p>เฉลี่ย: {formatCurrency(result.totalCost / result.input.area)} / ไร่</p>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold bg-gray-100 p-1 px-2 border border-black">1. แม่ปุ๋ยที่ต้องใช้</h2>
          <table className="w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-100 text-xs">
                <th className="border border-black p-1">ลำดับ</th>
                <th className="border border-black p-1 text-left">รายการแม่ปุ๋ย</th>
                <th className="border border-black p-1">สูตร</th>
                <th className="border border-black p-1 text-right">จำนวน (กก.)</th>
                <th className="border border-black p-1 text-right">กระสอบ</th>
                <th className="border border-black p-1 text-right">ราคา (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {result.recommendations.map((rec, i) => (
                <tr key={i} className="text-xs">
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1">{rec.fertilizer.name}</td>
                  <td className="border border-black p-1 text-center font-mono">{rec.fertilizer.formula}</td>
                  <td className="border border-black p-1 text-right">{rec.totalAmount.toFixed(1)}</td>
                  <td className="border border-black p-1 text-right font-bold">{rec.bags}</td>
                  <td className="border border-black p-1 text-right">{formatCurrency(rec.totalCost)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-50 text-xs">
                <td colSpan={5} className="border border-black p-1 text-right">รวมงบประมาณค่าปุ๋ยทั้งสิ้น</td>
                <td className="border border-black p-1 text-right underline decoration-double">{formatCurrency(result.totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2 pt-2">
          <h2 className="text-lg font-bold bg-gray-100 p-1 px-2 border border-black">2. ตารางและจังหวะการใส่ปุ๋ย</h2>
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 w-12 text-center">ครั้งที่</th>
                <th className="border border-black p-1 text-left">ช่วงการเจริญเติบโต</th>
                <th className="border border-black p-1 text-left">ระยะเวลาที่แนะนำ</th>
                <th className="border border-black p-1 text-center">สูตรปุ๋ยแนะนำ</th>
              </tr>
            </thead>
            <tbody>
              {result.applicationSchedule.map((s, i) => (
                <tr key={i}>
                  <td className="border border-black p-1 text-center">{i + 1}</td>
                  <td className="border border-black p-1 font-bold">{s.stage}</td>
                  <td className="border border-black p-1">{s.timing}</td>
                  <td className="border border-black p-1 text-center font-mono">{s.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 text-[10px] text-gray-500 italic flex justify-between border-t border-dashed mt-auto">
          <p>* รายงานฉบับนี้สร้างขึ้นโดยระบบคำนวณปุ๋ย NPK อัตโนมัติ</p>
          <p>พิมพ์เมื่อ: {new Date().toLocaleDateString('th-TH')}</p>
        </div>
      </div>
    </>
  )
}
