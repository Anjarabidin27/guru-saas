'use client'

import { useState, useEffect } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/lib/actions/settings'
import { FileText, Save, AlertCircle, CheckCircle2, LayoutGrid, Shield, Zap, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminKontenPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function load() {
      const data = await getSiteConfig()
      setSettings(data)
      setLoading(false)
    }
    load()
  }, [])

  function handleChange(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')
    
    const result = await updateSiteConfig(settings)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Content_Manifest updated successfully.')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto animate-fade-up flex flex-col gap-6">
      <div className="pb-4 border-b border-slate-200 flex justify-between items-end">
        <div>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Content_Management_System</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" />
            Manage Landing Page Marketing Copy
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
          Commit Changes
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4" /> EXCEPTION: {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> SUCCESS: {success}
          </div>
        )}

        {/* ─── PAIN POINTS SECTION ─── */}
        <ContentSection icon={AlertCircle} title="Seksi Masalah (Pain Points)" desc="Konfigurasi narasi masalah utama yang dihadapi guru di lapangan.">
           <div className="grid gap-6">
              <InputGroup label="Headline Utama (Badge Merah)" value={settings.masalah_headline} onChange={v => handleChange('masalah_headline', v)} />
              <InputGroup label="Judul Seksi Masalah" value={settings.masalah_title} onChange={v => handleChange('masalah_title', v)} isTextArea />
              
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                 <div className="space-y-4">
                    <InputGroup label="Masalah 1: Judul" value={settings.masalah_1_title} onChange={v => handleChange('masalah_1_title', v)} />
                    <InputGroup label="Masalah 1: Deskripsi" value={settings.masalah_1_desc} onChange={v => handleChange('masalah_1_desc', v)} isTextArea />
                 </div>
                 <div className="space-y-4">
                    <InputGroup label="Masalah 2: Judul" value={settings.masalah_2_title} onChange={v => handleChange('masalah_2_title', v)} />
                    <InputGroup label="Masalah 2: Deskripsi" value={settings.masalah_2_desc} onChange={v => handleChange('masalah_2_desc', v)} isTextArea />
                 </div>
              </div>
           </div>
        </ContentSection>

        {/* ─── RESOLUTION SECTION ─── */}
        <ContentSection icon={Zap} title="Seksi Resolusi (Solutions)" desc="Daftar solusi otomatisasi yang ditawarkan oleh WiyataGuru.">
           <div className="grid gap-6">
              <InputGroup label="Headline Resolusi (Badge Hijau)" value={settings.resolusi_headline} onChange={v => handleChange('resolusi_headline', v)} />
              <InputGroup label="Judul Seksi Resolusi" value={settings.resolusi_title} onChange={v => handleChange('resolusi_title', v)} />
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-100">
                 <InputGroup label="Item Resolusi 1" value={settings.resolusi_item_1} onChange={v => handleChange('resolusi_item_1', v)} />
                 <InputGroup label="Item Resolusi 2" value={settings.resolusi_item_2} onChange={v => handleChange('resolusi_item_2', v)} />
                 <InputGroup label="Item Resolusi 3" value={settings.resolusi_item_3} onChange={v => handleChange('resolusi_item_3', v)} />
                 <InputGroup label="Item Resolusi 4" value={settings.resolusi_item_4} onChange={v => handleChange('resolusi_item_4', v)} />
              </div>
           </div>
        </ContentSection>

        {/* ─── SECURITY SECTION ─── */}
        <ContentSection icon={Shield} title="Standarisasi & Keamanan" desc="Penjelasan teknis mengenai proteksi data dan kepatuhan nasional.">
           <div className="grid gap-6">
              <InputGroup label="Judul Seksi Keamanan" value={settings.security_title} onChange={v => handleChange('security_title', v)} />
              <InputGroup label="Deskripsi Keamanan Detail" value={settings.security_desc} onChange={v => handleChange('security_desc', v)} isTextArea />
           </div>
        </ContentSection>

        {/* ─── CTA SECTION ─── */}
        <ContentSection icon={MessageSquare} title="Ajakan Bertindak (CTA)" desc="Blok biru di bagian bawah halaman untuk konversi pengguna.">
           <div className="grid gap-6">
              <InputGroup label="Judul Raksasa CTA" value={settings.cta_title} onChange={v => handleChange('cta_title', v)} isTextArea />
              <InputGroup label="Subtitle CTA" value={settings.cta_subtitle} onChange={v => handleChange('cta_subtitle', v)} isTextArea />
           </div>
        </ContentSection>

        <div className="pb-20" />
      </div>
    </div>
  )
}

function ContentSection({ icon: Icon, title, desc, children }: any) {
   return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden group">
         <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Icon className="w-4 h-4 text-slate-400" />
            <h2 className="text-[11px] font-black uppercase tracking-widest text-slate-900">{title}</h2>
         </div>
         <div className="p-5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mb-6">{desc}</p>
            {children}
         </div>
      </div>
   )
}

function InputGroup({ label, value, onChange, isTextArea = false, placeholder = 'Empty_State' }: { label: string, value?: string, onChange: (v: string) => void, isTextArea?: boolean, placeholder?: string }) {
   return (
      <div className="flex flex-col gap-1.5">
         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</label>
         {isTextArea ? (
            <textarea 
               value={value || ''}
               onChange={e => onChange(e.target.value)}
               placeholder={placeholder}
               rows={3}
               className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300 resize-none"
            />
         ) : (
            <input 
               type="text"
               value={value || ''}
               onChange={e => onChange(e.target.value)}
               placeholder={placeholder}
               className="bg-slate-50 border border-slate-200 rounded px-3 py-2 text-[13px] font-semibold text-slate-900 outline-none focus:border-slate-900 focus:bg-white transition-all placeholder:text-slate-300"
            />
         )}
      </div>
   )
}
