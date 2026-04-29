'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPenilaianDashboard } from '@/lib/actions/penilaian'

type PenilaianData = {
  id: string
  nama: string
  kelas: string
  mapel: string
  status: string
  kkm: number
  average: string
  progress: number
  jumlahSiswa: number
}

export default function PenilaianPage() {
  const [data, setData] = useState<PenilaianData[]>([])
  const [metrics, setMetrics] = useState({ rataRataGlobal: '0.0', tingkatKelulusan: 0, kkmSekolah: '75.0' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const res = await getPenilaianDashboard()
      if (res.error) {
        setError(res.error)
      } else {
        setData(res.data as PenilaianData[])
        setMetrics(res.metrics as any)
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
     <div className="flex justify-center p-20 text-black font-bold text-lg">MEMUAT SISTEM PENILAIAN...</div>
  )

  return (
    <div className="flex flex-col gap-6 text-black">
      {/* Header Administratif Klasik */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-300 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-normal mb-1">Pusat Manajemen Buku Nilai</h1>
          <p className="text-slate-700 font-medium text-sm">Sistem Direktori dan Pencatatan Evaluasi / Hasil Belajar Siswa.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link
            href="/dashboard/penilaian/baru"
            className="bg-blue-700 text-white font-bold text-base px-6 py-3 border border-blue-900 hover:bg-blue-800 flex items-center justify-center transition-colors shadow-sm"
          >
            [+] CATAT NILAI KELAS BARU
          </Link>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-700 text-red-900 p-4 text-sm font-bold uppercase">{error}</div>}

      {/* Overview Cards Klasik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-4 border border-slate-300 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2 block border-b border-slate-300 w-full pb-1">Batas Target KKM Nasional</span>
            <span className="text-3xl font-bold text-black">{metrics.kkmSekolah}</span>
         </div>
         <div className="bg-white p-4 border border-slate-300 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2 block border-b border-slate-300 w-full pb-1">Rata-Rata Nilai Akademi</span>
            <span className="text-3xl font-bold text-black">{metrics.rataRataGlobal}</span>
         </div>
         <div className="bg-white p-4 border border-slate-300 shadow-sm flex flex-col items-center text-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2 block border-b border-slate-300 w-full pb-1">Tingkat Persentase Kelulusan</span>
            <span className="text-3xl font-bold text-black">{metrics.tingkatKelulusan}%</span>
         </div>
      </div>

      {/* List Penilaian (Tabel Klasik) */}
      <div className="bg-white border border-slate-300 shadow-sm">
         <div className="px-6 py-4 border-b border-slate-300 bg-slate-200">
            <h2 className="text-lg font-bold text-black uppercase">Tabel Riwayat Buku Nilai Guru</h2>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-100 text-black font-bold uppercase border-b border-slate-300">
                     <th className="px-4 py-3 border-r border-slate-300 w-12 text-center">No</th>
                     <th className="px-4 py-3 border-r border-slate-300">Subjek Evaluasi / Kelas</th>
                     <th className="px-4 py-3 border-r border-slate-300 text-center">Peserta</th>
                     <th className="px-4 py-3 border-r border-slate-300 text-center">Status Lulus</th>
                     <th className="px-4 py-3 border-r border-slate-300 text-center">Rata-Rata</th>
                     <th className="px-4 py-3 border-r border-slate-300 text-center">Draft/Selesai</th>
                     <th className="px-4 py-3 text-center">Aksi Lanjutan</th>
                  </tr>
               </thead>
               <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-lg text-black font-bold border-b border-slate-300">
                        Belum ada dokumen rekapan nilai yang disetorkan.
                      </td>
                    </tr>
                  ) : null}
                  {data.map((p, index) => (
                     <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-300">
                        <td className="px-4 py-3 border-r border-slate-300 text-center font-bold text-black align-middle">{index + 1}</td>
                        <td className="px-4 py-3 border-r border-slate-300 align-middle">
                           <div className="text-base font-bold text-black">{p.nama}</div>
                           <div className="text-xs text-slate-700 uppercase mt-1 font-semibold">{p.mapel} — Kelas {p.kelas}</div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-300 text-center align-middle font-bold text-black">
                           {p.jumlahSiswa}
                        </td>
                        <td className="px-4 py-3 border-r border-slate-300 text-center align-middle">
                           <span className="font-bold text-black">{p.progress}%</span>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-300 text-center align-middle">
                           <span className="font-bold text-black text-lg">{p.average}</span>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-300 text-center align-middle">
                           <span className={`px-3 py-1 font-bold text-xs uppercase border ${p.status === 'selesai' ? 'bg-green-100 text-green-900 border-green-700' : 'bg-yellow-100 text-yellow-900 border-yellow-700'}`}>
                              {p.status}
                           </span>
                        </td>
                        <td className="px-4 py-3 text-center align-middle">
                           <button className="bg-slate-200 text-black border border-slate-400 text-xs font-bold px-4 py-2 uppercase hover:bg-slate-300 transition-colors">
                              BUKA RINCIAN
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  )
}
