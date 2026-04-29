'use client'

import { User, Settings, FileText, BookOpen, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  label: string
  icon: any
}

const steps: Step[] = [
  { id: 'identitas', label: 'Identitas', icon: User },
  { id: 'konfigurasi', label: 'Konfigrasi', icon: Settings },
  { id: 'naskah', label: 'Naskah Soal', icon: FileText },
  { id: 'modul', label: 'Modul Ajar', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
]

interface StepperProps {
  currentStep: string
  onStepClick?: (id: string) => void
}

export default function QuestionGeneratorStepper({ currentStep, onStepClick }: StepperProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 lg:px-7">
         <div className="flex items-center justify-between py-4 overflow-x-auto no-scrollbar gap-8">
            {steps.map((step, index) => {
               const Icon = step.icon
               const isActive = step.id === currentStep
               const isCompleted = index < currentIndex

               return (
                  <button
                     key={step.id}
                     onClick={() => onStepClick?.(step.id)}
                     className={cn(
                        "flex flex-col items-center gap-2 group relative transition-all min-w-fit",
                        isActive ? "text-brand-600" : (isCompleted ? "text-slate-800" : "text-slate-400")
                     )}
                  >
                     {/* Icon Container */}
                     <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                        isActive ? "bg-brand-600 text-white shadow-lg shadow-brand-100 scale-110" : 
                        (isCompleted ? "bg-brand-50 text-brand-600" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100")
                     )}>
                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                     </div>

                     {/* Label */}
                     <span className={cn(
                        "text-xs font-bold whitespace-nowrap tracking-tight transition-all",
                        isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                     )}>
                        {step.label}
                     </span>

                     {/* Active Indicator Line */}
                     {isActive && (
                        <motion.div 
                           layoutId="step-indicator"
                           className="absolute -bottom-4 left-0 right-0 h-1 bg-brand-600 rounded-full"
                        />
                     )}
                  </button>
               )
            })}
         </div>
      </div>
    </div>
  )
}
