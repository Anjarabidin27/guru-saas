'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, ChevronRight, Info, Save, Download, Settings, Loader2, CheckCircle2, Plus, Trash2, Layout, BookOpen, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getIdentities, saveIdentity, uploadSchoolLogo, deleteIdentity } from '@/lib/actions/identity'

interface IdentityFormProps {
  onNext: (data: any) => void
  initialData?: any
}

export default function IdentityForm({ onNext, initialData }: IdentityFormProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  
  const [formData, setFormData] = useState({
    id: null as string | null,
    templateName: 'Template Utama',
    namaGuru: initialData?.namaGuru || '',
    namaSekolah: initialData?.namaSekolah || '',
    logoSekolah: initialData?.logoSekolah || null,
    jenjang: initialData?.jenjang || 'SMP/MTs',
    fase: initialData?.fase || 'Fase D',
    kelas: initialData?.kelas || 'Kelas 9',
    mapel: initialData?.mapel || '',
    judulPaket: initialData?.judulPaket || 'ULANGAN HARIAN',
    semester: initialData?.semester || '2',
    tahunAjaran: initialData?.tahunAjaran || '2026/2027',
    isDefault: initialData?.isDefault || false,
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    setLoading(true)
    try {
      const data = await getIdentities()
      setTemplates(data)
      if (data.length > 0 && !selectedTemplateId && !initialData) {
        // Prioritaskan template yang is_default, jika tidak ada fallback ke data[0]
        const defaultTemplate = data.find((t: any) => t.is_default) || data[0]
        applyTemplate(defaultTemplate)
      }
    } catch (e) {
      console.error('Failed to load identities', e)
    } finally {
      setLoading(false)
    }
  }

  const applyTemplate = (data: any) => {
    setSelectedTemplateId(data.id)
    setFormData(prev => ({
      ...prev,
      id: data.id,
      templateName: data.template_name || 'Tanpa Nama',
      namaGuru: data.nama_guru || '',
      namaSekolah: data.nama_sekolah || '',
      logoSekolah: data.logo_url || null,
      jenjang: data.jenjang || 'SMP/MTs',
      fase: data.fase || 'Fase D',
      kelas: data.kelas || 'Kelas 9',
      mapel: data.mapel_default || '',
      semester: data.semester || '2',
      tahunAjaran: data.tahun_ajaran || '2026/2027',
      isDefault: data.is_default || false,
    }))
  }

  const handleCreateNew = () => {
    setSelectedTemplateId('new')
    setFormData({
      id: null,
      templateName: 'Template Baru',
      namaGuru: '',
      namaSekolah: '',
      logoSekolah: null,
      jenjang: 'SMP/MTs',
      fase: 'Fase D',
      kelas: 'Kelas 9',
      mapel: '',
      judulPaket: 'ULANGAN HARIAN',
      semester: '1',
      tahunAjaran: '2025/2026',
      isDefault: false,
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (saveSuccess) setSaveSuccess(false)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)
    try {
      const result = await uploadSchoolLogo(uploadData)
      setFormData(prev => ({ ...prev, logoSekolah: result.publicUrl }))
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveToDb = async (isNew: boolean = false) => {
    setLoading(true)
    try {
      const payload = { ...formData }
      if (isNew) payload.id = null
      await saveIdentity(payload)
      setSaveSuccess(true)
      await fetchTemplates()
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!formData.id) return
    if (!confirm('Hapus template ini?')) return
    setLoading(true)
    try {
      await deleteIdentity(formData.id)
      handleCreateNew()
      await fetchTemplates()
    } catch (e: any) {
      alert(`Gagal: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full afu">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      {/* Ramping Header: Template & Meta */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4 divide-x divide-slate-200">
           <div className="flex items-center gap-2 pr-4">
              <Layout size={18} className="text-brand-600" />
              <select 
                value={selectedTemplateId} 
                onChange={(e) => {
                  const id = e.target.value
                  if (id === 'new') handleCreateNew()
                  else applyTemplate(templates.find(t => t.id === id))
                }}
                className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 outline-none focus:ring-0 cursor-pointer min-w-[160px]"
              >
                {templates.map(t => <option key={t.id} value={t.id}>{t.template_name}</option>)}
                <option value="new">+ Buat Template Baru</option>
              </select>
           </div>
           <div className="pl-4 flex items-center gap-2 flex-1">
              <input 
                name="templateName" 
                value={formData.templateName} 
                onChange={handleChange} 
                className="bg-transparent border-none p-0 text-sm font-bold text-brand-600 outline-none focus:ring-0 placeholder:text-slate-300 w-full"
                placeholder="Namai Konfigurasi ini..."
              />
           </div>
        </div>
        
        <div className="flex items-center gap-4 border-l border-slate-100 pl-4 lg:border-none lg:pl-0">
           <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                 type="checkbox" 
                 name="isDefault"
                 checked={formData.isDefault}
                 onChange={(e) => {
                    setFormData(prev => ({ ...prev, isDefault: e.target.checked }))
                    if (saveSuccess) setSaveSuccess(false)
                 }}
                 className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 cursor-pointer"
              />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700">Jadikan Utama</span>
           </label>
           
           <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
             <button type="button" onClick={() => handleSaveToDb(false)} disabled={!formData.id || loading} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all">
                <Save size={16} /> Update
             </button>
             <button type="button" onClick={() => handleSaveToDb(true)} disabled={loading} className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                <Plus size={16} /> Simpan Baru
             </button>
             {formData.id && (
               <button type="button" onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
               </button>
             )}
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden">
        {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center"><Loader2 className="animate-spin text-brand-600" /></div>}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 gap-y-6">
          
          {/* Identitas Personal */}
          <div className="lg:col-span-4 flex flex-col gap-5">
             <div className="space-y-1.5 flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Nama Guru Pengampu</label>
                <input name="namaGuru" value={formData.namaGuru} onChange={handleChange} placeholder="Contoh: Budi Santoso, S.Pd" className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-50 focus:border-brand-500 outline-none transition-all" />
             </div>
             <div className="space-y-1.5 flex-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Instansi / Unit Kerja</label>
                <input name="namaSekolah" value={formData.namaSekolah} onChange={handleChange} placeholder="Nama Sekolah Lengkap" className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:ring-4 focus:ring-brand-50 focus:border-brand-500 outline-none transition-all" />
             </div>
             <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Logo Sekolah</label>
                <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="group relative h-24 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-all overflow-hidden"
                >
                   {formData.logoSekolah ? (
                      <img src={formData.logoSekolah} alt="Logo" className="h-full object-contain p-2" />
                   ) : (
                      <div className="flex flex-col items-center gap-1.5">
                         <div className="bg-white p-2 rounded-lg shadow-sm text-slate-400 group-hover:text-brand-600">
                            <Upload size={20} />
                         </div>
                         <span className="text-[10px] font-bold text-slate-400 group-hover:text-brand-600 uppercase tracking-tight">Upload Logo</span>
                      </div>
                   )}
                   {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl"><Loader2 size={24} className="animate-spin text-brand-600" /></div>}
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
             
             {/* Row Atribut Sekolah (Consistent 4 Column Grid) */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Jenjang Sekolah</label>
                   <select name="jenjang" value={formData.jenjang} onChange={handleChange} className="w-full px-3 py-2.5 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl outline-none bg-white focus:border-brand-500">
                      <option>SD/MI</option><option>SMP/MTs</option><option>SMA/MA/SMK</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Fase Belajar</label>
                   <select name="fase" value={formData.fase} onChange={handleChange} className="w-full px-3 py-2.5 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl outline-none bg-white focus:border-brand-500">
                      <option>Fase A</option><option>Fase B</option><option>Fase C</option><option>Fase D</option><option>Fase E</option><option>Fase F</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Kelas</label>
                   <select name="kelas" value={formData.kelas} onChange={handleChange} className="w-full px-3 py-2.5 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl outline-none bg-white focus:border-brand-500">
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(k => <option key={k} value={`Kelas ${k}`}>Kelas {k}</option>)}
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-tight">Mata Pelajaran</label>
                   <input name="mapel" value={formData.mapel} onChange={handleChange} placeholder="Contoh: Matematika" className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                </div>
             </div>

             {/* Row Meta Naskah (Now Perfectly Aligned) */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-2 space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase">Judul Paket Naskah</label>
                   <input name="judulPaket" value={formData.judulPaket} onChange={handleChange} className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                   <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-3 py-2.5 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl outline-none bg-white focus:border-brand-500">
                      <option value="1">Ganjil (1)</option><option value="2">Genap (2)</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-xs font-bold text-slate-500 uppercase">Tahun Ajaran</label>
                   <input name="tahunAjaran" value={formData.tahunAjaran} onChange={handleChange} className="w-full px-4 py-2.5 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl outline-none focus:border-brand-500" />
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* Status & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
         <div className="flex items-center gap-3 text-slate-400">
            <div className="bg-slate-100 p-2 rounded-lg"><BookOpen size={18} /></div>
            <p className="text-xs font-bold text-slate-500">AI akan otomatis menyesuaikan bahasa dan tingkat kesulitan sesuai Fase & Topik Anda.</p>
         </div>
         <button 
           type="submit" 
           className="w-full md:w-auto px-8 py-4 text-sm font-black text-white bg-slate-900 rounded-2xl hover:bg-brand-600 shadow-xl shadow-slate-100 transition-all flex items-center justify-center gap-3 group"
         >
            Lanjut ke Konfigurasi Soal <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>

      {/* Save Toast */}
      {saveSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-3 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-5">
           <div className="bg-green-500 rounded-full p-1"><CheckCircle2 size={16} /></div> 
           Profil Identitas Berhasil Diperbarui
        </div>
      )}
    </form>
  )
}
