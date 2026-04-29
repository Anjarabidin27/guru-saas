import { cn } from '@/lib/utils'

const mapelData = [
  { mapel: 'Matematika', soal: 52, avg: 81.5, lulus: 88, bar: 88 },
  { mapel: 'Fisika', soal: 31, avg: 76.2, lulus: 72, bar: 72 },
  { mapel: 'Bahasa Indonesia', soal: 62, avg: 85.0, lulus: 92, bar: 92 },
  { mapel: 'Informatika', soal: 15, avg: 88.7, lulus: 95, bar: 95 },
  { mapel: 'Bahasa Inggris', soal: 39, avg: 74.1, lulus: 68, bar: 68 },
]

const kelasData = [
  { kelas: 'X-A', mapel: 'Matematika', siswa: 32, avg: 84.2, lulus: 28, icon: '🏆' },
  { kelas: 'XI-B', mapel: 'Fisika', siswa: 30, avg: 76.5, lulus: 22, icon: '📈' },
  { kelas: 'X-B', mapel: 'Bahasa Inggris', siswa: 33, avg: 72.1, lulus: 21, icon: '⚠️' },
  { kelas: 'XII-C', mapel: 'Ekonomi', siswa: 29, avg: 88.0, lulus: 28, icon: '🏆' },
]

export default function LaporanSekolahPage() {
  return (
    <div className="flex flex-col gap-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">📊 Laporan Evaluasi Sekolah</h1>
          <p className="text-slate-500 text-sm mt-1">Rekap performa seluruh guru dan kelas. Semester Genap 2025/2026.</p>
        </div>
        <button className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all text-sm flex items-center gap-2">
          📄 Export PDF Laporan
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Rata-rata Sekolah', val: '80.7', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: '📈' },
          { label: 'Tingkat Kelulusan', val: '83%', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', icon: '🎓' },
          { label: 'Total Data Nilai', val: '1,240', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100', icon: '📋' },
          { label: 'Mata Pelajaran', val: '12', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', icon: '📚' },
        ].map(c => (
          <div key={c.label} className={`bg-white border rounded-2xl p-5 shadow-sm ${c.bg}`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className={`text-2xl font-extrabold tracking-tight ${c.color}`}>{c.val}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Nilai per Mata Pelajaran */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-5">Nilai per Mata Pelajaran</h2>
          <div className="flex flex-col gap-5">
            {mapelData.map((m) => (
              <div key={m.mapel}>
                <div className="flex justify-between items-end mb-1.5">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{m.mapel}</p>
                    <p className="text-[10px] text-slate-400">{m.soal} soal · Rata-rata <span className={cn(
                      'font-black',
                      m.avg >= 80 ? 'text-emerald-600' : m.avg >= 75 ? 'text-orange-500' : 'text-red-500'
                    )}>{m.avg}</span></p>
                  </div>
                  <span className={cn(
                    'text-xs font-black',
                    m.lulus >= 80 ? 'text-emerald-600' : m.lulus >= 70 ? 'text-orange-500' : 'text-red-500'
                  )}>{m.lulus}% lulus</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-1000',
                      m.lulus >= 80 ? 'bg-emerald-500' : m.lulus >= 70 ? 'bg-orange-400' : 'bg-red-400'
                    )}
                    style={{ width: `${m.bar}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performa per Kelas */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Performa per Kelas</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {kelasData.map((k) => (
              <div key={k.kelas + k.mapel} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <span className="text-2xl">{k.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold">Kelas {k.kelas}</p>
                      <p className="text-xs text-slate-400">{k.mapel} · {k.siswa} siswa</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-lg font-extrabold leading-none',
                        k.avg >= 80 ? 'text-emerald-600' : k.avg >= 75 ? 'text-orange-500' : 'text-red-500'
                      )}>{k.avg}</p>
                      <p className="text-[10px] text-slate-400">{k.lulus}/{k.siswa} lulus</p>
                    </div>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-2">
                    <div
                      className={cn(
                        'h-full rounded-full',
                        k.avg >= 80 ? 'bg-emerald-500' : k.avg >= 75 ? 'bg-orange-400' : 'bg-red-400'
                      )}
                      style={{ width: `${(k.avg / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight for School Admin */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-6 text-white border border-blue-900/50 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex gap-4 items-start">
            <div className="text-3xl bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">🤖</div>
            <div>
              <h3 className="font-extrabold text-lg">Rekomendasi AI untuk Kepala Sekolah</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                <li>⚠️ Kelas X-B Bahasa Inggris: tingkat kelulusan terendah (68%). Rekomendasikan remedial.</li>
                <li>📈 Informatika memiliki rata-rata tertinggi. Pertimbangkan jadikan kelas percontohan.</li>
                <li>✅ Bahasa Indonesia konsisten di atas rata-rata sekolah selama 3 semester.</li>
              </ul>
            </div>
          </div>
          <button className="bg-blue-600 text-white font-black text-xs px-6 py-3 rounded-xl hover:bg-blue-500 transition-colors uppercase tracking-widest flex-shrink-0">
            Cetak Rekomendasi
          </button>
        </div>
      </div>
    </div>
  )
}
