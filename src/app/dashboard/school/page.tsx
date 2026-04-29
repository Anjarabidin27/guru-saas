'use client'

const teacherStats = [
  { name: 'Sari Rahayu, S.Pd', mapel: 'Matematika Terapan', activity: 'MENYERAHKAN DOKUMEN', status: 'AKTIF' },
  { name: 'Drs. Budi Santoso', mapel: 'Fisika Kuantum', activity: 'UPDATE MEDIA BAHAN AJAR', status: 'AKTIF' },
  { name: 'Dra. Anita Wijaya', mapel: 'Bahasa Indonesia', activity: 'MENUTUP REKAP NILAI', status: 'CUTI' },
  { name: 'Dedi Kusuma, M.Si', mapel: 'Kimia Lanjutan', activity: 'MENGAKSES SISTEM', status: 'AKTIF' },
]

export default function SchoolAdminDashboard() {
  return (
    <div className="flex flex-col gap-6 text-black pb-20 max-w-5xl">

      {/* Header Panel Administrator Mutu */}
      <div className="bg-white border border-slate-400 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-black mb-1 uppercase">Panel Administrator Unit Sekolah</h1>
            <p className="text-base font-medium text-slate-800">
               Pusat Kendali Pengawasan Mutu: <strong>SMA NEGERI 1 CONTOH</strong> — Status Lisensi: LAKU KAPASITAS (GRATIS)
            </p>
         </div>
         <button className="bg-black text-white font-bold text-sm px-6 py-4 border border-black hover:bg-slate-800 transition-colors uppercase">
            [+] TINGKATKAN KAPASITAS SERVER
         </button>
      </div>

      {/* Data Laporan Server / Inventaris Guru */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-400 shadow-sm bg-white">
         <div className="p-6 border-r border-slate-400 flex flex-col justify-center items-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2">Total Tenaga Pendidik Aktif</span>
            <span className="text-4xl font-extrabold text-black mb-1">8 / 20</span>
            <span className="text-xs font-bold text-slate-500 uppercase">AKUN TERDAFTAR</span>
         </div>
         <div className="p-6 border-r border-slate-400 flex flex-col justify-center items-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2">Total Akumulasi Dokumen Soal</span>
            <span className="text-4xl font-extrabold text-black mb-1">452</span>
            <span className="text-xs font-bold text-slate-500 uppercase">ARSIP PENJAMIN MUTU</span>
         </div>
         <div className="p-6 flex flex-col justify-center items-center">
            <span className="text-sm font-bold text-slate-700 uppercase mb-2">Sisa Kuota Disk Server</span>
            <span className="text-4xl font-extrabold text-black mb-1">2.4 GB</span>
            <span className="text-xs font-bold text-slate-500 uppercase">DARI 10GB TERPASANG</span>
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

         {/* Tabel Audit Laporan Tenaga Pendidik */}
         <div className="bg-white border border-slate-400 shadow-sm">
            <div className="bg-slate-200 border-b border-slate-400 px-6 py-4 flex items-center justify-between">
               <h2 className="text-sm font-bold text-black uppercase tracking-widest">Tabel Pemantauan Aktivitas Pendidik</h2>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100 border-b border-slate-400 text-black uppercase text-sm font-bold">
                        <th className="p-3 border-r border-slate-400 text-center w-8">No</th>
                        <th className="p-3 border-r border-slate-400">Identitas Pegawai</th>
                        <th className="p-3 border-r border-slate-400 text-center">Jejak Log Akses</th>
                     </tr>
                  </thead>
                  <tbody>
                     {teacherStats.map((t, index) => (
                        <tr key={t.name} className="border-b border-slate-400 hover:bg-slate-50">
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-slate-800">{index + 1}</td>
                           <td className="p-3 border-r border-slate-400">
                              <div className="text-sm font-bold text-black">{t.name}</div>
                              <div className="text-xs font-bold text-slate-700 uppercase mt-0.5">{t.mapel}</div>
                           </td>
                           <td className="p-3 text-center">
                              <span className={`px-2 py-1 text-xs font-bold uppercase border ${t.activity.includes('MENYERAHKAN') ? 'bg-green-100 text-green-900 border-green-800' : 'bg-slate-100 text-slate-800 border-slate-500'}`}>
                                 {t.activity}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            <div className="bg-slate-100 p-4 border-t border-slate-400 text-center">
               <button className="bg-black text-white px-6 py-3 font-bold text-sm uppercase transition-colors hover:bg-slate-800">
                  BUKA PENGATURAN DATA GURU LENGKAP
               </button>
            </div>
         </div>

         {/* Tabel Laporan Audit Nilai Skolastik */}
         <div className="bg-white border border-slate-400 shadow-sm flex flex-col">
            <div className="bg-slate-800 border-b border-slate-900 px-6 py-4">
               <h2 className="text-sm font-bold text-white uppercase tracking-widest">Rapor Kinerja Akademik (Semua Wilayah)</h2>
            </div>
            <div className="p-0 flex-1">
               <table className="w-full text-left border-collapse">
                  <tbody>
                     <tr className="border-b border-slate-400">
                        <td className="p-6 text-sm font-bold text-slate-800 uppercase align-middle">Rata-Rata Nilai (Akumulasi Sekolah)</td>
                        <td className="p-6 text-center align-middle font-extrabold text-blue-900 text-3xl w-32 border-l border-slate-400">
                           82.4
                        </td>
                     </tr>
                     <tr className="border-b border-slate-400 bg-slate-50">
                        <td className="p-6 text-sm font-bold text-slate-800 uppercase align-middle">Rasio Soal Level Kognitif Tinggi (HOTS)</td>
                        <td className="p-6 text-center align-middle font-extrabold text-black text-2xl border-l border-slate-400">
                           32%
                        </td>
                     </tr>
                     <tr className="border-b border-slate-400">
                        <td className="p-6 text-sm font-bold text-slate-800 uppercase align-middle">Tingkat Penyerapan Kurikulum (Lulus KKM)</td>
                        <td className="p-6 text-center align-middle font-extrabold text-black text-2xl border-l border-slate-400">
                           78%
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
            <div className="bg-yellow-50 p-4 border-t border-slate-400 text-xs font-bold text-slate-800 text-center uppercase tracking-widest border-b-4 border-b-yellow-400">
               * Keterangan: Seluruh laporan terekap otomatis oleh server pusat.
            </div>
         </div>

      </div>
    </div>
  )
}
