'use client'

const mapelData = [
  { mapel: 'Matematika Terapan', soal: 48, status: 'MENCAPAI TARGET', pct: '85%' },
  { mapel: 'Fisika Kuantum', soal: 12, status: 'PENGAYAAN KURANG', pct: '22%' },
  { mapel: 'Kimia Dasar', soal: 7, status: 'KRITIS (KURANG SOAL)', pct: '13%' },
]

const weeklyData = [
  { day: 'Senin', tanggal: '12 Okt 2026', val: 3 },
  { day: 'Selasa', tanggal: '13 Okt 2026', val: 5 },
  { day: 'Rabu', tanggal: '14 Okt 2026', val: 2 },
  { day: 'Kamis', tanggal: '15 Okt 2026', val: 7 },
  { day: 'Jumat', tanggal: '16 Okt 2026', val: 4 },
  { day: 'Sabtu', tanggal: '17 Okt 2026', val: 1 },
  { day: 'Minggu', tanggal: '18 Okt 2026', val: 0 },
]

export default function LaporanPage() {
  return (
    <div className="flex flex-col gap-6 text-black pb-20">
      
      {/* Header Administratif Blok */}
      <div className="bg-white border border-slate-400 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h1 className="text-2xl font-bold text-black mb-1 uppercase">Sistem Rekapitulasi Laporan Kinerja</h1>
            <p className="text-base font-medium text-slate-800">Menyajikan akumulasi data riwayat pembuatan material ajar dan soal ujian.</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="flex flex-col">
               <label className="text-xs font-bold text-slate-800 uppercase mb-1">Periode Tarikan Data:</label>
               <select className="bg-white border border-slate-400 p-2 text-sm font-bold text-black outline-none w-48">
                 <option>MINGGU INI</option>
                 <option>SEMESTER GANJIL</option>
                 <option>TAHUN AJARAN 2025/2026</option>
               </select>
            </div>
            <button 
               className="bg-black text-white font-bold px-6 py-4 border border-black hover:bg-slate-800 transition-colors h-full flex flex-col items-center justify-center gap-1 mt-5"
               onClick={() => window.print()}
            >
               <span className="text-sm tracking-widest">[ CETAK DOKUMEN ]</span>
            </button>
         </div>
      </div>

      {/* Ringkasan Eksekutif - Flat Grid */}
      <div className="bg-white border border-slate-400 shadow-sm">
         <div className="bg-slate-200 border-b border-slate-400 px-6 py-3">
            <h2 className="text-sm font-bold text-black uppercase tracking-widest">A. Ringkasan Eksekutif Total (Berdasarkan Periode)</h2>
         </div>
         <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-400">
            {[
              { title: 'Total Naskah Soal Dibuat', val: '67', label: 'Item Tersimpan' },
              { title: 'Rata-rata Nilai Siswa', val: '82.4', label: 'Skor Mutlak' },
              { title: 'Modul Materi Diunggah', val: '24', label: 'Dokumen' },
              { title: 'Bank Soal Dibagikan', val: '12', label: 'Kepada Komunitas' },
            ].map(item => (
               <div key={item.title} className="p-6 flex flex-col items-center text-center hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-700 uppercase mb-2 h-8 flex items-end justify-center">{item.title}</span>
                  <span className="text-4xl font-extrabold text-black mb-1">{item.val}</span>
                  <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
         
         {/* Tabel Aktivitas Harian */}
         <div className="bg-white border border-slate-400 shadow-sm">
            <div className="bg-slate-200 border-b border-slate-400 px-6 py-3">
               <h2 className="text-sm font-bold text-black uppercase tracking-widest">B. Tabel Kuantitas Pembuatan Harian</h2>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-100 border-b border-slate-400">
                        <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase w-12 text-center">No</th>
                        <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase">Hari / Tanggal</th>
                        <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase text-center w-32">Kuantitas Soal</th>
                        <th className="p-3 text-sm font-bold text-black uppercase text-center w-32">Keterangan</th>
                     </tr>
                  </thead>
                  <tbody>
                     {weeklyData.map((d, i) => (
                        <tr key={i} className="border-b border-slate-400 hover:bg-slate-50">
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-slate-800">{i + 1}</td>
                           <td className="p-3 border-r border-slate-400 font-bold text-black">{d.day}, {d.tanggal}</td>
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-xl text-black">{d.val}</td>
                           <td className="p-3 text-center">
                              <span className={`text-xs font-bold uppercase py-1 px-2 border ${d.val > 0 ? 'bg-green-100 border-green-800 text-green-900' : 'bg-slate-100 border-slate-400 text-slate-600'}`}>
                                 {d.val > 0 ? 'PRODUKTIF' : 'NIHIL'}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Tabel Rasio Mata Pelajaran & Level Kesulitan */}
         <div className="flex flex-col gap-6">
            
            {/* Tabel Per Mapel */}
            <div className="bg-white border border-slate-400 shadow-sm flex-1">
               <div className="bg-slate-200 border-b border-slate-400 px-6 py-3">
                  <h2 className="text-sm font-bold text-black uppercase tracking-widest">C. Distribusi Kepadatan Mata Pelajaran</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-100 border-b border-slate-400">
                           <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase">Mata Pelajaran</th>
                           <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase text-center">Inventaris</th>
                           <th className="p-3 text-sm font-bold text-black uppercase text-center">Persentase & Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {mapelData.map((m, i) => (
                           <tr key={i} className="border-b border-slate-400 hover:bg-slate-50">
                              <td className="p-3 border-r border-slate-400 font-bold text-black">{m.mapel}</td>
                              <td className="p-3 border-r border-slate-400 text-center font-extrabold text-blue-900 text-lg">{m.soal} SOAL</td>
                              <td className="p-3 flex flex-col items-center">
                                 <div className="text-base font-extrabold text-black mb-1">{m.pct}</div>
                                 <div className={`text-[10px] font-bold border px-2 py-0.5 uppercase ${m.soal > 20 ? 'bg-green-200 border-green-900 text-green-900' : 'bg-red-200 border-red-900 text-red-900'}`}>
                                    {m.status}
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Tabel Distribusi Kesulitan Kognitif (Menggantikan SVG Melingkar) */}
            <div className="bg-white border border-slate-400 shadow-sm flex-1">
               <div className="bg-slate-200 border-b border-slate-400 px-6 py-3 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-black uppercase tracking-widest">D. Proporsi Ketajaman Logika (Level Kognitif)</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-100 border-b border-slate-400">
                           <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase text-center">Level Evaluasi</th>
                           <th className="p-3 border-r border-slate-400 text-sm font-bold text-black uppercase text-center">Volume</th>
                           <th className="p-3 text-sm font-bold text-black uppercase text-center">Status Pemenuhan Standar</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr className="border-b border-slate-400">
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-black">C1-C2 (LOTS)</td>
                           <td className="p-3 border-r border-slate-400 text-center font-extrabold text-black">23 SOAL (35%)</td>
                           <td className="p-3 text-center text-xs font-bold uppercase text-slate-800">KUOTA TERPENUHI</td>
                        </tr>
                        <tr className="border-b border-slate-400 bg-slate-50">
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-black">C3-C4 (MOTS)</td>
                           <td className="p-3 border-r border-slate-400 text-center font-extrabold text-black">28 SOAL (42%)</td>
                           <td className="p-3 text-center text-xs font-bold uppercase text-slate-800">MAYORITAS POPULASI</td>
                        </tr>
                        <tr className="border-b border-slate-400">
                           <td className="p-3 border-r border-slate-400 text-center font-bold text-black">C5-C6 (HOTS)</td>
                           <td className="p-3 border-r border-slate-400 text-center font-extrabold text-red-700">16 SOAL (23%)</td>
                           <td className="p-3 text-center font-bold">
                              <span className="text-[10px] bg-red-100 border border-red-800 text-red-900 px-2 py-1 uppercase">BELUM MENCAPAI TARGET 30%</span>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      </div>
      
    </div>
  )
}
