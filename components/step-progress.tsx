'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StepProgressProps {
  currentStep: number
  steps: { number: number; label: string }[]
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="flex flex-row lg:flex-col gap-3 md:gap-4 lg:gap-3 justify-center lg:justify-start items-center lg:items-stretch">
      {steps.map((step, index) => {
        const isActive = step.number === currentStep
        const isCompleted = step.number < currentStep

        return (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg transition-all duration-300',
              isActive && 'bg-primary/10',
              isCompleted && 'opacity-60'
            )}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                isActive && 'bg-primary text-primary-foreground scale-110',
                isCompleted && 'bg-primary/80 text-primary-foreground',
                !isActive && !isCompleted && 'bg-muted text-muted-foreground'
              )}
            >
              {isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                'text-sm font-medium transition-colors hidden md:block',
                isActive && 'text-primary',
                isCompleted && 'text-muted-foreground',
                !isActive && !isCompleted && 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
