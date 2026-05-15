'use client'

import { motion } from 'framer-motion'
import { crops, cropCategories, type CropData } from '@/lib/crop-data'
import { useCalculatorStore } from '@/hooks/use-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Search } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Step1CropPicker() {
  const { cropId, setCropId, nextStep } = useCalculatorStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredCrops = useMemo(() => {
    return crops.filter((crop) => {
      const matchesSearch =
        search === '' ||
        crop.name.toLowerCase().includes(search.toLowerCase()) ||
        crop.nameEn.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || crop.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const handleCropSelect = (crop: CropData) => {
    setCropId(crop.id)
  }

  const canProceed = cropId !== null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-foreground">เลือกชนิดพืช</h2>
        <p className="text-muted-foreground mt-1">เลือกพืชที่ต้องการคำนวณปุ๋ย</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="ค้นหาพืช..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(null)}
        >
          ทั้งหมด
        </Button>
        {Object.entries(cropCategories).map(([key, { name, icon }]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            <span className="mr-1">{icon}</span>
            {name}
          </Button>
        ))}
      </div>

      {/* Crop Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3"
      >
        {filteredCrops.map((crop) => (
          <motion.div key={crop.id} variants={item}>
            <Card
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50',
                cropId === crop.id && 'border-primary bg-primary/5 ring-2 ring-primary/20'
              )}
              onClick={() => handleCropSelect(crop)}
            >
              <div className="text-center space-y-2">
                <span className="text-3xl">{crop.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">{crop.nameEn}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredCrops.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          ไม่พบพืชที่ค้นหา
        </div>
      )}

      {/* Selected Crop Info */}
      {cropId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Card className="p-4 bg-primary/5 border-primary/20">
            {(() => {
              const selected = crops.find((c) => c.id === cropId)
              if (!selected) return null
              return (
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{selected.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{selected.name}</h3>
                    <p className="text-sm text-muted-foreground">{selected.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        N: {selected.npkRequirement.n} กก./ไร่
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        P: {selected.npkRequirement.p} กก./ไร่
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        K: {selected.npkRequirement.k} กก./ไร่
                      </span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </Card>
        </motion.div>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button onClick={nextStep} disabled={!canProceed} size="lg">
          ถัดไป
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  )
}
