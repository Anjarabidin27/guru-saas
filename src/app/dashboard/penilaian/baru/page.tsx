'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DAFTAR_MAPEL, DAFTAR_KELAS } from '@/lib/constants'
import { createPenilaian } from '@/lib/actions/penilaian'
import { Loader2 } from 'lucide-react'

// Array Helper buat inisialisasi
const generateSiswaList = (count: number, existingList: any[] = []) => {
  const newList = [...existingList]
  while (newList.length < count) {
    newList.push({ nama: `Siswa ${newList.length + 1}`, skor: '', catatan: '' })
  }
  return newList.slice(0, count)
}

export default function PenilaianBaruPage() {
  const router = useRouter()
  
  // State Gabungan
  const [header, setHeader] = useState({ nama_penilaian: '', kelas: '', mapel: '', kkm: '75' })
  const [jumlahSiswa, setJumlahSiswa] = useState<number>(30)
  const [siswaList, setSiswaList] = useState<any[]>(generateSiswaList(30))
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // React on jumlahSiswa changes
  useEffect(() => {
    if (jumlahSiswa > 0 && jumlahSiswa <= 100) {
      setSiswaList(prev => generateSiswaList(jumlahSiswa, prev))
    }
  }, [jumlahSiswa])

  function updateHeader(k: string, v: string) {
    setHeader(h => ({ ...h, [k]: v }))
    setError('')
  }

  function updateSiswa(i: number, key: string, val: string) {
    setSiswaList(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s))
  }

  const avg = siswaList.length
    ? (siswaList.filter((s:any) => s.skor).reduce((sum, s) => sum + parseFloat(s.skor || '0'), 0) / (siswaList.filter((s:any) => s.skor).length || 1))
    : 0

  const lulusCount = siswaList.filter((s:any) => s.skor !== '' && parseFloat(s.skor || '0') >= parseFloat(header.kkm || '0')).length

  async function handleSimpan(e: React.FormEvent) {
    e.preventDefault()
    
    if (!header.nama_penilaian.trim()) return setError('KESALAHAN: Nama penilaian wajib diisi.')
    if (!header.mapel) return setError('KESALAHAN: Mata pelajaran belum dipilih.')
    if (!header.kelas) return setError('KESALAHAN: Kelas belum dipilih.')
    if (siswaList.some((s:any) => s.nama.trim() === '')) return setError('KESALAHAN: Semua baris nama siswa wajib diisi/dibiarkan dengan format default.')

    setLoading(true)
    const result = await createPenilaian({
      nama_penilaian: header.nama_penilaian,
      kelas: header.kelas,
      mapel: header.mapel,
      kkm: parseFloat(header.kkm || '75'),
      siswa: siswaList
        .filter((s:any) => s.nama.trim())
        .map((s:any) => ({ nama_siswa: s.nama, skor: parseFloat(s.skor || '0'), catatan: s.catatan }))
    })
    setLoading(false)

    if (result.error) { 
      setError(result.error) 
      return 
    }
    
    setSuccess(true)
    setTimeout(() => router.push('/dashboard/penilaian'), 1500)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-green-50 border border-green-600 text-center max-w-3xl mx-auto shadow-sm mt-10">
        <h2 className="text-2xl font-bold text-green-900 mb-2">VERIFIKASI SUKSES: BUKU NILAI TERSIMPAN</h2>
        <p className="text-black font-medium text-lg">Mengalihkan kembali ke Pusat Manajemen Buku Nilai...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 pb-20">
      
      {/* Header Form Administrator */}
      <div className="bg-white border border-slate-300 p-6 shadow-sm flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-black mb-1">Formulir Perekaman Nilai Kelas</h1>
            <p className="text-base text-slate-700">Lengkapi identitas ujian dan isikan skor akumulatif secara massal pada tabel di bawah.</p>
         </div>
         <button
            onClick={() => router.back()}
            className="bg-slate-200 border border-slate-400 font-bold text-black px-4 py-2 hover:bg-slate-300 transition-colors"
         >
            ← Kembali ke Pusat
         </button>
      </div>

      <form onSubmit={handleSimpan} className="flex flex-col gap-6">
        
        {error && (
          <div className="bg-red-100 border border-red-600 text-red-900 text-lg font-bold p-4 text-center uppercase">
            {error}
          </div>
        )}

        {/* Panel Identifikasi */}
        <div className="bg-white border border-slate-300 shadow-sm p-8">
           <h2 className="text-xl font-bold text-black border-b border-slate-300 pb-2 mb-6 uppercase">Atribut Identitas Dokumen Ujian</h2>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                 <label className="text-base font-bold text-black block mb-2">Judul Dokumen Penilaian (Wajib)</label>
                 <input 
                   type="text" 
                   value={header.nama_penilaian}
                   onChange={e => updateHeader('nama_penilaian', e.target.value)}
                   placeholder="Ketik teks identitas, contoh: UAS Ganjil PPKN"
                   className="w-full bg-white border border-slate-400 p-3 text-lg text-black focus:border-blue-700 outline-none focus:ring-1 focus:ring-blue-700"
                 />
              </div>

              <div>
                 <label className="text-base font-bold text-black block mb-2">Mata Pelajaran</label>
                 <select
                   value={header.mapel}
                   onChange={e => updateHeader('mapel', e.target.value)}
                   className="w-full bg-white border border-slate-400 p-3 text-lg text-black focus:border-blue-700 outline-none"
                 >
                   <option value="">-- Pilih --</option>
                   {DAFTAR_MAPEL.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
              </div>

              <div>
                 <label className="text-base font-bold text-black block mb-2">Untuk Kelas</label>
                 <select
                   value={header.kelas}
                   onChange={e => updateHeader('kelas', e.target.value)}
                   className="w-full bg-white border border-slate-400 p-3 text-lg text-black focus:border-blue-700 outline-none"
                 >
                   <option value="">-- Pilih --</option>
                   {DAFTAR_KELAS.map(k => <option key={k} value={k}>Kelas {k}</option>)}
                 </select>
              </div>

              <div>
                 <label className="text-base font-bold text-black block mb-2">Kriteria Kelulusan Minimal (KKM)</label>
                 <input 
                   type="number" 
                   min="0" max="100"
                   value={header.kkm}
                   onChange={e => updateHeader('kkm', e.target.value)}
                   className="w-full bg-blue-50 border border-slate-400 p-3 text-lg text-black focus:border-blue-700 outline-none text-center font-bold"
                 />
              </div>

              <div>
                 <label className="text-base font-bold text-black block mb-2">Jumlah Siswa Dinilai (Batas Baris)</label>
                 <input 
                   type="number" 
                   min="1" max="100"
                   value={jumlahSiswa}
                   onChange={e => setJumlahSiswa(Number(e.target.value))}
                   className="w-full bg-yellow-50 border border-slate-400 p-3 text-lg text-black focus:border-blue-700 outline-none text-center font-bold"
                 />
              </div>
           </div>
        </div>

        {/* Panel Kalkulasi Otomatis */}
        <div className="grid grid-cols-3 gap-0 border border-slate-300 bg-white">
           <div className="p-4 border-r border-slate-300 text-center">
              <span className="block text-sm font-bold text-slate-700 uppercase mb-1">Total Entri Diisi</span>
              <span className="text-2xl font-bold text-black">{siswaList.filter(s=>s.skor !== '').length} / {jumlahSiswa}</span>
           </div>
           <div className="p-4 border-r border-slate-300 text-center bg-slate-50">
              <span className="block text-sm font-bold text-slate-700 uppercase mb-1">Rata-Rata Sementara</span>
              <span className="text-2xl font-bold text-blue-800">{siswaList.filter(s=>s.skor !== '').length ? avg.toFixed(1) : '0.0'}</span>
           </div>
           <div className="p-4 text-center bg-green-50">
              <span className="block text-sm font-bold text-slate-700 uppercase mb-1">Mencapai KKM</span>
              <span className="text-2xl font-bold text-green-800">{lulusCount} Siswa Lulus</span>
           </div>
        </div>

        {/* Tabel Besar Buku Nilai */}
        <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
           <div className="bg-slate-200 border-b border-slate-300 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-black uppercase">Tabel Induk Perekaman Angka ({jumlahSiswa} Baris)</h2>
           </div>
           
           <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-100 border-b border-slate-300 sticky top-0 z-10 shadow-sm">
                    <tr>
                       <th className="p-4 border-r border-slate-300 w-16 text-center text-sm font-bold text-black uppercase">No</th>
                       <th className="p-4 border-r border-slate-300 min-w-[250px] text-sm font-bold text-black uppercase">Nama Identitas Siswa</th>
                       <th className="p-4 border-r border-slate-300 w-40 text-center text-sm font-bold text-black uppercase">Nilai (0-100)</th>
                       <th className="p-4 border-r border-slate-300 text-sm font-bold text-black uppercase">Deskripsi / Catatan Perbaikan</th>
                       <th className="p-4 w-40 text-center text-sm font-bold text-black uppercase">Status Riwayat</th>
                    </tr>
                 </thead>
                 <tbody>
                    {siswaList.map((s, i) => {
                       const skor = parseFloat(s.skor || '-1');
                       const terisi = s.skor !== '';
                       const kkm = parseFloat(header.kkm || '0');
                       const lulus = terisi && skor >= kkm;
                       
                       return (
                          <tr key={i} className="border-b border-slate-300 hover:bg-slate-50">
                             <td className="p-2 border-r border-slate-300 text-center align-middle font-bold text-lg">{i + 1}</td>
                             <td className="p-2 border-r border-slate-300 align-middle">
                                <input 
                                  type="text" 
                                  value={s.nama}
                                  onChange={e => updateSiswa(i, 'nama', e.target.value)}
                                  className="w-full border border-slate-300 p-2 text-base text-black outline-none focus:border-blue-700 bg-white"
                                />
                             </td>
                             <td className="p-2 border-r border-slate-300 align-middle text-center">
                                <input 
                                  type="number" 
                                  min="0" max="100" 
                                  value={s.skor}
                                  onChange={e => updateSiswa(i, 'skor', e.target.value)}
                                  placeholder="---"
                                  className={`w-[100px] border border-slate-300 p-2 text-center text-xl font-bold outline-none focus:border-blue-700 ${terisi ? (lulus ? 'bg-green-100 text-green-900 border-green-600' : 'bg-red-100 text-red-900 border-red-600') : 'text-black bg-white'}`}
                                />
                             </td>
                             <td className="p-2 border-r border-slate-300 align-middle">
                                <input 
                                  type="text" 
                                  value={s.catatan}
                                  placeholder="Ketik catatan evaluasi..."
                                  onChange={e => updateSiswa(i, 'catatan', e.target.value)}
                                  className="w-full border border-slate-300 p-2 text-sm text-black outline-none focus:border-blue-700 bg-white"
                                />
                             </td>
                             <td className="p-2 align-middle text-center">
                                {terisi ? (
                                   <div className={`p-2 border font-bold text-xs uppercase ${lulus ? 'bg-green-200 text-green-900 border-green-800' : 'bg-red-200 text-red-900 border-red-800'}`}>
                                      {lulus ? 'TUNTAS' : 'MENGULANG'}
                                   </div>
                                ) : (
                                   <div className="text-slate-400 text-xs font-bold uppercase">BELUM DIUJI</div>
                                )}
                             </td>
                          </tr>
                       )
                    })}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Aksi Eksekusi Form */}
        <div className="border-t border-slate-300 pt-6 flex justify-end gap-4 pb-8">
           <button
             type="submit"
             disabled={loading}
             className={`w-full flex justify-center items-center gap-2 border font-bold px-8 py-5 text-xl transition-colors shadow-sm ${loading ? 'bg-slate-300 border-slate-400 text-slate-600 cursor-not-allowed' : 'bg-blue-700 border-blue-900 text-white hover:bg-blue-800'}`}
           >
             {loading && <Loader2 className="w-6 h-6 animate-spin" />}
             {loading ? 'MENYIMPAN DOKUMEN BUKU NILAI...' : 'SIMPAN DAN KUNCI DATA DOKUMEN PENILAIAN KE SISTEM'}
           </button>
        </div>

      </form>
    </div>
  )
}
