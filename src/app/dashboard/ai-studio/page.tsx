'use client'

import { useState } from 'react'
import QuestionGeneratorStepper from '@/components/dashboard/QuestionGeneratorStepper'
import IdentityForm from '@/components/dashboard/IdentityForm'
import ConfigurationForm from '@/components/dashboard/ConfigurationForm'
import ResultDisplay from '@/components/dashboard/ResultDisplay'
import { Sparkles } from 'lucide-react'

type StepId = 'identitas' | 'konfigurasi' | 'naskah' | 'modul' | 'quiz'

export default function AIStudioPage() {
  const [currentStep, setCurrentStep] = useState<StepId>('identitas')
  
  // States for shared data
  const [identityData, setIdentityData] = useState<any>(null)
  const [configData, setConfigData] = useState<any>(null)

  const handleIdentityNext = (data: any) => {
    setIdentityData(data)
    setCurrentStep('konfigurasi')
  }

  const handleConfigNext = (data: any) => {
    setConfigData(data)
    setCurrentStep('naskah')
  }

  const handleBack = () => {
    if (currentStep === 'konfigurasi') setCurrentStep('identitas')
    if (currentStep === 'naskah') setCurrentStep('konfigurasi')
  }

  return (
    <div className="flex flex-col min-h-screen -mt-4 lg:-mt-7 -mx-4 lg:-mx-7 bg-slate-50/50">
      
      {/* Premium Header Branding */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-7 py-6">
         <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <div className="space-y-1">
               <div className="flex items-center gap-2">
                  <div className="bg-brand-600 text-white p-1 rounded-lg">
                     <Sparkles size={20} />
                  </div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">AI Studio <span className="text-brand-600 font-bold">Smart Generator</span></h1>
               </div>
               <p className="text-xs text-slate-500 font-medium">Asisten cerdas pendidik untuk menyusun instrumen penilaian berkualitas tinggi.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status Sesi</p>
                  <p className="text-xs font-bold text-green-600 flex items-center justify-end gap-1.5 mt-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> AI Engine Ready
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* Navigation Stepper */}
      <QuestionGeneratorStepper 
         currentStep={currentStep} 
         onStepClick={(id) => {
            // Only allow navigating back to completed steps
            if (id === 'identitas') setCurrentStep('identitas')
            if (id === 'konfigurasi' && identityData) setCurrentStep('konfigurasi')
         }}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-10 py-8 pb-32">
         {currentStep === 'identitas' && (
            <IdentityForm 
               onNext={handleIdentityNext} 
               initialData={identityData} 
            />
         )}

         {currentStep === 'konfigurasi' && (
            <ConfigurationForm 
               onNext={handleConfigNext} 
               onBack={handleBack}
               initialData={configData}
            />
         )}

         {currentStep === 'naskah' && (
            <ResultDisplay 
               identityData={identityData}
               configData={configData}
               onBack={handleBack}
            />
         )}

         {(currentStep === 'modul' || currentStep === 'quiz') && (
            <div className="py-20 text-center animate-pulse">
               <h2 className="text-lg font-bold text-slate-400">Modul ini akan segera tersedia dalam pembaruan berikutnya.</h2>
               <button onClick={() => setCurrentStep('identitas')} className="mt-4 text-brand-600 font-bold hover:underline">Kembali ke Beranda AI Studio</button>
            </div>
         )}
      </main>

    </div>
  )
}
