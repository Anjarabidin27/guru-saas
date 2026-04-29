'use client'

import { useState, useEffect } from 'react'
import { getSiteConfig, updateSiteConfig } from '@/lib/actions/settings'
import { Settings2, Palette, Image as ImageIcon, BarChart3, Save, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
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
      setSuccess('Platform_Configuration successfully deployed.')
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
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">Platform_Visual_Engine</h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
            <Palette className="w-3 h-3" />
            Control Branding and Visual Assets
          </p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save className="w-3 h-3" />}
          Sync System Configuration
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-4xl">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4" /> CONFIG_FAULT: {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> DEPLOY_SUCCESS: {success}
          </div>
        )}

        {/* ─── BRAND IDENTITY ─── */}
        <SettingsBlock icon={Settings2} title="Identitas & Brand" desc="Pengaturan dasar penamaan aplikasi pusat.">
           <div className="grid md:grid-cols-2 gap-6">
             <FieldGroup label="Nama Aplikasi" value={settings.branding_name} onChange={v => handleChange('branding_name', v)} />
           </div>
        </SettingsBlock>

        {/* ─── HERO VISUALS ─── */}
        <SettingsBlock icon={ImageIcon} title="Aset Komunikasi Visual" desc="Manajemen gambar utama yang tampil di bagian Hero Landing Page.">
           <div className="grid gap-6">
              <div className="flex flex-col gap-2">
                <FieldGroup 
                   label="Hero Section Headline" 
                   value={settings.hero_title} 
                   onChange={v => handleChange('hero_title', v)} 
                   isTextArea 
                />
              </div>
              <div className="flex flex-col gap-2">
                <FieldGroup 
                   label="Hero Section Subtitle" 
                   value={settings.hero_subtitle} 
                   onChange={v => handleChange('hero_subtitle', v)} 
                   isTextArea 
                />
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-start">
                 <div className="flex-1 w-full">
                    <FieldGroup label="URL Gambar Hero (Besar)" value={settings.hero_image_url} onChange={v => handleChange('hero_image_url', v)} placeholder="/public/path..." />
                 </div>
                 <div className="w-40 aspect-video rounded border border-slate-200 bg-slate-50 overflow-hidden flex-shrink-0">
                    {settings.hero_image_url && <img src={settings.hero_image_url} className="w-full h-full object-cover" alt="preview" />}
                 </div>
              </div>
           </div>
        </SettingsBlock>

        {/* ─── FEATURE ASSETS ─── */}
        <SettingsBlock icon={ImageIcon} title="Aset Fitur & Modul" desc="Gambar pendukung untuk penjelasan fitur sistem.">
           <div className="grid md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                 <div className="aspect-video rounded border border-slate-200 bg-slate-50 overflow-hidden">
                    {settings.feature_1_img && <img src={settings.feature_1_img} className="w-full h-full object-cover" alt="fitur1" />}
                 </div>
                 <FieldGroup label="Fitur 1: Manajemen Materi" value={settings.feature_1_img} onChange={v => handleChange('feature_1_img', v)} />
              </div>
              <div className="flex flex-col gap-3">
                 <div className="aspect-video rounded border border-slate-200 bg-slate-50 overflow-hidden">
                    {settings.feature_2_img && <img src={settings.feature_2_img} className="w-full h-full object-cover" alt="fitur2" />}
                 </div>
                 <FieldGroup label="Fitur 2: Kolaborasi Siswa" value={settings.feature_2_img} onChange={v => handleChange('feature_2_img', v)} />
              </div>
           </div>
        </SettingsBlock>

        {/* ─── METRIC CONTROL ─── */}
        <SettingsBlock icon={BarChart3} title="Otoritas Statistik (Social Proof)" desc="Angka yang ditampilkan untuk membangun kepercayaan sekolah.">
           <div className="grid md:grid-cols-2 gap-6">
              <FieldGroup label="Angka Pendidik Terdaftar" value={settings.stats_guru} onChange={v => handleChange('stats_guru', v)} />
              <FieldGroup label="Angka Butir Soal Tersimpan" value={settings.stats_soal} onChange={v => handleChange('stats_soal', v)} />
           </div>
        </SettingsBlock>

        <div className="pb-20" />
      </div>
    </div>
  )
}

function SettingsBlock({ icon: Icon, title, desc, children }: any) {
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

function FieldGroup({ label, value, onChange, isTextArea = false, placeholder = 'NULL_VAL' }: any) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
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
