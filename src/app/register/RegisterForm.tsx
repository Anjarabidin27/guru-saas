'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DAFTAR_MAPEL } from '@/lib/constants'

export default function RegisterForm() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    password: '',
    mapel_utama: '',
    kode_sekolah: '',
    sekolah_nama_raw: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function update(field: string, val: string) {
    setForm(f => ({ ...f, [field]: val }))
    setError('')
  }

  function validateStep1() {
    if (!form.nama_lengkap.trim()) return 'Nama lengkap wajib diisi.'
    if (!form.email.trim() || !form.email.includes('@')) return 'Email tidak valid.'
    if (form.password.length < 8) return 'Kata sandi minimal 8 karakter.'
    return ''
  }

  function handleNext() {
    const err = validateStep1()
    if (err) { setError(err); return }
    setStep(2)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.mapel_utama) { setError('Pilih mata pelajaran pengampu Anda.'); return }
    if (!form.sekolah_nama_raw.trim()) { setError('Nama instansi/sekolah wajib diisi untuk pendataan.'); return }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nama_lengkap: form.nama_lengkap,
          mapel_utama: form.mapel_utama,
          kode_sekolah: form.kode_sekolah,
          sekolah_nama_raw: form.sekolah_nama_raw,
          role: 'guru',
          subscription_tier: 'gratis',
        },
      },
    })

    if (authError) {
      setError(
        authError.message.includes('already registered')
          ? 'Email ini sudah terdaftar. Silakan masuk.'
          : 'Terjadi kesalahan sistem. Coba lagi.'
      )
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="text-center py-8 animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2">Pendaftaran Selesai!</h3>
        <p className="text-slate-500 mb-6 text-sm leading-relaxed">
          Kami telah mengirim email konfirmasi ke <strong>{form.email}</strong>.
          <br/> Harap cek Inbox atau folder Spam Anda.
        </p>
        <button onClick={() => router.push('/login')} className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-black transition-all text-sm">
          Menuju Halaman Masuk
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`} />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg px-4 py-3 flex items-start gap-2">
          <span>⚠️</span> <span>{error}</span>
        </div>
      )}

      {/* STEP 1 — Identitas Utama */}
      {step === 1 && (
        <div className="animate-fade-up flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">Nama Lengkap & Gelar</label>
              <input
                type="text" value={form.nama_lengkap} onChange={e => update('nama_lengkap', e.target.value)}
                placeholder="Bu Sari Dewi, S.Pd."
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">Email Aktif</label>
              <input
                type="email" value={form.email} onChange={e => update('email', e.target.value)}
                placeholder="sari@sekolah.sch.id"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">Kata Sandi (Min. 8 Karakter)</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 hover:text-slate-600" tabIndex={-1}>
                  {showPass ? (
                    <svg className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleNext} className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg mt-2">
            Selanjutnya
          </button>
        </div>
      )}

      {/* STEP 2 — Sekolah & Mapel */}
      {step === 2 && (
        <div className="animate-fade-up flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">Mata Pelajaran Utama</label>
              <select
                value={form.mapel_utama} onChange={e => update('mapel_utama', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
              >
                <option value="" disabled>-- Pilih Mapel --</option>
                {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            
            <div>
              <label className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">Nama Instansi / Sekolah</label>
              <input
                type="text" value={form.sekolah_nama_raw} onChange={e => update('sekolah_nama_raw', e.target.value)}
                placeholder="Cth: SMAN 1 JAKARTA"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all font-mono"
              />
              <p className="text-[10px] font-bold text-slate-400 mt-1.5 px-1 uppercase tracking-tight">
                 Data ini diperlukan untuk personalisasi akun & sertifikat Anda.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
               <label className="text-xs font-black uppercase text-slate-400 tracking-widest pl-1 mb-2 block flex items-center justify-between">
                 <span>Kode Join Institusi</span>
                 <span className="bg-white px-2 py-0.5 rounded-md text-[10px] text-slate-400 shadow-sm border border-slate-100">OPSIONAL</span>
               </label>
               <input
                 type="text" value={form.kode_sekolah} onChange={e => update('kode_sekolah', e.target.value.toUpperCase())}
                 placeholder="Cth: S-ABCD"
                 maxLength={6}
                 className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-base font-black text-center tracking-[0.2em] uppercase text-blue-700 placeholder:text-slate-300 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all font-mono"
               />
               <p className="text-[10px] uppercase font-bold text-slate-400 text-center mt-2 leading-relaxed">
                 Kosongkan jika sekolah Anda belum berlangganan kolektif.
               </p>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={() => setStep(1)} className="px-6 border-2 border-slate-200 text-slate-500 font-black py-3 rounded-xl hover:bg-slate-50 transition-all text-sm">
              Kembali
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Selesaikan Pendaftaran'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
