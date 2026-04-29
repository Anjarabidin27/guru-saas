import type { Metadata } from 'next'
import Link from 'next/link'
import RegisterForm from './RegisterForm'

export const metadata: Metadata = { title: 'Daftar Gratis — WiyataGuru' }

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* LEFT — VISUAL BRANDING */}
      <div className="hidden lg:flex relative w-[45%] bg-blue-900 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-overlay"
          style={{ backgroundImage: "url('/indonesian_teacher_classroom_1776477599101.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/80 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-12 h-full text-white w-full">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png/600px-Logo_Kementerian_Pendidikan_dan_Kebudayaan.png" alt="Logo" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-black tracking-tight">WiyataGuru</span>
          </Link>

          <div>
            <div className="inline-flex px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
              Pendidikan Indonesia 🇮🇩
            </div>
            <h1 className="text-4xl xl:text-5xl font-black leading-[1.1] mb-6 tracking-tight">
              Revolusi Kerja Guru,<br/>Mulai dari Sini.
            </h1>
            
            <div className="flex flex-col gap-4 mt-8">
              {[
                { i: '1',  t: 'Manajemen Kelas Efisien' },
                { i: '2',  t: 'Bank Soal Otomatis' },
                { i: '3',  t: 'Integrasi Langsung' },
              ].map(item => (
                <div key={item.i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-black">{item.i}</div>
                  <span className="text-sm font-bold text-slate-200">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — FORM COMPACT */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-indonesia relative overflow-y-auto">

        {/* Soft radial overlay on top of indonesian pattern to make it unobtrusive */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60 pointer-events-none" />

        <div className="w-full max-w-sm m-auto py-8 relative z-10">

          {/* Mobile brand */}
          <div className="flex items-center justify-center gap-3 mb-8 lg:hidden">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Logo_Kementerian_Pendidikan_dan_Kebudayaan.png/600px-Logo_Kementerian_Pendidikan_dan_Kebudayaan.png" alt="Logo" className="w-8 h-8" />
            <span className="text-2xl font-black text-blue-950 tracking-tight">WiyataGuru</span>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Buat Akun Anda</h2>
            <p className="text-sm font-bold text-slate-500">Sudah punya akun?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 underline underline-offset-4">Masuk ke Dasbor</Link>
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-slate-100/50 p-6 sm:p-8 rounded-[2rem] shadow-2xl shadow-blue-900/5 relative overflow-hidden">
             {/* Decorative blob inside form */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 -z-10" />
             <RegisterForm />
          </div>
          
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mt-8">
            © 2026 WiyataGuru · Server Indonesia 🇮🇩
          </p>
        </div>
      </div>
    </div>
  )
}
