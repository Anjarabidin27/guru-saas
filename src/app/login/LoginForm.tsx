'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError('Mohon isi email dan kata sandi.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Email atau kata sandi salah. Periksa kembali.'
          : 'Terjadi kesalahan. Coba lagi.'
      )
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      {/* Error alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg px-4 py-3 flex items-start gap-2">
          <span>⚠️</span> <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="text-xs font-black uppercase text-slate-500 tracking-widest pl-1 mb-1 block">
            Email / Username
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="contoh@sekolah.sch.id"
            className="w-full px-4 py-3 bg-slate-50 rounded-xl shadow-inner border border-slate-200/60 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            autoComplete="email"
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between pl-1 mb-1">
            <label htmlFor="password" className="text-xs font-black uppercase text-slate-500 tracking-widest block">
              Kata Sandi
            </label>
            <Link href="/lupa-password" className="text-[10px] text-blue-600 font-black uppercase tracking-wider hover:underline">
              Lupa Sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 bg-slate-50 rounded-xl shadow-inner border border-slate-200/60 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              autoComplete="current-password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white font-black py-3.5 rounded-xl text-sm hover:bg-blue-700 hover:-translate-y-0.5 transition-all shadow-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Masuk →'
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3 my-2">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">atau</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* Google Login */}
      <button
        type="button"
        disabled={loading}
        className="w-full border border-slate-200 bg-white text-slate-700 font-black py-3 rounded-xl hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
        onClick={() => alert('Integrasi Google Login sedang dalam pengembangan!')}
      >
        <svg viewBox="0 0 48 48" className="w-5 h-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
        </svg>
        Masuk via Google
      </button>

      {/* Demo Helper */}
      <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Development Mode</p>
        <button
          type="button"
          onClick={() => {
            setEmail('guru@contoh.id')
            setPassword('password123')
          }}
          className="w-full bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
        >
          🔑 Gunakan Akun Demo
        </button>
      </div>
    </form>
  )
}
